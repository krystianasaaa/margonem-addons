(function() {
    'use strict';

    if (window.wakeupRunning) {
        return;
    }
    window.wakeupRunning = true;

    let lastStasisValue = null;
    const defaultSoundUrl = 'https://github.com/krystianasaaa/margonem-addons/raw/refs/heads/main/sounds/dog%20sleeping%20meme.mp3';

    let config = {
        customSoundUrl: localStorage.getItem('wakeupCustomSound') || '',
        useCustomSound: localStorage.getItem('wakeupUseCustomSound') === 'true',
        volume: parseFloat(localStorage.getItem('wakeupVolume') || '1.0')
    };

    function saveConfig() {
        localStorage.setItem('wakeupCustomSound', config.customSoundUrl);
        localStorage.setItem('wakeupUseCustomSound', config.useCustomSound.toString());
        localStorage.setItem('wakeupVolume', config.volume.toString());
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

    const styles = `
        .wakeup-settings-modal {
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

        .wakeup-settings-dialog {
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

        .wakeup-settings-header {
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

        .wakeup-settings-header h3 {
            margin: 0;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            flex: 1;
        }

        .wakeup-settings-close {
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

        .wakeup-settings-close:hover {
            color: #fff;
        }

        .wakeup-settings-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }

        .wakeup-settings-content::-webkit-scrollbar {
            width: 8px;
        }

        .wakeup-settings-content::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .wakeup-settings-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        .wakeup-settings-content::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .wakeup-setting-group {
            margin-bottom: 15px;
            background: #333;
            border: 1px solid #444;
            border-radius: 3px;
            padding: 12px;
        }

        .wakeup-setting-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            font-weight: normal;
            color: #ccc;
            font-size: 12px;
        }

        .wakeup-checkbox {
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

        .wakeup-checkbox:hover {
            border-color: #4CAF50;
        }

        .wakeup-checkbox:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .wakeup-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .wakeup-setting-description {
            font-size: 10px;
            color: #888;
            margin-top: 5px;
            line-height: 1.4;
        }

        .wakeup-input {
            width: 100%;
            padding: 8px;
            background: #555;
            border: 1px solid #666;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
            box-sizing: border-box;
        }

        .wakeup-input:focus {
            outline: none;
            border-color: #888;
        }

        .wakeup-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .wakeup-slider-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
        }

        .wakeup-slider {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            border-radius: 3px;
            background: #555;
            outline: none;
        }

        .wakeup-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
            transition: background 0.2s;
        }

        .wakeup-slider::-webkit-slider-thumb:hover {
            background: #45a049;
        }

        .wakeup-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
            border: none;
            transition: background 0.2s;
        }

        .wakeup-slider::-moz-range-thumb:hover {
            background: #45a049;
        }

        .wakeup-volume-value {
            min-width: 40px;
            text-align: center;
            color: #ccc;
            font-size: 12px;
        }

        .wakeup-buttons {
            display: flex;
            gap: 8px;
            padding: 12px 15px;
            background: #2a2a2a;
            border-radius: 0 0 4px 4px;
            border-top: 1px solid #444;
            flex-shrink: 0;
        }

        .wakeup-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: background 0.2s;
            flex: 1;
        }

        .wakeup-btn-primary {
            background: #5865F2;
            color: white;
        }

        .wakeup-btn-primary:hover {
            background: #4752C4;
        }

        .wakeup-btn-test {
            background: #FFA500;
            color: white;
        }

        .wakeup-btn-test:hover {
            background: #FF8C00;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    function showSettingsDialog() {
        const existingModal = document.querySelector('.wakeup-settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'wakeup-settings-modal';

        modal.innerHTML = `
            <div class="wakeup-settings-dialog">
                <div class="wakeup-settings-header" id="wakeup-header">
                    <h3>Wake up! - Ustawienia</h3>
                    <button class="wakeup-settings-close" id="wakeup-close">×</button>
                </div>

                <div class="wakeup-settings-content">
                    <div class="wakeup-setting-group">
                        <label class="wakeup-setting-label">
                            Głośność
                        </label>
                        <div class="wakeup-slider-container">
                            <input type="range" class="wakeup-slider" id="wakeup-volume" 
                                   min="0" max="1" step="0.1" value="${config.volume}">
                            <span class="wakeup-volume-value" id="wakeup-volume-value">${Math.round(config.volume * 100)}%</span>
                        </div>
                    </div>

                    <div class="wakeup-setting-group">
                        <label class="wakeup-setting-label">
                            <input type="checkbox" class="wakeup-checkbox" id="wakeup-use-custom" ${config.useCustomSound ? 'checked' : ''}>
                            <span>Użyj własnego dźwięku</span>
                        </label>
                        <div class="wakeup-setting-description" style="margin-bottom: 8px;">
                            Wklej URL do własnego pliku dźwiękowego (mp3, wav, ogg)
                        </div>
                        <input type="text" class="wakeup-input" id="wakeup-custom-url" 
                               placeholder="https://example.com/sound.mp3"
                               value="${config.customSoundUrl}"
                               ${!config.useCustomSound ? 'disabled' : ''}>
                        <div class="wakeup-setting-description" style="margin-top: 8px;">
                            Przykład: https://www.myinstants.com/media/sounds/example.mp3
                        </div>
                    </div>

                    <div class="wakeup-setting-group">
                        <button class="wakeup-btn wakeup-btn-test" id="wakeup-test">
                            🔊 Testuj dźwięk
                        </button>
                    </div>
                </div>

                <div class="wakeup-buttons">
                    <button class="wakeup-btn wakeup-btn-primary" id="wakeup-save">Zapisz</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Przeciąganie okna
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.wakeup-settings-dialog');
        const header = modal.querySelector('#wakeup-header');

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
        document.getElementById('wakeup-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Obsługa głośności
        const volumeSlider = document.getElementById('wakeup-volume');
        const volumeValue = document.getElementById('wakeup-volume-value');

        volumeSlider.addEventListener('input', (e) => {
            volumeValue.textContent = Math.round(e.target.value * 100) + '%';
        });

        // Obsługa własnego dźwięku
        const useCustomCheckbox = document.getElementById('wakeup-use-custom');
        const customUrlInput = document.getElementById('wakeup-custom-url');

        useCustomCheckbox.addEventListener('change', (e) => {
            customUrlInput.disabled = !e.target.checked;
        });

        // Test dźwięku
        document.getElementById('wakeup-test').addEventListener('click', () => {
            const useCustom = document.getElementById('wakeup-use-custom').checked;
            const customUrl = document.getElementById('wakeup-custom-url').value.trim();
            const volume = parseFloat(document.getElementById('wakeup-volume').value);

            const testUrl = (useCustom && customUrl) ? customUrl : defaultSoundUrl;
            
            try {
                const audio = new Audio(testUrl);
                audio.volume = volume;
                audio.play().catch(err => {
                    showNotification('Nie można odtworzyć dźwięku: ' + err.message, 'error');
                });
                showNotification('Odtwarzanie dźwięku testowego...', 'info');
            } catch (e) {
                showNotification('Błąd odtwarzania: ' + e.message, 'error');
            }
        });

        // Zapisz
        document.getElementById('wakeup-save').addEventListener('click', () => {
            config.useCustomSound = document.getElementById('wakeup-use-custom').checked;
            config.customSoundUrl = document.getElementById('wakeup-custom-url').value.trim();
            config.volume = parseFloat(document.getElementById('wakeup-volume').value);

            saveConfig();
            showNotification('Ustawienia zapisane!', 'success');
            modal.remove();
        });
    }

    function playSound() {
        try {
            const soundUrl = (config.useCustomSound && config.customSoundUrl) 
                ? config.customSoundUrl 
                : defaultSoundUrl;

            const audio = new Audio(soundUrl);
            audio.volume = config.volume;
            audio.play().catch(err => {
                console.error('Nie można odtworzyć dźwięku:', err);
            });
        } catch (e) {
            console.error('Błąd odtwarzania dźwięku:', e);
        }
    }

    function waitForEngine() {
        if (typeof Engine === 'undefined' ||
            !Engine.hero ||
            !Engine.hero.d ||
            typeof Engine.hero.d.stasis_incoming_seconds === 'undefined') {
            setTimeout(waitForEngine, 500);
            return;
        }
        startStasisCheck();
    }

    function startStasisCheck() {
        setInterval(function() {
            try {
                const stasisValue = Engine.hero.d.stasis_incoming_seconds;
                if (stasisValue !== lastStasisValue) {
                    if (stasisValue > 0 && (lastStasisValue === null || lastStasisValue === 0)) {
                        playSound();
                    }
                    lastStasisValue = stasisValue;
                }
            } catch (e) {
                console.error('Błąd sprawdzania stasis:', e);
            }
        }, 200);
    }

    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'wakeup-settings-btn';
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
            const addonContainer = document.getElementById('addon-wakeup');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#wakeup-settings-btn')) {
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
        waitForEngine();

        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function getCookie(name) {
        const regex = new RegExp(`(^| )${name}=([^;]+)`);
        const match = document.cookie.match(regex);
        return match ? match[2] : null;
    }

    if (getCookie('interface') === 'ni') {
        init();
    }
})();
