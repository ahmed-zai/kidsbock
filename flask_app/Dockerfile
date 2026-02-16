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

# Create a non-root group and user
RUN addgroup --system appuser && adduser --system --no-create-home appuser

# Change ownership of /app to appuser (now that appuser exists)
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the port that Flask will run on
EXPOSE 5000

# Run the Flask application with Gunicorn
# The `app:app` refers to the 'app' variable in 'app.py' module.
CMD ["bash", "-c", "gunicorn -b 0.0.0.0:${FLASK_PORT} app:app"]