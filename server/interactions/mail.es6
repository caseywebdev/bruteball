import _ from 'underscore';
import config from 'shared/config';
import nodemailer from 'nodemailer';
import nodemailerSesTransport from 'nodemailer-ses-transport';

var transport =
  nodemailer.createTransport(nodemailerSesTransport(config.aws));

export default _.bind(transport.sendMail, transport);
