import {
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Textarea
} from '@chakra-ui/react';
import { Field } from 'formik';
import * as Yup from 'yup';
import FileUpload from '../../shared/file_upload';
import * as utils from '../../../utils';
import { getAwardCampaignApplicationDocS3Format } from '../../../utils/api/helper';

/**
 * This should go away in future iterations as forms will be generated dynamically
 */
function CareerInSTEM({ values, setFieldValue, activeCampaignId }) {
  const onAddAttachments = (files) => {
    setFieldValue('attachments', files);
  };

  const prefix = getAwardCampaignApplicationDocS3Format(activeCampaignId);

  return (
    <SimpleGrid columns={{ sm: 1, md: 4 }} columnGap={3} rowGap={2}>
      <GridItem colSpan={{ sm: 1, md: 3 }}>
        <Field name="institution">
          {({ field, form }) => {
            return (
              <FormControl
                isRequired
                isInvalid={form.errors.institution && form.touched.institution}
              >
                <FormLabel htmlFor="institution">Institution</FormLabel>
                <Input {...field} id="institution" type="text" />
                <FormHelperText>
                  The High School or College attending or planning to attend
                </FormHelperText>
                <FormErrorMessage>{form.errors.institution}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={1}>
        <Field name="gpa">
          {({ field, form }) => {
            return (
              <FormControl isInvalid={form.errors.gpa && form.touched.gpa}>
                <FormLabel htmlFor="gpa">GPA</FormLabel>
                <Input {...field} id="gpa" type="number" />
                <FormErrorMessage>{form.errors.gpa}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 4 }}>
        <Field name="field_of_study">
          {({ field, form }) => {
            return (
              <FormControl
                isRequired
                isInvalid={
                  form.errors.field_of_study && form.touched.field_of_study
                }
              >
                <FormLabel htmlFor="field_of_study">Field of Study</FormLabel>
                <Input {...field} id="field_of_study" type="text" />
                <FormErrorMessage>
                  {form.errors.field_of_study}
                </FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 4 }}>
        <Field name="message">
          {({ field, form }) => {
            return (
              <FormControl
                isInvalid={form.errors.message && form.touched.message}
              >
                <FormLabel htmlFor="message">Message</FormLabel>
                <Textarea {...field} id="message" type="text" />
                <FormHelperText>
                  {'Any additional information that you would like to provide.'}
                </FormHelperText>
                <FormErrorMessage>{form.errors.message}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 4 }}>
        <FileUpload
          values={values}
          onAddFiles={onAddAttachments}
          prefix={prefix}
        />
      </GridItem>
    </SimpleGrid>
  );
}

CareerInSTEM.schema = {
  institution: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Can be no longer than 50 characters')
    .required('Required')
    .nullable()
    .default(null),
  gpa: Yup.number().test('is-decimal', 'invalid decimal', (value) =>
    (value + '').match(/^\d*\.{1}\d*$/)
  ),
  field_of_study: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Can be no longer than 50 characters')
    .required('Required')
    .nullable()
    .default(null),
  message: Yup.string()
    .max(250, 'Must be no longer than 250 characters')
    .nullable()
    .default(null),
  attachments: Yup.array()
    .max(3, 'Only a max of 3 files can be uploaded')
    .min(1, 'There should be at least 1 doc submitted with this application')
    .nullable()
    .test(
      'is-correct-size',
      'VALIDATION_FILE_SIZE_TOO_BIG',
      utils.filepond_validateCorrectFileSize
    )
    .test(
      'is-correct-type',
      'VALIDATION_WRONG_FILE_TYPE',
      utils.filepond_validateCorrectFileType
    )
    .default(null)
};

export default CareerInSTEM;
