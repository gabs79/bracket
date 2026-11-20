import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Shield } from 'lucide-react';
import { TOURNAMENT_DATA, deriveMatches } from './bracketData';

const MatchCard = ({ match, delay = 0 }) => {
  const renderSlot = (slot) => {
    const team = match[slot];
    const score = match.score?.[slot];
    const isWinner = team && match.winnerId === team.id;
    const isLoser = team && match.winnerId && match.winnerId !== team.id;

    return (
      <div
        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left border-b last:border-b-0 border-white/10 ${
          isWinner
            ? 'bg-emerald-500/25 text-white font-bold'
            : isLoser
            ? 'opacity-40 text-slate-300'
            : team
            ? 'text-slate-100'
            : 'text-slate-500'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {team ? (
            <>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-emerald-300">
                {team.seed}
              </span>
              <span className="truncate text-sm">{team.name}</span>
            </>
          ) : (
            <span className="text-xs italic text-slate-500">Awaiting Winner...</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {typeof score === 'number' && (
            <span className="text-xs font-mono font-semibold text-slate-300 bg-black/30 px-2 py-0.5 rounded">
              {score}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="w-[min(16rem,calc(100vw-2rem))] shrink-0 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl"
    >
      <div className="bg-white/5 px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex justify-between items-center">
        <span>{match.roundName}</span>
        <Shield className="w-3 h-3 opacity-60" />
      </div>
      <div>
        {renderSlot('home')}
        {renderSlot('away')}
      </div>
    </motion.div>
  );
};

const ConnectorPair = ({ active, heightClass = 'h-36' }) => (
  <svg className={`w-12 ${heightClass} hidden md:block`} viewBox="0 0 48 144" fill="none" preserveAspectRatio="none">
    <path d="M0 24 H24 V72 H48 M0 120 H24 V72" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <motion.path
      d="M0 24 H24 V72 H48 M0 120 H24 V72"
      stroke="#10b981"
      strokeWidth="2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    />
  </svg>
);

export default function ChampionshipBracket() {
  const [matches, setMatches] = useState(() => deriveMatches(TOURNAMENT_DATA));

  const quarterfinals = matches.filter((m) => m.roundIndex === 0);
  const semifinals = matches.filter((m) => m.roundIndex === 1);
  const finalMatch = matches.find((m) => m.roundIndex === 2);

  const champion =
    finalMatch?.winnerId === finalMatch?.home?.id
      ? finalMatch?.home
      : finalMatch?.winnerId === finalMatch?.away?.id
      ? finalMatch?.away
      : null;

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden font-sans">
      <div
        className="fixed inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: `url('${TOURNAMENT_DATA.backgroundImage}')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/80 to-slate-950/95 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-7 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" /> {TOURNAMENT_DATA.season}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight">
            {TOURNAMENT_DATA.tournamentName} <span className="text-emerald-400">Bannockburn</span>
          </h1>
        </motion.div>

        <div className="w-full overflow-x-auto overscroll-x-contain pb-4 md:overflow-visible">
        <div className="flex w-max min-w-full items-start gap-4 px-1 md:hidden">
          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300">Quarterfinals</h2>
            {quarterfinals.map((match, i) => <MatchCard key={match.id} match={match} delay={i * 0.1} />)}
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300">Semifinals</h2>
            {semifinals.map((match, i) => <MatchCard key={match.id} match={match} delay={0.4 + i * 0.1} />)}
          </section>
          <section className="flex min-w-64 flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300">Final</h2>
            {finalMatch && <MatchCard match={finalMatch} delay={0.6} />}
            {champion && <div className="w-64 rounded-xl border border-amber-400/50 bg-amber-500/20 p-4 text-center"><Trophy className="mx-auto mb-1 h-8 w-8 text-amber-400" /><div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Tournament Champion</div><div className="mt-0.5 text-lg font-black">{champion.name}</div></div>}
          </section>
        </div>
        <div className="hidden md:flex md:w-full md:items-center md:justify-center">
        <div className="flex w-max min-w-full flex-col items-center gap-6 md:w-full md:flex-row md:justify-center md:gap-0">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              {quarterfinals.slice(0, 2).map((match, i) => (
                <MatchCard key={match.id} match={match} delay={i * 0.1} />
              ))}
            </div>
            <div className="flex flex-col gap-5">
              {quarterfinals.slice(2, 4).map((match, i) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  delay={(i + 2) * 0.1}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-around h-[470px]">
            <ConnectorPair
              active={Boolean(quarterfinals[0]?.winnerId && quarterfinals[1]?.winnerId)}
            />
            <ConnectorPair
              active={Boolean(quarterfinals[2]?.winnerId && quarterfinals[3]?.winnerId)}
            />
          </div>

          <div className="flex flex-col justify-around h-[470px] gap-8">
            {semifinals.map((match, i) => (
              <MatchCard
                key={match.id}
                match={match}
                delay={0.4 + i * 0.1}
              />
            ))}
          </div>

          <div className="flex items-center">
            <ConnectorPair
              heightClass="h-64"
              active={Boolean(semifinals[0]?.winnerId && semifinals[1]?.winnerId)}
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            {finalMatch && (
              <MatchCard match={finalMatch} delay={0.6} />
            )}

            <AnimatePresence>
              {champion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="w-64 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400/50 text-center shadow-xl"
                >
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1 animate-bounce" />
                  <div className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                    Tournament Champion
                  </div>
                  <div className="text-lg font-black text-white mt-0.5">{champion.name}</div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
        </div>
        </div>
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" /> {TOURNAMENT_DATA.footnote}
              <p>&copy; 2026. All rights reserved.</p>
          </div>

      </div>
    </div>
  );
}
