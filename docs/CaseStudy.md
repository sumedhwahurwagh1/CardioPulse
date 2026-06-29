# Case Study: CardioPulse Clinical Decision Support System

An engineering breakdown of building a high-fidelity coronary risk classification microservice.

---

## 1. Problem Statement & Motivation
Heart disease remains a leading cause of mortality globally. While clinical features like serum cholesterol, resting electrocardiograms, and exercise-induced ST segments are routinely collected, interpreting these multi-dimensional factors quickly and consistently is challenging. 

**CardioPulse** was created to transform raw clinical datasets into an automated, highly available web service. The goal was to take an experimental Jupyter Notebook, solve its production limitations (such as lack of validation, hardcoded data splits, and lack of APIs), and deliver a portfolio-quality SaaS diagnostic decision support tool.

---

## 2. Dataset & Features
CardioPulse utilizes the Cleveland Clinic Heart Disease dataset. The dataset includes 303 patient records with 13 input features and a binary target representing the presence of heart disease:
- **Demographics**: Age, Sex.
- **Vitals**: Resting Blood Pressure (`trestbps`), Serum Cholesterol (`chol`), Maximum Heart Rate (`thalach`).
- **Clinical Tests**: Chest Pain Type (`cp`), Fasting Blood Sugar (`fbs`), Resting ECG (`restecg`), Exercise Induced Angina (`exang`), ST depression (`oldpeak`), ST segment slope (`slope`), fluoroscopy colored vessels (`ca`), and Thalassemia type (`thal`).

---

## 3. Machine Learning Core
The backend uses a pipeline that trains, compares, and evaluates multiple candidate models:
1. **Logistic Regression** (baseline)
2. **K-Nearest Neighbors** (instance-based)
3. **Decision Tree** (recursive rules)
4. **Random Forest** (decision tree ensemble)
5. **Support Vector Classifier** (hyperplane optimization)

The dataset is checked for duplicates and partitioned into an 80/20 stratified split to preserve target class balance. Features are scaled using `StandardScaler`. During the training phase, models are compared. **Logistic Regression** was selected for final deployment, yielding **67.5% validation accuracy** and **73.4% ROC-AUC** on the test set.

---

## 4. Software Architecture
CardioPulse follows a decoupled, three-tier service architecture:
- **Client Tier**: React SPA built with Vite and TypeScript. Collects patient metrics, performs local validations using Zod schema, and manages step-based transitions.
- **Application Tier**: FastAPI backend exposing REST routes (`GET /health`, `GET /model-info`, `POST /predict`). Business logic is isolated from routes inside `PredictionService`.
- **Data & Logging Tier**: Configures partitioned log file handlers (`api.log`, `training.log`, `error.log`) to segregate warnings and operations.

---

## 5. Engineering Challenges & Solutions

### Challenge 1: CORS & Browser Ingestion
FastAPI backend and React frontend run on different local ports during dev (8000 and 5173). Direct fetch requests failed due to CORS security policies.
- **Solution**: Integrated FastAPI's `CORSMiddleware` configured to allow safe origins, enabling clean local API routing.

### Challenge 2: Type Coercion Mismatches
Data entered in HTML inputs are submitted as strings. Since the scikit-learn estimator requires float/int values in a specific order, submitting raw string objects caused model errors.
- **Solution**: Configured a Pydantic schema (`PatientData`) on the FastAPI route to handle automatic type conversion, and a matching client-side Zod validation schema to validate ranges before dispatching.

### Challenge 3: Obsolete NumPy / Joblib Shapes in Sandbox
During automated Pytest runs inside Python 3.14, Joblib raised deprecation warnings regarding setting NumPy shape attributes directly.
- **Solution**: Added warnings suppression in pytest configs and verified compatibility boundaries so that deprecated operations degrade gracefully.

---

## 6. Lessons Learned & Future Scope
- **Data Science to Production**: Building CardioPulse proved that training a model is only 10% of the lifecycle. Creating validation schemas, robust routing layers, and clean UI components represents the major effort of deployment.
- **Future Enhancements**:
  - **Explainable AI (XAI)**: Ingesting SHAP explainer weights to visually highlight *why* a patient is classified as high-risk.
  - **Secure EHR Integration**: Connecting oauth2 client protocols to safely fetch data from patient databases.
