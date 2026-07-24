import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostStatus } from "@/types/blog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  ArrowLeft,
  Loader2,
  Calendar,
  Sparkles,
  BookOpen,
  Tag,
} from "lucide-react";

const emptyPost: Partial<BlogPost> = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  cover_image: "",
  category: "Tech Insights",
  tags: [],
  read_time: null,
  status: "draft",
  featured: false,
  meta_title: "",
  meta_description: "",
  published_at: "",
};

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Sync slug from title
  const [autoSlug, setAutoSlug] = useState(true);

  // Fetch posts and current user session
  const loadPosts = async () => {
    setLoading(true);
    try {
      // Get current session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setCurrentUserId(sessionData.session.user.id);
      }

      // Fetch posts with author profiles joined
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:author_id (
            id,
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts((data ?? []) as unknown as BlogPost[]);
    } catch (err: any) {
      toast.error(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  // Compute unique categories from loaded posts for filters & suggestions
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.slug.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [posts, q, statusFilter, categoryFilter]);

  const handleTitleChange = (title: string) => {
    const updates: Partial<BlogPost> = { title };
    if (autoSlug) {
      updates.slug = slugify(title);
    }
    setEditingPost((prev) => ({ ...prev, ...updates }));
  };

  const handleNewClick = () => {
    setEditingPost({
      ...emptyPost,
      published_at: new Date().toISOString().substring(0, 16), // datetime-local format
      author_id: currentUserId,
    });
    setAutoSlug(true);
    setIsEditing(true);
  };

  const handleEditClick = (post: BlogPost) => {
    // Format published_at for input[type=datetime-local]
    const pubDate = post.published_at
      ? new Date(post.published_at).toISOString().substring(0, 16)
      : new Date().toISOString().substring(0, 16);

    setEditingPost({
      ...post,
      published_at: pubDate,
    });
    setAutoSlug(false); // Disable auto-slug when editing an existing post
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingPost.title?.trim()) {
      toast.error("Post title is required");
      return;
    }
    if (!editingPost.slug?.trim()) {
      toast.error("Post slug is required");
      return;
    }
    if (!editingPost.category?.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!editingPost.content?.trim()) {
      toast.error("Content is required");
      return;
    }

    setSaving(true);
    try {
      // Calculate read time if not provided
      let readTime = editingPost.read_time;
      if (!readTime) {
        const textOnly = stripHtml(editingPost.content);
        const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
        readTime = Math.max(1, Math.ceil(wordCount / 220)); // ~220 wpm
      }

      const payload = {
        title: editingPost.title.trim(),
        slug: editingPost.slug.trim(),
        content: editingPost.content.trim(),
        excerpt: editingPost.excerpt?.trim() || null,
        cover_image: editingPost.cover_image?.trim() || null,
        category: editingPost.category.trim(),
        tags: editingPost.tags ?? [],
        read_time: readTime,
        status: editingPost.status ?? "draft",
        featured: editingPost.featured ?? false,
        author_id: editingPost.author_id || currentUserId,
        meta_title: editingPost.meta_title?.trim() || null,
        meta_description: editingPost.meta_description?.trim() || null,
        published_at: editingPost.published_at
          ? new Date(editingPost.published_at).toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = editingPost.id
        ? await supabase.from("blog_posts").update(payload).eq("id", editingPost.id)
        : await supabase.from("blog_posts").insert(payload);

      if (error) throw error;

      toast.success(editingPost.id ? "Blog post updated" : "Blog post created successfully!");
      setIsEditing(false);
      void loadPosts();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postToDelete.id);
      if (error) throw error;
      toast.success(`Post "${postToDelete.title}" deleted successfully`);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-primary" />
            Blog Post Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, edit, and publish blog articles for Geosynthetics Africa.
          </p>
        </div>

        {!isEditing && (
          <Button
            onClick={handleNewClick}
            className="bg-primary hover:bg-primary-hover text-white uppercase tracking-wider text-xs font-bold shrink-0 self-start sm:self-auto h-10 rounded-xl px-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        )}
      </div>

      <hr className="border-border/50" />

      {/* Editor Mode */}
      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Editing Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="h-9 w-9 rounded-lg border-border/60 hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                {editingPost.id ? "Edit Article" : "Create New Article"}
              </span>
            </div>

            {/* Post Title */}
            <div className="space-y-2">
              <Label htmlFor="post-title" className="text-xs font-bold uppercase tracking-wide">
                Article Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="post-title"
                placeholder="Enter post title..."
                value={editingPost.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-11 rounded-xl text-base font-semibold"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wide">
                Post Content <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={editingPost.content || ""}
                onChange={(content) => setEditingPost((prev) => ({ ...prev, content }))}
                placeholder="Compose your geosynthetic insights here..."
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="post-excerpt" className="text-xs font-bold uppercase tracking-wide">
                Excerpt / Brief Summary
              </Label>
              <Textarea
                id="post-excerpt"
                placeholder="Write a hook or brief summary (150-200 characters) for landing page cards..."
                value={editingPost.excerpt || ""}
                onChange={(e) => setEditingPost((prev) => ({ ...prev, excerpt: e.target.value }))}
                className="rounded-xl min-h-[90px] resize-y text-sm"
              />
            </div>
          </div>

          {/* Sidebar Settings Column */}
          <div className="space-y-6">
            {/* Publish & Status Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider border-b border-border/50 pb-2 flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Publish Options
              </h3>

              <div className="space-y-2">
                <Label htmlFor="post-status" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={editingPost.status || "draft"}
                  onValueChange={(val) =>
                    setEditingPost((prev) => ({ ...prev, status: val as BlogPostStatus }))
                  }
                >
                  <SelectTrigger id="post-status" className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="draft" className="focus:bg-muted">Draft</SelectItem>
                    <SelectItem value="published" className="focus:bg-muted">Published</SelectItem>
                    <SelectItem value="archived" className="focus:bg-muted">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-published-at" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Publish Date & Time
                </Label>
                <Input
                  id="post-published-at"
                  type="datetime-local"
                  value={editingPost.published_at || ""}
                  onChange={(e) =>
                    setEditingPost((prev) => ({ ...prev, published_at: e.target.value }))
                  }
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border/30 rounded-xl">
                <div className="space-y-0.5">
                  <Label htmlFor="post-featured" className="text-xs font-bold uppercase tracking-wide cursor-pointer">
                    Featured Post
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Display prominently on the blog home
                  </p>
                </div>
                <Switch
                  id="post-featured"
                  checked={editingPost.featured || false}
                  onCheckedChange={(val) => setEditingPost((prev) => ({ ...prev, featured: val }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-read-time" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Read Time (Minutes)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="post-read-time"
                    type="number"
                    min="1"
                    placeholder="Auto-calculated"
                    value={editingPost.read_time || ""}
                    onChange={(e) =>
                      setEditingPost((prev) => ({
                        ...prev,
                        read_time: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    className="h-10 rounded-xl flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl px-3 border-border/80 hover:bg-muted"
                    onClick={() => {
                      const text = stripHtml(editingPost.content || "");
                      const words = text.split(/\s+/).filter(Boolean).length;
                      const calculated = Math.max(1, Math.ceil(words / 220));
                      setEditingPost((prev) => ({ ...prev, read_time: calculated }));
                      toast.success(`Calculated: ${calculated} min read (${words} words)`);
                    }}
                    title="Estimate read time from word count"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary-hover text-white flex-1 h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="border-border/80 hover:bg-muted h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider border-b border-border/50 pb-2 flex items-center gap-2 text-foreground">
                <Tag className="h-4 w-4 text-primary" />
                Categorization & Cover
              </h3>

              {/* Slug Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-slug" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    URL Slug
                  </Label>
                  {!editingPost.id && (
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-[9px] font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      {autoSlug ? "Manual Edit" : "Auto-Sync"}
                    </button>
                  )}
                </div>
                <Input
                  id="post-slug"
                  placeholder="url-friendly-slug"
                  value={editingPost.slug || ""}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setEditingPost((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                  }}
                  className="h-10 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="post-category" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="post-category"
                  placeholder="e.g. Geotextiles, Case Studies"
                  value={editingPost.category || ""}
                  onChange={(e) => setEditingPost((prev) => ({ ...prev, category: e.target.value }))}
                  className="h-10 rounded-xl"
                />
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.slice(0, 4).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditingPost((prev) => ({ ...prev, category: c }))}
                        className="text-[10px] px-2 py-1 rounded bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all font-semibold"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="post-tags" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Tags (Comma separated)
                </Label>
                <Input
                  id="post-tags"
                  placeholder="installation, specifications, drainage"
                  value={editingPost.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingPost((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="h-10 rounded-xl"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Featured Cover Image
                </Label>
                <ImagePicker
                  value={editingPost.cover_image || ""}
                  onChange={(val) => setEditingPost((prev) => ({ ...prev, cover_image: val }))}
                  label="Cover Image"
                  placeholder="Select or upload cover image..."
                />
              </div>
            </div>

            {/* SEO Settings Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider border-b border-border/50 pb-2 flex items-center gap-2 text-foreground">
                <Search className="h-4 w-4 text-primary" />
                SEO Optimization
              </h3>

              <div className="space-y-2">
                <Label htmlFor="post-meta-title" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Meta Title
                </Label>
                <Input
                  id="post-meta-title"
                  placeholder="Custom browser tab title..."
                  value={editingPost.meta_title || ""}
                  onChange={(e) => setEditingPost((prev) => ({ ...prev, meta_title: e.target.value }))}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-meta-desc" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Meta Description
                </Label>
                <Textarea
                  id="post-meta-desc"
                  placeholder="Custom search snippet description..."
                  value={editingPost.meta_description || ""}
                  onChange={(e) =>
                    setEditingPost((prev) => ({ ...prev, meta_description: e.target.value }))
                  }
                  className="rounded-xl min-h-[70px] resize-y text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 border border-border/30 rounded-2xl p-4">
            <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                <Input
                  placeholder="Search articles by title..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 rounded-xl w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all" className="focus:bg-muted">All Statuses</SelectItem>
                  <SelectItem value="draft" className="focus:bg-muted">Draft</SelectItem>
                  <SelectItem value="published" className="focus:bg-muted">Published</SelectItem>
                  <SelectItem value="archived" className="focus:bg-muted">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 rounded-xl w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all" className="focus:bg-muted">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="focus:bg-muted">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground font-semibold px-1">
              Found {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          <div className="border border-border/60 rounded-2xl overflow-hidden bg-card/45 shadow-sm">
            {loading ? (
              <div className="p-8 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-display font-bold uppercase tracking-wide text-muted-foreground">
                  No articles found
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, status, or category filter, or write a new post.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                      <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground h-11">
                        Title
                      </TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground h-11 w-40">
                        Category
                      </TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground h-11 w-32">
                        Author
                      </TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground h-11 w-36">
                        Published Date
                      </TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground h-11 w-24">
                        Status
                      </TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground h-11 w-24 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => {
                      const pubDate = post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A";

                      const statusColors: Record<BlogPostStatus, string> = {
                        draft: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900/50",
                        published: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/50",
                        archived: "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/30 dark:text-zinc-300 dark:border-zinc-800/50",
                      };

                      return (
                        <TableRow key={post.id} className="hover:bg-muted/15 border-b border-border/40 transition-colors">
                          <TableCell className="align-middle py-3.5">
                            <div className="flex items-center gap-3">
                              {post.cover_image && (
                                <img
                                  src={post.cover_image}
                                  alt=""
                                  className="h-10 w-14 rounded bg-muted object-cover border border-border/50 shrink-0"
                                />
                              )}
                              <div>
                                <span className="font-semibold text-foreground text-sm block line-clamp-1 leading-snug">
                                  {post.title}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                                  /{post.slug}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle py-3.5">
                            <span className="text-xs font-semibold text-muted-foreground bg-muted/40 border border-border/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
                              {post.category}
                            </span>
                          </TableCell>
                          <TableCell className="align-middle py-3.5 text-xs text-muted-foreground font-semibold">
                            {post.author?.full_name || "System Staff"}
                          </TableCell>
                          <TableCell className="align-middle py-3.5 text-xs text-muted-foreground font-semibold">
                            {pubDate}
                          </TableCell>
                          <TableCell className="align-middle py-3.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${statusColors[post.status]}`}>
                              {post.status}
                            </span>
                          </TableCell>
                          <TableCell className="align-middle py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-8.5 w-8.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                                title="View published post"
                              >
                                <a
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(post)}
                                className="h-8.5 w-8.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
                                title="Edit post"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPostToDelete(post)}
                                className="h-8.5 w-8.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={postToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPostToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This will permanently delete the post content, images, and metadata from the site."
        itemName={postToDelete?.title || undefined}
        isLoading={isDeleting}
        idPrefix="delete-blog-post"
      />
    </div>
  );
}
