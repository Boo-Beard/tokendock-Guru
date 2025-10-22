export default async function handler(req, res) {
  try {
    // ✅ Allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    // ✅ Fetch from Guru API
    const response = await fetch("https://trpc.guru.fund/dapp.getStats");
    if (!response.ok) throw new Error(`Failed to fetch Guru stats (${response.status})`);
    const json = await response.json();
    const data = json?.result?.data || {};

    // 🧮 Fix scaling — their value is in cents *and* seems overinflated by 1000x
    const tvlUsd = Number(data.ttvl || 0) / 100 / 1000;

    // 💰 Format as compact USD if very large
    const tvlFormatted =
      tvlUsd >= 1_000_000
        ? `$${(tvlUsd / 1_000_000).toFixed(2)}M`
        : tvlUsd >= 1_000
        ? `$${(tvlUsd / 1_000).toFixed(2)}K`
        : `$${tvlUsd.toFixed(2)}`;

    const investors = data.activeInvestors ?? data.lifetimeInvestors ?? "—";
    const funds = data.funds ?? "—";
    const gurus = data.gurus ?? "—";

    return res.status(200).json({
      success: true,
      data: {
        tvl: tvlFormatted,
        investors: investors.toLocaleString(),
        funds: funds.toLocaleString(),
        gurus: gurus.toLocaleString(),
      },
    });
  } catch (err) {
    console.error("Guru API error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
