(function() {
    'use strict';

    // --- TWOJE KLASY INTERFEJSU ---
    const activeWnds = {};
    class Window {
        constructor(options) {
            this.id = options.id || "BUI_WND_" + Date.now();
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
            this.$userContent.addEventListener('wheel', e => e.stopPropagation(), { passive: false });
            this.wnd.content(this.$userContent);
            this.wnd.addToMAlertLayer();
            const el = this.wnd.$[0];
            el.style.width = (options.width || 450) + "px";
            el.style.height = (options.height || 400) + "px";
            this.wnd.center();
        }
        setContent(el) {
            this.$userContent.innerHTML = "";
            if (typeof el === 'string') this.$userContent.innerHTML = el;
            else this.$userContent.appendChild(el);
        }
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
            const defLeg = { 'Cios bardzo krytyczny': '💀 POTĘŻNE PIERDOLNIĘCIE 💀', 'Dotyk anioła': 'Dotyczek', 'Klątwa': 'Klątewka', 'Oślepienie': 'Oślepa', 'Ostatni ratunek': 'OR', 'Krytyczna osłona': 'KO', 'Fasada opieki': 'Fasada' };
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
                        // Nie zmieniaj tekstów wewnątrz okna ustawień
                        if (!this.closest('.bui-master-container')) {
                            val = self.replaceText(val);
                        }
                    }
                    return originalSet.call(this, val);
                },
                configurable: true
            });
        },

        replaceText(text) {
            // Podmiana nazw
            Object.entries(this.bonusNames).forEach(([orig, repl]) => {
                const reg = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                text = text.replace(reg, repl);
            });
            // Kalkulator
            if (this.config.kalkulatorUlepszen && text.includes('Poziom:')) {
                text = this.injectCalculator(text);
            }
            return text;
        },

        injectCalculator(tooltip) {
            if (tooltip.includes('Koszt ulepszeń:')) return tooltip;
            const lvlMatch = tooltip.match(/Poziom:\s*(\d+)/i);
            if (!lvlMatch) return tooltip;
            const lvl = parseInt(lvlMatch[1]);
            
            // Prosta logika kalkulatora dla przykładu (można rozbudować o rangi)
            const gold = (lvl * 5500).toLocaleString();
            const pts = (lvl * 180).toLocaleString();

            const html = `
                <div style="border-top:1px solid #444; margin-top:8px; padding-top:5px; font-size:10px;">
                    <b style="color:#d4b87a">KOSZT ULEPSZEŃ (+5):</b><br>
                    <span style="color:#eee">Złoto: ~${gold}</span> | <span style="color:#87CEEB">Pkt: ~${pts}</span>
                </div>
            `;
            return tooltip.replace(/<div class="item-tip-section">/i, html + '<div class="item-tip-section">');
        },

        // --- UI USTAWIENIA ---
        render() {
            const root = document.createElement('div');
            root.className = "bui-master-container";
            root.innerHTML = `
                <div class="k-nav">
                    <div class="k-nav-btn ${this.activeTab === 'legendarne' ? 'active' : ''}" onclick="BetterUI.setTab('legendarne')">Legendarne</div>
                    <div class="k-nav-btn ${this.activeTab === 'statystyki' ? 'active' : ''}" onclick="BetterUI.setTab('statystyki')">Statystyki</div>
                    <div class="k-nav-btn ${this.activeTab === 'kalkulator' ? 'active' : ''}" onclick="BetterUI.setTab('kalkulator')">Kalkulator</div>
                </div>
                <div class="k-scroll" id="bui-body"></div>
            `;

            const body = root.querySelector('#bui-body');
            const type = this.activeTab;

            if (type === 'kalkulator') {
                body.innerHTML = `
                    <div class="k-row">
                        <span>Włącz kalkulator ulepszeń</span>
                        <input type="checkbox" class="k-on-check" ${this.config.kalkulatorUlepszen ? 'checked' : ''} onchange="BetterUI.config.kalkulatorUlepszen = this.checked; BetterUI.save();">
                    </div>
                `;
            } else {
                const defs = (type === 'legendarne') ? 
                    { 'Cios bardzo krytyczny': '💀 POTĘŻNE PIERDOLNIĘCIE 💀', 'Dotyk anioła': 'Dotyczek' } : 
                    { 'Cios krytyczny': 'Kryt', 'Szybkość ataku': 'SA' };
                
                const all = { ...defs, ...this.editableBonuses[type] };

                Object.entries(all).forEach(([orig, repl]) => {
                    const isDisabled = this.editableBonuses[type + '_disabled'][orig];
                    const row = document.createElement('div');
                    row.className = 'k-row';
                    row.innerHTML = `
                        <input type="checkbox" class="k-on-check" ${!isDisabled ? 'checked' : ''} onchange="BetterUI.toggleBonus('${type}', '${orig}', this.checked)">
                        <span style="flex:1; font-size:11px">${orig}</span>
                        <input type="text" class="k-btn-pro" style="width:100px; text-align:left;" value="${repl}" onchange="BetterUI.updateRepl('${type}', '${orig}', this.value)">
                    `;
                    body.appendChild(row);
                });
            }
            return root;
        },

        setTab(t) { this.activeTab = t; this.updateUI(); },
        updateUI() { if (this.wnd) this.wnd.setContent(this.render()); },
        toggleBonus(type, orig, val) {
            if (val) delete this.editableBonuses[type + '_disabled'][orig];
            else this.editableBonuses[type + '_disabled'][orig] = true;
            this.save();
        },
        updateRepl(type, orig, val) {
            this.editableBonuses[type][orig] = val;
            this.save();
        },

        injectStyles() {
            if (document.getElementById('bui-pro-styles')) return;
            const s = document.createElement('style');
            s.id = 'bui-pro-styles';
            s.textContent = `
                .bui-master-container { background: #0a0a0a; color: #eee; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
                .k-scroll { flex: 1; overflow-y: auto; padding: 10px 0; }
                .k-scroll::-webkit-scrollbar { width: 5px; }
                .k-scroll::-webkit-scrollbar-thumb { background: #6b4c1e; border-radius: 3px; }
                .k-nav { display: flex; background: #151515; border-bottom: 1px solid #333; }
                .k-nav-btn { flex: 1; padding: 12px; text-align: center; cursor: pointer; font-size: 10px; font-weight: bold; color: #555; text-transform: uppercase; }
                .k-nav-btn.active { color: #d4b87a; background: rgba(212, 184, 122, 0.05); border-bottom: 2px solid #d4b87a; }
                .k-row { display: flex; padding: 8px 15px; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 11px; align-items: center; justify-content: space-between; gap: 10px; }
                .k-btn-pro { background: #1a1a1a; border: 1px solid #444; color: #ccc; padding: 5px; border-radius: 3px; font-size: 10px; }
                .k-on-check { appearance: none; width: 16px; height: 16px; border: 2px solid #555; border-radius: 3px; background: #222; cursor: pointer; position: relative; }
                .k-on-check:checked { background: #3a6e2a; border-color: #4a8a30; }
                .k-on-check:checked::after { content: '✔'; position: absolute; top: -2px; left: 1px; color: #fff; font-size: 11px; }
                .k-bui-gear { cursor: pointer; margin-left: 6px; opacity: 0.6; transition: 0.2s; vertical-align: middle; }
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
                        BetterUI.wnd = new Window({ header: "Better UI - Ustawienia", width: 500, height: 450 });
                        BetterUI.updateUI();
                    };
                    row.appendChild(gear);
                }
            }, 1000);
        }
    };

    window.BetterUI = BetterUI;
    BetterUI.init();
})();
