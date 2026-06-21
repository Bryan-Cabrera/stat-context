export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { playerId } = req.query

  if (!playerId || !/^\d+$/.test(playerId)) {
    return res.status(400).json({ error: 'Invalid player ID' })
  }

  try {
    const [infoRes, statsRes] = await Promise.all([
      fetch(`https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam`),
      fetch(`https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=season&season=2026&group=hitting,pitching`)
    ])

    const infoData = await infoRes.json()
    const statsData = await statsRes.json()

    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.status(200).json({
      info: infoData.people?.[0] ?? null,
      stats: statsData.stats ?? []
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player data' })
  }
}