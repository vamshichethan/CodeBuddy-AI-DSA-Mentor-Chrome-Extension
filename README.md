<h1 align="center">
  <img src="https://img.shields.io/badge/CodeBuddy-AI%20DSA%20Mentor-6C63FF?style=for-the-badge&logo=google-chrome&logoColor=white" alt="CodeBuddy AI"/>
  <br/>
  <br/>
  🧠 CodeBuddy AI — DSA Mentor Chrome Extension
</h1>

<p align="center">
  <b>An AI-powered Chrome Extension that helps you <i>think through</i> LeetCode problems — not just solve them.</b>
  <br/>
  Progressive hints · Pattern detection · Code debugging · Interview simulation · Progress tracking
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?style=flat-square&logo=googlechrome&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Google-Gemini%20API-8E44AD?style=flat-square&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-Dashboard-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Status-Deployed-brightgreen?style=flat-square"/>
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-core-idea">Core Idea</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-phases">Build Phases</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-resume-impact">Resume Impact</a>
</p>

---

## 🌐 Live Deployment

- Dashboard + API: https://codebuddy-ai-dsa-mentor.vercel.app
- Health check: https://codebuddy-ai-dsa-mentor.vercel.app/health
- Chrome extension default API: `https://codebuddy-ai-dsa-mentor.vercel.app/api`

The extension can still be pointed at a local backend from the popup settings.

---

## 🎯 Core Idea

> **Most AI tools give you the answer. CodeBuddy AI teaches you how to find it.**

When a user opens a LeetCode problem, the extension intelligently reads:

- 📌 **Problem title, description, constraints & examples**
- 💻 **User's current code** from the editor

Then the AI responds with **progressive, mentor-style guidance**:

| AI Capability | Description |
|---|---|
| 🔍 Hint System | Step-by-step hints, not direct answers |
| 🧩 Pattern Detector | Identifies DSA patterns and explains why |
| 🐞 Code Debugger | Finds bugs, edge cases, and complexity issues |
| 🎙️ Interview Mode | Behaves like a real technical interviewer |
| 📊 Dry Run Visualizer | Step-by-step trace for arrays, strings, graphs |
| ⏱️ Complexity Analyzer | Detects TLE risks with real constraints |
| 🧪 Edge Case Generator | Auto-generates tricky test cases |
| 📈 Progress Dashboard | Tracks patterns, weak areas, and hint usage |

---

## ✨ Features

### 1. 🔢 Step-by-Step Hint System *(Core Feature)*

The crown jewel of CodeBuddy AI. Instead of dumping the solution, it unlocks hints progressively:

```
Level 1 → Identify the DSA pattern
Level 2 → Give key observation about the problem
Level 3 → Explain the approach/algorithm
Level 4 → Pseudo-code walkthrough
Level 5 → Final code (only after user explicitly requests)
```

> **Why it matters:** This mirrors how great mentors teach — building intuition, not dependency.

---

### 2. 🧩 Pattern Detector

The extension identifies the underlying DSA pattern and explains *why* it fits:

```
🔎 Pattern Detected: Sliding Window

Why? The problem asks for a contiguous subarray of size k.
A sliding window avoids recomputing the sum from scratch each time,
bringing complexity from O(n·k) → O(n).

Related patterns to study: Two Pointer, Monotonic Deque
```

Supported Patterns: `Sliding Window` · `Two Pointer` · `Binary Search` · `BFS/DFS` · `Dynamic Programming` · `Backtracking` · `Monotonic Stack` · `Trie` · `Union Find` · `Greedy` · `Divide & Conquer`

---

### 3. 🐞 Code Debugger

User writes code on LeetCode → Extension deep-analyzes it:

```
❌ Bug Found: Off-by-one error on line 12

  Your loop runs while (i <= n), but the array is 0-indexed.
  This causes an ArrayIndexOutOfBounds on the last element.

⚠️  Edge Case Missed: Empty array input not handled.

🔁  Infinite Loop Risk: The while loop at line 18 has no
     guaranteed termination if left == right.

✅  Fix Suggestion: Change i <= n → i < n
```

---

### 4. 🎙️ Interview Mode

AI transforms into a **real technical interviewer** — it never reveals the answer directly:

```
👨‍💼 Interviewer: Good start! You've identified the brute force.
    Now, what data structure gives us O(1) minimum retrieval?

🧑‍💻 User: A min-heap?

👨‍💼 Interviewer: Exactly! How would that change your time complexity?
    Think about insert and extract-min operations...
```

> **Why it's unique:** Trains you for actual interviews, not just competitive programming.

---

### 5. 📊 Dry Run Visualizer

For arrays, strings, graphs — a step-by-step execution trace:

```
Problem: Largest Rectangle in Histogram
Input: nums = [2, 1, 5, 6, 2, 3]

Stack: []
Step 1: Push index 0 (height=2)  → Stack: [0]
Step 2: Push index 1 (height=1)  → Stack: [0, 1]  ← height decreased!
         → Pop index 0, calculate area: 2 × 1 = 2
Step 3: Push index 2 (height=5)  → Stack: [1, 2]
Step 4: Push index 3 (height=6)  → Stack: [1, 2, 3]
Step 5: Height decreases at index 4...
         → Pop and calculate: max area so far = 10 ✅
```

---

### 6. ⏱️ Complexity Analyzer

Analyzes user code against actual problem constraints:

```
⏱️  Time Complexity:  O(n²)  — Nested loop detected
💾  Space Complexity: O(1)   — No extra data structure

⚠️  TLE Warning:
    Given n ≤ 10⁵, your O(n²) solution performs ~10¹⁰ operations.
    Most judges allow ~10⁸ ops/sec. This WILL Time Limit Exceed.

💡 Optimization Hint: Consider using a HashMap to reduce
    the inner loop from O(n) → O(1) lookup.
```

---

### 7. 🧪 Edge Case Generator

Auto-generates critical test cases that often cause failures:

```
✅ Edge Cases for "Two Sum":

1. []               → Empty array
2. [3]              → Single element
3. [2, 2]           → Duplicate values (target = 4)
4. [-1, -2, -3]     → All negative numbers
5. [0, 0, 0]        → All zeros
6. [1000000000, 1000000000] → Integer overflow risk
7. nums already sorted vs reverse sorted
```

---

### 8. 🔒 Anti-Cheating Mode *(Product Thinking Feature)*

Final code is **locked** behind a progression gate:

```
🔒 Solution Locked

To unlock the full solution, you must:
  ✅ Use at least 3 progressive hints
  ✅ Submit at least one attempt on LeetCode
  ✅ Click "I've tried my best, show solution"

This ensures you actually learn — not just copy.
```

---

### 9. 📈 User Progress Dashboard

A dedicated dashboard tracking your growth:

```
📊 Your DSA Progress

Problems Attempted:  47       Problems Solved:  31
Hint Usage Rate:     62%      Average Attempts: 2.3

Weak Areas:
  🔴 Dynamic Programming  — 34% success rate
  🔴 Graph BFS/DFS        — 41% success rate
  🟡 Binary Search        — 67% success rate
  🟢 Two Pointer          — 89% success rate

Most Common Bugs:
  1. Off-by-one errors (12 times)
  2. Missing base cases in recursion (8 times)
  3. Integer overflow not handled (5 times)
```

---

### 10. 🗺️ Personalized DSA Roadmap

Based on your weakness pattern, CodeBuddy generates a custom study plan:

```
📚 Your Personalized Roadmap (Week 3)

Based on your last 10 sessions:

  🎯 Priority 1: Dynamic Programming
     → Solve: Coin Change, Longest Common Subsequence, Edit Distance
     → Focus: Identifying subproblem structure

  🎯 Priority 2: Graph BFS
     → Solve: Word Ladder, Rotting Oranges, 0-1 Matrix
     → Focus: Multi-source BFS setup
```

---

### 11. 🔍 AI Code Review Post-Submission

After Accepted / WA / TLE verdict on LeetCode:

```
✅ Submission: Accepted (Runtime: 84ms, beats 71%)

🚀 Optimization Opportunity:
   Your current approach: O(n log n) using sorting
   Optimal approach:      O(n) using counting sort
   Reason: Values are bounded by [0, 10000]

📝 Cleaner Rewrite Suggestion:
   Your 28-line solution can be written in 12 lines using...

🔗 Similar Problems: [316] [402] [1081]
```

---

### 12. 📓 Notes Auto-Generator

After solving, auto-generates revision notes:

```
📒 Auto-Generated Notes: "Valid Parentheses"

Pattern:     Stack
Key Trick:   Use a stack; push for open, pop-and-match for close
Complexity:  Time O(n) | Space O(n)
Edge Cases:  Empty string → true; Only opening brackets → false

Similar Problems:
  - Minimum Remove to Make Valid Parentheses (#1249)
  - Longest Valid Parentheses (#32)
  - Remove Invalid Parentheses (#301)
```

---

## 🛠️ Tech Stack

### Chrome Extension (Frontend)

| Technology | Purpose |
|---|---|
| **JavaScript (ES6+)** | Core extension logic |
| **HTML5 / CSS3** | Popup UI & content scripts |
| **Chrome Manifest V3** | Extension configuration & permissions |
| **Chrome Storage API** | Local user data & settings |
| **Chrome Tabs API** | Communication between popup & content script |

### Backend API

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **Google Gemini API** | AI model for hints, debug, pattern detection |
| **MongoDB** | User progress, notes, session data |
| **Mongoose** | ODM for MongoDB |
| **JWT Auth** | Secure user authentication |
| **Rate Limiting** | Prevent API abuse |

### Optional Dashboard (Frontend Web App)

| Technology | Purpose |
|---|---|
| **React.js** | Dashboard UI framework |
| **Tailwind CSS** | Styling |
| **Chart.js / Recharts** | Progress visualization graphs |
| **React Router** | Dashboard navigation |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LeetCode Page                            │
│         (DOM: problem title, description, user code)            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Chrome Content Script                         │
│      Scrapes problem data + user code from LeetCode DOM         │
└──────────────────────────┬──────────────────────────────────────┘
                           │  chrome.runtime.sendMessage()
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Extension Popup / UI                          │
│     Hint display · Debug output · Interview mode panel          │
└──────────────────────────┬──────────────────────────────────────┘
                           │  fetch() → REST API
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               Node.js + Express Backend                         │
│    /hint  /debug  /pattern  /dryrun  /complexity  /edgecase     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
┌─────────────────────┐    ┌────────────────────────┐
│   Gemini / OpenAI   │    │   MongoDB Database      │
│   AI Model API      │    │  User progress, notes,  │
│   Prompt Templates  │    │  sessions, roadmap      │
└─────────────────────┘    └────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Structured AI Response                             │
│  Hints · Debug Report · Pattern · Dry Run · Complexity         │
│              Displayed inside Extension Popup                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📅 Build Phases

### ✅ Phase 1 — Chrome Extension Foundation *(Week 1)*

- [ ] Set up Manifest V3 Chrome extension boilerplate
- [ ] Build content script to scrape LeetCode problem details
- [ ] Extract user code from Monaco editor on LeetCode
- [ ] Design the popup UI with a clean, modern interface
- [ ] Set up `chrome.runtime.sendMessage` pipeline
- [ ] Test extension on 5+ LeetCode problems

**Deliverable:** Working extension that reads LeetCode problem data

---

### ✅ Phase 2 — Backend API Setup *(Week 2)*

- [ ] Initialize Node.js + Express project
- [ ] Set up `.env` for Gemini API key management
- [ ] Build `/api/hint` endpoint with Gemini integration
- [ ] Design prompt templates for each feature type
- [ ] Add CORS, rate limiting, input validation
- [ ] Test API responses with Postman

**Deliverable:** Backend that returns AI hints for any LeetCode problem

---

### ✅ Phase 3 — Core AI Features *(Week 3)*

- [ ] Implement **Step-by-Step Hint System** (5 levels)
- [ ] Implement **Pattern Detector** with explanation
- [ ] Implement **Code Debugger** with bug + edge case analysis
- [ ] Implement **Complexity Analyzer** with TLE prediction
- [ ] Implement **Edge Case Generator**
- [ ] Wire all endpoints to the extension popup

**Deliverable:** Fully functional AI mentor with 5 core features

---

### ✅ Phase 4 — Advanced Features *(Week 4)*

- [ ] Implement **Interview Mode** with conversational AI flow
- [ ] Implement **Dry Run Visualizer** for common data structures
- [ ] Build **Anti-Cheating Mode** gate logic
- [ ] Add **Notes Auto-Generator** post-solve
- [ ] Add **AI Code Review** for submission results

**Deliverable:** Advanced features that differentiate from competitors

---

### ✅ Phase 5 — Progress Dashboard *(Week 5)*

- [ ] Set up MongoDB with Mongoose schemas
- [ ] Add JWT-based user authentication
- [ ] Track: problems attempted, patterns used, hint count, bugs
- [ ] Build **React Dashboard** with Chart.js progress graphs
- [ ] Implement **Personalized DSA Roadmap** generator

**Deliverable:** Full progress tracking with visual dashboard

---

### ✅ Phase 6 — Polish & Deployment *(Week 6)*

- [x] UI/UX polish on extension popup
- [x] Deploy backend to **Vercel Serverless**
- [x] Deploy dashboard to **Vercel**
- [ ] Write comprehensive documentation
- [ ] Record demo video
- [ ] Publish to Chrome Web Store (optional)

**Deliverable:** Production-ready, deployed project

---

## 🚀 Setup & Installation

### Prerequisites

```bash
Node.js >= 18.x
MongoDB (local or Atlas)
Google Gemini API Key
Chrome Browser
```

### 1. Clone the Repository

```bash
git clone https://github.com/vamshichethan/CodeBuddy-AI-DSA-Mentor-Chrome-Extension.git
cd CodeBuddy-AI-DSA-Mentor-Chrome-Extension
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add: GEMINI_API_KEY, MONGODB_URI, JWT_SECRET, PORT

npm run dev
```

### 3. Load Chrome Extension

```
1. Open Chrome → chrome://extensions/
2. Enable "Developer Mode" (top right toggle)
3. Click "Load Unpacked"
4. Select the /extension folder from this repo
5. Pin the CodeBuddy AI extension
6. Open any LeetCode problem
7. Click the extension icon 🧠
```

The extension works against the deployed API by default. For local backend testing,
open the popup settings and set:

```
Backend API URL: http://localhost:3001/api
Dashboard URL:   http://localhost:5173
```

### 4. Dashboard Setup (Optional)

```bash
cd dashboard
npm install
npm run dev
# Visit: http://localhost:5173
```

---

## 📁 Project Structure

```
CodeBuddy-AI-DSA-Mentor-Chrome-Extension/
│
├── extension/                    # Chrome Extension
│   ├── manifest.json             # Manifest V3 config
│   ├── content.js                # Scrapes LeetCode DOM
│   ├── background.js             # Service worker
│   ├── popup/
│   │   ├── popup.html            # Extension popup UI
│   │   ├── popup.js              # Popup logic
│   │   └── popup.css             # Styles
│   └── icons/                    # Extension icons
│
├── backend/                      # Node.js + Express API
│   ├── server.js                 # Entry point
│   ├── routes/
│   │   ├── hint.js               # /api/hint
│   │   ├── debug.js              # /api/debug
│   │   ├── pattern.js            # /api/pattern
│   │   ├── dryrun.js             # /api/dryrun
│   │   ├── complexity.js         # /api/complexity
│   │   ├── edgecase.js           # /api/edgecase
│   │   └── progress.js           # /api/progress
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Session.js            # Problem session schema
│   ├── prompts/
│   │   └── templates.js          # Gemini prompt templates
│   └── middleware/
│       ├── auth.js               # JWT middleware
│       └── rateLimit.js          # Rate limiting
│
├── dashboard/                    # React Progress Dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Roadmap.jsx       # Personalized roadmap
│   │   │   └── Notes.jsx         # Auto-generated notes
│   │   └── components/
│   │       ├── ProgressChart.jsx # Chart.js visualizations
│   │       └── WeakAreaCard.jsx  # Pattern weak areas
│   └── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/hint` | Get progressive hint (level 1-5) |
| `POST` | `/api/debug` | Analyze user code for bugs |
| `POST` | `/api/pattern` | Detect DSA pattern with explanation |
| `POST` | `/api/dryrun` | Generate step-by-step dry run |
| `POST` | `/api/complexity` | Analyze time/space complexity |
| `POST` | `/api/edgecase` | Generate edge test cases |
| `POST` | `/api/interview` | Start interview mode session |
| `POST` | `/api/review` | Post-submission code review |
| `GET` | `/api/progress/:userId` | Get user progress data |
| `GET` | `/api/roadmap/:userId` | Get personalized roadmap |

---

## 💡 Prompt Engineering Strategy

All AI responses use carefully designed prompt templates that enforce mentor behavior:

```javascript
// Example: Hint prompt template
const hintPrompt = `
You are CodeBuddy AI, a DSA mentor. Your job is to guide, NOT to give answers.

Problem: ${problemTitle}
Description: ${problemDescription}
User Code: ${userCode}
Hint Level Requested: ${level}

Rules:
- Level 1: Only identify the DSA pattern name
- Level 2: Give one key observation about the problem structure
- Level 3: Explain the algorithm approach without code
- Level 4: Give pseudo-code only
- Level 5: Give complete code with detailed comments

Current Level: ${level}
Respond ONLY with the hint for level ${level}. Do NOT reveal information for higher levels.
Format your response as JSON: { "hint": "...", "encouragement": "..." }
`;
```

---

## 🏆 Resume Impact

```
CodeBuddy AI — AI-Powered DSA Mentor Chrome Extension                    [GitHub]

• Built a Chrome Extension (Manifest V3) that reads LeetCode problem context
  and user code in real-time via DOM scraping using Content Scripts

• Designed a 5-level progressive hint system backed by Gemini API with
  custom prompt engineering to prevent direct answer exposure

• Implemented Pattern Detection, Code Debugging, Complexity Analysis (TLE
  prediction), and Edge Case Generation as independent REST API endpoints

• Built an Anti-Cheating Mode with hint-gate logic and an Interview Mode
  where AI acts as a technical interviewer using conversational prompting

• Created a Progress Dashboard (React + Chart.js) connected to MongoDB
  tracking weak DSA areas, hint usage patterns, and personalized roadmaps

Tech: JavaScript · Chrome Extension MV3 · Node.js · Express · Gemini API · MongoDB · React
```

---

## 🎯 Why This Project Stands Out

| Dimension | What It Demonstrates |
|---|---|
| 🧠 **AI Integration** | Real-world Gemini API usage with structured prompt engineering |
| 🔌 **Browser Extension** | Chrome Extension MV3 — rare and highly valued skill |
| 🖥️ **Backend Design** | REST API architecture with auth, rate limiting, DB |
| 🎨 **Product Thinking** | Anti-cheating gate, interview mode — shows UX maturity |
| 📊 **Data & Analytics** | MongoDB schemas, progress tracking, visualization |
| 🎓 **DSA Knowledge** | Demonstrates deep understanding of algorithms and patterns |
| 🚀 **Full-Stack** | Extension + Backend + Dashboard = complete system |

> This project is **Medium-Hard** in complexity, covers **7 different technology dimensions**, and solves a **real problem** that every CS student faces. In a placement session, it tells a complete story — from problem identification to AI-powered solution.

---

## 🗓️ Roadmap

- [x] Project planning & architecture design
- [ ] Phase 1: Chrome Extension scraping
- [ ] Phase 2: Backend API
- [ ] Phase 3: Core AI features
- [ ] Phase 4: Advanced features
- [ ] Phase 5: Progress dashboard
- [x] Phase 6: Deployment & polish
- [ ] Chrome Web Store publication

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vamshi Chethan**

[![GitHub](https://img.shields.io/badge/GitHub-vamshichethan-181717?style=flat-square&logo=github)](https://github.com/vamshichethan)

---

<p align="center">
  <i>Built with 💜 to make DSA learning actually enjoyable</i>
  <br/>
  <b>⭐ Star this repo if you find it helpful!</b>
</p>
