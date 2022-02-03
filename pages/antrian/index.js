import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Divider, Grid, Link } from '@mui/material';
import theme from '../theme';
import { ThemeProvider } from '@mui/system';
// import SignInForm from '../../components/SignInForm';
import StepperCreateAntrian from '../../components/StepperCreateAntrian';



export default function VerticalLinearStepper() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', height: '100vh' }}>
                <Grid container spacing={0}
                    alignItems="center"
                    sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                    justify="center" columns={12}>
{/* 
                    <Grid xs={12} sm={12} md={12} lg={4} xl={3} sx={{ minHeight: '100vh', height: '100vh' }}>
                        <Box sx={{ minHeight: '100vh', height: '100vh', padding: '1rem', marginY: 0, display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column' }} boxShadow={10}  >

                            <Typography variant="h3">
                                Sign In
                            </Typography>
                            <SignInForm />
                        </Box>
                    </Grid> */}
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