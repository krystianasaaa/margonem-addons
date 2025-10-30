(function() {
    'use strict';

    if (window.playerListRunning) {
        return;
    }
    window.playerListRunning = true;

    // Konfiguracja
    let config = {
        enabled: localStorage.getItem('playerListEnabled') !== 'false',
        maxHeight: parseInt(localStorage.getItem('playerListMaxHeight')) || 400,
        keybind: localStorage.getItem('playerListKeybind') || 'KeyP',
        useShift: localStorage.getItem('playerListUseShift') === 'true',
        useCtrl: localStorage.getItem('playerListUseCtrl') === 'true',
        useAlt: localStorage.getItem('playerListUseAlt') === 'true'
    };

    function saveConfig() {
        localStorage.setItem('playerListEnabled', config.enabled.toString());
        localStorage.setItem('playerListMaxHeight', config.maxHeight.toString());
        localStorage.setItem('playerListKeybind', config.keybind);
        localStorage.setItem('playerListUseShift', config.useShift.toString());
        localStorage.setItem('playerListUseCtrl', config.useCtrl.toString());
        localStorage.setItem('playerListUseAlt', config.useAlt.toString());
    }

    const getTimeString = (date) => {
        return ("0"+date.getHours()).substr(-2) + ':' + ("0"+date.getMinutes()).substr(-2) + ':' + ("0"+date.getSeconds()).substr(-2);
    };

    const entryTimes = {};
    let currentMapName = '';
    let windowElement = null;
    let isWindowVisible = true;

    // Style CSS
    const styles = `
        <style id="player-list-styles">
            .player-list-window {
                position: fixed;
                top: 50px;
                right: 10px;
                width: 260px;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 4px;
                color: #ccc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                z-index: 10000;
                display: flex;
                flex-direction: column;
            }

            .player-list-header {
                background: #333;
                padding: 8px 10px;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 4px 4px 0 0;
                border-bottom: 1px solid #444;
                flex-shrink: 0;
            }

            .player-list-header h3 {
                margin: 0;
                color: #ffd700;
                font-size: 11px;
                font-weight: bold;
                flex: 1;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .player-list-close {
                background: none;
                border: none;
                color: #888;
                font-size: 16px;
                cursor: pointer;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                padding: 0;
                line-height: 1;
                flex-shrink: 0;
            }

            .player-list-close:hover {
                color: #fff;
            }

            .player-list-content {
                padding: 8px;
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                min-height: 0;
            }

            .player-list-content::-webkit-scrollbar {
                width: 8px;
            }

            .player-list-content::-webkit-scrollbar-track {
                background: #1a1a1a;
                border-radius: 4px;
                margin: 4px 0;
            }

            .player-list-content::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
                border: 2px solid #1a1a1a;
                transition: background 0.2s;
            }

            .player-list-content::-webkit-scrollbar-thumb:hover {
                background: #666;
            }

            .player-list-content::-webkit-scrollbar-thumb:active {
                background: #777;
            }

            .player-list-content {
                scrollbar-width: thin;
                scrollbar-color: #555 #1a1a1a;
            }

            .player-list-items {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .player-list-item {
                padding: 6px 8px;
                background: #333;
                border: 1px solid #444;
                border-radius: 3px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
                font-size: 10px;
            }

            .player-list-item:hover {
                background: #3a3a3a;
                border-color: #555;
                transform: translateX(-2px);
            }
           .player-list-item.self {
               background: #2d4a2d;
               border-color: #4CAF50;
            }

          .player-list-item.self:hover {
               background: #345a34;
               border-color: #5bc05b;
            }

          .player-list-item.self .player-list-item-nick {
               color: #4CAF50;
               font-weight: bold;
            }

            .player-list-item-left {
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 1;
                min-width: 0;
            }

            .player-list-item-number {
                color: #ffd700;
                font-weight: bold;
                font-size: 10px;
                min-width: 16px;
            }

            .player-list-item-nick {
                color: #fff;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .player-list-item-time {
                color: #aaa;
                font-size: 9px;
                font-family: 'Courier New', monospace;
                margin-left: 6px;
            }

            .player-list-empty {
                color: #999;
                font-style: italic;
                text-align: center;
                padding: 15px;
                font-size: 10px;
            }

            .player-list-count {
                text-align: center;
                padding: 6px;
                background: #333;
                border-top: 1px solid #444;
                border-radius: 0 0 4px 4px;
                font-size: 9px;
                color: #aaa;
                flex-shrink: 0;
            }

            .player-list-count strong {
                color: #ffd700;
                font-weight: bold;
            }

            /* Modal ustawień - ZMNIEJSZONY */
            .player-list-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                pointer-events: none;
            }

            .player-list-dialog {
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 0;
                width: 340px;
                max-width: 90vw;
                color: #ccc;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                pointer-events: all;
            }

            .player-list-dialog-header {
                background: #333;
                padding: 10px 12px;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 4px 4px 0 0;
                border-bottom: 1px solid #444;
            }

            .player-list-dialog-header h3 {
                margin: 0;
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                flex: 1;
                text-align: center;
            }

            .player-list-dialog-close {
                background: none;
                border: none;
                color: #888;
                font-size: 18px;
                cursor: pointer;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                padding: 0;
            }

            .player-list-dialog-close:hover {
                color: #fff;
            }

            .player-list-dialog-content {
                padding: 12px;
            }

            .player-list-setting-group {
                margin-bottom: 12px;
                background: #333;
                border: 1px solid #444;
                border-radius: 3px;
                padding: 10px;
            }

            .player-list-setting-label {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                font-size: 11px;
                color: #ccc;
            }

            .player-list-checkbox {
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

            .player-list-checkbox:hover {
                border-color: #4CAF50;
            }

            .player-list-checkbox:checked {
                background: #4CAF50;
                border-color: #4CAF50;
            }

            .player-list-checkbox:checked::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .player-list-input {
                width: 60px;
                padding: 6px 8px;
                background: #555;
                border: 1px solid #666;
                border-radius: 3px;
                color: #fff;
                font-size: 11px;
                box-sizing: border-box;
            }

            .player-list-input:focus {
                outline: none;
                border-color: #888;
            }

            .player-list-keybind-input {
                width: 100%;
                padding: 8px;
                background: #555;
                border: 2px solid #666;
                border-radius: 3px;
                color: #fff;
                font-size: 11px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
                box-sizing: border-box;
            }

            .player-list-keybind-input:focus {
                outline: none;
                border-color: #5865F2;
                background: #666;
            }

            .player-list-keybind-input.recording {
                border-color: #4CAF50;
                background: #666;
                animation: pulse 1s ease-in-out infinite;
            }

            .player-list-modifier-keys {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .player-list-modifier-key {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px;
                background: #2a2a2a;
                border-radius: 3px;
                font-size: 11px;
            }

            .player-list-description {
                font-size: 10px;
                color: #888;
                margin-top: 4px;
                line-height: 1.3;
            }

            .player-list-buttons {
                display: flex;
                gap: 8px;
                padding: 10px 12px;
                background: #2a2a2a;
                border-radius: 0 0 4px 4px;
                border-top: 1px solid #444;
            }

            .player-list-btn {
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                transition: background 0.2s;
            }

            .player-list-btn-primary {
                background: #5865F2;
                color: white;
            }

            .player-list-btn-primary:hover {
                background: #4752C4;
            }
        </style>
    `;

    // Dodaj style do strony
    document.head.insertAdjacentHTML('beforeend', styles);

    // Funkcja do formatowania nazwy klawisza
    function getKeyName(code) {
        const keyNames = {
            'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E', 'KeyF': 'F',
            'KeyG': 'G', 'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L',
            'KeyM': 'M', 'KeyN': 'N', 'KeyO': 'O', 'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R',
            'KeyS': 'S', 'KeyT': 'T', 'KeyU': 'U', 'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X',
            'KeyY': 'Y', 'KeyZ': 'Z',
            'Digit0': '0', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4',
            'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9',
            'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4', 'F5': 'F5', 'F6': 'F6',
            'F7': 'F7', 'F8': 'F8', 'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12'
        };
        return keyNames[code] || code;
    }

    // Tworzenie okna
    const createWindow = () => {
        const windowDiv = document.createElement('div');
        windowDiv.className = 'player-list-window';
        windowDiv.id = 'playerEntryWindow';
        windowDiv.style.maxHeight = `${config.maxHeight}px`;
        windowDiv.style.display = config.enabled && isWindowVisible ? 'flex' : 'none';

        windowDiv.innerHTML = `
            <div class="player-list-header" id="playerListHeader">
                <h3 id="mapNameText">Ładowanie...</h3>
                <button class="player-list-close" id="closePlayerWindow">×</button>
            </div>
            <div class="player-list-content" id="playerListContent">
                <div class="player-list-items" id="playerList"></div>
            </div>
            <div class="player-list-count" id="playerCount">
                Graczy: <strong>0</strong>
            </div>
        `;

        document.body.appendChild(windowDiv);

        // Blokada propagacji scrolla
        const scrollContent = document.getElementById('playerListContent');
        scrollContent.addEventListener('wheel', e => e.stopPropagation());

        // Zamykanie okna (tylko ukrywa, nie wyłącza całkowicie)
        document.getElementById('closePlayerWindow').addEventListener('click', () => {
            isWindowVisible = false;
            windowDiv.style.display = 'none';
        });

        // Przeciąganie okna
        let isDragging = false;
        let offsetX, offsetY;

        const header = document.getElementById('playerListHeader');
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowDiv.offsetLeft;
            offsetY = e.clientY - windowDiv.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowDiv.style.left = (e.clientX - offsetX) + 'px';
                windowDiv.style.top = (e.clientY - offsetY) + 'px';
                windowDiv.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        windowElement = windowDiv;
        return windowDiv;
    };

    // Aktualizacja wyświetlanej listy graczy
    const updateWindow = () => {
        const mapNameText = document.getElementById('mapNameText');
        const playerList = document.getElementById('playerList');
        const playerCount = document.getElementById('playerCount');

        if (!mapNameText || !playerList || !playerCount) return;

        mapNameText.textContent = currentMapName || 'Nieznana mapa';

        const sortedPlayers = Object.entries(entryTimes).sort((a, b) => {
            return a[1].entry_time.localeCompare(b[1].entry_time);
        });

        playerCount.innerHTML = `Graczy: <strong>${sortedPlayers.length}</strong>`;

        if (sortedPlayers.length === 0) {
            playerList.innerHTML = '<div class="player-list-empty">Brak graczy</div>';
        } else {
playerList.innerHTML = sortedPlayers.map(([id, data], index) => `
    <div class="player-list-item${data.isSelf ? ' self' : ''}">
        <div class="player-list-item-left">
            <span class="player-list-item-number">${index + 1}.</span>
            <span class="player-list-item-nick">${data.nick}</span>
        </div>
        <span class="player-list-item-time">${data.entry_time}</span>
    </div>
`).join('');
        }
    };

    // Toggle okna
    function toggleWindow() {
        isWindowVisible = !isWindowVisible;
        if (windowElement) {
            windowElement.style.display = isWindowVisible ? 'flex' : 'none';
        }
    }

    // Keybind listener
    document.addEventListener('keydown', (e) => {
        // Ignoruj jeśli focus jest na input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Sprawdź czy naciśnięto odpowiedni klawisz
        if (e.code === config.keybind) {
            // Sprawdź modyfikatory
            const shiftMatches = config.useShift ? e.shiftKey : !e.shiftKey;
            const ctrlMatches = config.useCtrl ? e.ctrlKey : !e.ctrlKey;
            const altMatches = config.useAlt ? e.altKey : !e.altKey;

            if (shiftMatches && ctrlMatches && altMatches) {
                e.preventDefault();
                toggleWindow();
            }
        }
    });

    // Dialog ustawień
    function showSettingsDialog() {
        const existingModal = document.querySelector('.player-list-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'player-list-modal';

        modal.innerHTML = `
            <div class="player-list-dialog">
                <div class="player-list-dialog-header" id="playerListDialogHeader">
                    <h3>Who First? - Settings</h3>
                    <button class="player-list-dialog-close" id="playerListDialogClose">×</button>
                </div>
                <div class="player-list-dialog-content">
                    <div class="player-list-setting-group">
                        <label class="player-list-setting-label">
                            <input type="checkbox" class="player-list-checkbox" id="enablePlayerList" ${config.enabled ? 'checked' : ''}>
                            Włącz okno listy graczy
                        </label>
                        <div class="player-list-description">
                            Włącza/wyłącza funkcjonalność okna z listą graczy
                        </div>
                    </div>

                    <div class="player-list-setting-group">
                        <label class="player-list-setting-label">
                            Keybind do pokazywania/ukrywania okna
                        </label>
                        <input type="text" class="player-list-keybind-input" id="keybindInput"
                               value="${getKeyName(config.keybind)}" readonly>
                        <div class="player-list-description">
                            Kliknij w pole i naciśnij klawisz, który chcesz użyć
                        </div>

                        <div class="player-list-modifier-keys">
                            <label class="player-list-modifier-key">
                                <input type="checkbox" class="player-list-checkbox" id="use-shift" ${config.useShift ? 'checked' : ''}>
                                <span>Shift</span>
                            </label>
                            <label class="player-list-modifier-key">
                                <input type="checkbox" class="player-list-checkbox" id="use-ctrl" ${config.useCtrl ? 'checked' : ''}>
                                <span>Ctrl</span>
                            </label>
                            <label class="player-list-modifier-key">
                                <input type="checkbox" class="player-list-checkbox" id="use-alt" ${config.useAlt ? 'checked' : ''}>
                                <span>Alt</span>
                            </label>
                        </div>
                    </div>

                    <div class="player-list-setting-group">
                        <label class="player-list-setting-label">
                            Maksymalna wysokość okna (px)
                        </label>
                        <input type="number" class="player-list-input" id="maxHeightInput"
                               value="${config.maxHeight}" min="200" max="800" step="50">
                        <div class="player-list-description">
                            Ustaw maksymalną wysokość okna (200-800px)
                        </div>
                    </div>
                </div>
                <div class="player-list-buttons">
                    <button class="player-list-btn player-list-btn-primary" id="playerListSave">Zapisz</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Keybind recording
        const keybindInput = document.getElementById('keybindInput');
        let isRecording = false;

        keybindInput.addEventListener('click', () => {
            isRecording = true;
            keybindInput.classList.add('recording');
            keybindInput.value = 'Naciśnij klawisz...';
        });

        const keybindListener = (e) => {
            if (!isRecording) return;

            e.preventDefault();
            e.stopPropagation();

            if (e.code && e.code !== 'Escape') {
                config.keybind = e.code;
                keybindInput.value = getKeyName(e.code);
                keybindInput.classList.remove('recording');
                isRecording = false;
            }
        };

        document.addEventListener('keydown', keybindListener);

        // Przeciąganie dialogu
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.player-list-dialog');
        const header = document.getElementById('playerListDialogHeader');

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

        // Zamknij
        document.getElementById('playerListDialogClose').addEventListener('click', () => {
            document.removeEventListener('keydown', keybindListener);
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.removeEventListener('keydown', keybindListener);
                modal.remove();
            }
        });

        // Zapisz
        document.getElementById('playerListSave').addEventListener('click', () => {
            const enableCheckbox = document.getElementById('enablePlayerList');
            const maxHeightInput = document.getElementById('maxHeightInput');

            config.enabled = enableCheckbox.checked;
            config.maxHeight = parseInt(maxHeightInput.value) || 400;
            config.useShift = document.getElementById('use-shift').checked;
            config.useCtrl = document.getElementById('use-ctrl').checked;
            config.useAlt = document.getElementById('use-alt').checked;

            saveConfig();

            if (windowElement) {
                windowElement.style.display = config.enabled && isWindowVisible ? 'flex' : 'none';
                windowElement.style.maxHeight = `${config.maxHeight}px`;
            }

            document.removeEventListener('keydown', keybindListener);
        });
    }

    // Integracja z managerem
    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'player-list-settings-btn';
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
            const addonContainer = document.getElementById('addon-whofirst');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#player-list-settings-btn')) {
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

const selfNick = () => {
    if (Engine.hero && Engine.hero.d && Engine.hero.d.nick) {
        const timestamp = new Date();
        const timeString = getTimeString(timestamp);
        entryTimes['self'] = {
            nick: Engine.hero.d.nick,
            entry_time: timeString,
            isSelf: true
        };
        updateWindow();
    }
};

    // Inicjalizacja po załadowaniu gry
    const init = () => {
        if (typeof Engine === 'undefined' || typeof API === 'undefined') {
            setTimeout(init, 500);
            return;
        }
        selfNick();
        createWindow();

        // Nasłuchiwanie na nowych graczy
        API.addCallbackToEvent(Engine.apiData.NEW_OTHER, (other) => {
            if (!other.isPlayer || entryTimes.hasOwnProperty(other.d.id)) {
                return;
            }
            const timestamp = new Date();
            const timeString = getTimeString(timestamp);
            entryTimes[other.d.id] = {
                nick: other.d.nick,
                entry_time: timeString
            };
            updateWindow();
        });

        // Nasłuchiwanie na wychodzących graczy
        API.addCallbackToEvent(Engine.apiData.REMOVE_OTHER, (other) => {
            if (!other.isPlayer || !entryTimes.hasOwnProperty(other.d.id)) {
                return;
            }
            delete entryTimes[other.d.id];
            updateWindow();
        });

        // Nasłuchiwanie na zmianę mapy
        const originalMapNameUpdate = Engine.map.onUpdate.name;
        Engine.map.onUpdate.name = function(mapName, i) {
            originalMapNameUpdate.call(this, mapName, i);
            currentMapName = mapName;
            selfNick();
            updateWindow();
        };

        // Pobierz aktualną nazwę mapy
        if (Engine.map && Engine.map.d && Engine.map.d.name) {
            currentMapName = Engine.map.d.name;
            selfNick();
            updateWindow();
        }

        // Integracja z managerem
        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }
    };

    init();
})();
