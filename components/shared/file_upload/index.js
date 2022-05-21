import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage
} from '@chakra-ui/react';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { registerPlugin, FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useCallback } from 'react';
import settings from '../../../app.settings.json';
import * as utils from '../../../utils/api/helper';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default function FileUpload({ values, onAddFiles, prefix = '' }) {
  const onupdatefiles = useCallback(
    (files) => {
      files.forEach((f) => {
        // do this so we can check size and type in validation
        // filepond isn't including the actual file on the object when stored
        // in formik state
        f.setMetadata(settings.awards.filepond_fileSize_key, f.fileSize, false);
        f.setMetadata(settings.awards.filepond_fileType_key, f.fileType, false);
      });
      onAddFiles(files);
    },
    [onAddFiles]
  );

  const onProcessFile = useCallback(
    async (fieldName, file, metadata, load, error, progress, abort) => {
      try {
        progress(false, 0, file.size);
        const { signedUrl, hostedContent } = await utils.getPreSignedUrl(
          file.name,
          file.type,
          prefix
        );
        load(JSON.stringify({ signedUrl, hostedContent }));
        progress(false, file.size, file.size);
      } catch (err) {
        error(err);
        abort();
      }
    },
    [prefix]
  );

  return (
    <FormControl isRequired>
      <FormLabel>Attachments</FormLabel>
      <FilePond
        files={values.attachments}
        onupdatefiles={onupdatefiles}
        onprocessfile
        // onupdatefiles={(f) => f.forEach(file => file.serverId)}
        server={{
          process: onProcessFile
        }}
        // onupdatefiles={(files) => files.forEach(f => f.status)}
        // server={{
        //   // retrieved the signedUrl here
        //   process: (f, ff, m, l, e, p, a) => {
        //     ff.
        //     p(false, 0, 10);
        //     l()
        //   }
        // }}
        allowMultiple={true}
        maxFiles={4}
        maxFileSize={`${settings.awards.max_file_size_in_MB} MB`}
        name="files"
        acceptedFileTypes={settings.awards.valid_file_types}
      />
    </FormControl>
  );
}
