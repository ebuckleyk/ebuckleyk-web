import contactForm from './partial_award_contact';

const community = {
  version: 0.1,
  spec: { columns: 4, rows: 8 },
  sections: {
    eligibility: {
      friendlyName: 'Eligibility',
      sortOrder: 0,
      collapsible: true,
      fields: {
        organization_name: {
          name: 'Organization Name',
          type: 'text',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 4 },
          helperText: 'The name of your organization (or your name)',
          validators: {
            'min-validator': {
              name: 'min-validator',
              value: 3,
              message: 'Organization name must be at least 3 characters'
            },
            'max-validator': {
              name: 'max-validator',
              value: 50,
              message: 'Organization name can be no longer than 50 characters'
            },
            'is_required-validator': {
              name: 'is_required-validator',
              value: true,
              message: 'Required'
            }
          }
        },
        community_desc: {
          name: 'Community Description',
          type: 'text',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 4 },
          helperText:
            "A brief description of the community you're contributing to or a part of.",
          validators: {
            'min-validator': {
              name: 'min-validator',
              value: 3,
              message: 'Institution must be at least 3 characters'
            },
            'max-validator': {
              name: 'max-validator',
              value: 50,
              message: 'Institution can be no longer than 50 characters'
            },
            'is_required-validator': {
              name: 'is_required-validator',
              value: true,
              message: 'Required'
            }
          }
        },
        message: {
          name: 'Message',
          type: 'richtext',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 4 },
          helperText:
            'Any additional information that you would like to provide.',
          validators: {
            'max-validator': {
              name: 'max-validator',
              value: 2000,
              message:
                'Message can be no longer than 2000 characters. Alternatively upload as a supporting document if needed.'
            }
          }
        },
        attachments: {
          name: 'Attachments',
          type: 'fileupload',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 4 },
          helperText: 'Only *.pdf, *.doc and *.docx files are accepted.',
          validators: {
            'max-validator': {
              name: 'max-validator',
              value: 6,
              message: 'Only a max of 6 documents can be supplied'
            },
            'fileType-validator': {
              name: 'fileType-validator',
              message: 'Only .pdf, .doc and .docx accepted',
              value: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              ]
            }
          }
        }
      }
    },
    contact: { ...contactForm.contact }
  }
};

export default community;
