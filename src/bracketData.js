// Inline JSON data source: the tournament's scores and final games.
// deriveMatches() turns this JSON into the bracket state — winners and the
// teams that advance are derived from the scores. Nothing depends on clicks.

export const TOURNAMENT_DATA = {
  tournamentName: 'Champions Cup',
  footnote: 'Thank you Anders for organizing.',
  season: '2026 Knock-Out Stage',
  backgroundImage:
    'https://images.pexels.com/photos/33845031/pexels-photo-33845031.jpeg',
  matches: [
    // Quarterfinals
    {
      id: 'qf-1',
      roundIndex: 0,
      roundName: 'Quarterfinals',
      nextMatchId: 'sf-1',
      nextSlot: 'home',
      home: { id: 't1', name: 'Ari', seed: "Liverpool" },
      away: { id: 't8', name: 'Beau', seed: "Arsenal" },
      //score: { home: 3, away: 1 },
    },
    {
      id: 'qf-2',
      roundIndex: 0,
      roundName: 'Quarterfinals',
      nextMatchId: 'sf-1',
      nextSlot: 'away',
      home: { id: 't4', name: 'Louie', seed: "Real Madrid" },
      away: { id: 't5', name: 'Daniel', seed: "Barcelona" },
      //score: { home: 2, away: 3 },
    },
    {
      id: 'qf-3',
      roundIndex: 0,
      roundName: 'Quarterfinals',
      nextMatchId: 'sf-2',
      nextSlot: 'home',
      home: { id: 't2', name: 'Clark', seed: "Bayern Munich" },
      away: { id: 't7', name: 'Flo', seed: "Aston Villa" },
      //score: { home: 4, away: 0 },
    },
    {
      id: 'qf-4',
      roundIndex: 0,
      roundName: 'Quarterfinals',
      nextMatchId: 'sf-2',
      nextSlot: 'away',
      home: { id: 't3', name: 'Owen', seed: "Atletico Madrid" },
      away: { id: 't6', name: 'Avvan', seed: "Manchester City" },
      //score: { home: 1, away: 2 },
    },

    // Semifinals — the teams arrive by propagation from the quarterfinals
    {
      id: 'sf-1',
      roundIndex: 1,
      roundName: 'Semifinals',
      nextMatchId: 'final-1',
      nextSlot: 'home',
      home: null,
      away: null,
      //score: { home: 2, away: 1 },
    },
    {
      id: 'sf-2',
      roundIndex: 1,
      roundName: 'Semifinals',
      nextMatchId: 'final-1',
      nextSlot: 'away',
      home: null,
      away: null,
      //score: { home: 3, away: 2 },
    },

    // Championship final
    {
      id: 'final-1',
      roundIndex: 2,
      roundName: 'Championship',
      nextMatchId: null,
      nextSlot: null,
      home: null,
      away: null,
      //score: { home: 2, away: 1 },
      winnerId: 't1',
    },
  ],
};

// Derives the bracket state from the inline JSON: each match with teams and a
// numeric score gets a winnerId, and every winner is written into the next
// match's slot. Nothing depends on clicks.
export const deriveMatches = (data = TOURNAMENT_DATA) => {
  const matches = data.matches
    .map((match) => ({
      ...match,
      home: match.home ? { ...match.home } : null,
      away: match.away ? { ...match.away } : null,
      winnerId: match.winnerId ?? null,
    }))
    .sort((a, b) => a.roundIndex - b.roundIndex);

  for (const match of matches) {
    if (match.home && match.away) {
      const homeScore = match.score?.home;
      const awayScore = match.score?.away;
      if (typeof homeScore === 'number' && typeof awayScore === 'number') {
        if (homeScore > awayScore) {
          match.winnerId = match.home.id;
        } else if (awayScore > homeScore) {
          match.winnerId = match.away.id;
        }
        // On a tie the explicit winnerId from the JSON stands; otherwise the match is undecided.
      }
    }

    if (match.winnerId && match.nextMatchId) {
      const target = matches.find((m) => m.id === match.nextMatchId);
      if (!target) continue;
      const advancingTeam =
        match.home?.id === match.winnerId
          ? match.home
          : match.away?.id === match.winnerId
            ? match.away
            : null;
      target[match.nextSlot] = advancingTeam ? { ...advancingTeam } : null;
    }
  }

  return matches;
};
