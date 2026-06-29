import os
import sys
import datetime
from sklearn.metrics import classification_report, confusion_matrix
from backend.services.logger import logger
from backend.ml.config import (
    DATASET_PATH, TARGET_COL, FEATURE_COLS, MODEL_PATH, SCALER_PATH
)
from backend.ml.preprocessing import (
    load_data, preprocess_data, split_data, fit_scaler, scale_features
)
from backend.ml.training import (
    get_candidate_models, train_candidate_models, save_artifacts
)
from backend.ml.evaluation import (
    compare_models, plot_model_comparison, plot_confusion_matrix,
    plot_roc_curve, plot_feature_importance
)

def run_training_pipeline():
    logger.info("Starting model training pipeline...")
    
    # 1. Load data
    if not os.path.exists(DATASET_PATH):
        logger.error(f"Dataset path {DATASET_PATH} does not exist.")
        sys.exit(1)
        
    df = load_data(DATASET_PATH)
    
    # 2. Preprocess
    df = preprocess_data(df)
    
    # 3. Split data
    X_train, X_test, y_train, y_test = split_data(df, TARGET_COL, FEATURE_COLS)
    
    # 4. Scale features
    scaler = fit_scaler(X_train)
    X_train_scaled = scale_features(X_train, scaler)
    X_test_scaled = scale_features(X_test, scaler)
    
    # 5. Train candidates
    candidates = get_candidate_models()
    trained_candidates = train_candidate_models(candidates, X_train_scaled, y_train)
    
    # 6. Compare and evaluate
    comparison_df = compare_models(trained_candidates, X_test_scaled, y_test)
    
    print("\n" + "="*60)
    print("MODEL COMPARISON RESULTS")
    print("="*60)
    print(comparison_df.to_string(index=False))
    print("="*60 + "\n")
    
    # 7. Identify best model (highest accuracy)
    best_row = comparison_df.iloc[0]
    best_name = best_row["Model"]
    best_model = trained_candidates[best_name]
    logger.info(f"Best model selected: {best_name} with Accuracy: {best_row['accuracy']:.4f}")
    
    # 8. Save evaluation plots to reports/
    reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    plot_model_comparison(comparison_df, os.path.join(reports_dir, "model_comparison.png"))
    plot_confusion_matrix(best_model, X_test_scaled, y_test, os.path.join(reports_dir, "confusion_matrix.png"))
    plot_roc_curve(best_model, X_test_scaled, y_test, os.path.join(reports_dir, "roc_curve.png"))
    plot_feature_importance(best_model, FEATURE_COLS, os.path.join(reports_dir, "feature_importance.png"))
    
    # 9. Formulate metrics and metadata JSON dictionaries
    best_metrics = {
        "accuracy": float(best_row["accuracy"]),
        "precision": float(best_row["precision"]),
        "recall": float(best_row["recall"]),
        "f1_score": float(best_row["f1_score"]),
        "roc_auc": float(best_row["roc_auc"])
    }
    
    metadata = {
        "model_name": best_name,
        "model_class": type(best_model).__name__,
        "trained_at": datetime.datetime.now().isoformat(),
        "dataset_shape": df.shape,
        "random_state": 42
    }
    
    # 10. Save artifacts
    save_artifacts(best_model, scaler, FEATURE_COLS, best_metrics, metadata)
    
    logger.info("Training pipeline completed successfully.")

if __name__ == "__main__":
    run_training_pipeline()
