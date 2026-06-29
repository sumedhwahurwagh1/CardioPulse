FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY backend/requirements.txt ./backend-requirements.txt
RUN pip install --no-cache-dir -r backend-requirements.txt

# Copy code modules and datasets
COPY backend/ ./backend/
COPY dataset/ ./dataset/
COPY models/ ./models/

# Expose FastAPI default port
EXPOSE 8000

# Set environment configuration
ENV ENV=production
ENV PYTHONPATH=/app

# Start the uvicorn API server, reading PORT env variable set by hosting providers like Render
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-8000}"]
