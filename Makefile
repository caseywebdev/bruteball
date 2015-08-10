init: bootstrap migrate up

up:
	dc up -d

bootstrap:
	dc run app bin/bootstrap

migrate:
	dc run app bin/migrate

deploy:
	git push heroku master
