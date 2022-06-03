import { Box } from '@chakra-ui/react';
import HomeCard from '../components/home_card';
import InfoCardList from '../components/info_card';

export default function Home() {
  return (
    <>
      <Box
        backdropFilter="blur(10px)"
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
        <InfoCardList />
      </div>
    </>
  );
}

Home.displayName = 'Home';
