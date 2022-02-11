import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import theme from '../../components/theme';
import { ThemeProvider } from '@mui/system';
// import SignInForm from '../../components/SignInForm';
import StepperCreateAntrian from '../../components/StepperCreateAntrian';
import BackgroundAntrian from '../../components/background/antrian';

import { AuthAction, withAuthUser } from 'next-firebase-auth';
import LoaderAntrian from '../../components/loader';

function IndexAntrian() {
    return (
        <ThemeProvider theme={theme}>
            <BackgroundAntrian/>
            <Box sx={{ minHeight: '100vh', height: '100vh' }}>
                <Grid container spacing={0}
                    alignItems="center"
                    sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                    justify="center" columns={12}>
                    <Grid xs="auto" sx={{ minHeight: '100vh', height: '100vh' }}>
                        <Box sx={{ minHeight: '100vh', height: '100vh', paddingLeft: '2rem', display: 'flex', justifyContent: 'center', alignItems: "left", flexDirection: 'column' }} >
                            <Typography variant='h3' align="left">
                                Create <b>Antrian</b>
                            </Typography>
                            <Typography variant='h4' >
                                <i>or</i> <b><Link href='/antrian/login'><a>Login</a></Link></b>
                            </Typography>
                            <StepperCreateAntrian />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default withAuthUser({
    appPageURL: '/antrian/board',
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.RENDER,
    LoaderComponent: LoaderAntrian,
})(IndexAntrian)