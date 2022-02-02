import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';



export default function StepperCreateAntrian(props) {
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
                <Box sx={{ margin: '1rem' }}>
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
                <Box sx={{ margin: '1rem' }}>
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
            description: `Try out different ad text to see what brings in the most customers,
                  and learn how to enhance your ads using features like ad extensions.
                  If you run into any problems with your ads, find out how to tell if
                  they're running and how to resolve approval issues.`,
            component: (
                <Box>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                    <TextField id="filled-basic" label="Filled" variant="filled" />
                    <TextField id="standard-basic" label="Standard" variant="standard" />
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