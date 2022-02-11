import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material';
import theme from '../../../components/theme';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import AntrianAppBar from '../../../components/AppBar/AntrianAppBar';
import {
    useAuthUser
} from 'next-firebase-auth'
import StepperCreateAntrian from '../../../components/StepperCreateAntrian';


const CreateAntrian = () => {
    const AuthUser = useAuthUser()
    React.useEffect(() => {
        
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AntrianAppBar></AntrianAppBar>
            <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                <Grid container spacing={2} >
                    <Grid item xs>
                    </Grid>
                    <Grid item xs={6}>
                        <StepperCreateAntrian userInfo={AuthUser}/>
                    </Grid>
                    <Grid item xs>
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
})(CreateAntrian)
