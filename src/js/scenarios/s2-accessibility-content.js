/* s2-accessibility-content.js — S2 accessibility production owner. */

const PC_S2_ACCESS_STORAGE = 'promptcraft_s2_heading_repair_v1';
const PC_S2_HEADING_REQUEST = 'Make these section titles real HTML headings beneath the existing Canvas page title. Keep every word, link, and requirement unchanged. Keep the main sections in order, with Before you submit as a subsection of Your task. Return repaired HTML and a short explanation. I do not know HTML, so explain the change in plain language.';
const PC_S2_PAGE_HTML = `<p style="font-size:24px"><strong>What you will learn</strong></p>
<p>Interpret a community survey and explain a conclusion supported by evidence.</p>
<p style="font-size:24px"><strong>Read the evidence</strong></p>
<p>A survey asked 80 residents how they travel to campus. Forty chose driving, 24 chose the bus, and 16 chose walking.</p>
<p>Read the <a href="https://www.gfcmsu.edu/">Great Falls College website</a> for college information.</p>
<p style="font-size:24px"><strong>Your task</strong></p>
<p>Write one paragraph explaining which travel option was most common. Support your conclusion with two numbers from the survey.</p>
<p style="font-size:20px"><strong>Before you submit</strong></p>
<p>Check that your paragraph includes a conclusion and two pieces of evidence. Submit your paragraph in Canvas.</p>`;
const PC_S2_EXPECTED_HEADINGS = Object.freeze([
  { level: 2, text: 'What you will learn' }, { level: 2, text: 'Read the evidence' },
  { level: 2, text: 'Your task' }, { level: 3, text: 'Before you submit' }
]);
function pcS2HeadingExample() {
  let html = PC_S2_PAGE_HTML;
  PC_S2_EXPECTED_HEADINGS.forEach(item => {
    html = html.replace(new RegExp(`<p style="font-size:[0-9]+px"><strong>${item.text}</strong></p>`), `<h${item.level}>${item.text}</h${item.level}>`);
  });
  return html;
}

const PC_S2_DIAGNOSIS_CHOICES = Object.freeze([
  Object.freeze({ id: 'headings', text: 'Give the section titles real heading structure.' }),
  Object.freeze({ id: 'shorten', text: 'Remove the evidence to make the page shorter.' }),
  Object.freeze({ id: 'bold', text: 'Make every paragraph bold.' })
]);
const PC_S2_REPAIR_CHECKS = Object.freeze([
  Object.freeze({ id: 'words', label: 'The wording and requirements are unchanged.' }),
  Object.freeze({ id: 'outline', label: 'The sections and subsection are in the right order.' }),
  Object.freeze({ id: 'links', label: 'The link still has the same label and destination.' })
]);
