import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project's URL and anon/public key
const SUPABASE_URL = 'https://vkgqzxklcypyjepmxsno.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZ3F6eGtsY3lweWplcG14c25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NDg4NDgsImV4cCI6MjA1NDEyNDg0OH0.y5MfZQBWVqbtj6R2sNZ3AytHzfo3FUnIvacMQHUhRuU'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
