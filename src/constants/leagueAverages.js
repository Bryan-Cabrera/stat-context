// 2026 MLB League Averages — snapshot through early July 2026
// Counting stats (hr, rbi, sb, wins, strikeouts, ip) are approximate per-player
// midseason values derived from league per-game rates — they're context anchors
// for AI-generated summaries, not displayed data. Update once or twice per season.
// TODO Phase 2: replace with live league averages fetched from the MLB Stats API.

export const MLB_LEAGUE_AVERAGES = {
  season: 2026,
  asOf: '2026-07-07',
  hitting: {
    avg: 0.243,
    obp: 0.319,
    ops: 0.718,
    hr: 10,          // approx. per regular hitter at midseason
    rbi: 38,         // approx. per regular hitter at midseason
    sb: 6,           // approx. per regular hitter at midseason
  },
  pitching: {
    era: 4.21,
    whip: 1.31,
    kper9: 8.5,
    wins: 5,         // approx. per regular starter at midseason
    strikeouts: 85,  // approx. per regular starter at midseason
    ip: 90,          // approx. per regular starter at midseason
  },
}