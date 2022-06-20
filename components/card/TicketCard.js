import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import { Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { More } from '@mui/icons-material';
import Link from 'next/link';
import STATUS_ANTRIAN from '../../utils/statusAntrian';
import Router from 'next/router';
import COMPANY_LIST from '../../utils/companyTypeList';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const settings = ['Open', 'Close', 'Delete'];

export default function TicketCard({ ticket }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <ButtonBase sx={{ width: '100%' }}>
            <Paper sx={{
                width: '100%',
                p: 2
            }} elevation={5}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column">
                            <Grid item xs>
                                <Typography textAlign='start' variant="h5" component="div">
                                    {ticket.data.antName}
                                </Typography>
                                <Typography color='primary' textAlign='start' variant="h5" component="div">
                                    {ticket.data.codeAnt} - {ticket.data.displayName}
                                </Typography>
                                <Typography variant="body2" textAlign='start'>
                                joined at: {ticket.data.joined.toDate().getUTCHours()}: {ticket.data.joined.toDate().getUTCMinutes()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </ButtonBase>

    );
}
