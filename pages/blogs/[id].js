import NextImage from 'next/image';
import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import * as api from '../../utils/api/handlers/contentful';
import RichText from '../../components/richtext';

export default function BlogPost({ blog }) {
  return (
    <Box
      bgColor={'white'}
      borderRadius={{ sm: 0, md: 20 }}
      width={{ sm: '100%', md: '90%' }}
    >
      <Stack direction={'column'} spacing={5} p={5}>
        <Flex justify={'center'}>
          <Heading fontSize={{ sm: 'md', xl: 'x-large' }}>{blog.title}</Heading>
        </Flex>
        <Flex maxH={200} justify="center">
          <NextImage src={blog.postImage.url} width={200} height={300} />
        </Flex>
        <RichText>{blog.content.json}</RichText>
      </Stack>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const blog = await api.getBlogById(context.params.id);
  return {
    props: {
      blog: blog?.post
    }
  };
}

BlogPost.displayName = 'Blog Post';
