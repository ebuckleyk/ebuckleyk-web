import { Box, useStyleConfig } from '@chakra-ui/react';

export default function GlassCard({ variant, ...rest }) {
  const styles = useStyleConfig('GlassCard', { variant });
  return <Box __css={styles} {...rest} />;
}
