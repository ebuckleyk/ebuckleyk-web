import {
  Flex,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast
} from '@chakra-ui/react';
import useSWR from 'swr';
import useAuth0User from '../../utils/hooks/useAuth0User';
import HeaderInfo from '../../components/profile/header_info';
import ContactInfo from '../../components/profile/contact_info';
import { useCallback } from 'react';
import {
  getPreSignedUrlUpload,
  getPublicProfileImagePrefix,
  uploadToS3v2,
  withCaptcha
} from '../../utils/api/helper';
import { EVENTS, GA } from '../../utils/analytics';
import ApplicationHistory from '../../components/profile/application_history';
import GlassCard from '../../components/glass_card';

const fetcher = (...args) => fetch(...args).then((res) => res.json());
export default function Profile({ router }) {
  const { user, isLoading, isLoggedIn, checkSession, profilePicture } =
    useAuth0User();
  const toast = useToast();
  const { data: applications } = useSWR(
    '/api/profile/application_history',
    fetcher
  );

  const updateBio = useCallback(
    async (bio) => {
      withCaptcha(async (token) => {
        try {
          const res = await fetch('/api/profile/editBio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bio, captcha: token })
          });

          if (res.status !== 200) throw new Error();

          toast({
            titie: 'Bio updated successfully',
            description: 'Bio updated successfully',
            status: 'success',
            duration: 1500,
            isClosable: true
          });

          GA.event(EVENTS.UPDATE_BIO);
          // force user session check to reset userprofile state
          await checkSession();
        } catch (error) {
          toast({
            title: 'Error updating bio',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      });
    },
    [toast, checkSession]
  );

  const updateProfileImage = useCallback(
    async (images = []) => {
      const fileToUpload = images.length ? images[0] : undefined;
      withCaptcha(async (token) => {
        try {
          if (!fileToUpload)
            throw new Error('Error occurred retrieving image.');

          const preSignedUrl = await getPreSignedUrlUpload(
            fileToUpload.name,
            fileToUpload.type,
            getPublicProfileImagePrefix(user.user_id)
          );

          await uploadToS3v2(
            fileToUpload,
            preSignedUrl.signedUrl,
            preSignedUrl.hostedContent
          );

          const res = await fetch('/api/profile/editProfileImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              profileUrl: preSignedUrl.hostedContent,
              captcha: token
            })
          });

          if (res.status !== 200) throw new Error();

          toast({
            titie: 'Profile image updated',
            description: 'Profile image updated',
            status: 'success',
            duration: 1500,
            isClosable: true
          });

          GA.event(EVENTS.UPDATE_PROFILE_IMG);
          // force user session check to reset userprofile state
          await checkSession();
        } catch (error) {
          toast({
            title: 'Error updating profile image',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      });
    },
    [toast, user, checkSession]
  );

  const updateContact = useCallback(
    async (contact, done) => {
      withCaptcha(async (token) => {
        try {
          const res = await fetch('/api/profile/updateContactInfo', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...contact, captcha: token })
          });

          if (res.status !== 200) throw new Error();
          toast({
            titie: 'Contact information updated successfully',
            description: 'Contact information updated successfully',
            status: 'success',
            duration: 1500,
            isClosable: true
          });

          GA.event(EVENTS.UPDATE_CONTACT_INFORMATION);

          // force user session check to reset userprofile state
          await checkSession();
        } catch (error) {
          toast({
            title: 'Error updating contact information.',
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
    [toast, checkSession]
  );

  if (isLoading) return <>Loading...</>;
  if (!isLoggedIn) return <>Not Logged In</>;

  return (
    <GlassCard
      as={Flex}
      p={5}
      borderRadius={{ md: 20 }}
      w={{ sm: '100%', md: '80%' }}
      flexDir="column"
      justifyContent={'center'}
      alignItems="center"
      minH={{ sm: '100vh', md: 0 }}
    >
      <Stack width={'100%'} spacing={5}>
        <HeaderInfo
          email={user?.email}
          bio={user?.user_metadata?.bio}
          onUpdateBio={updateBio}
          name={user?.name}
          profileImg={profilePicture}
          onUpdateProfileImg={updateProfileImage}
        />
        <Tabs>
          <TabList>
            <Tab fontSize={14}>Contact Information</Tab>
            <Tab fontSize={14}>Application History</Tab>
            <Tab fontSize={14}>Contact Preferences</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ContactInfo
                contact_info={user?.user_metadata?.contact ?? {}}
                onUpdateContactInfo={updateContact}
              />
            </TabPanel>
            <TabPanel>
              <ApplicationHistory
                onClick={(applicationId) =>
                  router.push(`/profile/application_history/${applicationId}`)
                }
                applications={applications}
              />
            </TabPanel>
            <TabPanel>None</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </GlassCard>
  );
}

Profile.displayName = 'Profile';
