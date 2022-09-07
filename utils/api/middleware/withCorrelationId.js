import { v4 as uuidv4 } from 'uuid';
import { log } from 'next-axiom';

const withCorrelationId = (handler) => (req, res) => {
  let params = {};
  const correlationId = uuidv4();

  req.query
    ? (params = { ...params, query: req.query, 'x-requestId': correlationId })
    : null;
  res.setHeader('x-requestId', correlationId);

  log.info(`${req.method} - ${req.url}`, params);
  return handler(req, res);
};

export default withCorrelationId;
