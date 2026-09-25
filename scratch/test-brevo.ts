const apiKey =
  "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";

async function testBrevo() {
  console.log("Testing Brevo API key...");

  // 1. Get account details / Senders from Brevo
  const accountRes = await fetch("https://api.brevo.com/v3/account", {
    headers: { "api-key": apiKey },
  });
  console.log("Account status:", accountRes.status);
  const accountData = await accountRes.json();
  console.log("Account data:", JSON.stringify(accountData, null, 2));

  const sendersRes = await fetch("https://api.brevo.com/v3/senders", {
    headers: { "api-key": apiKey },
  });
  const sendersData = await sendersRes.json();
  console.log("Senders data:", JSON.stringify(sendersData, null, 2));
}

testBrevo();
