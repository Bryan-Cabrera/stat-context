function GameCard({ game }) {
  const { awayTeam, homeTeam, status, sport } = game

  const getStatusDisplay = () => {
    if (status === 'Final') {
      return <span className="text-xs text-gray-400">Final</span>
    }
    if (status === 'Live') {
      return <span className="text-xs text-green-400 font-semibold">● Live</span>
    }
    return <span className="text-xs text-gray-400">Scheduled</span>
  }

  const getScore = (team) => {
    if (status === 'Final' || status === 'Live') {
      return team.score ?? '-'
    }
    return '-'
  }

  const getSportEmoji = () => {
    if (sport === 'MLB') return '⚾'
    if (sport === 'MLS') return '⚽'
    if (sport === 'NBA') return '🏀'
    return '🏆'
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-400 transition-colors cursor-pointer">
      <div className="flex justify-between items-center mb-3">
        {getStatusDisplay()}
        <span className="text-xs text-gray-600">{getSportEmoji()}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-8">{awayTeam.abbreviation}</span>
            <span className="text-sm font-medium">{awayTeam.name}</span>
          </div>
          <span className="text-lg font-bold">{getScore(awayTeam)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-8">{homeTeam.abbreviation}</span>
            <span className="text-sm font-medium">{homeTeam.name}</span>
          </div>
          <span className="text-lg font-bold">{getScore(homeTeam)}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-800">
        <span className="text-xs text-gray-600">{game.venue}</span>
      </div>
    </div>
  )
}

export default GameCard