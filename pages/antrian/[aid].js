import * as React from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import AntrianAppBar from '../../components/AppBar/AntrianAppBar';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { Box, Button, ButtonBase, ButtonGroup, Paper, ThemeProvider, Tooltip, Typography } from '@mui/material';
import theme from '../../components/theme';
import { getAntrian, getAntrianSubcribtion, openAntrian, closeAntrian, getWaitingList, getActiveList, getPassedList } from '../../utils/DLAntrian';
import COMPANY_LIST from '../../utils/companyTypeList';
import STATUS_ANTRIAN from '../../utils/statusAntrian';
import InputAntrianForm from '../../components/Form/InputAntrianForm';
import LoaderAntrian from '../../components/loader';
import QRCode from 'react-qr-code';
import TransferCard from '../../components/TransferCard';
import ActiveCard from '../../components/TransferCard/ActiveCard';
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});
const Antrian = () => {
    const router = useRouter()
    const [active, setActive] = React.useState([0, 1, 2]);
    const { aid } = router.query
    const [dataAntrian, setDataAntrian] = React.useState(null);
    const [waitingList, setWaitingList] = React.useState(null);
    const [activeList, setActiveList] = React.useState(null);
    const [passedList, setPassedList] = React.useState(null);
    var unSub = null;

    const onChangeAntrian = (docSnap) => {
        setDataAntrian(docSnap.data())
    }

    const loadData = () => {
        getAntrianSubcribtion(aid, onChangeAntrian).then((unsub) => {
            unSub = unsub
        })
        getWaitingList(aid).then((d) => {
            setWaitingList(d)
            console.log(d)
        })
        getActiveList(aid).then((d) => {
            setActiveList(d)
            console.log(d)
        })

        getPassedList(aid).then((d) => {
            setPassedList(d)
            console.log(d)
        })
    }

    const openAction = () => {
        openAntrian(aid)
    }

    const closeAction = () => {
        closeAntrian(aid)
    }


    React.useEffect(() => {
        console.log("subscribe: ", aid);
        loadData();
    }, []);

    React.useEffect(() => {
        return () => {
            if (unSub) {
                console.log("unsubscibe: ", aid);
                unSub();
            }
        };
    }, []);


    return (
        <ThemeProvider theme={theme}>
            {dataAntrian ? <>
                <AntrianAppBar></AntrianAppBar>
                <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                    <Paper sx={{
                        p: 2
                    }}>
                        <Grid container spacing={2} marginBottom={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <ButtonBase sx={{ width: 200 }}>
                                    {dataAntrian.accessCode ?
                                        <QRCode value={dataAntrian.accessCode} size={200}></QRCode>
                                        :
                                        <Img alt="complex" src="/ticket-icon.svg" />}
                                </ButtonBase>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginY: '1rem'
                                    }}
                                >
                                    {
                                        dataAntrian.status == 1 ? <Button onClick={closeAction} variant="outlined">CLOSE ANTRIAN</Button> :
                                            <Button onClick={openAction} variant="outlined">OPEN ANTRIAN</Button>
                                    }
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs sx={{ paddingRight: '1rem' }}>
                                        <InputAntrianForm
                                            TYPE={0}
                                            VAL={dataAntrian.name}
                                            ID='name'
                                            LAB='Name'
                                            MAP='name'
                                            AID={aid}
                                            REQ={true} />
                                        <InputAntrianForm
                                            TYPE={0}
                                            VAL={dataAntrian.prefixCode}
                                            ID='prefixCode'
                                            LAB='Prefix Code'
                                            MAP='prefixCode'
                                            AID={aid}
                                            REQ={true} />
                                        <Typography variant="body2" textAlign='start' color="text.secondary">
                                            CODE: {dataAntrian.prefixCode || 'ANTRI'}-00XXXX
                                        </Typography>

                                        <InputAntrianForm
                                            TYPE={1}
                                            VAL={dataAntrian.company}
                                            ID='company'
                                            LAB='Company'
                                            MAP='company'
                                            AID={aid}
                                            REQ={true}
                                            OPTIONS={COMPANY_LIST} />

                                        <Typography variant="body2" textAlign='start' color="text.secondary">
                                            STATUS: {STATUS_ANTRIAN[dataAntrian.status] || 'Close'}
                                        </Typography>
                                        <Typography variant="body2" textAlign='start' color="text.secondary">
                                            Access Code : {dataAntrian.accessCode}
                                        </Typography>

                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12} md={3}>
                                {waitingList && <ActiveCard items={waitingList} title="Active" />}
                            </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {waitingList && passedList && <TransferCard waitingList={waitingList} passedList={passedList}  />}
                                
                            </Grid>

                        </Grid>
                    </Paper>
                </Container>

            </> :
                <LoaderAntrian></LoaderAntrian>

            }
        </ThemeProvider>
    );
}

// export default Antrian


// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
    authPageURL: '/antrian',
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Antrian)