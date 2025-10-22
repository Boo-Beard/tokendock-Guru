export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token address" });
  }

  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${encodeURIComponent(token)}&ui_amount_mode=scaled`,
      {
        headers: {
          "accept": "application/json",
          "x-api-key": process.env.BIRDEYE_KEY,  // your secret key, stored safely
          "x-chain": "ethereum",                 // 👈 Guru is on Ethereum
        },
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Birdeye API error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
