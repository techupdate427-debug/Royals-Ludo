const test = require('node:test');
const assert = require('node:assert/strict');
const rules = require('../game-rules.js');

const token = (progress, shielded = false) => ({ progress, shielded });
const player = (id, start, tokens) => ({ id, start, tokens });

test('a token can leave home only on a six', () => {
  assert.equal(rules.canMove(-1, 5), false);
  assert.equal(rules.canMove(-1, 6), true);
  assert.equal(rules.nextProgress(-1, 6), 0);
});

test('finished tokens cannot move and normal moves cannot overshoot home', () => {
  assert.equal(rules.canMove(rules.FINISHED, 1), false);
  assert.equal(rules.canMove(55, 3), false);
  assert.equal(rules.canMove(55, 2), true);
  assert.equal(rules.nextProgress(55, 2), 57);
});

test('global positions wrap around the 52-square board', () => {
  assert.equal(rules.globalIndex(39, 13), 0);
  assert.equal(rules.isSafe(39, 13), true);
  assert.equal(rules.isSafe(39, 14), false);
});

test('captures happen on unsafe shared squares', () => {
  const players = [player('red', 0, [token(10)]), player('green', 13, [token(49)])];
  assert.deepEqual(rules.resolveCaptures(players, 'red', 10), [{ playerId: 'green', tokenIndex: 0 }]);
});

test('safe squares and shielded tokens prevent captures', () => {
  const safe = [player('red', 0, [token(0)]), player('green', 13, [token(39)])];
  assert.deepEqual(rules.resolveCaptures(safe, 'red', 0), []);
  const shielded = [player('red', 0, [token(10)]), player('green', 13, [token(49, true)])];
  assert.deepEqual(rules.resolveCaptures(shielded, 'red', 10), []);
});

test('quick mode wins with one finished token, classic mode needs four', () => {
  const tokens = [token(57), token(0), token(0), token(0)];
  assert.equal(rules.hasWon(tokens, 'quick', false), true);
  assert.equal(rules.hasWon(tokens, 'classic', false), false);
  assert.equal(rules.hasWon([token(57), token(57), token(57), token(57)], 'classic', false), true);
});
