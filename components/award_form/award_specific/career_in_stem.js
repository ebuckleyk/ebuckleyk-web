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
import { Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import FileZone from '../../shared/file_zone';

/**
 * This should go away in future iterations as forms will be generated dynamically
 */
function CareerInSTEM({ isEditable, onSelectFile }) {
  return (
    <SimpleGrid columns={{ sm: 1, md: 4 }} columnGap={3} rowGap={2}>
      <GridItem colSpan={{ sm: 1, md: 3 }}>
        <Field name="institution">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled={!isEditable}
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
                isDisabled={!isEditable}
                isInvalid={form.errors.gpa && form.touched.gpa}
              >
                <FormLabel htmlFor="gpa">GPA</FormLabel>
                <NumberInput id="gpa" {...field} precision={1} max={4.0}>
                  <NumberInputField {...field} id="gpa" />
                </NumberInput>
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
                isDisabled={!isEditable}
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
                isDisabled={!isEditable}
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
        <FieldArray name="attachments">
          {({ form, remove }) => {
            return (
              <FormControl isRequired>
                <FormLabel>Attachments</FormLabel>
                <FileZone
                  onSelectFile={onSelectFile}
                  onRemoveFile={(file, idx) => {
                    const id = file._id;
                    if (id) {
                      const newAttachments = form.values.attachments.map((a) =>
                        a._id === id ? { ...a, isDeleted: true } : a
                      );
                      form.setFieldValue('attachments', newAttachments);
                    } else {
                      remove(idx);
                    }
                  }}
                  files={form.values.attachments}
                  onAddFiles={(files) =>
                    form.setFieldValue('attachments', [
                      ...form.values.attachments,
                      ...files
                    ])
                  }
                  isEditable={isEditable}
                />
              </FormControl>
            );
          }}
        </FieldArray>
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
    // .test(
    //   'is-correct-size',
    //   'VALIDATION_FILE_SIZE_TOO_BIG',
    //   utils.filepond_validateCorrectFileSize
    // )
    // .test(
    //   'is-correct-type',
    //   'VALIDATION_WRONG_FILE_TYPE',
    //   utils.filepond_validateCorrectFileType
    // )
    .default([])
};

export default CareerInSTEM;
