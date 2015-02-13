init: bootstrap up migrate

up:
	fig up -d

bootstrap:
	fig run app ./bootstrap

migrate:
	fig run app node_modules/.bin/knex migrate:latest

deploy:
	git push heroku master

.PHONY: bootstrap
