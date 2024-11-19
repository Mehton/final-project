import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Use VITE_ prefix
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Use VITE_ prefix

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;