(function() {
    'use strict';

    // Konfiguracja domyślna
    let config = {
        chat: {
            enabled: true,
            fontSize: 11,
            fontFamily: 'Arial'
        },
        bigMessages: {
            enabled: true,
            fontSize: 11,
            color: '#ffffff',
            fontFamily: 'Arial'
        }
    };

    // Rozszerzona lista dostępnych czcionek
    const fontPresets = {
        'Arial': 'Arial, sans-serif',
        'Times New Roman': 'Times New Roman, serif',
        'Courier New': 'Courier New, monospace',
        'Verdana': 'Verdana, sans-serif',
        'Georgia': 'Georgia, serif',
        'Comic Sans MS': 'Comic Sans MS, cursive',
        'Trebuchet MS': 'Trebuchet MS, sans-serif',
        'Impact': 'Impact, fantasy',
        'Palatino': 'Palatino Linotype, serif',
        'Tahoma': 'Tahoma, sans-serif',
        'Lucida Console': 'Lucida Console, monospace',
        'Garamond': 'Garamond, serif',
        'Bookman': 'Bookman Old Style, serif',
        'Arial Black': 'Arial Black, sans-serif',
        'Brush Script': 'Brush Script MT, cursive'
    };

    // Lista dostępnych kolorów
    const colorPresets = {
        'Biały': '#ffffff',
        'Żółty': '#ffff00',
        'Czerwony': '#ff0000',
        'Zielony': '#00ff00',
        'Niebieski': '#0099ff',
        'Pomarańczowy': '#ff9800',
        'Fioletowy': '#9900ff',
        'Różowy': '#ff69b4',
        'Szary': '#cccccc'
    };

    function saveConfig() {
        try {
            const jsonConfig = JSON.stringify(config);
            // Zapisz w zmiennej tymczasowej zamiast localStorage
            window._messageStylerConfig = jsonConfig;
        } catch (e) {
            console.warn('Nie można zapisać konfiguracji');
        }
    }

    function loadConfig() {
        try {
            // Wczytaj z zmiennej tymczasowej
            const saved = window._messageStylerConfig;
            if (saved) {
                const savedConfig = JSON.parse(saved);
                config = { ...config, ...savedConfig };
            }
        } catch (e) {
            console.warn('Nie można wczytać konfiguracji');
        }
    }

    // Funkcja generująca CSS
    function generateCSS() {
        let css = '';

        if (config.chat.enabled) {
            css += `
                .one-message-wrapper {
                    font-size: ${config.chat.fontSize}px !important;
                    font-family: ${fontPresets[config.chat.fontFamily] || 'Arial, sans-serif'} !important;
                }
            `;
        }

        if (config.bigMessages.enabled) {
            css += `
                .big-messages,
                [class*="big-message"] {
                    color: ${config.bigMessages.color} !important;
                    font-size: ${config.bigMessages.fontSize}px !important;
                    font-family: ${fontPresets[config.bigMessages.fontFamily] || 'Arial, sans-serif'} !important;
                }

                .big-messages *:not([style*="color"]),
                [class*="big-message"] *:not([style*="color"]) {
                    color: ${config.bigMessages.color} !important;
                    font-size: ${config.bigMessages.fontSize}px !important;
                    font-family: ${fontPresets[config.bigMessages.fontFamily] || 'Arial, sans-serif'} !important;
                }
            `;
        }

        return css;
    }

    // Funkcja dodająca/aktualizująca CSS
    function updateCSS() {
        let style = document.getElementById('message-styler-css');
        if (!style) {
            style = document.createElement('style');
            style.id = 'message-styler-css';
            document.head.appendChild(style);
        }
        style.textContent = generateCSS();
    }

    // Funkcja integracji z Addon Managerem
    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-notif_styler');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#message-styler-settings-btn')) {
                clearInterval(checkForManager);
                return;
            }

            let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
            if (addonNameContainer) {
                addSettingsButton(addonNameContainer);
                clearInterval(checkForManager);
            }
        }, 500);

        setTimeout(() => {
            clearInterval(checkForManager);
        }, 20000);
    }

    function addSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'message-styler-settings-btn';
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

    // Funkcja testowa Big Message
    function showTestBigMessage() {
        if (typeof message === 'function') {
            message('Test powiadomienia');
        } else {
            console.log('Funkcja message() nie jest dostępna w grze');
        }
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'message-styler-settings-panel';
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
            min-width: 360px;
            max-width: 400px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            max-height: 80vh;
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <div id="message-styler-panel-header" style="color: #fff; font-size: 14px; margin-bottom: 0; text-align: center; font-weight: bold; padding: 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0;">
                Chat&Notifs Styler - Settings
            </div>
            <div style="padding: 15px;">
                <!-- SEKCJA CZATU -->
                <div style="background: #333; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #fff; font-size: 13px; font-weight: bold;">Chat</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="chat-enabled-toggle" ${config.chat.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Rozmiar czcionki:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="chat-font-size-slider" min="8" max="30" value="${config.chat.fontSize}"
                                style="flex: 1; accent-color: #4CAF50;">
                            <span id="chat-font-size-value" style="color: #fff; font-size: 12px; min-width: 35px;">${config.chat.fontSize}px</span>
                        </div>
                    </div>

                    <div>
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Czcionka:</label>
                        <select id="chat-font-family-select" style="width: 100%; padding: 6px; background: #2a2a2a; color: #ccc; border: 1px solid #666; border-radius: 4px;">
                            ${Object.entries(fontPresets).map(([name]) =>
                                `<option value="${name}" ${config.chat.fontFamily === name ? 'selected' : ''}>${name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>

                <!-- SEKCJA BIG MESSAGES -->
                <div style="background: #333; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #fff; font-size: 13px; font-weight: bold;">Powiadomienia</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="big-enabled-toggle" ${config.bigMessages.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Rozmiar czcionki:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="big-font-size-slider" min="8" max="30" value="${config.bigMessages.fontSize}"
                                style="flex: 1; accent-color: #4CAF50;">
                            <span id="big-font-size-value" style="color: #fff; font-size: 12px; min-width: 35px;">${config.bigMessages.fontSize}px</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Czcionka:</label>
                        <select id="big-font-family-select" style="width: 100%; padding: 6px; background: #2a2a2a; color: #ccc; border: 1px solid #666; border-radius: 4px;">
                            ${Object.entries(fontPresets).map(([name]) =>
                                `<option value="${name}" ${config.bigMessages.fontFamily === name ? 'selected' : ''}>${name}</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Kolor tekstu:</label>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px;">
                            ${Object.entries(colorPresets).map(([name, color]) =>
                                `<div class="color-option" data-color="${color}"
                                    style="width: 30px; height: 30px; background: ${color}; border: 2px solid ${config.bigMessages.color === color ? '#fff' : '#666'};
                                    border-radius: 4px; cursor: pointer;" title="${name}"></div>`
                            ).join('')}
                        </div>
                        <input type="color" id="big-custom-color" value="${config.bigMessages.color}"
                            style="width: 100%; height: 30px; border: 1px solid #666; background: #2a2a2a; border-radius: 4px;">
                    </div>

                    <!-- PRZYCISK TESTOWY -->
                    <button id="test-big-message" style="width: 100%; padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                        Test
                    </button>
                </div>

                <!-- PRZYCISKI -->
                <div style="display: flex; gap: 8px; border-top: 1px solid #444; padding-top: 12px;">
                    <button id="close-message-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                        Zamknij
                    </button>
                </div>
            </div>
        `;

        // Dodaj style przełączników
        if (!document.getElementById('message-styler-toggle-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styler-toggle-styles';
            style.textContent = `
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-switch .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #555;
                    transition: 0.3s;
                    border-radius: 24px;
                    border: 1px solid #666;
                }
                .toggle-switch .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                }
                .toggle-switch input:checked + .slider {
                    background-color: #4CAF50;
                    border-color: #4CAF50;
                }
                .toggle-switch input:checked + .slider:before {
                    transform: translateX(20px);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(panel);

        // Funkcjonalność przeciągania
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const header = panel.querySelector('#message-styler-panel-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
            header.style.background = '#444';
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
            if (isDragging) {
                isDragging = false;
                header.style.background = '#333';
            }
        });

        // Event listeners - CZAT
        panel.querySelector('#chat-enabled-toggle').addEventListener('change', (e) => {
            config.chat.enabled = e.target.checked;
            updateCSS();
            saveConfig();
        });

        const chatFontSizeSlider = panel.querySelector('#chat-font-size-slider');
        const chatFontSizeValue = panel.querySelector('#chat-font-size-value');
        chatFontSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            config.chat.fontSize = size;
            chatFontSizeValue.textContent = size + 'px';
            updateCSS();
            saveConfig();
        });

        panel.querySelector('#chat-font-family-select').addEventListener('change', (e) => {
            config.chat.fontFamily = e.target.value;
            updateCSS();
            saveConfig();
        });

        // Event listeners - BIG MESSAGES
        panel.querySelector('#big-enabled-toggle').addEventListener('change', (e) => {
            config.bigMessages.enabled = e.target.checked;
            updateCSS();
            saveConfig();
        });

        const bigFontSizeSlider = panel.querySelector('#big-font-size-slider');
        const bigFontSizeValue = panel.querySelector('#big-font-size-value');
        bigFontSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            config.bigMessages.fontSize = size;
            bigFontSizeValue.textContent = size + 'px';
            updateCSS();
            saveConfig();
        });

        panel.querySelector('#big-font-family-select').addEventListener('change', (e) => {
            config.bigMessages.fontFamily = e.target.value;
            updateCSS();
            saveConfig();
        });

        // Obsługa kolorów preset
        panel.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                config.bigMessages.color = color;
                panel.querySelector('#big-custom-color').value = color;
                panel.querySelectorAll('.color-option').forEach(opt => {
                    opt.style.border = `2px solid ${opt.dataset.color === color ? '#fff' : '#666'}`;
                });
                updateCSS();
                saveConfig();
            });
        });

        // Custom color picker
        panel.querySelector('#big-custom-color').addEventListener('change', (e) => {
            config.bigMessages.color = e.target.value;
            panel.querySelectorAll('.color-option').forEach(opt => {
                opt.style.border = '2px solid #666';
            });
            updateCSS();
            saveConfig();
        });

        // Przycisk testowy
        panel.querySelector('#test-big-message').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showTestBigMessage();
        });

        // Close button
        panel.querySelector('#close-message-settings').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('message-styler-settings-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Inicjalizacja
    function init() {
        loadConfig();
        updateCSS();
        integrateWithAddonManager();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
