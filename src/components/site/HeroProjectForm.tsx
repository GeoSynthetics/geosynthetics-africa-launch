import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Upload, ArrowRight, Lock, CheckCircle2, Loader2, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DEFAULT_REGIONAL_COVERAGE,
  type RegionItem,
  isWestAfricanRegion,
  isSouthAfricanRegion,
} from "@/types/regionalCoverage";
import { submitHeroProjectRequest, type HeroSubmissionResult } from "@/services/leadRoutingService";

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".dwg",
  ".dxf",
  ".xls",
  ".xlsx",
  ".doc",
  ".docx",
  ".csv",
  ".zip",
  ".png",
  ".jpg",
  ".jpeg",
];

interface HeroProjectFormProps {
  /** Optional preloaded dynamic regions list from site_config */
  regions?: RegionItem[] | null;
  className?: string;
}

export function HeroProjectForm({ regions, className = "" }: HeroProjectFormProps) {
  const [need, setNeed] = useState("");
  const [region, setRegion] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<HeroSubmissionResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Region options: merge preloaded dynamic regions or fallback to DEFAULT_REGIONAL_COVERAGE
  const availableRegions =
    regions && Array.isArray(regions) && regions.length > 0 ? regions : DEFAULT_REGIONAL_COVERAGE;

  // Additional West African regional options to ensure complete Pan-African coverage
  const additionalWestAfrican = [
    { country: "Senegal", code: "SEN" },
    { country: "Mali", code: "MLI" },
    { country: "Burkina Faso", code: "BFA" },
    { country: "Guinea", code: "GIN" },
    { country: "Nigeria", code: "NGA" },
  ];

  const handleFileSelect = (incomingFile: File | null) => {
    if (!incomingFile) return;

    const ext = "." + (incomingFile.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`${incomingFile.name}: Unsupported file type. Please upload PDF, DWG, or XLS.`);
      return;
    }

    if (incomingFile.size > MAX_BYTES) {
      toast.error(`${incomingFile.name} exceeds the 20 MB limit.`);
      return;
    }

    setFile(incomingFile);
    toast.success(`Attached ${incomingFile.name}`);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    handleFileSelect(selected);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!need.trim()) {
      toast.error("Please describe your project requirements.");
      return;
    }
    if (!region.trim()) {
      toast.error("Please select a region or country.");
      return;
    }
    if (!contact.trim()) {
      toast.error("Please provide an email or phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitHeroProjectRequest({
        need: need.trim(),
        region: region.trim(),
        contact: contact.trim(),
        file,
      });

      setSubmissionResult(result);
      toast.success(result.message);
    } catch (err: any) {
      console.error("Hero form submission error:", err);
      toast.error(err.message || "Failed to submit project request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNeed("");
    setRegion("");
    setContact("");
    setFile(null);
    setSubmissionResult(null);
  };

  // -------------------------------------------------------------
  // Render Success Confirmation View
  // -------------------------------------------------------------
  if (submissionResult) {
    const { routedTo } = submissionResult;
    return (
      <div
        className={`w-full max-w-[440px] xl:max-w-[460px] rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-white/10 p-6 sm:p-7 text-white shadow-2xl transition-all ${className}`}
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-in zoom-in-90 duration-300">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <span className="px-3 py-1 rounded-full border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 mb-2">
            Request Logged & Dispatched
          </span>

          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
            We've Received Your Request
          </h3>

          <div className="bg-zinc-900/80 rounded-xl p-4 border border-white/10 w-full text-left my-4 text-xs space-y-2">
            <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              Assigned Regional Desk
            </div>
            <div className="text-sm font-semibold text-white">
              {routedTo.targetName}
            </div>
            <div className="text-xs text-zinc-300">
              {routedTo.targetRole} ·{" "}
              <span className="text-primary font-mono">{routedTo.targetEmail}</span>
            </div>
            <div className="text-[11px] text-zinc-400 pt-1 border-t border-white/10">
              {routedTo.isWestAfrica
                ? "Directly assigned to Mamadou Coulibaly (Ivory Coast Regional Hub). Expect a technical response within 24 hours."
                : "Assigned to our South Africa Operations Desk at Johannesburg HQ. Expect a technical response within 24 hours."}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="mt-2 w-full bg-transparent border-white/20 text-white hover:bg-white/10 uppercase font-bold tracking-wider text-xs h-10"
          >
            Submit Another Project
          </Button>
        </div>

        <div className="pt-4 mt-2 border-t border-white/10 text-center">
          <div className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase flex items-center justify-center gap-2">
            <span>SUPPLY</span>
            <span className="text-primary font-bold">•</span>
            <span>INSTALLATION</span>
            <span className="text-primary font-bold">•</span>
            <span>QA/QC</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-zinc-400" />
            <span>One team, one warranty · BOQs kept confidential</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render Form View (matching Image 3)
  // -------------------------------------------------------------
  return (
    <div
      className={`w-full max-w-[440px] xl:max-w-[460px] rounded-2xl bg-zinc-950/85 backdrop-blur-md border border-white/10 p-5 sm:p-6 text-white shadow-2xl ${className}`}
    >
      {/* Header: Red glowing status beacon + "ALL OF AFRICA" badge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">
            START YOUR PROJECT
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-wider text-zinc-300 bg-white/5">
          ALL OF AFRICA
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* WHAT DO YOU NEED? */}
        <div>
          <label
            htmlFor="hero-need"
            className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
          >
            WHAT DO YOU NEED?
          </label>
          <textarea
            id="hero-need"
            rows={2}
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="Supply and install: geogrid basal reinforcement, 40 km haul road, DRC"
            className="w-full bg-white text-zinc-900 border border-zinc-200 placeholder:text-zinc-400 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-normal leading-relaxed"
            required
          />
        </div>

        {/* 2-Column Row: REGION & EMAIL OR PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* REGION (dynamically loaded from our regions/countries list) */}
          <div>
            <label
              htmlFor="hero-region"
              className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              REGION
            </label>
            <div className="relative">
              <select
                id="hero-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-normal appearance-none cursor-pointer pr-8"
                required
              >
                <option value="" disabled>
                  Select region
                </option>
                <optgroup label="Operating Regional Hubs">
                  {availableRegions.map((r) => (
                    <option key={r.code || r.country} value={r.country}>
                      {r.flag ? `${r.flag} ` : ""}
                      {r.country} {r.isWestAfrica ? "(West Africa)" : ""}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other West African Territories">
                  {additionalWestAfrican
                    .filter((wa) => !availableRegions.some((r) => r.country === wa.country))
                    .map((wa) => (
                      <option key={wa.code} value={wa.country}>
                        {wa.country} (West Africa)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Other African Territories">
                  <option value="Pan-African (Multiple Countries)">
                    Pan-African / Cross-Border
                  </option>
                  <option value="Other African Country">Other African Country</option>
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* EMAIL OR PHONE */}
          <div>
            <label
              htmlFor="hero-contact"
              className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              EMAIL OR PHONE
            </label>
            <input
              id="hero-contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="name@company.co"
              className="w-full bg-white text-zinc-900 border border-zinc-200 placeholder:text-zinc-400 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-normal"
              required
            />
          </div>
        </div>

        {/* ATTACH BOQ OR DRAWINGS */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.dwg,.dxf,.xls,.xlsx,.doc,.docx,.csv,.zip,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.files?.[0] ?? null;
                handleFileSelect(dropped);
              }}
              className="border border-white/15 hover:border-white/30 bg-zinc-900/60 hover:bg-zinc-900/90 rounded-xl p-3 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-500/20 transition-colors">
                <Upload className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                  Attach BOQ or drawings
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  Optional · PDF, DWG, XLS · Up to 20 MB
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-red-500/40 bg-zinc-900/90 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-lg border border-red-500/40 bg-red-500/15 flex items-center justify-center text-red-400 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                title="Remove attachment"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* SEND REQUEST BUTTON */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-white text-zinc-950 hover:bg-zinc-100 font-bold uppercase tracking-wider py-5 rounded-md flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer border-0 mt-1"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
              <span>SENDING REQUEST...</span>
            </>
          ) : (
            <>
              <span>SEND REQUEST</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer / Trust Guarantee Strip */}
      <div className="pt-4 mt-4 border-t border-white/10 text-center">
        <div className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase flex items-center justify-center gap-2">
          <span>SUPPLY</span>
          <span className="text-red-500 font-bold">•</span>
          <span>INSTALLATION</span>
          <span className="text-red-500 font-bold">•</span>
          <span>QA/QC</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3 text-zinc-400" />
          <span>One team, one warranty · BOQs kept confidential</span>
        </div>
      </div>
    </div>
  );
}
