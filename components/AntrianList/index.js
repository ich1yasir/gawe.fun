import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';
import HorizontalList from '../AntrianList/HorizontalList';
import { padding } from '@mui/system';
import AntrianHeader from './AntrianHeader';
import AntrianVerticalList from './AntrianVerticalList';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function AntrianList({ title, index, items }) {
    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card variant="outline" sx={{ p: 0 }}>
            <CardHeader
                sx={{ padding: 1 }}
                action={
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                }
                title={title}
                subheader={"Start :" + "10, Nov 2022, 07:00"}
            />
            <CardContent sx={{ padding: 1 }}>
                <AntrianHeader></AntrianHeader>
            </CardContent>
            <CardActions disableSpacing>
                    <Typography variant='h6'>
                        Dalam Antrian
                    </Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{
                    padding: 0
                }}>
                    <AntrianVerticalList items={items} />
                </CardContent>
            </Collapse>
        </Card>
    );
}
