import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useConfig = () => {
    const { msg, connected } = useTopic(
        TOPICS.CONFIG,
        'std_msgs/Float32MultiArray',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: {
        velocity:  msg.data[0],
        omega: msg.data[1],
        }
    });
}