import NextImage from 'next/image';
import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import RichText from '../../richtext';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { EVENTS, GA } from '../../../utils/analytics';

function CardImage({ img }) {
  if (!img || !img?.url) return null;

  return (
    <Container width={100} height={100}>
      <NextImage width={100} height={100} src={img.url} layout="responsive" />
    </Container>
  );
}

function CardTitle({ title }) {
  if (!title) return null;
  return (
    <Container>
      <Text align="center" fontWeight={'bold'} fontSize={'large'}>
        {title}
      </Text>
    </Container>
  );
}

function CardContent({ isPreview, content, isRichText }) {
  if (!content) return null;
  const Content = isRichText ? RichText : Text;
  return (
    <Content noOfLines={isPreview ? 4 : Infinity}>
      {isRichText ? content.json : content}
    </Content>
  );
}

function Footer({ navigateTo, navEvent }) {
  const router = useRouter();

  const navigate = useCallback(
    (e) => {
      e.preventDefault();
      GA.event(navEvent);
      router.push(navigateTo);
    },
    [navigateTo, router, navEvent]
  );

  if (!navigateTo) return null;
  return (
    <Flex justify={'flex-end'} alignItems="center">
      <Button as="a" onClick={navigate} variant="ghost" color="blue.500">
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
  return (
    <Box
      bgColor={'white'}
      opacity={0.8}
      _hover={{
        opacity: 1
      }}
      cursor={'pointer'}
      onClick={() => {}}
      position={'relative'}
      p={5}
      width={{ sm: '100%' }}
      borderRadius={{ sm: 0, md: 20 }}
      as="article"
    >
      <CardImage img={img} />
      <CardTitle title={title} />
      <CardContent {...{ isRichText, content, isPreview }} />
      <Footer navigateTo={navigateTo} navEvent={gaEvent} />
      {children}
    </Box>
  );
}
