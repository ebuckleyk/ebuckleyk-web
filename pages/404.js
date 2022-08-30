import { Box } from '@chakra-ui/react';
import NextImage from 'next/image';

export default function Custom404() {
  return (
    <Box>
      <NextImage
        style={{ borderRadius: 50 }}
        height={300}
        width={500}
        src="/images/404.gif"
      />
    </Box>
  );
}
