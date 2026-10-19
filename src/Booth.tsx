import { useEffect, useRef, useState } from "react";

type BoothProps = {
    onBack: () => void;
};

function Booth({ onBack }: BoothProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState("");
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let cancelled = false;

        async function startCamera() {
            try {
                const cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if(cancelled) {
                    cameraStream.getTracks().forEach(track => track.stop());
                    return;
                }

                stream = cameraStream;

                if(videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch {
                if(!cancelled) {
                    setError("Could not access your camera");
                }
            }
        }


        startCamera();

        return() => {
            cancelled = true;
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    function capturePhoto() {
        const video = videoRef.current;

        if(!video || video.videoWidth === 0 ) {
            return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        if(!context) {
            return;
        }

        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        setPhoto(image);
    }

    return (
        <main className="booth">
            <button onClick={onBack}>Back</button>
            <h1>quick booth</h1>
            {error && <p>{error}</p>}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview"
            />

            <button className="capture-button"
                    onClick={capturePhoto}
                    disabled={!!error}
            >
                Capture!
            </button>

            {photo && (
                <div className="captured-photo">
                    <h2>Your photos!</h2>
                    <img src={photo} alt="Captured photobooth photo" />
                </div>
            )}
        </main>
    );
}

export default Booth;