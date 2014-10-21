#!/usr/bin/env bash

if [ "$NODE_ENV" == production ]
then
  BIN=node_modules/.bin
  $BIN/bower install
  $BIN/cogs -C cogs-client.json -c
  $BIN/cogs -C cogs-server.json
  node_modules/.bin/knex migrate:latest
  rm -fr bower_components client server shared styles
fi
