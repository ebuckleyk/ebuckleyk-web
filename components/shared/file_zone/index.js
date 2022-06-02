import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '5px',
  borderWidth: 2,
  borderRadius: 10,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function FileItem({
  file,
  onSelect = () => {},
  onRemove = () => {},
  isNew,
  index
}) {
  if (!file) return null;
  return (
    <Flex
      h={45}
      backgroundColor={isNew ? 'green.400' : 'blue.300'}
      width="100%"
      borderRadius={10}
      alignItems={'center'}
      p={2}
      color="white"
    >
      <IconButton
        onClick={() => onRemove(file, index)}
        isRound
        aria-label="Remove file"
        icon={<CloseIcon />}
        size="xs"
        backgroundColor={'black'}
      />
      <Flex
        w="100%"
        onClick={() => onSelect(file)}
        _hover={{
          cursor: isNew ? 'default' : 'pointer'
        }}
        ml={2}
        flexDir="column"
      >
        <Text fontSize={'sm'}>{file.name}</Text>
        <Text fontSize={'xx-small'}>{file.size / 1000} Kb</Text>
      </Flex>
    </Flex>
  );
}

function FileZone({
  files = [],
  onAddFiles,
  onSelectFile,
  onRemoveFile,
  isEditable
}) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDropAccepted: onAddFiles,
      disabled: !isEditable
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <Box style={style} className="container">
      <Box
        {...getRootProps({
          minHeight: 65,
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        })}
      >
        <input {...getInputProps()} />
        <p>
          Drag & Drop your files or{' '}
          <span
            href="#"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Browse
          </span>
        </p>
      </Box>
      <Stack w="100%">
        {files
          ?.filter((x) => !x.isDeleted)
          .map((f, idx) => (
            <FileItem
              key={idx}
              index={idx}
              file={f}
              onSelect={onSelectFile}
              onRemove={onRemoveFile}
              isNew={!!!f._id}
            />
          ))}
      </Stack>
    </Box>
  );
}

export default FileZone;
