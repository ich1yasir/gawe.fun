import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import Router from "next/router";
import theme from '../../../components/theme';
import firebase from 'firebase/compat/app';
import { ThemeProvider } from '@mui/system';
// import SignInForm from '../../components/SignInForm';
import BackgroundAntrian from '../../../components/background/antrian';

import { AuthAction, withAuthUser } from 'next-firebase-auth';
import FirebaseAuth from '../../../components/FirebaseAuth';
import LoaderAntrian from '../../../components/loader';

function LoginAntrian() {
    var firebaseAuthConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                // console.log(authResult)
                // console.log(redirectUrl)

                Router.push({
                    pathname: "/antrian/board"
                })
            }
        },
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
    }
    return (
        <ThemeProvider theme={theme}>
            <BackgroundAntrian />
            <Box sx={{ minHeight: '100vh', height: '100vh' }}>
                <Grid container spacing={0}
                    alignItems="center"
                    sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                    justify="center" columns={12}>
                    <Grid xs="auto" sx={{ minHeight: '100vh', height: '100vh' }}>
                        <Box sx={{ minHeight: '100vh', height: '100vh', paddingLeft: '2rem', display: 'flex', justifyContent: 'center', alignItems: "left", flexDirection: 'column' }} >
                            <Box sx={{
                                maxWidth: '25rem'
                            }}>
                                <Typography variant='h3' align="center">
                                    Sign <b>in</b>
                                </Typography>
                                <Box height='2rem'>

                                </Box>
                                <FirebaseAuth config={firebaseAuthConfig} />
                            </Box>
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
    whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
    LoaderComponent: LoaderAntrian,
})(LoginAntrian)