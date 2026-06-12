import { adaptMLBGame } from '../utils/gameAdapter'

export async function getTodaysGames() {
  const now = new Date()
  
  //To format date in ET without converting back to UTC
  const today = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
  
  const response = await fetch(`/api/games?date=${today}`)
  const data = await response.json()
  const rawGames = data.dates?.[0]?.games ?? []

  console.log('Fetching date:', today)
  console.log('Raw games count:', rawGames.length)
  console.log('First game status:', rawGames[0]?.status?.abstractGameState)

  return rawGames.map(adaptMLBGame)
}