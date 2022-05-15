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
  { ...theme, breakpoints },
  withProse({
    baseStyle: {
      bgColor: 'white',
      padding: 5
    }
  })
);
