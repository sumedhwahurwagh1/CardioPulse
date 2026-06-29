# CardioPulse Demo Script (60–90 Seconds Walkthrough)

This script maps out a concise demonstration flow to showcase the CardioPulse project to technical recruiters, hiring managers, or in engineering presentations.

---

## 🕒 Timeline Breakdown

### 1. Project Introduction (0 - 15s)
- **Action**: Display the CardioPulse **Home** landing page.
- **Narrative**:
  > "Hello! Today I'm showcasing CardioPulse, an AI-powered diagnostic decision support system built to predict coronary artery disease risk. The goal is to bridge experimental data science with a production-grade web microservice. It is built as a modular Python package combined with a FastAPI backend and a React + TypeScript frontend."

### 2. High-Level Architecture (15 - 30s)
- **Action**: Hover or point to the **Architecture diagram** in the README or the **About** page.
- **Narrative**:
  > "CardioPulse features a decoupled architecture. The frontend uses React Hook Form and Zod to validate patient measurements locally. The FastAPI backend ingests this, applies standardized scaling transformations, and queries a pickled Logistic Regression classifier. Operational logs are split into dedicated API, training, and error streams for clean maintenance."

### 3. Running a Patient Risk Assessment (30 - 60s)
- **Action**: Click **Start Assessment** to go to `/predict`. Select a high-risk patient dataset (e.g., Demo 2: Age 65, Male, Chest Pain 3, blood pressure 170, cholesterol 310, max heart rate 95, ST depression 4.2). Proceed through steps and click **Run Diagnostics**.
- **Narrative**:
  > "Let's run a test. The diagnostic wizard splits the inputs into logical categories. As I enter the patient stats, clinical tooltips clarify parameters like thalassemia or ST depression. The frontend performs range validation in real-time, preventing garbage inputs. Submitting this fires a POST request to our prediction service."

### 4. Risk Results & Recommendations (60 - 75s)
- **Action**: Display the `/result` page. Point to the circular SVG dial showing 99% risk, patient summary, and the clinical advice card.
- **Narrative**:
  > "The results are rendered instantly. We see a 'High Risk' classification at 99.9% probability. The page dynamically displays warning layouts and extracts targeted health advice, recommending cardiologist consultation and blood pressure monitoring. The entire workflow takes less than 50 milliseconds."

### 5. Production Readiness: OpenAPI & CI/CD (75 - 90s)
- **Action**: Switch tabs to show Swagger UI `/docs`, then the Docker Compose console or GitHub Actions CI workflow runs.
- **Narrative**:
  > "Under the hood, the API documentation is fully documented via Swagger. The stack is fully containerized via Docker Compose, and we've configured a GitHub Actions CI pipeline that automates pytest suites and Vite compilations on every commit. This ensures full code safety and deployment readiness."
