/* Royals-Ludo deterministic rules shared by the web app and automated tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RoyalLudoRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const FINISHED = 57;
  const PATH_LENGTH = 52;
  const SAFE_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

  function canMove(progress, dice) {
    if (!Number.isInteger(progress) || !Number.isInteger(dice) || dice < 1 || dice > 6) return false;
    if (progress === FINISHED) return false;
    if (progress === -1) return dice === 6;
    return progress >= 0 && progress + dice <= FINISHED;
  }

  function nextProgress(progress, dice) {
    if (!canMove(progress, dice)) return null;
    return progress === -1 ? 0 : progress + dice;
  }

  function globalIndex(start, progress) {
    if (!Number.isInteger(start) || !Number.isInteger(progress) || progress < 0 || progress >= PATH_LENGTH) return null;
    return (start + progress) % PATH_LENGTH;
  }

  function isSafe(start, progress) {
    const index = globalIndex(start, progress);
    return index !== null && SAFE_INDICES.has(index);
  }

  function resolveCaptures(players, movingPlayerId, movingProgress) {
    const movingPlayer = players.find((player) => player.id === movingPlayerId);
    if (!movingPlayer || movingProgress < 0 || movingProgress >= PATH_LENGTH || isSafe(movingPlayer.start, movingProgress)) return [];
    const destination = globalIndex(movingPlayer.start, movingProgress);
    const captured = [];
    players.forEach((player) => {
      if (player.id === movingPlayerId) return;
      player.tokens.forEach((token, tokenIndex) => {
        if (token.progress < 0 || token.progress >= PATH_LENGTH || token.shielded) return;
        if (globalIndex(player.start, token.progress) === destination) {
          captured.push({ playerId: player.id, tokenIndex });
        }
      });
    });
    return captured;
  }

  function hasWon(tokens, mode, fastLudo) {
    const target = mode === "quick" || fastLudo ? 1 : 4;
    return Array.isArray(tokens) && tokens.filter((token) => token.progress === FINISHED).length >= target;
  }

  return Object.freeze({ FINISHED, PATH_LENGTH, SAFE_INDICES, canMove, nextProgress, globalIndex, isSafe, resolveCaptures, hasWon });
});
