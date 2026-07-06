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

  for (const row of rows || []) {
    console.log("-----------------------------------------");
    console.log("KEY:", row.key);
    if (row.key === "hierarchy_applications") {
      const val = row.value as any;
      console.log("Label:", val.label);
      console.log("Items:");
      val.items?.forEach((item: any) => {
        console.log(`  - ID: "${item.id}", Slug: "${item.slug}", Label: "${item.label}", params:`, item.params);
        if (item.children && item.children.length > 0) {
          console.log("    Children:");
          item.children.forEach((c: any) => {
            console.log(`      * ID: "${c.id}", Slug: "${c.slug}", Label: "${c.label}", params:`, c.params);
          });
        }
      });
    } else if (row.key === "template_applications") {
      const val = row.value as any;
      console.log("Template Keys:", Object.keys(val));
    }
  }
}

main().catch(console.error);
