import { useEffect, useRef, useState } from "react";

type BoothProps = {
    onBack: () => void;
};

function Booth({ onBack }: BoothProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState("");
    type CaptureMode = "automatic" | "manual";

    const [mode, setMode] = useState<CaptureMode>("manual");
    const [photos, setPhotos] = useState<string[]>([]);
    const [countdownLength, setCountdownLength] = useState<3 | 5 | 10>(3);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const sessionRef = useRef(0);
    const capturingRef = useRef(false);

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
            sessionRef.current++;
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    function capturePhoto(): string | null {
        const video = videoRef.current;

        if(!video || video.videoWidth === 0 ) {
            return null;
        }

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        if(!context) {
            return null;
        }

        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        return image;
    }

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async function runCountdown(sessionId: number) {
        for(let seconds = countdownLength; seconds > 0; seconds--) {
            if(sessionRef.current !== sessionId) return false;

            setCountdown(seconds);
            await wait(1000);
        }

        if(sessionRef.current !== sessionId) return false;
        setCountdown(null);
        return true;
    }

    async function startCapture() {
        if(capturingRef.current || photos.length >= 4 || error
            || !videoRef.current || videoRef.current.videoWidth === 0
        ) return;

        capturingRef.current = true;
        setIsCapturing(true);

        const sessionId = ++sessionRef.current;
        const numberOfPhotos = mode === "automatic" ? 4 - photos.length : 1;

        try {
            for(let i = 0; i < numberOfPhotos; i++) {
                const completed = await runCountdown(sessionId);
                if(!completed) return;
                
                const image = capturePhoto();
                if(!image) return;

                if(sessionRef.current !== sessionId) return;

                setPhotos((previousPhotos) => {
                    if(previousPhotos.length >= 4) return previousPhotos;
                    return [...previousPhotos, image];
                });

                if(i < numberOfPhotos - 1) {
                    await wait(500);
                }
            }
        } finally {
            if(sessionRef.current === sessionId) {
                setCountdown(null);
                setIsCapturing(false);
                capturingRef.current = false;
            }
        }
    }

    function resetSession() {
        sessionRef.current++;
        capturingRef.current = false;
        setCountdown(null);
        setIsCapturing(false);
        setPhotos([]);
    }

    return (
        <main className="booth">
            <button onClick={onBack}>Back</button>
            <h1>quick booth</h1>
            {error && <p>{error}</p>}

            <div className="capture-modes">
                <button className={mode === "manual" ? "selected" : ""}
                    onClick={() => {
                        resetSession();
                        setMode("manual");
                    }}
                >
                    Manual
                </button>

                <button className={mode === "automatic" ? "selected" : ""}
                    onClick={() => {
                        resetSession();
                        setMode("automatic");
                    }}
                >
                    Automatic
                </button>
            </div>

            <div className="countdown-settings">
                <span>Countdown:</span>

                {([3, 5, 10] as const).map((seconds) => (
                    <button
                        key={seconds}
                        className={countdownLength === seconds ? "selected" : ""}
                        disabled={isCapturing}
                        onClick={() => setCountdownLength(seconds)}
                    >
                        {seconds}s
                    </button>
                ))}
            </div>

            <div className="camera-container">
                <video ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-preview"
                />

                {countdown !== null && (
                    <div className="countdown-overlay">
                        <span key={countdown}>{countdown}</span>
                    </div>
                )}
            </div>

            <button className="capture-button"
                onClick={startCapture}
                disabled={!!error || isCapturing || photos.length >= 4}
                >
                {photos.length >= 4
                    ? "Session Done!"
                    : isCapturing
                        ? "Taking Photos..."
                        : mode === "automatic"
                            ? "Start Session"
                            : `Capture Photo ${photos.length + 1}/4`}
            </button>

            <div className="photo-gallery">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={`Captured photo ${index + 1}`}
                    />
                ))}
            </div>

            {photos.length === 4 && (
                <button className="capture-button"
                    onClick={resetSession}
                >
                    Start Over
                </button>
            )}
        </main>
    );
}

export default Booth;