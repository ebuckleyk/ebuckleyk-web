import { Heading, Box, Flex, Text } from '@chakra-ui/react';
import NextImage from 'next/image';

export default function ConsultingCard({ companyName, companyLogo, website }) {
  return (
    <Box
      paddingTop={10}
      width={{ sm: '100%' }}
      borderRadius={{ sm: 0, md: 20 }}
      bgColor={'white'}
    >
      <NextImage
        width={300}
        height={100}
        layout="responsive"
        src={companyLogo}
      />
      <Flex p={5} alignItems="center" flexDir={'column'}>
        <Heading>{companyName}</Heading>
        <Text as={'a'} href={website} target="_blank">
          {website}
        </Text>
      </Flex>
    </Box>
  );
}
