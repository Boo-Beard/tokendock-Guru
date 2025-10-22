// /api/birdeye.js
export default async function handler(req, res) {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Missing token address' });
  }

  const endpoint = `https://public-api.birdeye.so/defi/token_overview?address=${token}&ui_amount_mode=scaled`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/json',
        'x-chain': 'ethereum',
        'x-api-key': '1761b82af37542d193a02366186ab7e7',
      },
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error('Birdeye fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
