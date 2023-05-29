import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qjiujvpbyeubynkenpfy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXVqdnBieWV1Ynlua2VucGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUzNjI2MTksImV4cCI6MjAwMDkzODYxOX0.deUE4YSXqS_J3xKl-TiAFqRSf-G58DhOs5x7OkXGkjU"
);

export default supabase;
