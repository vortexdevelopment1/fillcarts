const { spawn } = require("child_process");

console.log("🚀 Starting Fillcarts Customer (5173), Vendor (5174), and Rider (5175) dev servers...\n");

const opts = { stdio: "inherit", shell: true };

const customer = spawn("npm", ["--prefix", "customer", "run", "dev"], opts);
const vendor = spawn("npm", ["--prefix", "vendor", "run", "dev"], opts);
const rider = spawn("npm", ["--prefix", "rider", "run", "dev"], opts);

function cleanExit() {
  customer.kill();
  vendor.kill();
  rider.kill();
  process.exit();
}

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
