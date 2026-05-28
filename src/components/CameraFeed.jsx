// components/CameraFeed.jsx

import React, {
  useEffect,
  useRef
} from 'react';

const CameraFeed = ({
  width = "800px",
  height = "450px",
  feed_name = "Feed",
  camera_id = 0
}) => {

  const videoRef = useRef(null);

  useEffect(() => {

    const pc = new RTCPeerConnection();
    pc.addTransceiver("video", {
     direction: "recvonly"
    });

    pc.ontrack = (event) => {

      if (videoRef.current) {

        videoRef.current.srcObject =
          event.streams[0];

      }

    };

    async function startWebRTC() {

      try {

        const offer =
          await pc.createOffer();

        await pc.setLocalDescription(
          offer
        );

        const response = await fetch(
          `http://127.0.0.1:8000/webrtc/offer?camera=${camera_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sdp: offer.sdp,
              type: offer.type,
            }),
          }
        );

        const answer =
          await response.json();

        await pc.setRemoteDescription(
          answer
        );

      } catch (err) {

        console.error(
          "WebRTC connection failed:",
          err
        );

      }

    }

    startWebRTC();

    return () => {

      pc.close();

    };

  }, []);

  return (

    <div
      className="border-2 border-red-600 bg-black relative overflow-hidden group h-full min-h-0 w-full"
      style={{
        width: width,
        height: height,
        borderRadius: 10
      }}
    >

      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 z-10">

        <div className="flex items-center gap-2">

          <div className="w-2 h-2 bg-red-600 animate-pulse rounded-full"></div>

          <span className="text-red-600 text-xs font-mono font-bold tracking-widest uppercase">

            Camera Feed {feed_name} // WEBRTC_ACTIVE

          </span>

        </div>

      </div>

      {/* VIDEO STREAM */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Footer */}
      <div className="absolute bottom-2 right-2 text-[10px] text-red-600/50 font-mono">

        WEBRTC_RELAY_V01

      </div>

    </div>

  );

};

export default CameraFeed;
