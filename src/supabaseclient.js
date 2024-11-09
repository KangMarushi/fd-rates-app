import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhlaejioalebvpadtwiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobGFlamlvYWxlYnZwYWR0d2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2MjA0NjksImV4cCI6MjA0NjE5NjQ2OX0.f-kI-1DO924PRXAzd31hwcMOgxb2oE0dKCEC4zrgDgw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
