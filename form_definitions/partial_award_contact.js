const contactForm = {
  contact: {
    friendlyName: 'Contact Information',
    sortOrder: 0,
    collapsible: true,
    fields: {
      first_name: {
        name: 'First Name',
        type: 'text',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 2 },
        validators: {
          'min-validator': {
            name: 'min-validator',
            value: 2,
            message: 'First name must be at least 2 characters'
          },
          'max-validator': {
            name: 'max-validator',
            value: 50,
            message: 'First name can be no longer than 50 characters'
          },
          'is_required-validator': {
            name: 'is_required-validator',
            value: true,
            message: 'Required'
          }
        },
        rules: ['disable-if-value-set']
      },
      last_name: {
        name: 'Last Name',
        type: 'text',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 2 },
        validators: {
          'min-validator': {
            name: 'min-validator',
            value: 2,
            message: 'Last name must be at least 2 characters'
          },
          'max-validator': {
            name: 'max-validator',
            value: 50,
            message: 'Last name can be no longer than 50 characters'
          },
          'is_required-validator': {
            name: 'is_required-validator',
            value: true,
            message: 'Required'
          }
        },
        rules: ['disable-if-value-set']
      },
      email: {
        name: 'Email address',
        type: 'email',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 2 },
        validators: {
          'is_required-validator': {
            name: 'is_required-validator',
            value: true,
            message: 'Required'
          }
        },
        rules: ['disable-if-value-set']
      },
      phone: {
        name: 'Phone',
        type: 'phone',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 2 },
        validators: {}
      },
      addr1: {
        name: 'Address',
        type: 'text',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 3 },
        validators: {
          'min-validator': {
            name: 'min-validator',
            value: 5,
            message: 'Address must be at least 5 characters'
          },
          'max-validator': {
            name: 'max-validator',
            value: 100,
            message: 'Address can be no longer than 100 characters'
          }
        }
      },
      addr2: {
        name: 'Address 2',
        type: 'text',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 1 },
        validators: {
          'max-validator': {
            name: 'max-validator',
            value: 50,
            message: 'Can be no longer than 50 characters'
          }
        }
      },
      city: {
        name: 'City',
        type: 'text',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 2 },
        validators: {
          'min-validator': {
            name: 'min-validator',
            value: 3,
            message: 'City must be at least 3 characters',
            depends_on: {
              fields: 'addr1',
              operation: 'isdef',
              condition: ''
            }
          },
          'is_required-validator': {
            name: 'is_required-validator',
            value: true,
            message: 'Required',
            depends_on: {
              fields: 'addr1',
              operation: 'isdef',
              condition: ''
            }
          }
        }
      },
      state: {
        name: 'State',
        type: 'select',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 1 },
        configkey: 'state_cfgKey',
        validators: {
          'min-validator': {
            name: 'min-validator',
            value: 2,
            message: '',
            depends_on: {
              fields: 'city',
              operation: 'isdef',
              condition: ''
            }
          },
          'max-validator': {
            name: 'max-validator',
            value: 3,
            message: '',
            depends_on: {
              fields: 'city',
              operation: 'isdef',
              condition: ''
            }
          },
          'is_required-validator': {
            name: 'is_required-validator',
            value: true,
            message: 'Required',
            depends_on: {
              fields: 'city',
              operation: 'isdef',
              condition: ''
            }
          }
        }
      },
      zip: {
        name: 'Zip',
        type: 'text',
        spec: { rowNumber: 1, columnOrder: 0, columnSpan: 1 },
        validators: {
          'min-validator': {
            name: 'min-validator',
            value: 5,
            message: '',
            depends_on: {
              fields: 'state',
              operation: 'isdef',
              condition: ''
            }
          },
          'max-validator': {
            name: 'max-validator',
            value: 10,
            message: '',
            depends_on: {
              fields: 'state',
              operation: 'isdef',
              condition: ''
            }
          },
          'is_required-validator': {
            name: 'is_required-validator',
            value: true,
            message: 'Required',
            depends_on: {
              fields: 'state',
              operation: 'isdef',
              condition: ''
            }
          }
        }
      }
    }
  }
};

export default contactForm;
