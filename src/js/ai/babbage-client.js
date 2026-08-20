/* PROMPTCRAFT BABBAGE CLIENT LAYER
   Provider-neutral browser request, fallback, and response normalization.
   Extracted during the V369 architecture refactor. */

// ══════════════════════════════════════════════════════
//  LOCAL TESTING / BABBAGE FALLBACK
//  Lets VS Code Live Server progress through scenarios without Netlify.
//  Add ?mockBabbage=1 to force fallback mode anywhere.
//// ══════════════════════════════════════════════════════
const MOCK_BABBAGE_FOR_LOCAL = false;
const pcQueryParams = new URLSearchParams(window.location.search);
const FORCE_MOCK_BABBAGE = pcQueryParams.get('mockBabbage') === '1';
const IS_LOCAL_TEST = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) || window.location.protocol === 'file:';
const USE_MOCK_BABBAGE = FORCE_MOCK_BABBAGE || (MOCK_BABBAGE_FOR_LOCAL && IS_LOCAL_TEST);

// NOTE: Local Babbage fallback text is dialogue/content-heavy. Move to dialogue.js in a later pass if desired.
function mockBabbageText(payload, context = 'main') {
  const system = payload.system || '';

  if (context === 'pixel' || system.includes('You are Professor Pixel')) {
    return `You gave Babbage enough direction to produce a usable response, especially where your prompt named the actual teaching problem. The next improvement is to make the success criteria more visible so Babbage knows what a strong student outcome should look like.\n\n*What would you want students to do, say, or produce that would prove the activity worked?*`;
  }

  if (context === 'growth' || system.includes('personalized growth summary')) {
    return `Scenario 1 shows how learner context, constraints, and explicit interaction moves can turn a vague AI request into a more useful instructional design draft. Additional growth reporting will be added as the remaining scenarios are rebuilt.`;
  }

  if (scenarioIndex !== SCENARIO_INDEX.ENGAGEMENT) {
    return `This scenario is currently a clean development shell and does not send prompts to Babbage.`;
  }

  const values = (window.playerHistory && window.playerHistory.s1) || (typeof getS1GuidedValues === 'function' ? getS1GuidedValues() : {});
  const checks = typeof analyzeS1Guided === 'function' ? analyzeS1Guided(values) : {};
  const problems = [];
  if (checks.demeaning) problems.push('the learner description uses demeaning language instead of usable learner characteristics');
  if (!checks.audience) problems.push('the learner/course context is not specific enough to guide a redesign');
  if (!checks.issue) problems.push('the problem statement is too vague to diagnose the instructional failure');
  if (!checks.interaction) problems.push('the requested interaction does not define an observable peer-to-peer thinking move');
  if (!checks.constraints) problems.push('the constraints are too thin to shape a realistic activity');
  if (!checks.success) problems.push('there is no clear criterion for what a successful contribution should demonstrate');

  if (problems.length) {
    const summary = problems.slice(0, 3).join('; ') + '.';
    const worked = [
      checks.issue ? `You did identify a discussion problem: ${values.issue}` : '',
      checks.constraints ? `You supplied at least one practical boundary: ${values.constraints}` : ''
    ].filter(Boolean).join(' ') || 'There is not yet enough instructionally useful detail to treat this as a strong repair.';
    return `STATUS\nNEEDS REVISION BEFORE REDESIGN\n\nCONFIDENCE\nHIGH\n\nFEEDBACK SUMMARY\nThis input should not be treated as a strong repair. ${summary}\n\nWHAT WORKED\n${worked}\n\nISSUE DETECTED\n${problems[0]}. The current notes would force Babbage to invent important instructional decisions rather than respond to your actual design.\n\nRECOMMENDED REPAIR\nReplace vague or judgmental wording with observable information: who the learners are, what students are currently doing, what intellectual move peers should make with one another, and what evidence would show the discussion worked.\n\nEXPECTED IMPACT\nA more concrete and respectful description gives Babbage evidence it can actually reason from, which should produce a redesign that matches the course instead of a generic discussion template.\n\nREVISED DISCUSSION PROMPT\nChoose one claim or interpretation from this week's reading. Explain it in your initial post and support it with a specific passage, example, or piece of evidence. Respond to two classmates by engaging directly with their reasoning: extend, challenge, compare, or question an idea and explain why. At least one reply should give your classmate a clear reason to respond again.\n\nCOURSE QUALITY CHECK\nClear Objectives: partially addressed. Student Interaction: needs clearer direction. Real-World Context: not established from the notes. Inclusive Design: insufficient information. Measurable Outcomes: needs explicit success criteria.`;
  }

  return `STATUS\nSTRONG REPAIR WITH A CLEAR INTERACTION PURPOSE\n\nCONFIDENCE\nHIGH\n\nFEEDBACK SUMMARY\nYour notes identify the learner context, the observed discussion problem, a specific peer-interaction move, and practical constraints. The redesign can therefore respond to your actual course rather than inventing the missing pieces.\n\nWHAT WORKED\nLearners: ${values.learners}\nProblem: ${values.issue}\nInteraction: ${values.interaction}\nConstraints: ${values.constraints}\nThese details give the redesign concrete instructional boundaries.\n\nISSUE DETECTED\nThe strongest remaining refinement is to make the two required peer replies serve visibly different purposes so students cannot satisfy both with the same generic move.\n\nRECOMMENDED REPAIR\nGive one reply an extend/challenge/compare purpose and the other a genuine follow-up-question or contrasting-example purpose.\n\nEXPECTED IMPACT\nDistinct reply moves reduce repetition and create more than one pathway for a conversation to continue.\n\nREVISED DISCUSSION PROMPT\nChoose one interpretation of this week's reading that you find convincing, questionable, or difficult to apply. Explain your interpretation and support it with one specific example or piece of evidence. Then respond substantively to two classmates. In one reply, extend, challenge, or compare a classmate's interpretation using evidence or a concrete example. In the other, ask a genuine follow-up question or introduce a contrasting example that invites further discussion.\n\nCOURSE QUALITY CHECK\nClear Objectives: addressed. Student Interaction: strongly addressed. Real-World Context: use when relevant to the reading. Inclusive Design: multiple response moves support participation. Measurable Outcomes: the initial evidence and two substantive replies are observable.`;
}


function mockBabbageResponse(payload, context = 'main', reason = 'forced') {
  pcDebug(`[PromptCraft] Using mock Babbage response for ${context} (${reason}).`);
  const legacyText = mockBabbageText(payload, context);
  return Promise.resolve({
    content: [{ text: legacyText }],
    mock: true,
    mockReason: reason,
    provider: 'local-fallback',
    model: 'promptcraft-local-fallback'
  });
}

const BABBAGE_REQUEST_TIMEOUT_MS = 90000;
const BABBAGE_MIN_VISIBLE_ANALYSIS_MS = 900;
const pcBabbageActiveControllers = new Set();

function pcAbortScenarioBabbageRequests() {
  pcBabbageActiveControllers.forEach(controller => {
    try {
      controller._pcScenarioAbort = true;
      controller.abort();
    } catch (e) {}
  });
  pcBabbageActiveControllers.clear();
}
window.pcAbortScenarioBabbageRequests = pcAbortScenarioBabbageRequests;

function pcGetBabbageMinVisibleAnalysisMs() {
  const configured = Number(window.PC_BABBAGE_MIN_VISIBLE_ANALYSIS_MS);
  if (Number.isFinite(configured)) return Math.max(0, configured);
  window.PC_BABBAGE_MIN_VISIBLE_ANALYSIS_MS = BABBAGE_MIN_VISIBLE_ANALYSIS_MS;
  return BABBAGE_MIN_VISIBLE_ANALYSIS_MS;
}

async function pcHoldVisibleBabbageAnalysis(startedAt, isVisible) {
  if (!isVisible || !Number.isFinite(startedAt)) return;
  const remaining = pcGetBabbageMinVisibleAnalysisMs() - (performance.now() - startedAt);
  if (remaining > 0) await new Promise(resolve => window.setTimeout(resolve, remaining));
}

async function requestBabbageAnalysis(payload, context = 'main') {
  // The analyzing terminal is part of the shared Babbage UX. Even mock/fallback
  // responses must leave it on screen long enough to be perceivable; otherwise
  // a fast local response replaces the loading state before the browser paints.
  const tracksVisibleAnalysis = !!document.querySelector('#babbageTerminalOutput .pc-analyzing-progress');
  const visibleAnalysisStartedAt = tracksVisibleAnalysis ? performance.now() : NaN;
  if (tracksVisibleAnalysis && typeof window.pcStartBabbageAnalysisProgress === 'function') {
    window.pcStartBabbageAnalysisProgress(BABBAGE_REQUEST_TIMEOUT_MS);
  }

  if (USE_MOCK_BABBAGE) {
    const mock = await mockBabbageResponse(payload, context, FORCE_MOCK_BABBAGE ? 'query-parameter' : 'local-test');
    await pcHoldVisibleBabbageAnalysis(visibleAnalysisStartedAt, tracksVisibleAnalysis);
    if (tracksVisibleAnalysis && typeof window.pcMarkBabbageResponseReceived === 'function') {
      window.pcMarkBabbageResponseReceived();
    }
    return mock;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  if (controller) pcBabbageActiveControllers.add(controller);
  const timeoutId = controller ? setTimeout(() => {
    controller._pcTimeoutAbort = true;
    controller.abort();
  }, BABBAGE_REQUEST_TIMEOUT_MS) : null;

  try {
    const res = await fetch('/.netlify/functions/babbage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller ? controller.signal : undefined
    });

    await pcHoldVisibleBabbageAnalysis(visibleAnalysisStartedAt, tracksVisibleAnalysis);
    if (tracksVisibleAnalysis && typeof window.pcMarkBabbageResponseReceived === 'function') window.pcMarkBabbageResponseReceived();

    const responseText = await res.text();
    let data = {};
    try { data = responseText ? JSON.parse(responseText) : {}; } catch (_error) { data = {}; }

    if (!res.ok) {
      const providerMessage = data?.error?.message || data?.message || responseText || `HTTP ${res.status}`;
      throw new Error(`Babbage function returned ${res.status}: ${providerMessage}`);
    }
    if (data.error) throw new Error(data.error?.message || 'Babbage returned an error');

    // The UI keeps one normalized contract regardless of provider. This prevents
    // provider response shapes from leaking throughout the game.
    if (data.analysis && typeof data.analysis === 'object') {
      return {
        ...data,
        structured: data.analysis,
        content: [{ text: formatBabbageAnalysisAsLegacyText(data.analysis) }],
        mock: false,
        mockReason: ''
      };
    }
    return data;
  } catch (err) {
    if (controller?._pcScenarioAbort) throw err;
    console.warn('[PromptCraft] Babbage unavailable or timed out; using local fallback:', err && err.message ? err.message : err);
    if (tracksVisibleAnalysis && typeof window.pcFailBabbageAnalysisProgress === 'function') window.pcFailBabbageAnalysisProgress();
    await pcHoldVisibleBabbageAnalysis(visibleAnalysisStartedAt, tracksVisibleAnalysis);
    return mockBabbageResponse(payload, context, 'backend-unavailable');
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    if (controller) pcBabbageActiveControllers.delete(controller);
  }
}

function formatBabbageAnalysisAsLegacyText(a = {}) {
  const worked = Array.isArray(a.what_worked) ? a.what_worked.map(item => `• ${item}`).join('\n') : String(a.what_worked || '');
  const quality = a.course_quality_check || {};
  return [
    'STATUS', a.status || '', '',
    'CONFIDENCE', a.confidence || '', '',
    'FEEDBACK SUMMARY', a.feedback_summary || '', '',
    'WHAT WORKED', worked, '',
    'ISSUE DETECTED', a.issue_detected || '', '',
    'RECOMMENDED REPAIR', a.recommended_repair || '', '',
    'EXPECTED IMPACT', a.expected_impact || '', '',
    'REVISED DISCUSSION PROMPT', a.revised_discussion_prompt || '', '',
    'COURSE QUALITY CHECK', [
      `Clear Objectives: ${quality.clear_objectives || ''}`,
      `Student Interaction: ${quality.student_interaction || ''}`,
      `Real-World Context: ${quality.real_world_context || ''}`,
      `Inclusive Design: ${quality.inclusive_design || ''}`,
      `Measurable Outcomes: ${quality.measurable_outcomes || ''}`
    ].join('\n')
  ].join('\n');
}

