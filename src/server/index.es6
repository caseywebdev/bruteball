import _ from 'underscore';
import knex from 'setup/knex';
import express from 'setup/express';
import io from 'setup/io';
import games from 'setup/games';

process.on('SIGTERM', _.bind(process.exit, process, 0));
