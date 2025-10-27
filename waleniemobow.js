(function() {
    'use strict';

    if (window.berserkToggleRunning) {
        return;
    }
    window.berserkToggleRunning = true;

    // KONFIGURACJA
    let config = {
        toggleKey: localStorage.getItem('berserkToggleKey') || 'B',
        useCtrl: localStorage.getItem('berserkUseCtrl') !== 'false',
        useAlt: localStorage.getItem('berserkUseAlt') === 'true',
        useShift: localStorage.getItem('berserkUseShift') === 'true'
    };

    const BERSERK_ID = 34;
    const BERSERK_GROUP_ID = 35;

    function saveConfig() {
        localStorage.setItem('berserkToggleKey', config.toggleKey);
        localStorage.setItem('berserkUseCtrl', config.useCtrl.toString());
        localStorage.setItem('berserkUseAlt', config.useAlt.toString());
        localStorage.setItem('berserkUseShift', config.useShift.toString());
    }

    // STYLE
    const styles = `
        <style id="berserk-toggle-style">
        .berserk-modal {
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

        .berserk-dialog {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 0;
            width: 400px;
            max-width: 90vw;
            color: #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            pointer-events: all;
        }

        .berserk-header {
            background: #333;
            padding: 15px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #444;
        }

        .berserk-header h3 {
            margin: 0;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            flex: 1;
        }

        .berserk-close {
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

        .berserk-close:hover {
            color: #fff;
        }

        .berserk-content {
            padding: 15px;
            max-height: 70vh;
            overflow-y: auto;
        }

        .berserk-setting-group {
            margin-bottom: 15px;
            background: #333;
            border: 1px solid #444;
            border-radius: 3px;
            padding: 12px;
        }

        .berserk-setting-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            font-weight: normal;
            color: #ccc;
            font-size: 12px;
        }

        .berserk-checkbox {
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

        .berserk-checkbox:hover {
            border-color: #4CAF50;
        }

        .berserk-checkbox:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .berserk-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .berserk-input {
            width: 100%;
            padding: 8px;
            background: #555;
            border: 1px solid #666;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
            box-sizing: border-box;
        }

        .berserk-input:focus {
            outline: none;
            border-color: #888;
        }

        .berserk-description {
            font-size: 10px;
            color: #888;
            margin-top: 5px;
            line-height: 1.4;
        }

        .berserk-buttons {
            display: flex;
            gap: 8px;
            padding: 12px 15px;
            background: #2a2a2a;
            border-radius: 0 0 4px 4px;
            border-top: 1px solid #444;
        }

        .berserk-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: background 0.2s;
            flex: 1;
        }

        .berserk-btn-primary {
            background: #5865F2;
            color: white;
        }

        .berserk-btn-primary:hover {
            background: #4752C4;
        }

        .berserk-keybind-display {
            background: #1a1a1a;
            padding: 10px;
            border-radius: 3px;
            text-align: center;
            color: #4CAF50;
            font-weight: bold;
            font-size: 13px;
            margin-top: 10px;
        }
        </style>
    `;

    // NOTYFIKACJA
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

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // CZEKAJ NA GRĘ
    function waitForGame() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.Engine &&
                    window.Engine.settings &&
                    window.Engine.settings.changeSingleOptionsAndSave &&
                    window.Engine.settingsStorage &&
                    window.Engine.settingsStorage.getValue) {
                    clearInterval(check);
                    resolve();
                }
            }, 500);
        });
    }

    // TOGGLE BERSERK
    function toggleBerserk() {


        try {
            // Użyj funkcji z gry
            window.Engine.settings.changeSingleOptionsAndSave(BERSERK_ID);
            window.Engine.settings.changeSingleOptionsAndSave(BERSERK_GROUP_ID);

            // Sprawdź nowy stan po chwili
            setTimeout(() => {
                const newState = window.Engine.settingsStorage.getValue(BERSERK_ID);
                const status = newState ? 'WŁĄCZONY ✓' : 'WYŁĄCZONY ✗';

                showNotification(`Berserk ${status}`, newState ? 'success' : 'info');
            }, 100);

        } catch (error) {
            console.error('[Berserk Toggle] ✗ Błąd:', error);
            showNotification('Błąd przełączania Berserk', 'error');
        }
    }

    // OKNO USTAWIEŃ
    function showSettingsDialog() {
        const existingModal = document.querySelector('.berserk-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'berserk-modal';

        const keybindText = `${config.useCtrl ? 'Ctrl + ' : ''}${config.useAlt ? 'Alt + ' : ''}${config.useShift ? 'Shift + ' : ''}${config.toggleKey}`;

        modal.innerHTML = `
            <div class="berserk-dialog">
                <div class="berserk-header" id="berserk-header">
                    <h3>Berserk - Ustawienia</h3>
                    <button class="berserk-close" id="berserk-close">×</button>
                </div>

                <div class="berserk-content">
                    <div class="berserk-setting-group">
                        <label class="berserk-setting-label">
                            Klawisz przełączania
                        </label>
                        <input type="text" class="berserk-input" id="berserk-key" value="${config.toggleKey}" maxlength="1" placeholder="np. B">
                        <div class="berserk-description">Wpisz pojedynczą literę lub cyfrę</div>
                    </div>

                    <div class="berserk-setting-group">
                        <label class="berserk-setting-label">
                            Modyfikatory
                        </label>
                        <label class="berserk-setting-label">
                            <input type="checkbox" class="berserk-checkbox" id="berserk-ctrl" ${config.useCtrl ? 'checked' : ''}>
                            Wymagaj Ctrl
                        </label>
                        <label class="berserk-setting-label">
                            <input type="checkbox" class="berserk-checkbox" id="berserk-alt" ${config.useAlt ? 'checked' : ''}>
                            Wymagaj Alt
                        </label>
                        <label class="berserk-setting-label">
                            <input type="checkbox" class="berserk-checkbox" id="berserk-shift" ${config.useShift ? 'checked' : ''}>
                            Wymagaj Shift
                        </label>
                        <div class="berserk-description">Wybierz które klawisze modyfikujące mają być wymagane</div>
                    </div>

                    <div class="berserk-keybind-display" id="keybind-display">
                        Aktualny keybind: ${keybindText}
                    </div>
                </div>

                <div class="berserk-buttons">
                    <button class="berserk-btn berserk-btn-primary" id="berserk-save">Zapisz</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Funkcja aktualizacji wyświetlania keybindu
        function updateKeybindDisplay() {
            const key = document.getElementById('berserk-key').value.toUpperCase() || 'B';
            const ctrl = document.getElementById('berserk-ctrl').checked;
            const alt = document.getElementById('berserk-alt').checked;
            const shift = document.getElementById('berserk-shift').checked;

            const display = `${ctrl ? 'Ctrl + ' : ''}${alt ? 'Alt + ' : ''}${shift ? 'Shift + ' : ''}${key}`;
            document.getElementById('keybind-display').textContent = `Aktualny keybind: ${display}`;
        }

        // Eventy
        document.getElementById('berserk-key').addEventListener('input', updateKeybindDisplay);
        document.getElementById('berserk-ctrl').addEventListener('change', updateKeybindDisplay);
        document.getElementById('berserk-alt').addEventListener('change', updateKeybindDisplay);
        document.getElementById('berserk-shift').addEventListener('change', updateKeybindDisplay);

        // Przeciąganie
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.berserk-dialog');
        const header = document.getElementById('berserk-header');

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
        document.getElementById('berserk-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Zapisz
        document.getElementById('berserk-save').addEventListener('click', () => {
            config.toggleKey = document.getElementById('berserk-key').value.toUpperCase() || 'B';
            config.useCtrl = document.getElementById('berserk-ctrl').checked;
            config.useAlt = document.getElementById('berserk-alt').checked;
            config.useShift = document.getElementById('berserk-shift').checked;

            saveConfig();
            showNotification('Ustawienia zapisane!', 'success');
            modal.remove();
        });
    }

    // KEYBIND
    function setupKeybind() {
        document.addEventListener('keydown', function(event) {
            // Ignoruj input/textarea
            if (event.target.tagName === 'INPUT' ||
                event.target.tagName === 'TEXTAREA' ||
                event.target.isContentEditable) {
                return;
            }

            if (event.key.toUpperCase() === config.toggleKey.toUpperCase()) {
                const ctrlMatch = config.useCtrl ? event.ctrlKey : !event.ctrlKey;
                const altMatch = config.useAlt ? event.altKey : !event.altKey;
                const shiftMatch = config.useShift ? event.shiftKey : !event.shiftKey;

                if (ctrlMatch && altMatch && shiftMatch) {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleBerserk();
                    return false;
                }
            }
        }, true);

        const keybindText = `${config.useCtrl ? 'Ctrl + ' : ''}${config.useAlt ? 'Alt + ' : ''}${config.useShift ? 'Shift + ' : ''}${config.toggleKey}`;
    }

    // INTEGRACJA Z MANAGEREM
    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'berserk-settings-btn';
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
            const addonContainer = document.getElementById('addon-berserk');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#berserk-settings-btn')) {
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

    // INICJALIZACJA
    function init() {
        // Dodaj style
        document.head.insertAdjacentHTML('beforeend', styles);

        // Uruchom
        waitForGame().then(() => {
            setupKeybind();
            const keybindText = `${config.useCtrl ? 'Ctrl + ' : ''}${config.useAlt ? 'Alt + ' : ''}${config.useShift ? 'Shift + ' : ''}${config.toggleKey}`;


            // Stan początkowy
            const currentState = window.Engine.settingsStorage.getValue(BERSERK_ID);

        });

        // Integracja z managerem
        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('[Berserk Toggle] Błąd integracji z managerem:', error);
        }
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
