import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve, auc, ConfusionMatrixDisplay
)
from backend.services.logger import logger

def calculate_metrics(y_true: pd.Series, y_pred: np.ndarray, y_score: np.ndarray = None) -> dict:
    """Calculates accuracy, precision, recall, f1, and roc-auc metrics."""
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, zero_division=0))
    }
    
    if y_score is not None:
        metrics["roc_auc"] = float(roc_auc_score(y_true, y_score))
    else:
        metrics["roc_auc"] = float(accuracy_score(y_true, y_pred)) # fallback if score not provided
        
    return metrics

def compare_models(models: dict, X_test: np.ndarray, y_test: pd.Series) -> pd.DataFrame:
    """Trains and compares all candidate models, compiling a comparison DataFrame."""
    logger.info("Comparing candidate models on evaluation metrics")
    results = []
    
    for name, model in models.items():
        y_pred = model.predict(X_test)
        
        # Determine prediction scores/probabilities
        if hasattr(model, 'predict_proba'):
            y_score = model.predict_proba(X_test)[:, 1]
        elif hasattr(model, 'decision_function'):
            from sklearn.preprocessing import MinMaxScaler
            dec_func = model.decision_function(X_test)
            if dec_func.ndim == 1:
                y_score = MinMaxScaler().fit_transform(dec_func.reshape(-1, 1)).ravel()
            else:
                y_score = MinMaxScaler().fit_transform(dec_func)[:, 1]
        else:
            y_score = y_pred
            
        metrics = calculate_metrics(y_test, y_pred, y_score)
        metrics["Model"] = name
        results.append(metrics)
        
    df_results = pd.DataFrame(results).sort_values("accuracy", ascending=False)
    return df_results

def plot_model_comparison(comparison_df: pd.DataFrame, save_path: str = None):
    """Generates bar chart comparing accuracy across models."""
    plt.figure(figsize=(10, 6))
    sns.barplot(data=comparison_df, x="Model", y="accuracy", hue="Model", legend=False)
    plt.xticks(rotation=20)
    plt.ylabel("Accuracy")
    plt.title("Model Comparison (Accuracy)")
    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        logger.info(f"Saved model comparison plot to: {save_path}")
    plt.close()

def plot_confusion_matrix(model, X_test: np.ndarray, y_test: pd.Series, save_path: str = None):
    """Generates and saves the confusion matrix for the given model."""
    plt.figure(figsize=(8, 6))
    ConfusionMatrixDisplay.from_estimator(model, X_test, y_test, cmap="Blues")
    plt.title(f"Confusion Matrix - {type(model).__name__}")
    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        logger.info(f"Saved confusion matrix plot to: {save_path}")
    plt.close("all")

def plot_roc_curve(model, X_test: np.ndarray, y_test: pd.Series, save_path: str = None):
    """Generates and saves ROC curve plot for the given model."""
    if hasattr(model, 'predict_proba'):
        probs = model.predict_proba(X_test)[:, 1]
    elif hasattr(model, 'decision_function'):
        probs = model.decision_function(X_test)
    else:
        probs = model.predict(X_test)
        
    fpr, tpr, _ = roc_curve(y_test, probs)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title(f"ROC Curve - {type(model).__name__}")
    plt.legend(loc="lower right")
    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        logger.info(f"Saved ROC curve plot to: {save_path}")
    plt.close()

def plot_feature_importance(model, feature_names: list, save_path: str = None) -> bool:
    """Generates feature importance bar plot if the model has feature_importances_."""
    if not hasattr(model, "feature_importances_"):
        logger.info(f"Model {type(model).__name__} does not support feature_importances_")
        return False
        
    imp = pd.DataFrame({
        "Feature": feature_names,
        "Importance": model.feature_importances_
    }).sort_values("Importance", ascending=False)
    
    plt.figure(figsize=(10, 8))
    sns.barplot(data=imp, x="Importance", y="Feature")
    plt.title(f"Feature Importance - {type(model).__name__}")
    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        logger.info(f"Saved feature importance plot to: {save_path}")
    plt.close()
    return True
