(function() {
    'use strict';
    
    if (window.specialMobsNotifierRunning) {
        return;
    }
    window.specialMobsNotifierRunning = true;

    window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('special-mobs')) {
            e.preventDefault();
            return false;
        }
    });

    // Lista wykrywanych mobów
    const TRACKED_MOBS = [
        'Ogromna płomiennica tląca',
        'Ogromna dzwonkówka tarczowata',
        'Ogromny szpicak ponury',
        'Ogromny bulwiak pospolity',
        'Ogromny mroźlarz'
    ];

    let config = {
        enabled: localStorage.getItem('specialMobsEnabled') !== 'false',
        webhookUrl: localStorage.getItem('specialMobsWebhook') || ''
    };

    function saveConfig() {
        localStorage.setItem('specialMobsEnabled', config.enabled.toString());
        localStorage.setItem('specialMobsWebhook', config.webhookUrl);
    }

    const styles = `
        #special-mobs-button {
            position: fixed;
            top: 20px;
            right: 110px;
            background: linear-gradient(135deg, #e67e22, #d35400);
            border: 2px solid #d35400;
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

        #special-mobs-button:hover {
            transform: scale(1.05) rotate(15deg);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        #special-mobs-button.disabled {
            background: linear-gradient(135deg, #666, #888);
            border-color: #666;
            opacity: 0.7;
        }

        .special-mobs-modal {
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

        .special-mobs-dialog {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #e67e22;
            border-radius: 12px;
            padding: 25px;
            width: 500px;
            max-width: 90vw;
            max-height: 85vh;
            color: #e8f4fd;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .special-mobs-dialog h3 {
            margin-top: 0;
            color: #e67e22;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            flex-shrink: 0;
        }

        .special-dialog-content {
            overflow-y: auto;
            flex: 1;
            padding-right: 15px;
            margin-right: -15px;
        }

        .special-dialog-content::-webkit-scrollbar {
            width: 12px;
        }

        .special-dialog-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 6px;
        }

        .special-dialog-content::-webkit-scrollbar-thumb {
            background: #e67e22;
            border-radius: 6px;
            border: 2px solid rgba(0,0,0,0.2);
        }

        .special-dialog-content::-webkit-scrollbar-thumb:hover {
            background: #d35400;
        }

        .special-setting-group {
            margin-bottom: 20px;
        }

        .special-setting-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #a8dadc;
            font-size: 14px;
        }

        .special-setting-input {
            width: 100%;
            padding: 10px;
            background: rgba(230,126,34,0.2);
            border: 1px solid #e67e22;
            border-radius: 6px;
            color: #e8f4fd;
            font-size: 14px;
            box-sizing: border-box;
        }

        .special-setting-input:focus {
            outline: none;
            border-color: #d35400;
            box-shadow: 0 0 10px rgba(230,126,34,0.3);
        }

        .special-setting-description {
            font-size: 12px;
            color: #a8dadc;
            margin-top: 5px;
            line-height: 1.4;
        }

        .special-status-info {
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid #28a745;
            border-radius: 6px;
            padding: 12px;
            margin: 15px 0;
            flex-shrink: 0;
        }

        .special-status-info.warning {
            background: rgba(255, 193, 7, 0.1);
            border-color: #ffc107;
            color: #ffc107;
        }

        .special-settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 25px;
            flex-shrink: 0;
        }

        .special-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .special-btn-primary {
            background: #e67e22;
            color: white;
        }

        .special-btn-primary:hover {
            background: #d35400;
        }

        .special-btn-secondary {
            background: #666;
            color: white;
        }

        .special-btn-secondary:hover {
            background: #555;
        }

        .special-tracked-mobs {
            background: rgba(230,126,34,0.1);
            border: 1px solid #e67e22;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }

        .special-mob-item {
            padding: 8px;
            margin: 5px 0;
            background: rgba(0,0,0,0.2);
            border-radius: 6px;
            color: #e67e22;
            font-size: 13px;
        }
    `;

    function getCurrentMapName() {
        try {
            if (typeof Engine !== 'undefined') {
                if (Engine.map && Engine.map.d && Engine.map.d.name) {
                    return Engine.map.d.name;
                }
                if (Engine.map && Engine.map.name) {
                    return Engine.map.name;
                }
            }
            if (typeof map !== 'undefined' && map.name) {
                return map.name;
            }
            return 'Nieznana mapa';
        } catch (error) {
            return 'Nieznana mapa';
        }
    }

    function getCurrentPlayerName() {
        try {
            if (typeof Engine !== 'undefined') {
                if (Engine.hero && Engine.hero.d && Engine.hero.d.nick) {
                    return Engine.hero.d.nick;
                }
                if (Engine.hero && Engine.hero.nick) {
                    return Engine.hero.nick;
                }
            }
            if (typeof hero !== 'undefined' && hero.nick) {
                return hero.nick;
            }
            return 'Nieznany gracz';
        } catch (error) {
            return 'Nieznany gracz';
        }
    }

    async function sendDiscordNotification(mobName, mobLevel, mobData = {}) {
        const webhookUrl = config.webhookUrl;
        if (!webhookUrl || !config.enabled) return false;

        const timestamp = new Date().toLocaleString('pl-PL');
        const worldName = window.location.hostname.split('.')[0] || 'Nieznany';
        const mapName = mobData.mapName || getCurrentMapName();
        const finderName = mobData.finderName || getCurrentPlayerName();

        const embed = {
            title: `GRZYBB!`,
            description: `**${mobName}** ${mobLevel ? `(Lvl ${mobLevel})` : ''}\n\n` +
                        `**Mapa:** ${mapName}\n` +
                        `**Znalazł:** ${finderName}\n` +
                        `**Świat:** ${worldName}`,
            color: 0xe67e22,
            footer: {
                text: `Mushrooms Abusers - Kaczor Addons• ${timestamp}`
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
                    content: '@everyone',
                    embeds: [embed]
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Błąd wysyłania powiadomienia:', error);
            return false;
        }
    }

    function showDetectionWindow(mobName, mobLevel, mobData = {}) {
        if (document.getElementById('special-mob-detection-window')) return;

        const gameWindow = document.createElement('div');
        gameWindow.id = 'special-mob-detection-window';
        gameWindow.style.cssText = `
            position: fixed;
            top: 200px;
            left: 240px;
            background: #1a1a1a;
            border: 2px solid #e67e22;
            border-radius: 8px;
            padding: 0;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            width: 220px;
            font-family: Arial, sans-serif;
            color: #fff;
            box-shadow: 0 4px 16px rgba(230,126,34,0.5);
            user-select: none;
        `;

        let npcIcon = '';
        try {
            if (mobData.npcData) {
                const npcData = mobData.npcData;
                if (npcData && npcData.d && npcData.d.icon) {
                    npcIcon = npcData.d.icon;
                } else if (npcData && npcData.icon) {
                    npcIcon = npcData.icon;
                }
            }
        } catch (error) {
            console.error('Błąd pobierania ikony:', error);
        }

        let addToThumbnail = '';
        const getCookie = (name) => {
            const regex = new RegExp(`(^| )${name}=([^;]+)`);
            const match = document.cookie.match(regex);
            return match ? match[2] : null;
        };

        if (getCookie('interface') === 'ni') {
            addToThumbnail = 'https://micc.garmory-cdn.cloud/obrazki/npc/';
        }

        const npcImageUrl = npcIcon ? (addToThumbnail + npcIcon) : '';

        gameWindow.innerHTML = `
            <div id="special-window-header" style="
                background: #1a1a1a;
                color: #fff;
                font-size: 13px;
                text-align: center;
                font-weight: bold;
                padding: 10px 12px;
                border-bottom: 1px solid #e67e22;
                border-radius: 8px 8px 0 0;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span style="flex: 1; text-align: center;">Specjalny Mob!</span>
                <button style="
                    background: none;
                    border: none;
                    color: #ddd;
                    font-size: 18px;
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-weight: bold;
                    line-height: 1;
                " id="special-window-close" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#ddd'">×</button>
            </div>

            <div style="padding: 15px; background: #1a1a1a;">
                <div style="text-align: center; margin-bottom: 12px;">
                    <div style="
                        font-size: 14px;
                        color: #e67e22;
                        font-weight: bold;
                        text-shadow: 0 0 10px rgba(230,126,34,0.5);
                        margin-bottom: 4px;
                    ">
                        ${mobName}
                    </div>
                    ${mobLevel ? `<div style="font-size: 12px; color: #aaa;">(${mobLevel} lvl)</div>` : ''}
                </div>

                ${npcImageUrl ? `
                <div style="text-align: center; margin-bottom: 12px;">
                    <img src="${npcImageUrl}" alt="${mobName}" style="
                        max-width: 64px;
                        max-height: 64px;
                        image-rendering: pixelated;
                        filter: drop-shadow(0 0 8px rgba(230,126,34,0.3));
                    " onerror="this.parentElement.style.display='none'">
                </div>
                ` : ''}

                <div style="
                    text-align: center;
                    color: #28a745;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 8px;
                    background: rgba(40, 167, 69, 0.1);
                    border: 1px solid #28a745;
                    border-radius: 4px;
                ">
                    ✓ Powiadomienie wysłane!
                </div>
            </div>

            <div style="border-top: 1px solid #e67e22; border-radius: 0 0 8px 8px; overflow: hidden;">
                <button id="special-close-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #2a2a2a;
                    color: #aaa;
                    border: none;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: bold;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#333'" onmouseout="this.style.background='#2a2a2a'">
                    Zamknij
                </button>
            </div>
        `;

        document.body.appendChild(gameWindow);

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = gameWindow.querySelector('#special-window-header');
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
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        gameWindow.querySelector('#special-window-close').onclick = () => {
            document.body.removeChild(gameWindow);
        };

        gameWindow.querySelector('#special-close-btn').onclick = () => {
            document.body.removeChild(gameWindow);
        };
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'special-mobs-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 0;
            z-index: 10000;
            display: none;
            min-width: 400px;
            max-height: 80vh;
            overflow: hidden;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        panel.innerHTML = `
            <div id="special-panel-header" style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding: 15px 15px 8px 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0;">
                Special Mobs Notifier - Ustawienia
            </div>

            <div style="padding: 15px; max-height: calc(80vh - 60px); overflow-y: auto;">
                <div style="margin-bottom: 10px;">
                    <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 5px;">Discord Webhook URL:</span>
                    <input type="text" id="special-webhook" style="width: 100%; padding: 5px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;" value="${config.webhookUrl}" placeholder="https://discord.com/api/webhooks/...">
                </div>

                <div class="special-tracked-mobs">
                    <div style="color: #ccc; font-size: 12px; margin-bottom: 10px; font-weight: bold;">Wykrywane moby:</div>
                    ${TRACKED_MOBS.map(mob => `
                        <div class="special-mob-item">• ${mob}</div>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
                    <button id="close-special-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                        Zamknij
                    </button>
                    <button id="save-special-settings" style="flex: 1; padding: 8px 12px; background: #e67e22; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                        Zapisz
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = panel.querySelector('#special-panel-header');
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - panel.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - panel.offsetHeight);
            panel.style.left = `${x}px`;
            panel.style.top = `${y}px`;
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        panel.querySelector('#save-special-settings').addEventListener('click', (e) => {
            e.preventDefault();
            config.enabled = true;
            config.webhookUrl = panel.querySelector('#special-webhook').value.trim();
            saveConfig();
            toggleSettingsPanel();
        });

        panel.querySelector('#close-special-settings').addEventListener('click', (e) => {
            e.preventDefault();
            toggleSettingsPanel();
        });
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('special-mobs-settings-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'special-mobs-settings-btn';
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
        createSettingsPanel();

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-special_mobs_notifier');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#special-mobs-settings-btn')) {
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

    function startMobDetection() {
        if (!window.Engine?.npcs?.check) {
            setTimeout(startMobDetection, 50);
            return;
        }

        window.API.addCallbackToEvent('newNpc', async function(npc) {
            if (!config.enabled) return;

            const mobName = npc.d.nick || npc.d.name;
            
            if (TRACKED_MOBS.includes(mobName)) {
                const mobLevel = npc.d.lvl || npc.d.elasticLevel;
                const additionalData = {
                    mapName: getCurrentMapName(),
                    finderName: getCurrentPlayerName(),
                    npcData: npc.d
                };

                const success = await sendDiscordNotification(mobName, mobLevel, additionalData);
                if (success) {
                    showDetectionWindow(mobName, mobLevel, additionalData);
                }
            }
        });
    }

    function init() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }

        startMobDetection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
