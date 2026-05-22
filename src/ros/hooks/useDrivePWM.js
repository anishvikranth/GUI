import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useDrivePWM = () => {
    const { msg, connected } = useTopic(
        TOPICS.DRIVE_PWM,
        'std_msgs/Int32MultiArray',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: {
            front_left: msg.data[0],
            front_right: msg.data[1],
            middle_left: msg.data[2],
            middle_right: msg.data[3],
            back_left: msg.data[4],
            back_right: msg.data[5]
        }
    });
}