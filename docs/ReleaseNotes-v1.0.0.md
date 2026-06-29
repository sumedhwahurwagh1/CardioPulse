# CardioPulse v1.0.0 - Production Release Notes

We are excited to announce the first production release of **CardioPulse (v1.0.0)**. This release marks the transition from an experimental Jupyter notebook prototype to a fully integrated, modular, and containerized diagnostic system.

---

## 🚀 Features & Components

### 🧠 Machine Learning Engine
- Unified ML pipeline comparing five classifiers (Logistic Regression, Random Forest, SVM, KNN, Decision Tree).
- Deployed a **Logistic Regression** classifier achieving **67.5% validation accuracy** and **73.4% ROC-AUC**.
- Automated StandardScaler feature scaling and model artifacts exporter.

### ⚡ FastAPI Backend
- Created `/predict` inference route returning risk classifications and recommendations.
- Created `/health` check route reporting version, environment, model state, and server uptime.
- Created `/model-info` route providing active model specifications.
- Centralized exception handlers for model loading issues and validation errors.

### 🎨 React + TypeScript Frontend
- Multi-step diagnostic wizard (Personal -> Vitals -> Clinical) with custom help tooltips.
- SVG circular percentage visualizer for coronary risk probability.
- Dynamic backend connection checking via health dot status indicator.
- Client-side data checks using Zod schemas and inline validation messages.

---

## 🔧 Operational & Devops Improvements
- **Docker Compose**: Pre-configured containers linking React (served via Nginx) and FastAPI (via Uvicorn).
- **GitHub Actions**: Continuous integration pipeline running pytests and Vite compiler checks on pull requests.
- **Log Partitioning**: Separates outputs into `api.log`, `training.log`, and `error.log`.

---

## 🧪 Testing Summary
- Verified that all 6 backend unit tests run and pass successfully.
- Verified that typescript build and packaging (`npm run build`) completes with zero compile errors.
