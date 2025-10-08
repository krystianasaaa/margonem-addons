(function() {
    'use strict';

    if (window.miniWidgetsScalerRunning) {
        return;
    }
    window.miniWidgetsScalerRunning = true;

    window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('mini-widgets')) {
            e.preventDefault();
            return false;
        }
    });

    let config = {
        enabled: localStorage.getItem('miniWidgetsEnabled') !== 'false',
        scale: parseFloat(localStorage.getItem('miniWidgetsScale')) || 0.7
    };

    function saveConfig() {
        localStorage.setItem('miniWidgetsEnabled', config.enabled.toString());
        localStorage.setItem('miniWidgetsScale', config.scale.toString());
    }

    function applyScaling() {
        if (!config.enabled) {
            const containers = document.querySelectorAll('.main-buttons-container');
            for(const container of containers) {
                container.style.transform = '';
                container.style.transformOrigin = '';
            }
            return;
        }

        const widgetContainers = document.querySelectorAll('.main-buttons-container');
        for(const container of widgetContainers) {
            const positionClass = Array.from(container.classList).find(c => c.includes('bottom-') || c.includes('top-'));
            if (positionClass) {
                container.style.transform = `scale(${config.scale})`;
                container.style.transformOrigin = positionClass.replace('top-', '').replace('bottom-', '');
            }
        }
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'mini-widgets-settings-panel';
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
            min-width: 400px;
            max-height: 80vh;
            overflow: hidden;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        panel.innerHTML = `
            <div id="mini-widgets-panel-header" style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding: 15px 15px 8px 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0;">
                Custom Widgets Size - Settings
            </div>

            <div style="padding: 15px; max-height: calc(80vh - 60px); overflow-y: auto;">
                <div style="margin-bottom: 20px;">
                    <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 8px;">Skala widgetów: <span id="scale-value" style="color: #e67e22; font-weight: bold;">${Math.round(config.scale * 100)}%</span></span>
                    <input type="range" id="scale-slider" min="30" max="150" step="5" value="${config.scale * 100}" style="width: 100%; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; color: #888; font-size: 10px; margin-top: 5px;">
                        <span>30%</span>
                        <span>100%</span>
                        <span>150%</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 5px;">Dokładna wartość (%):</span>
                    <input type="number" id="scale-input" min="30" max="150" step="1" value="${Math.round(config.scale * 100)}" style="width: 100%; padding: 5px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;">
                    <div style="color: #888; font-size: 10px; margin-top: 5px;">Wprowadź wartość między 30% a 150%</div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
                    <button id="close-mini-widgets-settings" style="flex: 1; padding: 8px 12px; background: #e67e22; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                        Zamknij
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = panel.querySelector('#mini-widgets-panel-header');
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
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
            isDragging = false;
        });

        const slider = panel.querySelector('#scale-slider');
        const input = panel.querySelector('#scale-input');
        const valueDisplay = panel.querySelector('#scale-value');

        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            input.value = value;
            valueDisplay.textContent = `${value}%`;
            config.scale = value / 100;
            saveConfig();
            applyScaling();
        });

        input.addEventListener('input', (e) => {
            let value = parseInt(e.target.value) || 30;
            value = Math.max(30, Math.min(150, value));
            slider.value = value;
            valueDisplay.textContent = `${value}%`;
            config.scale = value / 100;
            saveConfig();
            applyScaling();
        });

        panel.querySelector('#close-mini-widgets-settings').addEventListener('click', (e) => {
            e.preventDefault();
            toggleSettingsPanel();
        });
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('mini-widgets-settings-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'mini-widgets-settings-btn';
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

    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-mini_widgets');

            if (!addonContainer) return;

            if (addonContainer.querySelector('#mini-widgets-settings-btn')) {
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

    function observeWidgets() {
        applyScaling();

        const observer = new MutationObserver(() => {
            applyScaling();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(applyScaling, 1000);
    }

    function init() {
        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }

        observeWidgets();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
