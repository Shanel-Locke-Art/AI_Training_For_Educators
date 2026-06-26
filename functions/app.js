/* ======================================================
   PROMPTCRAFT APP.JS
   Clean pass: labeled sections, no duplicate top-level functions.
   Each function defined exactly once — the final winning version.

   Sections (Ctrl+F to jump):
     STATE
     SCREEN READER UTILITY
     NAME MODAL
     SURVEY CONFIGURATION
     MOCK CLAUDE
     BEHAVIORAL DATA TRACKING
     GROWTH SCORING
     SESSION PAYLOAD
     AUDIO
     SCENARIOS
     PIXEL HUD
     PIXEL INLINE CHAT         ← flagged for dialogue.js next pass
     SCENARIO NAVIGATION
     SCENARIO UNLOCK
     S4 — SYNC BIAS
     S5 — HALLUCINATION HUNT
     S6 — PREDICT THE OUTPUT
     S7 — OVERRELIANCE
     S8 — REFLECT AND REVISE
     AUTOSAVE
     VN ENGINE                 ← flagged for dialogue.js next pass
     SCENE IMAGE LOADER
     INIT
     SCENARIO SWITCH + LOAD
     S1 WORKBENCH              ← final owner (from legacy patch block 1)
     OSCQR
     CHAT MESSAGES
     SCAFFOLDED INPUT
     SEND + PREDICTION GATE    ← final owner (from legacy patch block 3/4)
     SCORING + FEEDBACK
     HELPERS
     COMPLETION
     REFLECTION ROOM
     DEV FUNCTIONS
     S2 METACOGNITION          ← new content
     S2 RESULT + REFLECTION    ← new content

   NOTE: Functions marked [→ dialogue.js] should move there
   once dialogue.js is reviewed. Kept here so game stays functional.
====================================================== */

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
let xp = 0;
let attempts = 0;
let lastPromptText = ''; // tracks last prompt for pre-filling on next attempt
let scenarioIndex = 0;
let history = [];
let scenarioCompleted = [false, false, false, false, false, false, false, false];
let playerName = 'You'; // updated by name entry modal

// ── SCREEN READER UTILITY ─────────────────────────────
(function() {
  const s = document.createElement('style');
  s.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
  document.head.appendChild(s);
})();

// ── NAME MODAL ────────────────────────────────────────
function showNameModal() {
  const overlay = document.getElementById('nameModalOverlay');
  overlay.classList.add('visible');
  // Focus the input after transition
  setTimeout(() => document.getElementById('nameInput').focus(), 450);
}

function submitName(skip = false) {
  const input = document.getElementById('nameInput');
  const raw = skip ? '' : input.value.trim();

  // Sanitise -- letters, spaces, hyphens, apostrophes, max 24 chars
  const clean = raw.replace(/[^a-zA-Z\s'\-\.]/g, '').trim().substring(0, 24);
  playerName = clean || 'You';

  // Dismiss modal
  const overlay = document.getElementById('nameModalOverlay');
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  setTimeout(() => overlay.style.display = 'none', 400);

  // Update Pixel's welcome to use the name
  updatePixelWelcomeForName();

  // Start the game
  startGame();
}

function updatePixelWelcomeForName() {
  if (playerName !== 'You') {
    // Personalise the welcome dialogue
    pixelDialogue.welcome[0].text =
      `Welcome to the Prompt Lab, ${playerName}! I am Professor Pixel, your AI coaching companion.`;
  }
}

function getInitials(name) {
  if (name === 'You') return 'YOU';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 3).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function startGame() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) initMusic();

  window.scenarioIntroEnabled = false; // suppress during initial load
  loadScenario(0);
  setTimeout(() => {
    playPixelSequence('scenarioStart_0', null);
    setTimeout(() => {
      playPixelSequence('welcome', null);
      // Enable scenario intro audio after opening sequence clears
      setTimeout(() => { window.scenarioIntroEnabled = true; }, 3000);
    }, 200);
  },1200);
}

// ══════════════════════════════════════════════════════
//  SURVEY CONFIGURATION
//  Change SURVEY_MODE to 'sheets' or 'qualtrics' when ready
//  Paste your Google Apps Script Web App URL into SHEETS_URL
// ══════════════════════════════════════════════════════
const SURVEY_MODE   = 'sheets';
const SHEETS_URL    = 'https://script.google.com/macros/s/AKfycbzN9bGwzKUcucCltXfj72pxee7y6t1reML6YRQNqCjxJ9Y3rDGp1a_FkYMzJmZROka5/exec';
const QUALTRICS_URL = 'YOUR_QUALTRICS_SURVEY_URL_HERE';


// Robust Google Sheets poster.
// Uses text/plain so browser no-cors requests are not silently mangled by preflight/CORS rules.
// Apps Script still receives the JSON string in e.postData.contents.
const PC_SHEETS_DEBUG = true;

async function postToSheets(payload, label = 'PromptCraft data') {
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('[PromptCraft] Sheets URL is not configured. Skipping:', label);
    return false;
  }

  const body = JSON.stringify(payload || {});

  try {
    if (PC_SHEETS_DEBUG) console.log(`[PromptCraft] Sending ${label} to Sheets:`, payload);

    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    if (PC_SHEETS_DEBUG) console.log(`[PromptCraft] Sheets request dispatched: ${label}`);
    return true;
  } catch (err) {
    console.warn(`[PromptCraft] fetch failed for ${label}:`, err);
  }

  // Fallback for some browser/security contexts.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const ok = navigator.sendBeacon(SHEETS_URL, blob);
      console.log(`[PromptCraft] sendBeacon fallback ${ok ? 'queued' : 'failed'}: ${label}`);
      return ok;
    }
  } catch (err) {
    console.warn(`[PromptCraft] sendBeacon failed for ${label}:`, err);
  }

  return false;
}

// Run from DevTools console: testSheetsPing()
window.testSheetsPing = function testSheetsPing() {
  return postToSheets({
    type: 'incremental',
    timestamp: new Date().toISOString(),
    participant_id: 'browser-test',
    scenario_index: 'TEST',
    scenario_label: 'Browser ping',
    session_duration_min: 0,
    attempts: 0,
    current_score: '',
    best_score: '',
    score_delta: '',
    prompt_text: 'Browser-to-Apps-Script test ping',
    claude_response: 'If this row appears, the deployed site can write to Sheets.',
    quality_indicators_lit: '',
    self_report_prediction: '',
    time_since_last_attempt_sec: '',
    screen_width: window.innerWidth || window.screen.width,
    event_type: 'browser_test_ping',
    session_id: pcSessionId,
    notes_coding_memo: location.href
  }, 'browser test ping');
};


// ══════════════════════════════════════════════════════
//  LOCAL TESTING / MOCK CLAUDE FALLBACK
//  Lets VS Code Live Server progress through scenarios without Netlify.
//  Add ?mockClaude=1 to force mock mode anywhere.
// ══════════════════════════════════════════════════════
const MOCK_CLAUDE_FOR_LOCAL = true;
const FORCE_MOCK_CLAUDE = new URLSearchParams(window.location.search).get('mockClaude') === '1';
const IS_LOCAL_TEST = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) || window.location.protocol === 'file:';
const USE_MOCK_CLAUDE = FORCE_MOCK_CLAUDE || (MOCK_CLAUDE_FOR_LOCAL && IS_LOCAL_TEST);

// NOTE: Mock Claude text is dialogue/content-heavy. Move to dialogue.js in a later pass if desired.
function mockClaudeText(payload, context = 'main') {
  const system = payload.system || '';
  const lastUser = payload.messages?.slice().reverse().find(m => m.role === 'user')?.content || '';
  const promptPreview = String(lastUser).replace(/\s+/g, ' ').slice(0, 180);
  const sc = scenarios?.[scenarioIndex] || {};
  const titleMap = ['Engagement', 'Metacognition', 'Authentic Assessment', 'Hallucination Hunt', 'Predict the Output', 'Synchronous Bias', 'Overreliance', 'Reflect and Revise'];
  const scenarioTitle = titleMap[scenarioIndex] || 'PromptCraft';

  if (context === 's1_section') {
    const sectionMatch = String(lastUser).match(/SECTION_BEING_REVIEWED:\s*([^\n]+)/i);
    const section = sectionMatch ? sectionMatch[1].trim().toLowerCase() : 'section';
    const responseMatch = String(lastUser).match(/USER_RESPONSE:\s*([\s\S]*?)(?:\n\nFULL_S1_CONTEXT:|$)/i);
    const response = responseMatch ? responseMatch[1].trim() : '';
    if (!response) return `**What is missing**\nThis section is empty, so Claude has nothing specific to work with yet.\n\n**Try this**\nAdd concrete details that connect directly to the dead discussion board problem.`;
    if (section.includes('learner')) {
      return `**What is working**\nYou are starting to give Claude a learner and course context. That helps the response avoid generic discussion advice.\n\n**What to strengthen**\nAdd anything that explains participation patterns: first-year students, asynchronous format, confidence level, workload, or why peer replies tend to be shallow.\n\n**Try this revision move**\nName the learner group and the online context in one sentence.`;
    }
    if (section.includes('fail') || section.includes('problem')) {
      return `**What is working**\nThis section should diagnose the real failure instead of simply asking for a better discussion prompt.\n\n**What to strengthen**\nBe specific about what students are doing now: one-sentence posts, agreement-only replies, no evidence, no follow-up, or conversations stopping after the required reply.\n\n**Try this revision move**\nDescribe what a weak reply looks like so Claude knows what behavior to repair.`;
    }
    if (section.includes('interaction')) {
      return `**What is working**\nThis is the repair mechanism. Claude needs to know how students should interact, not just that they should interact more.\n\n**What to strengthen**\nAsk for named peer-response moves such as build, challenge, compare, ask a follow-up question, or connect to evidence.\n\n**Try this revision move**\nTell Claude what each peer reply should do.`;
    }
    return `**What is working**\nThis section gives Claude the boundaries for a usable activity.\n\n**What to strengthen**\nAdd format limits, asynchronous expectations, number of replies, and what counts as a strong post or strong peer reply.\n\n**Try this revision move**\nDefine what success would look like in student behavior.`;
  }

  if (context === 'pixel' || system.includes('You are Professor Pixel')) {
    return `You gave Claude enough direction to produce a usable response, especially where your prompt named the actual teaching problem. The next improvement is to make the success criteria more visible so Claude knows what a strong student outcome should look like.\n\n*What would you want students to do, say, or produce that would prove the activity worked?*`;
  }

  if (context === 'growth' || system.includes('personalized growth summary')) {
    return `Your PromptCraft run shows a developing pattern of experimentation: you moved from basic prompt construction toward more intentional revision and evaluation. Your strongest evidence of growth is the way you used context, constraints, and reflection to make later prompts more specific.\n\nThe next area to keep developing is prediction: before using AI output, pause to name what you expect the system to do and what risks might appear. Carry that habit into your teaching practice by treating every AI response as a draft that needs human judgment before students ever see it.`;
  }

  if (scenarioIndex === 3 || sc.isCriticalThinking) {
    return `**Faculty Development Workshop Review**\n\nThis agenda looks polished, but it needs careful review before use. The learning styles section should be questioned because learning styles are often overstated in teaching materials. The cited study should also be verified before it is used in faculty development.\n\n**Course Quality Check**\nClear Objectives: partly addressed\nEvidence-Based: needs verification\nOnline Context: addressed\nFeasibility: addressed\nVerified Sources: needs review`;
  }

  if (scenarioIndex === 5 || sc.isBiasScenario) {
    return `**Async-First Capstone Redesign**\n\nFor a fully asynchronous course, I would replace mandatory live meetings with structured milestones, recorded presentation options, peer review windows, and flexible team communication expectations. Students could submit a capstone proposal, receive instructor feedback, complete asynchronous peer review, and present through recorded media or a written professional portfolio.\n\n**Course Quality Check**\nAsync-Friendly: addressed\nAccess & Equity: addressed\nFlexibility: addressed\nInclusive Design: addressed\nFeasibility: addressed`;
  }


  if (scenarioIndex === 0) {
    return `**Revised Discussion Prompt: From Reaction to Conversation**

Choose one idea from this week's reading that you think is useful, questionable, or difficult to apply. In your initial post, explain your choice, connect it to a specific detail from the reading, and describe how it might show up in a real classroom, workplace, or community situation.

Then reply to two classmates using a different move for each reply:
1. **Build:** Add an example, resource, or connection that extends their point.
2. **Probe:** Ask a genuine follow-up question that would help the conversation go deeper.

A strong reply should do more than agree. It should explain reasoning, refer to a specific idea, and help the other person continue thinking.

**Why this addresses the original issue**
The original prompt asked students what they thought, but it did not give them a reason to return to the conversation. This version gives students clear interaction moves, defines what quality looks like, and turns peer replies into part of the learning task instead of a checkbox.

**Course Quality Check**
Clear Objectives: addressed
Student Interaction: addressed
Real-World Context: addressed
Inclusive Design: addressed
Measurable Outcomes: addressed`;
}

  return `**${scenarioTitle} Activity Draft**\n\nBased on your prompt, Claude would create a course-ready activity that targets the teaching problem you described: ${promptPreview || 'the instructional challenge'}. The activity would include a clear purpose, student-facing directions, a low-barrier participation structure, and a brief reflection or follow-up step so learners can connect the task to their own progress.\n\n**Suggested Activity**\nAsk students to complete a short applied task, share a response using specific criteria, and respond to peers or revise their work using one focused reflection question. Keep the instructions concise, name the expected outcome, and provide an example of what a strong response looks like.\n\n**Course Quality Check**\nClear Objectives: addressed\nStudent Interaction: addressed\nReal-World Context: addressed\nInclusive Design: addressed\nMeasurable Outcomes: addressed\nReflection: addressed\nLearning Strategy: addressed\nTransfer: addressed\nStudent Autonomy: addressed\nAuthentic Tasks: addressed\nFeedback Design: addressed\nStudent Agency: addressed\nAlignment: addressed\nCourse Specific: addressed\nLearner Context: addressed\nLevel Appropriate: addressed\nActionable Steps: addressed\nIterative Practice: addressed`;
}

function mockClaudeResponse(payload, context = 'main') {
  console.info(`[PromptCraft] Using mock Claude response for ${context}.`);
  return Promise.resolve({
    content: [{ text: mockClaudeText(payload, context) }],
    mock: true
  });
}

const CLAUDE_REQUEST_TIMEOUT_MS = 15000;

async function callClaude(payload, context = 'main') {
  if (USE_MOCK_CLAUDE) return mockClaudeResponse(payload, context);

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), CLAUDE_REQUEST_TIMEOUT_MS)
    : null;

  try {
    const res = await fetch('/.netlify/functions/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    });

    if (!res.ok) throw new Error(`Claude function returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error?.message || 'Claude returned an error');
    return data;
  } catch (err) {
    /*
      Live-site protection:
      If the Netlify function stalls, fails, or returns HTML instead of JSON,
      keep the game moving with the local mock response instead of leaving
      Professor Pixel stranded in terminal purgatory.
    */
    console.warn('[PromptCraft] Claude unavailable or timed out; using mock response:', err && err.message ? err.message : err);
    return mockClaudeResponse(payload, context);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function showMockClaudeNotice() {
  if (!USE_MOCK_CLAUDE) return;
  const bar = document.getElementById('devBar');
  if (!bar || document.getElementById('mockClaudeNotice')) return;
  const tag = document.createElement('span');
  tag.id = 'mockClaudeNotice';
  tag.textContent = 'MOCK CLAUDE';
  tag.style.color = '#f6c177';
  tag.style.border = '1px solid #f6c177';
  tag.style.borderRadius = '4px';
  tag.style.padding = '1px 6px';
  tag.style.marginLeft = '4px';
  bar.insertBefore(tag, bar.children[1] || null);
}

document.addEventListener('DOMContentLoaded', showMockClaudeNotice);

// ══════════════════════════════════════════════════════
//  BEHAVIORAL DATA TRACKING
//  Records rich session data for dissertation analysis
// ══════════════════════════════════════════════════════
const sessionStart = Date.now();
const pcSessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Per-scenario tracking object — now includes scenario 4
const scenarioData = [
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '' },
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '' },
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '' },
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '', selfReport: '' },
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '', prediction: '', predictionCorrect: false },
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '', biasItemsSpotted: [] },
  { attempts: 0, prompts: [], bestScore: 0, finalResponse: '', oscqrLit: '', overrelianceDecisions: {} },
  { attempts: 0, prompts: [], initialPrompt: '', revisedPrompt: '', initialScore: 0, revisedScore: 0, scoreDelta: 0, finalResponse: '', oscqrLit: '', reflection1: '', reflection2: '', reflection3: '' },
];

const PC_SCENARIO_LABELS = [
  'S1: Engagement',
  'S2: Metacognition',
  'S3: Authentic Assessment',
  'S4: Sync Bias',
  'S5: Hallucination Hunt',
  'S6: Predict the Output',
  'S7: Overreliance',
  'S8: Reflect & Revise'
];

const pcLastIncrementalSaveAt = {};

function getPromptCraftScenarioLabel(scenarioIdx) {
  return PC_SCENARIO_LABELS[scenarioIdx] || `S${scenarioIdx + 1}`;
}

function getPromptCraftViewportWidth() {
  return window.innerWidth || document.documentElement.clientWidth || window.screen.width || '';
}


function trackPrompt(scenarioIdx, promptText, score, aiResponse, oscqrActive) {
  const s = scenarioData[scenarioIdx];
  s.attempts++;
  s.prompts.push(promptText);
  if (score > s.bestScore) s.bestScore = score;
  s.finalResponse = aiResponse.replace(/<[^>]+>/g, '').substring(0, 1200);
  s.oscqrLit = oscqrActive.join(', ');
}


// ══════════════════════════════════════════════════════
//  GROWTH SCORING — normalize all 8 scenarios to 0–5
// ══════════════════════════════════════════════════════
function buildGrowthScores() {
  const s1 = scenarioData[0].bestScore || 0;
  const s2 = scenarioData[1].bestScore || 0;
  const s3 = scenarioData[2].bestScore || 0;
  const s4 = scenarioData[3].bestScore || 0;

  // S5 Hallucination Hunt: caught=5, unsure=2.5, missed=1
  const s5raw = scenarioData[4].selfReport || '';
  const s5 = s5raw === 'yes_noticed' ? 5 : s5raw === 'unsure' ? 2.5 : 1;

  // S6 Predict: prediction accuracy (2.5) + prompt quality (2.5)
  const s6pred   = scenarioData[5].predictionCorrect ? 2.5 : 0;
  const s6prompt = Math.min(2.5, (scenarioData[5].bestScore || 0) * 0.5);
  const s6 = s6pred + s6prompt;

  // S7 Overreliance: correct decisions out of 5
  const d7 = scenarioData[6].overrelianceDecisions || {};
  const correct7 = [
    d7.policy    === 'must_be_original',
    d7.cases     === 'needs_judgment',
    d7.pledge    === 'safe_to_use',
    d7.scenarios === 'needs_judgment',
    d7.objectives=== 'safe_to_use',
  ].filter(Boolean).length;
  const s7 = correct7;

  // S8: revised score is the outcome of iteration
  const s8 = scenarioData[7].revisedScore || scenarioData[7].initialScore || 0;
  const delta = (scenarioData[7].revisedScore || 0) - (scenarioData[7].initialScore || 0);

  return {
    s1, s2, s3, s4, s5, s6, s7, s8, delta,
    trajectory: [s1, s2, s3, s4, s5, s6, s7, s8],
    s5_caught:    s5raw,
    s6_predicted: scenarioData[5].predictionCorrect ? 'yes' : 'no',
    s7_correct:   correct7,
    threshold_met: [s1,s2,s3,s4].filter(s => s >= 3).length,
  };
}

async function generateGrowthReport(reflectionAnswers) {
  const g = buildGrowthScores();
  const name = (playerName && playerName !== 'You') ? playerName : 'the participant';

  const systemPrompt = `You are a research-informed instructional design coach writing a personalized growth summary for an educator who completed PromptCraft — an 8-scenario AI prompting training game. Write 2-3 paragraphs (warm, specific, professional). Address the participant directly as "${name}". Your summary must: (1) name the specific trajectory pattern across the 8 scenarios — did they improve steadily, plateau, dip at the critical thinking scenarios, finish strong? (2) call out one specific strength demonstrated with evidence from the data, (3) name one concrete area to keep developing, (4) end with one actionable sentence they can take into their actual teaching practice. Do NOT use generic praise. Be specific to the numbers. Under 200 words. Flowing paragraphs only — no bullets.`;

  const dataPrompt = `${name}'s PromptCraft performance data:

TRAJECTORY (0-5 each):
S1 Engagement: ${g.s1} | S2 Metacognition: ${g.s2} | S3 Authentic Assessment: ${g.s3} | S4 Sync Bias: ${g.s4}
S5 Hallucination Hunt: ${g.s5} (${g.s5_caught === 'yes_noticed' ? 'caught issues independently' : g.s5_caught === 'unsure' ? 'was uncertain' : 'initially missed problems'})
S6 Predict the Output: ${g.s6} (prediction ${g.s6_predicted === 'yes' ? 'correct' : 'incorrect'})
S7 Overreliance: ${g.s7} (${g.s7_correct}/5 decisions correct)
S8 Reflect & Revise: ${g.s8} (initial: ${scenarioData[7].initialScore||0} → revised: ${scenarioData[7].revisedScore||0}, delta: ${g.delta>=0?'+':''}${g.delta})

ATTEMPTS: S1:${scenarioData[0].attempts} S2:${scenarioData[1].attempts} S3:${scenarioData[2].attempts} S4:${scenarioData[3].attempts} S5:${scenarioData[4].attempts} S6:${scenarioData[5].attempts} S7:${scenarioData[6].attempts||1} S8:${scenarioData[7].attempts||1}

PROMPTING THRESHOLDS MET (>=3/5): ${g.threshold_met}/4

REFLECTIONS:
Why they wrote their S8 prompt that way: ${reflectionAnswers.q1||'not provided'}
What worked: ${reflectionAnswers.q2||'not provided'}
What fell short: ${reflectionAnswers.q3||'not provided'}
Other: ${reflectionAnswers.q4||''}

Write the growth summary.`;

  try {
    const data = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: dataPrompt }]
    }, 'growth');
    return data.content?.[0]?.text || '';
  } catch(e) { return ''; }
}

function buildGrowthTableHTML(g) {
  const rows = [
    ['S1','Engagement',g.s1,'Prompt quality'],
    ['S2','Metacognition',g.s2,'Prompt quality'],
    ['S3','Authentic Assessment',g.s3,'Prompt quality'],
    ['S4','Sync Bias',g.s4,'Prompt quality'],
    ['S5','Hallucination Hunt',g.s5, g.s5_caught==='yes_noticed'?'Caught independently ✓':'Missed initially'],
    ['S6','Predict the Output',g.s6,`Prediction ${g.s6_predicted==='yes'?'correct ✓':'incorrect'}`],
    ['S7','Overreliance',g.s7,`${g.s7_correct}/5 decisions correct`],
    ['S8','Reflect & Revise',g.s8,`Δ ${g.delta>=0?'+':''}${g.delta} from initial`],
  ];
  const rowHTML = rows.map(([num,sname,score,note]) => {
    const pct = Math.round((score/5)*100);
    const col = score>=4?'#2d7a4a':score>=3?'#c47a1a':'#8a3020';
    return `<tr><td style="font-family:'Source Code Pro',monospace;font-size:0.72rem;color:#8b7355;padding:6px 10px;">${num}</td><td style="font-size:0.82rem;padding:6px 10px;font-weight:600;">${sname}</td><td style="padding:6px 10px;"><div style="display:flex;align-items:center;gap:8px;"><div style="width:80px;height:6px;background:#e8e4dc;border-radius:3px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-family:'Source Code Pro',monospace;font-size:0.75rem;color:${col};font-weight:600;">${score}/5</span></div></td><td style="font-size:0.75rem;color:#6b6560;padding:6px 10px;">${note}</td></tr>`;
  }).join('');
  const avg = (g.trajectory.reduce((a,b)=>a+b,0)/8).toFixed(1);
  return `<div style="margin-top:24px;border-top:1px solid #d6cfc0;padding-top:20px;"><div style="font-family:'Source Code Pro',monospace;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:#8b7355;margin-bottom:12px;">Performance Summary</div><table style="width:100%;border-collapse:collapse;font-family:'Nunito',sans-serif;"><thead><tr style="border-bottom:1px solid #d6cfc0;"><th style="text-align:left;padding:4px 10px;font-size:0.68rem;color:#8b7355;">#</th><th style="text-align:left;padding:4px 10px;font-size:0.68rem;color:#8b7355;">SCENARIO</th><th style="text-align:left;padding:4px 10px;font-size:0.68rem;color:#8b7355;">SCORE</th><th style="text-align:left;padding:4px 10px;font-size:0.68rem;color:#8b7355;">NOTE</th></tr></thead><tbody>${rowHTML}</tbody></table><div style="display:flex;gap:20px;margin-top:16px;padding-top:12px;border-top:1px solid #e8e4dc;"><div style="flex:1;text-align:center;"><div style="font-size:1.6rem;font-weight:800;color:#2d5a3d;">${avg}</div><div style="font-size:0.68rem;color:#8b7355;text-transform:uppercase;letter-spacing:0.08em;">Avg score / 5</div></div><div style="flex:1;text-align:center;"><div style="font-size:1.6rem;font-weight:800;color:#2d5a3d;">${g.threshold_met}/4</div><div style="font-size:0.68rem;color:#8b7355;text-transform:uppercase;letter-spacing:0.08em;">Prompting thresholds met</div></div><div style="flex:1;text-align:center;"><div style="font-size:1.6rem;font-weight:800;color:${g.delta>=0?'#2d5a3d':'#8a3020'};">${g.delta>=0?'+':''}${g.delta}</div><div style="font-size:0.68rem;color:#8b7355;text-transform:uppercase;letter-spacing:0.08em;">S8 revision delta</div></div></div></div>`;
}

function buildSessionPayload(formData) {
  const durationMin = ((Date.now() - sessionStart) / 60000).toFixed(1);
  const totalAttempts = scenarioData.reduce((sum, s) => sum + (s.attempts || 0), 0);

  // Build S7 decisions object from scenarioData
  const d7 = scenarioData[6]?.overrelianceDecisions || {};

  return {
    type: 'full_response',

    // Session
    timestamp:            new Date().toISOString(),
    participant_id:       (formData ? formData.get('participant_id') : null) || (playerName !== 'You' ? playerName : 'anonymous'),
    session_id:           pcSessionId,
    session_duration_min: parseFloat(durationMin),
    scenarios_completed:  scenarioCompleted.filter(Boolean).length,
    total_xp:             Math.round(xp),
    total_attempts:       totalAttempts,
    presubmit_predictions: scenarioData.map((s, i) => `S${i+1}: ${JSON.stringify(s.predictions || [])}`).join(' || '),

    // S1
    s1_attempts:          scenarioData[0].attempts,
    s1_best_score:        scenarioData[0].bestScore,
    s1_prompts:           scenarioData[0].prompts.join(' | '),
    s1_final_response:    scenarioData[0].finalResponse,
    s1_oscqr:             scenarioData[0].oscqrLit,
    s1_section_reviews:   JSON.stringify(scenarioData[0].sectionReviews || []),

    // S2
    s2_attempts:          scenarioData[1].attempts,
    s2_best_score:        scenarioData[1].bestScore,
    s2_prompts:           scenarioData[1].prompts.join(' | '),
    s2_final_response:    scenarioData[1].finalResponse,
    s2_oscqr:             scenarioData[1].oscqrLit,

    // S3
    s3_attempts:          scenarioData[2].attempts,
    s3_best_score:        scenarioData[2].bestScore,
    s3_prompts:           scenarioData[2].prompts.join(' | '),
    s3_final_response:    scenarioData[2].finalResponse,
    s3_oscqr:             scenarioData[2].oscqrLit,

    // S4 — hallucination hunt (no open prompt, but track what we have)
    s4_attempts:          scenarioData[3].attempts,
    s4_best_score:        scenarioData[3].bestScore,
    s4_prompts:           scenarioData[3].prompts.join(' | '),
    s4_final_response:    scenarioData[3].finalResponse,
    s4_oscqr:             scenarioData[3].oscqrLit,

    // S5 — predict the output
    s5_attempts:          scenarioData[4].attempts,
    s5_best_score:        scenarioData[4].bestScore || 0,
    s5_self_report:       scenarioData[4].selfReport || '',
    s5_prompts:           scenarioData[4].prompts.join(' | '),
    s5_final_response:    scenarioData[4].finalResponse || '',

    // S6 — sync bias
    s6_attempts:          scenarioData[5].attempts,
    s6_prediction:        scenarioData[5].prediction || '',
    s6_prediction_correct: scenarioData[5].predictionCorrect ? 'yes' : 'no',
    s6_prompts:           scenarioData[5].prompts.join(' | '),

    // S7 — overreliance decisions
    s7_decisions: {
      policy:     d7.policy     || '',
      cases:      d7.cases      || '',
      pledge:     d7.pledge     || '',
      scenarios:  d7.scenarios  || '',
      objectives: d7.objectives || '',
    },
    s7_best_score:        scenarioData[6].bestScore || 0,

    // S8 — reflect & revise
    s8_initial_prompt:    scenarioData[7].initialPrompt  || '',
    s8_initial_score:     scenarioData[7].initialScore   || 0,
    s8_revised_prompt:    scenarioData[7].revisedPrompt  || '',
    s8_revised_score:     scenarioData[7].revisedScore   || 0,
    s8_score_delta:       scenarioData[7].scoreDelta     || 0,
    s8_reflection_1:      scenarioData[7].reflection1    || '',
    ai_narrative:         '',  // populated after async generation
    growth_json:          '',  // populated after async generation
    s8_reflection_2:      scenarioData[7].reflection2    || '',
    s8_reflection_3:      scenarioData[7].reflection3    || '',

    // Reflection Room
    q1_surprise:    formData ? (formData.get('q1_surprise')  || '') : '',
    q2_unexpected:  formData ? (formData.get('q2_change')    || '') : '',
    q3_transfer:    formData ? (formData.get('q3_practice')  || '') : '',
    q4_other:       formData ? (formData.get('q4_other')     || '') : '',

    // Metadata
    screen_width: getPromptCraftViewportWidth(),
    referrer:     document.referrer || 'direct'
  };
}

async function saveIncrementalData(scenarioIdx) {
  // Don't save if no attempts were made — avoids phantom rows from dev navigation.
  if ((scenarioData[scenarioIdx]?.attempts || 0) === 0 && scenarioIdx !== 3 && scenarioIdx !== 6) return;
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;

  try {
    const s = scenarioData[scenarioIdx] || {};
    const participantId = document.querySelector('input[name="participant_id"]')?.value?.trim()
      || (playerName !== 'You' ? playerName : 'anonymous');

    const now = Date.now();
    const lastSaveAt = pcLastIncrementalSaveAt[scenarioIdx] || null;
    const timeSinceLastAttemptSec = lastSaveAt ? Math.round((now - lastSaveAt) / 1000) : '';
    pcLastIncrementalSaveAt[scenarioIdx] = now;

    const prompts = Array.isArray(s.prompts) ? s.prompts : [];
    const lastPrompt = prompts.length ? prompts[prompts.length - 1] : '';
    const bestScore = Number(s.bestScore || s.revisedScore || s.initialScore || 0);
    const currentScore = bestScore;

    const payload = {
      type: 'incremental',
      timestamp: new Date().toISOString(),
      participant_id: participantId,
      session_id: pcSessionId,
      scenario_index: scenarioIdx + 1,
      scenario_label: getPromptCraftScenarioLabel(scenarioIdx),
      session_duration_min: parseFloat(((Date.now() - sessionStart) / 60000).toFixed(1)),
      scenarios_completed: scenarioCompleted.filter(Boolean).length,
      total_xp: Math.round(xp),
      total_attempts: scenarioData.reduce((sum, item) => sum + (item.attempts || 0), 0),
      attempts: s.attempts || 0,
      current_score: currentScore,
      best_score: bestScore,
      score_delta: typeof s.scoreDelta === 'number' ? s.scoreDelta : '',
      prompt_text: lastPrompt || prompts.join(' | '),
      prompts: prompts.join(' | '),
      claude_response: s.finalResponse || '',
      final_response: s.finalResponse || '',
      quality_indicators_lit: s.oscqrLit || '',
      oscqr_lit: s.oscqrLit || '',
      self_report_prediction: s.selfReport || s.prediction || (Array.isArray(s.predictions) ? s.predictions.join(' | ') : ''),
      self_report: s.selfReport || '',
      prediction: s.prediction || '',
      time_since_last_attempt_sec: timeSinceLastAttemptSec,
      screen_width: getPromptCraftViewportWidth(),
      event_type: 'scenario_complete',
      notes_coding_memo: `${location.pathname} :: ${getPromptCraftScenarioLabel(scenarioIdx)} :: session ${pcSessionId}`
    };

    console.log(`[PromptCraft] Incremental save S${scenarioIdx + 1}:`, payload);
    await postToSheets(payload, `incremental S${scenarioIdx + 1}`);
  } catch(e) {
    console.warn('[PromptCraft] Incremental save failed:', e.message);
  }
}


// ══════════════════════════════════════════════════════
//  AUDIO
//  Set audioReady = true once ElevenLabs MP3s are in audio/
// ══════════════════════════════════════════════════════
const audioReady = typeof Howl !== 'undefined';
const sounds = audioReady ? {
  // ── Prompt quality feedback ───────────────────────────
  welcome:           new Howl({ src: ['audio/welcome.mp3'],            volume: 0.9 }),
  vague:             new Howl({ src: ['audio/vague.mp3'],              volume: 0.9 }),
  decent:            new Howl({ src: ['audio/decent.mp3'],             volume: 0.9 }),
  strong:            new Howl({ src: ['audio/strong.mp3'],             volume: 0.9 }),
  scenarioComplete:  new Howl({ src: ['audio/scenario-complete.mp3'],  volume: 0.9 }),
  allComplete:       new Howl({ src: ['audio/all-complete.mp3'],       volume: 0.9 }),
  // ── Scenario introductions ────────────────────────────
  scenarioIntro0:    new Howl({ src: ['audio/scenario-1-intro.mp3'],   volume: 0.9 }),
  scenarioIntro1:    new Howl({ src: ['audio/scenario-2-intro.mp3'],   volume: 0.9 }),
  scenarioIntro2:    new Howl({ src: ['audio/scenario-3-intro.mp3'],   volume: 0.9 }),
  scenarioIntro3:    new Howl({ src: ['audio/scenario-4-intro.mp3'],   volume: 0.9 }),
  scenarioIntro4:    new Howl({ src: ['audio/scenario-5-intro.mp3'],   volume: 0.9 }),
  scenarioIntro5:    new Howl({ src: ['audio/scenario-6-intro.mp3'],   volume: 0.9 }),
  scenarioIntro6:    new Howl({ src: ['audio/scenario-7-intro.mp3'],   volume: 0.9 }),
  scenarioIntro7:    new Howl({ src: ['audio/scenario-8-intro.mp3'],   volume: 0.9 }),
  // ── Special scenario moments ──────────────────────────
  s4Interrupt:       new Howl({ src: ['audio/s4-interrupt.mp3'],       volume: 0.9 }),
  s4Reveal:          new Howl({ src: ['audio/s4-reveal.mp3'],          volume: 0.9 }),
  s7Closing:         new Howl({ src: ['audio/s7-closing.mp3'],         volume: 0.9 }),
  reflectionOpen:    new Howl({ src: ['audio/reflection-open.mp3'],    volume: 0.9 }),
} : {};

// Narration sounds that should not overlap each other
const NARRATION_KEYS = new Set([
  'welcome','vague','decent','strong','scenarioComplete','allComplete',
  'scenarioIntro0','scenarioIntro1','scenarioIntro2','scenarioIntro3',
  'scenarioIntro4','scenarioIntro5','scenarioIntro6','scenarioIntro7',
  's4Interrupt','s4Reveal','s7Closing','reflectionOpen'
]);
let _currentNarration = null;

function playSound(name) {
  if (!audioReady || !sounds[name]) return;
  // Stop any currently playing narration before starting a new one
  if (NARRATION_KEYS.has(name)) {
    if (_currentNarration && _currentNarration !== sounds[name]) {
      _currentNarration.stop();
    }
    _currentNarration = sounds[name];
  }
  sounds[name].play();
}

// ── BACKGROUND MUSIC SYSTEM ───────────────────────────
// Lo-fi background track: audio/background.mp3
// Recommended source: pixabay.com/music — search "lofi study"
// Pick a CC0 track, download as MP3, rename to background.mp3
// Fades in during VN moments, fades to barely-there during gameplay

const MUSIC_VOL_VN   = 0.35;  // volume during VN overlay
const MUSIC_VOL_GAME = 0.08;  // near-silent during gameplay
const MUSIC_FADE_MS  = 2000;  // fade duration ms

let bgMusic      = null;
let musicEnabled = false;
let musicMuted   = false;
let musicReady   = false;

function initMusic() {
  if (bgMusic) return;
  if (typeof Howl === 'undefined') return;
  bgMusic = new Howl({
    src: ['audio/background.mp3'],
    loop: true,
    volume: 0,
    html5: true,        // required for mobile autoplay
    onload: () => { musicReady = true; },
    onloaderror: () => { bgMusic = null; }  // file not found — silent fail
  });
}

function musicFadeTo(targetVol, durationMs) {
  if (!bgMusic || !musicReady || musicMuted) return;
  bgMusic.fade(bgMusic.volume(), targetVol, durationMs);
}

function musicStartVN() {
  if (!bgMusic || musicMuted) return;
  if (!musicEnabled) {
    musicEnabled = true;
    bgMusic.play();
    bgMusic.fade(0, MUSIC_VOL_VN, MUSIC_FADE_MS);
  } else {
    musicFadeTo(MUSIC_VOL_VN, MUSIC_FADE_MS);
  }
}

function musicEndVN() {
  musicFadeTo(MUSIC_VOL_GAME, MUSIC_FADE_MS);
}

function toggleMusic() {
  const btn = document.getElementById('musicToggle');
  musicMuted = !musicMuted;
  btn.classList.toggle('muted', musicMuted);
  btn.setAttribute('aria-label', musicMuted ? 'Unmute background music' : 'Mute background music');
  btn.textContent = musicMuted ? '🔇' : '🎵';
  if (bgMusic && musicReady) {
    if (musicMuted) {
      bgMusic.fade(bgMusic.volume(), 0, 600);
    } else if (musicEnabled) {
      const isVNOpen = document.getElementById('vnOverlay')?.classList.contains('active');
      bgMusic.fade(0, isVNOpen ? MUSIC_VOL_VN : MUSIC_VOL_GAME, 600);
    }
  }
}

// ══════════════════════════════════════════════════════
//  SCENARIOS
// ══════════════════════════════════════════════════════
const scenarios = [

  // ── S1: ENGAGEMENT ───────────────────────────────────
  {
    desc: "Mission: Fix a dead discussion board by helping Claude understand what is failing and what meaningful peer interaction should look like.",
    testPrompt: "My online learners in a first-year general education course are submitting one-line discussion posts that don't build on each other. I need a weekly discussion prompt that encourages deeper thinking and at least two substantive peer replies. The course is fully asynchronous, 8 weeks long.",
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"int", label:"Student Interaction" },
      { id:"rwc", label:"Real-World Context" },
      { id:"inc", label:"Inclusive Design" },
      { id:"out", label:"Measurable Outcomes" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member improve student engagement in asynchronous discussions.
When the instructor writes a prompt, respond with a practical, course-ready discussion activity. Be warm and specific.
After your main response, add a short section called "Course Quality Check" noting which are addressed: Clear Objectives, Student Interaction, Real-World Context, Inclusive Design, Measurable Outcomes.
Coaching: vague prompts get generic outputs with gentle guidance. Specific prompts with learner context, course level, and format constraints get excellent, usable outputs with explicit praise.`
  },

  // ── S2: METACOGNITION ─────────────────────────────────
  {
    desc: "Your online students are completing assignments and moving on without reflecting on how they learned. They are going through the motions. Use AI to help design an activity that builds metacognitive awareness in an asynchronous online course.",
    testPrompt: "My students in an online introductory psychology course (16 weeks, asynchronous) complete readings and quizzes but show little evidence of self-monitoring or transfer. I want to design a weekly metacognitive check-in activity — something that takes 10-15 minutes and helps them notice how they are actually learning, not just what they are learning.",
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"ref", label:"Reflection" },
      { id:"str", label:"Learning Strategy" },
      { id:"tf",  label:"Transfer" },
      { id:"aut", label:"Student Autonomy" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member build metacognitive skills into their asynchronous course.
When the instructor writes a prompt, respond with a practical, low-barrier metacognitive activity suited to online learning. Be warm and specific.
After your main response, add a short section called "Course Quality Check" noting which are addressed: Clear Objectives, Reflection, Learning Strategy, Transfer, Student Autonomy.
Coaching: vague prompts get generic journaling suggestions. Specific prompts that name the course level, duration, and what metacognitive struggle looks like for their students get rich, tailored activities with explicit praise.`
  },

  // ── S3: AUTHENTIC ASSESSMENT ──────────────────────────
  {
    desc: "Your online students are completing assessments that feel disconnected from professional practice. Use AI to help design an authentic assessment that asks students to demonstrate applied competency, not just recall.",
    testPrompt: "I teach an online upper-division business communication course (fully asynchronous, 15 weeks). Students currently submit traditional essay exams but I want to replace the midterm with an authentic assessment that mirrors real workplace writing. Students have varying professional backgrounds — some are working adults, some are traditional students. Assessment should be completable asynchronously.",
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"aut", label:"Authentic Tasks" },
      { id:"fb",  label:"Feedback Design" },
      { id:"age", label:"Student Agency" },
      { id:"ali", label:"Alignment" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member design authentic assessments for asynchronous courses.
When the instructor writes a prompt, respond with a practical, course-ready authentic assessment design. Be warm and specific.
After your main response, add a short section called "Course Quality Check" noting which are addressed: Clear Objectives, Authentic Tasks, Feedback Design, Student Agency, Alignment.
Coaching: vague prompts get generic project ideas. Specific prompts that name the discipline, course level, student population, and delivery mode get excellent, realistic assessment designs with explicit praise.`
  },

  // ── S5: HALLUCINATION HUNT (index 4) ────────────────────────────
  {
    desc: "A colleague shares an AI-generated faculty development workshop agenda on evidence-based online teaching strategies. It looks polished and cites research. Read it carefully.",
    isCriticalThinking: true,
    prewrittenResponse: `**Faculty Development Workshop: Evidence-Based Strategies for Online Teaching**
*A Half-Day Professional Development Experience*

**Workshop Overview**
This workshop introduces faculty to the most current, research-backed strategies for effective online course design and facilitation. Participants will leave with practical tools they can implement in their courses immediately.

**Learning Objectives**
By the end of this session, participants will be able to:
1. Identify their individual learning style and adapt their teaching approach accordingly
2. Apply three evidence-based engagement strategies to their online courses
3. Design at least one activity using principles from the literature

**Morning Schedule**

*8:30 AM — Welcome and Learning Styles Inventory (45 min)*
We begin by having each faculty member complete the VARK Learning Styles Inventory. Research consistently shows that when instructors understand their own learning style preferences, they are better equipped to design content that reaches diverse learners. This activity is foundational to everything that follows.

*9:15 AM — Evidence-Based Engagement Strategies (60 min)*
Drawing on recent research in online pedagogy, we will explore three high-impact strategies:
- Structured discussion protocols that increase meaningful peer interaction
- Spaced retrieval practice embedded in module design
- Transparent assignment design (TILT framework)

Supporting research: Chen, R. & Alvarez, M. (2021). Evidence-based practices in online faculty development: A meta-analysis. *Journal of Online Learning Research and Practice, 8*(3), 44-67.

*10:15 AM — Break (15 min)*

*10:30 AM — Application and Course Mapping (45 min)*
Participants apply workshop strategies directly to one of their current courses using a structured planning template.

**Materials Provided**
- VARK Learning Styles Inventory (printed)
- Strategy reference card
- Course mapping template`,
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"ev",  label:"Evidence-Based" },
      { id:"ctx", label:"Online Context" },
      { id:"fea", label:"Feasibility" },
      { id:"src", label:"Verified Sources" },
    ],
    system: `You are an AI assistant helping design faculty professional development workshops on online teaching.`
  },

  // ── S6: PREDICT THE OUTPUT (index 5) ────────────────────────────
  {
    desc: "An instructor sent this prompt to an AI course design assistant: 'Help me make my online course better.' Before seeing what happened — what do you predict the AI gave them?",
    isPrediction: true,
    badPrompt: "Help me make my online course better.",
    badResponse: `Of course! Here are some tips to improve your online course:

**General Best Practices:**
1. Add more multimedia content like videos and images
2. Make sure your content is organized clearly
3. Communicate regularly with students
4. Provide timely feedback on assignments
5. Include interactive elements

**Engagement Tips:**
- Consider adding discussion forums
- Use quizzes to check understanding
- Break content into smaller chunks

**Technical Suggestions:**
- Ensure your LMS navigation is intuitive
- Test all links before the course starts
- Make sure videos are captioned

Let me know if you would like more specific advice on any of these areas!`,
    predictionOptions: [
      { id: 'generic',    text: "The AI gave a generic list of best practices with no connection to the actual course" },
      { id: 'refused',    text: "The AI asked several clarifying questions before responding" },
      { id: 'excellent',  text: "The AI gave a detailed, specific improvement plan" },
    ],
    correctPrediction: 'generic',
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"sub", label:"Course Specific" },
      { id:"ctx", label:"Learner Context" },
      { id:"lvl", label:"Level Appropriate" },
      { id:"fmt", label:"Actionable Steps" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member improve a specific aspect of their online course.

When the instructor writes an improved prompt, respond with a practical, specific course improvement recommendation. Be warm and encouraging.

After your main response, add a short section called "Course Quality Check" noting which are addressed: Clear Objectives, Course Specific, Learner Context, Level Appropriate, Actionable Steps.

Coaching: reference specifically what they added to the prompt compared to "Help me make my online course better." Praise concrete improvements like naming the LMS, the course level, the student population, or a specific problem they want to solve.`
  },

  // ── S6: SYNCHRONOUS ASSUMPTION BIAS ──────────────────
  {
    desc: "A curriculum committee used AI to redesign a fully asynchronous online program's capstone course. Read what the AI proposed — notice what it assumes about how your students learn and meet.",
    isBiasScenario: true,
    biasedResponse: `**Capstone Course Redesign — COMM 495: Professional Capstone**
*A Comprehensive Redesign for Maximum Student Engagement*

**Course Overview**
This redesigned capstone creates a dynamic, high-energy culminating experience through intensive real-time collaboration and professional simulation.

**Weekly Schedule**
- Monday 6:00-8:00 PM: Full cohort live session via Zoom (attendance mandatory)
- Wednesday: Small group live check-ins (30 min, scheduled individually)
- Friday: Optional but strongly encouraged live office hours

**Signature Assignments**
1. Live pitch presentation to a panel of industry guests (Week 12, mandatory real-time)
2. Real-time peer review sessions — students must be present simultaneously
3. In-person or live capstone symposium for final presentations

**Collaboration Requirements**
- Students must form teams and meet synchronously at least 3 times per week
- Team contracts must include shared availability windows
- All major feedback happens in live sessions for "authentic professional experience"

**Technology Stack**
- Zoom for all synchronous sessions
- Google Workspace (assumes all students have personal Google accounts)
- Slack for real-time team messaging (requires app download on personal device)
- Miro for live collaborative whiteboarding sessions

**Research Support**
Studies by Harrison & Polk (2020) in the Journal of Synchronous Learning confirm that real-time interaction produces 40% higher capstone quality scores than asynchronous alternatives.`,
    oscqr: [
      { id:"ctx", label:"Async-Friendly" },
      { id:"acc", label:"Access & Equity" },
      { id:"fle", label:"Flexibility" },
      { id:"inc", label:"Inclusive Design" },
      { id:"fea", label:"Feasibility" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member or instructional designer redesign a course that actually works for asynchronous online learners.

When the instructor writes a revised prompt that explicitly names asynchronous constraints, varied student schedules, or equity concerns, respond with a practical, truly async-first capstone design.

After your main response, add a short section called "Course Quality Check" noting which are addressed: Async-Friendly, Access & Equity, Flexibility, Inclusive Design, Feasibility.

Coaching: compare explicitly what changed between the synchronous-assumption response and this one. Point to the specific async constraints they named that produced a more equitable design.`
  },

  // ── S7: OVERRELIANCE ─────────────────────────────────
  {
    desc: "You asked AI to help design a unit on academic integrity for your online first-year experience course. The response looks genuinely impressive. Your task is not to improve it — it is to decide what is safe to use, what needs your judgment, and what must come from you.",
    isOverreliance: true,
    prewrittenResponse: `**Unit 3: Academic Integrity in the Digital Age**
*A Complete 2-Week Unit for FYE 101 — Online Section*

**Unit Overview**
This unit helps first-year students understand academic integrity not as a set of rules to avoid breaking but as a professional identity to develop. Students will examine real cases, reflect on their own practices, and build habits that will serve them throughout their academic and professional careers.

**Learning Objectives**
By the end of this unit, students will be able to:
1. Define academic integrity and explain why it matters beyond avoiding penalties
2. Identify at least three forms of academic dishonesty including AI-assisted work without attribution
3. Apply institutional guidelines to ambiguous real-world scenarios
4. Articulate a personal academic integrity philosophy in writing

**Week 1: Understanding the Landscape**

*Module 3.1 — What Counts? (Est. 45 min)*
Students read two short case studies: a student who paraphrased without citation and a student who used AI to draft an email to a professor. Discussion prompt: "Which of these is a violation, and does your answer change based on context?" Students post an initial response and reply to two peers.

*Module 3.2 — Your Institution's Standards (Est. 30 min)*
Students locate and read their institution's academic integrity policy. They complete a short quiz confirming they have reviewed the key sections.

*Module 3.3 — Gray Areas (Est. 60 min)*
Students work through five scenario cards (provided below) ranging from clearly acceptable to clearly unacceptable, with several deliberately ambiguous cases in the middle. They submit a 200-word reflection on which scenario was hardest to classify and why.

**Week 2: Building Your Practice**

*Module 3.4 — AI and Integrity (Est. 45 min)*
This module directly addresses AI tool use. Students read your institution's AI policy and respond to: "Where is the line between using AI as a tool and using it as a substitute for your own thinking?"

*Module 3.5 — Integrity Pledge (Est. 20 min)*
Students draft a personal academic integrity statement (150-200 words) describing their own standards, including how they will handle AI tools in their academic work.

**Assessment**
- Discussion participation: 40 points (graded on substance, not length)
- Gray Areas reflection: 30 points
- Personal Integrity Pledge: 30 points

**Scenario Cards (for Module 3.3)**
Scenario A: A student uses Grammarly to fix grammar errors on a final essay.
Scenario B: A student asks ChatGPT to explain a concept they do not understand, then writes their response in their own words.
Scenario C: A student submits an essay outline generated by AI and fills in the content themselves.
Scenario D: A student finds a well-written paragraph online that perfectly captures their point and paraphrases it very closely without citation.
Scenario E: Two students in different sections of the same course share notes and their submissions end up very similar.`,
    overrelianceItems: [
      {
        id: 'policy',
        section: 'Module 3.2 and Module 3.4',
        label: "Your institution's actual policies",
        verdict: 'must_be_original',
        explanation: "The AI references your institution's academic integrity policy and AI policy as if they exist — but it has no idea what your institution actually says. These must come from you. Using placeholder language here would give students incorrect information."
      },
      {
        id: 'cases',
        section: 'Module 3.1 case studies',
        label: 'Real cases from your course context',
        verdict: 'needs_judgment',
        explanation: 'The AI invented two generic case studies. They are serviceable, but cases drawn from situations your students actually encounter — in their program, their discipline, or your specific LMS context — will land far better. This is where your professional knowledge adds real value.'
      },
      {
        id: 'pledge',
        section: 'Module 3.5 Integrity Pledge',
        label: 'The personal integrity pledge activity',
        verdict: 'safe_to_use',
        explanation: 'This is a well-established reflective activity that does not require your institutional knowledge. The format is sound and the prompt is appropriate. This is genuinely safe to use as-is or with minor adjustments.'
      },
      {
        id: 'scenarios',
        section: 'Scenario Cards A-E',
        label: 'The five gray area scenario cards',
        verdict: 'needs_judgment',
        explanation: 'These are reasonable starting points but Scenario B and C directly involve AI tools — and whether those are violations depends entirely on your course policies and your own stance as an instructor. The AI cannot know what you have communicated to students. You need to review and own these explicitly.'
      },
      {
        id: 'objectives',
        section: 'Learning Objectives 1-4',
        label: 'Learning objectives and overall structure',
        verdict: 'safe_to_use',
        explanation: 'The learning objectives are well-written and align with what this unit should accomplish. The two-week structure is sound. These are safe to use as a starting framework — though you may want to align objective 3 specifically with your institutional language.'
      }
    ],
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"ali", label:"Alignment" },
      { id:"ctx", label:"Institutional Context" },
      { id:"jdg", label:"Professional Judgment" },
      { id:"aut", label:"Original Voice" },
    ],
  },

  // ── S8: REFLECT AND REVISE ───────────────────
  {
    desc: "Your online students are completing coursework but not pausing to notice how they are actually learning. Use AI to design a brief, low-stakes reflection activity that helps students identify their own patterns and carry one insight forward into the next unit. Then you will reflect on your own prompt and revise it.",
    testPrompt: "My learners are online students in a 16-week asynchronous introductory biology course. Students complete weekly lab write-ups but never revisit or compare them to earlier work. Format and constraints: under 15 minutes, fully asynchronous, no extra tools required. After the activity, students should be able to name one specific way their thinking or method has changed and carry one strategy into the next unit.",
    reflectionQuestions: [
      "Why did you write your prompt that way?",
      "What worked in the AI response?",
      "What fell short or surprised you?"
    ],
    oscqr: [
      { id:"obj", label:"Clear Objectives" }, { id:"ref", label:"Reflection" },
      { id:"str", label:"Learning Strategy" }, { id:"aut", label:"Student Autonomy" },
      { id:"iter", label:"Iterative Practice" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member design meaningful reflection activities for asynchronous courses.

PHASE 1 — Initial prompt: Respond with a practical, course-ready metacognitive activity. Be warm, specific, and concrete. Use **bold headers** for each section. Short paragraphs only.

PHASE 2 — Revised prompt (you will see the instructor's self-reflection in the prior messages): Your job is to (1) briefly name what specifically improved between the two versions, (2) respond to the revised prompt with a refined activity, and (3) note one thing they could push further. Be direct and coaching-focused. Reference their own reflection if they named something specific.

In BOTH phases: after your main response add a short "Course Quality Check" section noting which are addressed: Clear Objectives, Reflection, Learning Strategy, Student Autonomy, Iterative Practice. Do NOT include numbers, scores, or fractions.`
  }
];

// ══════════════════════════════════════════════════════
//  PROFESSOR PIXEL — INLINE CHAT DIALOGUE SYSTEM
// ══════════════════════════════════════════════════════

const PIXEL_EXPR = {
  neutral:     'images/pixel-neutral.png',
  thinking:    'images/pixel-thinking.png',
  excited:     'images/pixel-excited.png',
  encouraging: 'images/pixel-encouraging.png',
  skeptical:   'images/pixel-skeptical.png',
  proud:       'images/pixel-proud.png',
};

let lastScore = -1;
let coachDismissTimer = null;

// ── BADGE (keeps the persistent corner presence) ──────
function pixelBadgeSetExpr(expr) {
  const src = PIXEL_EXPR[expr] || PIXEL_EXPR.neutral;
  const img = document.getElementById('pixelBadgeImg');
  const coachImg = document.getElementById('pixelCoachImg');
  img.src = src;
  if (coachImg) coachImg.src = src;
  img.classList.remove('reacting');
  void img.offsetWidth;
  img.classList.add('reacting');
  setTimeout(() => img.classList.remove('reacting'), 600);
}

function pixelBadgeClick() {
  const card = document.getElementById('pixelCoachCard');
  if (card.classList.contains('visible')) {
    pixelCoachDismiss();
  } else if (document.getElementById('pixelCoachMsg').textContent) {
    card.classList.add('visible');
    clearTimeout(coachDismissTimer);
    coachDismissTimer = setTimeout(pixelCoachDismiss, 6000);
  }
}

function pixelCoachDismiss() {
  document.getElementById('pixelCoachCard').classList.remove('visible');
}

// ── AI BUBBLE AVATAR ──────────────────────────────────
function pixelAvatarHTML(expr) {
  const src = PIXEL_EXPR[expr] || PIXEL_EXPR.neutral;
  return `
    <img class="pixel-chat-avatar"
         src="${src}"
         alt="Professor Pixel"
         onerror="this.outerHTML='<div class=\\'pixel-chat-avatar-fallback\\'>🧑‍🏫</div>'" />`;
}

// ── INLINE PIXEL CHAT RESPONSE ────────────────────────
// Shows thinking indicator, then a tap-to-reveal button,
// then fetches a genuine AI-generated response from Pixel
function schedulePixelResponse(playerPrompt, aiReply, score, scenarioDesc) {
  const area = document.getElementById('chat');

  // Step 1 — thinking indicator appears after 4 seconds
  let thinkingEl = null;
  const thinkTimer = setTimeout(() => {
    thinkingEl = document.createElement('div');
    thinkingEl.className = 'pixel-thinking-row';
    thinkingEl.id = 'pixelThinking';
    const tSrc = PIXEL_EXPR.thinking;
    thinkingEl.innerHTML = `
      <img class="pixel-thinking-avatar" src="${tSrc}" alt=""
           onerror="this.style.display='none'" />
      <span class="pixel-thinking-text">
        Professor Pixel is thinking
        <span class="pixel-thinking-dots">
          <span></span><span></span><span></span>
        </span>
      </span>`;
    area.appendChild(thinkingEl);
    area.scrollTop = area.scrollHeight;

    // Step 2 — reveal button replaces thinking after 2 more seconds
    setTimeout(() => {
      if (thinkingEl && thinkingEl.parentNode) {
        thinkingEl.remove();
      }
      showPixelRevealButton(playerPrompt, aiReply, score, scenarioDesc, area);
    }, 2000);

  }, 4000);

  // Store timer so we can cancel if scenario switches
  area._pixelThinkTimer = thinkTimer;
}

function showPixelRevealButton(playerPrompt, aiReply, score, scenarioDesc, area) {
  const btnWrap = document.createElement('div');
  btnWrap.id = 'pixelRevealWrap';
  btnWrap.style.cssText = 'display:flex;padding:2px 0;animation:slideUp 0.3s ease forwards;opacity:0;';

  const expr = score <= 1 ? 'skeptical' : score <= 3 ? 'encouraging' : 'excited';
  const rSrc = PIXEL_EXPR[expr];

  const btn = document.createElement('button');
  btn.className = 'pixel-reveal-btn';
  btn.setAttribute('aria-label', "Hear Professor Pixel's thoughts on your prompt");

  // Store data directly on the element -- avoids HTML attribute escaping issues
  btn._pixelData = { playerPrompt, aiReply: aiReply.substring(0, 1800), score, scenarioDesc };

  btn.innerHTML = `
    <img class="pixel-reveal-avatar" src="${rSrc}" alt="Professor Pixel"
         onerror="this.style.display='none'" />
    Professor Pixel has thoughts — tap to hear them
    <span class="pixel-reveal-arrow">›</span>`;

  btn.addEventListener('click', () => triggerPixelResponse(btn));

  btnWrap.appendChild(btn);
  area.appendChild(btnWrap);
  area.scrollTop = area.scrollHeight;
}

async function triggerPixelResponse(btn) {
  // Read data stored directly on the button element
  const { playerPrompt, aiReply, score, scenarioDesc } = btn._pixelData || {};
  if (!playerPrompt) return;

  const wrap = btn.closest('#pixelRevealWrap') || btn.parentNode;
  const area = document.getElementById('chat');

  const loadExpr = score <= 1 ? 'skeptical' : score <= 3 ? 'encouraging' : 'excited';
  const loadSrc = PIXEL_EXPR[loadExpr];

  const loadWrap = document.createElement('div');
  loadWrap.className = 'message pixel';
  loadWrap.innerHTML = `
    <img class="pixel-chat-avatar" src="${loadSrc}" alt="Professor Pixel"
         onerror="this.outerHTML='<div class=\\'pixel-chat-avatar-fallback\\'>🧑‍🏫</div>'" />
    <div class="bubble-wrap">
      <div class="bubble-sender" style="color:var(--forest-mid);">Professor Pixel</div>
      <div class="bubble pixel-loading-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;

  wrap.replaceWith(loadWrap);
  area.scrollTop = area.scrollHeight;

  // Update badge expression
  pixelBadgeSetExpr(loadExpr);

  try {
    // Build a contextual system prompt for Pixel
    const pixelSystem = `You are Professor Pixel, a warm, sharp, and genuinely helpful instructional design coach inside a training game for rural educators. You are reviewing a prompt that an educator just wrote and the AI response it generated.

Your job is to give feedback that is:
- Specific to THIS prompt and THIS response — never generic
- Warm but honest — you notice what worked and what did not
- Building on the conversation — reference actual words or phrases from their prompt
- Focused on ONE main insight and ONE actionable question to push them forward
- Short — 2 to 4 sentences maximum, then a follow-up question on a new line

The scenario they are working on: "${scenarioDesc}"

Their prompt score was ${score} out of 5 based on: learner context, clear goal, course context, constraints, and detail.

Do NOT use phrases like "Great job" or "Well done" as openers — get straight to the specific observation. Do NOT list multiple tips. Do NOT mention that the response is an excerpt, cuts off, or is incomplete — treat it as the full response. End with a single italicised follow-up question on its own line, preceded by a line break, that pushes them toward their next attempt.`;

    const data = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 220,
      system: pixelSystem,
      messages: [{
        role: 'user',
        content: `Educator's prompt: "${playerPrompt}"\n\nAI response they received:\n"${aiReply}"`
      }]
    }, 'pixel');
    if (data.error || !data.content) throw new Error(data.error?.message || 'No response');

    const pixelReply = data.content[0].text;

    // Render Pixel's response inline
    loadWrap.querySelector('.pixel-loading-bubble').innerHTML = fmt(pixelReply);

    // Update badge
    pixelBadgeSetExpr(loadExpr);
    document.getElementById('pixelBadgeLabel').textContent = loadExpr;

  } catch(e) {
    // Graceful fallback if API call fails
    loadWrap.querySelector('.pixel-loading-bubble').textContent =
      "Hmm, I lost my train of thought — take a look at the Prompt Analysis panel and try another attempt.";
  }

  area.scrollTop = area.scrollHeight;
}

// ══════════════════════════════════════════════════════
//  LEGACY S4/S5 CRITICAL THINKING HELPERS
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
//  SCENARIO NAVIGATION
//  A "Move to next scenario" card appears in the chat
//  once the player hits a score of 3+ on any attempt.
//  They can keep practicing or move forward.
// ══════════════════════════════════════════════════════

// Track whether nav card has been shown for current scenario
let navCardShown = [false, false, false, false, false, false, false, false];

const SCENARIO_NAMES = [
  'S2: Metacognition',
  'S3: Assessment',
  'S4: Hallucination Hunt',
  'S5: Predict the Output',
  'S6: Synchronous Bias',
  'S7: Overreliance',
  'S8: Reflect and Revise',
  null
];
const SCORE_THRESHOLD = 3; // score out of 5 needed to show nav card

function maybeShowNavCard(score) {
  // S4 has its own nav card shown in addPixelS4Closing -- skip here
  if (scenarioIndex === 3) return;
  // S8 is the last scenario -- leads to reflection room, no nav card
  if (scenarioIndex >= 7) return;

  if (navCardShown[scenarioIndex]) return;
  if (score < SCORE_THRESHOLD) return;

  navCardShown[scenarioIndex] = true;

  const nextName = SCENARIO_NAMES[scenarioIndex];
  if (!nextName) return;

  const area = document.getElementById('chat');
  const card = document.createElement('div');
  card.style.cssText = 'margin-top:6px;';
  card.innerHTML = `
    <div class="scenario-nav-card">
      <div class="scenario-nav-text">
        <div class="scenario-nav-title">Ready to move on?</div>
        <div class="scenario-nav-sub">Your prompts are getting stronger. ${nextName} is waiting.</div>
      </div>
      <button class="scenario-nav-btn"
              onclick="navigateToNext(${scenarioIndex + 1})"
              aria-label="Move to ${nextName}">
        Next scenario →
      </button>
    </div>
    <button class="scenario-keep-link"
            onclick="this.closest('div').remove()"
            aria-label="Keep practicing this scenario">
      Keep practicing this one first
    </button>`;

  area.appendChild(card);
  area.scrollTop = area.scrollHeight;
}

let s4InterruptFired = false;
let s4SelfReportAnswer = '';

function unlockScenario4() {
  const btn = document.getElementById('s4Tab');
  if (!btn || !btn.classList.contains('locked')) return;
  btn.classList.remove('locked');
  btn.classList.add('unlocked-s4');
  btn.disabled = false;
  btn.removeAttribute('aria-disabled');
  btn.textContent = '⚖️ S4: Sync Bias';
  btn.onclick = () => switchScenario(3, btn);

  pixelBadgeSetExpr('thinking');
  document.getElementById('pixelBadgeLabel').textContent = 'curious';

  setTimeout(() => {
    document.getElementById('pixelCoachMsg').textContent =
      "Scenario 4 is now unlocked. Watch out — this AI has some assumptions baked in.";
    document.getElementById('pixelCoachCard').classList.add('visible');
    clearTimeout(coachDismissTimer);
    coachDismissTimer = setTimeout(pixelCoachDismiss, 8000);
  }, 600);
}

async function sendScenario4(text) {
  s4InterruptFired = false;
  scenarioData[4].attempts++;
  scenarioData[4].prompts.push(text);

  document.getElementById('attNum').textContent = scenarioData[4].attempts;
  if (scenarioIndex === 0) {
    addMsg('user', '<strong>Discussion repair brief submitted.</strong><br><span style="opacity:.8">Learner context, problem diagnosis, interaction move, and constraints sent to Claude.</span>');
  } else {
    addMsg('user', esc(text));
  }
  const input = document.getElementById('promptInput');
  if (input) { input.value = ''; input.style.height = 'auto'; }
  history.push({ role: 'user', content: text });
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  addTyping();

  try {
    const data = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: scenarios[4].system,
      messages: history
    }, 'main');
    removeTyping();

    if (data.error) {
      addMsg('ai', `<span style="color:var(--red)">Error: ${data.error.message}</span>`, 'neutral');
      document.getElementById('sendBtn').disabled = false;
      return;
    }

    const reply = data.content[0].text;
    history.push({ role: 'assistant', content: reply });
    scenarioData[4].finalResponse = reply.substring(0, 300);

    addMsg('ai', fmt(reply), 'neutral');

    // Pixel interrupts after the player has a moment to read
    setTimeout(() => fireS4Interrupt(), 2000);

  } catch(e) {
    removeTyping();
    addMsg('ai', `<span style="color:var(--red)">Something went wrong. Please try again.</span>`, 'neutral');
  } finally {
    document.getElementById('sendBtn').disabled = false;
  }
}

function fireS4Interrupt() {
  if (s4InterruptFired) return;
  s4InterruptFired = true;
  playSound('s4Interrupt');
  const area = document.getElementById('chat');

  const interruptDiv = document.createElement('div');
  interruptDiv.className = 'pixel-interrupt';
  const src = PIXEL_EXPR['skeptical'] || 'images/pixel-skeptical.png';
  interruptDiv.innerHTML = `
    <img class="pixel-interrupt-avatar" src="${src}" alt="Professor Pixel"
         onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
    <div style="flex:1;min-width:0;">
      <div class="pixel-interrupt-sender">Professor Pixel — hold on</div>
      <div class="pixel-interrupt-bubble">
        Wait. Before you use any of that — did something seem off to you?
        Read it again carefully. I want you to think critically about what the AI just told you.
      </div>
    </div>`;
  area.appendChild(interruptDiv);
  area.scrollTop = area.scrollHeight;

  pixelBadgeSetExpr('skeptical');
  document.getElementById('pixelBadgeLabel').textContent = 'skeptical';

  setTimeout(() => showS4SelfReport(area), 1400);
}

function showS4SelfReport(area) {
  const div = document.createElement('div');
  div.className = 's4-self-report';
  div.innerHTML = `
    <div class="s4-self-report-q">
      Before I explain — did you notice anything that seemed questionable in that response?
    </div>
    <div class="s4-self-report-btns">
      <button class="s4-btn" onclick="s4SelectReport(this,'yes_noticed')">Yes, something seemed off</button>
      <button class="s4-btn" onclick="s4SelectReport(this,'no_missed')">It seemed fine to me</button>
      <button class="s4-btn" onclick="s4SelectReport(this,'unsure')">I was not sure</button>
    </div>`;
  area.appendChild(div);
  if (document.body.classList.contains('s1-result-active')) {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  } else {
    area.scrollTop = area.scrollHeight;
  }
}

function s4SelectReport(btn, answer) {
  s4SelfReportAnswer = answer;
  scenarioData[4].selfReport = answer;
  btn.closest('.s4-self-report-btns').querySelectorAll('.s4-btn').forEach(b => {
    b.classList.remove('selected');
    b.disabled = true;
  });
  btn.classList.add('selected');
  setTimeout(() => showS4Reveal(), 700);
}

function showS4Reveal() {
  const area = document.getElementById('chat');
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="reveal-panel">
      <div class="reveal-header">🔍 What was wrong with that response</div>
      <div class="reveal-body">
        <div class="reveal-item">
          <div class="reveal-item-label">📄 Problem 1: Fabricated Citation</div>
          <div class="reveal-item-text">
            The AI cited <strong>"Chen, R. & Alvarez, M. (2021). Evidence-based practices in online faculty development: A meta-analysis. Journal of Online Learning Research and Practice, 8(3), 44-67."</strong>
            This journal does not exist. This study was never published. The authors are invented.
            AI systems can generate citations that look completely real but lead nowhere — this is called
            <strong>hallucination</strong>. Always verify citations independently before using them in professional or academic work.
          </div>
        </div>
        <div class="reveal-item">
          <div class="reveal-item-label">🧠 Problem 2: Recommends a Debunked Theory</div>
          <div class="reveal-item-text">
            The workshop agenda features a <strong>learning styles inventory</strong> as a research-backed best practice.
            This is scientifically debunked. Researchers including Pashler et al. (2008) and Rogowsky et al. (2015)
            have found no evidence that matching instruction to VAK/VARK learning styles improves outcomes.
            The theory is widespread in professional development but not supported by the evidence.
            The AI presented it confidently as current best practice. Fluency and confidence do not equal accuracy.
          </div>
        </div>
      </div>
    </div>

    <div class="reveal-panel" style="margin-top:10px;border-left-color:var(--forest-mid);">
      <div class="reveal-header" style="background:var(--forest-light);color:var(--forest-dark);border-color:rgba(45,90,61,0.2);">
        ✅ How to verify AI output — your checklist
      </div>
      <div class="reveal-body">
        <div class="literacy-tip">
          <div class="literacy-tip-icon">🔎</div>
          <div><strong>Search the citation.</strong> Paste it into Google Scholar or your library database. If it does not appear, do not use it.</div>
        </div>
        <div class="literacy-tip">
          <div class="literacy-tip-icon">📚</div>
          <div><strong>Cross-check claims with the literature.</strong> Does this align with what you know from peer-reviewed ID research? Learning styles is a well-known example of a persistent myth the AI will confidently repeat.</div>
        </div>
        <div class="literacy-tip">
          <div class="literacy-tip-icon">💬</div>
          <div><strong>Ask the AI to show its work.</strong> Try: "What peer-reviewed sources support this recommendation?" If it cannot name real ones, treat the claim with caution.</div>
        </div>
        <div class="literacy-tip">
          <div class="literacy-tip-icon">🧐</div>
          <div><strong>Apply professional judgment.</strong> You are the instructional design expert. AI does not know the current state of your field. You do.</div>
        </div>
      </div>
    </div>`;
  area.appendChild(div);
  if (document.body.classList.contains('s1-result-active')) {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  } else {
    area.scrollTop = area.scrollHeight;
  }

  setTimeout(() => addPixelS4Closing(area), 3500);
}

function addPixelS4Closing(area) {
  playSound('s4Reveal');
  const div = document.createElement('div');
  div.className = 'pixel-interrupt';
  const src = PIXEL_EXPR['proud'] || 'images/pixel-proud.png';
  div.innerHTML = `
    <img class="pixel-interrupt-avatar" src="${src}" alt="Professor Pixel"
         style="border-color:var(--forest-mid);"
         onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
    <div style="flex:1;min-width:0;">
      <div class="pixel-interrupt-sender">Professor Pixel</div>
      <div class="pixel-interrupt-bubble" style="background:var(--forest-light);border-color:rgba(45,90,61,0.3);color:var(--forest-dark);">
        This is the most important thing I can teach you about working with AI.
        Being a great AI prompter is not just about asking better questions —
        it is about knowing when to question the answers.
      </div>
    </div>`;
  area.appendChild(div);
  if (document.body.classList.contains('s1-result-active')) {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  } else {
    area.scrollTop = area.scrollHeight;
  }

  pixelBadgeSetExpr('proud');
  document.getElementById('pixelBadgeLabel').textContent = 'proud';

  // Score S5 (Hallucination) based on self-report for data consistency
  const s5Score = s4SelfReportAnswer === 'yes_noticed' ? 5
                : s4SelfReportAnswer === 'unsure'       ? 3 : 1;
  scenarioData[4].bestScore = s5Score;
  saveIncrementalData(4);

  // Nav card pointing to S5 appears after Pixel's message
  setTimeout(() => {
    const navDiv = document.createElement('div');
    navDiv.style.cssText = 'margin-top:6px;';
    navDiv.innerHTML = `
      <div class="scenario-nav-card">
        <div class="scenario-nav-text">
          <div class="scenario-nav-title">Ready to keep going?</div>
          <div class="scenario-nav-sub">Scenario 5 will test your mental model of how AI thinks.</div>
        </div>
        <button class="scenario-nav-btn"
                onclick="navigateToNext(4)"
                aria-label="Move to Scenario 5">
          Next scenario →
        </button>
      </div>
      <button class="scenario-keep-link"
              onclick="this.closest('div').remove()"
              aria-label="Stay here">
        Stay and review this scenario
      </button>`;
    area.appendChild(navDiv);
    area.scrollTop = area.scrollHeight;
  }, 1400);

  setTimeout(() => {
    scenarioCompleted[4] = true;
    // Wait for s4Reveal to finish before playing scenarioComplete
    const s4Sound = audioReady && sounds.s4Reveal;
    if (s4Sound && s4Sound.playing()) {
      s4Sound.once('end', () => markScenarioComplete());
    } else {
      markScenarioComplete();
    }
  }, 1200);
}

// ══════════════════════════════════════════════════════
//  S5/S6 PREDICTION STATE
// ══════════════════════════════════════════════════════

let s5PredictionDone = false;

// ══════════════════════════════════════════════════════
//  S5 — HALLUCINATION HUNT PREWRITTEN REVEAL
// ══════════════════════════════════════════════════════
function loadScenarioHallucination() {
  const s = scenarios[4];
  const area = document.getElementById('chat');

  document.getElementById('vnBoardText').textContent = s.desc;

  // Intro card
  const introDiv = document.createElement('div');
  introDiv.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;';
  introDiv.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-title">⚠️ Hallucination Hunt</div>
      <div class="welcome-body">
        Your colleague forwarded this AI-generated workshop agenda they are planning to use
        for faculty PD next month. It looks professional and cites research.
        Read it carefully before deciding whether to recommend it.
      </div>
    </div>`;
  area.appendChild(introDiv);

  // Show the pre-written flawed response
  setTimeout(() => {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message ai';
    responseDiv.innerHTML = `
      ${pixelAvatarHTML('neutral')}
      <div class="bubble-wrap">
        <div class="bubble-sender">AI-generated workshop agenda</div>
        <div class="bubble">${fmt(s.prewrittenResponse)}</div>
      </div>`;
    area.appendChild(responseDiv);
    area.scrollTop = area.scrollHeight;

    // fireS4Interrupt() is triggered by the VN intro onDone callback — not from here.
  }, 500);
}

function loadScenarioPredict() {
  const s = scenarios[5];
  const area = document.getElementById('chat');

  // Show the bad prompt on the smartboard
  document.getElementById('vnBoardText').textContent =
    `The prompt: "${s.badPrompt}"`;

  // Show the prediction card in the chat
  const div = document.createElement('div');
  div.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;';
  div.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-title">🔮 Predict the Output</div>
      <div class="welcome-body">
        Your colleague wrote this prompt to get AI help designing a quiz
        for their online biology class:<br><br>
        <div style="background:var(--forest-dark);color:#a8d5b5;font-family:'Source Code Pro',monospace;
             font-size:0.82rem;padding:10px 14px;border-radius:var(--radius);margin:8px 0;line-height:1.6;">
          "${s.badPrompt}"
        </div>
        <strong>Before you see what happened — what do you predict the AI gave them?</strong>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px;">
        ${s.predictionOptions.map(opt => `
          <button class="s4-btn" style="text-align:left;border-radius:var(--radius);padding:10px 14px;font-size:0.8rem;"
                  onclick="s5SelectPrediction(this,'${opt.id}')">
            ${opt.text}
          </button>`).join('')}
      </div>
    </div>`;
  area.appendChild(div);
  if (document.body.classList.contains('s1-result-active')) {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  } else {
    area.scrollTop = area.scrollHeight;
  }

  // Hide the normal input area until prediction is made
  const container = document.getElementById('inputContainer');
  container.style.display = 'none';
}

function s5SelectPrediction(btn, predictionId) {
  const s = scenarios[4];
  scenarioData[4].prediction = predictionId;
  const correct = predictionId === s.correctPrediction;
  scenarioData[4].predictionCorrect = correct;

  // Disable all prediction buttons
  btn.closest('[style*="flex-direction:column"]')
     .querySelectorAll('.s4-btn').forEach(b => {
    b.disabled = true;
    b.style.opacity = '0.6';
  });
  btn.style.opacity = '1';
  btn.style.background = correct ? 'var(--forest-light)' : 'var(--terra-light)';
  btn.style.borderColor = correct ? 'var(--forest-mid)' : 'var(--terracotta)';
  btn.style.color = correct ? 'var(--forest-dark)' : 'var(--terra-dark)';

  s5PredictionDone = true;

  // Reveal the actual AI response
  setTimeout(() => s5RevealResponse(correct), 600);
}

function s5RevealResponse(predictedCorrectly) {
  const s = scenarios[4];
  const area = document.getElementById('chat');

  // Pixel reacts to prediction
  const pixelDiv = document.createElement('div');
  pixelDiv.className = 'pixel-interrupt';
  const expr = predictedCorrectly ? 'excited' : 'encouraging';
  const src = PIXEL_EXPR[expr];
  const pixelMsg = predictedCorrectly
    ? "You got it — and that instinct is exactly what we are building. Now let's see the actual response."
    : "Not quite — but that is what this exercise is for. Watch what actually came back.";

  pixelDiv.innerHTML = `
    <img class="pixel-interrupt-avatar" src="${src}" alt="Professor Pixel"
         onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
    <div style="flex:1;min-width:0;">
      <div class="pixel-interrupt-sender">Professor Pixel</div>
      <div class="pixel-interrupt-bubble">${pixelMsg}</div>
    </div>`;
  area.appendChild(pixelDiv);
  pixelBadgeSetExpr(expr);

  // Show the bad AI response
  setTimeout(() => {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message ai';
    responseDiv.innerHTML = `
      ${pixelAvatarHTML('skeptical')}
      <div class="bubble-wrap">
        <div class="bubble-sender">AI response (to the vague prompt)</div>
        <div class="bubble" style="opacity:0.85;border-style:dashed;">${fmt(s.badResponse)}</div>
      </div>`;
    area.appendChild(responseDiv);
    area.scrollTop = area.scrollHeight;

    // Now reveal the input to write a better prompt
    setTimeout(() => {
      const followDiv = document.createElement('div');
      followDiv.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;';
      followDiv.innerHTML = `
        <div class="pixel-interrupt">
          <img class="pixel-interrupt-avatar" src="${PIXEL_EXPR['encouraging']}" alt="Professor Pixel"
               onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
          <div style="flex:1;min-width:0;">
            <div class="pixel-interrupt-sender">Professor Pixel</div>
            <div class="pixel-interrupt-bubble">
              Now you try. Write a better prompt for the same goal —
              designing a quiz for an online biology class.
              Show the AI who the learners are, what kind of quiz you need, and any constraints.
            </div>
          </div>
        </div>`;
      area.appendChild(followDiv);
      area.scrollTop = area.scrollHeight;

      // Show the input area
      const container = document.getElementById('inputContainer');
      container.style.display = '';
      renderOpenPlain(container);
      setTimeout(() => document.getElementById('promptInput')?.focus(), 100);
    }, 1200);
  }, 800);
}

// ══════════════════════════════════════════════════════
//  S4/S6 — BIAS AND CONTEXT SCREEN
// ══════════════════════════════════════════════════════

function loadScenarioSyncBias() {
  const s = scenarios[3];
  const area = document.getElementById('chat');

  // Show the biased response on smartboard
  document.getElementById('vnBoardText').textContent =
    'Read the AI-generated workshop plan below.';

  const div = document.createElement('div');
  div.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;';
  div.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-title">⚖️ Who Is This Actually For?</div>
      <div class="welcome-body">
        A PD coordinator used AI to design a technology integration workshop
        for your rural district. Read what the AI suggested — then decide
        whether it would actually work for your educators.
      </div>
    </div>`;
  area.appendChild(div);

  // Show the biased response
  setTimeout(() => {
    const biasDiv = document.createElement('div');
    biasDiv.className = 'message ai';
    biasDiv.innerHTML = `
      ${pixelAvatarHTML('neutral')}
      <div class="bubble-wrap">
        <div class="bubble-sender">AI-generated workshop plan</div>
        <div class="bubble">${fmt(s.biasedResponse)}</div>
      </div>`;
    area.appendChild(biasDiv);
    area.scrollTop = area.scrollHeight;

    // Pixel asks them to reflect
    setTimeout(() => {
      const pixelDiv = document.createElement('div');
      pixelDiv.className = 'pixel-interrupt';
      pixelDiv.innerHTML = `
        <img class="pixel-interrupt-avatar" src="${PIXEL_EXPR['skeptical']}" alt="Professor Pixel"
             onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
        <div style="flex:1;min-width:0;">
          <div class="pixel-interrupt-sender">Professor Pixel</div>
          <div class="pixel-interrupt-bubble">
            This plan looks polished — but would it actually work in your district?
            Count how many things it assumes you have that you might not.
            Then rewrite the prompt to get something that actually fits your context.
          </div>
        </div>`;
      area.appendChild(pixelDiv);
      area.scrollTop = area.scrollHeight;
      pixelBadgeSetExpr('skeptical');

      // Show input
      const container = document.getElementById('inputContainer');
      container.style.display = '';
      renderOpenPlain(container);
      setTimeout(() => document.getElementById('promptInput')?.focus(), 100);
    }, 1200);
  }, 600);
}

// ══════════════════════════════════════════════════════
//  SCENARIO UNLOCK LOGIC — updated for 6 scenarios
// ══════════════════════════════════════════════════════

function unlockScenario5() {
  const btn = document.getElementById('s5Tab');
  if (!btn || !btn.classList.contains('locked')) return;
  btn.classList.remove('locked');
  btn.disabled = false;
  btn.textContent = '⚠️ S5: Hallucination';
  btn.onclick = () => switchScenario(4, btn);
}

function unlockScenario6() {
  const btn = document.getElementById('s6Tab');
  if (!btn || !btn.classList.contains('locked')) return;
  btn.classList.remove('locked');
  btn.disabled = false;
  btn.textContent = '🔮 S6: Predict';
  btn.onclick = () => switchScenario(5, btn);
}

function unlockScenario7() {
  const btn = document.getElementById('s7Tab');
  if (!btn || !btn.classList.contains('locked')) return;
  btn.classList.remove('locked');
  btn.disabled = false;
  btn.textContent = '🧠 S7: Overreliance';
  btn.onclick = () => switchScenario(6, btn);

  setTimeout(() => {
    document.getElementById('pixelCoachMsg').textContent =
      "Scenario 7 is now unlocked. This one is the hardest — not because the AI got something wrong, but because it got it right.";
    document.getElementById('pixelCoachCard').classList.add('visible');
    clearTimeout(coachDismissTimer);
    coachDismissTimer = setTimeout(pixelCoachDismiss, 9000);
  }, 600);
}

function unlockScenario8() {
  const btn = document.getElementById('s8Tab');
  if (!btn || !btn.classList.contains('locked')) return;
  btn.classList.remove('locked');
  btn.disabled = false;
  btn.textContent = '🔁 S8: Reflect & Revise';
  btn.onclick = () => switchScenario(7, btn);
  setTimeout(() => {
    document.getElementById('pixelCoachMsg').textContent =
      "Scenario 8 is now unlocked. This one is about understanding your own thinking — not just writing a better prompt.";
    document.getElementById('pixelCoachCard').classList.add('visible');
    clearTimeout(coachDismissTimer);
    coachDismissTimer = setTimeout(pixelCoachDismiss, 9000);
  }, 600);
}

// ══════════════════════════════════════════════════════
//  SCENARIO 7 — OVERRELIANCE
// ══════════════════════════════════════════════════════

function loadScenario7() {
  const s = scenarios[6];
  const area = document.getElementById('chat');

  document.getElementById('vnBoardText').textContent =
    'Read the AI-generated unit carefully. Then make your decisions.';

  // Show the pre-written AI response
  const introDiv = document.createElement('div');
  introDiv.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;';
  introDiv.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-title">🧠 Overreliance Challenge</div>
      <div class="welcome-body">
        You asked AI to help design a unit on academic integrity for your
        online first-year experience course. Read the response below carefully.
        Your task is <strong>not</strong> to improve it — it is to decide
        what is safe to use, what needs your judgment, and what must come from you.
      </div>
    </div>`;
  area.appendChild(introDiv);

  // Show the pre-written response
  setTimeout(() => {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message ai';
    responseDiv.innerHTML = `
      ${pixelAvatarHTML('neutral')}
      <div class="bubble-wrap">
        <div class="bubble-sender">AI-generated unit plan</div>
        <div class="bubble">${fmt(s.prewrittenResponse)}</div>
      </div>`;
    area.appendChild(responseDiv);
    area.scrollTop = area.scrollHeight;

    // Pixel prompts the decision task
    setTimeout(() => {
      const pixelDiv = document.createElement('div');
      pixelDiv.className = 'pixel-interrupt';
      pixelDiv.innerHTML = `
        <img class="pixel-interrupt-avatar" src="${PIXEL_EXPR['thinking']}" alt="Professor Pixel"
             onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
        <div style="flex:1;min-width:0;">
          <div class="pixel-interrupt-sender">Professor Pixel</div>
          <div class="pixel-interrupt-bubble">
            Take a moment to read through this. It looks good — maybe very good.
            But good-looking AI output is exactly where overreliance happens.
            For each section below, tell me: is it safe to use, does it need your judgment, or must it be original?
          </div>
        </div>`;
      area.appendChild(pixelDiv);
      area.scrollTop = area.scrollHeight;
      pixelBadgeSetExpr('thinking');

      // Show decision cards
      setTimeout(() => showS7DecisionCards(area), 1200);
    }, 1000);
  }, 500);
}

function showS7DecisionCards(area) {
  const s = scenarios[6];
  const container = document.createElement('div');
  container.id = 's7DecisionContainer';
  container.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin:8px 0;animation:slideUp 0.35s ease forwards;opacity:0;';

  const choices = [
    { value: 'safe_to_use',    label: '✓ Safe to use',         color: 'var(--forest-light)', border: 'var(--forest-mid)', text: 'var(--forest-dark)' },
    { value: 'needs_judgment', label: '⚠ Needs my judgment',   color: 'var(--amber-light)',  border: 'var(--amber)',      text: 'var(--amber-dark)' },
    { value: 'must_be_original', label: '✕ Must be original', color: '#fdf0ef',             border: 'var(--terracotta)', text: '#8b2a1a' },
  ];

  s.overrelianceItems.forEach(item => {
    const card = document.createElement('div');
    card.style.cssText = `
      background:var(--chalk);border:1.5px solid var(--border);
      border-radius:var(--radius-lg);padding:12px 14px;`;
    card.innerHTML = `
      <div style="font-family:'Fraunces',serif;font-size:0.82rem;font-weight:700;color:var(--ink);margin-bottom:4px;">
        ${item.label}
      </div>
      <div style="font-family:'Source Code Pro',monospace;font-size:0.6rem;color:var(--ink-muted);margin-bottom:10px;letter-spacing:0.06em;">
        ${item.section}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${choices.map(ch => `
          <button class="s4-btn s7-choice"
                  data-item="${item.id}" data-choice="${ch.value}"
                  style="font-size:0.72rem;padding:6px 12px;min-height:38px;"
                  onclick="s7SelectChoice(this,'${item.id}','${ch.value}')">
            ${ch.label}
          </button>`).join('')}
      </div>
      <div id="s7feedback-${item.id}" style="display:none;margin-top:8px;font-size:0.78rem;line-height:1.6;padding:8px 10px;border-radius:var(--radius);"></div>`;
    container.appendChild(card);
  });

  // Submit button -- disabled until all decisions made
  const submitWrap = document.createElement('div');
  submitWrap.style.cssText = 'text-align:center;padding:4px 0;';
  submitWrap.innerHTML = `
    <button id="s7SubmitBtn" class="guided-send-btn" disabled
            onclick="s7Submit()" style="min-width:180px;margin:0 auto;">
      See Pixel's Analysis →
    </button>`;
  container.appendChild(submitWrap);

  area.appendChild(container);
  area.scrollTop = area.scrollHeight;

  // Hide the normal input -- S7 uses decision cards
  document.getElementById('inputContainer').style.display = 'none';
}

// Track S7 decisions
const s7Decisions = {};

function s7SelectChoice(btn, itemId, choice) {
  // Mark selection
  const btnGroup = btn.closest('[style]').querySelectorAll('.s7-choice');
  btnGroup.forEach(b => {
    b.classList.remove('selected');
    b.disabled = true;
    b.style.opacity = '0.5';
  });
  btn.classList.add('selected');
  btn.style.opacity = '1';
  s7Decisions[itemId] = choice;
  scenarioData[6].overrelianceDecisions[itemId] = choice;

  // Show immediate inline feedback
  const s = scenarios[6];
  const item = s.overrelianceItems.find(i => i.id === itemId);
  const fb = document.getElementById(`s7feedback-${itemId}`);
  if (fb && item) {
    const correct = choice === item.verdict;
    fb.style.display = 'block';
    fb.style.background = correct ? 'var(--forest-light)' : 'var(--amber-light)';
    fb.style.borderLeft = `3px solid ${correct ? 'var(--forest-mid)' : 'var(--amber)'}`;
    fb.innerHTML = `<strong>${correct ? 'Good instinct.' : 'Worth reconsidering.'}</strong> ${item.explanation}`;
  }

  // Enable submit if all items decided
  const totalItems = s.overrelianceItems.length;
  if (Object.keys(s7Decisions).length >= totalItems) {
    const submitBtn = document.getElementById('s7SubmitBtn');
    if (submitBtn) submitBtn.disabled = false;
  }
}

function s7Submit() {
  const area = document.getElementById('chat');
  const s = scenarios[6];
  playSound('s7Closing');

  // Score: how many matched the correct verdict
  const correct = s.overrelianceItems.filter(item =>
    s7Decisions[item.id] === item.verdict
  ).length;
  const total = s.overrelianceItems.length;
  scenarioData[6].bestScore = Math.round((correct / total) * 5);

  // Disable submit button
  const submitBtn = document.getElementById('s7SubmitBtn');
  if (submitBtn) submitBtn.disabled = true;

  // Pixel's closing message — delayed so s7Closing audio finishes first
  setTimeout(() => {
    const expr = correct >= 4 ? 'proud' : correct >= 2 ? 'encouraging' : 'thinking';
    const msg = correct >= 4
      ? `${correct} out of ${total} — you have strong AI judgment. You are thinking like an expert user, not a passive consumer.`
      : correct >= 2
      ? `${correct} out of ${total}. The ones you got right show real critical thinking. The ones you missed are worth reflecting on — they are where overreliance usually happens.`
      : `This one is genuinely hard. The goal is not to avoid using AI — it is to know exactly where your judgment is irreplaceable. That awareness is the skill.`;

    const closeDiv = document.createElement('div');
    closeDiv.className = 'pixel-interrupt';
    closeDiv.innerHTML = `
      <img class="pixel-interrupt-avatar" src="${PIXEL_EXPR[expr]}" alt="Professor Pixel"
           style="border-color:var(--forest-mid);"
           onerror="this.outerHTML='<div class=\\'pixel-interrupt-fallback\\'>🧑‍🏫</div>'" />
      <div style="flex:1;min-width:0;">
        <div class="pixel-interrupt-sender">Professor Pixel</div>
        <div class="pixel-interrupt-bubble" style="background:var(--forest-light);border-color:rgba(45,90,61,0.3);color:var(--forest-dark);">
          ${msg}
        </div>
      </div>`;
    area.appendChild(closeDiv);
    pixelBadgeSetExpr(expr);
    area.scrollTop = area.scrollHeight;

    saveIncrementalData(6);
    scenarioCompleted[6] = true;

    // Unlock S8 and show the nav card — S7 never goes through the normal
    // prompt-scoring path so markScenarioComplete / maybeShowNavCard won't fire.
    unlockScenario8();
    playSound('scenarioComplete');

    // Nav card to S8
    setTimeout(() => {
      const area = document.getElementById('chat');
      const navCard = document.createElement('div');
      navCard.style.cssText = 'margin-top:6px;';
      navCard.innerHTML = `
        <div class="scenario-nav-card">
          <div class="scenario-nav-text">
            <div class="scenario-nav-title">Ready for the final scenario?</div>
            <div class="scenario-nav-sub">S8: Reflect and Revise is now unlocked.</div>
          </div>
          <button class="scenario-nav-btn"
                  onclick="navigateToNext(7)"
                  aria-label="Move to S8: Reflect and Revise">
            Next scenario →
          </button>
        </div>
        <button class="scenario-keep-link"
                onclick="this.closest('div').remove()"
                aria-label="Keep reviewing S7">
          Stay here and review
        </button>`;
      area.appendChild(navCard);
      area.scrollTop = area.scrollHeight;
    }, 1200);
  }, 400);
}
// ══════════════════════════════════════════════════════
//  SCENARIO 8 — REFLECT AND REVISE
// ══════════════════════════════════════════════════════

let s8Phase = 1;

function renderGuidedBuilderS8(container) {
  container.innerHTML = `
    <div class="scaffold-area">
      <div class="s1-mission-card mission-briefing-card" role="note" aria-label="Mission briefing">
        <div class="mission-eyebrow">Mission Briefing</div>
        <div class="mission-title">Fix the dead discussion board.</div>
        <div class="mission-copy">
          Students are posting and replying, but the conversation dies after one exchange. Use Claude to redesign the prompt so peer replies extend, challenge, or build on ideas instead of checking a box.
        </div>
      </div>

      <div class="guided-builder" id="guidedBuilderS8">
        <div class="guided-field">
          <label class="guided-label" for="s8-learners">
            <span class="guided-label-num">1</span>
            Who are your learners?
          </label>
          <textarea class="guided-input" id="s8-learners" rows="1"
            placeholder="e.g. Online first-year nursing students in a 16-week asynchronous course..."
            oninput="onGuidedInputS8(this)"></textarea>
        </div>
        <div class="guided-field">
          <label class="guided-label" for="s8-subject">
            <span class="guided-label-num">2</span>
            What subject or course is this?
          </label>
          <textarea class="guided-input" id="s8-subject" rows="1"
            placeholder="e.g. Introductory biology, upper-division business writing, developmental math..."
            oninput="onGuidedInputS8(this)"></textarea>
        </div>
        <div class="guided-field">
          <label class="guided-label" for="s8-problem">
            <span class="guided-label-num">3</span>
            What specific learning behavior is missing?
          </label>
          <textarea class="guided-input" id="s8-problem" rows="1"
            placeholder="e.g. Students complete lab write-ups but never revisit or compare them to earlier work..."
            oninput="onGuidedInputS8(this)"></textarea>
        </div>
        <div class="guided-field">
          <label class="guided-label" for="s8-format">
            <span class="guided-label-num">4</span>
            What format and time constraint do you need?
          </label>
          <textarea class="guided-input" id="s8-format" rows="1"
            placeholder="e.g. Under 15 minutes, fully asynchronous, no extra tools required..."
            oninput="onGuidedInputS8(this)"></textarea>
        </div>
        <div class="guided-field">
          <label class="guided-label" for="s8-outcome">
            <span class="guided-label-num">5</span>
            What should students be able to do or notice after the activity?
          </label>
          <textarea class="guided-input" id="s8-outcome" rows="1"
            placeholder="e.g. Name one specific way their thinking has changed and carry it into the next unit..."
            oninput="onGuidedInputS8(this)"></textarea>
        </div>
        <div class="guided-preview" id="guidedPreviewS8">
          <div class="guided-preview-label">Your assembled prompt</div>
          <div id="guidedPreviewTextS8"></div>
        </div>
        <div class="guided-footer">
          <button class="guided-skip-link" onclick="switchToOpenS8()" type="button">Write it myself instead</button>
          <span class="guided-attempt-badge">Attempts: <span id="attNum">0</span></span>
          <button class="guided-send-btn" id="sendBtn" onclick="sendGuidedS8()">Send prompt →</button>
        </div>
      </div>
    </div>`;
}

function onGuidedInputS8(el) {
  autoGrow(el);
  const learners = (document.getElementById('s8-learners')?.value || '').trim();
  const subject  = (document.getElementById('s8-subject')?.value  || '').trim();
  const problem  = (document.getElementById('s8-problem')?.value  || '').trim();
  const format   = (document.getElementById('s8-format')?.value   || '').trim();
  const outcome  = (document.getElementById('s8-outcome')?.value  || '').trim();
  const parts = [];
  if (learners && subject) parts.push(`My learners are ${learners} in a ${subject} course.`);
  else if (learners) parts.push(`My learners are ${learners}.`);
  else if (subject)  parts.push(`This is a ${subject} course.`);
  if (problem) parts.push(problem);
  if (format)  parts.push(`Format and constraints: ${format}.`);
  if (outcome) parts.push(`After the activity, students should be able to ${outcome}.`);
  const assembled = parts.join(' ');
  const preview = document.getElementById('guidedPreviewS8');
  const previewText = document.getElementById('guidedPreviewTextS8');
  if (assembled && preview && previewText) { preview.classList.add('has-content'); previewText.textContent = assembled; }
  else if (preview) preview.classList.remove('has-content');
}

function sendGuidedS8() {
  const learners = (document.getElementById('s8-learners')?.value || '').trim();
  const subject  = (document.getElementById('s8-subject')?.value  || '').trim();
  const problem  = (document.getElementById('s8-problem')?.value  || '').trim();
  const format   = (document.getElementById('s8-format')?.value   || '').trim();
  const outcome  = (document.getElementById('s8-outcome')?.value  || '').trim();
  const parts = [];
  if (learners && subject) parts.push(`My learners are ${learners} in a ${subject} course.`);
  else if (learners) parts.push(`My learners are ${learners}.`);
  else if (subject)  parts.push(`This is a ${subject} course.`);
  if (problem) parts.push(problem);
  if (format)  parts.push(`Format and constraints: ${format}.`);
  if (outcome) parts.push(`After the activity, students should be able to ${outcome}.`);
  const assembled = parts.join(' ');
  if (!assembled.trim()) { document.getElementById('s8-learners')?.focus(); return; }
  sendText(assembled);
}

function switchToOpenS8() {
  renderOpenPlain(document.getElementById('inputContainer'));
  setTimeout(() => document.getElementById('promptInput')?.focus(), 50);
}

function loadScenario8() {
  s8Phase = 1;
  const area = document.getElementById('chat');
  // Clear previous S8 content to prevent duplicate IDs from re-navigation
  area.innerHTML = '';
  document.getElementById('vnBoardText').textContent = 'Build your prompt below. After the AI responds, reflect — then revise.';
  const introDiv = document.createElement('div');
  introDiv.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;';
  introDiv.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-title">🔁 Reflect &amp; Revise</div>
      <div class="welcome-body">
        Use the fields below to build a prompt asking AI to design a brief reflection activity for your students.
        After you see the AI response, Professor Pixel will ask you three questions before you write your revised prompt.
        <br><br><strong>Round 1:</strong> Build your initial prompt below.
      </div>
    </div>`;
  area.appendChild(introDiv);
  document.getElementById('inputContainer').style.display = 'block';
  renderGuidedBuilderS8(document.getElementById('inputContainer'));
}

function s8AfterResponse(initialScore, reply) {
  const s = scenarios[7];
  const area = document.getElementById('chat');
  scenarioData[7].initialPrompt = lastPromptText;
  scenarioData[7].initialScore = initialScore;
  document.getElementById('inputContainer').style.display = 'none';
  setTimeout(() => {
    const refCard = document.createElement('div');
    refCard.style.cssText = 'animation:slideUp 0.35s ease forwards;opacity:0;margin-top:8px;';
    refCard.innerHTML = `
      <div style="background:var(--forest-light);border:1.5px solid rgba(45,90,61,0.3);border-radius:var(--radius-lg);padding:16px 18px;">
        <div style="font-family:'Fraunces',serif;font-size:0.9rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px;">
          🧑‍🏫 Professor Pixel — Before you revise
        </div>
        ${s.reflectionQuestions.map((q, idx) => `
          <div style="margin-bottom:12px;">
            <label style="font-family:'Nunito',sans-serif;font-size:0.75rem;font-weight:700;color:var(--ink-light);display:block;margin-bottom:4px;">
              ${String(idx+1).padStart(2,'0')} — ${q}
            </label>
            <textarea id="s8ref${idx+1}"
              style="width:100%;font-family:'Calibri',sans-serif;font-size:0.88rem;border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;min-height:56px;resize:vertical;background:var(--chalk);color:var(--ink);"
              placeholder="Write freely — there is no wrong answer."
              oninput="s8CheckReflectionReady()"></textarea>
          </div>`).join('')}
        <button id="s8ReflectSubmitBtn"
          style="font-family:'Nunito',sans-serif;font-size:0.8rem;font-weight:700;background:var(--forest);color:white;border:none;border-radius:8px;padding:8px 18px;cursor:pointer;opacity:0.4;pointer-events:none;"
          onclick="s8ShowRevisionInput()">Ready to revise →</button>
      </div>`;
    area.appendChild(refCard);
    area.scrollTop = area.scrollHeight;
  }, 600);
}

function s8CheckReflectionReady() {
  // Use querySelectorAll and take the LAST instance — guards against
  // duplicate IDs from re-navigating to S8 via the dev bar.
  const val = (id) => {
    const els = document.querySelectorAll(`#${id}`);
    return els[els.length - 1]?.value?.trim() || '';
  };
  const all = [1,2,3].every(n => val(`s8ref${n}`).length > 0);
  // Same guard for the submit button — take the last one
  const btns = document.querySelectorAll('#s8ReflectSubmitBtn');
  const btn = btns[btns.length - 1];
  if (btn) { btn.style.opacity = all ? '1' : '0.4'; btn.style.pointerEvents = all ? 'auto' : 'none'; }
}

function s8ShowRevisionInput() {
  // Snapshot all three values immediately — before any DOM changes.
  // Use querySelectorAll in case of duplicate IDs from re-navigation,
  // always taking the LAST (most recently rendered) instance.
  const allRef1 = document.querySelectorAll('#s8ref1');
  const allRef2 = document.querySelectorAll('#s8ref2');
  const allRef3 = document.querySelectorAll('#s8ref3');
  scenarioData[7].reflection1 = (allRef1[allRef1.length - 1]?.value || '').trim();
  scenarioData[7].reflection2 = (allRef2[allRef2.length - 1]?.value || '').trim();
  scenarioData[7].reflection3 = (allRef3[allRef3.length - 1]?.value || '').trim();
  s8Phase = 2;
  const area = document.getElementById('chat');
  const label = document.createElement('div');
  label.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;margin-top:8px;';
  label.innerHTML = `
    <div style="background:var(--amber-light);border:1.5px solid rgba(196,124,45,0.3);border-radius:var(--radius-lg);padding:12px 16px;font-family:'Nunito',sans-serif;font-size:0.84rem;color:var(--amber-dark);">
      <strong>Round 2:</strong> Now write your revised prompt. Your original is pre-filled — edit it or rewrite from scratch.
    </div>`;
  area.appendChild(label);
  // Inject the instructor's reflections into conversation history
  // so the AI sees them as context before the revised prompt arrives.
  const r1 = scenarioData[7].reflection1 || '';
  const r2 = scenarioData[7].reflection2 || '';
  const r3 = scenarioData[7].reflection3 || '';
  if (r1 || r2 || r3) {
    history.push({
      role: 'user',
      content: `Before I revise my prompt, here is my honest reflection on your response:

` +
        (r1 ? `Why I wrote it that way: ${r1}

` : '') +
        (r2 ? `What worked: ${r2}

` : '') +
        (r3 ? `What fell short or surprised me: ${r3}` : '')
    });
    history.push({
      role: 'assistant',
      content: `Thank you for reflecting so honestly — that kind of self-assessment is exactly what makes revision meaningful. I can see what you were going for. Go ahead and share your revised prompt and I'll respond to it directly, noting what changed and what you might push further.`
    });
  }

  document.getElementById('inputContainer').style.display = 'block';
  renderOpenPlain(document.getElementById('inputContainer'));
  const input = document.getElementById('promptInput');
  if (input) { input.value = scenarioData[7].initialPrompt; autoGrow(input); input.focus(); input.setSelectionRange(0, input.value.length); }
  area.scrollTop = area.scrollHeight;
}

function s8AfterRevision(revisedScore) {
  const initialScore = scenarioData[7].initialScore || 0;
  const delta = revisedScore - initialScore;
  scenarioData[7].revisedPrompt = lastPromptText;
  scenarioData[7].revisedScore = revisedScore;
  scenarioData[7].scoreDelta = delta;
  setTimeout(() => {
    const deltaDiv = document.createElement('div');
    deltaDiv.style.cssText = 'animation:slideUp 0.3s ease forwards;opacity:0;margin-top:6px;text-align:center;';
    const color = delta > 0 ? 'var(--forest-mid)' : delta < 0 ? '#c0392b' : 'var(--ink-muted)';
    const deltaLabel = delta > 0 ? `+${delta} improvement` : delta < 0 ? `${delta} — reflection reveals where to go next` : 'Same score — the revision process itself is the skill';
    deltaDiv.innerHTML = `<span style="font-family:'Source Code Pro',monospace;font-size:0.75rem;font-weight:700;color:${color};background:var(--chalk);border:1.5px solid ${color};border-radius:99px;padding:4px 14px;">Score delta: ${deltaLabel}</span>`;
    document.getElementById('chat').appendChild(deltaDiv);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    scenarioData[7].scoreDelta = delta;  // already set above, this is fine
    markScenarioComplete();
  }, 400);
}

// devTestS8 replaced by devFillS8 below

// Fill S8 phase 1 guided builder fields only — no auto-send.
// User reads, sends, fills reflections, and sends revised prompt themselves.
function devFillS8() {
  if (scenarioIndex !== 7) devGoS8();

  setTimeout(() => {
    const f = (id, val) => {
      const el = document.getElementById(id);
      if (el) { el.value = val; onGuidedInputS8(el); }
    };
    f('s8-learners', 'online students in a 16-week asynchronous course');
    f('s8-subject',  'introductory biology');
    f('s8-problem',  'Students complete weekly lab write-ups but never revisit or compare them to earlier work — they finish and move on without reflecting');
    f('s8-format',   'under 15 minutes, fully asynchronous, no extra tools required');
    f('s8-outcome',  'name one specific way their thinking or method has changed and identify one strategy to carry into the next unit');
    // Focus the first empty field so user knows where they are
    document.getElementById('s8-learners')?.focus();
    // No auto-send — user reviews and hits Send themselves
  }, scenarioIndex !== 7 ? 800 : 200);
}

// ══════════════════════════════════════════════════════
async function autoSaveSession(label) {
  if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;
  if (SURVEY_MODE !== 'sheets') return;
  try {
    const payload = buildSessionPayload(null);
    payload.type = 'autosave';
    payload.autosave_trigger = label;
    await postToSheets(payload, 'Sheets payload');
  } catch(e) {
    // silent fail — reflection form send is the primary
  }
}
const EXPRESSIONS = {
  neutral:     'images/pixel-neutral.png',
  thinking:    'images/pixel-thinking.png',
  excited:     'images/pixel-excited.png',
  encouraging: 'images/pixel-encouraging.png',
  skeptical:   'images/pixel-skeptical.png',
  proud:       'images/pixel-proud.png',
};

// Queue of dialogue sequences waiting to play
let vnQueue = [];
let claudeTerminalCloseCallback = null;
let vnTyping = false;
let vnTypeTimer = null;
let vnCurrentText = '';
let vnFullText = '';
let vnOnComplete = null;


// ── CLAUDE SHELF STATE SYSTEM ────────────────────────

function setVNClaudeMode(enabled = false) {
  const overlay = document.getElementById('vnOverlay');
  if (!overlay) return;
  overlay.classList.toggle('claude-consult', !!enabled);
}

function setVNClaudeTerminalMode(enabled = false) {
  const overlay = document.getElementById('vnOverlay');
  if (!overlay) return;
  overlay.classList.toggle('claude-terminal-consult', !!enabled);
}

function setClaudeTerminalTextMode(enabled = false) {
  const terminal = document.getElementById('claudeTerminalScene');
  const overlay = document.getElementById('vnOverlay');
  if (terminal) terminal.classList.toggle('textmode', !!enabled);
  if (overlay) overlay.classList.toggle('claude-terminal-textmode', !!enabled);
}

function terminalizeClaudeText(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function setClaudeTerminalState(state = 'idle', title = 'CLAUDE TERMINAL', output = 'IDLE') {
  const terminal = document.getElementById('claudeTerminalScene');
  const titleEl = document.getElementById('claudeTerminalTitle');
  const outputEl = document.getElementById('claudeTerminalOutput');
  if (terminal) {
    terminal.classList.remove('idle', 'thinking', 'responding');
    terminal.classList.add(state);
  }
  if (titleEl) titleEl.textContent = title;
  if (outputEl) {
    outputEl.classList.remove('claude-analysis-layout', 'pc-analyzing-output');
    outputEl.innerHTML = `${output}<span class="claude-terminal-cursor"></span>`;
  }
}


function renderClaudeAnalyzingReadout(partLabel = 'Scenario diagnosis') {
  const outputEl = document.getElementById('claudeTerminalOutput');
  if (!outputEl) return;

  const sectionLabel = terminalizeClaudeText(partLabel || 'Scenario diagnosis').toUpperCase() || 'SCENARIO DIAGNOSIS';
  outputEl.classList.remove('claude-analysis-layout');
  outputEl.classList.add('pc-analyzing-output');

  outputEl.innerHTML = `
    <div class="pc-analyzing-readout" aria-label="Claude terminal analyzing">
      <div class="pc-terminal-line pc-terminal-title-line">CLAUDE TERMINAL</div>
      <div class="pc-terminal-gap" aria-hidden="true"></div>
      <div class="pc-terminal-line">&gt; SECTION</div>
      <div class="pc-terminal-line pc-terminal-indent">${esc(sectionLabel)}</div>
      <div class="pc-terminal-gap" aria-hidden="true"></div>
      <div class="pc-terminal-line">&gt; STATUS</div>
      <div class="pc-terminal-line pc-terminal-indent pc-analyzing-status">ANALYZING<span class="claude-terminal-cursor" aria-hidden="true"></span></div>
    </div>
  `;
}


function showClaudeConsultOverlay(partLabel) {
  // This is an interaction moment: Pixel consults Claude through the terminal close-up.
  vnQueue = [];
  clearTimeout(vnTypeTimer);
  vnTyping = true;
  vnOnComplete = null;
  vnFullText = '';
  vnCurrentText = '';

const overlay = document.getElementById('vnOverlay');

overlay.classList.remove(
  'claude-prediction',
  'pc-clean-prediction',
  'pc-prediction-question',
  'claude-terminal-consult',
  'claude-terminal-textmode',
  'pc-clean-output',
  'pc-clean-final',
  'analysis-complete'
);

overlay.classList.add('active', 'claude-terminal-consult');

setVNClaudeMode(false);
setVNClaudeTerminalMode(true);
setClaudeTerminalTextMode(false);

musicStartVN();

setClaudeShelfState('idle', 'idle');

setClaudeTerminalState(
  'thinking',
  'CLAUDE TERMINAL',
  `SECTION:\n${esc(partLabel).toUpperCase()}\n\nANALYZING...`
);

renderClaudeAnalyzingReadout(partLabel);

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `<div><strong>Let's ask Claude what it notices.</strong></div><div style="margin-top:8px;">Claude is analyzing the teaching problem now.</div><div class="vn-prediction-note">Terminal active...</div>`;
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  setTimeout(() => {
    document.getElementById('vnDialogue')?.focus();
  }, 100);
}

function parseClaudeDiagnosticSections(text) {
  const clean = terminalizeClaudeText(text);
  const lines = clean
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const result = {
    status: '',
    issue: '',
    repair: '',
    confidence: '',
    impact: ''
  };

  let current = '';

  for (const line of lines) {
    const upper = line.toUpperCase().replace(/:$/, '');

    if (/^(MOCK )?ANALYSIS COMPLETE$/.test(upper) || upper === 'SCENARIO DIAGNOSTIC') continue;

    if (upper === 'STATUS') { current = 'status'; continue; }
    if (upper === 'ISSUE DETECTED') { current = 'issue'; continue; }
    if (upper === 'RECOMMENDED REPAIR') { current = 'repair'; continue; }
    if (upper === 'EXPECTED IMPACT') { current = 'impact'; continue; }
    if (upper === 'CONFIDENCE') { current = 'confidence'; continue; }

    if (current && result[current]) result[current] += ' ' + line;
    else if (current) result[current] = line;
  }

  const fallbackIssue = clean
    .replace(/^(MOCK )?ANALYSIS COMPLETE\s*/i, '')
    .replace(/^SCENARIO DIAGNOSTIC\s*/i, '')
    .trim();

  return {
    status: result.status || 'High-confidence repair',
    issue: result.issue || fallbackIssue || 'The prompt has a discussion design problem that may limit student interaction.',
    repair: result.repair || 'Add a clear reason for students to extend, challenge, compare, or build on a peer’s idea using evidence or reasoning.',
    impact: result.impact || 'Students will be more likely to extend conversations, challenge ideas, compare perspectives, and engage in deeper discussion.',
    confidence: result.confidence || 'High'
  };
}

function buildClaudeAnalysisHTML(feedback, mock = false) {
  const d = parseClaudeDiagnosticSections(feedback);
  const badge = mock ? 'MOCK ANALYSIS COMPLETE' : 'ANALYSIS COMPLETE';

  return `
    <div class="analysis-report" role="document" aria-label="Claude scenario diagnostic report">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">Scenario Diagnostic</h2>
        <p class="analysis-summary">
          Claude found the discussion design problem and suggested a repair that gives students a clearer reason to keep the conversation going.
        </p>
      </header>

      <div class="analysis-grid" aria-label="Diagnostic findings">
        <section class="analysis-card analysis-status-card compact">
          <span class="analysis-label">Status</span>
          <div class="analysis-value big">✓ ${esc(d.status)}</div>
        </section>

        <section class="analysis-card analysis-confidence-card compact">
          <span class="analysis-label">Confidence</span>
          <div class="analysis-value big">${esc(d.confidence)}</div>
          <div class="analysis-note">Strong evidence pattern detected.</div>
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label">Issue Detected</span>
          <div class="analysis-value">${esc(d.issue)}</div>
        </section>

        <section class="analysis-card analysis-repair-card">
          <span class="analysis-label">Recommended Repair</span>
          <div class="analysis-value">${esc(d.repair)}</div>
        </section>

        <section class="analysis-card analysis-impact-card wide">
          <span class="analysis-label">Expected Impact</span>
          <div class="analysis-value">${esc(d.impact)}</div>
        </section>
      </div>
    </div>
  `;
}

function showClaudeConsultResult(feedback, mock = false, onClose = null) {
  claudeTerminalCloseCallback = typeof onClose === 'function' ? onClose : null;
  const label = mock ? 'MOCK ANALYSIS COMPLETE' : 'ANALYSIS COMPLETE';
  const terminalText = `${label}\n\n${terminalizeClaudeText(feedback)}`;

  setClaudeTerminalTextMode(true);

  setClaudeTerminalState(
    'responding',
    mock ? 'MOCK CLAUDE TERMINAL' : 'CLAUDE TERMINAL',
    esc(terminalText)
  );

  const output = document.getElementById('claudeTerminalOutput');
  if (output) {
    output.classList.add('claude-analysis-layout');
    output.innerHTML = buildClaudeAnalysisHTML(terminalText, mock);
  }

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <button id="claudeTTSBtn" class="claude-tts-btn" type="button" onclick="event.stopPropagation();toggleClaudeTTS()">🔊 Read Analysis</button>
      <button class="vn-return-btn terminal-return" type="button" onclick="event.stopPropagation();closeClaudeConsultOverlay()">Continue</button>
    `;
    setTimeout(() => vnText.querySelector('.vn-return-btn')?.focus(), 100);
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');
}


// NOTE: Terminal diagnosis copy is still inline. Candidate for dialogue.js or scenario-data.js.
function showClaudeFinalResponseInTerminal(responseText, mock = false, onClose = null, scoreTotal = null) {
  // S2: wrap onClose to render the result card after terminal closes
  let effectiveClose = onClose;
  if (scenarioIndex === 1) {
    effectiveClose = function() {
      addS2ClaudeResultCard(responseText);
      if (typeof onClose === 'function') onClose();
    };
  }
  // If the thinking screen is already open, keep it and swap to the result quickly.
  const overlay = document.getElementById('vnOverlay');
  if (!overlay || !overlay.classList.contains('active')) {
    showClaudeConsultOverlay('Scenario diagnosis');
  }
  // Keep the Claude processing screen visible long enough to read/screenshot.
  // This is the screen between "Continue to Claude" and the Claude Output.
  // Increase or decrease this number if needed. 2200 = 2.2 seconds.
  const CLAUDE_PROCESSING_MIN_MS = 4200;

  setTimeout(() => {
    const terminalOutput = scenarioIndex === 0 && typeof scoreTotal === 'number'
      ? buildS1TerminalDiagnosis(scoreTotal, responseText)
      : responseText;
    showClaudeConsultResult(terminalOutput, mock, effectiveClose);
  }, CLAUDE_PROCESSING_MIN_MS);
}

// NOTE: Pixel score-reflection dialogue is still inline. Candidate for dialogue.js pass 2.
function closeClaudeConsultOverlay() {
  const cb = claudeTerminalCloseCallback;
  claudeTerminalCloseCallback = null;
  const overlay = document.getElementById('vnOverlay');
  if (overlay) overlay.classList.remove('active', 'claude-consult', 'claude-terminal-consult', 'claude-terminal-textmode', 'claude-prediction');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  setClaudeShelfState('idle', 'idle');
  setClaudeTerminalTextMode(false);
  setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'IDLE');
  musicEndVN();
  if (cb) {
    setTimeout(cb, 250);
  } else {
    document.getElementById('promptInput')?.focus();
  }
  function stopClaudeTTS() {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    const btn = document.getElementById('claudeTTSBtn');
    if (btn) btn.textContent = '🔊 Read Analysis';
  }
}

function setClaudeShelfState(state = 'idle', label = '') {
  const shelf = document.getElementById('claudeShelf');
  const status = document.getElementById('claudeShelfStatus');
  if (!shelf) return;
  shelf.classList.remove('idle', 'thinking', 'responding');
  shelf.classList.add(state);
  if (status) status.textContent = label || state;
}

function claudeShelfThink(label = 'consulting Claude') {
  setClaudeShelfState('thinking', label);
}

function claudeShelfRespond(label = 'analysis ready') {
  setClaudeShelfState('responding', label);
}

function vnShow(expression, text, onComplete) {
  // Add to queue
  vnQueue.push({ expression, text, onComplete });
  if (!vnTyping) vnPlayNext();
}

function vnPlayNext() {
  if (vnQueue.length === 0) {
    setTimeout(() => {
      const overlay = document.getElementById('vnOverlay');
      overlay.classList.remove('active', 'claude-consult', 'claude-terminal-consult');
      document.getElementById('vnCharacter').classList.remove('visible');
      document.getElementById('promptInput')?.focus();
      // Fade music down when VN closes
      musicEndVN();
      setClaudeShelfState('idle', 'idle');
    }, 300);
    vnTyping = false;
    return;
  }

  const { expression, text, onComplete } = vnQueue.shift();
  vnOnComplete = onComplete || null;
  vnTyping = true;

  const overlay = document.getElementById('vnOverlay');
  overlay.classList.add('active');

  // Normal VN lines are Professor Pixel speaking. Reset this every time so
  // the previous Claude terminal label cannot leak into Pixel's reflection.
  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  setVNClaudeMode(false);
  setVNClaudeTerminalMode(false);
  setClaudeTerminalTextMode(false);

  // Fade music up when VN opens
  musicStartVN();
  setClaudeShelfState('idle', 'idle');

  vnSetExpression(expression);

  setTimeout(() => {
    document.getElementById('vnCharacter').classList.add('visible');
    document.getElementById('vnDialogue').focus();
  }, 100);

  document.getElementById('vnAdvanceHint').classList.remove('show');

  vnFullText = text;
  vnCurrentText = '';
  document.getElementById('vnText').innerHTML = '';
  vnTypeWriter(text);
}

function vnSetExpression(expr) {
  const img = document.getElementById('vnPortrait');
  const badge = document.getElementById('vnExprBadge');
  const src = EXPRESSIONS[expr] || EXPRESSIONS.neutral;

  badge.textContent = expr;

  // Briefly fade out, swap, fade in
  if (img.style.display !== 'none') {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = src;
      img.style.opacity = '1';
    }, 150);
  } else {
    img.src = src;
  }
}

function vnTypeWriter(text) {
  const el = document.getElementById('vnText');
  let i = 0;
  const speed = 28; // ms per character

  function type() {
    if (i < text.length) {
      vnCurrentText += text[i];
      el.innerHTML = vnCurrentText + '<span class="vn-cursor"></span>';
      i++;
      vnTypeTimer = setTimeout(type, speed);
    } else {
      // Typing done
      el.innerHTML = vnCurrentText;
      document.getElementById('vnAdvanceHint').classList.add('show');
      playSound(null); // audio hook — add sound key if desired
    }
  }
  type();
}

function vnSkipType() {
  // Instantly complete current line
  clearTimeout(vnTypeTimer);
  const el = document.getElementById('vnText');
  el.innerHTML = vnFullText;
  document.getElementById('vnAdvanceHint').classList.add('show');
}

function vnAdvance() {
  const overlay = document.getElementById('vnOverlay');

  // HARD STOP: during Claude terminal/thinking screens, clicks on the black
  // dialogue panel must NOT advance or clear the VN text. Only the explicit
  // Continue button on the finished analysis screen should close it.
  const terminal = document.getElementById('claudeTerminalScene');
  const terminalIsThinking = terminal?.classList.contains('thinking');
  const terminalReturnVisible = !!document.querySelector('.terminal-return, #pcContinueToClaudeBtn');
  if (
    overlay &&
    overlay.classList.contains('active') &&
    (overlay.classList.contains('claude-terminal-consult') || overlay.classList.contains('claude-terminal-textmode')) &&
    !terminalReturnVisible &&
    (terminalIsThinking || !overlay.classList.contains('claude-terminal-textmode'))
  ) {
    return;
  }

  // HARD STOP: once the prediction has been logged, the black VN box must
  // not advance the scene. Only the actual "Continue to Claude" button should
  // move the user into the Claude processing screen. Otherwise a stray click
  // jumps the state machine into the weird empty terminal screen. Charming.
  if (
    window.pcWaitingForClaudeContinue ||
    document.getElementById('pcContinueToClaudeBtn')
  ) {
    return;
  }

  // Do not auto-advance while prediction choices are visible.
  if (
    overlay &&
    (
      overlay.classList.contains('claude-prediction') ||
      overlay.classList.contains('pc-clean-prediction')
    ) &&
    (
      document.querySelector('.vn-prediction-options') ||
      document.getElementById('vnPredictionChoicePanel') ||
      document.getElementById('predictionGate') ||
      document.querySelector('.pc-choice-panel-final')
    )
  ) {
    return;
  }

  // If still typing, skip to end first
  if (document.getElementById('vnAdvanceHint').classList.contains('show') === false) {
    vnSkipType();
    return;
  }
  // Otherwise advance to next line or close
  if (vnOnComplete) {
    const cb = vnOnComplete;
    vnOnComplete = null;
    cb();
  }
  vnTyping = false;
  vnPlayNext();
}

// ── PROFESSOR PIXEL DIALOGUE SEQUENCES ───────────────
/* pixelDialogue moved to dialogue.js */


function playPixelSequence(key, onDone) {
  const lines = pixelDialogue[key];
  if (!lines) return;

  // Update board text and play intro audio on scenario starts
  if (key.startsWith('scenarioStart_')) {
    const i = parseInt(key.split('_')[1]);
    document.getElementById('vnBoardText').textContent = scenarios[i].desc;
    // Play scenario intro — suppressed during initial load to avoid double audio
    if (window.scenarioIntroEnabled) playSound(`scenarioIntro${i}`);
  }

  // Welcome narration on game start
  if (key === 'welcome') playSound('welcome');

  // Queue all lines
  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    vnShow(line.expr, line.text, isLast && onDone ? onDone : null);
  });
}

// ══════════════════════════════════════════════════════
//  SCENE ILLUSTRATION LOADER
//  Drop your illustrations into images/ and they appear
//  automatically. No API calls needed.
//
//  Expected filenames:
//    images/scene-s1.png  — Engagement
//    images/scene-s2.png  — Differentiation
//    images/scene-s3.png  — Assessment
//    images/scene-s4.png  — Hallucination Hunt
//    images/scene-s5.png  — Predict the Output
//    images/scene-s6.png  — Bias and Context
//    images/scene-complete.png — All scenarios complete
// ══════════════════════════════════════════════════════
function loadSceneImage(filename) {
  const img = document.getElementById('vnBoardImg');
  const loading = document.getElementById('vnBoardLoading');
  if (!img) return;

  if (loading) loading.style.display = 'none';
  img.classList.remove('loaded');

  const src = `images/${filename}`;
  const test = new Image();
  test.onload = () => {
    img.src = src;
    img.alt = 'Scene illustration';
    img.classList.add('loaded');
  };
  test.onerror = () => {
    // File does not exist yet -- fail silently
    img.src = '';
    img.classList.remove('loaded');
  };
  test.src = src;
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Show name modal first -- game starts after name is submitted
  showNameModal();
});

// ══════════════════════════════════════════════════════
//  SCENARIO NAV
// ══════════════════════════════════════════════════════
function switchScenario(i, btn) {
  scenarioIndex = i;
  attempts = 0;
  lastPromptText = '';
  history = [];

  const attNum = document.getElementById('attNum');
  if (attNum) attNum.textContent = '0';

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  const targetBtn = btn || document.querySelectorAll('.tab-btn')[i];
  if (targetBtn) {
    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');
  }

  window.scenarioIntroEnabled = true;

  if (Array.isArray(navCardShown)) {
    navCardShown[i] = false;
  }

  if (i === 3) {
    s4InterruptFired = false;
  }

  const card = document.querySelector('.scenario-card');
  if (card) {
    if (i === 3) {
      card.classList.add('s4-active');
    } else {
      card.classList.remove('s4-active');
    }
  }

  const overlay = document.querySelector('.vn-overlay');
  if (overlay) {
    overlay.classList.remove(
      'claude-prediction',
      'pc-clean-prediction',
      'claude-terminal-consult',
      'claude-analysis',
      'claude-consult'
    );
  }

  const chatEl = document.getElementById('chat');
  if (chatEl && chatEl._pixelThinkTimer) {
    clearTimeout(chatEl._pixelThinkTimer);
    chatEl._pixelThinkTimer = null;
  }

  const existing = document.getElementById('pixelThinking');
  if (existing) existing.remove();

  const revealWrap = document.getElementById('pixelRevealWrap');
  if (revealWrap) revealWrap.remove();

  loadScenario(i);

  const s4Callback = (i === 3)
    ? () => setTimeout(() => fireS4Interrupt(), 2500)
    : null;

  if (window.scenarioIntroTimer) {
    clearTimeout(window.scenarioIntroTimer);
  }

  window.scenarioIntroTimer = setTimeout(() => {
    playPixelSequence(`scenarioStart_${i}`, s4Callback);
  }, 300);
}

function pcClearVNStateForScenarioSwitch() {
  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  if (overlay) {
    overlay.classList.remove(
      'active',
      'claude-prediction',
      'pc-clean-prediction',
      'claude-terminal-consult',
      'claude-terminal-textmode',
      'claude-analysis',
      'claude-consult',
      'pc-clean-output'
    );
  }

  document.getElementById('vnDialogue')?.classList.remove('has-choices');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  document.querySelectorAll('#vnPredictionChoicePanel,#predictionGate,.pc-choice-panel-final,.pc-clean-choice-grid,.vn-choice-list').forEach(el => el.remove());

  window.pendingPromptForPrediction = '';
  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForClaudeContinue = false;

  try { predictionGateActive = false; } catch(e) {}
  try { vnQueue = []; } catch(e) {}
  try { vnTyping = false; } catch(e) {}
  try { vnOnComplete = null; } catch(e) {}
  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { setClaudeShelfState('idle', 'idle'); } catch(e) {}
  try { setClaudeTerminalTextMode(false); } catch(e) {}
  try { setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'AWAITING INPUT...'); } catch(e) {}
  try { musicEndVN(); } catch(e) {}
}

function pcFillS1DevFields() {
  const values = {
    'g-learners': 'online first-year general education students in an 8-week fully asynchronous course',
    'g-issue': 'students are posting one-sentence reactions, replying only because it is required, and the conversation dies after one exchange',
    'g-interaction': 'compare two possible interpretations of the reading, support their claim with one specific example, and ask a follow-up question that invites a peer to extend or challenge the idea',
    'g-constraints': "no extra tools, one initial post, two substantive peer replies, and strong replies must explain reasoning, use evidence or examples, and build on a classmate's idea"
  };

  const tryFill = (attempts = 0) => {
    const fields = Object.keys(values).map(id => document.getElementById(id));
    if (fields.every(Boolean)) {
      Object.entries(values).forEach(([id, val]) => {
        const el = document.getElementById(id);
        el.value = val;
        if (typeof autoGrow === 'function') autoGrow(el);
      });
      if (typeof onGuidedInput === 'function') onGuidedInput(document.getElementById('g-learners'));
      document.getElementById('g-learners')?.focus();
      return;
    }
    if (attempts < 30) setTimeout(() => tryFill(attempts + 1), 100);
  };

  tryFill();
}

function resetS1Dev() {
    scenarioIndex = 0;
    attempts = 0;
    lastPromptText = '';
    history = [];

    if (window.scenarioIntroTimer) {
      clearTimeout(window.scenarioIntroTimer);
      window.scenarioIntroTimer = null;
    }

    pcClearVNStateForScenarioSwitch();

    try { localStorage.removeItem('promptcraft_s1_clean_draft'); } catch(e) {}

    if (window.playerHistory && window.playerHistory.s1) {
      window.playerHistory.s1 = {
        learners: '',
        issue: '',
        goal: '',
        interaction: '',
        constraints: '',
        assembled: ''
      };
    }

    if (typeof playerHistory !== 'undefined' && playerHistory.s1) {
      playerHistory.s1 = {
        learners: '',
        issue: '',
        goal: '',
        interaction: '',
        constraints: '',
        assembled: ''
      };
    }

    document.body.classList.remove('s1-result-active');
    document.body.classList.add('s1-active');

    document.querySelectorAll('.tab-btn').forEach((b, idx) => {
      b.classList.toggle('active', idx === 0);
      b.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    });

    const attNum = document.getElementById('attNum');
    if (attNum) attNum.textContent = '0';

    window.scenarioIntroEnabled = true;
    if (Array.isArray(navCardShown)) navCardShown[0] = false;

    loadScenario(0);

    setTimeout(() => {
      pcFillS1DevFields();
    }, 120);
  }

window.pcClearVNStateForScenarioSwitch = pcClearVNStateForScenarioSwitch;
window.pcFillS1DevFields = pcFillS1DevFields;
window.resetS1Dev = resetS1Dev;
try { resetS1Dev = window.resetS1Dev; } catch(e) {}

function loadScenario(i) {
  const s = scenarios[i];
  document.body.classList.toggle('s1-active', i === 0);
  document.body.classList.remove('s1-result-active');
  document.getElementById('scenarioText').textContent = s.desc;
  document.getElementById('vnBoardText').textContent = s.desc;
  renderOSCQR(s.oscqr, []);
  document.getElementById('chat').innerHTML = '';

  // Reset scenario-specific state flags
  if (i === 4) s4InterruptFired = false;   // Hallucination is now S5 (index 4)
  if (i === 5) s5PredictionDone = false;  // Predict is now S6 (index 5)

  loadSceneImage(`scene-s${i + 1}.png`);

  const sceneBg = document.getElementById('vnSceneBg');
  if (sceneBg) sceneBg.src = 'images/classroom-bg.png';
  document.getElementById('vnBoardLoading').style.display = 'none';

  // S4, S5, S6, S7 control their own input visibility
  if (i === 3) {
    // S4 is now Sync Bias (open prompt, scored)
    renderOpenPlain(document.getElementById('inputContainer'));
    document.getElementById('inputContainer').style.display = 'block';
    loadScenarioSyncBias();
    return;
  }
  if (i === 4) {
    // S5 is now Hallucination Hunt
    renderOpenPlain(document.getElementById('inputContainer'));
    document.getElementById('inputContainer').style.display = 'none';
    loadScenarioHallucination();
    return;
  }
  if (i === 5) {
    // S6 is now Predict the Output
    renderOpenPlain(document.getElementById('inputContainer'));
    document.getElementById('inputContainer').style.display = 'none';
    loadScenarioPredict();
    return;
  }
  if (i === 6) {
    renderOpenPlain(document.getElementById('inputContainer'));
    document.getElementById('inputContainer').style.display = 'none';
    loadScenario7();
    return;
  }
  if (i === 7) {
    document.getElementById('inputContainer').style.display = 'block';
    loadScenario8();
    return;
  }

  renderInputMode(i);
  if (i !== 0) addWelcomeCard();
}

function addWelcomeCard() {
  const area = document.getElementById('chat');
  const div = document.createElement('div');
  div.style.cssText = 'animation: slideUp 0.3s ease forwards; opacity: 0;';
  div.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-title">📖 Ready to practice?</div>
      <div class="welcome-body">
        Read the challenge pinned above, then write your prompt below.
        The AI will respond just like it would in a real teaching situation.<br><br>
        After each response you will see a <strong>Prompt Analysis</strong> card
        and Professor Pixel will share her thoughts.
      </div>
      <div class="tip-row">
        🌿 Tip: Include who your learners are, what you want them to achieve, and any specific constraints.
      </div>
    </div>`;
  area.appendChild(div);
}

// ══════════════════════════════════════════════════════
//  OSCQR
// ══════════════════════════════════════════════════════
function renderOSCQR(indicators, active) {
  document.getElementById('oscqrChips').innerHTML = indicators.map(ind =>
    `<span class="oscqr-chip ${active.includes(ind.id) ? 'active' : ''}">${ind.label}</span>`
  ).join('');
}

function detectOSCQR(text, indicators) {
  return indicators.filter(ind =>
    text.toLowerCase().includes(ind.label.toLowerCase().split(' ')[0]) ||
    text.toLowerCase().includes(ind.label.toLowerCase())
  ).map(i => i.id);
}

// ══════════════════════════════════════════════════════
//  CHAT MESSAGES
// ══════════════════════════════════════════════════════
function addMsg(role, html, pixelExpr) {
  const area = document.getElementById('chat');
  const wrap = document.createElement('div');
  wrap.className = `message ${role}`;
  const isUser = role === 'user';
  const isClaude = role === 'claude';

  const initials = getInitials(playerName);
  const hasName = playerName !== 'You';
  const avatarHTML = isUser
    ? `<div class="avatar user-av${hasName ? ' has-name' : ''}" aria-hidden="true">${initials}</div>`
    : isClaude
      ? `<div class="claude-avatar" aria-hidden="true">⌘</div>`
      : pixelAvatarHTML(pixelExpr || 'neutral');

  const senderLabel = isUser ? playerName : isClaude ? 'Claude' : 'Professor Pixel';

  wrap.innerHTML = `
    ${avatarHTML}
    <div class="bubble-wrap">
      <div class="bubble-sender">${senderLabel}</div>
      <div class="bubble">${html}</div>
    </div>`;
  area.appendChild(wrap);
  // Only scroll to bottom for user messages -- AI/Claude messages handled by caller
  if (isUser) area.scrollTop = area.scrollHeight;
  return wrap;
}

function addTyping() {
  const area = document.getElementById('chat');
  const wrap = document.createElement('div');
  wrap.className = 'message ai';
  wrap.id = 'typing';
  const src = PIXEL_EXPR['thinking'] || 'images/pixel-thinking.png';
  wrap.innerHTML = `
    <img class="pixel-chat-avatar" src="${src}" alt="Professor Pixel thinking"
         onerror="this.outerHTML='<div class=\\'pixel-chat-avatar-fallback\\'>🧑‍🏫</div>'" />
    <div class="bubble-wrap">
      <div class="bubble-sender">Professor Pixel</div>
      <div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
    </div>`;
  area.appendChild(wrap);
  area.scrollTop = area.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

// ══════════════════════════════════════════════════════
//  SCAFFOLDED INPUT SYSTEM
// ══════════════════════════════════════════════════════

// Tracks what the player wrote across scenarios for memory hints
const playerHistory = {
  s1: { learners: '', goal: '', constraints: '', assembled: '' },
  s2: { bestPrompt: '' },
};

// Hint chip definitions for Scenario 2
const S2_CHIPS = [
  { key: 'learners',    label: 'Learners',    test: /student|learner|rural|online|class|grade|level|adult|community/i },
  { key: 'goal',        label: 'Goal',        test: /goal|outcome|objective|learn|understand|create|design|develop|able to/i },
  { key: 'context',     label: 'Context',     test: /course|subject|week|unit|module|discussion|assignment|activity|topic/i },
  { key: 'constraints', label: 'Constraints', test: /minute|hour|word|short|brief|limit|length|format|\d+ (question|step)/i },
  { key: 'detail',      label: 'Detail',      test: text => text.length > 100 },
];

// Render the correct input mode for the current scenario
function renderInputMode(idx) {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  container.classList.remove('s1-workbench');

  if (idx === 0) {
    renderGuidedBuilder(container);
  } else if (idx === 1) {
    // S2: metacognition workbench
    document.body.classList.add('s2-active');
    document.body.classList.remove('s2-submitted');
    renderS2MetacognitionWorkbench(container);
  } else if (idx === 2) {
    document.body.classList.remove('s2-active', 's2-submitted');
    renderOpenWithMemory(container);
  } else {
    document.body.classList.remove('s2-active', 's2-submitted');
    renderOpenPlain(container);
  }
}

// ── MODE 1: GUIDED BUILDER (Scenario 1) ──────────────
function getS1SavedDraft() {
  const s1 = playerHistory?.s1 || {};
  return {
    learners:    s1.learners    || '',
    issue:       s1.issue       || s1.goal || '',
    interaction: s1.interaction || '',
    constraints: s1.constraints || '',
  };
}

function s1ReferencePanelHTML() {
  const s = getS1SavedDraft();
  const hasAny = [s.learners, s.issue, s.interaction, s.constraints].some(Boolean);
  if (!hasAny) return '';
  const item = (label, value) => `
    <div class="s1-user-reference-item">
      <div class="s1-user-reference-label">${label}</div>
      <div class="s1-user-reference-text">${esc(value || 'Not added yet.')}</div>
    </div>`;
  return `
    <div class="s1-user-reference" role="region" aria-label="Your previous S1 input">
      <div class="s1-user-reference-title">Your original repair notes</div>
      <div class="s1-user-reference-grid">
        ${item('Learners + course', s.learners)}
        ${item('What is failing', s.issue)}
        ${item('Interaction move', s.interaction)}
        ${item('Constraints + success criteria', s.constraints)}
      </div>
    </div>`;
}

function showS1BuilderNudge(missing) {
  const nudge = document.getElementById('s1BuilderNudge');
  if (!nudge) return;
  if (!missing.length) {
    nudge.style.display = 'none';
    nudge.innerHTML = '';
    return;
  }
  nudge.style.display = 'block';
  nudge.innerHTML = `<strong>Pixel's nudge:</strong> Before we test this, connect your prompt back to the dead discussion board. Add: ${missing.join(', ')}.`;
}


function getS1PartFeedback(part, values, checks) {
  const feedback = {
    learners: checks.audience
      ? 'This gives Claude a usable picture of who the learners are. Stronger version: include course level, delivery mode, and anything that affects how students participate.'
      : 'Claude still does not know who these students are. Add course level, online/asynchronous context, and any learner traits that explain why the discussion is falling flat.',
    issue: checks.issue
      ? 'Good. This names the actual failure instead of only asking for a better prompt. Stronger version: describe what the current posts look like and why the conversation stops.'
      : 'This needs to point directly at the dead-discussion problem. Name the failure: one-sentence replies, required-but-empty peer responses, no follow-up, or no evidence of students building on each other.',
    interaction: checks.interaction
      ? 'This gives Claude an interaction move, which is the heart of the fix. Stronger version: tell students exactly how to respond to a peer, such as extend, challenge, compare, or ask a follow-up question.'
      : 'This still needs the repair strategy. Ask for a specific peer interaction move, not just “better discussion.” Claude needs to know how students should build on one another.',
    constraints: checks.constraints && checks.success
      ? 'This gives Claude boundaries and a target for quality. Stronger version: include what a strong initial post and strong peer reply must contain.'
      : 'This needs more guardrails. Add asynchronous limits, number of replies, no extra tools if needed, and what counts as a meaningful or successful reply.'
  };
  return feedback[part] || 'Review this section for specificity and connection to the original discussion problem.';
}

async function reviewS1Part(part) {
  const values = getS1GuidedValues();
  const checks = analyzeS1Guided(values);
  const panel = document.getElementById(`s1-feedback-${part}`);
  if (!panel) return;

  const sectionLabels = {
    learners: 'Learners + course context',
    issue: 'What is failing in the current discussion?',
    interaction: 'Interaction repair move',
    constraints: 'Constraints + success criteria'
  };

  const sectionText = (values[part] || '').trim();
  panel.classList.add('visible');

  if (!sectionText) {
    panel.classList.remove('loading');
    panel.innerHTML = `<strong>Claude section analysis</strong><br>This section is empty. Add a few details first so Claude has something real to analyze instead of performing interpretive dance with a blank textbox.`;
    return;
  }

  panel.classList.add('loading');
  panel.innerHTML = `<strong>Claude section analysis</strong><br>Reviewing this part...`;
  showClaudeConsultOverlay(sectionLabels[part] || part);

  document.querySelectorAll('.s1-review-btn').forEach(btn => btn.disabled = true);

  try {
    const systemPrompt = `You are Professor Pixel, a warm but direct instructional design mentor inside PromptCraft. You are reviewing ONE section of a user's prompt before it is sent to Claude for a full response. Keep the feedback specific to that section only. Do not write the final activity. Do not score the user. Use this structure exactly:\n\n**What is working**\n1-2 sentences.\n\n**What to strengthen**\n1-2 sentences.\n\n**Try this revision move**\nOne concrete suggestion.\n\nKeep the total response under 95 words.`;

    const userPrompt = `SCENARIO: Fix a dead asynchronous discussion board.\n\nORIGINAL_WEAK_PROMPT:\n"What did you think about this week's reading? Reply to at least two classmates."\n\nSECTION_BEING_REVIEWED: ${sectionLabels[part] || part}\n\nUSER_RESPONSE:\n${sectionText}\n\nFULL_S1_CONTEXT:\nLearners/course: ${values.learners || '[not provided]'}\nProblem/failure: ${values.issue || '[not provided]'}\nInteraction repair: ${values.interaction || '[not provided]'}\nConstraints/success: ${values.constraints || '[not provided]'}\n\nReview only the section named above. The feedback should help the user revise before sending the full prompt.`;

    const data = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 260,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    }, 's1_section');

    const feedback = data.content?.[0]?.text || getS1PartFeedback(part, values, checks);

    if (!scenarioData[0].sectionReviews) scenarioData[0].sectionReviews = [];
    scenarioData[0].sectionReviews.push({
      part,
      sectionText,
      feedback,
      mock: !!data.mock,
      timestamp: new Date().toISOString()
    });

    showClaudeConsultResult(feedback, !!data.mock);
    panel.classList.remove('loading');
    panel.innerHTML = `<strong>✓ Claude consulted</strong><br><span class="s1-section-review-note">Review complete in the terminal. Revise this section if needed, then analyze again or continue to the final Claude test.</span>`;
  } catch (e) {
    console.warn('[PromptCraft] S1 section review failed:', e);
    const fallback = getS1PartFeedback(part, values, checks);
    showClaudeConsultResult(fallback, true);
    panel.classList.remove('loading');
    panel.innerHTML = `<strong>✓ Backup review complete</strong><br><span class="s1-section-review-note">Claude was unavailable, so a local checklist review was shown in the terminal.</span>`;
  } finally {
    document.querySelectorAll('.s1-review-btn').forEach(btn => btn.disabled = false);
    const firstField = document.getElementById('g-learners');
    if (firstField) onGuidedInput(firstField);
  }
}


function switchToOpen() {
  // Replaces guided builder with plain textarea mid-session
  const container = document.getElementById('inputContainer');
  renderOpenPlain(container);
  setTimeout(() => document.getElementById('promptInput')?.focus(), 50);
}

// ── MODE 2: HINT CHIPS (Scenario 2) ──────────────────
function renderHintChips(container) {
  const chipsHTML = S2_CHIPS.map(c => `
    <span class="hint-chip" id="chip-${c.key}" aria-label="${c.label} — not yet covered">
      <span class="chip-check">✓</span>${c.label}
    </span>`).join('');

  container.innerHTML = `
    <div class="scaffold-area">
      <div class="hint-chip-label">Cover these elements as you write:</div>
      <div class="hint-chip-row" role="list" aria-label="Prompt element checklist">
        ${chipsHTML}
      </div>
      <div class="input-box">
        <label for="promptInput" class="sr-only">Write your AI prompt here</label>
        <textarea id="promptInput"
          aria-label="Write your AI prompt"
          placeholder="Write your prompt — the chips above light up as you cover each element."
          oninput="onHintInput(this);autoGrow(this)"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendOpen()}"></textarea>
        <button class="send-btn" id="sendBtn"
                onclick="sendOpen()" aria-label="Send prompt">↑</button>
      </div>
      <div class="input-footer-shared">
        <span class="input-hint">Shift + Enter for a new line</span>
        <span class="attempt-badge" aria-live="polite">Attempts: <span id="attNum">0</span></span>
      </div>
    </div>`;
}

function onHintInput(el) {
  const text = el.value;
  S2_CHIPS.forEach(c => {
    const chip = document.getElementById(`chip-${c.key}`);
    if (!chip) return;
    const covered = typeof c.test === 'function' ? c.test(text) : c.test.test(text);
    chip.classList.toggle('covered', covered);
    chip.setAttribute('aria-label',
      `${c.label} — ${covered ? 'covered' : 'not yet covered'}`);
  });
  // Save best prompt for memory hint
  if (text.length > (playerHistory.s2.bestPrompt?.length || 0)) {
    playerHistory.s2.bestPrompt = text;
  }
}

function sendOpen() {
  const input = document.getElementById('promptInput');
  const text = input?.value?.trim();
  if (!text) return;
  sendText(text);
}

// ── MODE 3: OPEN WITH MEMORY HINT (Scenario 3) ───────
function renderOpenWithMemory(container) {
  // Build memory hint from what we know about their previous attempts
  const hint = buildMemoryHint();

  container.innerHTML = `
    <div class="scaffold-area">
      ${hint ? `<div class="memory-hint visible" role="note">${hint}</div>` : ''}
      <div class="input-box">
        <label for="promptInput" class="sr-only">Write your AI prompt here</label>
        <textarea id="promptInput"
          aria-label="Write your AI prompt"
          placeholder="Write your best prompt — no hints this time, just what you have learned."
          oninput="autoGrow(this)"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendOpen()}"></textarea>
        <button class="send-btn" id="sendBtn"
                onclick="sendOpen()" aria-label="Send prompt">↑</button>
      </div>
      <div class="input-footer-shared">
        <span class="input-hint">Shift + Enter for a new line</span>
        <span class="attempt-badge" aria-live="polite">Attempts: <span id="attNum">0</span></span>
      </div>
    </div>`;
}

function buildMemoryHint() {
  const s1 = playerHistory.s1;
  const s2Score = scenarioData[1]?.bestScore || 0;

  const parts = [];

  if (s1.learners) {
    parts.push(`In Scenario 1 you described your learners as <strong>"${s1.learners.substring(0, 60)}"</strong> — keep that specificity.`);
  }

  if (s2Score >= 4) {
    parts.push(`Your Scenario 2 prompts were strong. See if you can push the constraint detail even further this time.`);
  } else if (s2Score >= 2) {
    parts.push(`In Scenario 2 you were getting more specific. This time try to include a concrete format or time constraint.`);
  } else {
    parts.push(`This is your final scored scenario — no chips or fields, just what you have learned. Be as specific as you can about who, what, and the context.`);
  }

  return parts.length ? `🌿 ${parts.join(' ')}` : '';
}

// ── MODE 4: PLAIN OPEN (Scenario 4 + skip target) ────
function renderOpenPlain(container) {
  container.innerHTML = `
    <div class="scaffold-area">
      <div class="input-box">
        <label for="promptInput" class="sr-only">Write your AI prompt here</label>
        <textarea id="promptInput"
          aria-label="Write your AI prompt"
          placeholder="Write your prompt here — who are your learners, what do you need, what constraints matter?"
          oninput="autoGrow(this)"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendOpen()}"></textarea>
        <button class="send-btn" id="sendBtn"
                onclick="sendOpen()" aria-label="Send prompt">↑</button>
      </div>
      <div class="input-footer-shared">
        <span class="input-hint">Shift + Enter for a new line</span>
        <span class="attempt-badge" aria-live="polite">Attempts: <span id="attNum">0</span></span>
      </div>
    </div>`;
}

// ── UNIFIED SEND ENTRY POINT ──────────────────────────
// Guard state keeps the VN prediction prompt from reopening or re-submitting
// while Claude is already processing. Without this, the VN click handler can
// turn one prompt into a tiny haunted carousel.
let predictionGateActive = false;
let isSubmittingToClaude = false;

// ══════════════════════════════════════════════════════
//  SEND
// ══════════════════════════════════════════════════════
async function send() {
  sendOpen();
}

async function sendMain(text) {
  if (!text || isSubmittingToClaude) return;
  isSubmittingToClaude = true;

  attempts++;
  lastPromptText = text; // save for pre-filling next attempt
  const attEl = document.getElementById('attNum');
  if (attEl) attEl.textContent = attempts;

  // In S1, do not print the hidden assembled prompt into the chat.
  // It is a behind-the-scenes request to Claude, not player-facing content.
  if (scenarioIndex !== 0) addMsg('user', esc(text));

  // Clear whichever input is active
  const input = document.getElementById('promptInput');
  if (input) { input.value = ''; input.style.height = 'auto'; }
  // Keep S1 guided fields visible after consulting Claude so the player can see what they submitted.
  if (scenarioIndex !== 0) {
    ['g-learners','g-issue','g-interaction','g-constraints'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  history.push({ role: 'user', content: text });
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  addTyping();

  try {
    const data = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: scenarios[scenarioIndex].system,
      messages: history
    }, 'main');
    removeTyping();

    if (data.error) {
      addMsg('ai', `<span style="color:var(--red)">Error: ${data.error.message}</span>`);
      return;
    }

    const reply = data.content[0].text;
    history.push({ role: 'assistant', content: reply });

    const score = scorePrompt(text);
    const active = detectOSCQR(reply, scenarios[scenarioIndex].oscqr);
    renderOSCQR(scenarios[scenarioIndex].oscqr, active);

    // Track behavioral data
    trackPrompt(scenarioIndex, text, score.total, reply, active.map(id => {
      const ind = scenarios[scenarioIndex].oscqr.find(o => o.id === id);
      return ind ? ind.label : id;
    }));
    // ── S8: show the AI message first, THEN handle round logic ──
    if (scenarioIndex === 7) {
      const expr = score.total <= 1 ? 'skeptical' : score.total <= 3 ? 'encouraging' : 'excited';
      const aiMsgEl = addMsg('claude', fmt(reply) + buildFeedback(score), expr);
      gainXP(score.total * 6);
      const chatEl = document.getElementById('chat');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (aiMsgEl) {
          const chatRect = chatEl.getBoundingClientRect();
          const msgRect  = aiMsgEl.getBoundingClientRect();
          chatEl.scrollTop = chatEl.scrollTop + (msgRect.top - chatRect.top) - 48;
        }
      }));
      if (s8Phase === 1) { s8AfterResponse(score.total, reply); return; }
      if (s8Phase === 2) { s8AfterRevision(score.total); return; }
    }

    // Pick expression for this response
    let replyExpr = 'neutral';
    if (score.total <= 1)      replyExpr = 'skeptical';
    else if (score.total <= 3) replyExpr = 'encouraging';
    else                        replyExpr = 'excited';

    gainXP(score.total * 6);
    lastScore = score.total;

    // Claude now lives in the terminal. Do not duplicate the final response in chat.
    showClaudeFinalResponseInTerminal(reply, !!data.mock, () => {
      if (scenarioIndex === 0) {
        // After the terminal analysis Continue button, return to Professor Pixel.
        // The result card is still created so players can review the Claude draft
        // after Pixel's bridge scene finishes.
        addS1ClaudeResultCard(reply);
        showS1PostAnalysisReflection(score.total);
      } else {
        showPixelScoreReflection(score.total, () => {
          maybeShowNavCard(score.total);
          markScenarioComplete();
        });
      }
    }, score.total);

  } catch(e) {
    removeTyping();
    addMsg('ai', `<span style="color:var(--red)">Something went wrong. Please try again.</span>`);
  } finally {
    isSubmittingToClaude = false;
    predictionGateActive = false;
    const btn = document.getElementById('sendBtn');
    if (btn) btn.disabled = false;
    // Note: intentionally not scrolling to bottom here --
    // the AI response scroll-into-view above handles positioning

    // Pre-fill input with last prompt so player can refine rather than rewrite
    if (lastPromptText && (scenarioIndex !== 0) && (scenarioIndex < 3 || scenarioIndex === 4 || scenarioIndex === 5 || scenarioIndex === 7)) {
      const inp = document.getElementById('promptInput');
      if (inp) {
        inp.value = lastPromptText;
        autoGrow(inp);
        inp.setSelectionRange(0, inp.value.length); // select all so they can immediately overwrite or refine
      }
      // Pre-fill guided builder fields if in S1
      if (scenarioIndex === 0) {
        const s1 = playerHistory?.s1;
        if (s1 && document.getElementById('g-learners')) {
          const l = document.getElementById('g-learners');
          const i = document.getElementById('g-issue');
          const m = document.getElementById('g-interaction');
          const c = document.getElementById('g-constraints');
          if (l) l.value = s1.learners || '';
          if (i) i.value = s1.goal || s1.issue || '';
          if (m) m.value = s1.interaction || '';
          if (c) c.value = s1.constraints || '';
          onGuidedInput(l);
        }
      }
    }
  }
}
// ══════════════════════════════════════════════════════
function scorePrompt(text) {
  const t = text.toLowerCase();

  if (scenarioIndex === 0) {
    const hasLearners = /\b(student|learner|online|class|course|first-year|gen ed|general education|college|higher ed|adult|cohort|asynchronous)\b/.test(t);
    const hasGoal = /\b(one.sentence|surface|shallow|dead|generic|conversation dies|do not build|not build|weak|low.quality|low quality|reply|replies|engagement problem)\b/.test(t);
    const hasContext = /\b(compare|contrast|respond|reply|peer|build|question|evidence|example|explain|reason|connect|agree|disagree|extend|substantive|follow.up|follow-up)\b/.test(t);
    const hasConstraint = /\b(asynchronous|online|week|weekly|reply|replies|peer|two|2|word|minute|lms|canvas|no extra|low.tech|format|deadline|by)\b/.test(t) || /\d+/.test(t);
    const isDetailed = /\b(success|criteria|strong response|strong post|substantive|meaningful|evidence|example|explain|reasoning|rubric|quality|must include|should include)\b/.test(t) || text.length > 220;
    return { hasLearners, hasGoal, hasContext, hasConstraint, isDetailed,
      total: [hasLearners, hasGoal, hasContext, hasConstraint, isDetailed].filter(Boolean).length };
  }

  // WHO: learner context — expanded to catch natural educator language
  const hasLearners = /\b(student|learner|rural|online|class|grade|level|adult|community|educator|teacher|participant|cohort|staff|faculty|k-12|high school|middle school|elementary|college|university|higher ed|professional|beginner|advanced|novice|experienced|mixed.ability|diverse|special ed|esl|ell|english language)\b/.test(t);

  // WHAT: goal or outcome — expanded
  const hasGoal = /\b(goal|outcome|objective|learn|understand|create|design|develop|able to|skill|competency|knowledge|demonstrate|apply|analyze|evaluate|build|improve|practice|master|explore|discover|produce|complete|achieve|engage|reflect|assess|review|identify|compare|explain|describe|discuss|argue|persuade|synthesize|teach|train|support|help)\b/.test(t);

  // WHERE/WHEN: course or subject context — expanded
  const hasContext = /\b(course|subject|week|unit|module|discussion|assignment|activity|topic|lesson|project|curriculum|program|class|semester|quarter|session|workshop|training|pd|professional development|chapter|section|term|strand|standard|science|math|english|history|art|health|pe|biology|chemistry|physics|literature|writing|reading|social studies|technology|stem|steam)\b/.test(t);

  // HOW/HOW MUCH: constraints or format — greatly expanded
  const hasConstraint = /\b(minute|hour|word|short|brief|limit|length|format|timeline|deadline|week|daily|weekly|monthly|schedule|time|page|pages|slide|slides|rubric|criteria|step|steps|stage|phase|level|tier|type|style|mode|medium|tool|platform|online|in.person|synchronous|asynchronous|budget|resource|available|access|device|internet|low.tech|no.tech|free|cost|template|structure|outline|draft|version|attempt|try|iteration|cycle|round|session|period|range|number|amount|count|total|maximum|minimum|at least|no more|within|by|due|before|after)\b/.test(t) || /\d+/.test(t);

  // DETAIL: just needs to be substantive
  const isDetailed = text.length > 80;

  return { hasLearners, hasGoal, hasContext, hasConstraint, isDetailed,
    total: [hasLearners, hasGoal, hasContext, hasConstraint, isDetailed].filter(Boolean).length };
}

function buildFeedback(s) {
  const isS1 = scenarioIndex === 0;
  const items = isS1 ? [
    { key:'hasLearners',   label:'Learner/course context' },
    { key:'hasGoal',       label:'Names the failure' },
    { key:'hasContext',    label:'Interaction plan' },
    { key:'hasConstraint', label:'Constraints' },
    { key:'isDetailed',    label:'Success criteria' },
  ] : [
    { key:'hasLearners',   label:'Learner context' },
    { key:'hasGoal',       label:'Clear goal' },
    { key:'hasContext',    label:'Course context' },
    { key:'hasConstraint', label:'Constraints' },
    { key:'isDetailed',    label:'Enough detail' },
  ];
  const chips = items.map(i =>
    `<span class="score-chip ${s[i.key] ? 'good' : 'needs'}">${s[i.key] ? '✓' : '+'} ${i.label}</span>`
  ).join('');
  const tips = [];
  if (isS1) {
    if (!s.hasLearners)   tips.push('Name the learners and course setting so Claude knows who the discussion is for');
    if (!s.hasGoal)       tips.push('Tell Claude what is wrong with the original prompt: one-sentence replies, shallow posts, or no real conversation');
    if (!s.hasContext)    tips.push('Specify the interaction move: compare ideas, use evidence, ask follow-up questions, or build on a peer');
    if (!s.hasConstraint) tips.push('Add constraints such as asynchronous format, number of replies, time, word count, or LMS limits');
    if (!s.isDetailed)    tips.push('Define what a stronger student reply should include');
  } else {
    if (!s.hasLearners)   tips.push('Describe your learners — rural, online, grade level, subject area');
    if (!s.hasGoal)       tips.push('State what you want students to be able to do or understand');
    if (!s.hasContext)    tips.push('Mention the course, unit, or topic this activity belongs to');
    if (!s.hasConstraint) tips.push('Add a constraint like time limit, word count, or format');
  }
  const successMsg = isS1
    ? 'Strong repair prompt! You connected the AI request back to the actual discussion-board failure, not just the general topic.'
    : 'Strong prompt! Notice how much more useful the AI output is when you give it context.';
  const tipBlock = tips.length
    ? `<ul class="fp-tips">${tips.map(t => `<li>${t}</li>`).join('')}</ul>`
    : `<p class="fp-success">${successMsg}</p>`;
  return `
    <div class="feedback-panel">
      <div class="fp-header">${isS1 ? 'Discussion Repair Analysis' : 'Prompt Analysis'}</div>
      <div class="fp-body">
        <div class="score-chips">${chips}</div>
        ${tips.length ? `<p style="font-size:0.73rem;color:var(--ink-light);margin-bottom:5px;font-weight:600;">Try adding:</p>` : ''}
        ${tipBlock}
      </div>
    </div>`;
}

// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function cleanS1ClaudeDraft(text) {
  return String(text || '')
    .replace(/^#{1,3}\s*Revised Discussion Prompt\s*/i, '')
    .replace(/^Revised Discussion Prompt\s*/i, '')
    .replace(/^Here's your redesigned discussion prompt:\s*/i, '')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function esc(t) {
  return String(t ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Minimal markdown formatter used by result cards and legacy chat bubbles.
// Claude's cleanup removed this helper, which made Consult Claude crash after the mock response returned.
function fmt(text) {
  return esc(String(text ?? ''))
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = 'auto';

  const cap = el.id && el.id.startsWith('g-') ? 190 : 130;
  el.style.height = Math.min(el.scrollHeight, cap) + 'px';
}

function gainXP(amount) {
  xp = Math.min(100, xp + amount);
  document.getElementById('xpFill').style.width = xp + '%';
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', Math.round(xp));
  if (xp >= 40) document.getElementById('levelTag').textContent = 'lead educator · developing';
  if (xp >= 75) document.getElementById('levelTag').textContent = 'master prompter · proficient';
}

// ══════════════════════════════════════════════════════
//  COMPLETION
// ══════════════════════════════════════════════════════
function markScenarioComplete() {
  scenarioCompleted[scenarioIndex] = true;

  // Save incremental data for this scenario
  saveIncrementalData(scenarioIndex);

  // Unlock next scenario at the right moments
  const s1s2s3done = scenarioCompleted[0] && scenarioCompleted[1] && scenarioCompleted[2];
  if (s1s2s3done && !scenarioCompleted[3]) unlockScenario4();
  if (scenarioCompleted[3] && !scenarioCompleted[4]) unlockScenario5();
  if (scenarioCompleted[4] && !scenarioCompleted[5]) unlockScenario6();
  if (scenarioCompleted[5] && !scenarioCompleted[6]) unlockScenario7();
  if (scenarioCompleted[6] && !scenarioCompleted[7]) unlockScenario8();

  const allDone = scenarioCompleted.every(Boolean);
  const area = document.getElementById('chat');
  const div = document.createElement('div');
  div.className = 's1-scenario-complete-note';
  div.style.cssText = 'text-align:center;padding:12px 0 4px;animation:slideUp 0.35s ease forwards;opacity:0;';

  if (allDone && !document.getElementById('completeAllBtn')) {
    playSound('allComplete');
    loadSceneImage('scene-complete.png');
    document.getElementById('vnBoardText').textContent =
      'You have completed all eight scenarios. Head into the Reflection Room when you are ready — your responses contribute to research on how educators use AI in their practice.';
    setTimeout(() => playPixelSequence('allComplete', null), 400);
    pixelBadgeSetExpr('excited');
    div.innerHTML = `
      <p style="font-size:0.76rem;color:var(--ink-light);margin-bottom:10px;font-weight:600;">All eight scenarios complete.</p>
      <button class="complete-btn" id="completeAllBtn" onclick="openReflection()">Enter the Reflection Room →</button>`;
  } else if (!allDone) {
    const done = scenarioCompleted.filter(Boolean).length;
    playSound('scenarioComplete');
    pixelBadgeSetExpr('encouraging');
    const remaining = scenarioCompleted.length - done;
    div.innerHTML = `<p style="font-size:0.74rem;color:var(--ink-muted);">
      Scenario complete — ${remaining} remaining before the Reflection Room unlocks.
    </p>`;
  }
  area.appendChild(div);
  if (document.body.classList.contains('s1-result-active')) {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  } else {
    area.scrollTop = area.scrollHeight;
  }
}

// ══════════════════════════════════════════════════════
//  REFLECTION ROOM
// ══════════════════════════════════════════════════════
function openReflection() {
  autoSaveSession('reflection_room_opened');
  playSound('reflectionOpen');
  document.getElementById('reflectionOverlay').classList.add('visible');
}

function closeReflection() {
  document.getElementById('reflectionOverlay').classList.remove('visible');
}

async function handleReflectionSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('refSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const formData = new FormData(e.target);

  // ── QUALTRICS MODE ─────────────────────────────────
  if (SURVEY_MODE === 'qualtrics') {
    window.open(QUALTRICS_URL, '_blank', 'noopener');
    document.getElementById('refForm').style.display = 'none';
    document.getElementById('refSuccess').style.display = 'block';
    return;
  }

  // ── GOOGLE SHEETS MODE ─────────────────────────────
  if (SURVEY_MODE === 'sheets') {
    if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      alert('Google Sheets URL is not configured yet. Check SHEETS_URL in the script.');
      btn.disabled = false;
      btn.textContent = 'Submit Reflection';
      return;
    }
    try {
      const payload = buildSessionPayload(formData);
      console.log('[PromptCraft] Submitting full session payload:', payload);

      await postToSheets(payload, 'full session payload');
      console.log('[PromptCraft] Sheets submission sent');
    } catch(err) {
      console.warn('[PromptCraft] Sheets submission error:', err);
    }

    // Always also submit to Netlify Forms as a backup
    // This ensures data is never lost even if Sheets fails silently
    try {
      const netlifyData = new URLSearchParams();
      netlifyData.append('form-name', 'promptcraft-reflection');
      formData.forEach((v, k) => netlifyData.append(k, v));
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyData.toString()
      });
      console.log('[PromptCraft] Netlify fallback sent');
    } catch(err) {
      // Netlify fallback is best-effort -- Sheets is the primary
    }

    // Show success + trigger growth report generation
    document.getElementById('refForm').style.display = 'none';
    document.getElementById('refSuccess').style.display = 'block';

    // Generate AI growth narrative asynchronously
    const reflAnswers = {
      q1: formData.get('q1_surprise') || '',
      q2: formData.get('q2_change')   || '',
      q3: formData.get('q3_practice') || '',
      q4: formData.get('q4_other')    || '',
    };
    generateGrowthReport(reflAnswers).then(narrative => {
      const el = document.getElementById('growthNarrative');
      if (el && narrative) el.innerHTML = narrative.replace(/\n/g, '<br>');
      const g = buildGrowthScores();
      const tableEl = document.getElementById('growthTable');
      if (tableEl) tableEl.innerHTML = buildGrowthTableHTML(g);
      // Append growth data to payload and re-submit (best-effort)
      if (narrative) {
        const growthPayload = Object.assign(buildSessionPayload(formData), {
          ai_narrative: narrative,
          growth_json: JSON.stringify({
            trajectory: g.trajectory,
            avg: (g.trajectory.reduce((a,b)=>a+b,0)/8).toFixed(2),
            delta: g.delta,
            threshold_met: g.threshold_met,
            s5_caught: g.s5_caught,
            s6_predicted: g.s6_predicted,
            s7_correct: g.s7_correct,
          }),
        });
        postToSheets(growthPayload, 'growth follow-up payload').catch(() => {});
      }
    });
    return;
  }

  // ── NETLIFY FORMS MODE (fallback) ──────────────────
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
    if (res.ok) {
      document.getElementById('refForm').style.display = 'none';
      document.getElementById('refSuccess').style.display = 'block';
      // Generate growth report even in netlify mode
      const rfAnswers = { q1: formData.get('q1_surprise')||'', q2: formData.get('q2_change')||'', q3: formData.get('q3_practice')||'', q4: formData.get('q4_other')||'' };
      generateGrowthReport(rfAnswers).then(narrative => {
        const el = document.getElementById('growthNarrative');
        if (el && narrative) el.innerHTML = narrative.replace(/\n/g, '<br>');
        const g = buildGrowthScores();
        const tableEl = document.getElementById('growthTable');
        if (tableEl) tableEl.innerHTML = buildGrowthTableHTML(g);
      });
    } else {
      btn.disabled = false;
      btn.textContent = 'Submit Reflection';
      alert('Something went wrong. Please try again.');
    }
  } catch(err) {
    btn.disabled = false;
    btn.textContent = 'Submit Reflection';
    alert('Could not submit. Check your connection and try again.');
  }
}

function devGoS4() {
  scenarioCompleted = [true, true, true, false, false, false, false, false];
  unlockScenario4();
  const btn = document.getElementById('s4Tab');
  btn.classList.remove('locked');
  btn.disabled = false;
  switchScenario(3, btn);
}

function devTestS4() {
  devGoS4();
  // Auto-click the self-report once the interrupt fires
  const tryClick = (attempts) => {
    const btns = document.querySelectorAll('.s4-btn');
    if (btns.length > 0) {
      s4SelectReport(btns[0], 'yes_noticed');
    } else if (attempts < 10) {
      setTimeout(() => tryClick(attempts + 1), 500);
    }
  };
  setTimeout(() => tryClick(0), 3000);
}

function devGoS5() {
  scenarioCompleted = [true, true, true, true, false, false, false, false];
  unlockScenario4();
  unlockScenario5();
  const btn = document.getElementById('s5Tab');
  btn.classList.remove('locked');
  btn.disabled = false;
  switchScenario(4, btn);
}

// devTestS5 replaced by devFillS5 — see below

// Fill S5 test data: clicks the correct prediction button,
// then fills the improved prompt textarea. Does NOT auto-send.
function devFillS5() {
  // Navigate to S5 if not already there
  if (scenarioIndex !== 4) devGoS5(); // S5 = Hallucination (index 4)

  const clickPrediction = (attempts) => {
    const btns = [...document.querySelectorAll('.s4-btn')];
    const correct = btns.find(b => b.getAttribute('onclick')?.includes('generic'));
    if (correct) {
      correct.click();
      waitForInput(0);
    } else if (attempts < 15) {
      setTimeout(() => clickPrediction(attempts + 1), 400);
    }
  };

  const waitForInput = (attempts) => {
    const input = document.getElementById('promptInput');
    if (input && input.offsetParent !== null) {
      input.value = scenarios[4].testPrompt ||
        'I teach an online introductory biology course (16 weeks, fully asynchronous). My students are first-year undergraduates with varying science backgrounds. I need a low-stakes quiz with 5 multiple-choice questions testing key vocabulary from Module 3 on cell structure. Questions should be completable in under 10 minutes with no external resources.';
      autoGrow(input);
      input.focus();
      // No auto-send — user hits Send themselves
    } else if (attempts < 20) {
      setTimeout(() => waitForInput(attempts + 1), 400);
    }
  };

  // If we just navigated, give extra time for the VN + prediction card to render
  setTimeout(() => clickPrediction(0), scenarioIndex !== 4 ? 30000 : 200);
}

function devGoS6() {
  scenarioCompleted = [true, true, true, true, true, false, false, false];
  unlockScenario4();
  unlockScenario5();
  unlockScenario6();
  const btn = document.getElementById('s6Tab');
  btn.classList.remove('locked');
  btn.disabled = false;
  switchScenario(5, btn);
}

// devTestS6 replaced by devFillS6 below

// Fill S6 test data: waits for the textarea to appear after the
// biased plan + Pixel reveal sequence, then fills — no auto-send.
function devFillS6() {
  // Navigate to S6 if not already there
  if (scenarioIndex !== 5) devGoS6(); // S6 = Predict (index 5)

  const waitForInput = (attempts) => {
    const input = document.getElementById('promptInput');
    if (input && input.offsetParent !== null) {
      input.value = 'Redesign COMM 495 as a fully asynchronous capstone for adult learners in an online program. Students have no shared availability and cannot attend live sessions. All collaboration, feedback, and presentations must be asynchronous. Do not assume access to Zoom, Google accounts, Slack, or any synchronous tool. The program serves working adults across multiple time zones. Deliverables should be submittable on flexible individual schedules.';
      autoGrow(input);
      input.focus();
      // No auto-send — user reads, then hits Send themselves
    } else if (attempts < 25) {
      setTimeout(() => waitForInput(attempts + 1), 400);
    }
  };
  // S6 has a delayed reveal sequence; if we just navigated give it extra time
  setTimeout(() => waitForInput(0), scenarioIndex !== 5 ? 3000 : 200);
}

function devGoS7() {
  scenarioCompleted = [true, true, true, true, true, true, false, false];
  unlockScenario4();
  unlockScenario5();
  unlockScenario6();
  unlockScenario7();
  const btn = document.getElementById('s7Tab');
  btn.classList.remove('locked');
  btn.disabled = false;
  switchScenario(6, btn);
}

function devGoS8() {
  scenarioCompleted = [true, true, true, true, true, true, true, false];
  unlockScenario4(); unlockScenario5(); unlockScenario6(); unlockScenario7(); unlockScenario8();
  const btn = document.getElementById('s8Tab');
  if (btn) switchScenario(7, btn);
}

// Auto-select a prediction during dev auto-send tests so the new prediction gate
// does not block the old testing workflow. Tiny mercy from the code swamp.
function devAutoChoosePrediction(choice = 'targeted') {
  const tryChoose = (attempts = 0) => {
    const vnGate = document.querySelector('.vn-prediction-options');
    const oldGate = document.getElementById('predictionGate');
    if ((vnGate || oldGate || predictionGateActive) && window.pendingPromptForPrediction) {
      choosePrediction(choice);
    } else if (attempts < 20) {
      setTimeout(() => tryChoose(attempts + 1), 250);
    }
  };
  tryChoose();
}

// Dev shortcut: move to the next scenario and unlock it if needed.
// Auto-fill test prompt and submit for S1-S3
// Navigate to scenario without filling or sending
// Fill the test prompt into the textarea — no auto-send
// S1 still auto-fills and sends (guided builder needs it)
function devVN(preset) {
  const presets = {
    welcome:  { expr:'excited',     text:"Welcome to the Prompt Lab! I am Professor Pixel. This is the dev test sequence." },
    excited:  { expr:'excited',     text:"This is the excited expression. Strong prompts and major moments." },
    skeptical:{ expr:'skeptical',   text:"Hmm. Skeptical expression — vague prompts and critical moments." },
  };
  const p = presets[preset];
  if (p) vnShow(p.expr, p.text, null);
}

function devSkip() {
  scenarioCompleted = [true,true,true,false,false,false,false,false];
  openReflection();
}

function devComplete() {
  scenarioCompleted = [true,true,true,false,false,false,false,false];
  const area = document.getElementById('chat');
  const div = document.createElement('div');
  div.style.cssText = 'text-align:center;padding:12px 0 4px;';
  div.innerHTML = `
    <p style="font-size:0.74rem;color:var(--ink-light);margin-bottom:10px;font-weight:600;">[DEV] All complete.</p>
    <button class="complete-btn" id="completeAllBtn" onclick="openReflection()">Enter the Reflection Room →</button>`;
  area.appendChild(div);
  if (document.body.classList.contains('s1-result-active')) {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  } else {
    area.scrollTop = area.scrollHeight;
  }
}


// ══════════════════════════════════════════════════════
//  S1 WORKBENCH — final owner
//  renderGuidedBuilder, onGuidedInput, sendGuided,
//  addS1ClaudeResultCard, showS1ResultControls, reviseS1,
//  and all S1 guided builder helpers.
//  These supersede the earlier definitions above.
// ══════════════════════════════════════════════════════
const S1_STORAGE_KEY = 'promptcraft_s1_clean_draft';

function safeJsonParse(raw, fallback){
  try { return raw ? JSON.parse(raw) : fallback; } catch(e) { return fallback; }
}

function getS1GuidedValues(){
  return {
    learners: (document.getElementById('g-learners')?.value || '').trim(),
    issue: (document.getElementById('g-issue')?.value || '').trim(),
    interaction: (document.getElementById('g-interaction')?.value || '').trim(),
    constraints: (document.getElementById('g-constraints')?.value || '').trim()
  };
};

function saveS1Draft(values){
  window.playerHistory = window.playerHistory || {};
  window.playerHistory.s1 = Object.assign({}, values || getS1GuidedValues());
  try { localStorage.setItem(S1_STORAGE_KEY, JSON.stringify(window.playerHistory.s1)); } catch(e) {}
};

function restoreS1DraftToFields(){
  [['g-learners','learners'],['g-issue','issue'],['g-interaction','interaction'],['g-constraints','constraints']].forEach(([id,key]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      if (typeof autoGrow === 'function') autoGrow(el);
    }
  });

  if (typeof onGuidedInput === 'function') {
    onGuidedInput(document.getElementById('g-learners'));
  }
};

function analyzeS1Guided(values){
  const allText = `${values.learners} ${values.issue} ${values.interaction} ${values.constraints}`.toLowerCase();
  return {
    audience: values.learners.length > 12 || /student|learner|class|course|online|first-year|adult|faculty|cohort|gen ed|general education|asynchronous/.test(allText),
    issue: values.issue.length > 12 || /one.sentence|one sentence|surface|shallow|dead|not build|do not build|generic|reply|replies|conversation|dies|stops|weak|required/.test(allText),
    interaction: values.interaction.length > 12 || /compare|contrast|respond|reply|peer|build|question|evidence|example|explain|reason|connect|disagree|agree|extend|challenge|follow/.test(allText),
    constraints: values.constraints.length > 8 || /minute|week|reply|peer|two|2|asynchronous|format|word|time|low tech|no extra|lms|canvas|deadline/.test(allText),
    success: /substantive|meaningful|evidence|example|build|criteria|reason|explain|success|quality|rubric|strong|specific|follow.up|follow-up|extend|challenge/.test(allText)
  };
};

function buildS1MissionHTML(){
  return `
    <section class="s1-clean-mission" role="region" aria-label="Mission briefing">
      <div class="mission-eyebrow">Mission Briefing</div>
      <div class="mission-title">Fix the dead discussion board.</div>
      <div class="mission-copy">
        Students are participating, but the conversation dies after one exchange. Diagnose the problem and use Claude to redesign the discussion so students extend, challenge, and build on ideas.
      </div>
    </section>`;
}

function buildS1LeftHTML(){
  return `
    <div class="s1-clean-left">
      <section class="s1-clean-card" aria-label="Faculty submission">
        <div class="s1-clean-eyebrow">Faculty Submission</div>
        <div class="s1-clean-title">Current Discussion Prompt</div>
        <div class="s1-clean-prompt">
          What did you think about this week's reading?<br><br>
          Reply to at least two classmates.
        </div>
        <div class="s1-clean-title" style="font-size:0.98rem;margin-bottom:7px;">Observed Problems</div>
        <div class="s1-clean-observed">
          <div><strong>Post quality:</strong> Mostly one-sentence reactions.</div>
          <div><strong>Peer replies:</strong> Feel required, not conversational.</div>
          <div><strong>Conversation:</strong> Rarely continues beyond one exchange.</div>
        </div>
        <div class="s1-clean-ingredients" aria-label="Prompt ingredients checklist">
          <div class="ingredient-heading">Prompt Ingredients</div>
          <div class="ingredient-row">
            <span class="ingredient-chip" id="ing-audience">Audience</span>
            <span class="ingredient-chip" id="ing-goal">Problem</span>
            <span class="ingredient-chip" id="ing-context">Interaction Move</span>
            <span class="ingredient-chip" id="ing-constraints">Constraints</span>
            <span class="ingredient-chip" id="ing-success">Success Criteria</span>
          </div>
        </div>
      </section>
    </div>`;
}

function buildS1RightHTML(){
  return `
    <div class="s1-clean-right">
      <section class="s1-clean-builder" aria-label="Repair workspace">
        <div class="s1-clean-builder-head">
          <div>
            <div class="s1-clean-builder-title">Repair Workspace</div>
            <div class="s1-clean-builder-sub">Give Claude the information it needs to repair the actual teaching problem, not just make a prettier prompt.</div>
          </div>
        </div>
        <div class="s1-clean-fields">
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-learners"><span class="s1-clean-num">1</span>Learners + course</label>
            <textarea class="s1-clean-textarea" id="g-learners" rows="3" placeholder="Who are these students? What kind of course is this?" oninput="onGuidedInput(this)" aria-label="Describe learners and course"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-issue"><span class="s1-clean-num">2</span>What is failing?</label>
            <textarea class="s1-clean-textarea" id="g-issue" rows="3" placeholder="What exactly is going wrong in the discussion?" oninput="onGuidedInput(this)" aria-label="Describe the discussion problem"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-interaction"><span class="s1-clean-num">3</span>Interaction move</label>
            <textarea class="s1-clean-textarea" id="g-interaction" rows="3" placeholder="How should students build on, challenge, compare, or extend peer ideas?" oninput="onGuidedInput(this)" aria-label="Describe the interaction move"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-constraints"><span class="s1-clean-num">4</span>Constraints + success criteria</label>
            <textarea class="s1-clean-textarea" id="g-constraints" rows="3" placeholder="What limits matter? What should a strong reply include?" oninput="onGuidedInput(this)" aria-label="Describe constraints and success criteria"></textarea>
          </div>
        </div>
        <div class="s1-clean-actions">
          <div class="s1-clean-nudge" id="s1BuilderNudge"></div>
          <button class="s1-clean-submit" id="sendBtn" type="button" onclick="sendGuided()">Consult Claude →</button>
        </div>
      </section>
    </div>`;
}

function renderGuidedBuilder(container){
  if (!container) container = document.getElementById('inputContainer');
  if (!container) return;
  document.body.classList.add('s1-active');
  document.body.classList.remove('s1-result-active');
  container.className = 's1-clean-workbench';
  container.style.display = 'flex';
  container.innerHTML = `
    <div class="s1-clean-stage">
      ${buildS1MissionHTML()}
      <div class="s1-clean-grid">
        ${buildS1LeftHTML()}
        ${buildS1RightHTML()}
      </div>
    </div>`;
  restoreS1DraftToFields();
  setTimeout(() => document.getElementById('g-learners')?.focus(), 60);
};

function onGuidedInput(el){
  if (el && typeof autoGrow === 'function') autoGrow(el);
  const values = getS1GuidedValues();
  saveS1Draft(values);
  const checks = analyzeS1Guided(values);
  const ingredientChecks = {
    audience: checks.audience,
    goal: checks.issue,
    context: checks.interaction,
    constraints: checks.constraints,
    success: checks.success
  };
  Object.entries(ingredientChecks).forEach(([key, covered]) => {
    const chip = document.getElementById(`ing-${key}`);
    if (!chip) return;
    chip.classList.toggle('covered', !!covered);
    chip.setAttribute('aria-label', `${chip.textContent} — ${covered ? 'covered' : 'not yet covered'}`);
  });
  const missing = [];
  if (!checks.issue) missing.push('name the specific failure');
  if (!checks.interaction) missing.push('define how students should respond to one another');
  if (!checks.success) missing.push('say what a stronger reply should include');
  const nudge = document.getElementById('s1BuilderNudge');
  if (nudge) {
    if (missing.length >= 2) {
      nudge.style.display = 'block';
      nudge.innerHTML = `<strong>Pixel's nudge:</strong> ${missing.join('; ')}.`;
    } else {
      nudge.style.display = 'none';
      nudge.innerHTML = '';
    }
  }
};

function buildS1AssembledPrompt(values){
  const parts = [
    `I need help fixing this weak asynchronous discussion prompt: "What did you think about this week's reading? Reply to at least two classmates."`
  ];
  if (values.learners) parts.push(`Learners and course context: ${values.learners}.`);
  if (values.issue) parts.push(`The current problem is: ${values.issue}.`);
  if (values.interaction) parts.push(`Redesign the discussion so students: ${values.interaction}.`);
  if (values.constraints) parts.push(`Constraints and success criteria: ${values.constraints}.`);
  parts.push('Create a revised student-facing discussion prompt. Keep it practical for an asynchronous online course. Briefly explain how the revision addresses the original problem of surface-level replies.');
  return parts.join(' ');
};

function sendGuided(){
  const values = getS1GuidedValues();
  saveS1Draft(values);
  const checks = analyzeS1Guided(values);
  const missing = [];
  if (!checks.audience) missing.push('audience/course');
  if (!checks.issue) missing.push('problem diagnosis');
  if (!checks.interaction) missing.push('interaction move');
  if (!checks.constraints) missing.push('constraints');
  if (!checks.success) missing.push('success criteria');
  if (missing.length >= 3) {
    const nudge = document.getElementById('s1BuilderNudge');
    if (nudge) {
      nudge.style.display = 'block';
      nudge.innerHTML = `<strong>Before we ask Claude:</strong> Add more detail for ${missing.join(', ')}.`;
    }
    const focusMap = { 'audience/course':'g-learners', 'problem diagnosis':'g-issue', 'interaction move':'g-interaction', 'constraints':'g-constraints', 'success criteria':'g-constraints' };
    document.getElementById(focusMap[missing[0]])?.focus();
    return;
  }
  sendText(buildS1AssembledPrompt(values));
};

function buildS1TerminalDiagnosis(score, responseText){
  const values = getS1GuidedValues();
  const checks = analyzeS1Guided(values);
  const level = score <= 2 ? 'NEEDS MORE CONTEXT' : score <= 3 ? 'PARTIAL REPAIR DETECTED' : score <= 4 ? 'STRONG REPAIR DETECTED' : 'HIGH-CONFIDENCE REPAIR';
  const missing = [];
  if (!checks.audience) missing.push('learner context');
  if (!checks.issue) missing.push('problem diagnosis');
  if (!checks.interaction) missing.push('interaction strategy');
  if (!checks.constraints) missing.push('constraints');
  if (!checks.success) missing.push('success criteria');
  const issue = 'Students are replying because the prompt requires replies, but the prompt does not create a reason to continue the conversation.';
  const repair = missing.length
    ? `Strengthen: ${missing.join(', ')}.`
    : 'Require students to extend, challenge, compare, or build on a peer\'s idea using evidence or reasoning.';
  const confidence = score <= 2 ? 'LOW' : score <= 3 ? 'MODERATE' : 'HIGH';
  return `STATUS\n${level}\n\nISSUE DETECTED\n${issue}\n\nRECOMMENDED REPAIR\n${repair}\n\nCONFIDENCE\n${confidence}`;
};

function addS1ClaudeResultCard(responseText){
  document.body.classList.add('s1-result-active');
  const area = document.getElementById('chat');
  if (!area) return null;
  area.innerHTML = '';
  const values = (window.playerHistory && window.playerHistory.s1) || getS1GuidedValues();
  const card = document.createElement('div');
  card.className = 's1-result-card s1-result-card-focused';
  card.innerHTML = `
    <div class="s1-result-eyebrow">Claude Draft</div>
    <div class="s1-result-title">Revised Discussion Prompt</div>
    <div class="s1-result-content-box">
      <div class="s1-result-body">${fmt(cleanS1ClaudeDraft(responseText))}</div>
      <div class="s1-clean-reference">
        <div class="s1-clean-reference-title">Your Repair Notes</div>
        <div><strong>Learners:</strong> ${esc(values.learners || 'Not provided')}</div>
        <div><strong>Problem:</strong> ${esc(values.issue || 'Not provided')}</div>
        <div><strong>Interaction:</strong> ${esc(values.interaction || 'Not provided')}</div>
        <div><strong>Constraints:</strong> ${esc(values.constraints || 'Not provided')}</div>
      </div>
    </div>`;
  area.appendChild(card);
  try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
  area.scrollTop = 0;
  requestAnimationFrame(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  });
  return card;
};

function showS1ResultControls(scoreTotal, mode = 'postReflection'){
  const container = document.getElementById('inputContainer');
  if (!container) return;
  const thresholdMet = scoreTotal >= SCORE_THRESHOLD;
  const reviewMode = mode === 'review';
  container.className = '';
  container.style.display = 'block';
  container.innerHTML = `
    <div class="s1-result-controls" role="region" aria-label="Scenario 1 result options">
      <div>
        <div class="s1-result-controls-title">Scenario 1 result</div>
        <div class="s1-result-controls-sub">${reviewMode ? `Claude's draft is shown above. Review the analysis before Pixel explains what changed.` : `Pixel's explanation is complete. Choose the next step.`}</div>
      </div>
      <div class="s1-result-controls-actions">
        <button class="s1-secondary-btn" type="button" onclick="reviseS1()">Revise S1</button>
        ${reviewMode
          ? `<button class="continue-btn" type="button" onclick="showS1PostAnalysisReflection(${Number(scoreTotal) || 0})">Continue with Pixel →</button>`
          : (thresholdMet ? `<button class="continue-btn" type="button" onclick="navigateToNext(1)">Next scenario →</button>` : `<button class="continue-btn" type="button" onclick="reviseS1()">Strengthen and try again</button>`)}
      </div>
    </div>`;
};

function showS1PostAnalysisReflection(scoreTotal){
  // Robust S1 handoff: Claude terminal/result page -> Professor Pixel VN review.
  // This deliberately clears every prediction/Claude wait flag so vnAdvance is not blocked.
  try {
    window.pcWaitingForClaudeContinue = false;
    window.predictionGateActive = false;
    window.isSubmittingToClaude = false;
    document.getElementById('pcContinueToClaudeBtn')?.remove();
    stopClaudeTTS?.();
  } catch(e) {}

  const overlay = document.getElementById('vnOverlay');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const text = document.getElementById('vnText');
  const hint = document.getElementById('vnAdvanceHint');
  const character = document.getElementById('vnCharacter');

  if (overlay) {
    overlay.classList.remove(
      'claude-consult',
      'claude-terminal-consult',
      'claude-terminal-textmode',
      'claude-analysis',
      'claude-prediction',
      'pc-clean-prediction',
      'pc-clean-output',
      'pc-prediction-result'
    );
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
  }

  if (dialogue) {
    dialogue.classList.remove('has-choices');
    dialogue.style.display = '';
  }
  if (speaker) speaker.textContent = 'Professor Pixel';
  if (text) text.innerHTML = '';
  if (hint) hint.classList.remove('show');
  if (character) character.classList.add('visible');

  try { setVNClaudeMode(false); } catch(e) {}
  try { setVNClaudeTerminalMode(false); } catch(e) {}
  try { setClaudeTerminalTextMode(false); } catch(e) {}
  try { setClaudeShelfState('idle', 'idle'); } catch(e) {}

  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { vnQueue = []; } catch(e) {}
  vnOnComplete = null;
  vnTyping = false;
  vnFullText = '';
  vnCurrentText = '';

  // Use a short, explicit S1 review instead of relying only on the generic score
  // reflection. This is the missing bridge between Claude's diagnostic and the
  // final result controls.
  const lines = [
    {
      expr: 'encouraging',
      text: "Now we have something useful. Claude found that the original prompt was not broken because students ignored it. It was broken because students were doing exactly what it asked."
    },
    {
      expr: 'thinking',
      text: "That is the design problem: compliance is not the same thing as interaction. A reply requirement can create activity without creating a reason to continue the conversation."
    },
    {
      expr: scoreTotal >= SCORE_THRESHOLD ? 'proud' : 'encouraging',
      text: scoreTotal >= SCORE_THRESHOLD
        ? "Your revision gives students a clearer interaction move, a purpose for replying, and criteria for what a stronger response should include. That is a real repair, not just prettier wording."
        : "Your revision is moving in the right direction. Before moving on, strengthen the prompt so students know how to extend, challenge, compare, or build on a peer's idea."
    }
  ];

  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    vnShow(line.expr, line.text, isLast ? () => {
      if (scoreTotal >= SCORE_THRESHOLD) markScenarioComplete();
      showS1ResultControls(scoreTotal, 'postReflection');
    } : null);
  });
}
window.showS1PostAnalysisReflection = showS1PostAnalysisReflection;

window.reviseS1 = reviseS1 = function reviseS1(){
  const saved = Object.assign(
    {},
    JSON.parse((() => { try { return localStorage.getItem('promptcraft_s1_clean_draft') || '{}'; } catch(e) { return '{}'; } })()),
    window.playerHistory?.s1 || {}
  );

  const area = document.getElementById('chat');
  if (area) area.innerHTML = '';

  document.body.classList.remove('s1-result-active');
  document.body.classList.add('s1-active');

  renderGuidedBuilder(document.getElementById('inputContainer'));

  setTimeout(() => {
    [
      ['g-learners', 'learners'],
      ['g-issue', 'issue'],
      ['g-interaction', 'interaction'],
      ['g-constraints', 'constraints']
    ].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = saved[key] || '';
        if (typeof autoGrow === 'function') autoGrow(el);
      }
    });

    if (typeof onGuidedInput === 'function') {
      onGuidedInput(document.getElementById('g-learners'));
    }

    document.getElementById('g-learners')?.focus();
  }, 100);
};

function showPixelScoreReflection(totalScore, onDone = null){
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) dialogue.classList.remove('has-choices');

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove('claude-consult','claude-terminal-consult','claude-terminal-textmode','claude-prediction','pc-clean-prediction','pc-clean-output','pc-prediction-result');
    overlay.classList.add('active');
  }
  const d = window.pixelDialogue;
  let lines;
  if (scenarioIndex === 1) {
    // S2 metacognition reflection
    lines =
      totalScore <= 2 ? d.s2_scoreReflection_0_2 :
      totalScore <= 3 ? d.s2_scoreReflection_3   :
                        d.s2_scoreReflection_4_5;
  } else {
    // S1 and default
    lines =
      totalScore <= 1 ? d.scoreReflection_0_1 :
      totalScore <= 2 ? d.scoreReflection_2   :
      totalScore <= 3 ? d.scoreReflection_3   :
      totalScore <= 4 ? d.scoreReflection_4   :
                        d.scoreReflection_5;
  }
  lines.forEach((line, idx) => vnShow(line.expr, line.text, idx === lines.length - 1 ? onDone : null));
};

// Clean up VN classes when advancing after a choice-heavy moment.
const oldClose = window.closeClaudeConsultOverlay;
if (typeof oldClose === 'function') {
  function closeClaudeConsultOverlayClean(){
    document.getElementById('vnDialogue')?.classList.remove('has-choices');
    return oldClose.apply(this, arguments);
  };

}


// ══════════════════════════════════════════════════════
//  SEND + PREDICTION GATE — final owner
//  Authoritative, non-recursive implementation.
// ══════════════════════════════════════════════════════

const PC_PREDICTION_LABELS = {
  targeted: 'It will give a targeted response.',
  generic: 'It might still be generic.',
  ignores_constraints: 'It may ignore some constraints.',
  not_sure: 'I am not sure yet.'
};

const PC_PREDICTION_REACTIONS = {
  targeted: 'Good prediction. Now we will see whether Claude actually had enough context to stay specific.',
  generic: 'That is a reasonable suspicion. Generic input often produces generic output, because apparently machines also enjoy vague assignments.',
  ignores_constraints: 'Exactly the kind of risk worth watching for. Constraints only help when the model actually uses them.',
  not_sure: 'Fair. The whole point is to build that prediction muscle before trusting the output.'
};

function pcStopVN(){
  try { vnQueue = []; } catch(e) {}
  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { vnTyping = false; vnOnComplete = null; vnFullText = ''; vnCurrentText = ''; } catch(e) {}
}

function pcClearPredictionUI(){
  document.getElementById('predictionGate')?.remove();
  document.getElementById('vnPredictionChoicePanel')?.remove();
  document.querySelectorAll('.vn-choice-list,.vn-prediction-options,.pc-clean-choice-grid,.pc-choice-panel-final').forEach(el => el.remove());
}

function pcPredictionIsOpen(){
  const overlay = document.getElementById('vnOverlay');
  const text = (document.getElementById('vnText')?.textContent || '').toLowerCase();
  return !!(overlay && overlay.classList.contains('active') &&
    (overlay.classList.contains('claude-prediction') || overlay.classList.contains('pc-clean-prediction') || text.includes('what do you predict claude will do')));
}

function pcEnsurePredictionButtons(){
  if (!pcPredictionIsOpen()) return;
  if (window.pcWaitingForClaudeContinue) return;
  const prompt = window.pendingPromptForPrediction || window.pendingPromptAfterPrediction;
  if (!prompt) return;

  let panel = document.getElementById('vnPredictionChoicePanel');
  if (!panel) {
    const dialogue = document.getElementById('vnDialogue') || document.getElementById('vnText');
    if (!dialogue) return;
    panel = document.createElement('div');
    panel.id = 'vnPredictionChoicePanel';
    panel.className = 'pc-choice-panel-final';
    panel.setAttribute('role','group');
    panel.setAttribute('aria-label','Prediction choices');
    panel.innerHTML = Object.entries(PC_PREDICTION_LABELS).map(([choice,label]) =>
      `<button class="pc-clean-choice-btn" type="button" data-choice="${choice}">${label}</button>`
    ).join('');
    dialogue.appendChild(panel);
  }

  panel.querySelectorAll('button[data-choice]').forEach(btn => {
    if (btn.dataset.pcBound === '1') return;
    btn.dataset.pcBound = '1';
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pcChoosePrediction(btn.dataset.choice);
    });
  });
}

function pcShowPredictionGate(text){
  if (!text) return false;

  window.pendingPromptForPrediction = text;
  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForClaudeContinue = false;
  window.predictionGateActive = true;
  try { predictionGateActive = true; } catch(e) {}

  pcClearPredictionUI();
  pcStopVN();

  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove('claude-consult','claude-terminal-consult','claude-terminal-textmode','claude-analysis','pc-clean-output','pc-prediction-result');
    overlay.classList.add('active','claude-prediction','pc-clean-prediction','pc-prediction-question');
  }

  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.add('has-choices','prediction-question');
    dialogue.classList.remove('prediction-result');
  }

  try { setVNClaudeMode(false); } catch(e) {}
  try { setVNClaudeTerminalMode(false); } catch(e) {}
  try { setClaudeTerminalTextMode(false); } catch(e) {}
  try { setClaudeShelfState('idle', 'awaiting prediction'); } catch(e) {}
  try { setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'AWAITING PREDICTION'); } catch(e) {}
  try { vnSetExpression('thinking'); } catch(e) {}
  try { musicStartVN(); } catch(e) {}

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const character = document.getElementById('vnCharacter');
  if (character) character.classList.add('visible');

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <div class="pc-feedback-copy">
        <div><strong>Before we consult Claude...</strong></div>
        <div>Based on the context you gave, what do you predict Claude will do?</div>
      </div>`;
  }

  setTimeout(pcEnsurePredictionButtons, 0);
  setTimeout(pcEnsurePredictionButtons, 100);
  setTimeout(pcEnsurePredictionButtons, 350);
  setTimeout(() => dialogue?.focus(), 80);
  return false;
}

function pcChoosePrediction(choice){
  const text = window.pendingPromptForPrediction;
  if (!text || window.pcWaitingForClaudeContinue || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude)) return;

  window.pendingPromptAfterPrediction = text;
  window.pendingPromptForPrediction = '';
  window.pcWaitingForClaudeContinue = true;
  window.predictionGateActive = false;
  try { predictionGateActive = false; } catch(e) {}

  const s = scenarioData && scenarioData[scenarioIndex];
  if (s) {
    if (!s.predictions) s.predictions = [];
    s.predictions.push({ choice, prompt:text, attempt:(s.attempts || 0) + 1, timestamp:new Date().toISOString() });
  }

  pcClearPredictionUI();

  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove('pc-prediction-question');
    overlay.classList.add('pc-prediction-result');
  }

  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.remove('has-choices','prediction-question');
    dialogue.classList.add('prediction-result');
  }

  const reaction = (window.predictionReactions && window.predictionReactions[choice]) || PC_PREDICTION_REACTIONS[choice] || PC_PREDICTION_REACTIONS.not_sure;
  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <div class="pc-feedback-copy">
        <div><strong>Your prediction is logged.</strong></div>
        <div>${reaction}</div>
        <button id="pcContinueToClaudeBtn" class="prediction-continue-btn" type="button">Continue to Claude →</button>
      </div>`;
    document.getElementById('pcContinueToClaudeBtn')?.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pcContinueToClaudeAnalysis();
    });
  }
}

function pcContinueToClaudeAnalysis(){
  const text = window.pendingPromptAfterPrediction;
  if (!text || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude)) return false;

  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForClaudeContinue = false;

  // IMPORTANT: show Claude's thinking screen immediately BEFORE the network/API call.
  // Previously this overlay did not appear until after Claude returned, which made the
  // game look frozen for 20-30 seconds. Tiny little UX crime scene.
  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove(
      'claude-prediction',
      'pc-clean-prediction',
      'pc-prediction-question',
      'pc-prediction-result',
      'claude-terminal-textmode',
      'has-choices'
    );
    overlay.classList.add('active','claude-terminal-consult');
  }
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) dialogue.classList.remove('has-choices','prediction-question','prediction-result');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  pcClearPredictionUI();

  const vnText = document.getElementById('vnText');
  if (vnText) vnText.innerHTML = '';

  try { showClaudeConsultOverlay('Scenario diagnosis'); } catch(e) {
    try {
      setVNClaudeMode(false);
      setVNClaudeTerminalMode(true);
      setClaudeTerminalTextMode(false);
      setClaudeShelfState('thinking','analyzing');
      setClaudeTerminalState('thinking','CLAUDE TERMINAL','ANALYZING...');
      renderClaudeAnalyzingReadout('Scenario diagnosis');
      musicStartVN();
    } catch(_) {}
  }

  sendMain(text);
  return false;
}

function sendText(text){
  if (!text || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude) || window.pcWaitingForClaudeContinue) return false;
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  return pcShowPredictionGate(text);
}

// Legacy names used by inline handlers and older patches. Keep all roads pointed
// at the non-recursive implementation above. Yes, this is ridiculous. It is also JavaScript.
var showPredictionGate = pcShowPredictionGate;
var choosePrediction = pcChoosePrediction;
var finalChoosePrediction = pcChoosePrediction;
var finalContinueToClaude = pcContinueToClaudeAnalysis;
var hardShowPredictionGate = pcShowPredictionGate;
var hardChoosePrediction = pcChoosePrediction;
var hardContinueToClaude = pcContinueToClaudeAnalysis;
var hardSendText = sendText;

window.pcShowPredictionGate = pcShowPredictionGate;
window.showPredictionGate = pcShowPredictionGate;
window.choosePrediction = pcChoosePrediction;
window.finalChoosePrediction = pcChoosePrediction;
window.pcContinueToClaudeAnalysis = pcContinueToClaudeAnalysis;
window.finalContinueToClaude = pcContinueToClaudeAnalysis;
window.hardShowPredictionGate = pcShowPredictionGate;
window.hardChoosePrediction = pcChoosePrediction;
window.hardContinueToClaude = pcContinueToClaudeAnalysis;
window.hardSendText = sendText;
window.sendText = sendText;
window.ensurePredictionButtons = pcEnsurePredictionButtons;

if (!window.__pcPredictionWatchdogBound) {
  window.__pcPredictionWatchdogBound = true;
  document.addEventListener('click', () => setTimeout(pcEnsurePredictionButtons, 50), true);
  setInterval(pcEnsurePredictionButtons, 600);
}

// ══════════════════════════════════════════════════════
//  NAVIGATION — final owner
//  navigateToNext, devGoScenario, devFillScenario,
//  devNextScenario, devTestScenario.
//  clearVN() calls pcClearVNStateForScenarioSwitch
//  (defined in S1 workbench above).
// ══════════════════════════════════════════════════════
function clearVN(){
  if (typeof window.pcClearVNStateForScenarioSwitch === 'function') {
    window.pcClearVNStateForScenarioSwitch();
    return;
  }
  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  if (overlay) overlay.classList.remove('active','claude-prediction','pc-clean-prediction','claude-consult','claude-terminal-consult','claude-terminal-textmode','claude-analysis','pc-clean-output');
  document.getElementById('vnDialogue')?.classList.remove('has-choices');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  document.querySelectorAll('#vnPredictionChoicePanel,#predictionGate,.pc-choice-panel-final,.pc-clean-choice-grid,.vn-choice-list').forEach(el => el.remove());
}

const originalDevFillScenario = window.devFillScenario || (typeof devFillScenario === 'function' ? devFillScenario : null);

function devFillScenarioFinal(idx){
  if (idx === 0) {
    return window.resetS1Dev();
  }

  if (typeof window.devGoScenario === 'function') window.devGoScenario(idx);
  else if (typeof devGoScenario === 'function') devGoScenario(idx);

  const testPrompt = window.scenarios?.[idx]?.testPrompt || (typeof scenarios !== 'undefined' ? scenarios[idx]?.testPrompt : '');
  if (!testPrompt) return false;

  const tryFill = (attempts = 0) => {
    const input = document.getElementById('promptInput');
    if (input && input.offsetParent !== null) {
      input.value = testPrompt;
      if (typeof autoGrow === 'function') autoGrow(input);
      if (typeof onHintInput === 'function') onHintInput(input);
      input.focus();
      return;
    }
    if (attempts < 30) setTimeout(() => tryFill(attempts + 1), 200);
  };
  setTimeout(() => tryFill(), 300);
  return false;
};
function devTestScenarioFinal(idx){
  // S1 dev key now resets and fills only. No intro replay. No auto-submit.
  if (idx === 0) return window.resetS1Dev();
  return window.devFillScenario(idx);
};
function devGoScenarioFinalClean(idx){
  const tabs = document.querySelectorAll('.tab-btn');
  const btn = tabs[idx];
  if (!btn) return false;
  btn.disabled = false;
  btn.classList.remove('locked');
  btn.removeAttribute('aria-disabled');
  document.body.classList.remove('s2-submitted');
  clearVN();
  if (typeof switchScenario === 'function') switchScenario(idx, btn);
  return false;
};
function navigateToNextFinalClean(targetIndex){
  const tabs = document.querySelectorAll('.tab-btn');
  const targetTab = tabs[targetIndex];
  if (!targetTab) return false;

  try { scenarioCompleted[scenarioIndex] = true; } catch(e) {}
  document.body.classList.remove('s2-submitted');

  targetTab.disabled = false;
  targetTab.classList.remove('locked');
  targetTab.removeAttribute('aria-disabled');

  clearVN();

  const chat = document.getElementById('chat');
  if (chat) chat.scrollTop = 0;

  if (typeof switchScenario === 'function') switchScenario(targetIndex, targetTab);
  return false;
};
function devNextScenarioFinalClean(){
  const current = typeof scenarioIndex === 'number' ? scenarioIndex : 0;
  const max = typeof scenarios !== 'undefined' ? scenarios.length - 1 : 7;
  const next = Math.min(current + 1, max);
  return window.navigateToNext(next);
};
try { devNextScenario = window.devNextScenario; } catch(e) {}


// ══════════════════════════════════════════════════════
//  S2 METACOGNITION WORKBENCH
//  Student selector, ingredient chips, prompt preview,
//  and dev fill shortcuts for S2.
// ══════════════════════════════════════════════════════
const S2_STUDENTS = {
  A: {
    name: 'Student A',
    quote: 'I got an 88%. Moving on.',
    feedback: 'That is performance awareness, not metacognition yet. Student A knows the score, but not the learning strategy behind it.'
  },
  B: {
    name: 'Student B',
    quote: 'I studied harder this week.',
    feedback: 'Closer, but still vague. Student B notices effort, but does not identify what strategy worked or what to change next.'
  },
  C: {
    name: 'Student C',
    quote: 'I realized flashcards worked better than rereading, so I am using them again next week.',
    feedback: 'Exactly. Student C is monitoring a strategy, judging its usefulness, and planning transfer. Tiny learning-science confetti, somehow still useful.'
  }
};

const S2_INGREDIENTS = [
  { key: 'audience', label: 'Audience' },
  { key: 'courseContext', label: 'Course Context' },
  { key: 'studentProblem', label: 'Student Problem' },
  { key: 'reflectionGoal', label: 'Reflection Goal' },
  { key: 'transferGoal', label: 'Transfer Goal' },
  { key: 'timeConstraint', label: 'Time Constraint' }
];

const S2_PRESETS = {
  weak: {
    student: 'A',
    ingredients: ['audience'],
    course: 'College class',
    struggle: 'Students struggle.',
    behavior: 'Do better.'
  },
  mid: {
    student: 'C',
    ingredients: ['audience','courseContext','studentProblem','reflectionGoal','transferGoal'],
    course: 'Intro Psychology, asynchronous online course',
    struggle: 'Students complete readings and quizzes but do not think about which study strategies are helping them learn.',
    behavior: 'Students identify one study strategy that worked and choose one adjustment for next week.'
  },
  strong: {
    student: 'C',
    ingredients: ['audience','courseContext','studentProblem','reflectionGoal','transferGoal','timeConstraint'],
    course: 'First-year nursing students in a fully asynchronous 8-week course',
    struggle: 'Students repeat the same documentation mistakes even after receiving detailed feedback, and they rarely compare current work to earlier attempts.',
    behavior: 'Students identify a pattern in their mistakes, explain what caused it, and create a specific strategy they will use before the next submission.'
  }
};

window.s2State = window.s2State || {
  student: null,
  ingredients: {},
  course: '',
  struggle: '',
  behavior: ''
};

function s2ResetState() {
  window.s2State = { student: null, ingredients: {}, course: '', struggle: '', behavior: '' };
}

function selectedIngredients() {
  return S2_INGREDIENTS.filter(i => !!window.s2State.ingredients[i.key]);
}

function s2ScorePercent() {
  let score = 0;
  if (window.s2State.student === 'C') score += 20;
  score += Math.min(36, selectedIngredients().length * 6);
  if ((window.s2State.course || '').trim().length > 4) score += 12;
  if ((window.s2State.struggle || '').trim().length > 12) score += 16;
  if ((window.s2State.behavior || '').trim().length > 12) score += 16;
  return Math.min(100, score);
}

function s2PromptText() {
  const course = (window.s2State.course || '').trim() || '[course / learner context]';
  const struggle = (window.s2State.struggle || '').trim() || '[what students struggle with]';
  const behavior = (window.s2State.behavior || '').trim() || '[desired learning behavior]';
  const chips = selectedIngredients().map(i => i.label).join(', ') || 'no prompt ingredients selected yet';

  return `I teach ${course}.\n\nMy students are completing work, but they are not reflecting on how they learn. Specifically, ${struggle}\n\nCreate a brief asynchronous metacognitive activity that helps students ${behavior}\n\nUse these design ingredients: ${chips}.\n\nThe activity should be low-stakes, easy to complete online, take about 10-15 minutes if a time limit is appropriate, and include a student-facing prompt plus a short instructor note explaining how it supports metacognition, learning strategy awareness, and transfer.`;
}

function renderS2MetacognitionWorkbench(container) {
  s2ResetState();
  document.body.classList.remove('s1-active','s1-result-active');
  document.body.classList.add('s2-active');
  container.innerHTML = `
    <div class="scaffold-area s2-workbench">
      <div class="s2-left-stack">
        <div class="s2-mission-card" role="note" aria-label="Scenario 2 mission briefing">
          <div class="s2-mission-eyebrow">Mission Briefing</div>
          <div class="s2-mission-title">Find the metacognitive thinker.</div>
          <div class="s2-mission-copy">Students are completing work and moving on. First, identify what metacognition looks like. Then build a personalized Claude prompt for your own teaching context.</div>
        </div>

        <div class="s2-detective-card" role="region" aria-label="Metacognition detective cards">
          <div class="s2-card-eyebrow">Student Thought Detective</div>
          <div class="s2-panel-title">Which student is showing metacognition?</div>
          <div class="s2-helper-text">Choose the thought bubble that shows a learner monitoring strategy, judging effectiveness, and planning what to do next.</div>
          <div class="s2-student-grid">
            ${Object.entries(S2_STUDENTS).map(([key, item]) => `
              <button type="button" class="s2-student-card" id="s2-student-${key}" onclick="s2SelectStudent('${key}')">
                <div class="s2-student-name">${item.name}</div>
                <div class="s2-student-quote">“${item.quote}”</div>
              </button>
            `).join('')}
          </div>
          <div class="s2-feedback-line" id="s2StudentFeedback">Pick the strongest example before consulting Claude.</div>
        </div>

        <div class="s2-panel">
          <div class="s2-panel-eyebrow">Metacognitive Strength</div>
          <div class="s2-meter-wrap">
            <div class="s2-meter-top">
              <span class="s2-meter-label">Prompt readiness</span>
              <span class="s2-meter-score" id="s2MeterScore">0%</span>
            </div>
            <div class="s2-meter-track"><div class="s2-meter-fill" id="s2MeterFill"></div></div>
          </div>
        </div>
      </div>

      <div class="s2-right-stack">
        <div class="s2-panel" role="region" aria-label="Prompt ingredient puzzle">
          <div class="s2-panel-eyebrow">Prompt Ingredient Puzzle</div>
          <div class="s2-panel-title">Select the ingredients Claude needs.</div>
          <div class="s2-helper-text">These reuse the same quality logic as the chips above, just in a more playable form because apparently people like clicking things.</div>
          <div class="s2-ingredient-grid" role="group" aria-label="Prompt ingredient choices">
            ${S2_INGREDIENTS.map(i => `<button type="button" class="s2-ingredient-chip" id="s2-ing-${i.key}" onclick="s2ToggleIngredient('${i.key}')">${i.label}</button>`).join('')}
          </div>
        </div>

        <div class="s2-context-panel" role="region" aria-label="Personal teacher context">
          <div class="s2-panel-eyebrow">Personal Instructor Context</div>
          <div class="s2-panel-title">Tell Claude about your students.</div>
          <div class="s2-helper-text">This is the part that should feel personal. Claude will respond to the course and learning behavior you describe, not just a generic reflection activity.</div>
          <div class="s2-field-grid">
            <div class="s2-field">
              <label for="s2-course">What kind of course are you teaching?</label>
              <input id="s2-course" class="s2-input" placeholder="Example: Intro Psychology, asynchronous, 16 weeks" oninput="s2UpdateFromFields()" />
            </div>
            <div class="s2-field">
              <label for="s2-struggle">What do your students struggle with?</label>
              <textarea id="s2-struggle" class="s2-textarea" placeholder="Example: They complete quizzes but do not notice which study strategies are working." oninput="s2UpdateFromFields();autoGrow(this)"></textarea>
            </div>
            <div class="s2-field">
              <label for="s2-behavior">What learning behavior should improve?</label>
              <textarea id="s2-behavior" class="s2-textarea" placeholder="Example: Students choose one strategy to reuse or adjust next week." oninput="s2UpdateFromFields();autoGrow(this)"></textarea>
            </div>
          </div>
        </div>

        <div class="s2-panel">
          <div class="s2-panel-eyebrow">Claude Prompt Preview</div>
          <div class="s2-prompt-preview" id="s2PromptPreview"></div>
        </div>

        <div class="s2-footer">
          <span class="s2-dev-note">Dev shortcuts: S2 weak · S2 mid · S2 strong</span>
          <span class="attempt-badge" aria-live="polite">Attempts: <span id="attNum">0</span></span>
          <button type="button" class="guided-send-btn" id="sendBtn" onclick="s2SendToClaude()">Consult Claude →</button>
        </div>
      </div>
    </div>`;
  s2RefreshUI();
}

function s2SelectStudent(key) {
  window.s2State.student = key;
  document.querySelectorAll('.s2-student-card').forEach(el => el.classList.remove('selected'));
  document.getElementById(`s2-student-${key}`)?.classList.add('selected');
  const line = document.getElementById('s2StudentFeedback');
  if (line) line.textContent = S2_STUDENTS[key]?.feedback || '';
  s2RefreshUI();
};

function s2ToggleIngredient(key) {
  window.s2State.ingredients[key] = !window.s2State.ingredients[key];
  s2RefreshUI();
};

function s2UpdateFromFields() {
  window.s2State.course = document.getElementById('s2-course')?.value || '';
  window.s2State.struggle = document.getElementById('s2-struggle')?.value || '';
  window.s2State.behavior = document.getElementById('s2-behavior')?.value || '';
  s2RefreshUI();
};

function s2RefreshUI() {
  S2_INGREDIENTS.forEach(i => {
    const btn = document.getElementById(`s2-ing-${i.key}`);
    if (btn) {
      const selected = !!window.s2State.ingredients[i.key];
      btn.classList.toggle('selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
    }
  });
  const percent = s2ScorePercent();
  const fill = document.getElementById('s2MeterFill');
  const score = document.getElementById('s2MeterScore');
  const preview = document.getElementById('s2PromptPreview');
  if (fill) fill.style.width = percent + '%';
  if (score) score.textContent = percent + '%';
  if (preview) preview.textContent = s2PromptText();
}

function s2SendToClaude() {
  s2UpdateFromFields();
  const text = s2PromptText();
  if (!text) return false;
  if (window.s2State.student !== 'C') {
    const line = document.getElementById('s2StudentFeedback');
    if (line) line.textContent = 'You can still consult Claude, but notice that the detective choice will weaken the learning target.';
  }
  sendText(text);
  return false;
};

function devFillS2(mode = 'mid') {
  const preset = S2_PRESETS[mode] || S2_PRESETS.mid;
  if (typeof window.devGoScenario === 'function') window.devGoScenario(1);
  else if (typeof devGoScenario === 'function') devGoScenario(1);

  const tryFill = (attempts = 0) => {
    const course = document.getElementById('s2-course');
    if (!course) {
      if (attempts < 40) setTimeout(() => tryFill(attempts + 1), 150);
      return;
    }
    window.s2State.student = preset.student;
    window.s2State.ingredients = {};
    preset.ingredients.forEach(k => window.s2State.ingredients[k] = true);
    window.s2State.course = preset.course;
    window.s2State.struggle = preset.struggle;
    window.s2State.behavior = preset.behavior;

    course.value = preset.course;
    document.getElementById('s2-struggle').value = preset.struggle;
    document.getElementById('s2-behavior').value = preset.behavior;
    document.querySelectorAll('.s2-student-card').forEach(el => el.classList.remove('selected'));
    document.getElementById(`s2-student-${preset.student}`)?.classList.add('selected');
    const line = document.getElementById('s2StudentFeedback');
    if (line) line.textContent = S2_STUDENTS[preset.student]?.feedback || '';
    s2RefreshUI();
    course.focus();
  };
  setTimeout(() => tryFill(), 250);
  return false;
};

const priorDevFillScenario = window.devFillScenario || (typeof devFillScenario === 'function' ? devFillScenario : null);
function devFillScenarioS2Owner(idx) {
  if (idx === 1) return window.devFillS2('mid');
  if (typeof priorDevFillScenario === 'function') return priorDevFillScenario(idx);
  return false;
};
try { devFillScenario = window.devFillScenario; } catch(e) {}

window.devFillS2Weak = () => window.devFillS2('weak');
window.devFillS2Mid = () => window.devFillS2('mid');
window.devFillS2Strong = () => window.devFillS2('strong');


// ══════════════════════════════════════════════════════
//  S2 RESULT + PIXEL REFLECTION
//  addS2ClaudeResultCard and the S2-specific
//  showPixelScoreReflection override.
// ══════════════════════════════════════════════════════
function addS2ClaudeResultCard(responseText) {
  document.body.classList.add('s2-active','s2-submitted');
  const area = document.getElementById('chat');
  if (!area) return;
  // Keep the user's submitted prompt bubble, but remove transient typing rows.
  document.getElementById('typing')?.remove();
  const card = document.createElement('div');
  card.className = 's2-result-card';
  card.innerHTML = `
    <div class="s2-result-eyebrow">Claude Draft</div>
    <div class="s2-result-title">Metacognitive Activity Draft</div>
    <div class="s2-result-body">${fmt(responseText)}</div>
  `;
  area.appendChild(card);
  area.scrollTop = area.scrollHeight;
}


// ══════════════════════════════════════════════════════
//  DEV BAR GLOBAL EXPORT REPAIR — V2
//  Inline onclick handlers in index.html require true window globals.
//  This block must stay at the very bottom of app.js.
// ══════════════════════════════════════════════════════
(function exposePromptCraftDevToolsV2(){
  function assign(name, fn) {
    if (typeof fn === 'function') {
      window[name] = fn;
      try { globalThis[name] = fn; } catch(e) {}
    }
  }

  function unlockTab(index) {
    const tabs = document.querySelectorAll('.tab-btn');
    const btn = tabs[index];
    if (!btn) return null;
    btn.disabled = false;
    btn.classList.remove('locked');
    btn.removeAttribute('aria-disabled');
    return btn;
  }

  function unlockThrough(index) {
    for (let i = 0; i <= index; i++) unlockTab(i);
    try {
      for (let i = 0; i < index; i++) scenarioCompleted[i] = true;
    } catch(e) {}
    try { if (index >= 3 && typeof unlockScenario4 === 'function') unlockScenario4(); } catch(e) {}
    try { if (index >= 4 && typeof unlockScenario5 === 'function') unlockScenario5(); } catch(e) {}
    try { if (index >= 5 && typeof unlockScenario6 === 'function') unlockScenario6(); } catch(e) {}
    try { if (index >= 6 && typeof unlockScenario7 === 'function') unlockScenario7(); } catch(e) {}
    try { if (index >= 7 && typeof unlockScenario8 === 'function') unlockScenario8(); } catch(e) {}
  }

  function devGoScenarioGlobal(index) {
    index = Number(index) || 0;
    unlockThrough(index);
    const btn = unlockTab(index);
    try { document.body.classList.remove('s1-result-active','s2-submitted'); } catch(e) {}
    try { if (typeof clearVN === 'function') clearVN(); } catch(e) {}
    if (typeof switchScenario === 'function') switchScenario(index, btn);
    else if (typeof loadScenario === 'function') loadScenario(index);
    return false;
  }

  function devFillScenarioGlobal(index, mode) {
    index = Number(index) || 0;
    if (index === 0 && typeof window.resetS1Dev === 'function') return window.resetS1Dev();
    if (index === 1 && typeof window.devFillS2 === 'function') return window.devFillS2(mode || 'mid');

    devGoScenarioGlobal(index);
    const testPrompt = (typeof scenarios !== 'undefined' && scenarios[index] && scenarios[index].testPrompt) ? scenarios[index].testPrompt : '';
    const fallback = testPrompt || 'Test prompt for PromptCraft dev mode.';
    const tryFill = (attempts = 0) => {
      const input = document.getElementById('promptInput');
      if (input && input.offsetParent !== null) {
        input.value = fallback;
        try { if (typeof autoGrow === 'function') autoGrow(input); } catch(e) {}
        try { if (typeof onHintInput === 'function') onHintInput(input); } catch(e) {}
        input.focus();
        return true;
      }
      if (attempts < 40) setTimeout(() => tryFill(attempts + 1), 150);
      return false;
    };
    setTimeout(() => tryFill(), 250);
    return false;
  }

  function devTestScenarioGlobal(index) {
    return devFillScenarioGlobal(index);
  }

  function navigateToNextGlobal(targetIndex) {
    targetIndex = Number(targetIndex);
    if (!Number.isFinite(targetIndex)) targetIndex = ((typeof scenarioIndex === 'number' ? scenarioIndex : 0) + 1);
    return devGoScenarioGlobal(targetIndex);
  }

  function devNextScenarioGlobal() {
    const current = typeof scenarioIndex === 'number' ? scenarioIndex : 0;
    const max = typeof scenarios !== 'undefined' ? scenarios.length - 1 : 7;
    return devGoScenarioGlobal(Math.min(current + 1, max));
  }

  // Main DEV bar functions used by index.html inline onclick attributes.
  assign('devGoScenario', devGoScenarioGlobal);
  assign('devFillScenario', devFillScenarioGlobal);
  assign('devTestScenario', devTestScenarioGlobal);
  assign('navigateToNext', navigateToNextGlobal);
  assign('devNextScenario', devNextScenarioGlobal);

  // Scenario-specific shortcuts. Use existing owners where they exist, otherwise route through generic navigation/fill.
  assign('devGoS4', typeof devGoS4 === 'function' ? devGoS4 : () => devGoScenarioGlobal(3));
  assign('devTestS4', typeof devTestS4 === 'function' ? devTestS4 : () => devFillScenarioGlobal(3));
  assign('devGoS5', typeof devGoS5 === 'function' ? devGoS5 : () => devGoScenarioGlobal(4));
  assign('devFillS5', typeof devFillS5 === 'function' ? devFillS5 : () => devFillScenarioGlobal(4));
  assign('devGoS6', typeof devGoS6 === 'function' ? devGoS6 : () => devGoScenarioGlobal(5));
  assign('devFillS6', typeof devFillS6 === 'function' ? devFillS6 : () => devFillScenarioGlobal(5));
  assign('devGoS7', typeof devGoS7 === 'function' ? devGoS7 : () => devGoScenarioGlobal(6));
  assign('devGoS8', typeof devGoS8 === 'function' ? devGoS8 : () => devGoScenarioGlobal(7));
  assign('devFillS8', typeof devFillS8 === 'function' ? devFillS8 : () => devFillScenarioGlobal(7));
  assign('devSkip', typeof devSkip === 'function' ? devSkip : window.devSkip);

  if (typeof devFillS2 === 'function') {
    assign('devFillS2', devFillS2);
    assign('devFillS2Weak', () => devFillS2('weak'));
    assign('devFillS2Mid', () => devFillS2('mid'));
    assign('devFillS2Strong', () => devFillS2('strong'));
  }

  window.devStatus = function devStatus(){
    const names = ['devGoScenario','devFillScenario','devTestScenario','devNextScenario','devSkip','navigateToNext','devGoS5','devFillS5','devGoS6','devFillS6','devGoS7','devGoS8','devFillS8'];
    return Object.fromEntries(names.map(name => [name, typeof window[name]]));
  };

  console.info('[PromptCraft] DEV globals repaired:', window.devStatus());
})();

// Claude Speech Synthesis voice
let claudeSpeechUtterance = null;

  function cleanClaudeSpeechText(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/[-]{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

function toggleClaudeTTS() {
    const btn = document.getElementById('claudeTTSBtn');

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (btn) btn.textContent = '🔊 Read Analysis';
      return;
    }

    const output = document.getElementById('claudeTerminalOutput');
    const text = cleanClaudeSpeechText(output?.textContent || '');

    if (!text) return;

    claudeSpeechUtterance = new SpeechSynthesisUtterance(text);
    claudeSpeechUtterance.rate = 0.9;
    claudeSpeechUtterance.pitch = 0.85;

    claudeSpeechUtterance.onend = () => {
      if (btn) btn.textContent = '🔊 Read Analysis';
    };

    claudeSpeechUtterance.onerror = () => {
      if (btn) btn.textContent = '🔊 Read Analysis';
    };

    if (btn) btn.textContent = '⏹ Stop Reading';
    window.speechSynthesis.speak(claudeSpeechUtterance);
  }
