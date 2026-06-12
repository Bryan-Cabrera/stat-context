import { adaptMLBGame } from '../utils/gameAdapter'

export async function getTodaysGames() {
  const now = new Date()
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const today = etDate.toISOString().split('T')[0]

  const response = await fetch(`/api/games?date=${today}`)
  const data = await response.json()
  const rawGames = data.dates?.[0]?.games ?? []

  console.log('Raw games count:', rawGames.length)
  console.log('First game status:', rawGames[0]?.status?.abstractGameState)
  console.log('First game away score:', rawGames[0]?.teams?.away?.score)

  return rawGames.map(adaptMLBGame)
}