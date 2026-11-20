import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOURNAMENT_DATA, deriveMatches } from './bracketData.js';

const matches = deriveMatches(TOURNAMENT_DATA);
const byId = Object.fromEntries(matches.map((m) => [m.id, m]));

test('quarterfinal winners come from the inline JSON scores', () => {
  assert.equal(byId['qf-1'].winnerId, 't1');
  assert.equal(byId['qf-2'].winnerId, 't5');
  assert.equal(byId['qf-3'].winnerId, 't2');
  assert.equal(byId['qf-4'].winnerId, 't6');
});

test('semifinals receive the quarterfinal winners via propagation', () => {
  assert.equal(byId['sf-1'].home?.id, 't1');
  assert.equal(byId['sf-1'].away?.id, 't5');
  assert.equal(byId['sf-2'].home?.id, 't2');
  assert.equal(byId['sf-2'].away?.id, 't6');
});

test('semifinal winners are derived from the JSON scores', () => {
  assert.equal(byId['sf-1'].winnerId, 't1');
  assert.equal(byId['sf-2'].winnerId, 't2');
});

test('the final receives the semifinal winners and derives its result from the JSON', () => {
  assert.equal(byId['final-1'].home?.id, 't1');
  assert.equal(byId['final-1'].away?.id, 't2');
  assert.equal(byId['final-1'].winnerId, 't1');
});

test('derivation does not mutate the source JSON', () => {
  const sourceSf1 = TOURNAMENT_DATA.matches.find((m) => m.id === 'sf-1');
  assert.equal(sourceSf1.home, null);
  assert.equal(byId['sf-1'].home.id, 't1');
});
