import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # ROS2 Settings
    NODE_NAME_COMMAND: str = "rover_command_node"
    NODE_NAME_TELEMETRY: str = "rover_telemetry_node"
    
    # InfluxDB Settings
    INFLUXDB_URL: str = os.getenv("INFLUXDB_URL", "http://localhost:8086")
    INFLUXDB_TOKEN: str = os.getenv("INFLUXDB_TOKEN", "my-super-secret-token")
    INFLUXDB_ORG: str = os.getenv("INFLUXDB_ORG", "rover_org")
    INFLUXDB_BUCKET: str = os.getenv("INFLUXDB_BUCKET", "telemetry")

    class Config:
        env_file = ".env"

settings = Settings()
