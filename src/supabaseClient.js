import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sgknwujmmkiqogvplljz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNna253dWptbWtpcW9ndnBsbGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDMyODgsImV4cCI6MjA2ODc3OTI4OH0.B1MNqLCWKGQZXE-eIt4keExsR5Uku2w84Eg44z16z34";

export const supabase = createClient(supabaseUrl, supabaseKey);
