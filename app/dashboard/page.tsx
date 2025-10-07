import React from 'react';
import Link from 'next/link';
import Logout from '@/components/Logout'; 
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const ScanFaceIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </svg>
);

const AddFaceIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const ModifyInfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const DashboardPage = async () => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  const options = [
    {
      title: 'Scan Face',
      description: 'Authenticate using facial recognition to access secure areas.',
      link: '/scan',
      icon: <ScanFaceIcon className="h-12 w-12 mx-auto text-gray-500 group-hover:text-emerald-400 transition-colors" />,
    },
    {
      title: 'Add Your Face',
      description: 'Register your facial biometrics to set up your profile.',
      link: '/dashboard/add',
      icon: <AddFaceIcon className="h-12 w-12 mx-auto text-gray-500 group-hover:text-emerald-400 transition-colors" />,
    },
    {
      title: 'Modify Info',
      description: 'Update your personal details or re-scan your facial data.',
      link: '/modify-info',
      icon: <ModifyInfoIcon className="h-12 w-12 mx-auto text-gray-500 group-hover:text-emerald-400 transition-colors" />,
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center p-6 font-mono relative">
      {/* Logout positioned top-right */}
      <div className="absolute top-4 right-4">
        <Logout />
      </div>

      {/* Centered content container */}
      <div className="w-full max-w-5xl text-center">
        {/* Header Section (centered) */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-400">// DASHBOARD</h1>
          <p className="text-gray-500 mt-2">Select an operation to proceed</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {options.map((option) => (
            <Link
              key={option.title}
              href={option.link}
              className="group bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center hover:border-emerald-400/50 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              {option.icon}
              <h2 className="text-xl font-semibold mt-4">{option.title}</h2>
              <p className="text-gray-500 text-sm mt-2">{option.description}</p>
            </Link>
          ))}
        </div>

        {/* Footer hint */}
        <div className="mt-16 text-xs text-gray-600">
          <p>session.id: <span className="text-gray-500">f4t3-h4ck-3r-m4n-s35510n</span></p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
