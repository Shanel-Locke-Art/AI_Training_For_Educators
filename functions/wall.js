// ── CONFIG ────────────────────────────────────────
  // Same SHEETS_URL as index.html -- reads from the same deployment
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzN9bGwzKUcucCltXfj72pxee7y6t1reML6YRQNqCjxJ9Y3rDGp1a_FkYMzJmZROka5/exec';

  const SCENARIO_COLORS = { 1:'tag-1', 2:'tag-2', 3:'tag-3', 4:'tag-4', 5:'tag-5', 6:'tag-6' };
  const SCENARIO_LABELS = {
    1: 'Engagement', 2: 'Differentiation', 3: 'Assessment',
    4: 'Critical Thinking', 5: 'Predict the Output', 6: 'Bias and Context'
  };

  let allIdeas = [];
  let activeFilter = 'all';

  // ── DEMO DATA ─────────────────────────────────────
  // Shown when no real data is available yet
  const DEMO_IDEAS = [
    { scenario: 1, scenarioLabel: 'Engagement', score: 5,
      idea: "**Discussion Prompt: Perspective Bridges**\n\n**Initial Post** (due Wednesday, 300–400 words)\n\nChoose a current event or trending topic that connects to our course material this week.\n\n1. **Context & Connection** (100 words): Briefly summarize the topic and connect it to at least one concept from this week's readings.\n2. **Multiple Lenses** (150 words): Analyze this topic from two different perspectives — different stakeholders, cultures, or disciplines.\n3. **Bridge Question** (50–100 words): End with a question that invites classmates to share their own experiences.\n\n**Peer Replies** (due Sunday, 150+ words each)\n\n- First reply: Respond to someone whose topic genuinely surprised you.\n- Second reply: Offer a respectful counterpoint or extend their thinking.\n\n**Course Quality Check**\n\n✓ Clear Objectives · ✓ Student Interaction · ✓ Real-World Context · ✓ Inclusive Design" },

    { scenario: 1, scenarioLabel: 'Engagement', score: 4,
      idea: "**Discussion: The Invisible Infrastructure**\n\nYour rural community relies on systems most people never think about — water, power, roads, emergency services.\n\n**Your Task**\n\nChoose one system and research what would happen if it failed for 72 hours. Present your findings as a 2-minute 'emergency briefing' to the class.\n\n**Discussion Questions**\n\n- Which systems are most vulnerable and why?\n- What does your community already have in place?\n- What would you recommend to local leadership?\n\n**Course Quality Check**\n\n✓ Real-World Context · ✓ Student Interaction · + Measurable Outcomes could be stronger" },

    { scenario: 2, scenarioLabel: 'Metacognition', score: 5,
      idea: "**Weekly Metacognitive Check-In (10–15 min)**\n\nThis activity helps students notice *how* they are learning, not just *what* they are learning.\n\n**Prompt Sequence**\n\n1. **Before you begin:** What do you already know about this topic? What confuses you?\n2. **During:** When did you feel stuck this week? What did you do about it?\n3. **After:** What strategy worked best for you this week — and would you use it again?\n\n**Format**\n\nStudents submit a short audio note or 150-word written reflection. No grading for correctness — only for completion and honest engagement.\n\n**Course Quality Check**\n\n✓ Clear Objectives · ✓ Reflection · ✓ Learning Strategy · ✓ Student Autonomy" },

    { scenario: 3, scenarioLabel: 'Assessment', score: 5,
      idea: "**Authentic Assessment: Community Asset Audit**\n\nStudents document three underutilized community assets — natural, cultural, or economic — using photography, interviews, and publicly available data.\n\n**Deliverables**\n\n- A professional-grade report (8–10 pages) with evidence and recommendations\n- A 5-minute recorded presentation for a local organization\n- A self-assessment using the provided rubric\n\n**Rubric Dimensions**\n\n1. Research quality and source credibility\n2. Community voice representation\n3. Feasibility of recommendations\n4. Clarity and professional presentation\n\n**Course Quality Check**\n\n✓ Authentic Tasks · ✓ Feedback Design · ✓ Student Agency · ✓ Alignment" },
  ];

  // ── LOAD ──────────────────────────────────────────
  async function loadIdeas() {
    showLoading();

    try {
      const res = await fetch(`${SHEETS_URL}?action=getIdeas&t=${Date.now()}`);
      const data = await res.json();

      if (data.ideas && data.ideas.length > 0) {
        allIdeas = data.ideas;
      } else {
        // No real data yet — show demo cards with a note
        allIdeas = DEMO_IDEAS.map(d => ({ ...d, isDemo: true }));
      }
    } catch(e) {
      // Network error or CORS -- show demo data
      allIdeas = DEMO_IDEAS.map(d => ({ ...d, isDemo: true }));
    }

    renderIdeas();
  }

  function showLoading() {
    document.getElementById('wallGrid').innerHTML = `
      <div class="wall-state">
        <span class="wall-state-icon">🌿</span>
        <div class="wall-state-title">Loading ideas</div>
        <div class="wall-state-sub">
          <div class="loading-dots"><span></span><span></span><span></span></div>
        </div>
      </div>`;
  }

  // ── FILTER ────────────────────────────────────────
  function filterIdeas(filter, btn) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn?.classList.add('active');
    renderIdeas();
  }

  // ── RENDER ────────────────────────────────────────
  function renderIdeas() {
    const grid = document.getElementById('wallGrid');
    const filtered = activeFilter === 'all'
      ? allIdeas
      : allIdeas.filter(i => String(i.scenario) === activeFilter);

    // Update stats
    const scenariosPresent = new Set(allIdeas.map(i => i.scenario)).size;
    document.getElementById('statTotal').textContent = allIdeas.filter(i => !i.isDemo).length || '—';
    document.getElementById('statScenarios').textContent = allIdeas.filter(i => !i.isDemo).length
      ? scenariosPresent : '—';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="wall-state">
          <span class="wall-state-icon">📭</span>
          <div class="wall-state-title">No ideas here yet</div>
          <div class="wall-state-sub">Be the first to complete this scenario and add an idea to the wall.</div>
        </div>`;
      return;
    }

    const isDemoSet = filtered.some(i => i.isDemo);
    let html = '';

    if (isDemoSet) {
      html += `<div style="grid-column:1/-1;text-align:center;padding:12px 0 4px;">
        <span style="font-family:'Source Code Pro',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-muted);background:var(--cream);border:1px solid var(--border);border-radius:99px;padding:3px 12px;">
          Sample ideas — real submissions will appear here
        </span>
      </div>`;
    }

    filtered.forEach((idea, idx) => {
      const tagClass = SCENARIO_COLORS[idea.scenario] || 'tag-1';
      const label = idea.scenarioLabel || SCENARIO_LABELS[idea.scenario] || `Scenario ${idea.scenario}`;
      const delay = (idx % 12) * 60;
      // Show full idea text -- cards will be variable height naturally
      const ideaText = fmtIdea(idea.idea || '');

      html += `
        <div class="idea-card" style="animation-delay:${delay}ms">
          <div class="idea-card-header">
            <span class="idea-scenario-tag ${tagClass}">${label}</span>
          </div>
          <div class="idea-text">${ideaText}</div>
        </div>`;
    });

    grid.innerHTML = html;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function inlineFmt(s) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--ink);font-weight:700;">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function fmtIdea(str) {
    if (!str) return '';
    const lines = str.split('\n');
    let out = '';
    let inList = false;

    lines.forEach(line => {
      if (/^###\s/.test(line)) {
        if (inList) { out += '</ul>'; inList = false; }
        out += '<div style="font-family:\'Fraunces\',serif;font-size:0.88rem;font-weight:700;color:var(--ink);margin:14px 0 4px;">' + escHtml(line.replace(/^###\s+/,'')) + '</div>';
        return;
      }
      if (/^##\s/.test(line)) {
        if (inList) { out += '</ul>'; inList = false; }
        out += '<div style="font-family:\'Fraunces\',serif;font-size:0.92rem;font-weight:700;color:var(--ink);margin:16px 0 5px;">' + escHtml(line.replace(/^##\s+/,'')) + '</div>';
        return;
      }
      const num = line.match(/^(\d+)\.\s+(.*)/);
      if (num) {
        if (!inList) { out += '<ul style="margin:8px 0;padding:0;list-style:none;">'; inList = true; }
        out += '<li style="display:flex;gap:8px;margin:5px 0;"><span style="font-family:\'Source Code Pro\',monospace;font-size:0.72rem;color:var(--amber-dark);font-weight:700;flex-shrink:0;min-width:20px;">' + num[1] + '.</span><span>' + inlineFmt(escHtml(num[2])) + '</span></li>';
        return;
      }
      const bul = line.match(/^[-\u2022]\s+(.*)/);
      if (bul) {
        if (!inList) { out += '<ul style="margin:8px 0;padding:0;list-style:none;">'; inList = true; }
        out += '<li style="display:flex;gap:8px;margin:4px 0;"><span style="color:var(--forest-mid);flex-shrink:0;">&middot;</span><span>' + inlineFmt(escHtml(bul[1])) + '</span></li>';
        return;
      }
      if (inList) { out += '</ul>'; inList = false; }
      if (!line.trim()) {
        out += '<div style="height:8px;"></div>';
        return;
      }
      const boldOnly = line.match(/^\*\*([^*]+)\*\*:?\s*$/);
      if (boldOnly) {
        out += '<div style="font-weight:700;color:var(--ink);margin-top:12px;margin-bottom:2px;">' + escHtml(boldOnly[1]) + (line.includes(':') ? ':' : '') + '</div>';
        return;
      }
      out += '<div style="margin:2px 0;line-height:1.7;">' + inlineFmt(escHtml(line)) + '</div>';
    });

    if (inList) out += '</ul>';
    return out;
  }

  function bindWallEvents() {
    document.getElementById('filterBar')?.addEventListener('click', event => {
      const button = event.target.closest('.filter-btn[data-filter]');
      if (!button) return;
      filterIdeas(button.dataset.filter || 'all', button);
    });

    document.getElementById('refreshIdeasBtn')?.addEventListener('click', loadIdeas);
    loadIdeas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindWallEvents, { once: true });
  } else {
    bindWallEvents();
  }
