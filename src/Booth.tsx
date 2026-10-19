import { useEffect, useRef, useState } from "react";

type BoothProps = {
    onBack: () => void;
};

function Booth({ onBack }: BoothProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState("");

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
        </main>
    );
}

export default Booth;