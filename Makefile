BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

dev:
	$(MAKE) -j nginx postgres cogs-client-w cogs-server-w server-w

nginx:
	mkdir -p log && sudo nginx >> log/nginx.log 2>&1

postgres:
	mkdir -p log && postgres -D /usr/local/var/postgres >> log/postgres.log 2>&1

cogs-client-w:
	$(COGS) -C cogs-client.json -w client,config.es6,interactions,entities,styles

cogs-server:
	$(COGS) -C cogs-server.json

cogs-server-w:
	$(COGS) -C cogs-server.json -w server,config.es6,entities,interactions

server-w:
	. .env.sh && $(WATCHY) -w build -- node build/node_modules

deploy:
	git push heroku master

deploy-thursday:
	git push thursday master

launch:
	npm prune
	npm rebuild
	npm install
	node_modules/.bin/bower prune
	node_modules/.bin/bower install
	$(COGS) -C cogs-client.json -c
	$(COGS) -C cogs-server.json
	-kill `ps ax | grep -P '\d [n]ode build/node_modules' | grep -oP '^\s*\d+'`
