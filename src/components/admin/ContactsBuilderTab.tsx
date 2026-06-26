import { useState, useEffect, useCallback, useId } from "react";
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
  ArrowUp,
  ArrowDown,
  Contact,
} from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { IconPicker } from "./IconPicker";
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
  type ContactsPageContent,
  type ContactHero,
  type ContactHeadOffice,
  type ContactOfficeService,
  DEFAULT_CONTACTS_PAGE_CONTENT,
} from "@/types/contacts";

const SUPABASE_KEY = "contacts_page_content";

// ─── Sub-Editors ─────────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }: { data: ContactHero; onChange: (v: ContactHero) => void }) {
  const set = <K extends keyof ContactHero>(key: K, val: ContactHero[K]) =>
    onChange({ ...data, [key]: val });

  const updateBadge = (index: number, key: string, val: string) => {
    const badges = [...data.badges];
    badges[index] = { ...badges[index], [key]: val };
    set("badges", badges);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Hero Section</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize the main hero title, subtitle, description, tags, badges, and background image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel hint="Use \n for line breaks, e.g. Johannesburg\nHead Office">
            Title
          </FieldLabel>
          <Textarea
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Johannesburg&#10;Head Office"
            className="text-sm min-h-[72px] resize-none"
          />
        </div>
        <div>
          <FieldLabel>Subtitle</FieldLabel>
          <Input
            value={data.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="Southern Africa Regional Hub"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Proudly serving Southern Africa and cross-border projects."
          className="text-sm min-h-[72px] resize-none"
        />
      </div>

      <ImagePicker
        label="Hero Background Image"
        hint="Upload or choose a high-resolution background image"
        value={data.bgImage}
        onChange={(v) => set("bgImage", v)}
      />

      <StringListEditor
        label="Hero Bullet Points / Tags"
        hint="Bullet points listed underneath the subtitle (e.g. Supply, Installation, QA/QC, Logistics)"
        items={data.tags}
        onChange={(tags) => set("tags", tags)}
        placeholder="Add tag"
      />

      <div className="space-y-3">
        <FieldLabel hint="Customize the 3 cards that sit at the bottom-left of the hero banner">
          Hero Badges (3 items)
        </FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.badges.map((badge, idx) => (
            <div key={idx} className="border border-border rounded-xl p-4 space-y-3 bg-surface/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Badge {idx + 1}
              </p>
              <div>
                <FieldLabel>Icon</FieldLabel>
                <IconPicker
                  value={badge.icon}
                  onChange={(v) => updateBadge(idx, "icon", v)}
                  placeholder="Select icon..."
                />
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={badge.title}
                  onChange={(e) => updateBadge(idx, "title", e.target.value)}
                  placeholder="Expert Technical"
                  className="text-sm"
                />
              </div>
              <div>
                <FieldLabel>Subtitle</FieldLabel>
                <Input
                  value={badge.subtitle}
                  onChange={(e) => updateBadge(idx, "subtitle", e.target.value)}
                  placeholder="Support"
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeadOfficeEditor({
  data,
  onChange,
}: {
  data: ContactHeadOffice;
  onChange: (v: ContactHeadOffice) => void;
}) {
  const set = <K extends keyof ContactHeadOffice>(key: K, val: ContactHeadOffice[K]) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="space-y-6">
      <SectionHeading>Head Office Details</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize contact information, address, phone numbers, and operational hours of the main
        office.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Company Name</FieldLabel>
          <Input
            value={data.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Geosynthetics Africa (Pty) Ltd"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Contact Person Name</FieldLabel>
          <Input
            value={data.contactPerson}
            onChange={(e) => set("contactPerson", e.target.value)}
            placeholder="James Chabata"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Contact Role</FieldLabel>
          <Input
            value={data.contactRole}
            onChange={(e) => set("contactRole", e.target.value)}
            placeholder="Sales Admin Manager"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <Input
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+27 78 1355 926"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <Input
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="sales@geosynthetics.co.za"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel hint="Google Maps iframe src URL to display on the desktop hero card">
            Google Maps Embed URL
          </FieldLabel>
          <Input
            value={data.mapEmbedUrl}
            onChange={(e) => set("mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps..."
            className="text-sm font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
        <StringListEditor
          label="Address Lines"
          hint="Physical address lines shown in details grid"
          items={data.address}
          onChange={(addr) => set("address", addr)}
          placeholder="Address line"
        />
        <StringListEditor
          label="Office Operational Hours"
          hint="Operational hours listed in details grid"
          items={data.hours}
          onChange={(hours) => set("hours", hours)}
          placeholder="e.g. Mon - Fri: 08:00 - 17:00"
        />
      </div>
    </div>
  );
}

function OfficeServicesEditor({
  items,
  onChange,
}: {
  items: ContactOfficeService[];
  onChange: (v: ContactOfficeService[]) => void;
}) {
  const { add, update, remove } = useListEditor<ContactOfficeService>(items, onChange, () => ({
    icon: "Layers",
    label: "New Service",
  }));

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
          <SectionHeading>Office Services</SectionHeading>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage services available from this head office (e.g. Material Supply, HDPE Liner
            Installation).
          </p>
        </div>
        <AddItemButton onClick={add} label="Add Service" />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No services defined yet. Click 'Add Service' to add one." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((service, idx) => (
            <ItemCard key={idx} className="relative">
              <ItemDeleteButton onClick={() => remove(idx)} />

              {/* Re-ordering arrows */}
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

              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pr-16">
                Service {idx + 1}
              </p>

              <div className="space-y-3 pt-1">
                <div>
                  <FieldLabel>Icon</FieldLabel>
                  <IconPicker
                    value={service.icon}
                    onChange={(icon) => update(idx, "icon", icon)}
                    placeholder="Select icon..."
                  />
                </div>
                <div>
                  <FieldLabel>Label</FieldLabel>
                  <Input
                    value={service.label}
                    onChange={(e) => update(idx, "label", e.target.value)}
                    placeholder="Material Supply"
                    className="text-sm"
                  />
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

let contactsContentCache: ContactsPageContent | null = null;

const TABS = [
  { id: "hero", label: "Hero Banner" },
  { id: "headOffice", label: "Head Office Details" },
  { id: "services", label: "Office Services" },
];

export function ContactsBuilderTab() {
  const [content, setContent] = useState<ContactsPageContent>(() => {
    return contactsContentCache ?? DEFAULT_CONTACTS_PAGE_CONTENT;
  });
  const [loading, setLoading] = useState(!contactsContentCache);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Load from Supabase
  const load = useCallback(async () => {
    if (!contactsContentCache) {
      setLoading(true);
    }
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load contacts page content: " + error.message);
    } else if (data?.value) {
      // Merge with defaults to ensure all fields are populated
      const val = data.value as unknown as ContactsPageContent;
      const merged: ContactsPageContent = {
        hero: { ...DEFAULT_CONTACTS_PAGE_CONTENT.hero, ...val.hero },
        headOffice: { ...DEFAULT_CONTACTS_PAGE_CONTENT.headOffice, ...val.headOffice },
        officeServices: val.officeServices || DEFAULT_CONTACTS_PAGE_CONTENT.officeServices,
      };
      setContent(merged);
      contactsContentCache = merged;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Save to Supabase
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
      toast.success("Contact page content saved successfully!");
      setDirty(false);
      contactsContentCache = content;
    }
    setSaving(false);
  };

  const update = (patch: Partial<ContactsPageContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      contactsContentCache = next;
      return next;
    });
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin animate-infinite" />
        <span className="text-sm font-medium">Loading contact page builder…</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sticky Sub-Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-surface/30">
        <div className="flex items-center gap-2">
          <Contact className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wide">Contact Page Content</span>
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
          {saving ? "Updating..." : "Save Contact Page"}
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
          <TabsContent value="hero" className="p-6 m-0">
            <HeroEditor data={content.hero} onChange={(v) => update({ hero: v })} />
          </TabsContent>

          <TabsContent value="headOffice" className="p-6 m-0">
            <HeadOfficeEditor
              data={content.headOffice}
              onChange={(v) => update({ headOffice: v })}
            />
          </TabsContent>

          <TabsContent value="services" className="p-6 m-0">
            <OfficeServicesEditor
              items={content.officeServices}
              onChange={(v) => update({ officeServices: v })}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
