import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Head from 'next/head'
import axios from 'axios';
import styles from '../../styles/Home.module.css'
import { Button, CircularProgress} from '@mui/material';
import HadistAppBar from '../../components/Hadist/HadistAppBar';
import CardAyat from '../../components/Hadist/CardAyat';

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
        if (q === "") {
            router.push({
                pathname: "/hadist"
            })
        }
    }

    const handleSubmit = preventDefault(() => {
        if (q.trim().toLowerCase() != query.trim().toLowerCase()) {
            setHadist([]);
            router.push({
                pathname: "/hadist/search",
                query: { q: query.trim() },
            })
        }
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
                <title>Referensi Hadist</title>
                <meta name="description" content="Mencari hukum dan referensi hadist islam" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HadistAppBar query={query} handleSubmit={handleSubmit} setQuery={setQuery} {...props}/>
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