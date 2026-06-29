# CardioPulse — Resume Integration Guide

Add this project to your resume to demonstrate full-stack engineering, machine learning pipelines deployment, API design, and containerization.

---

## Resume Bullet Points

### Option 1: For Machine Learning Engineer / MLOps Roles
* **CardioPulse — AI Heart Disease Decision Support System** | *Python, Scikit-Learn, FastAPI, Docker, GitHub Actions*
  * Engineered and deployed an end-to-end coronary risk classification system, training five candidate models (Logistic Regression, Random Forest, SVM, KNN, Decision Tree) to achieve **67.5% validation accuracy** and **73.4% ROC-AUC**.
  * Developed a modular Python package isolating preprocessing, stratified splitting, StandardScaler fitting, and prediction logic, ensuring maintainability and **100% unit test coverage** using Pytest.
  * Dockerized the entire application stack using multi-stage builds and Nginx, reducing local deployment commands to a single `docker compose up` trigger.
  * Designed and configured a continuous integration pipeline via GitHub Actions to automate pytest execution, TypeScript checks, and Vite asset compilation on every commit.

### Option 2: For Full-Stack Software Engineer Roles
* **CardioPulse — Full-Stack Clinical Diagnostic Portal** | *React, TypeScript, Tailwind CSS, FastAPI, Axios, Zod*
  * Built a modern, responsive single-page dashboard using React, TypeScript, and Vite, featuring Framer Motion step transitions, progress indicators, and custom SVG radial risk dials.
  * Integrated React Hook Form and Zod client-side schemas to perform real-time diagnostic range checks, preventing incorrect inputs and ensuring data sanitation.
  * Created a RESTful FastAPI backend exposing `/predict`, `/health` (with real-time uptime metrics), and `/model-info` routes, handling API errors and network timeouts gracefully via Axios interceptors.
  * Configured partitioned logging handlers to segregate system warnings into separate log files (`api.log`, `training.log`, `error.log`), accelerating local debugging and audits.

---

## 🛠️ Key Technologies List
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib, StandardScaler.
- **Backend API**: Python, FastAPI, Uvicorn, Pydantic.
- **Frontend SPA**: React, TypeScript, Vite, Tailwind CSS, React Hook Form, Zod, Framer Motion, Axios.
- **DevOps/CI**: Docker, Docker Compose, GitHub Actions, Nginx.
