/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import itemData from '../../dummies/imageList.json';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Bookmark, Favorite, MenuOpen, MoreVert, ShareTwoTone, StarBorderOutlined } from '@material-ui/icons';
import CardWacana from '../card/CardWacana';

export default function MasonryImageList(props) {
  const theme = useTheme();
  const matchessm = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesmd = useMediaQuery(theme.breakpoints.up('md'));
  const matcheslg = useMediaQuery(theme.breakpoints.up('lg'));
  return (
    <ImageList variant="masonry" cols={matchessm ? (matchesmd ? (matcheslg ? 4 : 3) : 2) : 1} gap={8}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            srcSet={`${item.img}?w=500&fit=crop&auto=format 1x,
                ${item.img}?w=500&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            position="top"
            sx={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, ' +
                'rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
            }}
            actionPosition="right"
            actionIcon={
              <div>
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`info about ${item.title}`}
                >
                  <StarBorderOutlined />
                </IconButton>
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`info about ${item.title}`}
                >
                  <ShareTwoTone />
                </IconButton>
              </div>
            }
          />
          <CardWacana title={item.title} subtitle={item.author}/>
        </ImageListItem>
      ))}
    </ImageList>
  );
}