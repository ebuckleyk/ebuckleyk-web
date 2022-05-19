import NextImage from 'next/image';
import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import RichText from '../../richtext';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { EVENTS, GA } from '../../../utils/analytics';

function CardImage({ img }) {
  if (!img || !img?.url) return null;

  return (
    <Container
      boxShadow={'xl'}
      borderRadius={50}
      borderWidth={'2px'}
      width={200}
      height={200}
      pos="relative"
    >
      <NextImage objectFit="cover" src={img.url} layout="fill" />
    </Container>
  );
}

function CardTitle({ title }) {
  if (!title) return null;
  return (
    <Container mt={5}>
      <Text align="center" fontWeight={'bold'} fontSize={'large'}>
        {title}
      </Text>
    </Container>
  );
}

function CardContent({ isPreview, content, isRichText }) {
  if (!content) return null;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const Content = isRichText ? RichText : Text;
  return (
    <Content
      maxHeight={isSafari ? '90px' : undefined}
      overflow={isSafari ? 'hidden' : undefined}
      noOfLines={isPreview ? 4 : Infinity}
    >
      {content}
    </Content>
  );
}

function Footer({ onClick }) {
  if (!onClick) return null;
  return (
    <Flex justify={'flex-end'} alignItems="center">
      <Button as="a" onClick={onClick} variant="ghost" color="blue.500">
        View
      </Button>
    </Flex>
  );
}
export default function Card({
  children,
  img,
  title,
  content,
  navigateTo,
  gaEvent = EVENTS.VIEW_CARD,
  isPreview = true,
  isRichText = false
}) {
  const router = useRouter();

  const navigate = useCallback(
    (e) => {
      e.preventDefault();
      GA.event(gaEvent);
      router.push(navigateTo);
    },
    [navigateTo, router, gaEvent]
  );

  return (
    <Box
      bgColor={'white'}
      // opacity={0.8}
      _hover={{
        opacity: 1
      }}
      cursor={'pointer'}
      onClick={navigateTo ? navigate : () => {}}
      position={'relative'}
      p={5}
      width={{ sm: '100%' }}
      borderRadius={{ sm: 0, md: 20 }}
      as="article"
    >
      <CardImage img={img} />
      <CardTitle title={title} />
      <CardContent {...{ isRichText, content, isPreview }} />
      <Footer onClick={navigate} />
      {children}
    </Box>
  );
}
