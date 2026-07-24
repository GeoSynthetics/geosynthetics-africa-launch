import { describe, it, expect } from "bun:test";
import {
  generateQuoteCustomerEmail,
  generateQuoteAdminEmail,
  generateContactCustomerEmail,
  generateContactAdminEmail,
  formatReference,
  formatSubmissionDate,
  escapeHtml,
} from "../../lib/email-templates";

describe("Email Templates Engine", () => {
  describe("Utility Helpers", () => {
    it("should generate reference fallback when none provided", () => {
      const ref = formatReference();
      expect(ref).toMatch(/^GSA-\d{4}-\d{4}$/);
    });

    it("should preserve explicitly provided reference", () => {
      const ref = formatReference("GSA-2026-9999");
      expect(ref).toBe("GSA-2026-9999");
    });

    it("should format date fallback correctly", () => {
      const dateStr = formatSubmissionDate();
      expect(dateStr).toContain(new Date().getFullYear().toString());
    });

    it("should escape unsafe HTML characters", () => {
      const unsafe = '<script>alert("xss")</script> & "test"';
      const safe = escapeHtml(unsafe);
      expect(safe).not.toContain("<script>");
      expect(safe).toContain("&lt;script&gt;");
      expect(safe).toContain("&amp;");
      expect(safe).toContain("&quot;");
    });
  });

  describe("generateQuoteCustomerEmail", () => {
    it("should render full HTML template matching stakeholder design specification", () => {
      const html = generateQuoteCustomerEmail({
        contactName: "John Doe",
        contactEmail: "john@miningcorp.com",
        company: "Mining Corp Ltd",
        country: "Zambia",
        productName: "HDPE Geomembrane 2.0mm",
        projectDescription: "Tailings dam liner specs for 50,000 m2 project.",
        attachments: ["blueprint.pdf", "site_specs.dwg"],
        reference: "GSA-2026-0147",
        date: "21 July 2026",
        siteUrl: "https://geosynthetics.co.za",
      });

      // Brand headers & palette
      expect(html).toContain("GEOSYNTHETICS");
      expect(html).toContain("AFRICA");
      expect(html).toContain(
        "Supply &nbsp;&middot;&nbsp; Logistics &nbsp;&middot;&nbsp; Installation &nbsp;&middot;&nbsp; QA/QC",
      );

      // Body & Greeting
      expect(html).toContain("Quote request received");
      expect(html).toContain("Your specs are with our engineers.");
      expect(html).toContain("Dear John Doe,");

      // Request Summary Card
      expect(html).toContain("REF&nbsp;GSA-2026-0147");
      expect(html).toContain("Mining Corp Ltd");
      expect(html).toContain("Zambia");
      expect(html).toContain("21 July 2026");
      expect(html).toContain("HDPE Geomembrane 2.0mm");
      expect(html).toContain("Tailings dam liner specs for 50,000 m2 project.");
      expect(html).toContain("blueprint.pdf, site_specs.dwg");

      // Process Steps
      expect(html).toContain("What happens next");
      expect(html).toContain("1&nbsp;&nbsp;Review");
      expect(html).toContain("2&nbsp;&nbsp;Quotation");
      expect(html).toContain("3&nbsp;&nbsp;One contract");

      // Credentials Strip
      expect(html).toContain("IAGI");
      expect(html).toContain("Installer Member &mdash; 1 of only 5 in Africa");
      expect(html).toContain("30+");
      expect(html).toContain("15M+ m&sup2;");

      // CTA & Important Links
      expect(html.toLowerCase()).toContain("explore the catalogue");
      expect(html).toContain("https://geosynthetics.co.za/catalogue");
      expect(html).toContain("https://geosynthetics.co.za/contacts");
      expect(html).toContain("Geosynthetics Africa (Pty) Ltd");
    });

    it("should handle missing optional fields gracefully with fallbacks", () => {
      const html = generateQuoteCustomerEmail({
        contactName: "Jane Smith",
        contactEmail: "jane@example.com",
      });

      expect(html).toContain("Dear Jane Smith,");
      expect(html).toContain("N/A"); // Company fallback
      expect(html).toContain("Not specified"); // Country fallback
      expect(html).toContain("None"); // Attachments fallback
    });
  });

  describe("generateQuoteAdminEmail", () => {
    it("should render admin notification with structured lead transmittal table", () => {
      const html = generateQuoteAdminEmail({
        contactName: "Alice Cooper",
        contactEmail: "alice@geotech.co.za",
        contactPhone: "+27 82 555 1234",
        company: "GeoTech Ltd",
        country: "South Africa",
        productName: "GCL Liner",
        projectDescription: "Road construction barrier.",
        reference: "GSA-2026-0888",
      });

      expect(html).toContain("Admin Notification");
      expect(html).toContain("New Web Lead: Alice Cooper");
      expect(html).toContain("GSA-2026-0888");
      expect(html).toContain("alice@geotech.co.za");
      expect(html).toContain("+27 82 555 1234");
      expect(html).toContain("GeoTech Ltd");
      expect(html).toContain("GCL Liner");
      expect(html).toContain("Road construction barrier.");
    });
  });

  describe("generateContactCustomerEmail & generateContactAdminEmail", () => {
    it("should render customer enquiry email layout", () => {
      const html = generateContactCustomerEmail({
        contactName: "Bob Marley",
        contactEmail: "bob@example.com",
        message: "I need pricing info on geotextiles.",
        reference: "GSA-2026-0777",
      });

      expect(html.toLowerCase()).toContain("enquiry received");
      expect(html).toContain("Dear Bob Marley,");
      expect(html).toContain("I need pricing info on geotextiles.");
      expect(html).toContain("GSA-2026-0777");
      expect(html.toLowerCase()).toContain("explore the catalogue");
    });

    it("should render admin enquiry notification email layout", () => {
      const html = generateContactAdminEmail({
        contactName: "Bob Marley",
        contactEmail: "bob@example.com",
        contactPhone: "+27 11 000 0000",
        message: "I need pricing info on geotextiles.",
        reference: "GSA-2026-0777",
      });

      expect(html).toContain("Website Contact Form");
      expect(html).toContain("New Message from Bob Marley");
      expect(html).toContain("bob@example.com");
      expect(html).toContain("+27 11 000 0000");
      expect(html).toContain("I need pricing info on geotextiles.");
    });
  });
});
