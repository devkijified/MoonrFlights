import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  return profile?.is_admin || false
}

export async function getUserFlights() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  return data || []
}

export async function getAllFlights() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  // First check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return []
  }
  
  // Fetch all flights - simple query without join
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching all flights:', error)
    return []
  }
  
  // Get user emails separately
  const userIds = [...new Set(data?.map(flight => flight.user_id) || [])]
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds)
  
  // Merge user data into flights
  const flightsWithUsers = data?.map(flight => ({
    ...flight,
    profiles: users?.find(user => user.id === flight.user_id)
  })) || []
  
  return flightsWithUsers
}
