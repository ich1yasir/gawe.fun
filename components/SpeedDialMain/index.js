import * as React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import { styled } from '@mui/material/styles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { LoginTwoTone, LogoutTwoTone } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { Fab, Typography } from '@mui/material';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  [theme.breakpoints.up('md')]: {
    right: theme.spacing(2),
    left: theme.spacing(2),
  }
}));

const fabGreenStyle = {
  position: 'fixed',
  zIndex: 10001,
  right: { lg: 32, md: 24, xs: 16 },
  top: { lg: 3 },
  bottom: { xs: 16, md: 24 }

};
const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

export default function SpeedDialMain() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTogle = () => setOpen(!open);

  return (
    <Box sx={fabGreenStyle}>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        icon={<SpeedDialIcon icon={<LoginTwoTone /> } openIcon={<LogoutTwoTone />} />}
        open={open}
        onClick={handleTogle}
        direction='left'
        FabProps={{
          sx: {
            bgcolor: green[500],
            '&:hover': {
              bgcolor: green[600],
            },
          }
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}