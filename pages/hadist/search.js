import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Container from '@mui/material/Container';
import Head from 'next/head'
import axios from 'axios';
import styles from '../../styles/Home.module.css'
import { Button, CircularProgress, colors, IconButton, Paper, Icon } from '@mui/material';

const CardAyat = ({ ayat }) => {
    return <div className={styles.ayat}>
        <h3 className={styles.kitab}>{ayat.kitab}</h3>
        <p className={styles.arab}>{ayat.arab}</p>
        <p className={styles.terjemah}>{ayat.terjemah}</p>
    </div>;
}

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: theme.palette.common.white
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%'
}));

const StyledDiv = styled('div')(({ theme }) => ({
    margin: 'auto',
    width: '100%',
    maxWidth: '900px'
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
    color: '#0eac00',
    marginRight: '2rem',
    fontSize: 'xx-large',
    fontWeight: '900'

}));


const preventDefault = f => e => {
    e.preventDefault()
    f(e)
}


export default function QueryPage(props) {
    const [query, setQuery] = useState("");
    const [hadist, setHadist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [page, setPage] = useState(1);
    const key = `AAAAB3NzaC1yc2EAAAADAQABAAAAgQDheV5nY0TIudF7WzZ/a/vZ4HprlIQpsLn8newJcbmG4n7Ki0JekYPALT2gKHo1Vw01uf9FhnTapTBin7aSVJqb3zNMxzYfvw3heAMfH7NsowsupwdoGFfuWhNNxQLOipyn3817kpvOoe9FKkrJbcTlBAra3TFXTjpIBfUJtFS2vw==`
    //http://localhost:3000/api/query?q=wudhu&p=3&
    const router = useRouter()
    const { q } = router.query
    const loadHadist = () => {
        setLoading(true);
        setLoadMore(false);
        if (q) {
            axios.get(`/api/query?q=${q}&p=${page}&k=${key}`)
                .then(res => {
                    const listHadis = res.data;
                    setHadist([...hadist, ...listHadis]);
                    const nextPage = page + 1;
                    setPage(nextPage)
                    if (listHadis.length < 10) {
                        setLoadMore(false);
                    } else {
                        setLoadMore(true);
                    }
                    setLoading(false)
                })
        }
    }

    const handleSubmit = preventDefault(() => {
        setHadist([]);
        router.push({
            pathname: "/hadist/search",
            query: { q: query },
        })
    })

    useEffect(() => {
        setLoading(true)
        setQuery(q)
        // Update the document title using the browser API
        loadHadist();
    }, [q]);

    return (
        <React.Fragment>
            <Head>
                <title>Referensi Islam</title>
                <meta name="description" content="Mencari hukum islam cari hadist dan ayat alquran hanya ada di Referensi Islam" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ElevationScroll {...props}>
                <StyledAppBar>
                    <Toolbar>
                        <StyledDiv sx={{display: 'flex', alignItems: 'center'}}>
                            <StyledTitle>
                                Hadist
                            </StyledTitle>
                            <StyledForm onSubmit={handleSubmit}>
                                <Paper
                                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                                >
                                    <Icon sx={{ m: '10px' }} >
                                        <LocalLibraryIcon />
                                    </Icon>
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Cari Referensi Tentang: Mendidik anak"
                                        inputProps={{ 'aria-label': 'Cari Referensi tentang' }}
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                    />
                                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </StyledForm>
                        </StyledDiv>
                    </Toolbar>
                </StyledAppBar>
            </ElevationScroll>
            <Toolbar />
            <Container>
                <main className={styles.main_hadist}>
                    <div className={styles.grid}>
                        <div>
                            {hadist && hadist.map((obj, index) =>
                                <CardAyat key={index.toString()} ayat={obj} />
                            )}
                        </div>
                        {
                            loading ? <CircularProgress /> : (null)
                        }
                        {loadMore && <Button onClick={() => loadHadist()}>Load More..</Button>}
                    </div>
                </main>

                <footer className={styles.footer_hadist}>
                    Powered by{' '}
                    <span className={styles.logo}>
                        <a><i>One team</i></a>
                    </span>
                </footer>
            </Container>
        </React.Fragment>
    )
}