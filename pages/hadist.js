import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Icon, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useState } from 'react';

export default function Home() {

  const [query, setQuery] = useState("");

  return (
    <div className={styles.container_hadist}>
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
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}
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
              <IconButton href={`/query?q=${query}`} type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
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
