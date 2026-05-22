#!/usr/bin/env python3
import subprocess
import sys
import os


def main():
    # make sure ROS2 is sourced
    if "ROS_DISTRO" not in os.environ:
        print("ERROR: ROS2 not sourced. Run 'source /opt/ros/humble/setup.bash' first.")
        sys.exit(1)

    cmd = [
        "ros2",
        "run",
        "rosbridge_server",
        "rosbridge_websocket",
        "--ros-args",
        "-p",
        "port:=9090",
    ]

    print("Starting rosbridge on ws://localhost:9090 ...")
    print("Press Ctrl+C to stop.")

    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\nBridge stopped.")
    except FileNotFoundError:
        print("ERROR: ros2 command not found. Is ROS2 installed?")
        sys.exit(1)


if __name__ == "__main__":
    main()
