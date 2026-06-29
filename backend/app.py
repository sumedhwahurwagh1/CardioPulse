import uvicorn
from backend.api.app import app

if __name__ == "__main__":
    # Start the web API server when executed directly
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
