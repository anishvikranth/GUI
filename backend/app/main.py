import asyncio
import rclpy
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .api import deps
from concurrent.futures import ProcessPoolExecutor

from .api.v1 import hardware, telemetry, compute
from .ros2.command_worker import CommandWorker
from .ros2.telemetry_worker import TelemetryWorker
from .database.influx_client import influx_logger_task

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP ---
    # 1. Initialize ROS2 context
    rclpy.init()
    
    deps.process_executor = ProcessPoolExecutor(max_workers=2)

    # 2. Start Thread 2 (Command Dispatcher)
    cmd_worker = CommandWorker(deps.command_queue)
    cmd_worker.start()
    
    # 3. Start Thread 3 (Telemetry Receiver)
    tele_worker = TelemetryWorker()
    tele_worker.start()
    
    #optional
    #influx_task = asyncio.create_task(influx_logger_task())
    
    print("[Lifespan] All threads and tasks initialized.")
    
    yield
    
    # --- SHUTDOWN ---
    print("[Lifespan] Shutting down...")
    
    # # Cancel background tasks
    # influx_task.cancel()
    # try:
    #     await influx_task
    # except asyncio.CancelledError:
    #     pass
        
    # Shutdown ProcessPool
    deps.process_executor.shutdown(wait=True)
    
    # ROS2 Cleanup
    # Note: Threads are daemon, but we should be clean
    rclpy.shutdown()
    
    print("[Lifespan] Shutdown complete.")

app = FastAPI(title="Rover Backend", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(hardware.router, prefix="/api/v1/hardware", tags=["hardware"])
app.include_router(telemetry.router, prefix="/api/v1/telemetry", tags=["telemetry"])
app.include_router(compute.router, prefix="/api/v1/compute", tags=["compute"])

@app.get("/")
async def root():
    return {"message": "Rover Backend Active", "version": "1.0.0"}
