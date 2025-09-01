import { supabase } from './supabase'
import { getCurrentLocation, getDistrictFromCoordinates } from './maps-fallback'

export interface SignUpData {
  email: string
  password: string
  name: string
  age: number
  gender: string
  bio?: string
  interests: string[]
}

export interface SignInData {
  email: string
  password: string
}

export const signUp = async (userData: SignUpData) => {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) throw authError

    if (authData.user) {
      // 2. Get user location
      let location = null
      let district = 'Kerala'
      let city = 'Unknown'

      try {
        const coords = await getCurrentLocation()
        location = `POINT(${coords.lng} ${coords.lat})`
        district = await getDistrictFromCoordinates(coords.lat, coords.lng)
        city = district // Simplified for now
      } catch (locationError) {
        console.log('Location not available:', locationError)
      }

      // 3. Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            age: userData.age,
            gender: userData.gender,
            bio: userData.bio,
            location: location,
            current_city: city,
            current_district: district,
            is_online: true,
            subscription_type: 'free'
          }
        ])

      if (profileError) throw profileError

      // 4. Add user interests
      if (userData.interests.length > 0 && authData.user) {
        const interests = userData.interests.map(interest => ({
          user_id: authData.user!.id,
          interest: interest
        }))
        
        const { error: interestsError } = await supabase
          .from('user_interests')
          .insert(interests)

        if (interestsError) console.log('Interests error:', interestsError)
      }

      return { user: authData.user, error: null }
    }

    return { user: null, error: 'User creation failed' }
  } catch (error) {
    console.error('Signup error:', error)
    return { user: null, error: error.message }
  }
}

export const signIn = async (credentials: SignInData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error

    // Update user online status
    if (data.user) {
      await supabase
        .from('users')
        .update({ 
          is_online: true, 
          last_seen: new Date().toISOString() 
        })
        .eq('id', data.user.id)
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Signin error:', error)
    return { user: null, error: error.message }
  }
}

export const signOut = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Update offline status
      await supabase
        .from('users')
        .update({ 
          is_online: false, 
          last_seen: new Date().toISOString() 
        })
        .eq('id', user.id)
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Signout error:', error)
    return { error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    if (user) {
      // Get full user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      return { user: profile, error: null }
    }

    return { user: null, error: null }
  } catch (error) {
    console.error('Get user error:', error)
    return { user: null, error: error.message }
  }
}
