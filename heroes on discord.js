(function() {
    'use strict';

    // Śledzenie wykrytych tytanów
    let lastDetectedHeroes = new Set();
const COOLDOWN_TIME = 5 * 60 * 1000;

const styles = `
    #hero-notifier-button {
        position: fixed;
        top: 20px;
        right: 110px;
        background: linear-gradient(135deg, #dc3545, #fd7e14);
        border: 2px solid #dc3545;
        color: white;
        padding: 8px;
        border-radius: 50%;
        cursor: move;
        font-size: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        z-index: 9999;
        transition: all 0.2s;
        user-select: none;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #hero-notifier-button:hover {
        transform: scale(1.05) rotate(15deg);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }

    #hero-notifier-button.disabled {
        background: linear-gradient(135deg, #666, #888);
        border-color: #666;
        opacity: 0.7;
    }

    .hero-notifier-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .hero-notifier-dialog {
        background: linear-gradient(135deg, #2e1a1a, #3e1616);
        border: 2px solid #dc3545;
        border-radius: 12px;
        padding: 25px;
        width: 600px;
        max-width: 90vw;
        max-height: 85vh;
        color: #e8f4fd;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .hero-notifier-dialog h3 {
        margin-top: 0;
        color: #fd7e14;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        flex-shrink: 0;
    }

    .hero-dialog-content {
        overflow-y: auto;
        flex: 1;
        padding-right: 15px;
        margin-right: -15px;
    }

    .hero-dialog-content {
        scrollbar-width: thin;
        scrollbar-color: #dc3545 rgba(0,0,0,0.2);
    }

    .hero-dialog-content::-webkit-scrollbar {
        width: 12px;
    }

    .hero-dialog-content::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        border-radius: 6px;
    }

    .hero-dialog-content::-webkit-scrollbar-thumb {
        background: #dc3545;
        border-radius: 6px;
        border: 2px solid rgba(0,0,0,0.2);
    }

    .hero-dialog-content::-webkit-scrollbar-thumb:hover {
        background: #fd7e14;
    }

    .hero-setting-group {
        margin-bottom: 20px;
    }

    .hero-setting-label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: #fd7e14;
        font-size: 14px;
    }

    .hero-setting-input {
        width: 100%;
        padding: 10px;
        background: rgba(220,53,69,0.2);
        border: 1px solid #dc3545;
        border-radius: 6px;
        color: #e8f4fd;
        font-size: 14px;
        box-sizing: border-box;
    }

    .hero-setting-input:focus {
        outline: none;
        border-color: #fd7e14;
        box-shadow: 0 0 10px rgba(253,126,20,0.3);
    }

    .hero-setting-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .hero-setting-description {
        font-size: 12px;
        color: #fd7e14;
        margin-top: 5px;
        line-height: 1.4;
    }

    .hero-toggle-switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .hero-toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .hero-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #666;
        transition: .4s;
        border-radius: 34px;
    }

    .hero-toggle-slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .hero-toggle-slider {
        background-color: #fd7e14;
    }

    input:checked + .hero-toggle-slider:before {
        transform: translateX(26px);
    }

    .hero-toggle-container {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .hero-status-info {
        background: rgba(40, 167, 69, 0.1);
        border: 1px solid #28a745;
        border-radius: 6px;
        padding: 12px;
        margin: 15px 0;
        flex-shrink: 0;
    }

    .hero-status-info.error {
        background: rgba(220, 53, 69, 0.1);
        border-color: #dc3545;
    }

    .hero-status-info.warning {
        background: rgba(253, 126, 20, 0.1);
        border-color: #fd7e14;
        color: #fd7e14;
    }

    .hero-settings-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 25px;
        flex-shrink: 0;
    }

    .hero-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: all 0.2s;
    }

    .hero-btn-primary {
        background: #dc3545;
        color: white;
    }

    .hero-btn-primary:hover {
        background: #fd7e14;
    }

    .hero-btn-secondary {
        background: #666;
        color: white;
    }

    .hero-btn-secondary:hover {
        background: #555;
    }

    .hero-role-settings {
        background: rgba(220,53,69,0.1);
        border: 1px solid #dc3545;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
    }

    .hero-role-item {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 6px;
    }

    .hero-role-item:last-child {
        margin-bottom: 0;
    }

    .hero-name {
        min-width: 180px;
        font-weight: bold;
        color: #fd7e14;
        font-size: 13px;
    }

    .hero-role-input {
        flex: 1;
        max-width: 200px;
    }

    .hero-notification-log {
        max-height: 150px;
        overflow-y: auto;
        background: rgba(0,0,0,0.3);
        border: 1px solid #dc3545;
        border-radius: 6px;
        padding: 10px;
        scrollbar-width: thin;
        scrollbar-color: #dc3545 rgba(0,0,0,0.2);
    }

    .hero-notification-log::-webkit-scrollbar {
        width: 8px;
    }

    .hero-notification-log::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
    }

    .hero-notification-log::-webkit-scrollbar-thumb {
        background: #dc3545;
        border-radius: 4px;
    }

    .hero-notification-log::-webkit-scrollbar-thumb:hover {
        background: #fd7e14;
    }

    .hero-log-item {
        font-size: 11px;
        margin-bottom: 5px;
        padding: 5px;
        background: rgba(220,53,69,0.1);
        border-radius: 4px;
    }

    .hero-log-time {
        color: #fd7e14;
        font-style: italic;
    }

    .hero-log-hero {
        font-weight: bold;
        color: #fd7e14;
    }

    .hero-setting-select {
        width: 100%;
        padding: 10px;
        background: rgba(220,53,69,0.2);
        border: 1px solid #dc3545;
        border-radius: 6px;
        color: #e8f4fd;
        font-size: 14px;
        box-sizing: border-box;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('data:image/svg+xml;charset=UTF-8,<svg fill="%23e8f4fd" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.516 7.548a.75.75 0 0 1 1.06 0L10 10.97l3.424-3.422a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 16px 16px;
    }

    .hero-setting-select:focus {
        outline: none;
        border-color: #fd7e14;
        box-shadow: 0 0 10px rgba(253,126,20,0.3);
    }

    .hero-setting-select option {
        background: #2e1a1a;
        color: #e8f4fd;
    }
`;

function getWebhookUrl() {
    return localStorage.getItem('heroNotifierWebhook') || '';
}

function setWebhookUrl(url) {
    localStorage.setItem('heroNotifierWebhook', url);
}

function isNotifierEnabled() {
    return localStorage.getItem('heroNotifierEnabled') !== 'false';
}

function setNotifierEnabled(enabled) {
    localStorage.setItem('heroNotifierEnabled', enabled.toString());
    updateButtonAppearance();
}

function getHeroRoleIds() {
    return JSON.parse(localStorage.getItem('heroNotifierRoleIds') || '{}');
}

function setHeroRoleIds(roleIds) {
    localStorage.setItem('heroNotifierRoleIds', JSON.stringify(roleIds));
}

function getNotificationLog() {
    return JSON.parse(localStorage.getItem('heroNotifierLog') || '[]');
}

function addToNotificationLog(heroName, heroLevel) {
    const log = getNotificationLog();
    const newEntry = {
        time: new Date().toLocaleString('pl-PL'),
        hero: heroName,
        level: heroLevel
    };

    log.unshift(newEntry);
    if (log.length > 15) log.splice(15);

    localStorage.setItem('heroNotifierLog', JSON.stringify(log));
}

function updateButtonAppearance() {
    const button = document.getElementById('hero-notifier-button'); // ZMIANA: było hero
    if (button) {
        if (isNotifierEnabled()) {
            button.classList.remove('disabled');
            button.title = 'Dodatek włączony - kliknij aby otworzyć ustawienia';
        } else {
            button.classList.add('disabled');
            button.title = 'Dodatek wyłączony - kliknij aby otworzyć ustawienia';
        }
    }
}

async function sendHeroRespawnNotification(heroName, heroLevel, heroData = {}) {
    const webhookUrl = getWebhookUrl();
    if (!webhookUrl || !isNotifierEnabled()) return false;

    const timestamp = new Date().toLocaleString('pl-PL');
    const roleIds = getHeroRoleIds(); // ZMIANA: było getheroRoleIds()
    const roleId = roleIds[heroName];   // ZMIANA: było heroName

    // NOWA LOGIKA: Obsługa wielu ról i @everyone
    let rolePing = '';
    if (roleId) {
        if (roleId.toLowerCase() === 'everyone') {
            rolePing = '@everyone';
        } else {
            // Obsługa wielu ID ról oddzielonych przecinkami
            const roleIdsList = roleId.split(',').map(id => id.trim()).filter(id => id);
            rolePing = roleIdsList.map(id => `<@&${id}>`).join(' ');
        }
    }

    // Pobierz dodatkowe informacje
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';
    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';  // ZMIANA: było heroData
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';  // ZMIANA: było heroData

    const embed = {
        title: `!#HEROS#!`,
        description: `**${heroName} (Lvl ${heroLevel})**\n\n` +
                    `**Mapa:** ${mapName}\n` +
                    `**Znalazł:** ${finderName}\n` +
                    `**Świat:** ${worldName}`,
        color: 0xdc3545,
        footer: {
            text: `Kaczor Addons - Heroes on Discord • ${timestamp}`
        },
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: rolePing,
                embeds: [embed]
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Błąd wysyłania powiadomienia na Discord:', error);
        return false;
    }
}
function getHeroCoordinates(npcData) {
    try {
        let x = null;
        let y = null;

        // Różne struktury danych w zależności od metody
        if (npcData && npcData.d) {
            x = npcData.d.x;
            y = npcData.d.y;
        } else if (npcData && npcData[1] && npcData[1].d) {
            x = npcData[1].d.x;
            y = npcData[1].d.y;
        } else if (npcData && typeof npcData === 'object') {
            x = npcData.x;
            y = npcData.y;
        }

        // Sprawdź czy udało się pobrać współrzędne
        if (x !== null && y !== null && x !== undefined && y !== undefined) {
            return `[${Math.round(x)}, ${Math.round(y)}]`;
        }

        return '[?, ?]'; // Jeśli nie udało się pobrać
    } catch (error) {
        console.error('Błąd pobierania koordynatów herosa:', error);
        return '[?, ?]';
    }
}
function getCurrentMapName() {
    try {
        // Próbuj różne sposoby pobrania nazwy mapy
        if (typeof Engine !== 'undefined') {
            if (Engine.map && Engine.map.d && Engine.map.d.name) {
                return Engine.map.d.name;
            }
            if (Engine.map && Engine.map.name) {
                return Engine.map.name;
            }
            if (Engine.gameMap && Engine.gameMap.name) {
                return Engine.gameMap.name;
            }
        }

        // Sprawdź czy istnieje globalna zmienna z mapą
        if (typeof map !== 'undefined' && map.name) {
            return map.name;
        }

        // Sprawdź w HTML - niektóre gry wyświetlają nazwę mapy w interfejsie
        const mapElement = document.querySelector('.map-name, #map-name, [class*="map"]');
        if (mapElement && mapElement.textContent) {
            return mapElement.textContent.trim();
        }

        return 'Nieznana mapa';
    } catch (error) {
        console.error('Błąd pobierania nazwy mapy:', error);
        return 'Nieznana mapa';
    }
}

function getCurrentPlayerName() {
    try {
        // Próbuj różne sposoby pobrania nazwy gracza
        if (typeof Engine !== 'undefined') {
            if (Engine.hero && Engine.hero.d && Engine.hero.d.nick) {
                return Engine.hero.d.nick;
            }
            if (Engine.hero && Engine.hero.nick) {
                return Engine.hero.nick;
            }
            if (Engine.player && Engine.player.nick) {
                return Engine.player.nick;
            }
        }

        // Sprawdź czy istnieje globalna zmienna z graczem
        if (typeof hero !== 'undefined' && hero.nick) {
            return hero.nick;
        }

        // Sprawdź w HTML - nazwa gracza często jest wyświetlana w interfejsie
        const playerElement = document.querySelector('.player-name, #player-name, [class*="nick"], [class*="player"]');
        if (playerElement && playerElement.textContent) {
            return playerElement.textContent.trim();
        }

        return 'Nieznany gracz';
    } catch (error) {
        console.error('Błąd pobierania nazwy gracza:', error);
        return 'Nieznany gracz';
    }
}

async function checkHeroRespawns() {
    if (!isNotifierEnabled()) return;

    try {
        if (typeof Engine === 'undefined' || !Engine.npcs) return;
        let npcs = [];

        // Próbuj różne metody dostępu do NPC-ów
        if (Engine.npcs.check && typeof Engine.npcs.check === 'function') {
            try {
                const npcCheck = Engine.npcs.check();
                if (npcCheck && typeof npcCheck === 'object') {
                    npcs = Object.entries(npcCheck);
                }
            } catch (e) {}
        }

        if (npcs.length === 0 && Engine.npcs.list) {
            try {
                npcs = Object.entries(Engine.npcs.list);
            } catch (e) {}
        }

        if (npcs.length === 0 && Engine.map && Engine.map.npcs) {
            try {
                npcs = Object.entries(Engine.map.npcs);
            } catch (e) {}
        }

        const currentHeroes = new Set();

        // Lista prawdziwych herosów
        const heroNames = [
            "Domina Ecclesiae", "Mietek Żul", "Mroczny Patryk", "Karmazynowy Mściciel",
            "Złodziej", "Zły Przewodnik", "Opętany Paladyn", "Piekielny Kościej",
            "Koziec Mąciciel Ścieżek", "Kochanka Nocy", "Książę Kasim", "Święty Braciszek",
            "Złoty Roger", "Baca bez Łowiec", "Czarująca Atalia", "Obłąkany Łowca Orków",
            "Lichwiarz Grauhaz", "Viviana Nandin", "Mulher Ma", "Demonis Pan Nicości",
            "Vapor Veneno", "Dęborożec", "Tepeyollotl", "Negthotep Czarny Kapłan", "Młody Smok"
        ];

        // Przejrzyj wszystkich NPC-ów
        for (const [npcId, npcData] of npcs) {
            try {
                let heroName = null;
                let heroLevel = null;
                let heroWt = null;

                // Różne struktury danych w zależności od metody
                if (npcData && npcData.d) {
                    const heroData = npcData.d;
                    heroName = heroData.nick || heroData.name;
                    heroLevel = heroData.lvl || heroData.elasticLevel;
                    heroWt = heroData.wt;
                } else if (npcData && npcData[1] && npcData[1].d) {
                    const heroData = npcData[1].d;
                    heroName = heroData.nick || heroData.name;
                    heroLevel = heroData.lvl || heroData.wt;
                    heroWt = heroData.wt;
                } else if (npcData && typeof npcData === 'object') {
                    heroName = npcData.nick || npcData.name;
                    heroLevel = npcData.lvl || npcData.elasticLevel || npcData.wt;
                    heroWt = npcData.wt;
                }

                // Sprawdź czy to hero po nazwie (nie po wt!)
                if (heroName && heroNames.includes(heroName)) {
                    const heroKey = `${npcId}_${heroName}_${heroLevel}`;
                    currentHeroes.add(heroKey);

                    // TYLKO POKAŻ OKNO - NIE WYSYŁAJ AUTOMATYCZNIE!
                    if (!lastDetectedHeroes.has(heroKey)) {
                        const notificationKey = `${heroName}_${heroLevel}`;
                        const shownHeroes = JSON.parse(localStorage.getItem('heroNotifierShownHeroes') || '{}');
                        const lastShown = shownHeroes[notificationKey] || 0;
                        const now = Date.now();

                        // Pokaż okno tylko raz na 5 minut dla tego samego herosa
                        if (now - lastShown > COOLDOWN_TIME) {
                         const additionalData = {
    mapName: getCurrentMapName(),
    finderName: getCurrentPlayerName(),
    npcData: npcData,
    heroCoords: getHeroCoordinates(npcData)
};

                            // TYLKO POKAŻ OKNO - bez automatycznego wysyłania
                            showHeroDetectionWindow(heroName, heroLevel, additionalData);

                            // Zapamiętaj że okno zostało pokazane
                            shownHeroes[notificationKey] = now;
                            localStorage.setItem('heroNotifierShownHeroes', JSON.stringify(shownHeroes));
                        }
                    }
                }

            } catch (error) {
                console.error(`Błąd przy przetwarzaniu NPC ${npcId}:`, error);
            }
        }

        // Zaktualizuj listę wykrytych herosów
        lastDetectedHeroes = currentHeroes;

    } catch (error) {
        console.error('Błąd w głównym bloku try:', error);
    }
}

    // Funkcja przeciągania przycisku
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let hasMoved = false;

        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hasMoved = true;
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.right = 'auto';

            localStorage.setItem('heroNotifierButtonPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        element.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            showSettings();
        });
    }
function showHeroDetectionWindow(heroName, heroLevel, heroData = {}) {
    // Sprawdź czy okno już istnieje
    if (document.getElementById('hero-detection-window')) return;

    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';
    const heroCoords = heroData.heroCoords || getHeroCoordinates(heroData.npcData) || '[?, ?]';
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';

    const gameWindow = document.createElement('div');
    gameWindow.id = 'hero-detection-window';
    gameWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 20%;
        transform: translate(-50%, -50%);
        width: 320px;
        background: linear-gradient(135deg, #2e1a1a, #3e1616);
        border: 3px solid #dc3545;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.7);
        z-index: 9998;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #e8f4fd;
        user-select: none;
    `;

    gameWindow.innerHTML = `
        <div style="background: linear-gradient(135deg, #dc3545, #fd7e14); padding: 10px; border-radius: 8px 8px 0 0; cursor: move;" id="hero-window-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 14px;">🛡️ Wykryto Herosa!</span>
                <button style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;" id="hero-window-close">×</button>
            </div>
        </div>

        <div style="padding: 15px;">
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 16px; color: #fd7e14; font-weight: bold; margin-bottom: 3px;">
                    ${heroName}
                </div>
                <div style="font-size: 14px; color: #dc3545;">
                    Poziom: ${heroLevel}
                </div>
            </div>

            <div style="background: rgba(220,53,69,0.1); border: 1px solid #dc3545; border-radius: 6px; padding: 8px; margin: 10px 0; font-size: 11px;">
                <div><strong>Mapa:</strong> ${mapName} ${heroCoords}</div>
                <div><strong>Znalazł:</strong> ${finderName}</div>
                <div><strong>Świat:</strong> ${worldName}</div>
                <div><strong>Czas:</strong> ${new Date().toLocaleString('pl-PL')}</div>
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #fd7e14; font-size: 12px;">Dodatkowa wiadomość:</label>
                <textarea id="hero-custom-message" placeholder="Wpisz dodatkową wiadomość (opcjonalne)..."
                          style="width: 100%; height: 45px; padding: 6px; background: rgba(157,78,221,0.2); border: 1px solid #dc3545; border-radius: 4px; color: #e8f4fd; font-size: 11px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 15px;">
                <button id="hero-cancel-btn" style="flex: 1; padding: 8px; background: #666; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">Anuluj</button>
                <button id="hero-send-btn" style="flex: 1; padding: 8px; background: #dc3545; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">Wyślij</button>
            </div>
        </div>
    `;

    document.body.appendChild(gameWindow);

    // Funkcjonalność przeciągania
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const header = gameWindow.querySelector('#hero-window-header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - gameWindow.getBoundingClientRect().left;
        dragOffsetY = e.clientY - gameWindow.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - gameWindow.offsetWidth);
        const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - gameWindow.offsetHeight);
        gameWindow.style.left = `${x}px`;
        gameWindow.style.top = `${y}px`;
        gameWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Event listeners dla przycisków
    gameWindow.querySelector('#hero-window-close').onclick = () => {
        document.body.removeChild(gameWindow);
    };

    gameWindow.querySelector('#hero-cancel-btn').onclick = () => {
        document.body.removeChild(gameWindow);
    };

    gameWindow.querySelector('#hero-send-btn').onclick = async () => {
        const customMessage = gameWindow.querySelector('#hero-custom-message').value.trim();

        // TUTAJ DOPIERO WYSYŁAJ webhook z custom message
        const success = await sendHeroRespawnNotificationWithMessage(heroName, heroLevel, {
            ...heroData,
            customMessage: customMessage
        });

        if (success) {
            addToNotificationLog(heroName, heroLevel);

            // Mini komunikat sukcesu w oknie gry
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #28a745; color: white; padding: 8px 12px;
                border-radius: 6px; font-weight: bold; z-index: 9999;
                font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            successMsg.textContent = 'Powiadomienie wysłane!';
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 2000);
        } else {
            // Mini komunikat błędu
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #dc3545; color: white; padding: 8px 12px;
                border-radius: 6px; font-weight: bold; z-index: 9999;
                font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            errorMsg.textContent = 'Błąd wysyłania!';
            document.body.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 2000);
        }

        document.body.removeChild(gameWindow);
    };
}

async function sendHeroRespawnNotificationWithMessage(heroName, heroLevel, heroData = {}) {
    const webhookUrl = getWebhookUrl();
    if (!webhookUrl || !isNotifierEnabled()) return false;

    const timestamp = new Date().toLocaleString('pl-PL');
    const roleIds = getHeroRoleIds();
    const roleId = roleIds[heroName];

    // Obsługa wielu ról i @everyone
    let rolePing = '';
    if (roleId) {
        if (roleId.toLowerCase() === 'everyone') {
            rolePing = '@everyone';
        } else {
            const roleIdsList = roleId.split(',').map(id => id.trim()).filter(id => id);
            rolePing = roleIdsList.map(id => `<@&${id}>`).join(' ');
        }
    }

    // Pobierz dodatkowe informacje
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';
    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';
    const customMessage = heroData.customMessage || '';

let description = `**${heroName} (Lvl ${heroLevel})**\n\n` +
                 `**Mapa:** ${mapName} ${heroData.heroCoords || getHeroCoordinates(heroData.npcData) || '[?, ?]'}\n` +
                 `**Znalazł:** ${finderName}\n` +
                 `**Świat:** ${worldName}`;

    if (customMessage) {
        description += `\n\n**Wiadomość:** ${customMessage}`;
    }

    const embed = {
        title: `!#HEROS#!`,
        description: description,
        color: 0xdc3545,
        footer: {
            text: `Kaczor Addons - Heroes on Discord • ${timestamp}`
        },
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: rolePing,
                embeds: [embed]
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Błąd wysyłania powiadomienia na Discord:', error);
        return false;
    }
}

function addManagerSettingsButton(container) {
    const helpIcon = container.querySelector('.kwak-addon-help-icon');
    if (!helpIcon) return;

    const settingsBtn = document.createElement('span');
    settingsBtn.id = 'heroes-on-discord-settings-btn';
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

    // Wstaw dokładnie po znaku zapytania
    helpIcon.insertAdjacentElement('afterend', settingsBtn);

    // Stwórz panel od razu
    createSettingsPanel();

    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSettingsPanel();
    });
}

function loadPredefinedSettings() {
    const worldName = window.location.hostname.split('.')[0] || 'Unknown';
    
    if (predefinedWorldRoles[worldName]) {
        const worldRoles = predefinedWorldRoles[worldName];
        const dreamWebhook = "https://discord.com/api/webhooks/1407468644505747556/BknEaHxuPXEJNkPLgGYLTSPsS8aqXdXDnVpQ3jh5_AmIXjvpYRVONXYdj33NTZBiWkE7";
        
        setWebhookUrl(dreamWebhook);
        setHeroRoleIds({ ...worldRoles });
        setNotifierEnabled(true);
        
        // Odśwież panel ustawień jeśli jest otwarty
        const panel = document.getElementById('heroes-on-discord-settings-panel');
        if (panel && panel.style.display === 'block') {
            toggleSettingsPanel();
            setTimeout(() => toggleSettingsPanel(), 100);
        }
        
        return true;
    }
    
    return false;
}

function createSettingsPanel() {
    const panel = document.createElement('div');
    panel.id = 'heroes-on-discord-settings-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 15px;
        z-index: 10000;
        display: none;
        min-width: 350px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;

    const popularHeroes = [
        {name: "Domina Ecclesiae", level: 21},
        {name: "Mietek Żul", level: 25},
        {name: "Mroczny Patryk", level: 35},
        {name: "Karmazynowy Mściciel", level: 45},
        {name: "Złodziej", level: 51},
        {name: "Zły Przewodnik", level: 63},
        {name: "Opętany Paladyn", level: 74},
        {name: "Piekielny Kościej", level: 85},
        {name: "Koziec Mąciciel Ścieżek", level: 94},
        {name: "Kochanka Nocy", level: 102},
        {name: "Książę Kasim", level: 116},
        {name: "Święty Braciszek", level: 123},
        {name: "Złoty Roger", level: 135},
        {name: "Baca bez Łowiec", level: 144},
        {name: "Czarująca Atalia", level: 157},
        {name: "Obłąkany Łowca Orków", level: 165},
        {name: "Lichwiarz Grauhaz", level: 177},
        {name: "Viviana Nandin", level: 184},
        {name: "Mulher Ma", level: 197},
        {name: "Demonis Pan Nicości", level: 210},
        {name: "Vapor Veneno", level: 227},
        {name: "Dęborożec", level: 242},
        {name: "Tepeyollotl", level: 260},
        {name: "Negthotep Czarny Kapłan", level: 271},
        {name: "Młody Smok", level: 282}
    ];

    const worldName = window.location.hostname.split('.')[0] || 'Unknown';
    const hasPredefSettings = predefinedWorldRoles[worldName];
    const roleIds = getHeroRoleIds();

    panel.innerHTML = `
        <div style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding-bottom: 8px; border-bottom: 1px solid #444;">
            Heroes on Discord - Settings
        </div>

        <div style="margin-bottom: 15px;">
<div style="margin-bottom: 15px; padding: 12px; background: rgba(220,53,69,0.1); border: 1px solid #dc3545; border-radius: 6px;">
    <div style="color: #fd7e14; font-size: 12px; margin-bottom: 8px; font-weight: bold;">Załaduj predefiniowane role dla świata:</div>
    <div style="display: flex; gap: 8px; align-items: center;">
        <select id="world-selector" style="flex: 1; padding: 6px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;">
            <option value="">— Wybierz Świat —</option>
            <option value="Dream">Dream</option>
        </select>
        <button id="load-predefined-settings" style="padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
            Załaduj
        </button>
    </div>
    <div style="color: #888; font-size: 10px; margin-top: 5px;">Automatycznie uzupełni ID ról dla wybranego świata.</div>
</div>

            <div style="margin-bottom: 10px;">
                <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 5px;">Discord Webhook URL:</span>
                <input type="text" id="hero-webhook" style="width: 100%; padding: 5px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;" value="${getWebhookUrl()}" placeholder="https://discord.com/api/webhooks/...">
            </div>

            <div style="color: #ccc; font-size: 11px; margin-bottom: 10px;">
                Role Discord (ID roli lub 'everyone'):
            </div>
            ${popularHeroes.map(hero => `
                <div style="margin: 5px 0; display: flex; align-items: center;">
                    <span style="color: #aaa; font-size: 10px; min-width: 120px;">${hero.name} (${hero.level})</span>
                    <input type="text" data-hero="${hero.name}" style="flex: 1; margin-left: 8px; padding: 3px; background: #555; color: #fff; border: 1px solid #666; border-radius: 2px; font-size: 10px;" value="${roleIds[hero.name] || ''}" placeholder="ID roli">
                </div>
            `).join('')}
        </div>

        <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
            <button id="close-heroes-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                Zamknij
            </button>
            <button id="save-heroes-settings" style="flex: 1; padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                Zapisz
            </button>
        </div>
    `;

    document.body.appendChild(panel);

// Event listener dla przycisku ładowania predefiniowanych ustawień
const loadBtn = panel.querySelector('#load-predefined-settings');
const worldSelector = panel.querySelector('#world-selector');
if (loadBtn && worldSelector) {
    loadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedWorld = worldSelector.value;
        
        if (!selectedWorld) {
            loadBtn.style.background = '#dc3545';
            loadBtn.textContent = '⚠️ Wybierz świat!';
            setTimeout(() => {
                loadBtn.style.background = '#4CAF50';
                loadBtn.textContent = 'Załaduj';
            }, 2000);
            return;
        }
        
        if (predefinedWorldRoles[selectedWorld]) {
            const worldRoles = predefinedWorldRoles[selectedWorld];
            const dreamWebhook = "https://discord.com/api/webhooks/1407468644505747556/BknEaHxuPXEJNkPLgGYLTSPsS8aqXdXDnVpQ3jh5_AmIXjvpYRVONXYdj33NTZBiWkE7";
            
            setWebhookUrl(dreamWebhook);
            setHeroRoleIds({ ...worldRoles });
            setNotifierEnabled(true);
            
            // Odśwież wartości w panelu
            panel.querySelector('#hero-webhook').value = getWebhookUrl();
            panel.querySelectorAll('input[data-hero]').forEach(input => {
                const heroName = input.getAttribute('data-hero');
                input.value = getHeroRoleIds()[heroName] || '';
            });
            
            // Pokaż komunikat sukcesu
            loadBtn.style.background = '#28a745';
            loadBtn.textContent = '✅ Załadowano!';
            setTimeout(() => {
                loadBtn.style.background = '#4CAF50';
                loadBtn.textContent = 'Załaduj';
            }, 2000);
        }
    });
}

    panel.querySelector('#save-heroes-settings').addEventListener('click', (e) => {
        e.preventDefault();
        setNotifierEnabled(true); // Automatycznie włącz po zapisaniu
        setWebhookUrl(panel.querySelector('#hero-webhook').value.trim());
        
        const newRoleIds = {};
        panel.querySelectorAll('input[data-hero]').forEach(input => {
            const heroName = input.getAttribute('data-hero');
            const roleId = input.value.trim();
            if (roleId) newRoleIds[heroName] = roleId;
        });
        setHeroRoleIds(newRoleIds);
        
        toggleSettingsPanel();
    });

    panel.querySelector('#close-heroes-settings').addEventListener('click', (e) => {
        e.preventDefault();
        toggleSettingsPanel();
    });
}

function toggleSettingsPanel() {
    const panel = document.getElementById('heroes-on-discord-settings-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

function integrateWithAddonManager() {
    const checkForManager = setInterval(() => {
        const addonContainer = document.getElementById('addon-heroes_on_discord');
        if (!addonContainer) return;

        // Sprawdź czy przycisk już istnieje
        if (addonContainer.querySelector('#heroes-on-discord-settings-btn')) {
            clearInterval(checkForManager);
            return;
        }

        let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
        if (addonNameContainer) {
            addManagerSettingsButton(addonNameContainer);
            clearInterval(checkForManager);
        }
    }, 500);
}


function init() {
    const existingHeroButton = document.getElementById('hero-notifier-button');
    if (existingHeroButton) {
        existingHeroButton.remove();
        console.log('Usunięto duplikat przycisku Hero Notifier');
    }
    // Dodaj style
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Utwórz przycisk ustawień
    const settingsButton = document.createElement('div');
    settingsButton.id = 'hero-notifier-button'; // ZMIANA: było hero-notifier-button
    settingsButton.innerHTML = '🛡️';

    // Przywróć zapisaną pozycję
    const savedPos = JSON.parse(localStorage.getItem('heroNotifierButtonPosition') || '{}'); // ZMIANA
    if (savedPos.x !== undefined && savedPos.y !== undefined) {
        settingsButton.style.left = `${savedPos.x}px`;
        settingsButton.style.top = `${savedPos.y}px`;
        settingsButton.style.right = 'auto';
    }

    document.body.appendChild(settingsButton);

    // Dodaj funkcję przeciągania
    makeDraggable(settingsButton);

    // Ustaw wygląd przycisku
    updateButtonAppearance();

    // Rozpocznij sprawdzanie respawnów co 10 sekund
    setInterval(checkHeroRespawns, 10000);
    try {
     integrateWithAddonManager();
    } catch (error) {
     console.warn('Addon manager integration failed:', error);
   }

    console.log('Hero Notifier uruchomiony!');
}
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
