import threading
import rclpy
from rclpy.node import Node
from rclpy.executors import SingleThreadedExecutor

# Import the precise ROS2 message definitions your hooks require
from nav_msgs.msg import Odometry
from sensor_msgs.msg import NavSatFix
from std_msgs.msg import Float32MultiArray, Int32MultiArray, Bool

from ..core.state import RoverState, state_lock

class TelemetryWorker(threading.Thread):
    """
    Thread 3: ROS2 Telemetry Receiver (The Single Writer).
    Authorized to mutate the shared RoverState memory store.
    """
    def __init__(self):
        super().__init__(daemon=True)
        self.node = None
        self.executor = None

    def run(self):
        self.node = Node("telemetry_receiver_node")
        
        self.node.create_subscription(Odometry, '/zed/zed_node/odom', self.odom_cb, 10)
        self.node.create_subscription(NavSatFix, '/gnss', self.gnss_cb, 10)
        self.node.create_subscription(Float32MultiArray, '/enc_arm', self.arm_encoders_cb, 10)
        self.node.create_subscription(Float32MultiArray, '/arm_target_angles', self.arm_pwm_cb, 10)
        self.node.create_subscription(Int32MultiArray, '/motor_pwm', self.drive_pwm_cb, 10)
        self.node.create_subscription(Float32MultiArray, '/config', self.config_cb, 10)
        self.node.create_subscription(Bool, '/input_space', self.input_space_cb, 10)
        self.node.create_subscription(Bool, '/arm_state', self.arm_state_cb, 10)

        self.executor = SingleThreadedExecutor()
        self.executor.add_node(self.node)

        print("[Thread 3] ROS2 Telemetry Receiver started.")
        self.executor.spin()

    def odom_cb(self, msg: Odometry):
        with state_lock:
            RoverState["odometry"]["position"]["x"] = msg.pose.pose.position.x
            RoverState["odometry"]["position"]["y"] = msg.pose.pose.position.y
            RoverState["odometry"]["position"]["z"] = msg.pose.pose.position.z
            
            RoverState["odometry"]["orientation"]["x"] = msg.pose.pose.orientation.x
            RoverState["odometry"]["orientation"]["y"] = msg.pose.pose.orientation.y
            RoverState["odometry"]["orientation"]["z"] = msg.pose.pose.orientation.z
            RoverState["odometry"]["orientation"]["w"] = msg.pose.pose.orientation.w
            
            RoverState["odometry"]["velocity"]["linear"] = msg.twist.twist.linear.x
            RoverState["odometry"]["velocity"]["angular"] = msg.twist.twist.angular.z
            RoverState["connected_topics"]["odom"] = True

    def gnss_cb(self, msg: NavSatFix):
        with state_lock:
            RoverState["gnss"]["latitude"] = msg.latitude
            RoverState["gnss"]["longitude"] = msg.longitude
            RoverState["gnss"]["altitude"] = msg.altitude
            RoverState["gnss"]["status"] = int(msg.status.status)
            RoverState["connected_topics"]["gnss"] = True

    def arm_encoders_cb(self, msg: Float32MultiArray):
        if len(msg.data) >= 6:
            with state_lock:
                RoverState["encoder_angles"]["base"] = msg.data[0]
                RoverState["encoder_angles"]["shoulder"] = msg.data[1]
                RoverState["encoder_angles"]["elbow"] = msg.data[2]
                RoverState["encoder_angles"]["pitch"] = msg.data[3]
                RoverState["encoder_angles"]["roll"] = msg.data[4]
                RoverState["encoder_angles"]["gripper"] = msg.data[5]
                RoverState["connected_topics"]["enc_arm"] = True

    def arm_pwm_cb(self, msg: Float32MultiArray):
        if len(msg.data) >= 6:
            with state_lock:
                RoverState["arm_pwm"]["base"] = msg.data[0]
                RoverState["arm_pwm"]["shoulder"] = msg.data[1]
                RoverState["arm_pwm"]["elbow"] = msg.data[2]
                RoverState["arm_pwm"]["pitch"] = msg.data[3]
                RoverState["arm_pwm"]["roll"] = msg.data[4]
                RoverState["arm_pwm"]["gripper"] = msg.data[5]
                RoverState["connected_topics"]["arm_target_angles"] = True

    def drive_pwm_cb(self, msg: Int32MultiArray):
        if len(msg.data) >= 6:
            with state_lock:
                RoverState["drive_pwm"]["front_left"] = msg.data[0]
                RoverState["drive_pwm"]["front_right"] = msg.data[1]
                RoverState["drive_pwm"]["middle_left"] = msg.data[2]
                RoverState["drive_pwm"]["middle_right"] = msg.data[3]
                RoverState["drive_pwm"]["back_left"] = msg.data[4]
                RoverState["drive_pwm"]["back_right"] = msg.data[5]
                RoverState["connected_topics"]["motor_pwm"] = True

    def config_cb(self, msg: Float32MultiArray):
        if len(msg.data) >= 2:
            with state_lock:
                RoverState["config"]["velocity"] = msg.data[0]
                RoverState["config"]["omega"] = msg.data[1]
                RoverState["connected_topics"]["config"] = True

    def input_space_cb(self, msg: Bool):
        with state_lock:
            RoverState["input_space"] = msg.data
            RoverState["connected_topics"]["input_space"] = True

    def arm_state_cb(self, msg: Bool):
        with state_lock:
            RoverState["arm_state"] = msg.data
            RoverState["connected_topics"]["arm_state"] = True