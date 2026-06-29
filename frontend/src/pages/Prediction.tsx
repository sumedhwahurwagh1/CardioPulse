import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Activity, Heart, User, Check, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import Tooltip from '../components/Tooltip';

// 1. Zod Validation Schema matching Clinical Data limits
const assessmentSchema = z.object({
  age: z.coerce.number()
    .int('Age must be a whole number')
    .min(1, 'Age must be greater than 0')
    .max(120, 'Age cannot exceed 120'),
  sex: z.coerce.number()
    .int()
    .min(0)
    .max(1),
  chest_pain_type: z.coerce.number()
    .int()
    .min(0)
    .max(3),
  resting_blood_pressure: z.coerce.number()
    .int('Resting Blood Pressure must be a whole number')
    .min(50, 'Blood pressure must be >= 50 mm Hg')
    .max(300, 'Blood pressure must be <= 300 mm Hg'),
  cholesterol: z.coerce.number()
    .int('Serum Cholesterol must be a whole number')
    .min(50, 'Cholesterol must be >= 50 mg/dL')
    .max(600, 'Cholesterol must be <= 600 mg/dL'),
  fasting_blood_sugar: z.coerce.number()
    .int()
    .min(0)
    .max(1),
  resting_ecg: z.coerce.number()
    .int()
    .min(0)
    .max(2),
  max_heart_rate: z.coerce.number()
    .int('Maximum Heart Rate must be a whole number')
    .min(50, 'Heart rate must be >= 50 bpm')
    .max(250, 'Heart rate must be <= 250 bpm'),
  exercise_induced_angina: z.coerce.number()
    .int()
    .min(0)
    .max(1),
  st_depression: z.coerce.number()
    .min(0.0, 'ST depression must be >= 0.0')
    .max(10.0, 'ST depression must be <= 10.0'),
  st_slope: z.coerce.number()
    .int()
    .min(0)
    .max(2),
  num_major_vessels: z.coerce.number()
    .int()
    .min(0)
    .max(3),
  thalassemia: z.coerce.number()
    .int()
    .min(0)
    .max(2),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

export const Prediction: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema) as any,
    defaultValues: {
      age: 45,
      sex: 1,
      chest_pain_type: 0,
      resting_blood_pressure: 120,
      cholesterol: 200,
      fasting_blood_sugar: 0,
      resting_ecg: 0,
      max_heart_rate: 150,
      exercise_induced_angina: 0,
      st_depression: 0.0,
      st_slope: 0,
      num_major_vessels: 0,
      thalassemia: 0,
    },
  });

  // Steps definitions
  const steps = [
    { id: 1, title: 'Personal Information', icon: User, fields: ['age', 'sex'] },
    { id: 2, title: 'Vital Measurements', icon: Heart, fields: ['resting_blood_pressure', 'cholesterol', 'max_heart_rate'] },
    { id: 3, title: 'Clinical Indicators', icon: Activity, fields: ['chest_pain_type', 'fasting_blood_sugar', 'resting_ecg', 'exercise_induced_angina', 'st_depression', 'st_slope', 'num_major_vessels', 'thalassemia'] },
  ];

  const handleNext = async () => {
    // Validate current step fields before going forward
    const fieldsToValidate = steps[currentStep - 1].fields as (keyof AssessmentFormValues)[];
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      setErrorMsg(null);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMsg(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        if (currentStep < steps.length) {
          e.preventDefault();
          handleNext();
        }
      }
    }
  };

  const onSubmit = async (data: AssessmentFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await apiService.predict(data);
      // Navigate to /result and pass prediction result in router state
      navigate('/result', { state: { result: response, input: data } });
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please verify backend connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        
        {/* Title */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cardiovascular Risk Assessment
          </h1>
          <p className="text-sm text-slate-500">
            Provide the patient details below to compute risk levels.
          </p>
        </div>

        {/* Progress Tracker Banner */}
        <div className="flex items-center justify-between border border-slate-200 bg-white rounded-2xl p-4 shadow-sm">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border transition-all ${
                      isCompleted
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : isActive
                        ? 'border-brand-600 text-brand-600 ring-2 ring-brand-100'
                        : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${
                      isActive ? 'text-brand-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-px mx-4 bg-slate-200 ${
                      currentStep > step.id ? 'bg-brand-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-4 border border-rose-100 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-900 block mb-0.5">Submission Failed</span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Form panel */}
        <form 
          onSubmit={handleSubmit(onSubmit as any)} 
          onKeyDown={handleKeyDown}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-6 overflow-hidden"
        >
          
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Step 1: Personal Information</h2>
                
                {/* Age */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="age" className="text-sm font-semibold text-slate-700">
                    Patient Age
                    <Tooltip content="Age of the patient in years (integer 1-120)." />
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register('age')}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                      errors.age ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.age && <p className="text-xs text-rose-600">{errors.age.message}</p>}
                </div>

                {/* Sex */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="sex" className="text-sm font-semibold text-slate-700">
                    Patient Biological Sex
                    <Tooltip content="Biological gender of the patient." />
                  </label>
                  <select
                    id="sex"
                    {...register('sex')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={1}>Male</option>
                    <option value={0}>Female</option>
                  </select>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Step 2: Vital Measurements</h2>
                
                {/* Resting Blood Pressure */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="resting_blood_pressure" className="text-sm font-semibold text-slate-700">
                    Resting Blood Pressure (mm Hg)
                    <Tooltip content="Resting systolic blood pressure upon admission (50 - 300 mm Hg)." />
                  </label>
                  <input
                    type="number"
                    id="resting_blood_pressure"
                    {...register('resting_blood_pressure')}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none ${
                      errors.resting_blood_pressure ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.resting_blood_pressure && <p className="text-xs text-rose-600">{errors.resting_blood_pressure.message}</p>}
                </div>

                {/* Cholesterol */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="cholesterol" className="text-sm font-semibold text-slate-700">
                    Serum Cholesterol (mg/dL)
                    <Tooltip content="Serum cholesterol measured in mg/dL (50 - 600 mg/dL)." />
                  </label>
                  <input
                    type="number"
                    id="cholesterol"
                    {...register('cholesterol')}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none ${
                      errors.cholesterol ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.cholesterol && <p className="text-xs text-rose-600">{errors.cholesterol.message}</p>}
                </div>

                {/* Max Heart Rate */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="max_heart_rate" className="text-sm font-semibold text-slate-700">
                    Maximum Heart Rate Achieved (bpm)
                    <Tooltip content="Maximum pulse/heart rate achieved during exercise stress test (50 - 250 bpm)." />
                  </label>
                  <input
                    type="number"
                    id="max_heart_rate"
                    {...register('max_heart_rate')}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none ${
                      errors.max_heart_rate ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                  {errors.max_heart_rate && <p className="text-xs text-rose-600">{errors.max_heart_rate.message}</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 sm:grid-cols-2 max-h-[50vh] overflow-y-auto pr-1.5 custom-scrollbar"
              >
                <h2 className="col-span-2 text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Step 3: Clinical Indicators</h2>
                
                {/* Chest Pain Type */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="chest_pain_type" className="text-sm font-semibold text-slate-700">
                    Chest Pain Type
                    <Tooltip content="Anginal pain index: 0 = Typical Angina, 1 = Atypical Angina, 2 = Non-Anginal Pain, 3 = Asymptomatic." />
                  </label>
                  <select
                    id="chest_pain_type"
                    {...register('chest_pain_type')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>Typical Angina</option>
                    <option value={1}>Atypical Angina</option>
                    <option value={2}>Non-Anginal Pain</option>
                    <option value={3}>Asymptomatic</option>
                  </select>
                </div>

                {/* Fasting Blood Sugar */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="fasting_blood_sugar" className="text-sm font-semibold text-slate-700">
                    Fasting Blood Sugar
                    <Tooltip content="Fasting blood sugar level relative to threshold of 120 mg/dL." />
                  </label>
                  <select
                    id="fasting_blood_sugar"
                    {...register('fasting_blood_sugar')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>&lt;= 120 mg/dL</option>
                    <option value={1}>&gt; 120 mg/dL</option>
                  </select>
                </div>

                {/* Resting ECG */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="resting_ecg" className="text-sm font-semibold text-slate-700">
                    Resting ECG Result
                    <Tooltip content="Electrocardiographic results: 0 = Normal, 1 = ST-T Wave Abnormality, 2 = Left Ventricular Hypertrophy." />
                  </label>
                  <select
                    id="resting_ecg"
                    {...register('resting_ecg')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>Normal</option>
                    <option value={1}>ST-T Wave Abnormality</option>
                    <option value={2}>Left Ventricular Hypertrophy</option>
                  </select>
                </div>

                {/* Exercise Induced Angina */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="exercise_induced_angina" className="text-sm font-semibold text-slate-700">
                    Exercise Induced Angina
                    <Tooltip content="Presence of chest pain provoked by active physical exertion." />
                  </label>
                  <select
                    id="exercise_induced_angina"
                    {...register('exercise_induced_angina')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>

                {/* ST Depression */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="st_depression" className="text-sm font-semibold text-slate-700">
                    ST Depression (oldpeak)
                    <Tooltip content="Depression of ST segment relative to baseline rest (decimal range 0.0 - 10.0)." />
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="st_depression"
                    {...register('st_depression')}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none ${
                      errors.st_depression ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                  {errors.st_depression && <p className="text-xs text-rose-600">{errors.st_depression.message}</p>}
                </div>

                {/* ST Slope */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="st_slope" className="text-sm font-semibold text-slate-700">
                    ST segment Slope
                    <Tooltip content="Slope of peak exercise ST segment: 0 = Upsloping, 1 = Flat, 2 = Downsloping." />
                  </label>
                  <select
                    id="st_slope"
                    {...register('st_slope')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>Upsloping</option>
                    <option value={1}>Flat</option>
                    <option value={2}>Downsloping</option>
                  </select>
                </div>

                {/* Number of Major Vessels */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="num_major_vessels" className="text-sm font-semibold text-slate-700">
                    Fluoroscopy Major Vessels (ca)
                    <Tooltip content="Number of major blood vessels (0-3) colored by radioactive fluoroscopy dye." />
                  </label>
                  <select
                    id="num_major_vessels"
                    {...register('num_major_vessels')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>

                {/* Thalassemia */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="thalassemia" className="text-sm font-semibold text-slate-700">
                    Thalassemia Type
                    <Tooltip content="Genetic red-blood-cell mapping: 0 = Normal, 1 = Fixed Defect, 2 = Reversible Defect." />
                  </label>
                  <select
                    id="thalassemia"
                    {...register('thalassemia')}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value={0}>Normal</option>
                    <option value={1}>Fixed Defect</option>
                    <option value={2}>Reversible Defect</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button navigation controls */}
          <div className="flex justify-between border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              aria-label="Go to the previous step"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            
            {currentStep < steps.length && (
              <button
                key="next-button"
                type="button"
                onClick={handleNext}
                aria-label="Go to the next step"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {currentStep === steps.length && (
              <button
                key="submit-button"
                type="submit"
                disabled={isSubmitting}
                aria-label="Submit patient risk assessment form"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Evaluating Risk...' : 'Run Diagnostics'}
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
export default Prediction;
