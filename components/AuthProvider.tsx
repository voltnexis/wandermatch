'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, setUserOnline, setUserOffline } from '../lib/supabase'
import { User } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  setUser: () => {},
  signUp: async () => ({ error: 'Not implemented' }),
  signIn: async () => ({ error: 'Not implemented' })
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Get full user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          // Update online status
          await setUserOnline(profile.id)
          setUser({ ...profile, is_online: true })
        }
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get full user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profile) {
            // Update online status
            await setUserOnline(profile.id)
            setUser({ ...profile, is_online: true })
          }
        } else {
          if (user) {
            await setUserOffline(user.id)
          }
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Online presence tracking
  useEffect(() => {
    if (!user?.id) return

    // Heartbeat to keep user online
    const heartbeat = setInterval(() => {
      setUserOnline(user.id)
    }, 30000)

    // Handle page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserOffline(user.id)
      } else {
        setUserOnline(user.id)
      }
    }

    // Handle page unload
    const handleBeforeUnload = () => {
      setUserOffline(user.id)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(heartbeat)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      setUserOffline(user.id)
    }
  }, [user?.id])

  const handleSignOut = async () => {
    if (user) {
      // Update offline status
      await setUserOffline(user.id)
    }

    await supabase.auth.signOut()
    setUser(null)
  }
  
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: undefined
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        return { error: error.message }
      }
      
      console.log('Signup successful:', data)
      return { error: undefined }
    } catch (error) {
      console.error('Signup exception:', error)
      return { error: 'Signup failed' }
    }
  }
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) return { error: error.message }
      return { error: undefined }
    } catch (error) {
      return { error: 'Login failed' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, setUser, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
