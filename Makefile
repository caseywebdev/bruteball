start:
	fig start

up:
	fig up -d

init: bootstrap up migrate

bootstrap:
	fig run app ./bootstrap

migrate:
	fig run app node_modules/.bin/knex migrate:latest

deploy:
	git push heroku master

.PHONY: bootstrap
