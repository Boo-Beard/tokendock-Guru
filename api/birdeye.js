// /api/birdeye.js
export default async function handler(req, res) {
  try {
    // Get the token address from query string
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: "Missing token parameter" });
    }

    // Build the Birdeye API URL (Ethereum)
    const url = `https://public-api.birdeye.so/defi/token_overview?address=${encodeURIComponent(
      token
    )}&ui_amount_mode=scaled`;

    // Call Birdeye securely from the server side
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-chain": "ethereum", // important for Ethereum tokens
        "X-API-KEY": process.env.BIRDEYE_API_KEY || "1761b82af37542d193a02366186ab7e7",
      },
    });

    // Handle bad responses
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Birdeye API error: ${response.statusText}`,
      });
    }

    // Return JSON to client
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Birdeye handler error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
