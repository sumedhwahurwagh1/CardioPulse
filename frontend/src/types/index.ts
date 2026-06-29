export interface PatientData {
  age: number;
  sex: number; // 0 = Female, 1 = Male
  chest_pain_type: number; // 0-3
  resting_blood_pressure: number;
  cholesterol: number;
  fasting_blood_sugar: number; // 0 or 1
  resting_ecg: number; // 0-2
  max_heart_rate: number;
  exercise_induced_angina: number; // 0 or 1
  st_depression: number;
  st_slope: number; // 0-2
  num_major_vessels: number; // 0-3
  thalassemia: number; // 0-2
}

export interface PredictionResponse {
  prediction: number;
  status: string;
  probability_disease: number;
  probability_no_disease: number;
  risk_level: 'Low' | 'Medium' | 'High';
  advice: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface ModelMetadata {
  model_name: string;
  model_class: string;
  trained_at: string;
  dataset_shape: [number, number];
  random_state: number;
}

export interface ModelInfoResponse {
  model_loaded: boolean;
  metrics: ModelMetrics;
  features: string[];
  metadata: ModelMetadata;
}
