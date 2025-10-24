(function() {
    'use strict';

    if (window.kamykiEnhancedRunning) {
        return;
    }
    window.kamykiEnhancedRunning = true;

    // ===== KONFIGURACJA =====
    let config = {
        enabled: localStorage.getItem('kamykiEnabled') !== 'false',
        
        // Tytani
        tytaniEnabled: localStorage.getItem('kamykiTytaniEnabled') !== 'false',
        tytani: JSON.parse(localStorage.getItem('kamykiTytani') || JSON.stringify({
            "189": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/dziewicza_orlica.gif" },
            "1746": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/zabojczy_krolik.gif" },
            "6949": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/renegat_baulus.gif" },
            "7060": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif" },
            "7477": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/titangoblin.gif" },
            "6477": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/lowcz-wspo-driady.gif" },
            "6476": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/przyz_demon_sekta.gif" },
            "7848": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/maddok-tytan.gif" },
            "5709": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif" },
            "3312": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/hebrehoth_smokoludzie.gif" },
            "2355": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/ice_king.gif" }
        })),

        // Kolosy
        kolosyEnabled: localStorage.getItem('kamykiKolosyEnabled') !== 'false',
        kolosy: JSON.parse(localStorage.getItem('kamykiKolosy') || JSON.stringify({
            "3361": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/mamlambo_final2.gif" },
            "3883": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif" },
            "202": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif" },
            "2149": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif" },
            "2310": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif" },
            "4046": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/soploreki.gif" },
            "1387": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/soploreki.gif" },
            "4066": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif" },
            "3535": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif" },
            "1876": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wazka.gif" },
            "6052": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolkrucz.gif" },
            "4206": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif" },
            "1131": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif" },
            "4266": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif" },
            "3596": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif" },
            "4268": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif" },
            "3037": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif" }
        })),

        // E2
        e2Enabled: localStorage.getItem('kamykiE2Enabled') !== 'false',
        e2: JSON.parse(localStorage.getItem('kamykiE2') || JSON.stringify({
            "580": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/st-puma.gif" },
            "632": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e1/kotolak_lowca.gif" },
            "5738": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif" },
            "2532": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-e2-zorg.gif" },
            "727": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif" },
            "3149": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif" },
            "4157": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dzik.gif" },
            "5293": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_shimger.gif" },
            "2308": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-szczet.gif" },
            "177": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif" }
        }))
    };

    function saveConfig() {
        localStorage.setItem('kamykiEnabled', config.enabled.toString());
        localStorage.setItem('kamykiTytaniEnabled', config.tytaniEnabled.toString());
        localStorage.setItem('kamykiKolosyEnabled', config.kolosyEnabled.toString());
        localStorage.setItem('kamykiE2Enabled', config.e2Enabled.toString());
        localStorage.setItem('kamykiTytani', JSON.stringify(config.tytani));
        localStorage.setItem('kamykiKolosy', JSON.stringify(config.kolosy));
        localStorage.setItem('kamykiE2', JSON.stringify(config.e2));
    }

    // ===== STYLE CSS =====
    const styles = `
        .kamyki-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            pointer-events: none;
        }

        .kamyki-dialog {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 0;
            width: 600px;
            max-width: 90vw;
            max-height: 90vh;
            color: #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            pointer-events: all;
        }

        .kamyki-header {
            background: #333;
            padding: 15px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #444;
            flex-shrink: 0;
        }

        .kamyki-header h3 {
            margin: 0;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            flex: 1;
        }

        .kamyki-close {
            background: none;
            border: none;
            color: #888;
            font-size: 20px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            padding: 0;
        }

        .kamyki-close:hover {
            color: #fff;
        }

        .kamyki-tabs {
            display: flex;
            background: #1a1a1a;
            border-bottom: 1px solid #444;
            flex-shrink: 0;
        }

        .kamyki-tab {
            flex: 1;
            padding: 12px;
            background: #1a1a1a;
            border: none;
            border-bottom: 2px solid transparent;
            color: #888;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .kamyki-tab:hover {
            background: #252525;
            color: #ccc;
        }

        .kamyki-tab.active {
            background: #2a2a2a;
            color: #5865F2;
            border-bottom-color: #5865F2;
        }

        .kamyki-content {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .kamyki-tab-content {
            display: none;
            padding: 15px;
            height: 100%;
            overflow-y: auto;
        }

        .kamyki-tab-content.active {
            display: block;
        }

        .kamyki-tab-content::-webkit-scrollbar {
            width: 8px;
        }

        .kamyki-tab-content::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .kamyki-tab-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        .kamyki-tab-content::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .kamyki-section {
            margin-bottom: 15px;
        }

        .kamyki-section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            padding: 8px;
            background: #333;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
        }

        .kamyki-section-header:hover {
            background: #3a3a3a;
        }

        .kamyki-section-toggle {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #555;
            border-radius: 3px;
            background: #2a2a2a;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
        }

        .kamyki-section-toggle:hover {
            border-color: #4CAF50;
        }

        .kamyki-section-toggle:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .kamyki-section-toggle:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .kamyki-section-title {
            color: #fff;
            font-weight: bold;
            font-size: 13px;
        }

        .kamyki-items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px;
            padding-left: 26px;
        }

        .kamyki-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 3px;
            transition: background 0.2s;
        }

        .kamyki-item:hover {
            background: #3a3a3a;
        }

        .kamyki-item-checkbox {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border: 2px solid #555;
            border-radius: 3px;
            background: #2a2a2a;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .kamyki-item-checkbox:hover {
            border-color: #4CAF50;
        }

        .kamyki-item-checkbox:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .kamyki-item-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }

        .kamyki-item-label {
            color: #ccc;
            font-size: 12px;
            flex: 1;
        }

        .kamyki-buttons {
            display: flex;
            gap: 8px;
            padding: 12px 15px;
            background: #2a2a2a;
            border-radius: 0 0 4px 4px;
            border-top: 1px solid #444;
            flex-shrink: 0;
        }

        .kamyki-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: background 0.2s;
            flex: 1;
        }

        .kamyki-btn-primary {
            background: #5865F2;
            color: white;
        }

        .kamyki-btn-primary:hover {
            background: #4752C4;
        }

        .kamyki-btn-secondary {
            background: #4e4e4e;
            color: white;
        }

        .kamyki-btn-secondary:hover {
            background: #5a5a5a;
        }

        .kamyki-btn-success {
            background: #3BA55D;
            color: white;
        }

        .kamyki-btn-success:hover {
            background: #2D7D46;
        }

        .kamyki-btn-reset {
            background: #ED4245;
            color: white;
        }

        .kamyki-btn-reset:hover {
            background: #C03537;
        }

        .kamyki-description {
            font-size: 11px;
            color: #888;
            padding: 10px;
            background: #1a1a1a;
            border-radius: 3px;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .priw8-item-small-icon img:not(.priw8-item-overlay) {
            width: 20px;
            height: 20px;
            top: 12px;
            z-index: 1;
        }

        .priw8-item-small-icon canvas.canvas-icon {
            width: 20px;
            height: 20px;
            top: 12px;
            z-index: 1;
        }

        .priw8-item-small-icon .amount, .priw8-item-small-icon .cooldown {
            z-index: 2;
        }

        .priw8-item-overlay {
            display: block;
        }
    `;

    // ===== DANE BOSS ÓW =====
    const bossData = {
        tytani: {
            "189": "Dziewicza Orlica",
            "1746": "Zabójczy królik",
            "6949": "Renegat Baulus",
            "7060": "Piekielny Arcymag",
            "7477": "Versus Zoons",
            "6477": "Łowczyni Wspomnień",
            "6476": "Przyzywacz Demonów",
            "7848": "Maddok Magua",
            "5709": "Tezcatlipoca",
            "3312": "Barbatos Smoczy Strażnik",
            "2355": "Tanroth"
        },
        kolosy: {
            "3361": "Mamlambo (36lvl)",
            "3883": "Regulus Mętnooki (63lvl)",
            "202": "Regulus Mętnooki (63lvl) ALT",
            "2149": "Umibozu (114lvl)",
            "2310": "Umibozu (114lvl) ALT",
            "4046": "Amaimon Soploręki (83lvl)",
            "1387": "Amaimon Soploręki (83lvl) ALT",
            "4066": "Hydrokora Chimeryczna (167lvl)",
            "3535": "Hydrokora Chimeryczna (167lvl) ALT",
            "1876": "Vashkar (144lvl)",
            "6052": "Lulukav (190lvl)",
            "4206": "Arachin Podstępny (213lvl)",
            "1131": "Arachin Podstępny (213lvl) ALT",
            "4266": "Reuzen (252lvl)",
            "3596": "Reuzen (252lvl) ALT",
            "4268": "Wernoradzki Drakolisz (279lvl)",
            "3037": "Wernoradzki Drakolisz (279lvl) ALT"
        },
        e2: {
            "580": "Mushita (23lvl)",
            "632": "Kotołak Tropiciel (27lvl)",
            "5738": "Shae Phu (30lvl)",
            "2532": "Zorg Jednooki Baron (33lvl)",
            "727": "Władca rzek (37lvl)",
            "3149": "Gobbos (40lvl)",
            "4157": "Tyrtajos (42lvl)",
            "5293": "Tollok Shimger (47lvl)",
            "2308": "Szczęt alias Gładki (47lvl)",
            "177": "Agar (51lvl)"
        }
    };

    // ===== FUNKCJE POWIADOMIEŃ =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== LOGIKA OVERLAY =====
    const NI = typeof window.Engine != "undefined";

    function loadItemImage(url) {
        const $newImg = document.createElement("img");
        $newImg.src = url;
        $newImg.classList.add("priw8-item-overlay");
        return new Promise(resolve => {
            $newImg.addEventListener("load", () => {
                let w = $newImg.width, h = $newImg.height;
                if (h > 32) {
                    w = w * (32 / h);
                    h = 32;
                }
                if (w > 32) {
                    h = h * (32 / w);
                    w = 32;
                }
                const offset = (32 - w) / 2;
                $newImg.width = w;
                $newImg.height = h;
                $newImg.style.left = `${offset}px`;
                $newImg.style.display = "block";
                resolve($newImg);
            });
        });
    }

    async function appendItemOverlay(id, url) {
        if (NI) {
            const $it = document.querySelector(`.item-id-${id}`);
            if ($it) {
                $it.classList.add("priw8-item-small-icon");
                const $newImg = await loadItemImage(url);
                $newImg.style.position = "absolute";
                $newImg.zIndex = 1;
                const $canv = $it.querySelector("canvas");
                $canv.parentElement.appendChild($newImg);
            }
        } else {
            g.loadQueue.push({
                fun: async () => {
                    const $it = document.querySelector(`#item${id}`);
                    if ($it) {
                        $it.classList.add("priw8-item-small-icon");
                        const $newImg = await loadItemImage(url);
                        const $img = $it.querySelector("img");
                        if ($img) {
                            $img.parentElement.appendChild($newImg);
                        }
                    }
                }
            });
        }
    }

    function onItem(items) {
        if (!config.enabled) return;

        for (const id in items) {
            const it = items[id];
            const tp = getItemTp(it);
            
            // Sprawdź w każdej kategorii
            if (config.tytaniEnabled && config.tytani[tp] && config.tytani[tp].enabled) {
                appendItemOverlay(id, config.tytani[tp].url);
            } else if (config.kolosyEnabled && config.kolosy[tp] && config.kolosy[tp].enabled) {
                appendItemOverlay(id, config.kolosy[tp].url);
            } else if (config.e2Enabled && config.e2[tp] && config.e2[tp].enabled) {
                appendItemOverlay(id, config.e2[tp].url);
            }
        }
    }

    function parseStats(stats) {
        if (!stats) return {};
        const spl = stats.split(";");
        const res = {};
        for (const entry of spl) {
            const pair = entry.split("=");
            res[pair[0]] = pair[1] ?? "true";
        }
        return res;
    }

    function getItemStats(it) {
        return it._cachedStats ?? parseStats(it.stat);
    }

    function getItemTp(it) {
        const stats = getItemStats(it);
        if (stats.teleport || stats.custom_teleport && stats.custom_teleport != "true") {
            return stats.teleport ?? stats.custom_teleport;
        }
        return "";
    }

    function getTpMap(tp) {
        return tp.split(",")[0];
    }

    // ===== OKNO USTAWIEŃ =====
    function showSettingsDialog() {
        const existingModal = document.querySelector('.kamyki-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'kamyki-modal';

        modal.innerHTML = `
            <div class="kamyki-dialog">
                <div class="kamyki-header" id="kamyki-header">
                    <h3>Kamyki - Ustawienia</h3>
                    <button class="kamyki-close" id="kamyki-close">×</button>
                </div>

                <div class="kamyki-tabs">
                    <button class="kamyki-tab active" data-tab="tytani">Tytani</button>
                    <button class="kamyki-tab" data-tab="kolosy">Kolosy</button>
                    <button class="kamyki-tab" data-tab="e2">E2</button>
                </div>

                <div class="kamyki-content">
                    <!-- TYTANI -->
                    <div class="kamyki-tab-content active" data-tab="tytani">
                        <div class="kamyki-description">
                            Włącz lub wyłącz grafiki dla kamieni teleportacji do Tytanów
                        </div>
                        <div class="kamyki-section">
                            <div class="kamyki-section-header" id="tytani-header">
                                <input type="checkbox" class="kamyki-section-toggle" id="tytani-toggle" ${config.tytaniEnabled ? 'checked' : ''}>
                                <span class="kamyki-section-title">Wszystkie Tytani</span>
                            </div>
                            <div class="kamyki-items-grid" id="tytani-items">
                                ${Object.entries(bossData.tytani).map(([id, name]) => `
                                    <div class="kamyki-item">
                                        <input type="checkbox" class="kamyki-item-checkbox" data-category="tytani" data-id="${id}" ${config.tytani[id]?.enabled ? 'checked' : ''}>
                                        <span class="kamyki-item-label">${name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- KOLOSY -->
                    <div class="kamyki-tab-content" data-tab="kolosy">
                        <div class="kamyki-description">
                            Włącz lub wyłącz grafiki dla kamieni teleportacji do Kolosów
                        </div>
                        <div class="kamyki-section">
                            <div class="kamyki-section-header" id="kolosy-header">
                                <input type="checkbox" class="kamyki-section-toggle" id="kolosy-toggle" ${config.kolosyEnabled ? 'checked' : ''}>
                                <span class="kamyki-section-title">Wszystkie Kolosy</span>
                            </div>
                            <div class="kamyki-items-grid" id="kolosy-items">
                                ${Object.entries(bossData.kolosy).map(([id, name]) => `
                                    <div class="kamyki-item">
                                        <input type="checkbox" class="kamyki-item-checkbox" data-category="kolosy" data-id="${id}" ${config.kolosy[id]?.enabled ? 'checked' : ''}>
                                        <span class="kamyki-item-label">${name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- E2 -->
                    <div class="kamyki-tab-content" data-tab="e2">
                        <div class="kamyki-description">
                            Włącz lub wyłącz grafiki dla kamieni teleportacji do bossów E2
                        </div>
                        <div class="kamyki-section">
                            <div class="kamyki-section-header" id="e2-header">
                                <input type="checkbox" class="kamyki-section-toggle" id="e2-toggle" ${config.e2Enabled ? 'checked' : ''}>
                                <span class="kamyki-section-title">Wszystkie E2</span>
                            </div>
                            <div class="kamyki-items-grid" id="e2-items">
                                ${Object.entries(bossData.e2).map(([id, name]) => `
                                    <div class="kamyki-item">
                                        <input type="checkbox" class="kamyki-item-checkbox" data-category="e2" data-id="${id}" ${config.e2[id]?.enabled ? 'checked' : ''}>
                                        <span class="kamyki-item-label">${name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="kamyki-buttons">
                    <button class="kamyki-btn kamyki-btn-success" id="kamyki-enable-all">Włącz wszystkie</button>
                    <button class="kamyki-btn kamyki-btn-secondary" id="kamyki-disable-all">Wyłącz wszystkie</button>
                    <button class="kamyki-btn kamyki-btn-reset" id="kamyki-reset">Reset</button>
                    <button class="kamyki-btn kamyki-btn-primary" id="kamyki-save">Zapisz</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // ===== PRZECIĄGANIE OKNA =====
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.kamyki-dialog');
        const header = modal.querySelector('#kamyki-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - dialog.getBoundingClientRect().left;
            dragOffsetY = e.clientY - dialog.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - dialog.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - dialog.offsetHeight);
            dialog.style.position = 'fixed';
            dialog.style.left = `${x}px`;
            dialog.style.top = `${y}px`;
            dialog.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // ===== OBSŁUGA ZAKŁADEK =====
        const tabs = modal.querySelectorAll('.kamyki-tab');
        const tabContents = modal.querySelectorAll('.kamyki-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                const targetContent = modal.querySelector(`.kamyki-tab-content[data-tab="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // ===== OBSŁUGA CHECKBOXÓW KATEGORII =====
        ['tytani', 'kolosy', 'e2'].forEach(category => {
            const toggle = document.getElementById(`${category}-toggle`);
            const items = document.querySelectorAll(`.kamyki-item-checkbox[data-category="${category}"]`);

            toggle.addEventListener('change', (e) => {
                const isEnabled = e.target.checked;
                config[`${category}Enabled`] = isEnabled;
                items.forEach(item => {
                    item.checked = isEnabled;
                    const id = item.getAttribute('data-id');
                    config[category][id].enabled = isEnabled;
                });
            });

            // Obsługa pojedynczych itemów
            items.forEach(item => {
                item.addEventListener('change', (e) => {
                    const id = item.getAttribute('data-id');
                    config[category][id].enabled = e.target.checked;
                    
                    // Sprawdź czy wszystkie są zaznaczone/odznaczone
                    const allChecked = Array.from(items).every(i => i.checked);
                    const noneChecked = Array.from(items).every(i => !i.checked);
                    
                    if (allChecked) {
                        toggle.checked = true;
                        config[`${category}Enabled`] = true;
                    } else if (noneChecked) {
                        toggle.checked = false;
                        config[`${category}Enabled`] = false;
                    }
                });
            });
        });

        // ===== PRZYCISKI =====
        document.getElementById('kamyki-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.getElementById('kamyki-enable-all').addEventListener('click', () => {
            ['tytani', 'kolosy', 'e2'].forEach(category => {
                config[`${category}Enabled`] = true;
                Object.keys(config[category]).forEach(id => {
                    config[category][id].enabled = true;
                });
            });
            
            // Odśwież UI
            modal.querySelectorAll('.kamyki-section-toggle, .kamyki-item-checkbox').forEach(cb => {
                cb.checked = true;
            });
            
            showNotification('Wszystkie grafiki włączone', 'success');
        });

        document.getElementById('kamyki-disable-all').addEventListener('click', () => {
            ['tytani', 'kolosy', 'e2'].forEach(category => {
                config[`${category}Enabled`] = false;
                Object.keys(config[category]).forEach(id => {
                    config[category][id].enabled = false;
                });
            });
            
            // Odśwież UI
            modal.querySelectorAll('.kamyki-section-toggle, .kamyki-item-checkbox').forEach(cb => {
                cb.checked = false;
            });
            
            showNotification('Wszystkie grafiki wyłączone', 'info');
        });

        document.getElementById('kamyki-reset').addEventListener('click', () => {
            if (!confirm('Czy na pewno chcesz przywrócić domyślne ustawienia?')) {
                return;
            }

            config.enabled = true;
            config.tytaniEnabled = true;
            config.kolosyEnabled = true;
            config.e2Enabled = true;

            ['tytani', 'kolosy', 'e2'].forEach(category => {
                Object.keys(config[category]).forEach(id => {
                    config[category][id].enabled = true;
                });
            });

            saveConfig();
            modal.remove();
            showSettingsDialog();
            showNotification('Ustawienia zresetowane', 'success');
        });

        document.getElementById('kamyki-save').addEventListener('click', () => {
            saveConfig();
            showNotification('Ustawienia zapisane!', 'success');
        });

        // Scroll w zakładkach
        modal.querySelectorAll('.kamyki-tab-content').forEach(content => {
            content.addEventListener('wheel', e => e.stopPropagation());
        });
    }

    // ===== INTEGRACJA Z MANAGEREM =====
    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'kamyki-settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.style.cssText = `
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            margin-left: 2px;
            opacity: 0.7;
            transition: opacity 0.2s;
            display: inline-block;
        `;

        settingsBtn.onmouseover = () => settingsBtn.style.opacity = '1';
        settingsBtn.onmouseout = () => settingsBtn.style.opacity = '0.7';

        helpIcon.insertAdjacentElement('afterend', settingsBtn);

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettingsDialog();
        });
    }

    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-custom_redstone');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#kamyki-settings-btn')) {
                clearInterval(checkForManager);
                return;
            }

            let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
            if (addonNameContainer) {
                addManagerSettingsButton(addonNameContainer);
                clearInterval(checkForManager);
            }
        }, 500);

        setTimeout(() => clearInterval(checkForManager), 20000);
    }

    // ===== INICJALIZACJA =====
    function init() {
        // Dodaj style
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Hook do parseJSON/parseInput
        const org = NI ? window.Engine.communication.parseJSON : window.parseInput;
        const override = function(data) {
            const res = org.apply(this, arguments);
            if (data.item) {
                onItem(data.item);
            }
            return res;
        }
        
        if (NI)
            window.Engine.communication.parseJSON = override;
        else
            window.parseInput = override;

        // Integracja z managerem
        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }
    }

    // Uruchom
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Helper dla listowania kamieni (console)
    window.listStones = function() {
        const NI = typeof window.Engine != "undefined";
        const getLocationItems = (loc) => {
            return NI ? Engine.items.fetchLocationItems(loc).map(it => it) : Object.values(g.item).filter(it => it.loc == loc);
        };

        getLocationItems("g").forEach(it => {
            const stats = getItemStats(it);
            const tp = getItemTp(it);
            if (tp != "") {
                const tpMap = getTpMap(tp);
                console.log(`${it.name} (${stats.opis}): ${tpMap} (${tp})`);
            }
        });
    }

    // Animacja slideIn
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(animationStyle);

})();
