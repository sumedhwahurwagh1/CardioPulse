import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ArrowLeft, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import type { PredictionResponse, PatientData } from '../types';

export const Result: React.FC = () => {
  const location = useLocation();
  const state = location.state as { result: PredictionResponse; input: PatientData } | null;

  // Handle case where result is not loaded in router state
  if (!state || !state.result) {
    return <Navigate to="/predict" replace />;
  }

  const { result, input } = state;

  // Theme attributes based on risk levels
  const theme = {
    Low: {
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      accent: 'text-emerald-600',
      fill: '#10b981',
      icon: ShieldCheck,
      cardBg: 'bg-emerald-500',
    },
    Medium: {
      bg: 'bg-amber-50 border-amber-100 text-amber-800',
      accent: 'text-amber-600',
      fill: '#f59e0b',
      icon: AlertTriangle,
      cardBg: 'bg-amber-500',
    },
    High: {
      bg: 'bg-rose-50 border-rose-100 text-rose-800',
      accent: 'text-rose-600',
      fill: '#f43f5e',
      icon: ShieldAlert,
      cardBg: 'bg-rose-500',
    },
  }[result.risk_level];

  // SVG parameters for radial progress circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.round(result.probability_disease * 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Diagnostic Evaluation</h1>
            <p className="text-sm text-slate-500 mt-1">Generated patient coronary risk evaluation card.</p>
          </div>
          <Link
            to="/predict"
            className="inline-flex h-9 items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            New Assessment
          </Link>
        </div>

        {/* Prediction Headline Card */}
        <div className={`flex items-start gap-4 rounded-2xl border p-6 shadow-sm ${theme.bg}`}>
          <div className="mt-1">
            <theme.icon className="h-8 w-8 shrink-0" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">
              {result.status}
            </h2>
            <p className="text-sm leading-relaxed opacity-90">
              The model calculated a **{result.risk_level} Risk Level** with a coronary artery disease probability score of **{percentage}%**.
            </p>
          </div>
        </div>

        {/* Diagnostic Dashboard Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Visual Dial Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Probability Score</h3>
            
            <div className="relative flex items-center justify-center">
              {/* Outer dial ring */}
              <svg className="h-32 w-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  stroke={theme.fill}
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center percentage label */}
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-slate-900">{percentage}%</span>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Risk Score</span>
              </div>
            </div>

            <div className="flex gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Base: {(result.probability_no_disease * 100).toFixed(0)}% Healthy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.fill }} />
                <span>Coronary Risk: {percentage}%</span>
              </div>
            </div>
          </div>

          {/* Patient Details Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Submitted Details</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs text-slate-600 leading-normal">
              <div>
                <span className="text-slate-400 block font-semibold">AGE / SEX</span>
                <span className="font-bold text-slate-900">{input.age} yrs • {input.sex === 1 ? 'Male' : 'Female'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">CHEST PAIN TYPE</span>
                <span className="font-bold text-slate-900">
                  {input.chest_pain_type === 0 && 'Typical Angina'}
                  {input.chest_pain_type === 1 && 'Atypical Angina'}
                  {input.chest_pain_type === 2 && 'Non-Anginal'}
                  {input.chest_pain_type === 3 && 'Asymptomatic'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">BLOOD PRESSURE</span>
                <span className="font-bold text-slate-900">{input.resting_blood_pressure} mm Hg</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">CHOLESTEROL</span>
                <span className="font-bold text-slate-900">{input.cholesterol} mg/dL</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">MAX HEART RATE</span>
                <span className="font-bold text-slate-900">{input.max_heart_rate} bpm</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">ST DEPRESSION (oldpeak)</span>
                <span className="font-bold text-slate-900">{input.st_depression.toFixed(1)} mm</span>
              </div>
            </div>
          </div>

        </div>

        {/* Clinical advice cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-950">Recommended Health Advice</h3>
          
          <div className="grid gap-3">
            {result.advice.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-normal">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medical disclaimer callout */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-800 leading-normal flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong>Educational & Research Notice:</strong> This application is intended for educational and research purposes only. It does not provide medical diagnosis and must not replace consultation with qualified healthcare professionals or certified cardiologists.
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            to="/predict"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Perform Another Test
          </Link>
          <a
            href="https://www.heart.org/en/health-topics/heart-attack/understand-your-risks-to-prevent-a-heart-attack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 w-full sm:w-auto"
          >
            AHA Risk Guidelines
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>

      </motion.div>
    </div>
  );
};
export default Result;
