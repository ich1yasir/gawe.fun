
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

import PropTypes from 'prop-types';
import Link from 'next/link';

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: theme.palette.common.white
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%'
}));

const StyledDiv = styled('div')(({ theme }) => ({
    margin: 'auto',
    width: '100%',
    maxWidth: '900px'
}));

const fabGreenStyle = {
    color: 'common.white',
    bgcolor: green[500],
    '&:hover': {
        bgcolor: green[600],
    },
    position: 'fixed',
    zIndex: 10001,
    right: { lg: 32, md: 24, xs: 16 },
    top: { lg: 3 },
    bottom: { md: 24, xs: 16 }
};

const StyledTitle = styled(Typography)(({ theme }) => ({
    color: '#0eac00',
    marginRight: '2rem',
    fontSize: 'xx-large',
    fontWeight: '900'
}));

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

const HadistAppBar = (props) => {
    return (
        <ElevationScroll {...props}>
            <StyledAppBar>
                <Toolbar>
                    <StyledDiv sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Link href="/">
                                <a >
                                    <StyledTitle >
                                        Hadist
                                    </StyledTitle>
                                </a>
                            </Link>
                        </Box>
                        <StyledForm onSubmit={props.handleSubmit}>
                            <Paper
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                            >
                                <Icon sx={{ m: '10px' }} >
                                    <LocalLibraryIcon />
                                </Icon>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Cari Referensi Tentang: Mendidik anak"
                                    inputProps={{ 'aria-label': 'Cari Referensi tentang' }}
                                    value={props.query}
                                    onChange={e => props.setQuery(e.target.value)}
                                />
                                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </StyledForm>
                    </StyledDiv>
                </Toolbar>
            </StyledAppBar>
        </ElevationScroll>
    )
}
export default HadistAppBar;