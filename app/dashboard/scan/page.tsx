"use client";

import FaceScanner from '@/components/add/FaceScanner';
import React, { useState } from 'react';

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
  
  const [amount, setAmount] = useState('');

  const handleFaceDetected = async (descriptor: Float32Array) => {
    if (isSearching) return;

    setIsSearching(true);
    setSearchStatus('Verifying face...');
    setMatchedUser(null);
    setError('');
    
    setAmount('');

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
        setSearchStatus(`Match Found!`);
        setMatchedUser(result.user);
      } else {
        setSearchStatus('No match found in the database.');
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
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-400">Face Recognition Payment</h1>
        
        <FaceScanner
          onFaceDetected={handleFaceDetected}
          onError={handleScannerError}
          processingLabel='VERIFYING...'
        />
        
        <div className="w-full text-center p-4 bg-zinc-900/80 rounded-lg min-h-[6rem] flex flex-col items-center justify-center">
          {searchStatus && <p className="text-lg font-mono">{searchStatus}</p>}
          
          {matchedUser && (
            <div className="mt-4 w-full text-left bg-zinc-800 p-4 rounded-md flex flex-col items-start space-y-2">
              <p><strong>Name:</strong> {matchedUser.name}</p>
              <p><strong>UPI ID:</strong> {matchedUser.upi_id}</p>
              <p><strong>Similarity:</strong> {(matchedUser.similarity * 100).toFixed(2)}%</p>

              <div className="w-full pt-2">
                <label htmlFor="amount" className="block text-sm font-medium text-zinc-300">
                  Enter Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400"
                  placeholder="100.00"
                />
              </div>

              <a
                href={
                  amount && parseFloat(amount) > 0
                    ? `upi://pay?pa=${matchedUser.upi_id}&pn=${encodeURIComponent(matchedUser.name)}&am=${amount}&cu=INR&tn=Payment via Face Recognition`
                    : '#'
                }
                onClick={(e) => {
                  if (!amount || parseFloat(amount) <= 0) {
                    e.preventDefault();
                    alert("Please enter a valid amount to pay.");
                  }
                }}
                className={`mt-4 w-full text-center font-bold py-2 px-4 rounded transition-colors ${
                  !amount || parseFloat(amount) <= 0
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay ₹{amount || '...'} via UPI
              </a>
            </div>
          )}

          {error && <p className="mt-2 text-red-400">{error}</p>}

          {!searchStatus && !error && <p className="text-zinc-400">Scan face to pay.</p>}
        </div>
      </div>
    </main>
  );
}