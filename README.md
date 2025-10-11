# website [tech4taxes.org](https://tech4taxes.org)

[![Create and publish a Docker image](https://github.com/tech4taxes/website/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/tech4taxes/website/actions/workflows/docker-image.yml)
[![Pylint](https://github.com/tech4taxes/website/actions/workflows/pylint.yml/badge.svg)](https://github.com/tech4taxes/website/actions/workflows/pylint.yml)

code for the tech4taxes website


## setup
This project uses python (flask/uwsgi), javascript/typescript (vite), and docker (Nginx + Letsencrypt).

The Makefile in the root folder has some commands that set up the flask web server (flask-dev & uwsgi-dev), vite dev server (vite-dev) and run them locally.

First, ensure that you have the correct python version installed: 
```
python3 --version
```
Should return python12 or greater. If not, please [upgrade your python version](https://www.python.org/downloads/) before proceeding.

We use a python virtualenv in the `flask/` folder to run the flask app, set up with:

```
 python3 -m venv flask
 cd flask
 source bin/activate
 pip install -r requirements.txt
 deactivate
 cd ..
 make flask-dev
```

We use npm under that same folder (`flask/`), set up with:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
.  "$HOME/.nvm/nvm.sh"
nvm install 22
npm install
npm run build  # this builds the production assets so may not be necessary for local dev!
```

## docker setup
For docker, I've included a few make targets, notably `docker-build` and `docker-up`.
All the make targets want to be called from the project root (website/) but technically docker build wants to run in the flask/ folder, since that's where
the actual Dockerfile is that builds the image. In the Makefile, I believe I call it `tech4taxes-website` but technically if you want to name it something else go crazy,
just be consistent with the image name used in the `docker-compose.yml` file.

Of note for the docker setup (it's using jwilder/nginx-proxy) - it NEEDS dns to be set up, or it NEEDS for the "Host: my-host.here" header to be set in any http requests you send to localhost:80 or 443.
The official thing recommends curl when testing:
`curl -H 'Host: tech4taxes.duckdns.org' localhost:80`


The only reason you should feel compelled to run the docker build or docker compose up is if you fundamentally change the dependencies such that the docker image won't work. Things that are fine and shouldn't require any docker changes or testing:
- adding pip packages / any new python files / changes
- adding typescript packages / files  or any changes to existing files
- adding stuff under the static/ folder to be served statically

Things that might require docker testing:
- changing ports running on services
- adding new sidecar services (eg. a database)
- changing environment variables for the web server

## References / Resources
- https://flask.palletsprojects.com/en/stable/quickstart/
- https://flask.palletsprojects.com/en/stable/deploying/uwsgi/

Regarding NGINX/LetsEncrypt/Docker - 
- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04
- https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose
- https://www.digitalocean.com/community/tutorials/how-to-scale-and-secure-a-django-application-with-docker-nginx-and-let-s-encrypt

This is the guide we followed for setting up the Flask + Vite integration:
- https://jmh.me/blog/bundle-typescript-scss-python-flask-vite

## End-to-end testing
Most testing will only require running the local set-up - that can be run with two separate process:
```
# In one terminal:
make flask-dev

# In another terminal:
make vite-dev
```

If you need to test against the prod setup (particularly against bundled javascript) - you can modify the command that `make flask-dev` runs and pass `FLASK_ENV=PROD` via the environment - this will make it serve javascript from an `npm run build` output rather than the vite devserver. For this case, you only need to run the flask server - no separate process for vite.

If you need to test against the prod docker-setup, you can use the make target `make docker-build` to build the tech4taxes/website docker image, and then modify the image target for the website in `docker-compose.yml` to point to your local build of the image rather than the GHCR image to pull from CI. To actually start up the docker compose, run `docker compose up -d`. (And similarly shut it down with `docker compose down`.)

## Extra Notes
Right now, the site is accessible at:
- http://tech4taxes.org
