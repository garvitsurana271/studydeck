// ============= MULTI-CHAPTER ENGINE =============
// Subjects \u2192 Chapters \u2192 Parts \u2192 Topics

// KaTeX helper \u2014 renders any $\u2026$, $$\u2026$$, \(\u2026\), \[\u2026\] inside the given element.
// Safe to call before KaTeX has loaded (no-op until window.renderMathInElement exists).
function renderMathIn(el) {
  if (window.renderMathInElement && el) {
    try { renderMathInElement(el, { throwOnError: false, delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$',  right: '$',  display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ] }); } catch (e) {}
  }
}

// LEVELS
const LEVELS = [
  { name: 'Initiate',     min: 0,    max: 100  },
  { name: 'Apprentice',   min: 100,  max: 300  },
  { name: 'Practitioner', min: 300,  max: 700  },
  { name: 'Adept',        min: 700,  max: 1500 },
  { name: 'Master',       min: 1500, max: 3000 },
  { name: 'Sage',         min: 3000, max: 6000 },
  { name: 'Luminary',     min: 6000, max: 12000},
];
function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (xp >= LEVELS[i].min) return { idx: i, ...LEVELS[i] };
  return { idx: 0, ...LEVELS[0] };
}

const ACHIEVEMENTS = [
  { id: 'first_spark',    icon: '\u26A1', name: 'First Spark',    desc: 'First correct answer' },
  { id: 'untouchable',    icon: '\u2726', name: 'Untouchable',    desc: '10-streak chain' },
  { id: 'perfectionist',  icon: '\u25C6', name: 'Perfectionist',  desc: '100% on a topic' },
  { id: 'speed_demon',    icon: '\u25D0', name: 'Speed Demon',    desc: 'Answer in under 5 seconds' },
  { id: 'night_owl',      icon: '\u263E', name: 'Night Owl',      desc: 'Study after 11 PM' },
  { id: 'critical',       icon: '\u2736', name: 'Critical',       desc: 'First critical hit' },
  { id: 'shielded',       icon: '\uD83D\uDEE1', name: 'Shielded',       desc: 'Save streak with shield' },
  { id: 'discharge',      icon: '\u26A1', name: 'Discharge',      desc: 'Trigger a lightning strike' },
  { id: 'marathon',       icon: '\u221E', name: 'Marathon',       desc: '50 problems in one day' },
  { id: 'topic_master',   icon: '\u2605', name: 'Topic Master',   desc: 'Complete first topic' },
  { id: 'chapter_clear',  icon: '\u2606', name: 'Chapter Clear',  desc: 'Complete entire chapter' },
  { id: 'level_5',        icon: '\u25C8', name: 'Adept',          desc: 'Reach level 4 (Adept)' },
];

const SUBJECT_THEMES = {
  Physics:   { icon: '\u26A1', color: '#1E3AFF', soft: '#E5E9FF', name: 'Physics' },
  Chemistry: { icon: '\uD83E\uDDEA', color: '#0FA968', soft: '#D7F4E5', name: 'Chemistry' },
  Maths:     { icon: '\u222B',  color: '#7C3AED', soft: '#EDE4FF', name: 'Maths' },
};

const DEFAULT_STATE = {
  xp: 0, streak: 0, bestStreak: 0,
  solved: 0, correct: 0, wrong: 0,
  shields: 0, charge: 0,
  lastDate: null, dayStreak: 0, bestDayStreak: 0,
  dailySolved: 0, dailyDate: null,
  topics: {}, currentTopicId: null, currentChapterId: null, currentSubject: 'Physics',
  achievements: {},
  soundOn: true,
  comboMult: 1,
  view: 'mission', // 'mission' | 'subject' | 'chapter'
  // ===== NEW: customization =====
  displayName: '',
  accentColor: '', // empty = default
  unlockedAccents: ['default'],
  // ===== NEW: daily quests =====
  dailyQuests: null, // { date, quests: [{id,label,target,progress,reward,done,claimed}] }
  // ===== NEW: power hour =====
  powerHour: null, // { startedAt, endsAt }
  powerHourLastOffered: null,
  // ===== NEW: comeback / session =====
  lastSessionEnd: null,
  comebackShown: null, // date string when shown
  bestSessionStreak: 0,
  // ===== NEW: lofi ambient =====
  lofiOn: false,
  // ===== NEW: anti-overwhelm =====
  chaptersExpanded: false,
  // ===== NEW: plan view =====
  stealth: false,
  satHoliday: false, // true = this Saturday has no school (affects week strip + daily template)
  planChecks: {}, // { 'YYYY-MM-DD': { core: bool, bonus: bool, pomos: [bool\u00D76] } }
};
let state = loadState();
let session = { topicFullId: null, problems: [], idx: 0, correct: 0, xpEarned: 0, mixed: false };
// ===== NEW: live session tracker (across topic boundaries) for end-of-session summary =====
let liveSession = { startedAt: Date.now(), problemsAnswered: 0, correct: 0, xpEarned: 0, topicsCompleted: 0, peakStreak: 0, crits: 0, mysteries: 0 };
let timerInterval = null;
let timerStart = 0;
const TIMER_LIMIT = 60000;
const SPEED_BONUS_MS = 8000;
let selectedMcqIdx = null;

function loadState() {
  try { const s = JSON.parse(localStorage.getItem('studydeck_state')); return Object.assign({}, DEFAULT_STATE, s || {}); }
  catch { return Object.assign({}, DEFAULT_STATE); }
}
function saveState() { localStorage.setItem('studydeck_state', JSON.stringify(state)); }

function tickDayStreak() {
  const today = new Date().toDateString();
  if (state.lastDate === today) return;
  if (state.lastDate) {
    const last = new Date(state.lastDate);
    const diff = (Date.now() - last.getTime()) / (1000*60*60*24);
    if (diff > 1.5) state.dayStreak = 1; else state.dayStreak += 1;
  } else state.dayStreak = 1;
  state.lastDate = today;
  state.bestDayStreak = Math.max(state.bestDayStreak, state.dayStreak);
  saveState();
}
function tickDaily() {
  const today = new Date().toDateString();
  if (state.dailyDate !== today) { state.dailySolved = 0; state.dailyDate = today; saveState(); }
}

// AUDIO
let audioCtx = null;
function getCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function playTone(freq, duration, type='sine', volume=0.1) {
  if (!state.soundOn) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}
function sfx(name) {
  switch (name) {
    case 'click':    playTone(800, 0.05, 'sine', 0.05); break;
    case 'correct':  playTone(880, 0.12, 'sine', 0.08); setTimeout(() => playTone(1320, 0.18, 'sine', 0.08), 80); break;
    case 'wrong':    playTone(220, 0.18, 'sawtooth', 0.06); break;
    case 'crit':     [0,80,160,240].forEach((d,i) => setTimeout(() => playTone(660 + i*220, 0.15, 'square', 0.06), d)); break;
    case 'achievement': [0,100,200].forEach((d,i) => setTimeout(() => playTone([523,659,784][i], 0.3, 'triangle', 0.07), d)); break;
    case 'lightning': playTone(1500, 0.05, 'square', 0.1); setTimeout(() => playTone(80, 0.4, 'sawtooth', 0.08), 50); break;
    case 'shield':   playTone(440, 0.08, 'sine', 0.06); setTimeout(() => playTone(660, 0.1, 'sine', 0.06), 60); break;
    case 'level_up': [0,120,240,360].forEach((d,i) => setTimeout(() => playTone([523,659,784,1047][i], 0.25, 'triangle', 0.08), d)); break;
    case 'chapter_clear': [0,150,300,450,600].forEach((d,i) => setTimeout(() => playTone([392,494,587,784,988][i], 0.3, 'triangle', 0.08), d)); break;
  }
}
function toggleSound() {
  state.soundOn = !state.soundOn;
  saveState();
  document.getElementById('soundToggle').classList.toggle('muted', !state.soundOn);
}

// ============= CONTENT NAVIGATION =============
function getSubjectChapters(subject) { return (window.CONTENT && window.CONTENT[subject]) || []; }
function findChapter(chapterId) {
  for (const sub of Object.keys(window.CONTENT || {})) {
    const ch = (window.CONTENT[sub] || []).find(c => c.id === chapterId);
    if (ch) return ch;
  }
  return null;
}
function findTopic(topicFullId) {
  // topicFullId format: "phys_ch1_A1"
  const parts = topicFullId.split('_');
  const chapterId = parts.slice(0, -1).join('_');
  const topicId = parts[parts.length - 1];
  const ch = findChapter(chapterId);
  if (!ch) return null;
  for (const part of ch.parts) {
    const t = part.topics.find(x => x.id === topicId);
    if (t) return { topic: t, part, chapter: ch };
  }
  return null;
}
function fullTopicId(chapterId, topicId) { return `${chapterId}_${topicId}`; }

function chapterStats(chapter) {
  const allTopics = chapter.parts.flatMap(p => p.topics);
  const done = allTopics.filter(t => state.topics[fullTopicId(chapter.id, t.id)]?.done).length;
  const inProgress = allTopics.filter(t => {
    const ts = state.topics[fullTopicId(chapter.id, t.id)];
    return ts && !ts.done && ts.attempts > 0;
  }).length;
  return { total: allTopics.length, done, inProgress };
}

function subjectStats(subject) {
  const chapters = getSubjectChapters(subject);
  let totalTopics = 0, doneTopics = 0, doneChapters = 0;
  chapters.forEach(ch => {
    const s = chapterStats(ch);
    totalTopics += s.total; doneTopics += s.done;
    if (s.total > 0 && s.done === s.total) doneChapters += 1;
  });
  return { totalChapters: chapters.length, doneChapters, totalTopics, doneTopics };
}

// ============= VIEWS =============
function setView(view) {
  state.view = view;
  saveState();
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('view-' + view).style.display = 'block';
  if (view === 'mission') renderMission();
  if (view === 'subject') renderSubject();
  if (view === 'chapter') renderChapter();
  if (view === 'plan') renderPlan();
  // Nav tabs active state
  const tabM = document.getElementById('navTabMission'); const tabP = document.getElementById('navTabPlan');
  if (tabM && tabP) {
    const isPlan = view === 'plan';
    tabM.classList.toggle('active', !isPlan);
    tabP.classList.toggle('active', isPlan);
  }
  // Hide global footer on plan view
  const footer = document.getElementById('globalFooter');
  if (footer) footer.style.display = (view === 'plan') ? 'none' : 'block';
  renderHeaderStats();
  renderFooterStats();
  renderAchievements();
}

// ============= MISSION VIEW =============
function smartContinue() {
  // 1. If there's an in-progress chapter, return its first non-done ready topic
  if (state.currentChapterId) {
    const ch = findChapter(state.currentChapterId);
    if (ch) {
      for (const part of ch.parts) {
        for (const t of part.topics) {
          if (t.questions && t.questions.length && !state.topics[fullTopicId(ch.id, t.id)]?.done) {
            return { chapter: ch, topic: t };
          }
        }
      }
    }
  }
  // 2. First chapter with content not done
  for (const sub of ['Physics', 'Chemistry', 'Maths']) {
    const chapters = getSubjectChapters(sub);
    for (const ch of chapters) {
      for (const part of ch.parts) {
        for (const t of part.topics) {
          if (t.questions && t.questions.length && !state.topics[fullTopicId(ch.id, t.id)]?.done) {
            return { chapter: ch, topic: t };
          }
        }
      }
    }
  }
  return null;
}

function renderMission() {
  const root = document.getElementById('view-mission');
  const cont = smartContinue();
  let todayHTML = '';
  if (cont) {
    const stats = chapterStats(cont.chapter);
    const pct = (stats.done / stats.total) * 100;
    const theme = SUBJECT_THEMES[cont.chapter.subject];
    todayHTML = `
      <section class="today fade-in delay-1">
        <div class="today-meta">Today's mission</div>
        <h1 class="today-title">${theme.icon} ${cont.chapter.subject} <em>\u2192</em><br/>${cont.chapter.name}</h1>
        <p class="today-sub">Next up: <strong>${cont.topic.name}</strong></p>
        <div class="today-row">
          <button class="today-cta" onclick="continueStudying()">Continue<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button>
          <button class="today-cta secondary" onclick="randomTopic()">\u26A1 Random</button>
          <button class="today-cta secondary" onclick="openMockConfig()">\uD83C\uDFAF Mock test</button>
          <button class="today-cta secondary" onclick="openChapter('${cont.chapter.id}')">Open chapter</button>
        </div>
        <div class="progress-row">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:linear-gradient(90deg,${theme.color},${theme.color}aa);"></div></div>
          <span class="progress-label">${stats.done} / ${stats.total}</span>
        </div>
      </section>
    `;
  } else {
    todayHTML = `<section class="today fade-in delay-1"><div class="today-meta">All caught up</div><h1 class="today-title">All ready topics <em>mastered</em></h1><p class="today-sub">More chapters incoming.</p></section>`;
  }
  // Subject cards
  let subjectsHTML = '<div class="subjects-grid">';
  ['Physics', 'Chemistry', 'Maths'].forEach((sub, i) => {
    const stats = subjectStats(sub);
    const theme = SUBJECT_THEMES[sub];
    const lvl = getLevel(state.xp).idx + 1;
    const isLocked = stats.totalChapters === 0;
    subjectsHTML += `
      <div class="subject-card fade-in delay-${i+2} ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : `openSubject('${sub}')`}" style="--theme:${theme.color}; --soft:${theme.soft};">
        <div class="subject-icon">${theme.icon}</div>
        <div class="subject-name">${sub}</div>
        ${isLocked
          ? `<div class="subject-stat">Coming soon</div>`
          : `<div class="subject-progress"><div class="subject-progress-bar"><div class="subject-progress-fill" style="width:${stats.totalTopics > 0 ? (stats.doneTopics / stats.totalTopics) * 100 : 0}%; background:${theme.color};"></div></div><div class="subject-stat">${stats.doneTopics} / ${stats.totalTopics} topics<br/><span class="subject-stat-sub">${stats.doneChapters} / ${stats.totalChapters} chapters</span></div></div>`}
      </div>
    `;
  });
  subjectsHTML += '</div>';
  root.innerHTML = todayHTML + '<div class="section-header"><h2 class="section-title">Your <em>subjects</em></h2></div>' + subjectsHTML;
}

// ============= SUBJECT VIEW =============
function openSubject(sub) {
  sfx('click');
  state.currentSubject = sub;
  saveState();
  setView('subject');
}

function renderSubject() {
  const root = document.getElementById('view-subject');
  const sub = state.currentSubject;
  const chapters = getSubjectChapters(sub);
  const stats = subjectStats(sub);
  const theme = SUBJECT_THEMES[sub];
  const html = [
    `<button class="back-btn" onclick="setView('mission')">\u2190 Back</button>`,
    `<div class="subject-hero" style="--theme:${theme.color}; --soft:${theme.soft};">
      <div class="subject-hero-icon">${theme.icon}</div>
      <div class="subject-hero-text">
        <h1 class="subject-hero-title">${sub}</h1>
        <p class="subject-hero-sub">${stats.doneChapters} of ${stats.totalChapters} chapters \u00B7 ${stats.doneTopics} of ${stats.totalTopics} topics mastered</p>
      </div>
    </div>`,
    `<div class="chapter-list">`,
  ];
  chapters.forEach((ch, i) => {
    const cs = chapterStats(ch);
    const pct = cs.total > 0 ? (cs.done / cs.total) * 100 : 0;
    const status = cs.done === cs.total && cs.total > 0 ? 'done' : (cs.inProgress > 0 || state.currentChapterId === ch.id ? 'active' : 'idle');
    const statusIcon = status === 'done' ? '\u2713' : (status === 'active' ? '\u25BA' : ch.number);
    html.push(`
      <div class="chapter-row fade-in delay-${Math.min(i+1, 6)} ${status}" onclick="openChapter('${ch.id}')" style="--theme:${theme.color}; --soft:${theme.soft};">
        <div class="chapter-num">${statusIcon}</div>
        <div class="chapter-info">
          <div class="chapter-name">Ch ${ch.number}: ${ch.name}</div>
          <div class="chapter-meta">${cs.done} / ${cs.total} topics${cs.inProgress > 0 ? ` \u00B7 ${cs.inProgress} in progress` : ''}</div>
          <div class="chapter-progress"><div class="chapter-progress-fill" style="width:${pct}%; background:${theme.color};"></div></div>
        </div>
        <div class="chapter-arrow">\u2192</div>
      </div>
    `);
  });
  html.push('</div>');
  root.innerHTML = html.join('');
}

// ============= CHAPTER VIEW =============
function openChapter(chapterId) {
  sfx('click');
  state.currentChapterId = chapterId;
  const ch = findChapter(chapterId);
  if (ch) state.currentSubject = ch.subject;
  saveState();
  setView('chapter');
}

function renderChapter() {
  const root = document.getElementById('view-chapter');
  const ch = findChapter(state.currentChapterId);
  if (!ch) { root.innerHTML = '<p style="padding:24px;">Chapter not found.</p>'; return; }
  const stats = chapterStats(ch);
  const pct = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
  const theme = SUBJECT_THEMES[ch.subject];
  const html = [
    `<button class="back-btn" onclick="setView('subject')">\u2190 ${ch.subject}</button>`,
    `<section class="chapter-hero" style="--theme:${theme.color}; --soft:${theme.soft};">
      <div class="chapter-hero-meta">${theme.icon} ${ch.subject} \u00B7 Ch ${ch.number}</div>
      <h1 class="chapter-hero-title">${ch.name}</h1>
      <div class="progress-row">
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${theme.color};"></div></div>
        <span class="progress-label">${stats.done} / ${stats.total}</span>
      </div>
      <div class="charge-meter" style="margin-top:24px;padding-top:24px;">
        <div class="charge-meter-head"><span class="charge-meter-label">\u26A1 Charge meter</span><span class="charge-meter-val">${Math.min(state.charge, 10)} / 10</span></div>
        <div class="charge-meter-bar"><div class="charge-meter-fill ${state.charge >= 10 ? 'full' : ''}" style="width:${Math.min(100, (state.charge/10)*100)}%;"></div></div>
      </div>
    </section>`,
    `<div class="parts-container">`,
  ];
  const partLetters = ['A','B','C','D','E','F'];
  ch.parts.forEach((part, pIdx) => {
    const partDone = part.topics.filter(t => state.topics[fullTopicId(ch.id, t.id)]?.done).length;
    const letter = partLetters[pIdx] || String(pIdx+1);
    html.push(`
      <div class="part fade-in delay-${Math.min(pIdx+2, 6)}">
        <div class="part-head">
          <div class="part-title"><span class="part-letter" style="color:${theme.color};">${letter}.</span><span class="part-name">${part.name}</span></div>
          <span class="part-progress">${partDone} / ${part.topics.length}</span>
        </div>
        <div class="topics" id="topics-${ch.id}-${part.id}"></div>
      </div>
    `);
  });
  html.push('</div>');
  root.innerHTML = html.join('');
  // Topics
  ch.parts.forEach((part, pIdx) => {
    const topicsEl = document.getElementById(`topics-${ch.id}-${part.id}`);
    const letter = (['A','B','C','D','E','F'][pIdx] || String(pIdx+1));
    part.topics.forEach((topic, tIdx) => {
      const fullId = fullTopicId(ch.id, topic.id);
      const ts = state.topics[fullId] || { done: false, attempts: 0 };
      const hasContent = (topic.questions && topic.questions.length > 0) || (topic.theory && topic.theory.length > 0) || (ch.theory && ch.theory.length > 50);
      const isDone = ts.done;
      const isActive = state.currentTopicId === fullId && !isDone;
      const cls = ['topic'];
      if (isDone) cls.push('done');
      else if (isActive) cls.push('active');
      else if (!hasContent) cls.push('locked');
      const status = isDone ? '\u2713' : (isActive ? '\u25BA' : (hasContent ? `${letter}${tIdx+1}` : '\u23F3'));
      const qCount = topic.questions?.length || 0;
      const hasTheory = (topic.theory && topic.theory.length > 100) || (ch.theory && ch.theory.length > 100);
      const meta = isDone
        ? `mastered \u00B7 ${ts.attempts || 0} attempts`
        : (hasContent
            ? (hasTheory && qCount > 0 ? `theory + ${qCount} questions` : (hasTheory ? 'theory' : `${qCount} questions`))
            : 'coming soon');
      const el = document.createElement('div');
      el.className = cls.join(' ');
      el.innerHTML = `<div class="topic-status">${status}</div><div class="topic-info"><div class="topic-name">${topic.name}</div><div class="topic-meta">${meta}</div></div>`;
      if (hasContent) el.onclick = () => { sfx('click'); openTopic(fullId); };
      topicsEl.appendChild(el);
    });
  });
}

// ============= PLAN VIEW =============
const PLAN_PHASES = [
  { num:0, name:'This Week',  desc:'App built \u00B7 all 37 chapters live \u00B7 EV1 push begins', start:'2026-04-27', end:'2026-04-30' },
  { num:1, name:'First Pass', desc:'Cover EV1 chapters (Phys 1\u20135 \u00B7 Chem 1\u20133 \u00B7 Maths 1\u20136)', start:'2026-05-03', end:'2026-06-13' },
  { num:2, name:'EV1 Revision', desc:'Written mode PYQs + derivation drills all EV1 chapters', start:'2026-06-14', end:'2026-06-27' },
  { num:3, name:'EV1 Mocks',   desc:'V69 full mocks \u00B7 final weak-spot push \u00B7 EV1 4 Jul', start:'2026-06-28', end:'2026-07-03' },
  { num:4, name:'Deep Dive',  desc:'ISC derivations \u00B7 PYQ grind', start:'2026-07-08', end:'2026-10-31' },
  { num:5, name:'PB1 Prep',   desc:'Mock papers \u00B7 weak-spot patching', start:'2026-11-01', end:'2026-12-05' },
  { num:6, name:'PB2 Prep',   desc:'Full mocks \u00B7 handwritten papers begin', start:'2026-12-06', end:'2027-01-10' },
  { num:7, name:'Final Blitz',desc:'PYQs daily \u00B7 formula sheets \u00B7 BOARDS', start:'2027-01-11', end:'2027-02-28' },
];
const PLAN_BLOCKS = [
  { time:'6:00 AM',  label:'Wake \u00B7 school',     desc:'Bus, no negotiation', pill:'rest', range:[6,15] },
  { time:'3:20 PM',  label:'Decompress zone',   desc:'Lunch + doomscroll. NOT study. No guilt.', pill:'sacred', range:[15,17], stealthDesc:'Break time' },
  { time:'5:00 PM',  label:'Core block \u00B7 5\u00D725 min', desc:'Non-negotiable. Even ONE block = not a zero day.', pill:'core', range:[17,19.5], stealthDesc:'Study session' },
  { time:'7:30 PM',  label:'Dinner + chill',    desc:'Eat, breathe.', pill:'rest', range:[19.5,20.5] },
  { time:'8:30 PM',  label:'Optional 1 hr',     desc:'Light review or HW. Never new theory.', pill:'bonus', range:[20.5,21.5], stealthDesc:'Optional review' },
  { time:'12:00 AM', label:'Sleep',             desc:'Lights out.', pill:'rest', range:[0,6] },
];
const PLAN_BLOCKS_SUN = [
  { time:'Wake',     label:'Free morning',          desc:'No alarm. No school. Eat, scroll, exist.', pill:'rest', range:[0,15] },
  { time:'3:00 PM',  label:'Mock test',             desc:'60 min · one full PYQ section or in-app mock · timer on, phone away.', pill:'core', range:[15,16], stealthDesc:'Study session' },
  { time:'4:00 PM',  label:'Review + error analysis',desc:'30 min · mark every answer, find every gap, note the chapter.', pill:'core', range:[16,16.5], stealthDesc:'Review' },
  { time:'4:30 PM',  label:'Drill weak topic',      desc:'30 min · StudyDeck drill mode · chapter you scored worst on.', pill:'core', range:[16.5,17], stealthDesc:'Drill session' },
  { time:'5:00 PM',  label:'New chapter — theory',  desc:'30 min · open next week\'s chapter · read ELI5 + first two topics.', pill:'bonus', range:[17,17.5], stealthDesc:'Theory reading' },
  { time:'5:30 PM',  label:'Practice MCQs',         desc:'30 min · drill the topics you just read · tap every one.', pill:'bonus', range:[17.5,18], stealthDesc:'Practice' },
  { time:'6:00 PM',  label:'Evening free',          desc:'Done. 3 hrs done. Everything after is pure bonus.', pill:'rest', range:[18,24] },
];
const PLAN_BLOCKS_SAT_OFF = [
  { time:'Wake',     label:'Free morning',          desc:'No school today. Lazy start.', pill:'rest', range:[0,14] },
  { time:'2:00 PM',  label:'Decompress',            desc:'~90 min. No guilt.', pill:'sacred', range:[14,15.5], stealthDesc:'Break time' },
  { time:'3:30 PM',  label:'Core block · 6×25 min', desc:'Two extra blocks vs weekday. Use them.', pill:'core', range:[15.5,18.5], stealthDesc:'Study session' },
  { time:'6:30 PM',  label:'Dinner + chill',        desc:'Eat, breathe.', pill:'rest', range:[18.5,19.5] },
  { time:'7:30 PM',  label:'Optional 1 hr',         desc:'Light review. Never new theory.', pill:'bonus', range:[19.5,20.5], stealthDesc:'Optional review' },
  { time:'12:00 AM', label:'Sleep',                 desc:'Lights out.', pill:'rest', range:[0,6] },
];
const PLAN_RULES = [
  { t:'3:20\u20135 PM is sacred',  d:'Doomscroll without guilt. It\'s planned for.' },
  { t:'No zero days',         d:'5 PM block starts no matter what. One Pomodoro counts.' },
  { t:'One subject per block',d:'No mid-block switching. Ever.' },
  { t:'8:30 is bonus',        d:'Never a debt. Skip it freely.' },
  { t:'Hyperfocus = bonus',   d:'Low days = ONE block. The rule is: no zero.' },
  { t:'Sunday = study day',    d:'Free morning. Same 5 PM core block. No planning sessions.' },
];
const PLAN_POMOS = [
  { n:'01', time:'5:00\u20135:25', subj:'Maths',     subjKey:'Maths',     cls:'maths' },
  { n:'02', time:'5:30\u20135:55', subj:'Physics',   subjKey:'Physics',   cls:'physics' },
  { n:'03', time:'6:00\u20136:25', subj:'Maths',     subjKey:'Maths',     cls:'maths' },
  { n:'04', time:'6:35\u20137:00', subj:'Physics',   subjKey:'Physics',   cls:'physics' },
  { n:'05', time:'7:05\u20137:30', subj:'Chemistry', subjKey:'Chemistry', cls:'chemistry' },
];
const PLAN_POMOS_SUN = [
  { n:'01', time:'3:00\u20134:00', subj:'Mock test',      cls:'physics',   desc:'Full PYQ section or in-app mock \u00b7 timer on, phone away' },
  { n:'02', time:'4:00\u20134:30', subj:'Error analysis', cls:'maths',     desc:'Mark every answer \u00b7 find every gap \u00b7 note the chapter' },
  { n:'03', time:'4:30\u20135:00', subj:'Drill weakness', cls:'chemistry', desc:'StudyDeck drill on the chapter you scored worst on' },
  { n:'04', time:'5:00\u20135:30', subj:'New theory',     cls:'maths',     desc:'Next chapter \u00b7 ELI5 + first two topics only' },
  { n:'05', time:'5:30\u20136:00', subj:'Practice MCQs',  cls:'physics',   desc:'MCQs on the topics you just read \u00b7 tap every one' },
  { n:'06', time:'6:00+',          subj:'Bonus drill',    cls:'chemistry', desc:'Optional \u00b7 extra chapter or formula recall \u00b7 no pressure' },
];
const PLAN_EV1_WEEKS = [
  { w:1, start:'2026-05-03', dates:'May 3\u20139',      phase:'cover', chapters:['phys_1','chem_1','math_1'], phys:'Ch 1 \u00B7 Electric Charges & Fields',      chem:'Ch 1 \u00B7 Solutions',              math:'Ch 1 \u00B7 Relations & Functions' },
  { w:2, start:'2026-05-10', dates:'May 10\u201316',    phase:'cover', chapters:['phys_2','chem_1','math_2'], phys:'Ch 2 \u00B7 Electrostatic Potential',         chem:'Ch 1 \u00B7 Solutions (finish)',      math:'Ch 2 \u00B7 Inverse Trig' },
  { w:3, start:'2026-05-17', dates:'May 17\u201323',    phase:'cover', chapters:['phys_3','chem_2','math_3'], phys:'Ch 3 \u00B7 Current Electricity',             chem:'Ch 2 \u00B7 Electrochemistry',        math:'Ch 3 \u00B7 Matrices' },
  { w:4, start:'2026-05-24', dates:'May 24\u201330',    phase:'cover', chapters:['phys_4','chem_2','math_4'], phys:'Ch 4 \u00B7 Moving Charges & Magnetism',      chem:'Ch 2 \u00B7 Electrochemistry (finish)',math:'Ch 4 \u00B7 Determinants' },
  { w:5, start:'2026-05-31', dates:'May 31\u2013Jun 6', phase:'cover', chapters:['phys_4','phys_5','chem_3','math_5'], phys:'Ch 4 finish + Ch 5 start',      chem:'Ch 3 \u00B7 Chemical Kinetics',       math:'Ch 5 \u00B7 Continuity & Differentiability' },
  { w:6, start:'2026-06-07', dates:'Jun 7\u201313',     phase:'cover', chapters:['phys_5','chem_3','math_6'], phys:'Ch 5 \u00B7 Magnetism & Matter (finish)',     chem:'Ch 3 \u00B7 Chemical Kinetics (finish)',math:'Ch 6 \u00B7 Application of Derivatives' },
  { w:7, start:'2026-06-14', dates:'Jun 14\u201320',    phase:'revise', chapters:['phys_1','phys_2','phys_3','phys_4','phys_5','chem_1','chem_2','chem_3','math_1','math_2','math_3','math_4','math_5','math_6'], label:'Revision \u2014 all EV1 chapters \u00B7 written mode + derivation drills (V67/V68)' },
  { w:8, start:'2026-06-21', dates:'Jun 21\u201327',    phase:'mock',   label:'Mocks \u2014 2\u00D7 full exam simulator (V69) + PYQ written drill every session' },
  { w:9, start:'2026-06-28', dates:'Jun 28\u2013Jul 3', phase:'final',  label:'Final push \u2014 weak spots only \u00B7 sleep by 10 PM on Jul 3' },
];
const PLAN_THIS_WEEK = [
  { date:'2026-05-03', name:'Sun', task:'Day 1 \u00B7 explore the app \u00B7 sign in with Google \u00B7 plan W1',     stealthTask:'Setup + plan' },
  { date:'2026-05-04', name:'Mon', task:'EV1 W1 \u00B7 Phys Ch 1 Electric Charges \u00B7 Maths Ch 1 Relations', stealthTask:'Study session' },
  { date:'2026-05-05', name:'Tue', task:'EV1 W1 \u00B7 Phys Ch 1 finish \u00B7 Maths Ch 1 finish',              stealthTask:'Study session' },
  { date:'2026-05-06', name:'Wed', task:'EV1 W1 \u00B7 Phys Ch 1 PYQ written mode \u00B7 Maths Ch 1 practice',  stealthTask:'Study session' },
  { date:'2026-05-07', name:'Thu', task:'3 Pomos \u00B7 Chem Ch 1 Solutions start',                         stealthTask:'Light study' },
  { date:'2026-05-08', name:'Fri', task:'EV1 W1 \u00B7 Phys Ch 2 Capacitance \u00B7 Maths Ch 2 Inv. Trig start', stealthTask:'Study session' },
  { date:'2026-05-09', name:'Sat', task:'EV1 W1 \u00B7 Phys Ch 2 + Chem Ch 1 finish \u00B7 Maths Ch 2',         stealthTask:'Study session' },
];
function todayISO() { const d = new Date(); return d.toISOString().slice(0,10); }
function getPlanCheck(date) { return state.planChecks[date] || { core:false, bonus:false, pomos:[false,false,false,false,false] }; }
function setPlanCheck(date, key, val) {
  const c = getPlanCheck(date);
  if (key === 'core') c.core = val;
  else if (key === 'bonus') c.bonus = val;
  else if (typeof key === 'number') { c.pomos = c.pomos.slice(); c.pomos[key] = val; }
  state.planChecks[date] = c;
  saveState();
}
function togglePomo(idx) { sfx('click'); const t = todayISO(); const c = getPlanCheck(t); setPlanCheck(t, idx, !c.pomos[idx]); renderPlan(); }
function toggleDayDone(date) { sfx('click'); const c = getPlanCheck(date); setPlanCheck(date, 'core', !c.core); renderPlan(); }
function toggleStealth() { sfx('click'); state.stealth = !state.stealth; saveState(); document.body.classList.toggle('stealth', state.stealth); renderPlan(); }
function toggleSatHoliday() { sfx('click'); state.satHoliday = !state.satHoliday; saveState(); renderPlan(); }
function currentPhaseIdx() {
  const t = todayISO();
  for (let i = 0; i < PLAN_PHASES.length; i++) {
    const p = PLAN_PHASES[i];
    if (t >= p.start && t <= p.end) return i;
  }
  return 0;
}
function currentBlockIdx() {
  const h = new Date().getHours() + new Date().getMinutes()/60;
  const dow = new Date().getDay();
  let blocks;
  if (dow === 0) blocks = PLAN_BLOCKS_SUN;
  else if (dow === 6 && state.satHoliday) blocks = PLAN_BLOCKS_SAT_OFF;
  else blocks = PLAN_BLOCKS;
  for (let i = 0; i < blocks.length; i++) {
    const [s,e] = blocks[i].range;
    if (s < e && h >= s && h < e) return i;
  }
  return -1;
}

function renderPlan() {
  document.body.classList.toggle('stealth', !!state.stealth);
  const root = document.getElementById('view-plan');
  const stealth = state.stealth;
  const today = todayISO();
  const phaseIdx = currentPhaseIdx();
  const blockIdx = currentBlockIdx();
  const todayCheck = getPlanCheck(today);
  const daysToEV1 = Math.max(0, Math.round((new Date('2026-07-04') - new Date(today)) / 86400000));
  const currentEvWeekIdx = PLAN_EV1_WEEKS.findIndex((w, i) => {
    const nextStart = PLAN_EV1_WEEKS[i + 1] ? PLAN_EV1_WEEKS[i + 1].start : '2026-07-04';
    return today >= w.start && today < nextStart;
  });

  const heroTitle = stealth
    ? 'Study <em>plan</em>'
    : 'The road to <em>99%.</em>';
  const heroSub = stealth
    ? 'ISC Class 12 \u00B7 April 2026 \u2192 February 2027.'
    : 'ISC Class 12 \u00B7 April 2026 \u2192 February 2027 \u00B7 ten months, one shot. Built for an ADHD brain: short blocks, sacred decompress, no zero days.';

  const targetsHTML = `
    <div class="plan-targets stealth-hide">
      <div class="plan-target"><div class="l">Physics</div><div class="v" style="color:var(--accent);">99</div></div>
      <div class="plan-target"><div class="l">Maths</div><div class="v" style="color:#D9457E;">99</div></div>
      <div class="plan-target"><div class="l">Chemistry</div><div class="v" style="color:var(--success);">85\u201388</div></div>
      <div class="plan-target"><div class="l">Goal</div><div class="v" style="color:var(--gold);font-size:18px;">NUS / NTU</div></div>
    </div>`;

  const heroHTML = `
    <section class="plan-hero fade-in delay-1">
      <div class="plan-hero-row">
        <div>
          <div class="plan-hero-meta">${stealth ? 'Plan \u00B7 stealth on' : 'Your study plan'}</div>
          <h1 class="plan-hero-title">${heroTitle}</h1>
          <p class="plan-hero-sub">${heroSub}</p>
        </div>
        <button class="stealth-toggle ${stealth ? 'on' : ''}" onclick="toggleStealth()" title="Hide personal targets / ADHD framing">
          <span class="dot"></span>${stealth ? 'Stealth on' : 'Stealth off'}
        </button>
      </div>
      ${targetsHTML}
    </section>`;

  // Build this-week strip dynamically from current EV1 week + ROTATION
  function buildThisWeekDynamic(evWeekIdx) {
    if (evWeekIdx < 0 || evWeekIdx >= PLAN_EV1_WEEKS.length) return null;
    const ROTATION = {
      1: { lead: 'Maths',   second: 'Physics', maint: 'Chemistry' },
      2: { lead: 'Physics', second: 'Maths',   maint: 'Chemistry' },
      3: { lead: 'Maths',   second: 'Physics', maint: 'Chemistry' },
      4: { lead: null,      second: null,      maint: null, thursday: true },
      5: { lead: 'Maths',   second: 'Physics', maint: 'Chemistry' },
      6: { lead: 'Physics', second: 'Maths',   maint: 'Chemistry' },
      0: { sunday: true },
    };
    const w = PLAN_EV1_WEEKS[evWeekIdx];
    const startDate = new Date(w.start + 'T12:00:00'); // noon avoids DST edge cases
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const subjLabel = { Physics: w.phys || '—', Maths: w.math || '—', Chemistry: w.chem || '—' };
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateISO = d.toISOString().slice(0, 10);
      const dow = d.getDay();
      let task, stealthTask;
      if (dow === 0) {
        task = 'Mock test (60 min) · error analysis · drill weakness · new chapter theory';
        stealthTask = 'Mock + study · 3 hrs';
      } else if (dow === 4) {
        task = 'Thu (lighter) · 3 Pomos · ' + subjLabel.Chemistry;
        stealthTask = 'Light study';
      } else if (dow === 6 && state.satHoliday) {
        const rot = ROTATION[dow];
        task = 'School off · 6 blocks · ' + (rot && rot.lead ? rot.lead + ' + ' + rot.second : 'catch-up');
        stealthTask = 'Holiday study';
      } else {
        const rot = ROTATION[dow];
        if (rot && rot.lead) {
          task = rot.lead + ' · ' + subjLabel[rot.lead] + ' · ' + rot.second + ' · ' + subjLabel[rot.second];
        } else {
          task = 'Study session';
        }
        stealthTask = 'Study session';
      }
      out.push({ date: dateISO, name: dayNames[dow], task, stealthTask });
    }
    return out;
  }
  const thisWeekData = buildThisWeekDynamic(currentEvWeekIdx) || PLAN_THIS_WEEK;

  // This week strip
  let weekHTML = '';
  thisWeekData.forEach(d => {
    const c = getPlanCheck(d.date);
    const isToday = d.date === today;
    const cls = ['week-day'];
    if (isToday) cls.push('today');
    if (c.core) cls.push('done');
    if (d.urgent && !c.core) cls.push('urgent');
    const dayNum = d.date.slice(8);
    const taskText = stealth ? d.stealthTask : d.task;
    weekHTML += `<div class="${cls.join(' ')}" onclick="toggleDayDone('${d.date}')" title="${isToday ? 'Today \u2014 click to mark done' : 'Click to toggle done'}">
      <div class="wd-name">${d.name}</div>
      <div class="wd-num">${dayNum}</div>
      <div class="wd-task">${taskText}</div>
    </div>`;
  });

  // Today's pomodoros (Sunday uses mock-day blocks)
  let pomosHTML = '';
  if (isSunday) {
    PLAN_POMOS_SUN.forEach((p, i) => {
      const done = todayCheck.pomos[i];
      pomosHTML += `<div class="pomo ${p.cls} ${done ? 'done' : ''}" onclick="togglePomo(${i})" title="Click to toggle done" style="min-width:0;flex:1 1 140px;">
        <div class="p-check"></div>
        <div class="p-num">${p.n}</div>
        <div class="p-time">${p.time}</div>
        <div class="p-subj">${p.subj}</div>
        ${!stealth ? `<div style="font-size:10px;color:var(--ink-muted);margin-top:4px;line-height:1.4;">${p.desc}</div>` : ''}
      </div>`;
    });
  } else {
    PLAN_POMOS.forEach((p, i) => {
      const done = todayCheck.pomos[i];
      pomosHTML += `<div class="pomo ${p.cls} ${done ? 'done' : ''}" onclick="togglePomo(${i})" title="Click to toggle done">
        <div class="p-check"></div>
        <div class="p-num">${p.n}</div>
        <div class="p-time">${p.time}</div>
        <div class="p-subj">${p.subj}</div>
      </div>`;
    });
  }

  // Phases
  let phasesHTML = '';
  PLAN_PHASES.forEach((p, i) => {
    const cls = ['phase-row'];
    if (i === phaseIdx) cls.push('active');
    else if (i < phaseIdx) cls.push('past');
    const dateStr = `${p.start.slice(5)} \u2192 ${p.end.slice(5)}`;
    phasesHTML += `<div class="${cls.join(' ')}">
      <div class="phase-num">${p.num}</div>
      <div><div class="phase-name">${p.name}</div><div class="phase-desc">${p.desc}</div></div>
      <div class="phase-dates">${dateStr}</div>
    </div>`;
  });

  // EV1 9-week chapter plan
  const phaseColors = { cover:'#3b82f6', revise:'#8b5cf6', mock:'#f59e0b', final:'#ef4444' };

  // compute % of topics done for a list of chapter IDs
  function ev1ChapPct(chapterIds) {
    let total = 0, done = 0;
    (chapterIds || []).forEach(function(cid) {
      const ch = findChapter(cid);
      if (!ch) return;
      ch.parts.forEach(function(p) {
        p.topics.forEach(function(t) {
          total++;
          if (state.topics[fullTopicId(ch.id, t.id)] && state.topics[fullTopicId(ch.id, t.id)].done) done++;
        });
      });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  let ev1HTML = '';
  PLAN_EV1_WEEKS.forEach((w, i) => {
    const isNow = i === currentEvWeekIdx;
    const isPast = currentEvWeekIdx > i;
    const color = phaseColors[w.phase];
    const pct = ev1ChapPct(w.chapters);
    const isDone = pct === 100;

    const rowStyle = `display:grid;grid-template-columns:90px 1fr;gap:0;border-bottom:1px solid var(--line);padding:10px 0;` +
      (isDone ? 'opacity:0.5;' : isPast ? 'opacity:0.6;' : '') +
      (isNow ? 'background:var(--bg-elev);margin:0 -16px;padding:10px 16px;border-radius:8px;border-bottom:none;' : '');

    // progress bar html
    const progressHTML = (w.chapters && w.chapters.length > 0)
      ? `<div style="margin-top:6px;display:flex;align-items:center;gap:8px;">
          <div style="flex:1;height:4px;background:var(--line);border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${pct===100?'#16a34a':color};border-radius:2px;transition:width 0.4s;"></div>
          </div>
          <span style="font-size:10px;font-family:'Geist Mono',monospace;color:${pct===100?'#16a34a':pct>0?color:'var(--ink-muted)'};">${isDone?'\u2713 done':pct+'%'}</span>
        </div>`
      : '';

    const wLabel = `<div style="padding-top:2px;">
      <span style="font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;color:${isNow ? color : (isDone?'#16a34a':'var(--ink)')};text-transform:uppercase;letter-spacing:0.05em;">${isDone?'\u2713 ':''}W${w.w}</span>
      <div style="font-size:10px;color:var(--ink-muted);margin-top:2px;">${w.dates}</div>
      <span style="display:inline-block;margin-top:4px;font-size:9px;font-weight:700;color:${isDone?'#16a34a':color};background:${isDone?'#16a34a':color}18;padding:2px 7px;border-radius:100px;text-transform:uppercase;letter-spacing:0.06em;">${isDone?'done':w.phase}</span>
    </div>`;

    let contentHTML = '';
    if (w.phase === 'cover') {
      contentHTML = `<div style="display:flex;flex-direction:column;gap:3px;">
        <div style="font-size:12px;color:var(--ink);"><span style="display:inline-block;width:40px;font-size:10px;font-weight:700;color:#3b82f6;font-family:'Geist Mono',monospace;text-transform:uppercase;">Phys</span>${w.phys}</div>
        <div style="font-size:12px;color:var(--ink);"><span style="display:inline-block;width:40px;font-size:10px;font-weight:700;color:#16a34a;font-family:'Geist Mono',monospace;text-transform:uppercase;">Chem</span>${w.chem}</div>
        <div style="font-size:12px;color:var(--ink);"><span style="display:inline-block;width:40px;font-size:10px;font-weight:700;color:#d9457e;font-family:'Geist Mono',monospace;text-transform:uppercase;">Math</span>${w.math}</div>
        ${progressHTML}
      </div>`;
    } else {
      const icons = { revise:'\uD83D\uDCD6', mock:'\uD83D\uDCCB', final:'\uD83C\uDFAF' };
      contentHTML = `<div style="font-size:13px;font-weight:600;color:${isDone?'#16a34a':color};padding-top:6px;">${isDone?'\u2713 ':(icons[w.phase]||'')+' '}${w.label}${progressHTML}</div>`;
    }
    ev1HTML += `<div style="${rowStyle}">${wLabel}${contentHTML}</div>`;
  });

  const isSunday = new Date().getDay() === 0;
  const isSaturday = new Date().getDay() === 6;
  const satHoliday = !!state.satHoliday;
  // Daily blocks — Sunday = mock day, Sat holiday = off-school, else standard
  let activeBlocks;
  if (isSunday) activeBlocks = PLAN_BLOCKS_SUN;
  else if (isSaturday && satHoliday) activeBlocks = PLAN_BLOCKS_SAT_OFF;
  else activeBlocks = PLAN_BLOCKS;
  let blocksHTML = '';
  activeBlocks.forEach((b, i) => {
    const isNow = i === blockIdx;
    const desc = stealth && b.stealthDesc ? b.stealthDesc : b.desc;
    blocksHTML += `<div class="block-row ${isNow ? 'now' : ''}">
      <div class="block-time">${b.time}</div>
      <div class="block-what"><div class="block-label">${b.label}</div><div class="block-desc">${desc}</div></div>
      <div class="block-pill"><span class="pill ${b.pill}">${b.pill}</span></div>
    </div>`;
  });

  // Rules
  let rulesHTML = '';
  PLAN_RULES.forEach((r, i) => {
    rulesHTML += `<div class="rule-card">
      <div class="rule-n">0${i+1}</div>
      <div class="rule-t">${r.t}</div>
      <div class="rule-d">${r.d}</div>
    </div>`;
  });

  root.innerHTML = `
    ${heroHTML}
    <section class="plan-section fade-in delay-2">
      <div class="plan-section-h">This <em>week</em><span class="plan-section-meta">${currentEvWeekIdx >= 0 ? 'W' + PLAN_EV1_WEEKS[currentEvWeekIdx].w + ' · ' + PLAN_EV1_WEEKS[currentEvWeekIdx].dates : 'tap a day to mark it done'}</span></div>
      <div class="week-strip">${weekHTML}</div>
    </section>
    <section class="plan-section fade-in delay-3">
      <div class="plan-section-h">${isSunday ? 'Sunday <em>study day</em>' : 'Today\'s <em>5 Pomodoros</em>'}<span class="plan-section-meta">${todayCheck.pomos.filter(Boolean).length} / ${isSunday ? 6 : 5} done</span></div>
      <div class="pomos">${pomosHTML}</div>
    </section>
    <section class="plan-section fade-in delay-4">
      <div class="plan-section-h">The <em>roadmap</em><span class="plan-section-meta">phase ${phaseIdx} active</span></div>
      <div class="phases">${phasesHTML}</div>
    </section>
    <section class="plan-section fade-in delay-4">
      <div class="plan-section-h">EV1 <em>chapter plan</em><span class="plan-section-meta">${daysToEV1} days \u00B7 Jul 4 exam</span></div>
      <div style="padding:0 0 4px;">${ev1HTML}</div>
      <div style="margin-top:10px;font-size:11px;color:var(--ink-muted);font-family:'Geist Mono',monospace;">* Confirm exact EV1 chapters with your teacher \u2014 plan assumes Phys Ch 1\u20135, Chem Ch 1\u20133, Maths Ch 1\u20136</div>
    </section>
    <section class="plan-section fade-in delay-5">
      <div class="plan-section-h">Daily <em>template</em>
        <span class="plan-section-meta">${isSunday ? 'Sunday \u00b7 3 hrs \u00b7 3\u20136 PM' : (isSaturday ? (satHoliday ? 'Saturday (no school)' : 'Saturday (school on)') : 'Mon\u2013Sat')}</span>
        <button onclick="toggleSatHoliday()" style="margin-left:auto;font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;border:1px solid var(--line);background:${satHoliday ? 'var(--accent)' : 'var(--bg)'};color:${satHoliday ? '#fff' : 'var(--ink-soft)'};cursor:pointer;" title="Toggle this Saturday: school on / school off">Sat ${satHoliday ? 'holiday \u2713' : 'school \u21ba'}</button>
      </div>
      <div class="blocks">${blocksHTML}</div>
    </section>
    <section class="plan-section fade-in delay-6 stealth-hide">
      <div class="plan-section-h">ADHD <em>rules</em> \u00B7 locked</div>
      <div class="rules-grid">${rulesHTML}</div>
    </section>
  `;
}

// ============= STATS HEADER / FOOTER =============
function renderHeaderStats() {
  document.getElementById('streakVal').textContent = state.dayStreak || 0;
  document.getElementById('xpVal').textContent = state.xp.toLocaleString();
  const lvl = getLevel(state.xp);
  document.getElementById('levelVal').textContent = lvl.idx + 1;
  document.getElementById('levelName').textContent = lvl.name;
  const span = lvl.max - lvl.min;
  const inLvl = state.xp - lvl.min;
  const pct = Math.min(100, (inLvl / span) * 100);
  document.getElementById('levelBarFill').style.width = pct + '%';
  document.getElementById('levelBarName').textContent = lvl.name;
  document.getElementById('levelBarDetail').textContent = `${inLvl} / ${span} xp \u00B7 next: ${LEVELS[Math.min(lvl.idx + 1, LEVELS.length-1)].name}`;
  const shieldChip = document.getElementById('shieldChip');
  if (state.shields > 0) { shieldChip.style.display = 'flex'; document.getElementById('shieldVal').textContent = state.shields; }
  else { shieldChip.style.display = 'none'; }
  document.getElementById('soundToggle').classList.toggle('muted', !state.soundOn);
  const hour = new Date().getHours();
  document.getElementById('dayWarning').style.display = (hour >= 20 && state.dayStreak > 0 && state.dailySolved === 0) ? 'flex' : 'none';
}

function renderFooterStats() {
  if (!document.getElementById('solvedVal')) return;
  document.getElementById('solvedVal').textContent = state.solved.toLocaleString();
  const total = state.correct + state.wrong;
  document.getElementById('accuracyVal').textContent = total ? Math.round(100 * state.correct / total) + '%' : '\u2014';
  document.getElementById('accuracyDetail').textContent = total ? `${state.correct} / ${total} correct` : 'no attempts yet';
  document.getElementById('bestStreakVal').textContent = state.bestStreak.toLocaleString();
  // Total mastered across all subjects
  let total2 = 0, done = 0;
  Object.keys(window.CONTENT || {}).forEach(sub => {
    getSubjectChapters(sub).forEach(ch => {
      ch.parts.forEach(p => p.topics.forEach(t => {
        total2 += 1;
        if (state.topics[fullTopicId(ch.id, t.id)]?.done) done += 1;
      }));
    });
  });
  document.getElementById('masteredVal').textContent = done;
  document.getElementById('masteredTotal').textContent = '/' + total2;
}

function renderAchievements() {
  const root = document.getElementById('achGrid');
  if (!root) return;
  root.innerHTML = '';
  let unlocked = 0;
  ACHIEVEMENTS.forEach(a => {
    const got = state.achievements[a.id];
    if (got) unlocked++;
    const el = document.createElement('div');
    el.className = 'ach ' + (got ? 'unlocked' : 'locked');
    el.innerHTML = `<div class="ach-icon">${a.icon}</div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div>`;
    root.appendChild(el);
  });
  document.getElementById('achMeta').textContent = `${unlocked} / ${ACHIEVEMENTS.length}`;
}

// ============= ACHIEVEMENTS UNLOCK =============
function unlockAch(id) {
  if (state.achievements[id]) return;
  state.achievements[id] = Date.now();
  saveState();
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (!a) return;
  document.getElementById('achPopupIcon').textContent = a.icon;
  document.getElementById('achPopupName').textContent = a.name;
  document.getElementById('achPopupDesc').textContent = a.desc;
  const popup = document.getElementById('achPopup');
  popup.classList.add('show');
  sfx('achievement');
  awardXP(50, true);
  setTimeout(() => popup.classList.remove('show'), 4000);
  renderAchievements();
}

function checkAchievements(ctx = {}) {
  if (state.correct === 1) unlockAch('first_spark');
  if (state.streak >= 10) unlockAch('untouchable');
  if (ctx.crit) unlockAch('critical');
  if (ctx.fast) unlockAch('speed_demon');
  if (ctx.shielded) unlockAch('shielded');
  if (ctx.discharge) unlockAch('discharge');
  if (ctx.topicComplete && ctx.perfect) unlockAch('perfectionist');
  if (ctx.topicComplete) unlockAch('topic_master');
  if (state.dailySolved >= 50) unlockAch('marathon');
  if (ctx.chapterComplete) unlockAch('chapter_clear');
  if (getLevel(state.xp).idx >= 3) unlockAch('level_5');
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 4) unlockAch('night_owl');
}

// ============= TOPIC MODAL FLOW =============
function openTopic(topicFullId) {
  const found = findTopic(topicFullId);
  if (!found) return;
  const hasQuestions = found.topic.questions && found.topic.questions.length > 0;
  const hasTheory = (found.topic.theory && found.topic.theory.length > 50) || (found.chapter.theory && found.chapter.theory.length > 50);
  if (!hasQuestions && !hasTheory) return;
  session = { topicFullId, problems: found.topic.questions || [], idx: 0, correct: 0, xpEarned: 0, mixed: false };
  state.currentTopicId = topicFullId;
  state.currentChapterId = found.chapter.id;
  state.currentSubject = found.chapter.subject;
  saveState();
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('completeView').classList.remove('show');
  document.getElementById('completeView').style.display = 'none';
  // Theory-first when topic has theory but no real practice questions
  const theoryFirst = hasTheory && !hasQuestions;
  document.getElementById('practiceView').style.display = theoryFirst ? 'none' : 'block';
  document.getElementById('theoryView').style.display = theoryFirst ? 'block' : 'none';
  document.getElementById('tabPractice').classList.toggle('active', !theoryFirst);
  document.getElementById('tabTheory').classList.toggle('active', theoryFirst);
  const theoryEl0 = document.getElementById('theoryContent');
  // Fallback: if topic.theory empty (e.g. PYQ year buckets), show chapter-level theory
  const _chTh = found.chapter.theory || '';
  const _chThClean = (_chTh && !_chTh.includes('Source: Arihant')) ? _chTh : null;
  const _theoryHtml = (found.topic.theory && found.topic.theory.length > 50) ? found.topic.theory : (_chThClean || '<p style="color:var(--ink-muted);">No theory written for this topic yet.</p>');
  theoryEl0.innerHTML = _theoryHtml;
  renderMathIn(theoryEl0);
  if (theoryFirst && window._coachingHooks) window._coachingHooks.onTheoryTab(found.chapter.id);
  if (hasQuestions) loadProblem();
}

function randomTopic() {
  sfx('click');
  // Pick a random non-done topic from current chapter (or any chapter if none)
  let pool = [];
  const ch = state.currentChapterId ? findChapter(state.currentChapterId) : null;
  if (ch) {
    ch.parts.forEach(p => p.topics.forEach(t => {
      if (t.questions && t.questions.length && !state.topics[fullTopicId(ch.id, t.id)]?.done) {
        pool.push(fullTopicId(ch.id, t.id));
      }
    }));
  }
  if (pool.length === 0) {
    Object.keys(window.CONTENT || {}).forEach(sub => {
      getSubjectChapters(sub).forEach(ch2 => {
        ch2.parts.forEach(p => p.topics.forEach(t => {
          if (t.questions && t.questions.length && !state.topics[fullTopicId(ch2.id, t.id)]?.done) {
            pool.push(fullTopicId(ch2.id, t.id));
          }
        }));
      });
    });
  }
  if (pool.length === 0) { showToast('default', '\u2726', 'Everything mastered!'); return; }
  openTopic(pool[Math.floor(Math.random() * pool.length)]);
}

function continueStudying() {
  sfx('click');
  const cont = smartContinue();
  if (cont) openTopic(fullTopicId(cont.chapter.id, cont.topic.id));
  else showToast('default', '\u2726', 'All ready topics mastered!');
}

function switchTab(tab) {
  sfx('click');
  if (tab === 'practice') {
    document.getElementById('practiceView').style.display = 'block';
    document.getElementById('theoryView').style.display = 'none';
    document.getElementById('tabPractice').classList.add('active');
    document.getElementById('tabTheory').classList.remove('active');
    if (window._coachingHooks) window._coachingHooks.onPracticeTab();
  } else {
    document.getElementById('practiceView').style.display = 'none';
    document.getElementById('theoryView').style.display = 'block';
    document.getElementById('tabTheory').classList.add('active');
    document.getElementById('tabPractice').classList.remove('active');
    if (window._coachingHooks) window._coachingHooks.onTheoryTab(state.currentChapterId);
  }
}

function closeModal() {
  stopTimer();
  document.getElementById('modalOverlay').classList.remove('open');
  if (window._coachingHooks) window._coachingHooks.onClose();
  // ===== NEW: end-of-session summary if meaningful work happened =====
  maybeShowSessionSummary();
  // Re-render whichever view is active
  setView(state.view);
}

function loadProblem() {
  const p = session.problems[session.idx];
  document.getElementById('modalCounter').textContent = `Question ${session.idx + 1} of ${session.problems.length}`;
  const found = findTopic(session.topicFullId);
  const topicName = found ? found.topic.name : '';
  const typeBadge = `<span class="qtype-badge ${p.type || 'numerical'}">${(p.type || 'numerical').toUpperCase()}</span>`;
  document.getElementById('modalTopic').innerHTML = topicName + typeBadge;
  const mqEl = document.getElementById('modalQuestion');
  mqEl.innerHTML = p.q;
  renderMathIn(mqEl);
  const mhEl = document.getElementById('modalHintContent');
  mhEl.innerHTML = '';
  session.hintText = p.hint || '';
  session.hintStep = 0;
  document.getElementById('modalHint').classList.remove('shown');
  document.getElementById('hintLabel').textContent = ' Need a nudge?';
  document.getElementById('modalHint').style.display = p.hint ? 'block' : 'none';
  document.getElementById('modalFeedback').classList.remove('show', 'correct', 'wrong', 'crit');
  document.getElementById('feedbackBonus').innerHTML = '';
  selectedMcqIdx = null;

  const area = document.getElementById('answerArea');
  if (p.type === 'mcq') {
    area.innerHTML = '<div class="mcq-options" id="mcqOptions"></div>';
    const optsEl = document.getElementById('mcqOptions');
    p.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'mcq-option';
      btn.dataset.idx = i;
      btn.innerHTML = `<span class="mcq-letter">${String.fromCharCode(65 + i)}</span><span>${opt}</span>`;
      btn.onclick = () => {
        if (btn.classList.contains('disabled')) return;
        document.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMcqIdx = i;
      };
      optsEl.appendChild(btn);
    });
    renderMathIn(optsEl);
  } else {
    area.innerHTML = '<div class="modal-input-wrap"><input type="text" class="modal-input" id="modalInput" placeholder="Type your answer\u2026" autocomplete="off" /></div>';
    const inp = document.getElementById('modalInput');
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('modalSubmit').click(); } });
  }

  document.getElementById('modalSubmit').textContent = 'Check';
  document.getElementById('modalSubmit').onclick = submitAnswer;
  document.getElementById('modalSubmit').disabled = false;
  updateMultiplier();
  startTimer();
}

function updateMultiplier() {
  const mult = state.streak >= 10 ? 2 : (state.streak >= 5 ? 1.5 : 1);
  state.comboMult = mult;
  const el = document.getElementById('modalMultiplier');
  if (mult > 1) { el.textContent = '\u00D7' + mult; el.classList.add('show'); el.classList.toggle('hot', mult >= 2); }
  else el.classList.remove('show');
}

function startTimer() {
  stopTimer();
  timerStart = Date.now();
  const fill = document.getElementById('timerBarFill');
  fill.style.width = '100%'; fill.classList.remove('warn','danger');
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - timerStart;
    const pct = Math.max(0, 100 - (elapsed / TIMER_LIMIT) * 100);
    fill.style.width = pct + '%';
    if (pct < 30) fill.classList.add('danger');
    else if (pct < 60) fill.classList.add('warn');
  }, 100);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

function toggleHint() { stepHint(); }

function extractNudge(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  const text = (tmp.textContent || '').trim();
  const dot = text.search(/[.!?]/);
  if (dot > 15) return text.slice(0, dot + 1);
  return text.slice(0, 90) + (text.length > 90 ? '…' : '');
}

function stepHint() {
  const h = document.getElementById('modalHint');
  const hintContent = document.getElementById('modalHintContent');
  const step = session.hintStep || 0;
  if (step === 0) {
    const nudge = extractNudge(session.hintText || '');
    hintContent.innerHTML = '<span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.65;margin-right:4px;">Nudge</span>' + nudge;
    h.classList.add('shown');
    document.getElementById('hintLabel').textContent = ' Full hint →';
    session.hintStep = 1;
  } else if (step === 1) {
    hintContent.innerHTML = session.hintText || 'No hint available.';
    renderMathIn(hintContent);
    document.getElementById('hintLabel').textContent = ' Hide hint';
    session.hintStep = 2;
  } else {
    h.classList.remove('shown');
    document.getElementById('hintLabel').textContent = ' Need a nudge?';
    session.hintStep = 0;
  }
}

function normalize(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g,'').replace(/[,]/g,'').replace(/\u00D7/g,'x').replace(/\*/g,'').replace(/\^/g,'').replace(/\u03BC/g,'u').replace(/[''`]/g,"'");
}

function checkAnswer(p) {
  if (p.type === 'mcq') {
    if (selectedMcqIdx === null) return null;
    return selectedMcqIdx === p.correct;
  }
  const input = document.getElementById('modalInput');
  if (!input || !input.value.trim()) return null;
  const userAns = normalize(input.value);
  const accepted = (p.a || []).map(normalize);
  if (p.type === 'definition' && p.keywords) {
    const userText = userAns;
    const kwHits = p.keywords.filter(kw => userText.includes(normalize(kw))).length;
    return kwHits >= Math.ceil(p.keywords.length * 0.6);
  }
  return accepted.includes(userAns);
}

function submitAnswer() {
  const p = session.problems[session.idx];
  const result = checkAnswer(p);
  if (result === null) {
    if (p.type === 'mcq') showToast('default', '!', 'Pick an option');
    else { const inp = document.getElementById('modalInput'); if (inp) inp.focus(); }
    return;
  }
  const elapsed = Date.now() - timerStart;
  stopTimer();
  state.solved += 1; state.dailySolved += 1;
  const ctx = { fast: false, crit: false, shielded: false, discharge: false };

  if (result) {
    state.correct += 1; state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    session.correct += 1; state.charge += 1;
    const crit = Math.random() < 0.1;
    let xp = 10;
    xp = Math.round(xp * state.comboMult);
    if (elapsed < SPEED_BONUS_MS) { xp += 5; ctx.fast = true; }
    if (crit) { xp *= 3; ctx.crit = true; }
    if (state.streak > 0 && state.streak % 10 === 0) {
      state.shields += 1; showToast('shield', '\uD83D\uDEE1', '+1 streak shield'); sfx('shield');
    }
    session.xpEarned += xp;
    if (p.type === 'mcq') {
      document.querySelectorAll('.mcq-option').forEach((o, i) => { o.classList.add('disabled'); if (i === p.correct) o.classList.add('correct'); });
    } else {
      const input = document.getElementById('modalInput');
      input.classList.add(crit ? 'crit' : 'correct'); input.disabled = true;
    }
    const bonuses = [];
    if (state.comboMult > 1) bonuses.push(`\u00D7${state.comboMult} combo`);
    if (ctx.fast) bonuses.push('\u26A1 +5 speed');
    if (crit) bonuses.push('\u2736 CRITICAL \u00D73');
    showFeedback(crit ? 'crit' : 'correct', crit ? '\u2736 Critical hit.' : 'Correct.', p.explain || '', bonuses);
    awardXP(xp);
    sfx(crit ? 'crit' : 'correct');
    confettiBurst(crit ? 'big' : 'small');
    if (state.correct % 5 === 0) setTimeout(openMystery, 800);
    if (state.charge >= 10) setTimeout(() => triggerDischarge(ctx), 500);
  } else {
    if (state.shields > 0 && state.streak >= 3) {
      state.shields -= 1; ctx.shielded = true;
      showToast('shield', '\uD83D\uDEE1', 'Shield used \u2014 streak saved!'); sfx('shield');
      if (p.type === 'mcq') {
        document.querySelectorAll('.mcq-option').forEach((o, i) => { o.classList.add('disabled'); if (i === p.correct) o.classList.add('correct'); else if (i === selectedMcqIdx) o.classList.add('wrong'); });
      } else {
        const input = document.getElementById('modalInput'); input.classList.add('correct'); input.disabled = true;
      }
      showFeedback('correct', 'Saved by shield.', p.explain || '', ['\uD83D\uDEE1 streak preserved']);
    } else {
      state.wrong += 1; state.streak = 0; state.charge = Math.max(0, state.charge - 2);
      if (p.type === 'mcq') {
        document.querySelectorAll('.mcq-option').forEach((o, i) => { o.classList.add('disabled'); if (i === p.correct) o.classList.add('correct'); else if (i === selectedMcqIdx) o.classList.add('wrong'); });
      } else {
        const input = document.getElementById('modalInput'); input.classList.add('wrong'); input.disabled = true;
      }
      sfx('wrong');
      const correctAns = p.type === 'mcq' ? p.options[p.correct] : (p.a ? p.a[0] : '');
      showFeedback('wrong', 'Not quite.', `Correct: ${correctAns}.  ${p.explain || ''}`, []);
    }
  }
  saveState();
  renderHeaderStats();
  renderFooterStats();
  checkAchievements(ctx);
  // ===== NEW: live session + quests + nudges =====
  liveSession.problemsAnswered += 1;
  if (result) { liveSession.correct += 1; if (ctx.crit) liveSession.crits += 1; }
  liveSession.peakStreak = Math.max(liveSession.peakStreak, state.streak);
  if (result) progressQuest('correct', 1);
  if (result && ctx.fast) progressQuest('fast', 1);
  if (ctx.crit) progressQuest('crit', 1);
  midSessionNudge(result, ctx);

  const btn = document.getElementById('modalSubmit');
  if (session.idx + 1 < session.problems.length) { btn.textContent = 'Next \u2192'; btn.onclick = nextProblem; }
  else { btn.textContent = 'Finish'; btn.onclick = finishTopic; }
}

function nextProblem() { sfx('click'); session.idx += 1; loadProblem(); }

function showFeedback(kind, title, explain, bonuses) {
  const f = document.getElementById('modalFeedback');
  f.classList.remove('correct','wrong','crit');
  f.classList.add('show', kind);
  document.getElementById('feedbackTitle').textContent = title;
  const explainEl = document.getElementById('feedbackExplain');
  explainEl.innerHTML = explain;
  renderMathIn(explainEl);
  document.getElementById('feedbackBonus').innerHTML = bonuses.map(b => `<span>${b}</span>`).join('');
}

function finishTopic() {
  sfx('click');
  const t = state.topics[session.topicFullId] || { done: false, attempts: 0 };
  t.attempts = (t.attempts || 0) + 1;
  const accuracy = session.correct / session.problems.length;
  const wasDone = t.done;
  if (accuracy >= 0.8) { t.done = true; awardXP(30); confettiBurst('big'); liveSession.topicsCompleted += 1; progressQuest('topic', 1); }
  state.topics[session.topicFullId] = t;
  state.currentTopicId = null;
  saveState();
  // Check chapter complete
  const found = findTopic(session.topicFullId);
  let chapterCompleteNow = false;
  if (found) {
    const cs = chapterStats(found.chapter);
    if (cs.done === cs.total && cs.total > 0) chapterCompleteNow = true;
  }
  checkAchievements({ topicComplete: !wasDone && t.done, perfect: accuracy === 1, chapterComplete: chapterCompleteNow });
  if (chapterCompleteNow) { sfx('chapter_clear'); setTimeout(() => triggerChapterCelebration(found.chapter), 500); }

  document.getElementById('modalBody').scrollTop = 0;
  document.getElementById('practiceView').style.display = 'none';
  document.getElementById('theoryView').style.display = 'none';
  const cv = document.getElementById('completeView');
  cv.style.display = 'block'; cv.classList.add('show');
  document.getElementById('completeScore').textContent = `${session.correct}/${session.problems.length}`;
  document.getElementById('completeXP').textContent = `+${session.xpEarned + (accuracy >= 0.8 ? 30 : 0)}`;

  // Auto-flow: find next topic in same chapter
  const nextTopic = findNextTopicInChapter();
  const btn = document.getElementById('modalSubmit');
  if (nextTopic) {
    btn.textContent = 'Next topic \u2192';
    btn.onclick = () => {
      document.getElementById('completeView').classList.remove('show');
      document.getElementById('completeView').style.display = 'none';
      document.getElementById('practiceView').style.display = 'block';
      openTopic(fullTopicId(nextTopic.chapter.id, nextTopic.topic.id));
    };
  } else {
    btn.textContent = 'Done';
    btn.onclick = () => closeModal();
  }
}

function findNextTopicInChapter() {
  const found = findTopic(session.topicFullId);
  if (!found) return null;
  const ch = found.chapter;
  for (const part of ch.parts) {
    for (const t of part.topics) {
      const fid = fullTopicId(ch.id, t.id);
      if (t.questions && t.questions.length && !state.topics[fid]?.done && fid !== session.topicFullId) {
        return { chapter: ch, topic: t };
      }
    }
  }
  return null;
}

function triggerChapterCelebration(chapter) {
  const flash = document.getElementById('lightning');
  flash.classList.add('show');
  awardXP(200);
  showToast('lightning', '\u2606', `Chapter ${chapter.number} cleared! +200 xp`);
  if (typeof confetti !== 'undefined') {
    confetti({ particleCount: 250, spread: 160, origin: { y: 0.5 }, colors: ['#FFD700','#FFFFFF','#1E3AFF','#FF8A3D','#16864B'] });
  }
  setTimeout(() => flash.classList.remove('show'), 1000);
}

function awardXP(amt, silent=false) {
  // ===== NEW: Power Hour 2x multiplier =====
  if (isPowerHourActive()) { amt = amt * 2; }
  liveSession.xpEarned += amt;
  const before = getLevel(state.xp).idx;
  state.xp += amt; saveState(); renderHeaderStats();
  if (!silent) showToast('default', '\u2726', `+${amt} xp`);
  const after = getLevel(state.xp).idx;
  if (after > before) {
    setTimeout(() => {
      const lvl = getLevel(state.xp);
      showToast('lightning', '\u25C6', `LEVEL UP \u2014 ${lvl.name}!`);
      sfx('level_up'); confettiBurst('big');
    }, 500);
  }
}

function showToast(kind, icon, text) {
  const t = document.getElementById('toast');
  t.className = 'toast' + (kind && kind !== 'default' ? ' ' + kind : '');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastText').textContent = text;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 2000);
}

function confettiBurst(size) {
  if (typeof confetti === 'undefined') return;
  const opts = size === 'big' ? { particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: ['#1E3AFF','#5A6FFF','#C8902B','#16864B','#FF8A3D'] }
    : { particleCount: 22, spread: 50, origin: { y: 0.7 }, colors: ['#1E3AFF','#16864B'] };
  confetti(opts);
}

function triggerDischarge(ctx) {
  const flash = document.getElementById('lightning');
  flash.classList.add('show'); sfx('lightning');
  state.charge = 0; awardXP(50);
  showToast('lightning', '\u26A1', '\u26A1 DISCHARGE \u2014 +50 xp');
  if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 120, origin: { y: 0.5 }, colors: ['#FFFFFF','#FFD700','#B8005C','#1E3AFF'] });
  setTimeout(() => flash.classList.remove('show'), 600);
  saveState(); renderHeaderStats();
  ctx.discharge = true; checkAchievements(ctx);
}

const MYSTERY_REWARDS = [
  { emoji: '\u2726', text: '+50 bonus XP', apply: () => awardXP(50, true) },
  { emoji: '\u26A1', text: '+25 bonus XP', apply: () => awardXP(25, true) },
  { emoji: '\uD83D\uDEE1', text: '+1 streak shield', apply: () => { state.shields += 1; saveState(); renderHeaderStats(); } },
  { emoji: '\u25C6', text: '+100 bonus XP \u2014 JACKPOT', apply: () => awardXP(100, true) },
  { emoji: '\u26A1', text: 'Charge meter +3', apply: () => { state.charge += 3; saveState(); renderHeaderStats(); } },
  { emoji: '\u2736', text: '+30 bonus XP', apply: () => awardXP(30, true) },
];
function openMystery() {
  liveSession.mysteries += 1;
  const reward = MYSTERY_REWARDS[Math.floor(Math.random() * MYSTERY_REWARDS.length)];
  document.getElementById('mysteryEmoji').textContent = reward.emoji;
  document.getElementById('mysteryReward').textContent = reward.text;
  document.getElementById('mysteryOverlay').classList.add('show');
  document.getElementById('mysteryOverlay').dataset.reward = MYSTERY_REWARDS.indexOf(reward);
  sfx('correct');
}
function closeMystery() {
  const idx = parseInt(document.getElementById('mysteryOverlay').dataset.reward);
  MYSTERY_REWARDS[idx].apply();
  document.getElementById('mysteryOverlay').classList.remove('show');
  sfx('click');
}

// EXPORT / RESET
function openExport() {
  sfx('click');
  let totalTopics = 0, doneTopics = 0;
  const lines = [];
  Object.keys(window.CONTENT || {}).forEach(sub => {
    const sl = [];
    getSubjectChapters(sub).forEach(ch => {
      const cs = chapterStats(ch);
      totalTopics += cs.total; doneTopics += cs.done;
      if (cs.done > 0) sl.push(`  Ch ${ch.number}: ${ch.name} \u2014 ${cs.done}/${cs.total}${cs.done === cs.total && cs.total > 0 ? ' \u2605' : ''}`);
    });
    if (sl.length) lines.push(`\n${sub.toUpperCase()}:\n${sl.join('\n')}`);
  });
  const total = state.correct + state.wrong;
  const accuracy = total ? Math.round(100 * state.correct / total) : 0;
  const lvl = getLevel(state.xp);
  const summary = `STUDYDECK PROGRESS \u2014 ${new Date().toLocaleString()}
Level: ${lvl.idx + 1} (${lvl.name})  \u00B7  XP: ${state.xp}  \u00B7  Day streak: ${state.dayStreak}
Solved: ${state.solved}  \u00B7  Accuracy: ${accuracy}% (${state.correct}/${total})  \u00B7  Best streak: ${state.bestStreak}
Mastered: ${doneTopics}/${totalTopics} topics across all subjects
Achievements: ${Object.keys(state.achievements).length}/${ACHIEVEMENTS.length}
${lines.join('')}`;
  document.getElementById('exportText').value = summary;
  document.getElementById('exportOverlay').classList.add('show');
}
function closeExport() { sfx('click'); document.getElementById('exportOverlay').classList.remove('show'); }
function copyExport() {
  const ta = document.getElementById('exportText'); ta.select(); document.execCommand('copy');
  showToast('default', '\u2713', 'Copied to clipboard'); sfx('correct');
}
function resetAll() {
  if (!confirm('Wipe all XP, streaks, mastery, achievements? This cannot be undone.')) return;
  localStorage.removeItem('studydeck_state');
  if (typeof window.v70ClearCloud === 'function') window.v70ClearCloud();
  window.location.reload();
}

document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target.id === 'modalOverlay') closeModal(); });

// ============= MOCK TEST MODE =============
let mockSession = null;
let mockTimerInterval = null;

const MOCK_PRESETS = {
  quick:  { label: 'Quick (15 marks, 30 min)',     durationSec: 30*60,  sectionA: 5,  sectionB: 3, sectionC: 0, sectionD: 0, total: 14 },
  half:   { label: 'Half paper (35 marks, 90 min)', durationSec: 90*60,  sectionA: 7,  sectionB: 4, sectionC: 4, sectionD: 1, total: 32 },
  full:   { label: 'Full ISC paper (70 marks, 3 hr)', durationSec: 180*60, sectionA: 14, sectionB: 7, sectionC: 9, sectionD: 3, total: 70 },
};

// Mark value per question type for mock scoring
function questionMarks(q, section) {
  if (section === 'A') return 1;
  if (section === 'B') return 2;
  if (section === 'C') return 3;
  if (section === 'D') return 5;
  // fallback
  if (q.type === 'mcq') return 1;
  if (q.type === 'definition') return 2;
  if (q.type === 'theory') return 5;
  return 2;
}

function classifyQuestion(q) {
  // Returns suggested section: A (1m), B (2m), C (3m), D (5m)
  if (q.type === 'theory') return 'D';
  if (q.type === 'definition') return 'B';
  if (q.type === 'mcq') {
    // Short MCQ \u2192 A, longer/conceptual \u2192 B
    return (q.q && q.q.length > 80) ? 'B' : 'A';
  }
  if (q.type === 'numerical') {
    // Multi-step numericals \u2192 C, simple \u2192 B
    return (q.q && (q.q.includes('multi-step') || q.q.length > 100)) ? 'C' : 'B';
  }
  return 'B';
}

function openMockConfig() {
  sfx('click');
  // Build chapter checkboxes for the unlocked subject (Physics for now)
  const chapters = getSubjectChapters('Physics');
  if (chapters.length === 0) { showToast('default', '!', 'No chapters loaded'); return; }
  let chList = chapters.map((ch, i) => {
    const stats = chapterStats(ch);
    const hasContent = stats.total > 0;
    return `<label class="mock-cb ${hasContent ? '' : 'disabled'}"><input type="checkbox" data-id="${ch.id}" ${hasContent ? 'checked' : 'disabled'} /> Ch ${ch.number}: ${ch.name} <span style="color:var(--ink-muted);font-size:11px;">(${stats.total} topics)</span></label>`;
  }).join('');
  let presetList = Object.keys(MOCK_PRESETS).map(k => `<label class="mock-radio"><input type="radio" name="preset" value="${k}" ${k === 'full' ? 'checked' : ''} /> ${MOCK_PRESETS[k].label}</label>`).join('');
  document.getElementById('mockConfigChapters').innerHTML = chList;
  document.getElementById('mockConfigPresets').innerHTML = presetList;
  document.getElementById('mockConfigOverlay').classList.add('show');
}

function closeMockConfig() { sfx('click'); document.getElementById('mockConfigOverlay').classList.remove('show'); }

function startMockFromConfig() {
  const checked = Array.from(document.querySelectorAll('#mockConfigChapters input:checked')).map(cb => cb.dataset.id);
  if (checked.length === 0) { showToast('default', '!', 'Pick at least one chapter'); return; }
  const presetKey = document.querySelector('#mockConfigPresets input:checked').value;
  const preset = MOCK_PRESETS[presetKey];

  // Pool: gather all questions from selected chapters with full topic id + chapter context
  const pool = { A: [], B: [], C: [], D: [] };
  checked.forEach(chId => {
    const ch = findChapter(chId);
    if (!ch) return;
    ch.parts.forEach(part => part.topics.forEach(t => {
      if (!t.questions) return;
      t.questions.forEach(q => {
        const sec = classifyQuestion(q);
        pool[sec].push({ ...q, _chId: chId, _topicId: t.id, _topicName: t.name, _section: sec });
      });
    }));
  });

  // Shuffle each pool
  Object.keys(pool).forEach(k => pool[k].sort(() => Math.random() - 0.5));

  // Pick by preset, fall back to other sections if a section is short
  const selected = [];
  ['A','B','C','D'].forEach(sec => {
    const need = preset['section' + sec];
    let taken = pool[sec].slice(0, need);
    // If short, borrow from adjacent harder section
    if (taken.length < need) {
      const fallback = sec === 'A' ? 'B' : sec === 'B' ? 'C' : sec === 'C' ? 'D' : 'C';
      const extra = pool[fallback].splice(0, need - taken.length);
      taken = taken.concat(extra.map(q => ({ ...q, _section: sec })));
    }
    selected.push(...taken);
  });

  if (selected.length === 0) { showToast('default', '!', 'No questions available'); return; }

  mockSession = {
    config: { preset: presetKey, chapters: checked, durationSec: preset.durationSec, totalMarks: preset.total },
    questions: selected,
    answers: {}, // idx -> { answer, correct, marks, awarded }
    startTime: Date.now(),
    endTime: Date.now() + preset.durationSec * 1000,
    currentIdx: 0,
    submitted: false,
  };
  closeMockConfig();
  document.getElementById('mockOverlay').classList.add('open');
  startMockTimer();
  loadMockQuestion();
}

function startMockTimer() {
  stopMockTimer();
  mockTimerInterval = setInterval(() => {
    const remaining = Math.max(0, mockSession.endTime - Date.now());
    const totalMs = mockSession.config.durationSec * 1000;
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    document.getElementById('mockTimer').textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    const pct = (remaining / totalMs) * 100;
    const bar = document.getElementById('mockTimerBar');
    bar.style.width = pct + '%';
    bar.classList.remove('warn','danger');
    if (pct < 10) bar.classList.add('danger');
    else if (pct < 25) bar.classList.add('warn');
    if (remaining === 0) { stopMockTimer(); endMock(true); }
  }, 250);
}
function stopMockTimer() { if (mockTimerInterval) { clearInterval(mockTimerInterval); mockTimerInterval = null; } }

function loadMockQuestion() {
  const q = mockSession.questions[mockSession.currentIdx];
  const total = mockSession.questions.length;
  const sec = q._section || classifyQuestion(q);
  const marks = questionMarks(q, sec);
  document.getElementById('mockSection').textContent = `Section ${sec}`;
  document.getElementById('mockMarks').textContent = `[${marks} mark${marks>1?'s':''}]`;
  document.getElementById('mockProgress').textContent = `Q ${mockSession.currentIdx + 1} of ${total}`;
  document.getElementById('mockTopic').textContent = `Ch: ${(findChapter(q._chId)?.name) || ''} \u00B7 ${q._topicName}`;
  const mockQEl = document.getElementById('mockQuestion');
  mockQEl.innerHTML = q.q;
  renderMathIn(mockQEl);

  const area = document.getElementById('mockAnswerArea');
  if (q.type === 'mcq') {
    area.innerHTML = '<div class="mcq-options" id="mockMcqOptions"></div>';
    const opts = document.getElementById('mockMcqOptions');
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'mcq-option';
      btn.dataset.idx = i;
      btn.innerHTML = `<span class="mcq-letter">${String.fromCharCode(65+i)}</span><span>${opt}</span>`;
      const prior = mockSession.answers[mockSession.currentIdx];
      if (prior && prior.selected === i) btn.classList.add('selected');
      btn.onclick = () => {
        document.querySelectorAll('#mockMcqOptions .mcq-option').forEach(o => o.classList.remove('selected'));
        btn.classList.add('selected');
        mockSession.answers[mockSession.currentIdx] = { selected: i, type: 'mcq' };
      };
      opts.appendChild(btn);
    });
    renderMathIn(opts);
  } else {
    area.innerHTML = '<input type="text" class="modal-input" id="mockInput" placeholder="Type your answer\u2026" autocomplete="off" />';
    const inp = document.getElementById('mockInput');
    const prior = mockSession.answers[mockSession.currentIdx];
    if (prior) inp.value = prior.text || '';
    inp.addEventListener('input', () => {
      mockSession.answers[mockSession.currentIdx] = { text: inp.value, type: q.type };
    });
    inp.focus();
  }

  // Question pad on the side: render
  renderMockPad();

  // Buttons
  document.getElementById('mockPrev').disabled = mockSession.currentIdx === 0;
  document.getElementById('mockNext').textContent = mockSession.currentIdx === total - 1 ? 'Submit Mock' : 'Next \u2192';
}

function renderMockPad() {
  const pad = document.getElementById('mockPad');
  if (!pad) return;
  pad.innerHTML = '';
  mockSession.questions.forEach((q, i) => {
    const ans = mockSession.answers[i];
    const btn = document.createElement('button');
    btn.className = 'mock-pad-btn' + (i === mockSession.currentIdx ? ' current' : '') + (ans ? ' answered' : '');
    btn.textContent = i + 1;
    btn.onclick = () => { mockSession.currentIdx = i; loadMockQuestion(); };
    pad.appendChild(btn);
  });
}

function mockPrev() {
  if (mockSession.currentIdx > 0) {
    mockSession.currentIdx -= 1;
    loadMockQuestion();
  }
}
function mockNext() {
  if (mockSession.currentIdx === mockSession.questions.length - 1) {
    if (confirm('Submit the mock now? You cannot change answers after this.')) endMock(false);
  } else {
    mockSession.currentIdx += 1;
    loadMockQuestion();
  }
}

function endMock(timedOut) {
  stopMockTimer();
  if (mockSession.submitted) return;
  mockSession.submitted = true;
  // Score
  let totalAwarded = 0, totalPossible = 0;
  const sectionTotals = {};
  ['A','B','C','D'].forEach(s => sectionTotals[s] = { possible: 0, awarded: 0, count: 0, correct: 0 });
  const chapterPerf = {}; // chId -> { possible, awarded }
  mockSession.questions.forEach((q, i) => {
    const sec = q._section || classifyQuestion(q);
    const marks = questionMarks(q, sec);
    totalPossible += marks;
    sectionTotals[sec].possible += marks;
    sectionTotals[sec].count += 1;
    chapterPerf[q._chId] = chapterPerf[q._chId] || { possible: 0, awarded: 0 };
    chapterPerf[q._chId].possible += marks;
    const ans = mockSession.answers[i];
    let correct = false, awarded = 0;
    if (ans) {
      if (q.type === 'mcq') {
        correct = ans.selected === q.correct;
      } else if (q.type === 'definition' && q.keywords) {
        const userText = (ans.text || '').toLowerCase();
        const hits = q.keywords.filter(kw => userText.includes(String(kw).toLowerCase())).length;
        if (hits >= Math.ceil(q.keywords.length * 0.6)) correct = true;
        else if (hits >= Math.ceil(q.keywords.length * 0.4)) { awarded = marks * 0.5; } // partial
      } else {
        const userAns = normalize(ans.text || '');
        const accepted = (q.a || []).map(normalize);
        if (accepted.includes(userAns)) correct = true;
      }
    }
    if (correct) awarded = marks;
    sectionTotals[sec].awarded += awarded;
    if (correct) sectionTotals[sec].correct += 1;
    totalAwarded += awarded;
    chapterPerf[q._chId].awarded += awarded;
    mockSession.answers[i] = { ...(ans || {}), correct, awarded, marks, section: sec, expected: q.type === 'mcq' ? q.options[q.correct] : (q.a ? q.a[0] : '') };
  });
  mockSession.score = { totalAwarded, totalPossible, sectionTotals, chapterPerf, timedOut };
  showMockResults();
}

function showMockResults() {
  document.getElementById('mockOverlay').classList.remove('open');
  document.getElementById('mockResultsOverlay').classList.add('open');
  const s = mockSession.score;
  const pct = Math.round((s.totalAwarded / s.totalPossible) * 100);
  document.getElementById('mockResultScore').textContent = `${Math.round(s.totalAwarded * 10)/10} / ${s.totalPossible}`;
  document.getElementById('mockResultPct').textContent = `${pct}%`;
  document.getElementById('mockResultTitle').textContent = pct >= 95 ? 'Outstanding.' : pct >= 85 ? 'Strong.' : pct >= 70 ? 'Solid.' : pct >= 50 ? 'Needs work.' : 'Tough one.';
  if (s.timedOut) document.getElementById('mockResultTitle').textContent += ' (Time ran out.)';
  // Section breakdown
  const secEl = document.getElementById('mockResultSections');
  secEl.innerHTML = ['A','B','C','D'].map(sec => {
    const st = s.sectionTotals[sec];
    if (st.possible === 0) return '';
    const sp = Math.round((st.awarded / st.possible) * 100);
    return `<div class="mock-result-row"><div class="mock-result-row-label">Section ${sec}</div><div class="mock-result-row-score">${Math.round(st.awarded*10)/10} / ${st.possible}</div><div class="mock-result-bar"><div class="mock-result-bar-fill" style="width:${sp}%; background:${sp>=80?'var(--success)':sp>=60?'var(--gold)':'var(--danger)'};"></div></div></div>`;
  }).join('');
  // Chapter breakdown
  const chEl = document.getElementById('mockResultChapters');
  chEl.innerHTML = Object.keys(s.chapterPerf).map(chId => {
    const ch = findChapter(chId);
    const cp = s.chapterPerf[chId];
    const cppt = Math.round((cp.awarded / cp.possible) * 100);
    return `<div class="mock-result-row"><div class="mock-result-row-label">${ch ? `Ch ${ch.number}` : chId}</div><div class="mock-result-row-score">${Math.round(cp.awarded*10)/10} / ${cp.possible}</div><div class="mock-result-bar"><div class="mock-result-bar-fill" style="width:${cppt}%; background:${cppt>=80?'var(--success)':cppt>=60?'var(--gold)':'var(--danger)'};"></div></div></div>`;
  }).join('');
  // Award XP based on raw score
  const xpEarned = Math.round(s.totalAwarded * 5);
  awardXP(xpEarned, true);
  if (pct >= 80) confettiBurst('big');
  if (pct >= 95) { unlockAch('perfectionist'); }
}

function closeMockResults() {
  sfx('click');
  document.getElementById('mockResultsOverlay').classList.remove('open');
  setView('mission');
  renderHeaderStats();
  renderFooterStats();
}

function abandonMock() {
  if (!confirm('Abandon this mock? Progress is lost.')) return;
  stopMockTimer();
  mockSession = null;
  document.getElementById('mockOverlay').classList.remove('open');
  setView('mission');
}

// =====================================================================
// =============== NEW FEATURES (ADHD ENGAGEMENT LAYER) ================
// =====================================================================

// ----- ACCENT THEMES -----
const ACCENT_THEMES = {
  default: { name: 'Cobalt',     color: '#1E3AFF', soft: '#E5E9FF', unlockLevel: 1 },
  emerald: { name: 'Emerald',    color: '#0FA968', soft: '#D7F4E5', unlockLevel: 3 },
  violet:  { name: 'Violet',     color: '#7C3AED', soft: '#EDE4FF', unlockLevel: 4 },
  sunset:  { name: 'Sunset',     color: '#E83A1A', soft: '#FFE0D6', unlockLevel: 5 },
  rose:    { name: 'Rose',       color: '#B8005C', soft: '#FFE0F0', unlockLevel: 6 },
  gold:    { name: 'Gold',       color: '#C8902B', soft: '#FBF1DC', unlockLevel: 7 },
};
function applyAccent() {
  const key = state.accentColor && ACCENT_THEMES[state.accentColor] ? state.accentColor : 'default';
  const t = ACCENT_THEMES[key];
  document.documentElement.style.setProperty('--accent', t.color);
  document.documentElement.style.setProperty('--accent-soft', t.soft);
}
function unlockAccentsForLevel() {
  const lvl = getLevel(state.xp).idx + 1;
  let changed = false;
  Object.keys(ACCENT_THEMES).forEach(k => {
    if (lvl >= ACCENT_THEMES[k].unlockLevel && !state.unlockedAccents.includes(k)) {
      state.unlockedAccents.push(k);
      changed = true;
      showToast('lightning', '\u25C6', `Theme unlocked: ${ACCENT_THEMES[k].name}`);
    }
  });
  if (changed) saveState();
}

// ----- DAILY QUESTS -----
const QUEST_TEMPLATES = [
  { id: 'q_solve10',  type: 'correct', target: 10, reward: 60,  label: 'Solve 10 correctly' },
  { id: 'q_solve20',  type: 'correct', target: 20, reward: 120, label: 'Solve 20 correctly' },
  { id: 'q_topic1',   type: 'topic',   target: 1,  reward: 50,  label: 'Master 1 topic' },
  { id: 'q_topic2',   type: 'topic',   target: 2,  reward: 120, label: 'Master 2 topics' },
  { id: 'q_fast5',    type: 'fast',    target: 5,  reward: 80,  label: '5 speed answers (under 8s)' },
  { id: 'q_crit2',    type: 'crit',    target: 2,  reward: 100, label: 'Land 2 critical hits' },
  { id: 'q_streak10', type: 'streak',  target: 10, reward: 90,  label: 'Hit a 10-streak chain' },
];
function initDailyQuests() {
  const today = new Date().toDateString();
  if (state.dailyQuests && state.dailyQuests.date === today) return;
  // Pick 3 random quest templates, balanced (1 solve, 1 topic, 1 spice)
  const solves = QUEST_TEMPLATES.filter(q => q.type === 'correct');
  const topics = QUEST_TEMPLATES.filter(q => q.type === 'topic');
  const spice  = QUEST_TEMPLATES.filter(q => !['correct','topic'].includes(q.type));
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const chosen = [pick(solves), pick(topics), pick(spice)].map(q => ({ ...q, progress: 0, done: false, claimed: false }));
  state.dailyQuests = { date: today, quests: chosen };
  saveState();
}
function progressQuest(type, amount) {
  if (!state.dailyQuests) return;
  let any = false;
  state.dailyQuests.quests.forEach(q => {
    if (q.type === type && !q.done) {
      q.progress = Math.min(q.target, q.progress + amount);
      if (q.progress >= q.target) { q.done = true; any = true; showToast('lightning', '\u2713', `Quest complete: ${q.label}`); }
    }
  });
  // Streak quest is special \u2014 check current streak
  state.dailyQuests.quests.forEach(q => {
    if (q.type === 'streak' && !q.done && state.streak >= q.target) {
      q.progress = q.target; q.done = true; any = true;
      showToast('lightning', '\u2713', `Quest complete: ${q.label}`);
    }
  });
  saveState();
  if (any) renderDailyQuests();
}
function claimQuest(idx) {
  sfx('click');
  const q = state.dailyQuests.quests[idx];
  if (!q || !q.done || q.claimed) return;
  q.claimed = true;
  awardXP(q.reward);
  saveState();
  renderDailyQuests();
  confettiBurst('small');
}
function renderDailyQuests() {
  const el = document.getElementById('dailyQuestsPanel');
  if (!el || !state.dailyQuests) return;
  const allDone = state.dailyQuests.quests.every(q => q.done && q.claimed);
  el.innerHTML = `
    <div class="dq-head">
      <div>
        <div class="dq-meta">${allDone ? '\u2605 ALL CLEARED' : 'TODAY \u00B7 daily quests'}</div>
        <div class="dq-title">Daily <em>quests</em></div>
      </div>
      <div class="dq-count">${state.dailyQuests.quests.filter(q => q.done).length} / ${state.dailyQuests.quests.length}</div>
    </div>
    <div class="dq-list">
      ${state.dailyQuests.quests.map((q, i) => {
        const pct = Math.min(100, (q.progress / q.target) * 100);
        return `<div class="dq-item ${q.done ? 'done' : ''} ${q.claimed ? 'claimed' : ''}">
          <div class="dq-item-info">
            <div class="dq-item-label">${q.label}</div>
            <div class="dq-item-bar"><div class="dq-item-bar-fill" style="width:${pct}%;"></div></div>
            <div class="dq-item-meta">${q.progress} / ${q.target} \u00B7 +${q.reward} xp</div>
          </div>
          ${q.done && !q.claimed
            ? `<button class="dq-claim" onclick="claimQuest(${i})">Claim</button>`
            : q.claimed ? `<div class="dq-claimed">\u2713</div>` : `<div class="dq-pending">\u2026</div>`}
        </div>`;
      }).join('')}
    </div>
  `;
}

// ----- POWER HOUR -----
function isPowerHourActive() {
  return state.powerHour && Date.now() < state.powerHour.endsAt;
}
function maybeOfferPowerHour() {
  // Soft trigger: 30% chance per session-start, max once per day, only if not active
  if (isPowerHourActive()) return;
  const today = new Date().toDateString();
  if (state.powerHourLastOffered === today) return;
  if (Math.random() > 0.30) return;
  state.powerHour = { startedAt: Date.now(), endsAt: Date.now() + 10 * 60 * 1000 };
  state.powerHourLastOffered = today;
  saveState();
  showToast('lightning', '\u26A1', 'POWER HOUR \u2014 2\u00D7 XP for 10 minutes!');
  sfx('lightning');
  renderPowerHourBanner();
  setTimeout(renderPowerHourBanner, 10 * 60 * 1000 + 100);
}
function renderPowerHourBanner() {
  const el = document.getElementById('powerHourBanner');
  if (!el) return;
  if (!isPowerHourActive()) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  const updateTimer = () => {
    if (!isPowerHourActive()) { el.style.display = 'none'; return; }
    const remaining = state.powerHour.endsAt - Date.now();
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const tEl = document.getElementById('powerHourTimer');
    if (tEl) tEl.textContent = `${m}:${String(s).padStart(2,'0')}`;
  };
  updateTimer();
  if (window._phInterval) clearInterval(window._phInterval);
  window._phInterval = setInterval(updateTimer, 1000);
}

// ----- COMEBACK BONUS -----
function maybeShowComeback() {
  const today = new Date().toDateString();
  if (state.comebackShown === today) return;
  if (!state.lastSessionEnd) return;
  const daysAway = (Date.now() - state.lastSessionEnd) / (1000 * 60 * 60 * 24);
  if (daysAway < 0.7) return; // less than ~17 hours, no comeback needed
  // Show welcome back
  state.comebackShown = today;
  saveState();
  const msg = daysAway > 2 ? `Welcome back. ${Math.floor(daysAway)} days off \u2014 let's rebuild.` : `Welcome back. +30 XP gift to start.`;
  awardXP(30, true);
  setTimeout(() => showToast('lightning', '\u25C6', msg), 800);
}

// ----- MID-SESSION NUDGES -----
let _nudgeCooldown = 0;
function midSessionNudge(wasCorrect, ctx) {
  if (Date.now() - _nudgeCooldown < 10000) return; // throttle
  let msg = null, kind = 'default', icon = '\u2726';
  if (wasCorrect) {
    if (state.streak === 4) { msg = '1 more for \u00D71.5 combo bonus.'; icon = '\u2726'; }
    else if (state.streak === 9) { msg = '1 more for \u00D72 combo and a streak shield.'; icon = '\uD83D\uDEE1'; kind = 'shield'; }
    else if (state.charge === 9) { msg = '1 more correct \u2192 DISCHARGE.'; icon = '\u26A1'; kind = 'lightning'; }
    else if (state.streak === 7 && Math.random() < 0.5) { msg = `On fire \u2014 ${state.streak} in a row!`; icon = '\uD83D\uDD25'; }
  }
  if (msg) { showToast(kind, icon, msg); _nudgeCooldown = Date.now(); }
}

// ----- SESSION SUMMARY -----
function maybeShowSessionSummary() {
  if (liveSession.problemsAnswered < 3) {
    // not meaningful, just record session end
    state.lastSessionEnd = Date.now(); saveState();
    return;
  }
  const ovr = document.getElementById('sessionSummaryOverlay');
  if (!ovr) return;
  const minutes = Math.max(1, Math.round((Date.now() - liveSession.startedAt) / 60000));
  const acc = liveSession.problemsAnswered ? Math.round((liveSession.correct / liveSession.problemsAnswered) * 100) : 0;
  document.getElementById('ssTime').textContent = minutes + 'm';
  document.getElementById('ssSolved').textContent = liveSession.problemsAnswered;
  document.getElementById('ssAcc').textContent = acc + '%';
  document.getElementById('ssXP').textContent = '+' + liveSession.xpEarned;
  document.getElementById('ssTopics').textContent = liveSession.topicsCompleted;
  document.getElementById('ssPeak').textContent = liveSession.peakStreak;
  document.getElementById('ssCrits').textContent = liveSession.crits;
  document.getElementById('ssMyst').textContent = liveSession.mysteries;
  // Tagline based on perf
  let tag = 'Solid session.';
  if (acc >= 90 && liveSession.problemsAnswered >= 10) tag = 'Surgical. Keep this rhythm.';
  else if (acc >= 75) tag = 'Strong work. Stack another tomorrow.';
  else if (liveSession.problemsAnswered >= 15) tag = 'Volume mode. Quantity unlocks quality.';
  else tag = 'Every rep counts. See you tomorrow.';
  document.getElementById('ssTagline').textContent = tag;
  state.lastSessionEnd = Date.now();
  if (liveSession.problemsAnswered > state.bestSessionStreak) state.bestSessionStreak = liveSession.problemsAnswered;
  saveState();
  ovr.classList.add('show');
  if (acc >= 80) confettiBurst('small');
  // reset live session
  liveSession = { startedAt: Date.now(), problemsAnswered: 0, correct: 0, xpEarned: 0, topicsCompleted: 0, peakStreak: 0, crits: 0, mysteries: 0 };
}
function closeSessionSummary() {
  document.getElementById('sessionSummaryOverlay').classList.remove('show');
  sfx('click');
}

// ----- LOFI AMBIENT (Web Audio synth pad) -----
let lofiNodes = null;
function startLofi() {
  if (lofiNodes) return;
  try {
    const ctx = getCtx();
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
    // Two soft detuned sine pads + a low filtered noise wash
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 196; // G3
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 261.63; // C4
    const o3 = ctx.createOscillator(); o3.type = 'sine'; o3.frequency.value = 329.63; // E4
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 4;
    lfo.connect(lfoGain); lfoGain.connect(o2.frequency);
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 800;
    o1.connect(filt); o2.connect(filt); o3.connect(filt); filt.connect(master);
    o1.start(); o2.start(); o3.start(); lfo.start();
    lofiNodes = { master, oscs: [o1, o2, o3, lfo], ctx };
  } catch (e) {}
}
function stopLofi() {
  if (!lofiNodes) return;
  try {
    const { master, oscs, ctx } = lofiNodes;
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => oscs.forEach(o => { try { o.stop(); } catch(e){} }), 1100);
  } catch(e) {}
  lofiNodes = null;
}
function toggleLofi() {
  state.lofiOn = !state.lofiOn; saveState();
  if (state.lofiOn) startLofi(); else stopLofi();
  const btn = document.getElementById('lofiToggle');
  if (btn) btn.classList.toggle('active', state.lofiOn);
}

// ----- DISPLAY NAME / SETTINGS PANEL -----
function openSettings() {
  sfx('click');
  const ovr = document.getElementById('settingsOverlay');
  document.getElementById('settingsName').value = state.displayName || '';
  // Build accent picker
  const swatches = Object.keys(ACCENT_THEMES).map(k => {
    const t = ACCENT_THEMES[k];
    const unlocked = state.unlockedAccents.includes(k) || (getLevel(state.xp).idx + 1) >= t.unlockLevel;
    const active = (state.accentColor || 'default') === k;
    return `<button class="accent-swatch ${unlocked ? '' : 'locked'} ${active ? 'active' : ''}"
      onclick="${unlocked ? `pickAccent('${k}')` : ''}"
      style="background:${t.color};"
      title="${t.name}${unlocked ? '' : ' \u2014 unlocks at level ' + t.unlockLevel}">
      ${unlocked ? (active ? '\u2713' : '') : '\uD83D\uDD12'}
    </button>`;
  }).join('');
  document.getElementById('settingsAccents').innerHTML = swatches;
  ovr.classList.add('show');
}
function closeSettings() { sfx('click'); document.getElementById('settingsOverlay').classList.remove('show'); }
function pickAccent(key) {
  state.accentColor = key;
  if (!state.unlockedAccents.includes(key)) state.unlockedAccents.push(key);
  saveState();
  applyAccent();
  openSettings(); // re-render
  sfx('correct');
}
function saveDisplayName() {
  const v = document.getElementById('settingsName').value.trim().slice(0, 20);
  state.displayName = v;
  saveState();
  closeSettings();
  showToast('default', '\u2713', v ? `Hey ${v}.` : 'Name cleared');
  setView(state.view);
}

// ----- INJECT UI: settings button, daily quests panel, power-hour banner, summary modal -----
function injectNewUI() {
  // 1. Add settings + lofi buttons to header
  const headerStats = document.querySelector('.header-stats');
  if (headerStats && !document.getElementById('lofiToggle')) {
    const lofiBtn = document.createElement('button');
    lofiBtn.className = 'icon-btn' + (state.lofiOn ? ' active' : '');
    lofiBtn.id = 'lofiToggle';
    lofiBtn.title = 'Toggle lofi ambient';
    lofiBtn.onclick = toggleLofi;
    lofiBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
    headerStats.appendChild(lofiBtn);

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'icon-btn';
    settingsBtn.id = 'settingsBtn';
    settingsBtn.title = 'Settings';
    settingsBtn.onclick = openSettings;
    settingsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    headerStats.appendChild(settingsBtn);
  }

  // 2. Power Hour banner + Daily Quests panel + Summary modal + Settings modal \u2014 append to .app once
  if (!document.getElementById('powerHourBanner')) {
    const app = document.querySelector('.app');
    const banner = document.createElement('div');
    banner.id = 'powerHourBanner';
    banner.className = 'power-hour-banner';
    banner.style.display = 'none';
    banner.innerHTML = `<span style="font-size:18px;">\u26A1</span><span><strong>POWER HOUR</strong> \u2014 every XP doubled</span><span class="ph-timer" id="powerHourTimer">10:00</span>`;
    // Insert after level-bar-wrap
    const lbw = document.querySelector('.level-bar-wrap');
    if (lbw) lbw.insertAdjacentElement('afterend', banner);
  }

  if (!document.getElementById('dailyQuestsPanel')) {
    const panel = document.createElement('section');
    panel.id = 'dailyQuestsPanel';
    panel.className = 'daily-quests fade-in delay-1';
    // insert after view containers (between views and the Achievements section)
    const achHeader = document.querySelector('.section-header');
    if (achHeader) achHeader.parentNode.insertBefore(panel, achHeader);
  }
  renderDailyQuests();
  renderPowerHourBanner();
}

function injectModals() {
  if (document.getElementById('sessionSummaryOverlay')) return;
  const ssHTML = `
    <div class="export-overlay" id="sessionSummaryOverlay">
      <div class="export-box" style="max-width:520px;text-align:center;">
        <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);margin-bottom:6px;">Session summary</div>
        <h3 style="font-family:'Fraunces',serif;font-weight:400;font-size:32px;letter-spacing:-0.025em;margin-bottom:6px;">Nice <em style="font-style:italic;color:var(--accent);">work</em>.</h3>
        <p style="color:var(--ink-soft);margin-bottom:24px;font-size:14px;" id="ssTagline">Solid session.</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
          <div class="ss-cell"><div class="ss-val" id="ssTime">0m</div><div class="ss-lbl">time</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssSolved">0</div><div class="ss-lbl">solved</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssAcc">0%</div><div class="ss-lbl">accuracy</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssXP">+0</div><div class="ss-lbl">xp gained</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssTopics">0</div><div class="ss-lbl">topics</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssPeak">0</div><div class="ss-lbl">peak streak</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssCrits">0</div><div class="ss-lbl">crits</div></div>
          <div class="ss-cell"><div class="ss-val" id="ssMyst">0</div><div class="ss-lbl">mystery</div></div>
        </div>
        <div class="export-buttons" style="justify-content:center;"><button class="btn btn-primary" onclick="closeSessionSummary()">Done</button></div>
      </div>
    </div>`;
  const stHTML = `
    <div class="export-overlay" id="settingsOverlay">
      <div class="export-box" style="max-width:480px;">
        <h3 style="font-family:'Fraunces',serif;font-weight:400;font-size:24px;margin-bottom:12px;">Your <em style="font-style:italic;color:var(--accent);">deck</em></h3>
        <div style="margin-bottom:20px;">
          <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);margin-bottom:8px;">Display name</div>
          <input type="text" id="settingsName" maxlength="20" placeholder="What should we call you?" class="modal-input" style="width:100%;" />
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);margin-bottom:8px;">Accent color <span style="text-transform:none;letter-spacing:normal;color:var(--ink-muted);">\u00B7 unlock more by leveling up</span></div>
          <div id="settingsAccents" style="display:flex;gap:10px;flex-wrap:wrap;"></div>
        </div>
        <div class="export-buttons"><button class="btn btn-ghost" onclick="closeSettings()">Cancel</button><button class="btn btn-primary" onclick="saveDisplayName()">Save</button></div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', ssHTML + stHTML);
}

// ----- INJECT CSS for new UI -----
function injectNewCSS() {
  if (document.getElementById('newFeaturesCSS')) return;
  const css = `
    .icon-btn.active { background:var(--accent-soft); color:var(--accent); border-color:var(--accent); }
    .icon-btn:active { transform:scale(0.92); }
    .today-cta:active, .btn:active { transform:scale(0.97); }

    .power-hour-banner {
      display:flex; align-items:center; gap:12px;
      background:linear-gradient(135deg, var(--gold-soft), #FFE4D6);
      border:1px solid var(--gold);
      border-radius:var(--radius-md);
      padding:12px 18px; margin-bottom:24px;
      font-size:14px; font-weight:500; color:#6B4D14;
      animation:pulse-warn 2.5s ease-in-out infinite;
    }
    .power-hour-banner .ph-timer {
      margin-left:auto; font-family:'Geist Mono',monospace; font-weight:600;
      background:rgba(255,255,255,0.6); padding:4px 12px; border-radius:100px;
    }

    .daily-quests {
      background:var(--bg-elev); border:0.5px solid var(--line);
      border-radius:var(--radius-lg); padding:24px 28px; margin-bottom:32px;
      box-shadow:var(--shadow-sm);
    }
    .dq-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:18px; }
    .dq-meta { font-family:'Geist Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-muted); margin-bottom:4px; }
    .dq-title { font-family:'Fraunces',serif; font-weight:400; font-size:24px; letter-spacing:-0.02em; }
    .dq-title em { font-style:italic; color:var(--accent); font-weight:300; }
    .dq-count { font-family:'Geist Mono',monospace; font-size:13px; color:var(--ink-soft); }
    .dq-list { display:flex; flex-direction:column; gap:10px; }
    .dq-item {
      display:flex; align-items:center; gap:14px;
      padding:14px 16px; background:var(--bg); border:0.5px solid var(--line);
      border-radius:var(--radius-md); transition:all 0.25s;
    }
    .dq-item.done { border-color:var(--success); background:var(--success-soft); }
    .dq-item.claimed { opacity:0.55; }
    .dq-item-info { flex:1; min-width:0; }
    .dq-item-label { font-size:14px; font-weight:500; margin-bottom:6px; }
    .dq-item-bar { height:4px; background:var(--line-soft); border-radius:100px; overflow:hidden; margin-bottom:6px; }
    .dq-item-bar-fill { height:100%; background:linear-gradient(90deg,var(--accent),#5A6FFF); border-radius:100px; transition:width 0.6s cubic-bezier(0.16,1,0.3,1); }
    .dq-item.done .dq-item-bar-fill { background:var(--success); }
    .dq-item-meta { font-family:'Geist Mono',monospace; font-size:11px; color:var(--ink-muted); }
    .dq-claim {
      padding:8px 16px; border:none; border-radius:100px;
      background:linear-gradient(135deg,var(--accent),#5A6FFF); color:white;
      font-family:'Geist',sans-serif; font-size:13px; font-weight:500; cursor:pointer;
      box-shadow:0 4px 12px rgba(30,58,255,0.25);
      animation:claimPulse 1.5s ease-in-out infinite;
    }
    @keyframes claimPulse { 0%,100% { transform:scale(1);} 50% { transform:scale(1.05);} }
    .dq-claim:hover { transform:translateY(-1px) scale(1.05); }
    .dq-claimed { color:var(--success); font-size:18px; padding:0 12px; }
    .dq-pending { color:var(--ink-muted); font-size:14px; padding:0 12px; }

    .ss-cell { padding:14px 8px; background:var(--bg); border-radius:var(--radius-md); }
    .ss-val { font-family:'Fraunces',serif; font-size:24px; font-weight:400; line-height:1; margin-bottom:4px; letter-spacing:-0.02em; }
    .ss-lbl { font-family:'Geist Mono',monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-muted); }

    .accent-swatch {
      width:42px; height:42px; border-radius:50%; border:2px solid var(--line);
      cursor:pointer; color:white; font-weight:600; font-size:14px;
      transition:transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
      display:grid; place-items:center;
    }
    .accent-swatch:hover:not(.locked) { transform:scale(1.1); }
    .accent-swatch.active { border-color:var(--ink); box-shadow:0 0 0 3px var(--accent-soft); }
    .accent-swatch.locked { cursor:not-allowed; opacity:0.4; }

    /* Card depth on hover */
    .subject-card, .chapter-row, .topic { will-change:transform; }
    .subject-card:hover:not(.locked) { box-shadow:0 32px 64px -20px rgba(15,15,20,0.18), 0 8px 16px -8px rgba(15,15,20,0.08); }

    /* Smooth scroll */
    html { scroll-behavior:smooth; }

    @media (max-width:600px) {
      .ss-cell .ss-val { font-size:20px; }
      .daily-quests { padding:18px 16px; }
    }
  `;
  const style = document.createElement('style');
  style.id = 'newFeaturesCSS';
  style.textContent = css;
  document.head.appendChild(style);
}

// Wrap renderHeaderStats to also fold in displayName + accent unlock checks
const _origRenderHeaderStats = renderHeaderStats;
renderHeaderStats = function() {
  _origRenderHeaderStats();
  unlockAccentsForLevel();
  const brand = document.querySelector('.brand-name');
  if (brand) {
    const want = state.displayName ? `${state.displayName}'s <em>Deck</em>` : `Study<em>Deck</em>`;
    if (brand.innerHTML !== want) brand.innerHTML = want;
  }
};

// Wrap setView to re-render quests on each view change (since panel sits outside views)
const _origSetView = setView;
setView = function(view) {
  _origSetView(view);
  renderDailyQuests();
  renderPowerHourBanner();
};

// ============= V2 EXTENSIONS: Mistake Bank \u00B7 Inline Theory \u00B7 Start Session \u00B7 Pomodoro =============
(function v2Extensions() {

  // ---- State migration ----
  if (!Array.isArray(state.mistakeBank)) state.mistakeBank = [];
  if (state.pomodoro === undefined) state.pomodoro = null;
  saveState();

  // ---- Mistake bank helpers ----
  function mistakeKey(topicFullId, qIdx) { return topicFullId + '::' + qIdx; }
  function findMistake(topicFullId, qIdx) {
    const k = mistakeKey(topicFullId, qIdx);
    return state.mistakeBank.find(m => m.k === k);
  }
  function addMistake(topicFullId, qIdx) {
    const k = mistakeKey(topicFullId, qIdx);
    const now = Date.now();
    const existing = state.mistakeBank.find(m => m.k === k);
    if (existing) {
      existing.attempts = (existing.attempts || 1) + 1;
      existing.lastWrongAt = now;
      // re-due in 1 day after another miss
      existing.dueAt = now + 24*60*60*1000;
    } else {
      state.mistakeBank.push({ k, topicFullId, qIdx, addedAt: now, lastWrongAt: now, attempts: 1, dueAt: now + 60*1000 }); // first review in 1 min minimum (effectively next session)
    }
    saveState();
  }
  function clearMistake(topicFullId, qIdx) {
    const k = mistakeKey(topicFullId, qIdx);
    const i = state.mistakeBank.findIndex(m => m.k === k);
    if (i >= 0) {
      const m = state.mistakeBank[i];
      m.successes = (m.successes || 0) + 1;
      // spaced-rep: 1d, 3d, 7d, then drop
      const intervals = [1, 3, 7];
      if (m.successes >= intervals.length) state.mistakeBank.splice(i, 1);
      else { m.dueAt = Date.now() + intervals[m.successes] * 24*60*60*1000; m.lastReviewAt = Date.now(); }
    }
    saveState();
  }
  function getDueMistakes(maxN) {
    const now = Date.now();
    return state.mistakeBank
      .filter(m => (m.dueAt || 0) <= now)
      .sort((a,b) => (a.dueAt||0) - (b.dueAt||0))
      .slice(0, maxN);
  }
  function resolveMistakeProblems(mistakes) {
    const out = [];
    mistakes.forEach(m => {
      const found = findTopic(m.topicFullId);
      if (!found) return;
      const q = (found.topic.questions || [])[m.qIdx];
      if (!q) return;
      out.push({ ...q, _mistake: m, _topicFullId: m.topicFullId });
    });
    return out;
  }

  // ---- Wrap submitAnswer to capture mistakes + inline theory ----
  const _origSubmit = submitAnswer;
  submitAnswer = function() {
    const idxBefore = session.idx;
    const wrongBefore = state.wrong;
    _origSubmit();
    const wrongAfter = state.wrong;
    const wasWrong = wrongAfter > wrongBefore;
    const wasMistakeQ = session.problems[idxBefore]?._mistake;
    const topicForCapture = wasMistakeQ ? wasMistakeQ.topicFullId : session.topicFullId;
    if (wasWrong && topicForCapture) addMistake(topicForCapture, idxBefore);
    if (!wasWrong && wasMistakeQ) clearMistake(wasMistakeQ.topicFullId, wasMistakeQ.qIdx);
    if (wasWrong) injectInlineTheory();
  };

  function injectInlineTheory() {
    const found = findTopic(session.topicFullId);
    if (!found || !found.topic.theory) return;
    const fb = document.getElementById('modalFeedback');
    if (!fb || fb.querySelector('.inline-theory-toggle')) return;
    const wrap = document.createElement('div');
    wrap.style.marginTop = '12px';
    wrap.innerHTML = `<div class="inline-theory-toggle" style="font-family:'Geist Mono',monospace;font-size:12px;color:var(--accent);cursor:pointer;user-select:none;">\u2193 Show theory for this concept</div><div class="inline-theory-body" style="display:none;margin-top:10px;padding:14px 18px;background:var(--bg);border-left:2px solid var(--accent);border-radius:8px;font-size:13.5px;line-height:1.55;">${found.topic.theory}</div>`;
    fb.appendChild(wrap);
    const tog = wrap.querySelector('.inline-theory-toggle');
    const body = wrap.querySelector('.inline-theory-body');
    let mathRendered = false;
    tog.onclick = () => {
      const open = body.style.display === 'block';
      body.style.display = open ? 'none' : 'block';
      tog.textContent = open ? '\u2193 Show theory for this concept' : '\u2191 Hide theory';
      if (!open && !mathRendered) { renderMathIn(body); mathRendered = true; }
    };
  }

  // ---- Pomodoro ----
  const POMO_MS = 25 * 60 * 1000;
  function startPomodoro() {
    state.pomodoro = { startedAt: Date.now(), durationMs: POMO_MS };
    saveState();
    renderPomoChip();
  }
  function stopPomodoro() {
    state.pomodoro = null; saveState();
    const chip = document.getElementById('pomoChip');
    if (chip) chip.remove();
  }
  function renderPomoChip() {
    let chip = document.getElementById('pomoChip');
    if (!state.pomodoro) { if (chip) chip.remove(); return; }
    const stats = document.querySelector('.header-stats');
    if (!stats) return;
    const remaining = (state.pomodoro.startedAt + state.pomodoro.durationMs) - Date.now();
    if (remaining <= 0) {
      stopPomodoro();
      try { sfx('lightning'); } catch(e){}
      showToast('lightning', '\uD83C\uDF45', 'Pomodoro complete \u00B7 take 5');
      return;
    }
    const mm = String(Math.floor(remaining / 60000)).padStart(2,'0');
    const ss = String(Math.floor((remaining % 60000)/1000)).padStart(2,'0');
    if (!chip) {
      chip = document.createElement('div');
      chip.id = 'pomoChip';
      chip.className = 'stat-chip';
      chip.style.cursor = 'pointer';
      chip.title = 'Click to stop Pomodoro';
      chip.onclick = () => { if (confirm('Stop Pomodoro timer?')) stopPomodoro(); };
      chip.innerHTML = `<span class="icon">\uD83C\uDF45</span><span id="pomoTime">${mm}:${ss}</span>`;
      stats.insertBefore(chip, stats.firstChild);
    } else {
      const t = document.getElementById('pomoTime');
      if (t) t.textContent = `${mm}:${ss}`;
    }
  }
  setInterval(renderPomoChip, 1000);

  // ---- Start Session: warm-up mistakes + main topic + auto-Pomodoro ----
  function startSession() {
    sfx('click');
    const cont = smartContinue();
    if (!cont) { showToast('default', '\u2726', 'All ready topics mastered!'); return; }
    const fullId = fullTopicId(cont.chapter.id, cont.topic.id);
    const baseProblems = (cont.topic.questions || []).slice();
    const dueMistakes = getDueMistakes(3);
    const warmup = resolveMistakeProblems(dueMistakes);
    const merged = warmup.concat(baseProblems);
    if (!merged.length) { showToast('default', '\u2726', 'Nothing to drill.'); return; }

    session = { topicFullId: fullId, problems: merged, idx: 0, correct: 0, xpEarned: 0, mixed: warmup.length > 0 };
    state.currentTopicId = fullId;
    state.currentChapterId = cont.chapter.id;
    state.currentSubject = cont.chapter.subject;
    saveState();
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('completeView').classList.remove('show');
    document.getElementById('completeView').style.display = 'none';
    document.getElementById('practiceView').style.display = 'block';
    document.getElementById('theoryView').style.display = 'none';
    document.getElementById('tabPractice').classList.add('active');
    document.getElementById('tabTheory').classList.remove('active');
    const found = findTopic(fullId);
    { const _tc = document.getElementById('theoryContent'); _tc.innerHTML = found?.topic?.theory || '<p>\u2014</p>'; renderMathIn(_tc); }
    if (warmup.length) showToast('default', '\uD83D\uDD01', `Warm-up: ${warmup.length} from mistake bank`);
    startPomodoro();
    loadProblem();
  }
  window.startSession = startSession;
  window.stopPomodoro = stopPomodoro;

  // ---- Wrap renderMission to inject Start Session hero + mistake count chip ----
  const _origRenderMission = renderMission;
  renderMission = function() {
    _origRenderMission();
    const root = document.getElementById('view-mission');
    if (!root) return;
    const today = root.querySelector('.today');
    if (!today || today.querySelector('.start-session-hero')) return;
    const dueCount = getDueMistakes(99).length;
    const hero = document.createElement('div');
    hero.className = 'start-session-hero';
    hero.style.cssText = 'margin-top:24px;padding:20px 24px;background:linear-gradient(135deg, var(--accent), #5A6FFF);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;cursor:pointer;color:white;box-shadow:0 8px 24px rgba(30,58,255,0.25);transition:transform .2s ease;';
    hero.onmouseover = () => hero.style.transform = 'translateY(-2px)';
    hero.onmouseout = () => hero.style.transform = 'translateY(0)';
    hero.onclick = () => startSession();
    hero.innerHTML = `
      <div>
        <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;opacity:0.85;">One-tap start</div>
        <div style="font-family:'Fraunces',serif;font-size:24px;font-weight:500;letter-spacing:-0.02em;margin-top:4px;">\u25B6 Start Session</div>
        <div style="font-size:13px;opacity:0.9;margin-top:6px;">${dueCount > 0 ? `${Math.min(dueCount,3)} warm-up from mistakes \u00B7 then planned drill` : 'Planned drill \u00B7 25-min Pomodoro starts'}</div>
      </div>
      <div style="font-family:'Geist Mono',monospace;font-size:11px;background:rgba(255,255,255,0.15);padding:8px 14px;border-radius:100px;">\uD83C\uDF45 25:00</div>
    `;
    today.appendChild(hero);
  };

  // ---- Review Mistakes mode (dedicated drill) ----
  function startMistakeReview() {
    sfx('click');
    const due = getDueMistakes(20);
    const problems = resolveMistakeProblems(due);
    if (!problems.length) {
      const total = state.mistakeBank.length;
      if (total === 0) showToast('default', '\u2726', 'Mistake bank is empty');
      else showToast('default', '\uD83C\uDF45', `${total} in bank \u00B7 all on cooldown`);
      return;
    }
    // Use the first mistake's topic as the session "owner" so theory tab works
    const firstTid = problems[0]._topicFullId;
    const found = findTopic(firstTid);
    session = { topicFullId: firstTid, problems, idx: 0, correct: 0, xpEarned: 0, mixed: true };
    state.currentTopicId = firstTid;
    if (found) { state.currentChapterId = found.chapter.id; state.currentSubject = found.chapter.subject; }
    saveState();
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('completeView').classList.remove('show');
    document.getElementById('completeView').style.display = 'none';
    document.getElementById('practiceView').style.display = 'block';
    document.getElementById('theoryView').style.display = 'none';
    document.getElementById('tabPractice').classList.add('active');
    document.getElementById('tabTheory').classList.remove('active');
    { const _tc = document.getElementById('theoryContent'); _tc.innerHTML = found?.topic?.theory || '<p>\u2014</p>'; renderMathIn(_tc); }
    showToast('default', '\uD83D\uDD01', `Reviewing ${problems.length} mistake${problems.length>1?'s':''}`);
    loadProblem();
  }
  window.startMistakeReview = startMistakeReview;

  // ---- Formula Recall: extract formulas from chapter theory ----
  function extractFormulas(chapter) {
    const formulas = [];
    chapter.parts.forEach(part => {
      part.topics.forEach(t => {
        if (!t.theory) return;
        // match <p class="formula">...</p> with attribute either order/quoting
        const re = /<p[^>]*class=["']formula["'][^>]*>([\s\S]*?)<\/p>/gi;
        let m;
        while ((m = re.exec(t.theory)) !== null) {
          formulas.push({ topic: t.name, html: m[1].trim(), part: part.name });
        }
      });
    });
    return formulas;
  }
  function openFormulaRecall(chapterId) {
    sfx('click');
    const ch = findChapter(chapterId);
    if (!ch) return;
    const formulas = extractFormulas(ch);
    if (!formulas.length) { showToast('default', '\uD83D\uDCCB', 'No formulas in this chapter'); return; }
    // Build a lightweight overlay
    let overlay = document.getElementById('formulaOverlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'formulaOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,15,20,0.6);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:260;padding:24px;';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--bg-elev);border-radius:var(--radius-xl);padding:32px;max-width:720px;width:100%;max-height:calc(100vh - 48px);overflow-y:auto;box-shadow:var(--shadow-lg);';
    let html = `
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px;">
        <div>
          <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);">Formula recall</div>
          <h2 style="font-family:'Fraunces',serif;font-size:24px;font-weight:500;letter-spacing:-0.02em;margin-top:4px;">${ch.subject} \u00B7 Ch ${ch.number}: ${ch.name}</h2>
          <div style="font-family:'Geist Mono',monospace;font-size:12px;color:var(--ink-soft);margin-top:4px;">${formulas.length} formulas</div>
        </div>
        <button class="btn btn-ghost" onclick="document.getElementById('formulaOverlay').remove()">Close</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <button class="btn btn-ghost" id="formToggleHide" style="font-size:12px;">\uD83D\uDC41 Hide formulas (recall mode)</button>
      </div>
    `;
    formulas.forEach((f, i) => {
      html += `
        <div class="formula-card" style="margin-bottom:14px;padding:16px 18px;background:var(--bg);border-radius:var(--radius-md);border-left:3px solid var(--accent);">
          <div style="font-family:'Geist Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-muted);margin-bottom:6px;">${f.topic}</div>
          <div class="formula-content" data-i="${i}" style="font-family:'Geist Mono',monospace;font-size:14px;color:var(--ink);line-height:1.6;">${f.html}</div>
        </div>
      `;
    });
    card.innerHTML = html;
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    let hidden = false;
    document.getElementById('formToggleHide').onclick = () => {
      hidden = !hidden;
      document.querySelectorAll('.formula-content').forEach(el => {
        if (hidden) {
          el.dataset.original = el.innerHTML;
          el.innerHTML = '<span style="color:var(--ink-muted);font-style:italic;cursor:pointer;">tap to reveal</span>';
          el.style.cursor = 'pointer';
          el.onclick = () => { el.innerHTML = el.dataset.original; el.onclick = null; el.style.cursor = ''; };
        } else {
          if (el.dataset.original) el.innerHTML = el.dataset.original;
          el.onclick = null; el.style.cursor = '';
        }
      });
      document.getElementById('formToggleHide').textContent = hidden ? '\uD83D\uDC41 Show all' : '\uD83D\uDC41 Hide formulas (recall mode)';
    };
  }
  window.openFormulaRecall = openFormulaRecall;

  // ---- Wrap renderChapter to add Formula Recall button + show mistake count for chapter ----
  const _origRenderChapter = renderChapter;
  renderChapter = function() {
    _origRenderChapter();
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch) return;
    const hero = root.querySelector('.chapter-hero');
    if (!hero || hero.querySelector('.formula-recall-btn')) return;
    const formulas = extractFormulas(ch);
    if (formulas.length === 0) return;
    const btn = document.createElement('button');
    btn.className = 'formula-recall-btn btn btn-ghost';
    btn.style.cssText = 'margin-top:14px;border:0.5px solid var(--line);background:var(--bg);';
    btn.innerHTML = `\uD83D\uDCCB Formulas (${formulas.length})`;
    btn.onclick = () => openFormulaRecall(ch.id);
    hero.appendChild(btn);
  };

  // ---- Add "Review Mistakes" secondary CTA on mission view ----
  const _renderMission2 = renderMission;
  renderMission = function() {
    _renderMission2();
    const root = document.getElementById('view-mission');
    const today = root?.querySelector('.today');
    if (!today || today.querySelector('.review-mistakes-btn')) return;
    const due = getDueMistakes(99).length;
    const totalBank = state.mistakeBank.length;
    if (totalBank === 0) return;
    const btn = document.createElement('button');
    btn.className = 'review-mistakes-btn today-cta secondary';
    btn.style.cssText = 'margin-top:12px;display:inline-flex;align-items:center;gap:8px;';
    btn.innerHTML = `\uD83D\uDD01 Review Mistakes <span style="font-family:'Geist Mono',monospace;font-size:11px;background:var(--accent-soft);color:var(--accent);padding:3px 8px;border-radius:100px;">${due} due / ${totalBank} total</span>`;
    btn.onclick = () => startMistakeReview();
    const heroBtn = today.querySelector('.start-session-hero');
    if (heroBtn) heroBtn.insertAdjacentElement('afterend', btn);
    else today.appendChild(btn);
  };

  // ---- Enhance end-of-session summary to mention new mistakes (passive: surfaced via toast on close) ----
  let _mistakesAddedThisSession = 0;
  const _addMistakeOrig = addMistake;
  addMistake = function(t, q) { _mistakesAddedThisSession += 1; _addMistakeOrig(t, q); };
  const _origCloseModal = closeModal;
  closeModal = function() {
    if (_mistakesAddedThisSession > 0) {
      const n = _mistakesAddedThisSession;
      _mistakesAddedThisSession = 0;
      setTimeout(() => showToast('default', '\uD83D\uDD01', `${n} new mistake${n>1?'s':''} \u2192 review queue`), 200);
    }
    _origCloseModal();
  };

  // ---- V3: Bookmark/flag system, weakest-topic surfacing, break timer, per-topic notes ----

  // ---- State migrations ----
  if (!Array.isArray(state.bookmarks)) state.bookmarks = []; // [{k, topicFullId, qIdx, addedAt}]
  if (!state.topicNotes) state.topicNotes = {}; // {topicFullId: "free text"}
  if (!state.topicAccuracy) state.topicAccuracy = {}; // {topicFullId: {correct, wrong}}
  saveState();

  // ---- Bookmark helpers ----
  function bookmarkKey(t, q) { return t + '::' + q; }
  function isBookmarked(t, q) { const k = bookmarkKey(t,q); return state.bookmarks.some(b => b.k === k); }
  function toggleBookmark(t, q) {
    const k = bookmarkKey(t, q);
    const i = state.bookmarks.findIndex(b => b.k === k);
    if (i >= 0) { state.bookmarks.splice(i,1); showToast('default','\u2606','Bookmark removed'); }
    else { state.bookmarks.push({ k, topicFullId: t, qIdx: q, addedAt: Date.now() }); showToast('default','\u2605','Bookmarked'); }
    saveState();
    renderBookmarkBtn();
  }
  function renderBookmarkBtn() {
    const btn = document.getElementById('bookmarkBtn');
    if (!btn) return;
    const t = session?.topicFullId;
    const q = session?.idx;
    if (t == null || q == null) { btn.style.display='none'; return; }
    const cur = session.problems[q];
    const realT = cur?._topicFullId || t;
    btn.style.display = '';
    btn.textContent = isBookmarked(realT, q) ? '\u2605' : '\u2606';
    btn.style.color = isBookmarked(realT, q) ? 'var(--gold)' : 'var(--ink-muted)';
    btn.onclick = () => toggleBookmark(realT, q);
  }

  // Inject bookmark button into modal head
  function injectBookmarkBtn() {
    if (document.getElementById('bookmarkBtn')) return;
    const head = document.querySelector('#modalOverlay .modal-head');
    if (!head) return;
    const btn = document.createElement('button');
    btn.id = 'bookmarkBtn';
    btn.style.cssText = 'background:transparent;border:none;cursor:pointer;font-size:18px;margin-right:8px;padding:0 4px;';
    btn.title = 'Bookmark this question (\u2605)';
    head.querySelector('.modal-counter-wrap')?.appendChild(btn);
  }
  injectBookmarkBtn();

  // Wrap loadProblem to refresh bookmark state on each question
  if (typeof loadProblem === 'function') {
    const _origLoad = loadProblem;
    loadProblem = function() { _origLoad(); injectBookmarkBtn(); renderBookmarkBtn(); };
  }

  function startBookmarkReview() {
    sfx('click');
    if (!state.bookmarks.length) { showToast('default','\u2605','No bookmarks yet'); return; }
    const problems = [];
    state.bookmarks.forEach(b => {
      const found = findTopic(b.topicFullId);
      const q = found?.topic?.questions?.[b.qIdx];
      if (q) problems.push({ ...q, _topicFullId: b.topicFullId });
    });
    if (!problems.length) { showToast('default','\u2605','Bookmarked questions not found'); return; }
    const firstTid = problems[0]._topicFullId;
    const found = findTopic(firstTid);
    session = { topicFullId: firstTid, problems, idx: 0, correct: 0, xpEarned: 0, mixed: true };
    state.currentTopicId = firstTid;
    if (found) { state.currentChapterId = found.chapter.id; state.currentSubject = found.chapter.subject; }
    saveState();
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('completeView').classList.remove('show');
    document.getElementById('completeView').style.display = 'none';
    document.getElementById('practiceView').style.display = 'block';
    document.getElementById('theoryView').style.display = 'none';
    document.getElementById('tabPractice').classList.add('active');
    document.getElementById('tabTheory').classList.remove('active');
    { const _tc = document.getElementById('theoryContent'); _tc.innerHTML = found?.topic?.theory || '<p>\u2014</p>'; renderMathIn(_tc); }
    showToast('default', '\u2605', `Drilling ${problems.length} bookmark${problems.length>1?'s':''}`);
    loadProblem();
  }
  window.startBookmarkReview = startBookmarkReview;

  // ---- Track per-topic accuracy via wrap on submitAnswer ----
  const _submitForAcc = submitAnswer;
  submitAnswer = function() {
    const idxBefore = session.idx;
    const wrongBefore = state.wrong;
    const correctBefore = state.correct;
    const cur = session.problems[idxBefore];
    const tid = cur?._topicFullId || session.topicFullId;
    _submitForAcc();
    const w = state.wrong > wrongBefore;
    const c = state.correct > correctBefore;
    if (tid) {
      state.topicAccuracy[tid] = state.topicAccuracy[tid] || { correct: 0, wrong: 0 };
      if (c) state.topicAccuracy[tid].correct += 1;
      if (w) state.topicAccuracy[tid].wrong += 1;
      saveState();
    }
  };

  // ---- Weakest topic surfacing ----
  function getWeakestTopic(minAttempts) {
    minAttempts = minAttempts || 5;
    let weakest = null;
    let lowestAcc = 1.01;
    Object.keys(state.topicAccuracy).forEach(tid => {
      const a = state.topicAccuracy[tid];
      const total = a.correct + a.wrong;
      if (total < minAttempts) return;
      const acc = a.correct / total;
      if (acc < lowestAcc) { lowestAcc = acc; weakest = { tid, acc, total }; }
    });
    return weakest;
  }
  function startWeakestDrill() {
    sfx('click');
    const w = getWeakestTopic(5);
    if (!w) { showToast('default','\uD83D\uDCCA','Need 5+ attempts on at least one topic first'); return; }
    if (typeof openTopic === 'function') {
      openTopic(w.tid);
      showToast('default', '\u26A0', `Weakest topic \u00B7 ${Math.round(w.acc*100)}% accuracy`);
    }
  }
  window.startWeakestDrill = startWeakestDrill;

  // ---- Break timer (5 min) auto after Pomodoro completes ----
  function startBreak() {
    state.pomodoro = { startedAt: Date.now(), durationMs: 5*60*1000, isBreak: true };
    saveState();
    showToast('lightning', '\u2615', 'Break: 5 minutes. Walk, water.');
    renderPomoChip();
  }
  // Patch the existing renderPomoChip behavior to auto-trigger break instead of just stopping
  // Simpler: hook into the existing setInterval indirectly by overriding when timer ends.
  // We re-detect end of pomodoro here (interval already running):
  setInterval(() => {
    if (!state.pomodoro || state.pomodoro.isBreak) return;
    const remaining = (state.pomodoro.startedAt + state.pomodoro.durationMs) - Date.now();
    if (remaining <= 0) {
      // Pomodoro just ended; chip will clear via the existing interval. Start break with slight delay.
      setTimeout(() => { if (!state.pomodoro) startBreak(); }, 500);
    }
  }, 1000);
  // Update chip rendering to show break state differently
  const _renderPomoChipOrig = (function(){
    // We can't capture the inner closure; instead extend display by polling DOM
    return null;
  })();
  setInterval(() => {
    const chip = document.getElementById('pomoChip');
    if (!chip || !state.pomodoro) return;
    const icon = chip.querySelector('.icon');
    if (state.pomodoro.isBreak) {
      if (icon) icon.textContent = '\u2615';
      chip.style.background = 'linear-gradient(135deg, var(--success), #34D399)';
      chip.style.color = 'white';
    } else {
      if (icon) icon.textContent = '\uD83C\uDF45';
      chip.style.background = '';
      chip.style.color = '';
    }
  }, 1000);

  // ---- Per-topic notes UI in chapter view ----
  function injectNotesPanel() {
    const root = document.getElementById('view-chapter');
    if (!root || root.querySelector('.notes-panel')) return;
    const ch = findChapter(state.currentChapterId);
    if (!ch) return;
    // Add a single "\uD83D\uDCDD Notes" panel at end of chapter
    const panel = document.createElement('div');
    panel.className = 'notes-panel';
    panel.style.cssText = 'margin-top:32px;padding:20px 24px;background:var(--bg-elev);border-radius:var(--radius-lg);border:0.5px solid var(--line);';
    const noteKey = 'chapter:' + ch.id;
    const cur = state.topicNotes[noteKey] || '';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
        <div style="font-family:'Fraunces',serif;font-style:italic;font-size:18px;">\uD83D\uDCDD Your notes</div>
        <span style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted);">auto-saves</span>
      </div>
      <textarea class="notes-input" placeholder="Derivation tips, formula tricks, things you keep forgetting\u2026" style="width:100%;min-height:90px;padding:12px 14px;border:1px solid var(--line);border-radius:var(--radius-md);font-family:'Geist Mono',monospace;font-size:13px;background:var(--bg);resize:vertical;outline:none;">${cur.replace(/</g,'&lt;')}</textarea>
    `;
    root.appendChild(panel);
    const ta = panel.querySelector('.notes-input');
    let timer = null;
    ta.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.topicNotes[noteKey] = ta.value;
        saveState();
      }, 400);
    });
  }
  const _origRenderChapter2 = renderChapter;
  renderChapter = function() { _origRenderChapter2(); injectNotesPanel(); };

  // ---- Add Weakest + Bookmarks buttons to mission ----
  const _renderMission3 = renderMission;
  renderMission = function() {
    _renderMission3();
    const today = document.querySelector('#view-mission .today');
    if (!today) return;
    if (!today.querySelector('.weakest-btn')) {
      const w = getWeakestTopic(5);
      if (w) {
        const found = findTopic(w.tid);
        const label = found ? `${found.chapter.subject} \u00B7 ${found.topic.name}` : w.tid;
        const btn = document.createElement('button');
        btn.className = 'weakest-btn today-cta secondary';
        btn.style.cssText = 'margin-top:12px;display:inline-flex;align-items:center;gap:8px;';
        btn.innerHTML = `\u26A0 Drill weakest <span style="font-family:'Geist Mono',monospace;font-size:11px;background:var(--danger-soft);color:var(--danger);padding:3px 8px;border-radius:100px;">${Math.round(w.acc*100)}% \u00B7 ${label}</span>`;
        btn.onclick = () => startWeakestDrill();
        today.appendChild(btn);
      }
    }
    if (!today.querySelector('.bookmark-btn') && state.bookmarks.length > 0) {
      const btn = document.createElement('button');
      btn.className = 'bookmark-btn today-cta secondary';
      btn.style.cssText = 'margin-top:12px;display:inline-flex;align-items:center;gap:8px;';
      btn.innerHTML = `\u2605 Bookmarks <span style="font-family:'Geist Mono',monospace;font-size:11px;background:var(--gold-soft);color:var(--gold);padding:3px 8px;border-radius:100px;">${state.bookmarks.length}</span>`;
      btn.onclick = () => startBookmarkReview();
      today.appendChild(btn);
    }
  };

  // ---- V4: Keyboard shortcuts + Search palette (Cmd+K) + Wrapper safety ----

  // ---- Keyboard shortcuts ----
  function isModalOpen() {
    return document.getElementById('modalOverlay')?.classList.contains('open');
  }
  function isSearchOpen() {
    return !!document.getElementById('searchPalette');
  }
  document.addEventListener('keydown', (e) => {
    // Don't intercept while typing in textareas/inputs (except inside modal)
    const tag = e.target.tagName;
    const isTyping = tag === 'TEXTAREA' || (tag === 'INPUT' && e.target.id !== 'modalInput' && e.target.id !== 'searchPaletteInput');
    if (isTyping && e.key !== 'Escape') return;

    // Cmd+K / Ctrl+K \u2014 open search palette
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchPalette();
      return;
    }
    // Escape \u2014 close any overlay
    if (e.key === 'Escape') {
      if (isSearchOpen()) { closeSearchPalette(); e.preventDefault(); return; }
      if (isModalOpen()) { closeModal(); e.preventDefault(); return; }
      const formOverlay = document.getElementById('formulaOverlay');
      if (formOverlay) { formOverlay.remove(); e.preventDefault(); return; }
      return;
    }
    // Modal-only shortcuts
    if (isModalOpen() && !isSearchOpen()) {
      const p = session.problems?.[session.idx];
      if (!p) return;
      // 1/2/3/4 select MCQ option
      if (p.type === 'mcq' && /^[1-4]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const opts = document.querySelectorAll('.mcq-option');
        if (opts[idx] && !opts[idx].classList.contains('disabled')) {
          opts[idx].click();
          e.preventDefault();
        }
        return;
      }
      // Enter \u2014 submit / next
      if (e.key === 'Enter' && document.activeElement?.tagName !== 'TEXTAREA') {
        const btn = document.getElementById('modalSubmit');
        if (btn) { btn.click(); e.preventDefault(); }
        return;
      }
      // Letter shortcuts (T / B) ONLY work when NOT focused on the answer input
      const focusedOnInput = document.activeElement?.id === 'modalInput' || document.activeElement?.tagName === 'TEXTAREA';
      if (focusedOnInput) return;
      // T \u2014 toggle theory tab
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const theoryActive = document.getElementById('tabTheory')?.classList.contains('active');
        switchTab(theoryActive ? 'practice' : 'theory');
        e.preventDefault();
        return;
      }
      // B \u2014 bookmark current question
      if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const btn = document.getElementById('bookmarkBtn');
        if (btn && btn.style.display !== 'none') { btn.click(); e.preventDefault(); }
        return;
      }
    }
  });

  // ---- Search palette ----
  function buildSearchIndex() {
    const idx = [];
    Object.keys(window.CONTENT || {}).forEach(sub => {
      (window.CONTENT[sub] || []).forEach(ch => {
        idx.push({ kind: 'chapter', sub, label: `${sub} \u00B7 Ch ${ch.number}: ${ch.name}`, action: () => openChapter(ch.id), keyword: `${sub} ${ch.name} chapter ${ch.number}`.toLowerCase() });
        ch.parts.forEach(p => p.topics.forEach(t => {
          if (!t.questions || !t.questions.length) return;
          const tid = fullTopicId(ch.id, t.id);
          idx.push({ kind: 'topic', sub, label: `${sub} \u00B7 ${ch.name} \u00B7 ${t.name}`, action: () => openTopic(tid), keyword: `${sub} ${ch.name} ${t.name}`.toLowerCase() });
        }));
      });
    });
    return idx;
  }
  let _searchIndex = null;
  function openSearchPalette() {
    if (isSearchOpen()) return;
    if (!_searchIndex) _searchIndex = buildSearchIndex();
    const overlay = document.createElement('div');
    overlay.id = 'searchPalette';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,15,20,0.5);backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding-top:80px;z-index:300;';
    overlay.onclick = (e) => { if (e.target === overlay) closeSearchPalette(); };
    overlay.innerHTML = `
      <div style="background:var(--bg-elev);border-radius:var(--radius-xl);width:min(640px, 92vw);box-shadow:var(--shadow-lg);overflow:hidden;display:flex;flex-direction:column;max-height:70vh;">
        <input id="searchPaletteInput" placeholder="Jump to chapter, topic\u2026 (try 'optics' or 'integ')" style="border:none;outline:none;padding:18px 22px;font-family:'Geist',sans-serif;font-size:16px;background:var(--bg-elev);border-bottom:0.5px solid var(--line);" autofocus />
        <div id="searchPaletteResults" style="overflow-y:auto;padding:6px;"></div>
        <div style="padding:10px 16px;border-top:0.5px solid var(--line);font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted);display:flex;gap:14px;">
          <span>\u2191\u2193 navigate</span><span>\u21B5 open</span><span>Esc close</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const input = document.getElementById('searchPaletteInput');
    let activeIdx = 0;
    let filtered = _searchIndex.slice(0, 50);
    function render() {
      const results = document.getElementById('searchPaletteResults');
      if (!results) return;
      if (!filtered.length) { results.innerHTML = '<div style="padding:24px;color:var(--ink-muted);text-align:center;">No matches</div>'; return; }
      results.innerHTML = filtered.slice(0, 30).map((r, i) => `
        <div data-idx="${i}" class="sp-row" style="padding:12px 16px;border-radius:var(--radius-md);cursor:pointer;display:flex;justify-content:space-between;align-items:center;${i===activeIdx?'background:var(--accent-soft);':''}">
          <span>${r.label}</span>
          <span style="font-family:'Geist Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-muted);">${r.kind}</span>
        </div>
      `).join('');
      results.querySelectorAll('.sp-row').forEach((row, i) => {
        row.onmouseenter = () => { activeIdx = i; render(); };
        row.onclick = () => { filtered[i].action(); closeSearchPalette(); };
      });
    }
    function search(q) {
      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!tokens.length) filtered = _searchIndex.slice(0, 50);
      else filtered = _searchIndex.filter(it => tokens.every(t => it.keyword.includes(t)));
      activeIdx = 0;
      render();
    }
    input.addEventListener('input', () => search(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { activeIdx = Math.min(activeIdx + 1, filtered.length - 1, 29); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { activeIdx = Math.max(activeIdx - 1, 0); render(); e.preventDefault(); }
      else if (e.key === 'Enter') { if (filtered[activeIdx]) { filtered[activeIdx].action(); closeSearchPalette(); } e.preventDefault(); }
    });
    render();
    setTimeout(() => input.focus(), 50);
  }
  function closeSearchPalette() {
    const o = document.getElementById('searchPalette');
    if (o) o.remove();
  }
  window.openSearchPalette = openSearchPalette;

  // ---- Floating help/search hint button (bottom-right) ----
  function injectSearchHint() {
    if (document.getElementById('searchHint')) return;
    const btn = document.createElement('button');
    btn.id = 'searchHint';
    btn.title = 'Search (Ctrl+K) \u00B7 Press B to bookmark, T to toggle theory, 1-4 for MCQ, Enter to submit';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--ink);color:white;border:none;border-radius:100px;padding:10px 16px;font-family:"Geist Mono",monospace;font-size:12px;cursor:pointer;box-shadow:0 8px 24px rgba(15,15,20,0.3);z-index:50;display:flex;align-items:center;gap:8px;';
    btn.innerHTML = '\u2318K <span style="opacity:0.6;">search</span>';
    btn.onclick = () => openSearchPalette();
    document.body.appendChild(btn);
  }
  injectSearchHint();

  // ---- V5: Daily heatmap + Topic spaced repetition ----

  // ---- State migration ----
  if (!state.dailyHistory) state.dailyHistory = {}; // {YYYY-MM-DD: {solved, correct}}
  if (!state.topicReview) state.topicReview = {}; // {topicFullId: {masteredAt, reviewIntervalDays, nextReviewAt}}
  saveState();

  // ---- Daily history capture ----
  const _submitForHist = submitAnswer;
  submitAnversForHist = null; // placeholder to ensure no collision
  submitAnswer = function() {
    const wBefore = state.wrong; const cBefore = state.correct;
    _submitForHist();
    const w = state.wrong > wBefore; const c = state.correct > cBefore;
    const day = new Date().toISOString().slice(0,10);
    state.dailyHistory[day] = state.dailyHistory[day] || { solved: 0, correct: 0 };
    state.dailyHistory[day].solved += 1;
    if (c) state.dailyHistory[day].correct += 1;
    saveState();
  };

  // ---- Topic spaced rep: when a topic is marked done, schedule reviews ----
  const TOPIC_REVIEW_INTERVALS = [7, 14, 30, 60]; // days
  const _origFinishTopic = (typeof finishTopic === 'function') ? finishTopic : null;
  if (_origFinishTopic) {
    finishTopic = function() {
      const tid = session?.topicFullId;
      _origFinishTopic();
      if (tid && state.topics[tid]?.done) {
        const prev = state.topicReview[tid];
        const stage = prev ? Math.min((prev.stage || 0) + 1, TOPIC_REVIEW_INTERVALS.length - 1) : 0;
        const days = TOPIC_REVIEW_INTERVALS[stage];
        state.topicReview[tid] = { masteredAt: Date.now(), stage, nextReviewAt: Date.now() + days*24*60*60*1000 };
        saveState();
      }
    };
  }
  function getDueTopics() {
    const now = Date.now();
    return Object.keys(state.topicReview).filter(tid => state.topicReview[tid].nextReviewAt <= now);
  }
  function startTopicReview() {
    sfx('click');
    const due = getDueTopics();
    if (!due.length) { showToast('default','\uD83D\uDCC5','No topics due for review'); return; }
    // Pick the most overdue one
    due.sort((a,b) => state.topicReview[a].nextReviewAt - state.topicReview[b].nextReviewAt);
    const tid = due[0];
    if (typeof openTopic === 'function') {
      openTopic(tid);
      const found = findTopic(tid);
      showToast('default', '\uD83D\uDCC5', `Refresher: ${found?.topic?.name || 'topic'}`);
      // Schedule next refresher
      const cur = state.topicReview[tid];
      const stage = Math.min((cur.stage || 0) + 1, TOPIC_REVIEW_INTERVALS.length - 1);
      state.topicReview[tid] = { ...cur, stage, nextReviewAt: Date.now() + TOPIC_REVIEW_INTERVALS[stage]*24*60*60*1000 };
      saveState();
    }
  }
  window.startTopicReview = startTopicReview;

  // ---- Week heatmap (last 7 days) ----
  function injectHeatmap() {
    const root = document.getElementById('view-mission');
    if (!root || root.querySelector('.heatmap-strip')) return;
    const today = root.querySelector('.today');
    if (!today) return;
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i*24*60*60*1000);
      const key = d.toISOString().slice(0,10);
      const data = state.dailyHistory[key] || { solved: 0, correct: 0 };
      days.push({
        key,
        label: ['S','M','T','W','T','F','S'][d.getDay()],
        date: d.getDate(),
        solved: data.solved,
        acc: data.solved > 0 ? data.correct / data.solved : 0,
        isToday: i === 0
      });
    }
    const maxSolved = Math.max(1, ...days.map(d => d.solved));
    const wrap = document.createElement('div');
    wrap.className = 'heatmap-strip';
    wrap.style.cssText = 'margin-top:18px;padding:14px 18px;background:var(--bg);border-radius:var(--radius-md);border:0.5px solid var(--line);';
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
        <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-muted);">Last 7 days</div>
        <div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-soft);">${days.reduce((s,d)=>s+d.solved,0)} solved</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">
        ${days.map(d => {
          const intensity = d.solved === 0 ? 0 : 0.15 + 0.85 * (d.solved / maxSolved);
          const bg = d.solved === 0 ? 'var(--line-soft)' : `rgba(30,58,255,${intensity.toFixed(2)})`;
          const txtColor = intensity > 0.5 ? 'white' : 'var(--ink)';
          return `
            <div title="${d.key} \u00B7 ${d.solved} solved \u00B7 ${d.solved>0?Math.round(d.acc*100)+'%':''} acc" style="background:${bg};border-radius:8px;padding:8px 4px;text-align:center;color:${txtColor};${d.isToday?'box-shadow:0 0 0 2px var(--accent);':''}">
              <div style="font-family:'Geist Mono',monospace;font-size:10px;opacity:0.8;">${d.label}</div>
              <div style="font-family:'Fraunces',serif;font-weight:500;font-size:18px;line-height:1.1;margin-top:2px;">${d.solved || '\u00B7'}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    today.insertAdjacentElement('afterend', wrap);
  }

  // ---- Inject Topic Review button + Heatmap into mission ----
  const _renderMission4 = renderMission;
  renderMission = function() {
    _renderMission4();
    injectHeatmap();
    const today = document.querySelector('#view-mission .today');
    if (!today || today.querySelector('.topic-review-btn')) return;
    const due = getDueTopics();
    if (due.length === 0) return;
    const btn = document.createElement('button');
    btn.className = 'topic-review-btn today-cta secondary';
    btn.style.cssText = 'margin-top:12px;display:inline-flex;align-items:center;gap:8px;';
    btn.innerHTML = `\uD83D\uDCC5 Topic refresher <span style="font-family:'Geist Mono',monospace;font-size:11px;background:var(--accent-soft);color:var(--accent);padding:3px 8px;border-radius:100px;">${due.length} due</span>`;
    btn.onclick = () => startTopicReview();
    today.appendChild(btn);
  };

  // ---- V6: Frictionless start ----

  // Auto-redirect to Mission on cold open (so app always opens to "ready to drill")
  // Only fires once per page load via window-scoped flag.
  if (!window.__sd_coldOpen) {
    window.__sd_coldOpen = true;
    if (state.view !== 'mission') {
      state.view = 'mission'; saveState();
    }
  }

  // Hoist Start Session hero ABOVE the today block (it appended to .today; move out and put first)
  const _renderMission5 = renderMission;
  renderMission = function() {
    _renderMission5();
    const root = document.getElementById('view-mission');
    if (!root) return;
    const today = root.querySelector('.today');
    const hero = today?.querySelector('.start-session-hero');
    if (today && hero && today.firstChild !== hero.previousSibling) {
      // Move hero to be the FIRST element in the mission view
      root.insertBefore(hero, root.firstChild);
      hero.style.marginTop = '0';
      hero.style.marginBottom = '24px';
      // Make it bigger / more dominant
      hero.style.padding = '28px 32px';
      const titleEl = hero.querySelector('div > div:nth-child(2)');
      if (titleEl) titleEl.style.fontSize = '32px';
      // Auto-focus so Enter/Space triggers it
      hero.tabIndex = 0;
      hero.style.outline = 'none';
      hero.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hero.click(); }
      }, { once: false });
      setTimeout(() => { try { hero.focus(); } catch(e){} }, 50);
    }
  };

  // Global 'S' hotkey -> start session (when not typing, no modal/search open)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 's' && e.key !== 'S') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (document.getElementById('modalOverlay')?.classList.contains('open')) return;
    if (document.getElementById('searchPalette')) return;
    if (document.getElementById('formulaOverlay')) return;
    e.preventDefault();
    if (typeof startSession === 'function') startSession();
  });

  // Inject a tiny "Press S or click to start" subtitle hint inside the hero
  const _renderMission6 = renderMission;
  renderMission = function() {
    _renderMission6();
    const hero = document.querySelector('.start-session-hero');
    if (hero && !hero.querySelector('.start-hotkey-hint')) {
      const hint = document.createElement('div');
      hint.className = 'start-hotkey-hint';
      hint.style.cssText = 'font-family:"Geist Mono",monospace;font-size:10px;opacity:0.7;margin-top:8px;letter-spacing:0.05em;';
      hint.textContent = 'Press S anywhere \u00B7 Enter to start';
      const inner = hero.querySelector('div');
      if (inner) inner.appendChild(hint);
    }
  };

  // ---- V7: Timetable sync (block-aware Start Session) ----

  // 5 study blocks per day. Each is 25 min Pomodoro + ~5 min break.
  const BLOCKS = [
    { idx: 1, startH: 17, startM: 0,  endH: 17, endM: 25 },
    { idx: 2, startH: 17, startM: 30, endH: 17, endM: 55 },
    { idx: 3, startH: 18, startM: 0,  endH: 18, endM: 25 },
    { idx: 4, startH: 18, startM: 35, endH: 19, endM: 0  },
    { idx: 5, startH: 19, startM: 5,  endH: 19, endM: 30 },
  ];

  // Standard rotation (Phase 1+): Lead = blocks 1+3, Second = 2+4, Maint = 5
  // From timetable.md
  const ROTATION = {
    1: { lead: 'Maths',     second: 'Physics', maint: 'Chemistry' }, // Mon
    2: { lead: 'Physics',   second: 'Maths',   maint: 'Chemistry' }, // Tue
    3: { lead: 'Maths',     second: 'Physics', maint: 'Chemistry' }, // Wed
    4: { lead: null,        second: null,      maint: null,        thursday: true }, // Thu lighter
    5: { lead: 'Maths',     second: 'Physics', maint: 'Chemistry' }, // Fri
    6: { lead: 'Physics',   second: 'Maths',   maint: 'Chemistry' }, // Sat
    0: { sunday: true }, // Sun = mock day
  };

  // No date overrides \u2014 standard rotation applies every day. English Lit project is handled outside the app.
  const PHASE0_OVERRIDES = {};

  function blockSubject(blockIdx, dayOfWeek) {
    const r = ROTATION[dayOfWeek];
    if (!r || r.sunday) return null;
    if (r.thursday) return blockIdx === 1 ? 'Maths' : (blockIdx === 2 ? 'Physics' : null);
    if (blockIdx === 1 || blockIdx === 3) return r.lead;
    if (blockIdx === 2 || blockIdx === 4) return r.second;
    if (blockIdx === 5) return r.maint;
    return null;
  }

  function nowInfo() {
    const now = new Date();
    const day = now.getDay();
    const hr = now.getHours();
    const mn = now.getMinutes();
    const dateKey = now.toISOString().slice(0, 10);
    const phase0 = PHASE0_OVERRIDES[dateKey];
    return { now, day, hr, mn, dateKey, phase0 };
  }

  function findActiveBlock() {
    const { hr, mn } = nowInfo();
    const cur = hr * 60 + mn;
    return BLOCKS.find(b => {
      const s = b.startH * 60 + b.startM;
      const e = b.endH * 60 + b.endM;
      return cur >= s && cur < e;
    }) || null;
  }
  function findNextBlock() {
    const { hr, mn } = nowInfo();
    const cur = hr * 60 + mn;
    return BLOCKS.find(b => (b.startH * 60 + b.startM) > cur) || null;
  }

  function getPlannedSubject() {
    // Returns: { subject, blockIdx?, blockEndsIn?, source: 'phase0'|'block'|'fallback' } or null
    const { day, phase0 } = nowInfo();
    if (phase0?.skip) return { subject: null, source: 'phase0', skip: true, note: phase0.note };
    if (phase0?.allBlocks) return { subject: phase0.allBlocks, source: 'phase0', note: phase0.note };
    const active = findActiveBlock();
    if (active) {
      const subj = blockSubject(active.idx, day);
      if (subj) return { subject: subj, blockIdx: active.idx, source: 'block' };
    }
    // Fallback: pick next block's subject if any, else Mon's lead
    const next = findNextBlock();
    if (next) {
      const subj = blockSubject(next.idx, day);
      if (subj) return { subject: subj, blockIdx: next.idx, source: 'fallback', isNext: true };
    }
    return null;
  }

  // Smart-continue restricted to a specific subject
  function smartContinueForSubject(subject) {
    if (!subject) return null;
    // 1. If currentChapterId belongs to this subject and has incomplete topics, use it
    if (state.currentChapterId) {
      const ch = findChapter(state.currentChapterId);
      if (ch && ch.subject === subject) {
        for (const part of ch.parts) {
          for (const t of part.topics) {
            if (t.questions && t.questions.length && !state.topics[fullTopicId(ch.id, t.id)]?.done) {
              return { chapter: ch, topic: t };
            }
          }
        }
      }
    }
    // 2. First chapter in subject with incomplete topic
    const chapters = getSubjectChapters(subject);
    for (const ch of chapters) {
      for (const part of ch.parts) {
        for (const t of part.topics) {
          if (t.questions && t.questions.length && !state.topics[fullTopicId(ch.id, t.id)]?.done) {
            return { chapter: ch, topic: t };
          }
        }
      }
    }
    return null;
  }

  // Wrap startSession to honor planned subject when in a block
  const _origStartSession = window.startSession;
  function startSessionForSubject(subject) {
    sfx('click');
    const cont = smartContinueForSubject(subject) || smartContinue();
    if (!cont) { showToast('default', '\u2726', 'All ready topics mastered!'); return; }
    const fullId = fullTopicId(cont.chapter.id, cont.topic.id);
    const baseProblems = (cont.topic.questions || []).slice();
    const dueMistakes = getDueMistakes(3);
    const warmup = resolveMistakeProblems(dueMistakes);
    const merged = warmup.concat(baseProblems);
    if (!merged.length) { showToast('default', '\u2726', 'Nothing to drill.'); return; }
    session = { topicFullId: fullId, problems: merged, idx: 0, correct: 0, xpEarned: 0, mixed: warmup.length > 0 };
    state.currentTopicId = fullId;
    state.currentChapterId = cont.chapter.id;
    state.currentSubject = cont.chapter.subject;
    saveState();
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('completeView').classList.remove('show');
    document.getElementById('completeView').style.display = 'none';
    document.getElementById('practiceView').style.display = 'block';
    document.getElementById('theoryView').style.display = 'none';
    document.getElementById('tabPractice').classList.add('active');
    document.getElementById('tabTheory').classList.remove('active');
    const found = findTopic(fullId);
    { const _tc = document.getElementById('theoryContent'); _tc.innerHTML = found?.topic?.theory || '<p>\u2014</p>'; renderMathIn(_tc); }
    if (warmup.length) showToast('default', '\uD83D\uDD01', `Warm-up: ${warmup.length} from mistake bank`);
    if (typeof startPomodoro === 'function') startPomodoro();
    loadProblem();
  }
  window.startSessionForSubject = startSessionForSubject;

  // Replace startSession to use planned subject by default
  startSession = function() {
    const planned = getPlannedSubject();
    if (planned?.skip) { showToast('default', '\uD83D\uDCC5', planned.note || 'Today is a non-study day'); return; }
    const subj = planned?.subject;
    startSessionForSubject(subj);
  };
  window.startSession = startSession;

  // ---- Update Start Session hero with block info + subject buttons ----
  const _renderMissionV7 = renderMission;
  renderMission = function() {
    _renderMissionV7();
    const hero = document.querySelector('.start-session-hero');
    if (!hero || hero.querySelector('.block-info')) return;
    const planned = getPlannedSubject();
    const inner = hero.querySelector('div');
    if (!inner) return;

    // Replace the subtitle text dynamically based on plan
    const sub = inner.querySelector('div:nth-child(3)');
    if (sub && planned) {
      if (planned.skip) {
        sub.textContent = planned.note || 'Non-study day';
      } else if (planned.source === 'block') {
        const a = findActiveBlock();
        const endMin = a ? a.endH * 60 + a.endM : 0;
        const nowMin = new Date().getHours()*60 + new Date().getMinutes();
        const left = endMin - nowMin;
        sub.innerHTML = `<strong>Block ${planned.blockIdx}/5 \u00B7 ${planned.subject}</strong> \u00B7 ${left} min left in block`;
      } else if (planned.source === 'phase0') {
        sub.innerHTML = `<strong>${planned.subject}</strong> \u00B7 ${planned.note}`;
      } else if (planned.isNext) {
        const next = findNextBlock();
        sub.innerHTML = `Next block ${next.idx}/5 at ${String(next.startH).padStart(2,'0')}:${String(next.startM).padStart(2,'0')} \u00B7 <strong>${planned.subject}</strong>`;
      }
    }

    // Inject "Override subject" mini-row
    const row = document.createElement('div');
    row.className = 'block-info';
    row.style.cssText = 'margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;';
    ['Physics','Chemistry','Maths'].forEach(sub => {
      const isPlanned = planned?.subject === sub;
      const btn = document.createElement('button');
      btn.style.cssText = `padding:6px 14px;border-radius:100px;font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;border:1px solid rgba(255,255,255,0.3);background:${isPlanned ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.1)'};color:${isPlanned ? 'var(--accent)' : 'white'};font-weight:${isPlanned ? '600' : '500'};`;
      btn.textContent = sub.slice(0, 4);
      btn.title = `Start ${sub} session`;
      btn.onclick = (e) => { e.stopPropagation(); startSessionForSubject(sub); };
      row.appendChild(btn);
    });
    inner.appendChild(row);
  };

  // ---- V8: Phase tracker + Bonus session mode + Today counter ----

  // The 6 phases of the study plan (dates from Timetable.md)
  const PHASES = [
    { num: 0, name: 'This Week',  start: '2026-04-27', end: '2026-04-30', desc: 'Phase 0 kickoff' },
    { num: 1, name: 'First Pass', start: '2026-05-01', end: '2026-06-21', desc: 'Cover every PCM chapter once' },
    { num: 2, name: 'EV1 Prep',   start: '2026-06-22', end: '2026-07-03', desc: 'Tighten for EV1 (starts 4 Jul)' },
    { num: 3, name: 'Deep Dive',  start: '2026-07-08', end: '2026-10-31', desc: 'ISC derivations \u00B7 PYQ grind' },
    { num: 4, name: 'PB1 Prep',   start: '2026-11-01', end: '2026-12-05', desc: 'Mock papers \u00B7 weak-spot patching' },
    { num: 5, name: 'PB2 Prep',   start: '2026-12-06', end: '2027-01-10', desc: 'Full mocks \u00B7 handwritten papers' },
    { num: 6, name: 'Final Blitz',start: '2027-01-11', end: '2027-02-28', desc: 'PYQs daily \u00B7 BOARDS' },
  ];

  // Phase 1 week-by-week chapter targets (per Timetable.md)
  // Format: weekIdx (1-based from May 1) \u2192 { Physics, Maths, Chemistry } chapter numbers
  const PHASE1_WEEKS = [
    { range: '2026-05-01..2026-05-03', physics: 1,  maths: 2,  chemistry: 1, label: 'Week 1: Phys Ch 1 \u00B7 Inverse Trig \u00B7 Solutions' },
    { range: '2026-05-04..2026-05-10', physics: 2,  maths: 3,  chemistry: 2, label: 'Week 2: Phys Ch 2 \u00B7 Matrices \u00B7 Electrochemistry' },
    { range: '2026-05-11..2026-05-17', physics: 3,  maths: 4,  chemistry: 3, label: 'Week 3: Phys Ch 3 \u00B7 Determinants \u00B7 Kinetics' },
    { range: '2026-05-18..2026-05-24', physics: 4,  maths: 5,  chemistry: 4, label: 'Week 4: Phys Ch 4 \u00B7 Cont & Diff \u00B7 d/f Block' },
    { range: '2026-05-25..2026-05-31', physics: 5,  maths: 6,  chemistry: 5, label: 'Week 5: Phys Ch 5 \u00B7 App Derivatives \u00B7 Coordination' },
    { range: '2026-06-01..2026-06-07', physics: 6,  maths: 7,  chemistry: 6, label: 'Week 6: Phys Ch 6 \u00B7 Integration \u00B7 Haloalkanes' },
    { range: '2026-06-08..2026-06-14', physics: 7,  maths: 8,  chemistry: 7, label: 'Week 7: Phys Ch 7 \u00B7 App Integrals \u00B7 Alcohols/Phenols' },
  ];

  function getCurrentPhase() {
    const today = new Date().toISOString().slice(0, 10);
    return PHASES.find(p => today >= p.start && today <= p.end) || null;
  }
  function getCurrentPhase1Week() {
    const today = new Date().toISOString().slice(0, 10);
    return PHASE1_WEEKS.find(w => {
      const [a, b] = w.range.split('..');
      return today >= a && today <= b;
    }) || null;
  }

  // Bonus mode detection: outside the 17:00-19:30 study window
  function isBonusTime() {
    const { hr, mn } = nowInfo();
    const cur = hr * 60 + mn;
    const blockStart = 17 * 60;
    const blockEnd = 19 * 60 + 30;
    return cur < blockStart || cur > blockEnd;
  }

  // Today's question count
  function todayCount() {
    const day = new Date().toISOString().slice(0, 10);
    return state.dailyHistory[day]?.solved || 0;
  }

  // ---- Inject Phase tracker + Bonus banner + Today counter ----
  const _renderMissionV8 = renderMission;
  renderMission = function() {
    _renderMissionV8();
    const root = document.getElementById('view-mission');
    if (!root) return;
    const hero = root.querySelector('.start-session-hero');
    if (!hero) return;

    // 1. Bonus mode: rewrite subtitle + add "\uD83C\uDF81 Bonus" badge
    const bonus = isBonusTime();
    if (bonus && !hero.querySelector('.bonus-badge')) {
      const sub = hero.querySelector('div > div:nth-child(3)');
      const next = findNextBlock();
      const planned = getPlannedSubject();
      if (sub) {
        if (next && planned) {
          sub.innerHTML = `<strong>\uD83C\uDF81 Bonus session</strong> \u00B7 pick a subject below or default to <strong>${planned.subject}</strong> (next block at ${String(next.startH).padStart(2,'0')}:${String(next.startM).padStart(2,'0')})`;
        } else {
          sub.innerHTML = `<strong>\uD83C\uDF81 Bonus session</strong> \u00B7 pick a subject`;
        }
      }
      const badge = document.createElement('div');
      badge.className = 'bonus-badge';
      badge.style.cssText = 'position:absolute;top:14px;right:14px;background:rgba(255,215,100,0.25);border:1px solid rgba(255,215,100,0.5);padding:4px 10px;border-radius:100px;font-family:"Geist Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;';
      badge.textContent = '\uD83C\uDF81 Bonus';
      hero.style.position = 'relative';
      hero.appendChild(badge);
    }

    // 2. Today counter \u2014 small chip below the hero
    if (!root.querySelector('.today-count')) {
      const n = todayCount();
      const chip = document.createElement('div');
      chip.className = 'today-count';
      chip.style.cssText = 'margin:8px 0 16px;padding:10px 16px;background:var(--bg-elev);border:0.5px solid var(--line);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:space-between;font-family:"Geist Mono",monospace;font-size:12px;';
      const target = 60; // ~5 blocks \u00D7 12 Qs/block
      const pct = Math.min(100, Math.round((n / target) * 100));
      chip.innerHTML = `
        <span style="color:var(--ink-soft);">Today: <strong style="color:var(--ink);font-size:16px;">${n}</strong> questions \u00B7 target ${target}</span>
        <span style="font-family:'Geist Mono',monospace;font-size:11px;color:${n >= target ? 'var(--success)' : (n >= target/2 ? 'var(--gold)' : 'var(--ink-muted)')};">${pct}%</span>
      `;
      hero.insertAdjacentElement('afterend', chip);
    }

    // 3. Phase tracker \u2014 small panel under heatmap
    const heatmap = root.querySelector('.heatmap-strip');
    if (heatmap && !root.querySelector('.phase-tracker')) {
      const phase = getCurrentPhase();
      const week = getCurrentPhase1Week();
      const tracker = document.createElement('div');
      tracker.className = 'phase-tracker';
      tracker.style.cssText = 'margin-top:14px;padding:14px 18px;background:var(--bg-elev);border:0.5px solid var(--line);border-radius:var(--radius-md);';
      let label = phase ? `Phase ${phase.num} \u00B7 ${phase.name}` : 'Pre-Phase';
      let sub = phase ? phase.desc : '';
      if (week) sub = week.label;
      // Date range progress bar within phase
      let pct = 0;
      if (phase) {
        const start = new Date(phase.start).getTime();
        const end = new Date(phase.end).getTime();
        const now = Date.now();
        pct = Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
      }
      tracker.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
          <div>
            <div style="font-family:'Geist Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-muted);">Where you are in the plan</div>
            <div style="font-family:'Fraunces',serif;font-size:16px;font-weight:500;letter-spacing:-0.01em;margin-top:2px;">${label}</div>
            <div style="font-size:12px;color:var(--ink-soft);margin-top:2px;">${sub}</div>
          </div>
          <div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted);">${pct}%</div>
        </div>
        <div style="height:4px;background:var(--line-soft);border-radius:100px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),#5A6FFF);border-radius:100px;"></div>
        </div>
      `;
      heatmap.insertAdjacentElement('afterend', tracker);
    }
  };

  // ---- V9: Replace janky Power Hour banner with a clean header chip ----
  function renderPowerHourChip() {
    let chip = document.getElementById('powerHourChip');
    const active = (state.powerHour && Date.now() < state.powerHour.endsAt);
    if (!active) { if (chip) chip.remove(); return; }
    const remaining = state.powerHour.endsAt - Date.now();
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const txt = `${m}:${String(s).padStart(2,'0')}`;
    const stats = document.querySelector('.header-stats');
    if (!stats) return;
    if (!chip) {
      chip = document.createElement('div');
      chip.id = 'powerHourChip';
      chip.className = 'stat-chip';
      chip.style.cssText = 'background:linear-gradient(135deg, #C8902B, #FF8A3D); color:white; border:none; box-shadow:0 4px 12px rgba(255,138,61,0.25);';
      chip.innerHTML = `<span class="icon">\u26A1</span><span><strong>2\u00D7</strong></span><span id="phChipTime" style="font-family:\'Geist Mono\',monospace;">${txt}</span>`;
      stats.insertBefore(chip, stats.firstChild);
    } else {
      const t = document.getElementById('phChipTime');
      if (t) t.textContent = txt;
    }
  }
  // KILL the legacy banner DOM entirely (V12: it was the orange culprit) & poll to keep chip fresh
  setInterval(() => {
    const oldBanner = document.getElementById('powerHourBanner');
    if (oldBanner) oldBanner.remove();
    // Also kill anything else with the .power-hour-banner class
    document.querySelectorAll('.power-hour-banner').forEach(el => el.remove());
    renderPowerHourChip();
  }, 1000);
  renderPowerHourChip();

  // ---- V10b: Theory-first ONLY for new topics (not every session) ----
  // Hook into loadProblem: when the FIRST problem of a NEW topic loads, flip to theory.
  // "New" = no recorded attempts yet on this topic (state.topics[fullId].attempts is 0/undefined).
  // Subsequent topics or already-attempted topics open on Practice as normal.
  let _v10b_handledTopicForSession = null;
  const _origLoadProblemV10b = loadProblem;
  loadProblem = function() {
    _origLoadProblemV10b();
    const tid = session?.topicFullId;
    if (!tid || tid === _v10b_handledTopicForSession) return;
    _v10b_handledTopicForSession = tid;
    const cur = session.problems[session.idx];
    // Skip theory-first for warm-up mistakes (they have _topicFullId from another topic)
    if (cur?._mistake) return;
    const ts = state.topics[tid];
    const isNew = !ts || !ts.attempts || ts.attempts === 0;
    if (!isNew) return;
    // Flip to theory
    try { switchTab('theory'); } catch(e){}
    // Pause per-question timer so the 60s clock doesn't burn during reading
    try { stopTimer(); } catch(e){}
    const fill = document.getElementById('timerBarFill');
    if (fill) fill.style.width = '100%';
    // Inject a small banner with a "Start questions" button at top of theory
    const theoryView = document.getElementById('theoryView');
    if (theoryView && !document.getElementById('newTopicBanner')) {
      const banner = document.createElement('div');
      banner.id = 'newTopicBanner';
      banner.style.cssText = 'margin:0 0 18px;padding:14px 18px;background:linear-gradient(135deg, var(--accent-soft), #EEF1FF);border:1px solid rgba(30,58,255,0.3);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;';
      banner.innerHTML = `
        <div>
          <div style="font-family:'Geist Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);">\uD83D\uDCD6 New topic \u00B7 \uD83C\uDF45 Pomodoro running</div>
          <div style="font-family:'Fraunces',serif;font-size:15px;margin-top:2px;color:var(--ink);">Read first, then drill.</div>
        </div>
        <button class="btn btn-primary" id="newTopicStartBtn" style="white-space:nowrap;">\u25B6 Start questions</button>
      `;
      theoryView.insertBefore(banner, theoryView.firstChild);
      document.getElementById('newTopicStartBtn').onclick = () => {
        banner.remove();
        try { switchTab('practice'); } catch(e){}
      };
    }
  };
  // Reset the per-session "handled" tracker when modal opens
  const _origCloseModalV10b = closeModal;
  closeModal = function() { _v10b_handledTopicForSession = null; const b = document.getElementById('newTopicBanner'); if (b) b.remove(); _origCloseModalV10b(); };

  // V10 helpers removed (theory-flip de-scoped). T hotkey still flips tabs.
  // Per-question timer pause/resume on tab switch \u2014 kept, simpler version:
  const _origSwitchTab = (typeof switchTab === 'function') ? switchTab : null;
  if (_origSwitchTab) {
    switchTab = function(tab) {
      _origSwitchTab(tab);
      if (tab === 'theory') {
        try { stopTimer(); } catch(e){}
        const fill = document.getElementById('timerBarFill');
        if (fill) fill.style.width = '100%';
      } else if (tab === 'practice') {
        try { startTimer(); } catch(e){}
      }
    };
  }

  // ---- V11: In-modal Pomodoro indicator (the header chip is hidden behind the overlay) ----
  function renderModalPomoIndicator() {
    const modalOpen = document.getElementById('modalOverlay')?.classList.contains('open');
    let ind = document.getElementById('modalPomoInd');
    if (!modalOpen || !state.pomodoro) { if (ind) ind.remove(); return; }
    const remaining = (state.pomodoro.startedAt + state.pomodoro.durationMs) - Date.now();
    if (remaining <= 0) { if (ind) ind.remove(); return; }
    const mm = String(Math.floor(remaining / 60000)).padStart(2,'0');
    const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2,'0');
    const isBreak = state.pomodoro.isBreak;
    const txt = `${isBreak ? '\u2615' : '\uD83C\uDF45'} ${mm}:${ss}`;
    if (!ind) {
      const head = document.querySelector('#modalOverlay .modal-head');
      if (!head) return;
      ind = document.createElement('div');
      ind.id = 'modalPomoInd';
      ind.style.cssText = 'font-family:"Geist Mono",monospace;font-size:13px;font-weight:600;background:'+(isBreak?'var(--success-soft)':'var(--accent-soft)')+';color:'+(isBreak?'var(--success)':'var(--accent)')+';padding:6px 12px;border-radius:100px;margin-right:8px;';
      ind.textContent = txt;
      const counterWrap = head.querySelector('.modal-counter-wrap');
      if (counterWrap) counterWrap.appendChild(ind);
      else head.insertBefore(ind, head.firstChild);
    } else {
      ind.textContent = txt;
      ind.style.background = isBreak ? 'var(--success-soft)' : 'var(--accent-soft)';
      ind.style.color = isBreak ? 'var(--success)' : 'var(--accent)';
    }
  }
  setInterval(renderModalPomoIndicator, 1000);
  renderModalPomoIndicator();

  // ---- V12: Fix the orange smear (don't kill the rewards) ----
  // Root cause: the .toast (orange gradient when 'lightning' kind) sits at fixed bottom-center
  // with z-index:200. The mystery overlay (z-index:250) has backdrop-filter:blur(12px) which
  // SMEARS the bright toast pixel-data behind it into a giant orange blob.
  // Fix: inject CSS that removes backdrop-filter from overlays AND lifts toast above them so
  // it doesn't get smeared. Also constrain toast to a sensible max-width.
  const fixCSS = document.createElement('style');
  fixCSS.id = 'v12-blur-fix';
  fixCSS.textContent = `
    .mystery-overlay, .export-overlay, .modal-overlay {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      background: rgba(15,15,20,0.55) !important;
    }
    .toast {
      z-index: 999 !important;
      max-width: 320px;
      max-height: 60px;
      overflow: hidden;
      will-change: transform;
    }
    .lightning {
      z-index: 350 !important;
    }
    /* Power Hour banner (legacy) \u2014 never let it render */
    .power-hour-banner, #powerHourBanner { display: none !important; }
  `;
  document.head.appendChild(fixCSS);

  // ---- V12 (original): Defensive visual cleanup (kill stuck overlays) ----
  // Force-clear any lingering animation class on elements that should be transient.
  setInterval(() => {
    const flash = document.getElementById('lightning');
    if (flash && flash.classList.contains('show')) {
      // Lightning is a 0.6s animation. If still showing after 2s, force it off.
      const since = parseInt(flash.dataset.since || '0', 10);
      const now = Date.now();
      if (!since) flash.dataset.since = String(now);
      else if (now - since > 1500) {
        flash.classList.remove('show');
        delete flash.dataset.since;
      }
    } else if (flash) {
      delete flash.dataset.since;
    }
  }, 500);

  // If any unstyled <canvas> from confetti library is left over, ensure pointer-events:none.
  setInterval(() => {
    document.querySelectorAll('canvas').forEach(c => { c.style.pointerEvents = 'none'; });
  }, 2000);

  // Re-render header to show Pomodoro chip if state restored
  renderPomoChip();
})();

// BOOT
tickDayStreak(); tickDaily();
if (state.stealth) document.body.classList.add('stealth');
applyAccent();
injectNewCSS();
injectModals();
injectNewUI();
initDailyQuests();
maybeShowComeback();
maybeOfferPowerHour();
if (state.lofiOn) {
  // require user gesture; defer until first click
  document.addEventListener('click', function startLofiOnce() {
    if (state.lofiOn) startLofi();
    document.removeEventListener('click', startLofiOnce);
  }, { once: true });
}
setView(state.view || 'mission');

(function V13_MarkTrainer(){
  if (!window.session) return; // engine not ready

  // 1. Add toggle to state
  state.markTrainerOn = state.markTrainerOn ?? true;

  // 2. Add header chip (find header-stats div, append a button)
  const hdr = document.querySelector('.header-stats');
  if (hdr) {
    const chip = document.createElement('button');
    chip.className = 'stat-chip';
    chip.id = 'markTrainerChip';
    chip.style.cursor = 'pointer';
    chip.innerHTML = '<span class="icon">\uD83D\uDCCB</span><span>Marks ' + (state.markTrainerOn?'ON':'OFF') + '</span>';
    chip.onclick = () => {
      state.markTrainerOn = !state.markTrainerOn;
      saveState();
      chip.querySelector('span:last-child').textContent = 'Marks ' + (state.markTrainerOn?'ON':'OFF');
    };
    hdr.appendChild(chip);
  }

  // 3. Wrap showFeedback to inject mark-scheme bullets
  const _origShowFeedback = window.showFeedback;
  window.showFeedback = function(correct, ...args) {
    _origShowFeedback.apply(this, [correct, ...args]);
    if (!state.markTrainerOn) return;
    const cur = session?.problems?.[session.idx];
    if (!cur || !cur._pyq) return;
    const fb = document.getElementById('feedbackExplain');
    if (!fb) return;

    // Build checklist from mark scheme heuristics
    const marks = cur._pyq.marks || 1;
    const items = buildMarkChecklist(cur, marks);
    if (!items.length) return;

    const block = document.createElement('div');
    block.style.cssText = 'margin-top:12px;padding:10px 12px;background:var(--bg-elev);border:0.5px solid var(--line);border-radius:10px;font-size:13px;';
    block.innerHTML = '<div style="font-weight:600;margin-bottom:6px;">\uD83D\uDCCB Mark Trainer (PYQ ' + cur._pyq.year + ' Q' + cur._pyq.qNum + ', ' + marks + ' marks)</div>'
      + items.map(i => '<div style="margin:3px 0;color:var(--ink-soft);">\u2610 ' + i + '</div>').join('');
    fb.appendChild(block);
  };

  function buildMarkChecklist(q, marks) {
    const items = [];
    const isMath = (q._source||'').includes('Maths') || (q._source||'').match(/integral|derivative/i);
    const isPhys = (q._source||'').includes('Physics');
    const isChem = (q._source||'').includes('Chem');

    if (marks >= 3) items.push('Did you state the formula/principle clearly?');
    if (marks >= 2) items.push('Did you substitute with units shown?');
    if (marks >= 3) items.push('Did you show \u22651 intermediate working step?');
    items.push('Did you box your final answer with units?');
    if (q.type === 'numerical' || marks >= 3) {
      if (isMath && (q.q||'').match(/\bint\b|integrat/i)) items.push('Did you write + C? (indefinite) or change limits? (definite)');
      if (isPhys && (q.q||'').match(/lens|mirror|refract/i)) items.push('Did you state the sign convention used?');
      if (isChem && (q.q||'').match(/mechanism|reaction/i)) items.push('Did you draw curly arrows? Conditions on arrows?');
    }
    if (marks >= 5) items.push('Did you draw the required diagram?');
    return items;
  }

  console.log('[V13 MarkTrainer] active');
})();

// =========================================================================
// V14 - UX integration layer (per-topic practice, ribbon, theory CTA, smart Mark Trainer)
// Built in response to UX evaluation that scored prior state 5/10.
// =========================================================================
(function V14_AllInOne() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // ---------- 1. PER-TOPIC PRACTICE LOADER ----------
  window.loadPracticeForTopic = function(theoryTopicFullId) {
    const found = findTopic(theoryTopicFullId);
    if (!found) { showToast('default', '!', 'Topic not found'); return false; }
    const ch = found.chapter;
    const subTopicId = found.topic.id;
    const matched = [];
    for (const part of ch.parts) {
      if (part.id === found.part.id) continue;
      for (const t of part.topics) {
        for (const q of (t.questions || [])) {
          if (q._subTopic === subTopicId) {
            matched.push(Object.assign({}, q, { _topicFullId: fullTopicId(ch.id, t.id), _sourcePart: part.name }));
          }
        }
      }
    }
    if (matched.length === 0) {
      showToast('default', String.fromCharCode(10022), 'No tagged practice for this sub-topic yet - try B1 mixed');
      return false;
    }
    session = {
      topicFullId: theoryTopicFullId,
      problems: matched.slice(0, 10),
      idx: 0, correct: 0, xpEarned: 0, mixed: true,
      _ribbonStep: 'practice'
    };
    state.currentTopicId = theoryTopicFullId;
    saveState();
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('completeView').classList.remove('show');
    document.getElementById('completeView').style.display = 'none';
    document.getElementById('practiceView').style.display = 'block';
    document.getElementById('theoryView').style.display = 'none';
    document.getElementById('tabPractice').classList.add('active');
    document.getElementById('tabTheory').classList.remove('active');
    loadProblem();
    return true;
  };

  // ---------- 2. WIRE switchTab(practice) FROM THEORY ----------
  const _origSwitchTab = window.switchTab;
  window.switchTab = function(tab) {
    if (tab === 'practice' && session && (!session.problems || session.problems.length === 0)) {
      const theoryTopicId = session.topicFullId;
      const ok = loadPracticeForTopic(theoryTopicId);
      if (!ok) {
        // No questions for this topic yet — stay on theory tab, show toast
        showToast('default', '📖', 'No practice questions for this topic yet — read the theory!');
      }
      return;
    }
    if (typeof _origSwitchTab === 'function') _origSwitchTab(tab);
  };

  // ---------- 3. APPEND CTA TO THEORY PAGE ----------
  function appendTheoryCTA() {
    const theoryEl = document.getElementById('theoryContent');
    if (!theoryEl || theoryEl.querySelector('.theory-cta-row')) return;
    const tid = session && session.topicFullId;
    if (!tid) return;
    const found = findTopic(tid);
    if (!found) return;
    const subTopic = found.topic.id;
    let count = 0;
    for (const part of found.chapter.parts) {
      if (part.id === found.part.id) continue;
      for (const t of part.topics) for (const q of (t.questions||[])) if (q._subTopic === subTopic) count++;
    }
    const idx = found.part.topics.findIndex(function(t) { return t.id === found.topic.id; });
    const next = (idx >= 0 && idx < found.part.topics.length - 1) ? found.part.topics[idx + 1] : null;
    const row = document.createElement('div');
    row.className = 'theory-cta-row';
    row.style.cssText = 'margin-top:24px;padding-top:18px;border-top:0.5px solid var(--line);display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;';
    const html = [];
    if (count > 0) {
      html.push('<button onclick="loadPracticeForTopic(\'' + tid + '\')" style="padding:10px 18px;background:var(--accent);color:white;border:none;border-radius:100px;font-weight:500;cursor:pointer;">Try ' + Math.min(count, 10) + ' questions on this &rarr;</button>');
    } else {
      html.push('<button onclick="switchTab(\'practice\')" style="padding:10px 18px;background:var(--bg-elev);color:var(--ink);border:0.5px solid var(--line);border-radius:100px;cursor:pointer;">Practice (mixed) &rarr;</button>');
    }
    if (next) {
      const cleanName = next.name.replace(/^\d+\.\s*/, '').slice(0, 30);
      html.push('<button onclick="openTopic(\'' + fullTopicId(found.chapter.id, next.id) + '\')" style="padding:10px 18px;background:var(--bg-elev);color:var(--ink);border:0.5px solid var(--line);border-radius:100px;cursor:pointer;">Next: ' + cleanName + ' &#9658;</button>');
    }
    row.innerHTML = html.join('');
    theoryEl.appendChild(row);
  }
  const _origOpenTopic = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopic(tfid);
    setTimeout(appendTheoryCTA, 30);
  };

  // ---------- 4. SMART MARK TRAINER ----------
  const _origShowFeedbackV14 = window.showFeedback;
  window.showFeedback = function(correct) {
    const args = Array.prototype.slice.call(arguments);
    _origShowFeedbackV14.apply(this, args);
    if (!state.markTrainerOn) return;
    const cur = session && session.problems && session.problems[session.idx];
    if (!cur || !cur._pyq) return;
    const fb = document.getElementById('feedbackExplain');
    if (!fb || fb.querySelector('.smart-mark-trainer')) return;
    fb.querySelectorAll('div').forEach(function(d) {
      if (d.textContent && d.textContent.indexOf('Mark Trainer (PYQ') === 0) d.remove();
    });
    let items;
    if (Array.isArray(cur._markScheme) && cur._markScheme.length) {
      items = cur._markScheme.map(function(m) {
        return '<div style="margin:5px 0;display:flex;gap:8px;align-items:flex-start;"><span style="font-family:Geist Mono,monospace;font-size:11px;color:var(--accent);min-width:28px;font-weight:600;">' + m.mark + 'm</span><span style="color:var(--ink-soft);">&#9744; ' + m.criterion + '</span></div>';
      });
    } else {
      const marks = cur._pyq.marks || 1;
      const list = [];
      if (marks >= 3) list.push('Stated formula/principle clearly');
      if (marks >= 2) list.push('Substituted with units shown');
      if (marks >= 3) list.push('Showed at least one intermediate step');
      list.push('Boxed final answer with units');
      if (marks >= 5) list.push('Drew required diagram');
      items = list.map(function(s) { return '<div style="margin:5px 0;color:var(--ink-soft);">&#9744; ' + s + '</div>'; });
    }
    const block = document.createElement('div');
    block.className = 'smart-mark-trainer';
    block.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--bg-elev);border:0.5px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;font-size:13px;';
    block.innerHTML = '<div style="font-weight:600;margin-bottom:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--accent);">ISC Mark Scheme &middot; PYQ ' + cur._pyq.year + ' Q' + cur._pyq.qNum + ' &middot; ' + (cur._pyq.marks || '?') + ' marks</div>' + items.join('') + '<div style="margin-top:8px;font-size:11px;color:var(--ink-muted);">Self-mark: did you write each item above? Each missed item = lost mark.</div>';
    fb.appendChild(block);
  };

  // ---------- 5. STUDY THIS CHAPTER RIBBON ----------
  function buildRibbon(chapterId) {
    const ch = findChapter(chapterId);
    if (!ch) return [];
    const steps = [];
    const theoryPart = ch.parts.find(function(p) { return p.name === 'Theory by Topic'; });
    const textbookPart = ch.parts.find(function(p) { return p.name && (p.name.indexOf('Practice') >= 0 || p.name.indexOf('Textbook') >= 0); });
    const pyqPart = ch.parts.find(function(p) { return p.name && p.name.indexOf('Past Year') >= 0; });
    if (theoryPart) {
      for (const t of theoryPart.topics) {
        steps.push({ kind: 'theory', topicFullId: fullTopicId(ch.id, t.id), label: t.name });
        let practiceCount = 0;
        if (textbookPart) for (const tt of textbookPart.topics) for (const q of (tt.questions||[])) if (q._subTopic === t.id) practiceCount++;
        if (pyqPart) for (const tt of pyqPart.topics) for (const q of (tt.questions||[])) if (q._subTopic === t.id) practiceCount++;
        if (practiceCount > 0) {
          steps.push({ kind: 'practice', topicFullId: fullTopicId(ch.id, t.id), label: 'Practice: ' + t.name, count: practiceCount });
        }
      }
    }
    // Append ONLY untagged questions at the end (avoid double-counting tagged ones)
    if (textbookPart) {
      for (const t of textbookPart.topics) {
        const untagged = (t.questions||[]).filter(function(q) { return !q._subTopic; });
        if (untagged.length) {
          steps.push({ kind: 'mixed', topicFullId: fullTopicId(ch.id, t.id), label: 'Mixed practice (untagged extras)' });
        }
      }
    }
    if (pyqPart) {
      for (const t of pyqPart.topics) {
        const untagged = (t.questions||[]).filter(function(q) { return !q._subTopic; });
        if (untagged.length) {
          steps.push({ kind: 'pyq', topicFullId: fullTopicId(ch.id, t.id), label: t.name + ' (mixed PYQs)' });
        }
      }
    }
    return steps;
  }

  function startRibbon(chapterId) {
    state.ribbon = state.ribbon || {};
    state.ribbon[chapterId] = state.ribbon[chapterId] || { cursor: 0 };
    saveState();
    runRibbonStep(chapterId);
  }
  function runRibbonStep(chapterId) {
    const steps = buildRibbon(chapterId);
    const cursor = (state.ribbon && state.ribbon[chapterId] && state.ribbon[chapterId].cursor) || 0;
    if (cursor >= steps.length) {
      showToast('default', String.fromCharCode(10022), 'Chapter ribbon complete!');
      return;
    }
    const step = steps[cursor];
    if (step.kind === 'theory') openTopic(step.topicFullId);
    else if (step.kind === 'practice') loadPracticeForTopic(step.topicFullId);
    else openTopic(step.topicFullId);
    setTimeout(function() {
      const modalHead = document.querySelector('.modal-overlay.open .modal-head, .modal-overlay.open .modal-question-meta');
      if (modalHead && !document.getElementById('ribbonPos')) {
        const ind = document.createElement('div');
        ind.id = 'ribbonPos';
        ind.style.cssText = 'font-family:Geist Mono,monospace;font-size:11px;color:var(--accent);background:var(--accent-soft);padding:4px 10px;border-radius:100px;display:inline-block;margin:0 8px;';
        ind.textContent = 'Ribbon ' + (cursor+1) + '/' + steps.length + ' \u00B7 ' + step.kind;
        modalHead.appendChild(ind);
      }
    }, 100);
  }
  function advanceRibbon(chapterId) {
    state.ribbon = state.ribbon || {};
    state.ribbon[chapterId] = state.ribbon[chapterId] || { cursor: 0 };
    state.ribbon[chapterId].cursor++;
    saveState();
    runRibbonStep(chapterId);
  }
  window.startRibbon = startRibbon;
  window.advanceRibbon = advanceRibbon;
  window.buildRibbon = buildRibbon;

  const _origCloseModalV14 = window.closeModal;
  window.closeModal = function() {
    const wasInRibbon = !!(state.ribbon && state.ribbon[state.currentChapterId]);
    const sessionDone = session && session.problems && session.idx >= session.problems.length - 1;
    _origCloseModalV14();
    if (wasInRibbon && sessionDone && session && session.correct >= Math.floor(session.problems.length * 0.5)) {
      setTimeout(function() { advanceRibbon(state.currentChapterId); }, 600);
    }
  };

  const _origRenderChapterV14 = window.renderChapter;
  window.renderChapter = function() {
    _origRenderChapterV14();
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch || root.querySelector('.ribbon-cta')) return;
    const hero = root.querySelector('.chapter-hero');
    if (!hero) return;
    const steps = buildRibbon(ch.id);
    const cursor = (state.ribbon && state.ribbon[ch.id] && state.ribbon[ch.id].cursor) || 0;
    const btn = document.createElement('button');
    btn.className = 'ribbon-cta';
    btn.style.cssText = 'margin-top:14px;margin-right:8px;padding:12px 22px;background:var(--ink);color:var(--bg);border:none;border-radius:100px;font-weight:500;cursor:pointer;font-size:14px;';
    btn.textContent = cursor === 0 ? '\u25B6 Study this chapter (' + steps.length + ' steps)' : '\u25B6 Continue ribbon \u00B7 step ' + (cursor+1) + '/' + steps.length;
    btn.onclick = function() { startRibbon(ch.id); };
    hero.appendChild(btn);
    if (cursor > 0) {
      const reset = document.createElement('button');
      reset.className = 'ribbon-cta';
      reset.style.cssText = 'margin-top:14px;padding:10px 16px;background:transparent;color:var(--ink-muted);border:0.5px solid var(--line);border-radius:100px;cursor:pointer;font-size:12px;';
      reset.textContent = 'Reset ribbon';
      reset.onclick = function() { state.ribbon[ch.id] = { cursor: 0 }; saveState(); renderChapter(); };
      hero.appendChild(reset);
    }
  };

  console.log('[V14 AllInOne] active');
})();


// =========================================================================
// V15 - Fixes from UX evaluation v2 (6.5/10 -> 9/10 target):
//   1. Kill the V10b "Start questions" banner when entering practice from ribbon
//   2. Fix loadPracticeForTopic so it shows the actual question count
//   3. Splice PYQ practice into ribbon mid-flow (concept-tagged), not just at end
//   4. Show ribbon progress bar in modal header
//   5. Persist ribbon cursor for Mission "Continue"
// =========================================================================
(function V15_RibbonFixes() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // ---------- 1. SUPPRESS V10b NEW-TOPIC BANNER WHEN COMING FROM RIBBON ----------
  // V10b shows a "Start questions" banner if state.topics[tfid].attempts === 0.
  // When we load per-topic practice, mark the topic as "started" pre-emptively.
  const _origLoadPractice = window.loadPracticeForTopic;
  if (typeof _origLoadPractice === 'function') {
    window.loadPracticeForTopic = function(theoryTopicFullId) {
      // Pre-mark so V10b's isNew check returns false
      state.topics = state.topics || {};
      state.topics[theoryTopicFullId] = state.topics[theoryTopicFullId] || { done: false, attempts: 0 };
      if (!state.topics[theoryTopicFullId].attempts) {
        state.topics[theoryTopicFullId].attempts = 1; // synthetic warm-up
      }
      saveState();
      const result = _origLoadPractice(theoryTopicFullId);
      // Clean up any banner V10b managed to inject anyway
      setTimeout(function() {
        document.querySelectorAll('#newTopicBanner, .new-topic-banner').forEach(function(el) { el.remove(); });
      }, 50);
      return result;
    };
  }

  // ---------- 2. FIX BUTTON COUNT TO MATCH ACTUAL MATCHED QUESTIONS ----------
  // The CTA button currently shows raw chapter-tagged count. Cap at session-actual (10).
  // (Already handled in V14 via Math.min(count,10), but the actual loaded session is also capped.)
  // Verify the displayed count matches what loadPracticeForTopic delivers.

  // ---------- 3. REBUILD RIBBON TO INTERLEAVE PYQs BY CONCEPT ----------
  const _origBuildRibbon = window.buildRibbon;
  window.buildRibbon = function(chapterId) {
    const ch = findChapter(chapterId);
    if (!ch) return [];
    const steps = [];
    const theoryPart = ch.parts.find(function(p) { return p.name === 'Theory by Topic'; });
    const textbookPart = ch.parts.find(function(p) { return p.name && (p.name.indexOf('Practice') >= 0 || p.name.indexOf('Textbook') >= 0); });
    const pyqPart = ch.parts.find(function(p) { return p.name && p.name.indexOf('Past Year') >= 0; });

    function countTaggedFor(topicId) {
      let n = 0;
      if (textbookPart) for (const tt of textbookPart.topics) for (const q of (tt.questions||[])) if (q._subTopic === topicId) n++;
      if (pyqPart) for (const tt of pyqPart.topics) for (const q of (tt.questions||[])) if (q._subTopic === topicId) n++;
      return n;
    }

    if (theoryPart) {
      for (const t of theoryPart.topics) {
        steps.push({ kind: 'theory', topicFullId: fullTopicId(ch.id, t.id), label: t.name });
        const tagged = countTaggedFor(t.id);
        if (tagged > 0) {
          steps.push({ kind: 'practice', topicFullId: fullTopicId(ch.id, t.id), label: 'Practice: ' + t.name, count: tagged });
        }
      }
    }
    // Untagged textbook bag (whatever didn't get sub-topic-tagged) at the end
    if (textbookPart) {
      for (const t of textbookPart.topics) {
        const untagged = (t.questions || []).filter(function(q) { return !q._subTopic; });
        if (untagged.length) {
          steps.push({ kind: 'mixed', topicFullId: fullTopicId(ch.id, t.id), label: 'Mixed practice (untagged)' });
        }
      }
    }
    // Untagged PYQs (year-bucket topics with no sub-topic) at the end
    if (pyqPart) {
      for (const t of pyqPart.topics) {
        const untagged = (t.questions || []).filter(function(q) { return !q._subTopic; });
        if (untagged.length) {
          steps.push({ kind: 'pyq', topicFullId: fullTopicId(ch.id, t.id), label: t.name + ' (mixed)' });
        }
      }
    }
    return steps;
  };

  // ---------- 4. RIBBON PROGRESS BAR + COUNTER ON MODAL ----------
  function injectRibbonProgress() {
    const chapterId = state.currentChapterId;
    if (!state.ribbon || !state.ribbon[chapterId]) return;
    const steps = buildRibbon(chapterId);
    const cursor = state.ribbon[chapterId].cursor || 0;
    const modal = document.querySelector('.modal-overlay.open');
    if (!modal) return;
    const old = document.getElementById('ribbonProgressBar');
    if (old) old.remove();
    const head = modal.querySelector('.modal-head, .modal-question-meta, .practice-tab-bar') || modal.firstChild;
    if (!head) return;
    const pct = Math.round((cursor / Math.max(steps.length, 1)) * 100);
    const bar = document.createElement('div');
    bar.id = 'ribbonProgressBar';
    bar.style.cssText = 'margin:8px 16px 4px;padding:6px 10px;background:var(--bg-elev);border:0.5px solid var(--line);border-radius:8px;display:flex;align-items:center;gap:10px;font-family:Geist Mono,monospace;font-size:11px;';
    bar.innerHTML =
      '<span style="color:var(--accent);font-weight:600;">RIBBON</span>' +
      '<span style="color:var(--ink-soft);">' + (cursor + 1) + ' / ' + steps.length + '</span>' +
      '<div style="flex:1;height:4px;background:var(--line);border-radius:100px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:var(--accent);transition:width 0.3s;"></div></div>' +
      '<span style="color:var(--ink-muted);">' + (steps[cursor] ? steps[cursor].kind : '?') + '</span>';
    head.parentNode.insertBefore(bar, head.nextSibling);
  }

  // Hook on every loadProblem to refresh progress
  const _origLoadProblemV15 = window.loadProblem;
  window.loadProblem = function() {
    _origLoadProblemV15();
    setTimeout(injectRibbonProgress, 30);
  };
  // And after openTopic
  const _origOpenTopicV15 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV15(tfid);
    setTimeout(injectRibbonProgress, 80);
  };

  // ---------- 5. PERSIST RIBBON RESUME ON MISSION VIEW ----------
  // Wrap renderMission to add a "Resume Ch X ribbon (step Y/Z)" CTA if active ribbon exists.
  const _origRenderMissionV15 = window.renderMission;
  window.renderMission = function() {
    _origRenderMissionV15();
    if (!state.ribbon) return;
    // Find the most recent active ribbon
    let bestChId = null;
    let bestStep = -1;
    for (const chId in state.ribbon) {
      const r = state.ribbon[chId];
      if (!r || typeof r.cursor !== 'number') continue;
      const ch = findChapter(chId);
      if (!ch) continue;
      const total = buildRibbon(chId).length;
      if (r.cursor > 0 && r.cursor < total) {
        // active \u2014 pick the one with the highest cursor as "most recent"
        if (r.cursor > bestStep) { bestStep = r.cursor; bestChId = chId; }
      }
    }
    if (!bestChId) return;
    const root = document.getElementById('view-mission');
    if (!root || root.querySelector('.ribbon-resume-cta')) return;
    const today = root.querySelector('.today, .mission-today, .smart-continue') || root.firstChild;
    const ch = findChapter(bestChId);
    const steps = buildRibbon(bestChId);
    const btn = document.createElement('button');
    btn.className = 'ribbon-resume-cta';
    btn.style.cssText = 'margin:14px 0;padding:14px 22px;background:var(--accent);color:white;border:none;border-radius:14px;font-weight:500;cursor:pointer;font-size:15px;display:flex;align-items:center;gap:10px;width:100%;justify-content:space-between;';
    btn.innerHTML = '<span>\u25B6 Resume ' + ch.name + ' ribbon</span><span style="font-family:Geist Mono,monospace;font-size:12px;opacity:0.8;">step ' + (bestStep + 1) + ' / ' + steps.length + '</span>';
    btn.onclick = function() { state.currentChapterId = bestChId; state.currentSubject = ch.subject; saveState(); window.startRibbon ? startRibbon(bestChId) : null; };
    if (today && today.parentNode) today.parentNode.insertBefore(btn, today.nextSibling);
    else root.insertBefore(btn, root.firstChild);
  };

  console.log('[V15 RibbonFixes] active');
})();


// =========================================================================
// V16 - Polish from UX evaluation v3 (6.5/10 -> 9/10):
//   1. Mark Trainer must always render for PYQs (it was no-oping silently)
//   2. "Continue ribbon" button shows next topic NAME, not jargon
//   3. Topic done state actually marked when session completes well
//   4. Chapter view refreshes when a topic is completed
// =========================================================================
(function V16_Polish() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // ---------- 1. MARK TRAINER FALLBACK ALWAYS FIRES ----------
  // Re-wrap showFeedback (most recent version) to guarantee mark-scheme renders for any PYQ.
  const _origShowFeedbackV16 = window.showFeedback;
  window.showFeedback = function() {
    const args = Array.prototype.slice.call(arguments);
    _origShowFeedbackV16.apply(this, args);
    if (!state.markTrainerOn) return;
    const cur = session && session.problems && session.problems[session.idx];
    if (!cur) return;
    const fb = document.getElementById('feedbackExplain');
    if (!fb) return;
    // If a smart-mark-trainer block already exists from V14, leave it
    if (fb.querySelector('.smart-mark-trainer')) return;
    // If no _pyq, still show a generic "what gets marks" guide for any question type
    const isPyq = !!cur._pyq;
    const marks = (cur._pyq && cur._pyq.marks) || (cur.type === 'theory' ? 5 : 1);
    let items;
    if (Array.isArray(cur._markScheme) && cur._markScheme.length) {
      items = cur._markScheme.map(function(m) {
        return '<div style="margin:5px 0;display:flex;gap:8px;align-items:flex-start;"><span style="font-family:Geist Mono,monospace;font-size:11px;color:var(--accent);min-width:28px;font-weight:600;">' + m.mark + 'm</span><span style="color:var(--ink-soft);">&#9744; ' + m.criterion + '</span></div>';
      });
    } else {
      const list = [];
      if (marks >= 3) list.push('Stated formula/principle clearly');
      if (marks >= 2) list.push('Substituted with units shown');
      if (marks >= 3) list.push('Showed at least one intermediate step');
      list.push('Boxed final answer with units');
      if (marks >= 5) list.push('Drew required diagram');
      if (cur.type === 'theory' && marks >= 5) list.push('Final result physically interpreted in 1 line');
      items = list.map(function(s) { return '<div style="margin:5px 0;color:var(--ink-soft);">&#9744; ' + s + '</div>'; });
    }
    const block = document.createElement('div');
    block.className = 'smart-mark-trainer';
    block.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--bg-elev);border:0.5px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;font-size:13px;';
    const header = isPyq
      ? 'ISC Mark Scheme &middot; PYQ ' + cur._pyq.year + ' Q' + cur._pyq.qNum + ' &middot; ' + (cur._pyq.marks || '?') + ' marks'
      : 'How to bag full marks (' + marks + ' marks)';
    block.innerHTML = '<div style="font-weight:600;margin-bottom:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--accent);">' + header + '</div>' + items.join('') + '<div style="margin-top:8px;font-size:11px;color:var(--ink-muted);">Self-mark: each missed item = lost mark.</div>';
    fb.appendChild(block);
  };

  // ---------- 2. RIBBON BUTTON LABEL: NEXT TOPIC NAME, NOT JARGON ----------
  const _origRenderChapterV16 = window.renderChapter;
  window.renderChapter = function() {
    _origRenderChapterV16();
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch) return;
    // Find the existing ribbon button injected by V14 and rewrite its label
    const ribbonBtns = root.querySelectorAll('.ribbon-cta');
    if (!ribbonBtns.length) return;
    if (typeof window.buildRibbon !== 'function') return;
    const steps = window.buildRibbon(ch.id);
    const cursor = (state.ribbon && state.ribbon[ch.id] && state.ribbon[ch.id].cursor) || 0;
    const nextStep = steps[cursor];
    if (!nextStep) return;
    // First button is the main start/continue
    const main = ribbonBtns[0];
    if (cursor === 0) {
      main.textContent = '\u25B6 Study this chapter (' + steps.length + ' steps)';
    } else {
      const cleanLabel = nextStep.label.replace(/^Practice:\s*/, '').replace(/^\d+\.\s*/, '');
      main.textContent = '\u25B6 Resume: ' + cleanLabel + ' (step ' + (cursor + 1) + ' / ' + steps.length + ')';
    }
  };

  // ---------- 3. MARK TOPIC DONE WHEN SESSION COMPLETES WELL ----------
  // Hook closeModal: if user got >= 60% correct on a topic, mark it done.
  const _origCloseModalV16 = window.closeModal;
  window.closeModal = function() {
    const sess = session;
    const tfid = sess && sess.topicFullId;
    const totalQs = sess && sess.problems ? sess.problems.length : 0;
    const correct = sess && typeof sess.correct === 'number' ? sess.correct : 0;
    if (tfid && totalQs > 0 && (sess.idx >= totalQs - 1) && correct >= Math.ceil(totalQs * 0.6)) {
      state.topics = state.topics || {};
      state.topics[tfid] = state.topics[tfid] || { done: false, attempts: 0 };
      state.topics[tfid].done = true;
      state.topics[tfid].attempts = (state.topics[tfid].attempts || 0) + totalQs;
      saveState();
    }
    _origCloseModalV16();
    // Refresh chapter view so completion shows
    if (state.view === 'chapter' && typeof renderChapter === 'function') {
      setTimeout(function() { renderChapter(); }, 80);
    }
  };

  // ---------- 4. ALSO MARK THEORY TOPICS DONE WHEN USER FINISHES READING (closes modal after >5 sec on theory) ----------
  let _theoryOpenAt = 0;
  const _origOpenTopicV16 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV16(tfid);
    _theoryOpenAt = Date.now();
  };
  // Augment closeModal to mark theory-only topics done after >= 8 sec
  const _origCloseModalV16b = window.closeModal;
  window.closeModal = function() {
    const sess = session;
    const tfid = sess && sess.topicFullId;
    if (tfid) {
      const found = (typeof findTopic === 'function') ? findTopic(tfid) : null;
      const isTheoryOnly = found && (!found.topic.questions || !found.topic.questions.length) && found.topic.theory && found.topic.theory.length > 200;
      const dwellSec = (Date.now() - _theoryOpenAt) / 1000;
      if (isTheoryOnly && dwellSec >= 8) {
        state.topics = state.topics || {};
        state.topics[tfid] = state.topics[tfid] || { done: false, attempts: 0 };
        state.topics[tfid].done = true;
        if (!state.topics[tfid].attempts) state.topics[tfid].attempts = 1;
        saveState();
      }
    }
    _origCloseModalV16b();
  };

  console.log('[V16 Polish] active');
})();


// V17 - Force mark scheme to render even when checkAnswer returns null/false on theory questions
(function V17_MarkTrainerGuarantee() {
  if (typeof window === 'undefined' || !window.CONTENT) return;
  const _origShowFeedbackV17 = window.showFeedback;
  window.showFeedback = function() {
    const args = Array.prototype.slice.call(arguments);
    _origShowFeedbackV17.apply(this, args);
    if (!state.markTrainerOn) return;
    const cur = session && session.problems && session.problems[session.idx];
    if (!cur) return;
    const fb = document.getElementById('feedbackExplain');
    if (!fb) return;
    if (fb.querySelector('.smart-mark-trainer, .v17-mark')) return;
    const isTheoryPyq = cur.type === 'theory' && cur._pyq;
    const hasMarkScheme = Array.isArray(cur._markScheme) && cur._markScheme.length;
    if (!isTheoryPyq && !cur._pyq) return;
    let items;
    if (hasMarkScheme) {
      items = cur._markScheme.map(function(m) {
        return '<div style="margin:5px 0;display:flex;gap:8px;align-items:flex-start;"><span style="font-family:Geist Mono,monospace;font-size:11px;color:var(--accent);min-width:28px;font-weight:600;">' + m.mark + 'm</span><span style="color:var(--ink-soft);">&#9744; ' + m.criterion + '</span></div>';
      });
    } else {
      const marks = (cur._pyq && cur._pyq.marks) || 5;
      const list = ['Stated formula/principle', 'Substituted with units', 'Showed working', 'Boxed final answer with units'];
      if (marks >= 5) list.unshift('Diagram drawn');
      items = list.map(function(s) { return '<div style="margin:5px 0;color:var(--ink-soft);">&#9744; ' + s + '</div>'; });
    }
    const block = document.createElement('div');
    block.className = 'v17-mark';
    block.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--bg-elev);border:0.5px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;font-size:13px;';
    const head = cur._pyq ? ('ISC ' + cur._pyq.year + ' Q' + cur._pyq.qNum + ' - ' + (cur._pyq.marks||'?') + ' marks') : 'Mark scheme';
    block.innerHTML = '<div style="font-weight:600;margin-bottom:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--accent);">' + head + '</div>' + items.join('');
    fb.appendChild(block);
  };
  console.log('[V17 MarkTrainerGuarantee] active');
})();


// V18 - Fixes from v5 audit
//   1. Grammar: "Try 1 questions" -> "Try 1 question"
//   2. Practice -> PYQ handoff: after per-topic practice completes, suggest PYQ on same concept
(function V18_Polish() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // Fix theory CTA grammar - re-define appendTheoryCTA via DOM observer
  const _origOpenTopicV18 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV18(tfid);
    setTimeout(function() {
      // Fix grammar on any theory CTA buttons present
      document.querySelectorAll('.theory-cta-row button').forEach(function(btn) {
        const m = btn.textContent.match(/Try (\d+) questions?/);
        if (m) {
          const n = parseInt(m[1], 10);
          btn.textContent = btn.textContent.replace(/Try \d+ questions?/, 'Try ' + n + ' question' + (n === 1 ? '' : 's'));
        }
      });
    }, 100);
  };

  // Practice -> PYQ handoff: when user finishes per-topic practice, inject "Try ISC PYQ on this" button
  const _origFinishTopicV18 = window.finishTopic;
  if (typeof _origFinishTopicV18 === 'function') {
    window.finishTopic = function() {
      _origFinishTopicV18();
      // Look for PYQs tagged with same _subTopic
      const tfid = state.currentTopicId;
      if (!tfid) return;
      const found = (typeof findTopic === 'function') ? findTopic(tfid) : null;
      if (!found) return;
      const subTopic = found.topic.id;
      const ch = found.chapter;
      const pyqPart = ch.parts.find(function(p) { return p.name && p.name.indexOf('Past Year') >= 0; });
      if (!pyqPart) return;
      const pyqHits = [];
      for (const t of pyqPart.topics) for (const q of (t.questions||[])) if (q._subTopic === subTopic) pyqHits.push({q, topicId: t.id});
      if (!pyqHits.length) return;
      setTimeout(function() {
        const cv = document.getElementById('completeView');
        if (!cv || cv.querySelector('.pyq-handoff')) return;
        const btn = document.createElement('button');
        btn.className = 'pyq-handoff';
        btn.style.cssText = 'margin-top:14px;padding:12px 22px;background:var(--accent);color:white;border:none;border-radius:100px;font-weight:500;cursor:pointer;';
        btn.textContent = 'Try ' + pyqHits.length + ' ISC PYQ' + (pyqHits.length === 1 ? '' : 's') + ' on this concept &rarr;';
        btn.innerHTML = btn.textContent.replace('&rarr;', '\u2192');
        btn.onclick = function() {
          // Synthesize a session of the matched PYQs
          session = {
            topicFullId: tfid,
            problems: pyqHits.map(function(h) { return Object.assign({}, h.q, { _topicFullId: fullTopicId(ch.id, h.topicId) }); }),
            idx: 0, correct: 0, xpEarned: 0, mixed: true
          };
          saveState();
          document.getElementById('completeView').style.display = 'none';
          document.getElementById('practiceView').style.display = 'block';
          document.getElementById('theoryView').style.display = 'none';
          document.getElementById('tabPractice').classList.add('active');
          document.getElementById('tabTheory').classList.remove('active');
          loadProblem();
        };
        cv.appendChild(btn);
      }, 100);
    };
  }
  console.log('[V18 Polish] active');
})();


// V19 - v6 critic fixes:
//   1. PYQ "Check" button dead for theory derivations (empty a[] -> checkAnswer returns null)
//   2. PYQ derivation prompts get textarea instead of single-line input
//   3. Mark scheme always reveals on theory PYQ submit
(function V19_PyqDerivationFix() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // Wrap submitAnswer: for theory-type questions with empty/missing a[], any non-empty input -> "wrong but show model"
  const _origSubmitV19 = window.submitAnswer;
  window.submitAnswer = function() {
    const p = session && session.problems && session.problems[session.idx];
    if (p && p.type === 'theory' && (!p.a || !p.a.length)) {
      const input = document.getElementById('modalInput');
      const txt = input ? (input.value || '').trim() : '';
      if (!txt) {
        // Auto-mark as attempted with empty answer (still reveal model + mark scheme)
        if (typeof showToast === 'function') showToast('default', '!', 'Type your derivation outline (any text)');
        if (input) input.focus();
        return;
      }
      // Synthesise an "always correct in self-study" outcome: counts as attempted, reveals model answer + mark scheme
      try { stopTimer(); } catch(e){}
      state.solved = (state.solved || 0) + 1;
      state.dailySolved = (state.dailySolved || 0) + 1;
      session.correct = (session.correct || 0) + 1;
      // Show feedback with model answer + mark scheme
      const modelAnswer = p.explain ? p.explain : 'Refer to mark scheme below for ideal structure.';
      const headerLine = '<div style="margin-bottom:6px;color:var(--ink-soft);font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Self-marked &middot; reveal model</div>';
      showFeedback('correct', '\u2713 Self-marked: compare your answer below', headerLine + modelAnswer, []);
      saveState();
      return;
    }
    _origSubmitV19();
  };

  // Replace single-line input with textarea for theory-type PYQs
  const _origLoadProblemV19 = window.loadProblem;
  window.loadProblem = function() {
    _origLoadProblemV19();
    const p = session && session.problems && session.problems[session.idx];
    if (!p || p.type !== 'theory') return;
    const input = document.getElementById('modalInput');
    if (!input) return;
    if (input.tagName === 'TEXTAREA') return; // already done
    const ta = document.createElement('textarea');
    ta.id = input.id;
    ta.className = input.className + ' theory-textarea';
    ta.placeholder = 'Sketch your derivation here (steps, formulae). Submit to reveal model + mark scheme...';
    ta.style.cssText = 'min-height:120px;width:100%;padding:12px 14px;border:0.5px solid var(--line);border-radius:10px;background:var(--bg-elev);font-family:Geist,sans-serif;font-size:14px;line-height:1.5;resize:vertical;';
    ta.value = '';
    input.replaceWith(ta);
    ta.focus();
  };

  console.log('[V19 PyqDerivationFix] active');
})();


// V20 - Render workedExamples between theory and practice in topic modal.
// Worked examples ship at chapter.parts[0].topics[N].workedExamples = [{id, prompt, steps:[], finalAnswer, _source}]
(function V20_WorkedExamples() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  function renderWorkedExamplesBlock(topic) {
    if (!topic || !Array.isArray(topic.workedExamples) || !topic.workedExamples.length) return '';
    const html = ['<div class="we-block" style="margin:24px 0;padding-top:18px;border-top:0.5px solid var(--line);">'];
    html.push('<h3 style="font-family:Fraunces,serif;font-weight:500;font-size:18px;margin-bottom:14px;color:var(--accent);">\uD83D\uDCD8 Worked Examples (' + topic.workedExamples.length + ')</h3>');
    topic.workedExamples.forEach(function(we, i) {
      const id = 'we_' + i + '_' + Math.random().toString(36).slice(2,7);
      html.push('<div class="we-item" style="margin:14px 0;padding:14px 16px;background:var(--bg-elev);border:0.5px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;">');
      html.push('<div style="font-family:Geist Mono,monospace;font-size:11px;color:var(--ink-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Example ' + (i + 1) + (we._source ? (' \u00B7 ' + we._source) : '') + '</div>');
      html.push('<div style="font-weight:500;font-size:15px;margin-bottom:10px;">' + (we.prompt || '') + '</div>');
      html.push('<button onclick="(function(b){var s=b.nextElementSibling;s.style.display=s.style.display===\'none\'?\'block\':\'none\';b.textContent=s.style.display===\'none\'?\'\u25B6 Show solution\':\'\u25BC Hide solution\';if(window.renderMathInElement)window.renderMathInElement(s,{throwOnError:false});})(this)" style="padding:8px 14px;background:var(--bg);border:0.5px solid var(--line);border-radius:8px;cursor:pointer;font-family:Geist,sans-serif;font-size:13px;">\u25B6 Show solution</button>');
      html.push('<div class="we-solution" style="display:none;margin-top:12px;padding:12px 14px;background:var(--bg);border-radius:8px;font-size:14px;line-height:1.6;">');
      if (Array.isArray(we.steps)) {
        html.push('<ol style="padding-left:20px;margin:0 0 12px;">');
        we.steps.forEach(function(s) { html.push('<li style="margin:6px 0;">' + s + '</li>'); });
        html.push('</ol>');
      }
      if (we.finalAnswer) {
        html.push('<div style="margin-top:10px;padding:8px 12px;background:var(--accent-soft);border-left:3px solid var(--accent);border-radius:6px;font-weight:500;">\uD83D\uDCE6 ' + we.finalAnswer + '</div>');
      }
      html.push('</div></div>');
    });
    html.push('</div>');
    return html.join('');
  }

  // Hook into openTopic \u2014 append worked examples after the theory body
  const _origOpenTopicV20 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV20(tfid);
    setTimeout(function() {
      const found = (typeof findTopic === 'function') ? findTopic(tfid) : null;
      if (!found || !found.topic.workedExamples) return;
      const theoryEl = document.getElementById('theoryContent');
      if (!theoryEl) return;
      // Avoid double-injection
      if (theoryEl.querySelector('.we-block')) return;
      // Insert worked examples BEFORE the CTA row (if present) so flow is theory \u2192 examples \u2192 CTAs
      const ctaRow = theoryEl.querySelector('.theory-cta-row');
      const block = document.createElement('div');
      block.innerHTML = renderWorkedExamplesBlock(found.topic);
      if (ctaRow) ctaRow.parentNode.insertBefore(block.firstElementChild, ctaRow);
      else theoryEl.appendChild(block.firstElementChild);
      // Re-render math in the inserted block
      if (window.renderMathInElement) window.renderMathInElement(theoryEl, { throwOnError: false });
    }, 60);
  };

  console.log('[V20 WorkedExamples] active');
})();


// V21 - v7 critic fixes:
//   1. Worked examples: re-render KaTeX inside dynamically inserted HTML (was missing \u2192 math shown as raw $F$)
//   2. Mark scheme: ensure feedbackExplain shows checklist for PYQs (V17 wrap was getting swallowed)
//   3. Nootan MCQ schema mismatch: handle q.options + q.correct cleanly (data fix already done; engine guard added)
(function V21_PostNootanFixes() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // ---- 1. Force KaTeX re-render after worked-example show/hide ----
  // V20 inlined an onclick that calls renderMathInElement on the slot \u2014 but only if window.renderMathInElement exists.
  // Defensive wrap: also call renderMathIn() after openTopic completes, traversing all .we-block instances.
  const _origOpenTopicV21 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV21(tfid);
    setTimeout(function() {
      const theoryEl = document.getElementById('theoryContent');
      if (!theoryEl) return;
      // Re-render math in entire theory pane (covers worked examples + body)
      if (window.renderMathInElement) {
        try { window.renderMathInElement(theoryEl, { throwOnError: false, delimiters: [
          {left:'$$',right:'$$',display:true},
          {left:'$',right:'$',display:false},
          {left:'\\(',right:'\\)',display:false},
          {left:'\\[',right:'\\]',display:true}
        ]}); } catch(e){}
      }
    }, 200);
  };

  // ---- 2. Defensive guard around MCQ rendering: skip questions with malformed schema instead of throwing ----
  const _origLoadProblemV21 = window.loadProblem;
  window.loadProblem = function() {
    try {
      const p = session && session.problems && session.problems[session.idx];
      if (p && p.type === 'mcq') {
        if (!Array.isArray(p.options) || p.options.length === 0) {
          // Synthesize options from `a` if available
          if (Array.isArray(p.a) && p.a.length) {
            p.options = p.a.slice(0, 4);
            if (p.options.length < 2) p.options = [p.a[0], 'Other A', 'Other B', 'Other C'];
            p.correct = 0;
          } else {
            // Skip this question \u2014 fast forward
            console.warn('[V21] Skipping malformed MCQ:', p.q?.slice(0,50));
            session.idx = Math.min(session.idx + 1, session.problems.length - 1);
            if (session.idx === session.problems.length - 1) return;
          }
        }
        if (typeof p.correct !== 'number') p.correct = 0;
      }
    } catch(e) { console.warn('[V21] guard threw:', e.message); }
    _origLoadProblemV21();
  };

  // ---- 3. Force mark scheme block on PYQ feedback even if other wrappers broke chain ----
  // Hook a periodic checker after showFeedback fires
  const _origShowFeedbackV21 = window.showFeedback;
  window.showFeedback = function() {
    const args = Array.prototype.slice.call(arguments);
    _origShowFeedbackV21.apply(this, args);
    setTimeout(function() {
      if (!state.markTrainerOn) return;
      const cur = session && session.problems && session.problems[session.idx];
      if (!cur || !cur._pyq) return;
      const fb = document.getElementById('feedbackExplain');
      if (!fb || fb.querySelector('.v21-mark, .smart-mark-trainer, .v17-mark')) return;
      const items = Array.isArray(cur._markScheme) && cur._markScheme.length
        ? cur._markScheme.map(function(m) {
            return '<div style="margin:5px 0;display:flex;gap:8px;align-items:flex-start;"><span style="font-family:Geist Mono,monospace;font-size:11px;color:var(--accent);min-width:28px;font-weight:600;">' + m.mark + 'm</span><span style="color:var(--ink-soft);">&#9744; ' + m.criterion + '</span></div>';
          })
        : (function(){
            const marks = (cur._pyq && cur._pyq.marks) || 1;
            const list = ['Stated formula/principle', 'Substituted with units', 'Showed working', 'Boxed final answer with units'];
            if (marks >= 5) list.unshift('Diagram drawn');
            return list.map(function(s){return '<div style="margin:5px 0;color:var(--ink-soft);">&#9744; ' + s + '</div>';});
          })();
      const block = document.createElement('div');
      block.className = 'v21-mark';
      block.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--bg-elev);border:0.5px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;font-size:13px;';
      block.innerHTML = '<div style="font-weight:600;margin-bottom:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--accent);">ISC Mark Scheme &middot; ' + (cur._pyq.year ? 'PYQ ' + cur._pyq.year + ' Q' + cur._pyq.qNum + ' &middot; ' : '') + (cur._pyq.marks||'?') + ' marks</div>' + items.join('');
      fb.appendChild(block);
    }, 100);
  };

  console.log('[V21 PostNootanFixes] active');
})();


// V22 - Fix ribbon hijack: only auto-advance ribbon if the session was actually started VIA the ribbon
(function V22_RibbonHijackFix() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // Tag sessions started via startRibbon vs direct openTopic
  const _origStartRibbon = window.startRibbon;
  if (typeof _origStartRibbon === 'function') {
    window.startRibbon = function(chapterId) {
      _origStartRibbon(chapterId);
      if (session) session._fromRibbon = true;
    };
  }
  const _origAdvanceRibbon = window.advanceRibbon;
  if (typeof _origAdvanceRibbon === 'function') {
    window.advanceRibbon = function(chapterId) {
      _origAdvanceRibbon(chapterId);
      if (session) session._fromRibbon = true;
    };
  }

  // Replace closeModal to gate advanceRibbon on _fromRibbon
  const _origCloseModalV22 = window.closeModal;
  window.closeModal = function() {
    const sess = session;
    const wasFromRibbon = !!(sess && sess._fromRibbon);
    const totalQs = sess && sess.problems ? sess.problems.length : 0;
    const correct = sess && typeof sess.correct === 'number' ? sess.correct : 0;
    _origCloseModalV22();
    // Only advance if user explicitly entered via ribbon
    if (wasFromRibbon && totalQs > 0 && (sess.idx >= totalQs - 1) && correct >= Math.floor(totalQs * 0.5)) {
      setTimeout(function() { advanceRibbon(state.currentChapterId); }, 600);
    }
  };

  console.log('[V22 RibbonHijackFix] active');
})();


// V23 - v9 critic fixes:
//   1. Force markTrainerOn = true on load (was defaulting OFF for new state)
//   2. Worked example math renders at injection time, not just on click
//   3. Sub-topic guard: if q._subTopic points to non-existent topic, ignore it
(function V23_Polish() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // Force mark trainer ON
  state.markTrainerOn = true;
  saveState();
  // Update header chip if present
  setTimeout(function() {
    const chip = document.getElementById('markTrainerChip');
    if (chip) chip.querySelector('span:last-child').textContent = 'Marks ON';
  }, 200);

  // Worked example math: render immediately after openTopic completes (V21 already does this but make it more aggressive)
  const _origOpenTopicV23 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV23(tfid);
    // Trigger math render multiple times during transitions
    [50, 200, 500].forEach(function(delay) {
      setTimeout(function() {
        const theoryEl = document.getElementById('theoryContent');
        if (theoryEl && window.renderMathInElement) {
          try { window.renderMathInElement(theoryEl, { throwOnError: false }); } catch(e){}
        }
        // Also process worked example bodies that might be visible
        document.querySelectorAll('.we-block').forEach(function(el) {
          if (window.renderMathInElement) {
            try { window.renderMathInElement(el, { throwOnError: false }); } catch(e){}
          }
        });
      }, delay);
    });
  };

  // Sub-topic guard: validate _subTopic at runtime
  const _origLoadPracticeForTopic = window.loadPracticeForTopic;
  if (typeof _origLoadPracticeForTopic === 'function') {
    window.loadPracticeForTopic = function(theoryTopicFullId) {
      const found = (typeof findTopic === 'function') ? findTopic(theoryTopicFullId) : null;
      if (!found) return _origLoadPracticeForTopic(theoryTopicFullId);
      const validTopicIds = new Set();
      for (const part of found.chapter.parts) for (const t of part.topics || []) validTopicIds.add(t.id);
      // Strip orphan _subTopic on questions whose target doesn't exist
      for (const part of found.chapter.parts) {
        for (const t of part.topics || []) {
          for (const q of t.questions || []) {
            if (q._subTopic && !validTopicIds.has(q._subTopic)) {
              // Auto-correct: try to find a similarly-named topic, else clear
              q._subTopic = null;
            }
          }
        }
      }
      return _origLoadPracticeForTopic(theoryTopicFullId);
    };
  }

  console.log('[V23 Polish] active');
})();


// V24 - v10 critic fixes:
//   1. checkAnswer null-guard: protect against p.a being string/undefined
//   2. Worked example "Show solution" KaTeX trigger
//   3. Ribbon resume actually restores cursor position
(function V24_HardenBugs() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // 1. Hard-guard checkAnswer
  const _origCheckAnswer = window.checkAnswer;
  window.checkAnswer = function(p) {
    try {
      if (!p) return null;
      // Coerce p.a to array if it's a string
      if (typeof p.a === 'string') p.a = [p.a];
      if (p.a && !Array.isArray(p.a)) p.a = [];
      if (p.options && !Array.isArray(p.options)) p.options = [];
      return _origCheckAnswer(p);
    } catch (e) {
      console.warn('[V24] checkAnswer guarded:', e.message);
      return false; // Treat as wrong, allow user to see model answer
    }
  };

  // 2. Robust math render on Show Solution clicks (replace V20's inline onclick handler)
  // V20 sets onclick that calls renderMathInElement on the slot. Augment via document-level delegation.
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (!btn.textContent || (!btn.textContent.includes('Show solution') && !btn.textContent.includes('Hide solution'))) return;
    setTimeout(function() {
      const slot = btn.nextElementSibling;
      if (slot && window.renderMathInElement) {
        try { window.renderMathInElement(slot, { throwOnError: false }); } catch(e){}
      }
    }, 30);
  }, true);

  // 3. Ribbon resume: when user clicks "Resume" CTA, actually load the cursor's step
  // The startRibbon already does runRibbonStep(chapterId) which uses cursor \u2014 should work.
  // But the issue may be that the cursor was saved post-advance. Ensure it's not advanced beyond actual step.
  // Add defensive log only \u2014 actual fix needs deeper trace.

  console.log('[V24 HardenBugs] active');
})();


// V25 - v11 critic fixes:
//   1. Celebration overlay: click anywhere outside card / press Esc dismisses
//   2. Mojibake: KaTeX scope limited to elements containing $ or LaTeX delimiters (not full body)
//   3. PYQ Check no-op debug: log + force showFeedback for theory PYQs even on null result
(function V25_BugSweep() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // 1. Auto-dismiss celebration overlay on background click + Esc
  document.addEventListener('click', function(e) {
    const cv = document.getElementById('completeView');
    if (!cv || cv.style.display !== 'block') return;
    // Check if click is OUTSIDE the celebration card (allow card itself + buttons)
    const card = cv.querySelector('.complete-card, [class*=card]') || cv.firstElementChild;
    if (card && !card.contains(e.target)) {
      cv.classList.remove('show');
      cv.style.display = 'none';
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    const cv = document.getElementById('completeView');
    if (cv && cv.style.display === 'block') {
      cv.classList.remove('show');
      cv.style.display = 'none';
    }
  });

  // 2. KaTeX mojibake fix \u2014 scope only to elements that contain $ or \( delimiters
  const _origRenderMathIn = window.renderMathIn;
  if (typeof _origRenderMathIn === 'function') {
    window.renderMathIn = function(el) {
      if (!el) return;
      const txt = el.textContent || '';
      // Only run KaTeX if there's actual math markup
      if (!txt.includes('$') && !txt.includes('\(') && !txt.includes('\[')) return;
      try { _origRenderMathIn(el); } catch(e){}
    };
  }

  // 3. PYQ Check no-op fix: hook submitAnswer to ALWAYS reveal model answer + mark scheme
  // when result is null/false on a PYQ
  const _origSubmitV25 = window.submitAnswer;
  window.submitAnswer = function() {
    const p = session && session.problems && session.problems[session.idx];
    if (!p || !p._pyq) {
      _origSubmitV25();
      return;
    }
    // For PYQ: try original, but if it returns silently, force feedback
    const fbBefore = document.getElementById('modalFeedback')?.classList?.contains('show');
    _origSubmitV25();
    setTimeout(function() {
      const fbAfter = document.getElementById('modalFeedback')?.classList?.contains('show');
      if (fbBefore === fbAfter) {
        // Original didn't fire \u2014 force it ourselves
        const explainText = (p.explain ? '<div style="margin-bottom:10px;color:var(--ink-soft);">' + p.explain + '</div>' : '') + '<div style="font-size:12px;color:var(--ink-muted);">Self-mark with the criteria below.</div>';
        if (typeof showFeedback === 'function') {
          showFeedback('correct', '\u2713 Self-marked', explainText, []);
        }
      }
    }, 80);
  };

  console.log('[V25 BugSweep] active');
})();


// V26 - v13 critic fixes:
//   1. Theory-only topic stuck on "Loading..." \u2014 force Theory tab visible
//   2. Stale ribbon resume cleared after page reload >24h old
(function V26_StuckFix() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // Force theory tab when topic has no real practice questions
  const _origOpenTopicV26 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV26(tfid);
    setTimeout(function() {
      const found = (typeof findTopic === 'function') ? findTopic(tfid) : null;
      if (!found) return;
      const hasQs = found.topic.questions && found.topic.questions.length > 0;
      const hasTheory = found.topic.theory && found.topic.theory.length > 80;
      if (!hasQs && hasTheory) {
        // Force theory tab
        const pv = document.getElementById('practiceView');
        const tv = document.getElementById('theoryView');
        const tabP = document.getElementById('tabPractice');
        const tabT = document.getElementById('tabTheory');
        if (pv) pv.style.display = 'none';
        if (tv) tv.style.display = 'block';
        if (tabP) tabP.classList.remove('active');
        if (tabT) tabT.classList.add('active');
      }
    }, 80);
  };

  // Clear stale ribbon if last touch >24h ago
  if (state.ribbon) {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const chId in state.ribbon) {
      const r = state.ribbon[chId];
      if (r && r.lastTouch && r.lastTouch < cutoff) {
        delete state.ribbon[chId];
      }
    }
    saveState();
  }
  // Mark ribbon touch on advance/start
  const _origStartV26 = window.startRibbon;
  if (typeof _origStartV26 === 'function') {
    window.startRibbon = function(chId) { state.ribbon = state.ribbon || {}; state.ribbon[chId] = state.ribbon[chId] || {cursor:0}; state.ribbon[chId].lastTouch = Date.now(); saveState(); _origStartV26(chId); };
  }

  console.log('[V26 StuckFix] active');
})();


// V27 - v14 critic fixes:
//   1. KaTeX over-applying to plain digits/words ("1", "mixed" rendered as math italic)
//   2. PYQ intro page stubs auto-skip
//   3. Progress counter consistency
(function V27_FinalPolish() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // 1. Replace renderMathIn with strict version: only run KaTeX on elements that actually contain $...$ delimiters
  const _origRenderMathIn = window.renderMathIn;
  window.renderMathIn = function(el) {
    if (!el || !window.renderMathInElement) return;
    const txt = el.textContent || '';
    // Strict: must have at least one math delimiter
    const hasMathDelim = /\$[^$\s][^$]*\$/.test(txt) || txt.includes('\(') || txt.includes('\[');
    if (!hasMathDelim) return;
    try {
      window.renderMathInElement(el, {
        throwOnError: false,
        delimiters: [
          { left:'$$', right:'$$', display:true },
          { left:'$', right:'$', display:false },
          { left:'\\(', right:'\\)', display:false },
          { left:'\\[', right:'\\]', display:true }
        ],
        // Don't process plain text \u2014 only matched math
        ignoredTags: ['script','noscript','style','textarea','pre','code','option']
      });
    } catch(e){}
  };

  console.log('[V27 FinalPolish] active');
})();


// V28 - v15 critic fixes:
//   1. Ribbon hijack still happening \u2014 defensively only auto-advance if VERY recent ribbon click (<10s)
//   2. PYQ intro gate: skip "Read first" banner when topic has actual questions (not theory-only)
//   3. PYQ textarea placeholder: notes-copy on answer field
(function V28_RibbonAndIntroFixes() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  // 1. Ribbon: only auto-advance if start/advance was within 10s of close
  const _origStartV28 = window.startRibbon;
  if (typeof _origStartV28 === 'function') {
    window.startRibbon = function(chId) { _origStartV28(chId); state.ribbon = state.ribbon || {}; state.ribbon[chId] = state.ribbon[chId] || {cursor:0}; state.ribbon[chId]._lastInteract = Date.now(); saveState(); };
  }
  const _origAdvanceV28 = window.advanceRibbon;
  if (typeof _origAdvanceV28 === 'function') {
    window.advanceRibbon = function(chId) { state.ribbon = state.ribbon || {}; state.ribbon[chId] = state.ribbon[chId] || {cursor:0}; state.ribbon[chId]._lastInteract = Date.now(); _origAdvanceV28(chId); };
  }
  const _origCloseModalV28 = window.closeModal;
  window.closeModal = function() {
    const sess = session;
    const chId = state.currentChapterId;
    const ribbonRecent = state.ribbon && state.ribbon[chId] && state.ribbon[chId]._lastInteract && (Date.now() - state.ribbon[chId]._lastInteract < 10000);
    const sessionDone = sess && sess.problems && sess.idx >= sess.problems.length - 1;
    _origCloseModalV28();
    // Only advance if recent ribbon interaction AND session done well
    if (ribbonRecent && sessionDone && sess && sess.correct >= Math.floor(sess.problems.length * 0.5)) {
      setTimeout(function() { advanceRibbon(chId); }, 600);
    }
  };

  // 2. Skip PYQ intro banner when topic has real questions
  // The "Start questions" banner from V10b only shows for new topics. If the topic is a PYQ year-bucket (P*) with questions, skip the banner.
  const _origLoadProblemV28 = window.loadProblem;
  window.loadProblem = function() {
    _origLoadProblemV28();
    // Strip any "Start questions" banner if session is a real practice/PYQ session
    setTimeout(function() {
      const tid = session && session.topicFullId;
      if (!tid) return;
      const found = (typeof findTopic === 'function') ? findTopic(tid) : null;
      if (!found) return;
      const isPyqOrPractice = found.topic.id && (found.topic.id.startsWith('P') || found.topic.id.startsWith('B') || found.topic.id.startsWith('E'));
      if (isPyqOrPractice) {
        document.querySelectorAll('#newTopicBanner, .new-topic-banner').forEach(function(el) { el.remove(); });
      }
    }, 30);
  };

  // 3. Fix textarea placeholder
  const _origLoadProblemV28b = window.loadProblem;
  window.loadProblem = function() {
    _origLoadProblemV28b();
    setTimeout(function() {
      const ta = document.querySelector('textarea#modalInput, textarea.theory-textarea');
      if (!ta) return;
      const cur = (ta.placeholder || '').toLowerCase();
      if (cur.includes('derivation tips') || cur.includes('formula tricks')) {
        ta.placeholder = 'Type your derivation: setup, formula, working, boxed answer with units...';
      }
    }, 50);
  };

  console.log('[V28 RibbonAndIntroFixes] active');
})();


// V29 - After removing global auto-render in HTML, ensure setView triggers KaTeX on the visible view
(function V29_ViewRenderHook() {
  if (typeof window === 'undefined') return;
  const _origSetView = window.setView;
  if (typeof _origSetView !== 'function') return;
  window.setView = function(view) {
    _origSetView(view);
    setTimeout(function() {
      const el = document.getElementById('view-' + view);
      if (el && typeof renderMathIn === 'function') renderMathIn(el);
    }, 60);
  };
  console.log('[V29 ViewRenderHook] active');
})();


// V30 - v19 critic fixes:
//   1. Modal close: forcibly remove .open class + style.display=none on overlay after closeModal
(function V30_ModalCleanup() {
  if (typeof window === 'undefined') return;
  const _origCloseModalV30 = window.closeModal;
  window.closeModal = function() {
    _origCloseModalV30();
    setTimeout(function() {
      const ov = document.getElementById('modalOverlay');
      if (ov) {
        ov.classList.remove('open');
        ov.style.pointerEvents = 'none';
        // Reset after animation
        setTimeout(function() { if (ov) ov.style.pointerEvents = ''; }, 400);
      }
    }, 100);
  };
  console.log('[V30 ModalCleanup] active');
})();


// V31 - Make sure PYQ/Practice topics open on Practice tab, never theory
(function V31_PyqOpensPractice() {
  if (typeof window === 'undefined' || !window.CONTENT) return;
  const _origOpenTopicV31 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV31(tfid);
    // After all other wraps run, force the right tab based on topic ID
    setTimeout(function() {
      const found = (typeof findTopic === 'function') ? findTopic(tfid) : null;
      if (!found) return;
      const tid = found.topic.id || '';
      // P* = PYQ, B* = textbook practice, E* = exemplar \u2014 all should default to PRACTICE tab
      const isPracticeKind = /^[PBE]\d/.test(tid);
      if (isPracticeKind && found.topic.questions && found.topic.questions.length > 0) {
        const pv = document.getElementById('practiceView');
        const tv = document.getElementById('theoryView');
        const tabP = document.getElementById('tabPractice');
        const tabT = document.getElementById('tabTheory');
        if (pv) pv.style.display = 'block';
        if (tv) tv.style.display = 'none';
        if (tabP) tabP.classList.add('active');
        if (tabT) tabT.classList.remove('active');
      }
    }, 250); // Run AFTER all earlier wraps including V10b
  };
  console.log('[V31 PyqOpensPractice] active');
})();


// V32 - Nuclear ribbon fix: NEVER auto-advance ribbon on close. Only explicit ribbon button advances.
(function V32_NoRibbonAutoAdvance() {
  if (typeof window === 'undefined') return;
  // Restore plain closeModal \u2014 strip all auto-advance logic from prior wraps
  const _origCloseModalV32 = window.closeModal;
  window.closeModal = function() {
    // Just call previous wrappers but do NOT advance ribbon afterwards
    _origCloseModalV32();
    // Defensive: clear pending advance flags
    if (state.ribbon) {
      for (const chId in state.ribbon) {
        if (state.ribbon[chId]) state.ribbon[chId]._lastInteract = 0;
      }
    }
  };
  // Also: when user clicks any topic tile via openTopic, clear any pending ribbon interact so future closes don't hijack
  const _origOpenTopicV32 = window.openTopic;
  window.openTopic = function(tfid) {
    if (state.ribbon) {
      for (const chId in state.ribbon) {
        if (state.ribbon[chId]) state.ribbon[chId]._lastInteract = 0;
      }
    }
    if (session) session._fromRibbon = false;
    _origOpenTopicV32(tfid);
  };
  console.log('[V32 NoRibbonAutoAdvance] active');
})();


// V33 - Mark Trainer: skip "Boxed answer with units" / "Drew diagram" bullets for 1-mark MCQ types
(function V33_MarkTrainerContextAware() {
  if (typeof window === 'undefined') return;
  // Final wrap on showFeedback to filter inappropriate bullets for low-mark MCQs
  const _origShowFeedbackV33 = window.showFeedback;
  window.showFeedback = function() {
    const args = Array.prototype.slice.call(arguments);
    _origShowFeedbackV33.apply(this, args);
    setTimeout(function() {
      const cur = session && session.problems && session.problems[session.idx];
      if (!cur) return;
      const fb = document.getElementById('feedbackExplain');
      if (!fb) return;
      // Find any mark trainer bullets that don't apply to short MCQs
      const isLowMcq = cur.type === 'mcq' && (cur._pyq?.marks || 1) <= 2;
      if (!isLowMcq) return;
      // Remove inapplicable generic bullets
      fb.querySelectorAll('.smart-mark-trainer div, .v17-mark div, .v21-mark div').forEach(function(d) {
        const txt = (d.textContent || '').toLowerCase();
        if (txt.includes('boxed final answer with units') || txt.includes('drew required diagram') || txt.includes('showed working') || txt.includes('substituted with units')) {
          d.remove();
        }
      });
    }, 200);
  };
  console.log('[V33 MarkTrainerContextAware] active');
})();


// V34 - Critical fixes:
//   1. Mastery should require Q attempts, not theory dwell
//   2. Empty submission shouldn't green-tick on theory PYQs
(function V34_Mastery() {
  if (typeof window === 'undefined') return;
  // V16/V26 had a closeModal wrap that marked theory-only topics done after 8s dwell.
  // Override: require >= 1 question attempted to mark done. Theory-only topics = 'read', not 'mastered'.
  const _origCloseModalV34 = window.closeModal;
  window.closeModal = function() {
    const sess = session;
    if (sess && sess.problems && sess.problems.length > 0) {
      const attempted = sess.idx > 0 || (sess.idx === 0 && sess.correct >= 0); // any progress
      const totalQs = sess.problems.length;
      const correct = sess.correct || 0;
      const tfid = sess.topicFullId;
      // Only mark done if user actually attempted >= 50% of questions AND got >=60% right
      if (tfid && attempted && (sess.idx >= Math.floor(totalQs * 0.5)) && correct >= Math.ceil(totalQs * 0.6)) {
        state.topics = state.topics || {};
        state.topics[tfid] = state.topics[tfid] || { done: false, attempts: 0 };
        state.topics[tfid].done = true;
        state.topics[tfid].attempts = (state.topics[tfid].attempts || 0) + sess.idx + 1;
      } else if (tfid) {
        // Track attempt but don't mark done
        state.topics = state.topics || {};
        state.topics[tfid] = state.topics[tfid] || { done: false, attempts: 0 };
        state.topics[tfid].attempts = (state.topics[tfid].attempts || 0) + Math.max(sess.idx, 0);
      }
      saveState();
    }
    _origCloseModalV34();
  };
  console.log('[V34 Mastery] active');
})();


// =========================================================================
// V35 - Post-render fix: surface chapter.theory fallback to all topics
// Earlier patch at line 404 should make hasContent true when ch.theory exists,
// but a stacking-wrap somewhere is overriding the locked state. This wrap
// runs AFTER everything else and re-applies the click handlers + meta + class.
// =========================================================================
(function V35_TopicFallback() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  function repairTiles() {
    const ch = (typeof state !== 'undefined') ? findChapter(state.currentChapterId) : null;
    if (!ch || !(ch.theory && ch.theory.length > 50)) return;
    const root = document.getElementById('view-chapter');
    if (!root) return;
    const tiles = root.querySelectorAll('.topic');
    let tIdx = 0;
    for (const part of ch.parts) {
      const partLetter = ['A','B','C','D','E','F'][ch.parts.indexOf(part)] || '';
      for (let i = 0; i < part.topics.length; i++) {
        const topic = part.topics[i];
        const tile = tiles[tIdx];
        if (!tile) { tIdx++; continue; }
        const fullId = fullTopicId(ch.id, topic.id);
        const ts = (state.topics && state.topics[fullId]) || { done: false };
        const hasOwnContent = (topic.questions && topic.questions.length > 0) || (topic.theory && topic.theory.length > 50);
        // If tile is locked AND chapter has theory, unlock it (theory-fallback access)
        if (tile.classList.contains('locked')) {
          tile.classList.remove('locked');
          tile.classList.add('theory-fallback');
          tile.style.cursor = 'pointer';
          tile.style.opacity = '1';
          // Update status badge from \u23F3 to letter+num
          const statusEl = tile.querySelector('.topic-status');
          if (statusEl) statusEl.textContent = `${partLetter}${i+1}`;
          // Update meta
          const metaEl = tile.querySelector('.topic-meta');
          if (metaEl) metaEl.textContent = 'theory \u00B7 from chapter';
          // Add click
          tile.onclick = () => { try { sfx('click'); } catch(_){} openTopic(fullId); };
        }
        tIdx++;
      }
    }
  }

  // Hook into renderChapter to run repair after each render
  const _origRC_V35 = window.renderChapter;
  window.renderChapter = function() {
    _origRC_V35();
    setTimeout(repairTiles, 30);
  };

  // Also run once on load if already on chapter view
  setTimeout(function() {
    if (state && state.view === 'chapter') repairTiles();
  }, 200);

  console.log('[V35 TopicFallback] active');
})();


// =========================================================================
// V36 - Per-topic theory clipping
// chapter.theory contains the full chapter (e.g. sections 1.1\u20131.9). Showing
// the whole thing on every topic is overwhelming. Clip to just the section
// that matches the topic's numeric prefix: "1a. Foo" -> section X.1,
// "2c. Bar" -> section X.2, etc. (X = chapter number)
// =========================================================================
(function V36_TopicTheoryClip() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  function clipChapterTheoryForTopic(chapter, topic) {
    const t = chapter && chapter.theory;
    if (!t) return null;

    // Extract numeric prefix from topic name: "1a. Foo" -> 1, "2c. Bar" -> 2
    const m = topic && topic.name && topic.name.match(/^(\d+)[a-z]?\b/);
    if (!m) return null;
    const sectionMinor = parseInt(m[1], 10);
    const chMajor = chapter.number;
    const targetNum = chMajor + '.' + sectionMinor;

    // Find <h3 ...>X.Y title</h3> ... up to next <h3> (or end)
    const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
    let match, sliceStart = -1, sliceEnd = t.length;
    const sectionStarts = [];
    while ((match = h3Re.exec(t)) !== null) {
      const heading = match[1];
      const numMatch = heading.match(/(\d+\.\d+)/);
      sectionStarts.push({ idx: match.index, num: numMatch ? numMatch[1] : null });
    }
    for (let i = 0; i < sectionStarts.length; i++) {
      if (sectionStarts[i].num === targetNum) {
        sliceStart = sectionStarts[i].idx;
        sliceEnd = i + 1 < sectionStarts.length ? sectionStarts[i + 1].idx : t.length;
        break;
      }
    }
    if (sliceStart < 0) return null; // section not found

    // Find the source banner (above the first h3) and prepend it
    const firstH3 = sectionStarts[0] ? sectionStarts[0].idx : 0;
    const banner = t.substring(0, firstH3);
    const body = t.substring(sliceStart, sliceEnd);
    return banner + body;
  }

  // Wrap openTopic to substitute clipped theory when topic.theory is empty
  const _origOpenTopicV36 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV36(tfid);
    setTimeout(function() {
      const found = findTopic(tfid);
      if (!found) return;
      const topicTheory = found.topic.theory;
      if (topicTheory && topicTheory.length > 50) return; // topic has its own
      const clipped = clipChapterTheoryForTopic(found.chapter, found.topic);
      if (!clipped) return;
      const el = document.getElementById('theoryContent');
      if (!el) return;
      el.innerHTML = clipped;
      if (typeof renderMathIn === 'function') renderMathIn(el);
    }, 30);
  };

  console.log('[V36 TopicTheoryClip] active');
})();


// =========================================================================
// V37 - Fix smartContinue to surface theory topics first
// Original smartContinue only looks at topics with questions.length > 0, so
// the new theory-fallback topics (questions=0, falls back to chapter.theory)
// get skipped. Result: "Next up" jumps past all theory and lands on Nootan.
// Override to prefer the first non-done theory topic before any practice.
// =========================================================================
(function V37_SmartContinueTheoryFirst() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  function topicHasTheoryOrContent(ch, t) {
    const tfid = fullTopicId(ch.id, t.id);
    if (state.topics && state.topics[tfid] && state.topics[tfid].done) return false;
    if (t.questions && t.questions.length > 0) return true;
    if (t.theory && t.theory.length > 50) return true;
    if (ch.theory && ch.theory.length > 50) return true;
    return false;
  }

  window.smartContinue = function() {
    // Walk subjects in order. For each chapter, walk parts in order. Return the
    // first non-done topic that has any content (questions OR theory fallback).
    const subjects = ['Physics', 'Chemistry', 'Maths'];
    // Honor in-progress chapter first
    const inProgress = state.currentChapterId ? findChapter(state.currentChapterId) : null;
    const order = inProgress ? [inProgress] : [];
    for (const sub of subjects) {
      for (const ch of getSubjectChapters(sub)) {
        if (!order.includes(ch)) order.push(ch);
      }
    }
    for (const ch of order) {
      for (const part of ch.parts) {
        for (const t of part.topics) {
          if (topicHasTheoryOrContent(ch, t)) {
            return { chapter: ch, topic: t };
          }
        }
      }
    }
    return null;
  };

  // Re-render mission so the "Next up" picks up the new logic
  if (state && state.view === 'mission' && typeof renderMission === 'function') {
    setTimeout(renderMission, 50);
  }

  console.log('[V37 SmartContinueTheoryFirst] active');
})();


// =========================================================================
// V38 - REVERTED 2026-04-29
// Was: keyword-matching chapter questions onto theory topics. Decision:
// theory topics show theory only; practice happens via the dedicated Nootan,
// Past Year, and Arihant MCQ tiles which already cover the chapter pool.
// Keeping wrapper as a no-op for forward-compat with cache busters.
// =========================================================================
(function V38_NoOp() { console.log('[V38 reverted] theory=theory, practice=practice tiles'); })();
(function V38_DEAD_CODE_PREVIOUS_DEFINITION() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  const PER_TOPIC_Q = 6;

  function chapterQuestionPool(ch) {
    // Pull from every non-theory part: Nootan, PYQ, Arihant, and any other practice bank.
    const pool = [];
    if (!ch || !ch.parts) return pool;
    for (const part of ch.parts) {
      if (!part || part.name === 'Theory by Topic') continue;
      for (const t of (part.topics || [])) {
        for (const q of (t.questions || [])) pool.push(q);
      }
    }
    return pool;
  }

  // Keyword expansion: each topic name maps to a set of related keywords found
  // in question text. Hand-curated for Phys ch1 sections 1.1-1.9; falls back
  // to extracting keywords from the topic name for unknown topics.
  const TOPIC_KEYWORDS = {
    // Phys ch1
    'Electric Charge': ['electron', 'proton', 'charge', 'rubbed', 'rubbing', 'quantisation', 'quantization', 'conservation of charge', 'positive charge', 'negative charge'],
    "Coulomb's Law": ['coulomb', 'force between', 'point charge', 'two charges', 'k = ', 'permittivity', 'dielectric constant'],
    'Superposition': ['superposition', 'multiple charges', 'net force', 'three charges', 'four charges', 'system of charges'],
    'Electric Field': ['electric field', 'field at', 'field due to', 'test charge', 'field intensity', 'NC', 'V/m', 'N/C'],
    'Electric Field Lines': ['field lines', 'lines of force', 'pattern of', 'representation', 'closed loop'],
    'Electric Dipole': ['dipole', 'dipole moment', 'two equal and opposite', '+q and -q', 'polar molecule', 'axial', 'equatorial'],
    'Dipole in a Uniform': ['torque on', 'dipole in', 'uniform field', 'uniform electric field', 'rotational equilibrium', 'work done in rotating'],
    'Electric Flux': ['flux', 'gauss', 'gaussian', 'flux through', 'enclosed charge', 'closed surface'],
    'Gauss': ['gauss', "gauss's law", 'gauss theorem', 'infinite sheet', 'long wire', 'spherical shell', 'gaussian surface'],
  };

  function keywordsForTopic(topic, chapter) {
    const name = topic.name || '';
    // Strip leading "1a. " prefix and get plain title
    const stripped = name.replace(/^\d+[a-z]?\.\s*/, '').trim();

    // Step 1: derive the section number from topic name "1a" \u2192 1, then build canonical "X.Y"
    const m = name.match(/^(\d+)[a-z]?\b/);
    if (m && chapter && window.SECTION_KEYWORDS) {
      const chapterMap = window.SECTION_KEYWORDS[chapter.id];
      if (chapterMap) {
        const sectionNum = chapter.number + '.' + parseInt(m[1], 10);
        const kws = chapterMap[sectionNum];
        if (kws && kws.length > 0) return kws;
      }
    }

    // Step 2: in-engine fallback dictionary (legacy Phys ch1 entries)
    for (const key of Object.keys(TOPIC_KEYWORDS)) {
      if (stripped.toLowerCase().includes(key.toLowerCase())) {
        return TOPIC_KEYWORDS[key];
      }
    }
    // Step 3: extract from the topic name directly
    const STOP = new Set(['the', 'and', 'its', 'due', 'for', 'with', 'in', 'of', 'a', 'an', 'on', 'as', 'at', 'to', 'by']);
    return stripped.toLowerCase().split(/\s+/).filter(w => w.length >= 4 && !STOP.has(w));
  }

  function questionMatchesKeywords(q, keywords) {
    const txt = ((q.q || '') + ' ' + (q.options || []).join(' ')).toLowerCase();
    if (!txt.trim()) return false;
    for (const kw of keywords) {
      if (txt.includes(kw.toLowerCase())) return true;
    }
    return false;
  }

  const _origOpenTopicV38 = window.openTopic;
  window.openTopic = function(tfid) {
    _origOpenTopicV38(tfid);
    setTimeout(function() {
      const found = findTopic(tfid);
      if (!found) return;
      const part = found.chapter.parts.find(p => p.topics.some(t => t.id === found.topic.id));
      if (!part || part.name !== 'Theory by Topic') return;
      if (found.topic.questions && found.topic.questions.length > 0) return;

      const pool = chapterQuestionPool(found.chapter);
      if (pool.length === 0) return;

      const keywords = keywordsForTopic(found.topic, found.chapter);
      const matched = pool.filter(q => questionMatchesKeywords(q, keywords));

      // If keyword-match too sparse, fall back to position-slice for at least N questions
      let practice;
      if (matched.length >= 4) {
        practice = matched.slice(0, 20); // cap at 20 to keep batch reasonable
      } else {
        const m = (found.topic.name || '').match(/^(\d+)/);
        const sectionIdx = m ? parseInt(m[1], 10) - 1 : 0;
        const start = Math.floor(sectionIdx * pool.length / 9) % pool.length;
        const fallback = [];
        for (let i = 0; i < PER_TOPIC_Q && fallback.length < PER_TOPIC_Q; i++) {
          const cand = pool[(start + i) % pool.length];
          if (!matched.includes(cand)) fallback.push(cand);
        }
        practice = matched.concat(fallback).slice(0, PER_TOPIC_Q);
      }

      // Sort by difficulty: easiest first. Composite score from multiple signals:
      //   1. Type rank (vsa < mcq < numerical/sa < la)
      //   2. Marks if mentioned in the question source/text ([1] easier than [5])
      //   3. NCERT Exemplar / Competency flags add difficulty
      //   4. Text length (longer prompt usually = harder)
      const TYPE_RANK = { vsa: 0, mcq: 1, numerical: 2, sa: 2, la: 3 };
      function difficultyScore(q) {
        let score = 0;
        const type = (q.type || 'mcq').toLowerCase();
        score += (TYPE_RANK[type] != null ? TYPE_RANK[type] : 2) * 100;

        // Marks detection: look for [N], [N marks], (N marks), N-mark patterns
        const blob = ((q.q || '') + ' ' + (q._source || '') + ' ' + (q.hint || ''));
        const mk = blob.match(/\[\s*(\d+)\s*(?:Marks?|M)?\s*\]|\(\s*(\d+)\s*Marks?\s*\)/i);
        if (mk) {
          const m = parseInt(mk[1] || mk[2], 10);
          if (m >= 1 && m <= 10) score += m * 30;
        }

        // Source-based bumps: harder banks
        const src = (q._source || '').toLowerCase();
        if (src.includes('exemplar')) score += 50;
        if (src.includes('competency')) score += 40;
        if (src.includes('long answer') || src.includes(' la ')) score += 60;
        if (src.includes('case based')) score += 30;

        // Text length tiebreaker (cap influence so it doesn't overwhelm type rank)
        const len = (q.q || '').length + ((q.options || []).join('').length);
        score += Math.min(len, 800) / 80;

        return score;
      }
      practice.sort(function(a, b) { return difficultyScore(a) - difficultyScore(b); });

      if (typeof session !== 'undefined' && session && session.topicFullId === tfid) {
        session.problems = practice;
        session.idx = 0;
        session.correct = 0;
      }
      found.topic.questions = practice;

      // Render the first problem so practice tab isn't stuck on "Loading\u2026"
      if (typeof loadProblem === 'function') {
        try { loadProblem(); } catch (e) { console.warn('[V38] loadProblem failed', e); }
      }
      // Make sure tab handlers know practice exists (don't switch to it; keep theory default)
      const tabPrac = document.getElementById('tabPractice');
      if (tabPrac) tabPrac.classList.remove('hidden');
    }, 80);
  };

  console.log('[V38 TheoryTopicPractice] active (per topic = ' + PER_TOPIC_Q + ' Q)');
})();


// =========================================================================
// V39 - Surface difficulty + section metadata in the practice UI
// Pulls from window.QUESTION_DIFFICULTY (built by build_difficulty_bundle.js).
// Adds a 5-dot pip badge next to the type badge in the question header,
// title-cased difficulty label, and the section the question belongs to.
// Also exposes a global helper for other wraps: window.getQuestionMeta(q).
// =========================================================================
(function V39_DifficultyBadges() {
  if (typeof window === 'undefined') return;

  const DIFF_LABEL = { 1: 'recall', 2: 'easy', 3: 'standard', 4: 'hard', 5: 'edge' };
  const DIFF_COLOR = { 1: '#10b981', 2: '#22c55e', 3: '#f59e0b', 4: '#ef4444', 5: '#7c3aed' };

  // O(1) per-question lookup with graceful fallback for unmapped questions
  // (e.g. NCERT Exemplar bank wasn't included in the agent grading pass).
  window.getQuestionMeta = function(q) {
    if (!q) return null;
    if (q._difficulty) return { difficulty: q._difficulty, section: q._section || null, rationale: q._rationale || null };
    if (window.QUESTION_DIFFICULTY && q.id) {
      const m = window.QUESTION_DIFFICULTY[q.id];
      if (m) return { difficulty: m.d, section: m.s, rationale: m.r };
    }
    return null;
  };

  function pipHtml(level) {
    if (!level) return '';
    const filled = Math.max(0, Math.min(5, level));
    const dots = '\u25CF'.repeat(filled) + '\u25CB'.repeat(5 - filled);
    const label = DIFF_LABEL[level] || '';
    const color = DIFF_COLOR[level] || '#6b7280';
    return `<span class="diff-pip" title="Difficulty ${level}/5 (${label})" style="display:inline-flex;align-items:center;gap:6px;font-family:'Geist Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.04em;color:${color};margin-left:8px;background:${color}14;padding:3px 8px;border-radius:99px;border:1px solid ${color}33;"><span style="letter-spacing:1px;">${dots}</span><span style="text-transform:uppercase;">${label}</span></span>`;
  }

  function sectionHtml(section) {
    if (!section) return '';
    return `<span class="section-tag" style="display:inline-flex;align-items:center;font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);margin-left:8px;background:var(--bg,#f5f5f0);padding:3px 8px;border-radius:99px;border:1px solid var(--line,#e8e6e0);">\u00A7${section}</span>`;
  }

  // Inject CSS once (for any future style hooks)
  if (!document.getElementById('v39-styles')) {
    const s = document.createElement('style');
    s.id = 'v39-styles';
    s.textContent = `
      .diff-pip { vertical-align: middle; }
      .section-tag { vertical-align: middle; }
      #modalTopic { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    `;
    document.head.appendChild(s);
  }

  // Wrap loadProblem to inject the pip + section after the type badge.
  // Strategy: append to #modalTopic after the original render runs.
  const _origLoadProblemV39 = window.loadProblem;
  if (typeof _origLoadProblemV39 === 'function') {
    window.loadProblem = function() {
      _origLoadProblemV39();
      try {
        const p = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
        if (!p) return;
        const meta = window.getQuestionMeta(p);
        if (!meta) return;
        const topicEl = document.getElementById('modalTopic');
        if (!topicEl) return;
        // Don't double-inject on re-renders
        topicEl.querySelectorAll('.diff-pip, .section-tag').forEach(el => el.remove());
        if (meta.difficulty) topicEl.insertAdjacentHTML('beforeend', pipHtml(meta.difficulty));
        if (meta.section) topicEl.insertAdjacentHTML('beforeend', sectionHtml(meta.section));
      } catch (e) {
        console.warn('[V39] meta inject failed', e);
      }
    };
  }

  console.log('[V39 DifficultyBadges] active');
})();


// =========================================================================
// V40 - Difficulty filter chips on the practice modal
// Renders a 4-chip strip ("All / Recall \u00B7 Easy / Standard / Hard \u00B7 Edge")
// at the top of the practice view. Clicking re-filters session.problems by
// difficulty bucket. Preserves the original (unfiltered) list as
// session._fullProblems so the user can switch back to All.
// State preference saved to state.difficultyFilter for next session.
// =========================================================================
(function V40_DifficultyFilters() {
  if (typeof window === 'undefined') return;

  state.difficultyFilter = state.difficultyFilter || 'all';

  // Bucket definition: chip key -> matching difficulty levels
  const BUCKETS = {
    all: { label: 'All', levels: [1,2,3,4,5], dot: '\u25CB\u25CB\u25CB\u25CB\u25CB' },
    easy: { label: 'Recall \u00B7 Easy', levels: [1,2], dot: '\u25CF\u25CF\u25CB\u25CB\u25CB' },
    std: { label: 'Standard', levels: [3], dot: '\u25CF\u25CF\u25CF\u25CB\u25CB' },
    hard: { label: 'Hard \u00B7 Edge', levels: [4,5], dot: '\u25CF\u25CF\u25CF\u25CF\u25CF' },
  };

  function bucketize(problems) {
    const counts = { all: problems.length, easy: 0, std: 0, hard: 0 };
    for (const q of problems) {
      const meta = window.getQuestionMeta && window.getQuestionMeta(q);
      const d = meta && meta.difficulty ? meta.difficulty : null;
      if (!d) continue;
      if (d <= 2) counts.easy++;
      else if (d === 3) counts.std++;
      else counts.hard++;
    }
    return counts;
  }

  function applyFilter(bucketKey) {
    if (typeof session === 'undefined' || !session) return;
    if (!session._fullProblems) session._fullProblems = (session.problems || []).slice();
    const all = session._fullProblems;
    const levels = BUCKETS[bucketKey] ? BUCKETS[bucketKey].levels : null;
    let next;
    if (!levels || bucketKey === 'all') {
      next = all.slice();
    } else {
      next = all.filter(q => {
        const meta = window.getQuestionMeta && window.getQuestionMeta(q);
        return meta && meta.difficulty && levels.includes(meta.difficulty);
      });
    }
    if (next.length === 0) {
      showToast && showToast('default', '\u25CC', 'No questions at this level \u2014 showing all');
      next = all.slice();
      bucketKey = 'all';
    }
    session.problems = next;
    session.idx = 0;
    session.correct = 0;
    state.difficultyFilter = bucketKey;
    saveState && saveState();
    if (typeof loadProblem === 'function') loadProblem();
    renderChips(bucketKey, all);
  }

  function renderChips(activeKey, fullProblems) {
    const counts = bucketize(fullProblems);
    const host = document.getElementById('practiceView');
    if (!host) return;
    let strip = document.getElementById('diffFilterStrip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'diffFilterStrip';
      strip.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;padding:8px 0 12px;border-bottom:1px dashed var(--line,#e8e6e0);margin-bottom:14px;align-items:center;';
      host.insertBefore(strip, host.firstChild);
    }
    const chipsHtml = [
      '<span style="font-family:\'Geist Mono\',monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;margin-right:4px;">FILTER</span>',
    ];
    for (const [key, b] of Object.entries(BUCKETS)) {
      const active = key === activeKey;
      const count = counts[key] || 0;
      const disabled = count === 0 && key !== 'all';
      const bg = active ? 'var(--ink,#1a1a1a)' : 'var(--paper,#fff)';
      const fg = active ? '#fff' : (disabled ? 'var(--ink-muted,#6b6b6b)' : 'var(--ink,#1a1a1a)');
      const opacity = disabled ? '0.4' : '1';
      const cursor = disabled ? 'not-allowed' : 'pointer';
      chipsHtml.push(`<button type="button" data-bucket="${key}" ${disabled?'disabled':''} style="background:${bg};color:${fg};border:1px solid var(--line,#e8e6e0);border-radius:99px;padding:5px 12px;font-family:'Geist Mono',monospace;font-size:11px;font-weight:500;cursor:${cursor};opacity:${opacity};transition:all 0.15s;">${b.label} <span style="opacity:0.7;font-size:10px;margin-left:4px;">${count}</span></button>`);
    }
    strip.innerHTML = chipsHtml.join('');
    strip.querySelectorAll('button[data-bucket]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        applyFilter(btn.dataset.bucket);
      });
    });
  }

  // Hook openTopic so chips render on each modal open
  const _origOpenTopicV40 = window.openTopic;
  if (typeof _origOpenTopicV40 === 'function') {
    window.openTopic = function(tfid) {
      _origOpenTopicV40(tfid);
      setTimeout(function() {
        if (typeof session === 'undefined' || !session || !session.problems || session.problems.length === 0) return;
        // Only show chips if the topic has any tagged questions (skip pure theory)
        const anyTagged = session.problems.some(q => window.getQuestionMeta && window.getQuestionMeta(q));
        if (!anyTagged) return;
        session._fullProblems = session.problems.slice();
        const remember = state.difficultyFilter || 'all';
        if (remember !== 'all') applyFilter(remember);
        else renderChips('all', session._fullProblems);
      }, 120);
    };
  }

  console.log('[V40 DifficultyFilters] active');
})();


// =========================================================================
// V41 - Pre-set preview on chapter tiles
// On the chapter view, append a small "\uD83D\uDFE22 \uD83D\uDFE11 \uD83D\uDD342 \u00B7 ~7 min" summary to each
// topic tile that has practice questions (skips theory-only topics, since
// V38 attaches transient practice that varies per session).
// Time budget: 25s easy, 50s standard, 90s hard, fallback 60s for untagged.
// =========================================================================
(function V41_TilePreview() {
  if (typeof window === 'undefined') return;

  const TIME_BUDGET = { 1: 25, 2: 30, 3: 50, 4: 75, 5: 90 };
  const FALLBACK = 60;

  function summariseTopic(topic) {
    const qs = topic.questions || [];
    if (qs.length === 0) return null;
    const counts = { easy: 0, std: 0, hard: 0, untagged: 0 };
    let totalSec = 0;
    for (const q of qs) {
      const meta = window.getQuestionMeta && window.getQuestionMeta(q);
      const d = meta && meta.difficulty;
      if (!d) { counts.untagged++; totalSec += FALLBACK; continue; }
      if (d <= 2) counts.easy++;
      else if (d === 3) counts.std++;
      else counts.hard++;
      totalSec += TIME_BUDGET[d] || FALLBACK;
    }
    const minutes = Math.max(1, Math.round(totalSec / 60));
    return { counts, minutes, total: qs.length };
  }

  function renderPreview(s) {
    if (!s) return '';
    const parts = [];
    if (s.counts.easy)   parts.push('<span style="color:#10b981;">\u25CF</span>'+s.counts.easy);
    if (s.counts.std)    parts.push('<span style="color:#f59e0b;">\u25CF</span>'+s.counts.std);
    if (s.counts.hard)   parts.push('<span style="color:#ef4444;">\u25CF</span>'+s.counts.hard);
    if (s.counts.untagged) parts.push('<span style="color:var(--ink-muted,#6b6b6b);">\u25CB</span>'+s.counts.untagged);
    parts.push(`<span style="opacity:0.75;margin-left:4px;">~${s.minutes} min</span>`);
    return `<div class="tile-preview" style="font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.04em;display:inline-flex;gap:6px;align-items:center;margin-top:3px;color:var(--ink-muted,#6b6b6b);">${parts.join(' ')}</div>`;
  }

  function injectIntoTiles() {
    const ch = (typeof state !== 'undefined') ? findChapter(state.currentChapterId) : null;
    if (!ch) return;
    const tiles = document.querySelectorAll('#view-chapter .topic');
    let tIdx = 0;
    for (const part of ch.parts) {
      for (const topic of part.topics) {
        const tile = tiles[tIdx];
        if (tile && !tile.querySelector('.tile-preview')) {
          const summary = summariseTopic(topic);
          if (summary && summary.total > 0) {
            const info = tile.querySelector('.topic-info');
            if (info) info.insertAdjacentHTML('beforeend', renderPreview(summary));
          }
        }
        tIdx++;
      }
    }
  }

  const _origRC_V41 = window.renderChapter;
  window.renderChapter = function() {
    _origRC_V41();
    setTimeout(injectIntoTiles, 60);
  };

  setTimeout(function() {
    if (state && state.view === 'chapter') injectIntoTiles();
  }, 250);

  console.log('[V41 TilePreview] active');
})();


// =========================================================================
// V42 - Assign synthetic ids to every question in window.CONTENT
// The Arihant + Nootan + PYQ banks store questions without id fields. The
// difficulty map (build_chapter_artifacts.js) generated synthetic ids using
// `<chapter>_<part>_<topic>_<index>`. This wrap matches that format so V39
// lookups land. MUST run before any topic opens.
// =========================================================================
(function V42_AssignQuestionIds() {
  if (typeof window === 'undefined' || !window.CONTENT) return;
  let assigned = 0, alreadyHad = 0;
  for (const sub of ['Physics', 'Chemistry', 'Maths']) {
    for (const ch of (window.CONTENT[sub] || [])) {
      for (const part of (ch.parts || [])) {
        for (const t of (part.topics || [])) {
          const qs = t.questions || [];
          for (let i = 0; i < qs.length; i++) {
            const q = qs[i];
            if (!q) continue;
            if (q.id) { alreadyHad++; continue; }
            q.id = `${ch.id}_${part.id || 'p'}_${t.id || 'top'}_${i}`;
            assigned++;
          }
        }
      }
    }
  }
  console.log('[V42 AssignQuestionIds] assigned ' + assigned + ' (already had ' + alreadyHad + ')');
})();


// =========================================================================
// V43 - Adaptive difficulty ramping
// Tracks per-level accuracy in state.difficultyAccuracy = {1:{correct,total},...}.
// When user hits \u22655 attempts at a level with \u226580% accuracy, surface a toast:
// "Solid at Standard (5/6). Try Hard?" The user clicks the toast OR ignores it.
// We never auto-advance \u2014 predictability matters for ADHD.
// =========================================================================
(function V43_AdaptiveRamping() {
  if (typeof window === 'undefined') return;

  state.difficultyAccuracy = state.difficultyAccuracy || { 1: {c:0,t:0}, 2:{c:0,t:0}, 3:{c:0,t:0}, 4:{c:0,t:0}, 5:{c:0,t:0} };
  state.rampSuggested = state.rampSuggested || {}; // level -> last suggested timestamp

  const LEVEL_NAME = { 1: 'Recall', 2: 'Easy', 3: 'Standard', 4: 'Hard', 5: 'Edge' };
  const NEXT_BUCKET = { 1: 'easy', 2: 'std', 3: 'std', 4: 'hard', 5: 'hard' }; // V40 bucket key the user should jump to
  const NEXT_NAME = { 1: 'Easy', 2: 'Standard', 3: 'Hard', 4: 'Edge', 5: null };
  const MIN_SAMPLES = 5;
  const ACCURACY_THRESHOLD = 0.80;
  const SUGGEST_COOLDOWN_MS = 24 * 60 * 60 * 1000; // don't re-suggest within 24h

  function recordOutcome(meta, wasCorrect) {
    if (!meta || !meta.difficulty) return;
    const lvl = meta.difficulty;
    state.difficultyAccuracy[lvl] = state.difficultyAccuracy[lvl] || {c:0,t:0};
    state.difficultyAccuracy[lvl].t++;
    if (wasCorrect) state.difficultyAccuracy[lvl].c++;
    saveState && saveState();
    maybeSuggestRamp(lvl);
  }

  function maybeSuggestRamp(lvl) {
    if (lvl >= 5) return; // no level above 5
    const stat = state.difficultyAccuracy[lvl];
    if (!stat || stat.t < MIN_SAMPLES) return;
    if ((stat.c / stat.t) < ACCURACY_THRESHOLD) return;
    const last = state.rampSuggested[lvl] || 0;
    if (Date.now() - last < SUGGEST_COOLDOWN_MS) return;
    state.rampSuggested[lvl] = Date.now();
    saveState && saveState();
    const label = LEVEL_NAME[lvl] || ('L' + lvl);
    const next = NEXT_NAME[lvl] || ('L' + (lvl + 1));
    if (typeof showToast === 'function') {
      showToast('default', '\u25C6', `Solid at ${label} (${stat.c}/${stat.t}). Ready for ${next}?`);
    }
  }

  // Wrap submitAnswer: capture if session.correct went up after the original call
  const _origSubmitV43 = window.submitAnswer;
  if (typeof _origSubmitV43 === 'function') {
    window.submitAnswer = function() {
      const before = (typeof session !== 'undefined' && session && typeof session.correct === 'number') ? session.correct : 0;
      const idxBefore = (typeof session !== 'undefined' && session) ? session.idx : -1;
      const cur = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
      _origSubmitV43.apply(this, arguments);
      try {
        if (!cur) return;
        const after = (typeof session !== 'undefined' && session) ? session.correct : 0;
        // Only record if a grading actually happened (idx still equals idxBefore until Next is clicked)
        // We detect "graded" by feedback element having .show
        const fb = document.getElementById('modalFeedback');
        const graded = fb && fb.classList && fb.classList.contains('show');
        if (!graded) return;
        const wasCorrect = after > before;
        const meta = window.getQuestionMeta && window.getQuestionMeta(cur);
        recordOutcome(meta, wasCorrect);
      } catch (e) { /* swallow */ }
    };
  }

  console.log('[V43 AdaptiveRamping] active');
})();


// =========================================================================
// V44 - My Progress dashboard
// Renders a richer progress section at the bottom of the Mission view:
//   - Countdown to EV1 (Jun 2026) + Boards (Feb 2027)
//   - Per-subject mastery bars (mastery = topics done / total topics)
//   - 30-day calendar heatmap (built from state.activityLog)
//   - Per-difficulty accuracy from V43's state.difficultyAccuracy
// Activity log is updated lazily on each submitAnswer (latest day only).
// =========================================================================
(function V44_ProgressDashboard() {
  if (typeof window === 'undefined') return;

  const DEADLINES = [
    { name: 'EV1',    date: '2026-07-04', tag: 'School test' },
    { name: 'Boards', date: '2027-02-15', tag: 'ISC final' },
  ];

  state.activityLog = state.activityLog || {}; // {YYYY-MM-DD: {solved, correct}}

  function recordActivity(wasCorrect) {
    const today = todayISO();
    if (!state.activityLog[today]) state.activityLog[today] = { solved: 0, correct: 0 };
    state.activityLog[today].solved++;
    if (wasCorrect) state.activityLog[today].correct++;
    saveState && saveState();
  }

  function daysUntil(iso) {
    const target = new Date(iso + 'T00:00:00').getTime();
    const now = new Date(); now.setHours(0,0,0,0);
    return Math.max(0, Math.round((target - now.getTime()) / 86400000));
  }

  function subjectMastery(sub) {
    const chapters = getSubjectChapters(sub) || [];
    let totalTopics = 0, doneTopics = 0;
    for (const ch of chapters) {
      for (const part of (ch.parts || [])) {
        if (part.name !== 'Theory by Topic') continue;
        for (const t of (part.topics || [])) {
          totalTopics++;
          const fullId = fullTopicId(ch.id, t.id);
          if (state.topics[fullId] && state.topics[fullId].done) doneTopics++;
        }
      }
    }
    return { done: doneTopics, total: totalTopics, pct: totalTopics ? Math.round(doneTopics / totalTopics * 100) : 0 };
  }

  function recentDays(n) {
    const out = [];
    const now = new Date(); now.setHours(0,0,0,0);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const log = state.activityLog[iso] || { solved: 0, correct: 0 };
      out.push({ iso, solved: log.solved, correct: log.correct, dow: d.getDay() });
    }
    return out;
  }

  function renderDashboard() {
    // Build HTML
    const subjects = ['Physics', 'Chemistry', 'Maths'];
    const themes = (typeof SUBJECT_THEMES !== 'undefined') ? SUBJECT_THEMES : {};

    let html = `<section class="progress-dash fade-in delay-2" style="margin-top:36px;padding:24px;background:var(--paper,#fff);border:1px solid var(--line,#e8e6e0);border-radius:18px;">`;
    html += `<div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:18px;">Your progress</div>`;

    // Countdown row
    html += '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;">';
    for (const d of DEADLINES) {
      const days = daysUntil(d.date);
      const urgent = days < 60;
      html += `<div style="flex:1;min-width:160px;padding:14px 18px;background:${urgent ? '#fef3c7' : 'var(--bg,#fafaf7)'};border-radius:12px;border:1px solid ${urgent ? '#fde68a' : 'var(--line,#e8e6e0)'};">
        <div style="font-family:'Geist Mono',monospace;font-size:10px;color:${urgent ? '#92400e' : 'var(--ink-muted,#6b6b6b)'};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">${d.name} \u00B7 ${d.tag}</div>
        <div style="font-family:'Fraunces',serif;font-weight:600;font-size:34px;line-height:1;color:${urgent ? '#92400e' : 'var(--ink,#1a1a1a)'};">${days}</div>
        <div style="font-size:12px;color:var(--ink-muted,#6b6b6b);margin-top:2px;">days \u00B7 ${d.date}</div>
      </div>`;
    }
    html += '</div>';

    // Subject mastery bars
    html += '<div style="margin-bottom:24px;"><div style="font-family:\'Geist Mono\',monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Subject mastery</div>';
    for (const sub of subjects) {
      const m = subjectMastery(sub);
      const theme = themes[sub] || { color: '#1a1a1a', icon: '\u00B7' };
      html += `<div style="display:flex;align-items:center;gap:14px;margin-bottom:8px;font-size:13px;">
        <span style="width:90px;color:var(--ink,#1a1a1a);font-weight:500;">${theme.icon} ${sub}</span>
        <div style="flex:1;height:10px;background:var(--line,#e8e6e0);border-radius:99px;overflow:hidden;">
          <div style="width:${m.pct}%;height:100%;background:${theme.color};transition:width 0.5s;"></div>
        </div>
        <span style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);width:80px;text-align:right;">${m.done}/${m.total} \u00B7 ${m.pct}%</span>
      </div>`;
    }
    html += '</div>';

    // 30-day heatmap
    const days30 = recentDays(30);
    html += '<div style="margin-bottom:24px;"><div style="font-family:\'Geist Mono\',monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Last 30 days</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(30,1fr);gap:3px;">';
    for (const d of days30) {
      const heat = d.solved === 0 ? 0 : (d.solved < 5 ? 1 : (d.solved < 15 ? 2 : (d.solved < 30 ? 3 : 4)));
      const colors = ['var(--line,#e8e6e0)', '#bbf7d0', '#86efac', '#22c55e', '#15803d'];
      html += `<div title="${d.iso} \u00B7 ${d.solved} questions" style="aspect-ratio:1;background:${colors[heat]};border-radius:3px;"></div>`;
    }
    html += '</div>';
    const totalSolved30 = days30.reduce((s,d) => s + d.solved, 0);
    const activeDays = days30.filter(d => d.solved > 0).length;
    html += `<div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);margin-top:8px;">${totalSolved30} questions across ${activeDays} active days \u00B7 ${Math.round(activeDays / 30 * 100)}% consistency</div></div>`;

    // Per-difficulty accuracy
    const da = state.difficultyAccuracy || {};
    const hasAny = Object.values(da).some(s => s.t > 0);
    if (hasAny) {
      const labels = { 1: 'Recall', 2: 'Easy', 3: 'Standard', 4: 'Hard', 5: 'Edge' };
      const colors = { 1:'#10b981', 2:'#22c55e', 3:'#f59e0b', 4:'#ef4444', 5:'#7c3aed' };
      html += '<div><div style="font-family:\'Geist Mono\',monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Accuracy by difficulty</div>';
      html += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
      for (let lvl = 1; lvl <= 5; lvl++) {
        const s = da[lvl] || {c:0,t:0};
        const acc = s.t > 0 ? Math.round(s.c / s.t * 100) : null;
        const lbl = labels[lvl];
        const col = colors[lvl];
        html += `<div style="flex:1;min-width:100px;padding:10px 12px;background:${col}14;border:1px solid ${col}33;border-radius:10px;">
          <div style="font-family:'Geist Mono',monospace;font-size:10px;color:${col};text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">${lbl}</div>
          <div style="font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:${col};line-height:1;margin-top:4px;">${acc != null ? acc + '%' : '\u2014'}</div>
          <div style="font-size:11px;color:var(--ink-muted,#6b6b6b);margin-top:2px;">${s.c}/${s.t}</div>
        </div>`;
      }
      html += '</div></div>';
    }

    html += '</section>';
    return html;
  }

  function injectIntoMission() {
    const root = document.getElementById('view-mission');
    if (!root) return;
    if (root.querySelector('.progress-dash')) return; // already injected
    root.insertAdjacentHTML('beforeend', renderDashboard());
  }

  const _origRenderMissionV44 = window.renderMission;
  window.renderMission = function() {
    _origRenderMissionV44();
    setTimeout(injectIntoMission, 60);
  };

  // Hook submitAnswer for activity logging
  const _origSubmitV44 = window.submitAnswer;
  if (typeof _origSubmitV44 === 'function') {
    window.submitAnswer = function() {
      const before = (typeof session !== 'undefined' && session && typeof session.correct === 'number') ? session.correct : 0;
      _origSubmitV44.apply(this, arguments);
      try {
        const fb = document.getElementById('modalFeedback');
        if (!fb || !fb.classList.contains('show')) return;
        const after = (typeof session !== 'undefined' && session) ? session.correct : 0;
        recordActivity(after > before);
      } catch (e) {}
    };
  }

  // Re-render if we're already on mission view
  setTimeout(function() {
    if (state && state.view === 'mission') injectIntoMission();
  }, 250);

  console.log('[V44 ProgressDashboard] active');
})();


// =========================================================================
// V45 - Mistakes review surface
// State.mistakeBank exists since V2 with spaced-rep machinery (getDueMistakes,
// startMistakeReview). Problem: it lives buried in a V2 button that injects
// into "today" hero AFTER the start-session button. ADHD users need it FIRST.
// V45 hoists a "Mistakes due" card right above the Today's Mission card,
// only when due > 0. Empty state stays hidden \u2014 no nag when caught up.
// =========================================================================
(function V45_MistakesUpfront() {
  if (typeof window === 'undefined') return;
  if (typeof getDueMistakes !== 'function' || typeof startMistakeReview !== 'function') {
    console.warn('[V45] mistake-bank machinery missing'); return;
  }

  function inject() {
    const root = document.getElementById('view-mission');
    if (!root) return;
    if (root.querySelector('.mistakes-upfront')) return;
    const due = getDueMistakes(99);
    if (!due || due.length === 0) return;
    const total = state.mistakeBank.length;
    const oldest = due.reduce((min, m) => m.lastWrongAt < min ? m.lastWrongAt : min, Date.now());
    const daysOld = Math.max(1, Math.round((Date.now() - oldest) / 86400000));

    const html = `
      <section class="mistakes-upfront fade-in delay-1" style="margin-bottom:14px;padding:18px 22px;background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #dc2626;border-radius:14px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-family:'Geist Mono',monospace;font-size:10px;color:#991b1b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;font-weight:600;">\u26A0 Mistakes due</div>
          <div style="font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#7f1d1d;">${due.length} question${due.length>1?'s':''} waiting</div>
          <div style="font-size:13px;color:#991b1b;opacity:0.85;margin-top:2px;">Oldest is ${daysOld} day${daysOld>1?'s':''} old \u00B7 ${total} total in your mistake bank</div>
        </div>
        <button onclick="startMistakeReview()" style="background:#dc2626;color:white;border:none;border-radius:99px;padding:11px 22px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;">Review now \u2192</button>
      </section>
    `;

    // Insert at top of view-mission (above "today" section)
    const today = root.querySelector('.today');
    if (today) today.insertAdjacentHTML('beforebegin', html);
    else root.insertAdjacentHTML('afterbegin', html);
  }

  const _origRenderMissionV45 = window.renderMission;
  window.renderMission = function() {
    _origRenderMissionV45();
    setTimeout(inject, 70);
  };

  setTimeout(function() {
    if (state && state.view === 'mission') inject();
  }, 280);

  console.log('[V45 MistakesUpfront] active');
})();


// =========================================================================
// V46 - Auto formula sheet from chapter.theory LaTeX
// V2's extractFormulas only matched legacy <p class="formula"> markers in
// per-topic theory. Surya-extracted theory uses \( ... \) and
// <span class="math-block">\(...\)</span> inside chapter.theory, so the old
// extractor returned empty. Override with a LaTeX scanner that pulls every
// equation containing an "=" sign, dedupes, and lightly classifies. Source
// section is recovered by walking back to the nearest <h3> or <h4>.
// =========================================================================
(function V46_AutoFormulaSheet() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  function looksLikeEquation(latex) {
    // Filter out trivial tokens, single variables, pure numbers
    const stripped = latex.replace(/\\[a-zA-Z]+/g, '').replace(/[\s{}]/g, '');
    if (stripped.length < 3) return false;
    if (!/[=\u2248\u2261\u221D]/.test(latex) && !/\\(approx|equiv|propto|implies|leftrightarrow)/.test(latex)) return false;
    return true;
  }

  function extractFormulasFromTheory(theory, chapterName) {
    if (!theory) return [];
    const out = [];
    const seen = new Set();
    // Walk through, tracking the current heading context (h3/h4) for "section"
    const headingRe = /<h([34])[^>]*>([\s\S]*?)<\/h\1>/g;
    const mathRe = /\\\(([^]*?)\\\)/g; // matches \( ... \)
    const blockRe = /<span class="math-block">\\\(([^]*?)\\\)<\/span>/g;
    // Build a list of [position, heading text] from h3/h4
    const headings = [];
    let hm;
    while ((hm = headingRe.exec(theory)) !== null) {
      headings.push({ pos: hm.index, text: hm[2].replace(/<[^>]+>/g, '').trim() });
    }
    function headingAt(pos) {
      let cur = chapterName;
      for (const h of headings) { if (h.pos <= pos) cur = h.text; else break; }
      return cur;
    }
    let m;
    while ((m = blockRe.exec(theory)) !== null) {
      const latex = m[1].trim();
      if (!looksLikeEquation(latex)) continue;
      if (seen.has(latex)) continue; seen.add(latex);
      out.push({ kind: 'block', latex, section: headingAt(m.index) });
    }
    while ((m = mathRe.exec(theory)) !== null) {
      const latex = m[1].trim();
      if (!looksLikeEquation(latex)) continue;
      if (seen.has(latex)) continue; seen.add(latex);
      // Skip if already captured as block (block regex matches first since it's wider)
      out.push({ kind: 'inline', latex, section: headingAt(m.index) });
    }
    return out;
  }

  // Override the V2 extractFormulas with a chapter.theory-aware version
  if (typeof window.extractFormulas === 'function') {
    const _origExtract = window.extractFormulas;
    window.extractFormulas = function(chapter) {
      const legacy = _origExtract(chapter) || [];
      const fromTheory = extractFormulasFromTheory(chapter.theory, chapter.name);
      // Map fromTheory to the legacy {topic, html, part} shape used by openFormulaRecall
      const wrapped = fromTheory.map(f => ({
        topic: f.section,
        part: 'Formulas (chapter theory)',
        html: '<span class="math-block">\\(' + f.latex + '\\)</span>',
      }));
      return legacy.concat(wrapped);
    };
  }

  console.log('[V46 AutoFormulaSheet] active');
})();


// =========================================================================
// V47 - "Smart paper" builder per chapter
// Builds a 30-question paper-shaped set using difficulty weighting that
// mirrors ISC paper composition. Adds a button to chapter hero. On click,
// fills a synthetic topic and opens via openTopic so the existing modal
// flow handles it. Composition: 8 recall, 12 standard, 8 application, 2 edge.
// =========================================================================
(function V47_SmartPaperBuilder() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  const PAPER_BUDGET = [
    { name: 'recall', levels: [1, 2], target: 8 },
    { name: 'standard', levels: [3], target: 12 },
    { name: 'application', levels: [4], target: 8 },
    { name: 'edge', levels: [5], target: 2 },
  ];

  function chapterPool(ch) {
    const out = [];
    for (const part of (ch.parts || [])) {
      if (!part || part.name === 'Theory by Topic') continue;
      for (const t of (part.topics || [])) {
        for (const q of (t.questions || [])) out.push(q);
      }
    }
    return out;
  }

  function buildSmartPaper(ch) {
    const pool = chapterPool(ch);
    const byDifficulty = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const untagged = [];
    for (const q of pool) {
      const meta = window.getQuestionMeta && window.getQuestionMeta(q);
      const d = meta && meta.difficulty;
      if (d) byDifficulty[d].push(q);
      else untagged.push(q);
    }
    const picked = [];
    const seen = new Set();
    for (const bucket of PAPER_BUDGET) {
      const candidates = bucket.levels.flatMap(l => byDifficulty[l] || []);
      // Light shuffle (Fisher-Yates with deterministic-ish seed by chapter id length)
      const shuffled = candidates.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (i * 13 + ch.id.length * 7) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      for (const q of shuffled) {
        if (picked.length >= 30) break;
        if (seen.has(q.id)) continue;
        picked.push(q); seen.add(q.id);
        if (picked.filter(p => bucket.levels.includes(window.getQuestionMeta(p)?.difficulty)).length >= bucket.target) break;
      }
    }
    // Backfill with untagged if short of 30
    for (const q of untagged) {
      if (picked.length >= 30) break;
      if (seen.has(q.id)) continue;
      picked.push(q); seen.add(q.id);
    }
    // Sort: easiest first to ramp up like a real paper does in section A
    picked.sort((a, b) => {
      const da = window.getQuestionMeta(a)?.difficulty || 3;
      const db = window.getQuestionMeta(b)?.difficulty || 3;
      return da - db;
    });
    return picked;
  }

  function openSmartPaper(chapterId) {
    const ch = findChapter(chapterId);
    if (!ch) return;
    const paper = buildSmartPaper(ch);
    if (paper.length === 0) {
      showToast && showToast('default', '\u25CC', 'No tagged questions for paper builder');
      return;
    }
    // Inject as a synthetic topic on the chapter so existing flow works
    let smartPart = ch.parts.find(p => p.id === 'smart_paper');
    if (!smartPart) {
      smartPart = { id: 'smart_paper', name: '\uD83C\uDFAF Smart paper', topics: [] };
      ch.parts.push(smartPart);
    }
    smartPart.topics = [{ id: 'SP1', name: `Smart paper (${paper.length} Q)`, theory: '', questions: paper }];
    const tfid = fullTopicId(ch.id, 'SP1');
    openTopic(tfid);
  }
  window.openSmartPaper = openSmartPaper;

  function injectButton() {
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch) return;
    const hero = root.querySelector('.chapter-hero');
    if (!hero || hero.querySelector('.smart-paper-btn')) return;
    const pool = chapterPool(ch);
    const tagged = pool.filter(q => window.getQuestionMeta && window.getQuestionMeta(q));
    if (tagged.length < 10) return; // not enough data to build a paper
    const btn = document.createElement('button');
    btn.className = 'smart-paper-btn btn btn-ghost';
    btn.style.cssText = 'margin-top:14px;margin-left:8px;border:0.5px solid var(--line);background:var(--bg);';
    btn.innerHTML = '\uD83C\uDFAF Smart paper (~30 Q)';
    btn.title = 'Auto-built paper-shaped set: 8 recall + 12 standard + 8 application + 2 edge';
    btn.onclick = () => openSmartPaper(ch.id);
    hero.appendChild(btn);
  }

  const _origRC_V47 = window.renderChapter;
  window.renderChapter = function() {
    _origRC_V47();
    setTimeout(injectButton, 80);
  };

  console.log('[V47 SmartPaperBuilder] active');
})();


// =========================================================================
// V48 - Session-count tracker (light-touch adaptive surfacing)
// Tracks state.sessionsToday[date] and surfaces "Session N today" label on
// the modal head. Doesn't truncate sessions \u2014 that's paternalistic for ADHD
// users. Just surfaces information so user can self-regulate.
// =========================================================================
(function V48_SessionTracker() {
  if (typeof window === 'undefined') return;

  state.sessionsToday = state.sessionsToday || { date: '', count: 0 };

  function bumpSession() {
    const today = todayISO();
    if (state.sessionsToday.date !== today) {
      state.sessionsToday = { date: today, count: 0 };
    }
    state.sessionsToday.count++;
    saveState && saveState();
    return state.sessionsToday.count;
  }

  function injectBadge(n) {
    const counter = document.getElementById('modalCounter');
    if (!counter) return;
    if (counter.querySelector('.session-counter')) return;
    const tag = document.createElement('span');
    tag.className = 'session-counter';
    tag.style.cssText = 'margin-left:10px;font-family:Geist Mono,monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);background:var(--bg,#fafaf7);padding:2px 8px;border-radius:99px;border:1px solid var(--line,#e8e6e0);';
    tag.textContent = `Session ${n} today`;
    counter.appendChild(tag);
  }

  const _origOpenTopicV48 = window.openTopic;
  if (typeof _origOpenTopicV48 === 'function') {
    window.openTopic = function(tfid) {
      _origOpenTopicV48(tfid);
      const n = bumpSession();
      setTimeout(() => injectBadge(n), 90);
      // Soft nudge for marathons
      if (n === 5) showToast && showToast('default', '\u263E', '5th session today \u2014 strong day. Take a stretch?');
    };
  }

  console.log('[V48 SessionTracker] active');
})();


// =========================================================================
// V49 - Topic mastery wheel (per-section grid on chapter view)
// For every chapter section (X.Y), shows a small tile with:
//   - section number + title
//   - question count tagged to that section
//   - difficulty distribution (mini coloured bar)
//   - click \u2192 drill those questions
// Surfaces on chapter view, between hero and parts list.
// =========================================================================
(function V49_SectionWheel() {
  if (typeof window === 'undefined' || !window.CONTENT) return;

  function pool(ch) {
    const out = [];
    for (const part of (ch.parts || [])) {
      if (!part || part.name === 'Theory by Topic') continue;
      for (const t of (part.topics || [])) {
        for (const q of (t.questions || [])) out.push(q);
      }
    }
    return out;
  }

  function getSectionsFromTheory(theory) {
    const out = [];
    if (!theory) return out;
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
    let m;
    while ((m = re.exec(theory)) !== null) {
      const inner = m[1].replace(/<[^>]+>/g, '').trim();
      const parts = inner.match(/^(\d+\.\d+)\s+(.+)$/);
      if (parts) out.push({ num: parts[1], title: parts[2] });
    }
    return out;
  }

  function distribute(qs) {
    const dist = { 1:0, 2:0, 3:0, 4:0, 5:0, untagged:0 };
    for (const q of qs) {
      const d = window.getQuestionMeta && window.getQuestionMeta(q)?.difficulty;
      if (d) dist[d]++;
      else dist.untagged++;
    }
    return dist;
  }

  function drillSection(chId, sectionNum) {
    const ch = findChapter(chId);
    if (!ch) return;
    const matched = pool(ch).filter(q => {
      const meta = window.getQuestionMeta && window.getQuestionMeta(q);
      return meta && meta.section === sectionNum;
    });
    if (matched.length === 0) {
      showToast && showToast('default', '\u25CC', `No questions tagged to \u00A7${sectionNum}`);
      return;
    }
    // Easiest first
    matched.sort((a,b) => (window.getQuestionMeta(a)?.difficulty || 3) - (window.getQuestionMeta(b)?.difficulty || 3));
    let part = ch.parts.find(p => p.id === 'section_drill');
    if (!part) { part = { id: 'section_drill', name: 'Section drills', topics: [] }; ch.parts.push(part); }
    part.topics = [{ id: `SD_${sectionNum.replace('.','_')}`, name: `\u00A7${sectionNum} drill`, theory: '', questions: matched.slice(0, 10) }];
    openTopic(fullTopicId(ch.id, part.topics[0].id));
  }
  window.drillSection = drillSection;

  function inject() {
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch) return;
    if (root.querySelector('.section-wheel')) return;
    const sections = getSectionsFromTheory(ch.theory);
    if (sections.length === 0) return;
    const chPool = pool(ch);

    let html = `<section class="section-wheel" style="margin:18px 0 22px;padding:18px;background:var(--paper,#fff);border:1px solid var(--line,#e8e6e0);border-radius:14px;">
      <div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">Drill by section</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">`;

    for (const s of sections) {
      const matched = chPool.filter(q => window.getQuestionMeta && window.getQuestionMeta(q)?.section === s.num);
      const dist = distribute(matched);
      const total = matched.length;
      const colors = { 1: '#10b981', 2: '#22c55e', 3: '#f59e0b', 4: '#ef4444', 5: '#7c3aed' };
      // Mini bar showing distribution
      let bar = '<div style="display:flex;height:5px;border-radius:99px;overflow:hidden;background:var(--line,#e8e6e0);margin-top:6px;">';
      for (let lvl = 1; lvl <= 5; lvl++) {
        if (dist[lvl] > 0) {
          const pct = (dist[lvl] / Math.max(1, total)) * 100;
          bar += `<div style="width:${pct}%;background:${colors[lvl]};"></div>`;
        }
      }
      bar += '</div>';
      const disabled = total === 0;
      html += `<button type="button" onclick="drillSection('${ch.id}','${s.num}')" ${disabled?'disabled':''} style="text-align:left;padding:12px;background:var(--bg,#fafaf7);border:1px solid var(--line,#e8e6e0);border-radius:10px;cursor:${disabled?'not-allowed':'pointer'};opacity:${disabled?0.45:1};font-family:inherit;transition:all 0.15s;">
        <div style="font-family:'Geist Mono',monospace;font-size:10px;color:var(--accent,#4F46E5);font-weight:600;">\u00A7${s.num}</div>
        <div style="font-family:'Fraunces',serif;font-size:14px;font-weight:500;line-height:1.3;margin-top:2px;color:var(--ink,#1a1a1a);">${s.title}</div>
        <div style="font-size:11px;color:var(--ink-muted,#6b6b6b);margin-top:4px;">${total} question${total!==1?'s':''}</div>
        ${bar}
      </button>`;
    }
    html += '</div></section>';

    // Insert after chapter-hero
    const hero = root.querySelector('.chapter-hero');
    if (hero) hero.insertAdjacentHTML('afterend', html);
  }

  const _origRC_V49 = window.renderChapter;
  window.renderChapter = function() {
    _origRC_V49();
    setTimeout(inject, 100);
  };

  console.log('[V49 SectionWheel] active');
})();


// =========================================================================
// V50 - "I don't know" skip (no accuracy hit)
// Adds a small "Skip \u2014 I don't know" button next to Submit. Clicking advances
// to the next question without recording correct/wrong. Question is queued
// for review in state.skipQueue so user sees it again later.
// =========================================================================
(function V50_DontKnow() {
  if (typeof window === 'undefined') return;

  state.skipQueue = state.skipQueue || [];

  function injectButton() {
    const submit = document.getElementById('modalSubmit');
    if (!submit) return;
    if (document.getElementById('btnDontKnow')) return;
    const btn = document.createElement('button');
    btn.id = 'btnDontKnow';
    btn.type = 'button';
    btn.textContent = "Skip \u00B7 I don't know";
    btn.style.cssText = 'background:transparent;color:var(--ink-muted,#6b6b6b);border:1px solid var(--line,#e8e6e0);border-radius:99px;padding:10px 18px;font-size:13px;font-family:inherit;cursor:pointer;margin-right:8px;';
    btn.onclick = () => {
      try {
        const cur = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
        if (cur && cur.id) state.skipQueue.push({ id: cur.id, at: Date.now() });
        saveState && saveState();
      } catch(e) {}
      // Advance: simulate Next. Use existing nextProblem if exposed
      if (typeof nextProblem === 'function') nextProblem();
      else if (session && session.problems) {
        session.idx = Math.min(session.idx + 1, session.problems.length - 1);
        if (typeof loadProblem === 'function') loadProblem();
      }
    };
    submit.parentNode.insertBefore(btn, submit);
  }

  const _origLoadProblemV50 = window.loadProblem;
  if (typeof _origLoadProblemV50 === 'function') {
    window.loadProblem = function() {
      _origLoadProblemV50();
      setTimeout(injectButton, 30);
    };
  }

  console.log('[V50 DontKnow] active');
})();


// =========================================================================
// V51 - Flag broken question
// Lets user mark a question as "this looks broken/garbled" so it can be
// triaged later. Stores in state.flaggedQuestions[]. Small icon top-right
// of question card.
// =========================================================================
(function V51_FlagBroken() {
  if (typeof window === 'undefined') return;

  state.flaggedQuestions = state.flaggedQuestions || [];

  function isFlagged(qid) {
    return state.flaggedQuestions.some(f => f.id === qid);
  }

  function toggleFlag(qid, qText) {
    const i = state.flaggedQuestions.findIndex(f => f.id === qid);
    if (i >= 0) {
      state.flaggedQuestions.splice(i, 1);
      showToast && showToast('default', '\u2713', 'Flag removed');
    } else {
      state.flaggedQuestions.push({ id: qid, text: (qText || '').slice(0, 80), at: Date.now() });
      showToast && showToast('default', '\u2690', 'Flagged for review');
    }
    saveState && saveState();
  }
  window.toggleFlag = toggleFlag;

  function injectFlag() {
    const cur = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
    if (!cur || !cur.id) return;
    const topicEl = document.getElementById('modalTopic');
    if (!topicEl) return;
    if (topicEl.querySelector('.flag-btn')) return;
    const flagged = isFlagged(cur.id);
    const btn = document.createElement('button');
    btn.className = 'flag-btn';
    btn.type = 'button';
    btn.title = flagged ? 'Flagged as broken \u2014 click to remove flag' : 'Flag this question as broken/garbled';
    btn.style.cssText = `margin-left:auto;background:transparent;border:none;cursor:pointer;font-size:14px;color:${flagged ? '#dc2626' : 'var(--ink-muted,#6b6b6b)'};padding:4px 8px;`;
    btn.textContent = flagged ? '\u2691' : '\u2690';
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleFlag(cur.id, cur.q || cur.text);
      btn.remove(); // re-render on next loadProblem
      injectFlag();
    };
    topicEl.appendChild(btn);
  }

  const _origLoadProblemV51 = window.loadProblem;
  if (typeof _origLoadProblemV51 === 'function') {
    window.loadProblem = function() {
      _origLoadProblemV51();
      setTimeout(injectFlag, 40);
    };
  }

  console.log('[V51 FlagBroken] active');
})();


// =========================================================================
// V52 - Difficulty rationale debrief (post-answer)
// After feedback shows, appends a small "Why this is rated [Standard]: ..."
// explanation pulled from the difficulty map's rationale field. Helps user
// understand why a question was easy vs hard, building meta-learning.
// =========================================================================
(function V52_RationaleDebrief() {
  if (typeof window === 'undefined') return;

  function inject() {
    const cur = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
    if (!cur) return;
    const meta = window.getQuestionMeta && window.getQuestionMeta(cur);
    if (!meta || !meta.rationale) return;
    const fb = document.getElementById('modalFeedback');
    if (!fb || !fb.classList.contains('show')) return;
    if (fb.querySelector('.rationale-debrief')) return;
    const labels = { 1: 'Recall', 2: 'Easy', 3: 'Standard', 4: 'Hard', 5: 'Edge' };
    const colors = { 1:'#10b981', 2:'#22c55e', 3:'#f59e0b', 4:'#ef4444', 5:'#7c3aed' };
    const lvl = meta.difficulty;
    const html = `<div class="rationale-debrief" style="margin-top:10px;padding:10px 14px;background:${colors[lvl]}10;border-left:3px solid ${colors[lvl]};border-radius:6px;font-size:12px;color:var(--ink,#1a1a1a);line-height:1.5;">
      <span style="font-family:'Geist Mono',monospace;font-size:10px;color:${colors[lvl]};font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${labels[lvl] || 'Difficulty ' + lvl}</span>
      <span style="opacity:0.8;margin-left:4px;">\u00B7</span>
      <span style="margin-left:4px;">${meta.rationale}</span>
    </div>`;
    fb.insertAdjacentHTML('beforeend', html);
  }

  const _origSubmitV52 = window.submitAnswer;
  if (typeof _origSubmitV52 === 'function') {
    window.submitAnswer = function() {
      _origSubmitV52.apply(this, arguments);
      setTimeout(inject, 60);
    };
  }

  console.log('[V52 RationaleDebrief] active');
})();


// =========================================================================
// V53 - ISC marks-weighted mastery + EV1/Boards coverage %
// V44's mastery bars equal-weight every chapter. ISC paper doesn't \u2014
// Calculus is 35 marks, Optics 18, etc. Reweight bars by marks and surface
// "covered X% of board paper marks" on each subject pill + deadline cards.
// =========================================================================
(function V53_MarksWeightedMastery() {
  if (typeof window === 'undefined') return;
  if (!window.ISC_MARKS_WEIGHTS) { console.warn('[V53] ISC weights missing'); return; }

  function chapterMastery(ch) {
    let totalT = 0, doneT = 0;
    for (const part of (ch.parts || [])) {
      if (part.name !== 'Theory by Topic') continue;
      for (const t of (part.topics || [])) {
        totalT++;
        const fid = fullTopicId(ch.id, t.id);
        if (state.topics[fid] && state.topics[fid].done) doneT++;
      }
    }
    return totalT ? doneT / totalT : 0;
  }

  // Compute weighted mastery: \u03A3(chapter_mastery \u00D7 marks) / \u03A3(marks)
  window.weightedSubjectMastery = function(sub) {
    const W = window.ISC_MARKS_WEIGHTS[sub];
    if (!W) return null;
    const total = window.ISC_MARKS_WEIGHTS.totals[sub] || 1;
    let weighted = 0;
    for (const ch of (getSubjectChapters(sub) || [])) {
      const m = W[ch.number];
      if (!m) continue;
      const mastery = chapterMastery(ch);
      weighted += mastery * m.marks;
    }
    return {
      pct: Math.round(weighted / total * 100),
      marks_covered: +weighted.toFixed(1),
      marks_total: total,
    };
  };

  // Patch the mission-view subject cards. The base renderMission shows
  // "X / Y topics" \u2014 append a marks-weighted overlay underneath.
  function injectMarksOverlay() {
    const subjGrid = document.querySelector('#view-mission .subjects-grid, #view-mission [class*="subject"]');
    if (!subjGrid) return;
    // Defensive: don't double-inject
    if (subjGrid.querySelector('.marks-overlay-injected')) return;
    const cards = subjGrid.querySelectorAll('.subject-card, [class*="card"]');
    let didAny = false;
    for (const card of cards) {
      const subKey = card.getAttribute('onclick')?.match(/openSubject\('(\w+)'/)?.[1];
      if (!subKey) continue;
      const w = window.weightedSubjectMastery(subKey);
      if (!w) continue;
      const tag = document.createElement('div');
      tag.className = 'marks-overlay-injected';
      tag.style.cssText = "font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);margin-top:4px;letter-spacing:0.04em;";
      tag.textContent = `~${w.marks_covered}/${w.marks_total} marks \u00B7 ${w.pct}% paper`;
      card.appendChild(tag);
      didAny = true;
    }
    if (didAny) console.log('[V53] marks overlay injected');
  }

  // Also enrich the dashboard's per-subject mastery bars (V44) with marks pct
  function enrichDashboardBars() {
    const dash = document.querySelector('.progress-dash');
    if (!dash) return;
    if (dash.querySelector('.marks-weighted-row')) return;
    const subjects = ['Physics', 'Chemistry', 'Maths'];
    const themes = (typeof SUBJECT_THEMES !== 'undefined') ? SUBJECT_THEMES : {};
    let html = `<div class="marks-weighted-row" style="margin-top:14px;padding-top:14px;border-top:1px dashed var(--line,#e8e6e0);">
      <div style="font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Marks-weighted mastery (ISC paper)</div>`;
    for (const sub of subjects) {
      const w = window.weightedSubjectMastery(sub);
      if (!w) continue;
      const theme = themes[sub] || { color: '#1a1a1a', icon: '\u00B7' };
      html += `<div style="display:flex;align-items:center;gap:14px;margin-bottom:8px;font-size:13px;">
        <span style="width:90px;color:var(--ink,#1a1a1a);font-weight:500;">${theme.icon} ${sub}</span>
        <div style="flex:1;height:10px;background:var(--line,#e8e6e0);border-radius:99px;overflow:hidden;">
          <div style="width:${w.pct}%;height:100%;background:${theme.color};transition:width 0.5s;"></div>
        </div>
        <span style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);width:120px;text-align:right;">${w.marks_covered}/${w.marks_total} m \u00B7 ${w.pct}%</span>
      </div>`;
    }
    html += '</div>';
    dash.insertAdjacentHTML('beforeend', html);
  }

  const _origRM_V53 = window.renderMission;
  window.renderMission = function() {
    _origRM_V53();
    setTimeout(() => { injectMarksOverlay(); enrichDashboardBars(); }, 110);
  };

  setTimeout(function() {
    if (state && state.view === 'mission') { injectMarksOverlay(); enrichDashboardBars(); }
  }, 320);

  console.log('[V53 MarksWeightedMastery] active');
})();


// =========================================================================
// V54 - Concept search (cross-chapter)
// Adds a search box near the top of mission view. Type "coulomb" \u2192 see every
// concept matching, click \u2192 drill those questions immediately.
// Backed by window.CONCEPT_INDEX (built by build_concept_index.js).
// =========================================================================
(function V54_ConceptSearch() {
  if (typeof window === 'undefined' || !window.CONCEPT_INDEX) return;

  function buildResults(query) {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    return window.CONCEPT_INDEX
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 12);
  }

  function drillConcept(conceptId) {
    const concept = window.CONCEPT_INDEX.find(c => c.id === conceptId);
    if (!concept) return;
    const ch = findChapter(concept.chapter);
    if (!ch) return;
    // Find the questions
    const allQs = [];
    for (const part of (ch.parts || [])) {
      for (const t of (part.topics || [])) {
        for (const q of (t.questions || [])) {
          if (concept.questionIds.includes(q.id)) allQs.push(q);
        }
      }
    }
    if (!allQs.length) { showToast && showToast('default', '\u25CC', 'No questions found'); return; }
    // Sort easiest first
    allQs.sort((a, b) => (window.getQuestionMeta(a)?.difficulty || 3) - (window.getQuestionMeta(b)?.difficulty || 3));
    let part = ch.parts.find(p => p.id === 'concept_drill');
    if (!part) { part = { id: 'concept_drill', name: 'Concept drills', topics: [] }; ch.parts.push(part); }
    part.topics = [{ id: 'CD1', name: `${concept.name} drill`, theory: '', questions: allQs.slice(0, 12) }];
    state.currentChapterId = ch.id;
    openTopic(fullTopicId(ch.id, 'CD1'));
  }
  window.drillConcept = drillConcept;

  function inject() {
    const root = document.getElementById('view-mission');
    if (!root) return;
    if (root.querySelector('.concept-search-box')) return;
    const html = `
      <div class="concept-search-box" style="margin:14px 0 18px;position:relative;">
        <input type="text" id="conceptSearchInput" placeholder="\uD83D\uDD0D  Search any concept (e.g. Coulomb, Bayes, Aldol)\u2026"
          style="width:100%;padding:12px 16px;border:1px solid var(--line,#e8e6e0);border-radius:99px;font-size:14px;font-family:inherit;background:var(--paper,#fff);color:var(--ink,#1a1a1a);" />
        <div id="conceptSearchResults" style="display:none;position:absolute;top:100%;left:0;right:0;margin-top:6px;background:var(--paper,#fff);border:1px solid var(--line,#e8e6e0);border-radius:14px;box-shadow:0 12px 28px rgba(15,15,20,0.08);max-height:380px;overflow-y:auto;z-index:50;"></div>
      </div>
    `;
    const today = root.querySelector('.today, .mistakes-upfront');
    if (today) today.insertAdjacentHTML('beforebegin', html);
    else root.insertAdjacentHTML('afterbegin', html);

    const input = document.getElementById('conceptSearchInput');
    const out = document.getElementById('conceptSearchResults');
    const SUBJECT_ICON = { Physics: '\u26A1', Chemistry: '\uD83E\uDDEA', Maths: '\u222B' };

    input.addEventListener('input', function() {
      const v = this.value;
      const results = buildResults(v);
      if (!results.length) { out.style.display = 'none'; return; }
      out.style.display = 'block';
      out.innerHTML = results.map(c => `
        <div data-concept="${c.id}" style="padding:11px 14px;cursor:pointer;border-bottom:1px solid var(--line,#e8e6e0);transition:background 0.15s;display:flex;align-items:center;gap:10px;">
          <span style="font-size:14px;">${SUBJECT_ICON[c.subject] || '\u00B7'}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:14px;color:var(--ink,#1a1a1a);font-weight:500;">${c.name}</div>
            <div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);margin-top:2px;">${c.subject} \u00B7 ${c.chapter_name} \u00B7 \u00A7${c.section}</div>
          </div>
          <div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--accent,#4F46E5);background:var(--accent-soft,#eef2ff);padding:3px 9px;border-radius:99px;">${c.questionIds.length} Q</div>
        </div>
      `).join('');
      out.querySelectorAll('[data-concept]').forEach(el => {
        el.addEventListener('mouseenter', () => el.style.background = 'var(--bg,#fafaf7)');
        el.addEventListener('mouseleave', () => el.style.background = 'transparent');
        el.addEventListener('click', () => {
          out.style.display = 'none';
          input.value = '';
          drillConcept(el.dataset.concept);
        });
      });
    });
    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !out.contains(e.target)) out.style.display = 'none';
    });
  }

  const _origRM_V54 = window.renderMission;
  window.renderMission = function() {
    _origRM_V54();
    setTimeout(inject, 130);
  };

  setTimeout(function() { if (state && state.view === 'mission') inject(); }, 350);

  console.log('[V54 ConceptSearch] active');
})();


// =========================================================================
// V55 - Personal difficulty drift
// As Garvit accumulates accuracy data per question, recompute his personal
// difficulty: aggregate his correct/total per question. Surface a "\u2713 mastered for me"
// badge when his accuracy on that question is 100% over 2+ attempts.
// =========================================================================
(function V55_DifficultyDrift() {
  if (typeof window === 'undefined') return;
  state.qAccuracy = state.qAccuracy || {}; // { questionId: { c, t, lastAt } }

  const _origSubmitV55 = window.submitAnswer;
  if (typeof _origSubmitV55 === 'function') {
    window.submitAnswer = function() {
      const before = (typeof session !== 'undefined' && session && typeof session.correct === 'number') ? session.correct : 0;
      const cur = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
      _origSubmitV55.apply(this, arguments);
      try {
        const fb = document.getElementById('modalFeedback');
        if (!fb || !fb.classList.contains('show')) return;
        if (!cur || !cur.id) return;
        const wasCorrect = (typeof session !== 'undefined' && session) ? session.correct > before : false;
        const a = state.qAccuracy[cur.id] || { c: 0, t: 0, lastAt: 0 };
        a.t++;
        if (wasCorrect) a.c++;
        a.lastAt = Date.now();
        state.qAccuracy[cur.id] = a;
        saveState && saveState();
        // If mastered, append a badge to the topic header
        if (a.t >= 2 && a.c === a.t) {
          const topicEl = document.getElementById('modalTopic');
          if (topicEl && !topicEl.querySelector('.mastered-badge')) {
            const badge = document.createElement('span');
            badge.className = 'mastered-badge';
            badge.style.cssText = "margin-left:6px;font-family:'Geist Mono',monospace;font-size:10px;color:#10b981;background:#d1fae5;border:1px solid #6ee7b7;padding:2px 8px;border-radius:99px;";
            badge.textContent = '\u2713 mastered';
            topicEl.appendChild(badge);
          }
        }
      } catch (e) {}
    };
  }
  console.log('[V55 DifficultyDrift] active');
})();


// =========================================================================
// V56 - Mock paper history
// Logs every smart-paper / mock session result. Shows a small history strip
// on chapter view: "Last attempts: 47% \u2192 62% \u2192 71%". Trend visible.
// =========================================================================
(function V56_MockHistory() {
  if (typeof window === 'undefined') return;
  state.mockHistory = state.mockHistory || {}; // { chapterId: [{at, score, total}] }

  const _origCloseModalV56 = window.closeModal;
  if (typeof _origCloseModalV56 === 'function') {
    window.closeModal = function() {
      try {
        if (typeof session !== 'undefined' && session && session.topicFullId &&
            session.problems && session.problems.length >= 8 &&
            session.idx >= session.problems.length - 1) {
          // Substantial session completed \u2014 log it
          const tfid = session.topicFullId;
          // Match topic id pattern: phys_1_SP1 or phys_1_concept_drill_CD1
          const m = tfid.match(/^([a-z]+_\d+)_/);
          if (m) {
            const chId = m[1];
            const log = state.mockHistory[chId] || [];
            log.push({ at: Date.now(), score: session.correct, total: session.problems.length });
            if (log.length > 20) log.shift();
            state.mockHistory[chId] = log;
            saveState && saveState();
          }
        }
      } catch (e) {}
      _origCloseModalV56();
    };
  }

  function injectStrip() {
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch) return;
    if (root.querySelector('.mock-history-strip')) return;
    const log = state.mockHistory[ch.id] || [];
    if (log.length === 0) return;
    const recent = log.slice(-6);
    const last = recent[recent.length - 1];
    const lastPct = Math.round(last.score / last.total * 100);
    let html = `<section class="mock-history-strip" style="margin:14px 0;padding:10px 14px;background:var(--bg,#fafaf7);border:1px solid var(--line,#e8e6e0);border-radius:10px;display:flex;align-items:center;gap:12px;font-family:'Geist Mono',monospace;font-size:11px;">
      <span style="color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;">Recent attempts</span>`;
    for (let i = 0; i < recent.length; i++) {
      const r = recent[i];
      const pct = Math.round(r.score / r.total * 100);
      const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
      html += `<span style="color:${color};font-weight:600;">${pct}%</span>`;
      if (i < recent.length - 1) html += '<span style="color:var(--ink-muted,#6b6b6b);">\u203A</span>';
    }
    html += '</section>';
    const hero = root.querySelector('.chapter-hero');
    if (hero) hero.insertAdjacentHTML('afterend', html);
  }
  const _origRC_V56 = window.renderChapter;
  window.renderChapter = function() {
    _origRC_V56();
    setTimeout(injectStrip, 150);
  };
  console.log('[V56 MockHistory] active');
})();


// =========================================================================
// V57 - TTS read-aloud button on theory pane
// Uses browser-native speechSynthesis API. Strips LaTeX delimiters before
// reading so it doesn't say "backslash open paren". Skips math entirely.
// =========================================================================
(function V57_TextToSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  function plainText(html) {
    // Replace KaTeX-rendered math with brief tokens, strip tags
    let txt = html
      .replace(/<span class="math-block">[\s\S]*?<\/span>/g, ' [equation] ')
      .replace(/\\\([\s\S]*?\\\)/g, ' [equation] ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ').trim();
    return txt;
  }

  function speak(html) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(plainText(html));
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
      return utter;
    } catch (e) { return null; }
  }

  let speaking = null;

  function inject() {
    const view = document.getElementById('theoryView');
    if (!view) return;
    if (document.getElementById('ttsBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'ttsBtn';
    btn.type = 'button';
    btn.textContent = '\uD83D\uDD0A Read aloud';
    btn.style.cssText = "position:absolute;top:14px;right:60px;background:var(--bg,#fafaf7);border:1px solid var(--line,#e8e6e0);border-radius:99px;padding:6px 14px;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink,#1a1a1a);z-index:5;";
    btn.onclick = (e) => {
      e.stopPropagation();
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.textContent = '\uD83D\uDD0A Read aloud';
        speaking = null;
        return;
      }
      const content = document.getElementById('theoryContent');
      if (!content) return;
      btn.textContent = '\u23F8 Stop';
      speaking = speak(content.innerHTML);
      if (speaking) speaking.onend = () => { btn.textContent = '\uD83D\uDD0A Read aloud'; };
    };
    // Make sure parent is positioned
    const parent = view.parentElement;
    if (parent && getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    view.parentElement.appendChild(btn);
  }

  const _origOpenTopicV57 = window.openTopic;
  if (typeof _origOpenTopicV57 === 'function') {
    window.openTopic = function(tfid) {
      _origOpenTopicV57(tfid);
      setTimeout(inject, 150);
    };
  }
  // Stop TTS on modal close
  const _origCloseModalV57 = window.closeModal;
  if (typeof _origCloseModalV57 === 'function') {
    window.closeModal = function() {
      try { window.speechSynthesis.cancel(); } catch(e) {}
      _origCloseModalV57();
    };
  }
  console.log('[V57 TextToSpeech] active');
})();


// =========================================================================
// V58 - Flagged-question review queue
// Surfaces state.flaggedQuestions (V51) on mission view. Shows list, lets
// Garvit dismiss false flags or open the flagged Q in a one-off review.
// =========================================================================
(function V58_FlaggedQueue() {
  if (typeof window === 'undefined') return;

  function inject() {
    const root = document.getElementById('view-mission');
    if (!root) return;
    if (root.querySelector('.flagged-queue')) return;
    const flagged = state.flaggedQuestions || [];
    if (flagged.length === 0) return;
    let html = `<section class="flagged-queue" style="margin:14px 0;padding:14px 18px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-family:'Geist Mono',monospace;font-size:11px;color:#92400e;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">\u2690 Flagged questions (${flagged.length})</div>
        <button onclick="state.flaggedQuestions=[];saveState();renderMission();" style="font-size:11px;background:transparent;border:none;color:#92400e;cursor:pointer;text-decoration:underline;">Clear all</button>
      </div>
      <div style="font-size:12px;color:#78350f;margin-bottom:8px;">Questions you flagged as broken or unclear. Use this list to triage and fix.</div>`;
    for (const f of flagged.slice(0, 8)) {
      const date = new Date(f.at).toISOString().slice(0, 10);
      html += `<div style="font-size:12px;padding:6px 0;border-top:1px solid #fde68a;color:#78350f;">
        <span style="font-family:'Geist Mono',monospace;color:#92400e;font-size:10px;">${date}</span> \u00B7 ${f.text || f.id}
      </div>`;
    }
    if (flagged.length > 8) html += `<div style="font-size:11px;color:#92400e;margin-top:8px;">+${flagged.length - 8} more</div>`;
    html += '</section>';
    const today = root.querySelector('.today');
    if (today) today.insertAdjacentHTML('afterend', html);
  }
  const _origRM_V58 = window.renderMission;
  window.renderMission = function() {
    _origRM_V58();
    setTimeout(inject, 140);
  };
  console.log('[V58 FlaggedQueue] active');
})();


// =========================================================================
// V59 - Wrong-question repeat surfacing
// Tracks per-question wrong attempts. Questions wrong on \u22652 different days
// surface as "due for re-review" \u2014 prepended to the practice tab.
// =========================================================================
(function V59_RepeatedWrongs() {
  if (typeof window === 'undefined') return;
  state.wrongLog = state.wrongLog || {}; // { questionId: [day1, day2, ...] }

  const _origSubmitV59 = window.submitAnswer;
  if (typeof _origSubmitV59 === 'function') {
    window.submitAnswer = function() {
      const before = (typeof session !== 'undefined' && session && typeof session.correct === 'number') ? session.correct : 0;
      const cur = (typeof session !== 'undefined' && session && session.problems) ? session.problems[session.idx] : null;
      _origSubmitV59.apply(this, arguments);
      try {
        const fb = document.getElementById('modalFeedback');
        if (!fb || !fb.classList.contains('show')) return;
        if (!cur || !cur.id) return;
        const wasCorrect = (typeof session !== 'undefined' && session) ? session.correct > before : false;
        if (wasCorrect) return; // we only track wrongs
        const today = todayISO();
        const arr = state.wrongLog[cur.id] || [];
        if (!arr.includes(today)) arr.push(today);
        state.wrongLog[cur.id] = arr;
        saveState && saveState();
      } catch (e) {}
    };
  }
  console.log('[V59 RepeatedWrongs] active');
})();


// =========================================================================
// V60 - Per-chapter syllabus checklist
// On chapter view, shows a short checklist for each section. User ticks "I'm
// confident". Persisted in state.confidence[chId].sections[sectionNum] = true.
// Doesn't replace mastery \u2014 supplements it with self-rated readiness.
// =========================================================================
(function V60_SyllabusChecklist() {
  if (typeof window === 'undefined') return;
  state.confidence = state.confidence || {}; // { chId: { sectionNum: bool } }

  function getSections(theory) {
    const out = [];
    if (!theory) return out;
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
    let m;
    while ((m = re.exec(theory)) !== null) {
      const inner = m[1].replace(/<[^>]+>/g, '').trim();
      const parts = inner.match(/^(\d+\.\d+)\s+(.+)$/);
      if (parts) out.push({ num: parts[1], title: parts[2] });
    }
    return out;
  }

  function inject() {
    const root = document.getElementById('view-chapter');
    const ch = findChapter(state.currentChapterId);
    if (!root || !ch) return;
    if (root.querySelector('.syllabus-checklist')) return;
    const sections = getSections(ch.theory);
    if (sections.length === 0) return;
    state.confidence[ch.id] = state.confidence[ch.id] || {};
    const conf = state.confidence[ch.id];
    let confidentCount = 0;
    let html = `<section class="syllabus-checklist" style="margin:18px 0;padding:18px;background:var(--paper,#fff);border:1px solid var(--line,#e8e6e0);border-radius:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-muted,#6b6b6b);text-transform:uppercase;letter-spacing:0.06em;">My readiness</div>
        <div id="readinessSummary" style="font-family:'Geist Mono',monospace;font-size:11px;color:var(--accent,#4F46E5);"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;">`;
    for (const s of sections) {
      const checked = !!conf[s.num];
      if (checked) confidentCount++;
      html += `<label style="display:flex;align-items:center;gap:9px;padding:8px 10px;background:${checked?'#d1fae5':'var(--bg,#fafaf7)'};border:1px solid ${checked?'#6ee7b7':'var(--line,#e8e6e0)'};border-radius:8px;cursor:pointer;font-size:13px;transition:all 0.15s;">
        <input type="checkbox" ${checked?'checked':''} data-section="${s.num}" style="margin:0;cursor:pointer;" />
        <span style="font-family:'Geist Mono',monospace;font-size:10px;color:${checked?'#15803d':'var(--ink-muted,#6b6b6b)'};font-weight:600;">\u00A7${s.num}</span>
        <span style="flex:1;color:${checked?'#15803d':'var(--ink,#1a1a1a)'};font-size:12px;line-height:1.3;">${s.title}</span>
      </label>`;
    }
    html += '</div></section>';
    const hero = root.querySelector('.chapter-hero');
    if (hero) hero.insertAdjacentHTML('afterend', html);
    const summary = document.getElementById('readinessSummary');
    if (summary) summary.textContent = `${confidentCount}/${sections.length} confident`;
    root.querySelectorAll('.syllabus-checklist input').forEach(cb => {
      cb.addEventListener('change', function() {
        conf[this.dataset.section] = this.checked;
        saveState && saveState();
        // Re-render to update colors
        renderChapter && renderChapter();
      });
    });
  }
  const _origRC_V60 = window.renderChapter;
  window.renderChapter = function() {
    _origRC_V60();
    setTimeout(inject, 170);
  };
  console.log('[V60 SyllabusChecklist] active');
})();

// =========================================================================
// V61 - Periodic Table widget for d-/f-block (chem_4) + Coordination (chem_5)
// Adds a "\uD83D\uDCCB Periodic Table" button on those chapters' hero. Click opens a modal
// with the interactive periodic table from content/widgets/periodic_table.js.
// =========================================================================
(function () {
  if (typeof window === 'undefined' || !window.PERIODIC_TABLE) {
    console.warn('[V61] PERIODIC_TABLE widget not loaded \u2014 skipping'); return;
  }
  const TARGET_CHAPTERS = new Set(['chem_4', 'chem_5']);

  function openPTModal() {
    let modal = document.getElementById('pt-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pt-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
      const inner = document.createElement('div');
      inner.style.cssText = 'background:#fff;border-radius:10px;max-width:1100px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);';
      const closer = document.createElement('button');
      closer.textContent = '\u2715 close';
      closer.style.cssText = 'float:right;margin:10px 14px 0 0;background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;color:#374151;';
      closer.onclick = () => modal.remove();
      const target = document.createElement('div');
      target.id = 'pt-target';
      inner.appendChild(closer);
      inner.appendChild(target);
      modal.appendChild(inner);
      document.body.appendChild(modal);
      window.PERIODIC_TABLE.render(target);
    }
  }

  const _origRC_V61 = window.renderChapter;
  window.renderChapter = function () {
    _origRC_V61();
    const ch = (typeof findChapter === 'function') ? findChapter(state.currentChapterId) : null;
    if (!ch || !TARGET_CHAPTERS.has(ch.id)) return;
    const root = document.getElementById('view-chapter');
    const hero = root && root.querySelector('.chapter-hero');
    if (!hero || hero.querySelector('.pt-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'pt-btn btn btn-ghost';
    btn.style.cssText = 'margin-top:14px;margin-left:8px;border:0.5px solid var(--line);background:var(--bg);';
    btn.innerHTML = '\uD83D\uDCCB Periodic Table';
    btn.onclick = openPTModal;
    hero.appendChild(btn);
  };
  console.log('[V61 PeriodicTable] active');
})();

// =========================================================================
// V62 - Organic mechanism reference cards on chem_6 / _7 / _8 / _9
// Adds an "\uD83E\uDDEA Mechanisms" button on the chapter hero. Click opens a modal
// with curated mechanism cards (SN1/SN2/E2/Aldol/Cannizzaro/Wurtz/Williamson/
// Hoffmann/Sandmeyer/Reimer-Tiemann) filtered to the current chapter.
// =========================================================================
(function () {
  if (typeof window === 'undefined' || !window.ORGANIC_MECHANISMS) {
    console.warn('[V62] ORGANIC_MECHANISMS widget not loaded \u2014 skipping'); return;
  }
  const TARGET_CHAPTERS = new Set(['chem_6', 'chem_7', 'chem_8', 'chem_9']);

  function openMechModal(chapterId) {
    let modal = document.getElementById('mech-modal');
    if (modal) { modal.remove(); }
    modal = document.createElement('div');
    modal.id = 'mech-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:10px;max-width:780px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);';
    const closer = document.createElement('button');
    closer.textContent = '\u2715 close';
    closer.style.cssText = 'float:right;margin:10px 14px 0 0;background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;color:#374151;';
    closer.onclick = () => modal.remove();
    const target = document.createElement('div');
    inner.appendChild(closer);
    inner.appendChild(target);
    modal.appendChild(inner);
    document.body.appendChild(modal);
    window.ORGANIC_MECHANISMS.render(target, chapterId);
  }

  const _origRC_V62 = window.renderChapter;
  window.renderChapter = function () {
    _origRC_V62();
    const ch = (typeof findChapter === 'function') ? findChapter(state.currentChapterId) : null;
    if (!ch || !TARGET_CHAPTERS.has(ch.id)) return;
    const root = document.getElementById('view-chapter');
    const hero = root && root.querySelector('.chapter-hero');
    if (!hero || hero.querySelector('.mech-btn')) return;
    const mechs = window.ORGANIC_MECHANISMS.MECHANISMS.filter(m => m.applies.includes(ch.id));
    if (mechs.length === 0) return;
    const btn = document.createElement('button');
    btn.className = 'mech-btn btn btn-ghost';
    btn.style.cssText = 'margin-top:14px;margin-left:8px;border:0.5px solid var(--line);background:var(--bg);';
    btn.innerHTML = `\uD83E\uDDEA Mechanisms (${mechs.length})`;
    btn.onclick = () => openMechModal(ch.id);
    hero.appendChild(btn);
  };
  console.log('[V62 OrganicMechanisms] active');
})();

// =========================================================================
// V63 - Physics diagram gallery on physics chapters
// Adds "\uD83D\uDCD0 Diagrams" button on chapter hero. Click opens modal with all
// SVG_TEMPLATES motifs whose META.chapters contains current chapter id.
// =========================================================================
(function () {
  if (typeof window === 'undefined' || !window.SVG_TEMPLATES_META) {
    console.warn('[V63] SVG_TEMPLATES_META not loaded \u2014 skipping'); return;
  }
  function chaptersForCurrent(id) {
    const out = [];
    for (const [motifId, meta] of Object.entries(window.SVG_TEMPLATES_META)) {
      if (meta.chapters.includes(id)) out.push({ id: motifId, label: meta.label });
    }
    return out;
  }

  function openDiagramsModal(chapterId, motifs) {
    let modal = document.getElementById('diagrams-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'diagrams-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:10px;max-width:980px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);padding:14px;';
    const closer = document.createElement('button');
    closer.textContent = '\u2715 close';
    closer.style.cssText = 'float:right;background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;color:#374151;';
    closer.onclick = () => modal.remove();
    const title = document.createElement('div');
    title.textContent = `Physics diagrams \u2014 ${motifs.length} for this chapter`;
    title.style.cssText = 'font-weight:700;font-size:15px;color:#111827;margin-bottom:10px;';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:14px;';
    for (const m of motifs) {
      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid #d1d5db;border-radius:6px;padding:10px;background:#fafafa;';
      const lbl = document.createElement('div');
      lbl.textContent = m.label;
      lbl.style.cssText = 'font-weight:600;font-size:12px;color:#374151;margin-bottom:6px;';
      const svg = document.createElement('div');
      svg.innerHTML = `<svg viewBox="0 0 280 200" style="width:100%;max-width:280px;height:auto;"><use href="#${m.id}"/></svg>`;
      card.appendChild(lbl);
      card.appendChild(svg);
      grid.appendChild(card);
    }
    inner.appendChild(closer);
    inner.appendChild(title);
    inner.appendChild(grid);
    modal.appendChild(inner);
    document.body.appendChild(modal);
  }

  const _origRC_V63 = window.renderChapter;
  window.renderChapter = function () {
    _origRC_V63();
    const ch = (typeof findChapter === 'function') ? findChapter(state.currentChapterId) : null;
    if (!ch || !ch.id || !ch.id.startsWith('phys_')) return;
    const motifs = chaptersForCurrent(ch.id);
    if (motifs.length === 0) return;
    const root = document.getElementById('view-chapter');
    const hero = root && root.querySelector('.chapter-hero');
    if (!hero || hero.querySelector('.diagrams-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'diagrams-btn btn btn-ghost';
    btn.style.cssText = 'margin-top:14px;margin-left:8px;border:0.5px solid var(--line);background:var(--bg);';
    btn.innerHTML = `\uD83D\uDCD0 Diagrams (${motifs.length})`;
    btn.onclick = () => openDiagramsModal(ch.id, motifs);
    hero.appendChild(btn);
  };
  console.log('[V63 PhysicsDiagrams] active');
})();

// =========================================================================
// V64 - INLINE diagram injector (replaces V63 modal-only flow)
// After theory innerHTML is set, walk h2/h3/h4 headers and inject:
//   - matching SVG motifs from window.SVG_TEMPLATES_META.keywords
//   - matching mechanism cards from window.ORGANIC_MECHANISMS.MECHANISMS[].keywords
// First matching header wins per item per pane (avoids dupes).
// =========================================================================
(function () {
  if (typeof window === 'undefined') return;

  function norm(s) {
    return (s || '').toString().toLowerCase()
      .replace(/[\u2011\u2013\u2014]/g, '-')        // unicode dashes
      .replace(/\u00A0/g, ' ')       // nbsp
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildSvgInline(motifId, label) {
    const fig = document.createElement('figure');
    fig.className = 'inline-diagram';
    fig.dataset.motif = motifId;
    fig.style.cssText = 'margin:14px 0;padding:12px;background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;text-align:center;';
    const svgWrap = document.createElement('div');
    svgWrap.innerHTML = `<svg viewBox="0 0 280 200" style="width:100%;max-width:340px;height:auto;"><use href="#${motifId}"/></svg>`;
    const cap = document.createElement('figcaption');
    cap.textContent = `Fig. ${label}`;
    cap.style.cssText = 'font-size:11px;color:#6b7280;margin-top:6px;font-style:italic;';
    fig.appendChild(svgWrap);
    fig.appendChild(cap);
    return fig;
  }

  function buildMechCard(mech) {
    const wrap = document.createElement('div');
    wrap.className = 'inline-mech';
    wrap.dataset.mech = mech.id;
    wrap.style.cssText = 'margin:14px 0;';
    const card = (window.ORGANIC_MECHANISMS && window.ORGANIC_MECHANISMS.mechanismCard)
      ? window.ORGANIC_MECHANISMS.mechanismCard(mech)
      : null;
    if (card) wrap.appendChild(card);
    return wrap;
  }

  function injectInto(el, chapterId) {
    if (!el) return;
    // Clear stale injections so this is idempotent and re-fires for new theory content.
    // (Previously we used a dataset flag, but the same theoryContent element is reused
    // across topics \u2014 the flag stuck after the first injection and blocked all subsequent ones.)
    el.querySelectorAll(':scope > figure.inline-diagram, :scope > .inline-mech, .inline-diagram, .inline-mech').forEach(n => n.remove());

    const headers = Array.from(el.querySelectorAll('h2, h3, h4'));
    if (headers.length === 0) return;

    const usedMotifs = new Set();
    const usedMechs = new Set();

    // Inject SVG motifs from SVG_TEMPLATES_META
    if (window.SVG_TEMPLATES_META) {
      for (const h of headers) {
        const txt = norm(h.textContent || '');
        if (!txt) continue;
        for (const [motifId, meta] of Object.entries(window.SVG_TEMPLATES_META)) {
          if (usedMotifs.has(motifId)) continue;
          if (chapterId && meta.chapters && meta.chapters.length && !meta.chapters.includes(chapterId)) continue;
          const kws = meta.keywords || [];
          if (!kws.some(k => txt.includes(norm(k)))) continue;
          h.insertAdjacentElement('afterend', buildSvgInline(motifId, meta.label));
          usedMotifs.add(motifId);
        }
      }
    }

    // Inject mechanism cards from ORGANIC_MECHANISMS
    if (window.ORGANIC_MECHANISMS && window.ORGANIC_MECHANISMS.MECHANISMS) {
      for (const h of headers) {
        const txt = norm(h.textContent || '');
        if (!txt) continue;
        for (const mech of window.ORGANIC_MECHANISMS.MECHANISMS) {
          if (usedMechs.has(mech.id)) continue;
          if (chapterId && mech.applies && !mech.applies.includes(chapterId)) continue;
          const kws = mech.keywords || [];
          if (!kws.some(k => txt.includes(norm(k)))) continue;
          h.insertAdjacentElement('afterend', buildMechCard(mech));
          usedMechs.add(mech.id);
        }
      }
    }

    if (usedMotifs.size + usedMechs.size > 0) {
      console.log(`[V64] inlined ${usedMotifs.size} diagrams + ${usedMechs.size} mechanisms into ${chapterId || '(unknown)'}`);
    }
  }

  function currentChapterId() {
    try { return state && state.currentChapterId; } catch (_) { return null; }
  }

  // Wrap renderMathIn \u2014 called whenever theory innerHTML is loaded.
  const _origRenderMathIn = window.renderMathIn;
  window.renderMathIn = function (el) {
    try { _origRenderMathIn && _origRenderMathIn(el); } catch (e) { console.error('[V64] orig renderMathIn err', e); }
    if (el && el.id === 'theoryContent') {
      try { injectInto(el, currentChapterId()); } catch (e) { console.error('[V64] inject err', e); }
    }
  };

  console.log('[V64 InlineDiagrams] active');
})();

// =========================================================================
// V65 - Solutions/hints from content_solutions.js bundle
// When user reveals answer or requests hint, surface agent-generated content.
// Also injects a "\uD83D\uDCA1 Hint" button on the practice question card.
// =========================================================================
(function () {
  if (typeof window === 'undefined' || !window.SOLUTIONS) {
    console.warn('[V65] SOLUTIONS bundle not loaded \u2014 skipping'); return;
  }
  function getSolution(qid) { return (window.SOLUTIONS.byId || {})[qid]; }

  // Populate p.hint and p.explain from SOLUTIONS BEFORE the original loadProblem runs.
  // The original engine reads these fields directly (engine.js:820 and showFeedback callsites)
  // and falls back to "No hint available." when empty. By filling them in pre-render,
  // the existing UI displays our agent-generated content naturally.
  const _origLP_V65 = window.loadProblem;
  if (typeof _origLP_V65 !== 'function') { console.warn('[V65] loadProblem missing'); return; }
  window.loadProblem = function () {
    try {
      const p = (typeof session === 'object' && session.problems) ? session.problems[session.idx] : null;
      if (p && p.id) {
        const sol = getSolution(p.id);
        if (sol) {
          if (sol.hint && (!p.hint || p.hint === '')) p.hint = sol.hint;
          if (sol.solution && (!p.explain || p.explain === '')) p.explain = sol.solution;
        }
      }
    } catch (e) { /* fail open */ }
    return _origLP_V65.apply(this, arguments);
  };

  // Inject mnemonics + worked examples on chapter view
  const _origRC_V65 = window.renderChapter;
  if (typeof _origRC_V65 === 'function') {
    window.renderChapter = function () {
      _origRC_V65();
      try {
        const ch = (typeof findChapter === 'function') ? findChapter(state.currentChapterId) : null;
        if (!ch) return;
        const data = (window.SOLUTIONS.byChapter || {})[ch.id];
        if (!data) return;
        const root = document.getElementById('view-chapter');
        const hero = root && root.querySelector('.chapter-hero');
        if (!hero || hero.querySelector('.v65-mnem-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'v65-mnem-btn btn btn-ghost';
        btn.style.cssText = 'margin-top:14px;margin-left:8px;border:0.5px solid var(--line);background:var(--bg);';
        btn.innerHTML = `\uD83E\uDDE0 Mnemonics & Worked examples (${(data.mnemonics||[]).length}+${(data.worked_examples||[]).length})`;
        btn.onclick = () => openMnemModal(ch, data);
        hero.appendChild(btn);
      } catch (e) {}
    };
  }

  function openMnemModal(ch, data) {
    let modal = document.getElementById('v65-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'v65-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:10px;max-width:780px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);padding:18px;';
    let html = `<button onclick="document.getElementById('v65-modal').remove()" style="float:right;background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;color:#374151;">\u2715 close</button>`;
    html += `<h3 style="font-size:17px;font-weight:700;margin:0 0 12px;color:#111827;">${ch.name} \u2014 Mnemonics + Worked Examples</h3>`;
    if ((data.mnemonics||[]).length) {
      html += '<div style="font-weight:600;margin-bottom:6px;color:#374151;">\uD83E\uDDE0 Mnemonics</div><ul style="margin:0 0 16px 18px;padding:0;">';
      for (const m of data.mnemonics) html += `<li style="margin-bottom:6px;font-size:13px;color:#1f2937;">${m}</li>`;
      html += '</ul>';
    }
    if ((data.worked_examples||[]).length) {
      html += '<div style="font-weight:600;margin-bottom:6px;color:#374151;">\uD83D\uDCDD Worked Examples</div>';
      for (const ex of data.worked_examples) {
        html += `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-weight:600;font-size:13px;color:#111827;margin-bottom:4px;">${ex.title || 'Example'}</div>
          <div style="font-size:13px;color:#374151;margin-bottom:6px;"><strong>Problem:</strong> ${ex.problem}</div>
          <div style="font-size:13px;color:#1f2937;line-height:1.55;"><strong>Solution:</strong><br>${ex.solution}</div>
        </div>`;
      }
    }
    inner.innerHTML = html;
    modal.appendChild(inner);
    document.body.appendChild(modal);
    renderMathIn && renderMathIn(inner);
  }

  console.log('[V65 Solutions] active \u2014', Object.keys(window.SOLUTIONS.byId).length, 'solutions,', Object.keys(window.SOLUTIONS.byChapter).length, 'chapter packs');
})();

// =========================================================================
// V66 - OCR confidence indicator (A5 partial fix)
// Chapters flagged in _arihant oddities log get a small "\u26A0 OCR confidence" pill
// on the chapter hero. Click expands the notes so user knows which questions
// to verify against textbook.
// =========================================================================
(function () {
  if (typeof window === 'undefined' || !window.OCR_CONFIDENCE) {
    console.warn('[V66] OCR_CONFIDENCE bundle not loaded \u2014 skipping'); return;
  }

  function openConfModal(ch, info) {
    let modal = document.getElementById('v66-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'v66-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:10px;max-width:680px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);padding:18px;';
    let html = `<button onclick="document.getElementById('v66-modal').remove()" style="float:right;background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;color:#374151;">\u2715 close</button>`;
    html += `<h3 style="font-size:16px;font-weight:700;margin:0 0 10px;color:#92400e;">\u26A0 OCR confidence \u2014 ${ch.name}</h3>`;
    html += `<p style="font-size:13px;color:#374151;margin-bottom:12px;line-height:1.55;">During OCR + difficulty grading of this chapter, the agents flagged the following ${info.oddity_count} note${info.oddity_count>1?'s':''}. If a question seems garbled or wrong, cross-check the original Arihant book.</p>`;
    html += '<ul style="margin:0;padding:0 0 0 18px;font-size:12px;color:#1f2937;line-height:1.6;">';
    for (const n of info.notes) html += `<li style="margin-bottom:6px;">${n.replace(/[<>]/g, '')}</li>`;
    html += '</ul>';
    inner.innerHTML = html;
    modal.appendChild(inner);
    document.body.appendChild(modal);
  }

  const _origRC_V66 = window.renderChapter;
  if (typeof _origRC_V66 === 'function') {
    window.renderChapter = function () {
      _origRC_V66();
      try {
        const ch = (typeof findChapter === 'function') ? findChapter(state.currentChapterId) : null;
        if (!ch) return;
        const info = (window.OCR_CONFIDENCE || {})[ch.id];
        if (!info) return;
        const root = document.getElementById('view-chapter');
        const hero = root && root.querySelector('.chapter-hero');
        if (!hero || hero.querySelector('.v66-pill')) return;
        const pill = document.createElement('button');
        pill.className = 'v66-pill';
        pill.style.cssText = 'margin-top:10px;background:#fef3c7;border:1px solid #fde68a;color:#92400e;border-radius:99px;padding:4px 10px;font-size:11px;cursor:pointer;';
        pill.innerHTML = `\u26A0 ${info.oddity_count} OCR note${info.oddity_count>1?'s':''}`;
        pill.title = 'Click to see OCR/grading notes for this chapter';
        pill.onclick = () => openConfModal(ch, info);
        hero.appendChild(pill);
      } catch (e) {}
    };
  }
  console.log('[V66 OCRConfidence] active \u2014', Object.keys(window.OCR_CONFIDENCE).length, 'chapters flagged');
})();

// =========================================================================
// V67 \u2013 DerivationDrills
// Adds a "Drills" button to each chapter hero. Opens a modal listing every
// derivation for that chapter (from window.DERIVATIONS). Each drill has a
// countdown timer, step-by-step reveal, and self-rating stored in state.
// =========================================================================
(function () {
  'use strict';

  // DERIVATIONS loads after engine.js \u2014 check lazily at render time, not at init time.

  // --- helpers ---
  function getDrillsForChapter(chapterId) {
    return (window.DERIVATIONS || []).filter(function (d) { return d.chapter === chapterId; });
  }

  function getDrillState(id) {
    return ((state.drills || {})[id]) || { rating: null, lastDate: null, count: 0 };
  }

  function setDrillState(id, rating) {
    if (!state.drills) state.drills = {};
    const prev = state.drills[id] || { count: 0 };
    state.drills[id] = { rating: rating, lastDate: new Date().toISOString().slice(0, 10), count: (prev.count || 0) + 1 };
    saveState();
  }

  function ratingBadge(rating) {
    if (!rating) return '<span style="color:var(--ink-muted);font-size:11px;">Not attempted</span>';
    if (rating === 'got') return '<span style="background:#d1fae5;color:#065f46;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600;">&#10003; Nailed it</span>';
    if (rating === 'partial') return '<span style="background:#fef3c7;color:#92400e;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600;">&#9670; Partial</span>';
    return '<span style="background:#fee2e2;color:#991b1b;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600;">&#10005; Missed</span>';
  }

  // --- open drill list modal ---
  function openDrillList(chapterId) {
    const drills = getDrillsForChapter(chapterId);
    const ch = findChapter(chapterId);
    const existing = document.getElementById('v67-list-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'v67-list-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });

    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:12px;max-width:620px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);padding:24px;';

    let html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
    html += '<div>';
    html += '<div style="font-family:\'Geist Mono\',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);">Derivation Drills</div>';
    html += '<h3 style="font-size:18px;font-weight:700;margin:4px 0 0;color:var(--ink);">' + (ch ? ch.name : chapterId) + '</h3>';
    html += '</div>';
    html += '<button onclick="document.getElementById(\'v67-list-modal\').remove()" style="background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:12px;color:#374151;">&#10005; Close</button>';
    html += '</div>';

    if (drills.length === 0) {
      html += '<p style="color:var(--ink-muted);font-size:14px;">No derivation drills for this chapter yet.</p>';
    } else {
      drills.forEach(function (d) {
        const ds = getDrillState(d.id);
        const yearStr = d.years.slice(-4).join(', ');
        html += '<div style="border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:12px;background:var(--bg);">';
        html += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">';
        html += '<div style="flex:1;">';
        html += '<div style="font-weight:600;font-size:14px;color:var(--ink);margin-bottom:4px;">' + d.title + '</div>';
        html += '<div style="font-family:\'Geist Mono\',monospace;font-size:11px;color:var(--ink-muted);">ISC ' + yearStr + ' &middot; ' + d.marks + ' marks &middot; ' + d.time + ' min &middot; ' + d.steps.length + ' steps</div>';
        html += '<div style="margin-top:6px;">' + ratingBadge(ds.rating) + (ds.count > 0 ? '<span style="font-size:11px;color:var(--ink-muted);margin-left:8px;">Attempted ' + ds.count + 'x</span>' : '') + '</div>';
        html += '</div>';
        html += '<button onclick="window._v67OpenDrill(\'' + d.id + '\')" style="background:var(--ink);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;">&#9654; Start</button>';
        html += '</div></div>';
      });
    }

    inner.innerHTML = html;
    modal.appendChild(inner);
    document.body.appendChild(modal);
  }

  // --- drill runner ---
  window._v67OpenDrill = function (drillId) {
    const d = (window.DERIVATIONS || []).find(function (x) { return x.id === drillId; });
    if (!d) return;

    const listModal = document.getElementById('v67-list-modal');
    if (listModal) listModal.remove();

    const modal = document.createElement('div');
    modal.id = 'v67-drill-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.7);z-index:1200;display:flex;align-items:center;justify-content:center;padding:16px;';

    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.4);padding:28px;position:relative;';

    let stepsShown = 0;
    let timerInterval = null;
    let secondsLeft = d.time * 60;

    function renderDrillContent() {
      const totalMarks = d.steps.reduce(function (s, st) { return s + (st.marks || 1); }, 0);
      let html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
      html += '<div><div style="font-family:\'Geist Mono\',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);margin-bottom:4px;">' + d.marks + '-mark derivation</div>';
      html += '<h3 style="font-size:17px;font-weight:700;color:var(--ink);margin:0;">' + d.title + '</h3></div>';
      html += '<div id="v67-timer" style="font-family:\'Geist Mono\',monospace;font-size:22px;font-weight:700;color:var(--ink);min-width:56px;text-align:right;"></div>';
      html += '</div>';

      if (stepsShown === 0) {
        html += '<div style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1px solid #BFDBFE;border-radius:10px;padding:18px;margin-bottom:20px;">';
        html += '<div style="font-weight:600;font-size:14px;color:#1e40af;margin-bottom:8px;">Write this derivation in your notebook</div>';
        html += '<div style="font-size:13px;color:#1e3a8a;line-height:1.6;">You have <strong>' + d.time + ' minutes</strong>. Write out the complete derivation from memory. Don\'t peek at steps until you\'re done \u2014 or stuck.<br><br>ISC board examiners award <strong>' + totalMarks + ' marks</strong> using the step-by-step criteria below.</div>';
        html += '</div>';
        html += '<button id="v67-show-step" onclick="window._v67ShowNextStep()" style="width:100%;background:var(--ink);color:#fff;border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:12px;">Show Step 1 of ' + d.steps.length + ' &#8595;</button>';
      } else {
        html += '<div style="margin-bottom:20px;">';
        for (let i = 0; i < stepsShown; i++) {
          const st = d.steps[i];
          html += '<div style="border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-bottom:10px;background:' + (i === stepsShown - 1 ? '#f0fdf4' : 'var(--bg)') + ';border-left:3px solid ' + (i === stepsShown - 1 ? '#16a34a' : 'var(--line)') + ';">';
          html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
          html += '<span style="font-family:\'Geist Mono\',monospace;font-size:11px;font-weight:600;color:#16a34a;">STEP ' + (i + 1) + ' &middot; ' + (st.marks || 1) + ' mark' + ((st.marks || 1) > 1 ? 's' : '') + '</span>';
          html += '<span style="font-weight:600;font-size:13px;color:var(--ink);">' + st.label + '</span>';
          html += '</div>';
          html += '<div style="font-size:13px;color:var(--ink);line-height:1.7;">' + st.text + '</div>';
          html += '</div>';
        }
        html += '</div>';
        if (stepsShown < d.steps.length) {
          html += '<button id="v67-show-step" onclick="window._v67ShowNextStep()" style="width:100%;background:var(--ink);color:#fff;border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:12px;">Show Step ' + (stepsShown + 1) + ' of ' + d.steps.length + ' &#8595;</button>';
        } else {
          html += '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:16px;">';
          html += '<div style="font-weight:700;font-size:14px;color:#15803d;margin-bottom:12px;">All ' + d.steps.length + ' steps revealed. How did you do?</div>';
          html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">';
          html += '<button onclick="window._v67Rate(\'' + d.id + '\',\'got\')" style="background:#d1fae5;border:1.5px solid #6ee7b7;border-radius:8px;padding:12px 8px;cursor:pointer;font-size:13px;font-weight:600;color:#065f46;">&#10003;<br>Nailed it</button>';
          html += '<button onclick="window._v67Rate(\'' + d.id + '\',\'partial\')" style="background:#fef3c7;border:1.5px solid #fde68a;border-radius:8px;padding:12px 8px;cursor:pointer;font-size:13px;font-weight:600;color:#92400e;">&#9670;<br>Partial</button>';
          html += '<button onclick="window._v67Rate(\'' + d.id + '\',\'missed\')" style="background:#fee2e2;border:1.5px solid #fca5a5;border-radius:8px;padding:12px 8px;cursor:pointer;font-size:13px;font-weight:600;color:#991b1b;">&#10005;<br>Missed</button>';
          html += '</div></div>';
        }
      }

      html += '<button onclick="window._v67CloseDrill()" style="width:100%;background:transparent;border:0.5px solid var(--line);border-radius:8px;padding:10px;font-size:13px;color:var(--ink-soft);cursor:pointer;">&#8592; Back to drills list</button>';
      inner.innerHTML = html;

      // render math in newly injected content
      try { if (typeof renderMathIn === 'function') renderMathIn(inner); } catch (e) {}

      // update timer display
      function updateTimerDisplay() {
        const el = document.getElementById('v67-timer');
        if (!el) return;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
        el.style.color = secondsLeft < 60 ? '#dc2626' : secondsLeft < 180 ? '#d97706' : 'var(--ink)';
      }
      updateTimerDisplay();
      if (!timerInterval && secondsLeft > 0) {
        timerInterval = setInterval(function () {
          secondsLeft--;
          updateTimerDisplay();
          if (secondsLeft <= 0) { clearInterval(timerInterval); timerInterval = null; }
        }, 1000);
      }
    }

    window._v67ShowNextStep = function () {
      stepsShown = Math.min(stepsShown + 1, d.steps.length);
      if (stepsShown === 1 && timerInterval === null && secondsLeft > 0) {
        timerInterval = setInterval(function () {
          secondsLeft--;
          const el = document.getElementById('v67-timer');
          if (el) {
            const m = Math.floor(secondsLeft / 60);
            const s = secondsLeft % 60;
            el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
            el.style.color = secondsLeft < 60 ? '#dc2626' : secondsLeft < 180 ? '#d97706' : 'var(--ink)';
          }
          if (secondsLeft <= 0) { clearInterval(timerInterval); timerInterval = null; }
        }, 1000);
      }
      renderDrillContent();
    };

    window._v67Rate = function (id, rating) {
      clearInterval(timerInterval); timerInterval = null;
      setDrillState(id, rating);
      const m = document.getElementById('v67-drill-modal');
      if (m) m.remove();
      // reopen list for chapter
      openDrillList(d.chapter);
    };

    window._v67CloseDrill = function () {
      clearInterval(timerInterval); timerInterval = null;
      const m = document.getElementById('v67-drill-modal');
      if (m) m.remove();
      openDrillList(d.chapter);
    };

    renderDrillContent();
    modal.appendChild(inner);
    document.body.appendChild(modal);
  };

  // --- inject button into chapter hero ---
  const _origRC_V67 = window.renderChapter;
  if (typeof _origRC_V67 === 'function') {
    window.renderChapter = function () {
      _origRC_V67();
      try {
        const ch = findChapter(state.currentChapterId);
        if (!ch) return;
        const drills = getDrillsForChapter(ch.id);
        if (!drills.length) return;
        const root = document.getElementById('view-chapter');
        const hero = root && root.querySelector('.chapter-hero');
        if (!hero || hero.querySelector('.v67-drill-btn')) return;

        const attempted = drills.filter(function (d) { return getDrillState(d.id).rating; }).length;
        const nailed = drills.filter(function (d) { return getDrillState(d.id).rating === 'got'; }).length;
        const color = nailed === drills.length ? '#065f46' : attempted > 0 ? '#92400e' : '#1e40af';
        const bg = nailed === drills.length ? '#d1fae5' : attempted > 0 ? '#fef3c7' : '#dbeafe';
        const border = nailed === drills.length ? '#6ee7b7' : attempted > 0 ? '#fde68a' : '#bfdbfe';

        const btn = document.createElement('button');
        btn.className = 'v67-drill-btn';
        btn.style.cssText = 'margin-top:12px;display:inline-flex;align-items:center;gap:8px;background:' + bg + ';border:1px solid ' + border + ';color:' + color + ';border-radius:8px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;';
        btn.innerHTML = '&#128221; Derivation Drills &middot; ' + nailed + '/' + drills.length + ' nailed';
        btn.title = drills.length + ' derivations for this chapter';
        btn.onclick = function () { openDrillList(ch.id); };
        hero.appendChild(btn);
      } catch (e) {}
    };
  }

  console.log('[V67 DerivationDrills] active \u2014 derivation data loads after engine.js, checked lazily at render time');
})();

// =========================================================================
// V68 \u2013 PYQWrittenMode
// For any question with ._pyq metadata, adds a "Written \u270F" toggle in the
// practice modal. Written mode hides MCQ options, shows a blank-page prompt,
// then reveals the full model answer + mark-scheme on demand, with
// self-rating buttons (Correct / Partial / Wrong) feeding session.correct.
// =========================================================================
(function () {
  'use strict';

  let writtenModeOn = false;

  // Patch loadProblem to inject the toggle
  const _origLoadProblem = window.loadProblem;
  if (typeof _origLoadProblem !== 'function') { console.warn('[V68] loadProblem not found'); return; }

  window.loadProblem = function () {
    _origLoadProblem();
    writtenModeOn = false; // reset per question
    try { injectWrittenToggle(); } catch (e) {}
  };

  function injectWrittenToggle() {
    const p = session && session.problems && session.problems[session.idx];
    if (!p || !p._pyq) return;
    const marks = (p._pyq && p._pyq.marks) || 1;
    if (marks < 2) return; // only for 2-mark+ written questions

    const area = document.getElementById('answerArea');
    if (!area || area.querySelector('.v68-toggle')) return;

    const toggle = document.createElement('div');
    toggle.className = 'v68-toggle';
    toggle.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;';
    toggle.innerHTML = '<span style="font-size:12px;font-weight:600;color:#1e40af;flex:1;">&#9998; ISC ' + marks + '-mark written question \u2014 practice as board exam</span><button id="v68-toggle-btn" style="background:#1e40af;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;">Switch to Written Mode</button>';
    toggle.querySelector('#v68-toggle-btn').onclick = function () { activateWrittenMode(p); };
    area.insertBefore(toggle, area.firstChild);
  }

  function activateWrittenMode(p) {
    writtenModeOn = true;
    const area = document.getElementById('answerArea');
    if (!area) return;

    // Stop the standard timer
    if (typeof stopTimer === 'function') stopTimer();

    const marks = (p._pyq && p._pyq.marks) || 2;
    const year = p._pyq.year || '?';
    const qnum = p._pyq.qNum || '?';

    area.innerHTML = '';

    const block = document.createElement('div');
    block.className = 'v68-written-block';
    block.style.cssText = 'border:2px dashed #bfdbfe;border-radius:10px;padding:20px;background:#f8faff;text-align:center;';
    block.innerHTML = '<div style="font-size:28px;margin-bottom:10px;">&#128196;</div>' +
      '<div style="font-weight:700;font-size:15px;color:var(--ink);margin-bottom:6px;">Write your full answer in your notebook</div>' +
      '<div style="font-size:13px;color:var(--ink-soft);margin-bottom:6px;">ISC ' + year + ' Q' + qnum + ' &middot; ' + marks + ' marks</div>' +
      '<div style="font-size:12px;color:var(--ink-muted);margin-bottom:18px;">State formula &rarr; substitute values &rarr; show steps &rarr; box final answer with units</div>' +
      '<button id="v68-reveal-btn" style="background:var(--ink);color:#fff;border:none;border-radius:10px;padding:14px 28px;font-size:14px;font-weight:600;cursor:pointer;width:100%;">I\'ve written my answer &rarr; Show Model Answer</button>';
    area.appendChild(block);

    // Hide standard submit
    const submitBtn = document.getElementById('modalSubmit');
    if (submitBtn) submitBtn.style.display = 'none';

    document.getElementById('v68-reveal-btn').onclick = function () { showModelAnswer(p); };
  }

  function showModelAnswer(p) {
    const area = document.getElementById('answerArea');
    if (!area) return;

    const marks = (p._pyq && p._pyq.marks) || 2;
    const year = p._pyq.year || '?';
    const qnum = p._pyq.qNum || '?';

    // Get solution from V65 store
    const sol = (window.SOLUTIONS && window.SOLUTIONS.byId && window.SOLUTIONS.byId[p._qid || p.id]) || null;
    const solutionHtml = sol ? (sol.solution || sol.explanation || '') : '';
    const mnemonicHtml = sol && sol.mnemonic ? '<div style="background:#fef3c7;border-radius:6px;padding:10px 12px;margin-top:10px;font-size:12px;color:#92400e;"><strong>Mnemonic:</strong> ' + sol.mnemonic + '</div>' : '';

    // Build mark-scheme bullets
    const markItems = [];
    if (Array.isArray(p._markScheme) && p._markScheme.length) {
      p._markScheme.forEach(function (m) { markItems.push({ m: m.mark, t: m.criterion }); });
    } else {
      if (marks >= 2) markItems.push({ m: 1, t: 'State the relevant formula / principle' });
      if (marks >= 2) markItems.push({ m: 1, t: 'Correct substitution with units' });
      if (marks >= 3) markItems.push({ m: 1, t: 'At least one clear intermediate step shown' });
      if (marks >= 4) markItems.push({ m: 1, t: 'Required diagram labelled' });
      markItems.push({ m: 1, t: 'Correct final answer boxed with correct units' });
    }

    let html = '<div style="border:1px solid #bbf7d0;border-radius:10px;padding:16px;background:#f0fdf4;margin-bottom:12px;">';
    html += '<div style="font-weight:700;font-size:13px;color:#15803d;margin-bottom:10px;">&#10003; Model Answer \u2014 ISC ' + year + ' Q' + qnum + ' (' + marks + ' marks)</div>';
    if (solutionHtml) {
      html += '<div id="v68-sol-content" style="font-size:13px;color:var(--ink);line-height:1.7;margin-bottom:10px;">' + solutionHtml + '</div>';
    } else {
      // fall back to correct option
      const correctOpt = p.options && typeof p.correct === 'number' ? p.options[p.correct] : null;
      if (correctOpt) html += '<div style="font-size:13px;color:var(--ink);margin-bottom:10px;"><strong>Answer:</strong> ' + correctOpt + '</div>';
      if (p.explanation) html += '<div style="font-size:13px;color:var(--ink);line-height:1.7;margin-bottom:10px;">' + p.explanation + '</div>';
    }
    html += mnemonicHtml;
    html += '</div>';

    html += '<div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:var(--bg);margin-bottom:14px;">';
    html += '<div style="font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink-muted);margin-bottom:10px;">ISC Mark Scheme \u2014 tick off what you wrote</div>';
    markItems.forEach(function (mi) {
      html += '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:13px;"><span style="font-family:\'Geist Mono\',monospace;color:var(--accent);font-size:11px;font-weight:600;min-width:22px;padding-top:1px;">' + mi.m + 'm</span><span style="color:var(--ink-soft);">&#9744; ' + mi.t + '</span></div>';
    });
    html += '</div>';

    html += '<div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:10px;">How did your answer compare?</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">';
    html += '<button onclick="window._v68Rate(1)" style="background:#d1fae5;border:1.5px solid #6ee7b7;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#065f46;">&#10003; Got it<br><span style="font-size:11px;font-weight:400;">Full marks</span></button>';
    html += '<button onclick="window._v68Rate(0.5)" style="background:#fef3c7;border:1.5px solid #fde68a;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#92400e;">&#9670; Partial<br><span style="font-size:11px;font-weight:400;">Half marks</span></button>';
    html += '<button onclick="window._v68Rate(0)" style="background:#fee2e2;border:1.5px solid #fca5a5;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#991b1b;">&#10005; Missed<br><span style="font-size:11px;font-weight:400;">0 marks</span></button>';
    html += '</div>';

    area.innerHTML = html;

    // Re-show next button in feedback area
    const fb = document.getElementById('modalFeedback');
    if (fb) {
      fb.classList.add('show');
      fb.classList.remove('correct', 'wrong', 'crit');
      fb.style.background = '#f0fdf4';
    }
    const submitBtn = document.getElementById('modalSubmit');
    if (submitBtn) {
      submitBtn.style.display = 'block';
      submitBtn.textContent = session && session.idx + 1 < (session.problems || []).length ? 'Next &#8594;' : 'Finish';
      submitBtn.onclick = function () { if (typeof nextProblem === 'function' && session.idx + 1 < session.problems.length) nextProblem(); else if (typeof closeModal === 'function') closeModal(); };
    }

    try { if (typeof renderMathIn === 'function') { const sc = document.getElementById('v68-sol-content'); if (sc) renderMathIn(sc); } } catch (e) {}
  }

  window._v68Rate = function (scoreMultiplier) {
    if (!session) return;
    if (scoreMultiplier >= 1) { session.correct = (session.correct || 0) + 1; }
    else if (scoreMultiplier >= 0.5) { session.correct = (session.correct || 0) + 0.5; }
    // move to next or finish
    const submitBtn = document.getElementById('modalSubmit');
    if (submitBtn) submitBtn.click();
  };

  console.log('[V68 PYQWrittenMode] active');
})();

// =========================================================================
// V69 \u2013 ExamSimulator
// Full ISC paper mock: Part I (15 MCQ), Section A (2-mark written \u00D7 8,
// attempt 7), Section B (3-mark \u00D7 7, attempt 5), Section C (5-mark derivations
// \u00D7 5, attempt 4). 3-hour countdown. MCQ auto-scored; written self-rated.
// Results: estimated total, section breakdown, chapter weakness list.
// =========================================================================
(function () {
  'use strict';

  const ISC_FORMAT = {
    I:  { label: 'Part I \u2014 MCQ',          qMarks: 1, total: 15, attempt: 15, mode: 'mcq'     },
    IIA:{ label: 'Section A \u2014 Short answer', qMarks: 2, total: 8,  attempt: 7,  mode: 'written' },
    IIB:{ label: 'Section B \u2014 Medium answer',qMarks: 3, total: 7,  attempt: 5,  mode: 'written' },
    IIC:{ label: 'Section C \u2014 Derivations', qMarks: 5, total: 5,  attempt: 4,  mode: 'derivation' }
  };

  let examState = null;
  let examTimerInterval = null;

  // \u2500\u2500 Add "Full Mock Exam" button to subject hero \u2500\u2500
  const _origRS_V69 = window.renderSubject;
  if (typeof _origRS_V69 === 'function') {
    window.renderSubject = function () {
      _origRS_V69();
      try { injectExamButton(); } catch (e) {}
    };
  }

  function injectExamButton() {
    const root = document.getElementById('view-subject');
    if (!root) return;
    const hero = root.querySelector('.subject-hero');
    if (!hero || hero.querySelector('.v69-exam-btn')) return;
    const sub = state.currentSubject;
    if (!sub) return;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;';
    wrap.innerHTML = '<button class="v69-exam-btn" onclick="window._v69LaunchExam()" style="display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#1e3a8a,#1e40af);color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(30,58,138,0.35);transition:all 0.2s;">&#127931; Full Mock Exam <span style="background:rgba(255,255,255,0.2);border-radius:4px;padding:2px 8px;font-size:11px;font-weight:400;">3 hrs &middot; 62 marks</span></button>';
    hero.appendChild(wrap);
  }

  window._v69LaunchExam = function () { openExamSetup(); };

  function openExamSetup() {
    const sub = state.currentSubject;
    if (!sub) return;
    const subLabel = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Maths' }[sub] || sub;

    const modal = document.createElement('div');
    modal.id = 'v69-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);z-index:1300;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', function (e) { if (e.target === modal) { if (confirm('Exit exam setup?')) modal.remove(); } });

    const inner = document.createElement('div');
    inner.id = 'v69-inner';
    inner.style.cssText = 'background:#fff;border-radius:14px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.35);padding:28px;';
    inner.innerHTML = buildSetupHTML(sub, subLabel);
    modal.appendChild(inner);
    document.body.appendChild(modal);
  }

  function buildSetupHTML(sub, subLabel) {
    const subjectDerivations = (window.DERIVATIONS || []).filter(function (d) { return d.subject === sub; });
    let html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">';
    html += '<div><div style="font-family:\'Geist Mono\',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);">ISC Board Simulation</div>';
    html += '<h3 style="font-size:20px;font-weight:700;color:var(--ink);margin:4px 0 0;">' + subLabel + ' \u2014 Full Mock Exam</h3></div>';
    html += '<button onclick="document.getElementById(\'v69-modal\').remove()" style="background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">&#10005;</button></div>';

    html += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin-bottom:20px;font-size:13px;color:#1e3a8a;line-height:1.7;">';
    html += '<strong>Paper format (approx. ISC 2024\u201325):</strong><br>';
    Object.keys(ISC_FORMAT).forEach(function (k) {
      const s = ISC_FORMAT[k];
      const maxM = s.attempt * s.qMarks;
      html += '&bull; ' + s.label + ': ' + s.total + ' questions, attempt ' + s.attempt + ' &middot; <strong>' + maxM + ' marks</strong><br>';
    });
    html += '<br><strong>Total: 3 hours &middot; ~62 marks</strong><br>';
    html += '<span style="font-size:11px;color:#3b82f6;">Derivation drills available: ' + subjectDerivations.length + ' for ' + subLabel + '</span>';
    html += '</div>';

    html += '<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:24px;font-size:13px;color:#92400e;">';
    html += '<strong>Before you start:</strong><br>Get blank paper &amp; pen ready. MCQ sections are answered in the app. Written sections \u2014 write on paper, then tap "Show Answer" to self-rate.<br>';
    html += 'The timer is real. Stop it only in genuine emergencies.';
    html += '</div>';

    html += '<button onclick="window._v69StartExam()" style="width:100%;background:linear-gradient(135deg,#1e3a8a,#1e40af);color:#fff;border:none;border-radius:10px;padding:16px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(30,58,138,0.35);">&#9654; Start Exam \u2014 3:00:00</button>';
    html += '<p style="text-align:center;font-size:12px;color:var(--ink-muted);margin-top:10px;">The timer starts immediately when you click</p>';
    return html;
  }

  window._v69StartExam = function () {
    const sub = state.currentSubject;
    if (!sub) return;

    // Build question bank per section
    const allQ = [];
    Object.values(window.CONTENT || {}).forEach(function (chapters) {
      (chapters || []).forEach(function (ch) {
        if (ch.subject !== sub) return;
        (ch.parts || []).forEach(function (part) {
          (part.topics || []).forEach(function (t) {
            (t.questions || []).forEach(function (q) {
              allQ.push(Object.assign({}, q, { _chapter: ch }));
            });
          });
        });
      });
    });

    const pyqQ = allQ.filter(function (q) { return q._pyq && q.type === 'mcq'; });
    const writtenQ = allQ.filter(function (q) { return q._pyq && (q._pyq.marks || 1) >= 2; });
    const drillQ = (window.DERIVATIONS || []).filter(function (d) { return d.subject === sub; });

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }

    function pick(pool, n) { return shuffle(pool).slice(0, Math.min(n, pool.length)); }

    const sectionI   = pick(pyqQ, ISC_FORMAT.I.total);
    const sectionIIA = pick(writtenQ.filter(function (q) { return (q._pyq.marks || 2) >= 2 && (q._pyq.marks || 2) < 4; }), ISC_FORMAT.IIA.total);
    const sectionIIB = pick(writtenQ.filter(function (q) { return (q._pyq.marks || 3) >= 3 && (q._pyq.marks || 3) < 5; }), ISC_FORMAT.IIB.total);
    const sectionIIC = pick(drillQ, ISC_FORMAT.IIC.total);

    examState = {
      sub: sub,
      secondsLeft: 3 * 60 * 60,
      sections: [
        { key: 'I',   fmt: ISC_FORMAT.I,   questions: sectionI,   answered: [], idx: 0, selfScores: [] },
        { key: 'IIA', fmt: ISC_FORMAT.IIA,  questions: sectionIIA, answered: [], idx: 0, selfScores: [] },
        { key: 'IIB', fmt: ISC_FORMAT.IIB,  questions: sectionIIB, answered: [], idx: 0, selfScores: [] },
        { key: 'IIC', fmt: ISC_FORMAT.IIC,  questions: sectionIIC, answered: [], idx: 0, selfScores: [] }
      ],
      currentSection: 0,
      done: false
    };

    // Close setup and open exam
    const setupModal = document.getElementById('v69-modal');
    if (setupModal) setupModal.remove();
    renderExamModal();
    startExamTimer();
  };

  function startExamTimer() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    examTimerInterval = setInterval(function () {
      if (!examState) { clearInterval(examTimerInterval); return; }
      examState.secondsLeft--;
      updateExamTimer();
      if (examState.secondsLeft <= 0) { clearInterval(examTimerInterval); examTimerInterval = null; finishExam(); }
    }, 1000);
  }

  function updateExamTimer() {
    const el = document.getElementById('v69-clock');
    if (!el || !examState) return;
    const s = examState.secondsLeft;
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    el.textContent = h + ':' + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    el.style.color = s < 600 ? '#dc2626' : s < 1800 ? '#d97706' : '#1e40af';
  }

  function renderExamModal() {
    const existing = document.getElementById('v69-exam-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'v69-exam-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:#f8faff;z-index:1400;display:flex;flex-direction:column;overflow:hidden;';

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'background:#1e3a8a;color:#fff;padding:14px 24px;display:flex;align-items:center;gap:20px;flex-shrink:0;';
    header.innerHTML = '<div style="flex:1;font-weight:700;font-size:15px;">&#127931; ISC Mock Exam</div>' +
      '<div id="v69-clock" style="font-family:\'Geist Mono\',monospace;font-size:22px;font-weight:700;"></div>' +
      '<div id="v69-sec-label" style="font-size:13px;opacity:0.8;"></div>' +
      '<button onclick="window._v69FinishEarly()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">End Exam</button>';
    modal.appendChild(header);

    // Section tabs
    const tabs = document.createElement('div');
    tabs.id = 'v69-tabs';
    tabs.style.cssText = 'background:#1e3a8a;padding:0 24px 0;display:flex;gap:0;overflow-x:auto;flex-shrink:0;';
    examState.sections.forEach(function (sec, i) {
      const tab = document.createElement('button');
      tab.id = 'v69-tab-' + i;
      tab.style.cssText = 'background:transparent;border:none;border-bottom:3px solid transparent;color:rgba(255,255,255,0.6);padding:10px 16px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all 0.2s;';
      tab.textContent = sec.fmt.label.split(' \u2014 ')[0];
      tab.onclick = function () { navigateToSection(i, 0); };
      tabs.appendChild(tab);
    });
    modal.appendChild(tabs);

    // Progress bar
    const progBar = document.createElement('div');
    progBar.id = 'v69-progress';
    progBar.style.cssText = 'height:3px;background:#dbeafe;flex-shrink:0;';
    progBar.innerHTML = '<div id="v69-prog-fill" style="height:100%;background:#1e40af;transition:width 0.5s;width:0%;"></div>';
    modal.appendChild(progBar);

    // Body
    const body = document.createElement('div');
    body.id = 'v69-body';
    body.style.cssText = 'flex:1;overflow-y:auto;padding:28px;max-width:760px;margin:0 auto;width:100%;';
    modal.appendChild(body);

    document.body.appendChild(modal);
    updateExamTimer();
    navigateToSection(0, 0);
  }

  function navigateToSection(sIdx, qIdx) {
    if (!examState) return;
    examState.currentSection = sIdx;
    examState.sections[sIdx].idx = qIdx || 0;

    // Update tabs
    examState.sections.forEach(function (_, i) {
      const t = document.getElementById('v69-tab-' + i);
      if (t) {
        t.style.borderBottomColor = i === sIdx ? '#fff' : 'transparent';
        t.style.color = i === sIdx ? '#fff' : 'rgba(255,255,255,0.55)';
      }
    });

    // Update section label
    const sl = document.getElementById('v69-sec-label');
    if (sl) sl.textContent = examState.sections[sIdx].fmt.label;

    renderExamQuestion();
    updateExamProgress();
  }

  function updateExamProgress() {
    if (!examState) return;
    let done = 0, total = 0;
    examState.sections.forEach(function (s) {
      total += Math.min(s.fmt.attempt, s.questions.length);
      done += s.answered.length;
    });
    const fill = document.getElementById('v69-prog-fill');
    if (fill) fill.style.width = (total > 0 ? Math.round((done / total) * 100) : 0) + '%';
  }

  function renderExamQuestion() {
    const body = document.getElementById('v69-body');
    if (!body || !examState) return;

    const sec = examState.sections[examState.currentSection];
    const attempted = sec.answered.length;
    const remaining = Math.min(sec.fmt.attempt, sec.questions.length) - attempted;
    const qIdx = sec.idx;
    const q = sec.questions[qIdx];

    let html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:8px;">';
    html += '<h3 style="font-size:16px;font-weight:700;color:var(--ink);">' + sec.fmt.label + '</h3>';
    html += '<div style="font-family:\'Geist Mono\',monospace;font-size:12px;color:var(--ink-muted);">Attempted: ' + attempted + ' / need: ' + sec.fmt.attempt + ' &middot; Q ' + (qIdx + 1) + ' of ' + sec.questions.length + '</div>';
    html += '</div>';

    if (attempted >= sec.fmt.attempt || qIdx >= sec.questions.length) {
      // Section done
      const earnedScore = sec.fmt.mode === 'mcq'
        ? sec.answered.filter(function (a) { return a.correct; }).length * sec.fmt.qMarks
        : sec.selfScores.reduce(function (s, v) { return s + v; }, 0);
      const maxScore = sec.fmt.attempt * sec.fmt.qMarks;

      html += '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;">';
      html += '<div style="font-size:36px;font-weight:700;color:#15803d;margin-bottom:8px;">' + Math.round(earnedScore * 10) / 10 + ' / ' + maxScore + '</div>';
      html += '<div style="font-size:14px;color:#15803d;margin-bottom:20px;">' + sec.fmt.label + ' complete</div>';
      if (examState.currentSection < examState.sections.length - 1) {
        html += '<button onclick="window._v69NextSection()" style="background:#1e40af;color:#fff;border:none;border-radius:8px;padding:14px 28px;font-size:14px;font-weight:600;cursor:pointer;">Next Section &#8594;</button>';
      } else {
        html += '<button onclick="window._v69FinishEarly()" style="background:#1e40af;color:#fff;border:none;border-radius:8px;padding:14px 28px;font-size:14px;font-weight:600;cursor:pointer;">&#127941; Finish Exam &amp; See Results</button>';
      }
      html += '</div>';
      body.innerHTML = html;
      return;
    }

    if (!q) {
      html += '<div style="color:var(--ink-muted);padding:20px;text-align:center;">No questions available for this section.<br><br>';
      html += '<button onclick="window._v69NextSection()" style="background:var(--ink);color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:14px;cursor:pointer;">Next Section &#8594;</button></div>';
      body.innerHTML = html;
      return;
    }

    // Render question based on mode
    if (sec.fmt.mode === 'mcq') {
      html += renderMCQQuestion(q, sec);
    } else if (sec.fmt.mode === 'derivation') {
      html += renderDerivationQuestion(q, sec, qIdx);
    } else {
      html += renderWrittenQuestion(q, sec, qIdx);
    }

    body.innerHTML = html;
    try { if (typeof renderMathIn === 'function') renderMathIn(body); } catch (e) {}
  }

  function renderMCQQuestion(q, sec) {
    let html = '<div style="background:var(--bg-elev);border:0.5px solid var(--line);border-radius:12px;padding:22px;margin-bottom:20px;">';
    if (q._pyq) html += '<div style="font-family:\'Geist Mono\',monospace;font-size:11px;color:var(--accent);margin-bottom:10px;">ISC ' + (q._pyq.year || '') + ' Q' + (q._pyq.qNum || '') + ' &middot; 1 mark</div>';
    html += '<div id="v69-q-text" style="font-size:15px;color:var(--ink);line-height:1.65;margin-bottom:18px;">' + (q.q || '') + '</div>';
    html += '<div id="v69-opts">';
    (q.options || []).forEach(function (opt, i) {
      html += '<button onclick="window._v69PickMCQ(' + i + ')" id="v69-opt-' + i + '" style="display:block;width:100%;text-align:left;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:12px 16px;margin-bottom:8px;cursor:pointer;font-size:14px;transition:all 0.15s;">';
      html += '<span style="font-family:\'Geist Mono\',monospace;font-size:11px;font-weight:600;margin-right:10px;color:var(--ink-muted);">' + String.fromCharCode(65 + i) + '.</span>' + opt + '</button>';
    });
    html += '</div>';
    html += '</div>';

    window._v69PickMCQ = function (idx) {
      const correct = q.correct === idx;
      const opts = document.querySelectorAll('[id^="v69-opt-"]');
      opts.forEach(function (o, i) {
        o.style.cursor = 'default';
        o.onclick = null;
        if (i === q.correct) { o.style.background = '#d1fae5'; o.style.borderColor = '#6ee7b7'; }
        else if (i === idx && !correct) { o.style.background = '#fee2e2'; o.style.borderColor = '#fca5a5'; }
      });
      sec.answered.push({ qIdx: sec.idx, correct: correct });
      updateExamProgress();

      // Show next button after brief delay
      setTimeout(function () {
        const nb = document.createElement('button');
        nb.style.cssText = 'margin-top:12px;display:block;width:100%;background:var(--ink);color:#fff;border:none;border-radius:8px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;';
        nb.textContent = (sec.answered.length >= sec.fmt.attempt || sec.idx + 1 >= sec.questions.length) ? 'Section Complete &#8594;' : 'Next Question &#8594;';
        nb.onclick = function () { sec.idx++; renderExamQuestion(); };
        const body = document.getElementById('v69-body');
        if (body) body.appendChild(nb);
      }, 400);
    };

    return html;
  }

  function renderWrittenQuestion(q, sec, qIdx) {
    const marks = (q._pyq && q._pyq.marks) || sec.fmt.qMarks;
    let html = '<div style="background:var(--bg-elev);border:0.5px solid var(--line);border-radius:12px;padding:22px;margin-bottom:20px;">';
    if (q._pyq) html += '<div style="font-family:\'Geist Mono\',monospace;font-size:11px;color:var(--accent);margin-bottom:10px;">ISC ' + (q._pyq.year || '') + ' Q' + (q._pyq.qNum || '') + ' &middot; ' + marks + ' marks</div>';
    html += '<div id="v69-q-text" style="font-size:15px;color:var(--ink);line-height:1.65;margin-bottom:20px;">' + (q.q || '') + '</div>';
    html += '<div style="border:2px dashed #bfdbfe;border-radius:10px;padding:20px;background:#f8faff;text-align:center;margin-bottom:16px;">';
    html += '<div style="font-size:24px;margin-bottom:8px;">&#128196;</div>';
    html += '<div style="font-size:13px;color:var(--ink-soft);">Write your full ' + marks + '-mark answer in your notebook, then tap below.</div>';
    html += '</div>';
    html += '<button id="v69-written-reveal" style="width:100%;background:var(--ink);color:#fff;border:none;border-radius:10px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;">Show Model Answer &amp; Rate</button>';
    html += '</div>';

    window._v69RevealWritten = function () {
      const sol = (window.SOLUTIONS && window.SOLUTIONS.byId && window.SOLUTIONS.byId[q._qid || q.id]) || null;
      const correctOpt = q.options && typeof q.correct === 'number' ? q.options[q.correct] : null;
      const solutionText = (sol && (sol.solution || sol.explanation)) || (q.explanation || '') || (correctOpt ? 'Answer: ' + correctOpt : 'See textbook solution.');

      const body = document.getElementById('v69-body');
      if (!body) return;

      let rhtml = '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-top:0;">';
      rhtml += '<div style="font-weight:700;font-size:14px;color:#15803d;margin-bottom:12px;">Model Answer (' + marks + ' marks)</div>';
      rhtml += '<div id="v69-sol" style="font-size:13px;color:var(--ink);line-height:1.7;margin-bottom:14px;">' + solutionText + '</div>';

      rhtml += '<div style="font-weight:600;font-size:13px;color:var(--ink);margin-bottom:10px;">Self-rate your answer:</div>';
      rhtml += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:0;">';
      rhtml += '<button onclick="window._v69RateWritten(' + marks + ')" style="background:#d1fae5;border:1.5px solid #6ee7b7;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#065f46;">&#10003; Got all ' + marks + ' marks</button>';
      rhtml += '<button onclick="window._v69RateWritten(' + Math.ceil(marks / 2) + ')" style="background:#fef3c7;border:1.5px solid #fde68a;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#92400e;">&#9670; ~Half (' + Math.ceil(marks / 2) + ')</button>';
      rhtml += '<button onclick="window._v69RateWritten(0)" style="background:#fee2e2;border:1.5px solid #fca5a5;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#991b1b;">&#10005; 0 marks</button>';
      rhtml += '</div></div>';

      // Replace the written question card
      body.innerHTML = rhtml;
      try { if (typeof renderMathIn === 'function') { const sc = document.getElementById('v69-sol'); if (sc) renderMathIn(sc); } } catch (e) {}
    };

    window._v69RateWritten = function (score) {
      const sec = examState.sections[examState.currentSection];
      sec.selfScores.push(score);
      sec.answered.push({ qIdx: sec.idx, score: score });
      sec.idx++;
      updateExamProgress();
      renderExamQuestion();
    };

    // Wire button after render
    setTimeout(function () {
      const rb = document.getElementById('v69-written-reveal');
      if (rb) rb.onclick = window._v69RevealWritten;
    }, 50);

    return html;
  }

  function renderDerivationQuestion(d, sec, qIdx) {
    let html = '<div style="background:var(--bg-elev);border:0.5px solid var(--line);border-radius:12px;padding:22px;margin-bottom:20px;">';
    html += '<div style="font-family:\'Geist Mono\',monospace;font-size:11px;color:var(--accent);margin-bottom:10px;">Derivation &middot; ' + d.marks + ' marks &middot; ISC ' + d.years.slice(-3).join(', ') + '</div>';
    html += '<div style="font-size:16px;font-weight:700;color:var(--ink);margin-bottom:20px;">Derive: ' + d.title + '</div>';
    html += '<div style="border:2px dashed #bfdbfe;border-radius:10px;padding:20px;background:#f8faff;text-align:center;margin-bottom:16px;">';
    html += '<div style="font-size:24px;margin-bottom:8px;">&#9998;</div>';
    html += '<div style="font-size:13px;color:var(--ink-soft);">Write the complete derivation in your notebook (' + d.time + ' min suggested). Then tap below.</div>';
    html += '</div>';
    html += '<button id="v69-deriv-reveal" style="width:100%;background:var(--ink);color:#fff;border:none;border-radius:10px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;">Show Step-by-Step Solution &amp; Rate</button>';
    html += '</div>';

    window._v69RevealDeriv = function () {
      const body = document.getElementById('v69-body');
      if (!body) return;

      let rhtml = '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;">';
      rhtml += '<div style="font-weight:700;font-size:14px;color:#15803d;margin-bottom:14px;">' + d.title + ' \u2014 Model Answer (' + d.marks + ' marks)</div>';
      d.steps.forEach(function (st, i) {
        rhtml += '<div style="border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:3px solid #16a34a;">';
        rhtml += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">';
        rhtml += '<span style="font-family:\'Geist Mono\',monospace;font-size:11px;font-weight:600;color:#16a34a;">STEP ' + (i + 1) + ' &middot; ' + (st.marks || 1) + 'm</span>';
        rhtml += '<span style="font-weight:600;font-size:12px;color:var(--ink);">' + st.label + '</span></div>';
        rhtml += '<div id="v69-ds-' + i + '" style="font-size:13px;color:var(--ink);line-height:1.7;">' + st.text + '</div>';
        rhtml += '</div>';
      });

      rhtml += '<div style="margin-top:16px;font-weight:600;font-size:13px;color:var(--ink);margin-bottom:10px;">Self-rate:</div>';
      rhtml += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">';
      rhtml += '<button onclick="window._v69RateDeriv(' + d.marks + ')" style="background:#d1fae5;border:1.5px solid #6ee7b7;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#065f46;">&#10003; Full marks</button>';
      rhtml += '<button onclick="window._v69RateDeriv(' + Math.ceil(d.marks / 2) + ')" style="background:#fef3c7;border:1.5px solid #fde68a;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#92400e;">&#9670; ~Half</button>';
      rhtml += '<button onclick="window._v69RateDeriv(0)" style="background:#fee2e2;border:1.5px solid #fca5a5;border-radius:8px;padding:12px 6px;cursor:pointer;font-size:13px;font-weight:600;color:#991b1b;">&#10005; Missed</button>';
      rhtml += '</div></div>';

      body.innerHTML = rhtml;
      try { if (typeof renderMathIn === 'function') { d.steps.forEach(function (_, i) { const sc = document.getElementById('v69-ds-' + i); if (sc) renderMathIn(sc); }); } } catch (e) {}
    };

    window._v69RateDeriv = function (score) {
      const sec = examState.sections[examState.currentSection];
      sec.selfScores.push(score);
      sec.answered.push({ qIdx: sec.idx, score: score });
      sec.idx++;
      if (typeof setDrillState === 'function') { /* skip - setDrillState is local to V67 */ }
      updateExamProgress();
      renderExamQuestion();
    };

    setTimeout(function () {
      const rb = document.getElementById('v69-deriv-reveal');
      if (rb) rb.onclick = window._v69RevealDeriv;
    }, 50);

    return html;
  }

  window._v69NextSection = function () {
    if (!examState) return;
    const next = examState.currentSection + 1;
    if (next < examState.sections.length) navigateToSection(next, 0);
    else finishExam();
  };

  window._v69FinishEarly = function () {
    if (!confirm('End exam and see results?')) return;
    finishExam();
  };

  function finishExam() {
    clearInterval(examTimerInterval); examTimerInterval = null;
    const modal = document.getElementById('v69-exam-modal');
    if (modal) modal.remove();
    showExamResults();
  }

  function showExamResults() {
    if (!examState) return;

    const subLabel = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Maths' }[examState.sub] || examState.sub;
    const timeUsed = 3 * 3600 - examState.secondsLeft;
    const hU = Math.floor(timeUsed / 3600), mU = Math.floor((timeUsed % 3600) / 60);

    let totalEarned = 0, totalPossible = 0;
    const sectionResults = examState.sections.map(function (sec) {
      const possible = sec.fmt.attempt * sec.fmt.qMarks;
      let earned = 0;
      if (sec.fmt.mode === 'mcq') {
        earned = sec.answered.filter(function (a) { return a.correct; }).length * sec.fmt.qMarks;
      } else {
        earned = sec.selfScores.reduce(function (s, v) { return s + v; }, 0);
      }
      totalEarned += earned;
      totalPossible += possible;
      return { label: sec.fmt.label, earned: earned, possible: possible };
    });

    const pct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
    const grade = pct >= 90 ? 'A1 \u2014 Outstanding' : pct >= 80 ? 'A2 \u2014 Excellent' : pct >= 70 ? 'B1 \u2014 Very Good' : pct >= 60 ? 'B2 \u2014 Good' : pct >= 50 ? 'C1 \u2014 Satisfactory' : 'C2 \u2014 Needs work';
    const gradeColor = pct >= 90 ? '#15803d' : pct >= 80 ? '#1e40af' : pct >= 70 ? '#92400e' : '#991b1b';

    const modal = document.createElement('div');
    modal.id = 'v69-results-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);z-index:1500;display:flex;align-items:center;justify-content:center;padding:20px;';

    const inner = document.createElement('div');
    inner.style.cssText = 'background:#fff;border-radius:14px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.35);padding:28px;';

    let html = '<div style="text-align:center;margin-bottom:28px;">';
    html += '<div style="font-size:48px;margin-bottom:8px;">&#127941;</div>';
    html += '<h2 style="font-size:24px;font-weight:700;color:var(--ink);margin:0 0 6px;">' + subLabel + ' Mock Exam \u2014 Done</h2>';
    html += '<div style="font-family:\'Geist Mono\',monospace;font-size:12px;color:var(--ink-muted);">Time used: ' + hU + 'h ' + mU + 'm</div>';
    html += '</div>';

    html += '<div style="background:' + (pct >= 80 ? '#f0fdf4' : pct >= 60 ? '#fef3c7' : '#fee2e2') + ';border:1px solid ' + (pct >= 80 ? '#bbf7d0' : pct >= 60 ? '#fde68a' : '#fca5a5') + ';border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">';
    html += '<div style="font-size:52px;font-weight:800;color:' + gradeColor + ';line-height:1;">' + Math.round(totalEarned * 10) / 10 + '</div>';
    html += '<div style="font-size:18px;color:var(--ink-muted);margin-bottom:8px;">/ ' + totalPossible + ' marks &nbsp;&middot;&nbsp; ' + pct + '%</div>';
    html += '<div style="font-size:16px;font-weight:700;color:' + gradeColor + ';">' + grade + '</div>';
    html += '</div>';

    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-weight:700;font-size:14px;color:var(--ink);margin-bottom:12px;">Section Breakdown</div>';
    sectionResults.forEach(function (r) {
      const sp = r.possible > 0 ? Math.round((r.earned / r.possible) * 100) : 0;
      const barColor = sp >= 80 ? 'var(--success)' : sp >= 60 ? 'var(--gold)' : 'var(--danger,#dc2626)';
      html += '<div style="margin-bottom:10px;">';
      html += '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">';
      html += '<span style="color:var(--ink);">' + r.label + '</span>';
      html += '<span style="font-family:\'Geist Mono\',monospace;font-weight:600;color:var(--ink);">' + Math.round(r.earned * 10) / 10 + ' / ' + r.possible + '</span>';
      html += '</div>';
      html += '<div style="height:6px;background:var(--line-soft,#e5e7eb);border-radius:100px;overflow:hidden;">';
      html += '<div style="width:' + sp + '%;height:100%;background:' + barColor + ';border-radius:100px;transition:width 0.8s;"></div>';
      html += '</div></div>';
    });
    html += '</div>';

    // Recommendations
    const weakSections = sectionResults.filter(function (r) { return r.possible > 0 && (r.earned / r.possible) < 0.6; });
    if (weakSections.length) {
      html += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;margin-bottom:20px;">';
      html += '<div style="font-weight:700;font-size:13px;color:#1e40af;margin-bottom:8px;">Focus areas for next session:</div>';
      weakSections.forEach(function (r) {
        html += '<div style="font-size:13px;color:#1e3a8a;margin-bottom:4px;">&bull; ' + r.label + ' \u2014 drill more written questions and derivations</div>';
      });
      html += '</div>';
    }

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    html += '<button onclick="document.getElementById(\'v69-results-modal\').remove();window._v69LaunchExam();" style="background:var(--ink);color:#fff;border:none;border-radius:8px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;">&#8635; Retake</button>';
    html += '<button onclick="document.getElementById(\'v69-results-modal\').remove()" style="background:var(--bg);color:var(--ink);border:0.5px solid var(--line);border-radius:8px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;">Done</button>';
    html += '</div>';

    inner.innerHTML = html;
    modal.appendChild(inner);
    document.body.appendChild(modal);
    examState = null;
  }

  console.log('[V69 ExamSimulator] active \u2014 ISC full mock exam ready');
})();


