import {AppProps} from 'next/dist/pages/_app';
import '../styles/global.css';
import Head from 'next/head';
import {Layout} from '../components/layout/Layout';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>XDean的工具箱</title>
      </Head>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </>
  );
}

export default MyApp;
