import React from 'react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

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

export default LinkWrapper;
