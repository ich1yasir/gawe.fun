import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import BackgroundHome from '../components/background/home';

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Gawe Fun</title>
        <meta name="description" content="Kumpulan aplikasi sederhana, hanya untuk fun dan mengisi waktu luang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundHome />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Gawe <a href="#">Fun</a>
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>Kumpulan aplikasi sederhana : <Link href='/hadist'><a>Cari Hadist</a></Link>, <a href='#'>Antrian</a>, <a href='#' >Wacana</a></code>
        </p>

      </main>

      <footer className={styles.footer} style={{ zIndex: 100 }}>
        <span>By . {' '}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' One-Team '}
          </a>
        </span>
        <span>
          <a>
            <code className={styles.code}>@GlobalOne</code>
          </a>
        </span>
      </footer>
    </div>
  )
}
