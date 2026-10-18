import { createFileRoute } from "@tanstack/react-router";
import { getEmailConfig } from "@/lib/email-config";

/**
 * GET /api/email-status
 *
 * Checks the form email setup without sending anything: whether the Brevo key
 * is set and accepted, and whether the sender address is verified in Brevo.
 * Never returns the key itself.
 */
export const Route = createFileRoute("/api/email-status")({
  server: {
    handlers: {
      GET: async () => {
        const { apiKey, fromEmail, notifyEmail } = getEmailConfig();
        const status: Record<string, unknown> = {
          apiKeySet: Boolean(apiKey),
          fromEmail,
          notifyEmail,
          apiKeyAccepted: null,
          senderVerified: null,
        };

        if (apiKey) {
          try {
            const headers = { accept: "application/json", "api-key": apiKey };
            const account = await fetch("https://api.brevo.com/v3/account", { headers });
            status.apiKeyAccepted = account.ok;
            if (!account.ok) status.apiKeyError = `Brevo returned ${account.status}`;
            if (account.ok) {
              const res = await fetch("https://api.brevo.com/v3/senders", { headers });
              const body = (await res.json().catch(() => ({}))) as {
                senders?: { email: string; active: boolean }[];
              };
              const sender = body.senders?.find(
                (x) => x.email.toLowerCase() === fromEmail.toLowerCase(),
              );
              status.senderVerified = sender ? sender.active : false;
              status.verifiedSenders = (body.senders || [])
                .filter((x) => x.active)
                .map((x) => x.email);
            }
          } catch (error: any) {
            status.apiKeyError = `Could not reach Brevo: ${error?.message || error}`;
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
