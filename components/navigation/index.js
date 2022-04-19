import NextLink from 'next/link';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import settings from '../../app.settings.json';
import React from 'react';

/**
 * navigation structure
 * [{
 *  label: <label>,
 *  href: ''
 * }, {
 *  label: <label>,
 *  children: [{
 *    label: <label>,
 *    subLabel: <sub label>,
 *    href: '#'
 *  }]
 * }]
 */

const LinkWrapper = React.forwardRef(function T(props, ref) {
  const { href, children, ...rest } = props;
  return (
    <NextLink href={href} passHref>
      <Link ref={ref} {...rest}>
        {children}
      </Link>
    </NextLink>
  );
});

function MobileNavItem({ label, children, href }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={LinkWrapper}
        href={href ?? '#'}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none'
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          {children &&
            children.map((child) => {
              return (
                <LinkWrapper key={child.label} py={2} href={child.href}>
                  {child.label}
                </LinkWrapper>
              );
            })}
        </Stack>
      </Collapse>
    </Stack>
  );
}

function MobileNav() {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {settings.navigation.map((item) => {
        return <MobileNavItem key={item.label} {...item} />;
      })}
    </Stack>
  );
}

function DesktopSubNav({ label, href, subLabel }) {
  return (
    <LinkWrapper
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="pink.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </LinkWrapper>
  );
}

function DesktopNav() {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction="row" spacing={4}>
      {settings.navigation.map((item) => {
        return (
          <Box key={item.label}>
            <Popover trigger="hover" placement="bottom-start">
              <PopoverTrigger>
                <LinkWrapper
                  p={2}
                  href={item.href ?? '#'}
                  fontSize="sm"
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor
                  }}
                >
                  {item.label}
                </LinkWrapper>
              </PopoverTrigger>

              {item.children && (
                <PopoverContent
                  border={0}
                  boxShadow="xl"
                  bg={popoverContentBgColor}
                  p={4}
                  rounded="xl"
                  minW="sm"
                >
                  <Stack>
                    {item.children.map((child) => {
                      return <DesktopSubNav key={child.label} {...child} />;
                    })}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
}
function Overlay({ isOpen }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: -1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgb(0,0,0)',
        backgroundColor: 'rgba(0,0,0,0.4)'
      }}
    />
  );
}
/**
 *
 * @see https://chakra-templates.dev/navigation/navbar
 */
export default function Navigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box position={'absolute'} width="100%" zIndex={99}>
      <Overlay isOpen={isOpen} />
      <Flex
        bg={useColorModeValue('white', 'gray.600')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <LinkWrapper
            _hover={{
              textDecoration: 'none'
            }}
            href={'/'}
          >
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily="heading"
              color={useColorModeValue('gray.800', 'white')}
            >
              Emmanuel K. Buckley
            </Text>
          </LinkWrapper>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction={'row'}
          spacing={6}
        >
          <Button
            as="a"
            href="https://github.com/ebuckley23/ebuckleyk-web"
            target={'_blank'}
            leftIcon={<FaGithub />}
            variant="ghost"
          >
            Github
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}
