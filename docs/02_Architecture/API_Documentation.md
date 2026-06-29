# API Documentation — CardioPulse v1.0

This document outlines the REST API endpoints exposed by the CardioPulse FastAPI microservice.

---

## 🚦 Endpoint Specifications

### 1. Welcome & Root Status
- **Route**: `GET /`
- **Description**: Returns welcome messages and details if the model is currently active.
- **Request Headers**: None
- **Response Format**: `application/json`
- **Response Example**:
  ```json
  {
    "title": "Heart Disease Classification API",
    "description": "A production-ready machine learning API to predict likelihood of heart disease.",
    "status": "online",
    "model_loaded": true
  }
  ```

### 2. Service Health Status
- **Route**: `GET /health`
- **Description**: Returns health state, version details, hosting environment, and server uptime. Used by Render for rolling deployment health checks.
- **Request Headers**: None
- **Response Format**: `application/json`
- **Response Example**:
  ```json
  {
    "status": "healthy",
    "version": "1.0",
    "model_loaded": true,
    "uptime_seconds": 1284.55,
    "environment": "production"
  }
  ```

### 3. Active Model Specifications
- **Route**: `GET /model-info`
- **Description**: Retrieves performance metrics, feature names, and metadata of the trained model.
- **Request Headers**: None
- **Response Format**: `application/json`
- **Response Example**:
  ```json
  {
    "metrics": {
      "accuracy": 0.675,
      "precision": 0.655,
      "recall": 0.68,
      "f1_score": 0.667,
      "roc_auc": 0.734
    },
    "feature_names": [
      "age", "sex", "chest_pain_type", "resting_blood_pressure",
      "cholesterol", "fasting_blood_sugar", "resting_ecg",
      "max_heart_rate", "exercise_induced_angina", "st_depression",
      "st_slope", "num_major_vessels", "thalassemia"
    ],
    "metadata": {
      "model_name": "Logistic Regression Model",
      "model_class": "LogisticRegression",
      "dataset_shape": [303, 14],
      "trained_at": "2026-06-29T12:00:00Z"
    }
  }
  ```

### 4. Patient Risk Prediction
- **Route**: `POST /predict`
- **Description**: Ingests 13 clinical variables, performs scaling transforms, estimates risk probability, and returns clinical advice.
- **Request Format**: `application/json` (matches `PatientData` schema)
- **Request Example**:
  ```json
  {
    "age": 55,
    "sex": 1,
    "chest_pain_type": 1,
    "resting_blood_pressure": 130,
    "cholesterol": 250,
    "fasting_blood_sugar": 0,
    "resting_ecg": 0,
    "max_heart_rate": 150,
    "exercise_induced_angina": 0,
    "st_depression": 1.2,
    "st_slope": 1,
    "num_major_vessels": 0,
    "thalassemia": 0
  }
  ```
- **Response Format**: `application/json`
- **Response Example**:
  ```json
  {
    "prediction": 0,
    "probability_disease": 0.125,
    "probability_no_disease": 0.875,
    "risk_level": "Low Risk",
    "status": "Predicts no heart disease.",
    "advice": [
      "Maintain a heart-healthy diet rich in fiber, whole grains, and lean proteins.",
      "Engage in moderate aerobic exercise for at least 150 minutes per week.",
      "Schedule routine primary care checkups to monitor vitals."
    ]
  }
  ```
