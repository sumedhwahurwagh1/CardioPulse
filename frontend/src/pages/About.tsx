import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Terminal, GitBranch, User, Mail, Award, FileText } from 'lucide-react';
import { apiService } from '../services/api';
import type { ModelInfoResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const About: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        const info = await apiService.getModelInfo();
        setModelInfo(info);
      } catch (err) {
        console.warn('Failed to load model details for about page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModelDetails();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            About the Classification System
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            CardioPulse bridges clinical cardiology research with production-grade AI microservices.
          </p>
        </div>

        {/* Section 1: The Machine Learning Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <Cpu className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Machine Learning Core</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The heart disease model uses supervised binary classification. When training is executed, the pipeline compares five candidate models:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-600 pl-4 list-disc">
            <li><strong>Logistic Regression</strong>: Baseline classifier (fits linear log odds).</li>
            <li><strong>Random Forest</strong>: Ensemble estimator built on bootstrapped decision trees.</li>
            <li><strong>Support Vector Machine (SVM)</strong>: Projects features to solve maximum-margin hyperplanes.</li>
            <li><strong>K-Nearest Neighbors (KNN)</strong>: Instance-based distance voting model.</li>
            <li><strong>Decision Tree</strong>: Recursive partition model for logical features.</li>
          </ul>
          <p className="text-sm text-slate-600 leading-relaxed">
            The candidate model yielding the highest overall accuracy is pickled and deployed. In our baseline, **Logistic Regression** and **Random Forest** achieve optimal test accuracy.
          </p>
        </motion.div>

        {/* Section 2: Loaded Model Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <Terminal className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Active Deployment Info</h2>
          </div>
          
          {loading ? (
            <LoadingSpinner label="Querying backend for model info..." size="sm" />
          ) : modelInfo ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">SELECTED CLASSIFIER</span>
                  <span className="font-bold text-slate-900 text-sm">{modelInfo.metadata.model_name} ({modelInfo.metadata.model_class})</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">ACCURACY METRIC</span>
                  <span className="font-bold text-slate-900 text-sm">{(modelInfo.metrics.accuracy * 100).toFixed(2)}%</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">DATASET MATRIX</span>
                  <span className="font-bold text-slate-900 text-sm">{modelInfo.metadata.dataset_shape[0]} rows x {modelInfo.metadata.dataset_shape[1]} features</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">TRAINING DATE</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {new Date(modelInfo.metadata.trained_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              
              {/* Detailed metrics comparison */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs font-semibold text-slate-500">
                  EVALUATION METRICS BREAKDOWN
                </div>
                <div className="grid grid-cols-5 divide-x divide-slate-100 text-center text-xs p-3">
                  <div>
                    <span className="block text-slate-400">Accuracy</span>
                    <span className="font-bold text-slate-800">{(modelInfo.metrics.accuracy).toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Precision</span>
                    <span className="font-bold text-slate-800">{(modelInfo.metrics.precision).toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Recall</span>
                    <span className="font-bold text-slate-800">{(modelInfo.metrics.recall).toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">F1 Score</span>
                    <span className="font-bold text-slate-800">{(modelInfo.metrics.f1_score).toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">ROC-AUC</span>
                    <span className="font-bold text-slate-800">{(modelInfo.metrics.roc_auc).toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-rose-50 p-4 text-xs text-rose-800">
              Backend server is offline or model file not trained. Run the training CLI script first to see active model info here.
            </div>
          )}
        </motion.div>

        {/* Section 3: The Dataset */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <Database className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Cleveland Clinical Dataset</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The dataset originates from the Cleveland Clinic Foundation. Each patient record contains 13 diagnostic parameters used to classify coronary artery disease:
          </p>
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-2">Parameter</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Clinical Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="px-4 py-2 font-medium">trestbps</td>
                  <td className="px-4 py-2">Integer</td>
                  <td className="px-4 py-2">Resting blood pressure (mm Hg) upon admission</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">chol</td>
                  <td className="px-4 py-2">Integer</td>
                  <td className="px-4 py-2">Serum cholesterol level (mg/dL)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">thalach</td>
                  <td className="px-4 py-2">Integer</td>
                  <td className="px-4 py-2">Maximum heart rate achieved during stress test</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">oldpeak</td>
                  <td className="px-4 py-2">Float</td>
                  <td className="px-4 py-2">ST depression induced by exercise relative to rest</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">ca</td>
                  <td className="px-4 py-2">Integer</td>
                  <td className="px-4 py-2">Number of major vessels (0-3) colored by fluoroscopy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Section 4: Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <GitBranch className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Technology Stack</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 text-sm leading-relaxed text-slate-600">
            <div>
              <h3 className="font-semibold text-slate-900">Backend API Services</h3>
              <ul className="list-disc pl-4 mt-1 text-xs space-y-1">
                <li><strong>FastAPI</strong>: High performance async routing.</li>
                <li><strong>Scikit-Learn</strong>: Scaffolds classification models.</li>
                <li><strong>Joblib</strong>: Serialization of fitted weights/scalers.</li>
                <li><strong>Pydantic</strong>: Request parsing validation schemas.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Frontend Application</h3>
              <ul className="list-disc pl-4 mt-1 text-xs space-y-1">
                <li><strong>React & TypeScript</strong>: Type-safe component trees.</li>
                <li><strong>Tailwind CSS</strong>: Modern minimal utility styles.</li>
                <li><strong>React Hook Form & Zod</strong>: Client side form validations.</li>
                <li><strong>Framer Motion</strong>: Subtle transition animations.</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Developer Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <User className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Developer Profile</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sumedh Sanjay Wahurwagh</h3>
                <p className="text-sm text-slate-500 font-medium">Full Stack Developer & Machine Learning Engineer</p>
                <p className="text-xs text-slate-400 mt-0.5">College of Engineering and Technology, Akola</p>
              </div>

              {/* Skills badges */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Python", "FastAPI", "React", "TypeScript", "Scikit-learn", 
                  "Docker", "Machine Learning", "REST APIs", "Tailwind CSS", 
                  "GitHub Actions", "Render", "Vercel"
                ].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social details list */}
            <div className="w-full md:w-auto shrink-0 space-y-2.5 text-xs text-slate-600">
              <a
                href="https://github.com/sumedhwahurwagh1"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-brand-600 transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                <span>github.com/sumedhwahurwagh1</span>
              </a>
              <a
                href="https://www.linkedin.com/in/sumedh-wahurwagh-234093307/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-brand-600 transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
                <span>linkedin.com/in/sumedh-wahurwagh-234093307</span>
              </a>
              <a
                href="mailto:sumedhwahurwagh1@gmail.com"
                className="flex items-center gap-2 hover:text-brand-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>sumedhwahurwagh1@gmail.com</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Section 5: Acknowledgements & References */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <Award className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Acknowledgements</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            CardioPulse v1.0 would not be possible without the open-source libraries and public datasets provided by the research community. We acknowledge the following assets:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-500">
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="font-semibold text-slate-800 block">Dataset Origin</span>
              Cleveland Clinic Heart Disease
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="font-semibold text-slate-800 block">Repository Host</span>
              UCI Machine Learning
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="font-semibold text-slate-800 block">API Framework</span>
              FastAPI & Uvicorn
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="font-semibold text-slate-800 block">ML Estimators</span>
              Scikit-Learn & Joblib
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="font-semibold text-slate-800 block">UI Rendering</span>
              React & Tailwind CSS
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="font-semibold text-slate-800 block">Hosting Targets</span>
              Render & Vercel
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center leading-normal">
            * Cleveland dataset remains the property of UCI Machine Learning Repository. All frameworks (React, FastAPI, Docker, etc.) are the trademarks of their respective owners.
          </p>
        </motion.div>

        {/* Section 6: Legal Ownership & Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2 text-brand-600">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-slate-900">Legal Ownership & Notice</h2>
          </div>
          <div className="text-xs text-slate-500 space-y-3 leading-relaxed">
            <p>
              <strong>Copyright © 2026 Sumedh Sanjay Wahurwagh. All Rights Reserved.</strong>
            </p>
            <p>
              This software, source code, user interface, documentation, and system architecture are the intellectual property of Sumedh Sanjay Wahurwagh. Unauthorized commercial redistribution or code rebranding without explicit written permission is strictly prohibited.
            </p>
            <p className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-100">
              <strong>Medical Disclaimer:</strong> This application is intended for educational and research purposes only. It does not provide medical diagnosis, treatment guidelines, or patient outcomes, and must not replace consultations with qualified healthcare professionals or certified cardiologists.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
export default About;
