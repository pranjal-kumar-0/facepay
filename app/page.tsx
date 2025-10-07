'use client'
import Link from 'next/link';
import React from 'react';

// --- SVG Icons for the feature list ---

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-4 text-emerald-400">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const ScanFaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-4 text-emerald-400">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" />
  </svg>
);

const UpiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-4 text-emerald-400">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
);

// --- The Landing Page Component ---

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono flex flex-col items-center justify-center p-4">
      {/* Main content container with terminal aesthetic */}
      <div className="w-full max-w-4xl bg-black/50 border border-emerald-900 rounded-lg shadow-2xl shadow-emerald-500/10 overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-emerald-900">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-center text-sm text-gray-400 flex-grow">/bin/bash</p>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-10">
          {/* Animated Header */}
          <div className="relative">
            <h1 className="text-3xl md:text-5xl font-bold text-emerald-400 ">
              FacePay UPI
            </h1>
          </div>

          <p className="mt-4 text-gray-400 text-lg">
            &gt; Instant, peer-to-peer payments powered by facial recognition.
          </p>
          
          <div className="mt-8">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg shadow-lg transition-colors duration-200 text-lg flex items-center space-x-2">
                <span>// Launch Dashboard</span>
              </button>
            </Link>
          </div>

          {/* How It Works Section */}
          <div className="mt-16">
            <p className="text-gray-500">// HOW IT WORKS</p>
            <div className="grid md:grid-cols-3 gap-8 mt-4">
              <div className="border-t-2 border-emerald-800 pt-4">
                <UserPlusIcon />
                <h3 className="font-bold text-lg text-white">1. Register</h3>
                <p className="text-gray-400 text-sm">Add your face and link your UPI ID in seconds.</p>
              </div>
              <div className="border-t-2 border-emerald-800 pt-4">
                <ScanFaceIcon />
                <h3 className="font-bold text-lg text-white">2. Scan</h3>
                <p className="text-gray-400 text-sm">Get the UPI ID by scanning the recipient's face.</p>
              </div>
              <div className="border-t-2 border-emerald-800 pt-4">
                 <UpiIcon />
                <h3 className="font-bold text-lg text-white">3. Pay</h3>
                <p className="text-gray-400 text-sm">Confirm the details and transfer funds directly to their UPI. (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full max-w-4xl text-center mt-8 text-xs text-gray-600">
        <p>exit code 0</p>
        <p className="mt-2">
          A project by <a href="https://github.com/pranjal-kumar-0" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">pranjal-kumar-0</a>
        </p>
      </footer>

      
    </div>
  );
};

export default LandingPage;
