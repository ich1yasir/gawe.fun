import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Divider } from '@mui/material';

export default function AntrianVerticalList({ items }) {
  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 350,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
      <ListSubheader>{`Dalam Antrian`}</ListSubheader>
      {items && items.map((item) => (
        <>
          <ListItem key={`item-${item}`}>
            <ListItemText 
            primary={`${item.data.codeAnt} - ${item.data.DisplayName}`} 
            secondary={`${item.data.userEmail}, 
            joined at: ${item.data.joined.toDate().getUTCHours()}: 
            ${item.data.joined.toDate().getUTCMinutes()}`}/>
          </ListItem>
          <Divider variant="middle" />
        </>
      ))}
    </List>
  );
}