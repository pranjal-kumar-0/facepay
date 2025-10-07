"use client";

import FaceScanner from '@/components/add/FaceScanner';
import React, { useState } from 'react';

// Define a type for the user data you expect from your API
interface MatchedUser {
  name: string;
  email: string;
  upi_id: string;
  similarity: number;
}

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [error, setError] = useState('');

  const handleFaceDetected = async (descriptor: Float32Array) => {
    if (isSearching) return; 

    setIsSearching(true);
    setSearchStatus('Verifying face...');
    setMatchedUser(null);
    setError('');

    try {
      const response = await fetch('/api/find_match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          face_embedding: Array.from(descriptor),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown API error occurred.');
      }
      
      if (result.success && result.user) {
        setSearchStatus(`✅ Match Found!`);
        setMatchedUser(result.user);
      } else {
        setSearchStatus('❌ No match found in the database.');
      }

    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message);
      setSearchStatus('⚠️ Search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleScannerError = (err: Error) => {
    setError(`Scanner error: ${err.message}`);
    setSearchStatus('Scanner failed to load.');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg flex flex-col items-center space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-400">Face Recognition</h1>
        
        {/* The Face Scanner Component */}
        <FaceScanner
          onFaceDetected={handleFaceDetected}
          onError={handleScannerError}
        />
        
        {/* Status and Result Display */}
        <div className="w-full text-center p-4 bg-zinc-900/80 rounded-lg min-h-[6rem] flex flex-col items-center justify-center">
          {searchStatus && <p className="text-lg font-mono">{searchStatus}</p>}
          
          {matchedUser && (
            <div className="mt-2 text-left bg-zinc-800 p-3 rounded-md">
              <p><strong>Name:</strong> {matchedUser.name}</p>
              <p><strong>Email:</strong> {matchedUser.email}</p>
              <p><strong>UPI ID:</strong> {matchedUser.upi_id}</p>
              <p><strong>Similarity:</strong> {(matchedUser.similarity * 100).toFixed(2)}%</p>
            </div>
          )}

          {error && <p className="mt-2 text-red-400">{error}</p>}

          {!searchStatus && !error && <p className="text-zinc-400">Scan your face to find a match.</p>}
        </div>
      </div>
    </main>
  );
}