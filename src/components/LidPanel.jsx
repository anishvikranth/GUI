import { useState } from 'react';
import { usePublisher } from '../ros/hooks/usePublisher';
import { TOPICS } from '../ros/topics';
import { useTopic } from '../ros/hooks/useTopic';

export function LidPanel() {

  const [selectedLid, setSelectedLid] =
    useState("lid1");

  const [lidStates, setLidStates] =
    useState({
      lid1: "CLOSED",
      lid2: "CLOSED",
      lid3: "CLOSED",
    });
 
  const lid1 = useTopic(TOPICS.LID1,"std_msgs/msg/Int32");
  const lid2 = useTopic(TOPICS.LID2,"std_msgs/msg/Int32");
  const lid3 = useTopic(TOPICS.LID3,"std_msgs/msg/Int32");

  const currentAngle = (() => {

  if (selectedLid === "lid1")
    return lid1.msg?.data ?? 0;

  if (selectedLid === "lid2")
    return lid2.msg?.data ?? 0;

  if (selectedLid === "lid3")
    return lid3.msg?.data ?? 0;

  return 0;

})();

  const { publish: publishLid1 } =
    usePublisher(
      TOPICS.LID1,
      "std_msgs/msg/Int32"
    );

  const { publish: publishLid2 } =
    usePublisher(
      TOPICS.LID2,
      "std_msgs/msg/Int32"
    );

  const { publish: publishLid3 } =
    usePublisher(
      TOPICS.LID3,
      "std_msgs/msg/Int32"
    );

  const publishToSelectedLid = (value) => {

    if (selectedLid === "lid1") {
      publishLid1({ data: value });
    }

    if (selectedLid === "lid2") {
      publishLid2({ data: value });
    }

    if (selectedLid === "lid3") {
      publishLid3({ data: value });
    }

  };

  const openLid = () => {

    publishToSelectedLid(180);

    setLidStates({
      ...lidStates,
      [selectedLid]: "OPEN",
    });

  };

  const closeLid = () => {

    publishToSelectedLid(0);

    setLidStates({
      ...lidStates,
      [selectedLid]: "CLOSED",
    });

  };

  return (

    <div className="border border-red-600 rounded-xl p-3 font-mono">

      <p className="text-red-600 text-m uppercase tracking-widest mb-3">
        Servo Lid
      </p>

      {/* Dropdown */}
      <select
        value={selectedLid}
        onChange={(e) =>
          setSelectedLid(e.target.value)
        }
        className="bg-black border border-red-600 text-white p-1 rounded mb-3 w-full"
      >

        <option value="lid1">
          Lid 1
        </option>

        <option value="lid2">
          Lid 2
        </option>

        <option value="lid3">
          Lid 3
        </option>

      </select>

      {/* Current State */}
      <p className="text-gray-300">
        Status:
        {' '}
        {lidStates[selectedLid]}
      </p>
      <p className="text-gray-300 mb-3">
        Angle:
        {' '}
        {currentAngle}°
      </p>

      {/* Controls */}
      <div className="flex gap-2">

        <button
          onClick={openLid}
          className="bg-green-700 px-2 py-1 text-white rounded"
        >
          OPEN
        </button>

        <button
          onClick={closeLid}
          className="bg-red-700 px-2 py-1 text-white rounded"
        >
          CLOSE
        </button>

      </div>

    </div>

  );
}