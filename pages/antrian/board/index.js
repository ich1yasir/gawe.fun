import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {ThemeProvider } from '@mui/material';
import theme from '../../../components/theme';
import AntrianCard from '../../../components/card/AntrianCard';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import AntrianAppBar from '../../../components/AppBar/AntrianAppBar';


const BoardAppBar = () => {
    return (
        <ThemeProvider theme={theme}>
            <AntrianAppBar></AntrianAppBar>
            <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
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
})(BoardAppBar)
