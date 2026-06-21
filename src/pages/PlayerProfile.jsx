import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPlayer } from '../services/mlbApi'
import { STAT_CONFIG, getStatRating } from '../constants/statThresholds'

// MLB API returns IP as "185.1" where .1 = 1 out, not one-tenth of an inning.
function convertIP(ip) {
  if (!ip) return 0
  const [innings, outs = '0'] = String(ip).split('.')
  return parseInt(innings, 10) + parseInt(outs, 10) / 3
}

function calcKper9(strikeOuts, inningsPitched) {
  const ip = convertIP(inningsPitched)
  if (!ip || !strikeOuts) return null
  return ((Number(strikeOuts) * 9) / ip).toFixed(1)
}

const RATING_STYLES = {
  good:    { value: 'text-green-400',  badge: 'bg-green-900/40 text-green-400',  label: 'Good' },
  average: { value: 'text-yellow-400', badge: 'bg-yellow-900/40 text-yellow-400', label: 'Avg' },
  poor:    { value: 'text-red-400',    badge: 'bg-red-900/40 text-red-400',      label: 'Poor' },
}

function StatCard({ configKey, value }) {
  const config = STAT_CONFIG[configKey]
  const rating = getStatRating(configKey, value)
  const styles = RATING_STYLES[rating] ?? {}

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-2xl font-bold ${styles.value ?? 'text-white'}`}>
          {value ?? '-'}
        </span>
        {rating && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-1 ${styles.badge}`}>
            {styles.label}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400">{config.label}</div>
      <p className="text-xs text-gray-500 leading-relaxed mt-1">{config.description}</p>
    </div>
  )
}

function PlayerHeader({ player }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{player.fullName}</h1>
      <p className="text-gray-400 mt-1">
        {player.currentTeam?.name} · {player.primaryPosition?.name} · #{player.primaryNumber}
      </p>
      <div className="flex gap-4 mt-2 text-sm text-gray-500">
        <span>Bats: {player.batSide?.description}</span>
        <span>Throws: {player.pitchHand?.description}</span>
        <span>Age: {player.currentAge}</span>
      </div>
    </div>
  )
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

function PlayerProfile() {
  const { playerId } = useParams()
  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPlayer() {
      try {
        const data = await getPlayer(playerId)
        setPlayer(data.info)
        setStats(data.stats)
      } catch (err) {
        setError('Could not load player data.')
      } finally {
        setLoading(false)
      }
    }
    fetchPlayer()
  }, [playerId])

  if (loading) return <PageShell><p className="text-gray-400">Loading player...</p></PageShell>
  if (error)   return <PageShell><p className="text-red-400">{error}</p></PageShell>
  if (!player) return null

  const hittingStats  = stats.find(s => s.group?.displayName === 'hitting')?.splits?.[0]?.stat
  const pitchingStats = stats.find(s => s.group?.displayName === 'pitching')?.splits?.[0]?.stat

  const hittingCards = hittingStats ? [
    { configKey: 'avg',  value: hittingStats.avg },
    { configKey: 'hr',   value: hittingStats.homeRuns },
    { configKey: 'rbi',  value: hittingStats.rbi },
    { configKey: 'ops',  value: hittingStats.ops },
    { configKey: 'obp',  value: hittingStats.obp },
    { configKey: 'sb',   value: hittingStats.stolenBases },
  ] : []

  const pitchingCards = pitchingStats ? [
    { configKey: 'era',        value: pitchingStats.era },
    { configKey: 'wins',       value: pitchingStats.wins },
    { configKey: 'strikeouts', value: pitchingStats.strikeOuts },
    { configKey: 'whip',       value: pitchingStats.whip },
    { configKey: 'ip',         value: pitchingStats.inningsPitched },
    { configKey: 'kper9',      value: calcKper9(pitchingStats.strikeOuts, pitchingStats.inningsPitched) },
  ] : []

  return (
    <PageShell>
      <PlayerHeader player={player} />

      {hittingCards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Hitting</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {hittingCards.map(card => <StatCard key={card.configKey} {...card} />)}
          </div>
        </section>
      )}

      {pitchingCards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Pitching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {pitchingCards.map(card => <StatCard key={card.configKey} {...card} />)}
          </div>
        </section>
      )}
    </PageShell>
  )
}

export default PlayerProfile
