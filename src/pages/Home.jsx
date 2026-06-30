import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import GameCard from '../components/GameCard'
import { getTodaysGames } from '../services/mlbApi'

function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  async function fetchGames() {
    try {
      const data = await getTodaysGames()
      setGames(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.log('API Error:', err)
      setError('Could not load today\'s games.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
    const interval = setInterval(fetchGames, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today's Games</h2>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        {loading && <p className="text-gray-400">Loading games...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && games.length === 0 && (
          <p className="text-gray-400">No games scheduled today.</p>
        )}
        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-x1 font-bold">StatSpotlight</h2>
            <span className="text-xs font-medium bg-blue-900 text=blue-300 px-3 py-1 rounded-full">
              Coming Soon 
            </span>
          </div>
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-x1 p-8 text-center">
            <div className="text-3xl mb-3">🔦</div>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Eventually we'll show the most interesting stat story - an overperforming rookie, a historic streak, or a slump worth knowing about.
            </p>
          </div>
        </div>
        
      </main>
    </div>
  )
}

export default Home