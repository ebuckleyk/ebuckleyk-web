import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaRegEnvelope
} from 'react-icons/fa';
import {
  IconButton,
  HStack,
  Box,
  Avatar,
  Text,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  AccordionIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent
} from '@chakra-ui/react';
import NextImage from 'next/image';
import settings from '../../app.settings.json';

export default function HomeCard({}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box bg="rgba(0, 0, 0, 0.4)" width="100%" maxHeight={'300px'}>
        <Flex
          padding={2}
          justifyContent={'center'}
          alignItems="center"
          flexDirection={{ sm: 'column', md: 'column', lg: 'row' }}
        >
          <Avatar
            cursor={'pointer'}
            onClick={onOpen}
            size="xl"
            name="Emmanuel K. Buckley"
            src="/images/ebuckleyk.jpg"
          />
          <Accordion width="100%" allowToggle defaultIndex={0}>
            <AccordionItem border={'none'}>
              <AccordionButton flexDirection={'row'} justifyContent="center">
                <Text color="white" fontSize="2xl" textAlign={'center'}>
                  Emmanuel K. Buckley
                </Text>
                <AccordionIcon position="absolute" color="white" right={10} />
              </AccordionButton>
              <AccordionPanel
                pb={4}
                justifyContent="center"
                textAlign={'center'}
              >
                <Text
                  color="white"
                  fontStyle={'italic'}
                  fontSize={{ sm: 'sm' }}
                >
                  Developer. Entrepreneur. Consultant.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <HStack display={'flex'} spacing="2" justifyContent={'center'}>
              <IconButton
                as="a"
                target={'_blank'}
                href={settings.social_media.facebook.url}
                size={'sm'}
                colorScheme={'facebook'}
                aria-label="Follow me on Facebook"
                icon={<FaFacebook />}
              />
              <IconButton
                as="a"
                target={'_blank'}
                href={settings.social_media.instagram.url}
                size={'sm'}
                aria-label="Follow me on Instagram"
                colorScheme={'purple'}
                icon={<FaInstagram />}
              />
              <IconButton
                as="a"
                target={'_blank'}
                href={settings.social_media.twitter.url}
                size={'sm'}
                aria-label="Follow me on Twitter"
                colorScheme={'twitter'}
                icon={<FaTwitter />}
              />
              <IconButton
                as="a"
                href={settings.social_media.email.url}
                size={'sm'}
                colorScheme={'messenger'}
                aria-label="Contact me"
                icon={<FaRegEnvelope />}
              />
            </HStack>
          </Accordion>
        </Flex>
      </Box>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={50} boxShadow="xl">
          <NextImage
            style={{ borderRadius: 50 }}
            quality={100}
            width={350}
            height={350}
            src="/images/ebuckleyk.jpg"
          />
        </ModalContent>
      </Modal>
    </>
  );
}
