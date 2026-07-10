// Each stat entry: label, description, thresholds (good/average cutoffs), higherIsBetter.
// Thresholds reflect approximate MLB standards — update these when real league averages are added.

export const STAT_CONFIG = {

  // ── Hitting ────────────────────────────────────────────────────────────────

  avg: {
    label: 'Batting Average',
    description: "How often a batter gets a hit every time they step to the plate. Above .280 means consistent contact — below .230 and they're in a real slump.",
    thresholds: { good: 0.280, average: 0.240 },
    higherIsBetter: true,
  },

  hr: {
    label: 'Home Runs',
    description: "The purest power stat — how many times they've cleared the fence this season. 30+ puts you among the league's best; 40+ and you're in MVP conversation.",
    thresholds: { good: 25, average: 12 },
    higherIsBetter: true,
  },

  rbi: {
    label: 'RBI',
    description: "How many runners scored because of this batter's plate appearances. It shows who delivers when it counts, but keep in mind a batter needs teammates on base to rack these up.",
    thresholds: { good: 80, average: 45 },
    higherIsBetter: true,
  },

  ops: {
    label: 'OPS',
    description: "The single best number for judging a hitter overall. It combines how often they get on base with how hard they hit — above .800 is solid, above .900 means you're watching one of the best hitters in the league.",
    thresholds: { good: 0.820, average: 0.700 },
    higherIsBetter: true,
  },

  obp: {
    label: 'On-Base %',
    description: "How often a batter reaches base through hits, walks, or getting hit by a pitch. Pitchers have to earn every out against someone above .350.",
    thresholds: { good: 0.350, average: 0.310 },
    higherIsBetter: true,
  },

  sb: {
    label: 'Stolen Bases',
    description: "How many bases this player has swiped this season. Speed plus smart baserunning puts pressure on the defense even when the bat goes cold.",
    thresholds: { good: 20, average: 8 },
    higherIsBetter: true,
  },

  // ── Pitching ───────────────────────────────────────────────────────────────

  era: {
    label: 'ERA',
    description: "How many earned runs a pitcher gives up per 9 innings. Below 3.00 is ace territory — above 5.00 and opposing hitters are doing serious damage.",
    thresholds: { good: 3.20, average: 4.50 },
    higherIsBetter: false,
  },

  wins: {
    label: 'Wins',
    description: "How many games the pitcher has been credited with winning. It's the most visible pitching stat, but a great pitcher on a bad team won't rack up wins — don't judge a pitcher on this alone.",
    thresholds: { good: 15, average: 8 },
    higherIsBetter: true,
  },

  strikeouts: {
    label: 'Strikeouts',
    description: "Total batters struck out this season. High totals show pure dominance, but check K/9 too — it tells you how often they're missing bats regardless of how many innings they've thrown.",
    thresholds: { good: 180, average: 100 },
    higherIsBetter: true,
  },

  whip: {
    label: 'WHIP',
    description: "Walks plus hits per inning pitched — how many baserunners a pitcher allows on average. Below 1.10 is elite; above 1.40 and they're putting runners on base almost every inning.",
    thresholds: { good: 1.10, average: 1.40 },
    higherIsBetter: false,
  },

  ip: {
    label: 'Innings Pitched',
    description: "Total innings pitched this season. Pitchers who go deep into games save the bullpen and signal that their team trusts them — a high number means they're healthy and doing their job.",
    thresholds: { good: 170, average: 100 },
    higherIsBetter: true,
  },

  kper9: {
    label: 'K/9',
    description: "Strikeouts per 9 innings, adjusted for however many innings they've actually thrown. It levels the playing field between starters and relievers — above 10.0 means they're tough to make contact against.",
    thresholds: { good: 10.0, average: 7.5 },
    higherIsBetter: true,
  },

}

// Returns 'good' | 'average' | 'poor' | null (null = no data or unrecognized stat)
export function getStatRating(statKey, value) {
  const config = STAT_CONFIG[statKey]
  if (!config || value === null || value === undefined) return null

  const num = parseFloat(value)
  if (isNaN(num)) return null

  const { good, average } = config.thresholds

  if (config.higherIsBetter) {
    if (num >= good) return 'good'
    if (num >= average) return 'average'
    return 'poor'
  } else {
    if (num <= good) return 'good'
    if (num <= average) return 'average'
    return 'poor'
  }
}