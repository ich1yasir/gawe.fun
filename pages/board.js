// import React from 'react';

import { Container, Grid, Typography } from "@material-ui/core";
import Footer from "../components/footer/footer";
import PrimarySearchAppBar from "../components/header/header";
import MasonryImageList from "../components/images/MasonryImageList";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./theme";
import { styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import ListDividers from "../components/menus/DividerMenu";
import MenuDataList from "../components/menus/MenuDataList";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Board() {
    return (
        <ThemeProvider theme={theme}>
            <PrimarySearchAppBar title="Gawe-Fun" />
            <Container maxWidth="xl" style={{ paddingTop: 60 }}>
                <Grid container spacing={1}>
                    <Grid item>
                        <MenuDataList />
                    </Grid>
                    <Grid item item xs={12} sx={{marginLeft: 32}} sm container>
                        <Item>

                        <Typography variant="h1" component="div" gutterBottom>
                                h1. Heading
      </Typography>
                            <Typography variant="h2" gutterBottom component="div">
                                h2. Heading
      </Typography>
                            <Typography variant="h3" gutterBottom component="div">
                                h3. Heading
      </Typography>
                            <Typography variant="h4" gutterBottom component="div">
                                h4. Heading
      </Typography>
                            <Typography variant="h5" gutterBottom component="div">
                                h5. Heading
      </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                h6. Heading
      </Typography>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur
      </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div">
                                subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur
      </Typography>
                            <Typography variant="body1" gutterBottom>
                                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                                quasi quidem quibusdam.
      </Typography>
                            <Typography variant="body2" gutterBottom>
                                body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                                quasi quidem quibusdam.
      </Typography>
                            <Typography variant="button" display="block" gutterBottom>
                                button text
      </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                caption text
      </Typography>
                            <Typography variant="overline" display="block" gutterBottom>
                                overline text
      </Typography>

      <Typography variant="h1" component="div" gutterBottom>
                                h1. Heading
      </Typography>
                            <Typography variant="h2" gutterBottom component="div">
                                h2. Heading
      </Typography>
                            <Typography variant="h3" gutterBottom component="div">
                                h3. Heading
      </Typography>
                            <Typography variant="h4" gutterBottom component="div">
                                h4. Heading
      </Typography>
                            <Typography variant="h5" gutterBottom component="div">
                                h5. Heading
      </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                h6. Heading
      </Typography>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur
      </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div">
                                subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur
      </Typography>
                            <Typography variant="body1" gutterBottom>
                                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                                quasi quidem quibusdam.
      </Typography>
                            <Typography variant="body2" gutterBottom>
                                body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                                quasi quidem quibusdam.
      </Typography>
                            <Typography variant="button" display="block" gutterBottom>
                                button text
      </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                caption text
      </Typography>
                            <Typography variant="overline" display="block" gutterBottom>
                                overline text
      </Typography>

      <Typography variant="h1" component="div" gutterBottom>
                                h1. Heading
      </Typography>
                            <Typography variant="h2" gutterBottom component="div">
                                h2. Heading
      </Typography>
                            <Typography variant="h3" gutterBottom component="div">
                                h3. Heading
      </Typography>
                            <Typography variant="h4" gutterBottom component="div">
                                h4. Heading
      </Typography>
                            <Typography variant="h5" gutterBottom component="div">
                                h5. Heading
      </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                h6. Heading
      </Typography>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur
      </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div">
                                subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur
      </Typography>
                            <Typography variant="body1" gutterBottom>
                                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                                quasi quidem quibusdam.
      </Typography>
                            <Typography variant="body2" gutterBottom>
                                body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                                quasi quidem quibusdam.
      </Typography>
                            <Typography variant="button" display="block" gutterBottom>
                                button text
      </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                caption text
      </Typography>
                            <Typography variant="overline" display="block" gutterBottom>
                                overline text
      </Typography>
                        </Item>
                    </Grid>
                </Grid>
                <Footer />
            </Container>
        </ThemeProvider>
    )
}