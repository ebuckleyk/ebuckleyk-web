import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import Carousel from '../carousel';

function InfoCard({ text, subtext, style, to }) {
  return (
    <Box
      style={{ ...style }}
      position={'relative'}
      display={'flex'}
      width={'100%'}
      data-testid={text}
      justifyContent={'center'}
      alignItems="center"
      height={75}
      textAlign="center"
    >
      <Flex flexDir={'column'}>
        <Text fontSize={'lg'} color="white">
          {text}
        </Text>
        <Text fontSize={'sm'} color="lightblue">
          {subtext}
        </Text>
      </Flex>
    </Box>
  );
}

export default function InfoCardCarousel({ quickLinks = [] }) {
  return (
    <Box bg={'rgba(0, 0, 0, 0.1)'} pt={5} pb={5}>
      <Carousel autoPlay={false}>
        {quickLinks.map((l) => (
          <InfoCard
            key={l.href}
            to={l.href}
            text={l.label}
            subtext={l.subLabel}
          />
        ))}
      </Carousel>
    </Box>
  );
}
