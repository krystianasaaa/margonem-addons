// ==UserScript==
// @name         Better UI - Kaczor DEV Final Fix
// @version      15.0
// @author       kaczka
// @match        https://dream.margonem.pl/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- KLASA OKNA (TWOJA) ---
    const activeWnds = {};
    class Window {
        constructor(options) {
            this.id = options.id || "BUI_WND_MAIN";
            if (activeWnds[this.id]) activeWnds[this.id].close();

            this.wnd = window.Engine.windowManager.add({
                content: " ",
                nameWindow: this.id,
                title: options.header,
                onclose: () => { delete activeWnds[this.id]; if(options.onclose) options.onclose(); }
            });

            activeWnds[this.id] = this.wnd;
            this.$userContent = document.createElement("div");
            this.$userContent.className = "bui-master-container";
            
            // Fix na scroll kółkiem
            this.$userContent.addEventListener('wheel', e => e.stopPropagation(), { passive: false });
            
            this.wnd.content(this.$userContent);
            this.wnd.addToMAlertLayer();
            
            this.$el = this.wnd.$[0];
            this.$el.style.width = (options.width || 500) + "px";
            this.$el.style.height = (options.height || 450) + "px";
            this.wnd.center();
        }

        setContent(el) {
            this.$userContent.innerHTML = "";
            if (typeof el === 'string') this.$userContent.innerHTML = el;
            else this.$userContent.appendChild(el);
        }

        close() { this.wnd.close(); }
    }

    // --- LOGIKA CORE ---
    const BetterUI = {
        config: JSON.parse(localStorage.getItem('betterUI_config') || '{"bonusyLegendarne":true,"statystykiPrzedmiotow":true,"interfejs":true,"kalkulatorUlepszen":true}'),
        editableBonuses: JSON.parse(localStorage.getItem('betterUI_editableBonuses') || '{"legendarne":{},"statystyki":{},"interfejs":{},"legendarne_disabled":{},"statystyki_disabled":{},"interfejs_disabled":{}}'),
        activeTab: 'legendarne',
        bonusNames: {},

        init() {
            this.updateBonusNames();
            this.injectStyles();
            this.setupHooks();
            this.startWatcher();
        },

        updateBonusNames() {
            this.bonusNames = {};
            const defLeg = { 'Cios bardzo krytyczny': '💀 POTĘŻNE PIERDOLNIĘCIE 💀', 'Dotyk anioła': 'Dotyk', 'Klątwa': 'Klątwa', 'Oślepienie': 'Oślepa', 'Ostatni ratunek': 'OR', 'Krytyczna osłona': 'KO', 'Fasada opieki': 'Fasada', 'Płomienne oczyszczenie': 'Płomienne', 'Krwawa udręka': 'Krwawa' };
            const defStat = { 'Cios krytyczny': 'Kryt', 'Przebicie': 'Przebitka', 'Głęboka rana': 'GR', 'Unik': 'Unik', 'Blok': 'Blok', 'Szybkość ataku': 'SA' };
            
            if (this.config.bonusyLegendarne) this.merge(defLeg, 'legendarne');
            if (this.config.statystykiPrzedmiotow) this.merge(defStat, 'statystyki');
        },

        merge(defaults, type) {
            const merged = { ...defaults, ...this.editableBonuses[type] };
            const disabled = this.editableBonuses[type + '_disabled'] || {};
            Object.entries(merged).forEach(([k, v]) => { if (!disabled[k]) this.bonusNames[k] = v; });
        },

        save() {
            localStorage.setItem('betterUI_config', JSON.stringify(this.config));
            localStorage.setItem('betterUI_editableBonuses', JSON.stringify(this.editableBonuses));
            this.updateBonusNames();
        },

        // --- ENGINE TOOLTIPÓW ---
        setupHooks() {
            const self = this;
            const originalSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(val) {
                    if (typeof val === 'string' && val.includes('item-tip')) {
                        if (!this.closest('.bui-master-container')) {
                            val = self.processTooltip(val);
                        }
                    }
                    return originalSet.call(this, val);
                },
                configurable: true
            });
        },

        processTooltip(html) {
            // Podmiana nazw bonusów
            Object.entries(this.bonusNames).forEach(([orig, repl]) => {
                const reg = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                html = html.replace(reg, repl);
            });

            // Kalkulator ulepszeń
            if (this.config.kalkulatorUlepszen && html.includes('Poziom:') && !html.includes('Koszt ulepszeń:')) {
                const lvlMatch = html.match(/Poziom:\s*(\d+)/i);
                if (lvlMatch) {
                    const lvl = parseInt(lvlMatch[1]);
                    const gold = (lvl * 5500).toLocaleString().replace(/,/g, ' ');
                    const pts = (lvl * 180).toLocaleString().replace(/,/g, ' ');
                    const calcHtml = `
                        <div style="border-top:1px solid #444; margin-top:8px; padding-top:5px; font-size:10px;">
                            <b style="color:#d4b87a">KOSZT ULEPSZEŃ (+5):</b><br>
                            <span style="color:#eee">Złoto: ~${gold}</span> | <span style="color:#87CEEB">Pkt: ~${pts}</span>
                        </div>
                    `;
                    html = html.replace(/<div class="item-tip-section">/i, calcHtml + '<div class="item-tip-section">');
                }
            }
            return html;
        },

        // --- RENDERER INTERFEJSU ---
        render() {
            const root = document.createElement('div');
            root.className = "bui-master-container";
            root.innerHTML = `
                <div class="k-nav-tabs">
                    <div class="k-nav-btn ${this.activeTab === 'legendarne' ? 'active' : ''}" data-t="legendarne">Legendarne</div>
                    <div class="k-nav-btn ${this.activeTab === 'statystyki' ? 'active' : ''}" data-t="statystyki">Statystyki</div>
                    <div class="k-nav-btn ${this.activeTab === 'kalkulator' ? 'active' : ''}" data-t="kalkulator">Kalkulator</div>
                </div>
                <div class="k-scroll-body" id="bui-content"></div>
            `;

            const content = root.querySelector('#bui-content');
            
            if (this.activeTab === 'kalkulator') {
                content.innerHTML = `
                    <div class="k-row-ui" style="justify-content: center; padding: 30px;">
                        <span style="margin-right: 15px;">Włącz kalkulator ulepszeń w tooltipach</span>
                        <input type="checkbox" class="k-on-check" ${this.config.kalkulatorUlepszen ? 'checked' : ''} id="calc-toggle">
                    </div>
                `;
                setTimeout(() => {
                    const cb = document.getElementById('calc-toggle');
                    if(cb) cb.onchange = (e) => { this.config.kalkulatorUlepszen = e.target.checked; this.save(); };
                }, 10);
            } else {
                const type = this.activeTab;
                const defs = (type === 'legendarne') ? 
                    { 'Cios bardzo krytyczny': '💀 POTĘŻNE PIERDOLNIĘCIE 💀', 'Dotyk anioła': 'Dotyk', 'Klątwa': 'Klątwa' } : 
                    { 'Cios krytyczny': 'Kryt', 'Szybkość ataku': 'SA' };
                
                const all = { ...defs, ...this.editableBonuses[type] };

                Object.entries(all).forEach(([orig, repl]) => {
                    const isDisabled = this.editableBonuses[type + '_disabled'][orig];
                    const row = document.createElement('div');
                    row.className = 'k-row-ui';
                    row.innerHTML = `
                        <input type="checkbox" class="k-on-check" ${!isDisabled ? 'checked' : ''} data-orig="${orig}">
                        <span style="flex:1; margin-left:10px; font-size:11px;">${orig}</span>
                        <input type="text" class="k-input-repl" value="${repl}" data-orig="${orig}">
                    `;
                    
                    row.querySelector('.k-on-check').onchange = (e) => {
                        const o = e.target.dataset.orig;
                        if (e.target.checked) delete this.editableBonuses[type + '_disabled'][o];
                        else this.editableBonuses[type + '_disabled'][o] = true;
                        this.save();
                    };
                    
                    row.querySelector('.k-input-repl').onchange = (e) => {
                        const o = e.target.dataset.orig;
                        this.editableBonuses[type][o] = e.target.value;
                        this.save();
                    };

                    content.appendChild(row);
                });
            }

            root.querySelectorAll('.k-nav-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    this.activeTab = btn.dataset.t;
                    this.updateUI();
                };
            });

            return root;
        },

        updateUI() {
            if (this.wnd) {
                this.wnd.setContent(this.render());
            }
        },

        injectStyles() {
            if (document.getElementById('bui-master-css')) return;
            const s = document.createElement('style');
            s.id = 'bui-master-css';
            s.textContent = `
                .bui-master-container { background: #080808; color: #eee; height: 100%; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #1a1a1a; }
                .k-scroll-body { flex: 1; overflow-y: auto; padding-bottom: 15px; }
                .k-scroll-body::-webkit-scrollbar { width: 5px; }
                .k-scroll-body::-webkit-scrollbar-thumb { background: #6b4c1e; border-radius: 3px; }
                .k-nav-tabs { display: flex; background: #121212; border-bottom: 1px solid #333; flex-shrink: 0; }
                .k-nav-btn { flex: 1; padding: 12px; text-align: center; cursor: pointer; font-size: 10px; font-weight: bold; color: #555; text-transform: uppercase; border-bottom: 2px solid transparent; transition: 0.2s; }
                .k-nav-btn.active { color: #d4b87a; border-bottom-color: #d4b87a; background: rgba(212, 184, 122, 0.05); }
                .k-row-ui { display: flex; padding: 8px 15px; border-bottom: 1px solid rgba(255,255,255,0.03); align-items: center; justify-content: space-between; gap: 10px; }
                .k-row-ui:hover { background: rgba(255,255,255,0.01); }
                .k-input-repl { background: #1a1a1a; border: 1px solid #444; color: #ccc; padding: 5px 10px; border-radius: 3px; width: 140px; font-size: 11px; }
                .k-input-repl:focus { border-color: #d4b87a; outline: none; }
                .k-on-check { appearance: none; width: 16px; height: 16px; border: 2px solid #555; border-radius: 3px; background: #222; cursor: pointer; position: relative; flex-shrink: 0; }
                .k-on-check:checked { background: #3a6e2a; border-color: #4a8a30; }
                .k-on-check:checked::after { content: '✔'; position: absolute; top: -2px; left: 1px; color: #fff; font-size: 11px; }
                .k-bui-gear { cursor: pointer; margin-left: 8px; transition: 0.2s; opacity: 0.6; display: inline-block; vertical-align: middle; }
                .k-bui-gear:hover { opacity: 1; color: #d4b87a; transform: rotate(45deg); }
            `;
            document.head.appendChild(s);
        },

        startWatcher() {
            setInterval(() => {
                const row = [...document.querySelectorAll('.kwak-row-name')].find(d => d.textContent.trim() === 'Better UI');
                if (row && !row.querySelector('.k-bui-gear')) {
                    const gear = document.createElement('span');
                    gear.className = 'k-bui-gear';
                    gear.innerHTML = ' ⚙️';
                    gear.onclick = (e) => {
                        e.stopPropagation();
                        this.wnd = new Window({ header: "Better UI - Ustawienia", id: "W_BUI_SETTINGS" });
                        this.updateUI();
                    };
                    row.appendChild(gear);
                }
            }, 1000);
        }
    };

    window.BetterUI = BetterUI;
    BetterUI.init();
})();
