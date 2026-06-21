import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchPlayers } from '../services/mlbApi'

function SearchBar() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen]   = useState(false)
  const containerRef          = useRef(null)
  const navigate              = useNavigate()

  // Debounced search with AbortController to cancel stale requests
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setLoading(true)
      setIsOpen(true)
      try {
        const people = await searchPlayers(query, controller.signal)
        setResults(people)
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(player) {
    navigate(`/player/${player.id}`)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search players..."
          className="w-64 bg-gray-800 text-white text-sm placeholder-gray-500 rounded-lg px-4 py-2 pr-8 outline-none border border-gray-700 focus:border-blue-400 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">
          🔍
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full min-w-72 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden z-50 shadow-2xl">
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-400">Searching...</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">No players found</p>
          )}
          {!loading && results.map(player => (
            <button
              key={player.id}
              onClick={() => handleSelect(player)}
              className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0 flex items-center justify-between gap-4"
            >
              <span className="text-white text-sm font-medium">{player.fullName}</span>
              <span className="text-gray-500 text-xs shrink-0">{player.primaryPosition?.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
