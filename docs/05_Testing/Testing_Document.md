# Testing Document — CardioPulse v1.0

This document outlines the testing strategy, test suites coverage, and automated integration pipelines of CardioPulse.

---

## 🧪 Testing Strategy

CardioPulse combines local unit testing with continuous integration builds to guarantee code reliability:

### 1. Pytest Unit Tests
- **Directory**: [tests/](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/tests/)
- **Test Modules**:
  - `test_preprocessing.py`: Evaluates data split ratios (80/20 train-test), duplicate removal validations, and StandardScaler fit/transform limits.
  - `test_prediction.py`: Evaluates mock patient records to ensure prediction logic maps risk groups correctly (Low vs. High Risk) and verifies that `PredictionException` is raised when model files are missing.

### 2. CI Verification Execution
- **Command**:
  ```bash
  PYTHONPATH=. pytest tests/
  ```
- **Execution Log**:
  - `6 passed` with zero failures.
  - Deprecation warnings are monitored and suppressed.

---

## 🏁 Continuous Integration Pipeline

Every push or pull request to the `main` branch triggers the GitHub Actions pipeline:
1. **Frontend Stage**: Compiles React TypeScript dependencies and builds static assets in Vite.
2. **Backend Stage**: Installs Python dependencies, executes the model training script `train_cli.py` to verify build syntax, and executes the complete Pytest suite.
3. **Caching**: Utilizes actions dependency caching to optimize pip and npm build speeds.
