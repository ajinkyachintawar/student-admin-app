import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqwappsdvwqhwwzkngta.supabase.co'; // replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2FwcHNkdndxaHd3emtuZ3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mzk1NTcsImV4cCI6MjA2MjExNTU1N30.W-Un5PDTDvymcmN93NyNUuHPDs3cOvV_gozSq19dYVc'; // replace with your anon key
export const supabase = createClient(supabaseUrl, supabaseKey);
