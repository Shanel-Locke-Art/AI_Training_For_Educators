/* Focused Canvas editor practice: heading styles and the footer HTML toggle.
   Visual rendering uses canonical lesson nodes; pasted code never goes directly into DOM. */
function pcS2EditorVisualSource() {
  const html=pcS2AccessState.pasted||PC_S2_PAGE_HTML;
  const complete=pcValidateS2HeadingRepair(html);if(complete.ok)return complete.html;
  // Allow partial heading-only edits made with this practice dropdown.
  const doc=new DOMParser().parseFromString(html,'text/html'),original=new DOMParser().parseFromString(PC_S2_PAGE_HTML,'text/html');
  if(doc.body.children.length!==original.body.children.length)return PC_S2_PAGE_HTML;
  let result=PC_S2_PAGE_HTML;
  const nodes=Array.from(doc.body.children);
  for(const [index,node] of nodes.entries()){
    if(node.textContent!==original.body.children[index].textContent)return PC_S2_PAGE_HTML;
    const heading=PC_S2_EXPECTED_HEADINGS.find(h=>h.text===node.textContent.trim());
    if(heading&&['H2','H3','H4'].includes(node.tagName)){
      const old=original.body.children[index].outerHTML;
      result=result.replace(old,`<${node.tagName.toLowerCase()}>${esc(heading.text)}</${node.tagName.toLowerCase()}>`);
    }
  }
  return result; // Always rebuilt from trusted original, never returned raw pasted HTML.
}
function pcRenderS2CanvasEditor() {
  const state=pcS2AccessState,htmlMode=state.editorMode==='html';
  const doc=new DOMParser().parseFromString(pcS2EditorVisualSource(),'text/html');
  const selected=PC_S2_EXPECTED_HEADINGS.find(h=>h.text===state.editorHeading);
  const selectedNode=selected&&Array.from(doc.body.children).find(node=>node.textContent.trim()===selected.text);
  const style=selectedNode&&/^H[234]$/.test(selectedNode.tagName)?selectedNode.tagName.toLowerCase():'p';
  const visual=Array.from(doc.body.children).map(node=>{
    const heading=PC_S2_EXPECTED_HEADINGS.find(h=>h.text===node.textContent.trim());
    if(!heading)return node.outerHTML;
    const button=`<button type="button" class="pc-s2-rce-title${state.editorHeading===heading.text?' is-selected':''}" data-pc-action="s2-editor-select-heading" data-pc-heading="${esc(heading.text)}">${esc(heading.text)}</button>`;
    return /^H[234]$/.test(node.tagName)?`<${node.tagName.toLowerCase()}>${button}</${node.tagName.toLowerCase()}>`:`<p style="font-size:${heading.level===3?20:24}px"><strong>${button}</strong></p>`;
  }).join('');
  const words=new DOMParser().parseFromString(PC_S2_PAGE_HTML,'text/html').body.textContent.trim().split(/\s+/).length;
  return `<section class="pc-s1-rename-editor pc-s2-access-editor pc-s2-rce" aria-label="Canvas editor practice">
    <div class="pc-s2-rce-menu"><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Tools</span><span>Table</span></div>
    <div class="pc-s2-rce-toolbar"${htmlMode?' hidden':''}><span>12pt</span><label class="pc-s2-rce-style-label">Text style<select id="pcS2HeadingStyle" data-pc-change-action="s2-editor-heading-style" aria-label="Paragraph or heading style">${[['p','Paragraph'],['h2','Heading 2'],['h3','Heading 3'],['h4','Heading 4']].map(([value,label])=>`<option value="${value}"${style===value?' selected':''}>${label}</option>`).join('')}</select></label><span class="pc-s2-rce-format" aria-hidden="true"><b>B</b><i>I</i><u>U</u></span></div>
    <p class="pc-s2-rce-tip"${htmlMode?' hidden':''}>Select a section title to explore its heading style. To paste Babbage’s repair, use the <strong>&lt;/&gt;</strong> button below the editor.</p>
    <div class="pc-s2-rce-visual pc-s1-canvas-richtext"${htmlMode?' hidden':''}>${visual}</div>
    <div class="pc-s2-rce-html"${htmlMode?'':' hidden'}><label for="pcS2PastedHtml">Page HTML</label><textarea id="pcS2PastedHtml" class="pc-s2-access-code" rows="12" data-pc-input-action="s2-access-paste" spellcheck="false">${esc(state.pasted||PC_S2_PAGE_HTML)}</textarea></div>
    <div class="pc-s2-rce-footer"><span>${words} words</span><button type="button" class="pc-s2-rce-html-toggle" data-pc-action="s2-editor-toggle-html" aria-label="${htmlMode?'Return to visual editor':'Open HTML editor'}" aria-pressed="${htmlMode}" aria-controls="pcS2PastedHtml">&lt;/&gt;</button></div>
    <div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-insert','Insert repaired HTML',false,true)}${pcS2AccessButton('s2-access-preview-repair','Continue to preview',!state.pasted.trim())}${pcS2AccessButton('s2-access-review-draft','Review repair',false,true)}</div>
    <p class="pc-s2-rce-tip">Practice editor: the heading menu and HTML button work here. The other toolbar labels show their location in Canvas.</p>
  </section>`;
}
function pcSelectS2EditorHeading(text) {
  if(!PC_S2_EXPECTED_HEADINGS.some(h=>h.text===text))return;
  pcS2AccessState.editorHeading=text;pcRenderS2AccessScreen({focusTitle:false});
  document.getElementById('pcS2HeadingStyle')?.focus();
}
function pcChangeS2EditorHeadingStyle(style) {
  if(!['p','h2','h3','h4'].includes(style))return;
  const state=pcS2AccessState,heading=PC_S2_EXPECTED_HEADINGS.find(h=>h.text===state.editorHeading);
  if(!heading)return pcS2AccessNotice('Select a section title in the page before choosing its style.');
  const doc=new DOMParser().parseFromString(pcS2EditorVisualSource(),'text/html');
  const node=Array.from(doc.body.children).find(n=>n.textContent.trim()===heading.text);
  if(!node)return;
  const replacement=doc.createElement(style);
  if(style==='p'){replacement.style.fontSize=`${heading.level===3?20:24}px`;const bold=doc.createElement('strong');bold.textContent=heading.text;replacement.appendChild(bold);}
  else replacement.textContent=heading.text;
  node.replaceWith(replacement);state.pasted=doc.body.innerHTML;state.checked.clear();pcRenderS2AccessScreen({focusTitle:false});
  document.getElementById('pcS2HeadingStyle')?.focus();
}
function pcToggleS2EditorHTML() {
  const state=pcS2AccessState;state.editorMode=state.editorMode==='html'?'visual':'html';
  if(!state.pasted)state.pasted=PC_S2_PAGE_HTML;
  pcRenderS2AccessScreen({focusTitle:false});
  pcFocusWithoutScroll(state.editorMode==='html'?document.getElementById('pcS2PastedHtml'):document.querySelector('[data-pc-action="s2-editor-toggle-html"]'));
}
