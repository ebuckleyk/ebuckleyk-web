import { format, formatDistance } from 'date-fns';
import { groupBy } from '..';

export function getAwardCampaignApplicationDocS3Format(activeCampaignId) {
  return `award_campaign/${activeCampaignId}/application_docs`;
}

export function getDateDisplay(publishDate) {
  const publishDateAsDate = new Date(publishDate);
  const displayDate = format(publishDateAsDate, 'MMMM do, yyyy');
  const timeAgo = formatDistance(publishDateAsDate, new Date(), {
    addSuffix: true
  });
  return `${displayDate} (${timeAgo})`;
}

export function withCaptcha(func) {
  if (!grecaptcha) throw new Error('grecaptcha is not defined');
  if (typeof func !== 'function') throw new Error('func not a function');

  grecaptcha.ready(function () {
    grecaptcha
      .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' })
      .then(function (token) {
        func(token);
      });
  });
}

export async function uploadToS3v2(file, preSignedUrl) {
  const { type } = file;
  const headers = new Headers();
  headers.append('Content-Type', type);
  try {
    const text = await (
      await fetch(preSignedUrl, {
        method: 'PUT',
        headers,
        body: file
      })
    ).text();

    parseS3XmlResponse(text);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(false);
    // if (error.message === 'token expired') {
    //   const newSignedUrl = await getPreSignedUrlUpload(name, type)
    // }
  }
}

export async function uploadToS3(filepond_file) {
  const { file, serverId } = filepond_file;
  const { name, type, size } = file;
  const { signedUrl, hostedContent } = JSON.parse(serverId);
  const headers = new Headers();
  headers.append('Content-Type', type);

  try {
    const text = await (
      await fetch(signedUrl, {
        method: 'PUT',
        headers,
        body: file
      })
    ).text();

    parseS3XmlResponse(text);
    return Promise.resolve({ hostedContent, name, type, size });
  } catch (err) {
    if (err.message === 'token expired') {
      const newSignedUrl = await getPreSignedUrlUpload(name, type);
      await await fetch(newSignedUrl, {
        method: 'PUT',
        headers,
        body: file
      });
      return Promise.resolve({ hostedContent, name, type, size });
    }
    return Promise.reject('failure');
  }
}

export async function getPreSignedUrlUpload(fileName, fileType, prefix) {
  return await (
    await fetch(
      `/api/s3/preSignedUrl?fileName=${fileName}&fileType=${fileType}&prefix=${prefix}`
    )
  ).json();
}

export async function getPreSignedUrlDownload(path, name) {
  return await (
    await fetch(
      `/api/s3/preSignedUrl/download?filePath=${path}&fileName=${name}`
    )
  ).json();
}

function parseS3XmlResponse(xml) {
  if (!xml?.trim()) return;
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  if (doc.documentElement.nodeName === 'Error') {
    throw new Error('token expired');
  }
}

export async function handleAwardApplicationAttachments(
  formAttachments,
  activeCampaignId
) {
  try {
    const groupedDocs = groupBy(formAttachments, '_id');
    const newDocs = groupedDocs[undefined];
    if (!newDocs?.length)
      return Object.keys(groupedDocs).reduce(
        (prevArray, currentKey) => prevArray.concat(groupedDocs[currentKey]),
        []
      );

    const filesToUploadToS3 = [];
    const preSignedUrls = await Promise.all(
      newDocs.map((f) => {
        return getPreSignedUrlUpload(
          f.name,
          f.type,
          getAwardCampaignApplicationDocS3Format(activeCampaignId)
        );
      })
    );

    // map preSigned back to files
    preSignedUrls.forEach((preSignedUrl) => {
      const assocFileIdx = newDocs.findIndex(
        (file) => file.name === preSignedUrl.fileName
      );
      const assocFile = newDocs[assocFileIdx];
      filesToUploadToS3.push({
        file: assocFile,
        signedUrl: preSignedUrl.signedUrl,
        hostedContent: preSignedUrl.hostedContent
      });
    });

    await Promise.all(
      filesToUploadToS3.map((f) => {
        return uploadToS3v2(f.file, f.signedUrl);
      })
    );

    const newAttachments = filesToUploadToS3.map((f) => {
      return {
        name: f.file.name,
        path: f.hostedContent,
        size: f.file.size,
        type: f.file.type
      };
    });

    return Object.keys(groupedDocs)
      .reduce((prevArray, currentKey) => {
        return currentKey === 'undefined'
          ? prevArray
          : prevArray.concat(groupedDocs[currentKey]);
      }, [])
      .concat(newAttachments);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
