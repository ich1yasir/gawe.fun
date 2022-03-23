import * as React from 'react';
import { Box, Button, Card, CardActions, CardContent, Divider, Grid, List, ListItem, ListItemText, Menu, MenuItem, Paper, Tooltip, Typography } from '@mui/material';
import { flexbox } from '@mui/system';


export default function AntrianHeader() {

    return (
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={12} md={8} sx={{
                    width: '100%'
                }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h2">
                                ANTR-00001
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Coming soon
                            </Typography>
                            <Typography variant="body2">
                                please wait with kindly.
                                <br />
                                {'"and a bit smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h6'>
                        NEXT :
                    </Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                ANTR-00002
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Coming soon
                            </Typography>
                            <Typography variant="body2">
                                please wait with kindly.
                                <br />
                                {'"and a bit smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
