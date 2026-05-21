import asyncio
import copy
#from influxdb_client.client.influxdb_client_async import InfluxDBClientAsync
#from influxdb_client import Point
from ..core.state import RoverState, state_lock
from ..core.config import settings

async def influx_logger_task():
    """
    InfluxDB Continuous Logger (Async Background Task).
    Periodically samples the thread-safe RoverState.
    """
    pass
    # client = InfluxDBClientAsync(
    #     url=settings.INFLUXDB_URL, 
    #     token=settings.INFLUXDB_TOKEN, 
    #     org=settings.INFLUXDB_ORG
    # )
    
    # write_api = client.write_api()

    # print("[Task] InfluxDB Logger started.")

    # try:
    #     while True:
    #         # 1. Safely acquire lock and copy state
    #         with state_lock:
    #             current_snapshot = copy.deepcopy(RoverState)
            
    #         # 2. Create InfluxDB Point
    #         point = Point("rover_telemetry") \
    #             .field("brightness", current_snapshot["hardware_brightness"]) \
    #             .field("odom_x", current_snapshot["odom"]["x"]) \
    #             .field("odom_y", current_snapshot["odom"]["y"]) \
    #             .field("odom_z", current_snapshot["odom"]["z"]) \
    #             .field("battery", current_snapshot["battery_voltage"]) \
    #             .field("latency", current_snapshot["network_latency"])

    #         # 3. Async write
    #         try:
    #             await write_api.write(bucket=settings.INFLUXDB_BUCKET, record=point)
    #         except Exception as e:
    #             print(f"[InfluxDB Error] {e}")

    #         # 4. Wait for 1 second
    #         await asyncio.sleep(1.0)
    # finally:
    #     await client.close()
