import { extendTheme, theme } from '@chakra-ui/react';
import { withProse } from '@nikolovlazar/chakra-ui-prose';

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
          backdropFilter: 'blur(10px) saturate(100%)',
          bgColor: 'rgba(255, 255, 255, .75)',
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
      }
    },
    breakpoints
  },
  withProse({
    baseStyle: {
      backdropFilter: 'blur(10px) saturate(100%)',
      bgColor: 'rgba(255, 255, 255, .75)',
      padding: 5
    }
  })
);
