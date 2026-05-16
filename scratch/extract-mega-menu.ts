import { megaMenus } from "../src/components/site/mega-menu-data";
import fs from "fs";

fs.writeFileSync("scratch/mega_menu.json", JSON.stringify(megaMenus, null, 2));
console.log("Extracted to scratch/mega_menu.json");
