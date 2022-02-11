import * as React from 'react';
import Box from '@mui/material/Box';
import { FormControl, Select, TextField, MenuItem, InputLabel } from '@mui/material';
import { updateAntrian } from '../../utils/DLAntrian';


function InputAntrianForm(props) {
    const { VAL, ID, LAB, MAP, AID, REQ = false, OPTIONS = null, TYPE = 0 } = props;
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
            {
                (TYPE == 1 || OPTIONS) &&
                <FormControl fullWidth 
                    sx={{ marginY: '0.5rem' }}
                    variant="standard">
                    <InputLabel id="label-company">{LAB + (REQ ? '*' : '')}</InputLabel>
                    <Select
                        labelId={ID}
                        id={ID}
                        label={LAB + (REQ ? '*' : '')}
                        fullWidth
                        value={valueForm}
                        error={error[ID]}
                        helperText={error[ID]}
                        onChange={(event) => setValueForm(event.target.value)}
                        onBlur={() => validateForm()}
                    >
                        {
                            Object.keys(OPTIONS).map((key, index) => ( 
                                <MenuItem key={index} value={key}>{OPTIONS[key]}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            }
            {
                //Type text input
                TYPE == 0 && 
                <TextField
                    fullWidth
                    id={ID}
                    label={LAB + (REQ ? '*' : '')}
                    variant="standard"
                    sx={{ marginY: '0.5rem' }}
                    value={valueForm}
                    error={error[ID]}
                    helperText={error[ID]}
                    onBlur={() => validateForm()}
                    onChange={(event) => setValueForm(event.target.value)} />
            }

            {/* <Typography sx={{ marginY: '0.5rem' }} color={grey[600]}>Code : {prefixCode}-00XXXX</Typography>

             */}
        </Box>
    );
}
export default InputAntrianForm;