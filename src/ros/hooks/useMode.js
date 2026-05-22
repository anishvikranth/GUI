import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useMode = () => {
    const { msg, connected } = useTopic(
        TOPICS.MODE,
        'std_msgs/Int8',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: msg.data
    });
}