import queue
from concurrent.futures import ProcessPoolExecutor
from typing import Optional
from ..core.state import state_lock, RoverState

# Define placeholders
command_queue: queue.Queue = queue.Queue()
process_executor: Optional[ProcessPoolExecutor] = None

def get_state():
    with state_lock:
        return RoverState.copy()

def get_command_queue() -> queue.Queue:
    return command_queue

def get_executor() -> ProcessPoolExecutor:
    global process_executor
    if process_executor is None:
        # Initialize lazily on first call if not already done by lifespan
        process_executor = ProcessPoolExecutor(max_workers=2)
    return process_executor