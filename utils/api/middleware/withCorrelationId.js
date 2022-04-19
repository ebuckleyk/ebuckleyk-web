import { v4 as uuidv4 } from 'uuid';

const withCorrelationId = (handler) => (req, res) => {
  res.setHeader('x-requestId', uuidv4());
  return handler(req, res);
};

export default withCorrelationId;
