"use client";

import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

import FaceScanner from './FaceScanner';
import ScannerLayout from './ScannerLayout';

export default function AddFaceClient() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [embeddings, setEmbeddings] = useState<Float32Array[]>([]);
  const [scanMessage, setScanMessage] = useState("Scan your face 3 times to register.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  // 3 scans are complete, open the modal instead of submitting
  useEffect(() => {
    if (embeddings.length === 3) {
      setIsProcessing(true);
      setScanMessage("Scans complete! Please enter your UPI ID.");
      setIsModalOpen(true);
    }
  }, [embeddings]);

  const handleFaceDetected = (descriptor: Float32Array) => {
    if (isProcessing || embeddings.length >= 3) return;

    const newEmbeddings = [...embeddings, descriptor];
    setEmbeddings(newEmbeddings);

    const scansRemaining = 3 - newEmbeddings.length;
    if (scansRemaining > 0) {
      setScanMessage(`Scan successful! ${scansRemaining} more to go.`);
    }
  };

  const handleRegistrationSubmit = async () => {
    if (!user || embeddings.length !== 3 || !upiId) {
      alert("Please enter a valid UPI ID.");
      return;
    }

    setScanMessage("Processing your registration...");

    // Average the embeddings
    const embeddingSize = embeddings[0].length;
    const averagedEmbedding = new Float32Array(embeddingSize).fill(0);
    for (const embedding of embeddings) {
      for (let i = 0; i < embeddingSize; i++) {
        averagedEmbedding[i] += embedding[i];
      }
    }
    for (let i = 0; i < embeddingSize; i++) {
      averagedEmbedding[i] /= embeddings.length;
    }

    try {
      const response = await fetch('/api/add_face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          face_embedding: Array.from(averagedEmbedding),
          name: user.user_metadata.full_name || user.email?.split('@')[0],
          upi_id: upiId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "API error");
      }

      setScanMessage("Registration complete! You're all set.");
      setIsModalOpen(false); // Close modal on success
    } catch (err: any) {
      console.error("API error:", err);
      setScanMessage(`Error: ${err.message}. Please try again.`);

    }
  };

  const handleError = (error: Error) => {
    console.error("Face detection error:", error);
    setScanMessage("A scanner error occurred. Please refresh.");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ScannerLayout>
      <div className="relative flex flex-col items-center space-y-4">
        <FaceScanner
          onFaceDetected={handleFaceDetected}
          onError={handleError}
        />
        <ProgressBar count={embeddings.length} />
        <p className="text-zinc-400 text-center min-h-[40px]">{scanMessage}</p>
      </div>

      {isModalOpen && (
        <UpiModal
          upiId={upiId}
          setUpiId={setUpiId}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </ScannerLayout>
  );
}


const ProgressBar = ({ count }: { count: number }) => (
  <div className="w-40 h-2 bg-zinc-700 rounded-full overflow-hidden">
    <div
      className="h-full bg-emerald-400 transition-all duration-300"
      style={{ width: `${(count / 3) * 100}%` }}
    ></div>
  </div>
);

// A simple modal component for collecting the UPI ID
const UpiModal = ({ upiId, setUpiId, onSubmit }: any) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-white mb-4">Confirm Your UPI ID</h2>
          <p className="text-zinc-400 mb-4 text-sm">Enter your UPI ID to complete the registration.</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@bank"
            className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600 transition-colors"
          >
            Confirm & Register
          </button>
        </form>
      </div>
    </div>
  );
};