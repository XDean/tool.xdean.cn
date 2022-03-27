import {MantineProvider} from '@mantine/core';
import {AppProps} from 'next/dist/pages/_app';
import Head from 'next/head';
import '../src/styles/global.css';
import 'common/css/md.css';
import {BaiduAnalytics} from '../common/util/analytics/baidu';
import {useGA} from '../common/util/ga';

function MyApp({Component, pageProps}: AppProps) {
  useGA('G-64T9WP46G4')
  return (
    <MantineProvider emotionOptions={{key: 'mantine', prepend: false}}>
      <Head>
        <title>XDean的工具箱</title>
        <BaiduAnalytics id={'98fd9ed93fbb6b403f11e6f54d2210c4'}/>
      </Head>
      <Component {...pageProps}/>
    </MantineProvider>
  );
}

export default MyApp;
