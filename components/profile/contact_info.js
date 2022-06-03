import {
  Select,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Flex,
  Stack
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { useMemo } from 'react';
import * as Yup from 'yup';
import states from '../../utils/state_abbrev.json';

function ContactInfo({ onUpdateContactInfo, contact_info }) {
  const schema = useMemo(() => Yup.object().shape(ContactInfo.schema), []);
  const initValues = useMemo(
    () => ({
      ...schema.getDefault(),
      addr1: contact_info.address,
      addr2: contact_info.address2,
      city: contact_info.city,
      state: contact_info.state,
      zip: contact_info.zip,
      phone: contact_info.phone
    }),
    [schema, contact_info]
  );

  return (
    <Formik
      onSubmit={(values, actions) => {
        onUpdateContactInfo(values, () => actions.setSubmitting(false));
      }}
      validateOnMount
      enableReinitialize
      validationSchema={schema}
      initialValues={initValues}
    >
      {({ values, submitForm, errors, isValid, isSubmitting, dirty }) => {
        return (
          <Stack>
            <SimpleGrid columns={{ sm: 1, md: 4 }} columnGap={3} rowGap={2}>
              <GridItem colSpan={{ sm: 1, md: 3 }}>
                <Field name="addr1">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={form.errors.addr1 && form.touched.addr1}
                      >
                        <FormLabel htmlFor="addr1">Address 1</FormLabel>
                        <Input {...field} id="addr1" type="text" />
                        <FormErrorMessage>{form.errors.addr1}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
              </GridItem>
              <GridItem colSpan={1}>
                <Field name="addr2">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={form.errors.addr2 && form.touched.addr2}
                      >
                        <FormLabel htmlFor="addr2">Address 2</FormLabel>
                        <Input {...field} id="addr2" type="text" />
                        <FormErrorMessage>{form.errors.addr2}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
              </GridItem>
              <GridItem colSpan={1}>
                <Field name="city">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={form.errors.city && form.touched.city}
                      >
                        <FormLabel htmlFor="city">City</FormLabel>
                        <Input {...field} id="city" type="city" />
                        <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
              </GridItem>
              <GridItem colSpan={1}>
                <Field name="state">
                  {({ field }) => {
                    return (
                      <FormControl>
                        <FormLabel htmlFor="state">State</FormLabel>
                        <Select {...field} value={values.state}>
                          {[{ Abbrev: 99, Code: '' }, ...states].map((s) => {
                            return (
                              <option key={s.Abbrev} value={s.Code}>
                                {s.Code || '---'}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>
                    );
                  }}
                </Field>
              </GridItem>
              <GridItem colSpan={1}>
                <Field name="zip">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={form.errors.zip && form.touched.zip}
                      >
                        <FormLabel htmlFor="zip">Zip</FormLabel>
                        <Input {...field} id="zip" type="zip" />
                        <FormErrorMessage>{form.errors.zip}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
              </GridItem>
              <GridItem colSpan={1}>
                <Field name="phone">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={form.errors.phone && form.touched.phone}
                      >
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <Input {...field} id="phone" type="phone" />
                        <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
              </GridItem>
            </SimpleGrid>
            <Flex justifyContent={'flex-end'}>
              <Button
                onClick={submitForm}
                flex={{ sm: 1, md: 'none' }}
                visibility={dirty ? 'visible' : 'hidden'}
              >
                Update
              </Button>
            </Flex>
          </Stack>
        );
      }}
    </Formik>
  );
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
ContactInfo.schema = {
  addr1: Yup.string()
    .min(5, 'Must be at least 5 characters')
    .max(100, 'Can be no longer than 100 characters')
    .nullable()
    .default(null),
  addr2: Yup.string()
    .max(50, 'Can be no longer than 100 characters')
    .nullable()
    .default(null),
  city: Yup.string()
    .when('addr1', {
      is: (addr1) => !addr1,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema
          .min(3, 'Must be at least 3 characters')
          .required("City can't be null")
    })
    .nullable()
    .default(null),
  state: Yup.string()
    .when('city', {
      is: (city) => !city,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.min(2).max(3).required('State is required.')
    })
    .default(''),
  zip: Yup.string()
    .when('state', {
      is: (state) => !state,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.min(5).max(10).required()
    })
    .nullable()
    .default(null),
  phone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .default(null)
    .nullable()
};
export default ContactInfo;
