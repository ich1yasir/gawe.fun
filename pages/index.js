import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gawe Fun</title>
        <meta name="description" content="Aplikasi under estimate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Coming <a href="#">Soon</a>
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>few days left</code>
        </p>

      </main>

      <footer className={styles.footer}>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          By : One-Team
        </a>
        <a>
        <code className={styles.code}> @GlobalOne Project</code>
        </a>
      </footer>
    </div>
  )
}
