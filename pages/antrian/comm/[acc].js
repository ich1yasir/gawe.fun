import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Grid, Link, TextField } from '@mui/material';
import { useRouter } from 'next/router'
import Router from "next/router";
import theme from '../../../components/theme';
import firebase from 'firebase/compat/app';
import { ThemeProvider } from '@mui/system';
// import SignInForm from '../../components/SignInForm';
import BackgroundAntrian from '../../../components/background/antrian';

import FirebaseAuth from '../../../components/FirebaseAuth';
import LoaderAntrian from '../../../components/loader';
import { getAcccesAntrian, submitAcccesAntrian } from '../../../utils/datalayer/DLAntrian'; import {
    useAuthUser
} from 'next-firebase-auth'
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { getListAntrian } from '../../../utils/datalayer/DLAntrian';

function LoginAccAntrian() {
    const AuthUser = useAuthUser()
    const router = useRouter()
    const { acc } = router.query
    const [dataAntrianMeta, setDataAntrianMeta] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState({});

    const validateForm = () => {
        if (name === '') {
            setError({ name: "Name is Required." })
            return false
        }
        setError({})
        return true
    }

    const appendToAntrian = () => {
        submitAcccesAntrian(acc, dataAntrianMeta.data.prefixCode, name, AuthUser).then((d) => {
            if (d == 0) {
                Router.push({
                    pathname: "/antrian/comm"
                })
            }
            console.log(d)
        })
    }

    React.useEffect(() => {
        if (acc.length != (20 + 36)) {
            Router.push({
                pathname: "/antrian/comm/not/found"
            })
        }
        if (AuthUser.id) {
            setName(AuthUser.displayName)
        }
        getAcccesAntrian(acc).then((res) => {
            if (res.status == 10) {
                setDataAntrianMeta(res);
                setLoading(false)
            } else {
                Router.push({
                    pathname: "/antrian/comm/not/found"
                })
            }
        })
    }, []);

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

                // Router.push({
                //     pathname: "/antrian/board"
                // })


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
            {loading ? <LoaderAntrian></LoaderAntrian> :
                <Box sx={{ minHeight: '100vh', height: '100vh' }}>
                    {AuthUser.id ?
                        <Grid container spacing={0}
                            alignItems="center"
                            sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                            justify="center" columns={12}>
                            <Grid item xs="auto" sx={{ minHeight: '100vh', height: '100vh' }}>
                                <Box sx={{ minHeight: '100vh', height: '100vh', paddingLeft: '2rem', display: 'flex', justifyContent: 'center', alignItems: "left", flexDirection: 'column' }} >
                                    <Box sx={{
                                        maxWidth: '25rem'
                                    }}>
                                        <Typography variant='h3' align="center">
                                            Submit <b>in</b> {dataAntrianMeta.data.name}
                                        </Typography>
                                        <Box height='2rem'>

                                        </Box>

                                        <TextField
                                            fullWidth
                                            id="antrian-name"
                                            label="Display Name *"
                                            variant="outlined"
                                            sx={{ marginY: '0.5rem' }}
                                            value={name}
                                            error={error.name}
                                            helperText={error.name}
                                            onBlur={() => validateForm()}
                                            onChange={(event) => {
                                                setName(event.target.value)
                                            }} />
                                        <Button variant="contained" onClick={() => appendToAntrian()}>SUBMIT</Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={0}
                            alignItems="center"
                            sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                            justify="center" columns={12}>
                            <Grid item xs="auto" sx={{ minHeight: '100vh', height: '100vh' }}>
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
                    }
                </Box>
            }
        </ThemeProvider>
    );
}
// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.RENDER,
    LoaderComponent: LoaderAntrian,
})(LoginAccAntrian)