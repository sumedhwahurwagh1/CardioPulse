import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from backend.services.logger import logger
from backend.ml.config import RANDOM_STATE, TEST_SIZE

def load_data(file_path: str) -> pd.DataFrame:
    """Loads CSV dataset."""
    logger.info(f"Loading dataset from: {file_path}")
    try:
        df = pd.read_csv(file_path)
        logger.info(f"Successfully loaded dataset with shape: {df.shape}")
        return df
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        raise e

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans dataset by dropping duplicates and checking for missing values."""
    logger.info("Preprocessing data: checking missing values and removing duplicates")
    
    # Missing value check
    missing = df.isnull().sum().sum()
    if missing > 0:
        logger.warning(f"Dataset contains {missing} missing values! Handling or flagging.")
    
    # Duplicate check & removal
    duplicates = df.duplicated().sum()
    logger.info(f"Found {duplicates} duplicate rows.")
    if duplicates > 0:
        df = df.drop_duplicates()
        logger.info(f"Dropped duplicate rows. New shape: {df.shape}")
        
    return df

def split_data(df: pd.DataFrame, target_col: str, feature_cols: list) -> tuple:
    """Splits dataset into features and targets, then returns stratified train/test split."""
    logger.info(f"Splitting data into features (X) and target (y: '{target_col}')")
    
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset columns: {df.columns.tolist()}")
    
    # Verify feature columns exist
    missing_features = [col for col in feature_cols if col not in df.columns]
    if missing_features:
        raise ValueError(f"Missing feature columns in dataset: {missing_features}")
        
    X = df[feature_cols]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    logger.info(f"Split results: X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")
    return X_train, X_test, y_train, y_test

def fit_scaler(X_train: pd.DataFrame) -> StandardScaler:
    """Fits and returns a StandardScaler on training features."""
    logger.info("Fitting StandardScaler on training data")
    scaler = StandardScaler()
    scaler.fit(X_train)
    return scaler

def scale_features(X: pd.DataFrame, scaler: StandardScaler) -> np.ndarray:
    """Transforms features using a fitted scaler."""
    logger.info("Scaling features using StandardScaler")
    return scaler.transform(X)
