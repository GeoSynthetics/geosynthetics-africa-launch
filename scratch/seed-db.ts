import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const data = JSON.parse(fs.readFileSync('scratch/mega_menu.json', 'utf8'));

async function seed() {
  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'mega_menu', value: data }, { onConflict: 'key' });

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Successfully seeded mega_menu config.");
  }
}

seed();
