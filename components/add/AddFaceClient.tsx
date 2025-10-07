"use client";

import React, { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

import FaceScanner from "./FaceScanner";
import ScannerLayout from "./ScannerLayout";

export default function AddFaceClient() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [showWarning, setShowWarning] = useState(true);
  const [embeddings, setEmbeddings] = useState<Float32Array[]>([]);
  const [scanMessage, setScanMessage] = useState(
    "Scan your face 3 times to register."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  // Pre-check: ask server whether this user already has face data
  useEffect(() => {
    let mounted = true;
    const checkUserRegistration = async () => {
      try {
        const res = await fetch('/api/check_user', { method: 'POST' });
        const json = await res.json();
        if (!mounted) return;
        setUserExists(Boolean(json.exists));
      } catch (err) {
        console.error('check_user error', err);
        if (!mounted) return;
        setUserExists(false);
      }
    };
    checkUserRegistration();
    return () => { mounted = false };
  }, []);

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
    setIsSubmitting(true);

    // Average embeddings
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
      const response = await fetch("/api/add_face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          face_embedding: Array.from(averagedEmbedding),
          name:
            user.user_metadata.full_name || user.email?.split("@")[0],
          upi_id: upiId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API error");

      setScanMessage("Registration complete! You're all set.");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("API error:", err);
      setScanMessage(`Error: ${err.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (error: Error) => {
    console.error("Face detection error:", error);
    setScanMessage("A scanner error occurred. Please refresh.");
  };

  if (loading) return <p>Loading...</p>;

  if (userExists === true && showWarning) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-zinc-900 border border-emerald-700 text-emerald-200 rounded-lg p-6 shadow-2xl font-mono">
          <h2 className="text-lg font-semibold text-emerald-300 mb-2">Existing registration found</h2>
          <p className="text-emerald-200/80 mb-4 text-sm">We detected saved face data for your account. You can rescan to modify the stored data, or go back to the dashboard.</p>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowWarning(false); setScanMessage('Scan your face 3 times to register.'); }}
              className="flex-1 py-2 rounded-md bg-emerald-500 text-zinc-900 font-semibold hover:bg-emerald-600 transition"
            >
              Rescan / Modify
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-2 rounded-md bg-zinc-800 text-emerald-300 border border-emerald-700 hover:bg-emerald-700/5 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-zinc-900 border border-emerald-700 text-emerald-200 rounded-lg p-6 w-full max-w-md shadow-2xl font-mono">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-lg font-semibold text-emerald-300">Confirm Your UPI ID</h2>
            </div>
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setScanMessage('Scan your face 3 times to register.'); setEmbeddings([]); setIsProcessing(false); }}
              disabled={isSubmitting}
              className={`text-emerald-400/70 hover:text-emerald-300 text-sm ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-emerald-200/80 mb-4 text-sm">Enter your UPI ID to complete the registration.</p>

          <form onSubmit={(e) => { e.preventDefault(); handleRegistrationSubmit(); }}>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@bank"
              className="w-full p-3 rounded-md mb-4 bg-zinc-800 text-emerald-100 placeholder-emerald-300 border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setScanMessage('Scan your face 3 times to register.'); setEmbeddings([]); setIsProcessing(false); }}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-md bg-zinc-800 text-emerald-300 border border-emerald-700 hover:bg-emerald-700/5 transition ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={`flex-1 py-2 rounded-md font-semibold transition ${isSubmitting ? 'bg-emerald-400 text-zinc-900 cursor-wait' : 'bg-emerald-500 text-zinc-900 hover:bg-emerald-600'}`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin text-zinc-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Confirm & Register'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ScannerLayout>
      <div className="relative flex flex-col items-center space-y-4">
        <FaceScanner
          onFaceDetected={handleFaceDetected}
          onError={handleError}
          processingLabel="Adding"
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

// UPI modal
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
          <p className="text-zinc-400 mb-4 text-sm">
            Enter your UPI ID to complete the registration.
          </p>
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
