import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ErrorCode, useDropzone } from 'react-dropzone';
import appsettings from '../../../app.settings.json';

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
  backgroundColor: '#ffffff',
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

const friendly_mime_name_lookup = {
  [appsettings.awards.valid_file_types[0]]: '.pdf',
  [appsettings.awards.valid_file_types[1]]: '.doc',
  [appsettings.awards.valid_file_types[2]]: '.docx'
};

function FileItem({
  file,
  onSelect = () => {},
  onRemove = () => {},
  isNew,
  index,
  isDisabled
}) {
  if (!file) return null;
  return (
    <Flex
      boxShadow={'xl'}
      h={45}
      backgroundColor={isNew ? 'green.400' : 'blue.300'}
      width="100%"
      borderRadius={10}
      alignItems={'center'}
      p={2}
      color="white"
    >
      <IconButton
        disabled={isDisabled}
        onClick={() => onRemove(file, index)}
        isRound
        aria-label="Remove file"
        icon={<CloseIcon h={3} w={3} />}
        size="xs"
        color="gray"
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

const accept = Object.values(appsettings.awards.valid_file_types).reduce(
  (prev, cur) => {
    prev[cur] = [];
    return prev;
  },
  {}
);

function FileZone({
  files = [],
  onAddFiles,
  onSelectFile,
  onRemoveFile,
  isEditable,
  onError = () => {}
}) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDropAccepted: onAddFiles,
      disabled: !isEditable,
      accept,
      maxFiles: 3,
      onDropRejected: (rejections) => {
        const errorMsgs = rejections.reduce((prev, cur) => {
          const { errors, file } = cur;
          const msgs = errors.map((error) => {
            switch (error.code) {
              case ErrorCode.FileInvalidType: {
                return `Invalid type. Only the following file types are allowed: ${Object.values(
                  friendly_mime_name_lookup
                )}`;
              }
              default:
                return error.message;
            }
          });
          return [...prev, `${file.name}: \n${msgs.join('')}`];
        }, []);
        onError(errorMsgs.join('\n'));
      }
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
          width: '100%',
          flexDirection: 'column'
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
              isDisabled={!isEditable}
            />
          ))}
      </Stack>
    </Box>
  );
}

export default FileZone;
