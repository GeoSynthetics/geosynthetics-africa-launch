import { createFileRoute } from "@tanstack/react-router";
import { getEmailConfig } from "@/lib/email-config";

/**
 * GET /api/email-status
 *
 * Checks the form email setup without sending anything: whether the Resend key
 * is set and accepted, and whether the sender's domain is verified in Resend.
 * Never returns the key itself.
 */
export const Route = createFileRoute("/api/email-status")({
  server: {
    handlers: {
      GET: async () => {
        const { provider, apiKey, fromEmail, notifyEmail } = getEmailConfig();
        const senderDomain = fromEmail.split("@")[1]?.toLowerCase() || "";
        const status: Record<string, unknown> = {
          provider,
          apiKeySet: Boolean(apiKey),
          fromEmail,
          notifyEmail,
          apiKeyAccepted: null,
          senderDomain,
          senderDomainVerified: null,
        };

        if (apiKey && provider === "brevo") {
          try {
            const res = await fetch("https://api.brevo.com/v3/senders", {
              headers: { "api-key": apiKey },
              signal: AbortSignal.timeout(10000),
            });
            status.apiKeyAccepted = res.ok;
            if (res.ok) {
              const body = (await res.json()) as { senders?: { email: string; active: boolean }[] };
              const sender = body.senders?.find(
                (s) => s.email.toLowerCase() === fromEmail.toLowerCase(),
              );
              status.senderVerified = sender?.active ?? false;
              status.senderStatus = sender?.active ? "verified" : "not verified";
            } else {
              status.apiKeyError = `Brevo returned ${res.status}`;
            }
          } catch {
            status.apiKeyError = "Could not reach Brevo.";
          }
        } else if (apiKey) {
          try {
            const res = await fetch("https://api.resend.com/domains", {
              headers: { Authorization: `Bearer ${apiKey}` },
              signal: AbortSignal.timeout(10000),
            });
            const body = (await res.json().catch(() => ({}))) as {
              name?: string;
              message?: string;
              data?: { name: string; status: string }[];
            };

            if (res.ok) {
              status.apiKeyAccepted = true;
              const domain = body.data?.find((d) => d.name.toLowerCase() === senderDomain);
              status.senderDomainStatus = domain ? domain.status : "not added";
              status.senderDomainVerified = domain ? domain.status === "verified" : false;
              status.domainsInAccount = (body.data || []).map((d) => `${d.name} (${d.status})`);
            } else if (body.name === "restricted_api_key") {
              // A "sending access" key is valid but cannot list domains.
              status.apiKeyAccepted = true;
              status.note =
                "Key has sending access only, so the domain status cannot be checked here.";
            } else {
              status.apiKeyAccepted = false;
              status.apiKeyError = `Resend returned ${res.status}${body.message ? `: ${body.message}` : ""}`;
            }
          } catch (error: any) {
            status.apiKeyError = `Could not reach Resend: ${error?.message || error}`;
          }
        }

        return new Response(JSON.stringify(status, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
