# CardioPulse Frontend Client

CardioPulse Frontend is a modern, responsive single-page React application built with TypeScript, Vite, and Tailwind CSS. It communicates with the FastAPI coronary risk classification backend to provide real-time patient diagnostics and clinical recommendations.

## Tech Stack

- **Framework**: React 18 & TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Router**: React Router DOM v6
- **Forms**: React Hook Form
- **Validation**: Zod & `@hookform/resolvers`
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Setup & Installation

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables (Optional):**
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   If no variable is specified, the application defaults to connecting to `http://localhost:8000`.

## Available Scripts

### Development Server
Starts the local development server with hot-module reloading:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Production Build
Compiles TypeScript and bundles assets for production deployment:
```bash
npm run build
```
Output files are generated in the `dist/` directory.

### Preview Production
Locally serve the compiled production build:
```bash
npm run preview
```
