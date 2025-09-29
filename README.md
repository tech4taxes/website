# website
code for the tech4taxes website


## setup
So far, this is using flask & uwsgi. When deploying to the internet, we should also use nginx as a reverse proxy. (That's not set up yet).

The Makefile in the root folder has some commands that set up the flask web server (flask-dev & flask-prod) and run them locally.

We use a python virtualenv in the flask/ folder to run the flask app, set up with:

```
 python3 -m venv flask
 cd flask
 source bin/activate
 pip install -r requirements.txt
 deactivate
 cd ..
 make flask-dev
```


## References / Resources
- https://flask.palletsprojects.com/en/stable/quickstart/
- https://flask.palletsprojects.com/en/stable/deploying/uwsgi/

Regarding NGINX/LetsEncrypt/Docker - 
- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04
- https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose
- https://www.digitalocean.com/community/tutorials/how-to-scale-and-secure-a-django-application-with-docker-nginx-and-let-s-encrypt

I still haven't decided/figured out how to do CSS/assets/javascript (for data vis), but I expect it'll look something like:
- https://medium.com/@jannelson36/build-engaging-and-interactive-charts-using-flask-and-d3-js-7652a3647ee4
- https://towardsdatascience.com/build-interactive-charts-using-flask-and-d3-js-70f715a76f93/
