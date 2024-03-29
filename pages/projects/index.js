import useSWR from 'swr';
import { Grid, GridItem } from '@chakra-ui/react';
import ProjectCard from '../../components/project_card';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../utils/animation';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Projects() {
  const { data } = useSWR('/api/projects', fetcher);
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
          md: 'repeat(auto-fill, minmax(30%, 1fr))'
        }}
      >
        {data?.map((d) => {
          return (
            <GridItem
              as={motion.div}
              variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
              key={d.id}
            >
              <ProjectCard
                img={d.image}
                title={d.title}
                description={d.description}
                github={d.github}
              />
            </GridItem>
          );
        })}
      </Grid>
    </AnimatePresence>
  );
}

Projects.displayName = 'Projects';
