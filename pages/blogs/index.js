import { Grid, GridItem } from '@chakra-ui/react';
import useSWR from 'swr';
import BlogCard from '../../components/blogcard';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../utils/animation';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Blogs() {
  const { data } = useSWR('/api/blogs', fetcher);
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
          return (
            <GridItem
              as={motion.div}
              variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
              key={d.id}
            >
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
    </AnimatePresence>
  );
}

Blogs.displayName = 'Blogs';
