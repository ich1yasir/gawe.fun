import * as React from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AntrianAppBar from '../../components/AppBar/AntrianAppBar';
import {
    useAuthUser
} from 'next-firebase-auth'
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
import { More } from '@mui/icons-material';
import InputAntrianForm from '../../components/Form/InputAntrianForm';
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});
const Antrian = () => {
    const router = useRouter()
    const { aid } = router.query
    const [dataAntrian, setDataAntrian] = React.useState({});
    const [unSub, setUnsub] = React.useState(null);

    const onChangeAntrian = (docSnap) => {
        console.log("data Mass")
        setDataAntrian(docSnap.data())
    }

    const loadData = () => {
        console.log("masuk " + aid)
        getAntrianSubcribtion(aid, onChangeAntrian).then((unsub) => {
            console.log("masuk " + aid)
            setUnsub(unsub)
        })
    }

    React.useEffect(
        () => {
            loadData();
        },[]
    );

    React.useEffect(() => {
        return () => {
            if (unsub) {
                unsub();
            }
        };
    }, []);


    return (
        <ThemeProvider theme={theme}>
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

                                    {dataAntrian.name && <InputAntrianForm VAL={dataAntrian.name} ID='name' LAB='Name' />}
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