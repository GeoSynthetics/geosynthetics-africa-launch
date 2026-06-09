import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImagePicker } from "./ImagePicker";

// ─── useListEditor ────────────────────────────────────────────────────────────
// Generic hook that provides add/update/remove helpers for any array field.
// Eliminates the duplicated add/update/remove boilerplate across all sub-editors.

export function useListEditor<T>(
  items: T[],
  onChange: (v: T[]) => void,
  makeDefault: () => T,
) {
  const add = () => onChange([...items, makeDefault()]);

  const update = (index: number, key: keyof T, value: T[keyof T]) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const updateByKey = (index: number, key: string, value: string) => {
    const next = [...items];
    next[index] = { ...(next[index] as any), [key]: value };
    onChange(next as T[]);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return { add, update, updateByKey, remove };
}

// ─── MicroLabel ────────────────────────────────────────────────────────────────
// Tiny label used *inside* card fields (distinct from FieldLabel for section headings).

export function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
      {children}
    </label>
  );
}

// ─── ItemDeleteButton ──────────────────────────────────────────────────────────
// Absolute-positioned destructive trash icon button used in the top-right of item cards.

export function ItemDeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
      onClick={onClick}
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}

// ─── ItemCard ─────────────────────────────────────────────────────────────────
// Standard bordered card wrapper used for every item in a list sub-editor.

export function ItemCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border rounded-xl p-4 bg-surface/40 relative space-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
// Shown inside a list editor when there are no items yet.

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-xs text-muted-foreground italic pl-1">{message}</p>
  );
}

// ─── AddItemButton ────────────────────────────────────────────────────────────
// The standard "add item" button at the bottom of list editors.

export function AddItemButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-8 text-xs gap-1.5 cursor-pointer"
    >
      <Plus className="h-3.5 w-3.5" /> {label}
    </Button>
  );
}

// ─── ListEditorHeader ─────────────────────────────────────────────────────────
// Header row with a label + ghost "Add" button for list section editors.

export function ListEditorHeader({
  label,
  hint,
  onAdd,
  addLabel = "Add",
}: {
  label: string;
  hint?: string;
  onAdd: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        className="h-6 text-xs text-primary hover:text-primary gap-1 cursor-pointer"
      >
        <Plus className="h-3 w-3" /> {addLabel}
      </Button>
    </div>
  );
}


// ─── SectionHeading ───────────────────────────────────────────────────────────

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
      <span className="w-1 h-3 bg-primary rounded-full inline-block" />
      {children}
    </h3>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────

export function FieldLabel({
  children,
  hint,
  htmlFor,
}: {
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <div className="mb-1">
      <label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-wide text-muted-foreground"
      >
        {children}
      </label>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}

// ─── StringListEditor ─────────────────────────────────────────────────────────

export function StringListEditor({
  label,
  hint,
  items,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const add = () => onChange([...items, ""]);
  const update = (i: number, v: string) => {
    const n = [...items];
    n[i] = v;
    onChange(n);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint={hint}>{label}</FieldLabel>
        <Button
          variant="ghost"
          size="sm"
          onClick={add}
          className="h-6 text-xs text-primary hover:text-primary gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <Textarea
                value={item}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className="text-sm min-h-[72px] flex-1 resize-none"
              />
            ) : (
              <Input
                value={item}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className="text-sm flex-1"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => remove(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">No items yet — click Add.</p>
        )}
      </div>
    </div>
  );
}

// Alias for backwards compatibility with legacy ListEditor
export { StringListEditor as ListEditor };

// ─── PairsEditor ──────────────────────────────────────────────────────────────

export function PairsEditor<T extends Record<string, string>>({
  label,
  hint,
  items,
  fields,
  onChange,
  newItem,
}: {
  label: string;
  hint?: string;
  items: T[];
  fields: { key: string; label: string; multiline?: boolean; type?: "image" | "text" | "textarea"; placeholder?: string }[];
  onChange: (v: T[]) => void;
  newItem?: T;
}) {
  const add = () => onChange([...items, newItem ? { ...newItem } : (Object.fromEntries(fields.map(f => [f.key, ""])) as T)]);
  const update = (i: number, key: string, val: string) => {
    const n = [...items];
    n[i] = { ...n[i], [key]: val };
    onChange(n);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint={hint}>{label}</FieldLabel>
        <Button
          variant="ghost"
          size="sm"
          onClick={add}
          className="h-6 text-xs text-primary hover:text-primary gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-border rounded-md p-3 bg-surface/40 space-y-2 relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
              onClick={() => remove(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div
              className={cn(
                "grid gap-2",
                fields.length >= 3
                  ? "grid-cols-1"
                  : "grid-cols-2 md:grid-cols-" + fields.length,
              )}
            >
              {fields.map((f) => (
                <div key={f.key} className={f.multiline || f.type === "image" ? "col-span-full" : ""}>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    {f.label}
                  </label>
                  {f.type === "image" ? (
                    <ImagePicker
                      value={(item as any)[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(val) => update(i, f.key, val)}
                    />
                  ) : f.multiline ? (
                    <Textarea
                      value={(item as any)[f.key] ?? ""}
                      className="text-sm min-h-[60px] resize-none"
                      placeholder={f.placeholder}
                      onChange={(e) => update(i, f.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={(item as any)[f.key] ?? ""}
                      className="text-sm"
                      placeholder={f.placeholder}
                      onChange={(e) => update(i, f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">No items yet — click Add.</p>
        )}
      </div>
    </div>
  );
}

// ─── PropertiesTableEditor ────────────────────────────────────────────────────

export function PropertiesTableEditor({
  table,
  onChange,
}: {
  table: { headers: string[]; rows: string[][] };
  onChange: (t: { headers: string[]; rows: string[][] }) => void;
}) {
  const { headers, rows } = table;

  const addRow = () =>
    onChange({ headers, rows: [...rows, Array(headers.length).fill("")] });
  const addCol = () =>
    onChange({ headers: [...headers, "New Column"], rows: rows.map((r) => [...r, ""]) });
  const removeRow = (i: number) =>
    onChange({ headers, rows: rows.filter((_, idx) => idx !== i) });
  const removeCol = (j: number) =>
    onChange({
      headers: headers.filter((_, idx) => idx !== j),
      rows: rows.map((r) => r.filter((_, idx) => idx !== j)),
    });
  const updateHeader = (j: number, val: string) => {
    const h = [...headers];
    h[j] = val;
    onChange({ headers: h, rows });
  };
  const updateCell = (i: number, j: number, val: string) => {
    const r = rows.map((row, ri) =>
      ri === i ? row.map((cell, ci) => (ci === j ? val : cell)) : row,
    );
    onChange({ headers, rows: r });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint="Columns and rows of technical data displayed in the Properties section">
          Properties &amp; Specifications Table
        </FieldLabel>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={addCol} className="h-6 text-xs gap-1">
            <Plus className="h-3 w-3" /> Column
          </Button>
          <Button variant="outline" size="sm" onClick={addRow} className="h-6 text-xs gap-1">
            <Plus className="h-3 w-3" /> Row
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto border border-border rounded-md">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-dark/90">
              {headers.map((h, j) => (
                <th
                  key={j}
                  className="p-1.5 border-r border-border/50 last:border-r-0 min-w-[120px]"
                >
                  <div className="flex items-center gap-1">
                    <Input
                      value={h}
                      onChange={(e) => updateHeader(j, e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent font-bold p-0 text-white focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-destructive/70 hover:text-destructive shrink-0"
                      onClick={() => removeCol(j)}
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-surface/50 group">
                {row.map((cell, j) => (
                  <td key={j} className="p-1 border-r border-border/30 last:border-r-0">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(i, j, e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                    />
                  </td>
                ))}
                <td className="p-1 w-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-destructive/70 opacity-0 group-hover:opacity-100"
                    onClick={() => removeRow(i)}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-xs text-muted-foreground italic p-3">
            No rows yet — click "+ Row" to add data.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── FAQEditor ────────────────────────────────────────────────────────────────

interface FAQ { question: string; answer: string; }
interface FAQEditorProps { faqs: FAQ[]; onChange: (faqs: FAQ[]) => void; }

export function FAQEditor({ faqs, onChange }: FAQEditorProps) {
  const add = () => onChange([...faqs, { question: "", answer: "" }]);
  const update = (i: number, field: keyof FAQ, val: string) => {
    const n = [...faqs]; n[i] = { ...n[i], [field]: val }; onChange(n);
  };
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FAQs</label>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary">
          <Plus className="h-3 w-3 mr-1" /> Add FAQ
        </Button>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded p-3 bg-surface/50 space-y-2 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Question</label>
              <Input value={faq.question} onChange={e => update(i, "question", e.target.value)} className="mt-1 text-sm" placeholder="e.g. What is the lifespan?" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Answer</label>
              <Textarea value={faq.answer} onChange={e => update(i, "answer", e.target.value)} className="mt-1 text-sm min-h-[80px]" placeholder="Detailed answer..." />
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-xs text-muted-foreground italic">No FAQs yet.</p>}
      </div>
    </div>
  );
}

// ─── QuickActionsEditor ───────────────────────────────────────────────────────

interface QA { title: string; description: string; icon: string; to: string; }

export function QuickActionsEditor({ items, onChange }: { items: QA[]; onChange: (i: QA[]) => void }) {
  const add = () => onChange([...items, { title: "", description: "", icon: "BookOpen", to: "/" }]);
  const update = (i: number, key: keyof QA, val: string) => {
    const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</label>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary"><Plus className="h-3 w-3 mr-1" />Add</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        {items.map((qa, i) => (
          <div key={i} className="border border-border rounded p-3 bg-surface/50 space-y-2 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
            <Input placeholder="Title" value={qa.title} onChange={e => update(i, "title", e.target.value)} className="text-sm" />
            <Input placeholder="Description" value={qa.description} onChange={e => update(i, "description", e.target.value)} className="text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Icon (Lucide name)" value={qa.icon} onChange={e => update(i, "icon", e.target.value)} className="text-sm" />
              <Input placeholder="/link-to" value={qa.to} onChange={e => update(i, "to", e.target.value)} className="text-sm" />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground italic">No quick actions.</p>}
      </div>
    </div>
  );
}

// ─── SectionsEditor ─────────────────────────────────────────────────────────

interface ContentSection { title: string; body: string; }
interface SectionsEditorProps {
  sections: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
}

export function SectionsEditor({ sections, onChange }: SectionsEditorProps) {
  const add = () => onChange([...sections, { title: "", body: "" }]);
  const update = (i: number, field: keyof ContentSection, val: string) => {
    const n = [...sections];
    n[i] = { ...n[i], [field]: val };
    onChange(n);
  };
  const remove = (i: number) => onChange(sections.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Rich Text Sections</label>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary">
          <Plus className="h-3 w-3 mr-1" /> Add Section
        </Button>
      </div>
      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="border border-border rounded p-3 bg-surface/50 space-y-2 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Section Title</label>
              <Input value={section.title} onChange={e => update(i, "title", e.target.value)} className="mt-1 text-sm font-semibold" placeholder="e.g. Design Support Services" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Section Body (Supports basic HTML/text formatting)</label>
              <Textarea value={section.body} onChange={e => update(i, "body", e.target.value)} className="mt-1 text-sm min-h-[100px]" placeholder="<p>Our team works closely with engineers to...</p>" />
            </div>
          </div>
        ))}
        {sections.length === 0 && <p className="text-xs text-muted-foreground italic">No custom sections yet.</p>}
      </div>
    </div>
  );
}

// ─── TagsInput ─────────────────────────────────────────────────────────────

export function TagsInput({
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
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="hover:text-destructive ml-0.5"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="text-sm h-8 flex-1"
        />
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={addTag}>
          Add
        </Button>
      </div>
    </div>
  );
}
