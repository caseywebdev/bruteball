#!/usr/bin/env bash

if [ "$NODE_ENV" == production ]
then
  BIN=node_modules/.bin
  $BIN/bower install
  $BIN/cogs -c cogs-client.js
  $BIN/cogs -c cogs-server.js
  $BIN/knex migrate:latest
  rm -fr bower_components src
fi
