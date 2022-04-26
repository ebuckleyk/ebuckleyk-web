import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider
} from '@chakra-ui/react';
import { EVENTS, GA } from '../../utils/analytics';
import useResponsive from '../../utils/hooks/useResponsive';
import PercentOfTimeSpentAtCompany from './percentOfTimeSpentAtCompany';
import ProficiencyByDiscipline from './proficiencyByDiscipline';
import ProficiencyByLanguage from './proficiencyByLanguage';

const TIME_AT_COMPANY_LABEL = 'Time at Company';
const PROFICIENCY_BY_DISC_LABEL = 'Proficiency By Discipline';
const PROFICIENCY_BY_LANG_LABEL = 'Proficiency By Language';

function MobileDisplay({ companyStats }) {
  return (
    <Tabs>
      <TabList>
        <Tab onClick={() => GA.event(EVENTS.VIEW_TAC_RESUME_STAT)}>
          {TIME_AT_COMPANY_LABEL}
        </Tab>
        <Tab onClick={() => GA.event(EVENTS.VIEW_PBD_RESUME_STAT)}>
          {PROFICIENCY_BY_DISC_LABEL}
        </Tab>
        <Tab onClick={() => GA.event(EVENTS.VIEW_PBL_RESUME_STAT)}>
          {PROFICIENCY_BY_LANG_LABEL}
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <PercentOfTimeSpentAtCompany companyStats={companyStats} />
        </TabPanel>
        <TabPanel>
          <ProficiencyByDiscipline />
        </TabPanel>
        <TabPanel>
          <ProficiencyByLanguage />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function DesktopDisplay({ companyStats }) {
  return (
    <>
      <Stat>
        <StatLabel>{TIME_AT_COMPANY_LABEL}</StatLabel>
        <PercentOfTimeSpentAtCompany companyStats={companyStats} />
      </Stat>
      <Stat>
        <StatLabel>{PROFICIENCY_BY_DISC_LABEL}</StatLabel>
        <ProficiencyByDiscipline />
      </Stat>
      <Stat>
        <StatLabel>{PROFICIENCY_BY_LANG_LABEL}</StatLabel>
        <ProficiencyByLanguage />
      </Stat>
    </>
  );
}

export default function ResumeStats({ stats }) {
  const responsive = useResponsive();
  return (
    <Box
      borderRadius={{ sm: 0, md: 20 }}
      bgColor={'rgba(255, 255, 255, 0.8)'}
      width={{ sm: '100%', '2xl': '90%' }}
      height={'100%'}
    >
      <Stack spacing={3}>
        <SimpleGrid columns={3}>
          <Stat display={'flex'} justifyContent="center" alignItems={'center'}>
            <StatNumber textAlign={'center'}>
              {(stats.totalExperience / 12).toFixed(1)}
            </StatNumber>
            <StatHelpText>yrs of experience</StatHelpText>
          </Stat>
          <Stat display={'flex'} justifyContent="center" alignItems={'center'}>
            <StatNumber textAlign={'center'}>C#</StatNumber>
            <StatHelpText>favorite language</StatHelpText>
          </Stat>
          <Stat display={'flex'} justifyContent="center" alignItems={'center'}>
            <StatNumber textAlign={'center'}>SDM</StatNumber>
            <StatHelpText>current position</StatHelpText>
          </Stat>
        </SimpleGrid>
        <Divider />
        {responsive.isMobile ? (
          <MobileDisplay companyStats={stats.byCompany} />
        ) : (
          <DesktopDisplay companyStats={stats.byCompany} />
        )}
      </Stack>
    </Box>
  );
}
