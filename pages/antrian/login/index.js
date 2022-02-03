import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Divider, Grid } from '@mui/material';
import theme from '../../theme';
import { ThemeProvider } from '@mui/system';
import SignInForm from '../../../components/SignInForm';
// import StepperCreateAntrian from '../../components/StepperCreateAntrian';



export default function LoginCenter() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', height: '100vh' }}>
                <Grid container spacing={0}
                    alignItems="center"
                    sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                    justify="center" columns={12}>
                    <Grid  xs={12} sx={{ minHeight: '100vh', height: '100vh' }}>
                        <Box sx={{ minHeight: '100vh', height: '100vh', padding: '1rem', marginY: 0, display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column' }} boxShadow={10}  >
                            <Typography variant="h3">
                                Sign In
                            </Typography>
                            <SignInForm />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}