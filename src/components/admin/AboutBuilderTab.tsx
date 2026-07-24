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
  Info,
} from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { IconPicker } from "./IconPicker";
import {
  SectionHeading,
  FieldLabel,
  MicroLabel,
  ItemCard,
  ItemDeleteButton,
  AddItemButton,
  EmptyState,
  StringListEditor,
  useListEditor,
} from "./TemplateEditorShared";
import {
  type AboutPageContent,
  type AboutHero,
  type AboutAccountability,
  type AccountabilityCard,
  type AboutExecution,
  type CapabilityItem,
  type AboutPartners,
  type AboutFaqs,
  type FaqItem,
  type AboutTrademark,
  type AboutContactSection,
  DEFAULT_ABOUT_PAGE_CONTENT,
} from "@/types/about";
import { updateAboutCache } from "@/hooks/use-about-content";

const SUPABASE_KEY = "about_page_content";

// ─── Sub-Editors ─────────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }: { data: AboutHero; onChange: (v: AboutHero) => void }) {
  const set = <K extends keyof AboutHero>(key: K, val: AboutHero[K]) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="space-y-6">
      <SectionHeading>Hero Section</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize the hero eyebrow badge, title, description, and hero background image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Eyebrow Text</FieldLabel>
          <Input
            value={data.eyebrow}
            onChange={(e) => set("eyebrow", e.target.value)}
            placeholder="About Us"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Hero Title</FieldLabel>
          <Input
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Africa's Only Integrated Geosynthetics Execution Partner"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Hero Description</FieldLabel>
        <Textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Enter detailed hero description..."
          className="text-sm min-h-[90px] resize-y"
        />
      </div>

      <div>
        <FieldLabel>Hero Image</FieldLabel>
        <ImagePicker
          value={data.image}
          onChange={(url) => set("image", url)}
          folder="about"
          aspectRatio="video"
        />
      </div>
    </div>
  );
}

function AccountabilityEditor({
  data,
  onChange,
}: {
  data: AboutAccountability;
  onChange: (v: AboutAccountability) => void;
}) {
  const set = <K extends keyof AboutAccountability>(key: K, val: AboutAccountability[K]) =>
    onChange({ ...data, [key]: val });

  const cardsList = useListEditor<AccountabilityCard>(
    data.cards || [],
    (cards) => set("cards", cards),
    () => ({
      id: String(Date.now()),
      icon: "ShieldCheck",
      title: "New Value Proposition",
      description: "Enter proposition details...",
    })
  );

  return (
    <div className="space-y-6">
      <SectionHeading>One System. One Accountability. Section</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Manage the section heading, description, and accountability cards (with custom Lucide icons).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Section Title</FieldLabel>
          <Input
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="One System. One Accountability."
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Section Overview</FieldLabel>
          <Textarea
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the accountability model..."
            className="text-sm min-h-[72px] resize-none"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <FieldLabel>Accountability Cards</FieldLabel>

        {data.cards.length === 0 ? (
          <EmptyState message="No cards added yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.cards.map((card, idx) => (
              <ItemCard key={card.id || idx}>
                <ItemDeleteButton onClick={() => cardsList.remove(idx)} />

                <div>
                  <MicroLabel>Card Icon</MicroLabel>
                  <IconPicker
                    value={card.icon}
                    onChange={(iconName) => cardsList.update(idx, "icon", iconName)}
                  />
                </div>

                <div>
                  <MicroLabel>Card Title</MicroLabel>
                  <Input
                    value={card.title}
                    onChange={(e) => cardsList.update(idx, "title", e.target.value)}
                    placeholder="Title"
                    className="text-sm font-semibold"
                  />
                </div>

                <div>
                  <MicroLabel>Card Description</MicroLabel>
                  <Textarea
                    value={card.description}
                    onChange={(e) => cardsList.update(idx, "description", e.target.value)}
                    placeholder="Description text..."
                    className="text-xs min-h-[100px] resize-y"
                  />
                </div>
              </ItemCard>
            ))}
          </div>
        )}

        <AddItemButton onClick={cardsList.add} label="Add Accountability Card" />
      </div>
    </div>
  );
}

function ExecutionEditor({
  data,
  onChange,
}: {
  data: AboutExecution;
  onChange: (v: AboutExecution) => void;
}) {
  const set = <K extends keyof AboutExecution>(key: K, val: AboutExecution[K]) =>
    onChange({ ...data, [key]: val });

  const capabilitiesList = useListEditor<CapabilityItem>(
    data.capabilities || [],
    (caps) => set("capabilities", caps),
    () => ({
      id: String(Date.now()),
      title: "New Capability",
      description: "Capability detail...",
    })
  );

  return (
    <div className="space-y-6">
      <SectionHeading>Pan-African Execution & Philosophy</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize execution capability blocks and the Philosophy banner image and text.
      </p>

      <div className="space-y-3">
        <FieldLabel>Capabilities & Trust Points</FieldLabel>
        {data.capabilities.length === 0 ? (
          <EmptyState message="No capabilities added yet." />
        ) : (
          <div className="space-y-3">
            {data.capabilities.map((cap, idx) => (
              <ItemCard key={cap.id || idx}>
                <ItemDeleteButton onClick={() => capabilitiesList.remove(idx)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <MicroLabel>Heading</MicroLabel>
                    <Input
                      value={cap.title}
                      onChange={(e) => capabilitiesList.update(idx, "title", e.target.value)}
                      placeholder="Capability title"
                      className="text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <MicroLabel>Description</MicroLabel>
                    <Textarea
                      value={cap.description}
                      onChange={(e) => capabilitiesList.update(idx, "description", e.target.value)}
                      placeholder="Description..."
                      className="text-xs min-h-[64px] resize-y"
                    />
                  </div>
                </div>
              </ItemCard>
            ))}
          </div>
        )}
        <AddItemButton onClick={capabilitiesList.add} label="Add Capability Item" />
      </div>

      <div className="pt-4 border-t border-border space-y-4">
        <SectionHeading>Execution Philosophy Banner</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Philosophy Title</FieldLabel>
            <Input
              value={data.philosophyTitle}
              onChange={(e) => set("philosophyTitle", e.target.value)}
              placeholder="Our Execution Philosophy"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>Philosophy Subtitle / Motto</FieldLabel>
            <Input
              value={data.philosophySubtitle}
              onChange={(e) => set("philosophySubtitle", e.target.value)}
              placeholder="We do not participate in fragmented delivery."
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Philosophy Image</FieldLabel>
          <ImagePicker
            value={data.philosophyImage}
            onChange={(url) => set("philosophyImage", url)}
            folder="about"
            aspectRatio="square"
          />
        </div>
      </div>
    </div>
  );
}

function PartnersAndFaqEditor({
  partners,
  faqs,
  onPartnersChange,
  onFaqsChange,
}: {
  partners: AboutPartners;
  faqs: AboutFaqs;
  onPartnersChange: (v: AboutPartners) => void;
  onFaqsChange: (v: AboutFaqs) => void;
}) {
  const setPartners = <K extends keyof AboutPartners>(key: K, val: AboutPartners[K]) =>
    onPartnersChange({ ...partners, [key]: val });

  const setFaqs = <K extends keyof AboutFaqs>(key: K, val: AboutFaqs[K]) =>
    onFaqsChange({ ...faqs, [key]: val });

  const faqList = useListEditor<FaqItem>(
    faqs.items || [],
    (items) => setFaqs("items", items),
    () => ({
      id: String(Date.now()),
      q: "New Question?",
      a: "Enter answer details here...",
    })
  );

  return (
    <div className="space-y-8">
      {/* Supply Partners */}
      <div className="space-y-4">
        <SectionHeading>Global Supply Partners Section</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Section Title</FieldLabel>
            <Input
              value={partners.title}
              onChange={(e) => setPartners("title", e.target.value)}
              placeholder="Our Global Supply Partners"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>Section Description</FieldLabel>
            <Textarea
              value={partners.description}
              onChange={(e) => setPartners("description", e.target.value)}
              placeholder="Partnership description..."
              className="text-sm min-h-[72px] resize-none"
            />
          </div>
        </div>

        <StringListEditor
          items={partners.partnerNames}
          onChange={(list) => setPartners("partnerNames", list)}
          label="Partner Names / Brands"
          addLabel="Add Partner Brand"
          placeholder="e.g. Solmax"
        />
      </div>

      {/* FAQs */}
      <div className="pt-6 border-t border-border space-y-4">
        <SectionHeading>Frequently Asked Questions</SectionHeading>
        <div>
          <FieldLabel>FAQs Title</FieldLabel>
          <Input
            value={faqs.title}
            onChange={(e) => setFaqs("title", e.target.value)}
            placeholder="Frequently Asked Questions"
            className="text-sm"
          />
        </div>

        <div className="space-y-3">
          <FieldLabel>FAQ Items</FieldLabel>
          {faqs.items.length === 0 ? (
            <EmptyState message="No FAQ items added yet." />
          ) : (
            <div className="space-y-3">
              {faqs.items.map((item, idx) => (
                <ItemCard key={item.id || idx}>
                  <ItemDeleteButton onClick={() => faqList.remove(idx)} />

                  <div>
                    <MicroLabel>Question</MicroLabel>
                    <Input
                      value={item.q}
                      onChange={(e) => faqList.update(idx, "q", e.target.value)}
                      placeholder="Question..."
                      className="text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <MicroLabel>Answer</MicroLabel>
                    <Textarea
                      value={item.a}
                      onChange={(e) => faqList.update(idx, "a", e.target.value)}
                      placeholder="Answer..."
                      className="text-xs min-h-[72px] resize-y"
                    />
                  </div>
                </ItemCard>
              ))}
            </div>
          )}
          <AddItemButton onClick={faqList.add} label="Add FAQ Item" />
        </div>
      </div>
    </div>
  );
}

function ContactAndTrademarkEditor({
  trademark,
  contact,
  onTrademarkChange,
  onContactChange,
}: {
  trademark: AboutTrademark;
  contact: AboutContactSection;
  onTrademarkChange: (v: AboutTrademark) => void;
  onContactChange: (v: AboutContactSection) => void;
}) {
  const setContact = <K extends keyof AboutContactSection>(key: K, val: AboutContactSection[K]) =>
    onContactChange({ ...contact, [key]: val });

  return (
    <div className="space-y-8">
      {/* Trademark & 360 Band */}
      <div className="space-y-4">
        <SectionHeading>Trademark Notice & Partner Banner</SectionHeading>
        <div>
          <FieldLabel>Banner Title</FieldLabel>
          <Input
            value={trademark.title}
            onChange={(e) => onTrademarkChange({ ...trademark, title: e.target.value })}
            placeholder="Your 360° Partner in Lining, Reinforcement & Erosion Control"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Trademark Notice</FieldLabel>
          <Textarea
            value={trademark.trademarkNotice}
            onChange={(e) => onTrademarkChange({ ...trademark, trademarkNotice: e.target.value })}
            placeholder="Legal trademark notice..."
            className="text-xs min-h-[80px] resize-y"
          />
        </div>
      </div>

      {/* Bottom Contact Section */}
      <div className="pt-6 border-t border-border space-y-4">
        <SectionHeading>Bottom Contact & Conversation Section</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Section Title</FieldLabel>
            <Input
              value={contact.title}
              onChange={(e) => setContact("title", e.target.value)}
              placeholder="Let's Start a Conversation"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>Section Subtitle</FieldLabel>
            <Input
              value={contact.subtitle}
              onChange={(e) => setContact("subtitle", e.target.value)}
              placeholder="Reach out to our experts..."
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Background Image</FieldLabel>
          <ImagePicker
            value={contact.backgroundImage}
            onChange={(url) => setContact("backgroundImage", url)}
            folder="about"
            aspectRatio="wide"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel>Head Office Title</FieldLabel>
            <Input
              value={contact.headOfficeTitle}
              onChange={(e) => setContact("headOfficeTitle", e.target.value)}
              placeholder="Head Office"
              className="text-sm font-semibold mb-2"
            />
            <FieldLabel hint="Use line breaks for multiple lines">Head Office Address</FieldLabel>
            <Textarea
              value={contact.headOfficeAddress}
              onChange={(e) => setContact("headOfficeAddress", e.target.value)}
              className="text-xs min-h-[90px] resize-y"
            />
          </div>

          <div>
            <FieldLabel>Contact Title</FieldLabel>
            <Input
              value={contact.contactTitle}
              onChange={(e) => setContact("contactTitle", e.target.value)}
              placeholder="Contact"
              className="text-sm font-semibold mb-2"
            />
            <FieldLabel hint="Use line breaks for multiple lines">Contact Details</FieldLabel>
            <Textarea
              value={contact.contactDetails}
              onChange={(e) => setContact("contactDetails", e.target.value)}
              className="text-xs min-h-[90px] resize-y"
            />
          </div>

          <div>
            <FieldLabel>Operating Hours Title</FieldLabel>
            <Input
              value={contact.operatingHoursTitle}
              onChange={(e) => setContact("operatingHoursTitle", e.target.value)}
              placeholder="Operating Hours"
              className="text-sm font-semibold mb-2"
            />
            <FieldLabel hint="Use line breaks for multiple lines">Operating Hours</FieldLabel>
            <Textarea
              value={contact.operatingHoursDetails}
              onChange={(e) => setContact("operatingHoursDetails", e.target.value)}
              className="text-xs min-h-[90px] resize-y"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <FieldLabel>Form Heading</FieldLabel>
            <Input
              value={contact.formHeading}
              onChange={(e) => setContact("formHeading", e.target.value)}
              placeholder="Send a Message"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>Form Description</FieldLabel>
            <Input
              value={contact.formDescription}
              onChange={(e) => setContact("formDescription", e.target.value)}
              placeholder="Our technical team is ready to support your project..."
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tab Component ───────────────────────────────────────────────────────

export function AboutBuilderTab() {
  const [content, setContent] = useState<AboutPageContent>(DEFAULT_ABOUT_PAGE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", SUPABASE_KEY)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load About page config: " + error.message);
        return;
      }

      if (data?.value) {
        setContent({
          ...DEFAULT_ABOUT_PAGE_CONTENT,
          ...(data.value as Partial<AboutPageContent>),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching About page settings.");
    } finally {
      setLoading(false);
      setIsDirty(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSection = <K extends keyof AboutPageContent>(key: K, val: AboutPageContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_config").upsert(
        {
          key: SUPABASE_KEY,
          value: content as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

      if (error) {
        toast.error("Failed to save About page settings: " + error.message);
        return;
      }

      updateAboutCache(content);
      setIsDirty(false);
      toast.success("About page settings saved successfully!");
    } catch (err: any) {
      toast.error("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading About Page builder...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Save Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold font-display uppercase tracking-tight">
              About Page Customization
            </h2>
            <p className="text-xs text-muted-foreground">
              Customize text, cards, philosophy, FAQs, and image pickers for the About Page.
            </p>
          </div>
          {isDirty && (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2 cursor-pointer font-bold text-xs uppercase"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="hero" className="w-full max-w-5xl mx-auto space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="hero" className="text-xs font-bold uppercase py-2">
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="accountability" className="text-xs font-bold uppercase py-2">
              Accountability
            </TabsTrigger>
            <TabsTrigger value="execution" className="text-xs font-bold uppercase py-2">
              Philosophy
            </TabsTrigger>
            <TabsTrigger value="partners-faqs" className="text-xs font-bold uppercase py-2">
              Partners & FAQs
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs font-bold uppercase py-2">
              Contact & Notice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="border border-border rounded-2xl p-6 bg-card">
            <HeroEditor data={content.hero} onChange={(val) => updateSection("hero", val)} />
          </TabsContent>

          <TabsContent value="accountability" className="border border-border rounded-2xl p-6 bg-card">
            <AccountabilityEditor
              data={content.accountability}
              onChange={(val) => updateSection("accountability", val)}
            />
          </TabsContent>

          <TabsContent value="execution" className="border border-border rounded-2xl p-6 bg-card">
            <ExecutionEditor
              data={content.execution}
              onChange={(val) => updateSection("execution", val)}
            />
          </TabsContent>

          <TabsContent value="partners-faqs" className="border border-border rounded-2xl p-6 bg-card">
            <PartnersAndFaqEditor
              partners={content.partners}
              faqs={content.faqs}
              onPartnersChange={(val) => updateSection("partners", val)}
              onFaqsChange={(val) => updateSection("faqs", val)}
            />
          </TabsContent>

          <TabsContent value="contact" className="border border-border rounded-2xl p-6 bg-card">
            <ContactAndTrademarkEditor
              trademark={content.trademark}
              contact={content.contact}
              onTrademarkChange={(val) => updateSection("trademark", val)}
              onContactChange={(val) => updateSection("contact", val)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
