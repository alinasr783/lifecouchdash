import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nyknpkhpeeppdjlltwyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55a25wa2hwZWVwcGRqbGx0d3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzA5MDIsImV4cCI6MjA2MTA0NjkwMn0.l2jZRgosBBhlSoSoUC5jv0gbSAIm7lah9uSQaeI5878'

export const supabase = createClient(supabaseUrl, supabaseKey)