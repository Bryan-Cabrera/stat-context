import { adaptMLBGame } from '../utils/gameAdapter'

const BASE_URL = 'https://statsapi.mlb.com/api/v1'

export async function getTodaysGames() {
  const now = new Date()
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const today = etDate.toISOString().split('T')[0]

  const url = `${BASE_URL}/schedule?sportId=1&date=${today}&hydrate=team`
  const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  const data = await response.json()
  const parsed = JSON.parse(data.contents)
  const rawGames = parsed.dates?.[0]?.games ?? []
  return rawGames.map(adaptMLBGame)
}