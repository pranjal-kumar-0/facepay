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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    script.onload = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
          faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
          faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
        ]);
        setModelsLoaded(true);
        console.log('Face API models loaded');
      } catch (error) {
        console.error('Error loading Face API models:', error);
        onError?.(error as Error);
      }
    };
    document.head.appendChild(script);
  }, [onError]);

  const capture = useCallback(async () => {
    if (!modelsLoaded) {
      console.log('Models not loaded yet');
      return;
    }
    
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        try {
          const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (detection) {
            console.log("Face vector embeddings:", detection.descriptor);
            onFaceDetected?.(detection.descriptor);
          } else {
            console.log("No face detected");
          }
        } catch (error) {
          console.error('Error detecting face:', error);
          onError?.(error as Error);
        }
      };
    }
  }, [webcamRef, modelsLoaded, onFaceDetected, onError]);

  return (
    <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user"
        }}
      />
      
      {/* Scanner Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8">
          <div className="w-6 md:w-8 h-0.5 md:h-1 bg-emerald-400 mb-1"></div>
          <div className="w-0.5 md:w-1 h-6 md:h-8 bg-emerald-400"></div>
        </div>
        <div className="absolute top-4 md:top-8 right-4 md:right-8">
          <div className="w-6 md:w-8 h-0.5 md:h-1 bg-emerald-400 mb-1 ml-auto"></div>
          <div className="w-0.5 md:w-1 h-6 md:h-8 bg-emerald-400 ml-auto"></div>
        </div>
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
          <div className="w-0.5 md:w-1 h-6 md:h-8 bg-emerald-400 mb-1"></div>
          <div className="w-6 md:w-8 h-0.5 md:h-1 bg-emerald-400"></div>
        </div>
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8">
          <div className="w-0.5 md:w-1 h-6 md:h-8 bg-emerald-400 mb-1 ml-auto"></div>
          <div className="w-6 md:w-8 h-0.5 md:h-1 bg-emerald-400 ml-auto"></div>
        </div>

        {/* Face detection frame */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56 border border-emerald-400/30 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-0.5 h-3 md:w-1 md:h-4 bg-emerald-400/50 rotate-0"></div>
            <div className="w-3 h-0.5 md:w-4 md:h-1 bg-emerald-400/50 absolute top-1 md:top-1.5 -left-1 md:-left-1.5"></div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-zinc-900/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full">
            <p className="text-xs text-emerald-400 font-mono">{modelsLoaded ? 'READY' : 'LOADING'}</p>
          </div>
        </div>
      </div>

      {/* Capture controls */}
      <div className="absolute bottom-0 left-0 right-0 pt-6 md:pt-8 pb-8 md:pb-12 flex flex-col items-center space-y-4 md:space-y-6 pointer-events-auto">
        <p className="text-sm md:text-base text-zinc-400 font-mono text-center">
          align • focus • capture
        </p>
        
        <button
          onClick={capture}
          className="relative group"
          disabled={!modelsLoaded}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900 border-2 border-emerald-400/30 flex items-center justify-center group-active:scale-95 transition-transform duration-150">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-emerald-400 bg-emerald-400/10 group-active:bg-emerald-400/30 transition-colors duration-150 flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-400"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping"></div>
        </button>
      </div>
    </div>
  );
}
