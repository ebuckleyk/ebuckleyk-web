import {
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import { Field } from 'formik';
import * as Yup from 'yup';
import FileUpload from '../../shared/file_upload';
import * as utils from '../../../utils';

/**
 * This should go away in future iterations as forms will be generated dynamically
 */
function BridgesMedicalAwardForm({ values }) {
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
              <FormControl
                isRequired
                isInvalid={form.errors.gpa && form.touched.gpa}
              >
                <FormLabel htmlFor="gpa">GPA</FormLabel>
                <NumberInput precision={1} max={4.0}>
                  <NumberInputField {...field} id="gpa" />
                </NumberInput>
                <FormErrorMessage>{form.errors.gpa}</FormErrorMessage>
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
        <FileUpload {...{ values }} />
      </GridItem>
    </SimpleGrid>
  );
}

BridgesMedicalAwardForm.schema = {
  institution: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Can be no longer than 50 characters')
    .required('Required')
    .nullable()
    .default(null),
  gpa: Yup.number()
    .test('is-decimal', 'Should be decimal (x.x)', (value) =>
      (value + '').match(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/)
    )
    .required('Required'),
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
export default BridgesMedicalAwardForm;
