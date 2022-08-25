import { Progress } from '@chakra-ui/react';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { FormFieldType, FormG, FormGConfig } from '@ebuckleyk/form-g';
import CaptchaField from '../shared/captcha_field';
import stem_definition from '../../form_definitions/stem';
import bridges_definition from '../../form_definitions/bridges';
import community_definition from '../../form_definitions/community';
import states from '../../utils/state_abbrev.json';

const appForm_definition_lookup = {
  medical: bridges_definition,
  stem: stem_definition,
  community: community_definition
};

const getApplicationFormValues = (type, application) => {
  const { application_form: form, docs = [] } = application;

  const mapping = {
    medical: {
      institution: form.institution,
      gpa: Number(form.gpa),
      message:
        typeof form.message === 'string'
          ? [{ type: 'paragraph', text: form.message }]
          : form.message,
      attachments: docs
    },
    stem: {
      institution: form.institution,
      gpa: Number(form.gpa),
      message:
        typeof form.message === 'string'
          ? [{ type: 'paragraph', text: form.message }]
          : form.message,
      field_of_study: form.field_of_study,
      attachments: docs
    },
    community: {
      organization_name: form.organization_name,
      community_desc: form.community_desc,
      message:
        typeof form.message === 'string'
          ? [{ type: 'paragraph', text: form.message }]
          : form.message,
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
  application,
  isEditable = true,
  onSelectFile
}) {
  const initialValues = useMemo(() => {
    let default_values = {
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
  }, [user, application]);

  const form_definition = appForm_definition_lookup[appType];

  const config = new FormGConfig({
    isReadonly: !isEditable
  });
  config
    .addFooterItem(<CaptchaField key="captcha" />)
    .addFieldConfig('state_cfgKey', {
      valueConfig: {
        refetch: true,
        value: () =>
          [{ Abbrev: 99, Code: '', State: 'Select State...' }, ...states].map(
            (s) => ({ display: s.State, value: s.Code })
          )
      }
    })
    .configureFormFieldType(FormFieldType.FileUpload, {
      onClick: onSelectFile
    });

  return (
    <FormG
      submitLoadingText="Sending application..."
      submitText={application?._id ? 'Update Application' : 'Apply'}
      config={config}
      instance={initialValues}
      definition={form_definition}
      onSubmit={(values, actions) => {
        onSubmit({ ...values, appType }, () => actions.setSubmitting(false));
      }}
    />
  );
}
