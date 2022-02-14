import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material';
import theme from '../../../components/theme';
import AntrianCard from '../../../components/card/AntrianCard';

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


const BoardCommDash = () => {
    const AuthUser = useAuthUser()
    const [dataAntrian, setDataAntrian] = React.useState([]);
    const  loadData = () =>  {
        getListAntrian(AuthUser.id).then((listAntrian) => {
            setDataAntrian(listAntrian)
        });
    }

    const ListCardAntrian = ({ antrian }) => {
        return (<Grid item xs={12} sm={12} md={6} key={antrian.id}>
            <AntrianCard antrian={antrian}/>
        </Grid>)
    }

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AntrianAppBar></AntrianAppBar>
            <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                <Grid container spacing={2} >
                    {dataAntrian && dataAntrian.map(function (antrian, i) {
                        return <ListCardAntrian antrian={antrian} key={antrian.id}/>
                    })}
                    <Grid item xs={12}>
                        <Button>
                            Load More
                        </Button>
                    </Grid>
                </Grid>

            </Container>
        </ThemeProvider>
    );
};


// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
    authPageURL: '/antrian',
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(BoardCommDash)