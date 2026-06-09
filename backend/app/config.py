from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    WORLDBANK_BASE_URL: str = "https://api.worldbank.org/v2"
    COUNTRY_CODE: str = "CMR"
    ANTHROPIC_API_KEY: str = ""
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"

settings = Settings()
