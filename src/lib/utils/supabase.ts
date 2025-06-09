// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase dashboard under Project Settings > API
const EXPO_PUBLIC_SUPABASE_URL = 'https://ocqckmfccycvbgbvwxbv.supabase.co';
const EXPO_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcWNrbWZjY3ljdmJnYnZ3eGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDkwNDIsImV4cCI6MjA2MTA4NTA0Mn0.oBOIJ1mqEUmBqajgZulkdxSdYnLBQZVHDIfxmMXWNLE';

const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;
