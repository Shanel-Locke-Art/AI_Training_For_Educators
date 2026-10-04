/* s2-accessibility-ai.js — S2 accessibility production owner. */

async function pcS2AccessGenerate() {
  const state = pcS2AccessState;
  if (state.busy || !state.request.trim() || scenarioIndex !== SCENARIO_INDEX.ACCESSIBILITY) return;
  const epoch = pcS2AccessEpoch, run = pcCaptureScenarioRun(SCENARIO_INDEX.ACCESSIBILITY);
  state.busy = true; state.notice = ''; pcRenderS2AccessScreen();
  showBabbageConsultOverlay('Heading repair', { speakerName:'Professor Pixel', heading:'Babbage is repairing the page structure.', body:'It receives the example HTML and your request. The information and links must stay unchanged.' });
  let response;
  try {
    response = await requestBabbageAnalysis({ analysis_type:'s2_accessibility_heading_repair', max_output_tokens:2200,
      system:'Repair only the headings in the supplied Canvas HTML. Preserve every visible word in the original order and every original link label and href. The existing Canvas page title is outside the supplied fragment. Convert What you will learn, Read the evidence, and Your task to h2; convert Before you submit to h3. Use only p,h2,h3,strong,em,a,ul,ol,li,br tags, with no attributes except original href on a. No styles, scripts, wrappers, markdown fences, or added content. Explain the change plainly. Never claim full WCAG conformance.',
      messages:[{role:'user',content:`Request: ${state.request}\n\nOriginal HTML:\n${PC_S2_PAGE_HTML}`}]
    }, 's2-accessibility-heading');
  } catch (_error) { response = {mock:true}; }
  if (epoch !== pcS2AccessEpoch || !pcIsScenarioRunCurrent(run)) return;
  state.busy = false;
  const isExample = response?.mock || response?.provider === 'local-fallback';
  const html = isExample ? pcS2HeadingExample() : response?.analysis?.repaired_html;
  const valid = pcValidateS2HeadingRepair(html);
  if (!valid.ok) {
    return showBabbageTerminalReport({reportHTML:`<article class="pc-s2-access-report"><h2>A correction is needed</h2><p>${esc(valid.message)}</p></article>`, terminalStateText:'REPAIR NEEDS A CHECK', speakerName:'Professor Pixel', readLabel:'', printLabel:'', continueLabel:'Revise my request', closeHandoff:'app', onClose:()=>{if(epoch === pcS2AccessEpoch && pcIsScenarioRunCurrent(run)){state.notice=valid.message;pcRenderS2AccessScreen();}}});
  }
  const explanation = isExample ? 'Live Babbage was unavailable or example mode was selected. This built-in repair demonstrates the same steps: real headings, original wording, original link.' : response.analysis.explanation;
  showBabbageTerminalReport({reportHTML:`<article class="pc-s2-access-report"><span>${isExample ? 'BUILT-IN EXAMPLE REPAIR' : 'LIVE BABBAGE REPAIR'}</span><h2>Real headings. Same information.</h2><p>${esc(explanation)}</p><h3>What to check next</h3><p>Compare the information and heading outline before pasting the repaired HTML into the practice editor.</p></article>`, terminalStateText:'HEADING REPAIR READY', engineLabel:isExample?'BABBAGE EXAMPLE':'BABBAGE ENGINE', speakerName:'Professor Pixel', readLabel:'', printLabel:'', continueLabel:'Review repaired HTML', closeHandoff:'app', onClose:()=>{if(epoch===pcS2AccessEpoch && pcIsScenarioRunCurrent(run))pcS2AccessUseDraft(valid.html,isExample?'example':'live',explanation);}});
}
