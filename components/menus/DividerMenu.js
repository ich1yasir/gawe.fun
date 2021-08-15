import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

export default function ListDividers() {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            AI
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Photos" secondary="Jan 9, 2014" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>
        <ListItemText primary="wacana" />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
      <ListItem button>
        <ListItemText primary="atur" />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
      <ListItem button>
        <ListItemText primary="undangan" />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
      <ListItem button>
        <ListItemText primary="logout" />
      </ListItem>
    </List>
  );
}