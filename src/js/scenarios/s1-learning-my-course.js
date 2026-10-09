/* S1 personal course overview, AI review and transfer reflection. */

function pcS1MyCourseProgress(step) {
  return ({ focus: '1 of 3', intent: '2 of 3', activities: '3 of 3' })[step] || 'My Course';
}

function pcRenderS1MyCourseSummary() {
  const data = pcS1LearningState.myCourse || pcEmptyS1MyCourse();
  return `
    <aside class="pc-s1-my-course-summary" aria-label="My Course overview so far">
      <span class="pc-s1-result-eyebrow">Private My Course workspace</span>
      <h2>${esc(data.moduleTitle || 'Your module')}</h2>
      ${data.intendedLearning ? `<p><strong>Intended learning</strong><br>${esc(data.intendedLearning)}</p>` : '<p>Add the intended learning next.</p>'}
      <p class="pc-s1-my-course-privacy">Saved on this device. This overview is not added to the study record.</p>
    </aside>`;
}

function pcRenderS1MyCourseStep(step = 'focus') {
  pcS1LearningState.view = 'my-course';
  pcS1LearningState.myCourseStep = step;
  const area = document.getElementById('chat');
  if (!area) return false;
  const data = pcS1LearningState.myCourse || pcEmptyS1MyCourse();
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  let taskHTML = '';

  if (step === 'focus') {
    taskHTML = `
      <form class="pc-s1-my-course-card" data-pc-submit-action="s1-my-course-save-focus">
        <span class="pc-s1-result-eyebrow">My Course · Step 1</span>
        <h2>Choose one module or unit</h2>
        <p>Start small. Use one module you want to inspect rather than trying to repair an entire course at once.</p>
        <label for="pcS1MyCourseTitle">Module or unit name</label>
        <input id="pcS1MyCourseTitle" name="moduleTitle" type="text" maxlength="120" value="${esc(data.moduleTitle)}" placeholder="Example: Week 4: Informative Speech" required>
        <div class="pc-s1-my-course-actions"><button type="submit" class="pc-shell-primary">Continue</button></div>
      </form>`;
  } else if (step === 'intent') {
    taskHTML = `
      <form class="pc-s1-my-course-card" data-pc-submit-action="s1-my-course-save-intent">
        <span class="pc-s1-result-eyebrow">My Course · Step 2</span>
        <h2>What should students be able to do?</h2>
        <p>Describe the performance you care about. Avoid listing content students should merely encounter.</p>
        <label for="pcS1MyCourseIntent">By the end of this module, students should be able to…</label>
        <textarea id="pcS1MyCourseIntent" name="intendedLearning" rows="5" maxlength="700" placeholder="Example: Compare two sources and support a recommendation with evidence." required>${esc(data.intendedLearning)}</textarea>
        <div class="pc-s1-my-course-actions">
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="focus">Back</button>
          <button type="submit" class="pc-shell-primary">Continue</button>
        </div>
      </form>`;
  } else {
    const activityInputs = Array.from({ length: 4 }, (_, index) => `
      <label class="pc-s1-my-course-activity-row" for="pcS1MyCourseActivity${index}">
        <span>Activity ${index + 1}${index < 2 ? ' · required' : ' · optional'}</span>
        <input id="pcS1MyCourseActivity${index}" name="activity${index}" type="text" maxlength="180" value="${esc(data.activities[index] || '')}" placeholder="Example: Watch the sample speech video" ${index < 2 ? 'required' : ''}>
      </label>`).join('');
    taskHTML = `
      <form class="pc-s1-my-course-card" data-pc-submit-action="s1-my-course-review">
        <span class="pc-s1-result-eyebrow">My Course · Step 3</span>
        <h2>What do students currently do?</h2>
        <p>List the activity names students see now. Babbage will review only this overview, not invent missing course details.</p>
        <div class="pc-s1-my-course-activities">${activityInputs}</div>
        <div class="pc-s1-my-course-consent">When you choose <strong>Review with Babbage</strong>, only this module name, intended learning statement, and activity list are sent for feedback. They are not added to the study record.</div>
        <div class="pc-s1-my-course-actions">
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="intent">Back</button>
          <button type="submit" class="pc-shell-primary">Review with Babbage</button>
        </div>
      </form>`;
  }

  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-my-course', titleId: 'pcS1MyCourseTitleHeading',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1MyCourseTitleHeading', label: `Scenario 1 · My Course`, title: `Build your module overview`, instruction: `Give Babbage enough real course context to respond to your design instead of guessing.`, status: `${pcS1MyCourseProgress(step)}` }),
    bodyHTML: `

      <div class="pc-s1-learning-shell">
        <div class="pc-s1-my-course-layout">
          ${taskHTML}
          ${pcRenderS1MyCourseSummary()}
        </div>
      </div>
    `
  });
  resetSectionScroll(area);
  return true;
}

function pcSaveS1MyCourseFocus(form) {
  const title = String(new FormData(form).get('moduleTitle') || '').trim();
  if (!title) return false;
  pcS1LearningState.myCourse.moduleTitle = title;
  pcSaveS1MyCourse();
  return pcRenderS1MyCourseStep('intent');
}

function pcSaveS1MyCourseIntent(form) {
  const intendedLearning = String(new FormData(form).get('intendedLearning') || '').trim();
  if (!intendedLearning) return false;
  pcS1LearningState.myCourse.intendedLearning = intendedLearning;
  pcSaveS1MyCourse();
  return pcRenderS1MyCourseStep('activities');
}

function pcGetS1MyCourseFeedback(response, data) {
  const activityCount = data.activities.filter(Boolean).length;
  const structured = response?.structured && typeof response.structured === 'object' ? response.structured : {};
  const hasLiveAnalysis = !response?.mock && response?.provider !== 'local-fallback' && Object.keys(structured).length > 0;
  const worked = Array.isArray(structured.what_worked) ? structured.what_worked.map(item => String(item || '').trim()).filter(Boolean).slice(0, 3) : [];
  const intent = String(data.intendedLearning || '').trim();
  const activities = data.activities.filter(Boolean).map(item => String(item).trim());
  const isUnclear = text => /^(?:.{0,2}|(?:test|testing|asdf|qwerty|lorem|random|placeholder|n\/a)(?:\s+\w+){0,2})$/i.test(text)
    || /^(.)\1{3,}$/i.test(text) || !/[a-z]{3}/i.test(text);
  const unclearIntent = isUnclear(intent) || !/\b(analy[sz]e|apply|build|compare|create|demonstrate|design|develop|evaluate|explain|identify|interpret|justify|perform|produce|recommend|solve|use|write)\b/i.test(intent);
  const navigationOnly = activities.length > 0 && activities.every(item => /^(start here|your instructor|helpful links|next steps|overview|introduction|course resources|welcome|syllabus)$/i.test(item));
  const unclearActivities = activities.length > 0 && activities.every(isUnclear);
  const limitedInput = unclearIntent || navigationOnly || unclearActivities;
  const improvementIdeas = data.activities.filter(Boolean).map(activity => {
    const title = String(activity || '').trim();
    const lower = title.toLowerCase();
    if (/video|watch|demonstration/.test(lower)) return `For “${title},” name the topic and tell students what to notice or use afterward.`;
    if (/discuss|discussion|respond|reply/.test(lower)) return `For “${title},” state the question, the evidence students should use, and what a strong response includes.`;
    if (/submit|analysis|project|assignment|quiz|test/.test(lower)) return `For “${title},” name the deliverable and criteria that demonstrate “${data.intendedLearning || 'the intended learning'}.”`;
    if (/read|chapter|article|case/.test(lower)) return `For “${title},” include the topic and the purpose for reading so students know how it prepares them.`;
    return `For “${title},” replace the generic label with the task, topic, and expected result students will recognize in Canvas.`;
  });
  const aiConcerns = Array.isArray(structured?.input_quality?.concerns)
    ? structured.input_quality.concerns.map(item => String(item || '').trim()).filter(Boolean)
    : [];
  if (limitedInput && !hasLiveAnalysis) return {
    source: 'fallback',
    clear: navigationOnly
      ? 'These entries describe ways to navigate the course. I cannot identify a learning task, practice opportunity, or evidence of learning from them.'
      : 'I cannot judge the learning path from these entries yet. The intended learning or the activity names need more detail.',
    worked: navigationOnly ? ['The course has a starting point and support links.'] : ['You have a draft module to revise.'],
    unknown: unclearIntent
      ? 'The intended learning needs an observable action and a topic before I can check whether the activities align.'
      : 'The listed items do not show what students will practice or produce to demonstrate the intended learning.',
    next: unclearIntent
      ? 'State what students should be able to do with the course content. Then name the activities that help them practice and show that action.'
      : 'Keep these navigation items, then add a named practice task and an assignment or other product that shows the intended learning.',
    improvementIdeas: navigationOnly
      ? ['Keep “Start Here” and “Helpful Links” as navigation or support items.', 'Add a practice activity that asks students to use the course ideas.', 'Add an assignment or other evidence that shows what students learned.']
      : ['Replace test text with the real topic and student task.', 'Describe what students will do during practice.', 'Name what students will produce to show their learning.']
  };
  return {
    source: hasLiveAnalysis ? 'live' : 'fallback',
    clear: String(structured.feedback_summary || '').trim() || `You named the module and listed ${activityCount} activities. Their titles alone do not establish alignment.`,
    worked: worked.length ? worked : [`Your intended learning states: ${intent}`, `${activityCount} activity titles are available to inspect.`],
    unknown: String(structured.issue_detected || '').trim() || 'Activity titles alone cannot show whether students practice the intended performance or produce evidence of it.',
    next: String(structured.recommended_repair || '').trim() || 'Inspect the instructions and student work for each activity. Then compare the evidence students produce with the intended learning.',
    improvementIdeas: [...aiConcerns, ...improvementIdeas].filter((item, index, list) => list.indexOf(item) === index).slice(0, 4)
  };
}

function pcBuildS1MyCourseReport(data, response) {
  const feedback = pcGetS1MyCourseFeedback(response, data);
  return `
    <article class="pc-s1-babbage-report pc-s1-guide-plan-report pc-s1-my-course-report" role="document" aria-label="Babbage My Course module overview review">
      <header><span class="pc-s1-babbage-kicker">${response?.mock ? 'Fallback analysis' : 'Live Babbage analysis'}</span><h2>My Course overview</h2></header>
      <section class="pc-s1-guide-plan-intro"><h3>What Babbage can see</h3><p>${esc(feedback.clear)}</p></section>
      <section class="pc-s1-guide-plan-grid">
        <div><span class="pc-s1-result-eyebrow">Your module</span><p><strong>${esc(data.moduleTitle)}</strong></p><p>${esc(data.intendedLearning)}</p></div>
        <div><span class="pc-s1-result-eyebrow">Current activities</span><ul>${data.activities.filter(Boolean).map(activity => `<li>${esc(activity)}</li>`).join('')}</ul></div>
      </section>
      <section class="pc-s1-my-course-findings"><h3>What is clear</h3><ul>${feedback.worked.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="pc-s1-my-course-findings"><h3>What needs inspection</h3><p>${esc(feedback.unknown)}</p></section>
      <section class="pc-s1-babbage-structure-note"><h3>Next check</h3><p>${esc(feedback.next)}</p></section>
    </article>`;
}

async function pcReviewS1MyCourse(form) {
  const workspaceEpoch = pcS1WorkspaceEpoch;
  const values = new FormData(form);
  const activities = Array.from({ length: 4 }, (_, index) => String(values.get(`activity${index}`) || '').trim());
  if (!activities[0] || !activities[1]) return false;
  pcS1LearningState.myCourse.activities = activities;
  pcSaveS1MyCourse();
  const data = { ...pcS1LearningState.myCourse, activities: [...activities] };
  pcS1LearningState.view = 'my-course-babbage';
  showBabbageConsultOverlay('My Course overview review', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is reviewing your module overview.',
    body: 'It is using only the module name, intended learning statement, and activities you chose to share.'
  });
  let response = {};
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 'scenario1',
      system: `You are Babbage, PromptCraft's instructional-design review partner. Review only the faculty member's supplied module title, intended learning statement, and current activity titles. Respond to their actual wording. In the structured response, use feedback_summary for a short overview, what_worked for up to three specific observations, issue_detected for what cannot yet be established from titles, and recommended_repair for one practical, specific improvement tied to their activities. Do not invent course facts. Do not rewrite the course. Focus on navigation, activity purpose, and whether preparation, practice, and evidence support the intended learning.`,
      messages: [{ role: 'user', content: JSON.stringify(data, null, 2) }]
    }, 'main');
  } catch (error) {
    console.warn('[PromptCraft] My Course overview review failed before fallback rendering:', error);
    response = { mock: true, mockReason: 'scenario-error' };
  }
  if (!pcS1AsyncWorkIsCurrent(workspaceEpoch)) return false;
  pcS1LearningState.myCourseBabbageResponse = response;
  pcSetVNOverlayState({ active: false });
  return pcRenderS1MyCourseFeedback();
}

function pcRenderS1MyCourseFeedback() {
  pcS1LearningState.view = 'my-course-feedback';
  const area = document.getElementById('chat');
  if (!area) return false;
  const data = pcS1LearningState.myCourse;
  const feedback = pcGetS1MyCourseFeedback(pcS1LearningState.myCourseBabbageResponse, data);
  const added = Boolean(pcS1LearningState.guide?.myCourseReview?.added);
  const transferActions = added
    ? `<div class="pc-s1-my-course-actions">
        <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="focus">Revise overview</button>
        <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-view-full-guide">View My Course Guide</button>
      </div>`
    : `<form id="pcS1ReviewNextStep" class="pc-s1-transfer-reflection" data-pc-submit-action="s1-my-course-add-guide">
        <div class="pc-s1-transfer-intro"><h3>Plan one next step for your course</h3><p>Use the feedback above to choose one small change. Short phrases are enough.</p></div>
        <div class="pc-s1-transfer-fields">
          ${[
            ['transferActivity', 'pcS1TransferActivity', '1. Which activity will you work on?', 'Choose one activity from your overview. Name it so you can find it later.', 'For example: Recorded Informative Speech'],
            ['transferChange', 'pcS1TransferChange', '2. What will you change or check?', 'Use one suggestion from the feedback. Describe a small action you can take.', 'For example: Add a requirement to support the main points with credible sources.'],
            ['transferEvidence', 'pcS1TransferEvidence', '3. What should students show?', 'Describe what you would look for in their work to see the intended learning.', 'For example: Students use credible evidence to support the main points of their speech.']
          ].map(([name, id, title, help, example]) => `<div class="pc-s1-transfer-field"><label for="${id}"><strong>${title}</strong><span id="${id}Help">${help}</span></label><textarea id="${id}" name="${name}" rows="3" minlength="10" maxlength="140" required aria-describedby="${id}Help pcS1TransferReflectionStatus" data-pc-input-action="s1-learning-update-transfer-reflection" placeholder="${example}">${esc(pcS1LearningState[name] || '')}</textarea></div>`).join('')}
        </div>
        <p class="pc-s1-response-status" id="pcS1TransferReflectionStatus" role="status">${pcS1TransferReady() ? 'Ready to save your plan in My Course Guide.' : 'Add a short phrase of at least 10 characters for each step.'}</p>
        <p class="pc-s1-transfer-privacy">Your three answers become one reminder in My Course Guide. A short de-identified copy is also included in the study record. Your module overview stays on this device.</p>
        <div class="pc-s1-my-course-actions">
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="focus">Revise overview</button>
          <button type="submit" class="pc-shell-primary"${pcS1TransferReady() ? '' : ' disabled'}>Add to My Course Guide</button>
        </div>
      </form>`;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-my-course', titleId: 'pcS1MyCourseFeedbackTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1MyCourseFeedbackTitle', label: `Scenario 1 · My Course`, title: `Babbage’s course setup feedback`, instruction: `Review the suggestions, then save them to your personal course guide.`, status: `${added ? 'Added to My Guide' : 'Ready to review'}` }),
    bodyHTML: `

      <div class="pc-s1-learning-shell">
        <div class="pc-s1-my-course-review-canvas">
          <header class="pc-s1-my-course-canvas-bar"><strong>My Course Guide</strong><span>${esc(data.moduleTitle)}</span></header>
          <nav class="pc-s1-my-course-review-links" aria-label="Jump to a course guidance section"><button type="button" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewFeedback">Babbage feedback</button><button type="button" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewImprovements">Activity suggestions</button><button type="button" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewPattern">Module pattern</button>${added ? '' : '<button type="button" class="pc-s1-next-step-link" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewNextStep">Fill in your next step</button>'}</nav>
          <div class="pc-s1-my-course-review-body">
            <article class="pc-s1-my-course-review-page">
              <span class="pc-s1-result-eyebrow">${feedback.source === 'live' ? 'Live Babbage review' : 'Built-in review'}</span>
              <h2 id="pcS1ReviewFeedback">Set up ${esc(data.moduleTitle || 'your module')} around the learning students must demonstrate</h2>
              <section><h3>What is already clear</h3><ul>${feedback.worked.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
              <section><h3>What the activity titles cannot confirm</h3><p>${esc(feedback.unknown)}</p></section>
              <section class="pc-s1-my-course-next-check"><h3>Recommended course setup check</h3><p>${esc(feedback.next)}</p></section>
              <section id="pcS1ReviewImprovements"><h3>Ways to improve the activities you entered</h3><ul>${feedback.improvementIdeas.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
              <section id="pcS1ReviewPattern"><h3>Suggested module pattern</h3><div class="pc-s1-guide-reference-grid"><div><strong>Prepare</strong><em>Readings, examples, demonstrations</em></div><div><strong>Practice</strong><em>Discussion, drafts, feedback</em></div><div><strong>Evidence</strong><em>Work that demonstrates the intended learning</em></div></div></section>
              ${transferActions}
              <p class="pc-s1-my-course-privacy">Your module text and saved guidance stay on this device. Only the short transfer reflection and completion indicators are included in the study record.</p>
            </article>
          </div>
        </div>
      </div>
    `
  });
  resetSectionScroll(area);
  return true;
}

function pcAddS1MyCourseReviewToGuide(form) {
  const data = pcS1LearningState.myCourse;
  const feedback = pcGetS1MyCourseFeedback(pcS1LearningState.myCourseBabbageResponse, data);
  if (form) {
    const values = new FormData(form);
    for (const name of PC_S1_TRANSFER_FIELDS) pcS1LearningState[name] = String(values.get(name) || '').trim();
  }
  if (!pcS1TransferReady()) return false;
  const transferReflection = pcBuildS1TransferReflection();
  pcS1LearningState.transferReflection = transferReflection;
  pcS1LearningState.guide.myCourseReview = {
    added: true,
    moduleTitle: data.moduleTitle,
    intendedLearning: data.intendedLearning,
    activities: data.activities.filter(Boolean),
    feedback,
    source: feedback.source,
    transferReflection,
    transferPlan: { activity: pcS1LearningState.transferActivity.trim(), change: pcS1LearningState.transferChange.trim(), evidence: pcS1LearningState.transferEvidence.trim() },
    addedAt: new Date().toISOString()
  };
  pcSaveS1Guide();
  if (!pcS1LearningState.myCourseXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.myCourseXPEarned = awardS1PracticeXP(3, 3);
  }
  const completedActivities = data.activities.filter(activity => String(activity || '').trim()).length;
  const transferScore = Math.min(5, (data.moduleTitle.trim() ? 1 : 0) + (data.intendedLearning.trim() ? 2 : 0) + Math.min(2, Math.ceil(completedActivities / 2)));
  if (!pcS1LearningState.transferXPEarned && typeof awardS1TransferXP === 'function') {
    pcS1LearningState.transferXPEarned = awardS1TransferXP(transferScore);
  }
  const review = pcEvaluateS1Organization();
  const organizationScore = review.matchCount === review.total ? 2 : review.matchCount >= 3 ? 1 : 0;
  const diagnosisScore = pcS1LearningState.diagnosisChoice === 'evidence-gap' ? 2 : 1;
  const finalScore = Math.min(5, organizationScore + diagnosisScore + (transferScore >= 4 ? 1 : 0));
  const aiResponse = pcS1LearningState.myCourseBabbageResponse || {};
  const scenarioRecord = scenarioData?.[SCENARIO_INDEX.CONTENT_AVALANCHE];
  if (scenarioRecord) {
    scenarioRecord.aiProvider = aiResponse.provider || (feedback.source === 'fallback' ? 'local-fallback' : '');
    scenarioRecord.aiModel = aiResponse.model || '';
    scenarioRecord.aiRequestId = aiResponse.requestId || aiResponse.request_id || '';
    scenarioRecord.aiElapsedMs = aiResponse.elapsedMs || aiResponse.elapsed_ms || '';
    scenarioRecord.aiUsage = aiResponse.usage || null;
    scenarioRecord.structuredAnalysis = aiResponse.structured || null;
  }
  pcRecordS1LearningProgress('s1_course_guide_complete', finalScore, 'Completed Scenario 1', feedback.source === 'live' ? 'Live feedback delivered.' : 'Built-in feedback delivered.', {
    diagnosisChoice: pcS1LearningState.diagnosisChoice,
    diagnosisCorrect: pcS1LearningState.diagnosisChoice === 'evidence-gap',
    diagnosisRationale: pcS1LearningState.diagnosisRationale,
    activityCount: completedActivities,
    organization: pcS1LearningState.organization,
    renamedTitles: pcS1LearningState.renamedTitles,
    placementMatches: review.matchCount,
    placementTotal: review.total,
    placementMismatches: review.mismatches.map(item => ({ id: item.id, title: item.title, placed: item.actual, suggested: item.suggested })),
    guideSaved: true,
    transferReflection,
    feedbackSource: feedback.source,
    aiRequestFailed: feedback.source !== 'live',
    completionStatus: 'Completed'
  });
  return pcRenderS1FullGuide();
}

const PC_S1_TRANSFER_FIELDS = ['transferActivity', 'transferChange', 'transferEvidence'];

function pcS1TransferReady() {
  return PC_S1_TRANSFER_FIELDS.every(name => {
    const length = String(pcS1LearningState[name] || '').trim().length;
    return length >= 10 && length <= 140;
  });
}

function pcBuildS1TransferReflection() {
  return `Activity: ${String(pcS1LearningState.transferActivity || '').trim()}\nNext step: ${String(pcS1LearningState.transferChange || '').trim()}\nStudent work: ${String(pcS1LearningState.transferEvidence || '').trim()}`;
}

function pcUpdateS1TransferReflection(target) {
  if (PC_S1_TRANSFER_FIELDS.includes(target?.name)) pcS1LearningState[target.name] = target.value;
  pcS1LearningState.transferReflection = pcBuildS1TransferReflection();
  const ready = pcS1TransferReady();
  const submit = document.querySelector('.pc-s1-transfer-reflection button[type="submit"]');
  if (submit) submit.disabled = !ready;
  const status = document.getElementById('pcS1TransferReflectionStatus');
  if (status) status.textContent = ready ? 'Ready to save your plan in My Course Guide.' : 'Add a short phrase of at least 10 characters for each step.';
  return ready;
}

function pcScrollS1ReviewSection(sectionId) {
  const section = document.getElementById(String(sectionId || ''));
  const scroller = document.querySelector('.pc-s1-my-course-review-canvas');
  if (!section || !scroller) return false;
  section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  section.setAttribute('tabindex', '-1');
  window.setTimeout(() => section.focus({ preventScroll: true }), 250);
  return true;
}
