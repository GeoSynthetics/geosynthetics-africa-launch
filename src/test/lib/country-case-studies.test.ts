import { describe, expect, it } from "vitest";
import { industryPattern, rankCountryCaseStudies } from "@/lib/country-case-studies";
import { PROJECT_ZONES, formatEnquiryMeta, zoneForCountry } from "@/lib/project-zones";

const studies = [
  {
    id: "driveway",
    title: "BERA Gravel Fix Pro Driveway - Luxury Guesthouse",
    country: "South Africa",
    project_year: 2026,
  },
  { id: "mali-tsf", title: "TSF Lining — Lithium Mine, Mali", country: "Mali", project_year: 2024 },
  { id: "sl-ponds", title: "FG Gold Process Ponds", country: "Sierra Leone", project_year: 2025 },
  {
    id: "tz-copper",
    title: "MCC Copper Mine HDPE Supply",
    country: "Tanzania",
    project_year: 2023,
  },
  {
    id: "bw-lucara",
    title: "GSE HDPE Supply – Lucara Diamonds",
    country: "Botswana",
    project_year: 2022,
  },
];

describe("rankCountryCaseStudies", () => {
  it("puts the country's own projects first, then same-zone projects", () => {
    const ranked = rankCountryCaseStudies("Burkina Faso", studies).map((s) => s.id);
    expect(ranked.slice(0, 2).sort()).toEqual(["mali-tsf", "sl-ponds"]);
    expect(ranked).not.toContain("driveway");
  });

  it("never shows residential jobs outside their own country", () => {
    const ranked = rankCountryCaseStudies("Democratic Republic of Congo (DRC)", studies).map(
      (s) => s.id,
    );
    expect(ranked).not.toContain("driveway");
    expect(ranked[0]).toBe("bw-lucara");
  });

  it("keeps a residential project on its own country page", () => {
    const ranked = rankCountryCaseStudies("South Africa", studies).map((s) => s.id);
    expect(ranked[0]).toBe("driveway");
  });
});

describe("project zones", () => {
  it("offers exactly the five enquiry zones", () => {
    expect(PROJECT_ZONES).toEqual([
      "Southern Africa",
      "East Africa",
      "West Africa",
      "North Africa",
      "Other",
    ]);
  });

  it("maps countries to zones", () => {
    expect(zoneForCountry("Côte d'Ivoire")).toBe("West Africa");
    expect(zoneForCountry("Democratic Republic of Congo (DRC)")).toBe("Southern Africa");
    expect(zoneForCountry("Kenya")).toBe("East Africa");
    expect(zoneForCountry("Atlantis")).toBeNull();
  });

  it("formats enquiry metadata as labelled lines", () => {
    expect(formatEnquiryMeta({ zone: "West Africa", country: "Mali", language: "Français" })).toBe(
      "Zone: West Africa\nCountry: Mali\nPreferred language: Français",
    );
  });
});

describe("industry preference", () => {
  it("ranks lead-industry projects first within the same zone", () => {
    const zoneStudies = [
      {
        id: "sludge",
        title: "Sludge Dewatering in Durban",
        country: "South Africa",
        project_year: 2026,
      },
      {
        id: "mine",
        title: "West Wits Mining ROM Ore Pad Lining",
        country: "South Africa",
        project_year: 2024,
      },
    ];
    const ranked = rankCountryCaseStudies(
      "Zambia",
      zoneStudies,
      3,
      industryPattern("mining-minerals-processing"),
    ).map((s) => s.id);
    expect(ranked[0]).toBe("mine");
  });
});
