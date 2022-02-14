import * as React from 'react';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Avatar, ListItemAvatar, ListItemButton, Typography } from '@mui/material';

export default function ActiveCard({ title, items }) {
    return <Card>
        <CardHeader
            sx={{ px: 2, py: 1 }}
            title={title}
            subheader={`${items.length} selected`}
        />
        <Divider />
        <List
            sx={{
                minWidth: 350,
                height: 200,
                bgcolor: 'background.paper',
                overflow: 'auto'
            }}
            dense
            component="div"
            role="list"
        >
            {items.map((item) => {
                return (
                    <ListItem key={item.id} disablePadding alignItems="flex-start">
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar alt={item.data.DisplayName} src={item.data.photoURL} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.data.DisplayName}
                                secondary={
                                    <React.Fragment>
                                        <Typography

                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.data.codeAnt}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
            <ListItem />
        </List>
    </Card>
}