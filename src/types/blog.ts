export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogPostAuthor {
  id: string;
  full_name: string | null;
  email: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  tags: string[];
  read_time: number | null;
  status: BlogPostStatus;
  featured: boolean;
  author_id: string | null;
  author?: BlogPostAuthor | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category: string;
  tags?: string[];
  read_time?: number | null;
  status?: BlogPostStatus;
  featured?: boolean;
  author_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
}
export const DEFAULT_BLOG_AUTHOR = "Geosynthetics Africa";

export function getBlogPostAuthorName(author?: BlogPostAuthor | null): string {
  const name = author?.full_name?.trim();
  if (!name || name === "Developer" || name === "System Staff") {
    return DEFAULT_BLOG_AUTHOR;
  }
  return name;
}
