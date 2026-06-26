import http from "http";

const ports = [3000, 5173, 5174, 5175, 8080];

async function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, { timeout: 1000 }, (res) => {
      resolve(true);
    });
    req.on("error", () => {
      resolve(false);
    });
    req.end();
  });
}

async function main() {
  console.log("Checking open ports on localhost...");
  for (const port of ports) {
    const isOpen = await checkPort(port);
    console.log(`Port ${port}: ${isOpen ? "OPEN" : "CLOSED"}`);
  }
}

main();
