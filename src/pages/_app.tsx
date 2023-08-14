import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@fixtures/theme';
import '@styles/globals.scss';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>艾諾比數位股份有限公司官網</title>
    </Head>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  </>
);

export default appWithTranslation(MyApp);
