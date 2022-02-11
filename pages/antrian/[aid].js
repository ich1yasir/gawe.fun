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
import { ButtonBase, Paper, ThemeProvider, Tooltip, Typography } from '@mui/material';
import theme from '../../components/theme';
import { getAntrian, getAntrianSubcribtion } from '../../utils/DLAntrian';
import COMPANY_LIST from '../../utils/companyTypeList';
import STATUS_ANTRIAN from '../../utils/statusAntrian';
import InputAntrianForm from '../../components/Form/InputAntrianForm';
import LoaderAntrian from '../../components/loader';
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});
const Antrian = () => {
    const router = useRouter()
    const { aid } = router.query
    const [dataAntrian, setDataAntrian] = React.useState(null);
    var unSub = null;

    const onChangeAntrian = (docSnap) => {
        setDataAntrian(docSnap.data())
    }

    const loadData = () => {
        getAntrianSubcribtion(aid, onChangeAntrian).then((unsub) => {
            unSub = unsub
        })
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
                    }} elevation={5}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <ButtonBase sx={{ width: 300 }}>
                                    <Img alt="complex" src="/ticket-icon.svg" />
                                </ButtonBase>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs sx={{ paddingRight: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'flex-start' }}>
                                        {dataAntrian.name &&
                                            <InputAntrianForm
                                                VAL={dataAntrian.name}
                                                ID='name'
                                                LAB='Name'
                                                MAP='name'
                                                AID={aid}
                                                REQ={true} />}
                                        <Typography variant="body2" textAlign='start'>
                                            ({COMPANY_LIST[dataAntrian.company] || '-'}) - {dataAntrian.alamat}
                                        </Typography>
                                        <Typography variant="body2" textAlign='start' color="text.secondary">
                                            CODE: {dataAntrian.prefixCode || 'ANTRI'}-00XXXX
                                        </Typography>
                                        <Typography variant="body2" textAlign='start' color="text.secondary">
                                            STATUS: {STATUS_ANTRIAN[dataAntrian.status] || 'Close'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                </Grid>
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