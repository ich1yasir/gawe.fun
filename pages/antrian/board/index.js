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
import { getListAntrian, getListTicket } from '../../../utils/datalayer/DLAntrian';
// import NotificationSnackBar from '../../../components/SnackBar/NotificationSnackBar';
import LoaderAntrian from '../../../components/loader';
import TicketCard from '../../../components/card/TicketCard';


const BoardAppBar = () => {

    const AuthUser = useAuthUser()
    const [dataAntrian, setDataAntrian] = React.useState([]);
    const [dataTicket, setDataTicket] = React.useState([]);
    const [loadingAntrian, setLoadingAntrian] = React.useState(true);
    const [loadingTicket, setLoadingTicket] = React.useState(true);
    const totStep = 2;
    const loadData = () => {
        getListAntrian(AuthUser.id).then((items) => {
            console.log("antriiiiaan")
            setDataAntrian(items)
            setLoadingAntrian(false)
        });
        getListTicket(AuthUser.id).then((items) => {
            console.log("tickeeet")
            setDataTicket(items)
            setLoadingTicket(false)
        });
    }

    const ListCardTicket = ({ ticket }) => {
        return (<Grid item xs={12} sm={12} md={3} key={ticket.id}>
            <TicketCard ticket={ticket} />
        </Grid>)
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
            {loadingAntrian && loadingTicket ?
                <LoaderAntrian></LoaderAntrian>
                :
                <SnackbarProvider maxSnack={3}>
                    <AntrianAppBar></AntrianAppBar>
                    <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                        <Grid container spacing={2} >
                            {dataTicket && dataTicket.map(function (ticket, i) {
                                return <ListCardTicket ticket={ticket} key={ticket.id} />
                            })}
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
                </SnackbarProvider>}
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