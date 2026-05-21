from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json

from ...core.state import RoverState, state_lock, RoverStateSchema

router = APIRouter()

@router.get("/state", response_model=RoverStateSchema)
async def get_robot_status():
    """
    Returns a read-only snapshot of the current state.
    Acquires the mutex briefly to create a deep, isolated copy.
    """
    with state_lock:
        # Exporting via model_validate makes a guaranteed safe snapshot
        return RoverStateSchema.model_validate(RoverState)


@router.websocket("/ws")
async def telemetry_websocket(websocket: WebSocket):
    """
    Streams live telemetry views to the UI at 10Hz.
    """
    await websocket.accept()
    print(f"[WebSocket] Client connected to live telemetry stream.")
    
    try:
        while True:
            # 1. Thread-safe extraction & snapshotting
            with state_lock:
                # Dump it out immediately using Pydantic's optimized engine
                # which avoids thread collision issues during dictionary iteration
                state_snapshot = RoverStateSchema.model_validate(RoverState)
            
            # 2. Serialize directly to a raw JSON string using Pydantic's native speed
            json_data = state_snapshot.model_dump_json()
            
            # 3. Stream raw text over the socket (bypasses costly internal FastAPI processing)
            await websocket.send_text(json_data)
            
            # 4. Strict 10Hz Throttle
            await asyncio.sleep(0.1)
            
    except WebSocketDisconnect:
        print("[WebSocket] Telemetry client disconnected cleanly.")
    except Exception as e:
        print(f"[WebSocket] Stream error encountered: {str(e)}")