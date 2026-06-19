// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export async function isAdmin() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    // Use a simpler query that won't cause recursion
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()  // Use maybeSingle() instead of single()
    
    if (error) {
      console.warn('Admin check error:', error)
      return false
    }
    
    return data?.is_admin || false
  } catch (error) {
    console.warn('Admin check failed:', error)
    return false
  }
}

export async function getUserFlights() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Get flights error:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.warn('Get flights failed:', error)
    return []
  }
}

export async function getAllFlights() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    // Check if user is admin
    const isAdminUser = await isAdmin()
    if (!isAdminUser) return []
    
    const { data, error } = await supabase
      .from('flights')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Get all flights error:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.warn('Get all flights failed:', error)
    return []
  }
}// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export async function isAdmin() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    // Use a simpler query that won't cause recursion
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()  // Use maybeSingle() instead of single()
    
    if (error) {
      console.warn('Admin check error:', error)
      return false
    }
    
    return data?.is_admin || false
  } catch (error) {
    console.warn('Admin check failed:', error)
    return false
  }
}

export async function getUserFlights() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Get flights error:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.warn('Get flights failed:', error)
    return []
  }
}

export async function getAllFlights() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    // Check if user is admin
    const isAdminUser = await isAdmin()
    if (!isAdminUser) return []
    
    const { data, error } = await supabase
      .from('flights')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Get all flights error:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.warn('Get all flights failed:', error)
    return []
  }
}
