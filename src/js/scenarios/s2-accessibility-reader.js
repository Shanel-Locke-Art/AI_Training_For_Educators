/* Optional heading-navigation demonstration. Browser speech is an illustration,
   not a screen reader or accessibility checker. Nothing plays automatically. */
let pcS2ReaderPlayback = null;
function pcRenderS2HeadingLesson(compact = false) {
  if (compact) return `<section class="pc-s1-diagnosis-purpose pc-s2-heading-lesson" aria-labelledby="pcS2HeadingLessonTitle"><h3 id="pcS2HeadingLessonTitle">Headings help people find their way</h3><p>A heading names a section and marks it as part of the page’s structure. Bold, enlarged text can look like a heading without working as one.</p><p>A screen reader turns text into speech or braille. It can read the page in order or jump between real headings. Lena’s section titles are readable, but missing from that heading navigation.</p></section>`;
  return `<section class="pc-s1-diagnosis-purpose pc-s2-heading-lesson" aria-labelledby="pcS2HeadingLessonTitle">
    <h3 id="pcS2HeadingLessonTitle">What is a heading?</h3>
    <p>A heading is a title that names a section. Choose a Heading style in your course editor so the title becomes part of the page’s structure. Making text bold or larger only changes its appearance.</p>
    <p>A screen reader turns page content into speech or braille. It can read the text in order, or let someone jump from heading to heading to find a section. A bold paragraph is still readable, but it is missing from that heading navigation.</p>
    <p>The page title is Heading 1. Main sections use Heading 2, and a section within one of those uses Heading 3. AI can add this structure while keeping the information the same.</p>
  </section>`;
}
/* Canvas-inspired reading view. It reads the lesson, not the surrounding game UI. */
let pcS2ReaderView = null;
const pcS2ReaderPreferences = { rate: 1.25, size: 24, spacing: true, focus: true };
function pcRenderS2ReaderDemo() {
  return `<section class="pc-s2-reader-demo" aria-label="Reading support"><button type="button" class="pc-shell-secondary" data-pc-action="s2-reader-toggle">Open Immersive Reader</button><p class="pc-s2-reader-note">Listen and follow the words, or compare heading navigation before and after repair.</p></section>`;
}
function pcGetS2ReaderBlocks(mode = 'read') {
  const title = 'Interpret a community survey';
  if (mode === 'before') return [{level:1,text:`Heading level 1. ${title}.`},{level:0,text:'No more headings. The section titles are paragraphs, so heading navigation skips them.'}];
  if (mode === 'after') return [{level:1,text:`Heading level 1. ${title}.`}, ...PC_S2_EXPECTED_HEADINGS.map(h=>({level:h.level,text:`Heading level ${h.level}. ${h.text}.`}))];
  // Repaired text is accepted only after the existing strict validator succeeds.
  const state = pcS2AccessState;
  const candidate = ['verify','complete'].includes(state.view) ? (state.pasted || state.applied) : state.view === 'review' ? state.draft : '';
  const checked = pcValidateS2HeadingRepair(candidate);
  const doc = new DOMParser().parseFromString(checked.ok ? checked.html : PC_S2_PAGE_HTML, 'text/html');
  return [{level:1,text:title}, ...Array.from(doc.body.children).map(node=>({level:/^H[23]$/.test(node.tagName)?Number(node.tagName[1]):0,text:node.textContent.trim()}))];
}
function pcGetS2ReaderTranscript(mode) {
  return pcGetS2ReaderBlocks(mode).map(b=>b.text).join('\n');
}
function pcRenderS2ReaderWords(blocks) {
  let offset = 0;
  return blocks.map((block,index)=>{
    const words = block.text.split(/(\s+)/).map(part=>{
      const start=offset;offset+=part.length;
      return /^\s+$/.test(part)?esc(part):`<span data-pc-reader-start="${start}" data-pc-reader-end="${offset}">${esc(part)}</span>`;
    }).join('');
    offset+=1; // Same newline used in the speech text.
    const tag=block.level?`h${block.level}`:'p';
    return `<${tag} data-pc-reader-block="${index}">${words}</${tag}>`;
  }).join('');
}
function pcToggleS2ReaderDemo(button) { pcOpenS2ReaderView(button); }
function pcOpenS2ReaderView(opener = document.activeElement) {
  if (scenarioIndex !== SCENARIO_INDEX.ACCESSIBILITY) return;
  pcCloseS2ReaderView(false);
  const dialog = document.createElement('section');
  dialog.id='pcS2ReaderPanel';dialog.className='pc-s2-immersive';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','pcS2ReaderHeading');
  dialog.innerHTML=`<header class="pc-s2-immersive-top"><button type="button" data-pc-action="s2-reader-close"><span aria-hidden="true">←</span> Back to page</button><h2 id="pcS2ReaderHeading">Interpret a community survey</h2><span class="pc-s2-immersive-label">Reading view</span></header>
    <div class="pc-s2-immersive-options"><label>Reading speed<select id="pcS2ReaderRate" data-pc-change-action="s2-reader-rate">${[.75,1,1.25,1.5,2,2.5].map(rate=>`<option value="${rate}"${rate===pcS2ReaderPreferences.rate?' selected':''}>${rate}×</option>`).join('')}</select></label>
    <label>Text size<select data-pc-change-action="s2-reader-size">${[20,24,30,36].map(size=>`<option value="${size}"${size===pcS2ReaderPreferences.size?' selected':''}>${size}px</option>`).join('')}</select></label>
    <label><input type="checkbox" data-pc-change-action="s2-reader-spacing"${pcS2ReaderPreferences.spacing?' checked':''}> More spacing</label>
    <label><input type="checkbox" data-pc-change-action="s2-reader-focus"${pcS2ReaderPreferences.focus?' checked':''}> Focus on current passage</label></div>
    <div class="pc-s2-immersive-scroll" id="pcS2ReaderScroll" tabindex="0" aria-label="Reading text"><article id="pcS2ReaderTranscript"></article></div>
    <footer class="pc-s2-immersive-bottom"><div class="pc-s2-immersive-playback"><button type="button" class="pc-s2-immersive-play" data-pc-action="s2-reader-play" aria-label="Play reading"><span aria-hidden="true">▶</span> Play</button><button type="button" data-pc-action="s2-reader-stop" disabled>Stop</button>
      <button type="button" data-pc-action="s2-reader-read">Read page</button><button type="button" data-pc-action="s2-reader-before">Headings: before</button><button type="button" data-pc-action="s2-reader-after">Headings: after</button></div>
      <p id="pcS2ReaderStatus" role="status">Press Play to listen. You can also read the text here.</p><p class="pc-s2-immersive-note">Practice view modeled on Canvas Immersive Reader. Use Headings to try a separate screen reader navigation example.</p></footer>`;
  const inertStates=[];
  for(const child of document.body.children){
    if(!['SCRIPT','STYLE','LINK'].includes(child.tagName)&&!child.hidden&&getComputedStyle(child).display!=='none'&&child.id!=='mainMenuOverlay') { inertStates.push([child,child.inert]);child.inert=true; }
  }
  const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  document.body.appendChild(dialog);
  const observer=new MutationObserver(()=>{
    if(!opener?.isConnected||scenarioIndex!==SCENARIO_INDEX.ACCESSIBILITY||document.getElementById('mainMenuOverlay')?.classList.contains('visible')) pcCloseS2ReaderView(false);
  });
  observer.observe(document.getElementById('chat'),{childList:true,subtree:true});
  const menu=document.getElementById('mainMenuOverlay');if(menu)observer.observe(menu,{attributes:true,attributeFilter:['class','hidden']});
  const keydown=event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();pcCloseS2ReaderView();return;}
    if(event.key!=='Tab')return;
    const controls=Array.from(dialog.querySelectorAll('button:not([disabled]),select,input,[tabindex="0"]')).filter(el=>el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  dialog.addEventListener('keydown',keydown);
  pcS2ReaderView={dialog,opener,inertStates,oldOverflow,observer,mode:'read',text:'',cursor:0};
  pcSetS2ReaderMode('read');pcApplyS2ReaderPreferences();dialog.querySelector('button').focus();
}
function pcCloseS2ReaderView(restoreFocus = true) {
  pcStopS2ReaderDemo();
  const view=pcS2ReaderView;if(!view)return;
  pcS2ReaderView=null;view.observer.disconnect();view.dialog.remove();
  for(const [element,inert] of view.inertStates)if(element.isConnected)element.inert=inert;
  document.body.style.overflow=view.oldOverflow;
  if(restoreFocus&&view.opener?.isConnected&&!view.opener.inert)pcFocusWithoutScroll(view.opener);
}
function pcApplyS2ReaderPreferences() {
  const dialog=pcS2ReaderView?.dialog;if(!dialog)return;
  dialog.style.setProperty('--pc-reader-size',`${pcS2ReaderPreferences.size}px`);
  dialog.classList.toggle('has-spacing',pcS2ReaderPreferences.spacing);
  dialog.classList.toggle('has-focus',pcS2ReaderPreferences.focus);
}
function pcSetS2ReaderMode(mode) {
  const view=pcS2ReaderView;if(!view)return;
  pcStopS2ReaderDemo();view.mode=mode;view.cursor=0;
  const blocks=pcGetS2ReaderBlocks(mode);view.text=blocks.map(b=>b.text).join('\n');
  view.dialog.querySelector('#pcS2ReaderTranscript').innerHTML=pcRenderS2ReaderWords(blocks);
  view.dialog.querySelector('#pcS2ReaderScroll').scrollTop=0;
  for(const button of view.dialog.querySelectorAll('[data-pc-action="s2-reader-read"],[data-pc-action="s2-reader-before"],[data-pc-action="s2-reader-after"]'))button.setAttribute('aria-pressed',String(button.dataset.pcAction===`s2-reader-${mode}`));
}
function pcHighlightS2ReaderWord(charIndex, exact = true) {
  const view=pcS2ReaderView;if(!view)return;
  const word=Array.from(view.dialog.querySelectorAll('[data-pc-reader-start]')).find(el=>Number(el.dataset.pcReaderStart)<=charIndex&&Number(el.dataset.pcReaderEnd)>charIndex);
  if(!word)return;
  for(const el of view.dialog.querySelectorAll('.is-current-word,.is-current-passage'))el.classList.remove('is-current-word','is-current-passage');
  if(exact)word.classList.add('is-current-word');
  const passage=word.closest('[data-pc-reader-block]');passage.classList.add('is-current-passage');view.cursor=Number(word.dataset.pcReaderStart);
  // Scroll only the reader text, never the underlying game or the browser page.
  const scroller=view.dialog.querySelector('#pcS2ReaderScroll'),w=word.getBoundingClientRect(),s=scroller.getBoundingClientRect();
  if(w.top<s.top+24||w.bottom>s.bottom-24)scroller.scrollTop+=w.top-s.top-scroller.clientHeight/3;
}
function pcUpdateS2ReaderPlaybackControls(playing,paused=false) {
  const dialog=pcS2ReaderView?.dialog;if(!dialog)return;
  const button=dialog.querySelector('[data-pc-action="s2-reader-play"]');
  button.innerHTML=playing&&!paused?'<span aria-hidden="true">Ⅱ</span> Pause':paused?'<span aria-hidden="true">▶</span> Resume':'<span aria-hidden="true">▶</span> Play';
  button.setAttribute('aria-label',playing&&!paused?'Pause reading':paused?'Resume reading':'Play reading');
  dialog.querySelector('[data-pc-action="s2-reader-stop"]').disabled=!playing;
}
function pcStopS2ReaderDemo() {
  const playback=pcS2ReaderPlayback;if(!playback)return;
  pcS2ReaderPlayback=null;
  playback.utterance.onend=playback.utterance.onerror=playback.utterance.onboundary=playback.utterance.onstart=null;
  window.speechSynthesis?.cancel();pcUpdateS2ReaderPlaybackControls(false);
  const view=pcS2ReaderView;
  if(view){view.dialog.classList.remove('is-speaking');view.dialog.querySelector('#pcS2ReaderStatus').textContent='Audio stopped. The text is still available.';}
}
function pcStartS2ReaderSpeech(start = 0) {
  const view=pcS2ReaderView;if(!view)return;
  pcStopS2ReaderDemo();
  const status=view.dialog.querySelector('#pcS2ReaderStatus');
  if(!window.speechSynthesis||typeof window.SpeechSynthesisUtterance!=='function'){status.textContent='Audio is unavailable in this browser. You can still read the examples.';return;}
  // Short passages keep long readings responsive and provide an honest passage
  // highlight even on voices that do not send word-boundary events.
  const segments=[];let offset=0;
  for(const text of view.text.split('\n')) { if(offset+text.length>start)segments.push({text:text.slice(Math.max(0,start-offset)),start:Math.max(start,offset)});offset+=text.length+1; }
  if(!segments.length)return;
  const playback={utterance:null,paused:false,start};pcS2ReaderPlayback=playback;
  const finish=message=>{if(pcS2ReaderPlayback!==playback||pcS2ReaderView!==view)return;pcS2ReaderPlayback=null;pcUpdateS2ReaderPlaybackControls(false);view.dialog.classList.remove('is-speaking');status.textContent=message;};
  const speakSegment=index=>{
    if(pcS2ReaderPlayback!==playback||pcS2ReaderView!==view)return;
    const segment=segments[index],utterance=new window.SpeechSynthesisUtterance(segment.text);
    utterance.lang='en-US';utterance.rate=pcS2ReaderPreferences.rate;playback.utterance=utterance;
    utterance.onstart=()=>{if(pcS2ReaderPlayback!==playback)return;view.dialog.classList.add('is-speaking');pcHighlightS2ReaderWord(segment.start,false);};
    utterance.onboundary=event=>{if(pcS2ReaderPlayback!==playback||pcS2ReaderView!==view||playback.paused)return;pcHighlightS2ReaderWord(segment.start+event.charIndex,event.name!=='sentence');};
    utterance.onend=()=>{if(pcS2ReaderPlayback!==playback||pcS2ReaderView!==view)return;if(index+1<segments.length)speakSegment(index+1);else{view.cursor=0;finish('Reading complete. Press Play to listen again.');}};
    utterance.onerror=()=>finish('Audio could not play. The text is still available.');
    try{window.speechSynthesis.speak(utterance);}catch(_error){finish('Audio could not play. The text is still available.');}
  };
  pcUpdateS2ReaderPlaybackControls(true);status.textContent='Reading. Follow the highlighted words or passage.';
  try{window.speechSynthesis.cancel();window.speechSynthesis.resume?.();speakSegment(0);}catch(_error){finish('Audio could not play. The text is still available.');}
}
function pcToggleS2ReaderPlayback() {
  if(!pcS2ReaderView)return;
  const playback=pcS2ReaderPlayback;
  if(!playback)return pcStartS2ReaderSpeech(pcS2ReaderView.cursor);
  playback.paused=!playback.paused;
  if(playback.paused)window.speechSynthesis.pause();else window.speechSynthesis.resume();
  pcUpdateS2ReaderPlaybackControls(true,playback.paused);
  pcS2ReaderView.dialog.querySelector('#pcS2ReaderStatus').textContent=playback.paused?'Reading paused.':'Reading resumed.';
}
function pcPlayS2ReaderDemo(mode) { if(!['read','before','after'].includes(mode))return;pcSetS2ReaderMode(mode);pcStartS2ReaderSpeech(); }
function pcChangeS2ReaderRate(value) {
  const rate=Number(value);if(![.75,1,1.25,1.5,2,2.5].includes(rate))return;
  pcS2ReaderPreferences.rate=rate;
  if(pcS2ReaderPlayback){const paused=pcS2ReaderPlayback.paused;pcStartS2ReaderSpeech(pcS2ReaderView.cursor);if(paused)pcToggleS2ReaderPlayback();}
}
