# Use the official Python 3.8 slim image as the base image
FROM python:3.12-slim AS builder

# Set the working directory within the container
WORKDIR /api-flask

# Copy the necessary files and directories into the container
ADD . /api-flask/

RUN apt update
RUN apt install -y uwsgi libexpat1 curl

# Install nvm / node / npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && . "$HOME/.nvm/nvm.sh" && nvm install 22 && npm install && npm run build

# Upgrade pip and install Python dependencies
RUN pip3 install --upgrade pip && pip3 install --no-cache-dir -r requirements.txt --target /packages

# Stage 2: Create minimal runtime image
FROM gcr.io/distroless/python3

WORKDIR /api-flask

# Copy virtual environment from builder
COPY --from=builder /api-flask /api-flask
COPY --from=builder /packages /packages
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/lib /usr/lib

# Set environment variables for Python
ENV PYTHONPATH=/packages
ENV PATH="/api-flask:$PATH"
ENV PYTHONUNBUFFERED=1

ENV FLASK_ENV=PROD

EXPOSE 8000

CMD ["website.py"]
