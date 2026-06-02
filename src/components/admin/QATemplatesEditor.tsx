import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  GripVertical,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  FileText,
  List,
  MessageSquare,
  Table,
} from "lucide-react";
import { toast } from "sonner";
import { cn, slugify } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type QAStatus = "published" | "draft" | "archived";

type ContentSection = {
  type: "text" | "checklist" | "numbered" | "callout" | "table";
  heading: string;
  body?: string;
  items?: string[] | Array<{ title: string; desc: string }>;
  headers?: string[];
  rows?: string[][];
};

type Stat = { label: string; value: string };
type Pillar = { icon: string; title: string; desc: string };

interface QADocument {
  id: string;
  slug: string;
  category_name: string;
  short_description: string | null;
  hero_image_url: string | null;
  eyebrow: string | null;
  hero_title: string | null;
  hero_body: string | null;
  content_sections: ContentSection[];
  stats: Stat[];
  industries_served: string[];
  key_pillars: Pillar[];
  cta_label: string | null;
  sort_order: number;
  status: QAStatus;
  created_at: string;
}

const ICON_OPTIONS = [
  { value: "ShieldCheck", label: "Shield Check" },
  { value: "FileCheck", label: "File Check" },
  { value: "Microscope", label: "Microscope" },
  { value: "BadgeCheck", label: "Badge Check" },
  { value: "Wrench", label: "Wrench" },
  { value: "Award", label: "Award" },
];

const SECTION_TYPES = [
  { value: "text", label: "Text Block", icon: FileText, hint: "A heading with a paragraph of body text." },
  { value: "checklist", label: "Checklist", icon: CheckCircle, hint: "A bulleted list of items with checkmarks." },
  { value: "numbered", label: "Numbered Steps", icon: List, hint: "A numbered list with title + description per item." },
  { value: "callout", label: "Callout Box", icon: MessageSquare, hint: "A dark highlighted callout panel with heading + body." },
  { value: "table", label: "Data Table", icon: Table, hint: "A table with custom column headers and rows." },
];



const makeEmpty = (): Partial<QADocument> => ({
  slug: "",
  category_name: "",
  short_description: "",
  hero_image_url: "",
  eyebrow: "IAGI-Aligned",
  hero_title: "",
  hero_body: "",
  content_sections: [],
  stats: [],
  industries_served: [],
  key_pillars: [],
  cta_label: "Request QA Documentation",
  sort_order: 0,
  status: "published",
});

// ─── Reusable editor sub-components ──────────────────────────────────────────

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1">
      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{children}</label>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}

function TagsInput({
  label,
  hint,
  tags,
  onChange,
  placeholder = "Type and press Enter",
}: {
  label: string;
  hint?: string;
  tags: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const addTag = () => {
    const val = input.trim();
    if (!val || tags.includes(val)) return;
    onChange([...tags, val]);
    setInput("");
  };
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
        {tags.map((t) => (
          <Badge key={t} variant="secondary" className="text-[10px] gap-1 pr-1">
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-destructive ml-0.5">×</button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="text-sm h-8 flex-1"
        />
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={addTag}>Add</Button>
      </div>
    </div>
  );
}

function PillarsEditor({
  pillars,
  onChange,
}: {
  pillars: Pillar[];
  onChange: (v: Pillar[]) => void;
}) {
  const add = () => onChange([...pillars, { icon: "ShieldCheck", title: "", desc: "" }]);
  const update = (i: number, key: keyof Pillar, val: string) => {
    const n = [...pillars]; n[i] = { ...n[i], [key]: val }; onChange(n);
  };
  const remove = (i: number) => onChange(pillars.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel hint="Icon cards shown in the hero and sidebar. Keep to 4 pillars max.">Key Pillars</FieldLabel>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary gap-1">
          <Plus className="h-3 w-3" /> Add Pillar
        </Button>
      </div>
      {pillars.map((pillar, i) => (
        <div key={i} className="border border-border rounded-md p-3 bg-surface/40 relative space-y-2">
          <Button
            variant="ghost" size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
            onClick={() => remove(i)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Icon</label>
              <Select value={pillar.icon} onValueChange={(v) => update(i, "icon", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Title</label>
              <Input value={pillar.title} onChange={(e) => update(i, "title", e.target.value)} className="h-8 text-xs" placeholder="e.g. Material Verification" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Description</label>
            <Textarea value={pillar.desc} onChange={(e) => update(i, "desc", e.target.value)} className="text-xs min-h-[50px] resize-none" placeholder="Short description for this pillar..." />
          </div>
        </div>
      ))}
      {pillars.length === 0 && <p className="text-xs text-muted-foreground italic px-1">No pillars yet — click Add Pillar.</p>}
    </div>
  );
}

function StatsEditor({
  stats,
  onChange,
}: {
  stats: Stat[];
  onChange: (v: Stat[]) => void;
}) {
  const add = () => onChange([...stats, { label: "", value: "" }]);
  const update = (i: number, key: keyof Stat, val: string) => {
    const n = [...stats]; n[i] = { ...n[i], [key]: val }; onChange(n);
  };
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint="Shown in the sidebar stats card and the bottom stats band.">Stats / Metrics</FieldLabel>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary gap-1">
          <Plus className="h-3 w-3" /> Add Stat
        </Button>
      </div>
      {stats.map((stat, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Input value={stat.value} onChange={(e) => update(i, "value", e.target.value)} className="text-sm h-8" placeholder="e.g. 100%" />
          <Input value={stat.label} onChange={(e) => update(i, "label", e.target.value)} className="text-sm h-8" placeholder="e.g. Welds Tested" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove(i)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {stats.length === 0 && <p className="text-xs text-muted-foreground italic px-1">No stats yet — click Add Stat.</p>}
    </div>
  );
}

function ContentSectionsEditor({
  sections,
  onChange,
}: {
  sections: ContentSection[];
  onChange: (v: ContentSection[]) => void;
}) {
  const addSection = (type: ContentSection["type"]) => {
    const base: ContentSection = {
      type,
      heading: "",
      ...(type === "text" || type === "callout" ? { body: "" } : {}),
      ...(type === "checklist" ? { items: [] as string[] } : {}),
      ...(type === "numbered" ? { items: [] as Array<{ title: string; desc: string }> } : {}),
      ...(type === "table" ? { headers: ["Column 1", "Column 2"], rows: [] } : {}),
    };
    onChange([...sections, base]);
  };

  const update = (i: number, patch: Partial<ContentSection>) => {
    const n = [...sections]; n[i] = { ...n[i], ...patch }; onChange(n);
  };
  const remove = (i: number) => onChange(sections.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const n = [...sections];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  // Checklist string item helpers
  const addCheckItem = (sIdx: number) => {
    const items = [...((sections[sIdx].items as string[]) || []), ""];
    update(sIdx, { items });
  };
  const updateCheckItem = (sIdx: number, iIdx: number, val: string) => {
    const items = [...(sections[sIdx].items as string[])]; items[iIdx] = val;
    update(sIdx, { items });
  };
  const removeCheckItem = (sIdx: number, iIdx: number) => {
    const items = (sections[sIdx].items as string[]).filter((_, idx) => idx !== iIdx);
    update(sIdx, { items });
  };

  // Numbered item helpers
  const addNumberedItem = (sIdx: number) => {
    const items = [...((sections[sIdx].items as Array<{ title: string; desc: string }>) || []), { title: "", desc: "" }];
    update(sIdx, { items });
  };
  const updateNumberedItem = (sIdx: number, iIdx: number, key: "title" | "desc", val: string) => {
    const items = [...(sections[sIdx].items as Array<{ title: string; desc: string }>)];
    items[iIdx] = { ...items[iIdx], [key]: val };
    update(sIdx, { items });
  };
  const removeNumberedItem = (sIdx: number, iIdx: number) => {
    const items = (sections[sIdx].items as Array<{ title: string; desc: string }>).filter((_, idx) => idx !== iIdx);
    update(sIdx, { items });
  };

  // Table helpers
  const addTableRow = (sIdx: number) => {
    const s = sections[sIdx];
    const rows = [...(s.rows || []), Array((s.headers || []).length).fill("")];
    update(sIdx, { rows });
  };
  const addTableCol = (sIdx: number) => {
    const s = sections[sIdx];
    update(sIdx, {
      headers: [...(s.headers || []), "New Col"],
      rows: (s.rows || []).map((r) => [...r, ""]),
    });
  };
  const updateTableHeader = (sIdx: number, j: number, val: string) => {
    const headers = [...(sections[sIdx].headers || [])]; headers[j] = val;
    update(sIdx, { headers });
  };
  const updateTableCell = (sIdx: number, i: number, j: number, val: string) => {
    const rows = (sections[sIdx].rows || []).map((row, ri) =>
      ri === i ? row.map((cell, ci) => (ci === j ? val : cell)) : row
    );
    update(sIdx, { rows });
  };
  const removeTableRow = (sIdx: number, i: number) => {
    update(sIdx, { rows: (sections[sIdx].rows || []).filter((_, idx) => idx !== i) });
  };
  const removeTableCol = (sIdx: number, j: number) => {
    update(sIdx, {
      headers: (sections[sIdx].headers || []).filter((_, idx) => idx !== j),
      rows: (sections[sIdx].rows || []).map((r) => r.filter((_, idx) => idx !== j)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FieldLabel hint="These are the rich content blocks rendered on the public QA detail page.">Content Sections</FieldLabel>
        <div className="flex flex-wrap gap-1">
          {SECTION_TYPES.map((st) => (
            <Button
              key={st.value}
              variant="outline"
              size="sm"
              onClick={() => addSection(st.value as ContentSection["type"])}
              className="h-6 text-[10px] gap-1 cursor-pointer"
              title={st.hint}
            >
              <Plus className="h-2.5 w-2.5" /> {st.label}
            </Button>
          ))}
        </div>
      </div>

      {sections.map((section, sIdx) => {
        const typeMeta = SECTION_TYPES.find((t) => t.value === section.type);
        return (
          <div key={sIdx} className="border border-border rounded-lg bg-surface/20 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface/60 border-b border-border">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {typeMeta?.icon && <typeMeta.icon className="h-3.5 w-3.5 text-primary shrink-0" />}
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{typeMeta?.label || section.type}</span>
                {section.heading && (
                  <span className="text-[10px] text-muted-foreground truncate">— {section.heading}</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-5 w-5 cursor-pointer" onClick={() => move(sIdx, -1)} disabled={sIdx === 0}>
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5 cursor-pointer" onClick={() => move(sIdx, 1)} disabled={sIdx === sections.length - 1}>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={() => remove(sIdx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Section body */}
            <div className="p-3 space-y-3">
              {/* Heading — all types */}
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Section Heading</label>
                <Input value={section.heading} onChange={(e) => update(sIdx, { heading: e.target.value })} className="text-sm h-8" placeholder="e.g. Our QA/QC Philosophy" />
              </div>

              {/* TEXT: body */}
              {section.type === "text" && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Body Text</label>
                  <Textarea
                    value={section.body || ""}
                    onChange={(e) => update(sIdx, { body: e.target.value })}
                    className="text-sm min-h-[80px] resize-none"
                    placeholder="Write the paragraph content..."
                  />
                </div>
              )}

              {/* CALLOUT: body */}
              {section.type === "callout" && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Callout Body</label>
                  <Textarea
                    value={section.body || ""}
                    onChange={(e) => update(sIdx, { body: e.target.value })}
                    className="text-sm min-h-[60px] resize-none"
                    placeholder="Important note or highlight text..."
                  />
                </div>
              )}

              {/* CHECKLIST: string items */}
              {section.type === "checklist" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Checklist Items</label>
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] text-primary gap-0.5 cursor-pointer" onClick={() => addCheckItem(sIdx)}>
                      <Plus className="h-2.5 w-2.5" /> Add Item
                    </Button>
                  </div>
                  {(section.items as string[]).map((item, iIdx) => (
                    <div key={iIdx} className="flex gap-2 items-center">
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      <Input
                        value={item}
                        onChange={(e) => updateCheckItem(sIdx, iIdx, e.target.value)}
                        className="text-sm h-7 flex-1"
                        placeholder="Checklist item..."
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => removeCheckItem(sIdx, iIdx)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {(section.items as string[]).length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No items — click Add Item.</p>
                  )}
                </div>
              )}

              {/* NUMBERED: title + desc items */}
              {section.type === "numbered" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Steps / Items</label>
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] text-primary gap-0.5 cursor-pointer" onClick={() => addNumberedItem(sIdx)}>
                      <Plus className="h-2.5 w-2.5" /> Add Step
                    </Button>
                  </div>
                  {(section.items as Array<{ title: string; desc: string }>).map((item, iIdx) => (
                    <div key={iIdx} className="border border-border rounded p-2 bg-card space-y-1.5 relative">
                      <Button
                        variant="ghost" size="icon"
                        className="absolute top-1 right-1 h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => removeNumberedItem(sIdx, iIdx)}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                      <div className="flex items-center gap-2 pr-6">
                        <span className="font-display font-black text-xs text-primary shrink-0">{String(iIdx + 1).padStart(2, "0")}</span>
                        <Input
                          value={item.title}
                          onChange={(e) => updateNumberedItem(sIdx, iIdx, "title", e.target.value)}
                          className="text-xs h-7 flex-1"
                          placeholder="Step title..."
                        />
                      </div>
                      <Textarea
                        value={item.desc}
                        onChange={(e) => updateNumberedItem(sIdx, iIdx, "desc", e.target.value)}
                        className="text-xs min-h-[44px] resize-none"
                        placeholder="Step description..."
                      />
                    </div>
                  ))}
                  {(section.items as Array<{ title: string; desc: string }>).length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No steps — click Add Step.</p>
                  )}
                </div>
              )}

              {/* TABLE: headers + rows */}
              {section.type === "table" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Table Data</label>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-5 text-[10px] gap-0.5 cursor-pointer" onClick={() => addTableCol(sIdx)}>
                        <Plus className="h-2.5 w-2.5" /> Column
                      </Button>
                      <Button variant="outline" size="sm" className="h-5 text-[10px] gap-0.5 cursor-pointer" onClick={() => addTableRow(sIdx)}>
                        <Plus className="h-2.5 w-2.5" /> Row
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto border border-border rounded">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-surface-dark/90">
                          {(section.headers || []).map((h, j) => (
                            <th key={j} className="p-1.5 border-r border-border/50 last:border-r-0 min-w-[100px]">
                              <div className="flex items-center gap-1">
                                <Input
                                  value={h}
                                  onChange={(e) => updateTableHeader(sIdx, j, e.target.value)}
                                  className="h-5 text-xs border-0 bg-transparent font-bold p-0 text-foreground focus-visible:ring-0"
                                />
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-4 w-4 text-destructive/70 hover:text-destructive shrink-0 cursor-pointer"
                                  onClick={() => removeTableCol(sIdx, j)}
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                </Button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(section.rows || []).map((row, i) => (
                          <tr key={i} className="border-t border-border group hover:bg-surface/50">
                            {row.map((cell, j) => (
                              <td key={j} className="p-1 border-r border-border/30 last:border-r-0">
                                <Input
                                  value={cell}
                                  onChange={(e) => updateTableCell(sIdx, i, j, e.target.value)}
                                  className="h-6 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                                />
                              </td>
                            ))}
                            <td className="p-1 w-6">
                              <Button
                                variant="ghost" size="icon"
                                className="h-5 w-5 text-destructive/70 opacity-0 group-hover:opacity-100 cursor-pointer"
                                onClick={() => removeTableRow(sIdx, i)}
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {(section.rows || []).length === 0 && (
                          <tr>
                            <td colSpan={(section.headers || []).length + 1} className="p-2 text-[10px] text-muted-foreground italic text-center">
                              No rows — click + Row to add data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {sections.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <p className="text-xs text-muted-foreground">No content sections yet. Use the buttons above to add sections.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function QATemplatesEditor() {
  const [rows, setRows] = useState<QADocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<QADocument>>(makeEmpty());
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("qa_documents")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(200);
    if (error) toast.error(error.message);
    setRows((data ?? []) as unknown as QADocument[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() =>
    q.trim() ? rows.filter((r) => r.category_name.toLowerCase().includes(q.toLowerCase())) : rows,
    [rows, q]
  );

  const openNew = () => {
    setEditing(makeEmpty());
    setActiveTab("basic");
    setOpen(true);
  };

  const openEdit = (r: QADocument) => {
    setEditing({ ...r });
    setActiveTab("basic");
    setOpen(true);
  };

  const save = async () => {
    if (!editing.category_name?.trim()) { toast.error("Category name is required"); return; }
    setSaving(true);
    try {
      const payload = {
        slug: editing.slug?.trim() || slugify(editing.category_name!),
        category_name: editing.category_name!.trim(),
        short_description: editing.short_description?.trim() || null,
        hero_image_url: editing.hero_image_url?.trim() || null,
        eyebrow: editing.eyebrow?.trim() || null,
        hero_title: editing.hero_title?.trim() || null,
        hero_body: editing.hero_body?.trim() || null,
        content_sections: editing.content_sections || [],
        stats: editing.stats || [],
        industries_served: editing.industries_served || [],
        key_pillars: editing.key_pillars || [],
        cta_label: editing.cta_label?.trim() || "Request QA Documentation",
        sort_order: editing.sort_order ?? 0,
        status: editing.status ?? "published",
      };

      const res = editing.id
        ? await supabase.from("qa_documents").update(payload).eq("id", editing.id)
        : await supabase.from("qa_documents").insert(payload);

      if (res.error) throw res.error;
      toast.success(editing.id ? "QA document updated" : "QA document created");
      setOpen(false);
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: QADocument) => {
    const { error } = await supabase.from("qa_documents").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    setRows((rs) => rs.filter((x) => x.id !== r.id));
  };

  const set = <K extends keyof QADocument>(key: K, value: QADocument[K]) =>
    setEditing((prev) => ({ ...prev, [key]: value }));

  const STATUS_COLORS: Record<QAStatus, string> = {
    published: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20",
    draft: "bg-amber-500/15 text-amber-600 border border-amber-500/20",
    archived: "bg-muted text-muted-foreground border border-border",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Quality Assurance Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Quality Assurance pages shown on `/quality-assurance` and dynamic subpage child templates.
          </p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90 shrink-0 gap-1.5 uppercase font-bold text-xs tracking-wider cursor-pointer border-0">
          <Plus className="h-4 w-4" /> New QA Document
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by category name" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} documents</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface/80 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Category Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Sections</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-4 py-3">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No QA documents found.
                </td>
              </tr>
            )}
            {!loading && filtered.map((doc, idx) => (
              <tr key={doc.id} className="hover:bg-surface/40 transition">
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{doc.sort_order ?? idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{doc.category_name}</div>
                  {doc.short_description && (
                    <div className="text-xs text-muted-foreground truncate max-w-[280px] mt-0.5">{doc.short_description}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{doc.slug}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded", STATUS_COLORS[doc.status])}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {(doc.content_sections || []).length} sections
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon" variant="ghost"
                      title="Preview"
                      className="cursor-pointer"
                      onClick={() => window.open(`/quality-assurance/${doc.slug}`, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => openEdit(doc)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{doc.category_name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove this QA document and its child detail page will return a 404.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-white cursor-pointer border-0"
                            onClick={() => void remove(doc)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase">
              {editing.id ? `Edit: ${editing.category_name}` : "New QA Document"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="basic" className="text-xs uppercase tracking-wide font-bold hover:cursor-pointer">Basic Info</TabsTrigger>
              <TabsTrigger value="hero" className="text-xs uppercase tracking-wide font-bold hover:cursor-pointer">Hero</TabsTrigger>
              <TabsTrigger value="pillars" className="text-xs uppercase tracking-wide font-bold hover:cursor-pointer">Pillars &amp; Stats</TabsTrigger>
              <TabsTrigger value="content" className="text-xs uppercase tracking-wide font-bold hover:cursor-pointer">Content Sections</TabsTrigger>
              <TabsTrigger value="industries" className="text-xs uppercase tracking-wide font-bold hover:cursor-pointer">Industries</TabsTrigger>
            </TabsList>

            {/* ── BASIC TAB ── */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel hint="Shown as the card title on the listing page">Category Name *</FieldLabel>
                  <Input
                    value={editing.category_name ?? ""}
                    onChange={(e) => {
                      set("category_name", e.target.value);
                      if (!editing.id) set("slug", slugify(e.target.value));
                    }}
                    placeholder="e.g. GSE® / Solmax Quality Assurance"
                    className="mt-1"
                  />
                </div>
                <div>
                  <FieldLabel hint="URL-safe slug for the child detail page /quality-assurance/{slug}">Slug</FieldLabel>
                  <Input
                    value={editing.slug ?? ""}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="auto-generated from name"
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <FieldLabel hint="Shown on the listing card and as the page meta description">Short Description</FieldLabel>
                <Textarea
                  value={editing.short_description ?? ""}
                  onChange={(e) => set("short_description", e.target.value)}
                  rows={3}
                  placeholder="Brief summary shown on the listing card..."
                  className="mt-1 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel hint="Button text on the listing card and detail page">CTA Label</FieldLabel>
                  <Input
                    value={editing.cta_label ?? ""}
                    onChange={(e) => set("cta_label", e.target.value)}
                    placeholder="e.g. View GSE® QA Documentation"
                    className="mt-1"
                  />
                </div>
                <div>
                  <FieldLabel hint="Controls display order on the listing page (lower = first)">Sort Order</FieldLabel>
                  <Input
                    type="number"
                    value={String(editing.sort_order ?? 0)}
                    onChange={(e) => set("sort_order", parseInt(e.target.value, 10) || 0)}
                    className="mt-1"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Status</Label>
                  <Select
                    value={editing.status ?? "published"}
                    onValueChange={(v) => set("status", v as QAStatus)}
                  >
                    <SelectTrigger className="mt-1.5 w-36 font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published" className="font-semibold text-xs">Published</SelectItem>
                      <SelectItem value="draft" className="font-semibold text-xs">Draft</SelectItem>
                      <SelectItem value="archived" className="font-semibold text-xs">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* ── HERO TAB ── */}
            <TabsContent value="hero" className="space-y-4 pt-4">
              <div>
                <FieldLabel hint="Background image shown in the hero section">Hero Image URL</FieldLabel>
                <Input
                  value={editing.hero_image_url ?? ""}
                  onChange={(e) => set("hero_image_url", e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
                {editing.hero_image_url && (
                  <div className="mt-2 rounded overflow-hidden border border-border aspect-video bg-muted max-w-sm">
                    <img src={editing.hero_image_url} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel hint='Small text above the title — e.g. "IAGI-Aligned" or "GRI-GM13 Certified"'>Eyebrow Text</FieldLabel>
                  <Input value={editing.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} placeholder="e.g. IAGI-Aligned" className="mt-1" />
                </div>
              </div>

              <div>
                <FieldLabel hint="Large heading in the hero. Defaults to category name if blank.">Hero Title</FieldLabel>
                <Input
                  value={editing.hero_title ?? ""}
                  onChange={(e) => set("hero_title", e.target.value)}
                  placeholder="e.g. GSE® / Solmax Geomembrane Quality Assurance"
                  className="mt-1"
                />
              </div>

              <div>
                <FieldLabel hint="Subtitle paragraph below the hero heading">Hero Body</FieldLabel>
                <Textarea
                  value={editing.hero_body ?? ""}
                  onChange={(e) => set("hero_body", e.target.value)}
                  rows={3}
                  placeholder="Supporting paragraph shown in the hero section..."
                  className="mt-1 resize-none"
                />
              </div>
            </TabsContent>

            {/* ── PILLARS & STATS TAB ── */}
            <TabsContent value="pillars" className="space-y-6 pt-4">
              <PillarsEditor
                pillars={editing.key_pillars || []}
                onChange={(v) => set("key_pillars", v)}
              />
              <div className="border-t border-border pt-4">
                <StatsEditor
                  stats={editing.stats || []}
                  onChange={(v) => set("stats", v)}
                />
              </div>
            </TabsContent>

            {/* ── CONTENT SECTIONS TAB ── */}
            <TabsContent value="content" className="pt-4">
              <ContentSectionsEditor
                sections={editing.content_sections || []}
                onChange={(v) => set("content_sections", v)}
              />
            </TabsContent>

            {/* ── INDUSTRIES TAB ── */}
            <TabsContent value="industries" className="pt-4">
              <TagsInput
                label="Industries Served"
                hint='Type each industry and press Enter or click Add. E.g. "Mining & Minerals", "Water & Sanitation"'
                tags={editing.industries_served || []}
                onChange={(v) => set("industries_served", v)}
                placeholder="e.g. Mining & Minerals"
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 pt-4 border-t border-border mt-4">
            <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => void save()} disabled={saving} className="bg-primary hover:bg-primary/90 uppercase font-bold tracking-wide text-xs cursor-pointer text-white border-0">
              {saving ? "Saving…" : editing.id ? "Save Changes" : "Create Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
