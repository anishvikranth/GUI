import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useArmMode = () => {
    const { msg, connected } = useTopic(
        TOPICS.ARM_MODE,
        'std_msgs/Int8',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: msg.data
    });
}