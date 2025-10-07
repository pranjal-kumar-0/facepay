import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Link href="/dashboard">
        <button className="px-6 py-3 bg-green-800 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default Page;
