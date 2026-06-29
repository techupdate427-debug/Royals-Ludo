const PLAYERS = [
  { id: "red", name: "Red", start: 0, lane: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]], homes: [[1, 1], [1, 4], [4, 1], [4, 4]] },
  { id: "green", name: "Green", start: 13, lane: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]], homes: [[1, 10], [1, 13], [4, 10], [4, 13]] },
  { id: "yellow", name: "Yellow", start: 26, lane: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]], homes: [[10, 10], [10, 13], [13, 10], [13, 13]] },
  { id: "blue", name: "Blue", start: 39, lane: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]], homes: [[10, 1], [10, 4], [13, 1], [13, 4]] },
];

const PATH = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0],
];

const SAFE_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
const FINISHED = 57;
const SAVE_KEY = "royal-ludo-advanced-save";
const PROFILE_KEY = "royal-ludo-player-progress";
const RECONNECT_ROOM_KEY = "royal-ludo-reconnect-room";
const RECONNECT_SEAT_KEY = "royal-ludo-reconnect-seat";
const RECONNECT_HOST_KEY = "royal-ludo-reconnect-host";

// Tracks the last-known online status of each friend uid → "online" | "offline"
const friendStatusCache = new Map();

const MODE_LABELS = {
  classic: "Local Multiplayer",
  computer: "Play vs AI",
  friends: "Friends Online",
  random: "Random Match",
  tournament: "Tournament",
  story: "Story Mode",
  quick: "Fast Ludo",
  team: "Team Up",
  snakes: "Snakes",
};

const THEME_LABELS = {
  classic: "Classic",
  night: "Night",
  nature: "Nature",
  candy: "Candy",
};

const GOAL_BLUEPRINTS = [
  { id: "win-3", label: "Win 3 matches", target: 3, reward: 300, bpXp: 150 },
  { id: "capture-5", label: "Capture 5 tokens", target: 5, reward: 250, bpXp: 150 },
  { id: "roll-20", label: "Roll 20 times", target: 20, reward: 150, bpXp: 150 }
];

const FRIENDS = [
  { name: "Aarav", status: "online", rank: "Gold II" },
  { name: "Maya", status: "online", rank: "Silver I" },
  { name: "Dev", status: "away", rank: "Bronze III" },
];

const SHOP_ITEMS = [
  { id: "coin-chest", name: "Coin Chest", detail: "Demo purchase: +1000 coins", cost: 0, currency: "demo", type: "coins", amount: 1000 },
  { id: "reward-ad", name: "Reward Ad", detail: "Watch ad prototype for free powers", cost: 0, currency: "ad", type: "ad" },
  { id: "royal-dice", name: "Royal Dice", detail: "Polished dice skin", cost: 500, currency: "coins" },
  { id: "gold-trail", name: "Gold Trail", detail: "Token glow cosmetic", cost: 8, currency: "gems" },
  { id: "crown-table", name: "Crown Table", detail: "Premium board frame", cost: 1200, currency: "coins" },
  { id: "power-pack", name: "Power Pack", detail: "One of each special power", cost: 650, currency: "coins", type: "power" },
  { id: "blast-bundle", name: "Blast Bundle", detail: "3 Blast Token powers", cost: 5, currency: "gems", type: "power", power: "blast", amount: 3 },
  { id: "dragon-dice", name: "Dragon Dice", detail: "Legendary red dragon dice skin", cost: 15, currency: "gems", exclusive: "pass" },
  { id: "fire-trail", name: "Fire Trail", detail: "Flaming token cosmetic trail", cost: 500, currency: "coins", exclusive: "pass" },
  { id: "galaxy-theme", name: "Galaxy Theme", detail: "Seasonal cosmic background theme", cost: 25, currency: "gems", exclusive: "pass" },
  { id: "neon-board", name: "Neon Board", detail: "Exclusive cyberpunk board frame", cost: 1500, currency: "coins", exclusive: "pass" }
];

const POWER_LABELS = {
  doubleMove: "Double Move",
  blast: "Blast Token",
  shield: "Shield",
  target: "Target Move",
};

const SKILL_BUILDS = {
  aggressive: { label: "Aggressive", powers: { doubleMove: 0, blast: 1, shield: 0, target: 1 } },
  defensive: { label: "Defensive", powers: { doubleMove: 0, blast: 0, shield: 2, target: 0 } },
  speed: { label: "Speed", powers: { doubleMove: 1, blast: 0, shield: 0, target: 1 } },
};

const FLOW_LABELS = {
  lobby: "Waiting for roll",
  rolling: "Dice rolling",
  moving: "Move selection",
  powerSelection: "Power selection",
  victory: "Victory",
};

const LEADERBOARD = [
  { name: "Maya", score: 1840 },
  { name: "Aarav", score: 1710 },
  { name: "Dev", score: 1420 },
];

const ACHIEVEMENTS = [
  { id: "first-roll", name: "First Roll", metric: "rolls", target: 1 },
  { id: "ten-rolls", name: "Dice Regular", metric: "rolls", target: 10 },
  { id: "first-capture", name: "First Capture", metric: "captures", target: 1 },
  { id: "first-win", name: "First Victory", metric: "wins", target: 1 },
  { id: "fifty-moves", name: "Board Runner", metric: "moves", target: 50 },
];

const SNAKE_JUMPS = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

const board = document.querySelector("#board");
const boardStage = document.querySelector(".board-stage");
const homeActions = [...document.querySelectorAll(".home-action")];
const snakeBoard = document.querySelector("#snakeBoard");
const statusText = document.querySelector("#statusText");
const turnName = document.querySelector("#turnName");
const turnMeta = document.querySelector("#turnMeta");
const diceButton = document.querySelector("#diceButton");
const diceFace = document.querySelector("#diceFace");
const diceSubtext = document.querySelector("#diceSubtext");
const moveHint = document.querySelector("#moveHint");
const scoreList = document.querySelector("#scoreList");
const eventFeed = document.querySelector("#eventFeed");
const lastRoll = document.querySelector("#lastRoll");
const matchMode = document.querySelector("#matchMode");
const modeName = document.querySelector("#modeName");
const themeName = document.querySelector("#themeName");
const coinBalance = document.querySelector("#coinBalance");
const diamondBalance = document.querySelector("#diamondBalance");
const roomCode = document.querySelector("#roomCode");
const seasonName = document.querySelector("#seasonName");
const goalList = document.querySelector("#goalList");
const dailyRewardButton = document.querySelector("#dailyRewardButton");
const spinWheelButton = document.querySelector("#spinWheelButton");
const leaderboardList = document.querySelector("#leaderboardList");
const playerRank = document.querySelector("#playerRank");
const playerLevel = document.querySelector("#playerLevel");
const playerNameInput = document.querySelector("#playerNameInput");
const avatarSelect = document.querySelector("#avatarSelect");
const profileAvatar = document.querySelector("#profileAvatar");
const xpFill = document.querySelector("#xpFill");
const statWins = document.querySelector("#statWins");
const statLosses = document.querySelector("#statLosses");
const statRolls = document.querySelector("#statRolls");
const statCaptures = document.querySelector("#statCaptures");
const statMoves = document.querySelector("#statMoves");
const friendList = document.querySelector("#friendList");
const onlineFriends = document.querySelector("#onlineFriends");
const inviteCodeInput = document.querySelector("#inviteCodeInput");
const inviteButton = document.querySelector("#inviteButton");
const shopList = document.querySelector("#shopList");
const shopStatus = document.querySelector("#shopStatus");
const achievementList = document.querySelector("#achievementList");
const achievementScore = document.querySelector("#achievementScore");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const chatInput = document.querySelector("#chatInput");
const chatButton = document.querySelector("#chatButton");
const roomButton = document.querySelector("#roomButton");
const saveGameButton = document.querySelector("#saveGameButton");
const loadGameButton = document.querySelector("#loadGameButton");
const powerDiceButton = document.querySelector("#powerDiceButton");
const replayButton = document.querySelector("#replayButton");
const antiCheatButton = document.querySelector("#antiCheatButton");
const antiCheatStatus = document.querySelector("#antiCheatStatus");
const fastRuleToggle = document.querySelector("#fastRuleToggle");
const board3dToggle = document.querySelector("#board3dToggle");
const soundToggle = document.querySelector("#soundToggle");
const voiceToggle = document.querySelector("#voiceToggle");
const difficultySelect = document.querySelector("#difficultySelect");
const newGameButton = document.querySelector("#newGameButton");
const countButtons = [...document.querySelectorAll(".count-option")];
const modeButtons = [...document.querySelectorAll(".mode-option")];
const themeButtons = [...document.querySelectorAll(".theme-option")];
const emojiButtons = [...document.querySelectorAll(".emoji-option")];
const powerButtons = [...document.querySelectorAll(".power-button")];
const targetStepSelect = document.querySelector("#targetStepSelect");
const activePowerLabel = document.querySelector("#activePowerLabel");
const powerDoubleCount = document.querySelector("#powerDoubleCount");
const powerBlastCount = document.querySelector("#powerBlastCount");
const powerShieldCount = document.querySelector("#powerShieldCount");
const powerTargetCount = document.querySelector("#powerTargetCount");
const skillCardButtons = [...document.querySelectorAll(".skill-card")];
const panelTabs = [...document.querySelectorAll(".panel-tab")];
const tabPanels = [...document.querySelectorAll("[data-tab-panel]")];
const gameOverOverlay = document.querySelector("#gameOverOverlay");
const gameOverTitle = document.querySelector("#gameOverTitle");
const gameOverText = document.querySelector("#gameOverText");
const gameOverReplayButton = document.querySelector("#gameOverReplayButton");
const gameOverNewButton = document.querySelector("#gameOverNewButton");

// Firebase Auth and Online Lobby Selectors
const authOverlay = document.querySelector("#authOverlay");
const emailAuthForm = document.querySelector("#emailAuthForm");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authSubmitButton = document.querySelector("#authSubmitButton");
const toggleAuthModeBtn = document.querySelector("#toggleAuthModeBtn");
const googleLoginBtn = document.querySelector("#googleLoginBtn");
const guestLoginBtn = document.querySelector("#guestLoginBtn");
const authErrorMsg = document.querySelector("#authErrorMsg");
const signOutButton = document.querySelector("#signOutButton");
const firebaseConfigWarning = document.querySelector("#firebaseConfigWarning");
const profileRankBadge = document.querySelector("#profileRankBadge");
const profileEloText = document.querySelector("#profileEloText");
const onlineLobbyOverlay = document.querySelector("#onlineLobbyOverlay");
const lobbyRoomCodeText = document.querySelector("#lobbyRoomCodeText");
const lobbyStartButton = document.querySelector("#lobbyStartButton");
const lobbyLeaveButton = document.querySelector("#lobbyLeaveButton");
const lobbyReadyButton = document.querySelector("#lobbyReadyButton");
const friendEmailInput = document.querySelector("#friendEmailInput");
const addFriendButton = document.querySelector("#addFriendButton");
const friendErrorMsg = document.querySelector("#friendErrorMsg");
const friendRequestsList = document.querySelector("#friendRequestsList");

// Battle Pass Selectors
const bpTierLabel = document.querySelector("#bpTierLabel");
const bpXpText = document.querySelector("#bpXpText");
const buyPremiumPassBtn = document.querySelector("#buyPremiumPassBtn");
const bpXpFill = document.querySelector("#bpXpFill");
const bpRewardsList = document.querySelector("#bpRewardsList");

const state = {
  playerCount: 4,
  players: [],
  current: 0,
  dice: null,
  rolled: false,
  winner: null,
  gameOver: null,
  flow: "lobby",
  legal: [],
  feed: [],
  wallet: { coins: 2500, gems: 24, wins: 0, losses: 0, rolls: 0, moves: 0, captures: 0 },
  powers: { doubleMove: 1, blast: 1, shield: 1, target: 1 },
  matchPowers: { doubleMove: 1, blast: 1, shield: 0, target: 0 },
  activePower: null,
  targetSteps: 3,
  lastMovedKey: null,
  dailyRewardClaimed: false,
  rewards: {
    dailyStreak: 0,
    lastDailyDate: "",
    spinCount: 0,
  },
  profile: {
    name: "Royal Player",
    avatar: "RL",
    xp: 0,
    elo: 1200, // Starting ELO is 1200 (Silver I)
    owned: ["starter-frame"],
    equipped: "starter-frame",
    history: [],
  },
  battlePass: {
    xp: 0,
    tier: 1,
    premiumUnlocked: false,
    claimedFree: {},
    claimedPremium: {}
  },
  goals: freshGoals(),
  settings: {
    mode: "classic",
    difficulty: "medium",
    theme: "classic",
    sound: true,
    voice: false,
    roomCode: "ROOM-0000",
    uiTab: "play",
    fastLudo: false,
    board3d: false,
    powerDiceReady: false,
    storyLevel: 1,
    skillBuild: "aggressive",
    cloudSaveReady: false,
  },
  replaySetup: null,
  snakes: {
    players: [],
    current: 0,
  },
  // Firebase specific status tracking
  firebase: {
    onlineActive: false,
    isHost: false,
    seatIndex: -1,
    matchEndProcessed: false,
  }
};

const cellMap = new Map();
let botTimer = null;
let autoSaveTimer = null;
let audioContext = null;

// Online / Reconnect tracking
let heartbeatTimer = null;       // pings presence every 15s
let reconnectTimer = null;       // exponential backoff reconnect
let reconnectAttempts = 0;       // backoff counter
let isOnlineConnected = true;    // Firebase .info/connected state
let cloudSaveTimer = null;       // debounced Firestore auto-save


function freshGoals() {
  return GOAL_BLUEPRINTS.map((goal) => ({ ...goal, value: 0, complete: false }));
}

// ─── Toast Notification System ────────────────────────────────────────────────
const toastContainer = document.getElementById("toast-container");

/**
 * Show a stackable animated toast card.
 * @param {string} message  - Text to display.
 * @param {string} [type]   - "success" | "error" | "info" | "warning" (default: "info")
 * @param {number} [duration] - Auto-dismiss delay in ms (default: 4000).
 */
function showToastNotification(message, type = "info", duration = 4000) {
  if (!toastContainer) return;

  const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `<span style="font-size:1.1rem;">${icons[type] || icons.info}</span><span style="flex:1;">${message}</span><button type="button" aria-label="Dismiss" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1rem;line-height:1;padding:0 0 0 6px;">✕</button>`;

  toastContainer.append(toast);

  const dismiss = () => {
    toast.classList.add("slide-out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };

  toast.querySelector("button").addEventListener("click", dismiss);
  const timer = window.setTimeout(dismiss, duration);
  toast.addEventListener("mouseenter", () => window.clearTimeout(timer));
  toast.addEventListener("mouseleave", () => window.setTimeout(dismiss, 1500));
}
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════
// CLOUD SAVE — Auto-save profile to Firestore after any stat change
// ═══════════════════════════════════════════════════════════════════════════
function triggerCloudSave() {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(() => {
    const userDocRef = window.firebaseFirestore.collection("users").doc(currentUser.uid);
    const profileData = {
      name: state.profile.name,
      avatar: state.profile.avatar,
      elo: state.profile.elo || 1200,
      xp: state.profile.xp || 0,
      coins: state.wallet.coins,
      gems: state.wallet.gems,
      wins: state.wallet.wins,
      losses: state.wallet.losses || 0,
      captures: state.wallet.captures,
      moves: state.wallet.moves,
      rolls: state.wallet.rolls,
      inventory: state.profile.owned,
      equipped: state.profile.equipped,
      email: currentUser.email || `${currentUser.uid.slice(0, 8)}@guest.com`,
      lastSaved: Date.now(),
      battlePass: state.battlePass
    };
    userDocRef.set({ ...profileData, profile: profileData }, { merge: true })
      .catch((err) => console.warn("[CloudSave] Failed:", err));
  }, 3000); // Debounce — wait 3s after last change before writing
}

// ═══════════════════════════════════════════════════════════════════════════
// RECONNECT OVERLAY
// ═══════════════════════════════════════════════════════════════════════════
function showReconnectOverlay(message = "Connection lost. Reconnecting…") {
  let overlay = document.getElementById("reconnect-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "reconnect-overlay";
    overlay.innerHTML = `
      <div class="reconnect-spinner"></div>
      <p id="reconnect-msg" class="reconnect-msg"></p>
      <button type="button" id="reconnectLeaveBtn" class="mini-button" style="background:#e03345; margin-top:10px;">Leave Match</button>
    `;
    document.body.appendChild(overlay);
    document.getElementById("reconnectLeaveBtn").addEventListener("click", () => {
      hideReconnectOverlay();
      leaveOnlineRoom();
    });
  }
  document.getElementById("reconnect-msg").textContent = message;
  overlay.hidden = false;
}

function hideReconnectOverlay() {
  const overlay = document.getElementById("reconnect-overlay");
  if (overlay) overlay.hidden = true;
  reconnectAttempts = 0;
  window.clearTimeout(reconnectTimer);
}

// ═══════════════════════════════════════════════════════════════════════════
// NETWORK MONITOR — Listen to Firebase .info/connected
// ═══════════════════════════════════════════════════════════════════════════
function startNetworkMonitor() {
  if (!window.isFirebaseConfigured || !window.firebaseDb) return;
  window.firebaseDb.ref(".info/connected").on("value", (snap) => {
    const connected = snap.val() === true;
    if (connected === isOnlineConnected) return; // No change
    isOnlineConnected = connected;

    if (!connected && state.firebase.onlineActive) {
      // Lost connection mid-match
      reconnectAttempts = 0;
      tryReconnectWithBackoff();
    } else if (connected) {
      // Restored
      hideReconnectOverlay();
      if (state.firebase.onlineActive) {
        showToastNotification("Connection restored! ✅", "success");
        // Re-sync by re-attaching the room listener
        listenToRoom(state.settings.roomCode);
      }
    }
  });
}

function tryReconnectWithBackoff() {
  if (!state.firebase.onlineActive) return;
  const delayMs = Math.min(2000 * Math.pow(2, reconnectAttempts), 30000);
  const seconds = Math.round(delayMs / 1000);

  if (reconnectAttempts === 0) {
    showReconnectOverlay("Connection lost. Reconnecting…");
  } else {
    showReconnectOverlay(`Reconnecting in ${seconds}s… (attempt ${reconnectAttempts + 1})`);
  }

  reconnectTimer = window.setTimeout(() => {
    reconnectAttempts += 1;
    if (reconnectAttempts > 6) {
      showReconnectOverlay("Could not reconnect. You may leave the match.");
      return;
    }
    if (isOnlineConnected) {
      // Managed to reconnect while timer was running
      hideReconnectOverlay();
      return;
    }
    tryReconnectWithBackoff();
  }, delayMs);
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESENCE HEARTBEAT — Write lastSeen every 15s to seat node
// ═══════════════════════════════════════════════════════════════════════════
function startPresenceHeartbeat(roomName, seatIndex) {
  stopPresenceHeartbeat();
  const seatRef = window.firebaseDb.ref(`rooms/${roomName}/seats/${seatIndex}/lastSeen`);

  // Register onDisconnect — Firebase auto-writes this when connection drops
  seatRef.onDisconnect().set(0);

  const ping = () => {
    seatRef.set(Date.now()).catch(() => {});
  };
  ping();
  heartbeatTimer = window.setInterval(ping, 15000);
}

function stopPresenceHeartbeat() {
  window.clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

function key(row, col) {
  return `${row}-${col}`;
}


function buildBoard() {
  board.innerHTML = "";
  cellMap.clear();

  for (let row = 0; row < 15; row += 1) {
    for (let col = 0; col < 15; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.append(cell);
      cellMap.set(key(row, col), cell);
    }
  }

  paintHomeZone("red", 0, 0);
  paintHomeZone("green", 0, 9);
  paintHomeZone("blue", 9, 0);
  paintHomeZone("yellow", 9, 9);

  PATH.forEach(([row, col], index) => {
    const cell = getCell(row, col);
    cell.classList.add("track");
    if (SAFE_INDICES.has(index)) cell.classList.add("safe");
  });

  PLAYERS.forEach((player) => {
    getCell(...PATH[player.start]).classList.add("start", player.id);
    player.lane.forEach(([row, col]) => getCell(row, col).classList.add("home-lane", player.id));
    player.homes.forEach(([row, col]) => getCell(row, col).append(createPocket()));
  });

  [[6, 6], [6, 7], [6, 8], [7, 6], [7, 7], [7, 8], [8, 6], [8, 7], [8, 8]].forEach(([row, col]) => {
    const cell = getCell(row, col);
    cell.classList.add("finish");
    if (row === 7 && col === 7) cell.classList.add("finish-center");
  });
}

function paintHomeZone(color, startRow, startCol) {
  for (let row = startRow; row < startRow + 6; row += 1) {
    for (let col = startCol; col < startCol + 6; col += 1) {
      getCell(row, col).classList.add("home-zone", color);
    }
  }
}

function createPocket() {
  const pocket = document.createElement("span");
  pocket.className = "home-pocket";
  return pocket;
}

function getCell(row, col) {
  return cellMap.get(key(row, col));
}

function newGame(playerCount = state.playerCount) {
  clearBotTimer();
  state.replaySetup = {
    mode: state.settings.mode,
    playerCount,
    difficulty: state.settings.difficulty,
    fastLudo: state.settings.fastLudo,
    board3d: state.settings.board3d,
    storyLevel: state.settings.storyLevel,
  };
  state.playerCount = Math.min(Math.max(playerCount, 2), 4);
  state.dice = null;
  state.rolled = false;
  state.winner = null;
  state.gameOver = null;
  state.flow = "lobby";
  state.legal = [];
  state.feed = [];
  state.activePower = null;
  state.matchPowers = skillBuildPowers(state.settings.skillBuild);
  state.lastMovedKey = null;
  lastRoll.textContent = "No roll";
  diceFace.dataset.value = "1";
  diceButton.classList.remove("rolling");
  diceButton.disabled = false;

  if (state.settings.mode === "snakes") {
    setupSnakesMatch();
  } else {
    setupLudoMatch();
  }

  render();
  addFeed(`${MODE_LABELS[state.settings.mode]} match started.`);
  setStatus(startStatus());
  scheduleBotTurn();
}

function setupLudoMatch() {
  const mode = state.settings.mode;
  const forcedCount = mode === "team" || mode === "tournament" || mode === "random" || mode === "story" ? 4 : state.playerCount;
  state.playerCount = forcedCount;
  state.players = PLAYERS.slice(0, forcedCount).map((player) => ({
    ...player,
    tokens: Array.from({ length: 4 }, (_, index) => ({ id: `${player.id}-${index}`, progress: -1, shielded: false })),
  }));
  state.current = 0;
}

function setupSnakesMatch() {
  state.snakes.players = PLAYERS.slice(0, state.playerCount).map((player) => ({
    id: player.id,
    name: player.name,
    position: 1,
  }));
  state.snakes.current = 0;
}

function startStatus() {
  if (state.settings.mode === "computer") return "Play vs AI offline. You are Red; AI controls the other seats.";
  if (state.settings.mode === "friends") return `Friends online prototype. Share ${state.settings.roomCode} to invite players.`;
  if (state.settings.mode === "random") return "Random matchmaking prototype. AI fills the table while backend matchmaking is offline.";
  if (state.settings.mode === "story") return `Story mode level ${state.settings.storyLevel}. Beat the AI table to advance.`;
  if (state.settings.mode === "quick") return "Fast Ludo: one token home wins.";
  if (state.settings.mode === "team") return "Team Up: Red and Yellow versus Green and Blue.";
  if (state.settings.mode === "tournament") return "Tournament table ready. Win the board to claim the round.";
  if (state.settings.mode === "snakes") return "Snakes & Ladders mode. Roll to climb to 100.";
  return "Local multiplayer on the same device. Roll to begin.";
}

function render() {
  const snakeMode = state.settings.mode === "snakes";
  board.hidden = snakeMode;
  snakeBoard.hidden = !snakeMode;
  boardStage.classList.toggle("snakes", snakeMode);

  if (snakeMode) {
    renderSnakeBoard();
  } else {
    renderLudoTokens();
  }

  const currentPlayer = getCurrentPlayer();
  turnName.textContent = currentPlayer.name;
  turnName.style.color = `var(--${currentPlayer.id})`;
  document.documentElement.style.setProperty("--current", `var(--${currentPlayer.id})`);
  modeName.textContent = MODE_LABELS[state.settings.mode];
  matchMode.textContent = snakeMode ? `${state.playerCount} racer` : `${state.playerCount} player`;
  diceSubtext.textContent = state.rolled ? "Choose token" : "Tap to throw";
  turnMeta.textContent = state.winner ? FLOW_LABELS.victory : state.flow === "rolling" ? FLOW_LABELS.rolling : state.rolled ? `Rolled ${state.dice}` : botLabel();
  roomCode.textContent = state.settings.roomCode;
  seasonName.textContent = state.settings.mode === "story" ? `Level ${state.settings.storyLevel}` : state.settings.mode === "tournament" ? "Cup Run" : "Season 1";
  antiCheatStatus.textContent = state.settings.powerDiceReady ? "Power ready" : "Protected";
  powerDiceButton.textContent = state.settings.powerDiceReady ? "Power ready" : "Power dice";
  replayButton.disabled = !state.replaySetup;
  diceButton.classList.toggle("power-ready", state.settings.powerDiceReady);
  document.body.dataset.flow = state.flow;
  document.body.dataset.board = state.settings.board3d ? "3d" : "flat";

  renderScores();
  renderWallet();
  renderProfile();
  renderFriends();
  renderShop();
  renderGoals();
  renderPowers();
  renderSkillBuild();
  renderLeaderboard();
  renderAchievements();
  renderHistory();
  renderBattlePass();
  renderFeed();
  renderGameOver();
  syncControls();
  scheduleAutoSave();
}

function renderLudoTokens() {
  const previousPositions = new Map(
    [...board.querySelectorAll(".token")].map((token) => [token.dataset.key, token.getBoundingClientRect()])
  );
  [...board.querySelectorAll(".token")].forEach((token) => token.remove());
  const stacks = buildStacks();

  state.players.forEach((player) => {
    player.tokens.forEach((token, tokenIndex) => {
      const [row, col] = tokenPosition(player, token, tokenIndex);
      const stack = stacks.get(key(row, col));
      const stackIndex = stack.findIndex((entry) => entry.player === player.id && entry.token === tokenIndex);
      const offset = tokenOffset(stack.length, stackIndex);
      const tokenEl = document.createElement("button");
      tokenEl.className = `token ${player.id}`;
      tokenEl.type = "button";
      tokenEl.ariaLabel = `${player.name} token ${tokenIndex + 1}`;
      tokenEl.dataset.key = `${player.id}-${tokenIndex}`;
      tokenEl.dataset.player = player.id;
      tokenEl.dataset.token = String(tokenIndex);
      tokenEl.style.setProperty("--dx", offset.x);
      tokenEl.style.setProperty("--dy", offset.y);
      if (token.shielded) tokenEl.classList.add("shielded");
      if (isLegal(player.id, tokenIndex)) tokenEl.classList.add("legal");
      if (isPowerTarget(player.id, tokenIndex)) tokenEl.classList.add("legal", "power-target");
      if (tokenEl.dataset.key === state.lastMovedKey) {
        tokenEl.classList.add("token-landing");
        tokenEl.addEventListener("animationend", () => tokenEl.classList.remove("token-landing"), { once: true });
      }
      tokenEl.addEventListener("click", () => handleTokenClick(player.id, tokenIndex));
      getCell(row, col).append(tokenEl);
      animateTokenFromPreviousPosition(tokenEl, previousPositions.get(tokenEl.dataset.key));
    });
  });
}

function animateTokenFromPreviousPosition(tokenEl, previousRect) {
  if (!previousRect) return;
  const nextRect = tokenEl.getBoundingClientRect();
  const deltaX = previousRect.left - nextRect.left;
  const deltaY = previousRect.top - nextRect.top;
  if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) return;

  tokenEl.classList.add("token-moving");
  tokenEl.style.setProperty("--move-x", `${deltaX}px`);
  tokenEl.style.setProperty("--move-y", `${deltaY}px`);
  tokenEl.getBoundingClientRect();
  window.requestAnimationFrame(() => {
    tokenEl.style.setProperty("--move-x", "0px");
    tokenEl.style.setProperty("--move-y", "0px");
  });
  tokenEl.addEventListener("transitionend", () => tokenEl.classList.remove("token-moving"), { once: true });
}

function buildStacks() {
  const stacks = new Map();
  state.players.forEach((player) => {
    player.tokens.forEach((token, tokenIndex) => {
      const [row, col] = tokenPosition(player, token, tokenIndex);
      const stackKey = key(row, col);
      const stack = stacks.get(stackKey) || [];
      stack.push({ player: player.id, token: tokenIndex });
      stacks.set(stackKey, stack);
    });
  });
  return stacks;
}

function tokenOffset(count, index) {
  if (count <= 1) return { x: "0%", y: "0%" };
  const offsets = [
    { x: "-18%", y: "-18%" },
    { x: "18%", y: "-18%" },
    { x: "-18%", y: "18%" },
    { x: "18%", y: "18%" },
    { x: "0%", y: "0%" },
  ];
  return offsets[index % offsets.length];
}

function tokenPosition(player, token, tokenIndex) {
  if (token.progress === -1) return player.homes[tokenIndex];
  if (token.progress >= 52 && token.progress < FINISHED) return player.lane[token.progress - 52];
  if (token.progress >= FINISHED) return [7, 7];
  return PATH[(player.start + token.progress) % PATH.length];
}

function renderSnakeBoard() {
  snakeBoard.innerHTML = "";

  for (let number = 1; number <= 100; number += 1) {
    const { row, col } = snakeGridPosition(number);
    const cell = document.createElement("div");
    cell.className = "snake-cell";
    cell.style.gridRow = String(row + 1);
    cell.style.gridColumn = String(col + 1);
    cell.style.setProperty("--cell-tint", number % 2 ? "#e9f6ff" : "#fff5dc");
    cell.textContent = number;

    if (SNAKE_JUMPS[number]) {
      const jump = document.createElement("span");
      const target = SNAKE_JUMPS[number];
      cell.classList.add("special");
      jump.className = "snake-jump";
      jump.textContent = target > number ? `L ${target}` : `S ${target}`;
      cell.append(jump);
    }

    state.snakes.players.forEach((player, index) => {
      if (player.position !== number) return;
      const token = document.createElement("span");
      token.className = "snake-token";
      token.style.setProperty("--player-color", `var(--${player.id})`);
      token.style.setProperty("--stack", String(index));
      cell.append(token);
    });

    snakeBoard.append(cell);
  }
}

function snakeGridPosition(number) {
  const zero = number - 1;
  const logicalRow = Math.floor(zero / 10);
  const row = 9 - logicalRow;
  const col = logicalRow % 2 === 0 ? zero % 10 : 9 - (zero % 10);
  return { row, col };
}

function renderScores() {
  scoreList.innerHTML = "";

  if (state.settings.mode === "snakes") {
    state.snakes.players.forEach((player, playerIndex) => {
      const item = document.createElement("li");
      const progress = Math.min(player.position, 100);
      item.style.setProperty("--player-color", `var(--${player.id})`);
      if (playerIndex === state.snakes.current) item.classList.add("current");
      item.innerHTML = `
        <div class="score-row">
          <span class="player-chip"><span class="player-dot"></span>${player.name}</span>
          <span>${player.position}/100</span>
        </div>
        <div class="progress-track"><span class="progress-fill" style="--progress: ${progress}%"></span></div>
        <span class="score-meta">${100 - player.position} squares to finish</span>
      `;
      scoreList.append(item);
    });
    return;
  }

  state.players.forEach((player, playerIndex) => {
    const done = player.tokens.filter((token) => token.progress === FINISHED).length;
    const active = player.tokens.filter((token) => token.progress >= 0 && token.progress < FINISHED).length;
    const progress = Math.round((player.tokens.reduce((sum, token) => sum + Math.max(token.progress, 0), 0) / (FINISHED * 4)) * 100);
    const item = document.createElement("li");
    item.style.setProperty("--player-color", `var(--${player.id})`);
    if (playerIndex === state.current) item.classList.add("current");
    item.innerHTML = `
      <div class="score-row">
        <span class="player-chip"><span class="player-dot"></span>${player.name}</span>
        <span>${done}/4</span>
      </div>
      <div class="progress-track"><span class="progress-fill" style="--progress: ${progress}%"></span></div>
      <span class="score-meta">${active} active tokens, ${progress}% route progress</span>
    `;
    scoreList.append(item);
  });
}

function renderWallet() {
  setBalanceText(coinBalance, state.wallet.coins);
  setBalanceText(diamondBalance, state.wallet.gems);
}

function setBalanceText(element, value) {
  const next = value.toLocaleString();
  if (element.textContent && element.textContent !== next) {
    const card = element.closest(".wallet-card");
    if (card) {
      card.classList.remove("wallet-bump");
      card.offsetWidth;
      card.classList.add("wallet-bump");
    }
  }
  element.textContent = next;
}

const ELOTIERS = [
  { name: "Bronze", elo: 0, badge: "🥉", class: "rank-bronze" },
  { name: "Silver", elo: 1000, badge: "🥈", class: "rank-silver" },
  { name: "Gold", elo: 1500, badge: "🥇", class: "rank-gold" },
  { name: "Platinum", elo: 2000, badge: "💎", class: "rank-platinum" },
  { name: "Diamond", elo: 2500, badge: "🔮", class: "rank-diamond" },
  { name: "Master", elo: 3000, badge: "👑", class: "rank-master" },
  { name: "Royal King", elo: 3500, badge: "👑🤴", class: "rank-royal-king" }
];

function getEloTier(elo) {
  let matched = ELOTIERS[0];
  for (const tier of ELOTIERS) {
    if (elo >= tier.elo) {
      matched = tier;
    } else {
      break;
    }
  }
  return matched;
}

function renderProfile() {
  const level = currentLevel();
  const xpInLevel = state.profile.xp % 250;
  document.body.dataset.cosmetic = state.profile.equipped;
  playerLevel.textContent = `Level ${level}`;
  playerNameInput.value = state.profile.name;
  
  // Crown Effect visual badge decoration
  profileAvatar.classList.toggle("has-crown", state.profile.owned.includes("crown-effect"));
  
  // Unlocked Avatar selector options
  let ninjaOption = avatarSelect.querySelector('option[value="NJ"]');
  if (state.profile.owned.includes("ninja-avatar")) {
    if (!ninjaOption) {
      ninjaOption = document.createElement("option");
      ninjaOption.value = "NJ";
      ninjaOption.textContent = "Ninja";
      avatarSelect.append(ninjaOption);
    }
  } else {
    if (ninjaOption) {
      ninjaOption.remove();
    }
  }
  
  avatarSelect.value = state.profile.avatar || "RL";
  profileAvatar.textContent = state.profile.avatar || initialsFor(state.profile.name);
  xpFill.style.setProperty("--xp", `${Math.round((xpInLevel / 250) * 100)}%`);
  statWins.textContent = state.wallet.wins;
  statLosses.textContent = state.wallet.losses || 0;
  statRolls.textContent = state.wallet.rolls;
  statCaptures.textContent = state.wallet.captures;
  statMoves.textContent = state.wallet.moves;

  // Render ELO Badge and Text
  const elo = state.profile.elo || 1200;
  const tier = getEloTier(elo);
  profileRankBadge.textContent = tier.badge;
  profileRankBadge.className = `rank-badge ${tier.class}`;
  profileEloText.textContent = `${elo} ELO (${tier.name})`;
  playerRank.textContent = tier.name;
}

function currentLevel() {
  return Math.floor(state.profile.xp / 250) + 1;
}

function initialsFor(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "RL";
}

function renderFriends() {
  const online = FRIENDS.filter((friend) => friend.status === "online").length;
  onlineFriends.textContent = `${online} online`;
  friendList.innerHTML = "";

  FRIENDS.forEach((friend) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span><strong>${friend.name}</strong><small>${friend.rank}</small></span>
      <button class="mini-button friend-invite" data-friend="${friend.name}" type="button">${friend.status === "online" ? "Invite" : "Ping"}</button>
    `;
    friendList.append(item);
  });
}

function renderShop() {
  shopStatus.textContent = `${SHOP_ITEMS.length} items`;
  shopList.innerHTML = "";

  SHOP_ITEMS.forEach((item) => {
    const owned = state.profile.owned.includes(item.id);
    const equipped = state.profile.equipped === item.id;
    const row = document.createElement("div");
    row.className = `shop-item${owned ? " owned" : ""}`;
    
    let buttonHtml = "";
    if (equipped) {
      buttonHtml = `<button class="mini-button shop-action" data-shop="${item.id}" type="button">Equipped</button>`;
    } else if (owned) {
      buttonHtml = `<button class="mini-button shop-action" data-shop="${item.id}" type="button">Equip</button>`;
    } else if (item.exclusive === "pass") {
      buttonHtml = `<span style="font-size:0.75rem; color:#ffc837; font-weight:bold;">Pass Reward</span>`;
    } else {
      buttonHtml = `<button class="mini-button shop-action" data-shop="${item.id}" type="button">Buy</button>`;
    }
    
    row.innerHTML = `
      <span class="shop-meta"><strong>${item.name}</strong><small>${item.detail} ${item.cost > 0 ? `- ${item.cost} ${item.currency}` : ''}</small></span>
      ${buttonHtml}
    `;
    shopList.append(row);
  });
}

function renderPowers() {
  refreshDailyRewardState();
  powerDoubleCount.textContent = powerCount("doubleMove");
  powerBlastCount.textContent = powerCount("blast");
  powerShieldCount.textContent = powerCount("shield");
  powerTargetCount.textContent = powerCount("target");
  dailyRewardButton.textContent = canClaimDailyReward() ? `Daily reward x${Math.max(1, state.rewards.dailyStreak + 1)}` : `Streak ${state.rewards.dailyStreak}`;
  dailyRewardButton.disabled = !canClaimDailyReward();
  targetStepSelect.value = String(state.targetSteps || 3);
  activePowerLabel.textContent = state.activePower ? POWER_LABELS[state.activePower] : "Ready";
  powerButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.power === state.activePower);
    button.classList.toggle("empty", powerCount(button.dataset.power) <= 0);
  });
}

function renderSkillBuild() {
  skillCardButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.skillBuild === state.settings.skillBuild);
  });
}

function skillBuildPowers(build) {
  const blueprint = SKILL_BUILDS[build] || SKILL_BUILDS.aggressive;
  return { doubleMove: 0, blast: 0, shield: 0, target: 0, ...blueprint.powers };
}

function powerCount(power) {
  return (state.powers[power] || 0) + (state.matchPowers?.[power] || 0);
}

function consumePower(power) {
  if ((state.matchPowers?.[power] || 0) > 0) {
    state.matchPowers[power] -= 1;
    return true;
  }

  if ((state.powers[power] || 0) <= 0) return false;
  state.powers[power] -= 1;
  persistProgress();
  return true;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function refreshDailyRewardState() {
  state.dailyRewardClaimed = state.rewards.lastDailyDate === todayKey();
}

function canClaimDailyReward() {
  return state.rewards.lastDailyDate !== todayKey();
}

function renderLeaderboard() {
  if (window.isFirebaseConfigured && window.firebaseFirestore) {
    window.firebaseFirestore.collection("users")
      .orderBy("elo", "desc")
      .limit(10)
      .get()
      .then((querySnapshot) => {
        leaderboardList.innerHTML = "";
        let rank = 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const elo = data.elo || 1200;
          const tier = getEloTier(elo);
          const item = document.createElement("li");
          item.innerHTML = `
            <strong>${rank}. <span class="${tier.class}">${tier.badge}</span> ${data.name || "Royal Player"}</strong>
            <span>${elo} ELO</span>
          `;
          leaderboardList.append(item);
          rank++;
        });
      })
      .catch((error) => {
        console.error("Error loading Firestore leaderboard:", error);
      });
  } else {
    // Offline local simulation leaderboard
    const playerScore = state.wallet.wins * 500 + state.wallet.captures * 50 + state.wallet.moves * 5;
    const rows = [...LEADERBOARD, { name: state.profile.name, score: playerScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    const playerIndex = rows.findIndex((row) => row.name === state.profile.name);
    playerRank.textContent = playerIndex === -1 ? "Rising" : `#${playerIndex + 1}`;
    leaderboardList.innerHTML = "";
    rows.forEach((row, index) => {
      const item = document.createElement("li");
      item.innerHTML = `<strong>${index + 1}. ${row.name}</strong><span>${row.score}</span>`;
      leaderboardList.append(item);
    });
  }
}

function renderAchievements() {
  const completeCount = ACHIEVEMENTS.filter((achievement) => achievementProgress(achievement) >= achievement.target).length;
  achievementScore.textContent = `${completeCount}/${ACHIEVEMENTS.length}`;
  achievementList.innerHTML = "";

  ACHIEVEMENTS.forEach((achievement) => {
    const value = achievementProgress(achievement);
    const complete = value >= achievement.target;
    const item = document.createElement("li");
    if (complete) item.classList.add("complete");
    item.innerHTML = `<strong>${achievement.name}</strong><small>${Math.min(value, achievement.target)}/${achievement.target}</small>`;
    achievementList.append(item);
  });
}

function achievementProgress(achievement) {
  return state.wallet[achievement.metric] || 0;
}

function renderHistory() {
  historyCount.textContent = `${state.profile.history.length} games`;
  historyList.innerHTML = "";

  if (state.profile.history.length === 0) {
    const empty = document.createElement("li");
    empty.innerHTML = "<strong>No games yet</strong><small>Finished matches will appear here.</small>";
    historyList.append(empty);
    return;
  }

  state.profile.history.slice(0, 8).forEach((match) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${match.winner}</strong><small>${match.mode} - ${match.reward}</small>`;
    historyList.append(item);
  });
}

function renderGoals() {
  goalList.innerHTML = "";
  state.goals.forEach((goal) => {
    const item = document.createElement("li");
    const progress = Math.min(100, Math.round((goal.value / goal.target) * 100));
    if (goal.complete) item.classList.add("complete");
    item.innerHTML = `
      <span>${goal.label}: ${Math.min(goal.value, goal.target)}/${goal.target}</span>
      <div class="goal-bar"><span style="--goal-progress: ${progress}%"></span></div>
    `;
    goalList.append(item);
  });
}

function setStatus(text) {
  statusText.textContent = text;
  moveHint.textContent = text;
}

function setFlow(flow) {
  state.flow = FLOW_LABELS[flow] ? flow : "lobby";
  document.body.dataset.flow = state.flow;
}

function setGameOver(title, text) {
  state.gameOver = { title, text };
}

function renderGameOver() {
  if (!gameOverOverlay) return;

  if (!state.gameOver) {
    gameOverOverlay.hidden = true;
    delete gameOverOverlay.dataset.winner;
    return;
  }

  gameOverTitle.textContent = state.gameOver.title;
  gameOverText.textContent = state.gameOver.text;
  gameOverOverlay.dataset.winner = state.winner || "";
  gameOverOverlay.hidden = false;
}

function addFeed(text) {
  state.feed.unshift(text);
  state.feed = state.feed.slice(0, 8);
  renderFeed();
}

function renderFeed() {
  eventFeed.innerHTML = "";
  state.feed.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    eventFeed.append(item);
  });
}

function handleDice() {
  if (state.settings.mode === "snakes") {
    rollSnakeDice();
    return;
  }
  rollDice();
}

function isMyTurn() {
  if (!state.firebase.onlineActive) return true;
  const currentPlayer = state.players[state.current];
  if (currentPlayer && currentPlayer.isBot && state.firebase.isHost) {
    return true;
  }
  return state.firebase.seatIndex === state.current;
}

function requestDiceRoll() {
  if (!state.firebase.onlineActive) return;
  const roomName = state.settings.roomCode;
  
  if (state.firebase.isHost) {
    const rolledValue = 1 + Math.floor(Math.random() * 6);
    const gameStateRef = window.firebaseDb.ref(`rooms/${roomName}/gameState`);
    gameStateRef.update({
      dice: rolledValue,
      rolled: true,
      flow: "moving"
    });
  } else {
    const rollReqRef = window.firebaseDb.ref(`rooms/${roomName}/rollRequest`);
    rollReqRef.set({
      uid: currentUser.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }
}

function rollDice() {
  if (state.rolled || state.winner) return;
  if (!isMyTurn()) return;

  if (state.firebase.onlineActive) {
    requestDiceRoll();
  } else {
    animateDice((dice) => {
      const player = state.players[state.current];
      state.dice = dice;
      state.rolled = true;
      lastRoll.textContent = `${player.name}: ${state.dice}`;
      trackRoll(dice);
      state.legal = legalMovesForCurrent();
      afterRoll();
    });
  }
}

function animateDiceWithValue(value, onComplete) {
  let ticks = 0;
  diceButton.disabled = true;
  diceButton.classList.add("rolling");
  setFlow("rolling");
  playSfx("dice");

  const roller = window.setInterval(() => {
    diceFace.dataset.value = String(1 + Math.floor(Math.random() * 6));
    ticks += 1;
    if (ticks >= 8) {
      window.clearInterval(roller);
      diceButton.classList.remove("rolling");
      diceFace.dataset.value = String(value);
      if (value === 6) {
        diceButton.classList.add("lucky-roll");
        triggerMoment("six");
        playSfx("six");
        window.setTimeout(() => diceButton.classList.remove("lucky-roll"), 700);
      }
      if (onComplete) onComplete(value);
    }
  }, 55);
}

function rollSnakeDice() {
  if (state.winner) return;

  animateDice((dice) => {
    const player = state.snakes.players[state.snakes.current];
    state.dice = dice;
    lastRoll.textContent = `${player.name}: ${dice}`;
    trackRoll(dice);

    const rawTarget = player.position + dice;
    if (rawTarget <= 100) {
      player.position = rawTarget;
      state.wallet.moves += 1;
      addXp(5);
      if (SNAKE_JUMPS[player.position]) {
        const jumpTarget = SNAKE_JUMPS[player.position];
        addFeed(`${player.name} ${jumpTarget > player.position ? "climbed" : "slid"} to ${jumpTarget}.`);
        player.position = jumpTarget;
      } else {
        addFeed(`${player.name} moved to ${player.position}.`);
      }
    } else {
      addFeed(`${player.name} needs exact count for 100.`);
    }

    if (player.position === 100) {
      state.winner = player.id;
      setFlow("victory");
      setGameOver(`${player.name} wins`, "Snakes & Ladders complete. Reward: +300 coins.");
      addMatchResult(player.name);
      state.wallet.coins += 300;
      addXp(80);
      trackGoal("win-3", 1);
      if (player.id === "red") {
        addBattlePassXp(150);
      } else {
        addBattlePassXp(50);
      }
      recordHistory(player.name, "+300 coins");
      diceButton.disabled = true;
      playSfx("win");
      spawnConfetti();
      setStatus(`${player.name} wins Snakes & Ladders.`);
      addFeed(`${player.name} wins +300 coins.`);
      render();
      return;
    }

    state.snakes.current = (state.snakes.current + 1) % state.snakes.players.length;
    diceButton.disabled = false;
    setFlow("lobby");
    setStatus(`${state.snakes.players[state.snakes.current].name}'s turn. Roll the dice.`);
    render();
  });
}

function animateDice(onComplete) {
  let ticks = 0;
  diceButton.disabled = true;
  diceButton.classList.add("rolling");
  setFlow("rolling");
  playSfx("dice");

  const roller = window.setInterval(() => {
    diceFace.dataset.value = String(1 + Math.floor(Math.random() * 6));
    ticks += 1;
    if (ticks >= 8) {
      window.clearInterval(roller);
      diceButton.classList.remove("rolling");
      const dice = state.settings.powerDiceReady ? 6 : 1 + Math.floor(Math.random() * 6);
      state.settings.powerDiceReady = false;
      antiCheatCheck(dice);
      diceFace.dataset.value = String(dice);
      if (dice === 6) {
        diceButton.classList.add("lucky-roll");
        triggerMoment("six");
        playSfx("six");
        window.setTimeout(() => diceButton.classList.remove("lucky-roll"), 700);
      }
      onComplete(dice);
    }
  }, 55);
}

function afterRoll() {
  const player = state.players[state.current];
  if (state.legal.length === 0) {
    setFlow("lobby");
    setStatus(`${player.name} rolled ${state.dice}. No legal move.`);
    addFeed(`${player.name} rolled ${state.dice} and passed.`);
    render();
    window.setTimeout(nextTurn, 900);
    return;
  }

  setFlow("moving");
  setStatus(`${player.name} rolled ${state.dice}. Choose a highlighted token.`);
  addFeed(`${player.name} rolled ${state.dice}. ${state.legal.length} move${state.legal.length === 1 ? "" : "s"} available.`);
  render();

  if (isBotTurn()) {
    botTimer = window.setTimeout(() => {
      const bot = state.players[state.current];
      if (tryBotPower(bot)) return;
      moveToken(bot.id, chooseBotMove());
    }, 780);
  }
}

function legalMovesForCurrent() {
  const player = state.players[state.current];
  return player.tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => canMove(token, state.dice))
    .map(({ index }) => index);
}

function canMove(token, dice) {
  if (token.progress === FINISHED) return false;
  if (token.progress === -1) return dice === 6;
  return token.progress + dice <= FINISHED;
}

function isLegal(playerId, tokenIndex) {
  const currentPlayer = state.players[state.current];
  return state.rolled && currentPlayer.id === playerId && state.legal.includes(tokenIndex);
}

function handleTokenClick(playerId, tokenIndex) {
  if (!isMyTurn()) return;
  if (state.activePower && isPowerTarget(playerId, tokenIndex)) {
    useActivePower(playerId, tokenIndex);
    return;
  }
  moveToken(playerId, tokenIndex);
}

function isPowerTarget(playerId, tokenIndex) {
  if (!state.activePower || state.settings.mode === "snakes" || state.winner) return false;
  const currentPlayer = state.players[state.current];
  const player = state.players.find((candidate) => candidate.id === playerId);
  const token = player?.tokens[tokenIndex];
  if (!currentPlayer || !token) return false;
  if (state.activePower === "blast") return playerId !== currentPlayer.id && token.progress >= 0 && token.progress < 52;
  if (state.activePower === "shield") return playerId === currentPlayer.id && token.progress >= 0 && token.progress < FINISHED;
  if (state.activePower === "target") return playerId === currentPlayer.id && canMove(token, state.targetSteps);
  return false;
}

function activatePower(power) {
  if (!isMyTurn()) return;
  if (state.settings.mode === "snakes") {
    setStatus("Powers are available on the Ludo board.");
    return;
  }
  if (powerCount(power) <= 0) {
    setStatus(`${POWER_LABELS[power]} is empty. Buy more in Shop.`);
    return;
  }
  if (power === "doubleMove") {
    consumePower("doubleMove");
    state.activePower = "doubleMove";
    addFeed("Double Move armed. Your next token move grants another roll.");
    setStatus("Double Move ready. Roll and move a token.");
    setFlow("powerSelection");
  } else {
    state.activePower = state.activePower === power ? null : power;
    setFlow(state.activePower ? "powerSelection" : state.rolled ? "moving" : "lobby");
    setStatus(state.activePower ? `${POWER_LABELS[power]} selected. Choose a target token.` : "Power cancelled.");
  }
  persistProgress();
  render();
  if (state.firebase.onlineActive) {
    pushOnlineGameState();
  }
}

function useActivePower(playerId, tokenIndex) {
  const power = state.activePower;
  const player = state.players.find((candidate) => candidate.id === playerId);
  const token = player.tokens[tokenIndex];

  usePower(power, player, token, tokenIndex);
}

function usePower(power, player, token, tokenIndex) {
  const currentPlayer = state.players[state.current];
  if (!power || !currentPlayer || !player || !token) return;

  if (power !== "doubleMove" && !consumePower(power)) {
    state.activePower = null;
    setStatus(`${POWER_LABELS[power]} is empty.`);
    render();
    return;
  }

  if (power === "blast") {
    state.activePower = null;
    if (token.shielded) {
      token.shielded = false;
      addFeed(`${player.name}'s shield blocked Blast Token.`);
      spawnTokenEffect(player, token, "shield-pop");
      playSfx("shield");
    } else {
      spawnTokenEffect(player, token, "capture-boom");
      triggerMoment("capture");
      token.progress = -1;
      state.wallet.captures += 1;
      state.wallet.coins += 30;
      addXp(30);
      addFeed(`${currentPlayer.name} blasted ${player.name}'s token back home.`);
      playSfx("capture");
    }
    setStatus("Blast Token used.");
    setFlow(state.rolled ? "moving" : "lobby");
    render();
    persistProgress();
    if (state.firebase.onlineActive) {
      pushOnlineGameState();
    }
    return;
  }

  if (power === "shield") {
    state.activePower = null;
    token.shielded = true;
    spawnTokenEffect(player, token, "shield-pop");
    playSfx("shield");
    addFeed(`${currentPlayer.name} shielded token ${tokenIndex + 1}.`);
    setStatus("Shield active on the selected token.");
    setFlow(state.rolled ? "moving" : "lobby");
    render();
    persistProgress();
    if (state.firebase.onlineActive) {
      pushOnlineGameState();
    }
    return;
  }

  if (power === "target") {
    state.activePower = null;
    state.dice = state.targetSteps;
    state.rolled = true;
    state.legal = [tokenIndex];
    setFlow("moving");
    spawnTokenEffect(player, token, "target-flash");
    playSfx("power");
    addFeed(`${currentPlayer.name} used Target Move for ${state.targetSteps} steps.`);
    moveToken(player.id, tokenIndex);
  }
}

function moveToken(playerId, tokenIndex) {
  if (!isLegal(playerId, tokenIndex) || state.winner) return;
  if (!isMyTurn()) return;

  const player = state.players[state.current];
  const token = player.tokens[tokenIndex];
  token.progress = token.progress === -1 ? 0 : token.progress + state.dice;
  state.lastMovedKey = `${player.id}-${tokenIndex}`;
  state.wallet.moves += 1;
  const captured = captureOpponents(player, token);
  const finished = token.progress === FINISHED;
  if (finished) triggerMoment("finish");
  const winnerLabel = winnerForMove(player);
  const doubleMove = state.activePower === "doubleMove";

  state.rolled = false;
  state.legal = [];
  state.activePower = null;
  addFeed(`${player.name} moved token ${tokenIndex + 1}.`);
  playSfx("move");

  if (winnerLabel) {
    const tournamentWin = state.settings.mode === "tournament";
    const rewardText = tournamentWin ? "+500 coins and +2 gems" : "+300 coins";
    state.winner = player.id;
    setFlow("victory");
    diceButton.disabled = true;
    addMatchResult(winnerLabel);
    state.wallet.coins += tournamentWin ? 500 : 300;
    if (tournamentWin) state.wallet.gems += 2;
    addXp(80);
    trackGoal("win-3", 1);
    
    // Award Battle Pass XP on match end
    if (state.firebase.onlineActive) {
      const mySeat = state.firebase.seatIndex;
      const winningSeatIndex = state.players.findIndex((p) => p.id === state.winner);
      if (mySeat === winningSeatIndex) {
        addBattlePassXp(150);
      } else {
        addBattlePassXp(50);
      }
    } else {
      if (player.id === "red") {
        addBattlePassXp(150);
      } else {
        addBattlePassXp(50);
      }
    }
    
    recordHistory(winnerLabel, tournamentWin ? "+500 coins, +2 gems" : "+300 coins");
    setGameOver(`${winnerLabel} wins`, `${MODE_LABELS[state.settings.mode]} complete. Reward: ${rewardText}.`);
    setStatus(`${winnerLabel} wins the match.`);
    addFeed(`${winnerLabel} wins ${rewardText}.`);
    playSfx("win");
    spawnConfetti();
    
    if (state.firebase.onlineActive) {
      processOnlineMatchEnd();
    }
    
    render();
    if (state.firebase.onlineActive) {
      pushOnlineGameState();
    }
    return;
  }

  render();

  if (doubleMove || state.dice === 6 || captured || finished) {
    diceButton.disabled = false;
    setFlow("lobby");
    const reason = doubleMove ? "Double Move bonus." : captured ? "Capture bonus." : finished ? "Home bonus." : "Six bonus.";
    setStatus(`${reason} ${player.name} rolls again.`);
    addFeed(`${reason} ${player.name} keeps the turn.`);
    persistProgress();
    if (state.firebase.onlineActive) {
      pushOnlineGameState();
    }
    scheduleBotTurn();
    return;
  }

  nextTurn();
}

function winnerForMove(player) {
  if (state.settings.mode === "team") {
    const team = teamFor(player.id);
    const finished = state.players
      .filter((candidate) => teamFor(candidate.id) === team)
      .reduce((sum, candidate) => sum + candidate.tokens.filter((token) => token.progress === FINISHED).length, 0);
    return finished >= 4 ? `${team} Team` : null;
  }

  const target = state.settings.mode === "quick" || state.settings.fastLudo ? 1 : 4;
  const finished = player.tokens.filter((token) => token.progress === FINISHED).length;
  return finished >= target ? player.name : null;
}

function teamFor(playerId) {
  return playerId === "red" || playerId === "yellow" ? "Crown" : "Shield";
}

function captureOpponents(player, token) {
  if (token.progress < 0 || token.progress >= 52) return false;

  const globalIndex = (player.start + token.progress) % PATH.length;
  if (SAFE_INDICES.has(globalIndex)) return false;

  let captured = false;
  state.players.forEach((opponent) => {
    if (opponent.id === player.id) return;
    opponent.tokens.forEach((otherToken) => {
      if (otherToken.progress < 0 || otherToken.progress >= 52) return;
      const otherGlobalIndex = (opponent.start + otherToken.progress) % PATH.length;
      if (otherGlobalIndex === globalIndex) {
        if (otherToken.shielded) {
          otherToken.shielded = false;
          addFeed(`${opponent.name}'s shield blocked the capture.`);
          spawnTokenEffect(opponent, otherToken, "shield-pop");
          playSfx("shield");
          return;
        }
        spawnTokenEffect(opponent, otherToken, "capture-boom");
        triggerMoment("capture");
        otherToken.progress = -1;
        state.wallet.captures += 1;
        state.wallet.coins += 20;
        addXp(25);
        trackGoal("capture-5", 1);
        addFeed(`${player.name} captured ${opponent.name} +20 coins.`);
        playSfx("capture");
        captured = true;
      }
    });
  });

  return captured;
}

function nextTurn() {
  if (state.winner) return;

  state.rolled = false;
  state.legal = [];
  state.dice = null;
  state.current = (state.current + 1) % state.players.length;
  diceButton.disabled = false;
  setFlow("lobby");
  const player = state.players[state.current];
  setStatus(`${player.name}'s turn. Roll the dice.`);
  render();
  if (state.firebase.onlineActive) {
    pushOnlineGameState();
  }
  scheduleBotTurn();
}

function isBotTurn() {
  if (state.settings.mode === "snakes") return false;
  const player = state.players[state.current];
  if (!player) return false;
  if (state.firebase.onlineActive) {
    return player.isBot;
  }
  if (state.settings.mode === "computer" || state.settings.mode === "tournament" || state.settings.mode === "random" || state.settings.mode === "story") return player.id !== "red";
  if (state.settings.mode === "team") return player.id === "green" || player.id === "blue";
  return false;
}

function botLabel() {
  return isBotTurn() ? "Computer thinking" : "Waiting for roll";
}

function scheduleBotTurn() {
  clearBotTimer();
  if (!isBotTurn() || state.rolled || state.winner) return;
  botTimer = window.setTimeout(() => rollDice(), 760);
}

function clearBotTimer() {
  if (!botTimer) return;
  window.clearTimeout(botTimer);
  botTimer = null;
}

function chooseBotMove() {
  const difficulty = normalizeDifficulty(state.settings.difficulty);
  if (difficulty === "easy") {
    return state.legal[Math.floor(Math.random() * state.legal.length)];
  }

  const player = state.players[state.current];
  const ranked = state.legal
    .map((index) => ({ index, score: scoreMove(player, index) }))
    .sort((a, b) => b.score - a.score);

  if (difficulty === "hard") return ranked[0].index;
  return Math.random() < 0.78 ? ranked[0].index : ranked[Math.floor(Math.random() * ranked.length)].index;
}

function normalizeDifficulty(difficulty) {
  if (difficulty === "casual") return "easy";
  if (difficulty === "smart") return "medium";
  if (difficulty === "royal") return "hard";
  return difficulty || "medium";
}

function scoreMove(player, tokenIndex) {
  const token = player.tokens[tokenIndex];
  const nextProgress = token.progress === -1 ? 0 : token.progress + state.dice;
  const globalIndex = nextProgress < 52 ? (player.start + nextProgress) % PATH.length : null;
  let score = nextProgress;

  if (token.progress === -1) score += state.dice === 6 ? 34 : 12;
  if (nextProgress >= 52) score += 26;
  if (nextProgress === FINISHED) score += 140;
  score += captureValue(player, nextProgress);
  if (globalIndex !== null && SAFE_INDICES.has(globalIndex)) score += 30;
  if (globalIndex !== null && isDangerCell(globalIndex, player.id)) score -= 42;
  if (token.progress >= 0 && token.progress < 52 && isDangerCell((player.start + token.progress) % PATH.length, player.id)) score += 18;
  score += Math.max(0, 12 - (FINISHED - nextProgress));
  return score;
}

function captureValue(player, nextProgress) {
  if (nextProgress < 0 || nextProgress >= 52) return 0;
  const globalIndex = (player.start + nextProgress) % PATH.length;
  if (SAFE_INDICES.has(globalIndex)) return 0;

  let value = 0;
  state.players.forEach((opponent) => {
    if (opponent.id === player.id) return;
    opponent.tokens.forEach((token) => {
      if (token.progress < 0 || token.progress >= 52) return;
      if ((opponent.start + token.progress) % PATH.length === globalIndex) {
        value += token.shielded ? 16 : 96 + Math.floor(token.progress / 2);
      }
    });
  });
  return value;
}

function wouldCapture(player, nextProgress) {
  return captureValue(player, nextProgress) > 0;
}

function isDangerCell(globalIndex, playerId) {
  if (SAFE_INDICES.has(globalIndex)) return false;

  return state.players.some((opponent) => {
    if (opponent.id === playerId) return false;
    return opponent.tokens.some((token) => {
      if (token.progress < 0 || token.progress >= 52) return false;
      const opponentIndex = (opponent.start + token.progress) % PATH.length;
      const distance = (globalIndex - opponentIndex + PATH.length) % PATH.length;
      return distance >= 1 && distance <= 6;
    });
  });
}

function tryBotPower(player) {
  const difficulty = normalizeDifficulty(state.settings.difficulty);
  if (!player || difficulty === "easy" || state.settings.mode === "snakes") return false;

  if (difficulty === "hard" && powerCount("target") > 0) {
    const targetPlay = bestTargetPowerMove(player);
    if (targetPlay) {
      state.targetSteps = targetPlay.steps;
      state.activePower = "target";
      usePower("target", player, player.tokens[targetPlay.tokenIndex], targetPlay.tokenIndex);
      return true;
    }
  }

  if (powerCount("blast") > 0 && Math.random() < (difficulty === "hard" ? 0.78 : 0.34)) {
    const target = bestBlastTarget(player);
    if (target) {
      state.activePower = "blast";
      usePower("blast", target.player, target.token, target.tokenIndex);
    }
  }

  if (powerCount("shield") > 0 && Math.random() < (difficulty === "hard" ? 0.58 : 0.26)) {
    const shield = bestShieldTarget(player);
    if (shield) {
      state.activePower = "shield";
      usePower("shield", player, shield.token, shield.tokenIndex);
    }
  }

  return false;
}

function bestTargetPowerMove(player) {
  const plays = [];
  player.tokens.forEach((token, tokenIndex) => {
    for (let steps = 1; steps <= 6; steps += 1) {
      if (!canMove(token, steps)) continue;
      const nextProgress = token.progress === -1 ? 0 : token.progress + steps;
      const value = scoreMoveWithDice(player, tokenIndex, steps, nextProgress);
      if (nextProgress === FINISHED || captureValue(player, nextProgress) > 0) {
        plays.push({ tokenIndex, steps, value });
      }
    }
  });
  plays.sort((a, b) => b.value - a.value);
  return plays[0] || null;
}

function scoreMoveWithDice(player, tokenIndex, dice, nextProgress) {
  const previousDice = state.dice;
  state.dice = dice;
  const value = scoreMove(player, tokenIndex) + (nextProgress === FINISHED ? 80 : 0);
  state.dice = previousDice;
  return value;
}

function bestBlastTarget(player) {
  const targets = [];
  state.players.forEach((opponent) => {
    if (opponent.id === player.id) return;
    opponent.tokens.forEach((token, tokenIndex) => {
      if (token.progress < 0 || token.progress >= 52) return;
      const globalIndex = (opponent.start + token.progress) % PATH.length;
      if (SAFE_INDICES.has(globalIndex)) return;
      targets.push({ player: opponent, token, tokenIndex, value: token.progress + (token.shielded ? -20 : 35) });
    });
  });
  targets.sort((a, b) => b.value - a.value);
  return targets[0] || null;
}

function bestShieldTarget(player) {
  const targets = player.tokens
    .map((token, tokenIndex) => ({ token, tokenIndex }))
    .filter(({ token }) => token.progress >= 0 && token.progress < 52 && !token.shielded)
    .map((entry) => ({
      ...entry,
      value: isDangerCell((player.start + entry.token.progress) % PATH.length, player.id) ? 80 + entry.token.progress : entry.token.progress,
    }))
    .sort((a, b) => b.value - a.value);
  return targets[0] || null;
}

function trackRoll(dice) {
  state.wallet.rolls += 1;
  addXp(2);
  trackGoal("roll-20", 1);
}

function trackGoal(id, amount) {
  const goal = state.goals.find((item) => item.id === id);
  if (!goal || goal.complete) return;
  goal.value += amount;
  if (goal.value >= goal.target) {
    goal.complete = true;
    state.wallet.coins += goal.reward;
    addXp(30);
    if (goal.bpXp) {
      addBattlePassXp(goal.bpXp);
    }
    addFeed(`Goal complete: ${goal.label} +${goal.reward} coins.`);
  }
  persistProgress();
}

function addXp(amount) {
  const beforeLevel = currentLevel();
  state.profile.xp += amount;
  const afterLevel = currentLevel();
  if (afterLevel > beforeLevel) {
    state.wallet.coins += afterLevel * 60;
    triggerMoment("reward");
    playSfx("reward");
    addFeed(`Level ${afterLevel} reached. Bonus coins added.`);
  }
  persistProgress();
}

function recordHistory(winner, reward) {
  if (state.settings.mode === "story" && winner === "Red") {
    state.settings.storyLevel += 1;
    addFeed(`Story level unlocked: ${state.settings.storyLevel}.`);
  }
  state.profile.history.unshift({
    winner,
    mode: MODE_LABELS[state.settings.mode],
    reward,
    at: new Date().toISOString(),
  });
  state.profile.history = state.profile.history.slice(0, 20);
  persistProgress();
}

function addMatchResult(winnerLabel) {
  if (winnerLabel === "Red" || winnerLabel === "Crown Team") {
    state.wallet.wins += 1;
  } else {
    state.wallet.losses = (state.wallet.losses || 0) + 1;
  }
}

function persistProgress() {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      wallet: state.wallet,
      powers: state.powers,
      dailyRewardClaimed: state.dailyRewardClaimed,
      rewards: state.rewards,
      profile: state.profile,
      goals: state.goals,
      battlePass: state.battlePass,
      settings: {
        difficulty: state.settings.difficulty,
        theme: state.settings.theme,
        sound: state.settings.sound,
        voice: state.settings.voice,
        roomCode: state.settings.roomCode,
        uiTab: state.settings.uiTab,
        fastLudo: state.settings.fastLudo,
        board3d: state.settings.board3d,
        powerDiceReady: state.settings.powerDiceReady,
        storyLevel: state.settings.storyLevel,
        skillBuild: state.settings.skillBuild,
        cloudSaveReady: state.settings.cloudSaveReady,
      },
      replaySetup: state.replaySetup,
      targetSteps: state.targetSteps,
    }));

    // Firestore profile data synchronization
    if (window.isFirebaseConfigured && window.firebaseFirestore && currentUser) {
      saveProfile();
    }
  } catch {
    // Local storage can be unavailable in hardened browser contexts.
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.wallet) state.wallet = { ...state.wallet, ...saved.wallet };
    if (saved.powers) state.powers = { ...state.powers, ...saved.powers };
    if (saved.rewards) state.rewards = { ...state.rewards, ...saved.rewards };
    if (typeof saved.dailyRewardClaimed === "boolean") state.dailyRewardClaimed = saved.dailyRewardClaimed;
    if (saved.targetSteps) state.targetSteps = Number(saved.targetSteps);
    if (saved.profile) state.profile = { ...state.profile, ...saved.profile };
    if (saved.battlePass) state.battlePass = { ...state.battlePass, ...saved.battlePass };
    if (Array.isArray(saved.goals)) state.goals = GOAL_BLUEPRINTS.map((goal) => ({ ...goal, ...(saved.goals.find((savedGoal) => savedGoal.id === goal.id) || {}) }));
    if (saved.settings) state.settings = { ...state.settings, ...saved.settings };
    if (saved.replaySetup) state.replaySetup = saved.replaySetup;
    state.settings.difficulty = normalizeDifficulty(state.settings.difficulty);
    if (!SKILL_BUILDS[state.settings.skillBuild]) state.settings.skillBuild = "aggressive";
    refreshDailyRewardState();
  } catch {
    state.profile.history = [];
  }
}

function getCurrentPlayer() {
  if (state.settings.mode === "snakes") return state.snakes.players[state.snakes.current] || state.snakes.players[0];
  return state.players[state.current] || state.players[0];
}

function setMode(mode) {
  state.settings.mode = mode;
  if (mode === "team" || mode === "tournament" || mode === "random" || mode === "story") state.playerCount = 4;
  updateModeButtons();
  updateCountButtons();
  
  if (mode === "friends") {
    if (window.isFirebaseConfigured && !currentUser) {
      authOverlay.hidden = false;
    }
    setStatus("Friends Online mode: Create or join an online room.");
    return;
  }
  
  if (mode === "random") {
    if (window.isFirebaseConfigured && !currentUser) {
      authOverlay.hidden = false;
      state.settings.mode = "classic";
      updateModeButtons();
      return;
    }
    joinMatchmakingQueue();
    return;
  }
  
  newGame(state.playerCount);
}

function syncControls() {
  state.settings.difficulty = normalizeDifficulty(state.settings.difficulty);
  difficultySelect.value = state.settings.difficulty;
  soundToggle.checked = state.settings.sound;
  voiceToggle.checked = state.settings.voice;
  fastRuleToggle.checked = state.settings.fastLudo;
  board3dToggle.checked = state.settings.board3d;
  applyTheme(state.settings.theme);
  updateUiTabs();
  updateModeButtons();
  updateThemeButtons();
  updateCountButtons();
}

function updateModeButtons() {
  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.settings.mode);
  });
}

function updateThemeButtons() {
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === state.settings.theme);
  });
}

function updateCountButtons() {
  countButtons.forEach((button) => {
    const active = Number(button.dataset.count) === state.playerCount;
    button.classList.toggle("active", active);
  });
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  state.settings.theme = theme;
  themeName.textContent = THEME_LABELS[theme];
}

function setUiTab(tab) {
  state.settings.uiTab = tab;
  updateUiTabs();
  persistProgress();
}

function updateUiTabs() {
  const activeTab = panelTabs.some((button) => button.dataset.uiTab === state.settings.uiTab) ? state.settings.uiTab : "play";
  state.settings.uiTab = activeTab;
  panelTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.uiTab === activeTab);
  });
  tabPanels.forEach((panel) => {
    if (panel.dataset.tabPanel === activeTab) {
      panel.dataset.tabActive = "true";
    } else {
      delete panel.dataset.tabActive;
    }
  });
}

function generateRoomCode() {
  const code = Math.random().toString(36).slice(2, 6).toUpperCase();
  state.settings.roomCode = `ROOM-${code}`;
  roomCode.textContent = state.settings.roomCode;
  addFeed(`Private room code created: ${state.settings.roomCode}.`);
  persistProgress();
}

function sendChat(text) {
  const message = text.trim();
  if (!message) return;
  
  if (state.firebase.onlineActive && window.isFirebaseConfigured && window.firebaseDb) {
    const roomName = state.settings.roomCode;
    window.firebaseDb.ref(`rooms/${roomName}/chat`).push({
      sender: state.profile.name,
      text: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  } else {
    addFeed(`You: ${message}`);
  }
  chatInput.value = "";
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    cloudSave();
    addFeed("Game saved on this device.");
    setStatus("Saved current match.");
  } catch {
    setStatus("Save failed in this browser.");
  }
}

function cloudSave() {
  if (!state.settings.cloudSaveReady) return false;
  addFeed("Cloud save queued for Firebase.");
  return true;
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      setStatus("No saved match found.");
      return;
    }
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
    if (!state.winner) state.gameOver = null;
    state.profile = { name: "Royal Player", avatar: "RL", xp: 0, owned: ["starter-frame"], equipped: "starter-frame", history: [], ...state.profile };
    state.wallet = { coins: 2500, gems: 24, wins: 0, losses: 0, rolls: 0, moves: 0, captures: 0, ...state.wallet };
    state.powers = { doubleMove: 1, blast: 1, shield: 1, target: 1, ...state.powers };
    state.matchPowers = { doubleMove: 0, blast: 0, shield: 0, target: 0, ...state.matchPowers };
    state.rewards = { dailyStreak: 0, lastDailyDate: "", spinCount: 0, ...state.rewards };
    state.flow = state.winner ? "victory" : "lobby";
    state.goals = Array.isArray(state.goals) ? state.goals : freshGoals();
    if (!SKILL_BUILDS[state.settings.skillBuild]) state.settings.skillBuild = "aggressive";
    refreshDailyRewardState();
    applyTheme(state.settings.theme || "classic");
    render();
    addFeed("Saved match loaded.");
    setStatus("Loaded saved match.");
    scheduleBotTurn();
  } catch {
    setStatus("Could not load saved match.");
  }
}

function handleShop(itemId) {
  const item = SHOP_ITEMS.find((shopItem) => shopItem.id === itemId);
  if (!item) return;

  if (item.type === "coins") {
    state.wallet.coins += item.amount;
    addFeed(`${item.name} added ${item.amount} coins.`);
    persistProgress();
    render();
    return;
  }

  if (item.type === "ad") {
    state.powers.doubleMove += 1;
    state.powers.shield += 1;
    addFeed("Reward ad prototype granted Double Move and Shield.");
    persistProgress();
    render();
    return;
  }

  if (item.type === "power") {
    if (state.wallet[item.currency] < item.cost) {
      setStatus(`Not enough ${item.currency} for ${item.name}.`);
      addFeed(`${item.name} needs ${item.cost} ${item.currency}.`);
      return;
    }
    state.wallet[item.currency] -= item.cost;
    if (item.power) {
      state.powers[item.power] += item.amount;
    } else {
      Object.keys(state.powers).forEach((power) => {
        state.powers[power] += 1;
      });
    }
    addXp(20);
    addFeed(`${item.name} added to your power inventory.`);
    persistProgress();
    render();
    return;
  }

  if (state.profile.owned.includes(item.id)) {
    state.profile.equipped = item.id;
    addFeed(`${item.name} equipped.`);
    persistProgress();
    render();
    return;
  }

  if (state.wallet[item.currency] < item.cost) {
    setStatus(`Not enough ${item.currency} for ${item.name}.`);
    addFeed(`${item.name} needs ${item.cost} ${item.currency}.`);
    return;
  }

  state.wallet[item.currency] -= item.cost;
  state.profile.owned.push(item.id);
  state.profile.equipped = item.id;
  addXp(20);
  addFeed(`${item.name} purchased and equipped.`);
  persistProgress();
  render();
}

function inviteFriend(name) {
  addFeed(`${name} invited to ${state.settings.roomCode}.`);
  setStatus(`Invite sent to ${name}.`);
}

function inviteByCode() {
  const code = inviteCodeInput.value.trim() || state.settings.roomCode;
  inviteCodeInput.value = "";
  addFeed(`Invite link prepared for ${code}.`);
  setStatus("Invite is ready for sharing.");
}

function activatePowerDice() {
  if (state.rolled || state.winner) {
    setStatus("Power dice can be used before rolling.");
    return;
  }
  if (state.settings.powerDiceReady) {
    setStatus("Power dice is already loaded.");
    return;
  }
  if (state.wallet.gems < 2) {
    setStatus("Power dice needs 2 gems.");
    addFeed("Not enough gems for power dice.");
    return;
  }
  state.wallet.gems -= 2;
  state.settings.powerDiceReady = true;
  playTone(660);
  addFeed("Power dice loaded. Your next roll is a six.");
  setStatus("Power dice ready for the next roll.");
  persistProgress();
  render();
}

function replayLastMatch() {
  const setup = state.replaySetup;
  if (!setup) {
    setStatus("No previous match to replay yet.");
    return;
  }
  state.settings.mode = setup.mode;
  state.settings.difficulty = normalizeDifficulty(setup.difficulty);
  state.settings.fastLudo = setup.fastLudo;
  state.settings.board3d = setup.board3d;
  state.settings.storyLevel = setup.storyLevel || state.settings.storyLevel;
  newGame(setup.playerCount);
  addFeed("Replay started with the last match setup.");
}

function antiCheatCheck(dice) {
  const ok = Number.isInteger(dice) && dice >= 1 && dice <= 6;
  antiCheatStatus.textContent = ok ? "Protected" : "Alert";
  if (!ok) addFeed("Anti-cheat blocked an invalid dice value.");
  return ok;
}

function scanMatch() {
  const ok = state.players.every((player) => player.tokens.every((token) => token.progress >= -1 && token.progress <= FINISHED));
  antiCheatStatus.textContent = ok ? "Protected" : "Alert";
  addFeed(ok ? "Anti-cheat scan passed." : "Anti-cheat found invalid token movement.");
  setStatus(ok ? "Match integrity looks clean." : "Match integrity warning.");
}

function claimDailyReward() {
  refreshDailyRewardState();
  if (!canClaimDailyReward()) {
    setStatus("Daily reward already claimed.");
    return;
  }
  const continued = state.rewards.lastDailyDate === yesterdayKey();
  state.rewards.dailyStreak = continued ? state.rewards.dailyStreak + 1 : 1;
  state.rewards.lastDailyDate = todayKey();
  state.dailyRewardClaimed = true;
  const coinBonus = 250 + Math.min(state.rewards.dailyStreak, 7) * 25;
  state.wallet.coins += coinBonus;
  if (state.rewards.dailyStreak % 5 === 0) state.wallet.gems += 1;
  state.powers.shield += 1;
  state.powers.target += 1;
  addXp(20);
  triggerMoment("reward");
  playSfx("reward");
  addFeed(`Daily streak ${state.rewards.dailyStreak}: +${coinBonus} coins, Shield, Target Move.`);
  setStatus(`Daily reward added. Streak ${state.rewards.dailyStreak}.`);
  persistProgress();
  render();
}

function spinWheel() {
  const rewards = [
    () => { state.wallet.coins += 150; return "+150 coins"; },
    () => { state.wallet.gems += 2; return "+2 gems"; },
    () => { state.powers.doubleMove += 1; return "Double Move"; },
    () => { state.powers.blast += 1; return "Blast Token"; },
    () => { state.powers.shield += 1; return "Shield"; },
    () => { state.powers.target += 1; return "Target Move"; },
  ];
  const reward = rewards[Math.floor(Math.random() * rewards.length)]();
  state.rewards.spinCount += 1;
  if (state.rewards.spinCount % 5 === 0) {
    state.wallet.gems += 1;
    addFeed("Spin streak bonus: +1 gem.");
  }
  triggerMoment("reward");
  playSfx("reward");
  addFeed(`Spin wheel reward: ${reward}.`);
  setStatus(`Spin wheel won ${reward}.`);
  persistProgress();
  render();
}

function handleHomeAction(action) {
  if (action === "play") {
    setMode("classic");
    setUiTab("play");
  } else if (action === "friends") {
    setMode("friends");
    setUiTab("social");
  } else if (action === "tournament") {
    setMode("tournament");
    setUiTab("play");
  } else if (action === "shop") {
    setUiTab("rewards");
  } else if (action === "profile") {
    setUiTab("profile");
  } else if (action === "spin") {
    setUiTab("rewards");
    spinWheel();
  }
}

function playTone(frequency) {
  if (!state.settings.sound) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext = audioContext || new AudioCtor();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.14);
  } catch {
    state.settings.sound = false;
  }
}

function playSfx(name) {
  const patterns = {
    button: [360],
    dice: [220, 300, 420],
    six: [520, 720],
    move: [340, 430],
    capture: [180, 90, 360],
    shield: [620, 520],
    power: [460, 620, 760],
    reward: [560, 720, 880],
    win: [520, 680, 840, 1040],
  };
  (patterns[name] || patterns.button).forEach((frequency, index) => {
    window.setTimeout(() => playTone(frequency), index * 70);
  });
}

function triggerMoment(type) {
  const className = `moment-${type}`;
  boardStage.classList.add(className);
  window.setTimeout(() => boardStage.classList.remove(className), type === "capture" ? 520 : 760);
}

function spawnTokenEffect(player, token, type) {
  const tokenIndex = player.tokens.indexOf(token);
  const [row, col] = tokenPosition(player, token, Math.max(tokenIndex, 0));
  spawnBoardEffect(row, col, type);
}

function spawnBoardEffect(row, col, type) {
  const cell = getCell(row, col);
  if (!cell) return;
  const effect = document.createElement("span");
  effect.className = `board-effect ${type}`;
  cell.append(effect);
  window.setTimeout(() => effect.remove(), 760);
}

function spawnConfetti() {
  const colors = ["#e03345", "#1fa565", "#e9bb27", "#336fe8", "#ffffff"];
  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--confetti-x", `${Math.random() * 240 - 120}px`);
    piece.style.setProperty("--confetti-y", `${Math.random() * -220 - 80}px`);
    piece.style.setProperty("--confetti-rotate", `${Math.random() * 540 - 270}deg`);
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    boardStage.append(piece);
    window.setTimeout(() => piece.remove(), 1100);
  }
}

function autoSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() }));
  } catch {
    // Autosave is best-effort for browsers that block local storage.
  }
}

function scheduleAutoSave() {
  window.clearTimeout(autoSaveTimer);
  autoSaveTimer = window.setTimeout(autoSave, 350);
}

// ==========================================
// BATTLE PASS & SEASONAL REWARDS SYSTEM
// ==========================================

const BATTLE_PASS_TIERS = [
  {
    tier: 1,
    free: { type: "coins", amount: 100, label: "100 Coins" },
    premium: { type: "cosmetic", id: "dragon-dice", label: "Dragon Dice Skin" }
  },
  {
    tier: 2,
    free: { type: "cosmetic", id: "fire-trail", label: "Fire Trail Cosmetic" },
    premium: { type: "power", id: "crown-effect", label: "Crown Visual Effect" }
  },
  {
    tier: 3,
    free: { type: "cosmetic", id: "starter-frame", label: "Starter Frame" },
    premium: { type: "cosmetic", id: "ninja-avatar", label: "Ninja Avatar Option" }
  },
  {
    tier: 4,
    free: { type: "gems", amount: 2, label: "2 Gems" },
    premium: { type: "cosmetic", id: "galaxy-theme", label: "Galaxy Board Theme" }
  },
  {
    tier: 5,
    free: { type: "power", id: "doubleMove", amount: 1, label: "Double Move Power Card" },
    premium: { type: "cosmetic", id: "neon-board", label: "Neon Cyberpunk Frame" }
  }
];

function addBattlePassXp(amount) {
  if (!state.battlePass) {
    state.battlePass = { xp: 0, tier: 1, premiumUnlocked: false, claimedFree: {}, claimedPremium: {} };
  }
  state.battlePass.xp += amount;
  
  const xpPerTier = 500;
  const maxTier = 5;
  let leveledUp = false;
  
  while (state.battlePass.xp >= xpPerTier && state.battlePass.tier < maxTier) {
    state.battlePass.xp -= xpPerTier;
    state.battlePass.tier += 1;
    leveledUp = true;
    addFeed(`Battle Pass Tier Up! Level ${state.battlePass.tier} reached!`);
  }
  
  if (leveledUp) {
    triggerMoment("reward");
    playSfx("reward");
  }
  
  persistProgress();
  renderBattlePass();
}

function buyPremiumPass() {
  if (!state.battlePass) {
    state.battlePass = { xp: 0, tier: 1, premiumUnlocked: false, claimedFree: {}, claimedPremium: {} };
  }
  if (state.battlePass.premiumUnlocked) {
    addFeed("Premium Pass is already unlocked.");
    return;
  }
  
  const cost = 15;
  if (state.wallet.gems < cost) {
    addFeed("Insufficient Gems to buy Premium Pass.");
    return;
  }
  
  state.wallet.gems -= cost;
  state.battlePass.premiumUnlocked = true;
  addFeed("Premium Battle Pass unlocked! Complete Tiers for elite rewards.");
  
  triggerMoment("reward");
  playSfx("reward");
  
  persistProgress();
  saveProfile();
  renderBattlePass();
  renderProfile();
}

function claimBattlePassReward(tier, track) {
  if (!state.battlePass) return;
  if (state.battlePass.tier < tier) {
    addFeed("Tier is locked.");
    return;
  }
  if (track === "premium" && !state.battlePass.premiumUnlocked) {
    addFeed("Premium Pass is locked.");
    return;
  }
  
  const tierData = BATTLE_PASS_TIERS.find(t => t.tier === tier);
  if (!tierData) return;
  
  const reward = track === "free" ? tierData.free : tierData.premium;
  const claimedMap = track === "free" ? state.battlePass.claimedFree : state.battlePass.claimedPremium;
  
  if (claimedMap[tier]) {
    addFeed("Reward already claimed.");
    return;
  }
  
  // Award item
  if (reward.type === "coins") {
    state.wallet.coins += reward.amount;
    addFeed(`Claimed ${reward.amount} Coins!`);
  } else if (reward.type === "gems") {
    state.wallet.gems += reward.amount;
    addFeed(`Claimed ${reward.amount} Gems!`);
  } else if (reward.type === "cosmetic") {
    if (!state.profile.owned.includes(reward.id)) {
      state.profile.owned.push(reward.id);
    }
    state.profile.equipped = reward.id;
    addFeed(`Claimed and equipped ${reward.label}!`);
  } else if (reward.type === "power") {
    if (reward.id === "crown-effect") {
      if (!state.profile.owned.includes(reward.id)) {
        state.profile.owned.push(reward.id);
      }
      addFeed("Claimed Crown Effect! Your profile avatar is crowned.");
    } else {
      state.powers[reward.id] = (state.powers[reward.id] || 0) + (reward.amount || 1);
      addFeed(`Claimed ${reward.amount || 1} ${POWER_LABELS[reward.id]} Card!`);
    }
  }
  
  claimedMap[tier] = true;
  triggerMoment("reward");
  playSfx("reward");
  
  persistProgress();
  saveProfile();
  renderBattlePass();
  renderProfile();
  renderShop();
  renderPowers();
}

function renderBattlePass() {
  if (!state.battlePass) {
    state.battlePass = { xp: 0, tier: 1, premiumUnlocked: false, claimedFree: {}, claimedPremium: {} };
  }
  
  const xpPerTier = 500;
  const currentTier = state.battlePass.tier;
  const maxTier = 5;
  
  // Progress Header
  bpTierLabel.textContent = `Tier ${currentTier}`;
  if (currentTier >= maxTier) {
    bpXpText.textContent = "Max Tier Reached";
    bpXpFill.style.width = "100%";
  } else {
    const xpVal = state.battlePass.xp || 0;
    bpXpText.textContent = `${xpVal} / ${xpPerTier} BP XP`;
    bpXpFill.style.width = `${Math.min(100, (xpVal / xpPerTier) * 100)}%`;
  }
  
  // Premium button rendering
  if (state.battlePass.premiumUnlocked) {
    buyPremiumPassBtn.textContent = "Premium Active ✨";
    buyPremiumPassBtn.disabled = true;
    buyPremiumPassBtn.style.background = "linear-gradient(135deg, #ffd700, #ff8c00)";
    buyPremiumPassBtn.style.color = "#fff";
  } else {
    buyPremiumPassBtn.textContent = "Buy Premium (15 Gems)";
    buyPremiumPassBtn.disabled = false;
    buyPremiumPassBtn.style.background = "#ffc837";
    buyPremiumPassBtn.style.color = "#121626";
  }
  
  // Render tier cards
  bpRewardsList.innerHTML = "";
  BATTLE_PASS_TIERS.forEach((t) => {
    const isLocked = currentTier < t.tier;
    const freeClaimed = state.battlePass.claimedFree[t.tier];
    const premiumClaimed = state.battlePass.claimedPremium[t.tier];
    const premiumUnlocked = state.battlePass.premiumUnlocked;
    
    let freeBtnHtml = "";
    if (freeClaimed) {
      freeBtnHtml = `<button class="mini-button bp-claim-btn claimed" disabled>Claimed</button>`;
    } else if (isLocked) {
      freeBtnHtml = `<button class="mini-button bp-claim-btn locked" disabled>Locked</button>`;
    } else {
      freeBtnHtml = `<button class="mini-button bp-claim-btn claim" data-tier="${t.tier}" data-track="free" type="button">Claim</button>`;
    }
    
    let premiumBtnHtml = "";
    if (premiumClaimed) {
      premiumBtnHtml = `<button class="mini-button bp-claim-btn claimed" disabled>Claimed</button>`;
    } else if (isLocked) {
      premiumBtnHtml = `<button class="mini-button bp-claim-btn locked" disabled>Locked</button>`;
    } else if (!premiumUnlocked) {
      premiumBtnHtml = `<button class="mini-button bp-claim-btn premium-locked" disabled>Premium</button>`;
    } else {
      premiumBtnHtml = `<button class="mini-button bp-claim-btn claim" data-tier="${t.tier}" data-track="premium" type="button">Claim</button>`;
    }
    
    const card = document.createElement("div");
    card.className = `bp-tier-card ${isLocked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="bp-tier-header">
        <strong>Tier ${t.tier}</strong>
        ${isLocked ? '<span style="font-size:0.75rem; color:#a0aec0;">🔒 Locked</span>' : '<span style="font-size:0.75rem; color:#48bb78;">🔓 Unlocked</span>'}
      </div>
      <div class="bp-tier-tracks">
        <div class="bp-track-row free">
          <span class="bp-track-label">Free</span>
          <span class="bp-reward-name">${t.free.label}</span>
          ${freeBtnHtml}
        </div>
        <div class="bp-track-row premium">
          <span class="bp-track-label premium">Premium</span>
          <span class="bp-reward-name">${t.premium.label}</span>
          ${premiumBtnHtml}
        </div>
      </div>
    `;
    bpRewardsList.append(card);
  });
}

let roomListener = null;
let matchmakingListener = null;
let currentUser = null;
let isSignUpMode = false;


function initFirebaseAuth() {
  if (!window.isFirebaseConfigured || !window.firebaseAuth) {
    console.warn("Firebase config not found. Disabling online systems.");
    firebaseConfigWarning.hidden = false;
    authSubmitButton.textContent = "Play Offline";
    googleLoginBtn.disabled = true;
    return;
  }
  
  firebaseConfigWarning.hidden = true;
  
  window.firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      authOverlay.hidden = true;
      signOutButton.style.display = "block";
      setOnlineStatus("online");
      loadProfile();
      listenForInvites();
      listenForFriendRequests();

      // ── Auto-Reconnect on page refresh / network restore ──────────────────
      const savedRoom = localStorage.getItem(RECONNECT_ROOM_KEY);
      const savedSeat = localStorage.getItem(RECONNECT_SEAT_KEY);
      const savedHost = localStorage.getItem(RECONNECT_HOST_KEY);

      if (savedRoom && savedSeat !== null && window.isFirebaseConfigured && window.firebaseDb) {
        const seatIdx = Number(savedSeat);
        const wasHost = savedHost === "1";

        window.firebaseDb.ref(`rooms/${savedRoom}`).once("value").then((snap) => {
          if (!snap.exists()) {
            // Room gone — clean up stale keys
            localStorage.removeItem(RECONNECT_ROOM_KEY);
            localStorage.removeItem(RECONNECT_SEAT_KEY);
            localStorage.removeItem(RECONNECT_HOST_KEY);
            return;
          }
          const roomData = snap.val();
          if (roomData.status !== "playing") return; // Only reconnect mid-match

          // Restore firebase state flags
          state.settings.roomCode = savedRoom;
          roomCode.textContent = savedRoom;
          state.firebase.onlineActive = true;
          state.firebase.isHost = wasHost;
          state.firebase.seatIndex = seatIdx;
          state.playerCount = 4;

          // Re-mark our seat as present
          window.firebaseDb.ref(`rooms/${savedRoom}/seats/${seatIdx}`).update({
            present: true,
            uid: user.uid
          });

          showToastNotification("Reconnected to match! Syncing board…", "info");
          addFeed("Reconnected to active match.");
          listenToRoom(savedRoom);
        }).catch(() => {
          localStorage.removeItem(RECONNECT_ROOM_KEY);
          localStorage.removeItem(RECONNECT_SEAT_KEY);
          localStorage.removeItem(RECONNECT_HOST_KEY);
        });
      }
      // ─────────────────────────────────────────────────────────────────────
    } else {
      currentUser = null;
      authOverlay.hidden = false;
      signOutButton.style.display = "none";
    }
  });

  emailAuthForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ── Offline / Guest mode when Firebase not connected ──────────────────
    if (!window.isFirebaseConfigured) {
      authOverlay.hidden = true;
      showToastNotification("Playing offline — connect Firebase for full login.", "info", 4000);
      addFeed("Playing in offline mode.");
      return;
    }

    const email    = authEmail.value.trim();
    const password = authPassword.value;

    // Basic validation
    if (!email || !email.includes("@")) {
      authErrorMsg.textContent = "⚠️ Please enter a valid email address.";
      authErrorMsg.hidden = false; return;
    }
    if (password.length < 6) {
      authErrorMsg.textContent = "⚠️ Password must be at least 6 characters.";
      authErrorMsg.hidden = false; return;
    }

    authErrorMsg.hidden = true;
    authSubmitButton.disabled = true;
    authSubmitButton.textContent = isSignUpMode ? "Creating account…" : "Signing in…";

    // ── Friendly Firebase error messages ──────────────────────────────────
    function friendlyError(code) {
      const map = {
        "auth/user-not-found":       "No account found with this email. Tap Sign Up to create one.",
        "auth/wrong-password":       "Wrong password. Please try again.",
        "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
        "auth/invalid-email":        "Please enter a valid email address.",
        "auth/weak-password":        "Password is too weak. Use at least 6 characters.",
        "auth/too-many-requests":    "Too many attempts. Please wait a few minutes and try again.",
        "auth/network-request-failed": "No internet connection. Please check your network.",
        "auth/invalid-credential":   "Email or password is incorrect. Please try again.",
      };
      return map[code] || "Something went wrong. Please try again.";
    }

    if (isSignUpMode) {
      // ── SIGN UP: create account + send verification email ───────────────
      try {
        const result = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user   = result.user;

        // Send email verification
        await user.sendEmailVerification();

        // Show success message and enter the game
        authSubmitButton.textContent = "Welcome! 🎉";
        showToastNotification("Account created! Verification email sent.", "success", 6000);
        
        // Hide the overlay to let them play
        setTimeout(() => {
          authOverlay.hidden = true;
        }, 1000);

      } catch (err) {
        authSubmitButton.disabled = false;
        authSubmitButton.textContent = "Create Account";
        authErrorMsg.style = "";
        authErrorMsg.textContent = "⚠️ " + friendlyError(err.code);
        authErrorMsg.hidden = false;
      }

    } else {
      // ── SIGN IN ─────────────────────────────────────────────────────────
      try {
        const result = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
        authSubmitButton.textContent = "Welcome back! 🎉";
        
        // Hide the overlay to let them play
        setTimeout(() => {
          authOverlay.hidden = true;
        }, 1000);

      } catch (err) {
        authSubmitButton.disabled = false;
        authSubmitButton.textContent = "Sign In";
        authErrorMsg.style = "";
        authErrorMsg.textContent = "⚠️ " + friendlyError(err.code);
        authErrorMsg.hidden = false;
      }
    }
  });

  toggleAuthModeBtn.addEventListener("click", () => {
    isSignUpMode = !isSignUpMode;
    authErrorMsg.hidden = true;
    authErrorMsg.style  = "";
    toggleAuthModeBtn.textContent = isSignUpMode ? "Sign In" : "Sign Up";
    document.querySelector(".auth-toggle-text").firstChild.textContent = isSignUpMode
      ? "Already have an account? "
      : "Don't have an account? ";
    authSubmitButton.textContent  = isSignUpMode ? "Create Account" : "Sign In";
    authSubmitButton.disabled     = false;
  });

  googleLoginBtn.addEventListener("click", () => {
    if (!window.isFirebaseConfigured) return;
    const provider = new firebase.auth.GoogleAuthProvider();
    window.firebaseAuth.signInWithPopup(provider)
      .catch((err) => {
        authErrorMsg.textContent = err.message;
        authErrorMsg.hidden = false;
      });
  });

  guestLoginBtn.addEventListener("click", () => {
    if (!window.isFirebaseConfigured) {
      authOverlay.hidden = true;
      addFeed("Playing as Guest offline.");
      return;
    }
    window.firebaseAuth.signInAnonymously()
      .catch((err) => {
        authErrorMsg.textContent = err.message;
        authErrorMsg.hidden = false;
      });
  });

  signOutButton.addEventListener("click", () => {
    if (window.isFirebaseConfigured && window.firebaseAuth) {
      setOnlineStatus("offline");
      window.firebaseAuth.signOut().then(() => {
        window.location.reload();
      });
    } else {
      authOverlay.hidden = false;
    }
  });
}

function setOnlineStatus(status) {
  if (window.isFirebaseConfigured && window.firebaseFirestore && currentUser) {
    window.firebaseFirestore.collection("users").doc(currentUser.uid).set({
      status: status,
      email: currentUser.email || `${currentUser.uid.slice(0, 8)}@guest.com`
    }, { merge: true }).catch(() => {});
  }
}

window.addEventListener("beforeunload", () => {
  setOnlineStatus("offline");
});

function loadProfile() {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  const userDocRef = window.firebaseFirestore.collection("users").doc(currentUser.uid);
  
  userDocRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const prof = data.profile || data;
      state.profile.name = prof.name || state.profile.name || "Royal Player";
      state.profile.avatar = prof.avatar || state.profile.avatar || "RL";
      state.profile.elo = prof.elo || 1200;
      state.profile.xp = prof.xp || 0;
      state.wallet.coins = typeof prof.coins === 'number' ? prof.coins : state.wallet.coins;
      state.wallet.gems = typeof prof.gems === 'number' ? prof.gems : state.wallet.gems;
      state.wallet.wins = prof.wins || 0;
      state.wallet.losses = prof.losses || 0;
      state.wallet.captures = prof.captures || 0;
      state.wallet.moves = prof.moves || 0;
      state.wallet.rolls = prof.rolls || 0;
      
      if (Array.isArray(prof.inventory)) {
        state.profile.owned = prof.inventory;
      } else if (Array.isArray(data.inventory)) {
        state.profile.owned = data.inventory;
      }
      if (prof.equipped) {
        state.profile.equipped = prof.equipped;
      } else if (data.equipped) {
        state.profile.equipped = data.equipped;
      }
      
      if (data.battlePass) {
        state.battlePass = { ...state.battlePass, ...data.battlePass };
      }
      
      addFeed("Cloud profile loaded successfully.");
    } else {
      saveProfile();
    }
    renderProfile();
    loadFriendsList();
    loadFirestoreLeaderboard();
  }).catch((err) => {
    console.error("Error loading cloud profile:", err);
  });
}

function saveProfile() {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  const userDocRef = window.firebaseFirestore.collection("users").doc(currentUser.uid);
  
  const profileDetails = {
    name: state.profile.name,
    avatar: state.profile.avatar,
    elo: state.profile.elo || 1200,
    xp: state.profile.xp || 0,
    coins: state.wallet.coins,
    gems: state.wallet.gems,
    wins: state.wallet.wins,
    losses: state.wallet.losses || 0,
    captures: state.wallet.captures,
    moves: state.wallet.moves,
    rolls: state.wallet.rolls,
    inventory: state.profile.owned,
    equipped: state.profile.equipped,
    email: currentUser.email || `${currentUser.uid.slice(0, 8)}@guest.com`
  };
  
  const profileData = {
    ...profileDetails,
    profile: profileDetails,
    battlePass: state.battlePass
  };
  
  userDocRef.set(profileData, { merge: true })
    .then(() => {
      console.log("Cloud profile saved.");
    })
    .catch((err) => {
      console.error("Error saving cloud profile:", err);
    });
}

function loadFirestoreLeaderboard() {
  renderLeaderboard();
}

function createOnlineRoom() {
  if (!window.isFirebaseConfigured || !window.firebaseDb || !currentUser) {
    generateRoomCode();
    return;
  }
  
  const code = Math.random().toString(36).slice(2, 6).toUpperCase();
  const roomName = `ROOM-${code}`;
  state.settings.roomCode = roomName;
  roomCode.textContent = roomName;
  
  const roomRef = window.firebaseDb.ref(`rooms/${roomName}`);
  state.firebase.onlineActive = true;
  state.firebase.isHost = true;
  state.firebase.seatIndex = 0; // Host takes Red (0)
  
  const initialRoom = {
    host: currentUser.uid,
    status: "lobby",
    playerCount: 4,
    seats: {
      "0": { uid: currentUser.uid, name: state.profile.name, avatar: state.profile.avatar, elo: state.profile.elo || 1200, present: true, ready: true },
      "1": null,
      "2": null,
      "3": null
    },
    gameState: null
  };
  
  roomRef.set(initialRoom).then(() => {
    // Persist reconnect info so page refresh auto-rejoins
    localStorage.setItem(RECONNECT_ROOM_KEY, roomName);
    localStorage.setItem(RECONNECT_SEAT_KEY, "0");
    localStorage.setItem(RECONNECT_HOST_KEY, "1");
    addFeed(`Created online room: ${roomName}`);
    showToastNotification(`Room <strong>${roomName}</strong> created! Share the code.`, "success");
    // Start presence heartbeat and network monitor
    if (window.isFirebaseConfigured && window.firebaseDb) {
      startPresenceHeartbeat(roomName, 0);
      startNetworkMonitor();
    }
    listenToRoom(roomName);
  });
}

function joinOnlineRoom(roomName) {
  if (!window.isFirebaseConfigured || !window.firebaseDb || !currentUser) {
    addFeed(`Offline mode: joined room ${roomName}`);
    return;
  }
  
  const roomRef = window.firebaseDb.ref(`rooms/${roomName}`);
  
  roomRef.once('value').then((snapshot) => {
    if (!snapshot.exists()) {
      setStatus("Room not found.");
      addFeed("Error: Room does not exist.");
      return;
    }
    
    const data = snapshot.val();
    if (data.status === "playing") {
      setStatus("Match already in progress.");
      return;
    }
    
    let seatIndex = -1;
    for (let index = 0; index < 4; index += 1) {
      if (!data.seats || !data.seats[index]) {
        seatIndex = index;
        break;
      }
    }
    
    if (seatIndex === -1) {
      setStatus("Room is full.");
      return;
    }
    
    state.settings.roomCode = roomName;
    roomCode.textContent = roomName;
    state.firebase.onlineActive = true;
    state.firebase.isHost = false;
    state.firebase.seatIndex = seatIndex;
    
    const playerSeatRef = window.firebaseDb.ref(`rooms/${roomName}/seats/${seatIndex}`);
    playerSeatRef.set({
      uid: currentUser.uid,
      name: state.profile.name,
      avatar: state.profile.avatar,
      elo: state.profile.elo || 1200,
      present: true,
      ready: false
    }).then(() => {
      // Persist reconnect info so page refresh auto-rejoins
      localStorage.setItem(RECONNECT_ROOM_KEY, roomName);
      localStorage.setItem(RECONNECT_SEAT_KEY, String(seatIndex));
      localStorage.setItem(RECONNECT_HOST_KEY, "0");
      addFeed(`Joined room ${roomName} as seat ${seatIndex}`);
      showToastNotification(`Joined room <strong>${roomName}</strong>! You are seat ${seatIndex + 1}.`, "success");
      // Start presence heartbeat and network monitor
      if (window.isFirebaseConfigured && window.firebaseDb) {
        startPresenceHeartbeat(roomName, seatIndex);
        startNetworkMonitor();
      }
      listenToRoom(roomName);
    });
  });
}

function listenToRoom(roomName) {
  if (roomListener) {
    roomListener.off();
  }
  
  const roomRef = window.firebaseDb.ref(`rooms/${roomName}`);
  roomListener = roomRef;
  
  roomRef.on('value', (snapshot) => {
    if (!snapshot.exists()) {
      leaveOnlineRoom();
      return;
    }
    
    const data = snapshot.val();
    
    if (data.status === "lobby") {
      onlineLobbyOverlay.hidden = false;
      lobbyRoomCodeText.textContent = roomName;
      
      const slots = document.querySelectorAll(".lobby-slot");
      let activeCount = 0;
      let readyCount = 0;
      
      slots.forEach((slotEl, idx) => {
        const slotData = data.seats ? data.seats[idx] : null;
        const nameEl = slotEl.querySelector(".slot-player-name");
        const statusEl = slotEl.querySelector(".slot-player-status");
        
        if (slotData) {
          slotEl.classList.add("occupied");
          const tier = getEloTier(slotData.elo || 1200);
          nameEl.innerHTML = `<span class="${tier.class}">${tier.badge}</span> ${slotData.name}`;
          
          if (idx === 0) {
            statusEl.textContent = "Host";
            slotEl.classList.add("ready");
          } else {
            if (slotData.ready) {
              statusEl.textContent = "Ready";
              slotEl.classList.add("ready");
              readyCount++;
            } else {
              statusEl.textContent = "Waiting...";
              slotEl.classList.remove("ready");
            }
          }
          activeCount++;
        } else {
          slotEl.classList.remove("occupied", "ready");
          nameEl.textContent = "Empty Seat";
          statusEl.textContent = "Waiting...";
        }
      });
      
      if (state.firebase.isHost) {
        lobbyStartButton.style.display = "block";
        lobbyReadyButton.style.display = "none";
        
        const guests = activeCount - 1;
        const allReady = readyCount === guests;
        
        lobbyStartButton.disabled = activeCount < 2 || !allReady;
        if (activeCount < 2) {
          lobbyStartButton.textContent = "Waiting for players...";
        } else if (!allReady) {
          lobbyStartButton.textContent = "Waiting for ready...";
        } else {
          lobbyStartButton.textContent = "Start Match";
        }
      } else {
        lobbyStartButton.style.display = "none";
        lobbyReadyButton.style.display = "block";
        
        const mySeatData = data.seats ? data.seats[state.firebase.seatIndex] : null;
        if (mySeatData && mySeatData.ready) {
          lobbyReadyButton.textContent = "Unready";
          lobbyReadyButton.classList.add("is-ready");
        } else {
          lobbyReadyButton.textContent = "Ready";
          lobbyReadyButton.classList.remove("is-ready");
        }
      }
    } else if (data.status === "playing") {
      onlineLobbyOverlay.hidden = true;
      if (data.gameState) {
        syncOnlineGame(data.gameState, data.seats);
      }
    }
  });

  const chatRef = window.firebaseDb.ref(`rooms/${roomName}/chat`);
  chatRef.off();
  chatRef.limitToLast(6).on('child_added', (snapshot) => {
    const chat = snapshot.val();
    if (chat) {
      addFeed(`${chat.sender}: ${chat.text}`);
    }
  });
  
  if (state.firebase.isHost) {
    const rollReqRef = window.firebaseDb.ref(`rooms/${roomName}/rollRequest`);
    rollReqRef.off();
    rollReqRef.on('value', (snapshot) => {
      const req = snapshot.val();
      if (req && req.uid === state.players[state.current].uid) {
        const rolledValue = 1 + Math.floor(Math.random() * 6);
        rollReqRef.remove();
        
        const gameStateRef = window.firebaseDb.ref(`rooms/${roomName}/gameState`);
        gameStateRef.update({
          dice: rolledValue,
          rolled: true,
          flow: "moving"
        });
      }
    });
  }
}

function syncOnlineGame(firebaseGameState, seats) {
  state.current = firebaseGameState.currentTurn !== undefined ? firebaseGameState.currentTurn : (firebaseGameState.current !== undefined ? firebaseGameState.current : firebaseGameState.Turn);
  state.winner = firebaseGameState.winner !== undefined ? firebaseGameState.winner : firebaseGameState.Winner;
  state.flow = firebaseGameState.flow;
  state.lastMovedKey = firebaseGameState.lastMovedKey;
  state.activePower = firebaseGameState.activePower;
  state.targetSteps = firebaseGameState.targetSteps;

  if (!state.winner) {
    state.firebase.matchEndProcessed = false;
  }

  const diceVal = firebaseGameState.diceRoll !== undefined 
    ? firebaseGameState.diceRoll 
    : (firebaseGameState.dice !== undefined ? firebaseGameState.dice : firebaseGameState.Dice);
  
  const tokensVal = firebaseGameState.tokenPositions !== undefined 
    ? firebaseGameState.tokenPositions 
    : (firebaseGameState.Tokens !== undefined ? firebaseGameState.Tokens : firebaseGameState.players);

  state.players = PLAYERS.slice(0, 4).map((p, idx) => {
    const seatPlayer = seats[idx] || { name: `Bot ${p.name}`, avatar: p.id.toUpperCase(), elo: 1000 };
    const firebasePlayer = tokensVal ? tokensVal[idx] : null;
    
    return {
      ...p,
      name: seatPlayer.name,
      avatar: seatPlayer.avatar,
      elo: seatPlayer.elo || 1200,
      isBot: !seats[idx],
      tokens: firebasePlayer 
        ? firebasePlayer.tokens.map((t, tIdx) => ({ id: `${p.id}-${tIdx}`, progress: t.progress, shielded: t.shielded || false })) 
        : p.tokens || Array.from({ length: 4 }, (_, i) => ({ id: `${p.id}-${i}`, progress: -1, shielded: false }))
    };
  });

  const activePlayer = state.players[state.current];

  if (diceVal !== state.dice && firebaseGameState.rolled) {
    animateDiceWithValue(diceVal, (rolledVal) => {
      state.dice = rolledVal;
      state.rolled = true;
      state.legal = legalMovesForCurrent();
      
      setFlow("moving");
      if (state.legal.length === 0) {
        setStatus(`${activePlayer.name} rolled ${state.dice}. No legal move.`);
        if (isMyTurn()) {
          window.setTimeout(nextTurn, 1000);
        }
      } else {
        if (isMyTurn()) {
          setStatus("It's your turn. Choose a token to move.");
          if (isBotTurn()) {
            botTimer = window.setTimeout(() => {
              const bot = state.players[state.current];
              if (tryBotPower(bot)) return;
              moveToken(bot.id, chooseBotMove());
            }, 780);
          }
        } else {
          setStatus(`Waiting for ${activePlayer.name} to move...`);
        }
      }
      render();
    });
  } else {
    state.dice = diceVal;
    state.rolled = firebaseGameState.rolled;
    render();
    
    if (state.winner) {
      setStatus(`${activePlayer.name} wins!`);
      if (!state.firebase.matchEndProcessed) {
        state.firebase.matchEndProcessed = true;
        processOnlineMatchEnd();
      }
      return;
    }
    
    const myTurn = isMyTurn();
    if (myTurn) {
      if (state.rolled) {
        setStatus("It's your turn. Move a token.");
      } else {
        setStatus("It's your turn. Roll the dice.");
      }
      diceButton.disabled = state.rolled;
    } else {
      setStatus(`Waiting for ${activePlayer.name} to roll...`);
      diceButton.disabled = true;
    }

    if (state.firebase.isHost && activePlayer.isBot && !state.rolled) {
      scheduleBotTurn();
    }
  }
}

function pushOnlineGameState() {
  if (!state.firebase.onlineActive || !window.isFirebaseConfigured || !window.firebaseDb) return;
  
  const roomName = state.settings.roomCode;
  const gameStateRef = window.firebaseDb.ref(`rooms/${roomName}/gameState`);
  
  const playersData = state.players.map((p) => ({
    tokens: p.tokens.map((t) => ({ progress: t.progress, shielded: t.shielded }))
  }));
  
  const gameStateData = {
    currentTurn: state.current,
    current: state.current,
    Turn: state.current,
    
    diceRoll: state.dice,
    dice: state.dice,
    Dice: state.dice,
    
    rolled: state.rolled,
    winner: state.winner,
    Winner: state.winner,
    gameOver: state.gameOver,
    flow: state.flow,
    lastMovedKey: state.lastMovedKey,
    activePower: state.activePower,
    targetSteps: state.targetSteps,
    
    tokenPositions: playersData,
    players: playersData,
    Tokens: playersData
  };
  
  gameStateRef.set(gameStateData).catch((error) => {
    console.error("Error pushing online state:", error);
  });
}

function processOnlineMatchEnd() {
  if (!state.firebase.onlineActive || !currentUser) return;
  
  // Clear reconnect data — match is over
  localStorage.removeItem(RECONNECT_ROOM_KEY);
  localStorage.removeItem(RECONNECT_SEAT_KEY);
  localStorage.removeItem(RECONNECT_HOST_KEY);

  const mySeat = state.firebase.seatIndex;
  const myPlayer = state.players[mySeat];
  const winningSeatIndex = state.players.findIndex((p) => p.id === state.winner);
  const winningPlayer = state.players[winningSeatIndex];
  
  if (winningSeatIndex === -1 || !myPlayer || !winningPlayer) return;
  
  const K = 32;
  const myElo = state.profile.elo || 1200;
  let eloChange = 0;
  
  if (mySeat === winningSeatIndex) {
    state.players.forEach((opp, idx) => {
      if (idx === mySeat || opp.isBot) return;
      const oppElo = opp.elo || 1200;
      const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
      eloChange += Math.round(K * (1 - expected));
    });
    state.profile.elo = myElo + eloChange;
    addFeed(`Victory! ELO rating gains +${eloChange} ELO.`);
    showToastNotification(`🏆 You won! +${eloChange} ELO`, "success", 6000);
  } else {
    const winElo = winningPlayer.elo || 1200;
    const expected = 1 / (1 + Math.pow(10, (winElo - myElo) / 400));
    eloChange = Math.round(K * (0 - expected));
    state.profile.elo = Math.max(100, myElo + eloChange);
    addFeed(`Defeat! ELO rating drops by ${eloChange} ELO.`);
    showToastNotification(`Match ended. ${eloChange} ELO`, "info", 5000);
  }
  
  // Auto-save to cloud and local
  triggerCloudSave();
  saveProfile();
}

function leaveOnlineRoom() {
  if (roomListener) {
    roomListener.off();
    roomListener = null;
  }
  
  // Stop heartbeat and reconnect UI
  stopPresenceHeartbeat();
  hideReconnectOverlay();

  if (state.firebase.onlineActive && window.isFirebaseConfigured && window.firebaseDb) {
    const roomName = state.settings.roomCode;
    const seatIndex = state.firebase.seatIndex;
    if (state.firebase.isHost) {
      window.firebaseDb.ref(`rooms/${roomName}`).remove();
    } else if (seatIndex !== -1) {
      window.firebaseDb.ref(`rooms/${roomName}/seats/${seatIndex}`).remove();
    }
  }
  
  // Clear reconnect data
  localStorage.removeItem(RECONNECT_ROOM_KEY);
  localStorage.removeItem(RECONNECT_SEAT_KEY);
  localStorage.removeItem(RECONNECT_HOST_KEY);

  state.firebase.onlineActive = false;
  state.firebase.isHost = false;
  state.firebase.seatIndex = -1;
  onlineLobbyOverlay.hidden = true;
  
  setMode("classic");
  addFeed("Returned to offline local menu.");
}

function loadFriendsList() {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  window.firebaseFirestore.collection("users").doc(currentUser.uid)
    .collection("friends")
    .onSnapshot((snapshot) => {
      friendList.innerHTML = "";
      
      if (snapshot.empty) {
        friendList.innerHTML = `<li style="justify-content:center; color:#a0aec0;">No friends added yet</li>`;
        onlineFriends.textContent = "0 online";
        return;
      }
      
      snapshot.forEach((doc) => {
        const friend = doc.data();
        const friendUid = doc.id;
        
        window.firebaseFirestore.collection("users").doc(friendUid)
          .onSnapshot((userDoc) => {
            const userData = userDoc.data();
            const isOnline = userData && userData.status === "online";
            const friendName = (userData && userData.name) || friend.name || "A friend";

            // ── Friend online alert ────────────────────────────────────────────
            const prevStatus = friendStatusCache.get(friendUid);
            const newStatus = isOnline ? "online" : "offline";
            if (prevStatus !== undefined && prevStatus === "offline" && newStatus === "online") {
              showToastNotification(`${friendName} is now online! 👋`, "success");
            }
            friendStatusCache.set(friendUid, newStatus);
            // ──────────────────────────────────────────────────────────────────
            
            let item = document.getElementById(`friend-${friendUid}`);
            if (!item) {
              item = document.createElement("li");
              item.id = `friend-${friendUid}`;
              friendList.append(item);
            }
            
            const eloVal = userData ? (userData.elo || 1200) : (friend.elo || 1200);
            const badge = getEloTier(eloVal);
            item.innerHTML = `
              <strong>
                <span class="friend-status-dot ${isOnline ? 'online' : 'offline'}"></span>
                <strong>${friendName}</strong>
                <small class="${badge.class}" style="margin-left:4px;">${badge.badge} ${eloVal}</small>
              </strong>
              <div style="display:flex; align-items:center;">
                ${isOnline ? `<button class="mini-button friend-invite-btn" data-uid="${friendUid}" type="button">Invite</button>` : ""}
                <button class="mini-button friend-remove-btn" data-uid="${friendUid}" style="background:#e03345; margin-left:4px;" type="button">Remove</button>
              </div>
            `;
            
            const dots = friendList.querySelectorAll(".friend-status-dot.online");
            onlineFriends.textContent = `${dots.length} online`;
          });
      });
    });
}

function listenForFriendRequests() {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  window.firebaseFirestore.collection("users").doc(currentUser.uid)
    .collection("friendRequests")
    .onSnapshot((snapshot) => {
      friendRequestsList.innerHTML = "";
      
      if (snapshot.empty) {
        friendRequestsList.innerHTML = `<li style="justify-content:center; color:#a0aec0; font-size:0.85rem;">No pending requests</li>`;
        return;
      }
      
      snapshot.forEach((doc) => {
        const req = doc.data();
        const reqUid = doc.id;
        
        const item = document.createElement("li");
        item.style.flexDirection = "column";
        item.style.alignItems = "stretch";
        item.style.gap = "6px";
        
        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>${req.name || "Royal Player"}</strong>
              <small style="display:block; color:#a0aec0; font-size:0.75rem;">${req.email || ""}</small>
            </div>
            <span style="font-size:0.85rem; color:#ffc837;">🏆 ${req.elo || 1200}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="mini-button friend-request-accept-btn" data-uid="${reqUid}" data-name="${req.name || ''}" data-email="${req.email || ''}" data-elo="${req.elo || 1200}" style="flex:1; padding:4px;" type="button">Accept</button>
            <button class="mini-button friend-request-decline-btn" data-uid="${reqUid}" style="flex:1; padding:4px; background:#e03345;" type="button">Decline</button>
          </div>
        `;
        friendRequestsList.append(item);
      });
    });
}

function sendFriendRequest(email) {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  friendErrorMsg.hidden = true;
  
  window.firebaseFirestore.collection("users")
    .where("email", "==", email)
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        showFriendError("Player not found with this email.");
        return;
      }
      
      const friendDoc = querySnapshot.docs[0];
      const friendData = friendDoc.data();
      const friendUid = friendDoc.id;
      
      if (friendUid === currentUser.uid) {
        showFriendError("You cannot add yourself.");
        return;
      }
      
      window.firebaseFirestore.collection("users").doc(currentUser.uid)
        .collection("friends").doc(friendUid).get().then((fDoc) => {
          if (fDoc.exists) {
            showFriendError("Already friends with this player.");
            return;
          }
          
          window.firebaseFirestore.collection("users").doc(friendUid)
            .collection("friendRequests").doc(currentUser.uid).set({
              name: state.profile.name,
              email: currentUser.email || `${currentUser.uid.slice(0, 8)}@guest.com`,
              elo: state.profile.elo || 1200,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              addFeed("Friend request sent!");
              friendEmailInput.value = "";
            });
        });
    })
    .catch((err) => {
      showFriendError("Error: " + err.message);
    });
}

function showFriendError(text) {
  friendErrorMsg.textContent = text;
  friendErrorMsg.hidden = false;
  window.setTimeout(() => {
    friendErrorMsg.hidden = true;
  }, 4000);
}

function acceptFriendRequest(requestUid, requestData) {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  const myUid = currentUser.uid;
  const userRef = window.firebaseFirestore.collection("users");
  
  userRef.doc(myUid).collection("friendRequests").doc(requestUid).delete()
    .then(() => {
      return userRef.doc(myUid).collection("friends").doc(requestUid).set({
        name: requestData.name || "Royal Player",
        email: requestData.email || "",
        elo: requestData.elo || 1200,
        addedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      return userRef.doc(requestUid).collection("friends").doc(myUid).set({
        name: state.profile.name,
        email: currentUser.email || `${myUid.slice(0, 8)}@guest.com`,
        elo: state.profile.elo || 1200,
        addedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      addFeed("Friend request accepted!");
    })
    .catch((err) => {
      console.error("Error accepting request:", err);
    });
}

function declineFriendRequest(requestUid) {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  window.firebaseFirestore.collection("users").doc(currentUser.uid)
    .collection("friendRequests").doc(requestUid).delete()
    .then(() => {
      addFeed("Friend request declined.");
    });
}

function removeFriend(friendUid) {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  const myUid = currentUser.uid;
  const userRef = window.firebaseFirestore.collection("users");
  
  userRef.doc(myUid).collection("friends").doc(friendUid).delete()
    .then(() => {
      return userRef.doc(friendUid).collection("friends").doc(myUid).delete();
    })
    .then(() => {
      addFeed("Friend removed.");
    })
    .catch((err) => {
      console.error("Error removing friend:", err);
    });
}

function inviteOnlineFriend(friendUid) {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  const roomName = state.settings.roomCode;
  window.firebaseFirestore.collection("users").doc(friendUid)
    .collection("invites").doc(roomName).set({
      hostName: state.profile.name,
      roomCode: roomName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      addFeed("Room invitation sent to friend.");
    });
}

// Presence invite listener
function listenForInvites() {
  if (!window.isFirebaseConfigured || !window.firebaseFirestore || !currentUser) return;
  
  window.firebaseFirestore.collection("users").doc(currentUser.uid)
    .collection("invites")
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const invite = change.doc.data();
          showInviteAlert(invite.hostName, invite.roomCode, change.doc.id);
        }
      });
    });
}

function showInviteAlert(hostName, roomCode, docId) {
  const popup = document.createElement("div");
  popup.className = "invite-alert-popup";
  popup.innerHTML = `
    <span>Join <strong>${hostName}</strong> in <strong>${roomCode}</strong>?</span>
    <div class="invite-alert-actions">
      <button class="mini-button accept-btn" type="button">Accept</button>
      <button class="mini-button decline-btn" style="background:#e03345;" type="button">Decline</button>
    </div>
  `;
  document.body.append(popup);
  
  popup.querySelector(".accept-btn").addEventListener("click", () => {
    joinOnlineRoom(roomCode);
    popup.remove();
    window.firebaseFirestore.collection("users").doc(currentUser.uid)
      .collection("invites").doc(docId).delete();
  });
  
  popup.querySelector(".decline-btn").addEventListener("click", () => {
    popup.remove();
    window.firebaseFirestore.collection("users").doc(currentUser.uid)
      .collection("invites").doc(docId).delete();
  });
  
  window.setTimeout(() => popup.remove(), 15000);
}

function joinMatchmakingQueue() {
  if (!window.isFirebaseConfigured || !window.firebaseDb || !currentUser) {
    addFeed("Offline mode: matchmaking is not available.");
    return;
  }

  state.settings.mode = "random";
  updateModeButtons();
  showMatchmakingSearchingUI();
  
  const myUid = currentUser.uid;
  const queueRef = window.firebaseDb.ref(`matchmakingQueue/${myUid}`);
  
  const queueData = {
    uid: myUid,
    name: state.profile.name,
    avatar: state.profile.avatar,
    elo: state.profile.elo || 1200,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  };
  
  queueRef.set(queueData).then(() => {
    addFeed("Searching for a random match...");
    
    const allQueueRef = window.firebaseDb.ref("matchmakingQueue");
    matchmakingListener = allQueueRef;
    
    allQueueRef.on('value', (snapshot) => {
      if (!snapshot.exists()) return;
      
      const queueVal = snapshot.val();
      
      if (queueVal[myUid] && queueVal[myUid].matchRoomCode) {
        const roomCode = queueVal[myUid].matchRoomCode;
        queueRef.remove();
        allQueueRef.off();
        matchmakingListener = null;
        hideMatchmakingSearchingUI();
        
        addFeed(`Match found! Joining room ${roomCode}`);
        joinOnlineRoom(roomCode);
        return;
      }
      
      const players = Object.keys(queueVal).map(key => ({
        uid: key,
        ...queueVal[key]
      })).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      
      updateMatchmakingSearchingUI(players.length);
      
      if (players.length >= 4 && players[0].uid === myUid) {
        const group = players.slice(0, 4);
        const code = Math.random().toString(36).slice(2, 6).toUpperCase();
        const roomName = `ROOM-${code}`;
        const roomRef = window.firebaseDb.ref(`rooms/${roomName}`);
        
        const seats = {};
        group.forEach((p, idx) => {
          seats[idx] = {
            uid: p.uid,
            name: p.name,
            avatar: p.avatar,
            elo: p.elo || 1200,
            present: true,
            ready: true
          };
        });
        
        const initialRoom = {
          host: myUid,
          status: "playing",
          playerCount: 4,
          seats: seats,
          gameState: {
            current: 0,
            dice: 1,
            rolled: false,
            winner: null,
            gameOver: null,
            flow: "moving",
            lastMovedKey: null,
            activePower: null,
            targetSteps: 3,
            players: group.map((p, idx) => ({
              id: PLAYERS[idx].id,
              name: p.name,
              avatar: p.avatar,
              elo: p.elo || 1200,
              isBot: false,
              tokens: Array.from({ length: 4 }, (_, i) => ({ id: `${PLAYERS[idx].id}-${i}`, progress: -1, shielded: false }))
            }))
          }
        };
        
        roomRef.set(initialRoom).then(() => {
          const updates = {};
          group.forEach((p) => {
            updates[`${p.uid}/matchRoomCode`] = roomName;
          });
          allQueueRef.update(updates);
        });
      }
    });
  });
}

function leaveMatchmakingQueue() {
  if (matchmakingListener) {
    matchmakingListener.off();
    matchmakingListener = null;
  }
  if (window.firebaseDb && currentUser) {
    window.firebaseDb.ref(`matchmakingQueue/${currentUser.uid}`).remove();
  }
  hideMatchmakingSearchingUI();
  state.settings.mode = "classic";
  setMode("classic");
  addFeed("Matchmaking search cancelled.");
}

function showMatchmakingSearchingUI() {
  let card = document.getElementById("matchmakingCard");
  if (!card) {
    card = document.createElement("div");
    card.id = "matchmakingCard";
    card.className = "matchmaking-searching-card";
    const playPanel = document.querySelector('[data-tab-panel="play"]');
    if (playPanel) {
      playPanel.append(card);
    }
  }
  card.style.display = "block";
  updateMatchmakingSearchingUI(1);
}

function updateMatchmakingSearchingUI(count) {
  const card = document.getElementById("matchmakingCard");
  if (card) {
    card.innerHTML = `
      <div class="matchmaking-loader"></div>
      <div><strong>Searching for players...</strong></div>
      <div style="margin: 8px 0; color: #a0aec0; font-size: 0.9rem;">Players in queue: ${count}/4</div>
      <button id="cancelMatchmakingBtn" class="mini-button" style="background:#e03345; margin-top:5px;" type="button">Cancel</button>
    `;
    const btn = card.querySelector("#cancelMatchmakingBtn");
    if (btn) {
      btn.addEventListener("click", leaveMatchmakingQueue);
    }
  }
}

function hideMatchmakingSearchingUI() {
  const card = document.getElementById("matchmakingCard");
  if (card) {
    card.style.display = "none";
  }
}

// Add event listeners and run startup config
document.addEventListener("click", (event) => {
  if (event.target.closest("button")) playSfx("button");
});

diceButton.addEventListener("click", handleDice);
newGameButton.addEventListener("click", () => newGame());
roomButton.addEventListener("click", () => {
  if (state.settings.mode === "friends") {
    createOnlineRoom();
  } else {
    generateRoomCode();
  }
});
saveGameButton.addEventListener("click", saveGame);
loadGameButton.addEventListener("click", loadGame);
powerDiceButton.addEventListener("click", activatePowerDice);
replayButton.addEventListener("click", replayLastMatch);
gameOverReplayButton.addEventListener("click", replayLastMatch);
gameOverNewButton.addEventListener("click", () => newGame());
antiCheatButton.addEventListener("click", scanMatch);
dailyRewardButton.addEventListener("click", claimDailyReward);
spinWheelButton.addEventListener("click", spinWheel);
chatButton.addEventListener("click", () => sendChat(chatInput.value));
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendChat(chatInput.value);
});

playerNameInput.addEventListener("input", () => {
  state.profile.name = playerNameInput.value.trim() || "Royal Player";
  renderProfile();
  persistProgress();
  saveProfile();
  if (state.firebase.onlineActive && state.firebase.seatIndex !== -1 && window.firebaseDb) {
    const roomName = state.settings.roomCode;
    window.firebaseDb.ref(`rooms/${roomName}/seats/${state.firebase.seatIndex}`).update({
      name: state.profile.name
    });
  }
});

avatarSelect.addEventListener("change", () => {
  state.profile.avatar = avatarSelect.value;
  renderProfile();
  persistProgress();
  saveProfile();
  if (state.firebase.onlineActive && state.firebase.seatIndex !== -1 && window.firebaseDb) {
    const roomName = state.settings.roomCode;
    window.firebaseDb.ref(`rooms/${roomName}/seats/${state.firebase.seatIndex}`).update({
      avatar: state.profile.avatar
    });
  }
});

friendList.addEventListener("click", (event) => {
  const inviteBtn = event.target.closest(".friend-invite-btn");
  if (inviteBtn) {
    inviteOnlineFriend(inviteBtn.dataset.uid);
    return;
  }
  const removeBtn = event.target.closest(".friend-remove-btn");
  if (removeBtn) {
    if (confirm("Are you sure you want to remove this friend?")) {
      removeFriend(removeBtn.dataset.uid);
    }
  }
});

friendRequestsList.addEventListener("click", (event) => {
  const acceptBtn = event.target.closest(".friend-request-accept-btn");
  if (acceptBtn) {
    const requestUid = acceptBtn.dataset.uid;
    const name = acceptBtn.dataset.name;
    const email = acceptBtn.dataset.email;
    const elo = Number(acceptBtn.dataset.elo || 1200);
    acceptFriendRequest(requestUid, { name, email, elo });
    return;
  }
  const declineBtn = event.target.closest(".friend-request-decline-btn");
  if (declineBtn) {
    declineFriendRequest(declineBtn.dataset.uid);
  }
});

bpRewardsList.addEventListener("click", (event) => {
  const claimBtn = event.target.closest(".bp-claim-btn:not([disabled])");
  if (claimBtn) {
    const tier = Number(claimBtn.dataset.tier);
    const track = claimBtn.dataset.track;
    claimBattlePassReward(tier, track);
  }
});

buyPremiumPassBtn.addEventListener("click", buyPremiumPass);

addFriendButton.addEventListener("click", () => {
  const email = friendEmailInput.value.trim();
  if (email) {
    sendFriendRequest(email);
  }
});

inviteButton.addEventListener("click", () => {
  const code = inviteCodeInput.value.trim();
  if (code.startsWith("ROOM-")) {
    joinOnlineRoom(code);
    inviteCodeInput.value = "";
  } else {
    inviteByCode();
  }
});

shopList.addEventListener("click", (event) => {
  const button = event.target.closest(".shop-action");
  if (!button) return;
  handleShop(button.dataset.shop);
});

soundToggle.addEventListener("change", () => {
  state.settings.sound = soundToggle.checked;
  addFeed(`Sound ${state.settings.sound ? "enabled" : "muted"}.`);
  persistProgress();
});

voiceToggle.addEventListener("change", () => {
  state.settings.voice = voiceToggle.checked;
  addFeed(`Voice chat ${state.settings.voice ? "ready for friends mode backend connection" : "closed"}.`);
  persistProgress();
});

fastRuleToggle.addEventListener("change", () => {
  state.settings.fastLudo = fastRuleToggle.checked;
  addFeed(`Fast Ludo ${state.settings.fastLudo ? "enabled" : "disabled"}.`);
  persistProgress();
  render();
});

board3dToggle.addEventListener("change", () => {
  state.settings.board3d = board3dToggle.checked;
  addFeed(`3D board ${state.settings.board3d ? "enabled" : "disabled"}.`);
  persistProgress();
  render();
});

targetStepSelect.addEventListener("change", () => {
  state.targetSteps = Number(targetStepSelect.value);
  persistProgress();
});

powerButtons.forEach((button) => {
  button.addEventListener("click", () => activatePower(button.dataset.power));
});

skillCardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.settings.skillBuild = button.dataset.skillBuild;
    state.matchPowers = skillBuildPowers(state.settings.skillBuild);
    addFeed(`${SKILL_BUILDS[state.settings.skillBuild].label} skill cards equipped for this match.`);
    setStatus(`${SKILL_BUILDS[state.settings.skillBuild].label} build selected.`);
    playSfx("power");
    persistProgress();
    render();
  });
});

homeActions.forEach((button) => {
  button.addEventListener("click", () => handleHomeAction(button.dataset.homeAction));
});

difficultySelect.addEventListener("change", () => {
  state.settings.difficulty = difficultySelect.value;
  addFeed(`AI level set to ${difficultySelect.options[difficultySelect.selectedIndex].text}.`);
  persistProgress();
});

countButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (state.settings.mode === "team" || state.settings.mode === "tournament" || state.settings.mode === "random" || state.settings.mode === "story") {
      setStatus(`${MODE_LABELS[state.settings.mode]} uses 4 players.`);
      return;
    }
    newGame(Number(button.dataset.count));
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    updateThemeButtons();
    addFeed(`${THEME_LABELS[button.dataset.theme]} theme equipped.`);
    persistProgress();
  });
});

emojiButtons.forEach((button) => {
  button.addEventListener("click", () => sendChat(button.dataset.emoji));
});

panelTabs.forEach((button) => {
  button.addEventListener("click", () => setUiTab(button.dataset.uiTab));
});

lobbyStartButton.addEventListener("click", () => {
  if (!state.firebase.isHost || !state.firebase.onlineActive) return;
  const roomName = state.settings.roomCode;
  const roomRef = window.firebaseDb.ref(`rooms/${roomName}`);
  
  const playersData = state.players.map(() => ({
    tokens: Array.from({ length: 4 }, () => ({ progress: -1, shielded: false }))
  }));
  
  const initialGameState = {
    current: 0,
    dice: 1,
    rolled: false,
    winner: null,
    gameOver: null,
    flow: "lobby",
    lastMovedKey: null,
    activePower: null,
    targetSteps: 3,
    players: playersData
  };
  
  roomRef.update({
    status: "playing",
    gameState: initialGameState
  }).then(() => {
    addFeed("Match started!");
  });
});

lobbyReadyButton.addEventListener("click", () => {
  if (state.firebase.isHost || !state.firebase.onlineActive) return;
  const roomName = state.settings.roomCode;
  const seatIndex = state.firebase.seatIndex;
  
  const readyRef = window.firebaseDb.ref(`rooms/${roomName}/seats/${seatIndex}/ready`);
  readyRef.transaction((currentVal) => {
    return !currentVal;
  });
});

lobbyLeaveButton.addEventListener("click", leaveOnlineRoom);

loadProgress();
buildBoard();
if (state.settings.roomCode === "ROOM-0000") generateRoomCode();
initFirebaseAuth();
newGame(state.playerCount);

// ═══════════════════════════════════════════════════════════════════════════
// PWA Install Prompt
// ═══════════════════════════════════════════════════════════════════════════
(function initPwaInstallPrompt() {
  const banner = document.getElementById("pwa-install-banner");
  const installBtn = document.getElementById("pwaInstallBtn");
  const dismissBtn = document.getElementById("pwaDismissBtn");

  if (!banner || !installBtn || !dismissBtn) return;

  // Don't show if user already dismissed or app is already installed
  const dismissed = sessionStorage.getItem("pwa-install-dismissed");
  if (dismissed) return;

  // Don't show if already running in standalone (installed) mode
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
                       window.navigator.standalone === true;
  if (isStandalone) return;

  let deferredPrompt = null;

  // Chrome / Edge / Android: intercept the browser's native install event
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // Stop the mini-infobar from appearing
    deferredPrompt = event;

    // Show our custom banner with a short delay
    window.setTimeout(() => {
      banner.hidden = false;
    }, 3000);
  });

  // Install button clicked — trigger the native browser install dialog
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
      // Safari / iOS: show manual instruction toast
      showToastNotification(
        "To install: tap the Share button then <strong>Add to Home Screen</strong> 📲",
        "info",
        8000
      );
      banner.hidden = true;
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      showToastNotification("Royal Ludo installed! 🎉 Find it on your home screen.", "success", 5000);
    }
    deferredPrompt = null;
    banner.hidden = true;
  });

  // Dismiss button
  dismissBtn.addEventListener("click", () => {
    banner.hidden = true;
    sessionStorage.setItem("pwa-install-dismissed", "1");
  });

  // On iOS Safari, show a manual instruction after a delay (no beforeinstallprompt)
  const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const isSafari = /safari/.test(navigator.userAgent.toLowerCase()) &&
                   !/chrome|crios|fxios/.test(navigator.userAgent.toLowerCase());
  if (isIos && isSafari && !isStandalone && !dismissed) {
    window.setTimeout(() => {
      banner.hidden = false;
      // Override button to show iOS instructions
      installBtn.textContent = "How to install";
      installBtn.addEventListener("click", () => {
        showToastNotification(
          "Tap the Safari Share icon (⬆️) then choose <strong>Add to Home Screen</strong>",
          "info",
          10000
        );
        banner.hidden = true;
      }, { once: true });
    }, 4000);
  }

  // App successfully installed event
  window.addEventListener("appinstalled", () => {
    banner.hidden = true;
    showToastNotification("Royal Ludo is now on your home screen! 🎉", "success", 6000);
    deferredPrompt = null;
  });
})();
