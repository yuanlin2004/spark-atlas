'use strict';
const base = 'https://docs.nvidia.com/dgx/dgx-spark/';
const articles = [
  {id:'first-boot', topic:'Getting started', title:'Choose a first-boot access path', date:'2026-11-04', type:'Updated', hot:'Start here · First-time setup', section:'First-boot options', source:'Initial Setup – First Boot', file:'first-boot.html', tags:'boot setup initial display network keyboard headless local remote', summary:'Compare local and network setup before you power on your DGX Spark.', text:'NVIDIA documents two paths for initial setup: local access with a display, or setup over the network. Your choice for first boot does not restrict how you access the device afterward.'},
  {id:'dashboard', topic:'System tools', title:'Understand the DGX Dashboard', date:'2026-11-03', type:'New', hot:'Editor’s pick · Daily operations', section:'What the Dashboard covers', source:'DGX Dashboard', file:'dgx-dashboard.html', tags:'dashboard monitor metrics update jupyter ssh settings', summary:'Know what the dashboard shows and where to read about remote access.', text:'NVIDIA describes DGX Dashboard as an interface for system metrics, updates, settings, and local Jupyter notebooks. The guide describes remote access through NVIDIA Sync or a manually configured SSH tunnel.'},
  {id:'release-checks', topic:'Troubleshooting', title:'Check the release before troubleshooting', date:'2026-11-05', type:'Updated', section:'Where to check release notes', source:'DGX Spark Release Notes', file:'release-notes.html', tags:'release notes troubleshooting version updates issues', summary:'Find NVIDIA’s release notes before applying version-specific advice.', text:'NVIDIA maintains DGX Spark release notes in the official user guide. Start there when a question depends on the software version, and compare the entry with the version on your system.'},
  {id:'sync', topic:'System tools', title:'Find the right NVIDIA Sync guide', date:'2026-11-04', type:'New', section:'When to use Sync', source:'NVIDIA Sync', file:'nvidia-sync.html', tags:'sync ssh remote connect laptop mac windows ubuntu access', summary:'Find the official guide for connecting to Spark from another machine.', text:'NVIDIA describes Sync as a utility for accessing DGX Spark from a laptop or workstation. It manages SSH connections, port forwarding, and tunnels. See NVIDIA’s guide for setup and connection options.'},
  {id:'support', topic:'Troubleshooting', title:'Know where to ask for support', date:'2026-11-02', type:'New', section:'Find the right support channel', source:'Get the Right Support for Your DGX Spark', file:'support.html', tags:'support help ticket hardware forum community', summary:'Locate the official hardware support and community channels.', text:'NVIDIA’s support guide lists ways to open a hardware support ticket, chat with support, and visit the DGX Spark forum for community help.'}
];
const byId = Object.fromEntries(articles.map(a => [a.id, a]));
const sampleQuestions = {
  'first-boot':'What are my first-boot options?',
  dashboard:'What does the DGX Dashboard cover?',
  'release-checks':'Where can I find the release notes?',
  sync:'What does NVIDIA Sync do?',
  support:'Where can I find hardware support?'
};
const topics = [...new Set(articles.map(a => a.topic))];
const hot = articles.filter(a => a.hot);
const recent = articles.filter(a => !a.hot).sort((a,b) => b.date.localeCompare(a.date));
const main = document.querySelector('main');
const state = {scope:null, section:false, dock:null, returnTo:null, turns:[], draft:'', notice:'', pending:0, idle:null};
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const articleURL = (a, section = false) => '#article/' + a.id + (section ? '/evidence' : '');
const meta = a => '<p class="meta">' + a.type + ' <time datetime="' + a.date + '">' + new Intl.DateTimeFormat('en', {month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(a.date)) + '</time> · Documentation-backed · DGX Spark</p>';
const row = (a, label = a.topic) => '<article class="news-row"><p class="kicker">' + label + '</p><h3><a class="headline" href="' + articleURL(a) + '">' + a.title + '</a></h3><p class="summary">' + a.summary + '</p>' + meta(a) + '</article>';
const topicTiles = () => '<div class="topics">' + topics.map(t => '<a class="topic" href="#topic/' + encodeURIComponent(t) + '"><strong>' + t + ' →</strong><span>' + articles.filter(a => a.topic === t).length + ' field notes</span></a>').join('') + '</div>';
function home() {
  const lead = hot[0];
  return '<div class="edition"><span class="eyebrow">The SparkAtlas briefing</span><time datetime="2026-11-06">November 6, 2026 · Sample edition</time></div>' +
    '<div class="intro"><div><h1>The Spark briefing</h1><p>DGX Spark field notes, release checks, and answers with sources.</p></div>' +
    '<form class="entry" data-form="fresh"><label for="entry-q">Search or ask all of SparkAtlas</label><input id="entry-q" name="q" placeholder="e.g. first boot" required><div class="entry-actions"><button name="mode" value="search">Find articles</button><button class="primary" name="mode" value="ask">✦ Ask</button></div></form></div>' +
    '<nav class="jump" aria-label="Briefing sections"><a href="#hot">What’s hot ↓</a><a href="#recent">Most recent knowledge ↓</a><a class="jump-browse" href="#browse">Browse by topic →</a></nav>' +
    '<div class="news"><section id="hot" class="sect"><h2>What’s hot</h2><p class="help">Selected for relevance to common Spark tasks.</p>' +
    '<article class="lead"><img src="cover.svg" alt=""><div class="lead-copy"><p class="kicker">' + lead.hot + '</p><h3><a class="headline" href="' + articleURL(lead) + '">' + lead.title + '</a></h3><p>' + lead.summary + '</p>' + meta(lead) + '</div></article>' +
    hot.slice(1).map(a => row(a,a.hot)).join('') + '</section>' +
    '<section id="recent" class="sect"><h2>Most recent knowledge</h2><p class="help">Recent updates outside the featured selection.</p>' +
    recent.map(a => row(a)).join('') + '<a class="back-chat" href="#latest">View all recent knowledge →</a></section></div>' +
    '<section class="topic-section"><h2>Browse by topic</h2>' + topicTiles() + '</section>';
}
function browser(topic) {
  const valid = topics.includes(topic);
  return '<div class="heading"><p class="kicker">The field guide</p><h1>' + (valid ? topic : 'Browse by topic') + '</h1><p>' +
    (valid ? '<a href="#browse">All topics</a>' : 'Explore published, evidence-linked notes for DGX Spark.') + '</p></div>' +
    (valid ? articles.filter(a => a.topic === topic).map(a => row(a)).join('') : topicTiles());
}
function article(a) {
  const companion = state.dock === a.id ? chatbox(true) : '<aside class="on-page"><p class="kicker">On this page</p><a href="' + articleURL(a,true) + '">' + a.section + '</a><a href="#article/' + a.id + '/sources">Sources</a></aside>';
  return '<nav class="crumb" aria-label="Breadcrumb"><a href="#home">Briefing</a> / <a href="#browse">Browser</a> / <a href="#topic/' + encodeURIComponent(a.topic) + '">' + a.topic + '</a></nav>' +
    '<div class="reading"><article class="article"><p class="kicker">' + a.topic + '</p><h1>' + a.title + '</h1><p class="summary">' + a.summary + '</p>' +
    '<div class="evidence"><p><strong>Documentation-backed</strong> · DGX Spark</p><p class="meta">Source checked Nov 5, 2026 · Software version unspecified</p></div>' +
    '<div class="form-actions"><button class="primary" data-action="attach" data-id="' + a.id + '">✦ Ask this page</button><button data-action="contribute" data-id="' + a.id + '">Report a correction</button></div>' +
    '<section id="evidence" tabindex="-1"><h2>' + a.section + '</h2><p>' + a.text + ' <a class="citation" href="#article/' + a.id + '/sources" aria-label="Source 1: ' + a.source + '">[1]</a></p>' +
    '<div class="form-actions"><button data-action="section" data-id="' + a.id + '">Ask about this section</button></div></section>' +
    '<section id="sources" tabindex="-1"><h2>Sources</h2><p><a href="' + base + a.file + '">[1] NVIDIA · ' + a.source + ' ↗</a></p></section></article>' +
    '<div class="sidebar">' + companion + '</div></div>';
}
const stopWords = new Set('a an the do is i my can you what how of for to about it this are on does in with where should use'.split(' '));
function match(query, scope) {
  const words = query.toLowerCase().match(/[a-z0-9-]+/g) || [];
  const terms = words.filter(w => !stopWords.has(w));
  const corpus = scope ? [byId[scope]] : articles;
  return corpus.map(a => {
    const haystack = (a.title + ' ' + a.tags + ' ' + a.summary).toLowerCase();
    return {a, score:terms.filter(w => haystack.includes(w)).length};
  }).filter(x => x.score > 0).sort((a,b) => b.score-a.score).map(x => x.a);
}
function reply(turn) {
  if (turn.pending) return '<div class="message"><p>Looking through published notes…</p></div>';
  const matches = match(turn.query, turn.scope);
  const asksScope = /version|tested|supported|benchmark|performance|faster/i.test(turn.query);
  const allowed = {
    'first-boot': /(?:first|initial)[ -]boot.{0,24}(?:options|paths)|(?:options|paths).{0,24}(?:first|initial)[ -]boot|(?:local|network) setup|need a (?:display|monitor|keyboard)/i,
    dashboard: /what.{0,28}(?:dashboard|show)|dashboard.{0,24}(?:show|cover)|remote dashboard access/i,
    'release-checks': /(?:where|find|check).{0,28}release notes/i,
    sync: /what.{0,24}(?:nvidia )?sync|sync.{0,24}(?:do|for)/i,
    support: /(?:where|find).{0,28}(?:support|help)|support channels/i
  };
  const explicitPageSummary = turn.scope && /^(summarize|explain this|what does this cover)/i.test(turn.query);
  const related = matches[0];
  const best = explicitPageSummary ? byId[turn.scope] : matches.find(a => allowed[a.id].test(turn.query));
  const unsupportedAction = /disable|bypass|reset|delete|install|repair|fix|flash|upgrade/i.test(turn.query);
  const link = a => '<a href="' + articleURL(a,true) + '">' + a.title + ' · ' + a.section + ' →</a>';
  if (turn.mode === 'search') {
    return '<div class="message"><h3>' + (matches.length ? matches.length + ' matching ' + (matches.length === 1 ? 'article' : 'articles') : 'No matching articles') + '</h3>' +
      (matches.length ? matches.map(a => '<div class="sources">' + link(a) + '<p class="meta">' + a.summary + ' · DGX Spark</p></div>').join('') +
      '<div class="form-actions"><button data-action="prefill" data-text="' + esc(sampleQuestions[matches[0].id]) + '">Draft a question about the top result</button></div>' : '<p>Try a shorter keyword' + (turn.scope ? ' or remove the page scope.' : ' or browse by topic.') + '</p>') + '</div>';
  }
  if (asksScope || unsupportedAction || !best) {
    return '<div class="message"><h3>Insufficient evidence</h3><p>' + (asksScope ? 'The sample notes do not establish a version-specific or tested result for this question.' : 'The published sample notes do not support an answer to this question.') + '</p>' +
      (related ? '<div class="sources">' + link(related) + '</div>' : '<p><a href="#browse">Browse all topics</a></p>') + '</div>';
  }
  return '<div class="message"><h3>Cited answer</h3><p>' + best.text + ' <a href="' + articleURL(best,true) + '" aria-label="Citation 1: ' + best.title + ', ' + best.section + '">[1]</a></p>' +
    '<p class="meta">Documentation-backed · DGX Spark · Software version unspecified</p><div class="sources">' + link(best) + '</div></div>';
}
function chatbox(docked = false) {
  const a = byId[state.scope];
  const prompt = a ? 'Summarize this page' : 'What are my first-boot options?';
  const turns = state.turns.map(t => '<div class="message reader"><p class="meta">' + (t.mode === 'search' ? 'Search' : 'Question') + ' · ' + esc(t.scope ? byId[t.scope].title + (t.section ? ' / ' + byId[t.scope].section : '') : 'All SparkAtlas') + '</p><p>' + esc(t.query) + '</p></div>' + reply(t)).join('');
  return '<section class="chatbox" id="chatbox" aria-label="SparkAtlas Chat"><div class="chatbar"><h2 id="chat-title" tabindex="-1">' + (docked ? 'Ask alongside the article' : 'Conversation') + '</h2>' +
    '<div class="form-actions"><button data-action="reset">New Chat</button>' + (docked ? '<button data-action="close-dock">Close panel</button>' : '') + '</div></div>' +
    (a ? '<p class="context-line meta">Using ' + a.title + (state.section ? ' / ' + a.section : '') + '</p>' : '') +
    '<div class="chatbody" tabindex="0" aria-label="Conversation messages">' + (turns || '<p class="help">Find articles by keyword or ask a question with cited answers.</p><div class="prompt-row"><button data-action="prefill" data-text="' + prompt + '">' + prompt + '</button></div>') + '</div>' +
    '<form class="composer" data-form="chat"><div class="scope"><p id="chat-scope"><strong>Scope:</strong> ' + (a ? a.title + (state.section ? ' / ' + a.section : '') : 'All SparkAtlas') + '</p>' +
    (a ? '<button type="button" data-action="unscope">Use all SparkAtlas</button>' : '') + '</div>' +
    '<label for="chat-q">Search or ask</label><textarea id="chat-q" name="q" rows="2" aria-describedby="chat-scope" required placeholder="Type a keyword or a question">' + esc(state.draft) + '</textarea>' +
    '<div class="form-actions"><button name="mode" value="search"' + (state.pending ? ' disabled' : '') + '>Find articles</button><button class="primary" name="mode" value="ask"' + (state.pending ? ' disabled' : '') + '>Send question</button>' +
    '<button type="button" data-action="contribute">Contribute a finding</button></div>' +
    '<p class="help">Enter sends a question. Shift+Enter adds a line. Conversation stays in this tab.</p><p class="notice help">' + esc(state.notice) + '</p></form></section>';
}
function route() {
  const raw = location.hash.slice(1) || 'home';
  if (['hot','recent','main'].includes(raw)) return ['home',raw];
  return raw.split('/');
}
function render(focus) {
  const [page,id,anchor] = route();
  document.querySelector('#browse-nav').toggleAttribute('aria-current', ['browse','topic','article','latest'].includes(page));
  document.querySelector('#chat-nav').toggleAttribute('aria-current', page === 'chat');
  for (const item of document.querySelectorAll('nav [aria-current]')) item.setAttribute('aria-current','page');
  if (page === 'home') main.innerHTML = home();
  else if (page === 'browse') main.innerHTML = browser();
  else if (page === 'topic') main.innerHTML = browser(topics.find(t => encodeURIComponent(t) === id));
  else if (page === 'latest') main.innerHTML = '<div class="heading"><p class="kicker">The Spark briefing</p><h1>Most recent knowledge</h1><p>All notes, ordered by publication or meaningful update.</p></div>' +
    [...articles].sort((a,b) => b.date.localeCompare(a.date)).map(a => row(a)).join('');
  else if (page === 'article' && byId[id]) main.innerHTML = article(byId[id]);
  else if (page === 'chat') main.innerHTML = '<div class="chat-page">' +
    (state.returnTo ? '<a class="back-chat" href="' + state.returnTo + '">← Return to article</a>' : '') + '<div class="heading"><p class="kicker">SparkAtlas Chat</p><h1>Search or ask</h1><p>Explore published knowledge and follow the evidence.</p></div>' + chatbox() + '</div>';
  else main.innerHTML = '<div class="heading"><h1>Page not found</h1><p><a href="#browse">Browse topics</a> or <a href="#chat">open Chat</a>.</p></div>';
  showNewest();
  if (focus) {
    const target = document.querySelector(focus);
    if (target) {target.focus({preventScroll:true}); target.scrollIntoView({block:'nearest'});}
  } else if (page === 'article' && anchor) {
    const target = document.getElementById(anchor);
    if (target) {target.scrollIntoView(); target.focus({preventScroll:true});}
  } else if (page === 'home' && id) {
    const target = document.getElementById(id);
    if (target) {
      target.tabIndex = -1;
      target.focus({preventScroll:true});
      target.scrollIntoView();
    }
  }
}
function showNewest() {
  const transcript = document.querySelector('.chatbody');
  if (transcript) transcript.scrollTop = transcript.scrollHeight;
}
function go(hash, focus = '#main') {
  if (location.hash !== hash) history.pushState(null,'',hash);
  navigatedHash = location.hash;
  window.scrollTo(0,0);
  render(focus);
}
let navigatedHash = location.hash;
function externalNav() {
  if (navigatedHash === location.hash) return;
  navigatedHash = location.hash;
  const [page,id,anchor] = route();
  if (!anchor && !(page === 'home' && id)) window.scrollTo(0,0);
  render(anchor || (page === 'home' && id) ? undefined : '#main');
}
window.addEventListener('hashchange',externalNav);
window.addEventListener('popstate',externalNav);
function announce(message) {
  document.querySelector('#announcer').textContent = message;
}
function activity() {
  clearTimeout(state.idle);
  state.idle = setTimeout(() => {
    reset();
    state.notice = 'Conversation cleared after 30 minutes of inactivity.';
    if (document.querySelector('.chatbox')) render('#chat-title');
    announce(state.notice);
  }, 30 * 60 * 1000);
}
function reset() {
  clearTimeout(state.pending);
  clearTimeout(state.idle);
  Object.assign(state,{scope:null,section:false,returnTo:null,turns:[],draft:'',notice:'',pending:0});
}
function send(query, mode) {
  if (!query || state.pending) return;
  const turn = {query,mode,scope:state.scope,section:state.section,pending:true};
  state.turns = [...state.turns.slice(-9),turn];
  state.draft = '';
  state.notice = 'Looking through published notes…';
  state.pending = setTimeout(() => {
    turn.pending = false;
    state.pending = 0;
    state.notice = mode === 'search' ? 'Search complete.' : 'Response ready.';
    const box = document.querySelector('.chatbox');
    if (box) {
      const pending = box.querySelector('.message:last-child');
      const transcript = box.querySelector('.chatbody');
      const nearEnd = transcript.scrollHeight - transcript.clientHeight - transcript.scrollTop < 48;
      if (pending) pending.outerHTML = reply(turn);
      if (nearEnd) showNewest();
      box.querySelectorAll('button[name="mode"]').forEach(button => {button.disabled = false;});
      box.querySelector('.notice').textContent = state.notice;
    }
    announce(state.notice);
  }, 220);
  render('#chat-q');
  announce(state.notice);
  activity();
}
function contribution(articleId, correction) {
  const opener = document.activeElement;
  const dialog = document.createElement('dialog');
  const a = byId[articleId];
  dialog.setAttribute('aria-labelledby','contribution-title');
  dialog.innerHTML = '<h2 id="contribution-title">' + (correction ? 'Report a correction' : 'Contribute a finding') + '</h2><p class="help">' +
    (a ? 'Article: ' + a.title + '. ' : '') + 'Preview what would be sent to private intake. This prototype does not transmit or store submissions.</p>' +
    '<form><label for="finding">Finding or question</label><textarea id="finding" required rows="3"></textarea><label for="versions">Hardware and software versions</label><textarea id="versions" rows="1"></textarea>' +
    '<label for="links">Public evidence links</label><textarea id="links" rows="1"></textarea><p class="help">Leave out credentials and personal identifiers.</p>' +
    '<div class="form-actions"><button type="button" data-close>Cancel</button><button class="primary">Submit sample contribution</button></div></form>';
  document.body.append(dialog);
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.querySelector('form').onsubmit = event => {
    event.preventDefault();
    dialog.querySelector('form').outerHTML = '<p role="status">Sample receipt: ATLAS-DEMO. No contribution was sent.</p><div class="form-actions"><button data-close>Done</button></div>';
    const done = dialog.querySelector('[data-close]');
    done.onclick = () => dialog.close();
    done.focus();
  };
  dialog.addEventListener('close', () => {dialog.remove(); opener?.focus();});
  dialog.showModal();
}
document.addEventListener('submit', event => {
  const form = event.target;
  if (!form.dataset.form) return;
  event.preventDefault();
  const query = form.elements.q.value.trim();
  if (!query) return;
  const mode = event.submitter?.value || 'ask';
  if (form.dataset.form === 'fresh') {reset(); state.dock = null; go('#chat');}
  send(query,mode);
});
document.addEventListener('keydown', event => {
  if (event.target.id === 'chat-q' && event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (!state.pending) event.target.form.requestSubmit(event.target.form.querySelector('[value="ask"]'));
  }
});
document.addEventListener('input', event => {
  if (event.target.id !== 'chat-q') return;
  state.draft = event.target.value;
  activity();
});
document.addEventListener('click', event => {
  if (event.target.closest('a')?.getAttribute('href') === state.returnTo && route()[0] === 'chat' && event.target.closest('.back-chat')) {
    event.preventDefault();
    go(state.returnTo, state.section ? '[data-action="section"]' : '[data-action="attach"]');
    return;
  }
  if (event.target.closest('.skip')) {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
    return;
  }
  const button = event.target.closest('button');
  if (!button) return;
  if (button.id === 'fresh') {reset(); state.dock = null; go('#chat','#chat-q'); return;}
  const {action,id,text} = button.dataset;
  if (action === 'attach' || action === 'section') {
    state.scope = id;
    state.section = action === 'section';
    state.returnTo = articleURL(byId[id], state.section);
    if (matchMedia('(max-width: 900px)').matches) {
      state.dock = null;
      go('#chat','#chat-title');
    } else {
      state.dock = id;
      render('#chat-q');
    }
    activity();
  } else if (action === 'unscope') {
    state.scope = null; state.section = false; render('#chat-q'); activity();
  } else if (action === 'reset') {
    reset(); render('#chat-q'); announce('New conversation. Scope is all SparkAtlas.');
  } else if (action === 'close-dock') {
    state.dock = null; render(state.section ? '[data-action="section"]' : '[data-action="attach"]');
  } else if (action === 'prefill') {
    state.draft = text; render('#chat-q'); activity();
  } else if (action === 'contribute') {
    contribution(id || state.scope, Boolean(id));
  }
});
render();
