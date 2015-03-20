init: bootstrap migrate up

up:
	fig up -d

bootstrap:
	fig run app bin/bootstrap

migrate:
	fig run app bin/migrate

deploy:
	git push heroku master
