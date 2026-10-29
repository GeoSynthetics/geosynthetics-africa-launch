# Agent change log

## 2026-10-29 — Form email configuration and submission feedback

Restore server-side Brevo support when the existing BREVO_API_KEY is configured and RESEND_API_KEY is absent. Prefer Resend when its key is supplied. Preserve the configured notification inbox and customer Reply-To. Await notification results across contact, quote and homepage forms; keep saved enquiries and clearly report notification failures without inviting duplicate submissions. Add bounded provider requests and provider-aware email diagnostics. Cover provider selection, provider payloads and saved-enquiry notification behaviour with focused tests.

## 2026-10-29 — Anonymous homepage enquiry storage

Remove SELECT read-back from homepage enquiry inserts, matching the working quote modal. Generate a UUID before insertion so email references still match the saved enquiry without requiring anonymous read access. Preserve database access policies. Verify anonymous insertion flow and reference correlation with the existing focused submission tests.

## 2026-10-29 — Clear enquiry email subjects

All form sales notifications and customer acknowledgements now share `Your [product or geosynthetics] enquiry | GSA-[short reference]`. Explicit product context is used for product quotes; internal labels, client addresses, long UUIDs and response-time promises are removed from subjects. New fallback references use ten UUID hex characters; existing full lead IDs remain in message bodies. Reply-to routing and the sales recipient are preserved. Validation: ten focused subject/provider/reference checks passed; Vercel production build passed. The broader template suite has an existing unrelated credential-strip wording mismatch.
