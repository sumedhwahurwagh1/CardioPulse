import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Terminal, GitBranch } from 'lucide-react';
import { apiService } from '../services/api';
import type { ModelInfoResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

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

      </div>
    </div>
  );
};
export default About;
