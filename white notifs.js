(function() {
    'use strict';

    // Konfiguracja domyślna
    let config = {
        chat: {
            enabled: true,
            fontSize: 11,
            fontFamily: 'Arial',
            italic: false,
            bold: false
        },
        bigMessages: {
            enabled: true,
            fontSize: 11,
            color: '#ffffff',
            fontFamily: 'Arial',
            italic: false,
            bold: false,
            rgbEffect: false,
            emoticons: true
        }
    };

    const notificationEmotes = {
        'Brak łupu': {
            prefix: '😭',
            suffix: '😭',
            enabled: true
        },
        'Zdobyłeś:': {
            prefix: '🎉',
            suffix: '🎉',
            enabled: true
        }
    };

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
        'Montserrat': 'Montserrat',
        'Tahoma': 'Tahoma, sans-serif',
        'Lucida Console': 'Lucida Console, monospace',
        'Garamond': 'Garamond, serif',
        'Bookman': 'Bookman Old Style, serif',
        'Arial Black': 'Arial Black, sans-serif',
        'Brush Script': 'Brush Script MT, cursive',
        'Papyrus': 'Papyrus, fantasy',
        'Copperplate': 'Copperplate Gothic, fantasy',
        'Lucida Handwriting': 'Lucida Handwriting, cursive',
        'Chiller': 'Chiller, fantasy',
        'Old English': 'Old English Text MT, serif',
        'Blackadder': 'Blackadder ITC, fantasy',
        'Segoe UI': 'Segoe UI, sans-serif',
        'Calibri': 'Calibri, sans-serif',
        'Century Gothic': 'Century Gothic, sans-serif',
        'Franklin Gothic': 'Franklin Gothic Medium, sans-serif',
        'Book Antiqua': 'Book Antiqua, serif',
        'Baskerville': 'Baskerville Old Face, serif',
        'Consolas': 'Consolas, monospace',
        'Bradley Hand': 'Bradley Hand ITC, cursive',
        'Algerian': 'Algerian, fantasy',
        'Bodoni': 'Bodoni MT, serif',
        'Britannic': 'Britannic Bold, sans-serif',
        'Broadway': 'Broadway, fantasy',
        'Cambria': 'Cambria, serif',
        'Candara': 'Candara, sans-serif',
        'Castellar': 'Castellar, fantasy',
        'Centaur': 'Centaur, serif',
        'Colonna': 'Colonna MT, fantasy',
        'Cooper': 'Cooper Black, fantasy',
        'Corbel': 'Corbel, sans-serif',
        'Curlz': 'Curlz MT, cursive',
        'Didot': 'Didot, serif',
        'Elephant': 'Elephant, fantasy',
        'Engravers': 'Engravers MT, serif',
        'Felix': 'Felix Titling, fantasy',
        'Footlight': 'Footlight MT Light, serif',
        'Forte': 'Forte, cursive',
        'Freestyle': 'Freestyle Script, cursive',
        'French Script': 'French Script MT, cursive',
        'Gabriola': 'Gabriola, cursive',
        'Gill Sans': 'Gill Sans MT, sans-serif',
        'Goudy': 'Goudy Old Style, serif',
        'Haettenschweiler': 'Haettenschweiler, fantasy',
        'Harrington': 'Harrington, cursive',
        'High Tower': 'High Tower Text, serif',
        'Jokerman': 'Jokerman, fantasy',
        'Juice': 'Juice ITC, cursive',
        'Kunstler': 'Kunstler Script, cursive',
        'Lucida Bright': 'Lucida Bright, serif',
        'Lucida Sans': 'Lucida Sans, sans-serif',
        'Magneto': 'Magneto, fantasy',
        'Maiandra': 'Maiandra GD, fantasy',
        'Matura': 'Matura MT Script Capitals, cursive',
        'Mistral': 'Mistral, cursive',
        'Modern': 'Modern No. 20, serif',
        'Monotype Corsiva': 'Monotype Corsiva, cursive',
        'Niagara': 'Niagara Solid, fantasy',
        'OCR A': 'OCR A Extended, monospace',
        'Onyx': 'Onyx, fantasy',
        'Perpetua': 'Perpetua, serif',
        'Playbill': 'Playbill, fantasy',
        'Poor Richard': 'Poor Richard, serif',
        'Ravie': 'Ravie, fantasy',
        'Rockwell': 'Rockwell, serif',
        'Script': 'Script MT Bold, cursive',
        'Showcard': 'Showcard Gothic, fantasy',
        'Snap': 'Snap ITC, fantasy',
        'Stencil': 'Stencil, fantasy',
        'Tempus Sans': 'Tempus Sans ITC, sans-serif',
        'Vivaldi': 'Vivaldi, cursive',
        'Vladimir': 'Vladimir Script, cursive',
        'Wide Latin': 'Wide Latin, fantasy'
    };

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
            localStorage.setItem('messageStylerConfig', jsonConfig);
        } catch (e) {
            console.error('Błąd zapisu konfiguracji:', e);
        }
    }

    function loadConfig() {
        try {
            const saved = localStorage.getItem('messageStylerConfig');
            if (saved) {
                const savedConfig = JSON.parse(saved);
                config = { ...config, ...savedConfig };
            }
        } catch (e) {
            console.error('Błąd wczytywania konfiguracji:', e);
        }
    }

    // NOWE FUNKCJE - Export/Import
    function exportSettings() {
        const settingsData = {
            settings: {
                chat: config.chat,
                bigMessages: config.bigMessages
            }
        };

        const dataStr = JSON.stringify(settingsData, null, 2);

        navigator.clipboard.writeText(dataStr).then(() => {
            showNotification('Ustawienia skopiowane do schowka!', 'success');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = dataStr;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('Ustawienia skopiowane do schowka!', 'success');
        });
    }

    function showImportDialog() {
        const importModal = document.createElement('div');
        importModal.className = 'message-styler-import-modal';
        importModal.innerHTML = `
            <div class="message-styler-import-dialog" id="import-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2a2a2a; border: 1px solid #444; border-radius: 4px; padding: 0; width: 500px; z-index: 10001; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <div class="message-styler-import-header" id="import-header" style="background: #333; padding: 15px; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0; border-bottom: 1px solid #444;">
                    <h3 style="margin: 0; color: #fff; font-size: 14px; font-weight: bold; text-align: center; flex: 1;">Importuj ustawienia</h3>
                    <button class="message-styler-import-close" id="import-close" style="background: none; border: none; color: #888; font-size: 20px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; padding: 0;">×</button>
                </div>
                <div style="padding: 15px;">
                    <div style="margin-bottom: 10px; color: #ccc; font-size: 12px;">
                        Wklej tutaj skopiowany kod z ustawień:
                    </div>
                    <textarea id="import-textarea" style="
                        width: 100%;
                        height: 200px;
                        background: #1a1a1a;
                        border: 1px solid #444;
                        border-radius: 3px;
                        color: #fff;
                        padding: 10px;
                        font-family: 'Courier New', monospace;
                        font-size: 11px;
                        resize: vertical;
                        box-sizing: border-box;
                    " placeholder='{"settings":{...}}'></textarea>
                </div>
                <div style="display: flex; gap: 8px; padding: 12px 15px; background: #2a2a2a; border-radius: 0 0 4px 4px; border-top: 1px solid #444;">
                    <button id="import-confirm" style="flex: 1; padding: 8px 12px; background: #5865F2; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">Importuj</button>
                </div>
            </div>
        `;

        document.body.appendChild(importModal);

        const textarea = document.getElementById('import-textarea');
        textarea.focus();

        // Przeciąganie okna importu
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = document.getElementById('import-dialog');
        const header = document.getElementById('import-header');

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

        document.getElementById('import-close').addEventListener('click', () => {
            importModal.remove();
        });

        document.getElementById('import-close').addEventListener('mouseover', (e) => {
            e.target.style.color = '#fff';
        });

        document.getElementById('import-close').addEventListener('mouseout', (e) => {
            e.target.style.color = '#888';
        });

        document.getElementById('import-confirm').addEventListener('click', () => {
            const code = textarea.value.trim();
            if (!code) {
                showNotification('Pole jest puste!', 'error');
                return;
            }

            if (importSettings(code)) {
                importModal.remove();
            }
        });

        importModal.addEventListener('click', (e) => {
            if (e.target === importModal) {
                importModal.remove();
            }
        });
    }

    function importSettings(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.settings) {
                throw new Error('Nieprawidłowy format - brak sekcji "settings"');
            }

            // Walidacja i importowanie ustawień czatu
            if (data.settings.chat) {
                if (typeof data.settings.chat.enabled === 'boolean') {
                    config.chat.enabled = data.settings.chat.enabled;
                }
                if (typeof data.settings.chat.fontSize === 'number' && data.settings.chat.fontSize >= 8 && data.settings.chat.fontSize <= 30) {
                    config.chat.fontSize = data.settings.chat.fontSize;
                }
                if (typeof data.settings.chat.fontFamily === 'string' && fontPresets[data.settings.chat.fontFamily]) {
                    config.chat.fontFamily = data.settings.chat.fontFamily;
                }
                if (typeof data.settings.chat.italic === 'boolean') {
                    config.chat.italic = data.settings.chat.italic;
                }
                if (typeof data.settings.chat.bold === 'boolean') {
                    config.chat.bold = data.settings.chat.bold;
                }
            }

            // Walidacja i importowanie ustawień powiadomień
            if (data.settings.bigMessages) {
                if (typeof data.settings.bigMessages.enabled === 'boolean') {
                    config.bigMessages.enabled = data.settings.bigMessages.enabled;
                }
                if (typeof data.settings.bigMessages.fontSize === 'number' && data.settings.bigMessages.fontSize >= 8 && data.settings.bigMessages.fontSize <= 30) {
                    config.bigMessages.fontSize = data.settings.bigMessages.fontSize;
                }
                if (typeof data.settings.bigMessages.color === 'string' && /^#[0-9A-F]{6}$/i.test(data.settings.bigMessages.color)) {
                    config.bigMessages.color = data.settings.bigMessages.color;
                }
                if (typeof data.settings.bigMessages.fontFamily === 'string' && fontPresets[data.settings.bigMessages.fontFamily]) {
                    config.bigMessages.fontFamily = data.settings.bigMessages.fontFamily;
                }
                if (typeof data.settings.bigMessages.italic === 'boolean') {
                    config.bigMessages.italic = data.settings.bigMessages.italic;
                }
                if (typeof data.settings.bigMessages.bold === 'boolean') {
                    config.bigMessages.bold = data.settings.bigMessages.bold;
                }
                if (typeof data.settings.bigMessages.rgbEffect === 'boolean') {
                    config.bigMessages.rgbEffect = data.settings.bigMessages.rgbEffect;
                }
                if (typeof data.settings.bigMessages.emoticons === 'boolean') {
                    config.bigMessages.emoticons = data.settings.bigMessages.emoticons;
                }
            }

            saveConfig();
            updateCSS();
            showNotification('Ustawienia zaimportowane pomyślnie!', 'success');

            // Odśwież okno ustawień jeśli jest otwarte
            const panel = document.getElementById('message-styler-settings-panel');
            if (panel && panel.style.display !== 'none') {
                panel.remove();
                createSettingsPanel();
                toggleSettingsPanel();
            }

            return true;
        } catch (error) {
            showNotification('Błąd importu: ' + error.message, 'error');
            return false;
        }
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
            z-index: 10002;
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
        if (!document.getElementById('notification-animation-style')) {
            style.id = 'notification-animation-style';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function generateCSS() {
        let css = `
            body .fading-message-wrapper,
            body .one-message-wrapper,
            #game-window-inner .fading-message-wrapper,
            #game-window-inner .one-message-wrapper {
                font-size: ${config.chat.fontSize}px !important;
                font-family: ${fontPresets[config.chat.fontFamily] || 'Arial, sans-serif'} !important;
                font-style: ${config.chat.italic ? 'italic' : 'normal'} !important;
                font-weight: ${config.chat.bold ? 'bold' : 'normal'} !important;
            }
        `;

        if (config.bigMessages.enabled) {
            if (config.bigMessages.rgbEffect) {
                css += `
                    @keyframes rgb-wave {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 400% 50%; }
                    }

                    .big-messages,
                    [class*="big-message"] {
                        font-size: ${config.bigMessages.fontSize}px !important;
                        font-family: ${fontPresets[config.bigMessages.fontFamily] || 'Arial, sans-serif'} !important;
                        font-style: ${config.bigMessages.italic ? 'italic' : 'normal'} !important;
                        font-weight: ${config.bigMessages.bold ? 'bold' : 'normal'} !important;
                    }

                    .big-messages *:not([style*="color"]):not(span[style]),
                    [class*="big-message"] *:not([style*="color"]):not(span[style]) {
                        background-image: linear-gradient(90deg, #ff4444, #ffaa44, #ffff44, #44ff44, #44ddff, #8844ff, #ff44ff) !important;
                        background-size: 400% 100% !important;
                        -webkit-background-clip: text !important;
                        background-clip: text !important;
                        -webkit-text-fill-color: transparent !important;
                        color: transparent !important;
                        animation: rgb-wave 3s linear infinite !important;
                        font-size: ${config.bigMessages.fontSize}px !important;
                        font-family: ${fontPresets[config.bigMessages.fontFamily] || 'Arial, sans-serif'} !important;
                        font-style: ${config.bigMessages.italic ? 'italic' : 'normal'} !important;
                        font-weight: ${config.bigMessages.bold ? 'bold' : 'normal'} !important;
                    }
                `;
            } else {
                css += `
                    .big-messages,
                    [class*="big-message"] {
                        color: ${config.bigMessages.color} !important;
                        font-size: ${config.bigMessages.fontSize}px !important;
                        font-family: ${fontPresets[config.bigMessages.fontFamily] || 'Arial, sans-serif'} !important;
                        font-style: ${config.bigMessages.italic ? 'italic' : 'normal'} !important;
                        font-weight: ${config.bigMessages.bold ? 'bold' : 'normal'} !important;
                    }

                    .big-messages *:not([style*="color"]):not(i):not(span),
                    [class*="big-message"] *:not([style*="color"]):not(i):not(span) {
                        color: ${config.bigMessages.color} !important;
                        font-size: ${config.bigMessages.fontSize}px !important;
                        font-family: ${fontPresets[config.bigMessages.fontFamily] || 'Arial, sans-serif'} !important;
                        font-style: ${config.bigMessages.italic ? 'italic' : 'normal'} !important;
                        font-weight: ${config.bigMessages.bold ? 'bold' : 'normal'} !important;
                    }
                `;
            }
        }

        return css;
    }

    const originalMessage = window.message;
    if (originalMessage) {
        window.message = function(text) {
            if (config.bigMessages.emoticons) {
                for (const [keyword, emotes] of Object.entries(notificationEmotes)) {
                    if (text.includes(keyword) && emotes.enabled) {
                        text = emotes.prefix + ' ' + text + ' ' + emotes.suffix;
                        break;
                    }
                }
            }
            return originalMessage.call(this, text);
        };
    }

    function updateCSS() {
        let style = document.getElementById('message-styler-css');
        if (!style) {
            style = document.createElement('style');
            style.id = 'message-styler-css';
            document.head.appendChild(style);
        }
        style.textContent = generateCSS();
    }

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

    function showTestBigMessage() {
        if (typeof message === 'function') {
            message('Brak łupu');
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
    overflow: hidden;
    flex-direction: column;
`;

    panel.innerHTML = `
        <div id="message-styler-panel-header" style="color: #fff; font-size: 14px; margin-bottom: 0; text-align: center; font-weight: bold; padding: 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0; flex-shrink: 0;">
            Chat&Notifs Styler - Settings
        </div>

        <!-- ZAKŁADKI -->
        <div style="display: flex; background: #1a1a1a; border-bottom: 1px solid #444; flex-shrink: 0;">
            <button class="message-styler-tab active" data-tab="chat">Chat</button>
            <button class="message-styler-tab" data-tab="notifications">Powiadomienia</button>
        </div>

        <!-- KONTENER NA ZAKŁADKI -->
        <div style="flex: 1; overflow-y: auto; min-height: 0;">
            <!-- ZAKŁADKA: CHAT -->
            <div class="message-styler-tab-content active" data-tab="chat">
                <div style="padding: 15px;">
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

                        <div style="margin-bottom: 12px;">
                            <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Czcionka:</label>
                            <select id="chat-font-family-select" style="width: 100%; padding: 6px; background: #2a2a2a; color: #ccc; border: 1px solid #666; border-radius: 4px;">
                                ${Object.entries(fontPresets).map(([name]) =>
                                    `<option value="${name}" ${config.chat.fontFamily === name ? 'selected' : ''}>${name}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label style="color: #ccc; font-size: 12px;">Kursywa:</label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chat-italic-toggle" ${config.chat.italic ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label style="color: #ccc; font-size: 12px;">Pogrubienie:</label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chat-bold-toggle" ${config.chat.bold ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ZAKŁADKA: POWIADOMIENIA -->
            <div class="message-styler-tab-content" data-tab="notifications">
                <div style="padding: 15px;">
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

                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label style="color: #ccc; font-size: 12px;">Kursywa:</label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="big-italic-toggle" ${config.bigMessages.italic ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label style="color: #ccc; font-size: 12px;">Pogrubienie:</label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="big-bold-toggle" ${config.bigMessages.bold ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 16px;">🌈</span>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="big-rgb-toggle" ${config.bigMessages.rgbEffect ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 16px;">😊</span>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="big-emoticons-toggle" ${config.bigMessages.emoticons ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>

                        <!-- PRZYCISK TESTOWY -->
                        <button id="test-big-message" style="width: 100%; padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                            Test
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- PRZYCISKI NA DOLE -->
        <div style="display: flex; gap: 8px; border-top: 1px solid #444; padding: 12px 15px; flex-wrap: wrap; flex-shrink: 0; background: #2a2a2a; border-radius: 0 0 4px 4px;">
            <button id="export-message-settings" style="flex: 1; padding: 8px 12px; background: #3BA55D; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; min-width: 80px;">
                Eksportuj
            </button>
            <button id="import-message-settings" style="flex: 1; padding: 8px 12px; background: #5865F2; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; min-width: 80px;">
                Importuj
            </button>
            <button id="close-message-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; min-width: 80px;">
                Zamknij
            </button>
        </div>
    `;

    // Dodaj style przełączników, checkboxów i ZAKŁADEK
    if (!document.getElementById('message-styler-toggle-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styler-toggle-styles';
        style.textContent = `
            /* STYLE ZAKŁADEK */
            .message-styler-tab {
                flex: 1;
                padding: 12px;
                background: #1a1a1a;
                border: none;
                border-bottom: 2px solid transparent;
                color: #888;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
                transition: all 0.2s;
            }
            .message-styler-tab:hover {
                background: #252525;
                color: #ccc;
            }
            .message-styler-tab.active {
                background: #2a2a2a;
                color: #5865F2;
                border-bottom-color: #5865F2;
            }
            .message-styler-tab-content {
                display: none;
            }
            .message-styler-tab-content.active {
                display: block;
            }

            /* TOGGLE SWITCH */
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

            /* CHECKBOX */
            .checkbox-container {
                display: inline-block;
                position: relative;
                cursor: pointer;
                user-select: none;
            }
            .checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }
            .checkbox-container .checkmark {
                display: inline-block;
                height: 20px;
                width: 20px;
                background-color: #555;
                border: 1px solid #666;
                border-radius: 4px;
                transition: all 0.3s;
                position: relative;
            }
            .checkbox-container:hover .checkmark {
                background-color: #666;
            }
            .checkbox-container input:checked ~ .checkmark {
                background-color: #4CAF50;
                border-color: #4CAF50;
            }
            .checkbox-container .checkmark:after {
                content: "";
                position: absolute;
                display: none;
                left: 7px;
                top: 3px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            .checkbox-container input:checked ~ .checkmark:after {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(panel);

    // ===== OBSŁUGA ZAKŁADEK =====
    const tabs = panel.querySelectorAll('.message-styler-tab');
    const tabContents = panel.querySelectorAll('.message-styler-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Usuń active ze wszystkich
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Dodaj active do klikniętej
            tab.classList.add('active');
            const targetContent = panel.querySelector(`.message-styler-tab-content[data-tab="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

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

    panel.querySelector('#chat-italic-toggle').addEventListener('change', (e) => {
        config.chat.italic = e.target.checked;
        updateCSS();
        saveConfig();
    });

    panel.querySelector('#chat-bold-toggle').addEventListener('change', (e) => {
        config.chat.bold = e.target.checked;
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

    panel.querySelector('#big-italic-toggle').addEventListener('change', (e) => {
        config.bigMessages.italic = e.target.checked;
        updateCSS();
        saveConfig();
    });

    panel.querySelector('#big-bold-toggle').addEventListener('change', (e) => {
        config.bigMessages.bold = e.target.checked;
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

    // RGB Effect toggle
    panel.querySelector('#big-rgb-toggle').addEventListener('change', (e) => {
        config.bigMessages.rgbEffect = e.target.checked;
        updateCSS();
        saveConfig();
    });

    // Emoticons toggle
    panel.querySelector('#big-emoticons-toggle').addEventListener('change', (e) => {
        config.bigMessages.emoticons = e.target.checked;
        updateCSS();
        saveConfig();
    });

    // Przycisk testowy
    panel.querySelector('#test-big-message').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTestBigMessage();
    });

    // Export button
    panel.querySelector('#export-message-settings').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        exportSettings();
    });

    // Import button
    panel.querySelector('#import-message-settings').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showImportDialog();
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
