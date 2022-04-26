import { Badge, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import Card from '../../components/shared/card';
import { EVENTS } from '../../utils/analytics';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Awards() {
  const { data } = useSWR('/api/awards', fetcher);

  return (
    <SimpleGrid>
      <Stack spacing={3}>
        {data?.map((d) => {
          const title = (
            <Text>
              {d.title}
              <Badge ml="1" colorScheme={'green'}>{`$${d.awardAmount}`}</Badge>
            </Text>
          );
          return (
            <Card
              isPreview
              isRichText
              navigateTo={d.link}
              content={d.content}
              title={title}
              img={d.image}
              key={d.id}
              gaEvent={EVENTS.VIEW_AWARD}
            ></Card>
          );
        })}
      </Stack>
    </SimpleGrid>
  );
}

Awards.displayName = 'Scholarship & Awards';
