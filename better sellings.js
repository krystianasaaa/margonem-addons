(function() {
    'use strict';

    
    const defaultSettings = {
        key1: 'Digit1',
        key2: 'Digit2',
        key3: 'Digit3',
        acceptKey: 'Enter',
        mode: 'auto', // 'auto' lub 'manual'
        delay: 100
    };

    let settings = {};
    let isConfiguring = false;
    let settingsPanel = null;

    // Ładowanie ustawień
    function loadSettings() {
        settings = {
            key1: GM_getValue('key1', defaultSettings.key1),
            key2: GM_getValue('key2', defaultSettings.key2),
            key3: GM_getValue('key3', defaultSettings.key3),
            acceptKey: GM_getValue('acceptKey', defaultSettings.acceptKey),
            mode: GM_getValue('mode', defaultSettings.mode),
            delay: GM_getValue('delay', defaultSettings.delay)
        };
    }

    // Zapisywanie ustawień
    function saveSettings() {
        GM_setValue('key1', settings.key1);
        GM_setValue('key2', settings.key2);
        GM_setValue('key3', settings.key3);
        GM_setValue('acceptKey', settings.acceptKey);
        GM_setValue('mode', settings.mode);
        GM_setValue('delay', settings.delay);
    }

    // Konwersja kodu klawisza na czytelną nazwę
    function keyCodeToName(code) {
        const keyNames = {
            'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
            'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
            'Numpad1': 'Num1', 'Numpad2': 'Num2', 'Numpad3': 'Num3', 'Numpad4': 'Num4',
            'Numpad5': 'Num5', 'Numpad6': 'Num6', 'Numpad7': 'Num7', 'Numpad8': 'Num8',
            'Numpad9': 'Num9', 'Numpad0': 'Num0',
            'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E', 'KeyR': 'R', 'KeyT': 'T',
            'KeyY': 'Y', 'KeyU': 'U', 'KeyI': 'I', 'KeyO': 'O', 'KeyP': 'P',
            'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G',
            'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L',
            'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B',
            'KeyN': 'N', 'KeyM': 'M',
            'Enter': 'Enter', 'Space': 'Space', 'Tab': 'Tab',
            'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4', 'F5': 'F5',
            'F6': 'F6', 'F7': 'F7', 'F8': 'F8', 'F9': 'F9', 'F10': 'F10',
            'F11': 'F11', 'F12': 'F12'
        };
        return keyNames[code] || code;
    }

    // Tworzenie panelu ustawień
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.92);
                border: 1px solid #333;
                border-radius: 8px;
                padding: 18px;
                z-index: 999999;
                color: #ffffff;
                font-family: Arial, sans-serif;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
                min-width: 280px;
                max-width: 320px;
                backdrop-filter: blur(5px);
            ">
                <h4 style="
                    margin: 0 0 15px 0;
                    text-align: center;
                    color: #fff;
                    font-size: 15px;
                    font-weight: bold;
                ">⚙️ Konfiguracja sprzedaży</h4>

                <!-- Wybór trybu -->
                <div style="margin-bottom: 15px; padding: 10px; background: #111; border-radius: 6px; border: 1px solid #333;">
                    <div style="margin-bottom: 8px; font-size: 12px; color: #ccc; font-weight: bold;" Tryb pracy:</div>
                    <div style="display: flex; gap: 8px;">
                        <label style="flex: 1; display: flex; align-items: center; cursor: pointer; font-size: 11px;">
                            <input type="radio" name="mode" value="auto" ${settings.mode === 'auto' ? 'checked' : ''} style="margin-right: 6px;">
                            <span style="color: #27ae60;"> Auto</span>
                        </label>
                        <label style="flex: 1; display: flex; align-items: center; cursor: pointer; font-size: 11px;">
                            <input type="radio" name="mode" value="manual" ${settings.mode === 'manual' ? 'checked' : ''} style="margin-right: 6px;">
                            <span style="color: #3498db;"> Manual</span>
                        </label>
                    </div>
                    <div style="margin-top: 6px; font-size: 10px; color: #666; line-height: 1.3;">
                        <div id="mode-description">
                            ${settings.mode === 'auto'
                                ? '• Jeden klawisz wybiera i sprzedaje automatycznie'
                                : '• Klawisz wybiera torbę, Enter akceptuje sprzedaż'}
                        </div>
                    </div>
                </div>

                <!-- Klawisze -->
                <div style="display: grid; grid-template-columns: 70px 1fr; gap: 6px; align-items: center; margin-bottom: 12px;">
                    <label style="font-size: 12px; color: #ccc;">Torba 1:</label>
                    <input type="text" id="key1-input" readonly style="
                        padding: 4px 8px;
                        background: #222;
                        border: 1px solid #444;
                        border-radius: 4px;
                        color: #fff;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        width: 100%;
                        box-sizing: border-box;
                    " value="${keyCodeToName(settings.key1)}">

                    <label style="font-size: 12px; color: #ccc;">Torba 2:</label>
                    <input type="text" id="key2-input" readonly style="
                        padding: 4px 8px;
                        background: #222;
                        border: 1px solid #444;
                        border-radius: 4px;
                        color: #fff;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        width: 100%;
                        box-sizing: border-box;
                    " value="${keyCodeToName(settings.key2)}">

                    <label style="font-size: 12px; color: #ccc;">Torba 3:</label>
                    <input type="text" id="key3-input" readonly style="
                        padding: 4px 8px;
                        background: #222;
                        border: 1px solid #444;
                        border-radius: 4px;
                        color: #fff;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        width: 100%;
                        box-sizing: border-box;
                    " value="${keyCodeToName(settings.key3)}">
                </div>

                <!-- Klawisz akceptacji (tylko w trybie manual) -->
                <div id="accept-key-row" style="display: ${settings.mode === 'manual' ? 'grid' : 'none'}; grid-template-columns: 70px 1fr; gap: 6px; align-items: center; margin-bottom: 12px;">
                    <label style="font-size: 12px; color: #ccc;">Akceptuj:</label>
                    <input type="text" id="accept-input" readonly style="
                        padding: 4px 8px;
                        background: #222;
                        border: 1px solid #444;
                        border-radius: 4px;
                        color: #fff;
                        text-align: center;
                        font-size: 12px;
                        cursor: pointer;
                        width: 100%;
                        box-sizing: border-box;
                    " value="${keyCodeToName(settings.acceptKey)}">
                </div>

                <!-- Opóźnienie (tylko w trybie auto) -->
                <div id="delay-row" style="display: ${settings.mode === 'auto' ? 'grid' : 'none'}; grid-template-columns: 70px 1fr; gap: 6px; align-items: center; margin-bottom: 12px;">
                    <label style="font-size: 12px; color: #ccc;">Opóźnienie:</label>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="number" id="delay-input" style="
                            padding: 4px 8px;
                            background: #222;
                            border: 1px solid #444;
                            border-radius: 4px;
                            color: #fff;
                            text-align: center;
                            font-size: 12px;
                            width: 70px;
                        " value="${settings.delay}" min="50" max="1000" step="10">
                        <span style="font-size: 11px; color: #666;">ms</span>
                    </div>
                </div>

                <div style="text-align: center; margin: 8px 0; font-size: 11px; color: #999;">
                    Kliknij pole i naciśnij klawisz
                </div>

                <div style="text-align: center; margin-top: 15px;">
                    <button id="save-settings" style="
                        background: #27ae60;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        margin-right: 8px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">✓ Zapisz</button>

                    <button id="cancel-settings" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">✗ Anuluj</button>
                </div>
            </div>
        `;

        return panel;
    }

    // Dodanie ikony ustawień do sklepu
    function addManagerSettingsButton(container) {
    const helpIcon = container.querySelector('.kwak-addon-help-icon');
    if (!helpIcon) return;

    const settingsBtn = document.createElement('span');
    settingsBtn.id = 'kwak-shop-hotkey-settings-btn';
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
    panel.id = 'kwak-shop-hotkey-settings-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.92);
        border: 1px solid #333;
        border-radius: 8px;
        padding: 0;
        z-index: 10000;
        display: none;
        min-width: 300px;
        max-width: 340px;
        font-family: Arial, sans-serif;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    `;

    panel.innerHTML = `
        <div id="shop-hotkey-panel-header" style="
            color: #fff; 
            font-size: 15px; 
            margin-bottom: 0; 
            text-align: center; 
            font-weight: bold; 
            padding: 15px 15px 15px 15px; 
            border-bottom: 1px solid #444; 
            cursor: move; 
            user-select: none; 
            background: #333; 
            border-radius: 8px 8px 0 0;
        ">
            Konfiguracja Shop Hotkey
        </div>

        <div style="padding: 18px;">
            <!-- Wybór trybu -->
            <div style="margin-bottom: 15px; padding: 10px; background: #111; border-radius: 6px; border: 1px solid #333;">
                <div style="margin-bottom: 8px; font-size: 12px; color: #ccc; font-weight: bold;">Tryb pracy:</div>
                <div style="display: flex; gap: 8px;">
                    <label style="flex: 1; display: flex; align-items: center; cursor: pointer; font-size: 11px;">
                        <input type="radio" name="mode" value="auto" ${settings.mode === 'auto' ? 'checked' : ''} style="margin-right: 6px;">
                        <span style="color: #27ae60;">Auto</span>
                    </label>
                    <label style="flex: 1; display: flex; align-items: center; cursor: pointer; font-size: 11px;">
                        <input type="radio" name="mode" value="manual" ${settings.mode === 'manual' ? 'checked' : ''} style="margin-right: 6px;">
                        <span style="color: #3498db;">Manual</span>
                    </label>
                </div>
                <div style="margin-top: 6px; font-size: 10px; color: #666; line-height: 1.3;">
                    <div id="mode-description-manager">
                        ${settings.mode === 'auto'
                            ? 'Jeden klawisz wybiera i sprzedaje automatycznie'
                            : 'Klawisz wybiera torbę, Enter akceptuje sprzedaż'}
                    </div>
                </div>
            </div>

            <!-- Klawisze -->
            <div style="display: grid; grid-template-columns: 70px 1fr; gap: 8px; align-items: center; margin-bottom: 15px;">
                <label style="font-size: 12px; color: #ccc; font-weight: bold;">Torba 1:</label>
                <input type="text" id="key1-input-manager" readonly style="
                    padding: 6px 10px;
                    background: #222;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    cursor: pointer;
                    width: 100%;
                    box-sizing: border-box;
                    transition: all 0.2s;
                " value="${keyCodeToName(settings.key1)}">

                <label style="font-size: 12px; color: #ccc; font-weight: bold;">Torba 2:</label>
                <input type="text" id="key2-input-manager" readonly style="
                    padding: 6px 10px;
                    background: #222;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    cursor: pointer;
                    width: 100%;
                    box-sizing: border-box;
                    transition: all 0.2s;
                " value="${keyCodeToName(settings.key2)}">

                <label style="font-size: 12px; color: #ccc; font-weight: bold;">Torba 3:</label>
                <input type="text" id="key3-input-manager" readonly style="
                    padding: 6px 10px;
                    background: #222;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    cursor: pointer;
                    width: 100%;
                    box-sizing: border-box;
                    transition: all 0.2s;
                " value="${keyCodeToName(settings.key3)}">
            </div>

            <!-- Klawisz akceptacji (tylko w trybie manual) -->
            <div id="accept-key-row-manager" style="display: ${settings.mode === 'manual' ? 'grid' : 'none'}; grid-template-columns: 70px 1fr; gap: 8px; align-items: center; margin-bottom: 15px;">
                <label style="font-size: 12px; color: #ccc; font-weight: bold;">Akceptuj:</label>
                <input type="text" id="accept-input-manager" readonly style="
                    padding: 6px 10px;
                    background: #222;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    cursor: pointer;
                    width: 100%;
                    box-sizing: border-box;
                    transition: all 0.2s;
                " value="${keyCodeToName(settings.acceptKey)}">
            </div>

            <!-- Opóźnienie (tylko w trybie auto) -->
            <div id="delay-row-manager" style="display: ${settings.mode === 'auto' ? 'grid' : 'none'}; grid-template-columns: 70px 1fr; gap: 8px; align-items: center; margin-bottom: 15px;">
                <label style="font-size: 12px; color: #ccc; font-weight: bold;">Opóźnienie:</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="number" id="delay-input-manager" style="
                        padding: 6px 8px;
                        background: #222;
                        border: 1px solid #444;
                        border-radius: 4px;
                        color: #fff;
                        text-align: center;
                        font-size: 12px;
                        width: 80px;
                    " value="${settings.delay}" min="50" max="1000" step="10">
                    <span style="font-size: 11px; color: #666;">ms</span>
                </div>
            </div>

            <div style="text-align: center; margin: 12px 0; font-size: 11px; color: #888; background: #111; padding: 8px; border-radius: 4px;">
                Kliknij pole klawisza i naciśnij wybrany klawisz
            </div>

            <div style="display: flex; gap: 8px; margin-top: 15px; border-top: 1px solid #444; padding-top: 15px;">
                <button id="close-settings-manager" style="
                    flex: 1;
                    background: #666;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: background 0.2s;
                ">Zamknij</button>

                <button id="save-settings-manager" style="
                    flex: 1;
                    background: #27ae60;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: background 0.2s;
                ">Zapisz</button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // *** DRAG FUNCTIONALITY ***
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const header = panel.querySelector('#shop-hotkey-panel-header');
    
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
        
        localStorage.setItem('shopHotkeySettingsPanelPosition', JSON.stringify({x, y}));
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            header.style.background = '#333';
            panel.style.cursor = 'default';
        }
    });

    // Restore saved position
    const savedPosition = JSON.parse(localStorage.getItem('shopHotkeySettingsPanelPosition') || 'null');
    if (savedPosition) {
        panel.style.left = `${savedPosition.x}px`;
        panel.style.top = `${savedPosition.y}px`;
        panel.style.transform = 'none';
    }

    // Event listeners
    setupManagerPanelEvents();
}
function setupManagerPanelEvents() {
    // Mode radio buttons
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            settings.mode = radio.value;
            updateManagerModeDisplay();
        });
    });

    // Key input handlers
    const keyInputs = [
        { id: 'key1-input-manager', setting: 'key1' },
        { id: 'key2-input-manager', setting: 'key2' },
        { id: 'key3-input-manager', setting: 'key3' },
        { id: 'accept-input-manager', setting: 'acceptKey' }
    ];

    keyInputs.forEach(({ id, setting }) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('click', () => {
            input.style.background = '#333';
            input.style.borderColor = '#666';
            input.value = 'Naciśnij...';

            const handler = (e) => {
                e.preventDefault();
                settings[setting] = e.code;
                input.value = keyCodeToName(e.code);
                input.style.background = '#222';
                input.style.borderColor = '#444';
                document.removeEventListener('keydown', handler);
            };

            document.addEventListener('keydown', handler);
        });
    });

    // Delay input
    const delayInput = document.getElementById('delay-input-manager');
    if (delayInput) {
        delayInput.addEventListener('input', () => {
            settings.delay = parseInt(delayInput.value) || 100;
        });
    }

    // Buttons
    document.getElementById('save-settings-manager').addEventListener('click', () => {
        saveSettings();
        toggleManagerSettingsPanel();
    });

    document.getElementById('close-settings-manager').addEventListener('click', () => {
        loadSettings();
        toggleManagerSettingsPanel();
    });

    // ESC key handler
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            const panel = document.getElementById('kwak-shop-hotkey-settings-panel');
            if (panel && panel.style.display !== 'none') {
                loadSettings();
                toggleManagerSettingsPanel();
                document.removeEventListener('keydown', escHandler);
            }
        }
    };
    document.addEventListener('keydown', escHandler);
}
function updateManagerModeDisplay() {
    const acceptRow = document.getElementById('accept-key-row-manager');
    const delayRow = document.getElementById('delay-row-manager');
    const modeDesc = document.getElementById('mode-description-manager');

    if (settings.mode === 'auto') {
        acceptRow.style.display = 'none';
        delayRow.style.display = 'grid';
        modeDesc.innerHTML = 'Jeden klawisz wybiera i sprzedaje automatycznie';
    } else {
        acceptRow.style.display = 'grid';
        delayRow.style.display = 'none';
        modeDesc.innerHTML = 'Klawisz wybiera torbę, Enter akceptuje sprzedaż';
    }
}
function toggleManagerSettingsPanel() {
    const panel = document.getElementById('kwak-shop-hotkey-settings-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

    // Pokazanie panelu ustawień
    function showSettings() {
        if (settingsPanel) return;

        isConfiguring = true;
        settingsPanel = createSettingsPanel();
        document.body.appendChild(settingsPanel);

        // Obsługa zmiany trybu
        const modeRadios = document.querySelectorAll('input[name="mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                settings.mode = radio.value;
                updateModeDisplay();
            });
        });

        function updateModeDisplay() {
            const acceptRow = document.getElementById('accept-key-row');
            const delayRow = document.getElementById('delay-row');
            const modeDesc = document.getElementById('mode-description');

            if (settings.mode === 'auto') {
                acceptRow.style.display = 'none';
                delayRow.style.display = 'grid';
                modeDesc.innerHTML = '• Jeden klawisz wybiera i sprzedaje automatycznie';
            } else {
                acceptRow.style.display = 'grid';
                delayRow.style.display = 'none';
                modeDesc.innerHTML = '• Klawisz wybiera torbę, Enter akceptuje sprzedaż';
            }
        }

        // Obsługa wprowadzania klawiszy
        const keyInputs = [
            { id: 'key1-input', setting: 'key1' },
            { id: 'key2-input', setting: 'key2' },
            { id: 'key3-input', setting: 'key3' },
            { id: 'accept-input', setting: 'acceptKey' }
        ];

        keyInputs.forEach(({ id, setting }) => {
            const input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('click', () => {
                input.style.background = '#333';
                input.style.borderColor = '#666';
                input.value = 'Naciśnij...';

                const handler = (e) => {
                    e.preventDefault();
                    settings[setting] = e.code;
                    input.value = keyCodeToName(e.code);
                    input.style.background = '#222';
                    input.style.borderColor = '#444';
                    document.removeEventListener('keydown', handler);
                };

                document.addEventListener('keydown', handler);
            });
        });

        // Obsługa pola opóźnienia
        const delayInput = document.getElementById('delay-input');
        if (delayInput) {
            delayInput.addEventListener('input', () => {
                settings.delay = parseInt(delayInput.value) || 100;
            });
        }

        // Przyciski zapisz/anuluj
        document.getElementById('save-settings').addEventListener('click', () => {
            saveSettings();
            closeSettings();
            // Odśwież przycisk ustawień
            const oldBtn = document.getElementById('shop-settings-btn');
            if (oldBtn) {
                oldBtn.remove();
                setTimeout(addSettingsButton, 100);
            }
        });

        document.getElementById('cancel-settings').addEventListener('click', () => {
            loadSettings();
            closeSettings();
        });

        // Zamknięcie na ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                loadSettings();
                closeSettings();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Zamknięcie panelu ustawień
    function closeSettings() {
        if (settingsPanel) {
            settingsPanel.remove();
            settingsPanel = null;
        }
        isConfiguring = false;
    }

    // Sprawdzenie czy jesteśmy w sklepie
    function isInShop() {
        return document.querySelector('.shop-content') !== null;
    }

    // Kliknięcie przycisku torby
    function clickQuickSellButton(buttonNumber) {
        if (!isInShop()) return false;

        const buttons = document.querySelectorAll('.great-merchamp .button.btn-num:not(#shop-settings-btn)');

        if (buttons.length >= buttonNumber && buttonNumber > 0) {
            const button = buttons[buttonNumber - 1];
            button.click();
            return true;
        }

        return false;
    }

    // Akceptowanie sprzedaży
    function acceptSale() {
        if (!isInShop()) return false;

        const acceptButton = document.querySelector('.finalize-button .button');
        if (acceptButton) {
            acceptButton.click();
            return true;
        }

        return false;
    }

    // Funkcja szybkiej sprzedaży (tryb auto)
    function quickSellAndAccept(buttonNumber) {
        if (!isInShop()) return false;

        if (clickQuickSellButton(buttonNumber)) {
            setTimeout(() => {
                acceptSale();
            }, settings.delay);
            return true;
        }

        return false;
    }

    // Obsługa klawiszy
    function handleKeyPress(event) {
        if (!isInShop() || isConfiguring) return;

        if (event.target.tagName === 'INPUT' ||
            event.target.tagName === 'TEXTAREA' ||
            event.target.contentEditable === 'true') {
            return;
        }

        let actionPerformed = false;

        if (settings.mode === 'auto') {
            // Tryb automatyczny - jeden klawisz wybiera i sprzedaje
            if (event.code === settings.key1) {
                actionPerformed = quickSellAndAccept(1);
            } else if (event.code === settings.key2) {
                actionPerformed = quickSellAndAccept(2);
            } else if (event.code === settings.key3) {
                actionPerformed = quickSellAndAccept(3);
            }
        } else {
            // Tryb manualny - klawisz wybiera, Enter akceptuje
            if (event.code === settings.key1) {
                actionPerformed = clickQuickSellButton(1);
            } else if (event.code === settings.key2) {
                actionPerformed = clickQuickSellButton(2);
            } else if (event.code === settings.key3) {
                actionPerformed = clickQuickSellButton(3);
            } else if (event.code === settings.acceptKey) {
                actionPerformed = acceptSale();
            }
        }

        if (actionPerformed) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    // Observer do wykrywania otwarcia sklepu
    function checkForShop(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 &&
                        (node.classList?.contains('shop-content') ||
                         node.querySelector?.('.shop-content'))) {
                    }
                });
            }
        });
    }
    function integrateWithAddonManager() {
    const checkForManager = setInterval(() => {
        const addonContainer = document.getElementById('addon-shop_hotkey');
        if (!addonContainer) return;

        if (addonContainer.querySelector('#kwak-shop-hotkey-settings-btn')) {
            clearInterval(checkForManager);
            return;
        }

        let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
        addManagerSettingsButton(addonNameContainer);
        clearInterval(checkForManager);
    }, 500);

    setTimeout(() => {
        clearInterval(checkForManager);
    }, 20000);
}

    // Inicjalizacja
    function init() {
        loadSettings();
        console.log(`Margonem - Sprzedaż załadowana! Tryb: ${settings.mode === 'auto' ? 'Automatyczny' : 'Manualny'}`);

        document.addEventListener('keydown', handleKeyPress);

        const observer = new MutationObserver(checkForShop);
        observer.observe(document.body, { childList: true, subtree: true });
        integrateWithAddonManager();
    }
    

    // Uruchomienie
    function waitForLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    waitForLoad();

})();
