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
        className={`w-full max-w-[440px] xl:max-w-[460px] rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/15 p-6 sm:p-7 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-300 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none rounded-2xl" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center py-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-in zoom-in-90 duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <span className="px-3 py-1 rounded-full border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 mb-2">
            Request Logged & Dispatched
          </span>

          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
            We've Received Your Request
          </h3>

          <div className="bg-zinc-900/60 backdrop-blur-md rounded-xl p-4 border border-white/15 w-full text-left my-4 text-xs space-y-2 shadow-inner">
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
            className="mt-2 w-full bg-white/[0.05] hover:bg-white/[0.12] border-white/20 hover:border-white/40 text-white uppercase font-bold tracking-wider text-xs h-10 rounded-xl transition-all cursor-pointer"
          >
            Submit Another Project
          </Button>
        </div>

        <div className="relative z-10 pt-4 mt-2 border-t border-white/10 text-center">
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
      className={`w-full max-w-[440px] xl:max-w-[460px] rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/15 p-5 sm:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Glassmorphic Ambient Sheen & Subtle Red Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      {/* Header: Red glowing status beacon + "ALL OF AFRICA" badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">
            START YOUR PROJECT
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-wider text-zinc-300 bg-white/5 backdrop-blur-sm">
          ALL OF AFRICA
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-3.5">
        {/* WHAT DO YOU NEED? */}
        <div className="group/field">
          <label
            htmlFor="hero-need"
            className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 group-hover/field:text-white transition-colors duration-200 mb-1.5"
          >
            WHAT DO YOU NEED?
          </label>
          <textarea
            id="hero-need"
            rows={2}
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="Supply and install: geogrid basal reinforcement, 40 km haul road, DRC"
            className="w-full bg-white/[0.06] hover:bg-white/[0.1] focus:bg-zinc-950/90 text-white placeholder:text-zinc-400 rounded-xl p-3.5 text-sm border border-white/15 hover:border-white/40 focus:border-red-500/80 focus:outline-none focus:ring-2 focus:ring-red-500/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.07)] focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] backdrop-blur-md transition-all duration-200 resize-none font-normal leading-relaxed cursor-text"
            required
          />
        </div>

        {/* 2-Column Row: REGION & EMAIL OR PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* REGION (dynamically loaded from our regions/countries list) */}
          <div className="group/field">
            <label
              htmlFor="hero-region"
              className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 group-hover/field:text-white transition-colors duration-200 mb-1.5"
            >
              REGION
            </label>
            <div className="relative">
              <select
                id="hero-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white/[0.06] hover:bg-white/[0.1] focus:bg-zinc-950/90 text-white rounded-xl h-11 px-3.5 text-sm border border-white/15 hover:border-white/40 focus:border-red-500/80 focus:outline-none focus:ring-2 focus:ring-red-500/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.07)] focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] backdrop-blur-md transition-all duration-200 font-normal appearance-none cursor-pointer pr-9 [&>option]:bg-zinc-900 [&>option]:text-white [&>optgroup]:bg-zinc-950 [&>optgroup]:text-zinc-400"
                required
              >
                <option value="" disabled className="text-zinc-400">
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 group-hover/field:text-white transition-colors duration-200">
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
          <div className="group/field">
            <label
              htmlFor="hero-contact"
              className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 group-hover/field:text-white transition-colors duration-200 mb-1.5"
            >
              EMAIL OR PHONE
            </label>
            <input
              id="hero-contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="name@company.co"
              className="w-full bg-white/[0.06] hover:bg-white/[0.1] focus:bg-zinc-950/90 text-white placeholder:text-zinc-400 rounded-xl h-11 px-3.5 text-sm border border-white/15 hover:border-white/40 focus:border-red-500/80 focus:outline-none focus:ring-2 focus:ring-red-500/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.07)] focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] backdrop-blur-md transition-all duration-200 font-normal cursor-text"
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
              className="border border-white/15 hover:border-red-500/50 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md rounded-xl p-3 flex items-center gap-3 transition-all duration-200 cursor-pointer group hover:shadow-[0_0_20px_rgba(239,68,68,0.12)]"
            >
              <div className="h-10 w-10 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-500/20 group-hover:scale-105 group-hover:border-red-500/60 transition-all duration-200">
                <Upload className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors duration-200">
                  Attach BOQ or drawings
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  Optional · PDF, DWG, XLS · Up to 20 MB
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-red-500/40 bg-zinc-900/70 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-3 shadow-inner">
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
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
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
          className="w-full bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] font-bold uppercase tracking-wider h-12 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all duration-200 cursor-pointer border-0 mt-1 active:scale-[0.99] group/btn"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
              <span>SENDING REQUEST...</span>
            </>
          ) : (
            <>
              <span>SEND REQUEST</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </Button>
      </form>

      {/* Footer / Trust Guarantee Strip */}
      <div className="relative z-10 pt-4 mt-4 border-t border-white/10 text-center">
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
