import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { blue, orange, red } from '@mui/material/colors';
import FirebaseAuth from '../FirebaseAuth';
import { AuthAction, withAuthUser } from 'next-firebase-auth';



function StepperCreateAntrian(props) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [company, setCompany] = React.useState('');

    const handleChangeCompany = (event) => {
        setCompany(event.target.value);
    };
    const steps = [
        {
            label: 'Name of Antrian',
            description: `Fill basic info for antrian. nama antrian and type of organization`,
            component: (
                <Box sx={{ maxWidth: '25rem' }}>
                    <TextField id="antrian-name" fullWidth label="Name" variant="outlined" sx={{ marginY: '0.5rem' }} />
                    <FormControl fullWidth sx={{ marginY: '0.5rem' }}>
                        <InputLabel id="label-company">Company Sector</InputLabel>
                        <Select
                            labelId="label-company"
                            id="company-sector"
                            value={company}
                            fullWidth
                            label="Company Sector"
                            onChange={handleChangeCompany}
                        >
                            <MenuItem value={10}>Banking</MenuItem>
                            <MenuItem value={20}>Finance</MenuItem>
                            <MenuItem value={30}>Retail</MenuItem>
                            <MenuItem value={40}>Industrial</MenuItem>
                            <MenuItem value={50}>Restaurant</MenuItem>
                            <MenuItem value={60}>Workshop</MenuItem>
                            <MenuItem value={70}>Healthcare</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )
        },
        {
            label: 'Set up',
            description: 'Create as public or private Antrian, how many line.',
            component: (
                <Box sx={{ maxWidth: '25rem' }}>
                    <TextField id="antrian-line" type='Number' fullWidth label="Line of Antrian" variant="outlined" sx={{ marginY: '0.5rem' }} />
                    <TextField id="antrian-line" type='Number' fullWidth label="Active for (days)" variant="outlined" sx={{ marginY: '0.5rem' }} />
                    <FormControlLabel
                        control={
                            <Switch name="public" defaultChecked />
                        }
                        label="Public Access"
                    />
                </Box>
            )
        },
        {
            label: "Let me know who you're",
            description: ``,
            component: (
                <Box sx={{ maxWidth: '25rem' }}>
                    <FirebaseAuth/>
                    {/* <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid container spacing={0} sx={{ maxWidth: '12rem' }}>
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant='h5'><b>
                                    Or.</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <IconButton size="large">
                                    <GoogleIcon sx={{ fontSize: 40, color: orange[800] }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={4}  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <IconButton size="large">
                                    <FacebookIcon sx={{ fontSize: 40, color: blue[500] }} />
                                </IconButton>
                            </Grid>
                        </Grid>

                    </Box> */}
                </Box>
            )
        },
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ maxWidth: "50rem", marginLeft: '1rem', marginTop: '4rem' }} width={{ xs: '90%', sm: '90%', md: '40rem' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography>{step.description}</Typography>
                            {step.component}
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
  })(StepperCreateAntrian)