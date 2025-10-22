export default async function handler(req, res) {
  // ✅ Allow all origins (for www.tokendock.io and others)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch("https://guru.fund/explore");
    const html = await response.text();

    // 🔍 Extract stats (rough HTML scraping)
    const tvlMatch = html.match(/\$[\d,]+\.\d{2}/);
    const matches = [...html.matchAll(/<div class="text-3xl font-semibold">([\d,.$]+)<\/div>/g)];

    const tvl = tvlMatch ? tvlMatch[0] : "$—";
    const investors = matches[1]?.[1] || "—";
    const funds = matches[2]?.[1] || "—";

    return res.status(200).json({
      success: true,
      data: { tvl, investors, funds }
    });
  } catch (err) {
    console.error("Guru proxy error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
