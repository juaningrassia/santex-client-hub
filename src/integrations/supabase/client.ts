
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sokjatzlinwnpyckhhil.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNva2phdHpsaW53bnB5Y2toaGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzIxMjYsImV4cCI6MjA2MDY0ODEyNn0.fxF2Mnep9-jiXuWGWWdgp-1CREqVKah7uib7Meovh9A";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
