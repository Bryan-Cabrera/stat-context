import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import GameCard from '../components/GameCard'
import { getTodaysGames } from '../services/mlbApi'

function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await getTodaysGames()
        setGames(data)
      } catch (err) {
        console.log('API Error:', err)
        setError('Could not load today\'s games.')
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <SearchBar />
        <h2 className="text-xl font-bold mb-4">Today's Games</h2>
        {loading && <p className="text-gray-400">Loading games...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && games.length === 0 && (
          <p className="text-gray-400">No games scheduled today.</p>
        )}
        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <GameCard key={game.gamePk} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home