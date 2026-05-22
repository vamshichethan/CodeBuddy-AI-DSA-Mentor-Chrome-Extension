# Chrome Web Store Listing Draft

## Extension Package

Upload this ZIP:

```text
/private/tmp/codebuddy-extension.zip
```

## Public URLs

- Dashboard: https://codebuddy-ai-dsa-mentor.vercel.app
- Privacy Policy: https://codebuddy-ai-dsa-mentor.vercel.app/privacy
- API Health Check: https://codebuddy-ai-dsa-mentor.vercel.app/health
- GitHub: https://github.com/vamshichethan/CodeBuddy-AI-DSA-Mentor-Chrome-Extension

## Name

CodeBuddy AI - DSA Mentor

## Short Description

AI-powered LeetCode mentor with progressive hints, debugging, pattern detection, dry runs, and progress tracking.

## Detailed Description

CodeBuddy AI helps you think through LeetCode problems instead of immediately showing the answer.

Core features:

- Progressive 5-level hint system
- DSA pattern detection with explanations
- Code debugging for bugs, edge cases, and logic issues
- Complexity analysis with TLE risk checks
- Edge case generation
- Dry run walkthroughs
- Interview mode with Socratic guidance
- Progress dashboard, notes, and personalized roadmap

How it works:

1. Open a LeetCode problem.
2. Click the CodeBuddy AI extension.
3. Choose hints, debugging, pattern analysis, complexity review, or interview mode.
4. Use the dashboard to track progress and weak areas.

CodeBuddy is designed for learning. It nudges you toward the solution step by step and keeps the full-code hint gated behind earlier hints.

## Category

Education

## Language

English

## Privacy Policy URL

https://codebuddy-ai-dsa-mentor.vercel.app/privacy

## Single Purpose Statement

CodeBuddy AI helps users learn data structures and algorithms by providing mentor-style AI guidance on LeetCode problem pages.

## Permission Justification

### activeTab

Used to access the currently open LeetCode problem tab when the user clicks the extension.

### storage

Used to store extension settings, dashboard URL, backend API URL, and per-problem hint progress.

### scripting

Used for Manifest V3 extension compatibility and page interaction support.

### Host permission: https://leetcode.com/*

Used to read LeetCode problem details and the user's current editor code on problem pages.

### Host permission: https://*.vercel.app/*

Used to call the deployed CodeBuddy backend API and open the deployed dashboard.

### Host permission: localhost / 127.0.0.1

Used for local development and testing.

## Data Usage Disclosure

CodeBuddy reads LeetCode problem details and current editor code only on supported problem pages. Data is sent to the CodeBuddy API when the user requests an AI feature. The backend uses Google Gemini to generate responses and may store progress data for dashboard analytics. CodeBuddy does not sell user data.
