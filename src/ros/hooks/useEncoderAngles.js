import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useEncoderAngles = () => {
    const { msg, connected } = useTopic(
        TOPICS.ARM,
        'std_msgs/Float32MultiArray',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: {
            pitch: msg.data[0],
            roll: msg.data[1],
            gripper: msg.data[2],
            base: msg.data[3],
            shoulder: -msg.data[4],
            elbow: msg.data[5]
        }
    });
}