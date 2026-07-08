import { adaptMLBGame } from '../utils/gameAdapter'

// West Coast games regularly finish between 1–2am ET. Without a buffer, rolling
// over at midnight ET would show tomorrow's unplayed schedule instead of tonight's
// final scores. Returning yesterday's date until 3am ET keeps the correct games visible.
function getEffectiveGameDate() {
  const now = new Date()

  const etHour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    }).format(now),
    10
  )

  if (etHour < 3) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
  }

  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

export async function getTodaysGames() {
  const today = getEffectiveGameDate()

  const response = await fetch(`/api/games?date=${today}`)
  const data = await response.json()
  const rawGames = data.dates?.[0]?.games ?? []

  return rawGames.map(adaptMLBGame)
}

export async function getPlayer(playerId) {
  const response = await fetch(`/api/player?playerId=${playerId}`)
  const data = await response.json()
  return data
}

export async function searchPlayers(query, signal) {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}`,
    { signal }
  )
  const data = await response.json()
  return data.people ?? []
}