# website

[![Create and publish a Docker image](https://github.com/tech4taxes/website/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/tech4taxes/website/actions/workflows/docker-image.yml)
[![Pylint](https://github.com/tech4taxes/website/actions/workflows/pylint.yml/badge.svg)](https://github.com/tech4taxes/website/actions/workflows/pylint.yml)

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

## docker setup
For docker, I've included a few make targets, notably `docker-build` and `docker-up`.
All the make targets want to be called from the project root (website/) but technically docker build wants to run in the flask/ folder, since that's where
the actual Dockerfile is that builds the image. In the Makefile, I believe I call it `tech4taxes-website` but technically if you want to name it something else go crazy,
just be consistent with the image name used in the docker-compose.yml file.

Of note for the docker setup (it's using jwilder/nginx-proxy) - it NEEDS dns to be set up, or it NEEDS for the Host: {sfdasdfa} header to be set in any http requests you send to localhost:80 or 443.
The official thing recommends curl when testing and I also do since doing anything else is super annoying:
`curl -H 'Host: tech4taxes.duckdns.org' localhost:80`


I don't have any actual recommendation to use the docker setup for development. So far it's just for handling proxying and SSL (eventually). It's a pain otherwise, so feel free to not use it.

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


## Extra Notes
Right now, the old site is accessible at:
- http://tech4taxes.org
- http://tech4taxes.cntrl.site

Right now, the new site is accessible at:
- http://tech4taxes.duckdns.org
