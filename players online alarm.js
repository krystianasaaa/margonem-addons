(function() {
    'use strict';

    const worldName = "dream";
    const MIN_PLAYERS_THRESHOLD = 8;
    const GUILD_JSON_URL = "https://github.com/krystianasaaa/margonem-addons/raw/refs/heads/main/guilds/guilds.json";
    
    let currentPlayersData = null;
    let checkPlayersTimeout = null;
    let availableGuilds = new Set();

    const titanList = [
        {level: 64, name: "Orla/Kic"}, {level: 65, name: "Kic"}, {level: 83, name: "Kic"}, {level: 88, name: "Rene"},
        {level: 114, name: "Rene"}, {level: 120, name: "Arcy"}, {level: 144, name: "Arcy"}, {level: 164, name: "Zoons/Łowka"}, {level: 167, name: "Zoons/Łowka"},
        {level: 180, name: "Łowka"}, {level: 190, name: "Łowka"}, {level: 191, name: "Przyzy"}, {level: 210, name: "Przyzy"},
        {level: 217, name: "Przyzy"}, {level: 218, name: "Magua"}, {level: 244, name: "Magua"}, {level: 245, name: "Teza"},
        {level: 271, name: "Teza"}, {level: 272, name: "Barba/Tan"}, {level: 300, name: "Barba/Tan"}
    ];

    const emojiMap = {
        'Orla/Kic': '🦅/🐰', 'Kic': '🐰', 'Rene': '⛓️', 'Arcy': '🔥', 'Zoons/Łowka': '🗡️/🏹',
        'Łowka': '🏹', 'Przyzy': '👹', 'Magua': '🐟', 'Teza': '⚡', 'Barba/Tan': '👑'
    };

    const styles = `
        .pod-settings-modal {
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

        .pod-notification-log {
            max-height: 150px;
            overflow-y: auto;
            background: rgba(0,0,0,0.3);
            border: 1px solid #0f4c75;
            border-radius: 6px;
            padding: 10px;
        }

        .pod-log-item {
            font-size: 11px;
            margin-bottom: 5px;
            padding: 5px;
            background: rgba(50,130,184,0.1);
            border-radius: 4px;
        }

        .pod-guilds-list {
            max-height: 200px;
            overflow-y: auto;
            background: rgba(0,0,0,0.3);
            border: 1px solid #0f4c75;
            border-radius: 6px;
            padding: 10px;
        }

        .pod-guild-item {
            display: flex;
            align-items: center;
            padding: 6px;
            margin-bottom: 4px;
            background: rgba(50,130,184,0.1);
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .pod-guild-item:hover {
            background: rgba(50,130,184,0.2);
        }

        .pod-guild-checkbox {
            margin-right: 10px;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        .pod-guild-name {
            font-size: 12px;
            color: #e8f4fd;
        }

        .pod-guild-controls {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
        }

        .pod-guild-btn {
            padding: 4px 10px;
            background: #3282b8;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: background 0.2s;
        }

        .pod-guild-btn:hover {
            background: #2868a3;
        }
    `;

    // Funkcje pomocnicze
    function getTitanName(level) {
        for (let i = titanList.length - 1; i >= 0; i--) {
            if (level >= titanList[i].level) return titanList[i].name;
        }
        return '-';
    }

    function getTitanEmoji(name) {
        return emojiMap[name] || '';
    }

    function getDiscordWebhookUrl() {
        return localStorage.getItem('podAutoNotifierWebhook') || '';
    }

    function setDiscordWebhookUrl(url) {
        localStorage.setItem('podAutoNotifierWebhook', url);
    }

    function getPlayerThreshold() {
        return parseInt(localStorage.getItem('podAutoNotifierThreshold') || MIN_PLAYERS_THRESHOLD);
    }

    function setPlayerThreshold(threshold) {
        localStorage.setItem('podAutoNotifierThreshold', threshold.toString());
    }

    function isNotifierEnabled() {
        return localStorage.getItem('podAutoNotifierEnabled') !== 'false';
    }

    function setNotifierEnabled(enabled) {
        localStorage.setItem('podAutoNotifierEnabled', enabled.toString());
    }

    function getSelectedGuilds() {
        const saved = localStorage.getItem('podAutoNotifierSelectedGuilds');
        return saved ? JSON.parse(saved) : [];
    }

    function setSelectedGuilds(guilds) {
        localStorage.setItem('podAutoNotifierSelectedGuilds', JSON.stringify(guilds));
    }

    function getLastNotificationData() {
        return JSON.parse(localStorage.getItem('podAutoNotifierLastNotifications') || '{}');
    }

    function setLastNotificationData(data) {
        localStorage.setItem('podAutoNotifierLastNotifications', JSON.stringify(data));
    }

    function getNotificationLog() {
        return JSON.parse(localStorage.getItem('podAutoNotifierLog') || '[]');
    }

    function addToNotificationLog(titanName, playerCount) {
        const log = getNotificationLog();
        const newEntry = {
            time: new Date().toLocaleString('pl-PL'),
            titan: titanName,
            count: playerCount
        };

        log.unshift(newEntry);
        if (log.length > 10) log.splice(10);

        localStorage.setItem('podAutoNotifierLog', JSON.stringify(log));
    }

    // Funkcja pobierania listy klanów
    async function fetchAvailableGuilds() {
        try {
            const res = await fetch(GUILD_JSON_URL);
            if (!res.ok) return;

            const guildData = await res.json();
            const guilds = new Set(Object.values(guildData));
            availableGuilds = guilds;

        } catch (error) {
            console.error('Błąd pobierania listy klanów:', error);
        }
    }

    // Funkcja pobierania i filtrowania graczy
    async function fetchGuildPlayers() {
        try {
            const [guildRes, onlineRes] = await Promise.all([
                fetch(GUILD_JSON_URL),
                fetch(`https://public-api.margonem.pl/info/online/${worldName}.json`)
            ]);

            if (!guildRes.ok || !onlineRes.ok) return null;

            const guildData = await guildRes.json();
            const onlinePlayers = await onlineRes.json();

            if (!guildData || !Array.isArray(onlinePlayers)) return null;

            const selectedGuilds = getSelectedGuilds();
            
            // Jeśli nie wybrano żadnych klanów, nie filtruj (pokaż wszystkich)
            if (selectedGuilds.length === 0) {
                return onlinePlayers.filter(player => guildData[player.n]);
            }

            // Filtruj graczy z wybranych klanów
            const filteredPlayers = onlinePlayers.filter(player => {
                const playerName = player.n;
                const guildName = guildData[playerName];
                
                return guildName && selectedGuilds.includes(guildName);
            });

            return filteredPlayers;

        } catch (error) {
            console.error('Błąd pobierania danych graczy:', error);
            return null;
        }
    }

    // Funkcja wysyłania na Discord
    async function sendDiscordNotification(titanName, players) {
        const webhookUrl = getDiscordWebhookUrl();
        if (!webhookUrl || !isNotifierEnabled()) return false;

        const titanEmoji = getTitanEmoji(titanName);
        const timestamp = new Date().toLocaleString('pl-PL');
        const threshold = getPlayerThreshold();

        const sortedPlayers = players.sort((a, b) => b.l - a.l);

        const playersList = sortedPlayers.map(p => {
            return `🗡️ **${p.n}** - LvL ${p.l}`;
        }).join('\n');

        const embed = {
            title: `🚨 ALARM! ${titanEmoji} ${titanName} - ${players.length} graczy online!`,
            description: `Na przedziale **${titanName}** jest aktualnie **${players.length} graczy** (próg: ${threshold})\n\n${playersList}`,
            color: 0xff6b35,
            footer: {
                text: `Kaczor Addons - Players Online Alarm - Dream • ${timestamp}`
            }
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Błąd wysyłania na Discord:', error);
            return false;
        }
    }

    function getPreviousPlayerCounts() {
        return JSON.parse(localStorage.getItem('podAutoNotifierPreviousCounts') || '{}');
    }

    function setPreviousPlayerCounts(counts) {
        localStorage.setItem('podAutoNotifierPreviousCounts', JSON.stringify(counts));
    }

    async function scheduleNextCheck() {
        if (checkPlayersTimeout) {
            clearTimeout(checkPlayersTimeout);
        }

        checkPlayersTimeout = setTimeout(async () => {
            await checkPlayers();
            scheduleNextCheck();
        }, 60000);
    }

    // Główna funkcja sprawdzania graczy
    async function checkPlayers() {
        if (!isNotifierEnabled()) return;

        const players = await fetchGuildPlayers();
        if (!players || !Array.isArray(players)) return;

        currentPlayersData = players;

        // Grupuj graczy według tytanów
        const titanGroups = {};
        players.forEach(player => {
            const titanName = getTitanName(player.l);
            if (!titanGroups[titanName]) {
                titanGroups[titanName] = [];
            }
            titanGroups[titanName].push(player);
        });

        const threshold = getPlayerThreshold();
        const lastNotificationData = getLastNotificationData();
        const previousCounts = getPreviousPlayerCounts();

        // Sprawdź każdy tytan
        for (const [titanName, titanPlayers] of Object.entries(titanGroups)) {
            if (titanName === '-') continue;

            const currentCount = titanPlayers.length;

            if (currentCount >= threshold) {
                const now = Date.now();
                const lastNotification = lastNotificationData[titanName];

                if (!lastNotification || (now - lastNotification.time) > 5 * 60 * 1000) {
                    const success = await sendDiscordNotification(titanName, titanPlayers);

                    if (success) {
                        lastNotificationData[titanName] = {
                            time: now,
                            count: currentCount
                        };

                        setLastNotificationData(lastNotificationData);
                        addToNotificationLog(titanName, currentCount);
                    }
                }
            }

            previousCounts[titanName] = currentCount;
        }

        setPreviousPlayerCounts(previousCounts);
    }

    function stopTimer() {
        if (checkPlayersTimeout) {
            clearTimeout(checkPlayersTimeout);
            checkPlayersTimeout = null;
        }
    }

    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-players_online_alarm');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#kwak-alarm-settings-btn')) {
                clearInterval(checkForManager);
                return;
            }

            let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
            addSettingsButton(addonNameContainer);
            clearInterval(checkForManager);
        }, 500);

        setTimeout(() => {
            clearInterval(checkForManager);
        }, 20000);
    }

    function addSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'kwak-alarm-settings-btn';
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

        createManagerSettingsPanel();

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleManagerSettingsPanel();
        });
    }

    function createManagerSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'kwak-alarm-manager-panel';
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
            max-width: 500px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        const webhookUrl = getDiscordWebhookUrl();
        const log = getNotificationLog();
        const selectedGuilds = getSelectedGuilds();

        let statusClass = '';
        let statusText = '✅ Dodatek włączony i skonfigurowany';

        if (!webhookUrl) {
            statusClass = 'warning';
            statusText = '⚠️ Brak webhook URL';
        }

        const logHtml = log.length > 0 ?
            log.map(entry => `
                <div style="font-size: 11px; margin-bottom: 3px; padding: 3px; background: rgba(50,130,184,0.1); border-radius: 3px;">
                    <span style="color: #a8dadc; font-style: italic;">${entry.time}</span> -
                    <span style="font-weight: bold; color: #3282b8;">${entry.titan}</span>: ${entry.count} graczy
                </div>
            `).join('') :
            '<div style="text-align: center; color: #a8dadc; font-style: italic; padding: 10px;">Brak powiadomień</div>';

        const guildsHtml = Array.from(availableGuilds).sort().map(guild => {
            const isSelected = selectedGuilds.includes(guild);
            return `
                <div class="pod-guild-item" data-guild="${guild}">
                    <input type="checkbox" class="pod-guild-checkbox" ${isSelected ? 'checked' : ''}>
                    <span class="pod-guild-name">${guild}</span>
                </div>
            `;
        }).join('');

        panel.innerHTML = `
            <div id="alarm-panel-header" style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding: 15px 15px 8px 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0;">
                Players Online Alarm - Settings
            </div>

            <div style="padding: 15px;">
                <div style="margin-bottom: 15px;">
                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 4px;">Discord Webhook URL:</label>
                        <input type="text" id="manager-webhook-url" placeholder="https://discord.com/api/webhooks/..." 
                               value="${webhookUrl}"
                               style="width: 100%; padding: 6px; background: rgba(50,130,184,0.2); border: 1px solid #0f4c75; border-radius: 3px; color: #e8f4fd; font-size: 12px; box-sizing: border-box;">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 4px;">Próg powiadomień (graczy):</label>
                        <input type="number" id="manager-threshold-input" min="1" max="50" value="${getPlayerThreshold()}"
                               style="width: 80px; padding: 6px; background: rgba(50,130,184,0.2); border: 1px solid #0f4c75; border-radius: 3px; color: #e8f4fd; font-size: 12px; text-align: center;">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Wybierz klany do monitorowania:</label>
                        <div class="pod-guild-controls">
                            <button class="pod-guild-btn" id="select-all-guilds">Zaznacz wszystkie</button>
                            <button class="pod-guild-btn" id="deselect-all-guilds">Odznacz wszystkie</button>
                        </div>
                        <div class="pod-guilds-list" id="guilds-list">
                            ${guildsHtml || '<div style="text-align: center; color: #a8dadc; padding: 10px;">Ładowanie klanów...</div>'}
                        </div>
                        <div style="font-size: 11px; color: #a8dadc; margin-top: 4px;">
                            Zaznaczone: <span id="selected-count">${selectedGuilds.length}</span> / ${availableGuilds.size}
                        </div>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 4px;">Ostatnie powiadomienia:</label>
                        <div style="max-height: 100px; overflow-y: auto; background: rgba(0,0,0,0.3); border: 1px solid #0f4c75; border-radius: 3px; padding: 8px;">
                            ${logHtml}
                        </div>
                    </div>

                    <div style="padding: 8px; border-radius: 3px; margin-bottom: 12px; ${statusClass === 'warning' ? 'background: rgba(255, 193, 7, 0.1); border: 1px solid #ffc107; color: #ffc107;' : 'background: rgba(40, 167, 69, 0.1); border: 1px solid #28a745; color: #28a745;'}">
                        <strong>Status:</strong> ${statusText}
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
                    <button id="manager-close-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                        Zamknij
                    </button>
                    <button id="manager-save-settings" style="flex: 1; padding: 8px 12px; background: #3282b8; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                        Zapisz
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listenery dla checkboxów
        const guildItems = panel.querySelectorAll('.pod-guild-item');
        guildItems.forEach(item => {
            const checkbox = item.querySelector('.pod-guild-checkbox');
            
            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                updateSelectedCount();
            });

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelectedCount();
            });
        });

        // Zaznacz wszystkie
        panel.querySelector('#select-all-guilds').addEventListener('click', () => {
            panel.querySelectorAll('.pod-guild-checkbox').forEach(cb => cb.checked = true);
            updateSelectedCount();
        });

        // Odznacz wszystkie
        panel.querySelector('#deselect-all-guilds').addEventListener('click', () => {
            panel.querySelectorAll('.pod-guild-checkbox').forEach(cb => cb.checked = false);
            updateSelectedCount();
        });

        function updateSelectedCount() {
            const checked = panel.querySelectorAll('.pod-guild-checkbox:checked').length;
            const countSpan = panel.querySelector('#selected-count');
            if (countSpan) countSpan.textContent = checked;
        }

        // Przeciąganie panelu
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = panel.querySelector('#alarm-panel-header');
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
            
            header.style.background = '#444';
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - panel.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - panel.offsetHeight);
            
            panel.style.left = `${x}px`;
            panel.style.top = `${y}px`;
            panel.style.transform = 'none';
            
            localStorage.setItem('podAlarmPanelPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.background = '#333';
                panel.style.cursor = 'default';
            }
        });

        const savedPosition = JSON.parse(localStorage.getItem('podAlarmPanelPosition') || 'null');
        if (savedPosition) {
            panel.style.left = `${savedPosition.x}px`;
            panel.style.top = `${savedPosition.y}px`;
            panel.style.transform = 'none';
        }

        // Zapisz ustawienia
        const webhookInput = panel.querySelector('#manager-webhook-url');
        const thresholdInput = panel.querySelector('#manager-threshold-input');

        panel.querySelector('#manager-save-settings').onclick = () => {
            const webhookUrl = webhookInput.value.trim();
            const threshold = parseInt(thresholdInput.value);

            // Zbierz zaznaczone klany
            const selectedGuilds = [];
            panel.querySelectorAll('.pod-guild-item').forEach(item => {
                const checkbox = item.querySelector('.pod-guild-checkbox');
                if (checkbox.checked) {
                    selectedGuilds.push(item.dataset.guild);
                }
            });

            setNotifierEnabled(true);
            setDiscordWebhookUrl(webhookUrl);
            setPlayerThreshold(threshold);
            setSelectedGuilds(selectedGuilds);

            toggleManagerSettingsPanel();

            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                z-index: 10002; background: linear-gradient(135deg, #28a745, #20c997);
                color: white; padding: 12px 20px; border-radius: 8px;
                font-weight: bold; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            successMsg.innerHTML = `✅ Zapisano! Monitorowanie ${selectedGuilds.length} klanów`;
            document.body.appendChild(successMsg);

            setTimeout(() => successMsg.remove(), 3000);
        };

        panel.querySelector('#manager-close-settings').onclick = () => {
            toggleManagerSettingsPanel();
        };
    }

    function toggleManagerSettingsPanel() {
        const panel = document.getElementById('kwak-alarm-manager-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Inicjalizacja
    function init() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Pobierz listę klanów
        fetchAvailableGuilds();

        // Integracja z addon managerem
        integrateWithAddonManager();

        // Rozpocznij sprawdzanie po minucie
        setTimeout(() => {
            checkPlayers();
            scheduleNextCheck();
        }, 60000);

        window.addEventListener('beforeunload', stopTimer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
