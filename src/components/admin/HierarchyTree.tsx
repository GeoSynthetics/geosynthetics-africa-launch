import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Plus, ChevronRight, ChevronDown, Trash2 } from "lucide-react";
import type { HierarchySection, HierarchyItem, HierarchyChild } from "@/types/hierarchy";

type SelectedNode =
  | { type: "item"; itemIdx: number }
  | { type: "child"; itemIdx: number; childIdx: number };

type SectionKey = "products" | "applications" | "services" | "industries";

// Derive the canonical route template for each section's top-level items
function itemRoute(sectionKey: SectionKey): string {
  switch (sectionKey) {
    case "products": return "/products/$category";
    case "applications": return "/applications/$category";
    case "services": return "/services/$slug";
    case "industries": return "/industries/$slug";
  }
}

// Derive the route param key for each section (products/applications use $category; services/industries use $slug)
function itemParamKey(sectionKey: SectionKey): string {
  return sectionKey === "services" || sectionKey === "industries" ? "slug" : "category";
}

interface HierarchyTreeProps {
  section: HierarchySection;
  sectionKey: SectionKey;
  onChange: (section: HierarchySection) => void;
  onSelect: (node: SelectedNode) => void;
  selected: SelectedNode | null;
}

export function HierarchyTree({ section, sectionKey, onChange, onSelect, selected }: HierarchyTreeProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));
  const [newItemLabel, setNewItemLabel] = useState("");
  const [addingChildToIdx, setAddingChildToIdx] = useState<number | null>(null);
  const [newChildLabel, setNewChildLabel] = useState("");

  const toggleExpand = (i: number) =>
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    const slug = newItemLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const paramKey = itemParamKey(sectionKey);
    const newItem: HierarchyItem = {
      id: slug, slug, label: newItemLabel,
      to: itemRoute(sectionKey),
      params: { [paramKey]: slug },
      children: [],
    };
    onChange({ ...section, items: [...section.items, newItem] });
    setNewItemLabel("");
  };

  const addChild = (itemIdx: number) => {
    if (!newChildLabel.trim()) return;
    const slug = newChildLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const parent = section.items[itemIdx];
    // Products have two-level routes; all others use a single param on the parent's route
    const childTo = sectionKey === "products"
      ? "/products/$category/$family"
      : itemRoute(sectionKey);
    const paramKey = itemParamKey(sectionKey);
    const childParams = sectionKey === "products"
      ? { category: parent.slug, family: slug }
      : { [paramKey]: slug };
    const child: HierarchyChild = {
      id: slug, slug, label: newChildLabel,
      to: childTo,
      params: childParams,
    };
    const items = section.items.map((item, i) =>
      i === itemIdx ? { ...item, children: [...item.children, child] } : item
    );
    onChange({ ...section, items });
    setNewChildLabel("");
    setAddingChildToIdx(null);
  };

  const removeItem = (itemIdx: number) =>
    onChange({ ...section, items: section.items.filter((_, i) => i !== itemIdx) });

  const removeChild = (itemIdx: number, childIdx: number) => {
    const items = section.items.map((item, i) =>
      i !== itemIdx ? item : { ...item, children: item.children.filter((_, j) => j !== childIdx) }
    );
    onChange({ ...section, items });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "ITEM") {
      const items = [...section.items];
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      onChange({ ...section, items });
    } else if (type === "CHILD") {
      // droppableId = "children-{itemIdx}"
      const srcItemIdx = parseInt(source.droppableId.split("-")[1]);
      const dstItemIdx = parseInt(destination.droppableId.split("-")[1]);
      const items = [...section.items];
      const srcChildren = [...items[srcItemIdx].children];
      const [moved] = srcChildren.splice(source.index, 1);
      if (srcItemIdx === dstItemIdx) {
        srcChildren.splice(destination.index, 0, moved);
        items[srcItemIdx] = { ...items[srcItemIdx], children: srcChildren };
      } else {
        const dstChildren = [...items[dstItemIdx].children];
        moved.params = { ...moved.params, category: items[dstItemIdx].slug };
        dstChildren.splice(destination.index, 0, moved);
        items[srcItemIdx] = { ...items[srcItemIdx], children: srcChildren };
        items[dstItemIdx] = { ...items[dstItemIdx], children: dstChildren };
      }
      onChange({ ...section, items });
    }
  };

  const isSelectedItem = (i: number) => selected?.type === "item" && selected.itemIdx === i;
  const isSelectedChild = (i: number, j: number) =>
    selected?.type === "child" && selected.itemIdx === i && selected.childIdx === j;

  return (
    <div className="flex flex-col h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items" type="ITEM">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-2 space-y-1">
              {section.items.map((item, itemIdx) => {
                const expanded = expandedItems.has(itemIdx);
                return (
                  <Draggable key={item.id} draggableId={`item-${item.id}`} index={itemIdx}>
                    {(drag) => (
                      <div ref={drag.innerRef} {...drag.draggableProps}>
                        {/* Item row */}
                        <div className={`flex items-center gap-1 rounded px-2 py-1.5 group cursor-pointer transition-colors ${isSelectedItem(itemIdx) ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}>
                          <span {...drag.dragHandleProps} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                            <GripVertical className="h-3.5 w-3.5" />
                          </span>
                          <button onClick={() => toggleExpand(itemIdx)} className="text-muted-foreground">
                            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                          <button className="flex-1 text-left text-sm font-semibold truncate" onClick={() => onSelect({ type: "item", itemIdx })}>
                            {item.label}
                            <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">{item.children.length} sub</span>
                          </button>
                          <button onClick={() => { setAddingChildToIdx(itemIdx); setExpandedItems(p => new Set([...p, itemIdx])); }}
                            className="opacity-0 group-hover:opacity-100 text-primary" title="Add child">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => removeItem(itemIdx)} className="opacity-0 group-hover:opacity-100 text-destructive" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Children */}
                        {expanded && (
                          <Droppable droppableId={`children-${itemIdx}`} type="CHILD">
                            {(childProvided) => (
                              <div ref={childProvided.innerRef} {...childProvided.droppableProps} className="ml-7 mt-0.5 space-y-0.5">
                                {item.children.map((child, childIdx) => (
                                  <Draggable key={child.id} draggableId={`child-${child.id}`} index={childIdx}>
                                    {(childDrag) => (
                                      <div ref={childDrag.innerRef} {...childDrag.draggableProps}
                                        className={`flex items-center gap-1 rounded px-2 py-1 group cursor-pointer transition-colors text-sm ${isSelectedChild(itemIdx, childIdx) ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}>
                                        <span {...childDrag.dragHandleProps} className="opacity-0 group-hover:opacity-100">
                                          <GripVertical className="h-3 w-3" />
                                        </span>
                                        <button className="flex-1 text-left truncate" onClick={() => onSelect({ type: "child", itemIdx, childIdx })}>
                                          {child.label}
                                        </button>
                                        <button onClick={() => removeChild(itemIdx, childIdx)} className="opacity-0 group-hover:opacity-100 text-destructive">
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {childProvided.placeholder}

                                {/* Add child inline */}
                                {addingChildToIdx === itemIdx && (
                                  <div className="flex gap-1 mt-1 pr-1">
                                    <Input
                                      autoFocus value={newChildLabel}
                                      onChange={e => setNewChildLabel(e.target.value)}
                                      onKeyDown={e => { if (e.key === "Enter") addChild(itemIdx); if (e.key === "Escape") setAddingChildToIdx(null); }}
                                      placeholder="Child label..."
                                      className="h-7 text-xs flex-1"
                                    />
                                    <Button size="sm" className="h-7 px-2 text-xs" onClick={() => addChild(itemIdx)}>Add</Button>
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setAddingChildToIdx(null)}>✕</Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add top-level item */}
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={newItemLabel}
          onChange={e => setNewItemLabel(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") addItem(); }}
          placeholder="New item label..."
          className="text-sm h-8"
        />
        <Button size="sm" className="h-8 shrink-0" onClick={addItem}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}
