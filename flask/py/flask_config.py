"""flask_config.py - Intended only to hold flask env settings prod/dev"""


class Config:
    pass

class DevelopmentConfig:
    VITE_DEV_SERVER = "http://localhost:5173"

class ProductionConfig:
    VITE_DEV_SERVER = None
