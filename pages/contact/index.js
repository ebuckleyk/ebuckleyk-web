import { Flex, useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { FormG, FormGConfig } from '@ebuckleyk/form-g';
import { GA, EVENTS } from '../../utils/analytics';
import { withCaptcha } from '../../utils/api/helper';
import contactMe from '../../form_definitions/contact_me';
import GlassCard from '../../components/glass_card';
import CaptchaField from '../../components/shared/captcha_field';
import useAuth0User from '../../utils/hooks/useAuth0User';
import { CONTACT_TYPE } from '../../utils/constants';

export default function Contact() {
  const toast = useToast();
  const { user } = useAuth0User();
  const config = new FormGConfig();
  config.addFooterItem(<CaptchaField />);

  const onSubmitInfo = useCallback(
    async (formInfo, formGActions) => {
      withCaptcha(async (token) => {
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...formInfo, captcha: token })
          });

          if (response.status !== 200) throw new Error();

          toast({
            title: 'Information Sent!',
            description: 'I should be in contact soon.',
            status: 'success',
            duration: 3000,
            isClosable: true
          });

          GA.event(EVENTS.SUBMIT_CONTACT_FORM);
        } catch (error) {
          toast({
            title: 'Error sending information',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        } finally {
          formGActions.setSubmitting(false);
        }
      });
    },
    [toast]
  );

  return (
    <Flex w={{ sm: '100%', md: '80%' }} flexDir={'column'}>
      <GlassCard p={5} borderRadius={{ md: 20 }}>
        <FormG
          instance={{
            inqType: CONTACT_TYPE.GENERAL,
            name:
              user?.given_name && user?.family_name
                ? `${user.given_name} ${user.family_name}`
                : undefined,
            email: user?.email,
            phone: user?.user_metadata?.contact?.phone
          }}
          config={config}
          definition={contactMe}
          onSubmit={onSubmitInfo}
        />
      </GlassCard>
    </Flex>
  );
}

Contact.displayName = 'Contact';
