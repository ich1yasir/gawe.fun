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

function InputAntrianForm(props) {

    const { VAL, ID, LAB } = props;
    const [valueForm, setValueForm] = React.useState('');
    const [modeEditForm, setModeEdit] = React.useState(false);
    const [error, setError] = React.useState({});
    const validateForm = () => {
        var error_ = {}
        if (valueForm === '') {
            error_[ID] = ID + " is Required."
            setError(error_)
            return false
        }
        setError(error_)
        return true
    }

    React.useEffect(() => {
        setValueForm(VAL)
    }, []);


    return (
        <Box sx={{ maxWidth: "50rem", marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255, 0.9)' }} width={{ xs: '90%', sm: '90%', md: '40rem' }}>
            <TextField
                fullWidth
                id={ID}
                label={LAB}
                variant="standard"
                sx={{ marginY: '0.5rem' }}
                value={valueForm}
                error={error[ID]}
                helperText={error[ID]}
                onBlur={() => validateForm()}
                onChange={(event) => setValueForm(event.target.value)} />

            {/* <Typography sx={{ marginY: '0.5rem' }} color={grey[600]}>Code : {prefixCode}-00XXXX</Typography>

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
            </FormControl> */}
        </Box>
    );
}
export default InputAntrianForm;