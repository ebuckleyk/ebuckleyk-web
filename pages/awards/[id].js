import NextImage from 'next/image';
import {
  Stat,
  StatNumber,
  Flex,
  Heading,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tooltip,
  useToast,
  Text,
  Badge
} from '@chakra-ui/react';
import * as api from '../../utils/api/handlers/contentful';
import RichText from '../../components/richtext';
import AwardForm from '../../components/award_form';
import { useCallback } from 'react';
import { withCaptcha, uploadToS3 } from '../../utils/api/helper';

const DisabledTab = ({ isDisabled, children, ...rest }) => (
  <Tooltip
    hasArrow
    bg="gray.300"
    label={isDisabled ? 'Please sign in' : 'Apply Here'}
  >
    <Tab
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      isDisabled={isDisabled}
      {...rest}
    >
      {children}
    </Tab>
  </Tooltip>
);

export default function Award({ award }) {
  const toast = useToast();

  const onSubmitInfo = useCallback(
    async (formInfo, done) => {
      withCaptcha(async (token) => {
        try {
          const s3FileLocations = await Promise.all(
            formInfo.attachments.map((f) => {
              return uploadToS3(f);
            })
          );

          const postData = {
            ...formInfo,
            attachments: [...s3FileLocations],
            captcha: token
          };

          const response = await fetch(
            `/api/awards/${award.sys.id}?appType=${formInfo.appType}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
            }
          );

          if (response.status !== 200) throw new Error();
          toast({
            title: 'Application Sent!',
            description:
              'Thanks for applying. We will review your application.',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
        } catch (error) {
          toast({
            title: 'Error sending information',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        } finally {
          done();
        }
      });
    },
    [toast, award.sys.id]
  );

  return (
    <Tabs
      isFitted
      minH={'500px'}
      bgColor={'white'}
      borderRadius={{ sm: 0, md: 20 }}
      variant={'enclosed'}
      width={{ sm: '100%', md: '90%' }}
    >
      <TabList pos="relative">
        <Tab _selected={{ color: 'black', bg: 'blue.50' }}>{award.title}</Tab>
        <DisabledTab _selected={{ color: 'black', bg: 'blue.50' }}>
          Apply
          <Badge ml="1" colorScheme={'green'}>
            $500
          </Badge>
        </DisabledTab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stack direction={'column'} spacing={5} p={5}>
            <Flex justify={'center'}>
              <Heading fontSize={{ sm: 'md', xl: 'x-large' }}>
                {award.title}
              </Heading>
            </Flex>
            <Flex maxH={200} justify="center">
              <NextImage src={award.awardImage.url} width={200} height={300} />
            </Flex>
            <RichText>{award.content.json}</RichText>
          </Stack>
        </TabPanel>
        <TabPanel>
          <AwardForm appType={award.type} onSubmit={onSubmitInfo} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export async function getServerSideProps(context) {
  const data = await api.getAwardById(context.params.id);
  return {
    props: {
      award: data.award
    }
  };
}

Award.displayName = 'Award';
