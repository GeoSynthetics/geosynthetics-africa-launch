# Agent change log

## 2026-10-29 — Form email configuration and submission feedback

Restore server-side Brevo support when the existing BREVO_API_KEY is configured and RESEND_API_KEY is absent. Prefer Resend when its key is supplied. Preserve the configured notification inbox and customer Reply-To. Await notification results across contact, quote and homepage forms; keep saved enquiries and clearly report notification failures without inviting duplicate submissions. Add bounded provider requests and provider-aware email diagnostics. Cover provider selection, provider payloads and saved-enquiry notification behaviour with focused tests.

## 2026-10-29 — Anonymous homepage enquiry storage

Remove SELECT read-back from homepage enquiry inserts, matching the working quote modal. Generate a UUID before insertion so email references still match the saved enquiry without requiring anonymous read access. Preserve database access policies. Verify anonymous insertion flow and reference correlation with the existing focused submission tests.
