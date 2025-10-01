# Use the official Python 3.8 slim image as the base image
FROM python:3.12-slim

# Set the working directory within the container
WORKDIR /api-flask

# Copy the necessary files and directories into the container
ADD . /api-flask/

RUN apt update
RUN apt install -y uwsgi libexpat1

# Upgrade pip and install Python dependencies
RUN pip3 install --upgrade pip && pip install --no-cache-dir -r requirements.txt


# Expose port 8000 for the Flask application
EXPOSE 8000

# Define the command to run the Flask application using uWSGI
CMD ["uwsgi", "--http", "0.0.0.0:8000", "-p", "1", "--master", "-w", "website:app"]
