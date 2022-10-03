import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import UsahaAppBar from "../../components/Usaha/UsahaAppBar";
import { VariableDrawerWidth } from '../../../utils/variableGlobal';
import { ThemeProvider } from '@mui/material';
import themeUsaha from '../_theme';
import UsahaAppBar from '../../../components/Usaha/UsahaAppBar';

import PaperItem from '../../../components/PaperItem';
import UsahaComponentList from '../../../components/Usaha/UsahaComponentList';
import UsahaProduct from '../../../components/Usaha/UsahaProduct';

export default function Produk() {
    const drawerWidth = VariableDrawerWidth

    return (
        <ThemeProvider theme={themeUsaha}>
            <UsahaAppBar />
            <Box sx={{
                flexGrow: 1,
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                p: `1rem`
            }}>

                <UsahaProduct />
                {/* <UsahaComponentList /> */}

            </Box>
        </ThemeProvider>
    )
}
