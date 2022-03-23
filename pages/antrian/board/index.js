import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material';
import theme from '../../../components/theme';
import AntrianCard from '../../../components/card/AntrianCard';
import { SnackbarProvider } from 'notistack';

import AntrianAppBar from '../../../components/AppBar/AntrianAppBar';
import {
    useAuthUser
} from 'next-firebase-auth'
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { getListAntrian } from '../../../utils/DLAntrian';
import NotificationSnackBar from '../../../components/SnackBar/NotificationSnackBar';
import LoaderAntrian from '../../../components/loader';


const BoardAppBar = () => {

    const AuthUser = useAuthUser()
    const [dataAntrian, setDataAntrian] = React.useState([]);
    const [loadingStep, setLoadingStep] = React.useState(0);
    const totStep = 1;
    const loadData = () => {
        getListAntrian(AuthUser.id).then((listAntrian) => {
            setDataAntrian(listAntrian)
            setLoadingStep(loadingStep+1)
        });
    }

    const ListCardAntrian = ({ antrian }) => {
        return (<Grid item xs={12} sm={12} md={6} key={antrian.id}>
            <AntrianCard antrian={antrian} />
        </Grid>)
    }

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            { loadingStep === totStep ?
            <SnackbarProvider maxSnack={3}>
                <AntrianAppBar></AntrianAppBar>
                <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                    <Grid container spacing={2} >
                        {dataAntrian && dataAntrian.map(function (antrian, i) {
                            return <ListCardAntrian antrian={antrian} key={antrian.id} />
                        })}
                        <Grid item xs={12}>
                            <Button>
                                Load More
                            </Button>
                        </Grid>
                    </Grid>

                </Container>
            </SnackbarProvider>
            :
            <LoaderAntrian></LoaderAntrian>}
        </ThemeProvider>
        
        
    );
};


// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
    authPageURL: '/antrian',
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    LoaderComponent: LoaderAntrian,
})(BoardAppBar)