import { Flex, Heading, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import AwardForm from '../../../components/award_form';
import {
  getPreSignedUrlDownload,
  handleAwardApplicationAttachments,
  withCaptcha
} from '../../../utils/api/helper';
import useAuth0User from '../../../utils/hooks/useAuth0User';

export default function Application({ router }) {
  const [application, setApplication] = useState();
  const { user } = useAuth0User();
  const toast = useToast();

  useEffect(() => {
    async function handle() {
      const response = await fetch(
        `/api/profile/application?applicationId=${router.query.applicationId}`
      );
      const data = await response.json();
      setApplication(data);
    }
    if (router.query.applicationId) {
      handle();
    }
  }, [router.query.applicationId]);

  const onSubmit = useCallback(
    async (form, done) => {
      withCaptcha(async (token) => {
        try {
          const attachments = await handleAwardApplicationAttachments(
            form.attachments ?? [],
            application.campaign_id
          );

          const postData = {
            ...form,
            campaignId: application.campaign_id,
            applicationId: application._id,
            attachments,
            captcha: token
          };

          const response = await fetch(`/api/awards/${application.award._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          });

          if (response.status !== 200) throw new Error();
          toast({
            title: 'Application Updated!',
            description: 'Thanks for updating your application.',
            status: 'success',
            duration: 1500,
            isClosable: true
          });
          setApplication(await response.json());
        } catch (error) {
          toast({
            title: 'Error updating application',
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
    [application, toast]
  );

  const onSelectFile = useCallback(async (file) => {
    const url = await getPreSignedUrlDownload(file.path, file.name);
    window.open(url.signedUrl, '_blank').focus();
  }, []);

  if (!application) return null;

  const isEditable = true; // application.status === 'received';
  return (
    <Flex
      bgColor={'white'}
      p={5}
      borderRadius={{ md: 20 }}
      w={{ sm: '100%', md: '80%' }}
      flexDir="column"
      justifyContent={'center'}
      alignItems="center"
      minH={{ sm: '100vh', md: 0 }}
    >
      <Heading fontSize={'lg'}>{application.award?.name}</Heading>
      <AwardForm
        onSubmit={onSubmit}
        isEditable={isEditable}
        user={user}
        application={application}
        appType={application.award.category}
        activeCampaignId={application.campaign_id}
        onSelectFile={onSelectFile}
      />
    </Flex>
  );
}
