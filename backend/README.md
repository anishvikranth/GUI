
## 1. Core Pillars

### Single Source of Truth (SSOT)
In a distributed robotic system, state configuration data can easily fall out of sync. This architecture enforces a boundary: **Local RAM is the absolute source of truth but local RAM is only modified when the physical hardware confirms a change.**

```text
 ┌─────────────────┐        1. Command        ┌─────────────────┐
 │   Web Server    │ ───────────────────────▶ │  Rover Hardware │
 └─────────────────┘                          └────────┬────────┘
          ▲                                            │
          │ 3. True State Update                       │ 2. Direct Feedback
 ┌────────┴────────┐                                   │
 │ Shared RAM SSOT │ ◀─────────────────────────────────┘
 └─────────────────┘
```

### Unidirectional Data Flow
Data travels in a strict, non-reversible circle.
*   **The Downward Pathway (Commands):** Web routes issue a command toward the hardware via a thread-safe queue and instantly return a `202 Accepted` response. They never touch the state directly.
*   **The Upward Pathway (Telemetry):** The hardware executes the command and publishes reality upward. The backend captures this stream and updates the central RAM state.

---

## 2. System Design Topology

The entire operational runtime runs inside a single process, structured into three highly isolated execution environments (threads):

```text
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              FASTAPI BACKEND PROCESS                                   │
 │                                                                                        │
 │  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
 │  │                         SHARED MEMORY ZONE (RAM STORE)                           │  │
 │  │  • Read-Only for Web traffic  • Exclusive Write authority for Telemetry thread   │  │
 │  └──────────────────────────────▲────────────────────▲──────────────────────────────┘  │
 │                                 │                    │                                 │
 │     ┌───────────────────────────┴────┐        ┌──────┴──────────────────────────┐      │
 │     │ THREAD 1: Async Event Loop     │        │ THREAD 3: ROS2 Telemetry Thread │      │
 │     ├────────────────────────────────┤        ├─────────────────────────────────┤      │
 │     │ • FastAPI Server (ASGI Engine) │        │ • Inbound Telemetry Worker      │      │
 │     │ • InfluxDB Time-Series Client  │        │ • Exclusive Mutex Write Access  │      │
 │     └───────────────┬────────────────┘        └────────────────▲────────────────┘      │
 │                     │                                          │                       │
 │                     │ (Thread-Safe Queue)                      │                       │
 │                     ▼                                          │                       │
 │     ┌────────────────────────────────┐                         │ (DDS Network Inbound) │
 │     │ THREAD 2: ROS2 Command Thread  │                         │                       │
 │     ├────────────────────────────────┤                         │                       │
 │     │ • Outbound Command Dispatcher  │                         │                       │
 │     └───────────────┬────────────────┘                         │                       │
 └─────────────────────┼──────────────────────────────────────────┼───────────────────────┘
                       │                                          │
                       │ (DDS Network Outbound)                   │
                       ▼                                          │
 ┌────────────────────────────────────────────────────────────────┴───────────────────────┐
 │                                   ROVER HARDWARE                                       │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure & File Explanation

### `app/core/`
*   **`state.py`**: The heart of the system. Contains the global `RoverState` dictionary, the `state_lock` (Mutex), and Pydantic schemas for data validation.
*   **`config.py`**: Centralized configuration management using Pydantic Settings. Handles ROS2 node names and InfluxDB credentials/endpoints.

### `app/ros2/`
*   **`command_worker.py` (Thread 2)**: An **Actor Pattern** worker. It waits for commands in a thread-safe queue, converts them to ROS2 messages, and publishes them. It has no access to the application state.
*   **`telemetry_worker.py` (Thread 3)**: The **Single Writer**. It subscribes to ROS2 topics (Odom, Battery, etc.) and is the only component authorized to acquire the `state_lock` to update the global RAM store.

### `app/api/`
*   **`deps.py`**: Provides FastAPI dependency injections for the shared state, command queue, and process executors.
*   **`v1/hardware.py`**: Endpoints for outbound control. Dropping a request here puts it in the Thread 2 queue.
*   **`v1/telemetry.py`**: Provides a high-speed GET endpoint and a 10Hz WebSocket stream for real-time UI updates.
*   **`v1/compute.py`**: Entry point for heavy compute

### `app/database/`
*   **`influx_client.py`**: An asynchronous background task running in Thread 1. Every second, it snaps a read-only copy of the state and batches it to InfluxDB for long-term analytics.

### `app/compute/`
*   **`local_engine.py`**: Contains the `execute_heavy_coordinate_transform` placeholder. These functions are designed to be run in a separate OS process to bypass the Python GIL.

### `app/main.py`
*   Orchestrates the **Lifespan** of the application. On startup, it initializes the ROS2 context, spawns the two background threads, and starts the async InfluxDB task.

---

## 4. Compute Offloading
the design implements an **Isolate-and-Delegate** approach using a `ProcessPoolExecutor`. Heavy math is shovelled across an OS boundary to a distinct CPU core, keeping the main telemetry loops 100% fluid.

---

## 5. Getting Started

### Installation
```bash
pip install -r requirements.txt
```

### Environment Setup optional for now
Create a `.env` file or export the following:
*   `INFLUXDB_URL`
*   `INFLUXDB_TOKEN`
*   `INFLUXDB_ORG`
*   `INFLUXDB_BUCKET`

### Running
```bash
uvicorn app.main:app --port 3001 --reloads
```
