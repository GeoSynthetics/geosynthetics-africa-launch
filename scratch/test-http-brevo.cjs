const https = require("https");

const apiKey = "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";

function sendEmail(senderEmail, recipientEmail) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: { name: "GeoSynthetics Africa", email: senderEmail },
      to: [{ email: recipientEmail, name: "Test User" }],
      subject: "Test Quote Request Confirmation - GeoSynthetics Africa",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2>Quote Confirmation Test</h2>
          <p>Hello! This is a test email sent to <strong>${recipientEmail}</strong> via Brevo API.</p>
        </div>
      `,
    });

    const options = {
      hostname: "api.brevo.com",
      port: 443,
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
        "content-length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        console.log(`Status code for sender [${senderEmail}] -> [${recipientEmail}]:`, res.statusCode);
        console.log("Body:", body);
        resolve({ status: res.statusCode, body });
      });
    });

    req.on("error", (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function testAll() {
  console.log("--- Testing Brevo API Send ---");
  // Try sending from info@geosynthetics.co.za
  await sendEmail("info@geosynthetics.co.za", "danjumashiwaju@gmail.com");
}

testAll();
