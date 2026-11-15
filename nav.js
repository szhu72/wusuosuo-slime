// ⬅ 手機「返回鍵」：在遊戲裡按返回，會回到上一層畫面，而不是直接離開網站
//   卡片 → 圖鑑 → 大廳；遊戲中／結算畫面 → 大廳；房間 → 離開房間；大廳 → 再按一次才離開網站
(() => {
    const vis = (id) => { const el = document.getElementById(id); return !!el && !el.classList.contains('hidden') && el.offsetParent !== null; };
    const lobbyUrl = () => location.pathname + (new URLSearchParams(location.search).get('net') ? '?net=' + new URLSearchParams(location.search).get('net') : '');
    const arm = () => { try { history.pushState({ slimeBack: 1 }, ''); } catch (e) {} };
    // 依目前畫面決定返回要做什麼；回傳 false 代表已在大廳最上層，讓返回鍵正常離開
    const goBack = () => {
        const card = document.getElementById('cx-ov');
        if (card && card.classList.contains('open')) { document.getElementById('cx-x').click(); return true; }
        const codex = document.getElementById('codex');
        if (codex && !codex.classList.contains('hidden')) { document.getElementById('cx-back').click(); return true; }
        if (vis('pk-result')) { const b = document.getElementById('pk-tolobby'); if (b) b.click(); return true; }
        if (vis('game-overlay')) { location.href = lobbyUrl(); return true; }
        if (vis('pk-menu-btn')) {
            if (document.body.classList.contains('pk-mode')) { document.getElementById('pk-menu-btn').click(); return true; }   // PK：按鈕本身會先詢問
            let ok = true; try { ok = window.confirm('離開目前這局，回到大廳？'); } catch (e) {}   // 單人：避免誤觸返回就丟掉這局
            if (ok) location.href = lobbyUrl();
            return true;
        }
        if (vis('pk-room')) { const b = document.getElementById('pk-leave'); if (b) b.click(); return true; }
        return false;
    };
    window.addEventListener('popstate', () => { if (goBack()) arm(); });
    // 使用者第一次點畫面後才放入一層返回紀錄（部分瀏覽器要求先有互動）
    const once = () => { arm(); window.removeEventListener('pointerdown', once, true); };
    window.addEventListener('pointerdown', once, true);
})();
