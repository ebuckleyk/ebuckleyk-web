import settings from '../app.settings.json';

export function filepond_validateCorrectFileSize(files = []) {
  if (!files) return true;
  let valid = true;
  files.forEach((file) => {
    if (!file.getMetadata) return;
    const fileSize =
      file.getMetadata &&
      file.getMetadata(settings.awards.filepond_fileSize_key);
    const size = convertBytesToMB(fileSize);
    if (size > settings.awards.max_file_size_in_MB) {
      valid = false;
    }
  });
  return valid;
}

export function filepond_validateCorrectFileType(files = []) {
  if (!files) return true;
  let valid = true;
  files.forEach((file) => {
    if (!file.getMetadata) return;
    const fileType =
      file.getMetadata &&
      file.getMetadata(settings.awards.filepond_fileType_key);
    if (!settings.awards.valid_file_types.includes(fileType)) {
      valid = false;
    }
  });
  return valid;
}

export function convertMB2Bytes(mb, decimals = 2) {
  return mb * 1024 * 1024;
}

export function convertBytesToMB(bytes, decimals = 2) {
  return parseFloat((bytes / 1024 / 1024).toFixed(decimals));
}

// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
export function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
