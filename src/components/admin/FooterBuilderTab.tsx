import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Footprints,
  ArrowUp,
  ArrowDown,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
  Music2,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  SectionHeading,
  FieldLabel,
  StringListEditor,
  ItemCard,
  ItemDeleteButton,
  AddItemButton,
  EmptyState,
  useListEditor,
} from "./TemplateEditorShared";
import {
  type FooterContent,
  type FooterSocialLink,
  type FooterColumn,
  DEFAULT_FOOTER_CONTENT,
} from "@/types/footer";
import { updateFooterCache } from "@/hooks/use-footer-content";
import { LinkTargetPicker } from "./LinkTargetPicker";
import { cn } from "@/lib/utils";

const SUPABASE_KEY = "footer_content";

// ─── Platform helpers ─────────────────────────────────────────────────────────

type SocialPlatform = FooterSocialLink["platform"];

const PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X / Twitter" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
];

const PLATFORM_ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  whatsapp: MessageCircle,
  tiktok: Music2,
};

// ─── Sub-Editors ──────────────────────────────────────────────────────────────

function BrandEditor({
  description,
  address,
  onDescriptionChange,
  onAddressChange,
}: {
  description: string;
  address?: string;
  onDescriptionChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeading>Brand Description &amp; Address</SectionHeading>
      <p className="text-xs text-muted-foreground">
        This description and address appear directly below the logo in the footer.
      </p>
      <div>
        <FieldLabel hint="Maximum ~200 characters recommended for clean formatting">
          Description
        </FieldLabel>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Africa's integrated geosynthetics platform..."
          className="text-sm min-h-[100px] resize-none"
        />
      </div>
      <div>
        <FieldLabel hint="Physical address displayed below brand description">
          Physical Address
        </FieldLabel>
        <Input
          value={address ?? ""}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, South Africa"
          className="text-sm"
        />
      </div>
    </div>
  );
}

function SocialLinksEditor({
  items,
  onChange,
}: {
  items: FooterSocialLink[];
  onChange: (v: FooterSocialLink[]) => void;
}) {
  const { add, remove } = useListEditor<FooterSocialLink>(items, onChange, () => ({
    platform: "linkedin",
    url: "#",
  }));

  const update = (index: number, patch: Partial<FooterSocialLink>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const move = (idx: number, direction: number) => {
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= items.length) return;
    const next = [...items];
    const temp = next[idx];
    next[idx] = next[nextIdx];
    next[nextIdx] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading>Social Media Links</SectionHeading>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage the social media icon buttons displayed beneath the brand description.
          </p>
        </div>
        <AddItemButton onClick={add} label="Add Link" />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No social links configured. Click 'Add Link' to add one." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((link, idx) => {
            const PlatformIcon = PLATFORM_ICONS[link.platform] ?? Linkedin;
            return (
              <ItemCard key={idx} className="relative">
                <ItemDeleteButton onClick={() => remove(idx)} />

                {/* Reorder arrows */}
                <div className="flex items-center gap-1 absolute top-2 right-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 cursor-pointer"
                    disabled={idx === 0}
                    onClick={() => move(idx, -1)}
                    title="Move Up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 cursor-pointer"
                    disabled={idx === items.length - 1}
                    onClick={() => move(idx, 1)}
                    title="Move Down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 pr-16">
                  <PlatformIcon className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {PLATFORM_OPTIONS.find((o) => o.value === link.platform)?.label ??
                      link.platform}
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <FieldLabel>Platform</FieldLabel>
                    <select
                      value={link.platform}
                      onChange={(e) => update(idx, { platform: e.target.value as SocialPlatform })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {PLATFORM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>URL</FieldLabel>
                    <Input
                      value={link.url}
                      onChange={(e) => update(idx, { url: e.target.value })}
                      placeholder="https://linkedin.com/company/..."
                      className="text-sm"
                    />
                  </div>
                </div>
              </ItemCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CopyrightEditor({
  copyrightText,
  onChange,
}: {
  copyrightText: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeading>Copyright &amp; Meta</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize the copyright line at the very bottom of the footer. Use{" "}
        <code className="text-[10px] bg-muted px-1 py-0.5 rounded">{"{{year}}"}</code> to
        dynamically insert the current year.
      </p>
      <div>
        <FieldLabel hint="Example: © {{year}} Geosynthetics Africa (Pty) Ltd. All Rights Reserved.">
          Copyright Text
        </FieldLabel>
        <Textarea
          value={copyrightText}
          onChange={(e) => onChange(e.target.value)}
          placeholder="© {{year}} Geosynthetics Africa (Pty) Ltd. All Rights Reserved."
          className="text-sm min-h-[72px] resize-none"
        />
      </div>
    </div>
  );
}

function CollapsibleCard({
  index,
  title,
  onRemove,
  children,
}: {
  index: number;
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none",
          open ? "bg-accent/60" : "bg-surface/30 hover:bg-accent/30",
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="flex-1 text-xs font-semibold truncate">
          {index + 1}. {title || "Untitled Column"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="h-6 w-6 rounded flex items-center justify-center text-destructive hover:bg-destructive/10 shrink-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {open && <div className="p-4 space-y-3 bg-card">{children}</div>}
    </div>
  );
}

function NavigationColumnsEditor({
  columns,
  onChange,
}: {
  columns: FooterColumn[];
  onChange: (v: FooterColumn[]) => void;
}) {
  const addColumn = () => {
    onChange([
      ...columns,
      {
        id: `col-${Date.now()}`,
        title: "",
        type: "custom",
        links: [],
      },
    ]);
  };

  const removeColumn = (idx: number) => {
    onChange(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, patch: Partial<FooterColumn>) => {
    const next = [...columns];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const moveColumn = (idx: number, direction: number) => {
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= columns.length) return;
    const next = [...columns];
    const temp = next[idx];
    next[idx] = next[nextIdx];
    next[nextIdx] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading>Navigation Columns</SectionHeading>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage the custom and dynamic link columns shown in the website footer.
          </p>
        </div>
        <Button
          onClick={addColumn}
          className="bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-bold uppercase tracking-wide text-xs h-8 gap-1.5"
        >
          <Plus className="h-3 w-3" /> Add Column
        </Button>
      </div>

      {columns.length === 0 ? (
        <EmptyState message="No navigation columns configured. Click 'Add Column' to add one." />
      ) : (
        <div className="space-y-4">
          {columns.map((col, idx) => (
            <CollapsibleCard
              key={col.id}
              index={idx}
              title={`${col.title || "Untitled Column"} (${col.type === "custom" ? "Custom Links" : "Dynamic Menu"})`}
              onRemove={() => removeColumn(idx)}
            >
              {/* Column order controls */}
              <div className="flex items-center gap-1 mb-3 justify-end border-b border-border/40 pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 cursor-pointer"
                  disabled={idx === 0}
                  onClick={() => moveColumn(idx, -1)}
                  title="Move Left"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 cursor-pointer"
                  disabled={idx === columns.length - 1}
                  onClick={() => moveColumn(idx, 1)}
                  title="Move Right"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Column Title</FieldLabel>
                  <Input
                    value={col.title}
                    onChange={(e) => updateColumn(idx, { title: e.target.value })}
                    placeholder="Column Title"
                    className="text-sm"
                  />
                </div>
                <div>
                  <FieldLabel>Column Type</FieldLabel>
                  <select
                    value={col.type}
                    onChange={(e) =>
                      updateColumn(idx, {
                        type: e.target.value as FooterColumn["type"],
                        links: e.target.value === "custom" ? col.links || [] : undefined,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="custom">Custom Links</option>
                    <option value="products">Dynamic Products Menu</option>
                    <option value="applications">Dynamic Applications Menu</option>
                    <option value="services">Dynamic Services Menu</option>
                    <option value="industries">Dynamic Industries Menu</option>
                  </select>
                </div>
              </div>

              {col.type === "custom" && (
                <div className="mt-4 border-t border-border/40 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Links in Column</FieldLabel>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const links = [...(col.links || [])];
                        links.push({ label: "", to: "/" });
                        updateColumn(idx, { links });
                      }}
                      className="h-6 text-[10px] uppercase font-bold tracking-wider"
                    >
                      Add Link
                    </Button>
                  </div>

                  {(col.links || []).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No links added yet. Click "Add Link" above.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {(col.links || []).map((link, lIdx) => (
                        <div
                          key={lIdx}
                          className="flex items-start gap-3 bg-surface/20 p-3 rounded-lg border border-border/30 relative group"
                        >
                          <div className="flex-1 grid grid-cols-2 gap-3 pr-8">
                            <div>
                              <FieldLabel>Label</FieldLabel>
                              <Input
                                value={link.label}
                                onChange={(e) => {
                                  const links = [...(col.links || [])];
                                  links[lIdx] = { ...links[lIdx], label: e.target.value };
                                  updateColumn(idx, { links });
                                }}
                                placeholder="e.g. About Us"
                                className="text-sm h-8"
                              />
                            </div>
                            <div>
                              <LinkTargetPicker
                                to={link.to}
                                params={link.params}
                                onChange={(to, params) => {
                                  const links = [...(col.links || [])];
                                  links[lIdx] = { ...links[lIdx], to, params };
                                  updateColumn(idx, { links });
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const links = (col.links || []).filter((_, i) => i !== lIdx);
                                updateColumn(idx, { links });
                              }}
                              className="h-6 w-6 rounded flex items-center justify-center text-destructive hover:bg-destructive/10"
                              title="Delete Link"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                disabled={lIdx === 0}
                                onClick={() => {
                                  const links = [...(col.links || [])];
                                  const temp = links[lIdx];
                                  links[lIdx] = links[lIdx - 1];
                                  links[lIdx - 1] = temp;
                                  updateColumn(idx, { links });
                                }}
                                title="Move Link Up"
                              >
                                <ArrowUp className="h-2.5 w-2.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                disabled={lIdx === (col.links || []).length - 1}
                                onClick={() => {
                                  const links = [...(col.links || [])];
                                  const temp = links[lIdx];
                                  links[lIdx] = links[lIdx + 1];
                                  links[lIdx + 1] = temp;
                                  updateColumn(idx, { links });
                                }}
                                title="Move Link Down"
                              >
                                <ArrowDown className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CollapsibleCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

let footerContentCache: FooterContent | null = null;

const TABS = [
  { id: "brand", label: "Brand Details" },
  { id: "social", label: "Social Links" },
  { id: "columns", label: "Navigation Columns" },
  { id: "certifications", label: "Certifications" },
  { id: "copyright", label: "Copyright & Meta" },
];

export function FooterBuilderTab() {
  const [content, setContent] = useState<FooterContent>(() => {
    return footerContentCache ?? DEFAULT_FOOTER_CONTENT;
  });
  const [loading, setLoading] = useState(!footerContentCache);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("brand");

  const load = useCallback(async () => {
    if (!footerContentCache) {
      setLoading(true);
    }
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load footer content: " + error.message);
    } else if (data?.value) {
      const val = data.value as unknown as Partial<FooterContent>;
      const merged: FooterContent = {
        brandDescription: val.brandDescription ?? DEFAULT_FOOTER_CONTENT.brandDescription,
        address: val.address ?? DEFAULT_FOOTER_CONTENT.address,
        socialLinks: val.socialLinks ?? DEFAULT_FOOTER_CONTENT.socialLinks,
        certifications: val.certifications ?? DEFAULT_FOOTER_CONTENT.certifications,
        copyrightText: val.copyrightText ?? DEFAULT_FOOTER_CONTENT.copyrightText,
        columns: val.columns ?? DEFAULT_FOOTER_CONTENT.columns,
      };
      setContent(merged);
      footerContentCache = merged;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert(
        { key: SUPABASE_KEY, value: content as unknown as Record<string, unknown> },
        { onConflict: "key" },
      );

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Footer content saved successfully!");
      setDirty(false);
      footerContentCache = content;
      updateFooterCache(content);
    }
    setSaving(false);
  };

  const update = (patch: Partial<FooterContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      footerContentCache = next;
      return next;
    });
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin animate-infinite" />
        <span className="text-sm font-medium">Loading footer builder…</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sticky Sub-Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-surface/30">
        <div className="flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wide">Footer Content</span>
          {dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
              <AlertTriangle className="h-2.5 w-2.5" /> Unsaved
            </span>
          )}
          {!dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              <CheckCircle2 className="h-2.5 w-2.5" /> Saved
            </span>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-bold uppercase tracking-wide text-xs h-8 gap-1.5"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          {saving ? "Updating..." : "Save Footer"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-4 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="brand" className="p-6 m-0">
            <BrandEditor
              description={content.brandDescription}
              address={content.address}
              onDescriptionChange={(v) => update({ brandDescription: v })}
              onAddressChange={(v) => update({ address: v })}
            />
          </TabsContent>

          <TabsContent value="social" className="p-6 m-0">
            <SocialLinksEditor
              items={content.socialLinks}
              onChange={(v) => update({ socialLinks: v })}
            />
          </TabsContent>

          <TabsContent value="columns" className="p-6 m-0">
            <NavigationColumnsEditor
              columns={content.columns || []}
              onChange={(v) => update({ columns: v })}
            />
          </TabsContent>

          <TabsContent value="certifications" className="p-6 m-0">
            <SectionHeading>Certification Badges</SectionHeading>
            <p className="text-xs text-muted-foreground mb-4">
              These certification labels appear in the bottom bar of the footer, separated by
              vertical dividers.
            </p>
            <StringListEditor
              label="Certifications"
              hint="Each entry becomes a bottom-bar badge (e.g. 'IAGI Member - One of only 5 in Africa')"
              items={content.certifications}
              onChange={(v) => update({ certifications: v })}
              placeholder="Add certification"
            />
          </TabsContent>

          <TabsContent value="copyright" className="p-6 m-0">
            <CopyrightEditor
              copyrightText={content.copyrightText}
              onChange={(v) => update({ copyrightText: v })}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
