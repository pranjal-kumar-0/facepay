"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";

declare global {
  const faceapi: any;
}

interface FaceScannerProps {
  onFaceDetected?: (descriptor: Float32Array) => void;
  onError?: (error: Error) => void;
}

export default function FaceScanner({ onFaceDetected, onError }: FaceScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isScanning, setIsScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileCheck = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);

  // Load Face API models
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
    script.onload = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
          faceapi.nets.faceLandmark68Net.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
          faceapi.nets.faceRecognitionNet.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        onError?.(error as Error);
      }
    };
    document.head.appendChild(script);
  }, [onError]);

  // Capture and detect
  const capture = useCallback(async () => {
    if (!modelsLoaded || isScanning) return;

    setIsScanning(true);

    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        try {
          const detection = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            onFaceDetected?.(detection.descriptor);
          } else {
            console.log("No face detected");
          }
        } catch (error) {
          onError?.(error as Error);
        } finally {
          setTimeout(() => setIsScanning(false), 2000); 
        }
      };
    } else {
      setIsScanning(false);
    }
  }, [modelsLoaded, isScanning, onFaceDetected, onError]);

  return (
    <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-[3/4] overflow-hidden">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        mirrored={facingMode === "user"} 
        className="w-full h-full object-cover"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode,
        }}
      />

      {/* Status indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-full">
        <p className="text-xs text-emerald-400 font-mono">
          {!modelsLoaded ? "LOADING..." : isScanning ? "SEARCHING..." : "READY"}
        </p>
      </div>

      {/* Switch Camera Button - only for mobile */}
      {isMobile && (
        <button
          onClick={() =>
            setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
          }
          className="absolute top-4 right-4 bg-zinc-900/80 text-emerald-400 border border-emerald-400/30 rounded-lg px-3 py-1 text-xs font-mono hover:bg-emerald-400/10 transition"
        >
          Switch
        </button>
      )}

      {/* Capture button */}
      <div className="absolute bottom-0 left-0 right-0 pb-10 flex justify-center pointer-events-auto">
        <button
          onClick={capture}
          disabled={!modelsLoaded || isScanning}
          className={`relative group ${isScanning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900 border-2 border-emerald-400/30 flex items-center justify-center group-active:scale-95 transition-transform">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-emerald-400 bg-emerald-400/10 flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-400"></div>
            </div>
          </div>
          {!isScanning && <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping"></div>}
        </button>
      </div>
    </div>
  );
}
