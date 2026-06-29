import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Award, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-brand-50/50 via-white to-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Left Column: Heading & Copy */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand-700"
            >
              <Zap className="h-3.5 w-3.5" />
              Decision Support for Healthcare Professionals
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
            >
              AI-Powered Heart <br />
              <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                Disease Classification
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="max-w-md text-base text-slate-500 sm:text-lg md:text-xl md:max-w-2xl leading-relaxed"
            >
              CardioPulse utilizes advanced machine learning classification algorithms to estimate patient coronary risks instantly. Optimize diagnostic timelines and support clinical judgment with stratified risk assessment.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                to="/predict"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
              >
                Start Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 w-full sm:w-auto"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Quick stats banner */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 w-full"
            >
              <div>
                <p className="text-2xl font-bold text-slate-900">90%+</p>
                <p className="text-xs text-slate-400">Target Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">&lt; 2s</p>
                <p className="text-xs text-slate-400">Response Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">13</p>
                <p className="text-xs text-slate-400">Clinical Markers</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Mock Illustration Card */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* Visual background gradient decoration */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500 to-indigo-500 opacity-20 blur-xl"></div>
            
            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-brand-600" />
                  <span className="font-semibold text-slate-950 text-sm">Interactive Risk Dashboard</span>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" /> Model Ready
                </span>
              </div>
              
              {/* Fake dashboard item */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>CORONARY RISK RATIO</span>
                    <span className="font-semibold text-slate-900">Low Risk</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '2.9%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-brand-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Patient 32 yrs old • Sex: Female • Cholesterol: 170 mg/dL</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>CORONARY RISK RATIO</span>
                    <span className="font-semibold text-rose-600">High Risk</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '99.9%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-rose-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Patient 65 yrs old • Sex: Male • Cholesterol: 310 mg/dL</p>
                </div>
              </div>

              <div className="mt-6 flex justify-center text-xs text-slate-400">
                Decision Support Tool (Not a Diagnosis Replacement)
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature section */}
      <section className="bg-slate-50 border-y border-slate-200/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for High-Fidelity Medical AI
            </h2>
            <p className="mt-4 text-base text-slate-500">
              CardioPulse features modular, production-ready microservices built to satisfy strict clinical parameters.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">Multi-Model Ensembles</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Trains and compares multiple classifiers: Logistic Regression, Random Forests, KNNs, and SVMs. The highest-performing model is loaded automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">Robust Data Dictionary</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Adheres strictly to the Cleveland clinic dataset constraints. Validates age, blood pressure, ECG status, and thalassemia inputs prior to model fitting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">Clinical Advice Recommendations</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Returns stratified advice based on risk brackets. Provides immediate action guidelines for high-risk profiles and preventive counseling for safe margins.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
