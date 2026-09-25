import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, Globe, Sparkles } from "lucide-react";

import {
  type RegionItem,
  DEFAULT_REGIONAL_COVERAGE,
} from "@/types/regionalCoverage";

export function RegionalCoverageBuilderTab() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Leaflet references
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    import("leaflet").then((mod) => {
      setL(mod.default);
    });
  }, []);

  // Fetch or seed from Supabase
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "regional_coverage")
          .maybeSingle();

        if (error) {
          toast.error("Failed to load regional configurations: " + error.message);
          return;
        }

        if (data?.value && Array.isArray(data.value)) {
          setRegions(data.value);
          if (data.value.length > 0) {
            setSelectedIdx(0);
          }
        } else {
          // Autoseed with default hardcoded values if not present
          setRegions(DEFAULT_REGIONAL_COVERAGE);
          if (DEFAULT_REGIONAL_COVERAGE.length > 0) {
            setSelectedIdx(0);
          }
          const { error: seedErr } = await supabase
            .from("site_config")
            .upsert(
              { key: "regional_coverage", value: DEFAULT_REGIONAL_COVERAGE },
              { onConflict: "key" },
            );
          if (seedErr) {
            console.error("Failed to seed regional coverage:", seedErr);
          }
        }
      } catch (err: any) {
        toast.error("Error loading regional data: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeRegion = selectedIdx !== null ? regions[selectedIdx] : null;

  // Initialize and update Map picker
  useEffect(() => {
    if (!L || !mapRef.current || activeRegion === null) return;

    const coords = activeRegion.coords || [-21.0, 24.5];

    // Create map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: coords,
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; CARTO &copy; OpenStreetMap",
        maxZoom: 20,
      }).addTo(map);

      // Create a marker that can be moved
      const marker = L.marker(coords, { draggable: true }).addTo(map);

      // Listener for dragend
      marker.on("dragend", () => {
        const latlng = marker.getLatLng();
        handleFieldChange("coords", [
          parseFloat(latlng.lat.toFixed(6)),
          parseFloat(latlng.lng.toFixed(6)),
        ]);
      });

      // Listener for map click
      map.on("click", (e: any) => {
        const latlng = e.latlng;
        marker.setLatLng(latlng);
        handleFieldChange("coords", [
          parseFloat(latlng.lat.toFixed(6)),
          parseFloat(latlng.lng.toFixed(6)),
        ]);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      // Map already exists, update center and marker location
      const map = mapInstanceRef.current;
      const marker = markerRef.current;

      map.setView(coords, map.getZoom());
      marker.setLatLng(coords);
    }
  }, [L, selectedIdx, activeRegion?.coords]);

  const handleFieldChange = (field: keyof RegionItem, val: any) => {
    if (selectedIdx === null) return;
    setRegions((prev) =>
      prev.map((reg, idx) => (idx === selectedIdx ? { ...reg, [field]: val } : reg)),
    );
  };

  const handleCapabilitiesChange = (val: string) => {
    const list = val
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    handleFieldChange("capabilities", list);
  };

  const handleAddRegion = () => {
    const newReg: RegionItem = {
      country: "New Region",
      flag: "🌍",
      code: "NEW",
      hub: "Logistics Hub",
      coords: [-21.0, 24.5],
      title: "New Office",
      subtitle: "Regional Office",
      address: "Enter address here",
      phone: "+27 78 1355 926",
      email: "info@geosynthetics.co.za",
      services: "Supply & Logistics",
      transit: "3 - 5 days",
      routes: "Johannesburg → Destination",
      description: "Description of operations in this region...",
      capabilities: ["Material Supply"],
    };

    setRegions((prev) => [...prev, newReg]);
    setSelectedIdx(regions.length);
  };

  const handleDeleteRegion = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this regional coverage location?")) return;

    setRegions((prev) => prev.filter((_, i) => i !== idx));

    if (selectedIdx === idx) {
      setSelectedIdx(regions.length > 1 ? 0 : null);
    } else if (selectedIdx !== null && selectedIdx > idx) {
      setSelectedIdx(selectedIdx - 1);
    }
  };

  const handleSaveAll = async () => {
    // Basic validation
    for (const reg of regions) {
      if (!reg.country.trim()) {
        toast.error("All regions must have a country name.");
        return;
      }
      if (!reg.coords || reg.coords.length !== 2 || isNaN(reg.coords[0]) || isNaN(reg.coords[1])) {
        toast.error(`Invalid coordinates for ${reg.country}.`);
        return;
      }
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: "regional_coverage", value: regions }, { onConflict: "key" });

      if (error) {
        toast.error("Failed to save: " + error.message);
      } else {
        toast.success("Regional configurations saved successfully!");
      }
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8 gap-3 text-muted-foreground text-sm font-semibold uppercase tracking-wider">
        <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading regional settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar header actions */}
      <div className="px-6 py-3 border-b border-border bg-card/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Globe className="h-4.5 w-4.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Pan-African Offices and Coverage Map Configuration
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRegion}
            className="h-8.5 rounded-lg border-dashed"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Region
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={saving}
            className="h-8.5 rounded-lg shadow-sm font-bold uppercase tracking-wide bg-primary hover:bg-primary-hover"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" /> Save Coverage Config
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: List of Countries */}
        <aside className="w-72 border-r border-border bg-surface/10 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-border/80 bg-surface/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Configured Locations ({regions.length})
            </span>
          </div>
          <div className="flex-1 p-2 space-y-1">
            {regions.map((reg, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={`${reg.country}-${idx}`}
                  onClick={() => setSelectedIdx(idx)}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span className="text-xl shrink-0">{reg.flag}</span>
                    <span className="truncate">{reg.country}</span>
                    <span className="text-[9px] text-muted-foreground/60">({reg.code})</span>
                  </span>
                  <button
                    onClick={(e) => handleDeleteRegion(idx, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity duration-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: Edit Form */}
        <main className="flex-1 overflow-y-auto bg-surface/5">
          {activeRegion ? (
            <div className="p-6 max-w-4xl space-y-8">
              {/* Card Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-extrabold uppercase text-foreground flex items-center gap-2">
                    <span>{activeRegion.flag}</span>
                    <span>{activeRegion.country} Settings</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modify coords, contact numbers, offices, and logistics route for this region.
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* General Details */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-2">
                    General Regional Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="country"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Country Name
                      </Label>
                      <Input
                        id="country"
                        value={activeRegion.country}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                        className="h-9 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="flag"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Flag Emoji
                      </Label>
                      <Input
                        id="flag"
                        value={activeRegion.flag}
                        onChange={(e) => handleFieldChange("flag", e.target.value)}
                        className="h-9 rounded-lg text-center text-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="code"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Hub Code (e.g. RSA)
                      </Label>
                      <Input
                        id="code"
                        value={activeRegion.code}
                        onChange={(e) => handleFieldChange("code", e.target.value)}
                        className="h-9 rounded-lg uppercase"
                        maxLength={3}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="hub"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Hub Name
                      </Label>
                      <Input
                        id="hub"
                        value={activeRegion.hub}
                        onChange={(e) => handleFieldChange("hub", e.target.value)}
                        className="h-9 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Map Coordinates Picker */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5 flex flex-col">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-2 flex items-center justify-between">
                    <span>Map Marker Position</span>
                    <span className="text-[9px] font-medium text-muted-foreground normal-case">
                      Drag marker or click map
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="lat"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Latitude
                      </Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={activeRegion.coords?.[0] || 0}
                        onChange={(e) =>
                          handleFieldChange("coords", [
                            parseFloat(e.target.value) || 0,
                            activeRegion.coords?.[1] || 0,
                          ])
                        }
                        className="h-9 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="lng"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Longitude
                      </Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={activeRegion.coords?.[1] || 0}
                        onChange={(e) =>
                          handleFieldChange("coords", [
                            activeRegion.coords?.[0] || 0,
                            parseFloat(e.target.value) || 0,
                          ])
                        }
                        className="h-9 rounded-lg"
                      />
                    </div>
                  </div>
                  {/* Leaflet map inside admin */}
                  <div className="flex-1 min-h-[160px] rounded-lg border border-border overflow-hidden relative mt-2">
                    <div ref={mapRef} className="absolute inset-0 h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Map Popup Info Card */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-2">
                  Map Popup Contact Card (Shown when Marker is Clicked)
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="title"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Office Title
                    </Label>
                    <Input
                      id="title"
                      value={activeRegion.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="subtitle"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Office Subtitle
                    </Label>
                    <Input
                      id="subtitle"
                      value={activeRegion.subtitle}
                      onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={activeRegion.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={activeRegion.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="services"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Services Text (popup summary)
                    </Label>
                    <Input
                      id="services"
                      value={activeRegion.services}
                      onChange={(e) => handleFieldChange("services", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="address"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Office Address
                  </Label>
                  <Input
                    id="address"
                    value={activeRegion.address}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    className="h-9 rounded-lg"
                  />
                </div>
              </div>

              {/* Transit & Routing Info */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-2 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  <span>Logistics & Regional Coverage Dashboard (Side Panel Info)</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="transit"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Transit Time
                    </Label>
                    <Input
                      id="transit"
                      value={activeRegion.transit}
                      onChange={(e) => handleFieldChange("transit", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="routes"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Logistics Route
                    </Label>
                    <Input
                      id="routes"
                      value={activeRegion.routes}
                      onChange={(e) => handleFieldChange("routes", e.target.value)}
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="capabilities"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Core Capabilities Tags (comma separated)
                  </Label>
                  <Input
                    id="capabilities"
                    value={activeRegion.capabilities?.join(", ") || ""}
                    onChange={(e) => handleCapabilitiesChange(e.target.value)}
                    className="h-9 rounded-lg"
                    placeholder="Material Supply, HDPE Liner Installation, QA/QC Testing"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Detailed Office Description
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={activeRegion.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Globe className="h-10 w-10 text-muted-foreground/50 animate-pulse" />
              <p className="text-sm font-medium">Select a country region on the left to edit it</p>
              <Button size="sm" onClick={handleAddRegion} className="mt-2 rounded-lg">
                <Plus className="mr-1.5 h-4 w-4" /> Add First Region
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
