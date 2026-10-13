import { describe, it, expect } from "vitest";
import {
  isWestAfricanRegion,
  isSouthAfricanRegion,
  resolveRegionalRouting,
  MAMADOU_COULIBALY_CONTACT,
  SOUTH_AFRICA_CONTACT,
} from "@/types/regionalCoverage";

describe("Regional Routing Service & Coverage Classification", () => {
  describe("isWestAfricanRegion", () => {
    it("should identify Ivory Coast / Côte d'Ivoire as West Africa", () => {
      expect(isWestAfricanRegion("Côte d'Ivoire")).toBe(true);
      expect(isWestAfricanRegion("Cote d'Ivoire")).toBe(true);
      expect(isWestAfricanRegion("Ivory Coast")).toBe(true);
      expect(isWestAfricanRegion("CIV")).toBe(true);
    });

    it("should identify Ghana, Mali, Burkina Faso and Senegal as West Africa", () => {
      expect(isWestAfricanRegion("Ghana")).toBe(true);
      expect(isWestAfricanRegion("Senegal")).toBe(true);
      expect(isWestAfricanRegion("Mali")).toBe(true);
      expect(isWestAfricanRegion("Burkina Faso")).toBe(true);
    });

    it("should NOT classify South Africa or Botswana as West Africa", () => {
      expect(isWestAfricanRegion("South Africa")).toBe(false);
      expect(isWestAfricanRegion("Botswana")).toBe(false);
      expect(isWestAfricanRegion("Namibia")).toBe(false);
    });
  });

  describe("isSouthAfricanRegion", () => {
    it("should identify South Africa correctly", () => {
      expect(isSouthAfricanRegion("South Africa")).toBe(true);
      expect(isSouthAfricanRegion("RSA")).toBe(true);
      expect(isSouthAfricanRegion("za")).toBe(true);
    });

    it("should NOT classify Côte d'Ivoire or Kenya as South Africa", () => {
      expect(isSouthAfricanRegion("Côte d'Ivoire")).toBe(false);
      expect(isSouthAfricanRegion("Kenya")).toBe(false);
    });
  });

  describe("resolveRegionalRouting", () => {
    it("should route Côte d'Ivoire and West Africa inquiries to Mamadou Coulibaly", () => {
      const civResult = resolveRegionalRouting("Côte d'Ivoire");
      expect(civResult.isWestAfrica).toBe(true);
      expect(civResult.targetEmail).toBe(MAMADOU_COULIBALY_CONTACT.email);
      expect(civResult.targetName).toBe(MAMADOU_COULIBALY_CONTACT.name);

      const ghanaResult = resolveRegionalRouting("Ghana");
      expect(ghanaResult.isWestAfrica).toBe(true);
      expect(ghanaResult.targetEmail).toBe(MAMADOU_COULIBALY_CONTACT.email);
      expect(ghanaResult.targetName).toBe(MAMADOU_COULIBALY_CONTACT.name);
    });

    it("should route South Africa and Southern Africa inquiries to the South Africa Desk", () => {
      const saResult = resolveRegionalRouting("South Africa");
      expect(saResult.isSouthAfrica).toBe(true);
      expect(saResult.isWestAfrica).toBe(false);
      expect(saResult.targetEmail).toBe(SOUTH_AFRICA_CONTACT.email);

      const southernResult = resolveRegionalRouting("Southern Africa");
      expect(southernResult.isSouthAfrica).toBe(true);
      expect(southernResult.isWestAfrica).toBe(false);
      expect(southernResult.targetEmail).toBe(SOUTH_AFRICA_CONTACT.email);
    });

    it("should route East Africa, Central Africa, and North Africa to their corridors", () => {
      const eastResult = resolveRegionalRouting("East Africa");
      expect(eastResult.targetName).toContain("East Africa");

      const centralResult = resolveRegionalRouting("Central Africa");
      expect(centralResult.targetName).toContain("Central Africa");

      const northResult = resolveRegionalRouting("North Africa");
      expect(northResult.targetName).toContain("North Africa");
    });

    it("should resolve other countries to their respective regional desk or fallback", () => {
      const zambiaResult = resolveRegionalRouting("Zambia");
      expect(zambiaResult.isWestAfrica).toBe(false);
      expect(zambiaResult.targetEmail).toBe("zambia@geosynthetics.co.za");
    });
  });
});
