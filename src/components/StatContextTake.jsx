import { useState, useEffect } from 'react'
import { getStatContextTake } from '../services/mlbApi'

function StatContextTake({ playerId }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await getStatContextTake(playerId)
        setSummary(data.summary ?? null)
      } catch {
        setSummary(null)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [playerId])

  if (loading) {
    return (
      <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
        <div className="h-3 bg-gray-800 rounded w-28 mb-3" />
        <div className="h-4 bg-gray-800 rounded w-full mb-2" />
        <div className="h-4 bg-gray-800 rounded w-3/4" />
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm" aria-hidden="true">⚡</span>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          StatContext Take
        </span>
      </div>
      <p className="text-sm text-gray-200 leading-relaxed">{summary}</p>
    </div>
  )
}

export default StatContextTake
