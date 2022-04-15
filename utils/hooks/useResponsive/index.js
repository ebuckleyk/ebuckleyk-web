import { useBreakpointValue } from '@chakra-ui/react';
export default function useResponsive() {
  const v = useBreakpointValue({
    sm: 'mobile',
    md: 'tablet',
    lg: 'desktop'
  });

  return {
    isMobile: v === 'mobile',
    isTablet: v === 'tablet',
    isDesktop: v === 'desktop'
  };
}
