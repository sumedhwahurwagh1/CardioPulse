import pytest
from backend.services.prediction_service import prediction_service
from backend.ml.config import FEATURE_COLS

@pytest.fixture
def valid_patient():
    return {
        "age": 58,
        "sex": 1,
        "chest_pain_type": 1,
        "resting_blood_pressure": 120,
        "cholesterol": 220,
        "fasting_blood_sugar": 0,
        "resting_ecg": 1,
        "max_heart_rate": 160,
        "exercise_induced_angina": 0,
        "st_depression": 0.8,
        "st_slope": 1,
        "num_major_vessels": 0,
        "thalassemia": 2
    }

def test_prediction_service_artifacts_loaded():
    assert prediction_service.is_model_loaded() is True
    
    info = prediction_service.get_model_info()
    assert info["model_loaded"] is True
    assert "metrics" in info
    assert "features" in info
    assert len(info["features"]) == 13

def test_predict_patient_success(valid_patient):
    res = prediction_service.predict_patient(valid_patient)
    
    assert "prediction" in res
    assert res["prediction"] in (0, 1)
    assert "status" in res
    assert res["status"] in ("Heart Disease Detected", "No Heart Disease")
    assert "probability_disease" in res
    assert 0.0 <= res["probability_disease"] <= 1.0
    assert "probability_no_disease" in res
    assert 0.0 <= res["probability_no_disease"] <= 1.0
    assert "risk_level" in res
    assert res["risk_level"] in ("Low", "Medium", "High")
    assert "advice" in res
    assert isinstance(res["advice"], list)
    assert len(res["advice"]) > 0

def test_predict_patient_validation_error(valid_patient):
    # Remove one required column
    invalid_patient = valid_patient.copy()
    invalid_patient.pop("age")
    
    with pytest.raises(ValueError) as excinfo:
        prediction_service.predict_patient(invalid_patient)
    assert "missing required attributes" in str(excinfo.value)
