export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query } = req.query

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Query is required' })
  }

  try {
    const response = await fetch(
      `https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(query.trim())}&sportId=1`
    )
    const data = await response.json()

    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.status(200).json({ people: data.people ?? [] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' })
  }
}
