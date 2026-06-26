# The Stellarium App

Welcome to **The Stellarium App**, the digital gateway to the **Stellarium Foundation** and the **Stellarium Society**. This application is the living embodiment of our foundational ethos:

> **Do Good, Make Money, Have Fun.**

Designed by John Victor, this platform serves as a hub for members, prospective governors, and the global community to engage with our vision, access our library of wisdom, and participate in the greatest endeavor of our time: the **Elevation to Eden**.

---

## 🌟 The Vision: Elevation to Eden
We stand at a critical juncture in human history. With the advent of advanced Artificial Intelligence and Robotics, humanity is poised to enter a post-scarcity society—an abundance society where drudgery is automated, and human potential is unleashed. 

The Stellarium Foundation is dedicated to accelerating this transition. We believe that wealth is the greatest metric of societal success, and through **Strategic Incentive Engineering**, **Wealth Activism**, and principled collaboration, we can create a world where prosperity is not a privilege, but a universal reality.

## 🏛️ The Stellarium Society
The Stellarium Society is a non-political, non-religious, mutually beneficial alliance of exceptional individuals. We are honest builders united by shared principles to enrich one another's lives through collaboration, shared enterprise, and strategic support.

### The Six Pillars of the Stellarium Way:
1. **Liberty:** We champion individual sovereignty and freedom of expression.
2. **Empowerment:** We unlock untapped potential through mastery and resource sharing.
3. **Peace:** We are peacemakers; peace and wealth walk in one accord.
4. **Love:** We practice active, tangible love and support for our fellow members.
5. **Fun:** We integrate pleasure, celebration, and joy into the pursuit of success.
6. **Wealth Creation:** We systematically generate and share wealth to elevate the collective.

---

## 💧 The "Water" Suite of Products
The Stellarium Foundation is engineering the future through a portfolio of transformative AI & Robotics products, designed to solve critical issues of labor, expertise, and efficiency:

- **Water Company:** A platform for building and managing fully autonomous digital AI workforces.
- **Water AI:** An "Everything AI" Supermodel that intelligently routes tasks to specialized AI models.
- **Water Robotics:** VR-teleoperated humanoid robots resolving global labor shortages in vital industries.
- **Water Classroom:** A comprehensive, personalized AI-powered educational platform.
- **Water Economics:** An AI foundational model for simulating economic policy and empirically-grounded decision-making.
- **Water AI Fluid:** A decentralized, peer-to-peer network for cost-effective AI computing.
- **Water Coach:** An AI-powered personal coach for real-time productivity and focus guidance.
- **Water Gov:** A visionary super-app centralizing citizen-government interactions.

---

## 📚 Application Features
This web application provides native-like access to the core tenets and resources of the Stellarium mission:

- **The Library:** Read and download the foundational texts, including *The Stellarium Book* and *The Stellarium Society* operations manual, formatted beautifully with Markdown.
- **The Quiz Engine:** Test your knowledge and mastery of the Stellarium principles, Structural Incentive Engineering, and wealth creation strategies.
- **Sponsorship & Action:** Direct links to engage with John Victor, fund the Stellarium Mansion, and support Wealth Activism initiatives.
- **Contact & Collaboration:** Secure channels to join the movement, become a Franchise Governor, or partner in the "Cast In Person" revolution. Includes a "Call Owner" feature for direct voice communication via WebSocket with real-time audio streaming.

---

## 🛠️ Build & Development

Built with **Bun** — a fast JavaScript runtime and bundler.

### Prerequisites
- Install [Bun](https://bun.sh) (v1.3+)

### Commands

```bash
# Install dependencies
bun install

# Start development server (with hot-reload on file changes)
bun run dev

# Build for production (outputs to ./dist)
bun run build

# Run TypeScript type checking
bun run lint

# Start production server (serves ./dist on port 3000)
bun run start
```

The production build outputs static files to `dist/`. Deploy the contents of `dist/` to any static host (Render, Vercel, Netlify, etc.). The `--start` command launches a Bun server with WebSocket support at `/ws`.

### Architecture

The app includes a real-time calling feature connecting visitors to the Foundation owner:

- **Web Client (`src/utils/callClient.ts`):** WebSocket client with state machine (`idle → calling → in_call → ended`) managing call requests, timeouts (30s), and audio streaming via libopus-wasm.
- **Opus Audio (`src/lib/OpusStream.ts`):** WASM-based Opus encoder/decoder for 48kHz mono audio in 20ms frames (960 samples). Auto-plays incoming packets and sends microphone audio during calls.
- **Call UI (`src/screens/ContactScreen.svelte`):** Integrated "Call Owner" button, mute toggle, and call status display. Mic access required for voice calls.

### Backend WebSocket Server

The `--start` command launches a Bun server with WebSocket support. The WebSocket endpoint (`/ws`) routes call signaling between the web client and the StellariumCaller Android app:

- **Call Flow:** Visitor clicks "Call Owner" → WebSocket `call_request` → Owner's StellariumCaller receives `call_request` → Incoming call screen appears → Accept/End buttons signal back.

- **Message Protocol (JSON):**
  - `register` (client): `{ "type": "register", "role": "owner" }` - Owner app registers on connect
  - `call_request` (web): `{ "type": "call_request" }` - Visitor initiates call
  - `call_answered` (owner): `{ "type": "call_answered" }` - Owner accepts call
  - `call_ended` (owner/web): `{ "type": "call_ended" }` - Call terminated
  - `call_failed` (server): `{ "type": "call_failed", "reason": "offline" }` - Owner not available

- **Binary Data:** Audio packets (Opus-encoded) are sent as `ArrayBuffer`/`Uint8Array` and forwarded to all subscribed clients via the `calls` topic.

- **Deployment:** For production, run `bun run start` on a server with a public IP. Configure TLS for `wss://` access (e.g., via nginx reverse proxy or hosting provider).

### Mobile Apps

**Capacitor App (General purpose):**
```bash
# Sync web build to Capacitor platforms
bun run cap sync android
bun run cap sync ios

# Build Android APK/AAB
cd android && ./gradlew assembleDebug

# Build iOS (requires macOS + Xcode)
xcodebuild -workspace ios/App/App.xcworkspace -scheme App ...
```

**StellariumCaller (Owner App):** Standalone Android app in `StellariumCaller/` for receiving voice calls from web visitors.

#### Architecture (Kotlin, 4 components):

- **`MainActivity.kt`** — Simple launcher activity with a service toggle button ("Start/Stop Call Service").
- **`CallService.kt`** — Foreground service running a persistent WebSocket connection to the server (`wss://www.stellarium.ddns-ip.net/ws`). Registers as `"role": "owner"` and listens for `call_request` signals. On answer, captures microphone audio using `AudioRecord`, encodes it via **Kopus** (Opus encoder, 48kHz mono, 960-sample frames), and sends binary over the WebSocket. Incoming audio packets are decoded and played through `AudioTrack`. Implements auto-reconnect with exponential backoff (up to 64s delay).
- **`IncomingCallActivity.kt`** — Full-screen incoming call UI with Answer/Decline buttons. Shows on the lock screen (`setShowWhenLocked`, `setTurnScreenOn`). Plays the system ringtone looped until answered/declined.
- **`BootReceiver.kt`** — `BroadcastReceiver` that auto-starts the `CallService` on device boot (`ACTION_BOOT_COMPLETED`).

#### Build:
```bash
cd StellariumCaller
./gradlew assembleDebug
# APK output: StellariumCaller/app/build/outputs/apk/debug/
```

CI/CD via GitHub Actions (`.github/workflows/build-mobile.yml`) produces web, Capacitor Android, StellariumCaller (owner), and iOS artifacts on push to `main`.

---

## 🤝 Join the Movement
You are not an outsider looking in; you are an integral part of this "great subconscious working." Whether you are here to learn, to invest, or to lead as a Stellarium Governor, your role is vital.

> **"If you agree with these principles, if you recognize that this is the path you have been seeking—then you are ready. Welcome to the franchise of prosperity, principle, and purpose."**

**Trust no one but the one, John Victor.**

**We are one. Let us act as one.**