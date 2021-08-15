import React from 'react';
import { styled, alpha } from '@material-ui/core/styles';
import { Favorite } from '@material-ui/icons';
// import PropTypes from "prop-types";

const RightText = styled('div')(({ theme }) => ({
    padding: "15px 0",
    margin: "0",
    float: "right!important",
}));

const StyledA = styled('a')(({ theme }) => ({
    color: 'red',
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover,&:focus": {
        color: "blue",
    },
}));

const StyledFavorite = styled(Favorite)(({ theme }) => ({
    width: "18px",
    height: "18px",
    position: "relative",
    top: "3px",
    color: 'red',
  }));
  

export default function Footer(props) {
    return (
        <RightText>
            &copy; {1900 + new Date().getYear()} , made with{" "}
            <StyledFavorite /> by{" "}
            <StyledA
                href="http://ich-one.com/"
                target="_blank"
            >One Tim</StyledA>{" "}for a better "<i>wacana</i>"
        </RightText>
    );
}

Footer.defaultProp = {
    title: "white",
};