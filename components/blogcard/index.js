import NextImage from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useCallback } from 'react';
import {
  Box,
  Text,
  Container,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaBlog } from 'react-icons/fa';
import RichText from '../richtext';

const getConfig = (source) => {
  let IconType;
  let color = 'gray.400';
  let type;
  switch (source) {
    case 'facebook': {
      IconType = FaFacebook;
      color = '#3b5998';
      type = 'Facebook Post';
      break;
    }
    case 'twitter': {
      IconType = FaTwitter;
      color = '#1DA1F2';
      type = 'Tweet';
      break;
    }
    default:
      IconType = FaBlog;
  }
  return {
    icon: <Icon as={IconType} w={5} h={5} color={color} />,
    type
  };
};

export default function BlogCard({
  img,
  title,
  content,
  source,
  date,
  navigateTo
}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = getConfig(source);

  const linkProps = useMemo(() => {
    if (source !== 'blog') {
      return {
        as: 'a',
        target: '_blank',
        rel: 'noreferrer'
      };
    }
    return {};
  }, [source]);

  const navigate = useCallback(
    (e) => {
      e.preventDefault();
      router.push(navigateTo);
    },
    [navigateTo, router]
  );

  return (
    <>
      <Box
        bgColor={'white'}
        opacity={0.8}
        _hover={{
          opacity: 1
        }}
        cursor={'pointer'}
        onClick={source === 'blog' ? navigate : onOpen}
        position={'relative'}
        p={5}
        width={{ sm: '100%' }}
        borderRadius={{ sm: 0, md: 20 }}
        as="article"
      >
        {img && (
          <Container style={{ width: 100, height: 100 }}>
            <NextImage width={100} height={100} src={img} layout="responsive" />
          </Container>
        )}
        <Container>
          <Text
            fontSize="large"
            fontWeight={'bold'}
            align={'center'}
            isTruncated
          >
            {title}
          </Text>
          {source === 'blog' ? (
            <RichText noOfLines={3}>{content.json}</RichText>
          ) : (
            <Text noOfLines={2}>{content}</Text>
          )}
        </Container>
        <Box position={'absolute'} right={15} top={15}>
          {config.icon}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} alignItems="center">
            {config.icon}
            <Text marginLeft={3}>{config.type}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <NextLink href={navigateTo} passHref>
            <ModalBody
              bgColor={'white'}
              _hover={{
                bgColor: 'gray.50'
              }}
              {...linkProps}
            >
              <Text>{content}</Text>
            </ModalBody>
          </NextLink>
          <ModalFooter>
            <Text fontSize={'sm'}>{date}</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
