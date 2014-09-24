#!/usr/bin/env bash

if [ "$NODE_ENV" == production ]
then
  BIN=node_modules/.bin
  $BIN/bower install
  $BIN/cogs -c
  rm -fr bower_components client
fi
