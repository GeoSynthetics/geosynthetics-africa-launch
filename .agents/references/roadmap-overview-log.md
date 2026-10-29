# Agent change log

## 2026-10-29 — Form email configuration and submission feedback

Restore server-side Brevo support when the existing BREVO_API_KEY is configured and RESEND_API_KEY is absent. Prefer Resend when its key is supplied. Preserve the configured notification inbox and customer Reply-To. Await notification results across contact, quote and homepage forms; keep saved enquiries and clearly report notification failures without inviting duplicate submissions. Add bounded provider requests and provider-aware email diagnostics. Cover provider selection, provider payloads and saved-enquiry notification behaviour with focused tests.
