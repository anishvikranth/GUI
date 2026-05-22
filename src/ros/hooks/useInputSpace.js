import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useInputSpace = () => {
    const { msg, connected } = useTopic(
        TOPICS.INPUT_SPACE,
        'std_msgs/Bool',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: msg.data
    });
}