import { describe, it, expect } from "vitest";
import { toCdnStorageUrls } from "@/integrations/supabase/client";

describe("toCdnStorageUrls", () => {
  it("points Supabase Storage image links at the site's cached proxy", () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const json = JSON.stringify({
      hero: `${supabaseUrl}/storage/v1/object/public/media-center/hero_123.webp`,
      other: "https://example.org/x.png",
    });
    const out = JSON.parse(toCdnStorageUrls(json));
    expect(out.hero).toBe("https://www.geosyntheticsafrica.com/api/storage/media-center/hero_123.webp");
    expect(out.other).toBe("https://example.org/x.png");
  });

  it("leaves text without storage links unchanged", () => {
    expect(toCdnStorageUrls('{"a":1}')).toBe('{"a":1}');
  });
});
