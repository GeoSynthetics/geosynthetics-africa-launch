import { useEffect, useState, useTransition } from "react";
import { Link } from "@tanstack/react-router";
import {
  Inbox,
  Package,
  FileText,
  Users,
  LayoutList,
  Image,
  BookOpen,
  LayoutTemplate,
  Search,
  Cookie,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Sparkles,
  FilePlus,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatusKey = "new" | "in_review" | "quoted" | "won" | "lost" | "archived";

interface QuoteItem {
  id: string;
  created_at: string;
  contact_name: string;
  contact_email: string;
  company: string | null;
  status: StatusKey | string;
}

interface ProductCategoryCount {
  categoryName: string;
  count: number;
  color: string;
}

interface ProductHealthStats {
  withDatasheet: number;
  missingDatasheet: number;
  activeCount: number;
  inactiveCount: number;
  total: number;
}

interface DashboardStats {
  quotesTotal: number;
  quotesNew: number;
  quotesInReview: number;
  productsTotal: number;
  resourcesTotal: number;
  blogTotal: number;
  usersTotal: number;
  recentQuotes: QuoteItem[];
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  monthlyTrend: Array<{ month: string; inquiries: number; converted: number }>;
  categoryDistribution: ProductCategoryCount[];
  productHealth: ProductHealthStats;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#ea580c", // Orange
  in_review: "#0284c7", // Sky Blue
  quoted: "#8b5cf6", // Purple
  won: "#10b981", // Emerald
  lost: "#f43f5e", // Rose
  archived: "#64748b", // Slate
};

const CATEGORY_PALETTE = [
  "#0284c7", // Sky Blue
  "#ea580c", // Orange
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
];

const TILES = [
  {
    icon: Inbox,
    label: "Quote Requests",
    desc: "Incoming BOQs and customer lead enquiries.",
    to: "/admin/quotes" as const,
    table: "quote_requests",
    badge: "Leads",
  },
  {
    icon: Package,
    label: "Products",
    desc: "Manage geotextiles, geomembranes & specs.",
    to: "/admin/products" as const,
    table: "products",
    badge: "Catalogue",
  },
  {
    icon: FileText,
    label: "Resources",
    desc: "Technical datasheets, brochures & case studies.",
    to: "/admin/resources" as const,
    table: "resources",
    badge: "Docs",
  },
  {
    icon: BookOpen,
    label: "Blog Posts",
    desc: "Publish industry articles & company news.",
    to: "/admin/blog" as const,
    table: "blog_posts",
    badge: "Content",
  },
  {
    icon: LayoutTemplate,
    label: "Site Builder",
    desc: "Customize hero, footer & main page content.",
    to: "/admin/site-builder" as const,
    badge: "CMS",
  },
  {
    icon: LayoutList,
    label: "Page Templates",
    desc: "Configure product & service template pages.",
    to: "/admin/page-templates" as const,
    badge: "Layouts",
  },
  {
    icon: Image,
    label: "Media Center",
    desc: "Upload images, store assets, & retrieve URLs.",
    to: "/admin/media-center" as const,
    badge: "Vault",
  },
  {
    icon: Search,
    label: "Pages SEO",
    desc: "Optimize meta titles, descriptions & OpenGraph.",
    to: "/admin/pages-seo" as const,
    badge: "SEO",
  },
  {
    icon: Cookie,
    label: "Tracking & Analytics",
    desc: "Configure tracking pixels & consent banners.",
    to: "/admin/tracking" as const,
    badge: "Config",
  },
  {
    icon: Users,
    label: "Users & Roles",
    desc: "Manage staff permissions & admin access.",
    to: "/admin/users" as const,
    table: "profiles",
    badge: "Auth",
  },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch counts & product metadata in parallel
      const [
        { count: quotesCount },
        { count: productsCount },
        { count: resourcesCount },
        { count: blogCount },
        { count: usersCount },
        { data: rawProducts },
        { data: rawCategories },
      ] = await Promise.all([
        supabase.from("quote_requests").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("id, name, category_id, datasheet_url, is_active, family_slug"),
        supabase.from("product_categories").select("id, name"),
      ]);

      // 2. Fetch quote requests
      const { data: allQuotes } = await supabase
        .from("quote_requests")
        .select("id, created_at, contact_name, contact_email, company, status")
        .order("created_at", { ascending: false });

      const quotesList: QuoteItem[] = allQuotes || [];

      // Calculate status breakdown
      const statusCounts: Record<string, number> = {
        new: 0,
        in_review: 0,
        quoted: 0,
        won: 0,
        lost: 0,
        archived: 0,
      };

      quotesList.forEach((q) => {
        const s = (q.status || "new").toLowerCase();
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      });

      const statusDistribution = [
        { name: "New", value: statusCounts.new, color: STATUS_COLORS.new },
        { name: "In Review", value: statusCounts.in_review, color: STATUS_COLORS.in_review },
        { name: "Quoted", value: statusCounts.quoted, color: STATUS_COLORS.quoted },
        { name: "Won", value: statusCounts.won, color: STATUS_COLORS.won },
        { name: "Lost", value: statusCounts.lost, color: STATUS_COLORS.lost },
        { name: "Archived", value: statusCounts.archived, color: STATUS_COLORS.archived },
      ].filter((item) => item.value > 0 || quotesList.length === 0);

      // 3. Process Product Catalogue Category Breakdown & Health
      const categoryMap = new Map<string, string>();
      (rawCategories || []).forEach((c) => {
        if (c.id && c.name) categoryMap.set(c.id, c.name);
      });

      const catCountsMap = new Map<string, number>();
      let withDatasheet = 0;
      let missingDatasheet = 0;
      let activeCount = 0;
      let inactiveCount = 0;

      (rawProducts || []).forEach((p) => {
        // Category resolution
        let catName = "Uncategorized";
        if (p.category_id && categoryMap.has(p.category_id)) {
          catName = categoryMap.get(p.category_id)!;
        } else if (p.family_slug) {
          catName = p.family_slug.replace(/-/g, " ").toUpperCase();
        }
        catCountsMap.set(catName, (catCountsMap.get(catName) || 0) + 1);

        // Datasheet check
        if (p.datasheet_url && p.datasheet_url.trim() !== "") {
          withDatasheet += 1;
        } else {
          missingDatasheet += 1;
        }

        // Active status check
        if (p.is_active !== false) {
          activeCount += 1;
        } else {
          inactiveCount += 1;
        }
      });

      const categoryDistribution: ProductCategoryCount[] = Array.from(catCountsMap.entries())
        .map(([categoryName, count], idx) => ({
          categoryName,
          count,
          color: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length],
        }))
        .sort((a, b) => b.count - a.count);

      // Aggregate monthly trends for recent 6 months
      const monthMap = new Map<string, { inquiries: number; converted: number }>();
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        monthMap.set(label, { inquiries: 0, converted: 0 });
      }

      quotesList.forEach((q) => {
        if (!q.created_at) return;
        const d = new Date(q.created_at);
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        if (monthMap.has(label)) {
          const curr = monthMap.get(label)!;
          curr.inquiries += 1;
          if (q.status === "won" || q.status === "quoted") {
            curr.converted += 1;
          }
        }
      });

      const monthlyTrend = Array.from(monthMap.entries()).map(([month, data]) => ({
        month,
        inquiries: data.inquiries,
        converted: data.converted,
      }));

      setStats({
        quotesTotal: quotesCount ?? 0,
        quotesNew: statusCounts.new,
        quotesInReview: statusCounts.in_review,
        productsTotal: productsCount ?? 0,
        resourcesTotal: resourcesCount ?? 0,
        blogTotal: blogCount ?? 0,
        usersTotal: usersCount ?? 0,
        recentQuotes: quotesList.slice(0, 5),
        statusDistribution:
          statusDistribution.length > 0
            ? statusDistribution
            : [{ name: "No Quotes Yet", value: 1, color: "#94a3b8" }],
        monthlyTrend,
        categoryDistribution,
        productHealth: {
          withDatasheet,
          missingDatasheet,
          activeCount,
          inactiveCount,
          total: rawProducts?.length || 0,
        },
      });
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to load admin dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    startTransition(() => {
      fetchDashboardData();
    });
  };

  const datasheetPieData = stats?.productHealth
    ? [
        { name: "Datasheet Included", value: stats.productHealth.withDatasheet, color: "#10b981" },
        { name: "Missing Datasheet", value: stats.productHealth.missingDatasheet, color: "#f59e0b" },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Control Panel Overview
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time analytics, catalogue product charts, inquiry trends, and site management shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-muted-foreground block uppercase font-mono">
              Last updated
            </span>
            <span className="text-xs font-semibold text-foreground font-mono">
              {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || isPending}
            className="h-9 px-3 gap-2 rounded-xl text-xs font-semibold border-border/60 hover:border-primary/50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading || isPending ? "animate-spin text-primary" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 1. Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quote Inquiries KPI */}
        <Card className="relative overflow-hidden border-border/50 bg-card hover:border-primary/40 transition-all shadow-sm group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Inquiry Pipeline
            </CardTitle>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <Inbox className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <div className="flex items-baseline justify-between mt-1">
                <div className="font-display text-2xl font-black text-foreground">
                  {stats?.quotesTotal ?? 0}
                </div>
                {stats?.quotesNew ? (
                  <Badge variant="destructive" className="animate-bounce text-[10px] px-2 py-0.5 font-bold">
                    {stats.quotesNew} New
                  </Badge>
                ) : (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Up to date
                  </span>
                )}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
              <span>Review BOQ requests</span>
              <Link to="/admin/quotes" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                View <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Product Catalogue KPI */}
        <Card className="relative overflow-hidden border-border/50 bg-card hover:border-primary/40 transition-all shadow-sm group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Products
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <div className="flex items-baseline justify-between mt-1">
                <div className="font-display text-2xl font-black text-foreground">
                  {stats?.productsTotal ?? 0}
                </div>
                <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 font-semibold">
                  Catalogue
                </Badge>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
              <span>Geotextiles & Geomembranes</span>
              <Link to="/admin/products" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                Manage <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Technical Resources KPI */}
        <Card className="relative overflow-hidden border-border/50 bg-card hover:border-primary/40 transition-all shadow-sm group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Resources & Specs
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <div className="flex items-baseline justify-between mt-1">
                <div className="font-display text-2xl font-black text-foreground">
                  {stats?.resourcesTotal ?? 0}
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 font-semibold">
                  Datasheets
                </Badge>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
              <span>Brochures & Case Studies</span>
              <Link to="/admin/resources" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                Manage <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Blog & Articles KPI */}
        <Card className="relative overflow-hidden border-border/50 bg-card hover:border-primary/40 transition-all shadow-sm group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Published Content
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <div className="flex items-baseline justify-between mt-1">
                <div className="font-display text-2xl font-black text-foreground">
                  {stats?.blogTotal ?? 0}
                </div>
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 font-semibold">
                  Blog Posts
                </Badge>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
              <span>Industry Insights</span>
              <Link to="/admin/blog" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                Write <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. DEDICATED CATALOGUE PRODUCTS ANALYTICS SECTION */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
              Catalogue Products Analytics
            </h2>
          </div>
          <Link
            to="/admin/products"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            Manage Products <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart: Products by Category */}
          <Card className="lg:col-span-2 border-border/50 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-bold uppercase tracking-wide text-foreground flex items-center justify-between">
                <span>Products by Category Breakdown</span>
                <Badge variant="outline" className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-600 border-blue-200">
                  {stats?.productsTotal ?? 0} Products Total
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Distribution of geosynthetic product lines across categories.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-[250px] w-full rounded-xl" />
              ) : !stats?.categoryDistribution || stats.categoryDistribution.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-xs text-muted-foreground">
                  No product categories configured yet.
                </div>
              ) : (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.categoryDistribution}
                      margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="categoryName"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "currentColor" }}
                        className="text-muted-foreground"
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "currentColor" }}
                        className="text-muted-foreground"
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card, #ffffff)",
                          borderColor: "var(--border, rgba(0,0,0,0.1))",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" name="Products" radius={[6, 6, 0, 0]}>
                        {stats.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donut Chart: Technical Datasheets & Health */}
          <Card className="border-border/50 bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                Datasheet Coverage
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Products with technical datasheets attached.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-center items-center">
              {loading ? (
                <Skeleton className="h-[180px] w-[180px] rounded-full" />
              ) : (
                <div className="relative w-full h-[180px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datasheetPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {datasheetPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card, #ffffff)",
                          borderColor: "var(--border, rgba(0,0,0,0.1))",
                          borderRadius: "0.5rem",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="font-display text-2xl font-black text-foreground">
                      {stats?.productHealth?.withDatasheet ?? 0}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      With Datasheet
                    </span>
                  </div>
                </div>
              )}

              {/* Stats Summary Legend */}
              <div className="w-full space-y-2 mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    Complete Datasheet
                  </span>
                  <span className="font-bold text-foreground">
                    {stats?.productHealth?.withDatasheet ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Missing Datasheet
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {stats?.productHealth?.missingDatasheet ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Inquiry Trend & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Inquiry Trend */}
        <Card className="lg:col-span-2 border-border/50 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="font-display text-base font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Inquiry & Lead Trend
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Monthly breakdown of incoming BOQ quote requests vs converted leads.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono uppercase">
              6-Month Window
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-[240px] w-full rounded-xl" />
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats?.monthlyTrend || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-muted-foreground"
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card, #ffffff)",
                        borderColor: "var(--border, rgba(0,0,0,0.1))",
                        borderRadius: "0.75rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="inquiries"
                      name="Total Inquiries"
                      stroke="#ea580c"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorInquiries)"
                    />
                    <Area
                      type="monotone"
                      dataKey="converted"
                      name="Quoted / Won"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorConverted)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Donut Chart: Quote Pipeline Status */}
        <Card className="border-border/50 bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-purple-600" />
              Quote Pipeline Status
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Live breakdown of quote requests by stage.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col justify-center items-center">
            {loading ? (
              <Skeleton className="h-[180px] w-[180px] rounded-full" />
            ) : (
              <div className="relative w-full h-[180px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats?.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card, #ffffff)",
                        borderColor: "var(--border, rgba(0,0,0,0.1))",
                        borderRadius: "0.5rem",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-display text-2xl font-black text-foreground">
                    {stats?.quotesTotal ?? 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Total BOQs
                  </span>
                </div>
              </div>
            )}

            {/* Custom Legend */}
            <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50">
              {stats?.statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="font-bold text-foreground ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Quick Actions Toolbar */}
      <Card className="border-border/50 bg-card shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Admin Shortcuts
          </h2>
          <span className="text-xs text-muted-foreground">High-frequency workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <Button
            asChild
            variant="outline"
            className="h-auto py-3 px-3 flex flex-col items-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 rounded-xl transition"
          >
            <Link to="/admin/quotes">
              <Inbox className="h-5 w-5 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-tight text-foreground">
                Quotes ({stats?.quotesNew ?? 0})
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3 px-3 flex flex-col items-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 rounded-xl transition"
          >
            <Link to="/admin/products">
              <Package className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-tight text-foreground">
                Products ({stats?.productsTotal ?? 0})
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3 px-3 flex flex-col items-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 rounded-xl transition"
          >
            <Link to="/admin/resources">
              <FilePlus className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-tight text-foreground">
                Resources
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3 px-3 flex flex-col items-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 rounded-xl transition"
          >
            <Link to="/admin/blog">
              <PlusCircle className="h-5 w-5 text-purple-500" />
              <span className="text-xs font-bold uppercase tracking-tight text-foreground">
                Write Article
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3 px-3 flex flex-col items-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 rounded-xl transition"
          >
            <Link to="/admin/site-builder">
              <LayoutTemplate className="h-5 w-5 text-cyan-500" />
              <span className="text-xs font-bold uppercase tracking-tight text-foreground">
                Site Content
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3 px-3 flex flex-col items-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 rounded-xl transition"
          >
            <Link to="/admin/pages-seo">
              <Search className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-tight text-foreground">
                Pages SEO
              </span>
            </Link>
          </Button>
        </div>
      </Card>

      {/* 5. Recent Quote Requests Stream */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="font-display text-base font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent BOQ Quote Requests
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Latest enquiries received from clients across Africa.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-primary hover:text-primary font-bold">
            <Link to="/admin/quotes" className="flex items-center gap-1">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !stats?.recentQuotes || stats.recentQuotes.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              No quote requests submitted yet.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-[11px] font-bold uppercase">Contact</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase">Company</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase">Date</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase">Status</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentQuotes.map((q) => (
                  <TableRow key={q.id} className="hover:bg-muted/30 transition">
                    <TableCell className="font-medium text-xs">
                      <div>{q.contact_name}</div>
                      <div className="text-[10px] text-muted-foreground">{q.contact_email}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {q.company || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {q.created_at ? new Date(q.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-bold px-2 py-0.5"
                        style={{
                          borderColor: STATUS_COLORS[q.status] || STATUS_COLORS.new,
                          color: STATUS_COLORS[q.status] || STATUS_COLORS.new,
                          backgroundColor: `${STATUS_COLORS[q.status] || STATUS_COLORS.new}15`,
                        }}
                      >
                        {q.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" className="h-7 text-[11px] px-2.5 font-semibold">
                        <Link to="/admin/quotes">Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 6. Control Panel Module Grid */}
      <div>
        <h2 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <LayoutList className="h-4.5 w-4.5 text-primary" />
          Management Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TILES.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase px-2 py-0.5 bg-muted/60">
                    {t.badge}
                  </Badge>
                </div>
                <div className="mt-4 font-display text-base font-bold uppercase group-hover:text-primary transition-colors">
                  {t.label}
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-semibold group-hover:text-primary transition-colors">
                <span>Access Module</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
