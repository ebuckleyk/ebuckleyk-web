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
  Progress,
  SimpleGrid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Text
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { useMemo } from 'react';
import * as Yup from 'yup';
import BridgesMedicalAwardForm from './award_specific/bridges_medical_award';
import AwardFormContactInformation from './contact_info';
import CareerInSTEM from './award_specific/career_in_stem';

const application_form_lookup = {
  bridges: BridgesMedicalAwardForm,
  stem: CareerInSTEM
};

function PercentComplete({ values, errors }) {
  const progressPerc = useMemo(() => {
    const totalFields = Object.keys(values);
    const nonEmptyFields = totalFields.filter((x) => {
      return (
        (Array.isArray(values[x]) ? values[x].length : values[x]) && !errors[x]
      );
    });

    return (nonEmptyFields.length / totalFields.length) * 100;
  }, [values, errors]);

  return (
    <Progress
      colorScheme={progressPerc === 100 ? 'green' : 'cyan'}
      size={'sm'}
      my={5}
      hasStripe={progressPerc !== 100}
      isAnimated={progressPerc !== 100}
      value={progressPerc}
    />
  );
}

export default function AwardForm({ onSubmit, appType }) {
  const application_schema = useMemo(() => {
    return Yup.object().shape({
      ...AwardFormContactInformation.schema,
      ...application_form_lookup[appType].schema
    });
  }, [appType]);

  const initialValues = useMemo(
    () => application_schema.getDefault(),
    [application_schema]
  );
  const AppForm = useMemo(() => application_form_lookup[appType], [appType]);
  return (
    <Formik
      onSubmit={(values, actions) => {
        onSubmit({ ...values, appType }, () => actions.setSubmitting(false));
      }}
      validateOnMount
      initialValues={initialValues}
      validationSchema={application_schema}
    >
      {({ values, errors, isValid, isSubmitting, setFieldValue }) => {
        return (
          <Stack spacing={5} as={Form}>
            <PercentComplete {...{ values, errors }} />
            <Accordion defaultIndex={[0, 1]} allowMultiple>
              <AccordionItem>
                <AccordionButton bgColor="blue.50">
                  <Box flex="1" textAlign={'left'}>
                    Eligibility
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <AppForm {...{ values, setFieldValue }} />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton bgColor="blue.50">
                  <Box flex="1" textAlign={'left'}>
                    Contact Information
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <AwardFormContactInformation {...{ values, errors }} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
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
            <Flex justifyContent={'flex-end'}>
              <Button
                isLoading={isSubmitting}
                loadingText={'Sending application...'}
                disabled={!isValid}
                width={{ sm: '100%', lg: 'fit-content' }}
                type="submit"
              >
                Apply
              </Button>
            </Flex>
          </Stack>
        );
      }}
    </Formik>
  );
}
