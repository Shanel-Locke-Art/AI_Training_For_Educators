(() => {
  'use strict';

  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzAtqwPWbS-5BZQ3LyTjgDIkABoMM8KeL-OrzErb64SAipeu6gbxGFSjfHV_GVcH5ZU/exec';

  const SCENARIOS = Object.freeze({
    1: { label: 'S1: Course Design', short: 'Course Design', tag: 'tag-1' },
    2: { label: 'S2: Accessibility', short: 'Accessibility', tag: 'tag-2' },
    3: { label: 'S3: Engagement', short: 'Engagement', tag: 'tag-3' },
    4: { label: 'S4: Authentic Assessment', short: 'Assessment', tag: 'tag-4' },
    5: { label: 'S5: Predict the Output', short: 'Prediction', tag: 'tag-5' },
    6: { label: 'S6: Hallucination Hunt', short: 'Hallucination', tag: 'tag-6' },
    7: { label: 'S7: Appropriate Reliance', short: 'Appropriate Reliance', tag: 'tag-7' },
    8: { label: 'S8: Course-Copy Reckoning', short: 'Course Copy', tag: 'tag-8' }
  });

  const SAMPLE_IDEAS = [
    {
      scenario: 1,
      scenarioLabel: 'S1: Course Design',
      score: 5,
      timestamp: '',
      isDemo: true,
      idea: '**Start Here: Week 4 Learning Path**\n\nThe module overview names the purpose, workload, due point, and first action before students open any files. Items use verb-first labels and follow a Learn → Practice → Submit → Continue sequence.\n\n**Student-visible signals**\n\n- What the week is for\n- What to do in order\n- What to submit and how success is judged\n- How to know the week is complete'
    },
    {
      scenario: 2,
      scenarioLabel: 'S2: Accessibility',
      score: 5,
      timestamp: '',
      isDemo: true,
      idea: '**Multiple Ways In**\n\nThe lesson pairs descriptive headings, meaningful link text, captions, and a transcript with a keyboard-checkable reading order. The same essential directions remain available without relying on color, sound, or mouse input alone.'
    },
    {
      scenario: 3,
      scenarioLabel: 'S3: Engagement',
      score: 5,
      timestamp: '',
      isDemo: true,
      idea: '**Perspective Bridges Discussion**\n\nStudents compare two perspectives before posting a response, then use evidence from course material to explain where the perspectives connect or remain in tension.\n\n**How it works**\n\n1. Name two perspectives on the issue.\n2. Support each perspective with a specific course example.\n3. End with a question that invites a classmate to extend or challenge the comparison.'
    },
    {
      scenario: 4,
      scenarioLabel: 'S4: Authentic Assessment',
      score: 5,
      timestamp: '',
      isDemo: true,
      idea: '**Evidence, Revise, Respond**\n\nStudents produce an authentic first draft, receive targeted peer feedback tied to the criteria, and revise before final submission.\n\n**Evidence of learning**\n\nStudents submit the revision plus a short note identifying which feedback they used, what changed, and why the revision better meets the stated criteria.'
    }
  ];

  let allIdeas = [];
  let activeFilter = 'all';
  let activeSort = 'recent';

  function escHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function inlineFormat(value) {
    return escHtml(value)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function formatIdeaMarkdown(value) {
    const lines = String(value || '').replace(/\r/g, '').split('\n');
    let html = '';
    let listType = '';

    const closeList = () => {
      if (listType) html += `</${listType}>`;
      listType = '';
    };

    lines.forEach(rawLine => {
      const line = rawLine.trimEnd();
      if (!line.trim()) {
        closeList();
        return;
      }

      const h3 = line.match(/^###\s+(.+)/);
      const h2 = line.match(/^##\s+(.+)/);
      const numbered = line.match(/^\d+[.)]\s+(.+)/);
      const bullet = line.match(/^[-•]\s+(.+)/);
      const heading = line.match(/^\*\*([^*]+)\*\*:?\s*$/);

      if (h3 || h2 || heading) {
        closeList();
        const text = h3 ? h3[1] : h2 ? h2[1] : heading[1];
        const tag = h2 ? 'h3' : 'h4';
        html += `<${tag}>${escHtml(text)}</${tag}>`;
        return;
      }

      if (numbered) {
        if (listType !== 'ol') { closeList(); html += '<ol>'; listType = 'ol'; }
        html += `<li>${inlineFormat(numbered[1])}</li>`;
        return;
      }

      if (bullet) {
        if (listType !== 'ul') { closeList(); html += '<ul>'; listType = 'ul'; }
        html += `<li>${inlineFormat(bullet[1])}</li>`;
        return;
      }

      closeList();
      html += `<p>${inlineFormat(line)}</p>`;
    });

    closeList();
    return html || '<p>No idea text was provided.</p>';
  }

  function stripMarkdown(value) {
    return String(value || '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^[-•]\s+/gm, '')
      .replace(/^\d+[.)]\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractTitle(value, scenario) {
    const text = String(value || '').replace(/\r/g, '');
    const firstHeading = text.match(/^(?:#{1,6}\s+|\*\*)([^\n*]+)(?:\*\*)?/m);
    if (firstHeading && firstHeading[1]) return firstHeading[1].replace(/:$/, '').trim();
    const plain = stripMarkdown(text);
    if (plain) {
      const sentence = plain.split(/[.!?](?:\s|$)/)[0].trim();
      if (sentence.length >= 8 && sentence.length <= 82) return sentence;
    }
    return `${SCENARIOS[scenario]?.short || 'PromptCraft'} Teaching Idea`;
  }

  function extractSummary(value, title) {
    const text = String(value || '').replace(/\r/g, '').trim();
    if (!text) return 'An instructional idea shared from PromptCraft.';

    const normalizedTitle = String(title || '').trim().toLowerCase();
    const blocks = text.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);

    for (const block of blocks) {
      const plain = stripMarkdown(block).trim();
      if (!plain) continue;
      if (normalizedTitle && plain.toLowerCase() === normalizedTitle) continue;

      const headingOnly = /^(?:#{1,6}\s+.+|\*\*[^*]+\*\*:?)$/.test(block);
      if (headingOnly) continue;

      // Use the complete first descriptive paragraph. The former 150-character
      // excerpt was visually tidy but made the card description unreadable.
      return plain;
    }

    const plain = stripMarkdown(text).replace(String(title || ''), '').trim();
    return plain || 'An instructional idea shared from PromptCraft.';
  }

  function normalizeIdea(raw) {
    const scenario = Number(raw.scenario || raw.scenarioIndex || raw.scenario_index || 0);
    return {
      scenario,
      scenarioLabel: raw.scenarioLabel || raw.scenario_label || SCENARIOS[scenario]?.label || `Scenario ${scenario || '?'}`,
      score: raw.score ?? raw.bestScore ?? raw.best_score ?? '',
      timestamp: raw.timestamp || raw.addedAt || raw.added_at || '',
      idea: raw.idea || raw.text || raw.excerpt || raw.finalResponse || raw.final_response || '',
      isDemo: Boolean(raw.isDemo)
    };
  }

  async function loadIdeas() {
    setBusy(true);
    showLoading();

    try {
      const response = await fetch(`${SHEETS_URL}?action=getIdeas&t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Ideas Wall request failed: ${response.status}`);
      const data = await response.json();
      const incoming = Array.isArray(data.ideas) ? data.ideas.map(normalizeIdea).filter(i => i.idea) : [];
      allIdeas = incoming.length ? incoming : SAMPLE_IDEAS.map(normalizeIdea);
    } catch (error) {
      console.warn('Ideas Wall could not load approved submissions; showing samples.', error);
      allIdeas = SAMPLE_IDEAS.map(normalizeIdea);
    }

    render();
    setBusy(false);
  }

  function showLoading() {
    const grid = document.getElementById('ideasGrid');
    if (!grid) return;
    grid.innerHTML = `
      <div class="wall-state">
        <div class="wall-state-mark" aria-hidden="true">✦</div>
        <h2>Loading ideas</h2>
        <p>Checking the approved Ideas Wall submissions.</p>
        <div class="loading-dots" aria-hidden="true"><span></span><span></span><span></span></div>
      </div>`;
  }

  function setBusy(isBusy) {
    document.getElementById('ideasGrid')?.setAttribute('aria-busy', String(Boolean(isBusy)));
    const refresh = document.getElementById('refreshIdeasBtn');
    if (refresh) refresh.disabled = Boolean(isBusy);
  }

  function sortedFilteredIdeas() {
    let ideas = activeFilter === 'all'
      ? allIdeas.slice()
      : allIdeas.filter(idea => String(idea.scenario) === activeFilter);

    if (activeSort === 'scenario') {
      ideas.sort((a, b) => a.scenario - b.scenario || timestampMs(b.timestamp) - timestampMs(a.timestamp));
    } else if (activeSort === 'score') {
      ideas.sort((a, b) => numericScore(b.score) - numericScore(a.score) || timestampMs(b.timestamp) - timestampMs(a.timestamp));
    } else {
      ideas.sort((a, b) => timestampMs(b.timestamp) - timestampMs(a.timestamp));
    }
    return ideas;
  }

  function numericScore(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : -1;
  }

  function timestampMs(value) {
    if (!value) return 0;
    const ms = new Date(value).getTime();
    return Number.isFinite(ms) ? ms : 0;
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function latestLabel(value) {
    if (!value) return { value: 'Samples', note: 'Awaiting approved submissions' };
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { value: '—', note: 'Date unavailable' };
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    return {
      value: sameDay ? 'Today' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date),
      note: `Latest approved idea · ${formatDate(value)}`
    };
  }

  function updateStats() {
    const realIdeas = allIdeas.filter(i => !i.isDemo);
    const source = realIdeas.length ? realIdeas : allIdeas;
    const scenarioCount = new Set(source.map(i => i.scenario).filter(Boolean)).size;
    const latest = source.reduce((best, idea) => timestampMs(idea.timestamp) > timestampMs(best) ? idea.timestamp : best, '');
    const latestInfo = realIdeas.length ? latestLabel(latest) : { value: 'Samples', note: 'Awaiting approved submissions' };

    document.getElementById('statTotal').textContent = realIdeas.length ? String(realIdeas.length) : '—';
    document.getElementById('statScenarios').textContent = realIdeas.length ? String(scenarioCount) : '—';
    document.getElementById('statLatest').textContent = latestInfo.value;
    document.getElementById('statLatestNote').textContent = latestInfo.note;
    document.getElementById('sampleNote').hidden = realIdeas.length > 0;
  }

  function cardHtml(idea, index) {
    const scenario = SCENARIOS[idea.scenario] || { label: idea.scenarioLabel || 'PromptCraft', short: idea.scenarioLabel || 'PromptCraft', tag: 'tag-1' };
    const title = extractTitle(idea.idea, idea.scenario);
    const summary = extractSummary(idea.idea, title);
    const formatted = formatIdeaMarkdown(idea.idea);
    const score = numericScore(idea.score);
    const scoreHtml = score >= 0 ? `<span class="score-chip">${escHtml(score)}/5</span>` : '';
    const date = formatDate(idea.timestamp);

    return `
      <article class="idea-card" data-idea-index="${index}" style="animation-delay:${Math.min(index, 8) * 45}ms">
        <div class="idea-card-inner">
          <div class="idea-card-top">
            <span class="scenario-tag ${scenario.tag}">${escHtml(scenario.label)}</span>
            ${idea.isDemo ? '<span class="sample-badge">SAMPLE</span>' : scoreHtml}
          </div>
          <h2 class="idea-title">${escHtml(title)}</h2>
          <p class="idea-summary">${escHtml(summary)}</p>
          <section class="idea-panel" aria-label="Shared teaching idea">
            <div class="idea-panel-label">Shared Idea</div>
            <div class="idea-body" id="ideaBody${index}">${formatted}</div>
            <div class="idea-fade" aria-hidden="true"></div>
            <button class="expand-btn" type="button" data-expand-card aria-expanded="false" aria-controls="ideaBody${index}">View full idea</button>
          </section>
        </div>
        <div class="idea-meta">
          <span>Shared from: <strong>${escHtml(scenario.short)}</strong>${date ? ` · ${escHtml(date)}` : ''}</span>
          ${idea.isDemo ? '' : scoreHtml}
        </div>
      </article>`;
  }

  function render() {
    updateStats();
    const grid = document.getElementById('ideasGrid');
    if (!grid) return;
    const ideas = sortedFilteredIdeas();

    if (!ideas.length) {
      grid.innerHTML = `
        <div class="wall-state">
          <div class="wall-state-mark" aria-hidden="true">◇</div>
          <h2>No approved ideas in this scenario yet</h2>
          <p>When an idea is approved for the wall, it will appear here automatically.</p>
        </div>`;
      return;
    }

    grid.innerHTML = ideas.map(cardHtml).join('');
    requestAnimationFrame(updateExpandButtons);
  }

  function updateExpandButtons() {
    document.querySelectorAll('.idea-card').forEach(card => {
      const body = card.querySelector('.idea-body');
      const button = card.querySelector('[data-expand-card]');
      const fade = card.querySelector('.idea-fade');
      if (!body || !button || !fade) return;
      const needsExpand = body.scrollHeight > body.clientHeight + 8;
      button.hidden = !needsExpand;
      fade.hidden = !needsExpand;
    });
  }

  function bindEvents() {
    document.getElementById('filterBar')?.addEventListener('click', event => {
      const button = event.target.closest('.filter-btn[data-filter]');
      if (!button) return;
      activeFilter = button.dataset.filter || 'all';
      document.querySelectorAll('.filter-btn').forEach(item => item.classList.toggle('active', item === button));
      render();
    });

    document.getElementById('sortIdeas')?.addEventListener('change', event => {
      activeSort = event.target.value || 'recent';
      render();
    });

    document.getElementById('ideasGrid')?.addEventListener('click', event => {
      const button = event.target.closest('[data-expand-card]');
      if (!button) return;
      const card = button.closest('.idea-card');
      const expanded = !card.classList.contains('expanded');
      card.classList.toggle('expanded', expanded);
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Show less' : 'View full idea';
    });

    document.getElementById('refreshIdeasBtn')?.addEventListener('click', loadIdeas);
    window.addEventListener('resize', () => requestAnimationFrame(updateExpandButtons), { passive: true });
    loadIdeas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents, { once: true });
  } else {
    bindEvents();
  }
})();
