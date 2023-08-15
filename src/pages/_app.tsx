import '@styles/globals.scss';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Three.js 測試</title>
    </Head>

    <Component {...pageProps} />
  </>
);

export default appWithTranslation(MyApp);
