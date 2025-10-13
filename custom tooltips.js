(function() {
    'use strict';

    if (window.customTooltipsRunning) {
        return;
    }
    window.customTooltipsRunning = true;

    // Domyślna konfiguracja - BIAŁY jako domyślny
    let config = {
        enabled: localStorage.getItem('customTooltipsEnabled') !== 'false',
        borderColor: localStorage.getItem('customTooltipsBorderColor') || '#ffffff',
        glowColor: localStorage.getItem('customTooltipsGlowColor') || '#e0e0e0',
        textColor: localStorage.getItem('customTooltipsTextColor') || '#ffffff',
        damageColor: localStorage.getItem('customTooltipsDamageColor') || '#cccccc',
        gradientColors: JSON.parse(localStorage.getItem('customTooltipsGradientColors') ||
            '["#ffffff", "#f0f0f0", "#e8e8e8", "#d0d0d0", "#c8c8c8", "#f8f8f8", "#e0e0e0", "#d8d8d8", "#f5f5f5", "#eeeeee"]')
    };

    function saveConfig() {
        localStorage.setItem('customTooltipsEnabled', config.enabled.toString());
        localStorage.setItem('customTooltipsBorderColor', config.borderColor);
        localStorage.setItem('customTooltipsGlowColor', config.glowColor);
        localStorage.setItem('customTooltipsTextColor', config.textColor);
        localStorage.setItem('customTooltipsDamageColor', config.damageColor);
        localStorage.setItem('customTooltipsGradientColors', JSON.stringify(config.gradientColors));
    }

    // NOWE FUNKCJE - Import/Export
    function exportSettings() {
        const settingsData = {
            version: "1.0",
            settings: {
                borderColor: config.borderColor,
                glowColor: config.glowColor,
                textColor: config.textColor,
                damageColor: config.damageColor,
                gradientColors: config.gradientColors
            }
        };

        const dataStr = JSON.stringify(settingsData, null, 2);

        // Kopiuj do schowka
        navigator.clipboard.writeText(dataStr).then(() => {
            showNotification('Ustawienia skopiowane do schowka!', 'success');
        }).catch(() => {
            // Fallback dla starszych przeglądarek
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
        importModal.className = 'custom-tooltips-modal';
        importModal.innerHTML = `
            <div class="custom-tooltips-dialog" style="width: 500px;">
                <div class="custom-tooltips-header">
                    <h3>Importuj ustawienia</h3>
                    <button class="custom-tooltips-close" id="import-close">×</button>
                </div>
                <div style="padding: 15px;">
                    <div class="tooltip-setting-description" style="margin-bottom: 10px; color: #ccc;">
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
                    " placeholder='{"version":"1.0","settings":{...}}'></textarea>
                </div>
                <div class="tooltip-buttons">
                    <button class="tooltip-btn tooltip-btn-secondary" id="import-cancel">Anuluj</button>
                    <button class="tooltip-btn tooltip-btn-primary" id="import-confirm">Importuj</button>
                </div>
            </div>
        `;

        document.body.appendChild(importModal);

        const textarea = document.getElementById('import-textarea');
        textarea.focus();

        document.getElementById('import-close').addEventListener('click', () => {
            importModal.remove();
        });

        document.getElementById('import-cancel').addEventListener('click', () => {
            importModal.remove();
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

            // Walidacja kolorów
            const hexRegex = /^#[0-9A-F]{6}$/i;

            if (data.settings.borderColor && hexRegex.test(data.settings.borderColor)) {
                config.borderColor = data.settings.borderColor;
            }
            if (data.settings.glowColor && hexRegex.test(data.settings.glowColor)) {
                config.glowColor = data.settings.glowColor;
            }
            if (data.settings.textColor && hexRegex.test(data.settings.textColor)) {
                config.textColor = data.settings.textColor;
            }
            if (data.settings.damageColor && hexRegex.test(data.settings.damageColor)) {
                config.damageColor = data.settings.damageColor;
            }

            if (Array.isArray(data.settings.gradientColors) && data.settings.gradientColors.length === 10) {
                const validGradient = data.settings.gradientColors.every(color => hexRegex.test(color));
                if (validGradient) {
                    config.gradientColors = data.settings.gradientColors;
                }
            }

            saveConfig();
            applyTooltipStyles();
            showNotification('Ustawienia zaimportowane pomyślnie!', 'success');

            // Odśwież okno ustawień jeśli jest otwarte
            const modal = document.querySelector('.custom-tooltips-modal');
            if (modal) {
                modal.remove();
                showSettingsDialog();
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
    /* Główne okno modalne - BEZ PRZYCIEMNIENIA TŁA */
    .custom-tooltips-modal {
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

    /* Dialog - CZARNE TŁO, bez przyciemnienia */
    .custom-tooltips-dialog {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 0;
        width: 400px;
        max-width: 90vw;
        max-height: 80vh;
        color: #ccc;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        pointer-events: all;
    }

    /* Nagłówek - SZARY, nie fioletowy */
    .custom-tooltips-header {
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

    .custom-tooltips-header h3 {
        margin: 0;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        flex: 1;
    }

    /* Przycisk zamykania */
    .custom-tooltips-close {
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

    .custom-tooltips-close:hover {
        color: #fff;
    }

    /* Zawartość */
    .custom-tooltips-content {
        overflow-y: auto;
        flex: 1;
        padding: 15px;
        max-height: calc(80vh - 60px);
        scrollbar-width: thin;
        scrollbar-color: #555 #2a2a2a;
    }

    .custom-tooltips-content::-webkit-scrollbar {
        width: 8px;
    }

    .custom-tooltips-content::-webkit-scrollbar-track {
        background: #2a2a2a;
        border-radius: 4px;
    }

    .custom-tooltips-content::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 4px;
    }

    .custom-tooltips-content::-webkit-scrollbar-thumb:hover {
        background: #666;
    }

    /* Grupy ustawień */
    .tooltip-setting-group {
        margin-bottom: 15px;
        background: #333;
        border: 1px solid #444;
        border-radius: 3px;
        padding: 12px;
    }

    /* Etykiety */
    .tooltip-setting-label {
        display: block;
        margin-bottom: 5px;
        font-weight: normal;
        color: #ccc;
        font-size: 12px;
    }

    /* Wrapper inputów kolorów */
    .tooltip-color-input-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    /* Inputy tekstowe */
    .tooltip-color-input {
        flex: 1;
        padding: 5px;
        background: #555;
        border: 1px solid #666;
        border-radius: 3px;
        color: #fff;
        font-size: 11px;
    }

    .tooltip-color-input:focus {
        outline: none;
        border-color: #888;
    }

    /* Color pickery */
    .tooltip-color-picker {
        width: 40px;
        height: 28px;
        border: 1px solid #666;
        border-radius: 3px;
        cursor: pointer;
        background: transparent;
    }

    /* Opisy */
    .tooltip-setting-description {
        font-size: 10px;
        color: #888;
        margin-top: 5px;
        line-height: 1.4;
    }

    /* Siatka gradientów - ZMIENIONA NA PIONOWĄ */
    .tooltip-gradient-inputs {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
    }

    /* Pojedynczy element gradientu */
    .tooltip-gradient-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .tooltip-gradient-item input[type="text"] {
        flex: 1;
        padding: 5px;
        background: #555;
        border: 1px solid #666;
        border-radius: 3px;
        color: #fff;
        font-size: 11px;
    }

    .tooltip-gradient-item input[type="text"]:focus {
        outline: none;
        border-color: #888;
    }

    .tooltip-gradient-item input[type="color"] {
        width: 32px;
        height: 28px;
        border: 1px solid #666;
        border-radius: 3px;
        cursor: pointer;
    }

    .tooltip-gradient-number {
        color: #888;
        font-size: 11px;
        min-width: 20px;
        font-weight: normal;
    }

    /* Przyciski */
    .tooltip-buttons {
        display: flex;
        gap: 8px;
        padding: 12px 15px;
        background: #2a2a2a;
        border-radius: 0 0 4px 4px;
        border-top: 1px solid #444;
        flex-wrap: wrap;
    }

    .tooltip-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
        transition: background 0.2s;
        flex: 1;
        min-width: 100px;
    }

    .tooltip-btn-primary {
        background: #5865F2;
        color: white;
    }

    .tooltip-btn-primary:hover {
        background: #4752C4;
    }

    .tooltip-btn-secondary {
        background: #4e4e4e;
        color: white;
    }

    .tooltip-btn-secondary:hover {
        background: #5a5a5a;
    }

    .tooltip-btn-reset {
        background: #ED4245;
        color: white;
    }

    .tooltip-btn-reset:hover {
        background: #C03537;
    }

    .tooltip-btn-success {
        background: #3BA55D;
        color: white;
    }

    .tooltip-btn-success:hover {
        background: #2D7D46;
    }

    .tooltip-btn-info {
        background: #5865F2;
        color: white;
    }

    .tooltip-btn-info:hover {
        background: #4752C4;
    }

    /* Hidden file input */
    #tooltip-import-file {
        display: none;
    }
`;

    function applyTooltipStyles() {
        const existingStyle = document.getElementById('custom-tooltips-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        if (!config.enabled) return;

        const gradientColorsStr = config.gradientColors.join(', ');

        const tooltipStyles = `
            <style id="custom-tooltips-style">
            /*ANIMOWANE-TIPY*/
            .item-type{text-align:center;}
            .tip-wrapper.normal-tip {box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${config.borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${config.glowColor} 0px 1px 24px -4px !important;}
            .tip-wrapper{box-shadow: 0 0 0 0 #000000, 0 0 0 1px ${config.borderColor}, 0 0 0 2px #000000, 0 0 0 3px #2b272700, 0 0 0 4px rgb(15 15 15 / 0%), 0 0 0 5px rgb(15 15 15 / 0%), 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500;}
            .tip-wrapper .content {padding: 5px;background: rgba(15, 15, 15,.85);word-break: break-word; font-family: 'Montserrat';}
            .tip-wrapper[data-type=t_item] .item-head {border:1px solid #1e1e1e66;border-radius: 2px; background: hsl(0deg 0% 4.87% / 10%);}
            .tip-wrapper[data-type=t_item] .item-head .cl-icon {border: 1px solid rgba(15, 15, 15,.3);}
            .tip-wrapper[data-type=t_item] .item-tip-section {border-bottom: 1px solid rgba(15, 15, 15,.5);}
            .tip-wrapper .content .info-wrapper .nick {color:#79e1c5; font-family: Cinzel; font-size: 11px; text-shadow: 0 0 4px black; border: 1px solid ${config.borderColor};border-radius: 2px;background: ${config.borderColor}20;}
            .tip-wrapper[data-type=t_other] .line {border-bottom:1px solid ${config.borderColor}; background: none;}
            .tip-wrapper[data-item-type=t-leg]{box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${config.borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${config.glowColor} 0px 1px 24px -4px !important; !important;}
            .tip-wrapper[data-type=t_item] .item-head .legendary, .tip-wrapper[data-type=t_item] .item-tip-section .legendary {color: ${config.textColor} !important;text-align: center;font-size: 13px;font-weight: 700; text-shadow: 1px 1px ${config.textColor}42;}
            .tip-wrapper[data-type=t_item] .item-head .item-type{padding-left: 48px !important; margin-left: 0px !important;}
            .tip-wrapper.normal-tip .damage, .tip-wrapper.sticky-tip .damage {color: ${config.damageColor} !important;font-weight: 999;}
            .tip-wrapper[data-type=t_item] .item-tip-section.s-7{color: white; font-weight: 700;}
            .tip-wrapper[data-type=t_item] i.looter{color: ${config.textColor} !important;text-align: center;}
            .tip-wrapper[data-type=t_item] .item-tip-section.s-5{color: ${config.textColor} !important;text-align: center;font-weight: 600;}
            .tip-wrapper[data-item-type=t-upgraded], .tip-wrapper[data-item-type=upgraded]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${config.borderColor}, 0 0 0 2px #111911, 0 0 0 3px #2b2727, 0 0 0 4px #59595a, 0 0 0 5px ${config.textColor}, 0 0 0 6px #5a585b, 0 0 0 7px #2c2625;}
            .tip-wrapper[data-type=t_item] .item-head .upgraded, .tip-wrapper[data-type=t_item] .item-tip-section .upgraded{color: ${config.textColor};}
            .tip-wrapper[data-type=t_item] .prc-icon{width:0px; height:0px !important;}
            .tip-wrapper[data-type=t_item] .item-tip-section.s-9 .value-item{color:white; font-size:10px;}
            .tip-wrapper[data-type=t_item] .item-tip-section.s-9 .lvl-next{float:none;}
            .tip-wrapper[data-type=t_item] .item-tip-section .green{font-size:8px;}
            .tip-wrapper[data-type=t_other] .clan-in-tip{color:#d5d5d5;}
            .tip-wrapper .content .info-wrapper .nick{color:#d5d5d5;}
            .tip-wrapper normal-tip{box-shadow: ${config.glowColor} 0px 0px 0px 5px;}
            .item-tip-section.s-4>span {color: ${config.textColor} !important; font-weight: bold;}
            .tip-wrapper[data-item-type=heroic], .tip-wrapper[data-item-type=t-her]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${config.borderColor}, 0 0 0 2px #191311, 0 0 0 3px #2b272700, 0 0 0 4px #5a595900, 0 0 0 5px #00000000, 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500, 0px 1px 5px 4px ${config.glowColor}70 !important;}
            .tip-wrapper[data-item-type=t-uniupg]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${config.borderColor}, 0 0 0 2px #191311, 0 0 0 3px rgb(0 0 0 / 0%), 0 0 0 4px #5a595900, 0 0 0 5px #00ff0000, 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500, 0px 1px 5px 4px ${config.glowColor}70 !important;}
            .tip-wrapper[data-item-type=t-upgraded]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${config.borderColor}, 0 0 0 2px #191311, 0 0 0 3px #2b272700, 0 0 0 4px #5a595900, 0 0 0 5px #00ff0000, 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500, 0px 1px 5px 4px ${config.glowColor}70 !important;}
            .tip-wrapper[data-item-type=normal], .tip-wrapper[data-item-type=t-norm]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${config.borderColor}, 0 0 0 2px ${config.borderColor}fa, 0 0 0 3px #2b272700, 0 0 0 4px #5a595900, 0 0 0 5px #07a19d00, 0 0 0 6px #5a585b00, 0 0 0 7px rgb(44 38 37 / 0%), 0px 1px 5px 4px ${config.glowColor}70 !important;}
            .tip-wrapper[data-type=t_item] .item-head .heroic, .tip-wrapper[data-type=t_item] .item-tip-section .heroic{font-weight: 700;}
            .tip-wrapper[data-type=t_item] .item-head .unique, .tip-wrapper[data-type=t_item] .item-tip-section .unique{font-weight: 700;}
            .tip-wrapper[data-type=t_item] .item-head .common, .tip-wrapper[data-type=t_item] .item-tip-section .common{font-weight: 700;}
            .tip-wrapper[data-type=t_item] .item-head .upgraded, .tip-wrapper[data-type=t_item] .item-tip-section .upgraded{font-weight: 700;}
            .tip-wrapper[data-type=t_item] .item-expired{font-size: 7px !important;}
            .tip-wrapper[data-item-type=t-leg]{box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${config.borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${config.glowColor} 0px 1px 5px 4px;}
            .tip-wrapper.own{color: #ffffff; box-shadow: 0 0 0 0 #000000, 0 0 0 1px ${config.borderColor}, 0 0 0 2px #000000, 0 0 0 3px #2b272700, 0 0 0 4px rgb(15 15 15 / 0%), 0 0 0 5px rgb(15 15 15 / 0%), 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500;}
            .tip-wrapper[data-type=t_item] .item-expired{display:block !important;}
            .item-tip-section.s-1.no-border {text-align: center;}
            .item-tip-section.s-3 {text-align: center;}
            .item-tip-section.s-2.no-border {text-align: center;}

            /*lega tip*/
            .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg]{--a:0deg; background: linear-gradient(var(--a), #000, #272727); box-shadow: inset 100px 100px 100px 184px #0000007a;}

            .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg]:before, .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg]:after {content: ''; position: absolute; left: -2px; top: -2px; background: linear-gradient(var(--a), ${gradientColorsStr}); background-size: 400%; width: calc(100% + 4px); height: calc(100% + 4px); z-index: -1; animation: a 10s linear infinite;}

            @property --a{ syntax: '<angle>'; inherits: false; initial-value: 0deg;}

            @keyframes a{
                from {
                --a:0deg;
                }
                to {
                --a:360deg;
                }
            }
            </style>
        `;

        $('body').append(tooltipStyles);
    }

function showSettingsDialog() {
    const existingModal = document.querySelector('.custom-tooltips-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'custom-tooltips-modal';

    modal.innerHTML = `
        <div class="custom-tooltips-dialog">
            <div class="custom-tooltips-header" id="tooltip-header">
                <h3>Custom Tooltips - Settings</h3>
                <button class="custom-tooltips-close" id="tooltip-close">×</button>
            </div>

            <div class="custom-tooltips-content" id="tooltip-scroll-content">
                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">Kolor ramki</label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="border-color-text" value="${config.borderColor}">
                        <input type="color" class="tooltip-color-picker" id="border-color" value="${config.borderColor}">
                    </div>
                    <div class="tooltip-setting-description">Główny kolor obramowania tooltipów(itemy i widgety)</div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">Kolor świecenia</label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="glow-color-text" value="${config.glowColor}">
                        <input type="color" class="tooltip-color-picker" id="glow-color" value="${config.glowColor}">
                    </div>
                    <div class="tooltip-setting-description">Kolor efektu świecenia wokół ramki</div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">Kolor nazwy i podpisów</label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="text-color-text" value="${config.textColor}">
                        <input type="color" class="tooltip-color-picker" id="text-color" value="${config.textColor}">
                    </div>
                    <div class="tooltip-setting-description">Kolor nazwy i podpisów przedmiotów legendarnych </div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">Kolor statystyk</label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="damage-color-text" value="${config.damageColor}">
                        <input type="color" class="tooltip-color-picker" id="damage-color" value="${config.damageColor}">
                    </div>
                    <div class="tooltip-setting-description">Kolor statystyk na przedmiotach</div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">Kolory gradientu (animacja legendarnych przedmiotów)</label>
                    <div class="tooltip-setting-description" style="margin-bottom: 10px;">Zmień kolory animowanej ramki dla legendarnych przedmiotów</div>
                    <div class="tooltip-gradient-inputs">
                        ${config.gradientColors.map((color, index) => `
                            <div class="tooltip-gradient-item">
                                <span class="tooltip-gradient-number">${index + 1}.</span>
                                <input type="text" class="gradient-color-text" data-index="${index}" value="${color}">
                                <input type="color" class="gradient-color-picker" data-index="${index}" value="${color}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="tooltip-buttons">
                <button class="tooltip-btn tooltip-btn-success" id="tooltip-export">Eksportuj</button>
                <button class="tooltip-btn tooltip-btn-info" id="tooltip-import">Importuj</button>
                <button class="tooltip-btn tooltip-btn-reset" id="tooltip-reset">Reset</button>
                <button class="tooltip-btn tooltip-btn-primary" id="tooltip-save">Zapisz</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

        // Obsługa scrolla - zapobiega przewijaniu strony w tle
        const scrollContent = document.getElementById('tooltip-scroll-content');
        scrollContent.addEventListener('wheel', e => e.stopPropagation());

        // Przeciąganie okna
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.custom-tooltips-dialog');
        const header = modal.querySelector('#tooltip-header');

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

        // Synchronizacja kolorów między text input a color picker
        function setupColorSync(textId, pickerId, configKey) {
            const textInput = document.getElementById(textId);
            const colorPicker = document.getElementById(pickerId);

            textInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    colorPicker.value = value;
                    config[configKey] = value;
                }
            });

            colorPicker.addEventListener('input', (e) => {
                const value = e.target.value;
                textInput.value = value;
                config[configKey] = value;
            });
        }

        setupColorSync('border-color-text', 'border-color', 'borderColor');
        setupColorSync('glow-color-text', 'glow-color', 'glowColor');
        setupColorSync('text-color-text', 'text-color', 'textColor');
        setupColorSync('damage-color-text', 'damage-color', 'damageColor');

        // Gradient colors
        document.querySelectorAll('.gradient-color-text').forEach(input => {
            const index = parseInt(input.getAttribute('data-index'));
            const picker = document.querySelector(`.gradient-color-picker[data-index="${index}"]`);

            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    picker.value = value;
                    config.gradientColors[index] = value;
                }
            });

            picker.addEventListener('input', (e) => {
                const value = e.target.value;
                input.value = value;
                config.gradientColors[index] = value;
            });
        });

        // Zamknij
        document.getElementById('tooltip-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // NOWE - Przycisk Eksportu
        document.getElementById('tooltip-export').addEventListener('click', () => {
            exportSettings();
        });

        // NOWE - Przycisk Importu
        document.getElementById('tooltip-import').addEventListener('click', () => {
            showImportDialog();
        });

        // Reset do białego
        document.getElementById('tooltip-reset').addEventListener('click', () => {
            config.borderColor = '#ffffff';
            config.glowColor = '#e0e0e0';
            config.textColor = '#ffffff';
            config.damageColor = '#cccccc';
            config.gradientColors = [
                "#ffffff", "#f0f0f0", "#e8e8e8", "#d0d0d0", "#c8c8c8",
                "#f8f8f8", "#e0e0e0", "#d8d8d8", "#f5f5f5", "#eeeeee"
            ];

            document.getElementById('border-color-text').value = config.borderColor;
            document.getElementById('border-color').value = config.borderColor;
            document.getElementById('glow-color-text').value = config.glowColor;
            document.getElementById('glow-color').value = config.glowColor;
            document.getElementById('text-color-text').value = config.textColor;
            document.getElementById('text-color').value = config.textColor;
            document.getElementById('damage-color-text').value = config.damageColor;
            document.getElementById('damage-color').value = config.damageColor;

            document.querySelectorAll('.gradient-color-text').forEach((input, index) => {
                input.value = config.gradientColors[index];
            });
            document.querySelectorAll('.gradient-color-picker').forEach((picker, index) => {
                picker.value = config.gradientColors[index];
            });

            showNotification('Ustawienia zresetowane do domyślnych (białe)', 'info');
        });

        // Zapisz i zastosuj
        document.getElementById('tooltip-save').addEventListener('click', () => {
            saveConfig();
            applyTooltipStyles();
            showNotification('Ustawienia zapisane!', 'success');
        });
    }

    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'custom-tooltips-settings-btn';
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
            const addonContainer = document.getElementById('addon-custom_tooltips');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#custom-tooltips-settings-btn')) {
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
        // Dodaj style interfejsu
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Zastosuj style tooltipów jeśli włączone
        if (config.enabled) {
            applyTooltipStyles();
        }

        // Integracja z managerem
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
    if (getCookie('interface') === 'ni') {
        init();
    }

    function getCookie(name) {
        const regex = new RegExp(`(^| )${name}=([^;]+)`);
        const match = document.cookie.match(regex);
        return match ? match[2] : null;
    }

})();
