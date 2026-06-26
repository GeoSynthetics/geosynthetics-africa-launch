import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  FileText,
  List,
  MessageSquare,
  Table,
} from "lucide-react";
import { FieldLabel } from "./TemplateEditorShared";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentSectionType = "text" | "checklist" | "numbered" | "callout" | "table";

export type ContentSection = {
  type: ContentSectionType;
  heading: string;
  body?: string;
  items?: string[] | Array<{ title: string; desc: string }>;
  headers?: string[];
  rows?: string[][];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_TYPES = [
  {
    value: "text",
    label: "Text Block",
    icon: FileText,
    hint: "A heading with a paragraph of body text.",
  },
  {
    value: "checklist",
    label: "Checklist",
    icon: CheckCircle,
    hint: "A bulleted list of items with checkmarks.",
  },
  {
    value: "numbered",
    label: "Numbered Steps",
    icon: List,
    hint: "A numbered list with title + description per item.",
  },
  {
    value: "callout",
    label: "Callout Box",
    icon: MessageSquare,
    hint: "A dark highlighted callout panel with heading + body.",
  },
  {
    value: "table",
    label: "Data Table",
    icon: Table,
    hint: "A table with custom column headers and rows.",
  },
] as const;

// ─── Section-level helpers ────────────────────────────────────────────────────
// Each section variant has its own focused renderer to keep the parent lean.

function ChecklistSectionBody({
  section,
  sIdx,
  onUpdate,
}: {
  section: ContentSection;
  sIdx: number;
  onUpdate: (i: number, patch: Partial<ContentSection>) => void;
}) {
  const items = (section.items as string[]) || [];

  const add = () => onUpdate(sIdx, { items: [...items, ""] });
  const update = (iIdx: number, val: string) => {
    const next = [...items];
    next[iIdx] = val;
    onUpdate(sIdx, { items: next });
  };
  const remove = (iIdx: number) => onUpdate(sIdx, { items: items.filter((_, i) => i !== iIdx) });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">
          Checklist Items
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 text-[10px] text-primary gap-0.5 cursor-pointer"
          onClick={add}
        >
          <Plus className="h-2.5 w-2.5" /> Add Item
        </Button>
      </div>
      {items.map((item, iIdx) => (
        <div key={iIdx} className="flex gap-2 items-center">
          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
          <Input
            value={item}
            onChange={(e) => update(iIdx, e.target.value)}
            className="text-sm h-7 flex-1"
            placeholder="Checklist item..."
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={() => remove(iIdx)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No items — click Add Item.</p>
      )}
    </div>
  );
}

function NumberedSectionBody({
  section,
  sIdx,
  onUpdate,
}: {
  section: ContentSection;
  sIdx: number;
  onUpdate: (i: number, patch: Partial<ContentSection>) => void;
}) {
  type NumberedItem = { title: string; desc: string };
  const items = (section.items as NumberedItem[]) || [];

  const add = () => onUpdate(sIdx, { items: [...items, { title: "", desc: "" }] });
  const update = (iIdx: number, key: keyof NumberedItem, val: string) => {
    const next = [...items];
    next[iIdx] = { ...next[iIdx], [key]: val };
    onUpdate(sIdx, { items: next });
  };
  const remove = (iIdx: number) => onUpdate(sIdx, { items: items.filter((_, i) => i !== iIdx) });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">
          Steps / Items
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 text-[10px] text-primary gap-0.5 cursor-pointer"
          onClick={add}
        >
          <Plus className="h-2.5 w-2.5" /> Add Step
        </Button>
      </div>
      {items.map((item, iIdx) => (
        <div key={iIdx} className="border border-border rounded p-2 bg-card space-y-1.5 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={() => remove(iIdx)}
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
          <div className="flex items-center gap-2 pr-6">
            <span className="font-display font-black text-xs text-primary shrink-0">
              {String(iIdx + 1).padStart(2, "0")}
            </span>
            <Input
              value={item.title}
              onChange={(e) => update(iIdx, "title", e.target.value)}
              className="text-xs h-7 flex-1"
              placeholder="Step title..."
            />
          </div>
          <Textarea
            value={item.desc}
            onChange={(e) => update(iIdx, "desc", e.target.value)}
            className="text-xs min-h-[44px] resize-none"
            placeholder="Step description..."
          />
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No steps — click Add Step.</p>
      )}
    </div>
  );
}

function TableSectionBody({
  section,
  sIdx,
  onUpdate,
}: {
  section: ContentSection;
  sIdx: number;
  onUpdate: (i: number, patch: Partial<ContentSection>) => void;
}) {
  const headers = section.headers || [];
  const rows = section.rows || [];

  const addRow = () => onUpdate(sIdx, { rows: [...rows, Array(headers.length).fill("")] });
  const addCol = () =>
    onUpdate(sIdx, { headers: [...headers, "New Col"], rows: rows.map((r) => [...r, ""]) });
  const removeRow = (i: number) => onUpdate(sIdx, { rows: rows.filter((_, idx) => idx !== i) });
  const removeCol = (j: number) =>
    onUpdate(sIdx, {
      headers: headers.filter((_, idx) => idx !== j),
      rows: rows.map((r) => r.filter((_, idx) => idx !== j)),
    });
  const updateHeader = (j: number, val: string) => {
    const next = [...headers];
    next[j] = val;
    onUpdate(sIdx, { headers: next });
  };
  const updateCell = (i: number, j: number, val: string) => {
    const next = rows.map((row, ri) =>
      ri === i ? row.map((cell, ci) => (ci === j ? val : cell)) : row,
    );
    onUpdate(sIdx, { rows: next });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Table Data</label>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-5 text-[10px] gap-0.5 cursor-pointer"
            onClick={addCol}
          >
            <Plus className="h-2.5 w-2.5" /> Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-5 text-[10px] gap-0.5 cursor-pointer"
            onClick={addRow}
          >
            <Plus className="h-2.5 w-2.5" /> Row
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto border border-border rounded">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-dark/90">
              {headers.map((h, j) => (
                <th
                  key={j}
                  className="p-1.5 border-r border-border/50 last:border-r-0 min-w-[100px]"
                >
                  <div className="flex items-center gap-1">
                    <Input
                      value={h}
                      onChange={(e) => updateHeader(j, e.target.value)}
                      className="h-5 text-xs border-0 bg-transparent font-bold p-0 text-foreground focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-destructive/70 hover:text-destructive shrink-0 cursor-pointer"
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
              <tr key={i} className="border-t border-border group hover:bg-surface/50">
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
                    className="h-5 w-5 text-destructive/70 opacity-0 group-hover:opacity-100 cursor-pointer"
                    onClick={() => removeRow(i)}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="p-2 text-[10px] text-muted-foreground italic text-center"
                >
                  No rows — click + Row to add data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ContentSectionsEditor ────────────────────────────────────────────────────

interface ContentSectionsEditorProps {
  sections: ContentSection[];
  onChange: (v: ContentSection[]) => void;
}

export function ContentSectionsEditor({ sections, onChange }: ContentSectionsEditorProps) {
  const addSection = (type: ContentSectionType) => {
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

  const updateSection = (i: number, patch: Partial<ContentSection>) => {
    const next = [...sections];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const removeSection = (i: number) => onChange(sections.filter((_, idx) => idx !== i));

  const moveSection = (i: number, dir: -1 | 1) => {
    const next = [...sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar — add section by type */}
      <div className="flex items-center justify-between">
        <FieldLabel hint="These are the rich content blocks rendered on the public QA detail page.">
          Content Sections
        </FieldLabel>
        <div className="flex flex-wrap gap-1">
          {SECTION_TYPES.map((st) => (
            <Button
              key={st.value}
              variant="outline"
              size="sm"
              onClick={() => addSection(st.value as ContentSectionType)}
              className="h-6 text-[10px] gap-1 cursor-pointer"
              title={st.hint}
            >
              <Plus className="h-2.5 w-2.5" /> {st.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Section list */}
      {sections.map((section, sIdx) => {
        const typeMeta = SECTION_TYPES.find((t) => t.value === section.type);
        return (
          <div key={sIdx} className="border border-border rounded-lg bg-surface/20 overflow-hidden">
            {/* Section header bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface/60 border-b border-border">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {typeMeta?.icon && <typeMeta.icon className="h-3.5 w-3.5 text-primary shrink-0" />}
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {typeMeta?.label || section.type}
                </span>
                {section.heading && (
                  <span className="text-[10px] text-muted-foreground truncate">
                    — {section.heading}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => moveSection(sIdx, -1)}
                  disabled={sIdx === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => moveSection(sIdx, 1)}
                  disabled={sIdx === sections.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={() => removeSection(sIdx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Section body */}
            <div className="p-3 space-y-3">
              {/* Heading field — shared by all section types */}
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Section Heading
                </label>
                <Input
                  value={section.heading}
                  onChange={(e) => updateSection(sIdx, { heading: e.target.value })}
                  className="text-sm h-8"
                  placeholder="e.g. Our QA/QC Philosophy"
                />
              </div>

              {/* Body text — text & callout variants */}
              {(section.type === "text" || section.type === "callout") && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    {section.type === "callout" ? "Callout Body" : "Body Text"}
                  </label>
                  <Textarea
                    value={section.body || ""}
                    onChange={(e) => updateSection(sIdx, { body: e.target.value })}
                    className={`text-sm resize-none ${section.type === "callout" ? "min-h-[60px]" : "min-h-[80px]"}`}
                    placeholder={
                      section.type === "callout"
                        ? "Important note or highlight text..."
                        : "Write the paragraph content..."
                    }
                  />
                </div>
              )}

              {/* Checklist variant */}
              {section.type === "checklist" && (
                <ChecklistSectionBody section={section} sIdx={sIdx} onUpdate={updateSection} />
              )}

              {/* Numbered variant */}
              {section.type === "numbered" && (
                <NumberedSectionBody section={section} sIdx={sIdx} onUpdate={updateSection} />
              )}

              {/* Table variant */}
              {section.type === "table" && (
                <TableSectionBody section={section} sIdx={sIdx} onUpdate={updateSection} />
              )}
            </div>
          </div>
        );
      })}

      {sections.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <p className="text-xs text-muted-foreground">
            No content sections yet. Use the buttons above to add sections.
          </p>
        </div>
      )}
    </div>
  );
}
