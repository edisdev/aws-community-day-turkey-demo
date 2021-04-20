import React from 'react'
import Head from 'next/head'
import Todos from '../components/Todos'

import styles from '../styles/Home.module.css'

export default function Home () {
  return (
    <div className={styles.container}>
      <Head>
        <title>Todo App Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Yapılacaklar</h1>
        <section className={styles.todosSection}>
          <Todos/>
        </section>
      </main>
    </div>
  )
}
