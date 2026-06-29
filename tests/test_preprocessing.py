import pytest
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from backend.ml.preprocessing import (
    preprocess_data, split_data, fit_scaler, scale_features
)
from backend.ml.config import FEATURE_COLS

def test_preprocess_data():
    # Construct a mock dataframe with a duplicate row
    data = {col: [1.0, 2.0, 1.0] for col in FEATURE_COLS}
    data["heart_disease"] = [0, 1, 0] # target
    df = pd.DataFrame(data)
    
    assert df.shape[0] == 3
    cleaned_df = preprocess_data(df)
    # The duplicate (row 0 and row 2 are identical) should be removed
    assert cleaned_df.shape[0] == 2

def test_split_data():
    # Construct a mock dataset large enough to split
    data = {col: list(range(10)) for col in FEATURE_COLS}
    data["heart_disease"] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    df = pd.DataFrame(data)
    
    X_train, X_test, y_train, y_test = split_data(df, "heart_disease", FEATURE_COLS)
    
    # Stratified split: test_size = 0.2 means test gets 2 items out of 10
    assert X_train.shape == (8, 13)
    assert X_test.shape == (2, 13)
    assert y_train.shape == (8,)
    assert y_test.shape == (2,)
    # Verify stratification (50% ratio preserved)
    assert (y_train == 1).sum() == 4
    assert (y_test == 1).sum() == 1

def test_fit_scaler_and_scale_features():
    # Setup data
    df_train = pd.DataFrame([[10.0, 20.0], [30.0, 40.0]], columns=["feat1", "feat2"])
    df_test = pd.DataFrame([[20.0, 30.0]], columns=["feat1", "feat2"])
    
    scaler = fit_scaler(df_train)
    assert isinstance(scaler, StandardScaler)
    
    scaled_test = scale_features(df_test, scaler)
    # Mean of feat1 = 20, Std of feat1 = 10
    # Mean of feat2 = 30, Std of feat2 = 10
    # Scaled test for [20, 30] should be [0.0, 0.0] (actually standard scaling works like this:
    # variance = ((10-20)^2 + (30-20)^2)/2 = 100, std = 10. So scaled val of 20 = (20-20)/10 = 0.0)
    assert np.allclose(scaled_test, np.array([[0.0, 0.0]]))
