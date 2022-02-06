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

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const settings = ['Open', 'Close', 'Delete'];
export default function AntrianCard() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <Paper sx={{
            p: 2
        }} elevation={5}>
            <Grid container spacing={2}>
                <Grid item>
                    <ButtonBase sx={{ width: 100, height: 100 }}>
                        <Img alt="complex" src="/ticket-icon.svg" />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <ButtonBase width='100%' sx={{ paddingRight: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems:'flex-start'}}>
                                <Typography color='primary' textAlign='start' variant="h5" component="div">
                                    Teller 1 BCA Mangga dua
                                </Typography>
                                <Typography variant="body2" textAlign='start'>
                                    (BANK) - Mangga Dua Block 10E, Jakarta selatan, DKI Jakarta
                                </Typography>
                                <Typography variant="body2" textAlign='start' color="text.secondary">
                                    CODE: TBCA0000XX
                                </Typography>
                                <Typography variant="body2" textAlign='start' color="text.secondary">
                                    STATUS: Close
                                </Typography>
                            </ButtonBase>
                        </Grid>
                        {/* <Grid item>
                            <Button>
                                <Typography fontWeight='bold' variant="body2">
                                    get direction
                                </Typography>
                            </Button>
                        </Grid> */}
                    </Grid>
                    <Grid item>
                        <Tooltip title="Open settings">
                            <IconButton sx={{ p: '5px' }} onClick={handleOpenUserMenu}>
                                <More />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
