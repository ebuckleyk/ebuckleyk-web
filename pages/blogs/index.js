import { Grid, GridItem } from '@chakra-ui/react';
import useSWR from 'swr';
import BlogCard from '../../components/blogcard';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Blogs() {
  const { data } = useSWR('/api/blogs', fetcher);
  return (
    <Grid
      gap={3}
      p={{ sm: 0, md: 5 }}
      width={{ sm: '100%' }}
      templateColumns={{
        sm: 'repeat(auto-fill, minmax(100%, 1fr))',
        md: 'repeat(auto-fill, minmax(33%, 1fr))'
      }}
    >
      {data?.map((d) => {
        return (
          <GridItem key={d.id}>
            <BlogCard
              key={d.id}
              source={d.source}
              img={d.imageUrl}
              title={d.title}
              content={d.content}
              date={d.displayDate}
              navigateTo={d.link}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
}

export function getServerSideProps(context) {
  return {
    props: {
      url: `https://${context?.req?.headers?.host}/blogs`
    }
  };
}
