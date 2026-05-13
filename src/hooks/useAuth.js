import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const ADMIN_EMAILS = {
  'denyadev@proton.me':      'valkyrie',
  'yt.universaly@gmail.com': 'bai',
}

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  const isAdmin    = user?.email in ADMIN_EMAILS
  const adminAgency = ADMIN_EMAILS[user?.email] || null

  return { user, loading, isAdmin, adminAgency, signIn, signOut }
}