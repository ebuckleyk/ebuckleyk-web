import { Flex, useToast } from '@chakra-ui/react';
import ContactForm from '../../components/contact_form';

export default function Contact() {
  const toast = useToast();

  const onSubmitInfo = async (formInfo, done) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formInfo)
      });

      if (response.status !== 200) throw new Error();

      toast({
        title: 'Information Sent!',
        description: 'I should be in contact soon.',
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
  };
  return (
    <Flex w={{ sm: '100%', md: '80%' }} flexDir={'column'}>
      <ContactForm onSubmit={onSubmitInfo} />
    </Flex>
  );
}

Contact.displayName = 'Contact';
