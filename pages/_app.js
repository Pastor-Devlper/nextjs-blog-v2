import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import '../styles/globals.css';
import Layout from '../components/layout/layout';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
        <GoogleAnalytics gaId="G-SXLNRLRJ51" />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
