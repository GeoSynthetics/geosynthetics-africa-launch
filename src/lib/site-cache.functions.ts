import { createServerFn } from "@tanstack/react-start";
import { invalidateByTag } from "@vercel/functions";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { SITE_PAGES_CACHE_TAG } from "@/lib/site-cache";

/**
 * Marks every cached page as stale, so the next visitor to each page triggers a
 * background refresh and edits appear within seconds instead of up to an hour.
 * Only signed-in admin or staff users can call it.
 */
export const refreshSiteCacheFn = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .handler(async ({ context }) => {
    // The generated Database types are empty in this project, so type the row here.
    const { data } = await (context.supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = (data || []).some((r: { role: string }) => r.role === "admin" || r.role === "staff");
    if (!allowed) throw new Response("Forbidden", { status: 403 });

    await invalidateByTag(SITE_PAGES_CACHE_TAG);
    return { refreshed: true };
  });
