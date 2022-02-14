import * as React from 'react';
import Grid from '@mui/material/Grid';
import ActiveCard from './ActiveCard';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}


export default function TransferCard({ waitingList, passedList }) {

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
                <ActiveCard title='Antri' items={waitingList} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <ActiveCard title='Passed' items={passedList} />
            </Grid>
        </Grid>
    );
}
