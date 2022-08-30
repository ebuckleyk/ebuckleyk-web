import { Field } from 'formik';
import { FormControl, FormHelperText, Text } from '@chakra-ui/react';
export default function CaptchaField() {
  return (
    <Field name="captcha">
      {() => {
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
  );
}
