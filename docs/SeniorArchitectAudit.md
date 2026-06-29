# Senior Architect Repository Audit — CardioPulse

This audit evaluates the codebase structure, configurations, security configurations, and pipeline scripts of CardioPulse prior to public open-source release on GitHub. 

---

## 🛑 1. Critical Findings

### 1.1 Missing `.gitignore` File
- **Location**: Root Workspace Directory
- **Why it matters**: Without a `.gitignore` file, developers will accidentally commit Python byte-compiled files (`__pycache__/`, `.pyc`), local logging output (`logs/*.log`), temporary cache folders (`.pytest_cache/`, `node_modules/`, `.dist/`), and operating system meta-files (`.DS_Store`). Committing these pollutes the commit log, increases clone times, and risks exposing private environment settings.
- **Recommendation**: Create a robust root `.gitignore` ignoring standard Python, Node, OS, and local logs metadata.

### 1.2 Unrestricted CORS Policy in Production
- **Location**: [backend/api/app.py](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/api/app.py)
- **Why it matters**: The FastAPI application currently permits all origins (`allow_origins=["*"]`). While essential for local development, allowing wildcard origins in production leaves the API exposed to Cross-Origin Resource Sharing (CORS) exploits.
- **Recommendation**: Read permitted CORS origins from an environment variable (e.g. `CORS_ALLOWED_ORIGINS`), falling back to `*` only if the environment is set to `development`.

---

## ⚠️ 2. Recommended Findings

### 2.1 Missing CI Caching in GitHub Actions
- **Location**: [.github/workflows/ci.yml](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/.github/workflows/ci.yml)
- **Why it matters**: The current Python workflow step installs pip dependencies from scratch on every run. As the project scales, this increases workflow run times and creates dependency on external server speeds.
- **Recommendation**: Integrate `actions/setup-python` dependency caching to speed up CI runs.

### 2.2 Hardcoded Configurations in ML Core
- **Location**: [backend/ml/config.py](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/backend/ml/config.py)
- **Why it matters**: Parameters like `RANDOM_STATE` (42), `TEST_SIZE` (0.2), and file directories are hardcoded. In a production pipeline, clinical researchers should be able to override these variables (e.g., to adjust the test ratio or split seeds) without changing the source code.
- **Recommendation**: Bind these settings to environment variables using `os.getenv` with sensible defaults.

### 2.3 Capitalization Folder Naming Inconsistency
- **Location**: Root `Docs/` directory vs lowercase folders (`backend/`, `frontend/`, `dataset/`, etc.)
- **Why it matters**: Unix-like environments are case-sensitive. Having `Docs/` capitalized while all other system modules are lowercase represents a folder organization inconsistency. Standard open-source repositories adopt lowercase `docs/` which integrates natively with GitHub Pages.
- **Recommendation**: Rename the folder to lowercase `docs/` and adjust file-scheme links inside markdown docs.

---

## 💡 3. Optional Findings

### 3.1 Vite Asset Chunk Size Warnings
- **Location**: [frontend/vite.config.ts](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/vite.config.ts)
- **Why it matters**: The frontend build logs a warning that JS chunks exceed 500kB. This is due to importing large libraries (Framer Motion, Lucide React) in a single bundle, which can slightly increase initial page load times on slow connections.
- **Recommendation**: Configure Vite rollup code-splitting inside `vite.config.ts` to separate vendor packages from the core code.

### 3.2 Add Accessibility Labels for Screen Readers
- **Location**: [frontend/src/pages/Prediction.tsx](file:///Users/sumedhwahurwagh/Heart-Disease-Detection-ML/frontend/src/pages/Prediction.tsx)
- **Why it matters**: Form navigation controls (e.g. Chevron arrows) lack explicit `aria-label` tags, which reduces screen-reader usability for visually impaired clinical operators.
- **Recommendation**: Add standard `aria-label="Previous page"` and `aria-label="Next page"` to form buttons.
