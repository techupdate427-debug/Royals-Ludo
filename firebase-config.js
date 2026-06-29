// ═══════════════════════════════════════════════════════════════════════════
// firebase-config.js  —  Royal Ludo
// ═══════════════════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyATWN37Np3uWz7KQB4uR0XkxqUwfbo0IlY",
  authDomain:        "royal-ludo-b8c3f.firebaseapp.com",
  databaseURL:       "https://royal-ludo-b8c3f-default-rtdb.firebaseio.com",
  projectId:         "royal-ludo-b8c3f",
  storageBucket:     "royal-ludo-b8c3f.firebasestorage.app",
  messagingSenderId: "720344809234",
  appId:             "1:720344809234:web:9fddd9c1fac41dd0b47dcb"
};

// ── Check if developer has filled in real credentials ─────────────────────
const hasRealCredentials = (
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith("YOUR_") &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.startsWith("YOUR_")
);

// ── Initialize Firebase ────────────────────────────────────────────────────
let db               = null;
let auth             = null;
let firestore        = null;
let isFirebaseConfigured = false;

if (typeof firebase !== "undefined" && hasRealCredentials) {
  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    db               = firebase.database();
    auth             = firebase.auth();
    firestore        = firebase.firestore();
    isFirebaseConfigured = true;
    console.log("[Firebase] ✅ Connected. Project:", firebaseConfig.projectId);
  } catch (error) {
    console.error("[Firebase] Init error:", error);
    isFirebaseConfigured = false;
  }
} else {
  console.info("[Firebase] Running in offline mode — no credentials configured.");
  isFirebaseConfigured = false;
}

// ── Export globals used throughout the game ────────────────────────────────
window.firebaseDb            = db;
window.firebaseAuth          = auth;
window.firebaseFirestore     = firestore;
window.isFirebaseConfigured  = isFirebaseConfigured;
window.hasRealFirebaseConfig = hasRealCredentials;
