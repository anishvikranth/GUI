import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const useServoLid = () => {

  const lid1 = useTopic(
    TOPICS.LID1,
    "std_msgs/Int32",
    { throttleMs: 100 }
  );

  const lid2 = useTopic(
    TOPICS.LID2,
    "std_msgs/Int32",
    { throttleMs: 100 }
  );

  const lid3 = useTopic(
    TOPICS.LID3,
    "std_msgs/Int32",
    { throttleMs: 100 }
  );

  let lidNumber = 1;
  let angle = lid1.msg?.data ?? 0;

  if (lid2.msg) {
    lidNumber = 2;
    angle = lid2.msg.data;
  }

  if (lid3.msg) {
    lidNumber = 3;
    angle = lid3.msg.data;
  }

  let state = "MOVING";

  if (angle <= 10)
    state = "CLOSED";

  else if (angle >= 170)
    state = "OPEN";

  return ({
    connected:
      lid1.connected ||
      lid2.connected ||
      lid3.connected,

    data: {
      lidNumber,
      angle,
      state,
    }
  });

};