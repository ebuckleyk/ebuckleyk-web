import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../_theme';
import Layout from '../components/layout';

function MyApp({ Component, pageProps, router }) {
  const headerInfo = {
    pageTitle: Component.name,
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
