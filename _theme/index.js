import { extendTheme, theme } from '@chakra-ui/react';
import { withProse } from '@nikolovlazar/chakra-ui-prose';

const glassStyle = {
  backdropFilter: 'blur(10px) saturate(100%)',
  bgColor: 'rgba(255, 255, 255, .75)'
};
const breakpoints = {
  sm: '360px',
  md: '768px',
  lg: '1200px',
  xl: '1200px',
  '2xl': '1536px'
};

export default extendTheme(
  {
    ...theme,
    components: {
      ...theme.components,
      GlassCard: {
        baseStyle: {
          ...glassStyle,
          boxShadow: 'xl'
        }
      },
      Select: {
        ...theme.components.Select,
        defaultProps: {
          ...theme.components.Select.defaultProps,
          variant: 'filled'
        }
      },
      Input: {
        ...theme.components.Input,
        defaultProps: {
          ...theme.components.Input.defaultProps,
          variant: 'filled'
        }
      },
      Textarea: {
        ...theme.components.Textarea,
        defaultProps: {
          ...theme.components.Textarea.defaultProps,
          variant: 'filled'
        }
      },
      Editable: {
        ...theme.components.Editable,
        baseStyle: {
          ...theme.components.Editable.baseStyle,
          textarea: {
            ...theme.components.Editable.baseStyle.textarea,
            bgColor: 'white'
          }
        }
      },
      Menu: {
        ...theme.components.Menu,
        baseStyle: {
          menu: {},
          item: {
            ...theme.components.Menu.baseStyle.item
          },
          list: {
            ...theme.components.Menu.baseStyle.list,
            ...glassStyle,
            bgColor: 'rgba(255, 255, 255, .9)',
            boxShadow: 'xl'
          }
        }
      },
      Popover: {
        ...theme.components.Popover,
        baseStyle: {
          ...theme.components.Popover.baseStyle,
          content: {
            ...theme.components.Popover.baseStyle.content,
            ...glassStyle,
            bgColor: 'rgba(255, 255, 255, .8)',
            boxShadow: 'xl'
          }
        }
      }
    },
    breakpoints
  },
  withProse({
    baseStyle: {
      ...glassStyle,
      padding: 5
    }
  })
);
