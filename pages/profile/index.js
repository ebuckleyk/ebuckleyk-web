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
import useAuth0User from '../../utils/hooks/useAuth0User';
import HeaderInfo from '../../components/profile/header_info';
import ContactInfo from '../../components/profile/contact_info';
import { useCallback } from 'react';
import { withCaptcha } from '../../utils/api/helper';
import { EVENTS, GA } from '../../utils/analytics';

export default function Profile() {
  const { user, isLoading, isLoggedIn, checkSession } = useAuth0User();
  const toast = useToast();

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
    [toast]
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
    <Flex
      bgColor={'white'}
      p={5}
      borderRadius={{ md: 20 }}
      w={{ sm: '100%', md: '80%' }}
      flexDir="column"
      justifyContent={'center'}
      alignItems="center"
    >
      <Stack width={'100%'} spacing={5}>
        <HeaderInfo
          email={user?.email}
          bio={user?.user_metadata?.bio}
          onUpdateBio={updateBio}
          name={user?.name}
          profileImg={user?.picture}
        />
        <Tabs>
          <TabList>
            <Tab fontSize={14}>Contact Information</Tab>
            <Tab fontSize={14}>Award History</Tab>
            <Tab fontSize={14}>Contact Preferences</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ContactInfo
                contact_info={user?.user_metadata?.contact ?? {}}
                onUpdateContactInfo={updateContact}
              />
            </TabPanel>
            <TabPanel>None</TabPanel>
            <TabPanel>None</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Flex>
  );
}

Profile.displayName = 'Profile';
