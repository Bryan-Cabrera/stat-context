import { adaptMLBGame } from '../utils/gameAdapter'

export async function getTodaysGames() {
  const now = new Date()
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const today = etDate.toISOString().split('T')[0]

  console.log('Fetching games for date:', today)

  const response = await fetch(`/api/games?date=${today}`)
  const data = await response.json()
  const rawGames = data.dates?.[0]?.games ?? []
  return rawGames.map(adaptMLBGame)
}