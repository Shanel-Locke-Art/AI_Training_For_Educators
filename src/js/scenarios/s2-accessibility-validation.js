/* s2-accessibility-validation.js — S2 accessibility production owner. */

function pcValidateS2HeadingRepair(html) {
  if (typeof html !== 'string' || html.length > 20000) return { ok: false, message: 'The repair is missing or too long. Ask Babbage to repair only this page.' };
  const source = new DOMParser().parseFromString(PC_S2_PAGE_HTML, 'text/html');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const allowed = new Set(['P', 'H2', 'H3', 'STRONG', 'EM', 'A', 'UL', 'OL', 'LI', 'BR']);
  const nodes = [...doc.body.querySelectorAll('*')];
  if (doc.head.children.length || nodes.some(node => !allowed.has(node.tagName) || [...node.attributes].some(attr => !(node.tagName === 'A' && attr.name === 'href')))) {
    return { ok: false, message: 'This repair includes extra formatting or unsupported code. Ask for heading tags and ordinary paragraphs only, keeping the original links.' };
  }
  const text = root => [...root.children].map(node => node.textContent.replace(/\s+/g, ' ').trim()).join('\n');
  if ([...doc.body.childNodes].some(node => node.nodeType === 3 && node.textContent.trim()) || text(source.body) !== text(doc.body)) return { ok: false, message: 'Some information or wording changed. Ask Babbage to restore every word and requirement from the original page.' };
  const links = root => [...root.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')]);
  if (JSON.stringify(links(source.body)) !== JSON.stringify(links(doc.body))) return { ok: false, message: 'A link changed. Ask Babbage to keep each original link label and destination.' };
  const headings = [...doc.body.querySelectorAll('h2,h3')].map(h => ({ level: Number(h.tagName.slice(1)), text: h.textContent.trim() }));
  if (JSON.stringify(headings) !== JSON.stringify(PC_S2_EXPECTED_HEADINGS)) return { ok: false, message: 'The section structure still needs a repair. Ask for three main headings and Before you submit as a subsection under Your task.' };
  const clean = document.createElement('div');
  function copy(node, parent) {
    if (node.nodeType === 3) { parent.appendChild(document.createTextNode(node.textContent)); return; }
    if (node.nodeType !== 1) return;
    const el = document.createElement(node.tagName.toLowerCase());
    if (node.tagName === 'A') el.setAttribute('href', node.getAttribute('href'));
    [...node.childNodes].forEach(child => copy(child, el)); parent.appendChild(el);
  }
  [...doc.body.childNodes].forEach(node => copy(node, clean));
  return { ok: true, html: clean.innerHTML, headings };
}
