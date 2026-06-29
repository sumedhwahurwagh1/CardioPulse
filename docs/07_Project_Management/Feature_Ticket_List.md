# Feature Ticket List — CardioPulse v1.0

This document tracks development feature tickets across the CardioPulse v1.0 roadmap.

---

## 🛠️ Sprint 1: Core Machine Learning & API Services

### 🎫 CP-101: Refactor Machine Learning Pipeline into Modular Python Package
- **Description**: Separate raw Jupyter notebook cells into reusable Python classes.
- **Tasks**:
  - Implement StandardScaler transformation pipeline in `ml/preprocessing.py`.
  - Create candidate model comparison fitting loop in `ml/training.py`.
  - Build evaluation plot generator in `ml/evaluation.py`.
- **Status**: Completed ✅

### 🎫 CP-102: Scaffold FastAPI Web API Endpoint Structure
- **Description**: Design microservice exposing endpoints for prediction and metadata query.
- **Tasks**:
  - Bind CORS middleware and exception wrappers in `api/app.py`.
  - Expose API router routes (`GET /`, `GET /health`, `GET /model-info`, `POST /predict`) in `api/routes.py`.
  - Define input/output Pydantic schemas in `api/schemas.py`.
- **Status**: Completed ✅

### 🎫 CP-103: Implement Local CLI Commands
- **Description**: Add terminal CLI interfaces for manual model updates and testing.
- **Tasks**:
  - Add `train_cli.py` to compare and pickle the best candidate classifier.
  - Add `predict_cli.py` to run patient diagnostics interactively via standard input.
- **Status**: Completed ✅

---

## 🎨 Sprint 2: High-Fidelity Frontend Dashboard

### 🎫 CP-201: Initialize Vite React TypeScript Client App
- **Description**: Scaffold React SPA and configure utility styles.
- **Tasks**:
  - Run Vite TS initializer inside `frontend/` directory.
  - Set up Tailwind CSS configurations and base index styles.
- **Status**: Completed ✅

### 🎫 CP-202: Build Core UI Components & Views
- **Description**: Design user interfaces for landing, forms, and results.
- **Tasks**:
  - Build Multi-step diagnostics form with Zod schema validation in `pages/Prediction.tsx`.
  - Design radial SVG risk percentage dial in `pages/Result.tsx`.
  - Add model specifications data dictionary in `pages/About.tsx`.
- **Status**: Completed ✅

### 🎫 CP-203: Connect Axios Service layer
- **Description**: Ingest backend REST routes with error handling.
- **Tasks**:
  - Write Axios instance with 8-second timeout constraints.
  - Bind status polling inside Navbar component to show live backend health.
- **Status**: Completed ✅

---

## 🐳 Sprint 3: Production DevOps & Operations

### 🎫 CP-301: Docker Containerization
- **Description**: Containerize both tiers for standalone environments.
- **Tasks**:
  - Write multi-stage Node/Nginx `Dockerfile` inside `frontend/`.
  - Write Uvicorn/Python `Dockerfile` inside `backend/`.
  - Combine services in `docker-compose.yml`.
- **Status**: Completed ✅

### 🎫 CP-302: GitHub Actions CI Integration
- **Description**: Configure continuous integration workflows.
- **Tasks**:
  - Add `.github/workflows/ci.yml` running Pytest suites and npm compiles.
- **Status**: Completed ✅

### 🎫 CP-303: Structured File Logging
- **Description**: Segregate system log streams.
- **Tasks**:
  - Route messages dynamically to `api.log`, `training.log`, and `error.log`.
- **Status**: Completed ✅

---

## 🔒 Sprint 4: Final Polish & Security Review

### 🎫 CP-401: Dynamic CORS Access Restrictions
- **Description**: Replace wildcards in production to prevent CORS exploits.
- **Tasks**:
  - Bind CORS to `CORS_ALLOWED_ORIGINS` and regex-match Vercel previews.
- **Status**: Completed ✅

### 🎫 CP-402: Intellectual Property & Community Guidelines
- **Description**: Prepare the repo for open-source showcase.
- **Tasks**:
  - Write `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and issue templates.
  - Embed copyright and clinical notices.
- **Status**: Completed ✅
