// 📖 史萊姆圖鑑：大廳按鈕 → 小格子瀏覽 → 點擊翻成角色卡（稀有度、能力、相剋）
// 史萊姆圖片在開啟時用遊戲本身的繪圖程式即時畫出，造型改了圖鑑會自動跟著變
(() => {
const D = [
 {id:'blackhole',n:'黑洞',e:'🕳',r:5,t:'清場',l:'深紫色＋旋渦',sk:'事件視界',a:'所在的行被消除時，清空整個盤面。代價是本次得分只拿 8 成。',rate:'約 1.0%／顆',m:['sp'],win:[['zombie','吞掉的殭屍全部淨化，每隻 +100'],['queen','連蟻后和幼蟲一起清空']],lose:[],mutual:[['twin','不會同時出現在場上']]},
 {id:'twin',n:'雙生',e:'☯',r:4,t:'轉機',l:'黑白各半、陰陽眼',sk:'陰陽連打',a:'堆疊超過半場才會出現。所在的行被消除後，接下來連續 5–8 個 2×2 方塊。',rate:'堆過半後 12%／顆',m:['sp'],win:[],lose:[],mutual:[['blackhole','不會同時出現在場上']]},
 {id:'queen',n:'蟻后',e:'👑',r:3,t:'繁殖',l:'金色皇冠＋觸角＋螞蟻大顎',sk:'無限蟲巢',a:'待在場上會生幼蟲（特殊：每 2 顆、最多 5 隻；蟲萊姆：每 1 顆、最多 2 隻；場上最多 4 隻蟻后、6 隻幼蟲）。消掉她 +300、combo 加成 ×2。',rate:'1.3%／顆（蟲萊姆約 20%）',m:['sp','bug'],win:[['normal','把一般史萊姆變成幼蟲']],lose:[['bomb','炸到就算消掉，照拿 +300'],['blackhole','清場時一起被吸走']],mutual:[]},
 {id:'melt',n:'融化',e:'💧',r:3,t:'救援',l:'身上掛水滴',sk:'滴落補洞',a:'落地那一刻往下滴，補滿正下方的空洞，之後變回一般史萊姆。',rate:'約 1.7%／顆',m:['sp'],win:[['larva','可以補上幼蟲啃出來的洞']],lose:[],mutual:[]},
 {id:'hard',n:'硬殼垃圾',e:'🛡',r:3,t:'攻擊',l:'灰色戴頭盔',sk:'鐵頭防線',a:'PK 特殊模式：對手一次送出 2 行以上時，最底那行是硬殼。第一次填滿只會脫殼，要消 2 次。',rate:'由對手攻擊產生',m:['pk'],win:[['normal','讓你的行多消一次']],lose:[],mutual:[]},
 {id:'bomb',n:'炸彈',e:'💣',r:2,t:'爆破',l:'深色身體＋引線火花',sk:'上下連爆',a:'所在的行被消除時，連同正上方、正下方整行一起炸掉，照一般消行計分。',rate:'約 2.3%／顆',m:['sp'],win:[['zombie','同一行或炸到的行裡有殭屍：淨化 +100，不冒垃圾'],['queen','炸到蟻后也算消掉她']],lose:[],mutual:[]},
 {id:'star',n:'星星',e:'⭐',r:2,t:'獎勵',l:'戴一顆大星星面罩',sk:'閃耀加倍',a:'所在的行被消除時，該次分數 ×2；PK 攻擊 +1。',rate:'約 2.7%／顆',m:['sp'],win:[['hard','PK 多送 1 行，更容易觸發對手的硬殼垃圾']],lose:[],mutual:[]},
 {id:'zombie',n:'殭屍',e:'🧟',r:2,t:'陷阱',l:'灰綠色、縫線、紅點',sk:'屍變反撲',a:'用一般方式消掉它，會從底部冒出 2 行垃圾（最多 4 行）。',rate:'約 2.2%／顆',m:['sp'],win:[['normal','一般消除會冒垃圾']],lose:[['bomb','被炸到：淨化 +100'],['blackhole','被吸走：淨化 +100']],mutual:[]},
 {id:'larvaCracked',n:'裂開幼蟲',e:'🐛',r:2,t:'繁殖',l:'奶嘴掉了、身上多一道裂痕',sk:'硬撐一口氣',a:'蟲萊姆通啦：幼蟲所在的行第一次填滿只會裂開，剛放進去的格子被彈開。再填滿一次才消得掉。',rate:'幼蟲受傷狀態',m:['bug'],win:[],lose:[],mutual:[]},
 {id:'larva',n:'幼蟲',e:'🐛',r:1,t:'繁殖',l:'淡色身體＋小觸角＋奶嘴',sk:'快快長大',a:'蟻后生出來的。特殊模式 3 回合、蟲萊姆 3 回合（蟻后已滿時先不長大）沒消掉就長成新蟻后；蟲萊姆裡會長在堆疊上方，長大時啃掉旁邊一格。',rate:'由蟻后生出',m:['sp','bug'],win:[['normal','佔空間、啃洞']],lose:[['blackhole','清場時一起被吸走']],mutual:[]},
 {id:'normal',n:'一般史萊姆',e:'🟣',r:1,t:'基本',l:'圓眼睛、沒有配件',sk:'Q 彈',a:'沒有特殊效果，是大家的對照組。',rate:'其餘全部',m:['sp','bug','pk'],win:[],lose:[['queen','會被變成幼蟲'],['zombie','被冒出的垃圾墊高']],mutual:[]},
];
const byId = Object.fromEntries(D.map(d => [d.id, d]));
const CELL = { star: '#4ecca3|star', bomb: '#ff9f43|bomb', melt: '#54a0ff|melt', zombie: '#4ecca3|zombie', blackhole: '#000|blackhole', twin: '#fff|twin', queen: '#ff6b6b|queen', larva: '#feca57|larva|0', larvaCracked: '#feca57|larva|1|1', hard: '#6b6b80|hard', normal: '#a29bfe' };
const MN = { sp: '✨ 特殊', bug: '🐜 蟲萊姆', pk: '⚔ PK' };
let S = null, list = D, cur = 0;
const sprites = () => {
    if (S) return S;
    S = {};
    const P = typeof SlimeTetris !== 'undefined' ? SlimeTetris.prototype : null;   // class 宣告不會掛在 window 上
    for (const [k, cell] of Object.entries(CELL)) {
        const c = document.createElement('canvas'); c.width = 120; c.height = 120;
        try { P.drawSlimeBlock.call(P, c.getContext('2d'), 0.12, 0.2, cell, 96); } catch (e) { console.warn(e); }
        S[k] = c.toDataURL('image/png');
    }
    return S;
};
const st = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const $ = s => document.querySelector(s);
function build() {
    const ov = document.createElement('div');
    ov.id = 'codex'; ov.className = 'cx hidden';
    ov.innerHTML = `
      <div class="cx-wrap">
        <div class="cx-head"><h2>📖 史萊姆圖鑑</h2><button class="cx-back" id="cx-back">← 返回大廳</button></div>
        <p class="cx-sub">點一下史萊姆翻開角色卡</p>
        <div class="cx-tabs" id="cx-tabs"><button data-m="all" class="on">全部</button><button data-m="sp">✨ 特殊</button><button data-m="bug">🐜 蟲萊姆</button><button data-m="pk">⚔ PK</button></div>
        <div class="cx-grid" id="cx-grid"></div>
      </div>
      <div class="cx-ov" id="cx-ov" role="dialog" aria-modal="true" aria-label="角色卡">
        <button class="cx-x" id="cx-x" aria-label="關閉">✕</button>
        <div class="cx-flip" id="cx-flip"><div class="cx-face cx-backface"><span>🟢</span></div><div class="cx-face cx-front" id="cx-front"></div></div>
        <div class="cx-nav"><button id="cx-prev" aria-label="上一張">‹</button><button id="cx-next" aria-label="下一張">›</button></div>
      </div>`;
    document.body.appendChild(ov);
    const grid = $('#cx-grid'), cov = $('#cx-ov'), flip = $('#cx-flip'), front = $('#cx-front');
    const render = (m) => {
        const sp = sprites();
        list = D.filter(d => m === 'all' || d.m.includes(m));
        grid.innerHTML = list.map((d, i) => `<button class="cx-tile r${d.r}" data-i="${i}"><img alt="" src="${sp[d.id]}"><b>${d.n}</b><i>${'★'.repeat(d.r)}</i></button>`).join('');
        document.querySelectorAll('#cx-tabs button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
    };
    const chips = (arr, cls, label) => arr.length ? `<div><em class="${cls}">${label}</em>${arr.map(([id, why]) => `<span><button class="cx-chip" data-go="${id}">${byId[id].e} ${byId[id].n}</button> ${why}</span>`).join('')}</div>` : '';
    const fill = (d) => {
        front.className = 'cx-face cx-front r' + d.r;
        const rel = chips(d.win, 'k1', '剋制') + chips(d.lose, 'k2', '被剋') + chips(d.mutual, 'k3', '互斥');
        front.innerHTML = `<div class="cx-top"><span class="cx-type">${d.t}型</span><span class="cx-stars">${st(d.r)}</span></div>
          <div class="cx-art"><img alt="" src="${sprites()[d.id]}"></div><h3>${d.e} ${d.n}</h3><div class="cx-look">${d.l}</div>
          <div class="cx-box"><h4>角色能力・${d.sk}</h4><p>${d.a}</p></div>
          <div class="cx-box"><h4>相剋</h4><div class="cx-rel">${rel || '<div>沒有特別的相剋關係</div>'}</div></div>
          <div class="cx-meta"><span>出現：${d.rate}</span><span>${d.m.map(x => MN[x]).join('・')}</span></div>`;
    };
    const open = (i) => { cur = (i + list.length) % list.length; fill(list[cur]); cov.classList.add('open'); flip.classList.remove('shown'); void flip.offsetWidth; requestAnimationFrame(() => flip.classList.add('shown')); };
    const closeCard = () => { cov.classList.remove('open'); flip.classList.remove('shown'); };
    grid.addEventListener('click', e => { const b = e.target.closest('.cx-tile'); if (b) open(+b.dataset.i); });
    $('#cx-tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) render(b.dataset.m); });
    $('#cx-x').onclick = closeCard;
    $('#cx-prev').onclick = () => open(cur - 1);
    $('#cx-next').onclick = () => open(cur + 1);
    $('#cx-back').onclick = () => ov.classList.add('hidden');
    cov.addEventListener('click', e => {
        const g = e.target.closest('[data-go]');
        if (g) { let i = list.findIndex(d => d.id === g.dataset.go); if (i < 0) { render('all'); i = list.findIndex(d => d.id === g.dataset.go); } open(i); return; }
        if (e.target === cov) closeCard();
    });
    document.addEventListener('keydown', e => { if (!cov.classList.contains('open')) return; if (e.key === 'Escape') closeCard(); if (e.key === 'ArrowRight') open(cur + 1); if (e.key === 'ArrowLeft') open(cur - 1); });
    let sx = null;
    flip.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    flip.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) open(cur + (dx < 0 ? 1 : -1)); sx = null; });
    return () => { render('all'); ov.classList.remove('hidden'); ov.scrollTop = 0; };
}
let show = null;
// 大廳出現後，在「單人遊戲」按鈕下方加入圖鑑按鈕
const addButton = () => {
    const single = document.getElementById('pk-single');
    if (!single || document.getElementById('pk-codex')) return !!single;
    const btn = document.createElement('button');
    btn.id = 'pk-codex'; btn.className = 'ui-btn pk-codex-btn'; btn.textContent = '📖 史萊姆圖鑑';
    btn.onclick = () => { if (!show) show = build(); show(); };
    single.after(btn);
    return true;
};
if (!addButton()) {
    const mo = new MutationObserver(() => { if (addButton()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
}
})();
