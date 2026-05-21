from fastapi import APIRouter, Depends, HTTPException
from ...api.deps import get_command_queue
import queue

router = APIRouter()

@router.post("/brightness", status_code=202)
async def set_brightness(value: int, q: queue.Queue = Depends(get_command_queue)):
    """
    Drops command to Thread 2 Queue and immediately returns 202.
    """
    if not (0 <= value <= 255):
        raise HTTPException(status_code=400, detail="Brightness must be 0-255")
        
    payload = {
        "type": "set_brightness",
        "value": value
    }
    
    q.put(payload)
    return {"status": "accepted", "message": "Command queued for dispatch"}
