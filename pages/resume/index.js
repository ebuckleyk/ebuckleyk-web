import { Grid, GridItem } from '@chakra-ui/react';
import ResumeCard from '../../components/resumecard';
import ResumeStats from '../../components/resumestats';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../utils/animation';
import web_public_api from '../../utils/api';

export default function Resume({ resume, stats }) {
  return (
    <AnimatePresence>
      <Grid
        as={motion.div}
        {...STAGGER_LOAD_ITEMS_ANIMATION.containerProps}
        variants={STAGGER_LOAD_ITEMS_ANIMATION.containerVariant}
        p={{ sm: 0, md: 5 }}
        gap={3}
        width={{ sm: '100%' }}
        templateColumns={{
          sm: 'repeat(auto-fill, minmax(100%, 1fr))',
          md: 'repeat(auto-fill, minmax(25%, 1fr))',
          lg: 'repeat(auto-fill, minmax(30%, 1fr))'
        }}
      >
        <GridItem
          key={0}
          display="flex"
          justifyContent={'center'}
          colSpan={{ sm: 2, md: 1 }}
          rowSpan={resume?.jobs?.length ?? 0}
        >
          <ResumeStats stats={stats} />
        </GridItem>
        {resume?.jobs?.map((job) => {
          return (
            <GridItem
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              variants={STAGGER_LOAD_ITEMS_ANIMATION.itemVariant}
              display={'flex'}
              justifyContent="center"
              key={job.startDate}
              colSpan={2}
            >
              <ResumeCard
                company={job.company}
                logo={job.companyLogo}
                startDate={job.startDate}
                endDate={job.endDate}
                roles={job.roles}
                timeIn={job.timeAtCompanyInMonths}
                assets={job.assets}
              />
            </GridItem>
          );
        })}
      </Grid>
    </AnimatePresence>
  );
}

export async function getServerSideProps(context) {
  const resume_data_and_stats = await web_public_api('/resume-public');

  const { resume, stats } = resume_data_and_stats;
  const byCompany = {};

  stats[0].companies.forEach((c) => {
    byCompany[c.company] = { experienceInMonths: c.expInMonths };
  });

  return {
    props: {
      resume,
      stats: {
        byCompany,
        totalExperience: stats[0].expInMonths
      }
    }
  };
}

Resume.displayName = 'Resume';
