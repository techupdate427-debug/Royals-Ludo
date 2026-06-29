// firebase-setup-ui.js — Royal Ludo
// Clean, user-friendly first-time setup wizard.

(function initFirebaseSetupWizard() {
  "use strict";
  if (window.hasRealFirebaseConfig) return;

  // ── Inject CSS ────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #fsu-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: flex-end; justify-content: center;
      padding: 0 0 24px;
      background: rgba(5, 8, 18, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    #fsu-sheet {
      width: min(440px, 96%);
      background: #13192b;
      border: 1px solid rgba(244,203,69,0.18);
      border-radius: 24px;
      overflow: hidden;
      animation: fsu-slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
      box-shadow: 0 -8px 60px rgba(0,0,0,0.5);
    }
    @keyframes fsu-slide-up {
      from { opacity:0; transform:translateY(40px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* Progress dots */
    #fsu-dots {
      display: flex; justify-content: center; gap: 6px;
      padding: 20px 0 0;
    }
    .fsu-dot {
      width: 6px; height: 6px; border-radius: 99px;
      background: rgba(255,255,255,0.15);
      transition: all 0.3s ease;
    }
    .fsu-dot.active {
      width: 20px; background: #f4cb45;
    }

    /* Step content */
    #fsu-content {
      padding: 20px 28px 0;
      text-align: center;
      min-height: 200px;
    }
    #fsu-emoji {
      font-size: 3.2rem;
      display: block;
      margin-bottom: 14px;
      animation: fsu-pop 0.35s ease;
    }
    @keyframes fsu-pop {
      0%   { transform: scale(0.7); opacity:0; }
      70%  { transform: scale(1.1); }
      100% { transform: scale(1);   opacity:1; }
    }
    #fsu-title {
      font-size: 1.35rem; font-weight: 900;
      color: #ffffff; margin: 0 0 10px;
      font-family: Inter, sans-serif;
    }
    #fsu-desc {
      font-size: 0.92rem; color: #8892a4;
      line-height: 1.65; margin: 0;
      font-family: Inter, sans-serif;
    }
    #fsu-desc strong { color: #c8d3e8; font-weight: 700; }
    #fsu-desc .fsu-check {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; padding: 10px 14px;
      margin: 8px 0; text-align: left;
      font-size: 0.88rem; color: #a8b3c8;
    }
    #fsu-desc .fsu-check .fsu-ck-icon {
      font-size: 1.1rem; flex-shrink: 0;
    }
    #fsu-desc .fsu-tag {
      display: inline-block;
      background: rgba(244,203,69,0.12);
      color: #f4cb45; border-radius: 5px;
      padding: 1px 7px; font-size: 0.8rem;
      font-weight: 700; font-family: monospace;
    }

    /* Config textarea */
    #fsu-config-wrap { margin-top: 14px; text-align: left; }
    #fsu-config-input {
      width: 100%; box-sizing: border-box;
      height: 150px; resize: none;
      background: rgba(0,0,0,0.35);
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #d1dce8; font-family: 'Courier New', monospace;
      font-size: 0.78rem; line-height: 1.6;
      padding: 12px 14px; outline: none;
      transition: border-color 0.25s;
    }
    #fsu-config-input:focus {
      border-color: rgba(244,203,69,0.5);
    }
    #fsu-config-input::placeholder { color: #3d4a5e; }
    #fsu-error {
      margin-top: 8px; padding: 9px 13px;
      background: rgba(220,50,60,0.12);
      border: 1px solid rgba(220,50,60,0.3);
      border-radius: 8px; color: #fc8181;
      font-size: 0.82rem; line-height: 1.5;
      display: none;
    }

    /* Buttons */
    #fsu-actions {
      padding: 18px 28px 10px;
      display: flex; flex-direction: column; gap: 8px;
    }
    #fsu-primary-btn {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #f4cb45, #e9a825);
      color: #0e1220; font-weight: 900; font-size: 1rem;
      border: none; border-radius: 12px; cursor: pointer;
      font-family: Inter, sans-serif;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    #fsu-primary-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(244,203,69,0.35);
    }
    #fsu-primary-btn:active { transform: scale(0.98); }
    #fsu-primary-btn:disabled {
      opacity: 0.6; cursor: not-allowed; transform: none;
    }
    #fsu-secondary-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 2px 4px;
    }
    #fsu-back-btn {
      background: none; border: none; cursor: pointer;
      color: #4a5568; font-size: 0.85rem;
      font-family: Inter, sans-serif;
      padding: 6px 0;
      display: flex; align-items: center; gap: 5px;
    }
    #fsu-back-btn:hover { color: #718096; }
    #fsu-skip-btn {
      background: none; border: none; cursor: pointer;
      color: #4a5568; font-size: 0.82rem;
      font-family: Inter, sans-serif;
      padding: 6px 0;
      transition: color 0.2s;
    }
    #fsu-skip-btn:hover { color: #718096; }

    /* Firebase link */
    #fsu-firebase-link {
      display: block; text-align: center;
      color: #f4cb45; font-size: 0.82rem;
      font-weight: 700; text-decoration: none;
      font-family: Inter, sans-serif;
      padding: 8px 0 0;
      transition: opacity 0.2s;
    }
    #fsu-firebase-link:hover { opacity: 0.75; }

    #fsu-divider {
      height: 1px; background: rgba(255,255,255,0.05);
      margin: 4px 28px 0;
    }
  `;
  document.head.appendChild(style);

  // ── Steps config ──────────────────────────────────────────────────────────
  const STEPS = [
    {
      emoji: "👋",
      title: "Welcome to Royal Ludo!",
      desc: `To unlock <strong>online play, cloud saves, and login</strong>, connect a free Firebase account.<br><br>It takes about 2 minutes. You can also skip and play offline now.`,
      primaryBtn: "Let's Set It Up →",
      showFirebaseLink: true,
      showBack: false,
    },
    {
      emoji: "🔥",
      title: "Create a Firebase Project",
      desc: `
        <div class="fsu-check"><span class="fsu-ck-icon">1️⃣</span> Go to <strong>console.firebase.google.com</strong></div>
        <div class="fsu-check"><span class="fsu-ck-icon">2️⃣</span> Click <strong>"Add project"</strong></div>
        <div class="fsu-check"><span class="fsu-ck-icon">3️⃣</span> Name it <strong>Royal Ludo</strong> → click <strong>Create</strong></div>
      `,
      primaryBtn: "Done, Next →",
      showFirebaseLink: true,
      showBack: true,
    },
    {
      emoji: "⚙️",
      title: "Turn On 3 Services",
      desc: `
        <div class="fsu-check"><span class="fsu-ck-icon">🔐</span> <div><strong>Authentication</strong><br><span style="font-size:0.82rem">Enable Email/Password</span></div></div>
        <div class="fsu-check"><span class="fsu-ck-icon">💾</span> <div><strong>Firestore Database</strong><br><span style="font-size:0.82rem">Create → Test mode</span></div></div>
        <div class="fsu-check"><span class="fsu-ck-icon">⚡</span> <div><strong>Realtime Database</strong><br><span style="font-size:0.82rem">Create → Test mode</span></div></div>
      `,
      primaryBtn: "All Done, Next →",
      showFirebaseLink: true,
      showBack: true,
    },
    {
      emoji: "🔑",
      title: "Copy Your Config",
      desc: `
        <div class="fsu-check"><span class="fsu-ck-icon">⚙️</span> Click the <strong>gear icon</strong> → Project Settings</div>
        <div class="fsu-check"><span class="fsu-ck-icon">📱</span> Scroll to <strong>"Your apps"</strong> → Add Web app <span class="fsu-tag">&lt;/&gt;</span></div>
        <div class="fsu-check"><span class="fsu-ck-icon">📋</span> <strong>Copy</strong> the <span class="fsu-tag">firebaseConfig</span> block</div>
      `,
      primaryBtn: "Copied It, Next →",
      showFirebaseLink: true,
      showBack: true,
    },
    {
      emoji: "📋",
      title: "Paste & Connect",
      desc: `Paste the config you copied from Firebase:`,
      isInput: true,
      primaryBtn: "Connect Now 🚀",
      showFirebaseLink: false,
      showBack: true,
    },
  ];

  let step = 0;

  // ── Build DOM ─────────────────────────────────────────────────────────────
  const overlay = document.createElement("div");
  overlay.id = "fsu-overlay";
  overlay.innerHTML = `
    <div id="fsu-sheet">
      <div id="fsu-dots"></div>
      <div id="fsu-content">
        <span id="fsu-emoji"></span>
        <h2 id="fsu-title"></h2>
        <p id="fsu-desc"></p>
        <div id="fsu-config-wrap" style="display:none">
          <textarea id="fsu-config-input" placeholder='{&#10;  "apiKey": "AIzaSy...",&#10;  "authDomain": "royal-ludo.firebaseapp.com",&#10;  "databaseURL": "https://royal-ludo-rtdb.firebaseio.com",&#10;  "projectId": "royal-ludo",&#10;  "storageBucket": "royal-ludo.appspot.com",&#10;  "messagingSenderId": "123456",&#10;  "appId": "1:123:web:abc"&#10;}'></textarea>
          <div id="fsu-error"></div>
        </div>
      </div>
      <div id="fsu-actions">
        <button id="fsu-primary-btn"></button>
        <div id="fsu-secondary-row">
          <button id="fsu-back-btn">← Back</button>
          <button id="fsu-skip-btn">Skip — play offline</button>
        </div>
        <div id="fsu-divider"></div>
        <a id="fsu-firebase-link" href="https://console.firebase.google.com" target="_blank" rel="noopener">Open Firebase Console ↗</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Render ────────────────────────────────────────────────────────────────
  const dotsEl      = document.getElementById("fsu-dots");
  const emojiEl     = document.getElementById("fsu-emoji");
  const titleEl     = document.getElementById("fsu-title");
  const descEl      = document.getElementById("fsu-desc");
  const configWrap  = document.getElementById("fsu-config-wrap");
  const configInput = document.getElementById("fsu-config-input");
  const errorEl     = document.getElementById("fsu-error");
  const primaryBtn  = document.getElementById("fsu-primary-btn");
  const backBtn     = document.getElementById("fsu-back-btn");
  const skipBtn     = document.getElementById("fsu-skip-btn");
  const firebaseLink = document.getElementById("fsu-firebase-link");

  // Build dots
  STEPS.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "fsu-dot";
    d.dataset.i = i;
    dotsEl.appendChild(d);
  });

  function render(idx) {
    const s = STEPS[idx];

    // Dots
    dotsEl.querySelectorAll(".fsu-dot").forEach((d, i) => {
      d.classList.toggle("active", i === idx);
    });

    // Animate emoji change
    emojiEl.style.animation = "none";
    emojiEl.offsetHeight; // reflow
    emojiEl.style.animation = "";
    emojiEl.textContent = s.emoji;

    titleEl.textContent = s.title;
    descEl.innerHTML    = s.desc;
    primaryBtn.textContent = s.primaryBtn;
    backBtn.style.visibility = s.showBack ? "visible" : "hidden";
    firebaseLink.style.display = s.showFirebaseLink ? "block" : "none";
    configWrap.style.display = s.isInput ? "block" : "none";
    errorEl.style.display = "none";
    errorEl.textContent = "";
    primaryBtn.disabled = false;
  }

  render(0);

  // ── Events ────────────────────────────────────────────────────────────────
  primaryBtn.addEventListener("click", () => {
    const s = STEPS[step];

    if (s.isInput) {
      const raw = configInput.value.trim();
      if (!raw) {
        errorEl.textContent = "Please paste your Firebase config first.";
        errorEl.style.display = "block";
        return;
      }
      let cfg;
      try {
        let text = raw.replace(/^.*?(?:firebaseConfig|const\s+\w+)\s*=\s*/i, "")
                      .replace(/;?\s*$/, "")
                      .replace(/(['\"])?([a-zA-Z0-9_]+)(['\"])?:/g, '"$2":');
        cfg = JSON.parse(text);
      } catch (e) {
        errorEl.textContent = "⚠️ Could not read config. Make sure you copy the full { ... } block from Firebase.";
        errorEl.style.display = "block";
        return;
      }
      const required = ["apiKey","authDomain","projectId","storageBucket","messagingSenderId","appId"];
      const missing = required.find(k => !cfg[k] || cfg[k].includes("YOUR_"));
      if (missing) {
        errorEl.textContent = `⚠️ "${missing}" is missing or still a placeholder.`;
        errorEl.style.display = "block";
        return;
      }
      localStorage.setItem(window.FIREBASE_CREDS_KEY || "royalLudoFirebaseConfig", JSON.stringify(cfg));
      primaryBtn.textContent = "Connecting… ⏳";
      primaryBtn.disabled = true;
      setTimeout(() => window.location.reload(), 700);
      return;
    }

    step = Math.min(step + 1, STEPS.length - 1);
    render(step);
  });

  backBtn.addEventListener("click", () => {
    step = Math.max(step - 1, 0);
    render(step);
  });

  function goOffline() {
    overlay.style.display = "none";
    if (typeof showToastNotification === "function") {
      showToastNotification("Playing offline. You can connect Firebase anytime from Settings.", "info", 5000);
    }
  }

  skipBtn.addEventListener("click", goOffline);
})();
