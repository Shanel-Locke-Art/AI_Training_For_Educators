#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/js/scenarios/s1-course-design.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/js/manifest.json'), 'utf8'));
const dialogue = fs.readFileSync(path.join(root, 'src/js/content/dialogue-data.js'), 'utf8');
const cssManifest = fs.readFileSync(path.join(root, 'src/css/manifest.css'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'runtime/js/promptcraft.bundle.js'), 'utf8');

const context = vm.createContext({
  console,
  scenarioData: [{}],
  SCENARIO_INDEX: { CONTENT_AVALANCHE: 0 },
  pcRegisterUIActions() {},
  pcExposeGlobals() {}
});
vm.runInContext(source, context, { filename: 's1-course-design.js' });

const scores = JSON.parse(vm.runInContext(`JSON.stringify({
  strongPath: scoreS1CoursePath({
    entry: 'module_overview', labels: 'action_labels',
    sequence: 'learn_practice_submit', completion: 'submit_and_continue'
  }),
  weakPath: scoreS1CoursePath({
    entry: 'files_index', labels: 'original_filenames',
    sequence: 'import_order', completion: 'last_file'
  }),
  strongRepair: scoreS1CourseRepair({
    purpose: 'Compare two models and explain which one fits the local decision.',
    sequence: 'Read first, then watch, practice, and submit in about 90 minutes.',
    submission: 'Submit the comparison by the due date using evidence and the success criteria.',
    next: 'Finish when Canvas confirms submission, then continue or ask for help.'
  }),
  overview: buildS1CourseRepairedOverview({
    purpose: 'Compare the models.', sequence: 'Read, practice, and submit.',
    submission: 'Submit the evidence-based comparison.', next: 'Continue to Week 5.'
  })
})`, context));

assert.equal(scores.strongPath.total, 4);
assert.equal(scores.weakPath.total, 0);
assert.equal(scores.strongRepair.total, 4);
assert.match(scores.overview, /Purpose and outcome:/);
assert.match(scores.overview, /Submit and succeed:/);

assert.match(source, /The Content Avalanche/);
assert.match(source, /analysis_type: 'course_design_draft'/);
assert.match(source, /buried_submission/);
assert.match(source, /buildDragSlotWorkbenchHTML/);
assert.match(source, /buildGuidedRepairWorkspaceHTML/);
assert.match(source, /pcRenderSharedScenarioResult/);
assert.ok(manifest.bundle.includes('scenarios/s1-course-design.js'));
assert.ok(manifest.bundle.indexOf('scenarios/s1-course-design.js') < manifest.bundle.indexOf('app/scenario-runtime.js'));
assert.match(dialogue, /scenarioStart_content-avalanche/);
assert.match(dialogue, /j-s1-ca-05/);
assert.match(cssManifest, /scenarios\/s1-course-design\.css/);
assert.match(index, /S1: The Content Avalanche/);
assert.match(index, /S2: Access Is Part of the Design/);
assert.match(index, /S3: The Confident Student Problem/);
assert.match(index, /S4: The 96% Problem/);
assert.match(index, /patch=509/);
assert.match(runtime, /function renderS1CourseDiagnosisActivity/);
assert.match(runtime, /CONTENT_AVALANCHE: 0/);

console.log('PromptCraft S1 Content Avalanche structure, scoring, and runtime integration passed.');
