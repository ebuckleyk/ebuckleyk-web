const contactMe = {
  version: 0.1,
  spec: {
    columns: 4,
    rows: 3
  },
  sections: {
    contact: {
      shouldDisplayHeader: false,
      friendlyName: 'Contact',
      sortOrder: 0,
      collapsible: true,
      fields: {
        inqType: {
          name: 'Type of Inquiry',
          type: 'select',
          value: [
            { display: 'General Inquiry', value: 'general' },
            { display: 'Consulting', value: 'consult' }
          ],
          spec: {
            rowNumber: 0,
            columnOrder: 0,
            columnSpan: 4
          },
          validators: {
            'is_required-validator': {
              name: 'is_required-validator',
              value: true,
              message: 'Required'
            }
          }
        },
        name: {
          name: 'Name',
          type: 'text',
          spec: {
            rowNumber: 1,
            columnOrder: 1,
            columnSpan: 4
          },
          validators: {
            'is_required-validator': {
              name: 'is_required-validator',
              value: true,
              message: 'Required'
            },
            'min-validator': {
              name: 'min-validator',
              value: 2,
              message: 'Name must be at least 2 characters'
            },
            'max-validator': {
              name: 'max-validator',
              value: 50,
              message: 'Name can be no longer than 50 characters'
            }
          }
        },
        email: {
          name: 'Email address',
          type: 'email',
          spec: {
            rowNumber: 2,
            columnOrder: 1,
            columnSpan: 2
          },
          helperText: 'Your email will not be shared with 3rd parties',
          validators: {
            'is_required-validator': {
              name: 'is_required-validator',
              value: true,
              message: 'Required'
            }
          }
        },
        phone: {
          name: 'Phone',
          type: 'phone',
          spec: {
            rowNumber: 2,
            columnOrder: 1,
            columnSpan: 2
          },
          validators: {}
        },
        message: {
          name: 'Message',
          type: 'textarea',
          spec: {
            rowNumber: 3,
            columnOrder: 0,
            columnSpan: 4
          },
          validators: {
            'is_required-validator': {
              name: 'is_required-validator',
              value: true,
              message: 'Required'
            },
            'min-validator': {
              name: 'min-validator',
              value: 25,
              message: 'Message must be at least 25 characters'
            },
            'max-validator': {
              name: 'max-validator',
              value: 500,
              message: 'Message can be no longer than 500 characters'
            }
          }
        }
      }
    }
  }
};

export default contactMe;
