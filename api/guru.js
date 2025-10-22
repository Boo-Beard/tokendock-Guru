export default async function handler(req, res) {
  try {
    // Allow CORS for both main site and previews
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Fetch Guru stats page HTML
    const response = await fetch("https://guru.fund/explore");
    if (!response.ok) throw new Error("Failed to fetch guru.fund");

    const html = await response.text();

    // Extract the 3 key values (very naive parse)
    const match = [...html.matchAll(/text-3xl[^>]*>(.*?)<\/div>/g)];
    const tvl = match[0]?.[1]?.trim() || "$—";
    const investors = match[1]?.[1]?.trim() || "—";
    const funds = match[2]?.[1]?.trim() || "—";

    res.status(200).json({
      success: true,
      data: { tvl, investors, funds }
    });
  } catch (err) {
    console.error("Guru API error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
