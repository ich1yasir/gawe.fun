import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import styles from '../../styles/Home.module.css'
import { Button, CircularProgress, LinearProgress } from '@mui/material';

const CardAyat = ({ ayat }) => {
    return <div className={styles.ayat}>
        <h3 className={styles.kitab}>{ayat.kitab}</h3>
        <p className={styles.arab}>{ayat.arab}</p>
        <p className={styles.terjemah}>{ayat.terjemah}</p>
    </div>;
}

const QueryPage = () => {
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
                    const nextPage = page+1;
                    setPage(nextPage)
                    if (listHadis.length < 10){
                        setLoadMore(false);
                    }else{
                        setLoadMore(true);
                    }
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        setLoading(true)
        // Update the document title using the browser API
        loadHadist();
    }, [q]);

    return (

        <div>
            <Head>
                <title>Referensi Islam</title>
                <meta name="description" content="Mencari hukum islam cari hadist dan ayat alquran hanya ada di Referensi Islam" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main_hadist}>
                <h1 className={styles.title_hadist}>
                    Referensi <a>Islam!</a>
                </h1>

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
        </div>
    )
}

export default QueryPage