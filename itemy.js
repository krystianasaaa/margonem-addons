(function () {
    'use strict';

    const LS_KEY      = 'yuuki_custom_items_v1';
    const LS_MINI_POS = 'yci_mini_pos';

    function loadItems() {
        try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
    }
    function saveItems(list) {
        try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
    }

    const ABS_URL_RE    = /^https?:\/\//;
    const CDN_ITEMY_RE  = /^https?:\/\/[^/]+\/obrazki\/itemy\//;
    const HASH_RE       = /([0-9a-f]{64})/i;
    const SERVER_FIELDS = ['loc','x','y','rx','ry','st','name','icon','stat','cl','pr','tpl','hid','own','enhancement_upgrade_lvl'];

    function buildLookups(list) {
        const byId = {}, byHid = {};
        for (const entry of list) {
            if (!entry.enabled) continue;
            if (/^\d+$/.test(entry.key)) { byId[entry.key] = entry; }
            else { const m = String(entry.key).match(HASH_RE); if (m) byHid[m[1].toLowerCase()] = entry; }
        }
        return { byId, byHid };
    }

    let lookups = buildLookups(loadItems());

    function lookupOverride(id, hid) {
        if (id != null && lookups.byId[id]) return lookups.byId[id];
        if (hid) { const m = String(hid).match(HASH_RE); if (m && lookups.byHid[m[1].toLowerCase()]) return lookups.byHid[m[1].toLowerCase()]; }
        return null;
    }

    function parseStat(statStr) {
        const map = new Map();
        if (!statStr) return map;
        for (const part of statStr.split(';')) {
            const eq = part.indexOf('=');
            if (eq === -1) { if (part) map.set(part, null); }
            else map.set(part.slice(0, eq), part.slice(eq + 1));
        }
        return map;
    }
    function serializeStat(map) {
        const parts = [];
        for (const [k, v] of map) parts.push(v === null ? k : `${k}=${v}`);
        return parts.join(';');
    }
    function resolveIcon(icon) {
        if (icon === undefined || icon === '') return { rel: null, abs: null };
        const stripped = icon.replace(CDN_ITEMY_RE, '');
        if (stripped !== icon) return { rel: stripped, abs: null };
        if (ABS_URL_RE.test(icon)) return { rel: null, abs: icon };
        return { rel: icon, abs: null };
    }

    function buildLootText(entry) {
        const nick    = String(entry.lootBy      || '').trim();
        const monster = String(entry.lootMonster || '').trim();
        const date    = String(entry.lootDate    || '').trim();
        if (!nick && !monster && !date) return null;
        let ts = 0;
        if (/^\d+$/.test(date)) {
            ts = parseInt(date, 10);
        } else if (/\d{2}\.\d{2}\.\d{4}/.test(date)) {
            const [d, m, y] = date.split('.');
            ts = Math.floor(new Date(`${y}-${m}-${d}T12:00:00Z`).getTime() / 1000);
        }
        const group = entry.lootGroup || '1';
        return `${nick},m,${group},${ts},${monster}`;
    }

    function entryToOv(entry) {
        const upgRaw = entry.enhancementUpgradeLvl;
        const upgNum = (upgRaw !== undefined && upgRaw !== '') ? Number(upgRaw) : undefined;
        return {
            nazwa: entry.nazwa || undefined,
            opis: entry.opis || undefined,
            rzadkosc: entry.rzadkosc || undefined,
            grafika: entry.grafika || undefined,
            typ: entry.typ !== '' ? Number(entry.typ) : undefined,
            profesja: entry.profesja || undefined,
            lvl: entry.lvl !== '' ? Number(entry.lvl) : undefined,
            wartosc: entry.wartosc !== '' ? Number(entry.wartosc) : undefined,
            statystyki: entry.statystyki || undefined,
            tylkoNoweStatystyki: !!entry.tylkoNoweStatystyki,
            lootText: buildLootText(entry) || undefined,
            binding: entry.binding || '',
            enhancementUpgradeLvl: (upgNum !== undefined && !isNaN(upgNum)) ? upgNum : undefined,
            enhancementStat: entry.enhancementStat || undefined,
        };
    }

    const KNOWN_GAMEPLAY_STATS = new Set([
        'da','ds','dz','di','sa','hp','heal','ac','acm','act','blok','evade',
        'acdmg','resdmg','adest','absorb','absorbm','manabon','energybon','slow',
        'crit','critval','critmval','lowcrit','enfatig','manafatig','endest',
        'manadest','lowevade','dmgmul','dmgmulphysical','dmgmulpoison','dmgmulwound',
        'dmgmulfire','dmgmulfrost','dmgmullight','dmgmulcombo','resmanaendest',
        'lowcritallval','lowheal2turns','armor','resfire','resfrost','reslight',
        'pierce','pierceb','contra','abdest',
    ]);

    const ALWAYS_PRESERVE_KEYS = new Set([
        'opis','rarity','lvl','reqp','enhancement_upgrade_lvl',
        'greenstat','loot','permbound','soulbound','legbon',
    ]);

    function shouldPreserveKey(key) {
        return ALWAYS_PRESERVE_KEYS.has(key) || !KNOWN_GAMEPLAY_STATS.has(key);
    }

    function patchItemDOM(itemId, upgradeLvl) {
        const itemEl = document.querySelector(`.item-id-${itemId}`);
        if (itemEl) {
            itemEl.dataset.upgrade = String(upgradeLvl);
        }
        patchTooltipStar(upgradeLvl);
    }

    function patchTooltipStar(upgradeLvl) {
        const starEl = document.querySelector('.tip-item-stat-enhancement_upgrade_lvl');
        if (!starEl) return;
        starEl.className = starEl.className.replace(/icon-star-\d+/, `icon-star-${upgradeLvl}`);
    }

    function hookTooltipRender(itemId, upgradeLvl) {
        const obs = new MutationObserver(() => {
            const starEl = document.querySelector('.tip-item-stat-enhancement_upgrade_lvl');
            if (starEl) {
                starEl.className = starEl.className.replace(/icon-star-\d+/, `icon-star-${upgradeLvl}`);
                const itemEl = document.querySelector(`.item-id-${itemId}`);
                if (itemEl) itemEl.dataset.upgrade = String(upgradeLvl);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => obs.disconnect(), 10000);
        return obs;
    }

    let tooltipObs = null;
    function ensureTooltipObserver() {
        if (tooltipObs) return;
        tooltipObs = new MutationObserver(() => {
            const starEl = document.querySelector('.tip-item-stat-enhancement_upgrade_lvl');
            if (!starEl) return;
            const tipId = document.querySelector('[data-tip-type="t_item"][data-tip-id]')?.dataset?.tipId
                       || document.querySelector('[tip-id]')?.getAttribute('tip-id');
            if (!tipId) return;
            const itemEl = document.querySelector(`[tip-id="${tipId}"]`);
            if (!itemEl) return;
            const itemId = [...itemEl.classList].find(c => c.startsWith('item-id-'))?.replace('item-id-','');
            if (!itemId) return;
            const entry = lookupOverride(parseInt(itemId, 10), null);
            if (!entry) return;
            const ov = entryToOv(entry);
            if (ov.enhancementUpgradeLvl === undefined) return;
            const lvl = Math.min(5, Math.max(0, ov.enhancementUpgradeLvl));
            starEl.className = starEl.className.replace(/icon-star-\d+/, `icon-star-${lvl}`);
            itemEl.dataset.upgrade = String(lvl);
        });
        tooltipObs.observe(document.body, { childList: true, subtree: true, attributeFilter: ['class'] });
    }

    function applyToRaw(id, raw) {
        const entry = lookupOverride(id, raw && raw.hid);
        if (!entry) return null;
        const ov = entryToOv(entry);

        const savedUpgradeLvl = raw.enhancement_upgrade_lvl;

        if (ov.nazwa !== undefined) raw.name = ov.nazwa;
        if (ov.typ !== undefined) raw.cl = ov.typ;
        if (ov.wartosc !== undefined) raw.pr = ov.wartosc;

        if (ov.enhancementUpgradeLvl !== undefined) {
            raw.enhancement_upgrade_lvl = Math.min(5, Math.max(0, ov.enhancementUpgradeLvl));
        }

        const hasStatChanges = ov.opis !== undefined || ov.rzadkosc !== undefined
            || ov.lvl !== undefined || ov.profesja !== undefined || ov.statystyki !== undefined
            || ov.enhancementStat !== undefined;

        if (hasStatChanges) {
            const original = parseStat(raw.stat || '');
            let map;
            if (ov.tylkoNoweStatystyki) {
                map = new Map();
                for (const [k, v] of original) {
                    if (shouldPreserveKey(k)) map.set(k, v);
                }
                if (ov.statystyki) {
                    for (const [k, v] of parseStat(ov.statystyki)) {
                        if (KNOWN_GAMEPLAY_STATS.has(k) || !map.has(k)) map.set(k, v);
                    }
                }
            } else {
                map = new Map(original);
                if (ov.statystyki) { for (const [k, v] of parseStat(ov.statystyki)) map.set(k, v); }
            }

            if (ov.opis !== undefined && ov.opis !== '') map.set('opis', ov.opis);
            if (ov.rzadkosc !== undefined && ov.rzadkosc !== '') map.set('rarity', ov.rzadkosc);
            if (ov.lvl !== undefined) map.set('lvl', String(ov.lvl));
            if (ov.profesja !== undefined && ov.profesja !== '') map.set('reqp', ov.profesja);

            if (ov.enhancementStat !== undefined && ov.enhancementStat !== '') {
                map.set('greenstat', ov.enhancementStat);
            }

            if (ov.enhancementUpgradeLvl !== undefined) {
                map.set('enhancement_upgrade_lvl', String(Math.min(5, Math.max(0, ov.enhancementUpgradeLvl))));
            }

            raw.stat = serializeStat(map);
        } else if (ov.enhancementUpgradeLvl !== undefined) {
            const map = parseStat(raw.stat || '');
            map.set('enhancement_upgrade_lvl', String(Math.min(5, Math.max(0, ov.enhancementUpgradeLvl))));
            if (ov.enhancementStat !== undefined && ov.enhancementStat !== '') {
                map.set('greenstat', ov.enhancementStat);
            }
            raw.stat = serializeStat(map);
        }

        if (ov.lootText !== undefined) {
            const map2 = parseStat(raw.stat || '');
            map2.set('loot', ov.lootText);
            raw.stat = serializeStat(map2);
        }

        if (entry.legendaryBonusType && entry.legendaryBonus && typeof entry.legendaryBonus === 'object') {
            const def = LEGENDARY_BONUSES.find(b => b.key === entry.legendaryBonusType);
            if (def) {
                const allValid = def.fields.every(f => {
                    const v = entry.legendaryBonus[f.id];
                    return v !== undefined && v !== '' && !isNaN(Number(v));
                });
                if (allValid) {
                    try {
                        const builtVal = def.template(entry.legendaryBonus);
                        const map3 = parseStat(raw.stat || '');
                        map3.set('legbon', builtVal);
                        raw.stat = serializeStat(map3);
                    } catch(e) {}
                }
            }
        }

        if (ov.binding && ov.binding !== '') {
            const map4 = parseStat(raw.stat || '');
            map4.delete('permbound'); map4.delete('soulbound');
            if (ov.binding === 'permbound') map4.set('permbound', null);
            else if (ov.binding === 'soulbound') map4.set('soulbound', null);
            raw.stat = serializeStat(map4);
        }

        if (ov.enhancementUpgradeLvl === undefined && savedUpgradeLvl !== undefined) {
            raw.enhancement_upgrade_lvl = savedUpgradeLvl;
        }

        if (ov.enhancementUpgradeLvl !== undefined) {
            const lvl = Math.min(5, Math.max(0, ov.enhancementUpgradeLvl));
            setTimeout(() => patchItemDOM(id, lvl), 50);
        }

        const { rel, abs } = resolveIcon(ov.grafika);
        if (rel !== null) raw.icon = rel;
        return abs;
    }

    function installCustomSprite(item, url) {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = function () {
            item.sprite = img; item.staticAnimation = true; item.frames = null; item.activeFrame = 0;
            item.drawIcon = function (ctx, canvas) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
            const canvas = item.$canvasIcon && item.$canvasIcon[0];
            if (canvas) { const ctx = canvas.getContext('2d'); item.drawIcon(ctx, canvas); }
        };
        img.src = url;
    }
    function applyAbsIcon(item, url) {
        if (item.imgLoaded) { installCustomSprite(item, url); return; }
        const orig = item.afterOnloadItem;
        item.afterOnloadItem = function (f, i) { orig.call(this, f, i); installCustomSprite(item, url); };
    }
    function snapshotServerData(item) {
        const d = {};
        for (const k of SERVER_FIELDS) if (item[k] !== undefined) d[k] = item[k];
        return d;
    }
    function recreateItem(id) {
        const item = Engine.items.getItemById(id); if (!item) return;
        const data = snapshotServerData(item);
        Engine.items.deleteItem(id); Engine.items.updateDATA({ [id]: data });
    }
    function applyToExistingItems() {
        if (!window?.Engine?.items) return;
        const items = Engine.items.test().items; const ids = [];
        for (const rawId in items) { const it = items[rawId]; if (lookupOverride(parseInt(rawId, 10), it && it.hid)) ids.push(rawId); }
        for (const id of ids) recreateItem(id);
    }
    function hookUpdateDATA() {
        const mgr = Engine.items; const orig = mgr.updateDATA.bind(mgr);
        mgr.updateDATA = function (d) {
            const pendingAbsIcons = [];
            for (const rawId in d) {
                if (d[rawId].del) continue;
                const numId = parseInt(rawId, 10);
                if (!lookupOverride(numId, d[rawId].hid)) continue;
                const absUrl = applyToRaw(numId, d[rawId]);
                if (absUrl) pendingAbsIcons.push([rawId, absUrl]);
            }
            orig(d);
            for (const [rawId, url] of pendingAbsIcons) { const item = Engine.items.getItemById(rawId); if (item) applyAbsIcon(item, url); }
        };
    }

    // =========================================================
    //  UI DATA
    // =========================================================
    const STATS_LIST = [
        ['da','Wszystkie cechy'],['ds','Siła'],['dz','Zręczność'],['di','Intelekt'],
        ['sa','Szybkość ataku'],['hp','Życie'],['heal','Leczenie'],['ac','Pancerz'],
        ['acm','Pancerz magiczny'],['act','Odporność na truciznę'],['blok','Blok'],
        ['evade','Unik'],['acdmg','Niszczenie pancerza'],['resdmg','Niszczenie odporności'],
        ['adest','Ranienie posiadacza'],['absorb','Absorpcja'],['absorbm','Absorpcja magiczna'],
        ['manabon','Mana'],['energybon','Energia'],['slow','Obniżanie szybkości przeciwnika'],
        ['crit','Cios krytyczny'],['critval','Siła krytyka fizycznego'],['critmval','Siła krytyka magicznego'],
        ['lowcrit','Obniżanie szansy na cios krytyczny'],['enfatig','Losowe niszczenie energii'],
        ['manafatig','Losowe niszczenie many'],['endest','Niszczenie energii'],['manadest','Niszczenie many'],
        ['lowevade','Obniżanie uniku'],['dmgmul','Wszystkie obrażenia'],['dmgmulphysical','Obrażenia fizyczne'],
        ['dmgmulpoison','Obrażenia od trucizny'],['dmgmulwound','Obrażenia od głębokiej rany'],
        ['dmgmulfire','Obrażenia od ognia'],['dmgmulfrost','Obrażenia od zimna'],
        ['dmgmullight','Obrażenia od błyskawic'],['dmgmulcombo','Obrażenia nieuchronne'],
        ['resmanaendest','Obniżanie niszczenia energii i many'],['lowcritallval','Obniżanie siły ciosu krytycznego'],
        ['lowheal2turns','Obniżanie leczenia na 2 tury'],['armor','Obrona'],
        ['resfire','Odporność na ogień'],['resfrost','Odporność na zimno'],['reslight','Odporność na błyskawice'],
        ['pierce','Przebicie pancerza [dystansowe]'],['pierceb','Blok przebicia [tarcze]'],
        ['contra','Kontra [jednoręczne]'],['abdest','Niszczenie absorpcji [bronie dowolne]'],
    ];

    const TOOLTIP_MAP = [
        ['niszczenie pancerza','acdmg'],['niszczenie odporności','resdmg'],
        ['niszczenie absorpcji','abdest'],['niszczenie energii i many','resmanaendest'],
        ['niszczenie energii','endest'],['niszczenie many','manadest'],
        ['losowe niszczenie energii','enfatig'],['losowe niszczenie many','manafatig'],
        ['pancerz magiczny','acm'],['odporność na truciznę','act'],
        ['odporność na ogień','resfire'],['odporność na zimno','resfrost'],
        ['odporność na błyskawice','reslight'],['pancerz','ac'],
        ['absorpcja magiczna','absorbm'],['absorpcja','absorb'],
        ['blok przebicia','pierceb'],['przebicie pancerza','pierce'],
        ['blok','blok'],['obniżanie szybkości przeciwnika','slow'],
        ['moc ciosu krytycznego fizycznego','critval'],['moc ciosu krytycznego magicznego','critmval'],
        ['siła krytyka fizycznego','critval'],['siła krytyka magicznego','critmval'],
        ['obniżanie siły ciosu krytycznego','lowcritallval'],
        ['obniżanie szansy na cios krytyczny','lowcrit'],['cios krytyczny','crit'],
        ['unik przeciwnika jest mniejszy','lowevade'],['obniżanie uniku','lowevade'],['unik','evade'],
        ['przywraca.*punkt.*życia','heal'],['obniżanie leczenia na 2 tury','lowheal2turns'],['leczenie','heal'],
        ['ranienie posiadacza','adest'],['szybkość ataku','sa'],
        ['wszystkie cechy','da'],['siła','ds'],['zręczność','dz'],['intelekt','di'],['życie','hp'],
        ['mana','manabon'],['energia','energybon'],
        ['wszystkie obrażenia','dmgmul'],['obrażenia od trucizny','dmgmulpoison'],
        ['obrażenia od głębokiej rany','dmgmulwound'],['obrażenia od ognia','dmgmulfire'],
        ['obrażenia od zimna','dmgmulfrost'],['obrażenia od błyskawic','dmgmullight'],
        ['obrażenia nieuchronne','dmgmulcombo'],['obrażenia fizyczne','dmgmulphysical'],
        ['obrona','armor'],['kontra','contra'],
    ];

    const PERCENT_MULTIPLY_STATS = new Set([
        'sa','crit','critval','critmval','lowcrit','lowcritallval','slow','blok','evade',
        'acdmg','resdmg','absorb','absorbm','adest','dmgmul','dmgmulphysical','dmgmulpoison',
        'dmgmulwound','dmgmulfire','dmgmulfrost','dmgmullight','dmgmulcombo','resmanaendest',
        'lowheal2turns','pierce','pierceb','contra','abdest','lowevade','heal','enfatig','manafatig',
        'endest','manadest',
    ]);

    function parseTooltipText(text) {
        const result = new Map();
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
            const lower = line.toLowerCase();
            let matchedKey = null;
            for (const [phrase, statKey] of TOOLTIP_MAP) {
                const isMatch = phrase.includes('.*') ? new RegExp(phrase,'i').test(lower) : lower.includes(phrase);
                if (isMatch) { matchedKey = statKey; break; }
            }
            if (!matchedKey) continue;
            let val = null;
            const allNums = [...line.matchAll(/([+-]?\s*\d+[.,]?\d*)/g)];
            if (allNums.length > 0) {
                let chosen = allNums[allNums.length - 1][1];
                for (const nm of allNums) { if (nm[1].startsWith('+') || nm[1].startsWith('-')) { chosen = nm[1]; break; } }
                val = chosen.replace(/\s/g,'').replace(',','.');
                if (val.startsWith('+')) val = val.slice(1);
            }
            if (val !== null && val !== '') {
                if (PERCENT_MULTIPLY_STATS.has(matchedKey) && val.includes('.')) {
                    const numeric = parseFloat(val);
                    if (!isNaN(numeric)) val = String(Math.round(numeric * 100));
                }
                result.set(matchedKey, val);
            }
        }
        return result;
    }

    const RARITIES = ['','common','unique','upgraded','heroic','legendary','artefact'];
    const TYPES = [
        ['','—'],[1,'Broń jednoręczna'],[2,'Broń dwuręczna'],[3,'Broń półtoraręczna'],
        [4,'Broń dystansowa'],[5,'Broń pomocnicza'],[6,'Różdżka'],[7,'Kula'],
        [8,'Zbroja'],[9,'Hełm'],[10,'Buty'],[11,'Rękawice'],
        [12,'Pierścień'],[13,'Naszyjnik'],[14,'Tarcza'],[15,'Neutralny'],
        [16,'Konsumpcyjny'],[17,'Złoto'],[18,'Klucz'],[19,'Zadanie'],
        [20,'Odnawialny'],[21,'Strzały'],[22,'Talizman'],[23,'Księga'],
        [24,'Torba'],[25,'Błogosławieństwo'],[26,'Ulepszenie'],[27,'Receptura'],
        [28,'Moneta'],[29,'Kołczan'],[30,'Strój'],[31,'Chowaniec'],[32,'Teleport'],
    ];

    const LEGENDARY_BONUSES = [
        { key:'verycrit', label:'Cios bardzo krytyczny',
          fields:[{id:'chance',label:'Szansa (%)',placeholder:'17'},{id:'power',label:'Wzmocnienie (%)',placeholder:'75'}],
          template: f => `verycrit,${f.chance},${f.power}` },
        { key:'holytouch', label:'Dotyk anioła',
          fields:[{id:'chance',label:'Szansa (%)',placeholder:'7'},{id:'heal',label:'Leczenie (HP)',placeholder:'885'}],
          template: f => `holytouch,${f.chance},${f.heal}` },
        { key:'curse', label:'Klątwa',
          fields:[{id:'chance',label:'Szansa (%)',placeholder:'9'}],
          template: f => `curse,${f.chance}` },
        { key:'glare', label:'Oślepienie',
          fields:[{id:'chance',label:'Szansa (%)',placeholder:'9'}],
          template: f => `glare,${f.chance}` },
        { key:'lastheal', label:'Ostatni ratunek',
          fields:[{id:'minpct',label:'Min % HP',placeholder:'18'},{id:'minval',label:'Min regen (%)',placeholder:'36'},{id:'maxval',label:'Max regen (%)',placeholder:'44'}],
          template: f => `lastheal,${f.minpct},${f.minval},${f.maxval}` },
        { key:'critred', label:'Krytyczna osłona',
          fields:[{id:'val',label:'Redukcja (%)',placeholder:'25'}],
          template: f => `critred,${f.val}` },
        { key:'facade', label:'Fasada opieki',
          fields:[{id:'val',label:'Redukcja (%)',placeholder:'13'}],
          template: f => `facade,${f.val}` },
        { key:'cleanse', label:'Płomienne oczyszczenie',
          fields:[{id:'chance',label:'Szansa (%)',placeholder:'12'}],
          template: f => `cleanse,${f.chance}` },
        { key:'anguish', label:'Krwawa udręka',
          fields:[{id:'chance',label:'Szansa (%)',placeholder:'8'},{id:'dmg',label:'Obrażenia',placeholder:'562'}],
          template: f => `anguish,${f.chance},${f.dmg}` },
        { key:'puncture', label:'Przeszywająca skuteczność',
          fields:[{id:'val',label:'Redukcja (%)',placeholder:'12'}],
          template: f => `puncture,${f.val}` },
    ];

    const ICON_URL = 'https://i.vgy.me/krSklX.png';

    // =========================================================
    //  CSS
    // =========================================================
    const CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');
        :root {
            --yci-gold:#e2b70d; --yci-gold-bright:#ffcc00; --yci-gold-dim:rgba(226,183,13,0.25);
            --yci-text:#d4c4a0; --yci-text-dim:#7a6e5a;
            --yci-bg:rgba(10,10,10,0.25); --yci-bg-input:rgba(255,255,255,0.06);
            --yci-border:rgba(226,183,13,0.25);
            --yci-danger:#e74c3c; --yci-danger-dim:rgba(192,57,43,0.5);
            --yci-green:#27ae60; --yci-w:860px; --yci-h:540px;
        }
        #yci-mini { position:fixed; width:40px; height:40px; background:var(--yci-bg); backdrop-filter:blur(4px); border:1px solid var(--yci-gold); border-radius:2.5px; cursor:pointer; z-index:99999; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,.5); transition:box-shadow .2s; }
        #yci-mini:hover { box-shadow:0 2px 12px rgba(255,204,0,.5); }
        #yci-mini img { width:36px; height:36px; object-fit:contain; pointer-events:none; }
        #yci-panel { position:fixed; width:var(--yci-w); max-width:96vw; height:var(--yci-h); max-height:92vh; background:var(--yci-bg); backdrop-filter:blur(8px); border:1px solid var(--yci-gold); border-radius:8px; display:none; flex-direction:column; box-shadow:0 4px 20px rgba(0,0,0,.7); font-family:'Crimson Pro',Georgia,serif; color:var(--yci-text); overflow:hidden; z-index:99999; }
        #yci-panel.yci-visible { display:flex; }
        #yci-titlebar { background:var(--yci-bg); backdrop-filter:blur(4px); border-bottom:1px solid var(--yci-gold-dim); padding:10px 14px; display:flex; align-items:center; justify-content:space-between; cursor:move; user-select:none; flex-shrink:0; }
        #yci-title { font-family:'Cinzel',serif; font-size:14px; font-weight:700; color:var(--yci-gold-bright); letter-spacing:2px; text-transform:uppercase; display:flex; align-items:center; gap:10px; pointer-events:none; }
        #yci-title img { width:20px; height:20px; }
        #yci-close { background:#830707; color:#fff; border:none; padding:2px 8px; cursor:pointer; border-radius:3px; font-size:12px; transition:background .2s; }
        #yci-close:hover { background:#550303; }
        #yci-toolbar { padding:8px 14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(226,183,13,.2); flex-shrink:0; background:rgba(10,10,10,.15); }
        .yci-btn { font-family:'Cinzel',serif; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; border:1px solid rgba(226,183,13,.45); border-radius:3px; cursor:pointer; padding:5px 14px; transition:all .15s; background:rgba(255,204,0,.08); color:var(--yci-gold-bright); }
        .yci-btn:hover { background:rgba(255,204,0,.18); border-color:var(--yci-gold-bright); color:#ffe566; }
        .yci-btn-primary { background:rgba(255,204,0,.15); border-color:var(--yci-gold); }
        .yci-btn-primary:hover { background:rgba(255,204,0,.28); }
        .yci-btn-danger { border-color:var(--yci-danger-dim); color:var(--yci-danger); background:transparent; }
        .yci-btn-danger:hover { background:rgba(192,57,43,.18); border-color:#c0392b; }
        .yci-btn-sm { font-size:9px; padding:3px 10px; }
        #yci-search { margin-left:auto; background:var(--yci-bg-input); border:1px solid var(--yci-border); border-radius:3px; color:var(--yci-text); font-family:'Crimson Pro',serif; font-size:13px; padding:4px 10px; width:200px; outline:none; transition:border-color .15s; }
        #yci-search:focus { border-color:var(--yci-gold); }
        #yci-search::placeholder { color:var(--yci-text-dim); }
        #yci-list-wrap { flex:1; overflow-y:auto; overflow-x:hidden; min-height:0; }
        #yci-list-wrap::-webkit-scrollbar { width:6px; }
        #yci-list-wrap::-webkit-scrollbar-thumb { background:rgba(226,183,13,.3); border-radius:3px; }
        #yci-empty { padding:50px 20px; text-align:center; color:var(--yci-text-dim); font-style:italic; font-size:15px; display:none; }
        #yci-empty span { display:block; font-size:30px; margin-bottom:10px; opacity:.4; }
        table#yci-table { width:100%; border-collapse:collapse; font-size:13px; }
        #yci-table thead tr { background:rgba(255,204,0,.06); border-bottom:1px solid rgba(226,183,13,.3); position:sticky; top:0; z-index:1; }
        #yci-table thead th { font-family:'Cinzel',serif; font-size:9px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--yci-text-dim); padding:8px 10px; text-align:left; white-space:nowrap; background:rgba(15,12,8,.95); }
        #yci-table tbody tr { border-bottom:1px solid rgba(226,183,13,.12); transition:background .1s; }
        #yci-table tbody tr:nth-child(odd) { background:rgba(255,204,0,.02); }
        #yci-table tbody tr:hover { background:rgba(255,204,0,.07); }
        #yci-table tbody tr.yci-disabled { opacity:.45; }
        #yci-table td { padding:7px 10px; vertical-align:middle; }
        #yci-table td.yci-td-key { font-family:'Courier New',monospace; font-size:11px; color:var(--yci-gold); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        #yci-table td.yci-td-name { font-weight:600; color:#ffe566; }
        .yci-badge { display:inline-block; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.8px; text-transform:uppercase; padding:2px 6px; border-radius:2px; border:1px solid currentColor; opacity:.85; }
        .yci-badge-legendary{color:#e8a020;} .yci-badge-heroic{color:#bf5fff;} .yci-badge-unique{color:#4faaff;}
        .yci-badge-artefact{color:#ff4f4f;} .yci-badge-upgraded{color:#3de87a;} .yci-badge-common{color:var(--yci-text-dim);}
        #yci-table td.yci-td-actions { white-space:nowrap; text-align:right; }
        .yci-act { background:none; border:1px solid transparent; border-radius:2px; cursor:pointer; padding:3px 7px; font-size:11px; color:var(--yci-text-dim); transition:all .12s; }
        .yci-act:hover { border-color:var(--yci-gold-dim); color:var(--yci-text); }
        .yci-act-edit:hover { color:var(--yci-gold-bright); border-color:var(--yci-gold); }
        .yci-act-del:hover  { color:var(--yci-danger); border-color:#c0392b; }
        .yci-toggle { position:relative; display:inline-block; width:32px; height:17px; }
        .yci-toggle input { opacity:0; width:0; height:0; }
        .yci-slider { position:absolute; inset:0; cursor:pointer; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:17px; transition:.2s; }
        .yci-slider::before { content:''; position:absolute; width:11px; height:11px; left:2px; bottom:2px; background:var(--yci-text-dim); border-radius:50%; transition:.2s; }
        .yci-toggle input:checked + .yci-slider { background:rgba(39,174,96,.25); border-color:rgba(39,174,96,.55); }
        .yci-toggle input:checked + .yci-slider::before { transform:translateX(15px); background:var(--yci-green); }
        #yci-statusbar { padding:6px 14px; font-size:11px; color:var(--yci-text-dim); border-top:1px solid rgba(226,183,13,.15); display:flex; gap:12px; align-items:center; flex-shrink:0; font-style:italic; background:rgba(10,10,10,.15); }
        #yci-status-msg { margin-left:auto; font-style:normal; color:var(--yci-gold-bright); min-height:14px; }

        /* form */
        #yci-form-box { position:fixed; width:620px; max-width:96vw; height:88vh; max-height:700px; background:rgba(10,10,10,.92); backdrop-filter:blur(8px); border:1px solid var(--yci-gold); border-radius:8px; box-shadow:0 8px 32px rgba(0,0,0,.8); font-family:'Crimson Pro',Georgia,serif; color:var(--yci-text); display:flex; flex-direction:column; z-index:100000; overflow:hidden; }
        #yci-form-title { font-family:'Cinzel',serif; font-size:12px; letter-spacing:2px; color:var(--yci-gold-bright); font-weight:700; text-transform:uppercase; padding:13px 18px; background:rgba(10,10,10,.4); border-bottom:1px solid rgba(226,183,13,.4); cursor:move; user-select:none; flex-shrink:0; border-radius:7px 7px 0 0; display:flex; align-items:center; justify-content:space-between; }
        #yci-form-title-text { pointer-events:none; }
        #yci-form-close { background:#830707; color:#fff; border:none; padding:2px 8px; cursor:pointer; border-radius:3px; font-size:12px; transition:background .2s; pointer-events:all; }
        #yci-form-close:hover { background:#550303; }
        #yci-form-body { padding:18px; display:grid; grid-template-columns:1fr 1fr; gap:10px 16px; overflow-y:auto; overflow-x:hidden; flex:1; min-height:0; background:rgba(10,10,10,.2); }
        #yci-form-body::-webkit-scrollbar { width:6px; }
        #yci-form-body::-webkit-scrollbar-thumb { background:rgba(226,183,13,.3); border-radius:3px; }
        #yci-form-footer { padding:12px 18px; display:flex; gap:8px; justify-content:flex-end; border-top:1px solid rgba(226,183,13,.18); background:rgba(10,10,10,.4); border-radius:0 0 7px 7px; flex-shrink:0; }
        #yci-form-err { color:var(--yci-danger); font-size:11px; margin-right:auto; align-self:center; }
        .yci-field { display:flex; flex-direction:column; gap:4px; }
        .yci-field.yci-full { grid-column:1 / -1; }
        .yci-label { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:1px; text-transform:uppercase; color:var(--yci-text-dim); }
        .yci-label .yci-hint { font-family:'Crimson Pro',serif; font-size:10px; color:rgba(122,110,90,.6); text-transform:none; letter-spacing:0; margin-left:4px; }
        .yci-input, .yci-select { background:var(--yci-bg-input); border:1px solid var(--yci-border); border-radius:3px; color:var(--yci-text); font-family:'Crimson Pro',serif; font-size:13px; padding:5px 8px; outline:none; width:100%; box-sizing:border-box; transition:border-color .15s; appearance:none; -webkit-appearance:none; }
        .yci-input:focus, .yci-select:focus { border-color:var(--yci-gold); }
        .yci-select { background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23e2b70d'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 8px center; padding-right:28px; }
        .yci-select option { background:#1a1510; color:var(--yci-text); }
        .yci-select option:checked { background:#2a1f08; color:var(--yci-gold-bright); }
        .yci-input::placeholder { color:var(--yci-text-dim); font-style:italic; }

        /* enhancement upgrade lvl slider */
        .yci-upgrade-row { display:flex; align-items:center; gap:10px; }
        .yci-upgrade-stars { display:flex; gap:4px; align-items:center; }
        .yci-star-btn {
            width:28px; height:28px; border-radius:50%; border:2px solid rgba(226,183,13,.3);
            background:rgba(0,0,0,.3); cursor:pointer; transition:all .15s;
            display:flex; align-items:center; justify-content:center;
            font-size:14px; color:rgba(226,183,13,.3); user-select:none;
        }
        .yci-star-btn.yci-star-active { border-color:var(--yci-gold); background:rgba(226,183,13,.15); color:var(--yci-gold-bright); }
        .yci-star-btn:hover { border-color:var(--yci-gold); color:var(--yci-gold); }
        .yci-upgrade-val { font-family:'Courier New',monospace; font-size:13px; color:var(--yci-gold-bright); min-width:16px; text-align:center; }
        .yci-upgrade-none { font-size:11px; color:var(--yci-text-dim); font-style:italic; margin-left:4px; }

        .yci-fancy-checkbox-wrap { display:flex; align-items:center; gap:10px; background:rgba(255,204,0,.04); border:1px solid rgba(226,183,13,.18); border-radius:4px; padding:9px 12px; cursor:pointer; transition:background .15s,border-color .15s; user-select:none; }
        .yci-fancy-checkbox-wrap:hover { background:rgba(255,204,0,.09); border-color:rgba(226,183,13,.38); }
        .yci-fancy-checkbox-wrap input[type=checkbox] { display:none; }
        .yci-fancy-cb-box { width:20px; height:20px; flex-shrink:0; border:2px solid rgba(226,183,13,.4); border-radius:4px; background:rgba(0,0,0,.3); position:relative; transition:border-color .15s,background .15s; display:flex; align-items:center; justify-content:center; }
        .yci-fancy-cb-box::after { content:''; width:5px; height:9px; border-right:2px solid var(--yci-gold-bright); border-bottom:2px solid var(--yci-gold-bright); transform:rotate(45deg) translateY(-1px); opacity:0; transition:opacity .15s; }
        .yci-fancy-checkbox-wrap input:checked ~ .yci-fancy-cb-box { border-color:var(--yci-gold); background:rgba(226,183,13,.18); }
        .yci-fancy-checkbox-wrap input:checked ~ .yci-fancy-cb-box::after { opacity:1; }
        .yci-fancy-cb-label { display:flex; flex-direction:column; gap:2px; }
        .yci-fancy-cb-title { font-family:'Cinzel',serif; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--yci-gold-bright); }
        .yci-fancy-cb-desc { font-size:11px; color:var(--yci-text-dim); font-style:italic; line-height:1.3; }

        .yci-binding-group { display:flex; gap:8px; }
        .yci-binding-opt { flex:1; display:flex; align-items:center; gap:7px; background:rgba(255,255,255,.04); border:1px solid rgba(226,183,13,.18); border-radius:4px; padding:8px 12px; cursor:pointer; transition:background .15s,border-color .15s; user-select:none; }
        .yci-binding-opt:hover { background:rgba(255,204,0,.09); border-color:rgba(226,183,13,.38); }
        .yci-binding-opt input[type=radio] { display:none; }
        .yci-binding-radio-dot { width:14px; height:14px; flex-shrink:0; border:2px solid rgba(226,183,13,.35); border-radius:50%; background:rgba(0,0,0,.3); position:relative; transition:all .15s; }
        .yci-binding-radio-dot::after { content:''; position:absolute; inset:2px; border-radius:50%; background:var(--yci-gold-bright); opacity:0; transform:scale(0); transition:all .15s; }
        .yci-binding-opt input:checked ~ .yci-binding-radio-dot { border-color:var(--yci-gold); background:rgba(226,183,13,.1); }
        .yci-binding-opt input:checked ~ .yci-binding-radio-dot::after { opacity:1; transform:scale(1); }
        .yci-binding-opt-label { display:flex; flex-direction:column; gap:1px; }
        .yci-binding-opt-name { font-family:'Cinzel',serif; font-size:9px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--yci-text); transition:color .15s; }
        .yci-binding-opt-desc { font-size:10px; color:var(--yci-text-dim); font-style:italic; }

        .yci-stats-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; gap:6px; flex-wrap:wrap; }
        .yci-stats-actions { display:flex; gap:5px; align-items:center; flex-wrap:wrap; }
        #yf-paste-area { width:100%; box-sizing:border-box; height:80px; resize:vertical; min-height:60px; max-height:160px; background:rgba(226,183,13,.05); border:1px dashed rgba(226,183,13,.35); border-radius:3px; color:var(--yci-text); font-family:'Crimson Pro',serif; font-size:12px; padding:7px 10px; outline:none; transition:border-color .15s; line-height:1.5; }
        #yf-paste-area:focus { border-color:var(--yci-gold); border-style:solid; }
        #yf-paste-area::placeholder { color:rgba(122,110,90,.6); font-style:italic; font-size:11px; }
        .yci-paste-row { display:flex; gap:6px; align-items:flex-start; }
        .yci-paste-info { font-size:10px; color:var(--yci-text-dim); font-style:italic; margin-top:3px; min-height:14px; }
        .yci-paste-info.ok { color:var(--yci-green); } .yci-paste-info.err { color:var(--yci-danger); }
        #yf-stats-builder { background:rgba(0,0,0,.2); border:1px solid rgba(226,183,13,.15); border-radius:3px; padding:8px 12px; display:grid; grid-template-columns:1fr 1fr; gap:3px 16px; max-height:220px; overflow-y:auto; overflow-x:hidden; }
        #yf-stats-builder::-webkit-scrollbar { width:5px; }
        #yf-stats-builder::-webkit-scrollbar-thumb { background:rgba(226,183,13,.3); border-radius:3px; }
        .yci-stat-row { display:flex; align-items:center; gap:5px; padding:2px 0; min-width:0; }
        .yci-stat-row label { font-size:11px; color:var(--yci-text); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer; min-width:0; }
        .yci-stat-row label span { font-size:9px; color:var(--yci-text-dim); font-family:'Courier New',monospace; }
        .yci-stat-row.yci-stat-filled label { color:#ffe566; }
        .yci-stat-val { width:54px; flex-shrink:0; background:rgba(255,255,255,.05); border:1px solid rgba(226,183,13,.15); border-radius:2px; color:var(--yci-text); font-family:'Courier New',monospace; font-size:11px; padding:2px 5px; outline:none; text-align:right; transition:all .12s; }
        .yci-stat-val:focus { border-color:var(--yci-gold); background:rgba(226,183,13,.08); }
        .yci-stat-val.yci-val-filled { border-color:rgba(226,183,13,.5); background:rgba(226,183,13,.08); color:#ffe566; }
        #yci-preview-img { width:40px; height:40px; object-fit:contain; border:1px solid rgba(226,183,13,.2); border-radius:2px; background:rgba(0,0,0,.4); display:none; vertical-align:middle; }
        .yci-section-divider { grid-column:1 / -1; border:none; border-top:1px solid rgba(226,183,13,.2); margin:6px 0 2px; }
        .yci-section-title { grid-column:1 / -1; font-family:'Cinzel',serif; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--yci-gold); margin-bottom:2px; opacity:.7; }
        #yf-loot-preview { font-size:11px; color:var(--yci-text-dim); font-style:italic; padding:4px 8px; background:rgba(0,0,0,.2); border-radius:3px; border:1px solid rgba(226,183,13,.1); min-height:36px; line-height:1.6; }
        #yci-ie-box { position:fixed; width:480px; max-width:96vw; background:rgba(10,10,10,.92); backdrop-filter:blur(8px); border:1px solid var(--yci-gold); border-radius:8px; box-shadow:0 8px 32px rgba(0,0,0,.8); font-family:'Crimson Pro',Georgia,serif; color:var(--yci-text); overflow:hidden; z-index:100001; }
        #yci-ie-title { font-family:'Cinzel',serif; font-size:12px; letter-spacing:2px; color:var(--yci-gold-bright); font-weight:700; text-transform:uppercase; padding:13px 18px; background:rgba(10,10,10,.4); border-bottom:1px solid rgba(226,183,13,.4); cursor:move; user-select:none; }
        #yci-ie-body { padding:16px; display:flex; flex-direction:column; gap:10px; background:rgba(10,10,10,.2); }
        #yci-ie-textarea { width:100%; box-sizing:border-box; height:200px; resize:vertical; background:rgba(255,255,255,.05); border:1px solid rgba(226,183,13,.2); border-radius:3px; color:var(--yci-text); font-family:'Courier New',monospace; font-size:11px; padding:8px; outline:none; transition:border-color .15s; }
        #yci-ie-textarea:focus { border-color:var(--yci-gold); }
        #yci-ie-err { color:var(--yci-danger); font-size:11px; min-height:14px; }
        #yci-ie-footer { padding:12px 18px; display:flex; gap:8px; justify-content:flex-end; border-top:1px solid rgba(226,183,13,.18); background:rgba(10,10,10,.2); }

        /* save feedback flash */
        @keyframes yci-save-flash { 0%{border-color:var(--yci-green);box-shadow:0 0 10px rgba(39,174,96,.5);} 100%{border-color:var(--yci-gold);box-shadow:0 8px 32px rgba(0,0,0,.8);} }
        .yci-saved { animation: yci-save-flash 0.8s ease-out; }
    `;

    const EMPTY_ENTRY = () => ({
        id: Date.now(), enabled: true, key: '', nazwa: '', opis: '', rzadkosc: '',
        grafika: '', typ: '', profesja: '', lvl: '', wartosc: '', statystyki: '',
        tylkoNoweStatystyki: false,
        lootDate: '', lootMonster: '', lootBy: '', lootGroup: '1',
        legendaryBonusType: '', legendaryBonus: {},
        binding: '', enhancementUpgradeLvl: '', enhancementStat: '',
    });

    let panelEl = null, miniEl = null, statusTimer = null;

    function showStatus(msg) {
        const el = panelEl && panelEl.querySelector('#yci-status-msg');
        if (!el) return;
        el.textContent = msg;
        clearTimeout(statusTimer);
        statusTimer = setTimeout(() => { el.textContent = ''; }, 3000);
    }
    function rebuildLookups() { lookups = buildLookups(loadItems()); }
    function escH(str) { return String(str||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    const DRAG_THRESH = 5;
    function makeDraggable(el, handle, onSave) {
        let dragging=false, ox, oy, startL, startT;
        el._yciDragging = false;
        handle.addEventListener('mousedown', e => {
            if (e.target.tagName==='BUTTON'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            el.style.left=rect.left+'px'; el.style.top=rect.top+'px';
            startL=rect.left; startT=rect.top; ox=e.clientX; oy=e.clientY;
            dragging=true; el._yciDragging=false;
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const dx=e.clientX-ox, dy=e.clientY-oy;
            if (Math.abs(dx)>DRAG_THRESH||Math.abs(dy)>DRAG_THRESH) el._yciDragging=true;
            el.style.left=Math.max(0,Math.min(startL+dx,window.innerWidth-el.offsetWidth))+'px';
            el.style.top=Math.max(0,Math.min(startT+dy,window.innerHeight-el.offsetHeight))+'px';
        });
        document.addEventListener('mouseup', () => {
            if (!dragging) return; dragging=false;
            if (onSave) onSave(parseFloat(el.style.left),parseFloat(el.style.top));
            setTimeout(()=>{el._yciDragging=false;},50);
        });
    }

    function createMini() {
        if (document.getElementById('yci-mini')) return;
        const saved = (()=>{try{return JSON.parse(localStorage.getItem(LS_MINI_POS))||{};}catch{return{};}})();
        const mini = document.createElement('div');
        mini.id='yci-mini'; mini.title='Custom Items';
        mini.innerHTML=`<img src="${ICON_URL}" alt="CI">`;
        mini.style.left=(saved.x??20)+'px'; mini.style.top=(saved.y??20)+'px';
        document.body.appendChild(mini); miniEl=mini;
        makeDraggable(mini,mini,(x,y)=>{try{localStorage.setItem(LS_MINI_POS,JSON.stringify({x,y}));}catch{}});
        mini.addEventListener('click',()=>{if(mini._yciDragging)return;openPanel();});
    }

    function renderRow(entry) {
        const tr = document.createElement('tr');
        if (!entry.enabled) tr.classList.add('yci-disabled');
        tr.dataset.id = entry.id;
        const badgeHTML = entry.rzadkosc
            ? `<span class="yci-badge yci-badge-${entry.rzadkosc}">${entry.rzadkosc}</span>`
            : '<span style="color:var(--yci-text-dim);font-size:11px">—</span>';
        const keyShort = entry.key.length>28?entry.key.slice(0,12)+'…'+entry.key.slice(-10):entry.key;
        tr.innerHTML = `
            <td><label class="yci-toggle"><input type="checkbox" class="yci-chk-enabled" ${entry.enabled?'checked':''}><span class="yci-slider"></span></label></td>
            <td class="yci-td-key" title="${entry.key}">${keyShort}</td>
            <td class="yci-td-name">${entry.nazwa||'<span style="color:var(--yci-text-dim);font-style:italic">brak</span>'}</td>
            <td class="yci-td-badge">${badgeHTML}</td>
            <td style="font-size:11px;color:var(--yci-text-dim)">${entry.typ?(TYPES.find(t=>t[0]==entry.typ)||['','?'])[1]:'—'}</td>
            <td class="yci-td-actions">
                <button class="yci-act yci-act-edit" data-id="${entry.id}">✎ Edytuj</button>
                <button class="yci-act yci-act-del"  data-id="${entry.id}">✕</button>
            </td>`;
        tr.querySelector('.yci-chk-enabled').addEventListener('change', function() {
            const list=loadItems(); const idx=list.findIndex(e=>e.id===entry.id);
            if(idx!==-1){list[idx].enabled=this.checked;saveItems(list);rebuildLookups();}
            tr.classList.toggle('yci-disabled',!this.checked);
            showStatus(this.checked?`Włączono: ${entry.nazwa||entry.key}`:`Wyłączono: ${entry.nazwa||entry.key}`);
        });
        tr.querySelector('.yci-act-edit').addEventListener('click',()=>openForm(entry.id));
        tr.querySelector('.yci-act-del').addEventListener('click',()=>{
            if(!confirm(`Usunąć: "${entry.nazwa||entry.key}"?`))return;
            const list=loadItems().filter(e=>e.id!==entry.id);
            saveItems(list);rebuildLookups();tr.remove();updateEmpty();showStatus('Usunięto wpis.');
        });
        return tr;
    }
    function updateEmpty() {
        const tbody=panelEl&&panelEl.querySelector('#yci-tbody');
        const empty=panelEl&&panelEl.querySelector('#yci-empty');
        if(!tbody||!empty)return;
        empty.style.display=tbody.querySelectorAll('tr').length===0?'block':'none';
    }
    function updateCount() {
        const el=panelEl&&panelEl.querySelector('#yci-count');
        if(!el)return;
        const list=loadItems();
        el.textContent=`${list.length} wpis${list.length===1?'':'ów'} (${list.filter(e=>e.enabled).length} aktywnych)`;
    }

    function openPanel() {
        if(panelEl&&panelEl.classList.contains('yci-visible'))return;
        if(!panelEl){
            const panel=document.createElement('div'); panel.id='yci-panel';
            panel.innerHTML=`
                <div id="yci-titlebar"><div id="yci-title"><img src="${ICON_URL}" alt=""> Custom Items</div><button id="yci-close">&#x2715;</button></div>
                <div id="yci-toolbar">
                    <button class="yci-btn yci-btn-primary" id="yci-btn-add">+ Dodaj item</button>
                    <button class="yci-btn" id="yci-btn-export">↑ Eksport JSON</button>
                    <button class="yci-btn" id="yci-btn-import">↓ Import JSON</button>
                    <input id="yci-search" placeholder="Szukaj po kluczu, nazwie…">
                </div>
                <div id="yci-list-wrap">
                    <div id="yci-empty"><span>📦</span>Brak wpisów.<br>Kliknij <strong>+ Dodaj item</strong> żeby zacząć.</div>
                    <table id="yci-table"><thead><tr>
                        <th style="width:44px">Status</th><th>Klucz</th><th>Nazwa</th>
                        <th>Rzadkość</th><th>Typ</th><th style="width:120px;text-align:right">Akcje</th>
                    </tr></thead><tbody id="yci-tbody"></tbody></table>
                </div>
                <div id="yci-statusbar"><span id="yci-count"></span><span id="yci-status-msg"></span></div>`;
            document.body.appendChild(panel); panelEl=panel;
            panel.style.left=Math.max(0,Math.round((window.innerWidth-860)/2))+'px';
            panel.style.top=Math.max(0,Math.round((window.innerHeight-540)/2))+'px';
            makeDraggable(panel,panel.querySelector('#yci-titlebar'),null);
            const tbody=panel.querySelector('#yci-tbody');
            for(const e of loadItems()) tbody.appendChild(renderRow(e));
            updateEmpty(); updateCount();
            panel.querySelector('#yci-list-wrap').addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
            panel.querySelector('#yci-close').addEventListener('click',closePanel);
            panel.querySelector('#yci-btn-add').addEventListener('click',()=>openForm(null));
            panel.querySelector('#yci-btn-export').addEventListener('click',openExport);
            panel.querySelector('#yci-btn-import').addEventListener('click',openImport);
            panel.querySelector('#yci-search').addEventListener('input',function(){
                const q=this.value.toLowerCase();
                tbody.querySelectorAll('tr').forEach(tr=>{
                    const key=tr.querySelector('.yci-td-key')?.textContent.toLowerCase()||'';
                    const name=tr.querySelector('.yci-td-name')?.textContent.toLowerCase()||'';
                    tr.style.display=(!q||key.includes(q)||name.includes(q))?'':'none';
                });
            });
        }
        panelEl.classList.add('yci-visible');
    }
    function closePanel(){if(panelEl)panelEl.classList.remove('yci-visible');}

    // =========================================================
    //  FORM
    // =========================================================
    function openForm(entryId) {
        document.getElementById('yci-form-box')?.remove();
        const list  = loadItems();
        const entry = entryId!=null?(list.find(e=>e.id===entryId)||EMPTY_ENTRY()):EMPTY_ENTRY();
        const isNew = entryId==null;

        const rarityOpts = RARITIES.map(r=>`<option value="${r}" ${entry.rzadkosc===r?'selected':''}>${r||'— brak —'}</option>`).join('');
        const typeOpts   = TYPES.map(([v,l])=>`<option value="${v}" ${entry.typ==v?'selected':''}>${l}</option>`).join('');
        // CHANGE: legendary bonus — only type select, NO dynamic fields rendered below it
        const legBonusOpts = `<option value="">— brak —</option>`+
            LEGENDARY_BONUSES.map(b=>`<option value="${b.key}" ${(entry.legendaryBonusType||'')==b.key?'selected':''}>${b.label}</option>`).join('');
        const curBinding = entry.binding||'';

        const curUpgrade = (entry.enhancementUpgradeLvl!==undefined&&entry.enhancementUpgradeLvl!=='')
            ? Number(entry.enhancementUpgradeLvl) : -1;

        const fo = document.createElement('div'); fo.id='yci-form-box';
        fo.style.left=`${Math.max(0,Math.round((window.innerWidth-620)/2))}px`;
        fo.style.top=`${Math.max(0,Math.round((window.innerHeight-680)/2))}px`;

        fo.innerHTML = `
            <div id="yci-form-title">
                <span id="yci-form-title-text">${isNew?'+ Nowy wpis':'✎ Edytuj wpis'}</span>
                <button id="yci-form-close">&#x2715;</button>
            </div>
            <div id="yci-form-body">
                <div class="yci-field yci-full">
                    <label class="yci-label">Klucz <span class="yci-hint">(ID liczbowe lub hash ITEM#…)</span></label>
                    <input class="yci-input" id="yf-key" value="${escH(entry.key)}" placeholder="np. 12345 albo ITEM#abc123…">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Nazwa</label>
                    <input class="yci-input" id="yf-nazwa" value="${escH(entry.nazwa)}" placeholder="nowa nazwa">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Rzadkość</label>
                    <select class="yci-select" id="yf-rzadkosc">${rarityOpts}</select>
                </div>
                <div class="yci-field yci-full">
                    <label class="yci-label">Grafika <span class="yci-hint">(nazwa pliku LUB pełny URL https://…)</span></label>
                    <div style="display:flex;gap:8px;align-items:center">
                        <input class="yci-input" id="yf-grafika" value="${escH(entry.grafika)}" placeholder="sword1.gif albo https://…" style="flex:1">
                        <img id="yci-preview-img" alt="preview">
                    </div>
                </div>
                <div class="yci-field yci-full">
                    <label class="yci-label">Opis</label>
                    <input class="yci-input" id="yf-opis" value="${escH(entry.opis)}" placeholder="opis w tooltipie">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Typ <span class="yci-hint">(cl)</span></label>
                    <select class="yci-select" id="yf-typ">${typeOpts}</select>
                </div>
                <div class="yci-field">
                    <label class="yci-label">Profesja <span class="yci-hint">(reqp)</span></label>
                    <input class="yci-input" id="yf-profesja" value="${escH(entry.profesja)}" placeholder="w / p / m / h / t / b">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Wymagany lvl</label>
                    <input class="yci-input" id="yf-lvl" type="number" value="${entry.lvl}" placeholder="np. 100">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Wartość (złoto)</label>
                    <input class="yci-input" id="yf-wartosc" type="number" value="${entry.wartosc}" placeholder="np. 1000000">
                </div>

                <hr class="yci-section-divider">
                <div class="yci-section-title">⚒ Wzmocnienie przedmiotu</div>
                <div class="yci-field yci-full">
                    <label class="yci-label">Poziom ulepszenia <span class="yci-hint"></span></label>
                    <div class="yci-upgrade-row">
                        <div class="yci-upgrade-stars" id="yf-upgrade-stars">
                            ${[1,2,3,4,5].map(n=>`<button type="button" class="yci-star-btn${curUpgrade>=n?' yci-star-active':''}" data-star="${n}">★</button>`).join('')}
                        </div>
                        <span class="yci-upgrade-val" id="yf-upgrade-val">${curUpgrade>=0?curUpgrade:''}</span>
                        <span class="yci-upgrade-none" id="yf-upgrade-none">${curUpgrade<0?'(nie zmieniaj)':''}</span>
                    </div>
                    <input type="hidden" id="yf-enhancementUpgradeLvl" value="${curUpgrade>=0?curUpgrade:''}">
                </div>

                <div class="yci-field yci-full">
                    <div class="yci-stats-header">
                        <label class="yci-label">Statystyki</label>
                        <div class="yci-stats-actions">
                            <button type="button" class="yci-btn yci-btn-sm" id="yf-paste-toggle">📋 Wklej z tooltipa</button>
                            <button type="button" class="yci-btn yci-btn-sm" id="yf-builder-toggle">▼ Builder</button>
                            <button type="button" class="yci-btn yci-btn-sm yci-btn-danger" id="yf-clear-stats">✕ Wyczyść</button>
                        </div>
                    </div>
                    <div id="yf-paste-section" style="display:none;margin-bottom:8px;">
                        <div class="yci-paste-row">
                            <textarea id="yf-paste-area" placeholder="Wklej tu tekst statystyk z tooltipa…"></textarea>
                            <button type="button" class="yci-btn yci-btn-primary" id="yf-paste-apply" style="align-self:flex-start;white-space:nowrap;padding:5px 12px;">Zastosuj</button>
                        </div>
                        <div class="yci-paste-info" id="yf-paste-info"></div>
                    </div>
                    <div id="yf-stats-builder" style="display:none;margin-bottom:8px;"></div>
                    <input class="yci-input" id="yf-statystyki" value="${escH(entry.statystyki)}" placeholder="np. da=10;sa=5;hp=200" style="font-family:'Courier New',monospace;font-size:11px">
                    <span class="yci-label" style="margin-top:3px"><span class="yci-hint">Edytuj ręcznie lub użyj buildera — pola synchronizują się</span></span>
                </div>

                <div class="yci-field yci-full">
                    <label class="yci-fancy-checkbox-wrap">
                        <input type="checkbox" id="yf-tylkoNowe" ${entry.tylkoNoweStatystyki?'checked':''}>
                        <span class="yci-fancy-cb-box"></span>
                        <span class="yci-fancy-cb-label">
                            <span class="yci-fancy-cb-title">Tylko nowe statystyki</span>
                            <span class="yci-fancy-cb-desc">Zachowuje oryginalne staty z serwera, dopisuje tylko podane.</span>
                        </span>
                    </label>
                </div>

                <hr class="yci-section-divider">
                <div class="yci-section-title">🔒 Bindowanie</div>
                <div class="yci-field yci-full">
                    <div class="yci-binding-group">
                        <label class="yci-binding-opt"><input type="radio" name="yf-binding" value="" ${curBinding===''?'checked':''}><span class="yci-binding-radio-dot"></span><span class="yci-binding-opt-label"><span class="yci-binding-opt-name">Brak</span><span class="yci-binding-opt-desc">Nie zmieniaj</span></span></label>
                        <label class="yci-binding-opt"><input type="radio" name="yf-binding" value="soulbound" ${curBinding==='soulbound'?'checked':''}><span class="yci-binding-radio-dot"></span><span class="yci-binding-opt-label"><span class="yci-binding-opt-name">Soulbound</span><span class="yci-binding-opt-desc">Związany z właścicielem</span></span></label>
                        <label class="yci-binding-opt"><input type="radio" name="yf-binding" value="permbound" ${curBinding==='permbound'?'checked':''}><span class="yci-binding-radio-dot"></span><span class="yci-binding-opt-label"><span class="yci-binding-opt-name">Permbound</span><span class="yci-binding-opt-desc">Związany na stałe</span></span></label>
                    </div>
                </div>

                <hr class="yci-section-divider">
                <div class="yci-section-title">⚔ Podpis zlotania</div>
                <div class="yci-field">
                    <label class="yci-label">Nick gracza</label>
                    <input class="yci-input" id="yf-lootBy" value="${escH(entry.lootBy||'')}" placeholder="twoj nick">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Nazwa potwora</label>
                    <input class="yci-input" id="yf-lootMonster" value="${escH(entry.lootMonster||'')}" placeholder="nazwa">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Data <span class="yci-hint">DD.MM.RRRR lub unix timestamp</span></label>
                    <input class="yci-input" id="yf-lootDate" value="${escH(entry.lootDate||'')}" placeholder="01.01.2024">
                </div>
                <div class="yci-field">
                    <label class="yci-label">Liczba osób <span class="yci-hint">(1=solo, 2=kompan, 3+=drużyna)</span></label>
                    <select class="yci-select" id="yf-lootGroup">
                        <option value="1" ${(entry.lootGroup||'1')==='1'?'selected':''}>1 — solo</option>
                        <option value="2" ${(entry.lootGroup||'')==='2'?'selected':''}>2 — wraz z kompanem</option>
                        <option value="3" ${(entry.lootGroup||'')==='3'?'selected':''}>3 — wraz z drużyną</option>
                    </select>
                </div>
                <div class="yci-field yci-full">
                    <label class="yci-label">Podgląd</label>
                    <div id="yf-loot-preview"></div>
                </div>

                <hr class="yci-section-divider">
                <div class="yci-section-title">✦ Bonus legendarny</div>
                <div class="yci-field yci-full">
                    <label class="yci-label">Typ bonusu</label>
                    <select class="yci-select" id="yf-legBonusType">${legBonusOpts}</select>
                </div>
            </div>
            <div id="yci-form-footer">
                <span id="yci-form-err"></span>
                <button class="yci-btn yci-btn-primary" id="yf-save">${isNew?'Dodaj':'Zapisz'}</button>
            </div>`;

        document.body.appendChild(fo);
        makeDraggable(fo, fo.querySelector('#yci-form-title'), null);

        // ---- close button (X) ----
        fo.querySelector('#yci-form-close').addEventListener('click', () => fo.remove());

        // ---- upgrade stars widget ----
        const starsWrap   = fo.querySelector('#yf-upgrade-stars');
        const upgradeHid  = fo.querySelector('#yf-enhancementUpgradeLvl');
        const upgradeVal  = fo.querySelector('#yf-upgrade-val');
        const upgradeNone = fo.querySelector('#yf-upgrade-none');

        function setUpgradeLevel(lvl) {
            const stars = starsWrap.querySelectorAll('.yci-star-btn');
            stars.forEach((btn, i) => {
                btn.classList.toggle('yci-star-active', lvl >= 0 && (i + 1) <= lvl);
            });
            upgradeHid.value  = lvl >= 0 ? String(lvl) : '';
            upgradeVal.textContent  = lvl >= 0 ? String(lvl) : '';
            upgradeNone.textContent = lvl < 0 ? '(nie zmieniaj)' : '';
        }

        starsWrap.addEventListener('click', e => {
            const btn = e.target.closest('.yci-star-btn');
            if (!btn) return;
            const n = parseInt(btn.dataset.star, 10);
            const cur = upgradeHid.value !== '' ? parseInt(upgradeHid.value, 10) : -1;
            if (cur === n) {
                setUpgradeLevel(n === 1 ? -1 : n - 1);
            } else {
                setUpgradeLevel(n);
            }
        });

        // ---- stat helpers ----
        const statsInput    = fo.querySelector('#yf-statystyki');
        const builderDiv    = fo.querySelector('#yf-stats-builder');
        const builderToggle = fo.querySelector('#yf-builder-toggle');
        const pasteSection  = fo.querySelector('#yf-paste-section');
        const pasteToggle   = fo.querySelector('#yf-paste-toggle');
        const pasteArea     = fo.querySelector('#yf-paste-area');
        const pasteInfo     = fo.querySelector('#yf-paste-info');
        const pasteApply    = fo.querySelector('#yf-paste-apply');
        const clearBtn      = fo.querySelector('#yf-clear-stats');

        function parseStatStr(str) {
            const m = new Map();
            if (!str) return m;
            for (const part of str.split(';')) {
                const eq = part.indexOf('=');
                if (eq !== -1) m.set(part.slice(0,eq).trim(), part.slice(eq+1).trim());
            }
            return m;
        }
        function serializeBuilder() {
            const parts = [];
            builderDiv.querySelectorAll('.yci-stat-val').forEach(inp => {
                const v = inp.value.trim();
                if (v !== '') parts.push(inp.dataset.key + '=' + v);
            });
            return parts.join(';');
        }
        function applyMapToBuilder(map) {
            builderDiv.querySelectorAll('.yci-stat-val').forEach(inp => {
                const v = map.get(inp.dataset.key);
                inp.value = v !== undefined ? v : '';
                inp.classList.toggle('yci-val-filled', v !== undefined && v !== '');
                inp.closest('.yci-stat-row').classList.toggle('yci-stat-filled', v !== undefined && v !== '');
            });
        }
        function refreshBuilderHighlights() {
            builderDiv.querySelectorAll('.yci-stat-val').forEach(inp => {
                const filled = inp.value.trim() !== '';
                inp.classList.toggle('yci-val-filled', filled);
                inp.closest('.yci-stat-row').classList.toggle('yci-stat-filled', filled);
            });
        }

        const initMap = parseStatStr(entry.statystyki);
        STATS_LIST.forEach(([key, label]) => {
            const row = document.createElement('div'); row.className = 'yci-stat-row';
            const uid = 'ysb_' + key, cur = initMap.get(key) || '';
            if (cur) row.classList.add('yci-stat-filled');
            row.innerHTML = `
                <label for="${uid}" title="${key}">${label} <span>(${key})</span></label>
                <input class="yci-stat-val${cur?' yci-val-filled':''}" id="${uid}" data-key="${key}" type="text" value="${escH(cur)}" placeholder="—">`;
            builderDiv.appendChild(row);
        });

        builderDiv.addEventListener('wheel', e => {
            e.stopPropagation();
            const atTop = builderDiv.scrollTop === 0, atBottom = builderDiv.scrollTop + builderDiv.clientHeight >= builderDiv.scrollHeight - 1;
            if ((e.deltaY < 0 && atTop)||(e.deltaY > 0 && atBottom)) { e.preventDefault(); fo.querySelector('#yci-form-body').scrollTop += e.deltaY; }
        }, { passive: false });
        fo.querySelector('#yci-form-body').addEventListener('wheel', e => e.stopPropagation(), { passive: true });

        builderDiv.addEventListener('input', () => { statsInput.value = serializeBuilder(); refreshBuilderHighlights(); });
        statsInput.addEventListener('input', () => { applyMapToBuilder(parseStatStr(statsInput.value)); });

        let builderOpen = false;
        builderToggle.addEventListener('click', () => {
            builderOpen = !builderOpen;
            builderDiv.style.display = builderOpen ? 'grid' : 'none';
            builderToggle.textContent = builderOpen ? '▲ Builder' : '▼ Builder';
        });
        let pasteOpen = false;
        pasteToggle.addEventListener('click', () => {
            pasteOpen = !pasteOpen;
            pasteSection.style.display = pasteOpen ? 'block' : 'none';
            pasteToggle.textContent = pasteOpen ? '📋 Zwiń' : '📋 Wklej z tooltipa';
            if (pasteOpen) setTimeout(() => pasteArea.focus(), 50);
        });
        pasteApply.addEventListener('click', () => {
            const text = pasteArea.value.trim();
            if (!text) { pasteInfo.textContent = 'Wklej najpierw tekst.'; pasteInfo.className = 'yci-paste-info err'; return; }
            const parsed = parseTooltipText(text);
            if (parsed.size === 0) { pasteInfo.textContent = 'Nie rozpoznano żadnych statystyk.'; pasteInfo.className = 'yci-paste-info err'; return; }
            const current = parseStatStr(statsInput.value);
            for (const [k, v] of parsed) current.set(k, v);
            statsInput.value = serializeStat(current);
            applyMapToBuilder(current);
            const names = [...parsed.keys()].map(k => (STATS_LIST.find(s=>s[0]===k)||[k,k])[1]);
            pasteInfo.textContent = `✓ Wczytano ${parsed.size}: ${names.join(', ')}`;
            pasteInfo.className = 'yci-paste-info ok';
            if (!builderOpen) { builderOpen = true; builderDiv.style.display = 'grid'; builderToggle.textContent = '▲ Builder'; }
        });
        pasteArea.addEventListener('keydown', e => { if ((e.ctrlKey||e.metaKey) && e.key==='Enter') { e.preventDefault(); pasteApply.click(); } });
        clearBtn.addEventListener('click', () => {
            if (!confirm('Wyczyścić wszystkie statystyki?')) return;
            statsInput.value = '';
            builderDiv.querySelectorAll('.yci-stat-val').forEach(inp => { inp.value=''; inp.classList.remove('yci-val-filled'); inp.closest('.yci-stat-row').classList.remove('yci-stat-filled'); });
            pasteArea.value = ''; pasteInfo.textContent = '';
        });

        // icon preview
        const previewImg = fo.querySelector('#yci-preview-img');
        const grafInput  = fo.querySelector('#yf-grafika');
        function updatePreview() {
            const url = grafInput.value.trim();
            if (url.startsWith('http')) { previewImg.src=url; previewImg.style.display='inline-block'; previewImg.onerror=()=>{previewImg.style.display='none';}; }
            else if (url) { previewImg.src=`https://micc.garmory-cdn.cloud/obrazki/itemy/${url}`; previewImg.style.display='inline-block'; previewImg.onerror=()=>{previewImg.style.display='none';}; }
            else { previewImg.style.display='none'; }
        }
        grafInput.addEventListener('input', updatePreview); updatePreview();

        // loot preview
        function updateLootPreview() {
            const previewEl = fo.querySelector('#yf-loot-preview'); if (!previewEl) return;
            const nick=fo.querySelector('#yf-lootBy').value.trim();
            const monster=fo.querySelector('#yf-lootMonster').value.trim();
            const date=fo.querySelector('#yf-lootDate').value.trim();
            const group=fo.querySelector('#yf-lootGroup').value;
            if (!nick&&!monster&&!date) { previewEl.innerHTML='<span style="color:var(--yci-text-dim);font-style:italic;font-size:11px">Wypełnij pola powyżej…</span>'; return; }
            let ts=0;
            if (/^\d+$/.test(date)) ts=parseInt(date,10);
            else if (/\d{2}\.\d{2}\.\d{4}/.test(date)) { const [d,m,y]=date.split('.'); ts=Math.floor(new Date(`${y}-${m}-${d}T12:00:00Z`).getTime()/1000); }
            const statVal=`${nick||'??'},m,${group},${ts||0},${monster||'??'}`;
            const dateStr=ts?new Date(ts*1000).toLocaleDateString('pl-PL'):(date||'??');
            const suffix=group==='1'?'':group==='2'?' wraz z kompanem':' wraz z drużyną';
            const human=`W dniu ${dateStr} został(a) pokonany(a) ${monster||'??'} przez ${nick||'??'}${suffix}`;
            previewEl.innerHTML=`<span style="color:var(--yci-text)">${escH(human)}</span><br><span style="color:var(--yci-text-dim);font-size:10px">loot=${escH(statVal)}</span>`;
        }
        ['#yf-lootBy','#yf-lootMonster','#yf-lootDate','#yf-lootGroup'].forEach(sel=>fo.querySelector(sel)?.addEventListener('input',updateLootPreview));
        updateLootPreview();

        // ---- SAVE (does NOT close form) ----
        fo.querySelector('#yf-save').addEventListener('click', () => {
            const errEl = fo.querySelector('#yci-form-err');
            const key = fo.querySelector('#yf-key').value.trim();
            if (!key) { errEl.textContent='Klucz jest wymagany.'; return; }

            const legType = fo.querySelector('#yf-legBonusType').value;
            // No dynamic bonus fields anymore — legendaryBonus stored as empty object
            const legBonus = entry.legendaryBonus || {};

            const bindingRadio = fo.querySelector('input[name="yf-binding"]:checked');
            const binding = bindingRadio ? bindingRadio.value : '';
            const enhRaw = upgradeHid.value.trim();

            const updated = {
                id: entry.id, enabled: entry.enabled!==false, key,
                nazwa:               fo.querySelector('#yf-nazwa').value.trim(),
                opis:                fo.querySelector('#yf-opis').value.trim(),
                rzadkosc:            fo.querySelector('#yf-rzadkosc').value,
                grafika:             fo.querySelector('#yf-grafika').value.trim(),
                typ:                 fo.querySelector('#yf-typ').value,
                profesja:            fo.querySelector('#yf-profesja').value.trim(),
                lvl:                 fo.querySelector('#yf-lvl').value.trim(),
                wartosc:             fo.querySelector('#yf-wartosc').value.trim(),
                statystyki:          fo.querySelector('#yf-statystyki').value.trim(),
                tylkoNoweStatystyki: fo.querySelector('#yf-tylkoNowe').checked,
                lootDate:            fo.querySelector('#yf-lootDate').value.trim(),
                lootMonster:         fo.querySelector('#yf-lootMonster').value.trim(),
                lootBy:              fo.querySelector('#yf-lootBy').value.trim(),
                lootGroup:           fo.querySelector('#yf-lootGroup').value,
                legendaryBonusType:  legType,
                legendaryBonus:      legBonus,
                binding,
                enhancementUpgradeLvl: enhRaw,
                enhancementStat:       '',
            };

            let saved = loadItems();
            if (isNew) saved.push(updated);
            else { const idx=saved.findIndex(e=>e.id===entry.id); if(idx!==-1)saved[idx]=updated; else saved.push(updated); }
            saveItems(saved);
            rebuildLookups();

            // Apply changes immediately to existing items in game
            applyToExistingItems();

            // Update panel list without closing form
            if (panelEl) {
                const tbody=panelEl.querySelector('#yci-tbody');
                const old=tbody.querySelector(`tr[data-id="${entry.id}"]`);
                const newRow=renderRow(updated);
                if(old)old.replaceWith(newRow); else tbody.appendChild(newRow);
                updateEmpty(); updateCount();
            }

            // Visual feedback: flash form border green instead of closing
            fo.classList.remove('yci-saved');
            void fo.offsetWidth; // force reflow to restart animation
            fo.classList.add('yci-saved');
            errEl.textContent = '';

            // Update title if it was a new entry (now it's edit)
            if (isNew) {
                fo.querySelector('#yci-form-title-text').textContent = '✎ Edytuj wpis';
                fo.querySelector('#yf-save').textContent = 'Zapisz';
                // Update entry.id reference so subsequent saves update correctly
                entry.id = updated.id;
                entry.enabled = updated.enabled;
            }
            // Sync entry reference for future saves in same session
            Object.assign(entry, updated);

            showStatus(`Zapisano: ${updated.nazwa||key}`);
        });
    }

    function openExport() {
        document.getElementById('yci-ie-box')?.remove();
        const list=loadItems();
        const io=document.createElement('div'); io.id='yci-ie-box';
        io.style.left=`${Math.round((window.innerWidth-480)/2)}px`; io.style.top=`${Math.round((window.innerHeight-360)/2)}px`;
        io.innerHTML=`<div id="yci-ie-title">↑ Eksport JSON</div><div id="yci-ie-body"><p style="font-size:13px;color:var(--yci-text-dim);margin:0">Skopiuj JSON żeby zapisać wpisy.</p><textarea id="yci-ie-textarea" readonly>${JSON.stringify(list,null,2)}</textarea></div><div id="yci-ie-footer"><button class="yci-btn yci-btn-primary" id="yci-ie-copy">Kopiuj</button><button class="yci-btn" id="yci-ie-close">Zamknij</button></div>`;
        document.body.appendChild(io);
        makeDraggable(io,io.querySelector('#yci-ie-title'),null);
        io.querySelector('#yci-ie-close').addEventListener('click',()=>io.remove());
        io.querySelector('#yci-ie-copy').addEventListener('click',()=>{const ta=io.querySelector('#yci-ie-textarea');ta.select();navigator.clipboard.writeText(ta.value).catch(()=>document.execCommand('copy'));showStatus('Skopiowano JSON!');});
    }

    function openImport() {
        document.getElementById('yci-ie-box')?.remove();
        const io=document.createElement('div'); io.id='yci-ie-box';
        io.style.left=`${Math.round((window.innerWidth-480)/2)}px`; io.style.top=`${Math.round((window.innerHeight-400)/2)}px`;
        io.innerHTML=`<div id="yci-ie-title">↓ Import JSON</div><div id="yci-ie-body"><p style="font-size:13px;color:var(--yci-text-dim);margin:0">Wklej JSON z eksportu. <strong style="color:var(--yci-danger)">Zastąpi wszystkie wpisy!</strong></p><textarea id="yci-ie-textarea" placeholder='[{"id":...}]'></textarea><div id="yci-ie-err"></div></div><div id="yci-ie-footer"><button class="yci-btn yci-btn-primary" id="yci-ie-do">Importuj</button><button class="yci-btn" id="yci-ie-close">Anuluj</button></div>`;
        document.body.appendChild(io);
        makeDraggable(io,io.querySelector('#yci-ie-title'),null);
        io.querySelector('#yci-ie-close').addEventListener('click',()=>io.remove());
        io.querySelector('#yci-ie-do').addEventListener('click',()=>{
            const errEl=io.querySelector('#yci-ie-err');
            try {
                const parsed=JSON.parse(io.querySelector('#yci-ie-textarea').value);
                if(!Array.isArray(parsed))throw new Error('JSON musi być tablicą []');
                saveItems(parsed);rebuildLookups();io.remove();
                if(panelEl){const tbody=panelEl.querySelector('#yci-tbody');tbody.innerHTML='';for(const e of parsed)tbody.appendChild(renderRow(e));updateEmpty();updateCount();}
                showStatus(`Zaimportowano ${parsed.length} wpisów.`);
            } catch(e){errEl.textContent='Błąd: '+e.message;}
        });
    }

    function initUI() {
        const style=document.createElement('style'); style.id='yci-styles'; style.textContent=CSS;
        document.head.appendChild(style);
        createMini();
    }

    initUI();
    ensureTooltipObserver();

    const interval=setInterval(()=>{
        if(window?.Engine?.allInit&&window.Engine.items){
            clearInterval(interval);
            hookUpdateDATA();
            applyToExistingItems();
        }
    },100);

})();
