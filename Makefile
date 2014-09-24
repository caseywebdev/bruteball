BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

dev:
	$(MAKE) -j cogs-w server-w

cogs-w:
	$(COGS) -w client,styles

server-w:
	$(WATCHY) -w server -- node server

deploy:
	git push heroku master
