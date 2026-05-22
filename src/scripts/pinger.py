#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import Int8MultiArray
import subprocess
import threading

DEVICES = [
    {"name": "Rover Mikrotik", "ip": "10.42.0.99"},
    {"name": "Base Mikrotik", "ip": "10.42.0.100"},
    {"name": "Jetson Orin", "ip": "10.42.0.253"},
    {"name": "Imou Camera", "ip": "10.42.0.69"},
    {"name": "Xavier", "ip": "10.42.0.51"},
]


def ping(ip):
    result = subprocess.run(
        ["ping", "-c", "1", "-W", "1", ip],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return int(result.returncode == 0)


class NetworkMonitor(Node):
    def __init__(self):
        super().__init__("network_monitor")
        self.publisher = self.create_publisher(Int8MultiArray, "/network_status", 10)
        self.timer = self.create_timer(3.0, self.check_devices)

    def check_devices(self):
        statuses = [0] * len(DEVICES)
        threads = []

        def check(index, device):
            statuses[index] = ping(device["ip"])

        for i, device in enumerate(DEVICES):
            t = threading.Thread(target=check, args=(i, device))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        msg = Int8MultiArray()
        msg.data = statuses
        self.publisher.publish(msg)


def main():
    rclpy.init()
    node = NetworkMonitor()
    rclpy.spin(node)
    rclpy.shutdown()


if __name__ == "__main__":
    main()
