import {
  Stack,
  Button,
  Flex,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useMemo } from 'react';
import * as Yup from 'yup';
import BridgesMedicalAwardForm from './award_specific/bridges_medical_award';
import AwardFormContactInformation from './contact_info';
import CareerInSTEM from './award_specific/career_in_stem';
import CaptchaField from '../shared/captcha_field';

const application_form_lookup = {
  medical: BridgesMedicalAwardForm,
  stem: CareerInSTEM
};

const getApplicationFormValues = (type, application) => {
  const { application_form: form, docs = [] } = application;

  const mapping = {
    medical: {
      institution: form.institution,
      gpa: Number(form.gpa),
      message: form.message,
      attachments: docs
    },
    stem: {
      institution: form.institution,
      gpa: Number(form.gpa),
      message: form.message,
      field_of_study: form.field_of_study,
      attachments: docs
    }
  };
  return mapping[type];
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

export default function AwardForm({
  onSubmit,
  appType,
  user,
  activeCampaignId,
  application,
  isEditable = true,
  onSelectFile
}) {
  const application_schema = useMemo(() => {
    return Yup.object().shape({
      ...AwardFormContactInformation.schema,
      ...application_form_lookup[appType].schema
    });
  }, [appType]);

  const initialValues = useMemo(() => {
    let default_values = {
      ...application_schema.getDefault(),
      first_name: user?.given_name,
      last_name: user?.family_name,
      email: user?.email,
      phone: application
        ? application.contact_info?.phone
        : user?.user_metadata?.contact?.phone,
      addr1: application
        ? application.contact_info?.addr
        : user?.user_metadata?.contact?.address,
      addr2: application
        ? application.contact_info?.addr2
        : user?.user_metadata?.contact?.address2,
      city: application
        ? application.contact_info?.city
        : user?.user_metadata?.contact?.city,
      state: application
        ? application.contact_info?.state
        : user?.user_metadata?.contact?.state,
      zip: application
        ? application.contact_info?.zip
        : user?.user_metadata?.contact?.zip
    };

    if (application) {
      default_values = {
        ...default_values,
        ...getApplicationFormValues(application.award.category, application)
      };
    }

    return default_values;
  }, [application_schema, user, application]);

  const AppForm = useMemo(() => application_form_lookup[appType], [appType]);
  return (
    <Formik
      onSubmit={(values, actions) => {
        onSubmit({ ...values, appType }, () => actions.setSubmitting(false));
      }}
      validateOnMount
      enableReinitialize
      initialValues={initialValues}
      validationSchema={application_schema}
    >
      {({ values, errors, isValid, isSubmitting, setFieldValue, dirty }) => {
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
                  <AppForm
                    {...{
                      values,
                      setFieldValue,
                      activeCampaignId,
                      userId: user?.user_id,
                      isEditable,
                      onSelectFile
                    }}
                  />
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
                  <AwardFormContactInformation
                    {...{ values, errors, user, isEditable }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <CaptchaField />
            <Flex
              visibility={dirty ? 'visible' : 'hidden'}
              justifyContent={'flex-end'}
            >
              <Button
                isDisabled={!isEditable}
                isLoading={isSubmitting}
                loadingText={'Sending application...'}
                disabled={!isValid}
                width={{ sm: '100%', lg: 'fit-content' }}
                type="submit"
              >
                {application?._id ? 'Update Application' : 'Apply'}
              </Button>
            </Flex>
          </Stack>
        );
      }}
    </Formik>
  );
}
