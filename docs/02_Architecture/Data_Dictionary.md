# Data Dictionary — CardioPulse v1.0

**Project Name**: CardioPulse  
**Version**: 1.0 (Production Release)  
**Status**: Production Release  
**Author**: Sumedh Sanjay Wahurwagh  
**Copyright**: © 2026 Sumedh Sanjay Wahurwagh. All Rights Reserved.  
**Disclaimer**: This application is intended for educational and research purposes only. It does not provide medical diagnosis and must not replace consultation with qualified healthcare professionals.  

---
1. Purpose
This document describes the dataset used by the Heart Disease Classification System. It explains each
attribute, its data type, possible values, and its role in the machine learning model.
Note: This project does not use a traditional database. Instead, it uses a structured CSV
dataset for training and prediction.
2. Dataset Overview
Attribute Value
Dataset Name Heart Disease Dataset
File Format CSV
Learning Type Supervised Classification
Target Variable Heart Disease
Number of Features13
Output Classes 2 (0 = No Disease, 1 = Disease)
3. Dataset Schema
Field NameData TypeDescription Example
age Integer Age of the patient (years) 55
sex Integer Gender (0 = Female, 1 = Male) 1
cp Integer Chest pain type 2
trestbps Integer Resting blood pressure (mm Hg) 140
1
Field NameData TypeDescription Example
chol Integer Serum cholesterol (mg/dL) 250
fbs Integer Fasting blood sugar (>120 mg/dL)0
restecg Integer Resting ECG results 1
thalach Integer Maximum heart rate achieved 150
exang Integer Exercise-induced angina (0 = No, 1 = Yes)0
oldpeak Float ST depression induced by exercise1.2
slope Integer Slope of the peak exercise ST segment2
ca Integer Number of major vessels (0–3) 0
thal Integer Thalassemia type 2
target Integer Heart disease prediction (0 = No, 1 = Yes)1
4. Target Variable
Value Meaning
0 No Heart Disease
1 Heart Disease Detected
5. Feature Categories
Demographic
Age
Sex
Clinical Measurements
Resting Blood Pressure
Cholesterol
Fasting Blood Sugar
Maximum Heart Rate
ST Depression
• 
• 
• 
• 
• 
• 
• 
2
Diagnostic Features
Chest Pain Type
Resting ECG
Exercise-Induced Angina
ST Slope
Number of Major Vessels
Thalassemia
6. Data Validation Rules
Field Validation
Age Positive integer
Blood Pressure Positive integer
Cholesterol Positive integer
Maximum Heart RatePositive integer
ST Depression Decimal value ≥ 0
Remaining Fields Valid categorical values only
The application should reject incomplete or invalid records before prediction.
7. Data Preprocessing
Before model training, the dataset undergoes:
Missing value check
Duplicate record removal
Feature scaling using StandardScaler
Train-test split
Model training
8. Data Relationships
text id="uxjkp8"
Patient Information
        │
        ▼
Feature Vector
        │
        ▼
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
3
Machine Learning Model
        │
        ▼
Prediction
Each patient record contains all 13 input features required to generate one prediction.
9. Data Storage
The project stores:
File Purpose
heart_disease_dataset.csvTraining dataset
heart_disease_model.pklTrained machine learning model
scaler .pkl Saved feature scaler
10. Data Quality Checks
Before training, the dataset should be checked for:
Missing values
Duplicate records
Incorrect data types
Invalid feature values
Class distribution balance
11. Data Security
The dataset should:
Be stored securely.
Be used only for prediction and model training.
Not expose sensitive patient information.
Be protected from unauthorized modification.
• 
• 
• 
• 
• 
• 
• 
• 
• 
4
12. Future Data Enhancements
Future versions may include:
Additional patient attributes
Larger datasets
Real-time patient records
Electronic Health Record (EHR) integration
Automated dataset updates
13. Summary
The Heart Disease Classification System uses a structured dataset containing 13 medical input
features and 1 target variable. Each feature contributes to the machine learning model's ability to
predict the likelihood of heart disease. Proper validation, preprocessing, and secure storage of the
dataset help ensure reliable predictions and maintain data quality throughout the application lifecycle.
• 
• 
• 
• 
• 
5
