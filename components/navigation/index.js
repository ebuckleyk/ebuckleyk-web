import React, { useEffect } from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon
} from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { FaGithub, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import settings from '../../app.settings.json';
import useAuth0User from '../../utils/hooks/useAuth0User';
import GlassCard from '../glass_card';
import Overlay from '../shared/overlay';

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

function MobileNavItem({
  label,
  children,
  href,
  isActiveRouteItem,
  activeRoute
}) {
  const { isOpen, onToggle } = useDisclosure();
  const activeStyle = isActiveRouteItem ? { backgroundColor: 'blue.100' } : {};
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        {...activeStyle}
        py={2}
        as={children ? 'span' : LinkWrapper} // parent tabs shouldn't close
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
          borderColor={useColorModeValue('gray.400', 'gray.700')}
          align="start"
        >
          {children &&
            children.map((child) => {
              const isActiveChild =
                activeRoute === child.href ||
                new RegExp(child.href, 'i').test(activeRoute);
              const cActiveChild = isActiveChild
                ? { borderBottomColor: 'blue.100', borderBottomWidth: 1 }
                : {};

              return (
                <LinkWrapper
                  width={'100%'}
                  {...cActiveChild}
                  key={child.label}
                  py={2}
                  href={child.href}
                >
                  {child.label}
                </LinkWrapper>
              );
            })}
        </Stack>
      </Collapse>
    </Stack>
  );
}

function MobileNav({ activeRoute }) {
  return (
    <GlassCard as={Stack} p={4} display={{ md: 'none' }}>
      {settings.navigation.map((item) => {
        const isActiveRouteItem =
          activeRoute === item.href ||
          new RegExp(item.label, 'i').test(activeRoute);

        return (
          <MobileNavItem
            key={item.label}
            {...{
              ...item,
              isActiveRouteItem,
              activeRoute
            }}
          />
        );
      })}
    </GlassCard>
  );
}

function DesktopSubNav({ label, href, subLabel, activeRoute }) {
  const isActive = href === activeRoute;
  return (
    <LinkWrapper
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'sm'}
      bgColor={isActive ? 'blue.50' : ''}
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.400' }}
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

function DesktopNav({ activeRoute }) {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction="row" spacing={4}>
      {settings.navigation.map((item) => {
        const activeStyle =
          activeRoute === item.href ||
          new RegExp(item.label, 'i').test(activeRoute)
            ? { borderBottomColor: 'blue.100', borderBottomWidth: 'medium' }
            : {};

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
                  {...activeStyle}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor
                  }}
                >
                  {item.label}
                  {item.children && (
                    <Icon
                      as={ChevronDownIcon}
                      transition={'all .25s ease-in-out'}
                    />
                  )}
                </LinkWrapper>
              </PopoverTrigger>

              {item.children && (
                <PopoverContent mt={1} border={0} p={2} minW="sm">
                  <Stack>
                    {item.children.map((child) => {
                      return (
                        <DesktopSubNav
                          key={child.label}
                          {...child}
                          activeRoute={activeRoute}
                        />
                      );
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

/**
 *
 * @see https://chakra-templates.dev/navigation/navbar
 */
export default function Navigation({ activeRoute, isLoading }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { user, isLoggedIn, inRoles, profilePicture } = useAuth0User();

  useEffect(() => {
    if (isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);
  return (
    <GlassCard position={'fixed'} width="100%" zIndex={99} boxShadow="xl">
      <Overlay show={isOpen} style={{ zIndex: -1 }} />
      <Flex minH={'60px'} py={{ base: 2 }} px={{ base: 4 }} align="center">
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex justify={{ base: 'center', md: 'start' }}>
          <LinkWrapper href={'/'}>
            <NextImage
              priority
              src="/images/signature.png"
              alt="Emmanuel K. Buckley"
              width={150}
              height={40}
              quality={100}
            />
          </LinkWrapper>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav activeRoute={activeRoute} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction={'row'}
          spacing={3}
        >
          <Button
            display={{ base: 'none', md: 'flex' }}
            as="a"
            href="https://github.com/ebuckleyk/ebuckleyk-web"
            target={'_blank'}
            leftIcon={<FaGithub />}
            fontSize="sm"
            variant="ghost"
          >
            Github
          </Button>
          <IconButton
            display={{ sm: 'flex', md: 'none' }}
            as="a"
            href="https://github.com/ebuckleyk/ebuckleyk-web"
            target="_blank"
            icon={<FaGithub />}
            variant="ghost"
          />

          <Button
            // disabled // Disabled until production ready
            display={{ base: !user ? 'flex' : 'none' }}
            leftIcon={<FaSignInAlt />}
            as={Link}
            fontSize="sm"
            fontWeight={400}
            variant="link"
            href="/api/auth/login"
          >
            Sign In
          </Button>
          <Menu isLazy>
            <MenuButton display={isLoggedIn ? 'flex' : 'none'}>
              <Avatar
                referrerPolicy="no-referrer"
                size="sm"
                src={profilePicture}
              />
            </MenuButton>
            <MenuList>
              <MenuItem
                _hover={{
                  bg: useColorModeValue('blue.50', 'gray.900'),
                  textDecoration: 'none'
                }}
                as={LinkWrapper}
                href="/profile"
              >
                My Profile
              </MenuItem>
              <MenuItem
                _hover={{
                  bg: useColorModeValue('blue.50', 'gray.900'),
                  textDecoration: 'none'
                }}
                as={LinkWrapper}
                href="/portal/dashboard"
                display={
                  inRoles(['Admin', 'Committee Member'], false)
                    ? 'flex'
                    : 'none'
                }
              >
                Award Committee
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FaSignOutAlt />} as="a" href="/api/auth/logout">
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav activeRoute={activeRoute} />
      </Collapse>
    </GlassCard>
  );
}
