/* ============================================================
   SORAK · World Cup shared engine (window.WCEngine)
   - flash(root, lang): wires the parimutuel flash card + match
     canvas + chat by class names inside `root`.
   - render*(lang): return HTML strings for champion / groups /
     knockout / full-match / news lists (demos style via CSS).
   Depends on window.WC (wc-data.js).
   ============================================================ */
(function () {
  const W = window.WC;
  const $ = (r, s) => r.querySelector(s);
  const $$ = (r, s) => Array.from(r.querySelectorAll(s));
  function langFromUrl() {
    const u = new URLSearchParams(location.search).get('lang');
    return ['zh', 'en', 'ms'].includes(u) ? u : (localStorage.getItem('wc-lang') || 'zh');
  }

  /* ---------- static list renderers ---------- */
  function teamCell(id, lang) {
    const tm = W.TEAM[id]; return `<span class="wc-team"><span class="wc-flag">${tm.flag}</span>${tm[lang] || tm.en}</span>`;
  }
  function chg(v) {
    if (!v) return `<span class="wc-chg flat">—</span>`;
    const up = v > 0; return `<span class="wc-chg ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(v)}¢</span>`;
  }
  function renderChampion(lang) {
    return W.CHAMPION.map((m, i) => `<div class="wc-row" data-mkt="champ-${m.team}">
      <span class="wc-rank">${i + 1}</span>${teamCell(m.team, lang)}
      <span class="wc-cents">${m.yes}¢</span>${chg(m.chg)}
      <button class="wc-mini-buy" data-side="yes">${W.t('buy', lang)}</button></div>`).join('');
  }
  function renderGroups(lang) {
    return W.GROUPS.map(g => `<div class="wc-grp"><div class="wc-grp-h">${W.t('sec_groups', lang)} · ${g.g}</div>
      ${g.teams.map(x => `<div class="wc-row"><span class="wc-grow-lab">${W.L({ zh: '出线', en: 'Qualify', ms: 'Layak' }, lang)}</span>${teamCell(x.team, lang)}<span class="wc-cents sm">${x.yes}¢</span></div>`).join('')}</div>`).join('');
  }
  function renderKnockout(lang) {
    return W.KNOCKOUT.map(k => `<div class="wc-row">${teamCell(k.team, lang)}<span class="wc-ko-stage">${k.stage[lang] || k.stage.en}</span><span class="wc-cents sm">${k.yes}¢</span></div>`).join('');
  }
  function renderFullmatch(lang) {
    return W.FULLMATCH.map(m => `<div class="wc-mcard" data-mkt="${m.id}">
      <div class="wc-mq">${m.q[lang] || m.q.en}</div>
      <div class="wc-mrow"><span class="wc-cents big">${m.yes}¢</span><span class="wc-clab">${W.t('chance', lang)}</span>${chg(m.chg)}
        <span class="wc-vol">${W.t('vol', lang)} $${W.fmtInt(m.vol)}</span></div>
      <div class="wc-duo"><button class="wc-pill yes">${W.t('yes', lang)} · ${m.yes}¢</button><button class="wc-pill no">${W.t('no', lang)} · ${100 - m.yes}¢</button></div>
    </div>`).join('');
  }
  function renderNews(lang, limit) {
    const items = limit ? W.NEWS.slice(0, limit) : W.NEWS;
    const ago = m => m < 60 ? `${m}${W.L({ zh: '分钟前', en: 'm ago', ms: 'm lalu' }, lang)}` : `${Math.floor(m / 60)}${W.L({ zh: '小时前', en: 'h ago', ms: 'j lalu' }, lang)}`;
    return items.map(n => `<a class="wc-news" href="javascript:void(0)">
      <div class="wc-news-thumb" style="background:${n.grad}"><span class="wc-news-flags">${n.teams.map(tt => W.TEAM[tt].flag).join('')}</span></div>
      <div class="wc-news-body"><div class="wc-news-src">${n.src} · ${ago(n.mins)}</div>
        <div class="wc-news-title">${n.title[lang] || n.title.en}</div>
        <div class="wc-news-tags">${n.teams.map(tt => `<span>${W.TEAM[tt][lang] || W.TEAM[tt].en}</span>`).join('')}</div></div></a>`).join('');
  }

  /* ---------- live match canvas (optional) ---------- */
  function startCanvas(cv, state) {
    const cx = cv.getContext('2d');
    const ball = { x: 480, y: 270, tx: 480, ty: 270 };
    const dots = []; for (let i = 0; i < 10; i++) dots.push({ x: Math.random() * 900 + 30, y: Math.random() * 480 + 30, team: i < 5, tx: 0, ty: 0, t: 0 });
    function draw() {
      const g = cx.createLinearGradient(0, 0, 0, 540); g.addColorStop(0, '#0d5a2f'); g.addColorStop(1, '#0a4423');
      cx.fillStyle = g; cx.fillRect(0, 0, 960, 540);
      cx.strokeStyle = 'rgba(255,255,255,.38)'; cx.lineWidth = 2; cx.strokeRect(30, 30, 900, 480);
      cx.beginPath(); cx.moveTo(480, 30); cx.lineTo(480, 510); cx.stroke();
      cx.beginPath(); cx.arc(480, 270, 70, 0, 7); cx.stroke();
      cx.strokeRect(30, 160, 110, 220); cx.strokeRect(820, 160, 110, 220);
      cx.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 9; i++) if (i % 2) cx.fillRect(30 + i * 100, 30, 100, 480);
      dots.forEach(d => { if (d.t <= 0) { d.tx = Math.random() * 860 + 50; d.ty = Math.random() * 440 + 50; d.t = 120 + Math.random() * 120; } d.t--; d.x += (d.tx - d.x) * .012; d.y += (d.ty - d.y) * .012; cx.beginPath(); cx.arc(d.x, d.y, 7, 0, 7); cx.fillStyle = d.team ? '#F7E03A' : '#5BA3FF'; cx.fill(); cx.strokeStyle = 'rgba(0,0,0,.3)'; cx.lineWidth = 1.5; cx.stroke(); });
      ball.x += (ball.tx - ball.x) * .04; ball.y += (ball.ty - ball.y) * .04; if (Math.abs(ball.tx - ball.x) < 6) { ball.tx = Math.random() * 820 + 70; ball.ty = Math.random() * 420 + 60; }
      cx.beginPath(); cx.arc(ball.x, ball.y, 6.5, 0, 7); cx.fillStyle = '#fff'; cx.fill(); cx.strokeStyle = '#0a3'; cx.stroke();
      requestAnimationFrame(draw);
    }
    draw(); state._ball = ball;
  }

  /* ---------- flash engine ---------- */
  function flash(root, lang) {
    lang = lang || langFromUrl();
    const S = { bal: 1000, streak: 0, amt: 50, side: null, played: 0, consec: 0, score: [0, 0], min: 12, events: [], market: null };
    const RING = 131.9;
    const cv = $(root, '.wcx-canvas'); if (cv) startCanvas(cv, S);
    const chat = $(root, '.wcx-chat');
    const setText = (sel, txt) => { const e = $(root, sel); if (e) e.textContent = txt; };
    const setHTML = (sel, h) => { const e = $(root, sel); if (e) e.innerHTML = h; };

    function chatPush(n, m) { if (!chat) return; const d = document.createElement('div'); d.className = 'wcx-msg'; d.innerHTML = '<b>' + n + '</b> ' + m; chat.appendChild(d); while (chat.children.length > 40) chat.firstChild.remove(); chat.scrollTop = chat.scrollHeight; }
    function host(m) { const h = $(root, '.wcx-host'); if (!h) return; h.textContent = m; h.style.display = 'block'; clearTimeout(h._x); h._x = setTimeout(() => h.style.display = 'none', 4000); }

    // match sim
    function ev(type) {
      S.events.push({ type, min: S.min });
      if (type === 'goal') { const tm = Math.random() < .5 ? 0 : 1; S.score[tm]++; const sc = $(root, '.wcx-score'); if (sc) sc.textContent = S.score[0] + ' : ' + S.score[1]; const gf = $(root, '.wcx-goal'); if (gf) { gf.style.display = 'flex'; setTimeout(() => gf.style.display = 'none', 1500); } chatPush('⚽', 'GOLAZO!!'); }
    }
    setInterval(() => {
      S.min++; if (S.min > 90) { S.min = 1; S.score = [0, 0]; const sc = $(root, '.wcx-score'); if (sc) sc.textContent = '0 : 0'; S.events = []; }
      setText('.wcx-clock', S.min + "'");
      const r = Math.random();
      if (r < .045) ev('goal'); else if (r < .2) S.events.push({ type: 'shot', min: S.min }); else if (r < .38) S.events.push({ type: 'corner', min: S.min }); else if (r < .46) S.events.push({ type: 'card', min: S.min }); else if (r < .5) S.events.push({ type: 'var', min: S.min }); else if (r < .52) S.events.push({ type: 'pen', min: S.min });
    }, 1300);

    function newPool() {
      const def = W.FLASH[Math.floor(Math.random() * W.FLASH.length)];
      const base = 600 + Math.random() * 900;
      S.market = { def, yes: base * (0.7 + def.lean * 0.8), no: base * (0.7 + (1 - def.lean) * 0.8), phase: 'open', left: 20, lockMin: null, bet: null };
      S.side = null;
      setText('.wcx-fq', def.q[lang] || def.q.en);
      const srcEl = $(root, '.wcx-src'); if (srcEl) srcEl.textContent = (def.src ? (def.src[lang] || def.src.en) : '');
      $$(root, '.wcx-side').forEach(b => b.classList.remove('on'));
      const st = $(root, '.wcx-state'); if (st) { st.className = st.className.replace(/\b(win|lose|lock)\b/g, '').trim(); st.style.display = 'none'; }
      const eng = $(root, '.wcx-eng'); if (eng) eng.textContent = def.eng === 'free' ? W.t('free_points', lang) : W.t('real_money', lang);
      fsm('open'); render(); upd();
      host((W.t('host_call', lang)).replace('{q}', def.q[lang] || def.q.en));
    }
    function fsm(ph) { const o = { open: 0, lock: 1, prov: 2, official: 3 }[ph]; $$(root, '.wcx-fsm [data-step]').forEach((s, i) => s.classList.toggle('on', i === o)); }
    function render() {
      const m = S.market; if (!m) return;
      const my = W.payoutMult(m.yes, m.no, 'yes'), mn = W.payoutMult(m.yes, m.no, 'no');
      const ht = m.yes / (m.yes + m.no);
      const heatW = f => f > .6 ? W.t('heat_hi', lang) : f < .4 ? W.t('heat_lo', lang) : W.t('heat_mid', lang);
      $$(root, '.wcx-side').forEach(b => { const side = b.dataset.side; const mult = side === 'yes' ? my : mn; const mv = b.querySelector('.wcx-mult'); if (mv) mv.textContent = '≈' + mult.toFixed(1) + '×'; const hv = b.querySelector('.wcx-heat'); if (hv) hv.textContent = W.t('heat', lang) + ' ' + heatW(side === 'yes' ? ht : 1 - ht); });
      const pot = $(root, '.wcx-potential');
      if (pot) { if (m.bet) { const mult = W.payoutMult(m.yes, m.no, m.bet.side); pot.innerHTML = W.t('you_stake', lang) + ' ' + m.bet.amt + ' · ' + W.t('if_win', lang) + ' <b>' + W.fmtInt(m.bet.amt * mult) + '</b>'; } else if (S.side) { const mult = W.payoutMult(m.yes, m.no, S.side); pot.innerHTML = W.t('if_win', lang) + ' <b>' + W.fmtInt(S.amt * mult) + '</b> ' + W.t('points', lang); } else pot.textContent = W.t('pick_side', lang); }
    }
    function upd() { const g = $(root, '.wcx-go'); if (!g) return; const m = S.market; if (!m || m.phase !== 'open') { g.textContent = W.t('fsm_lock', lang); g.disabled = true; return; } if (m.bet) { g.textContent = W.t('locked', lang) + ' ' + m.bet.amt; g.disabled = true; return; } g.textContent = W.t('bet', lang) + ' ' + S.amt + ' ' + W.t('points', lang); g.disabled = false; }

    // interactions
    $$(root, '.wcx-side').forEach(b => b.addEventListener('click', () => { const m = S.market; if (!m || m.phase !== 'open' || m.bet) return; S.side = b.dataset.side; $$(root, '.wcx-side').forEach(x => x.classList.toggle('on', x === b)); render(); upd(); }));
    $$(root, '.wcx-chip').forEach(c => c.addEventListener('click', () => { S.amt = +c.dataset.amt; $$(root, '.wcx-chip').forEach(x => x.classList.toggle('on', x === c)); render(); upd(); }));
    const goBtn = $(root, '.wcx-go'); if (goBtn) goBtn.addEventListener('click', () => { const m = S.market; if (!m || m.phase !== 'open' || m.bet) return; if (!S.side) { toast(root, W.L({ zh: '先选 YES 或 NO', en: 'Pick a side', ms: 'Pilih dulu' }, lang)); return; } if (S.bal < S.amt) { toast(root, W.L({ zh: '积分不足', en: 'Low balance', ms: 'Baki rendah' }, lang)); return; } S.bal -= S.amt; setText('.wcx-bal', W.fmtInt(S.bal)); m[S.side] += S.amt; m.bet = { side: S.side, amt: S.amt }; render(); upd(); chatPush(W.L({ zh: '你', en: 'You', ms: 'Anda' }, lang), (S.side === 'yes' ? W.t('yes', lang) : W.t('no', lang)) + ' ✊'); });

    // simulated crowd
    setInterval(() => { const m = S.market; if (!m || m.phase !== 'open') return; m.yes += Math.random() * 60 * (0.5 + m.def.lean); m.no += Math.random() * 60 * (0.5 + (1 - m.def.lean)); render(); }, 900);

    // countdown + settle
    setInterval(() => { const m = S.market; if (!m) return;
      if (m.phase === 'open') {
        m.left -= .1; const frac = Math.max(0, m.left / 20);
        const fg = $(root, '.wcx-ring-fg'); if (fg) { fg.setAttribute('stroke-dashoffset', (RING * (1 - frac)).toFixed(1)); fg.setAttribute('stroke', m.left <= 3 ? '#E8A33C' : '#C9A84C'); }
        setText('.wcx-ring-num', Math.ceil(Math.max(0, m.left)));
        if (m.left <= 0) { m.phase = 'lock'; m.lockMin = S.min; fsm('lock'); const st = $(root, '.wcx-state'); if (st) { st.style.display = 'block'; st.className = (st.className.replace(/\b(win|lose|lock)\b/g, '').trim()) + ' lock'; st.textContent = m.bet ? (W.t('locked', lang) + ' ' + m.bet.amt) : W.L({ zh: '本轮未参与', en: 'Sat this one out', ms: 'Lepas kali ini' }, lang); } upd(); S.played++; S.consec++; setText('.wcx-played', S.played); const bar = $(root, '.wcx-rgbar'); if (bar) bar.style.width = Math.min(100, S.played / 12 * 100) + '%'; const rgt = $(root, '.wcx-rgtxt'); if (rgt) rgt.textContent = W.L({ zh: '本场', en: 'Session', ms: 'Sesi' }, lang) + ' ' + S.played + '/12 · ' + W.t('rg_cool', lang); if (S.consec >= 6) cooldown(); }
      } else if (m.phase === 'lock') {
        if (!m._prov && S.min >= m.lockMin + Math.ceil(m.def.win / 5)) { m._prov = true; fsm('prov'); }
        if (S.min >= m.lockMin + Math.ceil(m.def.win / 5) || S.min < m.lockMin) {
          const hit = m.def.ev === 'none' ? (Math.random() < m.def.lean) : S.events.some(e => e.type === m.def.ev && e.min >= m.lockMin && e.min <= m.lockMin + Math.ceil(m.def.win / 5) + 1);
          m.phase = 'done'; fsm('official');
          const st = $(root, '.wcx-state');
          if (m.bet) { const won = (m.bet.side === 'yes') === hit; if (won) { const mult = W.payoutMult(m.yes, m.no, m.bet.side); const pay = Math.round(m.bet.amt * mult); S.bal += pay; S.streak++; if (st) { st.className = (st.className.replace(/\b(win|lose|lock)\b/g, '').trim()) + ' win'; st.textContent = '🎉 ' + W.t('settled_win', lang) + ' +' + W.fmtInt(pay) + ' (' + mult.toFixed(2) + '×)'; } toast(root, '🎉 +' + W.fmtInt(pay)); } else { S.streak = 0; if (st) { st.className = (st.className.replace(/\b(win|lose|lock)\b/g, '').trim()) + ' lose'; st.textContent = '😤 ' + W.t('settled_lose', lang); } } setText('.wcx-bal', W.fmtInt(S.bal)); setText('.wcx-streak', '×' + S.streak); }
          else if (st) { st.textContent = (hit ? '✓' : '–'); }
          if (!S._cool) setTimeout(newPool, 4200);
        }
      }
    }, 100);

    function cooldown() {
      S._cool = true; const body = $(root, '.wcx-pool'); const cool = $(root, '.wcx-cool'); if (body) body.style.display = 'none'; if (cool) cool.style.display = 'block';
      let t = 12; const cd = $(root, '.wcx-cd'); if (cd) cd.textContent = t;
      const iv = setInterval(() => { t--; if (cd) cd.textContent = t; if (t <= 0) { clearInterval(iv); S._cool = false; S.consec = 0; if (body) body.style.display = ''; if (cool) cool.style.display = 'none'; newPool(); } }, 1000);
    }

    // chat ambience
    const names = ['Hafiz', '小薇', 'Daniel', 'Nurul', '美玲', 'Acap', 'JLow', 'Aiman'];
    const lines = { zh: ['进一个啦!!', 'YES 冲', '凌晨场还是嗨', '巴西稳', '这个 NO 对', '派彩涨了', 'mamak 走起'], en: ['GOAL pls!!', 'YES all in', 'dawn games hit different', 'Brazil steady', 'NO is value', 'payout climbing', 'mamak time'], ms: ['GOL la!!', 'YES je', 'subuh pun rancak', 'Brazil mantap', 'NO value ni', 'bayaran naik', 'gerai mamak'] };
    setInterval(() => chatPush(names[Math.floor(Math.random() * names.length)], lines[lang][Math.floor(Math.random() * lines[lang].length)]), 2400);
    chatPush('Sorak', W.t('mamak', lang) + ' 🎙');
    newPool();
  }

  function toast(root, msg) { let tEl = $(root, '.wcx-toast'); if (!tEl) { tEl = document.createElement('div'); tEl.className = 'wcx-toast'; root.appendChild(tEl); } tEl.textContent = msg; tEl.classList.add('on'); clearTimeout(tEl._x); tEl._x = setTimeout(() => tEl.classList.remove('on'), 2200); }

  window.WCEngine = { flash, renderChampion, renderGroups, renderKnockout, renderFullmatch, renderNews, langFromUrl, toast };
})();
