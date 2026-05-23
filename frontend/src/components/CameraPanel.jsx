import {
  useState,
  useCallback,
  useEffect,
  useRef
} from "react";

// ─── Config ───────────────────────────────────────────────────────────────────

const CAMERAS = [
  { id: 1, label: "Camera 1" },
];

const CONTROLS = [
  { key: "brightness", label: "Brightness", min: 0, max: 100, default: 50 },
  { key: "contrast", label: "Contrast", min: 0, max: 100, default: 50 },
  { key: "zoom", label: "Zoom", min: 1, max: 10, default: 1 },
];

const formatValue = (key, val) =>
  key === "zoom" ? `${val}x` : val;

const makeDefaults = () =>
  Object.fromEntries(
    CONTROLS.map((c) => [c.key, c.default])
  );

const SLIDER_CSS = `
  .cam-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 3px;
    background: #1f2937;
    outline: none;
    border-radius: 0;
    cursor: pointer;
  }

  .cam-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 8px;
    height: 8px;
    background: #dc2626;
    border-radius: 1px;
    cursor: pointer;
    margin-top: -3px;
  }

  .cam-slider::-moz-range-track {
    height: 3px;
    background: #1f2937;
  }

  .cam-slider::-moz-range-thumb {
    width: 8px;
    height: 8px;
    background: #dc2626;
    border: none;
    border-radius: 1px;
  }
`;

// ─── Slider Component ─────────────────────────────────────────────────────────

function Slider({ ctrl, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-xs w-18">
        {ctrl.label}
      </span>

      <input
        type="range"
        min={ctrl.min}
        max={ctrl.max}
        value={value}
        onChange={(e) =>
          onChange(ctrl.key, Number(e.target.value))
        }
        className="cam-slider flex-1"
      />

      <span className="text-gray-400 text-xs w-6 text-right tabular-nums">
        {formatValue(ctrl.key, value)}
      </span>
    </div>
  );
}

// ─── Camera Block ─────────────────────────────────────────────────────────────

function CameraBlock({ cam, values, onChange }) {

  const videoRef = useRef(null);

  const handleChange = useCallback(
    (key, val) => onChange(cam.id, key, val),
    [cam.id, onChange]
  );

  useEffect(() => {

    let pc = null;

    const startWebRTC = async () => {

      try {

        pc = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302"
            }
          ]
        });

        pc.addTransceiver("video", {
          direction: "recvonly"
        });

        pc.ontrack = (event) => {

          console.log("Received remote stream");

          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);

        const response = await fetch(
          "http://127.0.0.1:8000/webrtc/offer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              sdp: offer.sdp,
              type: offer.type
            })
          }
        );

        const answer = await response.json();

        await pc.setRemoteDescription(answer);

        console.log("WebRTC connected");

      } catch (err) {

        console.error("WebRTC error:", err);

      }
    };

    startWebRTC();

    return () => {

      if (pc) {
        pc.close();
      }

    };

  }, []);

  return (
    <div className="flex flex-col gap-1">

      <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">
        {cam.label}
      </p>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-40 object-cover border border-red-500 rounded mb-2 bg-black"
      />

      {CONTROLS.map((ctrl) => (
        <Slider
          key={ctrl.key}
          ctrl={ctrl}
          value={values[ctrl.key]}
          onChange={handleChange}
        />
      ))}

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CameraPanel() {

  const [state, setState] = useState(
    () =>
      Object.fromEntries(
        CAMERAS.map((cam) => [
          cam.id,
          makeDefaults()
        ])
      )
  );

  const handleChange = useCallback(
    (camId, key, value) => {

      setState((prev) => ({
        ...prev,
        [camId]: {
          ...prev[camId],
          [key]: value,
        },
      }));

    },
    []
  );

  return (
    <>
      <style>{SLIDER_CSS}</style>

      <div className="bg-black border-2 border-red-600 rounded-xl p-3 font-mono">

        <h2 className="text-red-600 text-2xl font-bold border-b border-red-600 pb-1 mb-2">
          Camera Panel
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">

          {CAMERAS.map((cam) => (
            <CameraBlock
              key={cam.id}
              cam={cam}
              values={state[cam.id]}
              onChange={handleChange}
            />
          ))}

        </div>

      </div>
    </>
  );
}