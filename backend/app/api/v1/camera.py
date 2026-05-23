from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import cv2

router = APIRouter()
STREAM_URL = "udp://127.0.0.1:5000"

def generate_frames():
    # Direct webcam access
    cap = cv2.VideoCapture(STREAM_URL)

    if not cap.isOpened():
        print("[Camera] Failed to open webcam")
        return

    while True:
        success, frame = cap.read()

        if not success:
            print("[Camera] Failed to read frame")
            break

        # Encode frame as JPEG
        ret, buffer = cv2.imencode(".jpg", frame)

        if not ret:
            continue

        frame_bytes = buffer.tobytes()

        # MJPEG stream format
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame_bytes +
            b"\r\n"
        )

    cap.release()


@router.get("/feed")
async def video_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )