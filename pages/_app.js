import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../_theme';
import Layout from '../components/layout';
import { GA } from '../utils/analytics';
import { useEffect } from 'react';

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      GA.pageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const headerInfo = {
    pageTitle: Component.displayName,
    url: pageProps?.url
  };
  // get page specific layout. If not, fallback to default
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <Layout router={router} headerInfo={headerInfo}>
        {page}
      </Layout>
    ));
  return (
    <ChakraProvider {...{ theme }}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}

export default MyApp;
