import NextImage from 'next/image';
import {
  Box,
  Button,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';

import { FaGithub } from 'react-icons/fa';
import RichText from '../richtext';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import GlassCard from '../glass_card';

export default function ProjectCard({ img, title, description, github }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return (
    <>
      <GlassCard
        p={5}
        pos={'relative'}
        width={{ sm: '100%' }}
        borderRadius={{ sm: 0, md: 20 }}
        as="article"
      >
        {img !== null ? (
          <Container width={100} height={100}>
            <NextImage
              width={100}
              height={100}
              src={img.url}
              layout="responsive"
            />
          </Container>
        ) : (
          <></>
        )}
        <Container>
          <Text fontSize="large" fontWeight="bold" align="center" isTruncated>
            {title}
          </Text>
          <RichText
            maxHeight={isSafari ? '90px' : undefined}
            overflow={isSafari ? 'hidden' : undefined}
            noOfLines={4}
          >
            {description.json}
          </RichText>
        </Container>
        <Flex justify={'flex-end'} alignItems="center">
          <Button
            display={github ? 'flex' : 'none'}
            as="a"
            target="_blank"
            href={github}
            variant={'ghost'}
            rightIcon={<ExternalLinkIcon />}
            leftIcon={<FaGithub />}
          >
            Github
          </Button>
          <Button as="a" onClick={onOpen} variant={'ghost'} color="blue.500">
            Read More
          </Button>
        </Flex>
      </GlassCard>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems={'center'}>
            <Text>{title}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RichText>{description.json}</RichText>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
