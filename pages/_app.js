import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '@auth0/nextjs-auth0';
import theme from '../_theme';
import Layout from '../components/layout';
import { GA } from '../utils/analytics';

function MyApp({ Component, pageProps, router }) {
  const [navState, setNavState] = useState({
    activeRoute: router?.state?.route ?? '',
    isLoading: false
  });

  useEffect(() => {
    const handleRouteChange = (url) => {
      GA.pageView(url);
      setNavState((prevState) => ({ ...prevState, isLoading: false }));
    };

    const handleRouteStart = (url) => {
      setNavState((prevState) => ({
        ...prevState,
        activeRoute: url,
        isLoading: true
        // isLoading: url !== router.pathname
      }));
    };

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events, router.pathname]);

  const headerInfo = {
    pageTitle: Component.displayName,
    url: pageProps?.url
  };
  // get page specific layout. If not, fallback to default
  const getLayout =
    Component.getLayout ||
    ((page) => <Layout {...{ router, headerInfo, navState }}>{page}</Layout>);
  return (
    <ChakraProvider {...{ theme }}>
      <UserProvider profileUrl="/api/profile">
        {getLayout(<Component {...pageProps} router={router} />)}
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
