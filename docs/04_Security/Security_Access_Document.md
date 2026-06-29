# Security Access Document — CardioPulse v1.0

This document outlines the security controls, validation middleware, CORS rules, and data sanitization guidelines of CardioPulse.

---

## 🔒 Security Implementations

### 1. Cross-Origin Resource Sharing (CORS) Restrictions
- **Configuration File**: [app.py](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/api/app.py)
- **Controls**:
  - Direct wildcard allowed origins (`*`) are disabled in production to prevent malicious browser calls.
  - Allowed origin URLs are restricted to `http://localhost:5173`, `http://127.0.0.1:5173`, and the live production frontend `https://cardio-pulse.vercel.app`.
  - Regular expression matching (`allow_origin_regex=r"https://.*\.vercel\.app"`) secures dynamic preview deployments without introducing security vulnerabilities.

### 2. Validation & Input Sanitization
- **Client Side**: Zod schema intercepts out-of-range clinical inputs before form submission.
- **Server Side**: Pydantic models (`PatientData`) perform strict type coercion (converting parameters into float/integer ranges) and validate bounds before forwarding data to scikit-learn models. This mitigates type manipulation and command injection.

### 3. Stack Trace Suppression
- **Configuration File**: [exceptions.py](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/api/exceptions.py)
- **Controls**:
  - The application middleware intercepts unhandled internal errors and outputs clean, generic JSON error maps (`"detail": "Failed to generate prediction"`).
  - Internal debug stacks and traceback logs are stored privately in local files (`logs/error.log`) and never leaked to browser network responses.
