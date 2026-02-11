# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port that Flask will run on
EXPOSE 5000

# Run the Flask application with Gunicorn
# The `app:app` refers to the 'app' variable in 'app.py' module.
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]