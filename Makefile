BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

dev:
	make -j nginx postgres cogs-client-w cogs-server-w server-w

log:
	mkdir -p log

nginx: log
	sudo nginx >> log/nginx.log 2>&1

postgres: log
	postgres -D /usr/local/var/postgres >> log/postgres.log 2>&1

cogs-client-w:
	$(COGS) -C cogs-client.json -w client,shared,styles

cogs-server:
	$(COGS) -C cogs-server.json

cogs-server-w:
	$(COGS) -C cogs-server.json -w server,shared

server-w:
	. .env.sh && $(WATCHY) -w build \
		'trap "kill \`jobs -p\`" EXIT; node build/node_modules'

deploy:
	git push heroku master
