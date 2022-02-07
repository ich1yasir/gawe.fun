import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Router from "next/router";
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import firebase from 'firebase/compat/app';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import FirebaseAuth from '../FirebaseAuth';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { grey } from '@mui/material/colors';

function StepperCreateAntrian({ userInfo = null }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [company, setCompany] = React.useState(10);
    const [name, setName] = React.useState('');
    const [prefixCode, setPrefixCode] = React.useState('');
    const [numOfLine, setNumOfLine] = React.useState(1);
    const [numOfDay, setNumOfDays] = React.useState(1);
    const [publicAccess, setPublicAccess] = React.useState(true);

    const getPrefixTemp = (name_) => {
        if (name_){
            const dataI = name_.split(' ');
            const initial = ''
            dataI.forEach((v, i) => {
                initial += v.charAt(0).toUpperCase();
            })
            setPrefixCode(initial) 
        }
    }

    const [error, setError] = React.useState({});

    const saveToFirestore = (uid, isStart = false) => {
        const db = getFirestore()
        try {
            const docRef = addDoc(collection(db, "antrian"), {
                name: name,
                company: company,
                numOfLine: numOfLine,
                numOfDay: numOfDay,
                publicAccess: publicAccess,
                prefixCode: prefixCode,
                createdBy: uid,
                status: isStart ? 0 : 1 // 0 : Stoped,  1: Started
            });
            console.log("Document written with ID: ", docRef.id);
            Router.push({
                pathname: "/antrian/board"
            })
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

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
                saveToFirestore(authResult.user.uid);
            }
        },
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
    }


    const validateForm = () => {
        if (activeStep === 0 && name === '') {
            setError({ name: "Name is Required." })
            return false
        }
        if (activeStep === 0 && prefixCode === '') {
            setError({ prefixCode: "Prefix is Required." })
            return false
        }
        if (activeStep === 1) {
            var _error = {}
            if (numOfLine <= 0 || numOfLine > 5) {
                _error["numOfLine"] = "Line should between 1 and 5"
            }
            if (numOfDay <= 0 || numOfDay > 7) {
                _error["numOfDay"] = "Minimum 1 day and maximum 7 days"
            }
            if (_error.numOfLine || _error.numOfDay) {
                setError(_error)
                return false
            }
        }
        setError({})
        return true
    }

    const handleNext = () => {
        if (!validateForm()) {
            return
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const steps = [
        {
            label: 'Basic Information',
            description: `Fill basic info for antrian. nama antrian and type of organization`,
            component: (
                <Box sx={{ maxWidth: '25rem' }}>
                    <TextField
                        fullWidth
                        id="antrian-name"
                        label="Name*"
                        variant="outlined"
                        sx={{ marginY: '0.5rem' }}
                        value={name}
                        error={error.name}
                        helperText={error.name}
                        onBlur={() => validateForm()}
                        onChange={(event) =>{
                            getPrefixTemp(event.target.value)
                            setName(event.target.value)
                        }} />
                    <TextField
                        fullWidth
                        id="antrian-prefix"
                        label="Prefix*"
                        variant="outlined"
                        sx={{ marginY: '0.5rem' }}
                        value={prefixCode}
                        error={error.prefixCode}
                        helperText={error.prefixCode}
                        onBlur={() => validateForm()}
                        onChange={(event) => setPrefixCode(event.target.value)} />
                    
                    <Typography sx={{ marginY: '0.5rem' }} color={grey[600]}>Code : {prefixCode}-00XXXX</Typography>

                    <FormControl fullWidth sx={{ marginY: '0.5rem' }}>
                        <InputLabel id="label-company">Company Sector</InputLabel>
                        <Select
                            labelId="label-company"
                            id="company-sector"
                            fullWidth
                            label="Company Sector"
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
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
                    <TextField id="antrian-line"
                        type='Number'
                        fullWidth
                        label="Line of Antrian"
                        variant="outlined"
                        sx={{ marginY: '0.5rem' }}
                        value={numOfLine}
                        error={error.numOfLine}
                        helperText={error.numOfLine}
                        onBlur={() => validateForm()}
                        onChange={(event) => setNumOfLine(event.target.value)} />

                    <TextField
                        id="antrian-day"
                        type='Number'
                        fullWidth
                        label="Active for (days)"
                        variant="outlined"
                        sx={{ marginY: '0.5rem' }}
                        value={numOfDay}
                        error={error.numOfDay}
                        helperText={error.numOfDay}
                        onBlur={() => validateForm()}
                        onChange={(event) => setNumOfDays(event.target.value)} />

                    <FormControlLabel
                        control={
                            <Switch name="public"
                                checked={publicAccess}
                                onChange={(event) => setPublicAccess(event.target.checked)} />
                        }
                        label="Public Access"
                    />
                </Box>
            )
        },
        {
            label: "Last Touch",
            description: ``,
            component: (
                <Box sx={{ maxWidth: '25rem' }}>
                    {userInfo ? <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="contained" onClick={() => saveToFirestore(userInfo.id, false)}>SUBMIT</Button>
                        <Typography>or</Typography>
                        <Button variant="outlined" onClick={() => saveToFirestore(userInfo.id, true)}>SUBMIT AND START</Button>
                    </Box> : <FirebaseAuth config={firebaseAuthConfig} />}
                </Box>
            )
        },
    ];


    return (
        <Box boxShadow={20} sx={{ maxWidth: "50rem", marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255, 0.9)' }} width={{ xs: '90%', sm: '90%', md: '40rem' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">Last step!</Typography>
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
                                    {(index === steps.length - 1) || <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        hidden={index === steps.length - 1}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>}

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
export default StepperCreateAntrian;