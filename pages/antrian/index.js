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
            <Box sx={{ minHeight: '100vh', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column'}}>
                <Grid container spacing={0}
                    alignItems="center"
                    sx={{margin: 'auto'}}
                    justify="center" columns={{ xs: 6, sm: 12, md: 12 }}>
                    <Grid xs={6} sm={6} md={9} >
                        <Box sx={{ margin: 'auto', paddingLeft: '2rem' }} >
                            <Typography variant='h3' align="left">
                                Create Antrian
                            </Typography>
                            <StepperCreateAntrian />
                        </Box>
                    </Grid>
                    <Grid xs={6} sm={6} md={3}>
                        <Box sx={{ padding: '1rem', marginY: 0, backgroundColor: grey[200] }} boxShadow={10}  >
                            <SignInForm />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}