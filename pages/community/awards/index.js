import { getSession } from '@auth0/nextjs-auth0';
import { Badge, Grid, GridItem, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { log } from 'next-axiom';
import Card from '../../../components/shared/card';
import { EVENTS } from '../../../utils/analytics';
import web_public_api from '../../../utils/api';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../../utils/animation';

export default function Awards({ data }) {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (/^((?!chrome|android).)*safari/i.test(navigator?.userAgent)) {
      setIsSafari(true);
    }
  }, []);

  return (
    <AnimatePresence>
      <Grid
        as={motion.div}
        {...STAGGER_LOAD_ITEMS_ANIMATION.containerProps}
        variants={STAGGER_LOAD_ITEMS_ANIMATION.containerVariant}
        gap={3}
        p={{ sm: 0, md: 5 }}
        width={{ sm: '100%' }}
        templateColumns={{
          sm: 'repeat(auto-fill, minmax(100%, 1fr))',
          md: 'repeat(auto-fill, minmax(33%, 1fr))'
        }}
      >
        {data?.map((d) => {
          const title = (
            <Text>
              {d.name}
              {!!d.rewardAmount && (
                <Badge
                  ml="1"
                  colorScheme={'green'}
                >{`$${d.rewardAmount}`}</Badge>
              )}
            </Text>
          );
          return (
            <GridItem
              as={motion.div}
              variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
              key={d._id}
            >
              <Card
                isSafari={isSafari}
                isPreview
                isRichText
                navigateTo={`/community/awards/${d._id}`}
                content={d.content}
                title={title}
                img={d.image}
                key={d._id}
                gaEvent={EVENTS.VIEW_AWARD}
              />
            </GridItem>
          );
        })}
      </Grid>
    </AnimatePresence>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  log.info(
    `[getServerSideProps] Awards - ${req.method} - ${req.url}`,
    context.params
  );
  const { user } = (await getSession(context.req, context.res)) || {};
  const query = user ? `?userId=${user.sub}` : '';
  let data = await web_public_api(`/award-public${query}`);
  // most recent expiring campaigns first
  data = data.sort((a, b) => a.end - b.end);
  return {
    props: {
      data
    }
  };
}

Awards.displayName = 'Scholarship & Awards';
