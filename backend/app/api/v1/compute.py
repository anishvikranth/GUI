from fastapi import APIRouter, Depends
import asyncio
from ...api.deps import get_executor
from ...compute.local_engine import execute_heavy_coordinate_transform

router = APIRouter()

@router.post("/analyze")
async def analyze_data(payload: dict, executor = Depends(get_executor)):
    """
    Offloads heavy local tasks to ProcessPoolExecutor.
    """
    loop = asyncio.get_running_loop()
    
    # Execute in the standalone process space to keep threads 1, 2, and 3 clear
    result = await loop.run_in_executor(
        executor, 
        execute_heavy_coordinate_transform, 
        payload
    )
    
    return result
