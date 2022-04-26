import { Flex, useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import ContactForm from '../../components/contact_form';
import { GA, EVENTS } from '../../utils/analytics';
import { withCaptcha } from '../../utils/api/helper';

export default function Contact() {
  const toast = useToast();

  const onSubmitInfo = useCallback(
    async (formInfo, done) => {
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
          done();
        }
      });
    },
    [toast]
  );

  return (
    <Flex w={{ sm: '100%', md: '80%' }} flexDir={'column'}>
      <ContactForm onSubmit={onSubmitInfo} />
    </Flex>
  );
}

Contact.displayName = 'Contact';
