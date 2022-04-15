import { Grid, GridItem } from '@chakra-ui/react';
import ConsultingCard from '../../components/consulting_card';
import data from './data';
export default function Consulting({ companies }) {
  return (
    <Grid
      p={{ sm: 0, md: 5 }}
      width={{ sm: '100%' }}
      templateColumns={{
        sm: 'repeat(auto-fill, minmax(100%, 1fr))',
        md: 'repeat(auto-fill, minmax(33%, 1fr))'
      }}
      gap={3}
    >
      {companies.map((company) => {
        return (
          <GridItem key={company.companyName}>
            <ConsultingCard
              companyName={company.companyName}
              companyLogo={company.companyLogo}
              website={company.website}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
}

export async function getStaticProps() {
  const ret = data.sort();
  return {
    props: {
      companies: ret
    }
  };
}
