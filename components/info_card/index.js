import React from 'react';
import NextLink from 'next/link';
import { Link, Flex, Text, Box } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import Carousel from '../carousel';
import settings from '../../app.settings.json';

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
      <NextLink href={to} passHref>
        <Link>
          <InfoOutlineIcon
            right={'25%'}
            top={5}
            position={'absolute'}
            fontSize={'lg'}
            color="white"
          />
        </Link>
      </NextLink>
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

export default function InfoCardCarousel() {
  return (
    <Box bg={'rgba(0, 0, 0, 0.1)'} pt={5} pb={5}>
      <Carousel>
        {settings.navigation
          .filter((x) => x.isQuickLink)
          .map((l) => (
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
