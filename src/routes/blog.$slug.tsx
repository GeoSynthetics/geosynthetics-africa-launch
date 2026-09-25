import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { Skeleton } from "@/components/ui/skeleton";

async function loadPost(slug: string) {
  // 1. Fetch the blog post
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      author:author_id (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading blog post:", error);
    throw error;
  }

  if (!post) {
    throw notFound();
  }

  // 2. Fetch Previous Post (published before this post)
  const { data: prevPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image, category")
    .eq("status", "published")
    .lt("published_at", post.published_at)
    .order("published_at", { ascending: false })
    .limit(1);

  // 3. Fetch Next Post (published after this post)
  const { data: nextPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image, category")
    .eq("status", "published")
    .gt("published_at", post.published_at)
    .order("published_at", { ascending: true })
    .limit(1);

  // 4. Fetch active products for the dynamic upsell sidebar
  const { data: products, error: productsErr } = await supabase
    .from("products_public")
    .select("id, name, slug, short_description, image_url")
    .eq("is_active", true)
    .limit(30);

  if (productsErr) {
    console.error("Error loading upsell products:", productsErr);
  }

  return {
    post: post as any,
    prevPost: (prevPosts?.[0] as any) || null,
    nextPost: (nextPosts?.[0] as any) || null,
    products: products || [],
  };
}

function BlogPostSkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Post Hero Skeleton */}
      <section className="bg-surface-dark text-white relative py-16 md:py-24">
        <div className="container-page relative z-10 max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-3.5 w-16 bg-white/20" />
            <span className="text-white/20">/</span>
            <Skeleton className="h-3.5 w-24 bg-white/20" />
          </div>
          <Skeleton className="h-10 md:h-12 w-4/5 bg-white/20 mb-6" />
          <div className="flex gap-4">
            <Skeleton className="h-4.5 w-32 bg-white/20" />
            <Skeleton className="h-4.5 w-20 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Content Layout Skeleton */}
      <div className="container-page max-w-5xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-12 gap-10">
        {/* Left main content column */}
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Right sidebar column */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-4 pt-4 border-t border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="h-12 w-16 rounded shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => loadPost(params.slug),
  pendingComponent: BlogPostSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title =
      post?.meta_title ||
      (post ? `${post.title} — Blog | Geosynthetics Africa` : "Blog — Geosynthetics Africa");
    const desc =
      post?.meta_description ||
      post?.excerpt ||
      "Expert geosynthetics article by Geosynthetics Africa.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(post?.cover_image ? [{ property: "og:image", content: post.cover_image }] : []),
      ],
    };
  },
  component: BlogPostPage,
});
