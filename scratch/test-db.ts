import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: rows, error } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", ["hierarchy_applications", "template_applications"]);

  if (error) {
    console.error("Error fetching site_config:", error);
    return;
  }

  console.log(JSON.stringify(rows, null, 2));
}

main().catch(console.error);
