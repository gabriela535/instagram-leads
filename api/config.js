export default function handler(req, res) {
  res.status(200).json({
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    apifyToken: process.env.APIFY_TOKEN,
  });
}
