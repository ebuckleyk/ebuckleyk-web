import { Grid, GridItem } from '@chakra-ui/react';
import { differenceInMonths } from 'date-fns';
import ResumeCard from '../../components/resumecard';
import ResumeStats from '../../components/resumestats';
import { resume_data as data } from '../../localdata';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGGER_LOAD_ITEMS_ANIMATION } from '../../utils/animation';

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
          md: 'repeat(auto-fill, minmax(33%, 1fr))'
        }}
      >
        <GridItem
          key={0}
          display="flex"
          justifyContent={'center'}
          colSpan={{ sm: 2, md: 1 }}
          rowSpan={resume?.length ?? 0}
        >
          <ResumeStats stats={stats} />
        </GridItem>
        {resume.map((job) => {
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

export async function getStaticProps() {
  // TODO: Make this way more performant
  let resumeData = data
    .map((job) => {
      return {
        ...job,
        startDate: convertDatesToDateObject(job.startDate),
        endDate: convertDatesToDateObject(job.endDate || new Date()),
        roles: job.roles
          .map((r) => {
            return {
              ...r,
              startDate: convertDatesToDateObject(r.startDate || job.startDate),
              endDate: convertDatesToDateObject(r.endDate || job.endDate)
            };
          })
          .sort((a, b) => b.startDate - a.startDate)
      };
    })
    .sort((a, b) => b.startDate - a.startDate);

  resumeData = enrichData(resumeData);

  const { byCompany } = extractStatistics(resumeData);
  const totalExperience = resumeData.reduce((prevVal, curVal) => {
    return prevVal + curVal.timeAtCompanyInMonths;
  }, 0);

  // did this because nextjs doesn't serialize dates for whatever reason
  // https://github.com/vercel/next.js/discussions/11498#discussioncomment-2381120
  return {
    props: {
      resume: JSON.parse(JSON.stringify(resumeData)),
      stats: {
        totalExperience,
        byCompany
      }
    }
  };
}

function convertDatesToDateObject(date) {
  return date ? new Date(date) : null;
}

function enrichData(resume = []) {
  return resume.map((job) => {
    return {
      ...job,
      timeAtCompanyInMonths: differenceInMonths(job.endDate, job.startDate)
    };
  });
}

function extractStatistics(resume = []) {
  const byCompany = {};

  resume.forEach((job) => {
    byCompany[job.company] = {
      ...(byCompany[job.company] || {}),
      timeInRole: job.timeAtCompanyInMonths
    };
  });

  return { byCompany };
}

Resume.displayName = 'Resume';
