# Render Backend Deployment Guide — CardioPulse

This document provides verification results, deployment checklists, and step-by-step instructions to deploy the CardioPulse FastAPI backend to **Render**.

---

## 🛠️ DevOps Verification Summary

### 1. Configuration Blueprint (`render.yaml`)
- **State**: **VERIFIED**
- **File Link**: [render.yaml](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/render.yaml)
- **Parameters**: 
  - `buildCommand` runs `pip install` and executes `train_cli.py` to compile training data and serialize model weights during the build slug generation phase.
  - `startCommand` starts `uvicorn` and binds to `$PORT` dynamically, ensuring compliance with Render's load balancers.

### 2. Container Configuration (`backend/Dockerfile`)
- **State**: **VERIFIED**
- **File Link**: [backend/Dockerfile](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/Dockerfile)
- **Parameters**:
  - Exposes port `8000`.
  - Configures `CMD` to execute using a shell form: `CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-8000}"]`. This resolves port binding issues dynamically when Render overrides container ports.

### 3. Environment Variables
- **State**: **VERIFIED**
- **Required settings**:
  - `ENV`: Must be set to `production`.
  - `CORS_ALLOWED_ORIGINS`: Comma-separated list of origins (e.g. `https://cardiopulse-frontend.vercel.app`).
  - `PYTHONPATH`: Set to `/app` (or `.` for native runs).

### 4. Health Check Endpoint
- **State**: **VERIFIED**
- **Route**: `GET /health`
- **Behavior**: Returns `200 OK` with JSON fields including `status: "healthy"` if the pickled classification models are active in memory. Render monitors this route during zero-downtime rolling deploys.

---

## 📝 Pre-Deployment Checklist

- [ ] Repository committed and pushed to GitHub.
- [ ] Backend contains trained model artifacts (`models/*.pkl`, `models/*.json`).
- [ ] Vercel frontend URL is finalized and copied.
- [ ] Render account is active and linked to your GitHub account.

---

## 🚀 Step-by-Step Deployment Instructions

You can deploy the backend using **Option A (Infrastructure as Code via Blueprint)** or **Option B (Manual Setup)**.

### Option A: Deploy via Blueprint (Recommended)
1. Log in to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New** in the top right, then select **Blueprint**.
3. Connect your repository containing the `render.yaml` file.
4. Render will parse the file and prompt you for configuration details.
5. Provide the following **Environment Variables**:
   - `ENV`: `production`
   - `CORS_ALLOWED_ORIGINS`: [Your Vercel Frontend URL]
6. Click **Approve**. Render will provision, build, and launch the service.

### Option B: Manual Setup
1. Log in to the Render Dashboard.
2. Click **New** -> **Web Service**.
3. Select your connected GitHub repository.
4. Configure service details:
   - **Name**: `cardiopulse-api`
   - **Language**: `Python`
   - **Branch**: `main`
   - **Build Command**: `pip install -r backend/requirements.txt && PYTHONPATH=. python backend/train_cli.py`
   - **Start Command**: `PYTHONPATH=. uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5. Click **Advanced** and add the **Environment Variables**:
   - `ENV`: `production`
   - `CORS_ALLOWED_ORIGINS`: [Your Vercel Frontend URL]
6. Click **Create Web Service**.
