import { getStatRating } from '../src/constants/statThresholds.js'
import { MLB_LEAGUE_AVERAGES } from '../src/constants/leagueAverages.js'
import { AI_SYSTEM_PROMPT } from '../src/constants/statContextVoice.js'

// Google rotates Flash models periodically — update this single constant when they do.
const GEMINI_MODEL = 'gemini-3.6-flash'

// NOTE: In-memory rate limiting. Serverless functions may run across multiple
// instances that don't share memory, so this limits per-instance rather than
// globally. A production version would use Vercel KV (Redis-backed) for
// cross-instance rate limiting.
const rateLimitMap = new Map()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000

function isRateLimited(ip) {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) return true
  rateLimitMap.set(ip, [...recent, now])
  return false
}

// MLB API returns IP as "185.1" where .1 = 1 out, not one-tenth of an inning.
function convertIP(ip) {
  if (!ip) return 0
  const [innings, outs = '0'] = String(ip).split('.')
  return parseInt(innings, 10) + parseInt(outs, 10) / 3
}

function calcKper9(strikeOuts, inningsPitched) {
  const ip = convertIP(inningsPitched)
  if (!ip || !strikeOuts) return null
  return ((Number(strikeOuts) * 9) / ip).toFixed(1)
}

// Score a stat side by how many stats are above average.
// 'good' = +2, 'average' = +1, 'poor' = 0. Higher = better performing side.
function focusScore(statMap) {
  return Object.entries(statMap).reduce((score, [key, value]) => {
    const rating = getStatRating(key, value)
    if (rating === 'good') return score + 2
    if (rating === 'average') return score + 1
    return score
  }, 0)
}

function buildUserMessage(playerInfo, hittingStatMap, pitchingStatMap, focus) {
  const avgs = MLB_LEAGUE_AVERAGES
  const name = playerInfo.fullName
  const position = playerInfo.primaryPosition?.name ?? 'Unknown'
  const team = playerInfo.currentTeam?.name ?? 'Unknown'
  const age = playerInfo.currentAge

  const lines = [
    `Player: ${name}, ${position}, ${team}, Age ${age}`,
    `Focus: ${focus === 'hitting' ? 'Hitting' : 'Pitching'}`,
    '',
  ]

  if (hittingStatMap) {
    lines.push('HITTING STATS (2026 season):')
    lines.push(`  Batting Average: ${hittingStatMap.avg ?? 'N/A'} (MLB avg: ${avgs.hitting.avg})`)
    lines.push(`  On-Base %: ${hittingStatMap.obp ?? 'N/A'} (MLB avg: ${avgs.hitting.obp})`)
    lines.push(`  OPS: ${hittingStatMap.ops ?? 'N/A'} (MLB avg: ${avgs.hitting.ops})`)
    lines.push(`  Home Runs: ${hittingStatMap.hr ?? 'N/A'} (MLB avg at midseason: ${avgs.hitting.hr})`)
    lines.push(`  RBI: ${hittingStatMap.rbi ?? 'N/A'} (MLB avg at midseason: ${avgs.hitting.rbi})`)
    lines.push(`  Stolen Bases: ${hittingStatMap.sb ?? 'N/A'} (MLB avg at midseason: ${avgs.hitting.sb})`)
    lines.push('')
  }

  if (pitchingStatMap) {
    lines.push('PITCHING STATS (2026 season):')
    lines.push(`  ERA: ${pitchingStatMap.era ?? 'N/A'} (MLB avg: ${avgs.pitching.era})`)
    lines.push(`  WHIP: ${pitchingStatMap.whip ?? 'N/A'} (MLB avg: ${avgs.pitching.whip})`)
    lines.push(`  K/9: ${pitchingStatMap.kper9 ?? 'N/A'} (MLB avg: ${avgs.pitching.kper9})`)
    lines.push(`  Wins: ${pitchingStatMap.wins ?? 'N/A'} (MLB avg at midseason: ${avgs.pitching.wins})`)
    lines.push(`  Strikeouts: ${pitchingStatMap.strikeouts ?? 'N/A'} (MLB avg at midseason: ${avgs.pitching.strikeouts})`)
    lines.push(`  Innings Pitched: ${pitchingStatMap.ip ?? 'N/A'} (MLB avg at midseason: ${avgs.pitching.ip})`)
    lines.push('')
  }

  lines.push("Write 2-3 sentences for a casual fan summarizing this player's 2026 season based on these stats.")

  return lines.join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { playerId } = req.query
  if (!playerId || !/^\d+$/.test(playerId)) {
    return res.status(400).json({ error: 'Invalid player ID' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
    ?? req.socket?.remoteAddress
    ?? 'unknown'

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  console.log('[StatContextTake] GEMINI_API_KEY present:', !!apiKey)
  if (!apiKey) {
    return res.status(503).json({ error: 'AI summary unavailable' })
  }

  try {
    const [infoRes, statsRes] = await Promise.all([
      fetch(`https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam`),
      fetch(`https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=season&season=2026&group=hitting,pitching`),
    ])
    const infoData  = await infoRes.json()
    const statsData = await statsRes.json()

    const playerInfo = infoData.people?.[0]
    if (!playerInfo) return res.status(404).json({ error: 'Player not found' })

    const allStats   = statsData.stats ?? []
    const hittingRaw = allStats.find(s => s.group?.displayName === 'hitting')?.splits?.[0]?.stat
    const pitchingRaw = allStats.find(s => s.group?.displayName === 'pitching')?.splits?.[0]?.stat

    const hittingStatMap = hittingRaw ? {
      avg: hittingRaw.avg,
      hr:  hittingRaw.homeRuns,
      rbi: hittingRaw.rbi,
      ops: hittingRaw.ops,
      obp: hittingRaw.obp,
      sb:  hittingRaw.stolenBases,
    } : null

    const pitchingStatMap = pitchingRaw ? {
      era:        pitchingRaw.era,
      wins:       pitchingRaw.wins,
      strikeouts: pitchingRaw.strikeOuts,
      whip:       pitchingRaw.whip,
      ip:         pitchingRaw.inningsPitched,
      kper9:      calcKper9(pitchingRaw.strikeOuts, pitchingRaw.inningsPitched),
    } : null

    if (!hittingStatMap && !pitchingStatMap) {
      return res.status(404).json({ error: 'No stats available for this player' })
    }

    const focus = !pitchingStatMap ? 'hitting'
      : !hittingStatMap ? 'pitching'
      : focusScore(hittingStatMap) >= focusScore(pitchingStatMap) ? 'hitting'
      : 'pitching'

    const userMessage = buildUserMessage(playerInfo, hittingStatMap, pitchingStatMap, focus)

    console.log('[StatContextTake] Calling Gemini for playerId:', playerId)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: AI_SYSTEM_PROMPT }],
          },
          contents: [
            { role: 'user', parts: [{ text: userMessage }] },
          ],
          generationConfig: {
            maxOutputTokens: 300,
            // Gemini 3.x reasoning overhead is controlled server-side per model.
            // No client-side thinkingConfig supported — removed from 2.5 format.
          },
        }),
      }
    )

    console.log('[StatContextTake] Gemini response status:', geminiRes.status)
    if (!geminiRes.ok) {
      const errorBody = await geminiRes.text()
      console.error('[StatContextTake] Gemini error body:', errorBody)
      return res.status(502).json({ error: 'AI summary unavailable' })
    }

    const geminiData = await geminiRes.json()
    const summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? null

    if (!summary) return res.status(502).json({ error: 'AI summary unavailable' })

    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.status(200).json({ summary })

  } catch (err) {
    console.error('[StatContextTake] Caught error:', err.message)
    console.error('[StatContextTake] Stack:', err.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}
