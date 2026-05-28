import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useStepper = () => {

  const { msg, connected } = useTopic(
    TOPICS.STEPPER,
    "std_msgs/msg/Float32",
    { throttleMs: 100 }
  );

  if (!msg) {
    return {
      data: null,
      connected,
    };
  }

  return ({
    connected,

    data: {
      value: msg.data,
    }
  });

};