import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from "next/font/google"
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    return (
        <>
        <Head>
            <title>UA</title>
            <meta name="description" content="Urban Analyses for the world" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/ua.ico" />
        </Head>
        <main className={styles.main}>
            <div className={styles.description}>
                <p>
                <Link
                href="/mutate"
                className={styles.card}
                rel="noopener noreferrer"
                >
                        Decrypt Page
                </Link>
                </p>
            </div>

        </main>
    </>
    )
}
