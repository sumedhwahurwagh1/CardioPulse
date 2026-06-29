# CardioPulse — AI Heart Disease Classification System

[![CI Pipeline](https://github.com/sumedhwahurwagh/Heart-Disease-Detection-ML/actions/workflows/ci.yml/badge.svg)](https://github.com/sumedhwahurwagh/Heart-Disease-Detection-ML/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

CardioPulse is a production-grade machine learning system that estimates a patient's coronary artery disease risk and provides structured clinical recommendations. The system is designed as a modular Python package paired with a FastAPI microservice backend and a high-fidelity single-page React frontend dashboard.

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (React & Vite)"]
        UI["SPA Dashboard (Tailwind CSS / Framer Motion)"]
        RHF["React Hook Form & Zod Validation"]
        Axios["Axios API Client"]
    end

    subgraph API ["Server Layer (FastAPI)"]
        Routes["APIRouter (routes.py)"]
        Middleware["Exceptions & CORS (app.py)"]
        Service["PredictionService (prediction_service.py)"]
    end

    subgraph ML ["Core ML Engine"]
        Loader["Model Loader (predictor.py)"]
        Preprocessor["Scaler Transformer (preprocessing.py)"]
        Model["Fitted Logistic Regression model"]
        Scaler["StandardScaler (scaler.pkl)"]
    end

    subgraph Data ["Storage & Logs"]
        CSV["Dataset (heart_disease_dataset.csv)"]
        JSON["Metadata (metrics/metadata JSONs)"]
        Logs["Logs (api/training/error logs)"]
    end

    UI --> RHF
    RHF --> Axios
    Axios -- HTTP REST --> Routes
    Routes --> Middleware
    Middleware --> Service
    Service --> Loader
    Loader --> Preprocessor
    Preprocessor --> Model
    Model --> Scaler
    Service --> JSON
    Routes --> Logs
```

---

## 🛠️ Technology Stack

- **Frontend Client**: React 18, TypeScript, Vite 8, Tailwind CSS v3, React Router v6, React Hook Form, Zod, Framer Motion, Lucide Icons.
- **Backend Service**: Python 3.11+, FastAPI, Scikit-Learn, Pandas, NumPy, Joblib, Uvicorn, Pydantic.
- **DevOps & CI/CD**: Docker, Docker Compose, GitHub Actions, Nginx.
- **Hosting Targets**: Vercel (Frontend), Render (Backend API).

---

## ✨ Features

- **Multi-Model Pipeline Comparison**: Auto-trains and validates candidate classifiers (Logistic Regression, Random Forest, SVM, KNN, Decision Tree) and deploys the highest-performing instance.
- **Multi-Step Diagnosis Form**: Dynamic input validation wizard with inline error alerts and descriptive medical tooltips.
- **Radial Progress Visualizer**: Displays risk percentage using a custom SVG circular meter.
- **Automated Uptime & Health Check**: Enhanced `/health` route reporting active versions, host environment, and server uptime.
- **Structured Log Partitioning**: Segregates operational logs into `api.log`, `training.log`, and `error.log`.

---

## 📁 Folder Structure

```text
Heart-Disease-Detection-ML/
│
├── .github/workflows/          # GitHub Actions CI workflow
├── dataset/                    # Training datasets (CSV)
├── models/                     # Pickled estimators, scalers, and JSON metadata
├── reports/                    # Generated performance plots
├── screenshots/                # Showcase images and walkthrough instructions
├── backend/                    # Python package and FastAPI API
│   ├── api/                    # Routers, schemas, and exception handlers
│   ├── ml/                     # Configurations, processing, and pipeline logic
│   ├── services/               # Logger and prediction services
│   ├── train_cli.py            # CLI trainer
│   ├── predict_cli.py          # Interactive CLI predictor
│   └── app.py                  # API starter script
│
├── frontend/                   # React TypeScript frontend
│   ├── src/                    # Components, pages, layout, types, and hooks
│   └── Dockerfile              # Frontend multi-stage Docker build
│
├── docker-compose.yml          # Containers link
├── render.yaml                 # Render blueprint
└── README.md                   # Repository documentation
```

---

## 📸 Screenshots

| Landing Page | Diagnostic Wizard | Risk Results |
| :---: | :---: | :---: |
| *[landing_page.png](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/screenshots/landing_page.png)* | *[diagnostic_wizard.png](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/screenshots/diagnostic_wizard.png)* | *[risk_results.png](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/screenshots/risk_results.png)* |

*Please check [screenshots/README.md](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/screenshots/README.md) to populate the directory.*

---

## 🚦 Installation & Local Development

### 1. Backend Service Setup

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run model training CLI
PYTHONPATH=. python3 backend/train_cli.py

# Start local dev server
PYTHONPATH=. uvicorn backend.app:app --reload
```
API docs will load at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Frontend Client Setup

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Deployment

To spin up the entire application locally using Docker:

```bash
# Build and run containers
docker compose up --build
```
- Frontend will serve on [http://localhost:8080](http://localhost:8080).
- Backend API will run on [http://localhost:8000](http://localhost:8000).

---

## ☁️ Cloud Deployment Guide

### Backend: Render
1. Connect your repository to **Render**.
2. Create a new **Web Service** using the root `render.yaml` Blueprint or configure:
   - **Environment**: Python
   - **Build Command**: `pip install -r backend/requirements.txt && PYTHONPATH=. python backend/train_cli.py`
   - **Start Command**: `PYTHONPATH=. uvicorn backend.app:app --host 0.0.0.0 --port $PORT`

### Frontend: Vercel
1. Connect your repository to **Vercel**.
2. Add a new Project selecting the `frontend/` directory.
3. Configure environment variables:
   - `VITE_API_URL`: URL of your deployed Render backend (e.g. `https://cardiopulse-api.onrender.com`).
4. Build settings are auto-resolved from Vite configs. Fallback routes are handled by [vercel.json](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/vercel.json).

---

## 🗺️ Future Roadmap

- [ ] **Explainable AI (XAI)**: Integrate SHAP or LIME charts in the results tab to show which features contributed most to high-risk scores.
- [ ] **Patient History Database**: Connect PostgreSQL to store histories and visualize risk progression.
- [ ] **OAuth2 Authentication**: Secure diagnostic evaluations behind clinician credentials.
