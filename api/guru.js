export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Fetch the Guru Explore page
    const response = await fetch("https://guru.fund/explore");
    if (!response.ok) throw new Error("Failed to fetch guru.fund");

    const html = await response.text();

    // Extract 3 numeric values (simple regex pattern)
    const matches = [...html.matchAll(/text-3xl[^>]*>(.*?)<\/div>/g)];
    const tvl = matches[0]?.[1]?.trim() || "$—";
    const investors = matches[1]?.[1]?.trim() || "—";
    const funds = matches[2]?.[1]?.trim() || "—";

    return res.status(200).json({
      success: true,
      data: { tvl, investors, funds }
    });
  } catch (err) {
    console.error("Guru API error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
