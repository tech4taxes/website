.PHONY: flask-dev uwsgi-dev docker-build docker-up docker-down

SHELL=/usr/bin/env bash

FLASK_DEV_PORT=8000
VITE_DEV_PORT=5173

flask-dev:
	cd flask && source bin/activate && FLASK_ENV=DEV flask --app website run --debug --port $(FLASK_DEV_PORT)

uwsgi-dev:
	cd flask && source bin/activate && FLASK_ENV=DEV uwsgi --http 127.0.0.1:$(FLASK_DEV_PORT) --master -p 4 -w website:app 

vite-dev:
	cd flask && npm run dev

docker-build:
	cd flask && sudo docker build -t tech4taxes-website .

docker-up:
	sudo docker compose up -d

docker-down:
	sudo docker compose down
