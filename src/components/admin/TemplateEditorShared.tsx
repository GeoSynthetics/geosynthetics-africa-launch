import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1">
      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
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
  fields: { key: string; label: string; multiline?: boolean; placeholder?: string }[];
  onChange: (v: T[]) => void;
  newItem: T;
}) {
  const add = () => onChange([...items, { ...newItem }]);
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
                <div key={f.key} className={f.multiline ? "col-span-full" : ""}>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    {f.label}
                  </label>
                  {f.multiline ? (
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
