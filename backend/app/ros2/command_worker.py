import threading
import queue
import rclpy
from rclpy.node import Node
from rclpy.executors import SingleThreadedExecutor
from std_msgs.msg import Int32

class CommandWorker(threading.Thread):
    """
    Thread 2: ROS2 Command Dispatcher.
    Handles outward-bound traffic via an internal thread-safe queue.
    """
    def __init__(self, command_queue: queue.Queue):
        super().__init__(daemon=True)
        self.command_queue = command_queue
        self.node = None
        self.executor = None

    def run(self):
        # Initialize ROS2 Node for this thread
        self.node = Node("command_dispatcher_node")
        
        # Example Publisher: Brightness control
        self.brightness_pub = self.node.create_publisher(Int32, "/rover/hardware/brightness", 10)
        
        self.executor = SingleThreadedExecutor()
        self.executor.add_node(self.node)

        print("[Thread 2] ROS2 Command Dispatcher started.")

        try:
            while rclpy.ok():
                # Non-blocking check for new commands in the mailbox
                try:
                    # Wait for 0.1s for a command to avoid pegging CPU
                    payload = self.command_queue.get(timeout =0.1)
                    self.handle_command(payload)
                except queue.Empty:
                    # No command, just spin the ROS2 executor to handle any internal callbacks
                    self.executor.spin_once(timeout_sec=0)
                    continue
        finally:
            self.node.destroy_node()

    def handle_command(self, payload: dict):
        """Dispatches commands to ROS2 topics/services based on payload type."""
        cmd_type = payload.get("type")
        
        if cmd_type == "set_brightness":
            value = payload.get("value", 0)
            msg = Int32()
            msg.data = value
            self.brightness_pub.publish(msg)
            print(f"[Thread 2] Published brightness: {value}")
        
        # Mark task as done in queue
        self.command_queue.task_done()
