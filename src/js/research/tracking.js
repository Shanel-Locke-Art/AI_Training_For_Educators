// ══════════════════════════════════════════════════════
//  BEHAVIORAL DATA TRACKING
//  Records rich session data for dissertation analysis
// ══════════════════════════════════════════════════════
const sessionStart = Date.now();
const pcSessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Per-scenario tracking. Special fields are assigned by named scenario index
// so rearranging presentation order cannot silently corrupt research data.
const scenarioData = Array.from({ length: SCENARIO_COUNT }, (_, index) => {
  const base = {
    attempts: 0,
    prompts: [],
    bestScore: 0,
    finalResponse: '',
    oscqrLit: '',
    aiProvider: '',
    aiModel: '',
    aiRequestId: '',
    aiElapsedMs: '',
    aiUsage: null,
    structuredAnalysis: null,
  };

  if (index === SCENARIO_INDEX.METACOGNITION) {
    return {
      ...base,
      diagnosisAttempts: [],
      diagnosisFinal: [],
      evidenceAttempts: [],
      evidenceFinal: [],
      thinkingMoveAttempts: [],
      auditAttempts: [],
      repairAttempts: [],
      thinkingMove: '',
      babbageDraft: null,
      babbageReview: null,
      s2ReviewSource: '',
      repairText: '',
      openingCheckpointReached: false,
    };
  }
  if (index === SCENARIO_INDEX.ASSESSMENT) {
    return {
      ...base,
      diagnosisAttempts: [],
      diagnosisFinal: {},
      blueprintAttempts: [],
      blueprintInitial: {},
      blueprintFinal: {},
      evidenceAttempts: [],
      evidenceFinal: [],
      auditAttempts: [],
      repairAttempts: [],
      dragEvents: [],
      babbageEvidenceAnalysis: null,
      s3AnalysisSource: '',
      evidenceStatement: '',
      repairText: '',
      initialScore: 0,
      revisedScore: 0,
      currentScore: 0,
      scoreDelta: 0
    };
  }
  if (index === SCENARIO_INDEX.HALLUCINATION) {
    return { ...base, selfReport: '' };
  }
  if (index === SCENARIO_INDEX.PREDICTION) {
    return { ...base, prediction: '', predictionCorrect: false };
  }
  if (index === SCENARIO_INDEX.HUMAN_JUDGMENT) {
    return { ...base, overrelianceDecisions: {} };
  }
  if (index === SCENARIO_INDEX.REFLECT_REVISE_REUSE) {
    return {
      ...base,
      initialPrompt: '',
      revisedPrompt: '',
      initialScore: 0,
      revisedScore: 0,
      scoreDelta: 0,
      reflection1: '',
      reflection2: '',
      reflection3: '',
    };
  }
  return base;
});

const pcLastIncrementalSaveAt = {};
let pcTrackingEventSequence = 0;

function pcCreateTrackingEventId(kind = 'event') {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  pcTrackingEventSequence += 1;
  return [
    'pc',
    String(kind || 'event').replace(/[^a-z0-9_-]/gi, '_'),
    pcSessionId,
    Date.now(),
    pcTrackingEventSequence
  ].join('-');
}

function pcTrackingActivityId(scenarioIdx, eventType, data = {}) {
  const analysisType = String(data?.structuredAnalysis?.analysis_type || '');
  if (analysisType === 's1_evidence_analysis') {
    const caseIndex = Number(data?.structuredAnalysis?.case_index || 0);
    return caseIndex > 0 ? `s1-evidence-case-${caseIndex}` : 's1-evidence-analysis';
  }
  if (analysisType === 's1_transfer_plan_analysis') return 's1-instructor-plan';
  const event = String(eventType || '').replace(/_complete(?:d)?$/i, '').replace(/_/g, '-');
  return event || `scenario-${Number(scenarioIdx) + 1}`;
}

function pcTrackingScoreScaleMax(_scenarioIdx, eventType, data = {}) {
  const analysisType = String(data?.structuredAnalysis?.analysis_type || '');
  if (eventType === 's1_evidence_analysis_complete' || analysisType === 's1_evidence_analysis') return 3;
  return 5;
}

function pcFormatPredictionChoice(choice) {
  if (!choice) return '';
  const labels = (typeof PC_PREDICTION_LABELS !== 'undefined' && PC_PREDICTION_LABELS) ? PC_PREDICTION_LABELS : {};
  return labels[choice] || String(choice).replace(/_/g, ' ');
}

function pcFormatPredictionsForSave(s, scenarioIdx) {
  if (!s) return '';

  if (s.selfReport) return s.selfReport;

  const predictions = Array.isArray(s.predictions) ? s.predictions : [];
  if (predictions.length) {
    return predictions.map((p, i) => {
      if (!p || typeof p !== 'object') return String(p || '');
      const attempt = p.attempt || (i + 1);
      const choice = p.choice || p.prediction || '';
      const label = pcFormatPredictionChoice(choice);
      return `Attempt ${attempt}: ${label || choice}`;
    }).filter(Boolean).join(' | ');
  }

  if (s.prediction) return pcFormatPredictionChoice(s.prediction);
  return '';
}

function pcFormatAllPresubmitPredictions() {
  return scenarioData.map((s, i) => {
    const text = pcFormatPredictionsForSave(s, i);
    return text ? `S${i + 1}: ${text}` : `S${i + 1}: none recorded`;
  }).join(' || ');
}

function pcGetLatestPredictionChoice(s) {
  if (!s) return '';
  const predictions = Array.isArray(s.predictions) ? s.predictions : [];
  const latest = predictions.length ? predictions[predictions.length - 1] : null;
  return (latest && latest.choice) || s.prediction || '';
}


function getPromptCraftScenarioLabel(scenarioIdx) {
  return PC_SCENARIO_LABELS[scenarioIdx] || `S${scenarioIdx + 1}`;
}

function getPromptCraftViewportWidth() {
  return pcGetViewportMetrics().reportedWidth;
}


function trackPrompt(scenarioIdx, promptText, score, aiResponse, oscqrActive, aiMeta = null) {
  const s = scenarioData[scenarioIdx];
  if (!s) return;

  const now = Date.now();
  const previousAttemptAt = typeof s.lastAttemptAt === 'number' ? s.lastAttemptAt : null;
  const previousScore = typeof s.currentScore === 'number' ? s.currentScore : null;

  s.timeSincePreviousAttemptSec = previousAttemptAt ? Math.round((now - previousAttemptAt) / 1000) : 0;
  s.lastAttemptAt = now;

  s.currentScore = Number(score || 0);
  s.scoreDelta = previousScore === null ? 0 : Number((s.currentScore - previousScore).toFixed(2));

  s.attempts++;
  s.prompts.push(promptText);
  if (s.currentScore > s.bestScore) s.bestScore = s.currentScore;
  // Preserve enough of Babbage's structured analysis for later research review.
  s.finalResponse = String(aiResponse || '').replace(/<[^>]+>/g, '').substring(0, 24000);
  s.oscqrLit = Array.isArray(oscqrActive) ? oscqrActive.join(', ') : String(oscqrActive || '');

  if (aiMeta && typeof aiMeta === 'object') {
    s.aiProvider = String(aiMeta.provider || '');
    s.aiModel = String(aiMeta.model || '');
    s.aiRequestId = String(aiMeta.request_id || aiMeta.requestId || '');
    s.aiElapsedMs = Number.isFinite(Number(aiMeta.elapsed_ms)) ? Number(aiMeta.elapsed_ms) : '';
    s.aiUsage = aiMeta.usage || null;
    s.structuredAnalysis = aiMeta.structured || aiMeta.analysis || null;
  }
}


// ══════════════════════════════════════════════════════
//  GROWTH SCORING — normalize all 8 scenarios to 0–5
// ══════════════════════════════════════════════════════
function buildGrowthScores() {
  const scores = scenarioData.map((item, index) => getScenarioUI(index).implemented ? (item.bestScore || 0) : 0);
  return {
    s1: scores[0], s2: scores[1], s3: scores[2], s4: scores[3],
    s5: scores[4], s6: scores[5], s7: scores[6], s8: scores[7],
    delta: 0,
    trajectory: scores,
    implementedCount: SCENARIO_UI.filter(item => item.implemented).length,
    threshold_met: scores.filter((score, index) => getScenarioUI(index).implemented && score >= 3).length
  };
}


async function generateGrowthReport(reflectionAnswers) {
  const metacognitionScore = scenarioData[SCENARIO_INDEX.METACOGNITION].bestScore || 0;
  const assessmentScore = scenarioData[SCENARIO_INDEX.ASSESSMENT].bestScore || 0;
  return `Scenario 3 score: ${metacognitionScore}/5. Scenario 4 score: ${assessmentScore}/5. Additional growth reporting will be added as the Canvas roadmap is implemented.`;
}


function buildGrowthTableHTML(g) {
  return `<div class="growth-shell-note"><strong>Scenario 1:</strong> ${g.s1}/5. Additional scenario rows will appear as each clean shell is implemented.</div>`;
}


function buildSessionPayload(formData) {
  const durationMin = ((Date.now() - sessionStart) / 60000).toFixed(1);
  const totalAttempts = scenarioData.reduce((sum, s) => sum + (s.attempts || 0), 0);

  // Build S7 decisions object from scenarioData
  const d7 = scenarioData[SCENARIO_INDEX.HUMAN_JUDGMENT]?.overrelianceDecisions || {};

  return {
    type: 'full_response',
    schema_version: PC_APP_SCHEMA_VERSION,
    app_build: PC_APP_BUILD_LABEL,
    event_id: pcCreateTrackingEventId('full-response'),
    payload_shape: 'named_full_response_v121',

    // Session
    timestamp:            new Date().toISOString(),
    participant_id:       (formData ? formData.get('participant_id') : null) || (playerName !== 'You' ? playerName : 'anonymous'),
    session_id:           pcSessionId,
    session_duration_min: parseFloat(durationMin),
    scenarios_completed:  scenarioCompleted.filter(Boolean).length,
    total_xp:             Math.round(xp),
    total_attempts:       totalAttempts,
    presubmit_predictions: pcFormatAllPresubmitPredictions(),

    // S1
    s1_attempts:          scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE].attempts,
    s1_best_score:        scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE].bestScore,
    s1_prompts:           scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE].prompts.join(' | '),
    s1_final_response:    scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE].finalResponse,
    s1_oscqr:             scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE].oscqrLit,
    s1_section_reviews:   JSON.stringify(scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE].sectionReviews || []),

    // Legacy receiver columns retained for the metacognition implementation,
    // which is now presented as Scenario 3 in the Canvas roadmap.
    s2_attempts:          scenarioData[SCENARIO_INDEX.METACOGNITION].attempts,
    s2_best_score:        scenarioData[SCENARIO_INDEX.METACOGNITION].bestScore,
    s2_prompts:           scenarioData[SCENARIO_INDEX.METACOGNITION].prompts.join(' | '),
    s2_final_response:    scenarioData[SCENARIO_INDEX.METACOGNITION].finalResponse,
    s2_oscqr:             scenarioData[SCENARIO_INDEX.METACOGNITION].oscqrLit,

    // Legacy receiver columns retained for the assessment implementation,
    // which is now presented as Scenario 4 in the Canvas roadmap.
    s3_attempts:          scenarioData[SCENARIO_INDEX.ASSESSMENT].attempts,
    s3_best_score:        scenarioData[SCENARIO_INDEX.ASSESSMENT].bestScore,
    s3_prompts:           scenarioData[SCENARIO_INDEX.ASSESSMENT].prompts.join(' | '),
    s3_final_response:    scenarioData[SCENARIO_INDEX.ASSESSMENT].finalResponse,
    s3_oscqr:             scenarioData[SCENARIO_INDEX.ASSESSMENT].oscqrLit,

    // S4 — current roadmap position for the assessment implementation
    s4_attempts:          scenarioData[SCENARIO_INDEX.ASSESSMENT].attempts,
    s4_best_score:        scenarioData[SCENARIO_INDEX.ASSESSMENT].bestScore,
    s4_prompts:           scenarioData[SCENARIO_INDEX.ASSESSMENT].prompts.join(' | '),
    s4_final_response:    scenarioData[SCENARIO_INDEX.ASSESSMENT].finalResponse,
    s4_oscqr:             scenarioData[SCENARIO_INDEX.ASSESSMENT].oscqrLit,

    // S5 — hallucination hunt
    s5_attempts:          scenarioData[SCENARIO_INDEX.HALLUCINATION].attempts,
    s5_best_score:        scenarioData[SCENARIO_INDEX.HALLUCINATION].bestScore || 0,
    s5_self_report:       scenarioData[SCENARIO_INDEX.HALLUCINATION].selfReport || '',
    s5_prompts:           scenarioData[SCENARIO_INDEX.HALLUCINATION].prompts.join(' | '),
    s5_final_response:    scenarioData[SCENARIO_INDEX.HALLUCINATION].finalResponse || '',

    // S6 — predict the output
    s6_attempts:          scenarioData[SCENARIO_INDEX.PREDICTION].attempts,
    s6_prediction:        scenarioData[SCENARIO_INDEX.PREDICTION].prediction || '',
    s6_prediction_correct: scenarioData[SCENARIO_INDEX.PREDICTION].predictionCorrect ? 'yes' : 'no',
    s6_prompts:           scenarioData[SCENARIO_INDEX.PREDICTION].prompts.join(' | '),

    // S7 — overreliance decisions
    s7_decisions: {
      policy:     d7.policy     || '',
      cases:      d7.cases      || '',
      pledge:     d7.pledge     || '',
      scenarios:  d7.scenarios  || '',
      objectives: d7.objectives || '',
    },
    s7_best_score:        scenarioData[SCENARIO_INDEX.HUMAN_JUDGMENT].bestScore || 0,

    // S8 — reflect & revise
    s8_initial_prompt:    scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].initialPrompt  || '',
    s8_initial_score:     scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].initialScore   || 0,
    s8_revised_prompt:    scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].revisedPrompt  || '',
    s8_revised_score:     scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].revisedScore   || 0,
    s8_score_delta:       scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].scoreDelta     || 0,
    s8_reflection_1:      scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].reflection1    || '',
    ai_narrative:         '',  // populated after async generation
    growth_json:          '',  // populated after async generation
    s8_reflection_2:      scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].reflection2    || '',
    s8_reflection_3:      scenarioData[SCENARIO_INDEX.REFLECT_REVISE_REUSE].reflection3    || '',

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

async function saveIncrementalData(scenarioIdx, eventType = 'scenario_complete') {
  // Don't save if no attempts were made — avoids phantom rows from dev navigation.
  if ((scenarioData[scenarioIdx]?.attempts || 0) === 0 && scenarioIdx !== 3 && scenarioIdx !== 6) return;
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;

  try {
    const s = scenarioData[scenarioIdx] || {};
    const participantId = document.querySelector('input[name="participant_id"]')?.value?.trim()
      || (playerName !== 'You' ? playerName : 'anonymous');

    const now = Date.now();
    const lastSaveAt = pcLastIncrementalSaveAt[scenarioIdx] || null;
    const timeSinceLastAttemptSec = (typeof s.timeSincePreviousAttemptSec === 'number') ? s.timeSincePreviousAttemptSec : (lastSaveAt ? Math.round((now - lastSaveAt) / 1000) : 0);
    pcLastIncrementalSaveAt[scenarioIdx] = now;

    const prompts = Array.isArray(s.prompts) ? s.prompts : [];
    const lastPrompt = prompts.length ? prompts[prompts.length - 1] : '';
    const bestScore = Number(s.bestScore || s.revisedScore || s.initialScore || 0);
    const currentScore = (typeof s.currentScore === 'number') ? s.currentScore : bestScore;
    const scoreDelta = (typeof s.scoreDelta === 'number') ? s.scoreDelta : 0;
    const selfReportPrediction = pcFormatPredictionsForSave(s, scenarioIdx);
    const latestPredictionChoice = pcGetLatestPredictionChoice(s);
    const activityId = pcTrackingActivityId(scenarioIdx, eventType, s);
    const scoreScaleMax = pcTrackingScoreScaleMax(scenarioIdx, eventType, s);

    const payload = {
      type: 'incremental',
      schema_version: PC_APP_SCHEMA_VERSION,
      app_build: PC_APP_BUILD_LABEL,
      event_id: pcCreateTrackingEventId(eventType),
      activity_id: activityId,
      score_scale_max: scoreScaleMax,
      payload_shape: 'named_current_incremental_v121',
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
      score_delta: scoreDelta,
      prompt_text: lastPrompt || prompts.join(' | '),
      prompts: prompts.join(' | '),
      // Keep the legacy column key for the current Apps Script schema, while
      // also logging provider-neutral Babbage metadata in the raw/audit payload.
      claude_response: s.finalResponse || '',
      babbage_response: s.finalResponse || '',
      final_response: s.finalResponse || '',
      ai_provider: s.aiProvider || '',
      ai_model: s.aiModel || '',
      ai_request_id: s.aiRequestId || '',
      ai_elapsed_ms: s.aiElapsedMs || '',
      ai_usage_json: s.aiUsage ? JSON.stringify(s.aiUsage) : '',
      babbage_analysis_json: s.structuredAnalysis ? JSON.stringify(s.structuredAnalysis) : '',
      s2_diagnosis_json: scenarioIdx === SCENARIO_INDEX.METACOGNITION ? JSON.stringify(s.diagnosisAttempts || []) : '',
      s2_evidence_json: scenarioIdx === SCENARIO_INDEX.METACOGNITION ? JSON.stringify(s.evidenceAttempts || []) : '',
      s2_thinking_move: scenarioIdx === SCENARIO_INDEX.METACOGNITION ? (s.thinkingMove || '') : '',
      s2_audit_json: scenarioIdx === SCENARIO_INDEX.METACOGNITION ? JSON.stringify(s.auditAttempts || []) : '',
      s2_repair_text: scenarioIdx === SCENARIO_INDEX.METACOGNITION ? (s.repairText || '') : '',
      s3_diagnosis_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify(s.diagnosisAttempts || []) : '',
      s3_evidence_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify({
        blueprintAttempts: s.blueprintAttempts || [],
        evidenceAttempts: s.evidenceAttempts || [],
        evidenceFinal: s.evidenceFinal || [],
        dragEvents: s.dragEvents || [],
        initialScore: Number(s.initialScore || 0),
        revisedScore: Number(s.revisedScore || s.currentScore || 0),
        scoreDelta: Number(s.scoreDelta || 0)
      }) : '',
      s3_audit_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify(s.auditAttempts || []) : '',
      s3_repair_text: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? (s.repairText || '') : '',
      s3_evidence_statement: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? (s.evidenceStatement || '') : '',
      s3_transfer_metadata_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify(s.transferLabMetadata || {}) : '',
      s4_diagnosis_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify(s.diagnosisAttempts || []) : '',
      s4_function_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify(s.blueprintAttempts || s.evidenceAttempts || []) : '',
      s4_audit_json: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? JSON.stringify(s.auditAttempts || []) : '',
      s4_async_repair: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? (s.repairText || '') : '',
      s4_evidence_statement: scenarioIdx === SCENARIO_INDEX.ASSESSMENT ? (s.evidenceStatement || '') : '',
      s5_check_json: scenarioIdx === SCENARIO_INDEX.HALLUCINATION ? JSON.stringify(s.checkAttempts || []) : '',
      s5_audit_json: scenarioIdx === SCENARIO_INDEX.HALLUCINATION ? JSON.stringify(s.auditAttempts || []) : '',
      s5_flagged_claim: scenarioIdx === SCENARIO_INDEX.HALLUCINATION ? (s.flaggedClaim || '') : '',
      s5_corrected_claim: scenarioIdx === SCENARIO_INDEX.HALLUCINATION ? (s.correctedClaim || '') : '',
      s5_verification_note: scenarioIdx === SCENARIO_INDEX.HALLUCINATION ? (s.verificationNote || '') : '',
      quality_indicators_lit: s.oscqrLit || '',
      oscqr_lit: s.oscqrLit || '',
      self_report_prediction: selfReportPrediction,
      self_report: s.selfReport || '',
      prediction: latestPredictionChoice,
      time_since_last_attempt_sec: timeSinceLastAttemptSec,
      screen_width: getPromptCraftViewportWidth(),
      event_type: eventType,
      notes_coding_memo: [
        location.pathname,
        getPromptCraftScenarioLabel(scenarioIdx),
        `session ${pcSessionId}`,
        PC_APP_BUILD_LABEL,
        s.aiProvider ? `ai_provider=${s.aiProvider}` : '',
        s.aiModel ? `ai_model=${s.aiModel}` : '',
        s.aiRequestId ? `ai_request_id=${s.aiRequestId}` : '',
        s.aiElapsedMs !== '' ? `ai_elapsed_ms=${s.aiElapsedMs}` : ''
      ].filter(Boolean).join(' :: ')
    };

    pcDebug(`[PromptCraft] Incremental save S${scenarioIdx + 1}:`, payload);
    await postToSheets(payload, `incremental S${scenarioIdx + 1}`);
  } catch(e) {
    console.warn('[PromptCraft] Incremental save failed:', e.message);
  }
}
