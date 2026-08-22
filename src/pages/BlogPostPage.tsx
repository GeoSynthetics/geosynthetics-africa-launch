import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { getBlogPostAuthorName } from "@/types/blog";
import { BlogPostingSchema } from "@/components/seo/BlogPostingSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Route } from "@/routes/blog.$slug";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Link2,
  Package,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HexCell } from "@/components/site/shapes";

export function BlogPostPage() {
  const { post, products, prevPost, nextPost } = Route.useLoaderData();

  // Pick 3 random products to upsell
  const randomProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [products]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const shareUrls = useMemo(() => {
    if (typeof window === "undefined") return { linkedin: "", twitter: "", facebook: "" };
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    return {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
  }, [post]);

  return (
    <div className="w-full bg-background min-h-screen">
      <BlogPostingSchema
        title={post.title}
        description={post.meta_description || post.excerpt || ""}
        slug={post.slug}
        coverImage={post.cover_image}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        authorName={getBlogPostAuthorName(post.author)}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://geosynthetics.co.za" },
          { name: "Blog", url: "https://geosynthetics.co.za/blog" },
          { name: post.title, url: `https://geosynthetics.co.za/blog/${post.slug}` },
        ]}
      />
      {/* Article Header Hero */}
      <section className="relative isolate bg-surface-dark text-white py-14 md:py-20 overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <HexCell opacity={0.3} color="var(--primary)" count={60} />

        <div className="container-page max-w-5xl mx-auto px-4 md:px-6 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Insights
          </Link>

          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded">
              {post.category}
            </span>

            <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-300 font-semibold pt-2">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" />
                {getBlogPostAuthorName(post.author)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
              {post.read_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {post.read_time} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container-page max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Article Content */}
        <article className="lg:col-span-8 space-y-8">
          {/* Featured Image */}
          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden bg-muted border border-border/50 max-h-[450px]">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Excerpt panel */}
          {post.excerpt && (
            <div className="p-5 bg-muted/30 border border-border/40 rounded-2xl italic text-muted-foreground text-sm font-sans leading-relaxed">
              {post.excerpt}
            </div>
          )}

          {/* HTML Render Body */}
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose max-w-none text-foreground font-sans text-sm md:text-base leading-relaxed
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:font-display [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:text-foreground
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:font-display [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-foreground
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-foreground
              [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground/90
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-muted-foreground/90
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-muted-foreground/90
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-5 [&_blockquote]:text-muted-foreground [&_blockquote]:bg-muted/10 [&_blockquote]:py-1 [&_blockquote]:rounded-r
              [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary-hover [&_a]:font-semibold"
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-border/40 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center mr-1">
                Post Tags:
              </span>
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground px-2.5 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Right Side: Desktop Sidebar */}
        <aside className="lg:col-span-4 space-y-6 sticky top-6">
          {/* Share Article */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold uppercase text-sm tracking-wider border-b border-border/50 pb-2 flex items-center gap-2 text-foreground">
              <Share2 className="h-4.5 w-4.5 text-primary" />
              Share Article
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a
                  href={shareUrls.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a
                  href={shareUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a
                  href={shareUrls.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground ml-auto"
                onClick={handleCopyLink}
                title="Copy Link"
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Catalogue Products Upsell */}
          {randomProducts.length > 0 && (
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider border-b border-border/50 pb-2 flex items-center gap-2 text-foreground">
                <Package className="h-4.5 w-4.5 text-primary" />
                Featured Products
              </h3>

              <div className="space-y-4 pt-1">
                {randomProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group/prod flex gap-3 border border-border/30 hover:border-border/80 rounded-xl p-2.5 bg-muted/10 transition-colors"
                  >
                    {prod.image_url && (
                      <img
                        src={prod.image_url}
                        alt=""
                        className="h-14 w-18 rounded bg-muted object-cover border border-border/30 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-bold uppercase text-xs text-foreground group-hover/prod:text-primary transition-colors line-clamp-1 leading-snug">
                          {prod.name}
                        </h4>
                        {prod.short_description && (
                          <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 font-sans leading-relaxed">
                            {prod.short_description}
                          </p>
                        )}
                      </div>
                      <Link
                        to="/catalogue/$slug"
                        params={{ slug: prod.slug }}
                        className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center mt-1"
                      >
                        View Product
                        <ArrowRight className="h-3 w-3 ml-1 group-hover/prod:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Quote Call to Action Banner */}
          <div className="bg-surface-dark text-white rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl pointer-events-none" />
            <h3 className="font-display font-bold uppercase text-sm tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
              <MessageSquare className="h-4.5 w-4.5 text-primary" />
              Need Specifications?
            </h3>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Geosynthetics Africa provides tailored design, procurement support, and BOQ
              calculations for civil works across Africa.
            </p>
            <Button
              className="bg-primary hover:bg-primary-hover text-white w-full uppercase text-[9px] tracking-wider font-bold h-9 rounded-xl border-0"
              asChild
            >
              <Link to="/contacts">Contact Engineers</Link>
            </Button>
          </div>
        </aside>
      </div>

      {/* Next & Previous Post Navigation Bar */}
      {(prevPost || nextPost) && (
        <nav
          aria-label="Post navigation"
          className="container-page max-w-5xl mx-auto px-4 md:px-6 pb-16 pt-6 border-t border-border/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Previous Post */}
            {prevPost ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prevPost.slug }}
                className="group bg-card border border-border/70 hover:border-primary/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 text-left"
              >
                <img
                  src={
                    prevPost.cover_image ||
                    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600"
                  }
                  alt={prevPost.title}
                  className="h-16 w-20 md:h-20 md:w-24 rounded-xl object-cover border border-border/50 shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                    <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Previous Article
                  </span>
                  <h4 className="font-display text-xs md:text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {prevPost.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {/* Next Post */}
            {nextPost && (
              <Link
                to="/blog/$slug"
                params={{ slug: nextPost.slug }}
                className="group bg-card border border-border/70 hover:border-primary/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-end text-right gap-4 md:col-start-2"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center justify-end gap-1 mb-1">
                    Next Article
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <h4 className="font-display text-xs md:text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {nextPost.title}
                  </h4>
                </div>
                <img
                  src={
                    nextPost.cover_image ||
                    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600"
                  }
                  alt={nextPost.title}
                  className="h-16 w-20 md:h-20 md:w-24 rounded-xl object-cover border border-border/50 shrink-0 group-hover:scale-105 transition-transform duration-300 order-last"
                />
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
