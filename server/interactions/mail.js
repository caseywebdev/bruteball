var _ = require('underscore');
var config = require('../config');
var nodemailer = require('nodemailer');
var nodemailerSesTransport = require('nodemailer-ses-transport');

var transport = nodemailer.createTransport(nodemailerSesTransport(config.aws));

module.exports = _.bind(transport.sendMail, transport);
