import { MantineProvider } from '@mantine/core';
import { AppProps } from 'next/dist/pages/_app';
import Head from 'next/head';
import '../src/styles/global.css';
import 'common/css/md.css';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <MantineProvider emotionOptions={{key: 'mantine', prepend: false}}>
      <Head>
        <title>XDean的工具箱</title>
      </Head>
      <Component {...pageProps}/>
    </MantineProvider>
  );
}

export default MyApp;
