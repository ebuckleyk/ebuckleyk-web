import {
  Avatar,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react';

function HeaderInfo({ name, email, profileImg, onUpdateBio, bio }) {
  return (
    <>
      <Flex justifyContent={'center'}>
        <Avatar size="2xl" src={profileImg ?? ''} />
      </Flex>
      <Flex alignItems={'center'} flexDir="column">
        <Heading>{name}</Heading>
        <Text fontSize={14}>
          <b>e:</b> {email}
        </Text>
      </Flex>
      <Flex justifyContent={'center'}>
        <Editable
          maxW={{ sm: '100%', md: '50%' }}
          borderBottom={'1px'}
          borderBottomColor="gray.100"
          onSubmit={onUpdateBio}
          isPreviewFocusable
          width={'100%'}
          defaultValue={bio ?? 'Edit Bio...'}
        >
          <EditablePreview />
          <EditableTextarea />
        </Editable>
      </Flex>
    </>
  );
}

export default HeaderInfo;
