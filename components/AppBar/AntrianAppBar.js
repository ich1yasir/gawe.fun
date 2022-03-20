
import * as React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import Router from "next/router";
import { ButtonBase } from '@mui/material';
import { useRouter } from 'next/router'


import {
    useAuthUser
} from 'next-firebase-auth'

const pages = [
    {
        label: 'Create New',
        directUrl: "/antrian/create"
    },
    {
        label: 'Monitoring',
        directUrl: "/antrian/board"
    },
    {
        label: 'Setting',
        directUrl: "/antrian/board"
    }];


const AntrianAppBar = () => {
    const AuthUser = useAuthUser()
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const title = "ANTRIAN"

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (url = null) => {
        setAnchorElNav(null);
    };
    const settings = [
    { 
        label: 'Logout',
        action: () => {
            AuthUser.signOut()
        }
    }];
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <AppBar position="sticky">
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
                            {pages.map((page, i) => (
                                <MenuItem
                                    key={i}
                                    onClick={handleCloseNavMenu}
                                >
                                    <Link href={page.directUrl}>
                                        <a>
                                            <Typography
                                                textAlign="center"
                                            >
                                                {page.label}
                                            </Typography>
                                        </a>
                                    </Link>
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
                        {pages.map((page, i) => (
                            <Button
                                key={i}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link href={page.directUrl}>
                                    <a>
                                        <Typography
                                            textAlign="center"
                                        >
                                            {page.label}
                                        </Typography>
                                    </a>
                                </Link>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={AuthUser.displayName} src={AuthUser.photoURL} />
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
                                <MenuItem key={setting} onClick={() => {
                                    handleCloseUserMenu()
                                    setting.action()
                                }}>
                                    <Typography textAlign="center">{setting.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default AntrianAppBar;