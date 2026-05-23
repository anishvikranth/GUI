from fastapi import APIRouter
from pydantic import BaseModel

from aiortc import (
    RTCPeerConnection,
    RTCSessionDescription,
    VideoStreamTrack,
)
from av import VideoFrame
import cv2
router = APIRouter()

STREAM_URL = "udp://127.0.0.1:5000"

pcs = set()


class Offer(BaseModel):
    sdp: str
    type: str


class CameraTrack(VideoStreamTrack):

    def __init__(self):
        super().__init__()

        self.cap = cv2.VideoCapture(STREAM_URL)

    async def recv(self):

        pts, time_base = await self.next_timestamp()

        success, frame = self.cap.read()

        if not success:
            raise Exception("Failed to read frame")

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        video_frame = VideoFrame.from_ndarray(
            frame,
            format="rgb24"
        )

        video_frame.pts = pts
        video_frame.time_base = time_base

        return video_frame


@router.post("/offer")
async def offer(offer: Offer):

    pc = RTCPeerConnection()

    pcs.add(pc)

    track = CameraTrack()

    pc.addTrack(track)

    await pc.setRemoteDescription(
        RTCSessionDescription(
            sdp=offer.sdp,
            type=offer.type
        )
    )

    answer = await pc.createAnswer()

    await pc.setLocalDescription(answer)

    return {
        "sdp": pc.localDescription.sdp,
        "type": pc.localDescription.type,
    }