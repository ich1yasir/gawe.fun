import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import UsahaAppBar from "../../components/Usaha/UsahaAppBar";
import { VariableDrawerWidth } from '../../utils/variableGlobal';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Home() {
    const drawerWidth = VariableDrawerWidth
    return (
        <div>
            <UsahaAppBar />
            <Box sx={{
                flexGrow: 1,
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                p: `1rem`
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Item>Terjual 12 Item</Item>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Item>8 Order</Item>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Item>Keuntungan 2.000rb</Item>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Item>12% meingkat</Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>daftar</Item>
                    </Grid>
                </Grid>
            </Box>

        </div>
    )
}
