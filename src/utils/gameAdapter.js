export function adaptMLBGame(game) {
    return {
        id: String(game.gamePk),
        sport: 'MLB',
        status: game.status.abstractGameState,
        awayTeam: {
            name: game.teams.away.team.name,
            abbreviation: game.teams.away.team.abbreviation,
            score: game.teams.away.score ?? null,
        },
        homeTeam: {
            name: game.teams.home.team.name,
            abbreviation: game.teams.home.team.abbreviation,
            score: game.teams.home.score ?? null,
        },
        startTime: game.gameDate,
        venue: game.venue.name,
    }
}