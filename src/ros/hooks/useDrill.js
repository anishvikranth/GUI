import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useDrill = () => {

  const { msg, connected } = useTopic(
    TOPICS.DRILL,
    "std_msgs/Int32MultiArray",
    { throttleMs: 100 }
  );

  if (!msg)
    return { data: null, connected };

  const direction = msg.data[0];
  const magnitude = msg.data[1];

  return ({
    connected,

    data: {
      direction,
      magnitude,
      pwm: direction * magnitude,
    }
  });

};