import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useArmPWM = () => {
    const { msg, connected } = useTopic(
        TOPICS.ARM_PWM,
        'std_msgs/Float32MultiArray',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: {
            base: msg.data[0],
            shoulder: msg.data[1],
            elbow: msg.data[2],
            pitch: msg.data[3],
            roll: msg.data[4],
            gripper: msg.data[5]
        }
    });
}