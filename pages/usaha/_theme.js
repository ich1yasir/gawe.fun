import { createTheme } from "@mui/material";

const themeUsaha = createTheme();

themeUsaha.typography.h3 = {
    fontSize: '1.5rem',
    '@media (min-width:600px)': {
        fontSize: '2rem',
    },
    [themeUsaha.breakpoints.up('md')]: {
        fontSize: '4rem',
    },
};

themeUsaha.typography.h5 = {
    fontSize: '0.8rem',
    fontWeight: 'normal',
    '@media (min-width:600px)': {
        fontSize: '1.2rem',
    },
    [themeUsaha.breakpoints.up('md')]: {
        fontSize: '1.5rem',

    },
};

// function customCheckbox(theme) {
//     return {
//         '& .MuiCheckbox-root svg': {
//             width: 16,
//             height: 16,
//             backgroundColor: 'transparent',
//             border: `1px solid ${theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'
//                 }`,
//             borderRadius: 2,
//         },
//         '& .MuiCheckbox-root svg path': {
//             display: 'none',
//         },
//         '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
//             backgroundColor: '#1890ff',
//             borderColor: '#1890ff',
//         },
//         '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
//             position: 'absolute',
//             display: 'table',
//             border: '2px solid #fff',
//             borderTop: 0,
//             borderLeft: 0,
//             transform: 'rotate(45deg) translate(-50%,-50%)',
//             opacity: 1,
//             transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
//             content: '""',
//             top: '50%',
//             left: '39%',
//             width: 5.71428571,
//             height: 9.14285714,
//         },
//         '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
//             width: 8,
//             height: 8,
//             backgroundColor: '#1890ff',
//             transform: 'none',
//             top: '39%',
//             border: 0,
//         },
//     };
// }

// const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
//     border: 0,
//     color:
//         theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
//     fontFamily: [
//         '-apple-system',
//         'BlinkMacSystemFont',
//         '"Segoe UI"',
//         'Roboto',
//         '"Helvetica Neue"',
//         'Arial',
//         'sans-serif',
//         '"Apple Color Emoji"',
//         '"Segoe UI Emoji"',
//         '"Segoe UI Symbol"',
//     ].join(','),
//     WebkitFontSmoothing: 'auto',
//     letterSpacing: 'normal',
//     '& .MuiDataGrid-columnsContainer': {
//         backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
//     },
//     '& .MuiDataGrid-iconSeparator': {
//         display: 'none',
//     },
//     '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
//         borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
//             }`,
//     },
//     '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
//         borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
//             }`,
//     },
//     '& .MuiDataGrid-cell': {
//         color:
//             theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
//     },
//     '& .MuiPaginationItem-root': {
//         borderRadius: 0,
//     },
//     ...customCheckbox(theme),
// }));


// themeUsaha.components.MuiListItemButton = {
//     styleOverrides: {
//         // Name of the slot
//         root: {
//             // Some CSS
//             borderBottom: '1px solid rgba(0, 0, 0, 0.77);'
//         }
//     }
// }

export default themeUsaha