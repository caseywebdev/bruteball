#!/usr/bin/env bash

if [ "$NODE_ENV" == production ]
then
  BIN=node_modules/.bin
  $BIN/bower install
  $BIN/cogs -C cogs-client.json -c
  $BIN/cogs -C cogs-server.json
  rm -fr bower_components client shared styles
fi
