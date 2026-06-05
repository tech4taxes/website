# Use the official Python 3.12 slim image as the base image
FROM python:3.12-slim AS builder

# Set the working directory within the container
WORKDIR /api-flask

# Copy the necessary files and directories into the container
ADD . /api-flask/

RUN apt update
RUN apt install -y curl

# Install nvm / node / npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && . "$HOME/.nvm/nvm.sh" && nvm install 22 && npm install && npm run build

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# append :debug to get an image with a shell
FROM gcr.io/distroless/python3

WORKDIR /api-flask

# python dependencies
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/lib /usr/lib
# node webpack build (+ repo contents)
COPY --from=builder /api-flask /api-flask

# Set environment variables for Python
ENV PATH="/api-flask:/usr/lib:/usr/local/lib:/usr/local/bin:$PATH"
ENV PYTHONPATH="/usr/local/lib"
ENV PYTHONUNBUFFERED=1

ENV FLASK_ENV=PROD

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/uwsgi"]
CMD ["--http", "0.0.0.0:8000", "-p", "1", "--master", "-w", "website:app"]
