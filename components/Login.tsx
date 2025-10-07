'use client'

import { createClient } from '@/utils/supabase/client'

export default function LoginButton() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>
}