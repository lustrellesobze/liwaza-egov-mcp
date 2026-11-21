from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    WORLDBANK_BASE_URL: str = "https://api.worldbank.org/v2"
    COUNTRY_CODE: str = "CMR"
    ANTHROPIC_API_KEY: str = ""
    # If empty, API key authentication is disabled (local development, public demo).
    # If set, every /mcp/* request must send the same value in the X-API-Key header.
    MCP_API_KEY: str = ""
    # Comma-separated list of allowed browser origins.
    # Default "*" keeps the public demo working; in production set it to the
    # frontend domain, for example "https://my-app.vercel.app,http://localhost:5173".
    ALLOWED_ORIGINS: str = "*"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()
