import fs from 'fs';

const data = fs.readFileSync('scratch/mega_menu.json', 'utf8');
const sql = `
INSERT INTO public.site_config (key, value)
VALUES ('mega_menu', '${data.replace(/'/g, "''")}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
`;
fs.writeFileSync('scratch/seed.sql', sql);
console.log("SQL generated at scratch/seed.sql");
