import { log } from 'next-axiom';

const requestLogger = (handler) => (req, res) => {
  let params = {};
  req.query ? (params = { ...params, query: req.query }) : null;
  res.getHeader('x-requestId')
    ? (params = { ...params, requestId: res.getHeader('x-requestId') })
    : null;

  log.info(
    `${req.method} - ${req.url}`,
    Object.keys(params).length ? params : null
  );
  return handler(req, res);
};

export default requestLogger;
