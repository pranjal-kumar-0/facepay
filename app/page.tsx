"use client";

import FaceScanner from "@/components/FaceScanner";
import ScannerLayout from "@/components/ScannerLayout";

export default function Home() {
  const handleFaceDetected = (descriptor: Float32Array) => {
    // Handle the face detection result
    console.log("Face detected with descriptor:", descriptor);
  };

  const handleError = (error: Error) => {
    // Handle any errors during face detection
    console.error("Face detection error:", error);
  };

  return (
    <ScannerLayout>
      <FaceScanner 
        onFaceDetected={handleFaceDetected}
        onError={handleError}
      />
    </ScannerLayout>
  );
}
