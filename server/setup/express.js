var bodyParser = require('body-parser');
var config = require('../config');
var express = require('express');
var path = require('path');

var NOT_FOUND = function (req, res, next) { return next({status: 404}); };

var PUBLIC = path.resolve(__dirname + '/../../public');

var SERVE_INDEX = function (req, res) { res.sendFile(PUBLIC + '/index.html'); };

var app = exports.app = express();

app.use(express.static(PUBLIC));
app.use(bodyParser.json());

app.all('/api/*', NOT_FOUND);
app.get('*', SERVE_INDEX);
app.all('*', NOT_FOUND);

app.use(require('../controllers/error'));

exports.server = app.listen(config.port);
