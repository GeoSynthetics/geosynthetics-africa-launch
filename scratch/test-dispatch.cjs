const https = require("https");

const apiKey =
  "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";
const fromEmail = "info@geosynthetics.co.za";
const userEmail = "danjumashiwaju@gmail.com";
const adminEmail = "info@geosynthetics.co.za";

function sendBrevoEmail(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: { name: "GeoSynthetics Africa", email: fromEmail },
      to: payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      htmlContent: payload.htmlContent,
    });

    const req = https.request(
      {
        hostname: "api.brevo.com",
        port: 443,
        path: "/v3/smtp/email",
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
          "content-length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          console.log(`[Brevo Response ${res.statusCode} to ${payload.to[0].email}]:`, body);
          resolve({ status: res.statusCode, body });
        });
      },
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function testFullQuoteDispatch() {
  console.log("=== Dispatching Test Quote Email to User & Admin ===");

  // 1. Email to User (danjumashiwaju@gmail.com)
  const userHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Quote Request Received</h2>
      <p>Dear Danjuma Shiwaju,</p>
      <p>Thank you for reaching out to <strong>GeoSynthetics Africa</strong>. We have successfully received your quote request.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e293b;">Summary of your request:</h3>
        <ul style="list-style: none; padding-left: 0; line-height: 1.6;">
          <li><strong>Product:</strong> High-Density Polyethylene (HDPE) Geomembrane</li>
          <li><strong>Company:</strong> Shiwaju Engineering</li>
          <li><strong>Country:</strong> Nigeria</li>
          <li><strong>Details:</strong> Requesting pricing and technical specifications for 5,000 sqm dam lining project.</li>
        </ul>
      </div>

      <p>Our engineering & sales team will review your specs and respond with an official quotation shortly.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">GeoSynthetics Africa — High-Performance Geosynthetic Solutions across the Continent.</p>
    </div>
  `;

  // 2. Email to Admin (info@geosynthetics.co.za)
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb;">New Web Quote Submission</h2>
      <p>A new quote request has been submitted on the GeoSynthetics website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">Danjuma Shiwaju</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">danjumashiwaju@gmail.com</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">Shiwaju Engineering</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Product:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">HDPE Geomembrane</td></tr>
      </table>
    </div>
  `;

  console.log("Sending email to User:", userEmail);
  await sendBrevoEmail({
    to: [{ email: userEmail, name: "Danjuma Shiwaju" }],
    replyTo: { email: adminEmail, name: "GeoSynthetics Sales Team" },
    subject: "We received your quote request — GeoSynthetics Africa",
    htmlContent: userHtml,
  });

  console.log("Sending email to Admin:", adminEmail);
  await sendBrevoEmail({
    to: [{ email: adminEmail, name: "GeoSynthetics Sales Admin" }],
    replyTo: { email: userEmail, name: "Danjuma Shiwaju" },
    subject: "[New Quote] Danjuma Shiwaju (HDPE Geomembrane)",
    htmlContent: adminHtml,
  });
}

testFullQuoteDispatch();
