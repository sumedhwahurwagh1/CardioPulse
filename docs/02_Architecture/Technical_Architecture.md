# Technical Architecture — CardioPulse v1.0

This document outlines the software design, execution flow, data pipelines, and deployment topology of CardioPulse.

---

## 🏗️ System Architecture Overview

CardioPulse is designed as a decoupled, multi-tier system:

```text
[ Client SPA ] (React, TypeScript, Vite)
      │
      │ HTTP REST API (JSON)
      ▼
[ FastAPI App ] (api/app.py)
      │
      ├─► [ CORSMiddleware ] (Validates origin / Vercel regex)
      ├─► [ Exception Handlers ] (Centralized error maps)
      │
      ▼
[ Prediction Service ] (services/prediction_service.py)
      │
      ├─► Reads pickled artifacts (models/heart_disease_model.pkl)
      ├─► Ingests Pydantic schemas (api/schemas.py)
      │
      ▼
[ ML Preprocessor & Model ] (ml/preprocessing.py, ml/predictor.py)
      │
      ├─► Transforms features via StandardScaler (scaler.pkl)
      ├─► Fits prediction probability
      │
      ▼
[ Structured Logging ] (services/logger.py) ──► Writes to api.log / training.log
```

---

## 🔧 Core Components

### 1. Unified Preprocessing Pipeline
- **Script**: [preprocessing.py](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/ml/preprocessing.py)
- **Role**: Validates categorical ranges and standardizes continuous clinical parameters (Age, Resting Blood Pressure, Cholesterol, Maximum Heart Rate, and ST Depression) using scikit-learn's `StandardScaler`. This matches training transformations to prevent statistical drift during runtime inference.

### 2. Candidate Model Comparators
- **Script**: [training.py](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/ml/training.py)
- **Role**: Automatically fits, compares, and evaluates five classification model classes (Logistic Regression, Random Forest, SVM, KNN, Decision Tree) on an 80/20 stratified split. It exports accuracy, precision, recall, F1, and ROC-AUC metrics to disk.

### 3. Asynchronous Web Service
- **Framework**: FastAPI
- **Uptime Monitor**: App startup time is recorded in FastAPI application state, allowing the `/health` endpoint to calculate elapsed seconds on demand.
- **Exceptions Middleware**: Translates inner pipeline failures (e.g. file missing, standard deviation errors) into clean, standard HTTP error responses.
