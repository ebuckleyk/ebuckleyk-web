import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {
  Text,
  Heading,
  Code,
  Table,
  TableContainer,
  ListItem,
  OrderedList,
  UnorderedList,
  Divider,
  Thead,
  Tr,
  Td,
  Link
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function RichText({ richText, children, ...rest }) {
  return (
    <Text fontSize={['sm', 'md']} as="span" {...rest}>
      {documentToReactComponents(richText || children, {
        renderMark: {
          [MARKS.BOLD]: (text) => <Text as="b">{text}</Text>,
          [MARKS.UNDERLINE]: (text) => <Text as="u">{text}</Text>,
          [MARKS.ITALIC]: (text) => <Text as="i">{text}</Text>,
          [MARKS.CODE]: (text) => <Code variant={'outline'}>{text}</Code>
        },
        renderNode: {
          [BLOCKS.PARAGRAPH]: (_, children) => (
            <Text as="p" mb={5}>
              {children}
            </Text>
          ),
          [BLOCKS.HEADING_1]: (_, children) => (
            <Heading as="h1">{children}</Heading>
          ),
          [BLOCKS.HEADING_2]: (_, children) => (
            <Heading as="h2">{children}</Heading>
          ),
          [BLOCKS.HEADING_3]: (_, children) => (
            <Heading as="h3">{children}</Heading>
          ),
          [BLOCKS.HEADING_4]: (_, children) => (
            <Heading as="h4">{children}</Heading>
          ),
          [BLOCKS.HEADING_5]: (_, children) => (
            <Heading as="h5" fontSize={'lg'}>
              {children}
            </Heading>
          ),
          [BLOCKS.HEADING_6]: (_, children) => (
            <Heading as="h6" fontSize={'md'}>
              {children}
            </Heading>
          ),
          [BLOCKS.UL_LIST]: (_, children) => (
            <UnorderedList>{children}</UnorderedList>
          ),
          [BLOCKS.OL_LIST]: (_, children) => (
            <OrderedList>{children}</OrderedList>
          ),
          [BLOCKS.LIST_ITEM]: (_, children) => <ListItem>{children}</ListItem>,
          [BLOCKS.HR]: (_, children) => <Divider />,
          [BLOCKS.QUOTE]: (_, children) => <Text as="i">{children}</Text>,
          [BLOCKS.TABLE]: (_, children) => (
            <TableContainer>
              <Table>{children}</Table>
            </TableContainer>
          ),
          [BLOCKS.TABLE_HEADER_CELL]: (_, children) => (
            <Thead>{children}</Thead>
          ),
          [BLOCKS.TABLE_ROW]: (_, children) => <Tr>{children}</Tr>,
          [BLOCKS.TABLE_CELL]: (_, children) => <Td>{children}</Td>,
          hyperlink: (_, children) => (
            <Link as="a" color="blue.500" href={_?.data?.uri} target={'_blank'}>
              {children}
              <ExternalLinkIcon color="gray.500" mx="2px" />
            </Link>
          )
        },

        renderText: (text) => {
          return text.split('\n').reduce((children, textSegment, index) => {
            return [...children, index > 0 && <br key={index} />, textSegment];
          }, []);
        }
      })}
    </Text>
  );
}
