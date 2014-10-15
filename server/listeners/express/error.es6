import http from 'http';

export default function (er, req, res, next) {
  if (typeof er === 'number') er = {status: er};
  var status = er.status || 500;
  var message = er.message || http.STATUS_CODES[status] || 'Unknown';
  if (status === 500) console.error(er);
  res.status(status).send({error: message});
}
