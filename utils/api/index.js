import needle from 'needle';

const baseFetch = async (url, options = {}) => {
  const { headers = {}, body = null, isFormData = false } = options;

  if (body && !isFormData) {
    options.body = JSON.stringify(body);
  } else {
    options.body = body;
  }

  const option_headers = isFormData
    ? { ...headers }
    : {
        accept: 'application/json',
        'content-type': 'application/json',
        ...headers
      };

  const req = new Request(url, {
    ...options,
    headers: new Headers(option_headers)
  });

  const response = await needle(req.method, req.url, req.body, {
    headers: req.headers
  });

  if (response.statusCode < 200 || response.statusCode > 399)
    return Promise.reject(response.body.errors);

  return response.body;
};

export default function web_public_api(url, options) {
  return baseFetch(`${process.env.PUBLIC_WEB_API}/api${url}`, options);
}
