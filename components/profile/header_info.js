import {
  Avatar,
  AvatarBadge,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { FileDrop } from '@ebuckleyk/ebuckleyk-component-lib';

function AvatarBadgeImageUpload() {
  return (
    <AvatarBadge
      _hover={{
        cursor: 'pointer'
      }}
      bg="gray.50"
      borderColor="transparent"
    >
      <EditIcon w={5} h={5} />
    </AvatarBadge>
  );
}
function HeaderInfo({
  name,
  email,
  profileImg,
  onUpdateBio,
  bio,
  onUpdateProfileImg
}) {
  return (
    <>
      <Flex justifyContent={'center'}>
        <Avatar size="2xl" src={profileImg ?? ''}>
          <FileDrop
            accept={{
              'image/png': [],
              'image/jpeg': [],
              'image/svg+xml': [],
              'image/webp': []
            }}
            maxFiles={1}
            maxSize={2 * (1024 * 1024)} // should be 2 MB
            dropAreaComponent={<AvatarBadgeImageUpload />}
            displayFileArea={false}
            dropAreaProps={{ width: 'fit-content' }}
            baseStyle={{}}
            onAddFiles={onUpdateProfileImg}
          />
        </Avatar>
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
