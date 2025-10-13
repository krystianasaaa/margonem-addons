(function() {
    'use strict';

    // Zabezpieczenie przed wielokrotnym uruchomieniem
    if (window.shopHotkeyRunning) {
        return;
    }
    window.shopHotkeyRunning = true;

    const defaultSettings = {
        key1: 'Digit1',
        key2: 'Digit2',
        key3: 'Digit3',
        acceptKey: 'Enter',
        mode: 'auto',
        delay: 100
    };

    let settings = {};
    let isConfiguring = false;
    let settingsPanel = null;

    // Ładowanie ustawień
    function loadSettings() {
        try {
            settings = {
                key1: localStorage.getItem('shopHotkey_key1') || defaultSettings.key1,
                key2: localStorage.getItem('shopHotkey_key2') || defaultSettings.key2,
                key3: localStorage.getItem('shopHotkey_key3') || defaultSettings.key3,
                acceptKey: localStorage.getItem('shopHotkey_acceptKey') || defaultSettings.acceptKey,
                mode: localStorage.getItem('shopHotkey_mode') || defaultSettings.mode,
                delay: parseInt(localStorage.getItem('shopHotkey_delay')) || defaultSettings.delay
            };
        } catch (error) {
            console.error('otkey: Błąd ładowania ustawień:', error);
            settings = {...defaultSettings};
        }
    }

    // Zapisywanie ustawień
    function saveSettings() {
        try {
            localStorage.setItem('shopHotkey_key1', settings.key1);
            localStorage.setItem('shopHotkey_key2', settings.key2);
            localStorage.setItem('shopHotkey_key3', settings.key3);
            localStorage.setItem('shopHotkey_acceptKey', settings.acceptKey);
            localStorage.setItem('shopHotkey_mode', settings.mode);
            localStorage.setItem('shopHotkey_delay', settings.delay.toString());
        } catch (error) {
            console.error('otkey: Błąd zapisywania ustawień:', error);
        }
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
        panel.id = 'shop-hotkey-settings-panel';
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
            min-width: 350px;
            max-height: 80vh;
            overflow: hidden;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        panel.innerHTML = `
            <div id="shop-panel-header" style="
                color: #fff;
                font-size: 14px;
                margin-bottom: 12px;
                text-align: center;
                font-weight: bold;
                padding: 15px 15px 8px 15px;
                border-bottom: 1px solid #444;
                cursor: move;
                user-select: none;
                background: #333;
                border-radius: 4px 4px 0 0;
            ">
                 Shop Hotkey - Settings
            </div>

            <div style="padding: 15px; max-height: calc(80vh - 60px); overflow-y: auto;">
                <!-- Wybór trybu -->
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(157,78,221,0.1); border: 1px solid #7b2cbf; border-radius: 6px;">
                    <div style="margin-bottom: 8px; font-size: 12px; color: #ccc; font-weight: bold;">Tryb pracy:</div>
                    <div style="display: flex; gap: 8px;">
<label style="flex: 1; display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #ccc;">
    <input type="radio" name="mode" value="auto" ${settings.mode === 'auto' ? 'checked' : ''} style="margin-right: 6px;">
    <span style="color: #27ae60;">Auto</span>
</label>
<label style="flex: 1; display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #ccc;">
    <input type="radio" name="mode" value="manual" ${settings.mode === 'manual' ? 'checked' : ''} style="margin-right: 6px;">
    <span style="color: #3498db;">Manual</span>
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

                <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
                    <button id="close-shop-settings" style="
                        flex: 1;
                        padding: 8px 12px;
                        background: #555;
                        color: #ccc;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 11px;
                    ">Zamknij</button>

                    <button id="save-shop-settings" style="
                        flex: 1;
                        padding: 8px 12px;
                        background: #27ae60;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: bold;
                    ">Zapisz</button>
                </div>
            </div>
        `;

        return panel;
    }

    // Dodanie przycisku ustawień do managera
    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'shop-hotkey-settings-btn';
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

        createSettingsPanelElement();

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    // Tworzenie elementu panelu ustawień
    function createSettingsPanelElement() {
        if (document.getElementById('shop-hotkey-settings-panel')) return;

        settingsPanel = createSettingsPanel();
        document.body.appendChild(settingsPanel);

        setupPanelListeners();
        makePanelDraggable();
    }

    // Konfiguracja listenerów panelu
    function setupPanelListeners() {
        if (!settingsPanel) return;

        // Obsługa zmiany trybu
        const modeRadios = settingsPanel.querySelectorAll('input[name="mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                settings.mode = radio.value;
                updateModeDisplay();
            });
        });

        // Obsługa wprowadzania klawiszy
        const keyInputs = [
            { id: 'key1-input', setting: 'key1' },
            { id: 'key2-input', setting: 'key2' },
            { id: 'key3-input', setting: 'key3' },
            { id: 'accept-input', setting: 'acceptKey' }
        ];

        keyInputs.forEach(({ id, setting }) => {
            const input = settingsPanel.querySelector(`#${id}`);
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
        const delayInput = settingsPanel.querySelector('#delay-input');
        if (delayInput) {
            delayInput.addEventListener('input', () => {
                settings.delay = parseInt(delayInput.value) || 100;
            });
        }

        // Przyciski
        settingsPanel.querySelector('#save-shop-settings').addEventListener('click', (e) => {
            e.preventDefault();
            saveSettings();
            toggleSettingsPanel();
        });

        settingsPanel.querySelector('#close-shop-settings').addEventListener('click', (e) => {
            e.preventDefault();
            loadSettings();
            toggleSettingsPanel();
        });

        // Zamknięcie na ESC
        const escHandler = (e) => {
            if (e.key === 'Escape' && settingsPanel.style.display === 'block') {
                loadSettings();
                toggleSettingsPanel();
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Funkcja aktualizacji wyświetlania trybu
    function updateModeDisplay() {
        if (!settingsPanel) return;

        const acceptRow = settingsPanel.querySelector('#accept-key-row');
        const delayRow = settingsPanel.querySelector('#delay-row');
        const modeDesc = settingsPanel.querySelector('#mode-description');

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

    // Funkcja przeciągania panelu
    function makePanelDraggable() {
        if (!settingsPanel) return;

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = settingsPanel.querySelector('#shop-panel-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = settingsPanel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            e.preventDefault();

            header.style.background = '#444';
            settingsPanel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - settingsPanel.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - settingsPanel.offsetHeight);

            settingsPanel.style.left = `${x}px`;
            settingsPanel.style.top = `${y}px`;
            settingsPanel.style.transform = 'none';

            localStorage.setItem('shopHotkeyPanelPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.background = '#333';
                settingsPanel.style.cursor = 'default';
            }
        });

        // Przywróć zapisaną pozycję
        const savedPosition = JSON.parse(localStorage.getItem('shopHotkeyPanelPosition') || 'null');
        if (savedPosition) {
            settingsPanel.style.left = `${savedPosition.x}px`;
            settingsPanel.style.top = `${savedPosition.y}px`;
            settingsPanel.style.transform = 'none';
        }
    }

    // Przełączanie widoczności panelu
    function toggleSettingsPanel() {
        if (!settingsPanel) return;

        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    }

    // Integracja z managerem
    function integrateWithAddonManager() {
        // Czekaj na załadowanie managera i dodatku
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-shop_hotkey');
            if (!addonContainer) return;

            // Sprawdź czy przycisk już istnieje
            if (addonContainer.querySelector('#shop-hotkey-settings-btn')) {
                clearInterval(checkForManager);
                return;
            }

            // Szukaj kontenera z nazwą dodatku
            const addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
            if (addonNameContainer) {
                addManagerSettingsButton(addonNameContainer);
                clearInterval(checkForManager);
            }
        }, 500);

        // Timeout po 30 sekundach
        setTimeout(() => {
            clearInterval(checkForManager);
            console.warn('Shop Hotkey: Nie znaleziono managera dodatków');
        }, 30000);
    }

    // Sprawdzenie czy jesteśmy w sklepie
    function isInShop() {
        return document.querySelector('.shop-content') !== null;
    }

    // Kliknięcie przycisku torby
    function clickQuickSellButton(buttonNumber) {
        if (!isInShop()) return false;

        const buttons = document.querySelectorAll('.great-merchamp .button.btn-num');

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
            if (event.code === settings.key1) {
                actionPerformed = quickSellAndAccept(1);
            } else if (event.code === settings.key2) {
                actionPerformed = quickSellAndAccept(2);
            } else if (event.code === settings.key3) {
                actionPerformed = quickSellAndAccept(3);
            }
        } else {
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

    // Inicjalizacja
    function init() {
        loadSettings();

        document.addEventListener('keydown', handleKeyPress);

        // Integracja z managerem
        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }
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
