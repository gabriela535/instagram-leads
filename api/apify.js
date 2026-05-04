export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { action, payload } = req.body;
  const token = process.env.APIFY_TOKEN;
  try {
    if (action === 'startRun') {
      const { actorId, input } = payload;
      const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
    if (action === 'getStatus') {
      const { runId } = payload;
      const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    if (action === 'getResults') {
      const { runId } = payload;
      const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
