# Python 3.10 slim image
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY apps/recommendation-service-python/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY apps/recommendation-service-python/ .

# Create non-root user
RUN addgroup --system appgroup && adduser --system --group appuser
RUN chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 6007

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "6007"]
