BIN=node_modules/.bin/
BOWER=$(BIN)bower
COGS=$(BIN)cogs
KNEX=$(BIN)knex
WATCHY=$(BIN)watchy

init: install up

up:
	docker-compose up -d

install:
	docker-compose run app npm install

start:
	node build/node_modules

deploy:
	git push heroku master

cogs-client:
	@$(COGS) -c cogs-client.js

cogs-server:
	@$(COGS) -c cogs-server.js

migrate:
	$(KNEX) migrate:latest --env knex

clean:
	@if [ $(MINIFY) ]; then rm -fr bower_components src; fi

postinstall:
	@$(BOWER) install --config.interactive=false --allow-root
	@make -j cogs-client cogs-server
	@make clean migrate
