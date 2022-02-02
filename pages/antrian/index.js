import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Divider, Grid } from '@mui/material';
import theme from '../theme';
import { ThemeProvider } from '@mui/system';
import SignInForm from '../../components/SignInForm';
import StepperCreateAntrian from '../../components/StepperCreateAntrian';
import { grey } from '@mui/material/colors';



export default function VerticalLinearStepper() {

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', height: '100vh' }}>
                <Grid container spacing={0}
                    alignItems="center"
                    sx={{ margin: 'auto', minHeight: '100vh', height: '100vh' }}
                    justify="center" columns={{ xs: 6, sm: 12, md: 12 }}>

                    <Grid xs={6} sm={6} md={3} sx={{ minHeight: '100vh', height: '100vh' }}>
                        <Box sx={{ minHeight: '100vh', height: '100vh', padding: '1rem', marginY: 0, display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column' }} boxShadow={10}  >

                            <Typography variant="h3">
                                Sign in
                            </Typography>
                            <SignInForm />
                        </Box>
                    </Grid>
                    <Grid xs={6} sm={6} md={9} sx={{ minHeight: '100vh', height: '100vh' }}>
                        <Box sx={{ minHeight: '100vh', height: '100vh', paddingLeft: '2rem', display: 'flex', justifyContent: 'center', alignItems: "left", flexDirection: 'column' }} >
                            <Typography variant='h3' align="left">
                                Create Antrian
                            </Typography>
                            <StepperCreateAntrian />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}