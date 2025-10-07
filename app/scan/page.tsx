// The protected app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

import FaceScanner from "@/components/FaceScanner";
import ScannerLayout from "@/components/ScannerLayout";
import LogoutButton from '@/components/Logout';

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [embeddings, setEmbeddings] = useState<Float32Array[]>([]);
  const [scanMessage, setScanMessage] = useState("Scan your face 3 times to register.");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (embeddings.length === 3) {
      setIsProcessing(true);
      setScanMessage("Processing your scans...");
      handleFinalizeScans(embeddings);
    }
  }, [embeddings]);
  
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleFaceDetected = (descriptor: Float32Array) => {
    if (isProcessing || embeddings.length >= 3) return;

    const newEmbeddings = [...embeddings, descriptor];
    setEmbeddings(newEmbeddings);
    
    const scansRemaining = 3 - newEmbeddings.length;
    if (scansRemaining > 0) {
      setScanMessage(`Scan successful! ${scansRemaining} more to go.`);
    }
  };

  //averages the embeddings
  const handleFinalizeScans = async (completedEmbeddings: Float32Array[]) => {
    if (!user) return;

    // average embedding
    const embeddingSize = completedEmbeddings[0].length;
    const averagedEmbedding = new Float32Array(embeddingSize).fill(0);

    for (const embedding of completedEmbeddings) {
      for (let i = 0; i < embeddingSize; i++) {
        averagedEmbedding[i] += embedding[i];
      }
    }

    for (let i = 0; i < embeddingSize; i++) {
      averagedEmbedding[i] /= completedEmbeddings.length;
    }

    try {
      const response = await fetch('/api/add_face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          face_embedding: Array.from(averagedEmbedding),
          name: user.email?.split('@')[0],
          upi_id: 'example@upi',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "API error");
      }

      setScanMessage("Registration complete! You're all set.");
      console.log("Face saved:", data.message);
    } catch (err: any) {
      console.error("API error:", err);
      setScanMessage(`Error: ${err.message}. Please try again.`);
      setEmbeddings([]);
      setIsProcessing(false);
    }
  };

  const handleError = (error: Error) => {
    console.error("Face detection error:", error);
    setScanMessage("A scanner error occurred. Please refresh.");
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  const ProgressBar = ({ count }: { count: number }) => (
    <div className="w-40 h-2 bg-zinc-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-emerald-400 transition-all duration-300"
        style={{ width: `${(count / 3) * 100}%` }}
      ></div>
    </div>
  );

  if (user) {
    return (
      <ScannerLayout>
        <div className="flex flex-col items-center space-y-4">
          <FaceScanner 
            onFaceDetected={handleFaceDetected}
            onError={handleError}
          />
          <ProgressBar count={embeddings.length} />
          <p className="text-zinc-400 text-center min-h-[40px]">{scanMessage}</p>
        </div>
        <LogoutButton/>
      </ScannerLayout>
    );
  }

  return null; 
}