export default async function handler(req, res) {
  // ✅ Allow CORS from TokenDock domains and local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Missing token address",
      });
    }

    const response = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${token}&ui_amount_mode=scaled`,
      {
        headers: {
          accept: "application/json",
          "x-chain": "ethereum",
          "X-API-KEY": "1761b82af37542d193a02366186ab7e7",
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Birdeye error ${response.status}`,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Birdeye proxy error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}
