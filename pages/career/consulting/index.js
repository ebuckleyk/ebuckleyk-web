import { Grid, GridItem } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import ConsultingCard from '../../../components/consulting_card';
import { consulting_data as data } from '../../../localdata';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../../utils/animation';

export default function Consulting({ companies }) {
  return (
    <AnimatePresence>
      <Grid
        as={motion.div}
        {...STAGGER_LOAD_ITEMS_ANIMATION.containerProps}
        variants={STAGGER_LOAD_ITEMS_ANIMATION.containerVariant}
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
            <GridItem
              as={motion.div}
              whileHover={{ scale: 1.01 }}
              variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
              key={company.companyName}
            >
              <ConsultingCard
                companyName={company.companyName}
                companyLogo={company.companyLogo}
                website={company.website}
              />
            </GridItem>
          );
        })}
      </Grid>
    </AnimatePresence>
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

Consulting.displayName = 'Consulting';
