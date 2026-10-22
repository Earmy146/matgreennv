from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    groq_api_key: str | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    backend_base_url: str = "http://localhost:5000"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,https://matgreen.vercel.app"
    request_timeout_seconds: int = 25

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
