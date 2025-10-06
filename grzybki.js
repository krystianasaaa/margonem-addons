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

    const TRACKED_MOBS = [
        'Ogromna płomiennica tląca',
        'Ogromna dzwonkówka tarczowata',
        'Ogromny szpicak ponury',
        'Ogromny bulwiak pospolity',
        'Ogromny mroźlarz'
    ];

    let config = {
        enabled: localStorage.getItem('specialMobsEnabled') !== 'false',
        webhookUrl: localStorage.getItem('specialMobsWebhook') || '',
        roleId: localStorage.getItem('specialMobsRoleId') || ''
    };

    let lastDetectedMob = null;
    let timerIntervals = new Map();

    function saveConfig() {
        localStorage.setItem('specialMobsEnabled', config.enabled.toString());
        localStorage.setItem('specialMobsWebhook', config.webhookUrl);
        localStorage.setItem('specialMobsRoleId', config.roleId);
    }

    function formatTime(seconds) {
        if (!seconds || seconds <= 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function getExpireTime(seconds) {
        if (!seconds || seconds <= 0) return null;
        const expireDate = new Date(Date.now() + seconds * 1000);
        return expireDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    }

    function formatTimeWithExpire(seconds) {
        if (!seconds || seconds <= 0) return '0:00';
        const timeLeft = formatTime(seconds);
        const expireTime = getExpireTime(seconds);
        return expireTime ? `${timeLeft} (do ${expireTime})` : timeLeft;
    }

    function sendClanMessage(message) {
        try {
            if (typeof _g === 'function') {
                _g('chat&channel=clan', false, {
                    c: message
                });
                console.log('Wysłano wiadomość na klan:', message);
                return true;
            }
            console.error('Funkcja _g nie jest dostępna');
            return false;
        } catch (error) {
            console.error('Błąd wysyłania wiadomości na klan:', error);
            return false;
        }
    }

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
        const timeLeft = mobData.killSeconds;

        let timeLeftText;
        if (timeLeft) {
            const expireTime = getExpireTime(timeLeft);
            timeLeftText = `${formatTime(timeLeft)} (zniknie o ${expireTime})`;
        } else {
            timeLeftText = 'Jeszcze nie otwarty!';
        }

        let rolePing = '';
        if (config.roleId) {
            if (config.roleId.toLowerCase() === 'everyone') {
                rolePing = '@everyone';
            } else {
                const roleIdsList = config.roleId.split(',').map(id => id.trim()).filter(id => id);
                rolePing = roleIdsList.map(id => `<@&${id}>`).join(' ');
            }
        }

        const embed = {
            title: `🍄 GRZYB!`,
            description: `**${mobName}** ${mobLevel ? `(Lvl ${mobLevel})` : ''}\n\n` +
                        `**Mapa:** ${mapName}\n` +
                        `**Znalazł:** ${finderName}\n` +
                        `**Świat:** ${worldName}\n` +
                        `**Pozostały czas:** ${timeLeftText}`,
            color: 0xe67e22,
            footer: {
                text: `Kaczor Addons - Mushrooms Abusers • ${timestamp}`
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
            console.error('Błąd wysyłania powiadomienia:', error);
            return false;
        }
    }

    function showDetectionWindow(mobName, mobLevel, mobData = {}) {
        const windowId = 'special-mob-detection-window-' + Date.now();

        const gameWindow = document.createElement('div');
        gameWindow.id = windowId;
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
        const initialTime = mobData.killSeconds;
        const hasTimer = initialTime !== undefined && initialTime !== null;

        let timerText;
        if (hasTimer) {
            timerText = formatTimeWithExpire(initialTime);
        } else {
            timerText = 'Jeszcze nie otwarty!';
        }

        gameWindow.innerHTML = `
            <div id="special-window-header-${windowId}" style="
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
                <span style="flex: 1; text-align: center;">GRZYB!</span>
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
                " id="special-window-close-${windowId}" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#ddd'">×</button>
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

                <div id="special-timer-${windowId}" style="
                    font-size: 14px;
                    font-weight: bold;
                    color: ${!hasTimer ? '#17a2b8' : '#ffc107'};
                    text-align: center;
                    padding: 8px;
                    background: ${!hasTimer ? 'rgba(23, 162, 184, 0.1)' : 'rgba(255, 193, 7, 0.1)'};
                    border: 1px solid ${!hasTimer ? '#17a2b8' : '#ffc107'};
                    border-radius: 4px;
                    margin-bottom: 12px;
                    font-family: 'Courier New', monospace;
                    line-height: 1.4;
                ">
                    ${timerText}
                </div>

                <div id="special-send-status-${windowId}" style="
                    text-align: center;
                    color: #ffc107;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 8px;
                    background: rgba(255, 193, 7, 0.1);
                    border: 1px solid #ffc107;
                    border-radius: 4px;
                    margin-bottom: 12px;
                ">
                    Oczekuje na wysłanie
                </div>
            </div>

            <div style="border-top: 1px solid #e67e22; display: flex;">
                <button id="special-send-btn-${windowId}" style="
                    flex: 1;
                    padding: 10px;
                    background: #28a745;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: bold;
                    transition: all 0.2s;
                    border-bottom-left-radius: 8px;
                " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                    Discord
                </button>
                <button id="special-clan-btn-${windowId}" style="
                    flex: 1;
                    padding: 10px;
                    background: #17a2b8;
                    color: #fff;
                    border: none;
                    border-left: 1px solid #e67e22;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: bold;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#138496'" onmouseout="this.style.background='#17a2b8'">
                    Klan
                </button>
                <button id="special-copy-btn-${windowId}" style="
                    flex: 0.6;
                    padding: 10px;
                    background: #6c757d;
                    color: #fff;
                    border: none;
                    border-left: 1px solid #e67e22;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.2s;
                    border-bottom-right-radius: 8px;
                " onmouseover="this.style.background='#5a6268'" onmouseout="this.style.background='#6c757d'" title="Kopiuj wiadomość">
                    📋
                </button>
            </div>
        `;

        document.body.appendChild(gameWindow);

        let currentTime = initialTime;
        if (hasTimer) {
            const timerElement = gameWindow.querySelector(`#special-timer-${windowId}`);

            const timerInterval = setInterval(() => {
                currentTime--;
                if (currentTime <= 0) {
                    timerElement.textContent = 'Wygasł!';
                    timerElement.style.color = '#dc3545';
                    timerElement.style.borderColor = '#dc3545';
                    timerElement.style.background = 'rgba(220, 53, 69, 0.1)';
                    clearInterval(timerInterval);
                    timerIntervals.delete(windowId);
                } else {
                    timerElement.textContent = formatTimeWithExpire(currentTime);
                }
            }, 1000);

            timerIntervals.set(windowId, timerInterval);
        }

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = gameWindow.querySelector(`#special-window-header-${windowId}`);
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

        const closeWindow = () => {
            const interval = timerIntervals.get(windowId);
            if (interval) {
                clearInterval(interval);
                timerIntervals.delete(windowId);
            }
            if (gameWindow.parentNode) {
                document.body.removeChild(gameWindow);
            }
        };

        gameWindow.querySelector(`#special-window-close-${windowId}`).onclick = closeWindow;

        const sendBtn = gameWindow.querySelector(`#special-send-btn-${windowId}`);
        const statusDiv = gameWindow.querySelector(`#special-send-status-${windowId}`);

        sendBtn.onclick = async () => {
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.5';
            sendBtn.textContent = 'Wysyłanie...';

            const currentMobData = {
                ...mobData,
                killSeconds: hasTimer ? currentTime : undefined
            };

            const success = await sendDiscordNotification(mobName, mobLevel, currentMobData);

            if (success) {
                statusDiv.style.background = 'rgba(40, 167, 69, 0.1)';
                statusDiv.style.borderColor = '#28a745';
                statusDiv.style.color = '#28a745';
                statusDiv.textContent = 'Powiadomienie wysłane!';
                sendBtn.textContent = 'Wysłano';
                sendBtn.style.background = '#666';
            } else {
                statusDiv.style.background = 'rgba(220, 53, 69, 0.1)';
                statusDiv.style.borderColor = '#dc3545';
                statusDiv.style.color = '#dc3545';
                statusDiv.textContent = 'Błąd wysyłania';
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
                sendBtn.textContent = 'Spróbuj ponownie';
                sendBtn.onmouseover = () => sendBtn.style.background = '#218838';
                sendBtn.onmouseout = () => sendBtn.style.background = '#28a745';
            }
        };

        const clanBtn = gameWindow.querySelector(`#special-clan-btn-${windowId}`);

        clanBtn.onclick = () => {
            const mapName = mobData.mapName || getCurrentMapName();
            const timeLeft = hasTimer ? currentTime : null;

            let timeLeftText;
            if (timeLeft) {
                const expireTime = getExpireTime(timeLeft);
                timeLeftText = `${formatTime(timeLeft)} (zniknie o ${expireTime})`;
            } else {
                timeLeftText = 'Jeszcze nie otwarty';
            }

            const message = `GRZYB! ${mobName} ${mobLevel ? `(Lvl ${mobLevel})` : ''} na mapie ${mapName} Pozostały czas: ${timeLeftText}`;

            const success = sendClanMessage(message);

            if (success) {
                statusDiv.style.background = 'rgba(40, 167, 69, 0.1)';
                statusDiv.style.borderColor = '#28a745';
                statusDiv.style.color = '#28a745';
                statusDiv.textContent = 'Wiadomość wysłana na klan!';
                clanBtn.disabled = true;
                clanBtn.style.opacity = '0.5';
                clanBtn.textContent = 'Wysłano';
                clanBtn.style.background = '#666';
            } else {
                statusDiv.style.background = 'rgba(220, 53, 69, 0.1)';
                statusDiv.style.borderColor = '#dc3545';
                statusDiv.style.color = '#dc3545';
                statusDiv.textContent = 'Błąd - nie można wysłać na klan';
            }
        };

        const copyBtn = gameWindow.querySelector(`#special-copy-btn-${windowId}`);

        copyBtn.onclick = async () => {
            const mapName = mobData.mapName || getCurrentMapName();
            const timeLeft = hasTimer ? currentTime : null;

            let timeLeftText;
            if (timeLeft) {
                const expireTime = getExpireTime(timeLeft);
                timeLeftText = `${formatTime(timeLeft)} (zniknie o ${expireTime})`;
            } else {
                timeLeftText = 'Jeszcze nie otwarty';
            }

            const message = `GRZYB! ${mobName} ${mobLevel ? `(Lvl ${mobLevel})` : ''} na mapie ${mapName}. Pozostały czas: ${timeLeftText}`;

            try {
                await navigator.clipboard.writeText(message);
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✓';
                copyBtn.style.background = '#28a745';

                statusDiv.style.background = 'rgba(40, 167, 69, 0.1)';
                statusDiv.style.borderColor = '#28a745';
                statusDiv.style.color = '#28a745';
                statusDiv.textContent = 'Skopiowano do schowka!';

                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '#6c757d';
                }, 2000);
            } catch (error) {
                statusDiv.style.background = 'rgba(220, 53, 69, 0.1)';
                statusDiv.style.borderColor = '#dc3545';
                statusDiv.style.color = '#dc3545';
                statusDiv.textContent = 'Błąd kopiowania';
                console.error('Błąd kopiowania:', error);
            }
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
                Mushrooms Abusers - Settings
            </div>

            <div style="padding: 15px; max-height: calc(80vh - 60px); overflow-y: auto;">
                <div style="margin-bottom: 10px;">
                    <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 5px;">Discord Webhook URL:</span>
                    <input type="text" id="special-webhook" style="width: 100%; padding: 5px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;" value="${config.webhookUrl}" placeholder="https://discord.com/api/webhooks/...">
                </div>

                <div style="margin-bottom: 15px;">
                    <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 5px;">ID Roli Discord (lub 'everyone'):</span>
                    <input type="text" id="special-role-id" style="width: 100%; padding: 5px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;" value="${config.roleId}" placeholder="123456789012345678 lub everyone">
                    <div style="color: #888; font-size: 10px; margin-top: 5px;">Wpisz ID roli lub 'everyone' aby pingować wszystkich.</div>
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
            config.roleId = panel.querySelector('#special-role-id').value.trim();
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
            const addonContainer = document.getElementById('addon-mushrooms_abusers') ||
                                 document.getElementById('addon-special_mobs_notifier');

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
                const killSeconds = npc.d.killSeconds;

                const additionalData = {
                    mapName: getCurrentMapName(),
                    finderName: getCurrentPlayerName(),
                    npcData: npc.d,
                    killSeconds: killSeconds
                };

                lastDetectedMob = {
                    mobName,
                    mobLevel,
                    additionalData
                };

                showDetectionWindow(mobName, mobLevel, additionalData);
            }
        });
    }

    function init() {
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
