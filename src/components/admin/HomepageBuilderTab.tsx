import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImagePicker } from "./ImagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  GripVertical,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading, FieldLabel } from "./TemplateEditorShared";
import {
  type HomepageContent,
  DEFAULT_HOMEPAGE_CONTENT,
  type TrustBadge,
  type ApplicationCard,
  type PartnerLogo,
  type ServiceCard,
  type StatCounter,
  type OfficeLocation,
  type ProjectCard,
  type GsaStep,
  type HeroSlide,
} from "@/types/homepage";

const SUPABASE_KEY = "homepage_content";

// ─── Reusable sub-components ─────────────────────────────────────────────────

function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <ImagePicker
      label={label}
      hint={hint}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
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
          {index + 1}. {title || "Untitled"}
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

// ─── Section editors ─────────────────────────────────────────────────────────

function HeroEditor({
  data,
  onChange,
}: {
  data: HomepageContent["hero"];
  onChange: (v: HomepageContent["hero"]) => void;
}) {
  const set = <K extends keyof HomepageContent["hero"]>(key: K, val: HomepageContent["hero"][K]) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="space-y-6">
      <SectionHeading>Hero Section</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize the main hero banner headline, subtext, actions and background image.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <FieldLabel>Headline Prefix</FieldLabel>
          <Input
            value={data.headlinePrefix}
            onChange={(e) => set("headlinePrefix", e.target.value)}
            placeholder="Africa's Integrated"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Headline Accent (Red)</FieldLabel>
          <Input
            value={data.headlineAccent}
            onChange={(e) => set("headlineAccent", e.target.value)}
            placeholder="Geosynthetics"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Headline Suffix</FieldLabel>
          <Input
            value={data.headlineSuffix}
            onChange={(e) => set("headlineSuffix", e.target.value)}
            placeholder="Execution Platform"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Tagline</FieldLabel>
        <Input
          value={data.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          placeholder="Designed. Supplied. Installed. Tested. Certified."
          className="text-sm"
        />
      </div>

      <div>
        <FieldLabel>Subtext Description</FieldLabel>
        <Textarea
          value={data.subtext}
          onChange={(e) => set("subtext", e.target.value)}
          placeholder="Complete engineered systems for containment..."
          className="text-sm min-h-[72px] resize-none"
        />
      </div>

      <div>
        <FieldLabel>Slide Auto-Play Interval (milliseconds)</FieldLabel>
        <Input
          type="number"
          min={1000}
          step={500}
          value={data.autoPlayInterval ?? 5000}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            set("autoPlayInterval", isNaN(val) ? undefined : val);
          }}
          placeholder="5000"
          className="text-sm w-48"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          The duration each slide remains visible before transitioning to the next (e.g. 5000 = 5
          seconds).
        </p>
      </div>

      {/* Hero Carousel Multi-Image Manager */}
      <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide">Hero Carousel Images</h4>
            <p className="text-xs text-muted-foreground">
              Add multiple high-resolution images to display in the homepage Revolution Hero
              Carousel slider.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const current = data.sliderImages || [];
              set("sliderImages", [
                ...current,
                {
                  image: "",
                  titlePrefix: "",
                  titleAccent: "",
                  titleSuffix: "",
                  subtitle: "",
                  description: "",
                },
              ]);
            }}
            className="text-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Slide Image
          </Button>
        </div>

        {(!data.sliderImages || data.sliderImages.length === 0) && (
          <p className="text-xs text-muted-foreground italic py-2">
            No carousel images added yet. Click "Add Slide Image" above to configure your homepage
            hero slider.
          </p>
        )}

        {(data.sliderImages || []).map((slide, index) => {
          const isStr = typeof slide === "string";
          const slideObj = isStr
            ? {
                image: slide,
                titlePrefix: "",
                titleAccent: "",
                titleSuffix: "",
                subtitle: "",
                description: "",
              }
            : slide;

          const updateSlideField = (key: keyof HeroSlide, val: any) => {
            const updated = [...(data.sliderImages || [])];
            const currentObj =
              typeof updated[index] === "string"
                ? {
                    image: updated[index] as string,
                    titlePrefix: "",
                    titleAccent: "",
                    titleSuffix: "",
                    subtitle: "",
                    description: "",
                  }
                : { ...(updated[index] as HeroSlide) };
            currentObj[key] = val;
            updated[index] = currentObj;
            set("sliderImages", updated);
          };

          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-md bg-background shadow-sm"
            >
              <span className="text-xs font-bold text-muted-foreground mt-2 shrink-0 font-mono">
                #{String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 space-y-4">
                <ImageUploadField
                  label={`Slide ${index + 1} Image URL / Upload`}
                  value={slideObj.image}
                  onChange={(val) => updateSlideField("image", val)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <FieldLabel className="text-[10px] uppercase tracking-wider opacity-85">
                      Title Prefix (Optional)
                    </FieldLabel>
                    <Input
                      value={slideObj.titlePrefix || ""}
                      onChange={(e) => updateSlideField("titlePrefix", e.target.value)}
                      placeholder="e.g. Africa's Integrated"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <FieldLabel className="text-[10px] uppercase tracking-wider opacity-85">
                      Title Accent / Red (Optional)
                    </FieldLabel>
                    <Input
                      value={slideObj.titleAccent || ""}
                      onChange={(e) => updateSlideField("titleAccent", e.target.value)}
                      placeholder="e.g. Geosynthetics"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <FieldLabel className="text-[10px] uppercase tracking-wider opacity-85">
                      Title Suffix (Optional)
                    </FieldLabel>
                    <Input
                      value={slideObj.titleSuffix || ""}
                      onChange={(e) => updateSlideField("titleSuffix", e.target.value)}
                      placeholder="e.g. Execution Platform"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel className="text-[10px] uppercase tracking-wider opacity-85">
                      Subtitle / Tagline (Optional)
                    </FieldLabel>
                    <Input
                      value={slideObj.subtitle || ""}
                      onChange={(e) => updateSlideField("subtitle", e.target.value)}
                      placeholder="e.g. Designed. Supplied. Installed. Tested. Certified."
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <FieldLabel className="text-[10px] uppercase tracking-wider opacity-85">
                      Description / Subtext (Optional)
                    </FieldLabel>
                    <Input
                      value={slideObj.description || ""}
                      onChange={(e) => updateSlideField("description", e.target.value)}
                      placeholder="e.g. Complete engineered systems for containment..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 shrink-0 mt-6 cursor-pointer"
                onClick={() => {
                  const updated = (data.sliderImages || []).filter((_, i) => i !== index);
                  set("sliderImages", updated);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <ImageUploadField
        label="Hero Primary Fallback Image"
        hint="Used as fallback when carousel images are empty"
        value={data.bgImage}
        onChange={(v) => set("bgImage", v)}
      />

      <div className="border-t border-border pt-4 grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Button 1 (Primary - Red)
          </p>
          <div>
            <FieldLabel>Label</FieldLabel>
            <Input
              value={data.btn1Text}
              onChange={(e) => set("btn1Text", e.target.value)}
              placeholder="UPLOAD PROJECT BOQ"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>URL / Path</FieldLabel>
            <Input
              value={data.btn1Url}
              onChange={(e) => set("btn1Url", e.target.value)}
              placeholder="/contacts"
              className="text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Button 2 (Secondary - Outline)
          </p>
          <div>
            <FieldLabel>Label</FieldLabel>
            <Input
              value={data.btn2Text}
              onChange={(e) => set("btn2Text", e.target.value)}
              placeholder="QUICK CONTACT"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>URL / Path</FieldLabel>
            <Input
              value={data.btn2Url}
              onChange={(e) => set("btn2Url", e.target.value)}
              placeholder="/contacts"
              className="text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Button 3 (Tertiary - Outline)
          </p>
          <div>
            <FieldLabel>Label</FieldLabel>
            <Input
              value={data.btn3Text}
              onChange={(e) => set("btn3Text", e.target.value)}
              placeholder="REQUEST MATERIAL SUPPLY"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>URL / Path</FieldLabel>
            <Input
              value={data.btn3Url}
              onChange={(e) => set("btn3Url", e.target.value)}
              placeholder="/contacts"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GsaDifferenceEditor({
  data,
  onChange,
}: {
  data: HomepageContent["gsaDifference"];
  onChange: (v: HomepageContent["gsaDifference"]) => void;
}) {
  const set = <K extends keyof HomepageContent["gsaDifference"]>(
    key: K,
    val: HomepageContent["gsaDifference"][K],
  ) => onChange({ ...data, [key]: val });

  const addStep = () => {
    const nextNum = data.steps.length + 1;
    set("steps", [
      ...data.steps,
      {
        num: nextNum,
        title: "",
        desc: "",
        img: "",
      },
    ]);
  };

  const removeStep = (i: number) => {
    const updatedSteps = data.steps
      .filter((_, idx) => idx !== i)
      .map((step, idx) => ({ ...step, num: idx + 1 })); // Recalculate step numbers
    set("steps", updatedSteps);
  };

  const updateStep = (i: number, patch: Partial<GsaStep>) => {
    const n = [...data.steps];
    n[i] = { ...n[i], ...patch };
    set("steps", n);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>GSA Difference Section</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize the "GSA Difference" headings, descriptions, and the step process layout.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Section Subtitle</FieldLabel>
          <Input
            value={data.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="The GSA Difference"
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CTA Link Text</FieldLabel>
            <Input
              value={data.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
              placeholder="Learn more about GSA"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>CTA Link URL</FieldLabel>
            <Input
              value={data.ctaUrl}
              onChange={(e) => set("ctaUrl", e.target.value)}
              placeholder="/services"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel hint="Supports line breaks using Enter">Section Title</FieldLabel>
        <Textarea
          value={data.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={"One System.\nOne Partner.\nOne Accountability."}
          className="text-sm min-h-[72px] resize-none"
        />
      </div>

      <div>
        <FieldLabel>Description Content</FieldLabel>
        <Textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Unlike product suppliers or installation contractors..."
          className="text-sm min-h-[72px] resize-none"
        />
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Execution Process Steps ({data.steps.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addStep} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Step
          </Button>
        </div>
        <div className="space-y-3">
          {data.steps.map((step, i) => (
            <CollapsibleCard key={i} index={i} title={step.title} onRemove={() => removeStep(i)}>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FieldLabel>Step Number</FieldLabel>
                  <Input
                    type="number"
                    value={step.num}
                    onChange={(e) => updateStep(i, { num: parseInt(e.target.value) || i + 1 })}
                    placeholder="1"
                    className="text-sm font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <FieldLabel>Step Title</FieldLabel>
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(i, { title: e.target.value })}
                    placeholder="e.g. Design"
                    className="text-sm"
                  />
                </div>
              </div>
              <ImageUploadField
                label="Step Image"
                value={step.img}
                onChange={(v) => updateStep(i, { img: v })}
              />
              <div>
                <FieldLabel>Step Description</FieldLabel>
                <Input
                  value={step.desc}
                  onChange={(e) => updateStep(i, { desc: e.target.value })}
                  placeholder="We design the right system for your application."
                  className="text-sm"
                />
              </div>
            </CollapsibleCard>
          ))}
          {data.steps.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No steps yet — click Add Step.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TrustBadgesEditor({
  badges,
  onChange,
}: {
  badges: TrustBadge[];
  onChange: (v: TrustBadge[]) => void;
}) {
  const add = () => onChange([...badges, { icon: "", text: "" }]);
  const remove = (i: number) => onChange(badges.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<TrustBadge>) => {
    const n = [...badges];
    n[i] = { ...n[i], ...patch };
    onChange(n);
  };

  return (
    <div className="space-y-4">
      <SectionHeading>Trust Badges</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Badges displayed in the trust bar beneath the hero. Each badge has an icon image and text.
      </p>
      <div className="space-y-3">
        {badges.map((b, i) => (
          <CollapsibleCard key={i} index={i} title={b.text} onRemove={() => remove(i)}>
            <ImageUploadField
              label="Badge Icon Image"
              hint="Optional – upload/link a small icon image URL"
              value={b.icon}
              onChange={(v) => update(i, { icon: v })}
            />
            <div>
              <FieldLabel>Badge Text</FieldLabel>
              <Input
                value={b.text}
                onChange={(e) => update(i, { text: e.target.value })}
                placeholder='e.g. "GAI MEMBER / One of only 5 in Africa"'
                className="text-sm"
              />
            </div>
          </CollapsibleCard>
        ))}
      </div>
      {badges.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No badges yet — click Add.</p>
      )}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 text-xs">
        <Plus className="h-3 w-3" /> Add Badge
      </Button>
    </div>
  );
}

function EngineeredSystemsEditor({
  data,
  onChange,
}: {
  data: HomepageContent["engineeredSystems"];
  onChange: (v: HomepageContent["engineeredSystems"]) => void;
}) {
  const set = <K extends keyof HomepageContent["engineeredSystems"]>(
    key: K,
    val: HomepageContent["engineeredSystems"][K],
  ) => onChange({ ...data, [key]: val });

  const addCard = () =>
    set("cards", [
      ...data.cards,
      {
        id: `card-${Date.now()}`,
        title: "",
        image: "",
        linkUrl: "",
      },
    ]);
  const removeCard = (i: number) =>
    set(
      "cards",
      data.cards.filter((_, idx) => idx !== i),
    );
  const updateCard = (i: number, patch: Partial<ApplicationCard>) => {
    const n = [...data.cards];
    n[i] = { ...n[i], ...patch };
    set("cards", n);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Engineered Systems / Application Cards</SectionHeading>

      <div className="space-y-3">
        <div>
          <FieldLabel>Section Title</FieldLabel>
          <Input
            value={data.sectionTitle}
            onChange={(e) => set("sectionTitle", e.target.value)}
            placeholder="ENGINEERED SYSTEMS FOR EVERY APPLICATION"
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CTA Link Text</FieldLabel>
            <Input
              value={data.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
              placeholder="VIEW ALL APPLICATIONS →"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>CTA Link URL</FieldLabel>
            <Input
              value={data.ctaUrl}
              onChange={(e) => set("ctaUrl", e.target.value)}
              placeholder="/applications"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Application Cards ({data.cards.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addCard} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Card
          </Button>
        </div>
        <div className="space-y-3">
          {data.cards.map((card, i) => (
            <CollapsibleCard
              key={card.id}
              index={i}
              title={card.title}
              onRemove={() => removeCard(i)}
            >
              <div>
                <FieldLabel>Card Title</FieldLabel>
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                  placeholder="MINING SYSTEMS"
                  className="text-sm"
                />
              </div>
              <ImageUploadField
                label="Card Background Image"
                value={card.image}
                onChange={(v) => updateCard(i, { image: v })}
              />
              <div>
                <FieldLabel hint="Path or URL — e.g. /applications/mining-systems">
                  Card Link URL
                </FieldLabel>
                <Input
                  value={card.linkUrl}
                  onChange={(e) => updateCard(i, { linkUrl: e.target.value })}
                  placeholder="/applications/mining-systems"
                  className="text-sm font-mono"
                />
              </div>
            </CollapsibleCard>
          ))}
          {data.cards.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No cards yet — click Add Card.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PartnersEditor({
  data,
  onChange,
}: {
  data: HomepageContent["partners"];
  onChange: (v: HomepageContent["partners"]) => void;
}) {
  const set = <K extends keyof HomepageContent["partners"]>(
    key: K,
    val: HomepageContent["partners"][K],
  ) => onChange({ ...data, [key]: val });

  const addLogo = () => set("logos", [...data.logos, { name: "", logo: "" }]);
  const removeLogo = (i: number) =>
    set(
      "logos",
      data.logos.filter((_, idx) => idx !== i),
    );
  const updateLogo = (i: number, patch: Partial<PartnerLogo>) => {
    const n = [...data.logos];
    n[i] = { ...n[i], ...patch };
    set("logos", n);
  };

  return (
    <div className="space-y-5">
      <SectionHeading>Global Partners / Logo Carousel</SectionHeading>
      <div className="space-y-3">
        <div>
          <FieldLabel hint='Shown in red above the logos, e.g. "GLOBAL BEST-IN-CLASS MATERIALS"'>
            Section Subtitle
          </FieldLabel>
          <Input
            value={data.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="GLOBAL BEST-IN-CLASS MATERIALS"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Section Description</FieldLabel>
          <Input
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Integrated into our engineered systems"
            className="text-sm"
          />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Partner Logos ({data.logos.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addLogo} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Logo
          </Button>
        </div>
        <div className="space-y-3">
          {data.logos.map((logo, i) => (
            <CollapsibleCard key={i} index={i} title={logo.name} onRemove={() => removeLogo(i)}>
              <div>
                <FieldLabel>Brand Name</FieldLabel>
                <Input
                  value={logo.name}
                  onChange={(e) => updateLogo(i, { name: e.target.value })}
                  placeholder="e.g. Solmax"
                  className="text-sm"
                />
              </div>
              <ImageUploadField
                label="Logo Image URL"
                value={logo.logo}
                onChange={(v) => updateLogo(i, { logo: v })}
              />
            </CollapsibleCard>
          ))}
          {data.logos.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No logos yet — click Add Logo.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ServicesEditor({
  data,
  onChange,
}: {
  data: HomepageContent["services"];
  onChange: (v: HomepageContent["services"]) => void;
}) {
  const set = <K extends keyof HomepageContent["services"]>(
    key: K,
    val: HomepageContent["services"][K],
  ) => onChange({ ...data, [key]: val });

  const addCard = () =>
    set("cards", [
      ...data.cards,
      { id: `svc-${Date.now()}`, icon: "", title: "", description: "" },
    ]);
  const removeCard = (i: number) =>
    set(
      "cards",
      data.cards.filter((_, idx) => idx !== i),
    );
  const updateCard = (i: number, patch: Partial<ServiceCard>) => {
    const n = [...data.cards];
    n[i] = { ...n[i], ...patch };
    set("cards", n);
  };

  const addChecklistItem = () => set("qualityChecklist", [...data.qualityChecklist, ""]);
  const removeChecklistItem = (i: number) =>
    set(
      "qualityChecklist",
      data.qualityChecklist.filter((_, idx) => idx !== i),
    );
  const updateChecklistItem = (i: number, v: string) => {
    const n = [...data.qualityChecklist];
    n[i] = v;
    set("qualityChecklist", n);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Services Grid (Left Side)</SectionHeading>

      <div className="space-y-3">
        <div>
          <FieldLabel>Section Title</FieldLabel>
          <Input
            value={data.sectionTitle}
            onChange={(e) => set("sectionTitle", e.target.value)}
            placeholder="OUR SERVICES"
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CTA Text</FieldLabel>
            <Input
              value={data.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
              placeholder="VIEW ALL SERVICES →"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>CTA URL</FieldLabel>
            <Input
              value={data.ctaUrl}
              onChange={(e) => set("ctaUrl", e.target.value)}
              placeholder="/services"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Service Cards ({data.cards.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addCard} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Card
          </Button>
        </div>
        <div className="space-y-3">
          {data.cards.map((card, i) => (
            <CollapsibleCard
              key={card.id}
              index={i}
              title={card.title}
              onRemove={() => removeCard(i)}
            >
              <ImageUploadField
                label="Card Icon"
                hint="Small icon image (optional)"
                value={card.icon}
                onChange={(v) => updateCard(i, { icon: v })}
              />
              <div>
                <FieldLabel>Card Title</FieldLabel>
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                  placeholder="DESIGN SUPPORT"
                  className="text-sm"
                />
              </div>
              <div>
                <FieldLabel>Short Description</FieldLabel>
                <Input
                  value={card.description}
                  onChange={(e) => updateCard(i, { description: e.target.value })}
                  placeholder="Engineered support, end-to-end"
                  className="text-sm"
                />
              </div>
            </CollapsibleCard>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5 space-y-4">
        <SectionHeading>Quality Callout Box (Right Side)</SectionHeading>
        <div>
          <FieldLabel>Box Title</FieldLabel>
          <Input
            value={data.qualityBoxTitle}
            onChange={(e) => set("qualityBoxTitle", e.target.value)}
            placeholder="NO SYSTEM LEAVES SITE UNVERIFIED."
            className="text-sm"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <FieldLabel>Checklist Items</FieldLabel>
            <Button
              variant="ghost"
              size="sm"
              onClick={addChecklistItem}
              className="h-6 text-xs text-primary gap-1"
            >
              <Plus className="h-3 w-3" /> Add Item
            </Button>
          </div>
          <div className="space-y-2">
            {data.qualityChecklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateChecklistItem(i, e.target.value)}
                  placeholder="e.g. Weld Integrity Testing…"
                  className="text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeChecklistItem(i)}
                  className="h-8 w-8 rounded flex items-center justify-center text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CTA Button Text</FieldLabel>
            <Input
              value={data.qualityCtaText}
              onChange={(e) => set("qualityCtaText", e.target.value)}
              placeholder="VIEW QA/QC PROCESS →"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>CTA Button URL</FieldLabel>
            <Input
              value={data.qualityCtaUrl}
              onChange={(e) => set("qualityCtaUrl", e.target.value)}
              placeholder="/quality-assurance"
              className="text-sm font-mono"
            />
          </div>
        </div>
        <ImageUploadField
          label="Box Background Image"
          hint="Subtle background image behind the dark callout box"
          value={data.qualityBgImage}
          onChange={(v) => set("qualityBgImage", v)}
        />
      </div>
    </div>
  );
}

function PresenceEditor({
  data,
  onChange,
}: {
  data: HomepageContent["presence"];
  onChange: (v: HomepageContent["presence"]) => void;
}) {
  const set = <K extends keyof HomepageContent["presence"]>(
    key: K,
    val: HomepageContent["presence"][K],
  ) => onChange({ ...data, [key]: val });

  const addStat = () =>
    set("stats", [...data.stats, { id: `stat-${Date.now()}`, value: "", label: "" }]);
  const removeStat = (i: number) =>
    set(
      "stats",
      data.stats.filter((_, idx) => idx !== i),
    );
  const updateStat = (i: number, patch: Partial<StatCounter>) => {
    const n = [...data.stats];
    n[i] = { ...n[i], ...patch };
    set("stats", n);
  };

  const addOffice = () =>
    set("offices", [...data.offices, { id: `office-${Date.now()}`, name: "", type: "" }]);
  const removeOffice = (i: number) =>
    set(
      "offices",
      data.offices.filter((_, idx) => idx !== i),
    );
  const updateOffice = (i: number, patch: Partial<OfficeLocation>) => {
    const n = [...data.offices];
    n[i] = { ...n[i], ...patch };
    set("offices", n);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Stats & Pan-African Presence</SectionHeading>

      {/* Stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Counter Metrics ({data.stats.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addStat} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Stat
          </Button>
        </div>
        <div className="space-y-3">
          {data.stats.map((stat, i) => (
            <CollapsibleCard
              key={stat.id}
              index={i}
              title={`${stat.value} — ${stat.label}`}
              onRemove={() => removeStat(i)}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Stat Number / Value</FieldLabel>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, { value: e.target.value })}
                    placeholder="20+"
                    className="text-sm font-mono"
                  />
                </div>
                <div>
                  <FieldLabel>Descriptive Label</FieldLabel>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(i, { label: e.target.value })}
                    placeholder="Years Industry Experience"
                    className="text-sm"
                  />
                </div>
              </div>
            </CollapsibleCard>
          ))}
        </div>
      </div>

      {/* Pan-African Presence */}
      <div className="border-t border-border pt-5 space-y-3">
        <div>
          <FieldLabel>Section Title</FieldLabel>
          <Input
            value={data.presenceTitle}
            onChange={(e) => set("presenceTitle", e.target.value)}
            placeholder="PAN-AFRICAN PRESENCE"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Section Subtitle</FieldLabel>
          <Input
            value={data.presenceSubtitle}
            onChange={(e) => set("presenceSubtitle", e.target.value)}
            placeholder="One partner. Africa-wide execution."
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Regional Branches & Coverage ({data.offices.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addOffice} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Location
          </Button>
        </div>
        <div className="space-y-2">
          {data.offices.map((office, i) => (
            <div
              key={office.id}
              className="flex items-start md:items-center gap-2 border border-border rounded-md p-3 bg-surface/30"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1 md:hidden">
                    Country Name
                  </span>
                  <Input
                    value={office.name}
                    onChange={(e) => updateOffice(i, { name: e.target.value })}
                    placeholder="e.g. South Africa"
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1 md:hidden">
                    Office Type / Hub
                  </span>
                  <Input
                    value={office.type}
                    onChange={(e) => updateOffice(i, { type: e.target.value })}
                    placeholder="e.g. HQ / REGIONAL OFFICE"
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1 md:hidden">
                    Link URL (Optional)
                  </span>
                  <Input
                    value={office.linkUrl || ""}
                    onChange={(e) => updateOffice(i, { linkUrl: e.target.value })}
                    placeholder="e.g. https://geosynthetics.co.za/..."
                    className="text-sm h-8 font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeOffice(i)}
                className="h-8 w-8 rounded flex items-center justify-center text-destructive hover:bg-destructive/10 shrink-0 mt-6 md:mt-0"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsEditor({
  data,
  onChange,
}: {
  data: HomepageContent["projects"];
  onChange: (v: HomepageContent["projects"]) => void;
}) {
  const set = <K extends keyof HomepageContent["projects"]>(
    key: K,
    val: HomepageContent["projects"][K],
  ) => onChange({ ...data, [key]: val });

  const addCard = () =>
    set("cards", [
      ...data.cards,
      { id: `proj-${Date.now()}`, image: "", tag: "", title: "", location: "", systemDetails: "" },
    ]);
  const removeCard = (i: number) =>
    set(
      "cards",
      data.cards.filter((_, idx) => idx !== i),
    );
  const updateCard = (i: number, patch: Partial<ProjectCard>) => {
    const n = [...data.cards];
    n[i] = { ...n[i], ...patch };
    set("cards", n);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Case Studies / Projects Showcase</SectionHeading>

      <div className="space-y-3">
        <div>
          <FieldLabel>Section Title</FieldLabel>
          <Input
            value={data.sectionTitle}
            onChange={(e) => set("sectionTitle", e.target.value)}
            placeholder="PROVEN ON PROJECTS ACROSS AFRICA"
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CTA Text</FieldLabel>
            <Input
              value={data.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
              placeholder="VIEW ALL CASE STUDIES →"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>CTA URL</FieldLabel>
            <Input
              value={data.ctaUrl}
              onChange={(e) => set("ctaUrl", e.target.value)}
              placeholder="/resources"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Project Cards ({data.cards.length})</FieldLabel>
          <Button variant="outline" size="sm" onClick={addCard} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" /> Add Project
          </Button>
        </div>
        <div className="space-y-3">
          {data.cards.map((card, i) => (
            <CollapsibleCard
              key={card.id}
              index={i}
              title={card.title}
              onRemove={() => removeCard(i)}
            >
              <ImageUploadField
                label="Project Cover Photo"
                value={card.image}
                onChange={(v) => updateCard(i, { image: v })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Category Tag</FieldLabel>
                  <Input
                    value={card.tag}
                    onChange={(e) => updateCard(i, { tag: e.target.value })}
                    placeholder="RESERVOIR LINING"
                    className="text-sm"
                  />
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    value={card.location}
                    onChange={(e) => updateCard(i, { location: e.target.value })}
                    placeholder="South Africa"
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Project Name</FieldLabel>
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                  placeholder="BRANDVLEI RESERVOIR LINING"
                  className="text-sm"
                />
              </div>
              <div>
                <FieldLabel>System Details</FieldLabel>
                <Input
                  value={card.systemDetails}
                  onChange={(e) => updateCard(i, { systemDetails: e.target.value })}
                  placeholder="HDPE Lining System"
                  className="text-sm"
                />
              </div>
            </CollapsibleCard>
          ))}
          {data.cards.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No project cards yet — click Add Project.
            </p>
          )}
        </div>
      </div>

      {/* Catalogue Callout Box */}
      <div className="border-t border-border pt-5 space-y-3">
        <SectionHeading>Catalogue Callout Box</SectionHeading>
        <div>
          <FieldLabel>Box Heading</FieldLabel>
          <Input
            value={data.catalogueBoxHeading}
            onChange={(e) => set("catalogueBoxHeading", e.target.value)}
            placeholder="EXPLORE OUR CATALOGUE"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>Box Content</FieldLabel>
          <Textarea
            value={data.catalogueBoxContent}
            onChange={(e) => set("catalogueBoxContent", e.target.value)}
            placeholder="Search, filter and explore over 200 engineered materials…"
            className="text-sm min-h-[72px] resize-none"
          />
        </div>
        <div>
          <FieldLabel>Search Bar Placeholder Text</FieldLabel>
          <Input
            value={data.catalogueSearchPlaceholder}
            onChange={(e) => set("catalogueSearchPlaceholder", e.target.value)}
            placeholder="Search products, applications, standards…"
            className="text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>CTA Button Text</FieldLabel>
            <Input
              value={data.catalogueCtaText}
              onChange={(e) => set("catalogueCtaText", e.target.value)}
              placeholder="VIEW FULL CATALOGUE →"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>CTA Button URL</FieldLabel>
            <Input
              value={data.catalogueCtaUrl}
              onChange={(e) => set("catalogueCtaUrl", e.target.value)}
              placeholder="/catalogue"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BoqBannerEditor({
  data,
  onChange,
}: {
  data: HomepageContent["boqBanner"];
  onChange: (v: HomepageContent["boqBanner"]) => void;
}) {
  const set = <K extends keyof HomepageContent["boqBanner"]>(
    key: K,
    val: HomepageContent["boqBanner"][K],
  ) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-5">
      <SectionHeading>Bottom BOQ / CTA Banner</SectionHeading>
      <p className="text-xs text-muted-foreground">
        The high-conversion red banner above the footer.
      </p>
      <div>
        <FieldLabel>Banner Title</FieldLabel>
        <Input
          value={data.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="SUBMIT YOUR BOQ."
          className="text-sm font-semibold"
        />
      </div>
      <div>
        <FieldLabel>Subtitle</FieldLabel>
        <Input
          value={data.subtitle}
          onChange={(e) => set("subtitle", e.target.value)}
          placeholder="GET A QUOTE – NOT JUST A PRICE."
          className="text-sm"
        />
      </div>
      <div>
        <FieldLabel>Paragraph Content</FieldLabel>
        <Textarea
          value={data.paragraph}
          onChange={(e) => set("paragraph", e.target.value)}
          placeholder="Upload your BOQ or speak to our technical team for expert recommendations and support."
          className="text-sm min-h-[72px] resize-none"
        />
      </div>

      <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Button 1 (Primary)
          </p>
          <div>
            <FieldLabel>Label</FieldLabel>
            <Input
              value={data.btn1Text}
              onChange={(e) => set("btn1Text", e.target.value)}
              placeholder="UPLOAD PROJECT BOQ"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>URL / Action</FieldLabel>
            <Input
              value={data.btn1Url}
              onChange={(e) => set("btn1Url", e.target.value)}
              placeholder="/contacts"
              className="text-sm font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Button 2 (Secondary)
          </p>
          <div>
            <FieldLabel>Label</FieldLabel>
            <Input
              value={data.btn2Text}
              onChange={(e) => set("btn2Text", e.target.value)}
              placeholder="QUICK CONTACT"
              className="text-sm"
            />
          </div>
          <div>
            <FieldLabel>URL / Action</FieldLabel>
            <Input
              value={data.btn2Url}
              onChange={(e) => set("btn2Url", e.target.value)}
              placeholder="/contacts"
              className="text-sm font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const HP_TABS = [
  { id: "hero", label: "Hero Section" },
  { id: "gsaDifference", label: "GSA Difference" },
  { id: "trust", label: "Trust Bar" },
  { id: "systems", label: "App Systems" },
  { id: "partners", label: "Partners" },
  { id: "services", label: "Services & QA" },
  { id: "presence", label: "Stats & Presence" },
  { id: "projects", label: "Projects" },
  { id: "boq", label: "BOQ Banner" },
];

// ─── Main exported component ──────────────────────────────────────────────────

// Module-level in-memory cache to keep data across route transitions / remounts
let homepageContentCache: HomepageContent | null = null;

export function HomepageBuilderTab() {
  const [content, setContent] = useState<HomepageContent>(() => {
    return homepageContentCache ?? DEFAULT_HOMEPAGE_CONTENT;
  });
  const [loading, setLoading] = useState(!homepageContentCache);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Load from Supabase
  const load = useCallback(async () => {
    // Only show loading if we don't have a cached version
    if (!homepageContentCache) {
      setLoading(true);
    }
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load homepage content: " + error.message);
    } else if (data?.value) {
      const merged = { ...DEFAULT_HOMEPAGE_CONTENT, ...(data.value as Partial<HomepageContent>) };
      // Merge with defaults so any new fields are populated
      setContent(merged);
      homepageContentCache = merged;
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
      .upsert({ key: SUPABASE_KEY, value: content as any }, { onConflict: "key" });
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Homepage content saved successfully!");
      setDirty(false);
      homepageContentCache = content; // Update the cache
    }
    setSaving(false);
  };

  const update = (patch: Partial<HomepageContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      homepageContentCache = next; // Keep cached copy in sync with unsaved state for visual preservation
      return next;
    });
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading homepage builder…</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sticky sub-header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-surface/30">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wide">Homepage Content</span>
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
          {saving ? "Updating..." : "Save Homepage"}
        </Button>
      </div>

      {/* Section tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
          {HP_TABS.map((t) => (
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

          <TabsContent value="gsaDifference" className="p-6 m-0">
            <GsaDifferenceEditor
              data={content.gsaDifference}
              onChange={(v) => update({ gsaDifference: v })}
            />
          </TabsContent>

          <TabsContent value="trust" className="p-6 m-0">
            <TrustBadgesEditor
              badges={content.trustBadges}
              onChange={(v) => update({ trustBadges: v })}
            />
          </TabsContent>

          <TabsContent value="systems" className="p-6 m-0">
            <EngineeredSystemsEditor
              data={content.engineeredSystems}
              onChange={(v) => update({ engineeredSystems: v })}
            />
          </TabsContent>

          <TabsContent value="partners" className="p-6 m-0">
            <PartnersEditor data={content.partners} onChange={(v) => update({ partners: v })} />
          </TabsContent>

          <TabsContent value="services" className="p-6 m-0">
            <ServicesEditor data={content.services} onChange={(v) => update({ services: v })} />
          </TabsContent>

          <TabsContent value="presence" className="p-6 m-0">
            <PresenceEditor data={content.presence} onChange={(v) => update({ presence: v })} />
          </TabsContent>

          <TabsContent value="projects" className="p-6 m-0">
            <ProjectsEditor data={content.projects} onChange={(v) => update({ projects: v })} />
          </TabsContent>

          <TabsContent value="boq" className="p-6 m-0">
            <BoqBannerEditor data={content.boqBanner} onChange={(v) => update({ boqBanner: v })} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
