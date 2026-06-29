# Frontend Specification — CardioPulse v1.0

This document outlines the client-side single-page application structure, validation schemas, and UI design standards.

---

## 🎨 User Interface Design

### 1. Color Palette & Typography
- **Primary Brand**: Slate and Blue (`bg-brand-600`, `text-slate-900`).
- **Alert Levels**:
  - Low Risk: Emerald Green (`bg-emerald-50`, `text-emerald-800`).
  - High Risk: Rose Red (`bg-rose-50`, `text-rose-800`).
- **Typography**: Inter (Google Fonts) configured as the primary sans-serif typeface in Tailwind configs.

### 2. Layout Elements
- **[MainLayout.tsx](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/src/layouts/MainLayout.tsx)**: Standard container slot injecting `Navbar` and `Footer`.
- **[Navbar.tsx](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/src/components/Navbar.tsx)**: Displays logo, route indicators, and a health polling check indicator dot query `/health` every 10 seconds.
- **[Footer.tsx](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/src/components/Footer.tsx)**: redrafted SaaS footer showing legal copyrights, developer profiles, and clinical disclaimers.

---

## ⚡ Client Validation & Forms

### 1. Multi-Step Form Wizard
- **Script**: [Prediction.tsx](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/src/pages/Prediction.tsx)
- **Framework**: `react-hook-form` coupled with Zod resolvers.
- **Steps Flow**:
  1. *Step 1: Personal*: Age (29-100) and Sex.
  2. *Step 2: Vitals*: Resting Blood Pressure (80-200), Cholesterol (100-600), and Max Heart Rate (60-220).
  3. *Step 3: Clinical Indicators*: Chest Pain Type, Fasting Blood Sugar, Resting ECG, Exercise Induced Angina, ST Depression (0.0-6.0), ST Slope, Colored Major Vessels (0-3), and Thalassemia.

### 2. Local Zod Validation Schema
- Range checks are enforced client-side before POST requests to prevent unnecessary API overhead or database exceptions:
  ```typescript
  export const assessmentSchema = z.object({
    age: z.coerce.number().min(29).max(100),
    resting_blood_pressure: z.coerce.number().min(80).max(200),
    cholesterol: z.coerce.number().min(100).max(600),
    max_heart_rate: z.coerce.number().min(60).max(220),
    st_depression: z.coerce.number().min(0.0).max(6.0),
    // ...
  });
  ```
