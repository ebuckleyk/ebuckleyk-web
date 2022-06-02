import {
  SimpleGrid,
  GridItem,
  FormControl,
  Input,
  FormErrorMessage,
  FormLabel,
  Select
} from '@chakra-ui/react';
import { Field } from 'formik';
import * as Yup from 'yup';
import states from '../../utils/state_abbrev.json';

function AwardFormContactInformation({ values, isEditable }) {
  return (
    <SimpleGrid columns={{ sm: 1, md: 4 }} columnGap={3} rowGap={2}>
      <GridItem colSpan={{ sm: 1, md: 2 }}>
        <Field name="first_name">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled
                isRequired
                isInvalid={form.errors.first_name && form.touched.first_name}
              >
                <FormLabel htmlFor="first_name">First Name</FormLabel>
                <Input {...field} id="first_name" type="name" />
                <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 2 }}>
        <Field name="last_name">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled
                isRequired
                isInvalid={form.errors.last_name && form.touched.last_name}
              >
                <FormLabel htmlFor="last_name">Last Name</FormLabel>
                <Input {...field} id="last_name" type="name" />
                <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 2 }}>
        <Field name="email">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled
                isRequired
                isInvalid={form.errors.email && form.touched.email}
              >
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input {...field} id="email" type="email" />
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 2 }}>
        <Field name="phone">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled={!isEditable}
                isInvalid={form.errors.phone && form.touched.phone}
              >
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <Input {...field} id="phone" type="number" />
                <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
              </FormControl>
            );
          }}
        </Field>
      </GridItem>
      <GridItem colSpan={{ sm: 1, md: 3 }}>
        <Field name="addr1">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled={!isEditable}
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
                isDisabled={!isEditable}
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
      <GridItem colSpan={{ sm: 1, md: 2 }}>
        <Field name="city">
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled={!isEditable}
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
          {({ field, form }) => {
            return (
              <FormControl
                isDisabled={!isEditable}
                isInvalid={form.errors.state && form.touched.state}
              >
                <FormLabel htmlFor="state">State</FormLabel>
                <Select {...field} value={values.state} variant={'flushed'}>
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
                isDisabled={!isEditable}
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
    </SimpleGrid>
  );
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
AwardFormContactInformation.schema = {
  first_name: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Can be no longer than 50 characters')
    .required('Required')
    .nullable()
    .default(null),
  last_name: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Can be no longer than 50 characters')
    .required('Required')
    .nullable()
    .default(null),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .default(null),
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

export default AwardFormContactInformation;
