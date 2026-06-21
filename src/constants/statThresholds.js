// Each stat entry: label, description, thresholds (good/average cutoffs), higherIsBetter.
// Thresholds reflect approximate MLB standards — update these when real league averages are added.
// TODO: review copy on all descriptions below before shipping.

export const STAT_CONFIG = {

  // ── Hitting ────────────────────────────────────────────────────────────────

  avg: {
    label: 'Batting Average',
    // TODO: review copy
    description: "How often a batter gets a hit for every at-bat. It's the most recognized hitting number, even if it doesn't tell the whole story.",
    thresholds: { good: 0.280, average: 0.240 },
    higherIsBetter: true,
  },

  hr: {
    label: 'Home Runs',
    // TODO: review copy
    description: "Total home runs hit this season. The purest power stat — ball clears the fence, it counts. No math required.",
    thresholds: { good: 25, average: 12 },
    higherIsBetter: true,
  },

  rbi: {
    label: 'RBI',
    // TODO: review copy
    description: "Runs batted in — how many runners scored because of this batter's plate appearances. It's partly luck (you need teammates on base), but it still shows who's delivering in big spots.",
    thresholds: { good: 80, average: 45 },
    higherIsBetter: true,
  },

  ops: {
    label: 'OPS',
    // TODO: review copy
    description: "On-base percentage plus slugging. Combines how often you get on base with how much damage you do when you hit. One of the best single numbers for measuring a hitter. Above .800 is excellent.",
    thresholds: { good: 0.820, average: 0.700 },
    higherIsBetter: true,
  },

  obp: {
    label: 'On-Base %',
    // TODO: review copy
    description: "How often a batter reaches base — hits, walks, hit-by-pitches all count. A high OBP means the batter is hard to get out, which is exactly what a lineup needs.",
    thresholds: { good: 0.350, average: 0.310 },
    higherIsBetter: true,
  },

  sb: {
    label: 'Stolen Bases',
    // TODO: review copy
    description: "How many bases this player has swiped this season. Speed plus smart baserunning. A high number puts pressure on the defense even when the bat is cold.",
    thresholds: { good: 20, average: 8 },
    higherIsBetter: true,
  },

  // ── Pitching ───────────────────────────────────────────────────────────────

  era: {
    label: 'ERA',
    // TODO: review copy
    description: "Earned run average — how many earned runs a pitcher allows per 9 innings. The classic pitching stat. Under 3.00 is ace territory; above 5.00 is a problem.",
    thresholds: { good: 3.20, average: 4.50 },
    higherIsBetter: false,
  },

  wins: {
    label: 'Wins',
    // TODO: review copy
    description: "How many wins the pitcher has been credited with this season. It's the most famous pitching stat, even though it depends heavily on the team around them.",
    thresholds: { good: 15, average: 8 },
    higherIsBetter: true,
  },

  strikeouts: {
    label: 'Strikeouts',
    // TODO: review copy
    description: "Total batters struck out this season. A raw count of punchouts — great for showing dominance, but rate stats like K/9 tell you more about efficiency.",
    thresholds: { good: 180, average: 100 },
    higherIsBetter: true,
  },

  whip: {
    label: 'WHIP',
    // TODO: review copy
    description: "Walks plus hits per inning pitched. How many baserunners the pitcher allows per inning on average. Under 1.10 is elite; above 1.40 means traffic jams are becoming a habit.",
    thresholds: { good: 1.10, average: 1.40 },
    higherIsBetter: false,
  },

  ip: {
    label: 'Innings Pitched',
    // TODO: review copy
    description: "Total innings pitched this season. A high number means the pitcher is healthy, effective, and eating innings — all things teams desperately need.",
    thresholds: { good: 170, average: 100 },
    higherIsBetter: true,
  },

  kper9: {
    label: 'K/9',
    // TODO: review copy
    description: "Strikeouts per 9 innings. A rate stat that shows how often a pitcher misses bats, no matter how many innings they've thrown. Above 10.0 is considered elite stuff.",
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
