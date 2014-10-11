BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

dev:
	$(MAKE) -j nginx postgres cogs-w server-w

nginx:
	mkdir -p log && sudo nginx >> log/nginx.log 2>&1

postgres:
	mkdir -p log && postgres -D /usr/local/var/postgres >> log/postgres.log 2>&1

cogs-w:
	$(COGS) -w client,styles

server-w:
	. .env.sh && $(WATCHY) -w server -- node server

deploy:
	git push heroku master
