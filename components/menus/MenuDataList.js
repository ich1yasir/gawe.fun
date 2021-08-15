import * as React from 'react';
import Box from '@material-ui/core/Box';
import { styled, ThemeProvider, createTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowRight from '@material-ui/icons/ArrowRight';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Home from '@material-ui/icons/Home';
import Settings from '@material-ui/icons/Settings';
import People from '@material-ui/icons/People';
import PermMedia from '@material-ui/icons/PermMedia';
import Dns from '@material-ui/icons/Dns';
import Public from '@material-ui/icons/Public';
import { Avatar, ListItemAvatar } from '@material-ui/core';
import { AddCircle, ListAlt } from '@material-ui/icons';

const data = [
  { icon: <AddCircle />, label: 'Buat Wacana' },
  { icon: <ListAlt />, label: 'Daftar Wacana' },
  { icon: <PermMedia />, label: 'Undangan' },
  { icon: <Public />, label: 'Publikasi' },
];

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function MenuDataList() {
  const [open, setOpen] = React.useState(true);
  return (
    <Box sx={{ display: 'flex', position: "fixed" }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
        })}
      >
        <Paper elevation={0} sx={{ maxWidth: 256 }}>
          <FireNav component="nav" disablePadding>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  AI
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
              <Tooltip title="Project Settings">
                <IconButton
                  size="large"
                >
                  <Settings />
                  <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                </IconButton>
              </Tooltip>
            </ListItem>
            <Divider />
            <Box
              sx={{
                pb: open ? 2 : 0,
              }}
            >
              <ListItemButton
                alignItems="flex-start"
                onClick={() => setOpen(!open)}
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: open ? 0 : 2.5,
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                }}
              >
                <ListItemText
                  primary="Tentang Wacana"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 'medium',
                    lineHeight: '20px',
                    mb: '2px',
                  }}
                  secondary="Buat Wacana, Daftar Wacana, Undangan, Publikasi"
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 12,
                    lineHeight: '16px',
                  }}
                  sx={{ my: 0 }}
                />
                <KeyboardArrowDown
                  sx={{
                    mr: -1,
                    opacity: 0,
                    transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                    transition: '0.2s',
                  }}
                />
              </ListItemButton>
              {open &&
                data.map((item) => (
                  <div>
                    <ListItem button sx={{paddingLeft:5}}>
                      <ListItemIcon sx={{ color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </div>
                ))}
            </Box>
          
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
