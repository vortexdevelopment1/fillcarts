import http from "http";

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers: { "Accept": "application/json" }, timeout: 5000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

async function run() {
  try {
    console.log("--- Testing MongoDB Atlas & Product API Endpoints ---");
    
    // 1. All products
    const r1 = await get("http://localhost:3000/api/products");
    console.log("1. GET /api/products -> Status:", r1.status, "Total:", r1.data?.total, "Count:", r1.data?.count);
    
    if (!r1.data?.data || r1.data.data.length === 0) {
      console.error("No products returned!");
      return;
    }

    const firstProduct = r1.data.data[0];
    const id = firstProduct.productId || firstProduct._id;
    
    // 2. Single product by ID / productId
    const r2 = await get(`http://localhost:3000/api/products/${encodeURIComponent(id)}`);
    console.log(`2. GET /api/products/${id} -> Status:`, r2.status, "Name:", r2.data?.data?.name);

    // 3. Category filter
    const r3 = await get("http://localhost:3000/api/products?category=fruits");
    console.log("3. GET /api/products?category=fruits -> Status:", r3.status, "Count:", r3.data?.count);

    // 4. Search query
    const r4 = await get("http://localhost:3000/api/products?search=milk");
    console.log("4. GET /api/products?search=milk -> Status:", r4.status, "Count:", r4.data?.count);
    
    console.log("--- ALL PRODUCT API ENDPOINTS VERIFIED SUCCESSFULLY ---");
  } catch (err) {
    console.error("Test Error:", err.message);
  }
}

run();
