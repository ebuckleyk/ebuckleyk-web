import {
  FormControl,
  Textarea,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  Button,
  Flex,
  Box,
  Select,
  Text
} from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { CONTACT_TYPE } from '../../utils/constants';

const initialValues = {
  name: '',
  email: '',
  message: '',
  inqType: CONTACT_TYPE.GENERAL
};

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Name can be no longer than 50 characters')
    .required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string()
    .min(25, 'Message must be at least 25 characters')
    .max(500, "Message can't be longer than 500 characters")
    .required('Message is required')
});

export default function ContactForm({ onSubmit }) {
  return (
    <Box p={5} borderRadius={{ md: 20 }} bgColor="white">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          onSubmit(values, () => actions.setSubmitting(false));
        }}
      >
        {({ values, isValid, isSubmitting, ...rest }) => {
          const { inqType, name, email, message } = values;
          return (
            <Stack spacing={5} as={Form}>
              <Field name="inqType">
                {({ field }) => {
                  return (
                    <FormControl>
                      <FormLabel htmlFor="inqType">Type of Inquiry</FormLabel>
                      <Select {...field} value={inqType} variant={'flushed'}>
                        <option value={CONTACT_TYPE.GENERAL}>
                          General Inquiry
                        </option>
                        <option value={CONTACT_TYPE.CONSULT}>Consulting</option>
                      </Select>
                    </FormControl>
                  );
                }}
              </Field>
              <Field name="name">
                {({ field, form }) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input {...field} id="name" type="name" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>
              <Field name="email">
                {({ field, form }) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.email && form.touched.email}
                    >
                      <FormLabel htmlFor="email">Email address</FormLabel>
                      <Input {...field} id="email" type="email" />
                      <FormHelperText>
                        Your email will not be shared
                      </FormHelperText>
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>
              <Field name="message">
                {({ field, form }) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.message && form.touched.message}
                    >
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <Textarea {...field} id="message" type="message" />
                      <FormErrorMessage>{form.errors.message}</FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>
              <Field name="captcha">
                {({ field, form }) => {
                  return (
                    <FormControl>
                      <FormHelperText>
                        {'This site is protected by reCAPTCHA and the Google '}
                        <Text
                          color="blue.400"
                          as="a"
                          target="_blank"
                          href="https://policies.google.com/privacy"
                        >
                          Privacy Policy
                        </Text>
                        {' and '}
                        <Text
                          color="blue.400"
                          as="a"
                          target="_blank"
                          href="https://policies.google.com/terms"
                        >
                          Terms of Service
                        </Text>{' '}
                        apply.
                      </FormHelperText>
                    </FormControl>
                  );
                }}
              </Field>
              <Flex justifyContent={'flex-end'}>
                <Button
                  isLoading={isSubmitting}
                  loadingText={'Sending contact information...'}
                  disabled={
                    !name || !email || !message || !isValid || isSubmitting
                  }
                  width={{ sm: '100%', lg: 'fit-content' }}
                  type="submit"
                >
                  Submit
                </Button>
              </Flex>
            </Stack>
          );
        }}
      </Formik>
    </Box>
  );
}
