import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/blog.index";
import { BlogPost } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { DrainageMesh } from "@/components/site/shapes";

const INITIAL_POST_LIMIT = 7;
const LOAD_MORE_BATCH_SIZE = 10;

export function BlogLandingPage() {
  const { posts } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_POST_LIMIT);

  // Get unique categories for filter tabs
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [posts]);

  // Reset limit when user selects a new category
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleLimit(INITIAL_POST_LIMIT);
  };

  // Reset limit when user updates search query
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleLimit(INITIAL_POST_LIMIT);
  };

  // Filter posts based on active query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, activeCategory]);

  // Determine featured post (first marked featured, or the newest published post)
  const featuredPost = useMemo(() => {
    if (filteredPosts.length === 0) return null;
    const explicitlyFeatured = filteredPosts.find((p) => p.featured);
    return explicitlyFeatured || filteredPosts[0];
  }, [filteredPosts]);

  // Remaining posts in the grid (excluding the featured one)
  const allGridPosts = useMemo(() => {
    if (!featuredPost) return [];
    return filteredPosts.filter((p) => p.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  // Sliced grid posts according to current visible limit
  // Initial load displays 8 total posts (1 featured + 7 grid posts)
  const gridLimit = featuredPost ? Math.max(0, visibleLimit - 1) : visibleLimit;
  const visibleGridPosts = useMemo(() => {
    return allGridPosts.slice(0, gridLimit);
  }, [allGridPosts, gridLimit]);

  const totalDisplayedCount = (featuredPost ? 1 : 0) + visibleGridPosts.length;
  const hasMorePosts = totalDisplayedCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + LOAD_MORE_BATCH_SIZE);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative isolate bg-surface-dark text-white py-16 md:py-24 overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <DrainageMesh opacity={0.50} color="var(--primary)" lineSpacing={80} />

        <div className="container-page relative z-10 max-w-6xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Knowledge Hub
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-white mt-6 leading-none">
              Geosynthetics <span className="text-primary">Insights</span>
            </h1>
            <p className="mt-6 text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl font-sans">
              Expert articles, technical documentation deep-dives, and installation guides on
              engineered geosynthetics and civil infrastructure projects across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="border-b border-border bg-surface py-5">
        <div className="container-page max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="relative w-full md:flex-1 md:max-w-[calc(100%-22rem)] overflow-hidden">
            {/* Left fade overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface via-surface/60 to-transparent pointer-events-none z-10" />

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 px-4 w-full justify-start whitespace-nowrap scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 uppercase tracking-wider shrink-0 ${activeCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-background text-muted-foreground border border-border hover:text-foreground hover:bg-muted/40"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right fade overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface via-surface/60 to-transparent pointer-events-none z-10" />
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-10 rounded-full border-border bg-background focus:ring-primary/20 focus:border-primary text-sm w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-20 container-page max-w-6xl mx-auto px-4 md:px-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl max-w-lg mx-auto">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold uppercase text-foreground">
              No Articles Found
            </h3>
            <p className="text-xs text-muted-foreground mt-2 px-6">
              We couldn't find any articles matching "{searchQuery}" under category "
              {activeCategory}". Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-20">
            {/* Featured Post Card (only shown when search/category has results) */}
            {featuredPost && (
              <div className="group bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-primary hover:bg-primary text-white uppercase text-[9px] font-bold tracking-wider px-2.5 py-1 shadow-md shadow-primary/30 border-0">
                    Featured
                  </Badge>
                </div>

                {/* Left/Top Cover Image */}
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={
                      featuredPost.cover_image ||
                      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200"
                    }
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    loading="eager"
                  />
                </div>

                {/* Right/Bottom Card Content */}
                <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 border border-primary/10 rounded">
                      {featuredPost.category}
                    </span>

                    <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-foreground group-hover:text-primary transition-colors leading-tight">
                      <Link to="/blog/$slug" params={{ slug: featuredPost.slug }}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed font-sans line-clamp-4">
                      {featuredPost.excerpt ||
                        "Read our latest analysis and detailed overview regarding engineering, specs, and materials configuration on Geosynthetics Africa."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(featuredPost.published_at)}
                      </span>
                      {featuredPost.read_time && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredPost.read_time} min read
                        </span>
                      )}
                    </div>

                    <Link
                      to="/blog/$slug"
                      params={{ slug: featuredPost.slug }}
                      className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary group-hover/btn:translate-x-1 transition-all"
                    >
                      Read Article
                      <ArrowRight className="h-4.5 w-4.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Post Grid (Remaining posts) */}
            {visibleGridPosts.length > 0 && (
              <div className="space-y-8">
                <h3 className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                  Latest Publications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleGridPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Image */}
                        <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                          <img
                            src={
                              post.cover_image ||
                              "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800"
                            }
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                            loading="lazy"
                          />
                          <span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-wider text-white bg-surface-dark/85 backdrop-blur px-2.5 py-1 rounded border border-white/10">
                            {post.category}
                          </span>
                        </div>

                        {/* Text Content */}
                        <div className="p-5 space-y-3.5">
                          <h4 className="font-display text-lg md:text-xl font-bold uppercase text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            <Link to="/blog/$slug" params={{ slug: post.slug }}>
                              {post.title}
                            </Link>
                          </h4>

                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-sans">
                            {post.excerpt ||
                              "Read our complete project summary and analysis details for civil construction applications."}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-5 pt-0 border-t border-border/40 mt-auto">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold pt-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.published_at)}
                          </span>
                          {post.read_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.read_time} min
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Load More Button & Article Counter */}
            {hasMorePosts && (
              <div className="pt-8 text-center flex flex-col items-center justify-center space-y-3">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-xs px-8 py-6 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
                >
                  Load More Articles
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground font-sans">
                  Showing <span className="font-bold text-foreground">{totalDisplayedCount}</span> of{" "}
                  <span className="font-bold text-foreground">{filteredPosts.length}</span> articles
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
