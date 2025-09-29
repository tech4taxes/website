.PHONY: flask-dev flask-prod

FLASK_DEV_PORT=8000
FLASK_PROD_PORT=8000

flask-dev:
	cd flask && source bin/activate && flask --app website run --debug --port $(FLASK_DEV_PORT)

flask-prod:
	cd flask && source bin/activate && uwsgi --http 127.0.0.1:$(FLASK_PROD_PORT) --master -p 4 -w website:app
