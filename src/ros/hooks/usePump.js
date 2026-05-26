import { useTopic } from "./useTopic";
import { TOPICS } from "../topics";

export const usePump = () => {

  const { msg, connected } = useTopic(
    TOPICS.PUMP,
    "std_msgs/Int32",
    { throttleMs: 100 }
  );

  if (!msg)
    return { data: null, connected };

  let state = "OFF";

  if (msg.data === 1)
    state = "ON";

  else if (msg.data === -1)
    state = "REVERSED";

  return ({
    connected,

    data: {
      value: msg.data,
      state,
    }
  });

};