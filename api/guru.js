export default async function handler(req, res) {
  try {
    // Allow CORS (so it works from TokenDock)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    // Fetch Guru stats directly from their API
    const response = await fetch("https://trpc.guru.fund/dapp.getStats");
    if (!response.ok) throw new Error(`Failed to fetch Guru stats (${response.status})`);

    const json = await response.json();
    const data = json?.result?.data || {};

    // Extract + format
    const tvlUsd = Number(data.ttvl || 0) / 1e8; // convert from atomic to USD if needed
    const tvlFormatted = `$${tvlUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    const investors = data.activeInvestors ?? data.lifetimeInvestors ?? "—";
    const funds = data.funds ?? "—";

    // Return consistent structure
    return res.status(200).json({
      success: true,
      data: {
        tvl: tvlFormatted,
        investors: investors.toLocaleString(),
        funds: funds.toLocaleString(),
      },
    });
  } catch (err) {
    console.error("Guru API error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
