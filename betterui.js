(function() {
    'use strict';

    let config = { bonusyLegendarne: true, statystykiPrzedmiotow: true, interfejs: true, kalkulatorUlepszen: true };
    let editableBonuses = { legendarne: {}, statystyki: {}, interfejs: {}, legendarne_disabled: {}, statystyki_disabled: {}, interfejs_disabled: {} };
    let calculatorRarities = { zwykly: true, unikatowy: true, heroiczny: true, ulepszony: true, legendarny: true };

    function saveConfig() {
        localStorage.setItem('betterUI_config', JSON.stringify(config));
        localStorage.setItem('betterUI_editableBonuses', JSON.stringify(editableBonuses));
        localStorage.setItem('betterUI_calculatorRarities', JSON.stringify(calculatorRarities));
    }

    function loadConfig() {
        const c = localStorage.getItem('betterUI_config');
        const b = localStorage.getItem('betterUI_editableBonuses');
        const r = localStorage.getItem('betterUI_calculatorRarities');
        if (c) config = { ...config, ...JSON.parse(c) };
        if (b) editableBonuses = { ...editableBonuses, ...JSON.parse(b) };
        if (r) calculatorRarities = { ...calculatorRarities, ...JSON.parse(r) };
    }

    class Window {
        constructor(options) {
            this.wnd = window.Engine.windowManager.add({
                content: " ",
                nameWindow: options.header || " ",
                parentObj: null,
                title: options.header,
                onclose: options.onclose
            });
            this.$ = this.wnd.$[0];
            this.$userContent = document.createElement("div");
            this.$userContent.className = "bui-scroll-pane";

            // FIX NA SCROLL MYSZKĄ
            this.$userContent.addEventListener('wheel', (e) => {
                e.stopPropagation();
            }, { passive: false });

            this.wnd.content(this.$userContent);
            this.wnd.addToMAlertLayer();
            this.wnd.setWndOnPeak();
            this.wnd.center();
        }
        setContent(el) {
            this.$userContent.innerHTML = "";
            this.$userContent.appendChild(el);
        }
    }

    const UI = {
        activeTab: 'legendarne',
        wnd: null,

        createStyles() {
            if (document.getElementById('bui-v52-styles')) return;
            const s = document.createElement('style');
            s.id = 'bui-v52-styles';
            s.textContent = `
                .bui-wrap { min-width: 500px; color: #eee; font-family: inherit; }
                .bui-scroll-pane { max-height: 420px; overflow-y: auto; overflow-x: hidden; padding-bottom: 10px; }

                .bui-scroll-pane::-webkit-scrollbar { width: 5px; }
                .bui-scroll-pane::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .bui-scroll-pane::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

                .bui-tabs { display: flex; gap: 2px; padding: 6px 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); }
                .bui-tab {
                    padding: 8px 16px; font-size: 10px; font-weight: bold; text-transform: uppercase;
                    cursor: pointer; border: 1px solid transparent; border-bottom: none;
                    color: rgba(255,255,255,0.4); transition: 0.15s;
                }
                .bui-tab.active { color: #fff; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }

                .bui-row {
                    display: flex; align-items: center; gap: 10px; padding: 7px 12px;
                    margin: 4px 10px; border-radius: 4px; background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;
                }
                .bui-row:hover { background: rgba(255,255,255,0.06); }

                /* NOWY CUSTOM CHECKBOX / TOGGLE */
                .bui-checkbox {
                    appearance: none; -webkit-appearance: none;
                    width: 16px; height: 16px; border: 2px solid #555;
                    border-radius: 3px; background: #222; cursor: pointer;
                    position: relative; flex-shrink: 0; transition: 0.2s;
                }
                .bui-checkbox:checked { background: #3a6e2a; border-color: #4a8a30; }
                .bui-checkbox:checked::after {
                    content: '✔'; position: absolute; top: -2px; left: 1px;
                    color: #fff; font-size: 11px;
                }

                .bui-input {
                    background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1);
                    color: #ccc; padding: 5px 10px; font-size: 11px; flex: 1; border-radius: 3px;
                }
                .bui-input:focus { border-color: #6b4c1e; outline: none; background: rgba(0,0,0,0.6); }

                .bui-btn-del { background: rgba(110, 42, 42, 0.6); border: 1px solid #8e3a3a; color: #fff; cursor: pointer; padding: 4px 8px; border-radius: 3px; font-size: 9px; opacity: 0.7; transition: 0.2s; }
                .bui-btn-del:hover { opacity: 1; background: #6e2a2a; }

                .bui-footer { display: flex; gap: 8px; padding: 12px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.1); }
                .bui-footer-btn {
                    flex: 1; padding: 8px; cursor: pointer; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1); color: #bbb; font-size: 10px; text-transform: uppercase; font-weight: bold;
                }
                .bui-footer-btn:hover { background: rgba(58, 110, 42, 0.2); border-color: #3a6e2a; color: #fff; }
                .bui-gear { cursor: pointer; margin-left: 6px; opacity: 0.5; transition: 0.2s; vertical-align: middle; }
                .bui-gear:hover { opacity: 1; color: #7bc87a; transform: rotate(45deg); }
            `;
            document.head.appendChild(s);
        },

        render() {
            const root = document.createElement('div');
            root.className = 'bui-wrap';

            const tabs = document.createElement('div');
            tabs.className = 'bui-tabs';
            ['legendarne', 'statystyki', 'interfejs', 'kalkulator'].forEach(t => {
                const btn = document.createElement('div');
                btn.className = `bui-tab ${this.activeTab === t ? 'active' : ''}`;
                btn.textContent = t;
                btn.onclick = (e) => { e.stopPropagation(); this.activeTab = t; this.refresh(); };
                tabs.appendChild(btn);
            });
            root.appendChild(tabs);

            const cont = document.createElement('div');
            cont.style.padding = "10px 0";

            if (this.activeTab === 'kalkulator') {
                cont.innerHTML = `<div class="bui-row">
                    <input type="checkbox" class="bui-checkbox" id="bui-calc-master" ${config.kalkulatorUlepszen ? 'checked' : ''}>
                    <span style="font-size:11px; font-weight:bold;">Włącz kalkulator ulepszeń w tooltipach</span>
                </div>
                <div style="padding: 12px 15px 5px; font-size:10px; color:#666; text-transform:uppercase; letter-spacing:1px;">Widoczność dla rang:</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; padding: 0 5px;">
                    ${Object.keys(calculatorRarities).map(r => `
                        <div class="bui-row" style="margin: 3px 5px;">
                            <input type="checkbox" class="bui-checkbox bui-rar-check" data-rar="${r}" ${calculatorRarities[r] ? 'checked' : ''}>
                            <span style="font-size:11px; text-transform: capitalize;">${r}</span>
                        </div>
                    `).join('')}
                </div>`;
            } else {
                const type = this.activeTab;
                const defs = this.getDefaults(type);
                const all = { ...defs, ...editableBonuses[type] };

                Object.entries(all).forEach(([orig, repl]) => {
                    const isCustom = !defs.hasOwnProperty(orig);
                    const isDisabled = editableBonuses[type + '_disabled'][orig];
                    const row = document.createElement('div');
                    row.className = 'bui-row';
                    row.innerHTML = `
                        <input type="checkbox" class="bui-checkbox bui-row-toggle" ${!isDisabled ? 'checked' : ''}>
                        <input type="text" class="bui-input" value="${orig}" ${!isCustom ? 'readonly' : ''} style="${!isCustom ? 'opacity:0.5; cursor:default;' : ''}">
                        <span style="color:#555">➔</span>
                        <input type="text" class="bui-input bui-repl-val" value="${repl}">
                        ${isCustom ? '<button class="bui-btn-del">USUŃ</button>' : '<div style="width:45px"></div>'}
                    `;

                    row.querySelector('.bui-row-toggle').onchange = (e) => {
                        if (e.target.checked) delete editableBonuses[type + '_disabled'][orig];
                        else editableBonuses[type + '_disabled'][orig] = true;
                        saveConfig();
                    };
                    row.querySelector('.bui-repl-val').onchange = (e) => {
                        editableBonuses[type][orig] = e.target.value;
                        saveConfig();
                    };
                    if (isCustom) row.querySelector('.bui-btn-del').onclick = () => {
                        delete editableBonuses[type][orig];
                        saveConfig();
                        this.refresh();
                    };
                    cont.appendChild(row);
                });

                const addBtn = document.createElement('button');
                addBtn.className = 'bui-footer-btn';
                addBtn.style.margin = "15px 10px 5px";
                addBtn.style.width = "calc(100% - 20px)";
                addBtn.style.background = "rgba(58, 110, 42, 0.1)";
                addBtn.textContent = '+ DODAJ WŁASNY SKRÓT';
                addBtn.onclick = () => {
                    const key = "Nowy_" + Date.now();
                    editableBonuses[type][key] = "Skrót";
                    saveConfig();
                    this.refresh();
                };
                cont.appendChild(addBtn);
            }
            root.appendChild(cont);

            const footer = document.createElement('div');
            footer.className = 'bui-footer';
            footer.innerHTML = `
                <button class="bui-footer-btn" id="bui-export">Eksportuj Plik</button>
                <button class="bui-footer-btn" id="bui-import">Importuj Kod</button>
            `;
            root.appendChild(footer);

            return root;
        },

        refresh() {
            if (this.wnd) {
                this.wnd.setContent(this.render());
                this.bindEvents();
            }
        },

        bindEvents() {
            const master = document.getElementById('bui-calc-master');
            if (master) master.onchange = (e) => { config.kalkulatorUlepszen = e.target.checked; saveConfig(); };

            document.querySelectorAll('.bui-rar-check').forEach(el => {
                el.onchange = (e) => { calculatorRarities[e.target.dataset.rar] = e.target.checked; saveConfig(); };
            });

            document.getElementById('bui-export').onclick = () => {
                const data = JSON.stringify({ config, editableBonuses, calculatorRarities });
                const blob = new Blob([data], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'betterui_settings.json'; a.click();
            };
            document.getElementById('bui-import').onclick = () => {
                const val = prompt("Wklej kod JSON ustawień:");
                if (val) {
                    try {
                        const parsed = JSON.parse(val);
                        config = parsed.config; editableBonuses = parsed.editableBonuses;
                        calculatorRarities = parsed.calculatorRarities;
                        saveConfig(); location.reload();
                    } catch(e) { alert("Błąd formatu JSON!"); }
                }
            };
        },

        getDefaults(type) {
            if (type === 'legendarne') return { 'Cios bardzo krytyczny': '💀 POTĘŻNE PIERDOLNIĘCIE 💀', 'Dotyk anioła': 'Dotyczek', 'Klątwa': 'Klątewka', 'Oślepienie': 'Oślepa' };
            if (type === 'statystyki') return { 'Cios krytyczny': 'Kryt', 'Przebicie': 'Przebitka', 'Głęboka rana': 'GR', 'Unik': 'Unik', 'Blok': 'Blok' };
            return { 'Teleportuje gracza': 'Tepa na', 'Wewnętrzny spokój': 'umka dla cweli' };
        },

        open() {
            this.createStyles();
            this.wnd = new Window({ header: "Better UI - Ustawienia" });
            this.refresh();
        }
    };

    function injectGear() {
        setInterval(() => {
            const rows = document.querySelectorAll('.kwak-row');
            rows.forEach(row => {
                if (row.textContent.includes('Better UI') && !row.querySelector('.bui-gear')) {
                    const gear = document.createElement('span');
                    gear.className = 'bui-gear';
                    gear.innerHTML = ' ⚙️';
                    gear.onclick = (e) => { e.stopPropagation(); UI.open(); };
                    row.querySelector('.kwak-row-name').appendChild(gear);
                }
            });
        }, 1000);
    }

    loadConfig();
    injectGear();


    const originalSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
    Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(val) {
            if (typeof val === 'string' && val.includes('item-tip') && !this.closest('.bui-wrap')) {
            }
            return originalSet.call(this, val);
        },
        configurable: true
    });

})();
