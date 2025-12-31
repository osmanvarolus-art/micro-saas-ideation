import { Domain, Idea } from './types';

export const DOMAINS = Object.values(Domain);

export const formatRegisterForPrompt = (ideas: Idea[]): string => {
  if (ideas.length === 0) return "No ideas explored yet.";
  return ideas.map(idea => 
    `Session: ${idea.name} - ${idea.summary} - Status: ${idea.status}`
  ).join('\n');
};

export const PROMPT_A_TEMPLATE = (date: string, register: string, domain: string) => `
ROLE: You are a micro-SaaS opportunity analyst. Your job is to identify ONE winning business idea that a solo founder can build in <100 hours and monetize to $1,000 MRR within 30 days.

CONTEXT: Today is ${date}. I am a solo technical founder. I will build using Google AI Studio (Gemini API) + no-code frontend (Bubble/Replit/Firebase).

=== ALREADY EXPLORED (DO NOT REPEAT OR SUGGEST VARIANTS) ===
${register}

=== DOMAIN FOCUS FOR THIS SESSION ===
${domain}

=== YOUR TASK ===

STEP 1 — PAIN IDENTIFICATION
List 5 specific, costly problems in this domain. For each:
- What triggers the pain (daily/weekly/monthly)?
- What's the current solution (manual process, expensive tool, nothing)?
- What's the cost of NOT solving it ($ lost, hours wasted, risk exposure)?

STEP 2 — OPPORTUNITY FILTER
For each pain, answer:
- Can Gemini API solve this better than a simple script? (Yes/No + why)
- Will users pay $29-99/month or $0.50-5 per use? (Yes/No + evidence)
- Can I build MVP in <40 hours? (Yes/No + complexity estimate)

STEP 3 — SCORING MATRIX
Score each (1-10):

| Pain Point | Build Speed | Pay Urgency | Market Size | AI Necessity | TOTAL |
|------------|-------------|-------------|-------------|--------------|-------|

STEP 4 — WINNER SELECTION
Select the highest-scoring idea. Output:

**WINNER:** [Name]
**One-Line Pitch:** [What it does for whom]
**Why Now (2025 Trigger):** [Regulation, platform change, behavior shift]
**Revenue Model:** [Per-use / Subscription / Hybrid]
**Target First Customer:** [Specific persona + where to find them]
**Competitive Gap:** [Why existing tools don't solve this]

STEP 5 — VALIDATION HOOKS
Provide:
- 3 Reddit/forum threads where this pain is discussed (subreddit + search query)
- 2 existing tools that partially address this (and their weakness)
- 1 Google Trends query to check demand trajectory
`;

export const PROMPT_B_TEMPLATE = (winnerName: string, winnerPitch: string) => `
ROLE: You are a technical architect specializing in Google AI Studio deployments. You produce production-ready specifications.

CONTEXT: I have validated the following business idea and need a complete build spec.

=== VALIDATED IDEA ===
**WINNER:** ${winnerName}
**One-Line Pitch:** ${winnerPitch}

=== DELIVERABLES ===

## 1. SYSTEM ARCHITECTURE

**Data Flow:**
User Input → [describe] → Gemini API → [describe] → Output Display → [describe] → Storage (if any)

**Components:**
- Frontend: [Bubble/Replit/static HTML + JS]
- Backend: [Firebase Functions / Replit backend / direct API call]
- Database: [Firebase Firestore / none / other]
- Auth: [Firebase Auth / none / email-only]

## 2. GOOGLE AI STUDIO CONFIGURATION

**Model:** gemini-2.0-flash (or specify if multimodal needed)

**System Prompt:**
\`\`\`
[Write the complete system instruction - be specific about persona, constraints, output format]
\`\`\`

**Example User Prompt:**
\`\`\`
[Write a realistic user input example]
\`\`\`

**Response Schema (JSON):**
\`\`\`json
{
  "type": "object",
  "properties": {
    // Define all output fields with types
  },
  "required": []
}
\`\`\`

## 3. API ENDPOINT DESIGN

**Endpoint:** POST /api/[name]

**Request Payload:**
\`\`\`json
{
  // Input fields
}
\`\`\`

**Response Payload:**
\`\`\`json
{
  // Output fields matching schema above
}
\`\`\`

## 4. MINIMAL FRONTEND SPEC

**Screen 1: Input**
- Field 1: [type, label, validation]
- Field 2: [type, label, validation]
- Submit button: [label]
- Loading state: [description]

**Screen 2: Results**
- Primary output display: [what, how formatted]
- Secondary info: [what]
- Actions: [save/export/share buttons]

**Screen 3: Pricing/Upgrade (if freemium)**
- Free tier limit display
- Upgrade CTA

## 5. TOKEN ECONOMICS

**Per Request:**
- Input tokens (estimated): [X]
- Output tokens (estimated): [Y]
- Cost at Gemini pricing: $[Z]

**Pricing Strategy:**
- Free tier: [X requests/month]
- Paid tier: $[X]/month for [Y] requests
- Break-even: [X] paid users

**Path to $1,000 MRR:**
- At $[X]/month pricing
- Need [Y] paying customers
- Conversion assumption: [Z]% of free users
- Required free signups: [N]

## 6. 14-DAY LAUNCH SEQUENCE
(Provide a checklist for Day 1 through Day 14)

## 7. SUCCESS METRICS (Week 1)
(Signups, API calls, Paid conversions, Failure signal)
`;
