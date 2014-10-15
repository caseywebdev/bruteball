import config from 'config';
import express from 'express';
import path from 'path';
import errorListener from 'listeners/express/error';

var PUBLIC = path.resolve(__dirname + '/../../../public');

var SERVE_INDEX = function (req, res) { res.sendFile(PUBLIC + '/index.html'); };

var NOT_FOUND = function (req, res, next) { return next({status: 404}); };

export var app = express();

app.use(express.static(PUBLIC));

app.get('*', SERVE_INDEX);
app.all('*', NOT_FOUND);

app.use(errorListener);

export var server = app.listen(config.port);
