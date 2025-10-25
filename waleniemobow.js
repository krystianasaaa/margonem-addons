// ==UserScript==
// @name         Margonem - Toggle Agresywności z Bindem
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Bind klawisza do włączania/wyłączania agresywności mobów + przycisk do zmiany klawisza
// @author       You
// @match        https://*.margonem.pl/
// @match        https://*.margonem.com/
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    let TOGGLE_KEY = GM_getValue('aggro_bind_key', 'KeyO');
    let isWaitingForKey = false;

    // Funkcja do znalezienia checkboxa
    function findAggroCheckbox() {
        return document.getElementById('settings_34_v');
    }

    // Funkcja do znalezienia diva
    function findAggroDiv() {
        const checkbox = findAggroCheckbox();
        if (checkbox) {
            return checkbox.closest('.checkbox-custom');
        }
        return null;
    }

    // Funkcja do znalezienia ikony konfiguracji (otwiera panel)
    function findConfigButton() {
        const icons = document.querySelectorAll('.icon.config');
        for (let icon of icons) {
            const button = icon.closest('.widget-button, button, .bck');
            if (button) return button;
        }
        return null;
    }

    // Funkcja do znalezienia panelu konfiguracji
    function findConfigPanel() {
        return document.querySelector('.settings-window, .border-window');
    }

    // Funkcja do znalezienia i kliknięcia przycisku zamknięcia
    function findAndClickCloseButton() {
        const closeButton = document.querySelector('button.close-button[tip-id="744"]');
        if (closeButton) {
            closeButton.click();
            return true;
        }
        return false;
    }

    // GŁÓWNA FUNKCJA - przełączanie agresywności
    function toggleAggro() {
        let checkbox = findAggroCheckbox();
        const wasPanelOpen = !!checkbox;

        if (!checkbox) {
            // Panel zamknięty - otwórz go NIEWIDOCZNIE
            const configBtn = findConfigButton();
            if (!configBtn) {
                showNotification('❌ Nie znaleziono panelu konfiguracji!', 'error');
                return;
            }

            // Kliknij w konfigurację
            configBtn.click();

            // Czekaj aż panel i przycisk zamknięcia się załadują
            const checkInterval = setInterval(() => {
                const panel = findConfigPanel();
                checkbox = findAggroCheckbox();
                const closeButton = document.querySelector('button.close-button[tip-id="744"]');

                if (panel && checkbox && closeButton) {
                    clearInterval(checkInterval);

                    // Ukryj panel NATYCHMIAST
                    panel.style.visibility = 'hidden';
                    panel.style.opacity = '0';

                    // Przełącz checkbox
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    checkbox.dispatchEvent(new Event('input', { bubbles: true }));
                    checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

                    const status = checkbox.checked ? 'WŁĄCZONA ✓' : 'WYŁĄCZONA ✗';
                    showNotification(`Agresywność: ${status}`, 'success');

                    // Kliknij przycisk zamknięcia NATYCHMIAST
                    closeButton.click();
                }
            }, 10); // Sprawdzaj co 10ms

            // Timeout - jeśli nie załaduje się w 2 sekundy
            setTimeout(() => {
                clearInterval(checkInterval);
            }, 2000);
        } else {
            // Panel już otwarty - po prostu przełącz
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            const status = checkbox.checked ? 'WŁĄCZONA ✓' : 'WYŁĄCZONA ✗';
            showNotification(`Agresywność: ${status}`, 'success');
        }
    }

    // Funkcja do dodania przycisku bind
    function addBindButton() {
        const aggroDiv = findAggroDiv();
        if (!aggroDiv || aggroDiv.querySelector('.bind-button')) return;

        const bindButton = document.createElement('button');
        bindButton.className = 'bind-button';
        bindButton.textContent = `[${getKeyName(TOGGLE_KEY)}]`;
        bindButton.title = 'Kliknij aby zmienić klawisz';
        bindButton.style.cssText = `
            margin-left: 10px;
            padding: 2px 8px;
            background: #2a2a2a;
            border: 1px solid #0f0;
            color: #0f0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-family: monospace;
        `;

        bindButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startKeyBinding(bindButton);
        });

        const label = aggroDiv.querySelector('.c-checkbox__label');
        if (label) {
            label.appendChild(bindButton);
        }
    }

    // Funkcja do rozpoczęcia bindowania klawisza
    function startKeyBinding(button) {
        isWaitingForKey = true;
        button.textContent = '...';
        button.style.background = '#4a4a00';
        showNotification('Naciśnij dowolny klawisz...', 'info');

        const keyHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            TOGGLE_KEY = e.code;
            GM_setValue('aggro_bind_key', TOGGLE_KEY);

            button.textContent = `[${getKeyName(TOGGLE_KEY)}]`;
            button.style.background = '#2a2a2a';
            isWaitingForKey = false;

            showNotification(`Klawisz ustawiony: ${getKeyName(TOGGLE_KEY)}`, 'success');

            document.removeEventListener('keydown', keyHandler, true);
        };

        document.addEventListener('keydown', keyHandler, true);
    }

    // Funkcja do czytelnej nazwy klawisza
    function getKeyName(code) {
        const keyMap = {
            'Space': 'SPACJA',
            'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E',
            'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J',
            'KeyK': 'K', 'KeyL': 'L', 'KeyM': 'M', 'KeyN': 'N', 'KeyO': 'O',
            'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R', 'KeyS': 'S', 'KeyT': 'T',
            'KeyU': 'U', 'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X', 'KeyY': 'Y', 'KeyZ': 'Z',
            'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4', 'F5': 'F5',
            'F6': 'F6', 'F7': 'F7', 'F8': 'F8', 'F9': 'F9', 'F10': 'F10',
            'F11': 'F11', 'F12': 'F12'
        };
        return keyMap[code] || code;
    }

    // Funkcja do wyświetlania powiadomienia (NOWY STYL)
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

        // Dodaj animację jeśli jeszcze nie istnieje
        if (!document.getElementById('aggro-notification-style')) {
            const style = document.createElement('style');
            style.id = 'aggro-notification-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Nasłuchiwanie klawisza
    document.addEventListener('keydown', (e) => {
        if (isWaitingForKey) return;

        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.code === TOGGLE_KEY) {
            e.preventDefault();
            toggleAggro();
        }
    });

    // Obserwuj zmiany w DOM aby dodać przycisk gdy panel się otworzy
    const observer = new MutationObserver(() => {
        addBindButton();
    });

    // Inicjalizacja
    function init() {

        setTimeout(addBindButton, 1000);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
