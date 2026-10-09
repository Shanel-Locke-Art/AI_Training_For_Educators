/* S1 reusable course guide creation, saved reading surface and guide actions. */

function pcS1OSCQRLabel() {
  return PC_S1_OSCQR_STANDARDS.map(item => `OSCQR ${item.number}: ${item.title}`).join(' | ');
}

function pcRenderS1OSCQRStandards({ concise = false } = {}) {
  const standards = concise
    ? PC_S1_OSCQR_STANDARDS.filter(item => [2, 9, 19, 45].includes(item.number))
    : PC_S1_OSCQR_STANDARDS;
  return `<section class="pc-s1-guide-section pc-s1-oscqr-section" id="pcS1GuideStandards" aria-labelledby="pcS1OSCQRHeading">
    <span class="pc-s1-result-eyebrow">OSCQR 4.1 connections</span>
    <h3 id="pcS1OSCQRHeading">Standards connected to this review</h3>
    <p>Use these connections as prompts for further inspection, not as a completed course review.</p>
    <div class="pc-s1-oscqr-grid">${standards.map(item => `<article><strong><span>OSCQR ${item.number}</span>${esc(item.title)}</strong><p>${esc(item.connection)}</p></article>`).join('')}</div>
  </section>`;
}

function pcBuildS1GuideStep1Input() {
  const placements = pcS1LearningState.organization || {};
  return {
    guideStep: 'Make the Learning Path Visible',
    originalTitles: PC_S1_LEARNING_ITEMS.map(item => item.moduleTitle),
    revisedActivities: PC_S1_LEARNING_ITEMS.map((item, index) => ({
      title: pcS1LearningState.renamedTitles[index] || item.moduleTitle,
      purpose: placements[item.id] || 'unplaced',
      type: item.typeLabel
    }))
  };
}

function pcGetS1GuideStep1Insight(response, input) {
  const counts = ['prepare', 'practice', 'evidence'].reduce((acc, key) => {
    acc[key] = input.revisedActivities.filter(item => item.purpose === key).length;
    return acc;
  }, {});
  const review = pcEvaluateS1Organization();
  const mismatchText = review.suggestions.length
    ? review.suggestions[0]
    : 'Your placements match the suggested Prepare → Practice → Evidence learning path.';
  const fallback = {
    source: 'fallback',
    summary: review.mismatches.length
      ? `Your clearer titles improve scanning, but ${review.mismatches.length} ${review.mismatches.length === 1 ? 'placement still needs' : 'placements still need'} another look before the learning path is fully coherent.`
      : 'Your revised titles and placements create a clear, visible learning path from preparation to practice to evidence.',
    strengths: [
      'Activity titles use clearer, student-facing language instead of abbreviations or generic labels.',
      `The module now shows ${counts.prepare} Prepare, ${counts.practice} Practice, and ${counts.evidence} Evidence ${counts.evidence === 1 ? 'activity' : 'activities'}.`,
      review.mismatches.length ? `${review.matchCount} of ${review.total} activity placements already fit the suggested learning purpose.` : 'All activity placements fit the suggested learning purpose.'
    ],
    watchFor: mismatchText,
    impact: review.mismatches.length
      ? 'Students can scan the module more easily, but misplaced activities may still give mixed signals about when they are learning, practicing, or demonstrating learning.'
      : 'Students can predict both what each item contains and why it appears at that point in the module.'
  };

  const a = response?.structured;
  if (!a || typeof a !== 'object') return fallback;
  const worked = Array.isArray(a.what_worked) ? a.what_worked.map(item => String(item || '').trim()).filter(Boolean).slice(0, 3) : [];
  return {
    source: response?.mock || response?.provider === 'local-fallback' ? 'fallback' : 'live',
    summary: String(a.feedback_summary || '').trim() || fallback.summary,
    strengths: worked.length ? worked : fallback.strengths,
    watchFor: review.mismatches.length ? mismatchText : (String(a.recommended_repair || a.issue_detected || '').trim() || fallback.watchFor),
    impact: String(a.expected_impact || '').trim() || fallback.impact
  };
}

function pcRenderS1GuideInsight(insight) {
  const result = insight && typeof insight === 'object' ? insight : {};
  const strengths = Array.isArray(result.strengths) ? result.strengths.filter(Boolean) : [];
  const sourceLabel = result.source === 'live' ? 'Personalized activity review' : 'Activity review';
  return `
    <article class="pc-s1-guide-personalized-feedback">
      <span class="pc-s1-result-eyebrow">${sourceLabel}</span>
      <h3>What your choices show</h3>
      <p>${esc(result.summary || 'Review the activity titles and placements against the purpose of each activity.')}</p>
      ${strengths.length ? `<ul>${strengths.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
      <div class="pc-s1-my-course-next-check"><h3>Check next</h3><p>${esc(result.watchFor || 'Confirm that each activity appears where students will expect to use it.')}</p></div>
      ${result.impact ? `<p><strong>Likely student impact:</strong> ${esc(result.impact)}</p>` : ''}
    </article>`;
}

function pcRenderS1GuidePurposeReference() {
  return `<div class="pc-s1-guide-reference-grid">
      <section>
        <span class="pc-s1-result-eyebrow">Prepare</span>
        <p>Students get what they need before trying the work.</p><ul><li>Readings and videos</li><li>Examples and demonstrations</li><li>Vocabulary and background</li></ul>
      </section>
      <section>
        <span class="pc-s1-result-eyebrow">Practice</span>
        <p>Students try, discuss, and get feedback.</p><ul><li>Discussions and drafts</li><li>Practice problems and checks</li><li>Peer review and rehearsal</li></ul>
      </section>
      <section>
        <span class="pc-s1-result-eyebrow">Evidence</span>
        <p>Students show what they can do.</p><ul><li>Projects and case responses</li><li>Presentations and portfolios</li><li>Aligned assessments</li></ul>
      </section>
    </div>
    <div class="pc-s1-guide-header-ideas">
      <span class="pc-s1-result-eyebrow">Other text headers you can use</span>
      <p><strong>You do not have to use Prepare / Practice / Evidence.</strong> Try purpose-driven labels such as Start Here, Learn, Watch, Read, Try It, Discuss, Check Your Understanding, Apply, Submit, or Reflect. Consistency matters more than copying one exact vocabulary set.</p>
    </div>`;
}

function pcRenderS1GuideMiniModule(input) {
  const zoneLabel = { prepare: 'Prepare', practice: 'Practice', evidence: 'Evidence' };
  return ['prepare', 'practice', 'evidence'].map(zone => {
    const items = input.revisedActivities.filter(item => item.purpose === zone);
    return `<div class="pc-s1-guide-module-group"><strong>${zoneLabel[zone]}</strong>${items.length ? items.map(item => `<span>${esc(item.title)}</span>`).join('') : '<span class="is-empty">No activity placed</span>'}</div>`;
  }).join('');
}

function pcRenderS1WeeklyModulePattern() {
  const weeks = [
    { week: 'Week 1', topic: 'Introduce the problem', learn: 'Overview, reading, short example', show: 'Explain the problem in a brief response' },
    { week: 'Week 2', topic: 'Work with the evidence', learn: 'Demonstration, discussion, guided practice', show: 'Use evidence in a draft or case response' },
    { week: 'Week 3', topic: 'Apply the learning', learn: 'Targeted review and feedback', show: 'Submit the aligned performance or product' }
  ];
  return `<section class="pc-s1-guide-section pc-s1-weekly-pattern" id="pcS1GuidePattern" aria-labelledby="pcS1WeeklyPatternHeading">
    <span class="pc-s1-result-eyebrow">Repeatable module pattern</span>
    <h3 id="pcS1WeeklyPatternHeading">Keep a few anchors consistent each week</h3>
    <p>Students do not need every module to contain every category. Repeat the overview, a clear path into the work, and a visible place to show learning; change the activities to fit that week.</p>
    <div class="pc-s1-weekly-pattern-grid">${weeks.map(item => `<article>
      <header><span>${esc(item.week)}</span><strong>${esc(item.topic)}</strong></header>
      <div><b>Start here</b><p>State what students will learn and what they will produce.</p></div>
      <div><b>Learn and try</b><p>${esc(item.learn)}</p></div>
      <div class="is-evidence"><b>Show your learning</b><p>${esc(item.show)}</p></div>
    </article>`).join('')}</div>
  </section>`;
}

function pcRenderS1GuideStep1({ fromMenu = pcS1GuideOpenedFromMenu } = {}) {
  pcPrepareS1GuideSurface(fromMenu);
  pcS1LearningState.view = 'guide-step1';
  const area = document.getElementById('chat');
  if (!area) return false;
  const input = pcBuildS1GuideStep1Input();
  const guide = pcS1LearningState.guide?.step1 || {};
  const insight = guide.personalizedInsight || pcGetS1GuideStep1Insight(pcS1LearningState.guideBabbageResponse, input);
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-guide-preview', titleId: 'pcS1GuideStep1Title',
    background: sceneBg,
    bodyHTML: `
      <div class="pc-s1-learning-taskbar pc-s1-guide-taskbar">
        <div><img class="pc-s1-guide-brand-mark" src="${pcProjectUrl('assets/images/ui/ui_01_babbage_mark.svg')}" alt="" aria-hidden="true"><span>My PromptCraft Course Guide · Step 1</span><h1 id="pcS1GuideStep1Title">Make the Learning Path Visible</h1><p>A Canvas building reference for your own course.</p></div>
        <div class="pc-s1-guide-heading-actions"><span class="pc-s1-learning-task-status">${guide.added ? 'Saved to My Guide' : 'Guide preview'}</span>${fromMenu ? '<button type="button" class="pc-shell-secondary" data-pc-action="open-main-menu" data-pc-panel="home">Back to Main Menu</button>' : ''}</div>
      </div>
      <div class="pc-s1-guide-paper" role="document" aria-label="Course Guide Step 1 preview">
        <section class="pc-s1-guide-section">
          <h3>Why this matters</h3>
          <p>Students should be able to tell what an item is, why it is there, and what comes next without opening every page first. Descriptive titles and text headers make the learning path visible at the module level.</p>
        </section>
        <section class="pc-s1-guide-section pc-s1-guide-reference-section">
          <span class="pc-s1-result-eyebrow">Canvas building reference</span><h3>Choose text headers by learning purpose</h3>
          <p class="pc-s1-guide-reference-intro">The practice module used Prepare, Practice, and Evidence to make progression visible. Use the same idea in your own course, but choose labels that make sense for your students and discipline.</p>
          ${pcRenderS1GuidePurposeReference()}
        </section>
        <section class="pc-s1-guide-section pc-s1-guide-feedback-section">
          ${pcRenderS1GuideInsight(insight)}
        </section>
        <section class="pc-s1-guide-section pc-s1-guide-tip-grid">
          <div><h3>Use this in your own Canvas course</h3><ul><li>Name items for the task students will actually open or complete.</li><li>Use short text headers to show purpose and progression.</li><li>Keep the module sequence consistent enough that students can predict what comes next.</li></ul></div>
          <div><h3>Course-design connection</h3><p>This supports clear navigation, transparent activity purpose, consistent organization, and alignment between the learning path and what students are eventually asked to demonstrate.</p></div>
        </section>
        ${pcRenderS1WeeklyModulePattern()}
        ${pcRenderS1OSCQRStandards()}
        <section class="pc-s1-guide-section pc-s1-guide-ai-box"><h3>Try this with AI</h3><ul><li>Give AI a list of vague Canvas item names and ask for clearer student-facing alternatives, then verify each suggestion.</li><li>Ask AI to sort activities into Prepare, Practice, and Evidence, then check the classifications against your own intent.</li><li>Ask AI which titles still fail to reveal what students actually do.</li></ul></section>
        <footer class="pc-s1-guide-actions">
          ${fromMenu
            ? '<button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-print-guide">Print / Save PDF</button><button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-clear-guide">Clear My Guide</button><button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="home">Back to Main Menu</button>'
            : guide.added
            ? '<button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-view-guide-step1">View saved guide</button><button type="button" class="pc-shell-primary" data-pc-action="s1-learning-reflect-overview">Continue with Maya</button>'
            : '<button type="button" class="pc-shell-primary" data-pc-action="s1-learning-save-guide-step1-continue">Save to My Guide and Continue</button>'}
        </footer>
      </div>
    `
  });
  resetSectionScroll(area);
  return true;
}

async function pcGenerateS1GuideStep1() {
  const workspaceEpoch = pcS1WorkspaceEpoch;
  const input = pcBuildS1GuideStep1Input();
  pcS1LearningState.view = 'guide-step1-babbage';
  showBabbageConsultOverlay('Course Guide · Step 1', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is preparing your first guide section.',
    body: 'It is turning the titles and learning-path structure you just built into a concise note you can actually use later.'
  });
  let response = {};
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 'scenario1',
      system: `You are Babbage, PromptCraft's course-guide editor. Using only the supplied revised activity titles and Prepare / Practice / Evidence placements, evaluate navigation and organization only. Be specific about the learner's actual placements. For this example, reading, video, and vocabulary are best treated as Prepare, discussion as Practice, and the quiz as Evidence. If a placement differs, state what should be reconsidered rather than treating every arrangement as equally successful. Keep feedback concise. In the normal structured response, use feedback_summary for a 1-2 sentence overview, what_worked for up to three concrete strengths, recommended_repair for one practical thing to keep checking, and expected_impact for the likely student-facing effect. Do not evaluate the later instructor-intent alignment problem yet. Do not invent course facts.`,
      messages: [{ role: 'user', content: JSON.stringify(input, null, 2) }]
    }, 'main');
  } catch (error) {
    console.warn('[PromptCraft] S1 Guide Step 1 generation failed before fallback rendering:', error);
    response = { mock: true, mockReason: 'scenario-error' };
  }
  if (!pcS1AsyncWorkIsCurrent(workspaceEpoch)) return false;
  pcS1LearningState.guideBabbageResponse = response;
  const insight = pcGetS1GuideStep1Insight(response, input);
  pcS1LearningState.guide.step1.personalizedInsight = insight;
  pcS1LearningState.guide.step1.generatedAt = new Date().toISOString();
  pcSaveS1Guide();
  document.getElementById('vnOverlay')?.classList.remove('active');
  return pcRenderS1GuideStep1();
}

function pcSaveS1GuideStep1AndContinue() {
  pcS1LearningState.guide.step1.added = true;
  pcSaveS1Guide();
  if (!pcS1LearningState.guideXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.guideXPEarned = awardS1PracticeXP(2, 3);
  }
  const review = pcEvaluateS1Organization();
  const organizationScore = review.matchCount === review.total ? 2 : review.matchCount >= 3 ? 1 : 0;
  const diagnosisScore = pcS1LearningState.diagnosisChoice === 'evidence-gap' ? 2 : 1;
  pcRecordS1LearningProgress('s1_course_guide_step_added', Math.min(5, organizationScore + diagnosisScore + 1), 'Added learning-path guidance to My Course Guide', pcS1LearningState.guide?.step1?.personalizedInsight?.summary || 'Learning-path guidance saved.', { guideStepAdded: true });
  return pcPlayS1OverviewReflection();
}

function pcViewS1GuideStep1() {
  const rendered = pcRenderS1GuideStep1();
  requestAnimationFrame(() => document.querySelector('.pc-s1-guide-paper')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  return rendered;
}

function pcReviseBeforeS1Guide() {
  pcS1LearningState.guide.step1.added = false;
  pcSaveS1Guide();
  return pcRenderS1RenameComplete();
}

function pcCleanCourseGuideText(value) {
  return String(value || '')
    .replace(/([.!?])\1+/g, '$1')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function pcRenderS1GuideTip(tip, index) {
  const text = pcCleanCourseGuideText(tip);
  const quotedActivity = text.match(/^For\s+[“\"]([^”\"]+)[”\"]\s*,?\s*(.+)$/i);
  const heading = quotedActivity ? quotedActivity[1].replace(/[,;]\s*$/, '') : `Activity suggestion ${index + 1}`;
  const detail = quotedActivity ? quotedActivity[2] : text;
  const sentence = detail ? detail.charAt(0).toUpperCase() + detail.slice(1) : '';
  return `<article><span aria-hidden="true">${index + 1}</span><div><h4>${esc(heading)}</h4><p>${esc(sentence)}</p></div></article>`;
}

function pcRenderS1FullGuide({ fromMenu = false } = {}) {
  pcPrepareS1GuideSurface(fromMenu);
  pcS1LearningState.view = 'full-guide';
  const area = document.getElementById('chat');
  if (!area) return false;
  const savedReview = pcS1LearningState.guide?.myCourseReview;
  const course = savedReview?.added ? {
    moduleTitle: savedReview.moduleTitle || '',
    intendedLearning: savedReview.intendedLearning || '',
    activities: Array.isArray(savedReview.activities) ? savedReview.activities : []
  } : pcS1LearningState.myCourse;
  const feedback = savedReview?.feedback || pcGetS1MyCourseFeedback(pcS1LearningState.myCourseBabbageResponse, course);
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-full-guide', titleId: 'pcS1FullGuideTitle',
    background: sceneBg,
    bodyHTML: `
      <div class="pc-s1-learning-taskbar pc-s1-guide-taskbar"><div><img class="pc-s1-guide-brand-mark" src="${pcProjectUrl('assets/images/ui/ui_01_babbage_mark.svg')}" alt="" aria-hidden="true"><span>My PromptCraft Course Guide</span><h1 id="pcS1FullGuideTitle">${esc(course.moduleTitle || 'Saved course guidance')}</h1><p>Your saved course feedback and module notes.</p></div><div class="pc-s1-guide-heading-actions"><span class="pc-s1-learning-task-status">Saved to My Guide</span><button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-clear-guide">Clear My Guide</button><button type="button" class="pc-shell-secondary" data-pc-action="open-main-menu" data-pc-panel="home">Back to Main Menu</button></div></div>
      <nav class="pc-s1-full-guide-nav" aria-label="Course guide sections">
        <button type="button" data-pc-action="s1-learning-guide-section" data-pc-guide-section="pcS1GuideFeedback">Saved feedback</button>
        <button type="button" data-pc-action="s1-learning-guide-section" data-pc-guide-section="pcS1GuideModule">Module view</button>
        <button type="button" class="pc-s1-guide-print" data-pc-action="s1-learning-print-guide">Print / Save PDF</button>
      </nav>
      <div class="pc-s1-guide-paper pc-s1-full-guide-paper">
        <section class="pc-s1-guide-section pc-s1-full-guide-personal" id="pcS1GuideFeedback"><span class="pc-s1-result-eyebrow">Saved course feedback</span><h2>${esc(course.moduleTitle || 'Your module')}</h2><p>${esc(pcCleanCourseGuideText(feedback.clear))}</p><p><strong>Intended learning:</strong> ${esc(pcCleanCourseGuideText(course.intendedLearning))}</p><section class="pc-s1-my-course-findings"><h3>What is clear</h3><ul>${(feedback.worked || []).map(item => `<li>${esc(pcCleanCourseGuideText(item))}</li>`).join('')}</ul></section><section class="pc-s1-my-course-findings"><h3>What needs inspection</h3><p>${esc(pcCleanCourseGuideText(feedback.unknown))}</p></section><section class="pc-s1-guide-suggestions" aria-labelledby="pcS1GuideSuggestionsHeading"><h3 id="pcS1GuideSuggestionsHeading">Ways to improve the activities you entered</h3><div class="pc-s1-full-guide-tips">${(feedback.improvementIdeas || []).map(pcRenderS1GuideTip).join('')}</div></section><div class="pc-s1-my-course-next-check"><h3>Next check</h3><p>${esc(pcCleanCourseGuideText(feedback.next))}</p></div></section>
        ${savedReview?.transferReflection ? `<section class="pc-s1-guide-section pc-s1-saved-next-step"><span class="pc-s1-result-eyebrow">Your next step</span><h3>Your plan for this module</h3>${savedReview.transferPlan ? `<dl><dt>Activity to work on</dt><dd>${esc(savedReview.transferPlan.activity)}</dd><dt>Change or check</dt><dd>${esc(savedReview.transferPlan.change)}</dd><dt>What students should show</dt><dd>${esc(savedReview.transferPlan.evidence)}</dd></dl>` : `<p>${esc(savedReview.transferReflection)}</p>`}</section>` : ''}
        <section class="pc-s1-guide-section" id="pcS1GuideModule"><span class="pc-s1-result-eyebrow">Saved module view</span><h3>${esc(course.moduleTitle || 'Your module')}</h3><p>This view uses the activity titles you provided to suggest each item’s likely role. Confirm every placement against the actual instructions and student work.</p><div class="pc-s1-full-guide-module" aria-label="Visual summary of the saved module">${pcRenderS1MyCourseMiniModule(course)}</div></section>
        <footer class="pc-s1-guide-actions"><button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-print-guide">Print / Save PDF</button>${fromMenu ? '<button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="home">Back to Main Menu</button>' : '<button type="button" class="pc-shell-primary" data-pc-action="s1-learning-close-with-pixel">Continue with Professor Pixel</button>'}</footer>
      </div>
    `
  });
  resetSectionScroll(area);
  return true;
}

function pcRenderS1MyCourseMiniModule(course) {
  const groups = { prepare: [], practice: [], evidence: [], unclear: [] };
  const guideLabels = {
    prepare: 'Resources and preparation',
    practice: 'Practice and feedback',
    evidence: 'Evidence of learning'
  };
  course.activities.filter(Boolean).forEach(activity => {
    const text = String(activity);
    const lower = text.toLowerCase();
    const purpose = /submit|quiz|test|project|presentation|recorded|final/.test(lower)
      ? 'evidence'
      : /practice|discuss|discussion|draft|peer|rehears/.test(lower)
        ? 'practice'
        : /read|watch|video|lecture|demonstration|example|lesson/.test(lower)
          ? 'prepare'
          : 'unclear';
    groups[purpose].push(text);
  });
  const learningGroups = ['prepare', 'practice', 'evidence'].map(purpose => `
    <div class="pc-s1-guide-module-group">
      <strong>${esc(guideLabels[purpose])}</strong>
      ${groups[purpose].length ? groups[purpose].map(activity => `<span>${esc(activity)}</span>`).join('') : '<span class="is-empty">No activity identified yet</span>'}
    </div>`).join('');
  return learningGroups + (groups.unclear.length
    ? `<div class="pc-s1-guide-module-group pc-s1-guide-module-unclear"><strong>Purpose to confirm</strong>${groups.unclear.map(activity => `<span>${esc(activity)}</span>`).join('')}</div>`
    : '');
}

function pcScrollS1GuideSection(sectionId) {
  const section = document.getElementById(String(sectionId || ''));
  const scroller = document.querySelector('.pc-s1-full-guide');
  if (!section || !scroller) return false;
  const targetTop = Math.max(0, section.offsetTop - 176);
  scroller.scrollTo({ top: targetTop, behavior: 'smooth' });
  section.setAttribute('tabindex', '-1');
  window.setTimeout(() => section.focus({ preventScroll: true }), 280);
  return true;
}

function pcPrintS1CourseGuide() {
  window.print();
  return false;
}

function pcConfirmClearS1Guide() {
  const confirmed = window.confirm('Clear My Course Guide and the course information saved on this device? This cannot be undone.');
  if (!confirmed) return false;
  const cleared = pcClearS1LocalWorkspace();
  if (!cleared) {
    window.alert('PromptCraft could not clear the saved guide in this browser. Check whether site storage is blocked, then try again.');
    return false;
  }
  return pcRenderCourseGuideOverview();
}

function pcHasSavedS1Guide() {
  const guide = pcLoadS1Guide();
  return Boolean(guide?.step1?.added || guide?.myCourseReview?.added);
}

function pcRenderCourseGuideOverview() {
  pcPrepareS1GuideSurface(true);
  pcS1LearningState.view = 'course-guide-overview';
  if (typeof closeMainMenu === 'function') closeMainMenu({ force: true });
  const area = document.getElementById('chat');
  if (!area) return false;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-full-guide pc-course-guide-overview', titleId: 'pcCourseGuideOverviewTitle',
    bodyHTML: `
      <header class="pc-s1-learning-taskbar pc-s1-guide-taskbar">
        <div>
          <img class="pc-s1-guide-brand-mark" src="${pcProjectUrl('assets/images/ui/ui_01_babbage_mark.svg')}" alt="" aria-hidden="true">
          <span>My PromptCraft Course Guide</span>
          <h1 id="pcCourseGuideOverviewTitle">Keep the ideas you want to use</h1>
          <p>A personal reference that grows from the work you choose to save.</p>
        </div>
        <div class="pc-s1-guide-heading-actions">
          <button type="button" class="pc-shell-secondary" data-pc-action="open-main-menu" data-pc-panel="home">Back to Main Menu</button>
        </div>
      </header>
      <div class="pc-s1-guide-paper pc-course-guide-overview-paper">
        <div class="pc-course-guide-overview-copy">
          <p class="pc-s1-result-eyebrow">Your reusable reference</p>
          <h2>Bring useful course-design ideas together in one place.</h2>
          <p>As you work through PromptCraft, you can save feedback, decisions, checklists, and examples that you want to revisit while building or revising a course.</p>
        </div>
        <div class="pc-course-guide-overview-grid">
          <article>
            <span aria-hidden="true">1</span>
            <div><h3>Choose what belongs here</h3><p>Nothing is added automatically. Save only the material that is useful to you.</p></div>
          </article>
          <article>
            <span aria-hidden="true">2</span>
            <div><h3>Return when you need it</h3><p>Your saved ideas stay together so you do not have to reopen a completed scenario to find them.</p></div>
          </article>
        </div>
        <aside class="pc-course-guide-empty-state" aria-label="Course Guide status">
          <h3>Nothing has been saved yet</h3>
          <p>Complete scenarios in any order. When you choose <strong>Add to My Course Guide</strong>, the saved material will appear here.</p>
        </aside>
        <footer class="pc-s1-guide-actions pc-course-guide-overview-actions">
          <button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="scenarios">Choose a Scenario</button>
          <button type="button" class="pc-shell-secondary" data-pc-action="open-main-menu" data-pc-panel="home">Back to Main Menu</button>
        </footer>
      </div>
    `
  });
  resetSectionScroll(area);
  return true;
}

function pcOpenSavedS1Guide() {
  pcS1LearningState.guide = pcLoadS1Guide();
  if (!pcHasSavedS1Guide()) return pcRenderCourseGuideOverview();
  pcPrepareS1GuideSurface(true);
  if (typeof closeMainMenu === 'function') closeMainMenu({ force: true });
  return pcS1LearningState.guide?.myCourseReview?.added
    ? pcRenderS1FullGuide({ fromMenu: true })
    : pcRenderS1GuideStep1({ fromMenu: true });
}
