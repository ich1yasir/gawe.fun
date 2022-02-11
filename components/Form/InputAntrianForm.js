import * as React from 'react';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import { updateAntrian } from '../../utils/DLAntrian';


function InputAntrianForm(props) {
    const { VAL, ID, LAB, MAP, AID, REQ=false } = props;
    const [valueForm, setValueForm] = React.useState('');
    const [modeEditForm, setModeEdit] = React.useState(false);
    const [error, setError] = React.useState({});

    const updateFirestore = () => {
        updateAntrian(AID, MAP, valueForm)
    }

    const validateForm = () => {
        var error_ = {}
        var isValid = true
        if (REQ && valueForm === '') {
            error_[ID] = ID + " is Required."
            setError(error_)
            isValid = false
        }
        setError(error_)
        if (isValid) {
            updateFirestore()
        }
        return isValid
    }
    React.useEffect(() => {
        setValueForm(VAL)
    }, [VAL]);


    return (
        <Box sx={{ maxWidth: "50rem", backgroundColor: 'rgba(255,255,255, 0.9)' }} width={{ xs: '90%', sm: '90%', md: '40rem' }}>
            <TextField
                fullWidth
                id={ID}
                label={LAB+ (REQ ? '*': '')}
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