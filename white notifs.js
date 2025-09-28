(function() {
    'use strict';

    // Konfiguracja domyślna
    let config = {
        enabled: true,
        fontSize: 11,
        color: '#ffffff',
        fontFamily: 'Arial'
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

    // Lista dostępnych czcionek
    const fontPresets = {
        'Arial': 'Arial, sans-serif',
        'Times': 'Times New Roman, serif',
        'Courier': 'Courier New, monospace',
        'Verdana': 'Verdana, sans-serif',
        'Georgia': 'Georgia, serif',
        'Comic Sans': 'Comic Sans MS, cursive'
    };

    function saveConfig() {
        try {
            window.localStorage.setItem('notificationStyler_config', JSON.stringify(config));
        } catch (e) {}
    }

    function loadConfig() {
        try {
            const saved = window.localStorage.getItem('notificationStyler_config');
            if (saved) {
                const savedConfig = JSON.parse(saved);
                config = { ...config, ...savedConfig };
            }
        } catch (e) {}
    }

    // Funkcja do rozpoznawania powiadomień systemowych w centrum ekranu
    function isGameNotification(element) {
        const style = element.style.cssText || '';
        const text = element.textContent || '';
        const className = element.className || '';
        
        // WYKLUCZ wszystko co nie powinno być stylowane
        if (
            // Czat i wiadomości
            className.includes('chat') ||
            className.includes('mmp-chatbox') ||
            element.closest('[class*="chat"]') ||
            element.closest('.mmp-chatbox-content') ||
            element.id.includes('chat') ||
            
            // Tooltips i interfejs
            className.includes('tooltip') ||
            className.includes('tip') ||
            className.includes('menu') ||
            className.includes('button') ||
            className.includes('input') ||
            className.includes('select') ||
            
            // Panel ustawień
            element.closest('#kwak-notification-styler-settings-panel') ||
            
            // Elementy UI gry
            element.closest('.mmp-window') ||
            element.closest('[class*="interface"]') ||
            element.closest('[class*="ui-"]')
        ) {
            return false;
        }
        
        // WŁĄCZ tylko powiadomienia systemowe
        const isNotification = (
            // Ma tekst i nie jest za długi (powiadomienia są krótkie)
            text.length > 5 && text.length < 150 &&
            
            // Jest pozycjonowane w centrum lub ma odpowiednie style
            (style.includes('position: fixed') || style.includes('position: absolute')) &&
            
            // Ma odpowiednie frazowania powiadomień
            (text.includes('Wysłano') || 
             text.includes('Otrzymano') || 
             text.includes('Dodano') ||
             text.includes('Usunięto') ||
             text.includes('Zaktualizowano') ||
             text.includes('Błąd') ||
             text.includes('Sukces') ||
             text.includes('Info') ||
             text.includes('Uwaga') ||
             text.includes('zaproszenie') ||
             text.includes('połączenie') ||
             className.includes('notification') ||
             className.includes('alert') ||
             className.includes('message'))
        );
        
        return isNotification;
    }

    // Funkcja stylizująca element
    function applyNotificationStyle(element) {
        if (!config.enabled || !isGameNotification(element)) return;
        
        element.style.setProperty('color', config.color, 'important');
        element.style.setProperty('font-size', config.fontSize + 'px', 'important');
        element.style.setProperty('font-family', fontPresets[config.fontFamily] || 'Arial, sans-serif', 'important');
    }

    // Observer obserwujący tylko nowe elementy
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            if (!config.enabled) return;

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Sprawdź bezpośrednio dodany element
                        setTimeout(() => {
                            applyNotificationStyle(node);
                            
                            // Sprawdź dzieci tylko jeśli to nie są elementy interfejsu
                            if (!node.closest('.mmp-window') && !node.closest('[class*="ui-"]')) {
                                const potentialNotifications = node.querySelectorAll('*');
                                potentialNotifications.forEach(child => {
                                    applyNotificationStyle(child);
                                });
                            }
                        }, 50);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Funkcja wysyłająca testowe powiadomienie identyczne z grą
    function sendTestNotification() {
        const testNotif = document.createElement('div');
        testNotif.textContent = 'Wysłano zaproszenie do testUser.';
        
        // Style identyczne z powiadomieniami Margonem
        testNotif.style.cssText = `
            position: fixed;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid #666;
            border-radius: 4px;
            padding: 10px 20px;
            z-index: 999999;
            text-align: center;
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            pointer-events: none;
        `;
        
        document.body.appendChild(testNotif);
        
        // Zastosuj nasze style
        applyNotificationStyle(testNotif);
        
        // Usuń po 3 sekundach
        setTimeout(() => {
            testNotif.style.opacity = '0';
            testNotif.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                if (testNotif.parentNode) {
                    testNotif.parentNode.removeChild(testNotif);
                }
            }, 300);
        }, 3000);
    }

    // Integracja z Addon Managerem
    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-white_notifs');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#kwak-notification-styler-settings-btn')) {
                clearInterval(checkForManager);
                return;
            }

            let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
            if (addonNameContainer) {
                addSettingsButton(addonNameContainer);
                clearInterval(checkForManager);
            }
        }, 500);

        setTimeout(() => clearInterval(checkForManager), 20000);
    }

    function addSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'kwak-notification-styler-settings-btn';
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

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'kwak-notification-styler-settings-panel';
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
            min-width: 320px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        panel.innerHTML = `
            <div id="notification-styler-panel-header" style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding: 15px 15px 8px 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0;">
                Notification Styler - Ustawienia
            </div>

            <div style="padding: 15px;">
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 4px 0;">
                        <span style="color: #ccc; font-size: 12px;">Włącz stylowanie</span>
                        <label class="kwak-toggle-switch">
                            <input type="checkbox" id="enabled-toggle" ${config.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Rozmiar czcionki:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="font-size-slider" min="8" max="20" value="${config.fontSize}" 
                                   style="flex: 1; accent-color: #4CAF50;">
                            <span id="font-size-value" style="color: #fff; font-size: 12px; min-width: 30px;">${config.fontSize}px</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Kolor tekstu:</label>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                            ${Object.entries(colorPresets).map(([name, color]) => `
                                <div class="color-option" data-color="${color}" 
                                     style="width: 30px; height: 30px; background: ${color}; border: 2px solid ${config.color === color ? '#fff' : '#666'}; 
                                            border-radius: 4px; cursor: pointer; position: relative;" 
                                     title="${name}">
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 6px;">
                            <input type="color" id="custom-color" value="${config.color}" 
                                   style="width: 100%; height: 30px; border: 1px solid #666; background: #333; border-radius: 4px;">
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 6px;">Czcionka:</label>
                        <select id="font-family-select" style="width: 100%; padding: 6px; background: #333; color: #ccc; border: 1px solid #666; border-radius: 4px;">
                            ${Object.entries(fontPresets).map(([name]) => `
                                <option value="${name}" ${config.fontFamily === name ? 'selected' : ''}>${name}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
                    <button id="test-notification-btn" style="flex: 1; padding: 8px 12px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                        Test powiadomienia
                    </button>
                    <button id="close-notification-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                        Zamknij
                    </button>
                </div>
            </div>
        `;

        // Dodaj style przełączników
        if (!document.getElementById('kwak-notification-styler-toggle-styles')) {
            const style = document.createElement('style');
            style.id = 'kwak-notification-styler-toggle-styles';
            style.textContent = `
                .kwak-toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .kwak-toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .kwak-toggle-switch .slider {
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
                .kwak-toggle-switch .slider:before {
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
                .kwak-toggle-switch input:checked + .slider {
                    background-color: #4CAF50;
                    border-color: #4CAF50;
                }
                .kwak-toggle-switch input:checked + .slider:before {
                    transform: translateX(20px);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(panel);

        // Event listenery
        panel.querySelector('#enabled-toggle').addEventListener('change', (e) => {
            e.stopPropagation();
            config.enabled = e.target.checked;
            saveConfig();
        });

        const fontSizeSlider = panel.querySelector('#font-size-slider');
        const fontSizeValue = panel.querySelector('#font-size-value');
        
        fontSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            config.fontSize = size;
            fontSizeValue.textContent = size + 'px';
            saveConfig();
        });

        // Obsługa kolorów preset
        panel.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                config.color = color;
                panel.querySelector('#custom-color').value = color;
                panel.querySelectorAll('.color-option').forEach(opt => {
                    opt.style.border = `2px solid ${opt.dataset.color === color ? '#fff' : '#666'}`;
                });
                saveConfig();
            });
        });

        // Custom color picker
        panel.querySelector('#custom-color').addEventListener('change', (e) => {
            config.color = e.target.value;
            panel.querySelectorAll('.color-option').forEach(opt => {
                opt.style.border = '2px solid #666';
            });
            saveConfig();
        });

        // Font family
        panel.querySelector('#font-family-select').addEventListener('change', (e) => {
            config.fontFamily = e.target.value;
            saveConfig();
        });

        // Test button
        panel.querySelector('#test-notification-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sendTestNotification();
        });

        // Close button
        panel.querySelector('#close-notification-settings').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('kwak-notification-styler-settings-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Inicjalizacja
    function init() {
        loadConfig();
        setupObserver();
        integrateWithAddonManager();
    }

    // Uruchom po załadowaniu DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
