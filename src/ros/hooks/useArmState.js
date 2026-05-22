import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useArmState = () => {
    const { msg, connected } = useTopic(
        TOPICS.ARM_STATE,
        'std_msgs/Bool',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: msg.data
    });
}