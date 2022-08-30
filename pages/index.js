import { Box } from '@chakra-ui/react';
import HomeCard from '../components/home_card';
import InfoCardList from '../components/info_card';
import settings from '../app.settings.json';

export default function Home({ quickLinks }) {
  return (
    <>
      <Box
        backdropFilter="blur(10px)"
        boxShadow={'xl'}
        width={{ sm: '100%', md: '75%', lg: '50%' }}
        style={{ position: 'absolute', bottom: '30%' }}
        marginLeft={{ md: '-50%' }}
      >
        <HomeCard />
      </Box>
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          width: '100%',
          backdropFilter: 'blur(10px)'
        }}
      >
        <InfoCardList quickLinks={quickLinks} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const quickLinks = settings.navigation.reduce((prev, cur) => {
    if (cur.isQuickLink) {
      return prev.concat(cur);
    }

    if (cur.children?.length) {
      const t = [];
      cur.children.forEach((c) => (c.isQuickLink ? t.push(c) : ''));
      return prev.concat(t);
    }
    return prev;
  }, []);

  return {
    props: {
      quickLinks
    }
  };
}

Home.displayName = 'Home';
