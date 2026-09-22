const fs = require('fs');
const assert = require('assert');

const s1 = fs.readFileSync('src/js/scenarios/s1-start-with-learning.js', 'utf8');
const runtime = fs.readFileSync('src/js/app/scenario-runtime.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const receiver = fs.readFileSync('apps-script/PromptCraft_Receiver_V84_Readable_Raw_Separation.js', 'utf8');

assert(s1.includes('Step 1 guide plan'), 'Babbage organization review should preview the Step 1 guide plan.');
assert(s1.includes('Guide section will include'), 'Guide-plan overview should list what will be added.');
assert(s1.includes('pcRenderS1GuideInsight'), 'Guide should render structured Babbage insight.');
assert(!s1.includes('pcGetS1GuideStep1Note('), 'Old raw paragraph guide-note helper should be removed.');
assert(s1.includes('return pcPlayS1OverviewReflection();'), 'Saving Step 1 should advance into the next S1 phase.');
assert(html.includes('id="progressChallengeTop"'), 'Header should expose anonymous challenge top score.');
assert(html.includes('id="progressChallengeDetail"'), 'Expanded progress should expose anonymous challenge top score.');
assert(runtime.includes("type: 'challenge_score'"), 'Progress system should send anonymous challenge score payloads.');
assert(runtime.includes('pcChallengeReceiverSupported'), 'Challenge posting must be gated on receiver support.');
assert(receiver.includes("action === 'getchallengetop'"), 'V84 receiver should expose challenge top score.');
assert(receiver.includes("type === 'challenge_score'"), 'V84 receiver should store challenge scores outside research rows.');
assert(receiver.includes('resetChallengeScoresNow'), 'V84 receiver should provide manual challenge reset.');
console.log('P556 guide formatting, progression, and anonymous challenge-score contract passed.');
