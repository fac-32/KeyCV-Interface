import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase.ts";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export default supabase;
