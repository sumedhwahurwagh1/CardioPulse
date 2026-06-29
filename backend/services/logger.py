import logging
import os
import sys

class ApiLogFilter(logging.Filter):
    """Filters log records to only include those originating from API modules."""
    def filter(self, record):
        name = record.name.lower()
        filename = record.filename.lower()
        return "api" in name or "routes" in filename or "app" in filename or "exceptions" in filename

class TrainingLogFilter(logging.Filter):
    """Filters log records to only include those originating from training scripts."""
    def filter(self, record):
        name = record.name.lower()
        filename = record.filename.lower()
        return "train" in name or "training" in filename or "trainer" in filename or "evaluation" in filename

def setup_logger(name: str = "heart_disease") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s [%(name)s.%(funcName)s:%(lineno)d] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # 1. Console Handler - Logs all INFO and above to stdout
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Define logs directory in the workspace root
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    log_dir = os.path.join(base_dir, "logs")
    
    try:
        os.makedirs(log_dir, exist_ok=True)

        # 2. API log file handler
        api_handler = logging.FileHandler(os.path.join(log_dir, "api.log"))
        api_handler.setLevel(logging.INFO)
        api_handler.setFormatter(formatter)
        api_handler.addFilter(ApiLogFilter())
        logger.addHandler(api_handler)

        # 3. Training log file handler
        training_handler = logging.FileHandler(os.path.join(log_dir, "training.log"))
        training_handler.setLevel(logging.INFO)
        training_handler.setFormatter(formatter)
        training_handler.addFilter(TrainingLogFilter())
        logger.addHandler(training_handler)

        # 4. Error log file handler - Logs only errors/critical messages
        error_handler = logging.FileHandler(os.path.join(log_dir, "error.log"))
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        logger.addHandler(error_handler)

    except Exception as e:
        # Gracefully degrade if logs directory is unwritable in sandbox
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger

logger = setup_logger()
