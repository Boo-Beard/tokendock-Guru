// /api/guru.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://guru.fund/explore', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await response.text();

    // parse DOM serverside
    const tvlMatch = html.match(/\$[\d,]+\.\d+/); // first dollar value
    const numbers = html.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g);

    const tvl = tvlMatch ? tvlMatch[0] : '$—';
    const investors = numbers?.[numbers.length - 2] || '—';
    const funds = numbers?.[numbers.length - 1] || '—';

    res.status(200).json({
      success: true,
      data: { tvl, investors, funds }
    });
  } catch (err) {
    console.error('Guru API proxy error:', err);
    res.status(500).json({ success: false, message: 'Guru API error' });
  }
}
