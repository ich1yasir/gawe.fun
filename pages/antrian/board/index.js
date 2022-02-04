import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ButtonBase, ThemeProvider } from '@mui/material';
import theme from '../../../components/theme';
import Link from 'next/link';
import AntrianCard from '../../../components/card/AntrianCard';

const pages = ['Create New', 'Monitoring', 'Setting'];
const settings = ['Profile', 'Logout'];

const BoardAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const title = "ANTRIAN"

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Container maxWidth='100hv'>
                    <Toolbar disableGutters>
                        <Box
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            <ButtonBase sx={{ paddingY: '15px', paddingX: '25px' }}>
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="div"
                                >
                                    <Link href={'/antrian/board'}>
                                        <a>
                                            {title}
                                        </a>
                                    </Link>
                                </Typography>
                            </ButtonBase>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            <ButtonBase sx={{ paddingY: '15px', paddingX: '25px' }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                >
                                    <Link href={'/antrian/board'}>
                                        <a>
                                            {title}
                                        </a>
                                    </Link>
                                </Typography>
                            </ButtonBase>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                <Grid container spacing={2} >
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={6}>
                        <AntrianCard></AntrianCard>
                    </Grid>
                    <Grid item  xs={12}>
                        <Button>
                            Load More
                        </Button>
                    </Grid>
                </Grid>

            </Container>
        </ThemeProvider>
    );
};
export default BoardAppBar;
