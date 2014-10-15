import _ from 'underscore';

export var knex = require('setup/knex');
export var express = require('setup/express');
export var ws = require('setup/ws');
export var games = require('setup/games');

process.on('SIGTERM', _.bind(process.exit, process, 0));
