import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import UsahaAppBar from "../../components/Usaha/UsahaAppBar";
import { VariableDrawerWidth } from '../../utils/variableGlobal';
import { ThemeProvider, Typography } from '@mui/material';
import themeUsaha from './_theme';
import PaperItem from '../../components/PaperItem';


export default function Home() {
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
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <PaperItem>
                            <Typography variant='h3'>
                                12
                            </Typography>
                            <Typography variant='h5'>
                                Item Terjual
                            </Typography>
                        </PaperItem>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <PaperItem>
                            <Typography variant='h3'>
                                8
                            </Typography>
                            <Typography variant='h5'>
                                Aktive Order
                            </Typography>
                        </PaperItem>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <PaperItem>
                            <Typography variant='h3'>
                                6.3 Jt
                            </Typography>
                            <Typography variant='h5'>
                                Rata Penjualan
                            </Typography>
                        </PaperItem>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <PaperItem>
                            <Typography variant='h3'>
                                +25%
                            </Typography>
                            <Typography variant='h5'>
                                Peningkatan
                            </Typography>
                        </PaperItem>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}
