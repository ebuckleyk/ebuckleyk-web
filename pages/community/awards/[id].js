import NextImage from 'next/image';
import {
  Flex,
  Heading,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Badge,
  Text,
  Button,
  Box
} from '@chakra-ui/react';
import * as api from '../../../utils/api/handlers/contentful';
import RichText from '../../../components/richtext';
import AwardForm from '../../../components/award_form';
import { useCallback } from 'react';
import { withCaptcha, uploadToS3 } from '../../../utils/api/helper';
import useAuth0User from '../../../utils/hooks/useAuth0User';
import LinkWrapper from '../../../components/shared/link_wrapper';
import { getSession } from '@auth0/nextjs-auth0';
import { format } from 'date-fns';

function Message({ children }) {
  return (
    <Flex
      flexDir={'column'}
      minH={350}
      justifyContent={'center'}
      alignItems="center"
    >
      {children}
    </Flex>
  );
}
export default function Award({ award, router }) {
  const toast = useToast();
  const { user, isLoggedIn } = useAuth0User();

  const onSubmitInfo = useCallback(
    async (formInfo, done) => {
      withCaptcha(async (token) => {
        try {
          let s3FileLocations = [];

          if (formInfo.attachments?.length) {
            s3FileLocations = await Promise.all(
              formInfo.attachments?.map((f) => {
                return uploadToS3(f);
              })
            );
          }

          const postData = {
            ...formInfo,
            campaignId: award.activeCampaignId,
            attachments: [...s3FileLocations],
            captcha: token
          };

          const response = await fetch(
            `/api/awards/${award._id}?appType=${formInfo.appType}`,
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
            duration: 1500,
            isClosable: true
          });
          setTimeout(() => {
            router.push('/community/awards');
          }, 1500);
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
    [toast, award?._id, award?.activeCampaignId, router]
  );

  const cycleDate = award.activeCampaignId ? (
    <Text fontWeight={'bold'}>
      {format(new Date(award.start), 'PP')} -{' '}
      {format(new Date(award.end), 'PP')}
    </Text>
  ) : null;

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
        <Tab _selected={{ color: 'black', bg: 'blue.50' }}>{award.name}</Tab>
        <Tab _selected={{ color: 'black', bg: 'blue.50' }}>
          Apply
          {!!award.rewardAmount && (
            <Badge ml="1" colorScheme={'green'}>
              {`$${award.rewardAmount}`}
            </Badge>
          )}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stack direction={'column'} spacing={5} p={5}>
            <Flex justify={'center'}>
              <Heading fontSize={{ sm: 'md', xl: 'x-large' }}>
                {award.name}
              </Heading>
            </Flex>
            <Box justifyContent={'center'} display="flex" w={'100%'}>
              <Flex
                pos="relative"
                boxShadow={'xl'}
                borderRadius={50}
                borderWidth={2}
                width={200}
                height={200}
                justify="center"
              >
                <NextImage
                  layout="fill"
                  src={award.image.url}
                  width={200}
                  height={300}
                />
              </Flex>
            </Box>
            <RichText>{award.content}</RichText>
          </Stack>
        </TabPanel>
        <TabPanel>
          {!isLoggedIn ? (
            <Message>
              <Button variant={'link'} as={'a'} href={'/api/auth/login'}>
                Please sign in!
              </Button>
            </Message>
          ) : null}
          {isLoggedIn && !award.activeCampaignId ? (
            <Message>
              <Text>
                This award is currently unavailable. Please check back later!
              </Text>
            </Message>
          ) : null}
          {isLoggedIn && award.applicationId ? (
            <Message>
              <Text textAlign={'center'}>
                {"You've already applied to this award cycle"}
                {cycleDate}
              </Text>
              <Text>
                {
                  'If you would like to check award status or update application, please click below.'
                }
              </Text>
              <Button href="/profile" as={LinkWrapper} mt={5} variant="link">
                Go To Profile
              </Button>
            </Message>
          ) : null}
          {award.activeCampaignId && !award.applicationId && isLoggedIn ? (
            <AwardForm
              activeCampaignId={award.activeCampaignId}
              user={user}
              appType={award.category}
              onSubmit={onSubmitInfo}
            />
          ) : null}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export async function getServerSideProps(context) {
  const { user } = (await getSession(context.req, context.res)) || {};
  const data = await api.getAwardById(context.params.id, user?.sub);
  return {
    props: {
      award: data
    }
  };
}

Award.displayName = 'Award';
