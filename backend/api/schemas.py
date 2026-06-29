from pydantic import BaseModel, Field
from typing import List, Dict, Any

class PatientData(BaseModel):
    age: int = Field(..., gt=0, description="Age of the patient (years)")
    sex: int = Field(..., ge=0, le=1, description="Gender (0 = Female, 1 = Male)")
    chest_pain_type: int = Field(..., ge=0, le=3, description="Chest pain type (0-3)")
    resting_blood_pressure: int = Field(..., gt=0, description="Resting blood pressure (mm Hg)")
    cholesterol: int = Field(..., gt=0, description="Serum cholesterol (mg/dL)")
    fasting_blood_sugar: int = Field(..., ge=0, le=1, description="Fasting blood sugar (>120 mg/dL: 1, <=120 mg/dL: 0)")
    resting_ecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    max_heart_rate: int = Field(..., gt=0, description="Maximum heart rate achieved")
    exercise_induced_angina: int = Field(..., ge=0, le=1, description="Exercise-induced angina (0 = No, 1 = Yes)")
    st_depression: float = Field(..., ge=0.0, description="ST depression induced by exercise (decimal >= 0)")
    st_slope: int = Field(..., ge=0, le=2, description="Slope of the peak exercise ST segment (0-2)")
    num_major_vessels: int = Field(..., ge=0, le=3, description="Number of major vessels (0–3)")
    thalassemia: int = Field(..., ge=0, le=2, description="Thalassemia type (0-2)")

    class Config:
        schema_extra = {
            "example": {
                "age": 65,
                "sex": 1,
                "chest_pain_type": 3,
                "resting_blood_pressure": 170,
                "cholesterol": 310,
                "fasting_blood_sugar": 1,
                "resting_ecg": 2,
                "max_heart_rate": 95,
                "exercise_induced_angina": 1,
                "st_depression": 4.2,
                "st_slope": 2,
                "num_major_vessels": 3,
                "thalassemia": 2
            }
        }

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="Target outcome prediction (0 = No Disease, 1 = Disease)")
    status: str = Field(..., description="Readable status description")
    probability_disease: float = Field(..., description="Probability score of heart disease")
    probability_no_disease: float = Field(..., description="Probability score of no heart disease")
    risk_level: str = Field(..., description="Calculated risk level (Low, Medium, High)")
    advice: List[str] = Field(..., description="Health advice based on prediction status")

class ModelInfoResponse(BaseModel):
    model_loaded: bool = Field(..., description="Model loaded status")
    metrics: Dict[str, Any] = Field(..., description="Trained model metrics")
    features: List[str] = Field(..., description="List of feature names")
    metadata: Dict[str, Any] = Field(..., description="Model training metadata")
