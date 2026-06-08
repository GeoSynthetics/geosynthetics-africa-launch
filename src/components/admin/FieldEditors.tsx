import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// ─── ListEditor ───────────────────────────────────────────────────────────────
interface ListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function ListEditor({ label, items, onChange, multiline, placeholder }: ListEditorProps) {
  const add = () => onChange([...items, ""]);
  const update = (i: number, val: string) => { const n = [...items]; n[i] = val; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary">
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <Textarea value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder} className="text-sm min-h-[60px] flex-1" />
            ) : (
              <Input value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder} className="text-sm flex-1" />
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No items yet. Click Add.</p>
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

// ─── PropertiesTableEditor ────────────────────────────────────────────────────
interface PropsTable { headers: string[]; rows: string[][]; }
interface PropertiesTableEditorProps { table: PropsTable; onChange: (t: PropsTable) => void; }

export function PropertiesTableEditor({ table, onChange }: PropertiesTableEditorProps) {
  const { headers, rows } = table;

  const addRow = () => onChange({ headers, rows: [...rows, Array(headers.length).fill("")] });
  const addCol = () => onChange({
    headers: [...headers, "New Column"],
    rows: rows.map(r => [...r, ""]),
  });
  const removeRow = (i: number) => onChange({ headers, rows: rows.filter((_, idx) => idx !== i) });
  const removeCol = (j: number) => onChange({
    headers: headers.filter((_, idx) => idx !== j),
    rows: rows.map(r => r.filter((_, idx) => idx !== j)),
  });
  const updateHeader = (j: number, val: string) => {
    const h = [...headers]; h[j] = val; onChange({ headers: h, rows });
  };
  const updateCell = (i: number, j: number, val: string) => {
    const r = rows.map((row, ri) => ri === i ? row.map((cell, ci) => ci === j ? val : cell) : row);
    onChange({ headers, rows: r });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Properties Table</label>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={addCol} className="h-6 text-xs text-primary"><Plus className="h-3 w-3 mr-1" />Col</Button>
          <Button variant="ghost" size="sm" onClick={addRow} className="h-6 text-xs text-primary"><Plus className="h-3 w-3 mr-1" />Row</Button>
        </div>
      </div>
      <div className="overflow-x-auto border border-border rounded">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-dark/80">
              {headers.map((h, j) => (
                <th key={j} className="p-1 border-r border-border last:border-r-0 min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <Input value={h} onChange={e => updateHeader(j, e.target.value)} className="h-6 text-xs border-0 bg-transparent font-bold p-0 text-white" />
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive/80 hover:text-destructive shrink-0" onClick={() => removeCol(j)}>
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-surface/50">
                {row.map((cell, j) => (
                  <td key={j} className="p-1 border-r border-border last:border-r-0">
                    <Input value={cell} onChange={e => updateCell(i, j, e.target.value)} className="h-6 text-xs border-0 bg-transparent p-0" />
                  </td>
                ))}
                <td className="p-1 w-6">
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive/80" onClick={() => removeRow(i)}>
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="text-xs text-muted-foreground italic p-3">No rows. Click +Row to add.</p>}
      </div>
    </div>
  );
}

// ─── PairsEditor (benefits, types) ───────────────────────────────────────────
import { ImagePicker } from "./ImagePicker";

interface PairItem { [key: string]: string }
interface PairsEditorProps {
  label: string;
  items: PairItem[];
  fields: { key: string; label: string; multiline?: boolean; type?: "image" | "text" | "textarea"; placeholder?: string }[];
  onChange: (items: PairItem[]) => void;
  newItem?: PairItem;
}

export function PairsEditor({ label, items, fields, onChange, newItem }: PairsEditorProps) {
  const add = () => onChange([...items, newItem ? { ...newItem } : Object.fromEntries(fields.map(f => [f.key, ""]))]);
  const update = (i: number, key: string, val: string) => {
    const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Button variant="ghost" size="sm" onClick={add} className="h-6 text-xs text-primary"><Plus className="h-3 w-3 mr-1" />Add</Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-border rounded p-3 bg-surface/50 space-y-2 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">{f.label}</label>
                {f.type === "image" ? (
                  <div className="mt-1">
                    <ImagePicker
                      value={item[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(val) => update(i, f.key, val)}
                    />
                  </div>
                ) : f.multiline ? (
                  <Textarea value={item[f.key] ?? ""} onChange={e => update(i, f.key, e.target.value)} className="mt-1 text-sm min-h-[60px]" placeholder={f.placeholder} />
                ) : (
                  <Input value={item[f.key] ?? ""} onChange={e => update(i, f.key, e.target.value)} className="mt-1 text-sm" placeholder={f.placeholder} />
                )}
              </div>
            ))}
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground italic">No items yet.</p>}
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

// ─── SectionsEditor (custom rich HTML text sections) ─────────────────────────
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

