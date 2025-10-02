"use client";

import { useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      console.log("Captured face:", imageSrc);
      // Here you can process the captured image
      // For example, send it to an API for face recognition
    }
  }, [webcamRef]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-zinc-950 to-emerald-950/10"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-light text-zinc-100 tracking-[0.3em] uppercase">
            Scan
          </h1>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Main Camera Area */}
      <div className="flex-1 relative z-10 px-6 flex flex-col">
        {/* Camera viewport */}
        <div className="flex-1 relative flex items-center justify-center">
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
            
            {/* Minimal overlay UI */}
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

              {/* Face detection zone */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56 border border-emerald-400/30 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-0.5 h-3 md:w-1 md:h-4 bg-emerald-400/50 rotate-0"></div>
                  <div className="w-3 h-0.5 md:w-4 md:h-1 bg-emerald-400/50 absolute top-1 md:top-1.5 -left-1 md:-left-1.5"></div>
                </div>
              </div>

              {/* Status text */}
              <div className="absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-zinc-900/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                  <p className="text-xs text-emerald-400 font-mono">READY</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="pt-6 md:pt-8 pb-8 md:pb-12 flex flex-col items-center space-y-4 md:space-y-6">
          {/* Instructions */}
          <p className="text-sm md:text-base text-zinc-400 font-mono text-center">
            align • focus • capture
          </p>
          
          {/* Capture button */}
          <button
            onClick={capture}
            className="relative group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900 border-2 border-emerald-400/30 flex items-center justify-center group-active:scale-95 transition-transform duration-150">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-emerald-400 bg-emerald-400/10 group-active:bg-emerald-400/30 transition-colors duration-150 flex items-center justify-center">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-400"></div>
              </div>
            </div>
            
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
