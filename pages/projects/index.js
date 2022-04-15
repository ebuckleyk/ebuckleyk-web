import useSWR from 'swr';
import { Grid, GridItem } from '@chakra-ui/react';
import ProjectCard from '../../components/project_card';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Projects() {
  const { data } = useSWR('/api/projects', fetcher);
  return (
    <Grid
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
          <GridItem key={d.id}>
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
  );
}
