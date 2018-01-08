const config = require('../config');
const nodemailer = require('nodemailer');
const {markdown} = require('nodemailer-markdown');
const nodemailerSesTransport = require('nodemailer-ses-transport');

const transport = nodemailer.createTransport(nodemailerSesTransport());
transport.use('compile', markdown());

const {enabled, from} = config.mail;

module.exports = options => {
  if (enabled) return transport.sendMail({...options, from});

  const {to, subject, markdown} = options;
  console.log(`
MAIL
TO ${JSON.stringify(to)}
FROM ${JSON.stringify(from)}
${subject}
${markdown}`);
  return Promise.resolve();
};
