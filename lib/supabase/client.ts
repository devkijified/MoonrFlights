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
  const { data } = await supabase
    .from('flights')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })
  
  return data || []
}
