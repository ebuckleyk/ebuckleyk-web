import { getSession } from '@auth0/nextjs-auth0';
import { Badge, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Card from '../../../components/shared/card';
import { EVENTS } from '../../../utils/analytics';
import web_public_api from '../../../utils/api';
export default function Awards({ data }) {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (/^((?!chrome|android).)*safari/i.test(navigator?.userAgent)) {
      setIsSafari(true);
    }
  }, []);

  return (
    <SimpleGrid>
      <Stack spacing={3}>
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
            ></Card>
          );
        })}
      </Stack>
    </SimpleGrid>
  );
}

export async function getServerSideProps(context) {
  const { user } = (await getSession(context.req, context.res)) || {};
  const query = user ? `?userId=${user.sub}` : '';
  const data = await web_public_api(`/award-public${query}`);
  return {
    props: {
      data
    }
  };
}

Awards.displayName = 'Scholarship & Awards';
