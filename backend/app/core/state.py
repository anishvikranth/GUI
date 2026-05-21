from pydantic import BaseModel, Field
from threading import Lock
from typing import Dict, List, Any

class Vector3(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

class Quaternion(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    w: float = 1.0

class OdomVelocity(BaseModel):
    linear: float = 0.0
    angular: float = 0.0

class OdometryState(BaseModel):
    position: Vector3 = Field(default_factory=Vector3)
    orientation: Quaternion = Field(default_factory=Quaternion)
    velocity: OdomVelocity = Field(default_factory=OdomVelocity)

class GNSSState(BaseModel):
    latitude: float = 0.0
    longitude: float = 0.0
    altitude: float = 0.0
    status: int = 0

class ArmJoints(BaseModel):
    base: float = 0.0
    shoulder: float = 0.0
    elbow: float = 0.0
    pitch: float = 0.0
    roll: float = 0.0
    gripper: float = 0.0

class DrivePWMState(BaseModel):
    front_left: int = 0
    front_right: int = 0
    middle_left: int = 0
    middle_right: int = 0
    back_left: int = 0
    back_right: int = 0

class ConfigState(BaseModel):
    velocity: float = 0.0
    omega: float = 0.0

# Master Schema representing everything the frontend expects
class RoverStateSchema(BaseModel):
    odometry: OdometryState = Field(default_factory=OdometryState)
    gnss: GNSSState = Field(default_factory=GNSSState)
    encoder_angles: ArmJoints = Field(default_factory=ArmJoints)
    arm_pwm: ArmJoints = Field(default_factory=ArmJoints)
    drive_pwm: DrivePWMState = Field(default_factory=DrivePWMState)
    config: ConfigState = Field(default_factory=ConfigState)
    input_space: bool = False
    arm_state: bool = False
    
    # Track connectivity metrics per subsystem internally
    connected_topics: Dict[str, bool] = Field(default_factory=dict)

# Thread-safe Shared RAM store
state_lock = Lock()
RoverState: Dict[str, Any] = RoverStateSchema().model_dump()