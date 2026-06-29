import sys
from backend.services.prediction_service import prediction_service
from backend.services.logger import logger
from backend.ml.config import FEATURE_COLS

def get_float_input(prompt: str, min_val: float = None, max_val: float = None) -> float:
    while True:
        try:
            val_str = input(prompt).strip()
            if not val_str:
                print("Input cannot be empty. Please enter a valid number.")
                continue
            val = float(val_str)
            if min_val is not None and val < min_val:
                print(f"Value must be >= {min_val}.")
                continue
            if max_val is not None and val > max_val:
                print(f"Value must be <= {max_val}.")
                continue
            return val
        except ValueError:
            print("Invalid input. Please enter a numerical value.")

def main():
    print("="*60)
    print("HEART DISEASE DETECTION SYSTEM - PREDICTION CLIENT")
    print("="*60)
    
    if not prediction_service.is_model_loaded():
        print("Error: The machine learning model files are not loaded.")
        print("Please run the training pipeline first: python3 backend/train_cli.py")
        sys.exit(1)
        
    print("\nEnter Patient Details:")
    patient_data = {}
    
    for col in FEATURE_COLS:
        if col == "sex":
            patient_data[col] = get_float_input(f"{col} (0 = Female, 1 = Male): ", 0, 1)
        elif col == "chest_pain_type":
            patient_data[col] = get_float_input(f"{col} (0 = Typical Angina, 1 = Atypical Angina, 2 = Non-Anginal Pain, 3 = Asymptomatic): ", 0, 3)
        elif col == "fasting_blood_sugar":
            patient_data[col] = get_float_input(f"{col} (1 = Blood Sugar > 120mg/dl, 0 = <= 120mg/dl): ", 0, 1)
        elif col == "resting_ecg":
            patient_data[col] = get_float_input(f"{col} (0 = Normal, 1 = ST-T Wave Abnormality, 2 = Left Ventricular Hypertrophy): ", 0, 2)
        elif col == "exercise_induced_angina":
            patient_data[col] = get_float_input(f"{col} (Yes = 1, No = 0): ", 0, 1)
        elif col == "st_slope":
            patient_data[col] = get_float_input(f"{col} (0 = Upsloping, 1 = Flat, 2 = Downsloping): ", 0, 2)
        elif col == "thalassemia":
            patient_data[col] = get_float_input(f"{col} (0 = Normal, 1 = Fixed Defect, 2 = Reversible Defect): ", 0, 2)
        elif col == "num_major_vessels":
            patient_data[col] = get_float_input(f"{col} (Number of major vessels: 0-3): ", 0, 3)
        elif col == "st_depression":
            patient_data[col] = get_float_input(f"{col} (ST depression induced by exercise, e.g., 0.2): ", 0.0)
        else:
            patient_data[col] = get_float_input(f"{col}: ", 0.0)
            
    print("\nRunning Prediction...")
    try:
        res = prediction_service.predict_patient(patient_data)
        
        print("\n" + "="*40)
        print("          PATIENT CLINICAL REPORT          ")
        print("="*40)
        print(f"Prediction:         {res['status']}")
        print(f"Confidence (Risk):  {res['probability_disease']*100:.2f}%")
        print(f"Confidence (Safe):  {res['probability_no_disease']*100:.2f}%")
        print(f"Risk Level:         {res['risk_level']}")
        print("-"*40)
        print("Clinical Advice:")
        for item in res["advice"]:
            print(f"  - {item}")
        print("="*40 + "\n")
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        logger.error("CLI prediction failed", exc_info=True)

if __name__ == "__main__":
    main()
