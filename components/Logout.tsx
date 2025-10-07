"use client"

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      title="Sign out"
      aria-label="Sign out"
      className="inline-flex hover:cursor-pointer items-center gap-2 font-mono text-sm px-3 py-1 rounded-full bg-zinc-900/60 border border-emerald-700 text-emerald-300 hover:bg-emerald-700/10 hover:backdrop-brightness-110 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18.36 6.64a9 9 0 1 1-12.72 0" />
        <line x1="12" y1="2" x2="12" y2="12" />
      </svg>
      <span className="select-none">Logout</span>
    </button>
  )
}