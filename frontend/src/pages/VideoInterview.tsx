import React, { useRef, useState } from "react";

const VideoInterview: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks: BlobPart[] = [];

  const startCountdown = () => {
    let counter = 5;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      if (counter > 0) {
        setCountdown(counter);
      } else {
        clearInterval(interval);
        setCountdown(null);
        startRecording();
      }
    }, 1000);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) videoRef.current.srcObject = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", blob, "response.webm");

      await fetch("http://127.0.0.1:8000/api/upload-response/", {
        method: "POST",
        body: formData,
      });
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white relative">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className={`rounded-2xl shadow-lg transition-all duration-700 ${
            recording ? "w-[800px] h-[500px]" : "w-[640px] h-[400px]"
          }`}
        />

        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-2xl">
            <span className="text-6xl font-bold animate-pulse">{countdown}</span>
          </div>
        )}
      </div>

      <div className="mt-8">
        {!recording ? (
          <button
            onClick={startCountdown}
            className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-8 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 rounded-xl transition"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoInterview;
