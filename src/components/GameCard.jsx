function GameCard({ game }) {
  const away = game.teams.away
  const home = game.teams.home
  const status = game.status.abstractGameState

  const getStatusDisplay = () => {
    if (status === 'Final') {
      return <span className="text-xs text-gray-400">Final</span>
    }
    if (status === 'Live') {
      return <span className="text-xs text-green-400 font-semibold">● Live</span>
    }
    return <span className="text-xs text-gray-400">Scheduled</span>
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-400 transition-colors cursor-pointer">
      <div className="flex justify-between items-center mb-3">
        {getStatusDisplay()}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{away.team.name}</span>
          <span className="text-lg font-bold">
            {status !== 'Preview' ? away.score ?? '-' : '-'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{home.team.name}</span>
          <span className="text-lg font-bold">
            {status !== 'Preview' ? home.score ?? '-' : '-'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default GameCard