const BASE_URL = 'https://statsapi.mlb.com/api/v1'
const PROXY = 'https://corsproxy.io/?url='

export async function getTodaysGames() {
  // Use ET (Eastern Time) since MLB schedules are based on ET
  const now = new Date()
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const today = etDate.toISOString().split('T')[0]
  
  const url = `${BASE_URL}/schedule?sportId=1&date=${today}&hydrate=team`
  const response = await fetch(`${PROXY}${encodeURIComponent(url)}`)
  const data = await response.json()
  return data.dates?.[0]?.games ?? []
}