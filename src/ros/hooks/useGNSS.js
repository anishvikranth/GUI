import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useGNSS = () => {
    const { msg, connected } = useTopic(
        TOPICS.GNSS,
        'sensor_msgs/NavSatFix',
        { throttleMs: 100 }
    );

    if (!msg) return { data: null, connected };

    return ({
        connected,
        data: {
        latitude:  msg.latitude,
        longitude: msg.longitude,
        altitude:  msg.altitude,
        status:    msg.status.status,
        }
    });
}