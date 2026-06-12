import { adaptMLBGame } from '../utils/gameAdapter'

export async function getTodaysGames() {
  const now = new Date()
  
  //To format date in ET without converting back to UTC
  const today = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
  
  const response = await fetch(`/api/games?date=${today}`)
  const data = await response.json()
  const rawGames = data.dates?.[0]?.games ?? []

  return rawGames.map(adaptMLBGame)
}