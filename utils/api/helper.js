import { format, formatDistance } from 'date-fns';

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

export async function uploadToS3(filepond_file) {
  const { file, serverId } = filepond_file;
  const { name, type } = file;
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
    return Promise.resolve({ hostedContent, name });
  } catch (err) {
    console.log({ err });
    if (err.message === 'token expired') {
      const newSignedUrl = await getPreSignedUrl(name, type);
      await await fetch(newSignedUrl, {
        method: 'PUT',
        headers,
        body: file
      });
      return Promise.resolve({ hostedContent, name });
    }
    return Promise.reject('failure');
  }
}

export async function getPreSignedUrl(fileName, fileType) {
  return await (
    await fetch(
      `/api/s3/preSignedUrl?fileName=${fileName}&fileType=${fileType}`
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
