BIN=node_modules/.bin/
BOWER=$(BIN)bower
COGS=$(BIN)cogs
KNEX=$(BIN)knex
SERVER=node build/node_modules
SET_ENV=env `tr '\n' ' ' < .env.sh`
SSH_DEPLOY=ssh deploy@104.200.20.144
WATCHY=$(BIN)watchy

dev:
	$(MAKE) -j nginx postgres cogs-client-w cogs-server-w server-w

nginx:
	mkdir -p log && sudo nginx >> log/nginx.log 2>&1

postgres:
	mkdir -p log && postgres -D /usr/local/var/postgres >> log/postgres.log 2>&1

cogs-client-w:
	$(COGS) -C cogs-client.json -w client,shared,styles

cogs-server:
	$(COGS) -C cogs-server.json

cogs-server-w:
	$(COGS) -C cogs-server.json -w server,shared

server:
	$(SET_ENV) $(SERVER)

server-w:
	$(SET_ENV) $(WATCHY) -w build -- $(SERVER)

deploy:
	$(SSH_DEPLOY) '\
		cd bruteball && \
		git pull && \
		npm prune && \
		npm install && \
		$(BOWER) prune && \
		$(BOWER) install && \
		$(COGS) -C cogs-client.json -c && \
		$(COGS) -C cogs-server.json && \
		$(SET_ENV) $(KNEX) migrate:latest && \
		(sudo restart bruteball || sudo start bruteball) \
	'

.PHONY: server
