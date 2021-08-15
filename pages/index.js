// import React from 'react';

import { Container } from "@material-ui/core";
import Footer from "../components/footer/footer";
import PrimarySearchAppBar from "../components/header/header";
import MasonryImageList from "../components/images/MasonryImageList";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./theme";
import "@fontsource/sacramento"

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      
      <PrimarySearchAppBar title="Gawe-Fun" />
      <Container maxWidth="xl" style={{ paddingTop: '40px' }}>
        <MasonryImageList />
        <Footer />
      </Container>
    </ThemeProvider>
  )
}