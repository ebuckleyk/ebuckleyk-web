import contactForm from './partial_award_contact';

const stem = {
  version: 0.1,
  spec: { columns: 4, rows: 8 },
  sections: {
    eligibility: {
      friendlyName: 'Eligibility',
      sortOrder: 0,
      collapsible: true,
      fields: {
        institution: {
          name: 'Institution',
          type: 'text',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 2 },
          helperText:
            'The High School or College attending or planning to attend',
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
        field_of_study: {
          name: 'Field of Study',
          type: 'text',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 1 },
          helperText: 'What field are you studying or plan on studying?',
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
        gpa: {
          name: 'GPA',
          type: 'decimal',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 1 },
          validators: {
            'max-validator': {
              name: 'max-validator',
              value: 4,
              message: 'Must be on a 4.0 scale'
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
              value: 250,
              message: 'Message can be no longer than 250 characters'
            }
          }
        },
        attachments: {
          name: 'Attachments',
          type: 'fileupload',
          spec: { rowNumber: 0, columnOrder: 0, columnSpan: 4 },
          helperText: 'Only *.pdf, *.doc and *.docx files are accepted.',
          validators: {
            'min-validator': {
              name: 'min-validator',
              value: 1,
              message:
                'There should be at least 1 doc submitted with this application'
            },
            'max-validator': {
              name: 'max-validator',
              value: 3,
              message: 'Only a max of 3 documents can be supplied'
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

export default stem;
