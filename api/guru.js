export default async function handler(req, res) {
  try {
    // --- CORS headers ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Fetch Guru data
    const response = await fetch('https://guru.fund/explore');
    const html = await response.text();

    // Extract numbers using regex (faster than DOMParser)
    const tvlMatch = html.match(/\$[\d,]+\.\d{2}/);
    const numbers = [...html.matchAll(/<div class="text-3xl font-semibold">([\d,.$]+)<\/div>/g)];

    const tvl = tvlMatch ? tvlMatch[0] : '$—';
    const investors = numbers[1]?.[1] || '—';
    const funds = numbers[2]?.[1] || '—';

    return res.status(200).json({
      success: true,
      data: { tvl, investors, funds },
    });

  } catch (err) {
    console.error('Guru API proxy failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
