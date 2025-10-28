(function() {
    'use strict';

    if (window.toggleButtonRunning) {
        return;
    }
    window.toggleButtonRunning = true;
    let keybindListener = null;


    let config = {
        enabled: true, // Zawsze włączony
        controlType: localStorage.getItem('berserkControlType') || 'button',
        keybind: localStorage.getItem('berserkKeybind') || 'F1',
        useShift: localStorage.getItem('berserkUseShift') === 'true',
        useCtrl: localStorage.getItem('berserkUseCtrl') === 'true',
        useAlt: localStorage.getItem('berserkUseAlt') === 'true',
buttonPosition: (() => {
            try {
                const saved = localStorage.getItem('berserkButtonPosition');
                if (!saved) return {x: 10, y: 10};
                if (saved.startsWith('{')) {
                    return JSON.parse(saved);
                }
                return {x: 10, y: 10};
            } catch (e) {
                return {x: 10, y: 10};
            }
        })(),
        settingValue: localStorage.getItem('berserkSettingValue') === '1'
    };

    function saveConfig() {
        localStorage.setItem('berserkControlType', config.controlType);
        localStorage.setItem('berserkKeybind', config.keybind);
        localStorage.setItem('berserkUseShift', config.useShift.toString());
        localStorage.setItem('berserkUseCtrl', config.useCtrl.toString());
        localStorage.setItem('berserkUseAlt', config.useAlt.toString());
        localStorage.setItem('berserkButtonPosition', JSON.stringify(config.buttonPosition));
        localStorage.setItem('berserkStatusPosition', JSON.stringify(config.statusPosition));
        localStorage.setItem('berserkSettingValue', config.settingValue.toString());
    }

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

    // Style dla interfejsu ustawień
    const styles = `
        .berserk-toggle-settings-modal {
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

        .berserk-toggle-settings-dialog {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 0;
            width: 450px;
            max-width: 90vw;
            max-height: 90vh;
            color: #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            pointer-events: all;
        }

        .berserk-toggle-settings-header {
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

        .berserk-toggle-settings-header h3 {
            margin: 0;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            flex: 1;
        }

        .berserk-toggle-settings-close {
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

        .berserk-toggle-settings-close:hover {
            color: #fff;
        }

        .berserk-toggle-settings-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }

        .berserk-toggle-settings-content::-webkit-scrollbar {
            width: 8px;
        }

        .berserk-toggle-settings-content::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .berserk-toggle-settings-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        .berserk-toggle-settings-content::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .berserk-toggle-setting-group {
            margin-bottom: 15px;
            background: #333;
            border: 1px solid #444;
            border-radius: 3px;
            padding: 12px;
        }

        .berserk-toggle-setting-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            font-weight: normal;
            color: #ccc;
            font-size: 12px;
        }

        .berserk-toggle-checkbox {
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
            flex-shrink: 0;
        }

        .berserk-toggle-checkbox:hover {
            border-color: #4CAF50;
        }

        .berserk-toggle-checkbox:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .berserk-toggle-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .berserk-toggle-setting-description {
            font-size: 10px;
            color: #888;
            margin-top: 5px;
            line-height: 1.4;
        }

        .berserk-toggle-select {
            width: 100%;
            padding: 8px;
            background: #555;
            border: 1px solid #666;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        }

        .berserk-toggle-select:focus {
            outline: none;
            border-color: #888;
        }

        .berserk-toggle-input {
            width: 100%;
            padding: 8px;
            background: #555;
            border: 1px solid #666;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
        }

        .berserk-toggle-input:focus {
            outline: none;
            border-color: #888;
        }

        .berserk-toggle-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .berserk-keybind-recorder {
            width: 100%;
            padding: 8px;
            background: #555;
            border: 1px solid #666;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            transition: background 0.2s;
        }

        .berserk-keybind-recorder:hover {
            background: #666;
        }

        .berserk-keybind-recorder.recording {
            background: #4CAF50;
            border-color: #4CAF50;
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .berserk-modifier-keys {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }

        .berserk-modifier-key {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px;
            background: #2a2a2a;
            border-radius: 3px;
            font-size: 11px;
        }

        .berserk-toggle-buttons {
            display: flex;
            gap: 8px;
            padding: 12px 15px;
            background: #2a2a2a;
            border-radius: 0 0 4px 4px;
            border-top: 1px solid #444;
            flex-shrink: 0;
        }

        .berserk-toggle-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: background 0.2s;
            flex: 1;
        }

        .berserk-toggle-btn-primary {
            background: #5865F2;
            color: white;
        }

        .berserk-toggle-btn-primary:hover {
            background: #4752C4;
        }

        .berserk-toggle-btn-secondary {
            background: #4e4e4e;
            color: white;
        }

        .berserk-toggle-btn-secondary:hover {
            background: #5a5a5a;
        }

        .berserk-toggle-btn-reset {
            background: #ED4245;
            color: white;
        }

        .berserk-toggle-btn-reset:hover {
            background: #C03537;
        }

        .berserk-radio-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
        }

        .berserk-radio-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .berserk-radio-label input[type="radio"] {
            cursor: pointer;
        }

        .berserk-radio-label span {
            color: #ccc;
            font-size: 12px;
        }

#berserkToggleBox {
            position: fixed;
            padding: 10px 15px;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 4px;
            color: #fff;
            font-size: 13px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            cursor: move;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #berserkToggleBox .box-label {
            font-weight: bold;
            color: #ccc;
        }

        #berserkToggleBox .box-checkbox {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border: 2px solid #555;
            border-radius: 3px;
            background: #1a1a1a;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        #berserkToggleBox .box-checkbox:hover {
            border-color: #4CAF50;
        }

        #berserkToggleBox .box-checkbox:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

#berserkToggleBox .box-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 13px;
            font-weight: bold;
        }
    `;

    // Dodaj style do strony
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    function showSettingsDialog() {
        const existingModal = document.querySelector('.berserk-toggle-settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'berserk-toggle-settings-modal';

        modal.innerHTML = `
            <div class="berserk-toggle-settings-dialog">
                <div class="berserk-toggle-settings-header" id="berserk-header">
                    <h3>Berserk - Settings</h3>
                    <button class="berserk-toggle-settings-close" id="berserk-close">×</button>
                </div>

                <div class="berserk-toggle-settings-content">
                    <div class="berserk-toggle-setting-group">

                    <div class="berserk-toggle-setting-group">
                        <label class="berserk-toggle-setting-label">
                            Typ sterowania
                        </label>
                        <div class="berserk-radio-group">
                            <label class="berserk-radio-label">
                                <input type="radio" name="control-type" value="button" ${config.controlType === 'button' ? 'checked' : ''}>
                                <span>Tylko przycisk</span>
                            </label>
                            <label class="berserk-radio-label">
                                <input type="radio" name="control-type" value="keybind" ${config.controlType === 'keybind' ? 'checked' : ''}>
                                <span>Tylko skrót klawiszowy</span>
                            </label>
                            <label class="berserk-radio-label">
                                <input type="radio" name="control-type" value="both" ${config.controlType === 'both' ? 'checked' : ''}>
                                <span>Przycisk i skrót klawiszowy</span>
                            </label>
                        </div>
                    </div>

<div class="berserk-toggle-setting-group" id="button-position-group">
                        <label class="berserk-toggle-setting-label">
                            Przycisk
                        </label>
                        <div class="berserk-toggle-setting-description">Pojawia się checbox z togglem berserkera. </div>
                    </div>

                    <div class="berserk-toggle-setting-group" id="keybind-group">
                        <label class="berserk-toggle-setting-label">
                            Skrót klawiszowy
                        </label>
                        <div class="berserk-keybind-recorder" id="keybind-recorder">
                            ${config.keybind || 'Kliknij aby ustawić'}
                        </div>
                        <div class="berserk-toggle-setting-description" style="margin-top: 8px;">
                            Kliknij w pole i naciśnij wybrany klawisz
                        </div>

                        <div class="berserk-modifier-keys">
                            <label class="berserk-modifier-key">
                                <input type="checkbox" class="berserk-toggle-checkbox" id="use-shift" ${config.useShift ? 'checked' : ''}>
                                <span>Shift</span>
                            </label>
                            <label class="berserk-modifier-key">
                                <input type="checkbox" class="berserk-toggle-checkbox" id="use-ctrl" ${config.useCtrl ? 'checked' : ''}>
                                <span>Ctrl</span>
                            </label>
                            <label class="berserk-modifier-key">
                                <input type="checkbox" class="berserk-toggle-checkbox" id="use-alt" ${config.useAlt ? 'checked' : ''}>
                                <span>Alt</span>
                            </label>
                        </div>
                    </div>
                       <div class="berserk-toggle-buttons">
                    <button class="berserk-toggle-btn berserk-toggle-btn-reset" id="berserk-reset">Reset</button>
                    <button class="berserk-toggle-btn berserk-toggle-btn-primary" id="berserk-save">Zapisz</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Przeciąganie okna
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.berserk-toggle-settings-dialog');
        const header = modal.querySelector('#berserk-header');

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

        // Obsługa zamykania
        document.getElementById('berserk-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Obsługa typu sterowania
        const buttonPositionGroup = document.getElementById('button-position-group');
        const keybindGroup = document.getElementById('keybind-group');

function updateControlTypeVisibility() {
            const selectedType = document.querySelector('input[name="control-type"]:checked').value;

            if (selectedType === 'keybind') {
                buttonPositionGroup.style.display = 'none';
                keybindGroup.style.display = 'block';
            } else {
                buttonPositionGroup.style.display = 'block';
                keybindGroup.style.display = selectedType === 'both' ? 'block' : 'none';
            }
        }

        updateControlTypeVisibility();

        document.querySelectorAll('input[name="control-type"]').forEach(radio => {
            radio.addEventListener('change', updateControlTypeVisibility);
        });

        // Obsługa nagrywania keybinda
        const keybindRecorder = document.getElementById('keybind-recorder');
        let isRecording = false;

        keybindRecorder.addEventListener('click', () => {
            if (isRecording) return;

            isRecording = true;
            keybindRecorder.textContent = 'Naciśnij klawisz...';
            keybindRecorder.classList.add('recording');

            const handleKeyPress = (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Ignoruj same modyfikatory
                if (['Shift', 'Control', 'Alt'].includes(e.key)) {
                    return;
                }

                const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                config.keybind = key;

                keybindRecorder.textContent = key;
                keybindRecorder.classList.remove('recording');
                isRecording = false;

                document.removeEventListener('keydown', handleKeyPress, true);
            };

            document.addEventListener('keydown', handleKeyPress, true);

            // Timeout na wypadek braku reakcji
            setTimeout(() => {
                if (isRecording) {
                    keybindRecorder.textContent = config.keybind || 'Kliknij aby ustawić';
                    keybindRecorder.classList.remove('recording');
                    isRecording = false;
                    document.removeEventListener('keydown', handleKeyPress, true);
                }
            }, 5000);
        });

    // Reset
    document.getElementById('berserk-reset').addEventListener('click', () => {
        config.enabled = true;
        config.controlType = 'button';
        config.keybind = 'F1';
        config.useShift = false;
        config.useCtrl = false;
        config.useAlt = false;
        config.buttonPosition = {x: 10, y: 10};
        config.statusPosition = {x: null, y: null};
        config.showStatus = true;
        config.settingId = '34';
        config.settingValue = false;

        saveConfig();
        showNotification('Ustawienia zresetowane do domyślnych', 'info');

        // Odśwież interfejs
        modal.remove();
        showSettingsDialog();
        initButton();
    });


document.getElementById('berserk-save').addEventListener('click', () => {
            config.controlType = document.querySelector('input[name="control-type"]:checked').value;
            config.useShift = document.getElementById('use-shift').checked;
            config.useCtrl = document.getElementById('use-ctrl').checked;
            config.useAlt = document.getElementById('use-alt').checked;

            saveConfig();
            showNotification('Ustawienia zapisane!', 'success');


            initButton();
            initKeybind();
        });
}

function waitForGame() {
    if (typeof _g !== 'function') {
        setTimeout(waitForGame, 1000);
        return;
    }
    initButton();
    initKeybind();
}

function toggleSetting() {
    config.settingValue = !config.settingValue;
    saveConfig();

    if (typeof _g === 'function') {
        // Wyślij dla id=34
        _g(`settings&action=update&id=34&v=${config.settingValue ? '1' : '0'}`);
        // Wyślij dla id=35
        _g(`settings&action=update&id=35&v=${config.settingValue ? '1' : '0'}`);
    }

    updateButton();
    showNotification(
        `Berserk ${config.settingValue ? 'włączony' : 'wyłączony'}`,
        config.settingValue ? 'success' : 'info'
    );
}

function updateButton() {
    const box = document.getElementById('berserkToggleBox');
    if (!box) return;

    const checkbox = box.querySelector('.box-checkbox');
    if (!checkbox) return;

    checkbox.checked = config.settingValue;
}
function initButton() {
    // Usuń stary box jeśli istnieje
    const oldBox = document.getElementById('berserkToggleBox');
    if (oldBox) {
        oldBox.remove();
    }

    // Nie twórz boxa jeśli typ to tylko keybind
    if (config.controlType === 'keybind') {
        return;
    }

    const box = document.createElement('div');
    box.id = 'berserkToggleBox';

    // Ustaw pozycję z configu
    box.style.left = config.buttonPosition.x + 'px';
    box.style.top = config.buttonPosition.y + 'px';

    // Utwórz label
    const label = document.createElement('span');
    label.className = 'box-label';
    label.textContent = 'Berserker';

    // Utwórz checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'box-checkbox';
    checkbox.checked = config.settingValue;

    box.appendChild(label);
    box.appendChild(checkbox);


    checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleSetting();
    });

    // Draggable functionality
    let isDragging = false;
    let dragStarted = false;
    let offsetX = 0;
    let offsetY = 0;
    let startX = 0;
    let startY = 0;

    const handleMouseMove = (e) => {
        if (!dragStarted) return;

        const moveDistance = Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY);

        // Jeśli przesunięcie > 5px, to zaczynamy przeciąganie
        if (moveDistance > 5 && !isDragging) {
            isDragging = true;
            box.style.cursor = 'grabbing';
        }

        if (isDragging) {
            e.preventDefault();
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - box.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - box.offsetHeight);

            box.style.left = x + 'px';
            box.style.top = y + 'px';
        }
    };

    const handleMouseUp = (e) => {
        if (dragStarted) {
            if (isDragging) {
                // Było przeciąganie - zapisz pozycję
                config.buttonPosition = {
                    x: parseInt(box.style.left),
                    y: parseInt(box.style.top)
                };
                saveConfig();
            }
        }

        box.style.cursor = 'move';
        isDragging = false;
        dragStarted = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    box.addEventListener('mousedown', (e) => {
        // Jeśli kliknięto w checkbox, nie przeciągaj
        if (e.target === checkbox) {
            return;
        }

        if (e.button === 0) { // Lewy przycisk
            e.preventDefault();
            dragStarted = true;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = e.clientX - box.getBoundingClientRect().left;
            offsetY = e.clientY - box.getBoundingClientRect().top;

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    });

    // Zablokuj menu kontekstowe
    box.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.body.appendChild(box);
}




function initKeybind() {
    // Usuń stary listener jeśli istnieje
    if (keybindListener) {
        document.removeEventListener('keydown', keybindListener);
        keybindListener = null;
    }

    // Nie inicjalizuj keybinda jeśli typ to tylko button
    if (config.controlType === 'button') {
        return;
    }

    // Stwórz nowy listener
    keybindListener = (e) => {
        // Sprawdź czy naciśnięto odpowiedni klawisz
        const keyMatches = e.key.toUpperCase() === config.keybind.toUpperCase() || e.key === config.keybind;

        if (!keyMatches) return;

        // Sprawdź modyfikatory
        const shiftMatches = config.useShift ? e.shiftKey : !e.shiftKey;
        const ctrlMatches = config.useCtrl ? e.ctrlKey : !e.ctrlKey;
        const altMatches = config.useAlt ? e.altKey : !e.altKey;

        if (shiftMatches && ctrlMatches && altMatches) {
            e.preventDefault();
            e.stopPropagation();
            toggleSetting();
        }
    };

    // Dodaj listener
    document.addEventListener('keydown', keybindListener);
}

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

function init() {
    waitForGame();

    try {
        integrateWithAddonManager();
    } catch (error) {
        console.warn('Addon manager integration failed:', error);
    }
}

// Uruchom gdy strona się załaduje
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Sprawdź interfejs
function getCookie(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    return match ? match[2] : null;
}

if (getCookie('interface') === 'ni') {
    init();
}
})();
