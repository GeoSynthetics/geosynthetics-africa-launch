import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "b2925b001@smtp-brevo.com",
    pass: "I69CRdbYpTfq7KJg",
  },
});

async function main() {
  console.log("Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("SMTP Connection verified successfully!");

    const info = await transporter.sendMail({
      from: '"GeoSynthetics Africa" <b2925b001@smtp-brevo.com>',
      to: "danjumashiwaju@gmail.com",
      subject: "Test Quote Confirmation - GeoSynthetics Africa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Quote Request Confirmation</h2>
          <p>Hello Danjuma,</p>
          <p>Thank you for submitting a quote request on GeoSynthetics Africa.</p>
          <p>Our sales team will be in touch with you shortly.</p>
        </div>
      `,
    });

    console.log("Email sent successfully! Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (err: any) {
    console.error("SMTP Test Error:", err);
  }
}

main();
