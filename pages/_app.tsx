import { MantineProvider } from '@mantine/core';
import { AppProps } from 'next/dist/pages/_app';
import Head from 'next/head';
import { Layout } from '../components/layout/Layout';
import '../styles/global.css';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <MantineProvider emotionOptions={{key: 'mantine', prepend: false}}>
      <Head>
        <title>XDean的工具箱</title>
      </Head>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </MantineProvider>
  );
}

export default MyApp;
