(function() {
    'use strict';

    if (window.customTooltipsRunning) {
        return;
    }
    window.customTooltipsRunning = true;

// ===== TUTAJ DODAJ SWOJE CZCIONKI =====
const fontPresets = {
    'Domyślna': '',
    'Arial': 'Arial, sans-serif',
    'Times New Roman': 'Times New Roman, serif',
    'Courier New': 'Courier New, monospace',
    'Georgia': 'Georgia, serif',
    'Verdana': 'Verdana, sans-serif',
    'Tahoma': 'Tahoma, sans-serif',
    'Trebuchet MS': 'Trebuchet MS, sans-serif',
    'Impact': 'Impact, sans-serif',
    'Comic Sans MS': 'Comic Sans MS, cursive',
    'Montserrat': 'Montserrat',
    'Trebuchet MS': 'Trebuchet MS, sans-serif',
    'Impact': 'Impact, fantasy',
        'Palatino': 'Palatino Linotype, serif',
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
// ==========================================

let config = {
    enabled: localStorage.getItem('customTooltipsEnabled') !== 'false',
    borderColor: localStorage.getItem('customTooltipsBorderColor') || '#ffffff',
    borderEnabled: localStorage.getItem('customTooltipsBorderEnabled') !== 'false',
    glowColor: localStorage.getItem('customTooltipsGlowColor') || '#e0e0e0',
    glowEnabled: localStorage.getItem('customTooltipsGlowEnabled') !== 'false',
    textColor: localStorage.getItem('customTooltipsTextColor') || '#ffffff',
    textEnabled: localStorage.getItem('customTooltipsTextEnabled') !== 'false',
    damageColor: localStorage.getItem('customTooltipsDamageColor') || '#cccccc',
    damageEnabled: localStorage.getItem('customTooltipsDamageEnabled') !== 'false',
    gradientColors: JSON.parse(localStorage.getItem('customTooltipsGradientColors') ||
        '["#ffffff", "#f0f0f0", "#e8e8e8", "#d0d0d0", "#c8c8c8", "#f8f8f8", "#e0e0e0", "#d8d8d8", "#f5f5f5", "#eeeeee"]'),
    gradientEnabled: localStorage.getItem('customTooltipsGradientEnabled') !== 'false',
    legendaryNameColor: localStorage.getItem('customTooltipsLegendaryNameColor') || '#ff6b35',
    legendaryNameEnabled: localStorage.getItem('customTooltipsLegendaryNameEnabled') !== 'false',
    legendaryLabelColor: localStorage.getItem('customTooltipsLegendaryLabelColor') || '#ffffff',
    legendaryLabelEnabled: localStorage.getItem('customTooltipsLegendaryLabelEnabled') !== 'false',
    legbonColor: localStorage.getItem('customTooltipsLegbonColor') || '#00ff88',
    legbonEnabled: localStorage.getItem('customTooltipsLegbonEnabled') !== 'false',
    upgradeBonusColor: localStorage.getItem('customTooltipsUpgradeBonusColor') || '#4CAF50',
    upgradeBonusEnabled: localStorage.getItem('customTooltipsUpgradeBonusEnabled') !== 'false',
    itemDescColor: localStorage.getItem('customTooltipsItemDescColor') || '#cccccc',
    itemDescEnabled: localStorage.getItem('customTooltipsItemDescEnabled') !== 'false',
    selectedFont: localStorage.getItem('customTooltipsSelectedFont') || 'Domyślna'
};

function saveConfig() {
    localStorage.setItem('customTooltipsEnabled', config.enabled.toString());
    localStorage.setItem('customTooltipsBorderColor', config.borderColor);
    localStorage.setItem('customTooltipsBorderEnabled', config.borderEnabled.toString());
    localStorage.setItem('customTooltipsGlowColor', config.glowColor);
    localStorage.setItem('customTooltipsGlowEnabled', config.glowEnabled.toString());
    localStorage.setItem('customTooltipsTextColor', config.textColor);
    localStorage.setItem('customTooltipsTextEnabled', config.textEnabled.toString());
    localStorage.setItem('customTooltipsDamageColor', config.damageColor);
    localStorage.setItem('customTooltipsDamageEnabled', config.damageEnabled.toString());
    localStorage.setItem('customTooltipsGradientColors', JSON.stringify(config.gradientColors));
    localStorage.setItem('customTooltipsGradientEnabled', config.gradientEnabled.toString());
    localStorage.setItem('customTooltipsLegendaryNameColor', config.legendaryNameColor);
    localStorage.setItem('customTooltipsLegendaryNameEnabled', config.legendaryNameEnabled.toString());
    localStorage.setItem('customTooltipsLegendaryLabelColor', config.legendaryLabelColor);
    localStorage.setItem('customTooltipsLegendaryLabelEnabled', config.legendaryLabelEnabled.toString());
    localStorage.setItem('customTooltipsLegbonColor', config.legbonColor);
    localStorage.setItem('customTooltipsLegbonEnabled', config.legbonEnabled.toString());
    localStorage.setItem('customTooltipsUpgradeBonusColor', config.upgradeBonusColor);
    localStorage.setItem('customTooltipsUpgradeBonusEnabled', config.upgradeBonusEnabled.toString());
    localStorage.setItem('customTooltipsItemDescColor', config.itemDescColor);
    localStorage.setItem('customTooltipsItemDescEnabled', config.itemDescEnabled.toString());
    localStorage.setItem('customTooltipsSelectedFont', config.selectedFont);
}

    // NOWE FUNKCJE - Import/Export
    function exportSettings() {
    const settingsData = {
    settings: {
        borderColor: config.borderColor,
        borderEnabled: config.borderEnabled,
        glowColor: config.glowColor,
        glowEnabled: config.glowEnabled,
        textColor: config.textColor,
        textEnabled: config.textEnabled,
        damageColor: config.damageColor,
        damageEnabled: config.damageEnabled,
        gradientColors: config.gradientColors,
        gradientEnabled: config.gradientEnabled,
        legendaryNameColor: config.legendaryNameColor,
        legendaryNameEnabled: config.legendaryNameEnabled,
        legendaryLabelColor: config.legendaryLabelColor,
        legendaryLabelEnabled: config.legendaryLabelEnabled,
        legbonColor: config.legbonColor,
        legbonEnabled: config.legbonEnabled,
        upgradeBonusColor: config.upgradeBonusColor,
        upgradeBonusEnabled: config.upgradeBonusEnabled,
        itemDescColor: config.itemDescColor,
        itemDescEnabled: config.itemDescEnabled,
        selectedFont: config.selectedFont
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
            <div class="custom-tooltips-dialog" id="import-dialog" style="width: 500px;">
                <div class="custom-tooltips-header" id="import-header">
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
                    " placeholder='{"settings":{...}}'></textarea>
                </div>
                <div class="tooltip-buttons">
                    <button class="tooltip-btn tooltip-btn-primary" id="import-confirm">Importuj</button>
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
if (typeof data.settings.borderEnabled === 'boolean') {
    config.borderEnabled = data.settings.borderEnabled;
}
if (data.settings.glowColor && hexRegex.test(data.settings.glowColor)) {
    config.glowColor = data.settings.glowColor;
}
if (typeof data.settings.glowEnabled === 'boolean') {
    config.glowEnabled = data.settings.glowEnabled;
}
if (data.settings.textColor && hexRegex.test(data.settings.textColor)) {
    config.textColor = data.settings.textColor;
}
if (typeof data.settings.textEnabled === 'boolean') {
    config.textEnabled = data.settings.textEnabled;
}
if (data.settings.damageColor && hexRegex.test(data.settings.damageColor)) {
    config.damageColor = data.settings.damageColor;
}
if (typeof data.settings.damageEnabled === 'boolean') {
    config.damageEnabled = data.settings.damageEnabled;
}

if (Array.isArray(data.settings.gradientColors) && data.settings.gradientColors.length === 10) {
    const validGradient = data.settings.gradientColors.every(color => hexRegex.test(color));
    if (validGradient) {
        config.gradientColors = data.settings.gradientColors;
    }
}
if (typeof data.settings.gradientEnabled === 'boolean') {
    config.gradientEnabled = data.settings.gradientEnabled;
}

if (data.settings.legendaryNameColor && hexRegex.test(data.settings.legendaryNameColor)) {
    config.legendaryNameColor = data.settings.legendaryNameColor;
}
if (typeof data.settings.legendaryNameEnabled === 'boolean') {
    config.legendaryNameEnabled = data.settings.legendaryNameEnabled;
}

if (data.settings.legendaryLabelColor && hexRegex.test(data.settings.legendaryLabelColor)) {
    config.legendaryLabelColor = data.settings.legendaryLabelColor;
}
if (typeof data.settings.legendaryLabelEnabled === 'boolean') {
    config.legendaryLabelEnabled = data.settings.legendaryLabelEnabled;
}

if (data.settings.legbonColor && hexRegex.test(data.settings.legbonColor)) {
    config.legbonColor = data.settings.legbonColor;
}
if (typeof data.settings.legbonEnabled === 'boolean') {
    config.legbonEnabled = data.settings.legbonEnabled;
}

if (data.settings.upgradeBonusColor && hexRegex.test(data.settings.upgradeBonusColor)) {
    config.upgradeBonusColor = data.settings.upgradeBonusColor;
}
if (typeof data.settings.upgradeBonusEnabled === 'boolean') {
    config.upgradeBonusEnabled = data.settings.upgradeBonusEnabled;
}

if (typeof data.settings.selectedFont === 'string' && fontPresets[data.settings.selectedFont]) {
    config.selectedFont = data.settings.selectedFont;
}

if (data.settings.itemDescColor && hexRegex.test(data.settings.itemDescColor)) {
    config.itemDescColor = data.settings.itemDescColor;
}
if (typeof data.settings.itemDescEnabled === 'boolean') {
    config.itemDescEnabled = data.settings.itemDescEnabled;
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
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
        font-weight: normal;
        color: #ccc;
        font-size: 12px;
    }

    /* Checkbox */
    .tooltip-checkbox {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: #5865F2;
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

    .tooltip-color-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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

    .tooltip-color-picker:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Opisy */
    .tooltip-setting-description {
        font-size: 10px;
        color: #888;
        margin-top: 5px;
        line-height: 1.4;
    }

/* Select dla czcionki */
.tooltip-font-select {
    width: 100%;
    padding: 8px;
    background: #555;
    border: 1px solid #666;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
}

.tooltip-font-select:focus {
    outline: none;
    border-color: #888;
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

.tooltip-checkbox {
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
}

.tooltip-checkbox:hover {
    border-color: #4CAF50;
}

.tooltip-checkbox:checked {
    background: #4CAF50;
    border-color: #4CAF50;
}

.tooltip-checkbox:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
}
`;

// Znajdź tę funkcję w swoim skrypcie i zastąp ją tą wersją:

function applyTooltipStyles() {
    const existingStyle = document.getElementById('custom-tooltips-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    if (!config.enabled) return;

    const gradientColorsStr = config.gradientColors.join(', ');

    const borderColor = config.borderEnabled ? config.borderColor : '#ffffff';
    const glowColor = config.glowEnabled ? config.glowColor : '#e0e0e0';
    const textColor = config.textEnabled ? config.textColor : '#ffffff';
    const damageColor = config.damageEnabled ? config.damageColor : '#cccccc';
    const legendaryNameColor = config.legendaryNameEnabled ? config.legendaryNameColor : '#ff6b35';
    const legendaryLabelColor = config.legendaryLabelEnabled ? config.legendaryLabelColor : '#ffffff';
    const legbonColor = config.legbonEnabled ? config.legbonColor : '#00ff88';
    const upgradeBonusColor = config.upgradeBonusEnabled ? config.upgradeBonusColor : '#4CAF50';
    const itemDescColor = config.itemDescEnabled ? config.itemDescColor : '#cccccc';


    const fontFamily = fontPresets[config.selectedFont] || '';
    const fontFamilyCSS = fontFamily ? `font-family: ${fontFamily} !important;` : '';

    const tooltipStyles = `
        <style id="custom-tooltips-style">

        /*ANIMOWANE-TIPY - WSZYSTKO Z !important*/
        .item-type{text-align:center !important;}
        .tip-wrapper.normal-tip {box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${glowColor} 0px 1px 24px -4px !important;}
        .tip-wrapper{box-shadow: 0 0 0 0 #000000, 0 0 0 1px ${borderColor}, 0 0 0 2px #000000, 0 0 0 3px #2b272700, 0 0 0 4px rgb(15 15 15 / 0%), 0 0 0 5px rgb(15 15 15 / 0%), 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500 !important;}
        .tip-wrapper .content {padding: 5px !important; background: rgba(15, 15, 15,.85) !important; word-break: break-word !important; ${fontFamilyCSS}}
        .tip-wrapper[data-type=t_item] .item-head {border:1px solid #1e1e1e66 !important; border-radius: 2px !important; background: hsl(0deg 0% 4.87% / 10%) !important;}
        .tip-wrapper[data-type=t_item] .item-head .cl-icon {border: 1px solid rgba(15, 15, 15,.3) !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section {border-bottom: 1px solid rgba(15, 15, 15,.5) !important;}
        .tip-wrapper .content .info-wrapper .nick {color:#79e1c5 !important; font-family: Cinzel !important; font-size: 11px !important; text-shadow: 0 0 4px black !important; border: 1px solid ${borderColor} !important; border-radius: 2px !important; background: ${borderColor}20 !important;}
        .tip-wrapper[data-type=t_other] .line {border-bottom:1px solid ${borderColor} !important; background: none !important;}
        .tip-wrapper[data-item-type=t-leg]{box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${glowColor} 0px 1px 24px -4px !important;}
        .tip-wrapper[data-type=t_item] .item-head .legendary {color: ${legendaryLabelColor} !important; text-align: center !important; font-size: 13px !important; font-weight: 700 !important; text-shadow: 1px 1px ${legendaryLabelColor}42 !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section .legendary {color: ${legendaryNameColor} !important; text-align: center !important; font-size: 13px !important; font-weight: 700 !important; text-shadow: 1px 1px ${legendaryNameColor}42 !important;}
        .tip-wrapper[data-type=t_item] .tip-item-stat-legbon {color: ${legbonColor} !important; font-weight: 600 !important;}
        .tip-wrapper[data-type=t_item] .tip-item-stat-bonus {color: ${upgradeBonusColor} !important; font-weight: 600 !important;}
        .tip-wrapper[data-type=t_item] .tip-item-stat-opis {color: ${itemDescColor} !important;}
        .tip-wrapper[data-type=t_item] .item-head .item-type{padding-left: 48px !important; margin-left: 0px !important;}
        .tip-wrapper.normal-tip .damage, .tip-wrapper.sticky-tip .damage {color: ${damageColor} !important; font-weight: 999 !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section.s-7{color: white !important; font-weight: 700 !important;}
        .tip-wrapper[data-type=t_item] i.looter{color: ${textColor} !important; text-align: center !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section.s-5{color: ${textColor} !important; text-align: center !important; font-weight: 600 !important;}
        .tip-wrapper[data-item-type=t-upgraded], .tip-wrapper[data-item-type=upgraded]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${borderColor}, 0 0 0 2px #111911, 0 0 0 3px #2b2727, 0 0 0 4px #59595a, 0 0 0 5px ${textColor}, 0 0 0 6px #5a585b, 0 0 0 7px #2c2625 !important;}
        .tip-wrapper[data-type=t_item] .item-head .upgraded, .tip-wrapper[data-type=t_item] .item-tip-section .upgraded{color: ${textColor} !important;}
        .tip-wrapper[data-type=t_item] .prc-icon{width:0px !important; height:0px !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section.s-9 .value-item{color:white !important; font-size:10px !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section.s-9 .lvl-next{float:none !important;}
        .tip-wrapper[data-type=t_other] .clan-in-tip{color:#d5d5d5 !important;}
        .tip-wrapper .content .info-wrapper .nick{color:#d5d5d5 !important;}
        .tip-wrapper normal-tip{box-shadow: ${glowColor} 0px 0px 0px 5px !important;}
        .item-tip-section.s-4>span {color: ${textColor} !important; font-weight: bold !important;}
        .tip-wrapper[data-item-type=heroic], .tip-wrapper[data-item-type=t-her]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${borderColor}, 0 0 0 2px #191311, 0 0 0 3px #2b272700, 0 0 0 4px #5a595900, 0 0 0 5px #00000000, 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500, 0px 1px 5px 4px ${glowColor}70 !important;}
        .tip-wrapper[data-item-type=t-uniupg]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${borderColor}, 0 0 0 2px #191311, 0 0 0 3px rgb(0 0 0 / 0%), 0 0 0 4px #5a595900, 0 0 0 5px #00ff0000, 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500, 0px 1px 5px 4px ${glowColor}70 !important;}
        .tip-wrapper[data-item-type=t-upgraded]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${borderColor}, 0 0 0 2px #191311, 0 0 0 3px #2b272700, 0 0 0 4px #5a595900, 0 0 0 5px #00ff0000, 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500, 0px 1px 5px 4px ${glowColor}70 !important;}
        .tip-wrapper[data-item-type=normal], .tip-wrapper[data-item-type=t-norm]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${borderColor}, 0 0 0 2px ${borderColor}fa, 0 0 0 3px #2b272700, 0 0 0 4px #5a595900, 0 0 0 5px #07a19d00, 0 0 0 6px #5a585b00, 0 0 0 7px rgb(44 38 37 / 0%), 0px 1px 5px 4px ${glowColor}70 !important;}
        .tip-wrapper[data-type=t_item] .item-head .heroic, .tip-wrapper[data-type=t_item] .item-tip-section .heroic{font-weight: 700 !important;}
        .tip-wrapper[data-type=t_item] .item-head .unique, .tip-wrapper[data-type=t_item] .item-tip-section .unique{font-weight: 700 !important;}
        .tip-wrapper[data-type=t_item] .item-head .common, .tip-wrapper[data-type=t_item] .item-tip-section .common{font-weight: 700 !important;}
        .tip-wrapper[data-type=t_item] .item-head .upgraded, .tip-wrapper[data-type=t_item] .item-tip-section .upgraded{font-weight: 700 !important;}
        .tip-wrapper[data-type=t_item] .item-expired{font-size: 7px !important; display:block !important;}
        .tip-wrapper[data-item-type=t-leg]{box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${glowColor} 0px 1px 5px 4px !important;}
        .tip-wrapper.own{color: #ffffff !important; box-shadow: 0 0 0 0 #000000, 0 0 0 1px ${borderColor}, 0 0 0 2px #000000, 0 0 0 3px #2b272700, 0 0 0 4px rgb(15 15 15 / 0%), 0 0 0 5px rgb(15 15 15 / 0%), 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500 !important;}
        .item-tip-section.s-1.no-border {text-align: center !important;}
        .item-tip-section.s-3 {text-align: center !important;}
        .item-tip-section.s-2.no-border {text-align: center !important;}

        /*lega tip*/
        ${config.gradientEnabled ? `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg]{--a:0deg; background: linear-gradient(var(--a), #000, #272727) !important; box-shadow: inset 100px 100px 100px 184px #0000007a !important;}

        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg]:before, .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg]:after {content: '' !important; position: absolute !important; left: -2px !important; top: -2px !important; background: linear-gradient(var(--a), ${gradientColorsStr}) !important; background-size: 400% !important; width: calc(100% + 4px) !important; height: calc(100% + 4px) !important; z-index: -1 !important; animation: a 7s linear infinite !important;}

        @property --a{ syntax: '<angle>'; inherits: false; initial-value: 0deg;}

        @keyframes a{
            from {
            --a:0deg;
            }
            to {
            --a:360deg;
            }
        }
        ` : ''}
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
                    <label class="tooltip-setting-label">
                        <input type="checkbox" class="tooltip-checkbox" id="border-enabled" ${config.borderEnabled ? 'checked' : ''}>
                        Kolor ramki
                    </label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="border-color-text" value="${config.borderColor}" ${!config.borderEnabled ? 'disabled' : ''}>
                        <input type="color" class="tooltip-color-picker" id="border-color" value="${config.borderColor}" ${!config.borderEnabled ? 'disabled' : ''}>
                    </div>
                    <div class="tooltip-setting-description">Główny kolor obramowania tooltipów (itemy i widgety)</div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">
                        <input type="checkbox" class="tooltip-checkbox" id="glow-enabled" ${config.glowEnabled ? 'checked' : ''}>
                        Kolor świecenia
                    </label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="glow-color-text" value="${config.glowColor}" ${!config.glowEnabled ? 'disabled' : ''}>
                        <input type="color" class="tooltip-color-picker" id="glow-color" value="${config.glowColor}" ${!config.glowEnabled ? 'disabled' : ''}>
                    </div>
                    <div class="tooltip-setting-description">Kolor efektu świecenia wokół ramki</div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">
                        <input type="checkbox" class="tooltip-checkbox" id="text-enabled" ${config.textEnabled ? 'checked' : ''}>
                        Kolor podpisów
                    </label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="text-color-text" value="${config.textColor}" ${!config.textEnabled ? 'disabled' : ''}>
                        <input type="color" class="tooltip-color-picker" id="text-color" value="${config.textColor}" ${!config.textEnabled ? 'disabled' : ''}>
                    </div>
                    <div class="tooltip-setting-description">Kolor podpisów przedmiotów (działa tylko na legach!)</div>
                </div>

                <div class="tooltip-setting-group">
                    <label class="tooltip-setting-label">
                        <input type="checkbox" class="tooltip-checkbox" id="damage-enabled" ${config.damageEnabled ? 'checked' : ''}>
                        Kolor statystyk
                    </label>
                    <div class="tooltip-color-input-wrapper">
                        <input type="text" class="tooltip-color-input" id="damage-color-text" value="${config.damageColor}" ${!config.damageEnabled ? 'disabled' : ''}>
                        <input type="color" class="tooltip-color-picker" id="damage-color" value="${config.damageColor}" ${!config.damageEnabled ? 'disabled' : ''}>
                    </div>
                    <div class="tooltip-setting-description">Kolor statystyk na przedmiotach</div>
                </div>
                <div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="legendary-label-enabled" ${config.legendaryLabelEnabled ? 'checked' : ''}>
        Kolor nazwy legi
    </label>
    <div class="tooltip-color-input-wrapper">
        <input type="text" class="tooltip-color-input" id="legendary-label-color-text" value="${config.legendaryLabelColor}" ${!config.legendaryLabelEnabled ? 'disabled' : ''}>
        <input type="color" class="tooltip-color-picker" id="legendary-label-color" value="${config.legendaryLabelColor}" ${!config.legendaryLabelEnabled ? 'disabled' : ''}>
    </div>
    <div class="tooltip-setting-description">Kolor nazwy przedmiotu legendarnego(działa tylko na legach!)</div>
</div>

<div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="legendary-name-enabled" ${config.legendaryNameEnabled ? 'checked' : ''}>
        Kolor napisu "Legendarny"
    </label>
    <div class="tooltip-color-input-wrapper">
        <input type="text" class="tooltip-color-input" id="legendary-name-color-text" value="${config.legendaryNameColor}" ${!config.legendaryNameEnabled ? 'disabled' : ''}>
        <input type="color" class="tooltip-color-picker" id="legendary-name-color" value="${config.legendaryNameColor}" ${!config.legendaryNameEnabled ? 'disabled' : ''}>
    </div>
    <div class="tooltip-setting-description">Kolor napisu "Legendarny"(działa tylko na legach!)</div>
</div>

<div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="legbon-enabled" ${config.legbonEnabled ? 'checked' : ''}>
        Kolor bonusu legendarnego
    </label>
    <div class="tooltip-color-input-wrapper">
        <input type="text" class="tooltip-color-input" id="legbon-color-text" value="${config.legbonColor}" ${!config.legbonEnabled ? 'disabled' : ''}>
        <input type="color" class="tooltip-color-picker" id="legbon-color" value="${config.legbonColor}" ${!config.legbonEnabled ? 'disabled' : ''}>
    </div>
    <div class="tooltip-setting-description">Kolor bonusu legendarnego</div>
</div>

<div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="upgrade-bonus-enabled" ${config.upgradeBonusEnabled ? 'checked' : ''}>
        Kolor wzmocnienia przedmiotu
    </label>
    <div class="tooltip-color-input-wrapper">
        <input type="text" class="tooltip-color-input" id="upgrade-bonus-color-text" value="${config.upgradeBonusColor}" ${!config.upgradeBonusEnabled ? 'disabled' : ''}>
        <input type="color" class="tooltip-color-picker" id="upgrade-bonus-color" value="${config.upgradeBonusColor}" ${!config.upgradeBonusEnabled ? 'disabled' : ''}>
    </div>
    <div class="tooltip-setting-description">Kolor wzmocnienia przedmiotu (działa tylko na przedmiotach ulepszonych na+5!)</div>
</div>
<div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="item-desc-enabled" ${config.itemDescEnabled ? 'checked' : ''}>
        Kolor opisów przedmiotów
    </label>
    <div class="tooltip-color-input-wrapper">
        <input type="text" class="tooltip-color-input" id="item-desc-color-text" value="${config.itemDescColor}" ${!config.itemDescEnabled ? 'disabled' : ''}>
        <input type="color" class="tooltip-color-picker" id="item-desc-color" value="${config.itemDescColor}" ${!config.itemDescEnabled ? 'disabled' : ''}>
    </div>
    <div class="tooltip-setting-description">Kolor opisów lore przedmiotów (długie teksty opisowe)</div>
</div>

                <div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="gradient-enabled" ${config.gradientEnabled ? 'checked' : ''}>
        Kolory gradientu (animacja legendarnych przedmiotów)
    </label>
    <div class="tooltip-setting-description" style="margin-bottom: 10px;">Zmień kolory animowanej ramki dla legendarnych przedmiotów(to są klatki animacji)</div>
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

<div class="tooltip-setting-group">
    <label class="tooltip-setting-label">Wybierz czcionkę</label>
    <select class="tooltip-font-select" id="font-select">
        ${Object.keys(fontPresets).map(fontName =>
            `<option value="${fontName}" ${config.selectedFont === fontName ? 'selected' : ''}>${fontName}</option>`
        ).join('')}
    </select>
    <div class="tooltip-setting-description" style="margin-top: 5px;">
        Wybierz czcionkę dla tooltipów
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

        // Obsługa checkboxów
        function setupCheckboxToggle(checkboxId, textId, pickerId, configKey) {
            const checkbox = document.getElementById(checkboxId);
            const textInput = document.getElementById(textId);
            const colorPicker = document.getElementById(pickerId);

            checkbox.addEventListener('change', (e) => {
                const isEnabled = e.target.checked;
                config[configKey] = isEnabled;
                textInput.disabled = !isEnabled;
                colorPicker.disabled = !isEnabled;
            });
        }

        setupCheckboxToggle('border-enabled', 'border-color-text', 'border-color', 'borderEnabled');
        setupCheckboxToggle('glow-enabled', 'glow-color-text', 'glow-color', 'glowEnabled');
        setupCheckboxToggle('text-enabled', 'text-color-text', 'text-color', 'textEnabled');
        setupCheckboxToggle('damage-enabled', 'damage-color-text', 'damage-color', 'damageEnabled');
        setupCheckboxToggle('legendary-label-enabled', 'legendary-label-color-text', 'legendary-label-color', 'legendaryLabelEnabled');
        setupCheckboxToggle('legendary-name-enabled', 'legendary-name-color-text', 'legendary-name-color', 'legendaryNameEnabled');
        setupCheckboxToggle('legbon-enabled', 'legbon-color-text', 'legbon-color', 'legbonEnabled');
        setupCheckboxToggle('upgrade-bonus-enabled', 'upgrade-bonus-color-text', 'upgrade-bonus-color', 'upgradeBonusEnabled');
        setupCheckboxToggle('item-desc-enabled', 'item-desc-color-text', 'item-desc-color', 'itemDescEnabled');

// Gradient checkbox
document.getElementById('gradient-enabled').addEventListener('change', (e) => {
    config.gradientEnabled = e.target.checked;
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
        setupColorSync('legendary-label-color-text', 'legendary-label-color', 'legendaryLabelColor');
        setupColorSync('legendary-name-color-text', 'legendary-name-color', 'legendaryNameColor');
        setupColorSync('legbon-color-text', 'legbon-color', 'legbonColor');
        setupColorSync('upgrade-bonus-color-text', 'upgrade-bonus-color', 'upgradeBonusColor');
        setupColorSync('item-desc-color-text', 'item-desc-color', 'itemDescColor');

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

// Font select
const fontSelect = document.getElementById('font-select');
fontSelect.addEventListener('change', (e) => {
    config.selectedFont = e.target.value;
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

        // Przycisk Eksportu
        document.getElementById('tooltip-export').addEventListener('click', () => {
            exportSettings();
        });

        // Przycisk Importu
        document.getElementById('tooltip-import').addEventListener('click', () => {
            showImportDialog();
        });

        // Reset do białego
        document.getElementById('tooltip-reset').addEventListener('click', () => {
  config.borderColor = '#ffffff';
config.borderEnabled = true;
config.glowColor = '#e0e0e0';
config.glowEnabled = true;
config.textColor = '#ffffff';
config.textEnabled = true;
config.damageColor = '#cccccc';
config.damageEnabled = true;
config.gradientColors = [
    "#ffffff", "#f0f0f0", "#e8e8e8", "#d0d0d0", "#c8c8c8",
    "#f8f8f8", "#e0e0e0", "#d8d8d8", "#f5f5f5", "#eeeeee"
];
config.gradientEnabled = true;
config.legendaryNameColor = '#ff6b35';
config.legendaryNameEnabled = true;
config.legendaryLabelColor = '#ffffff';
config.legendaryLabelEnabled = true;
config.legbonColor = '#00ff88';
config.legbonEnabled = true;
config.upgradeBonusColor = '#4CAF50';
config.upgradeBonusEnabled = true;
config.itemDescColor = '#cccccc';
config.itemDescEnabled = true;
config.selectedFont = 'Domyślna';

            // Odśwież interfejs
            document.getElementById('border-color-text').value = config.borderColor;
            document.getElementById('border-color').value = config.borderColor;
            document.getElementById('border-enabled').checked = true;
            document.getElementById('border-color-text').disabled = false;
            document.getElementById('border-color').disabled = false;

            document.getElementById('glow-color-text').value = config.glowColor;
            document.getElementById('glow-color').value = config.glowColor;
            document.getElementById('glow-enabled').checked = true;
            document.getElementById('glow-color-text').disabled = false;
            document.getElementById('glow-color').disabled = false;

            document.getElementById('text-color-text').value = config.textColor;
            document.getElementById('text-color').value = config.textColor;
            document.getElementById('text-enabled').checked = true;
            document.getElementById('text-color-text').disabled = false;
            document.getElementById('text-color').disabled = false;

            document.getElementById('damage-color-text').value = config.damageColor;
            document.getElementById('damage-color').value = config.damageColor;
            document.getElementById('damage-enabled').checked = true;
            document.getElementById('damage-color-text').disabled = false;
            document.getElementById('damage-color').disabled = false;

            document.querySelectorAll('.gradient-color-text').forEach((input, index) => {
                input.value = config.gradientColors[index];
            });
            document.querySelectorAll('.gradient-color-picker').forEach((picker, index) => {
                picker.value = config.gradientColors[index];
            });
document.getElementById('legendary-label-color-text').value = config.legendaryLabelColor;
document.getElementById('legendary-label-color').value = config.legendaryLabelColor;
document.getElementById('legendary-label-enabled').checked = true;

document.getElementById('legendary-name-color-text').value = config.legendaryNameColor;
document.getElementById('legendary-name-color').value = config.legendaryNameColor;
document.getElementById('legendary-name-enabled').checked = true;

document.getElementById('legbon-color-text').value = config.legbonColor;
document.getElementById('legbon-color').value = config.legbonColor;
document.getElementById('legbon-enabled').checked = true;

document.getElementById('upgrade-bonus-color-text').value = config.upgradeBonusColor;
document.getElementById('upgrade-bonus-color').value = config.upgradeBonusColor;
document.getElementById('upgrade-bonus-enabled').checked = true;

document.getElementById('item-desc-color-text').value = config.itemDescColor;
document.getElementById('item-desc-color').value = config.itemDescColor;
document.getElementById('item-desc-enabled').checked = true;

document.getElementById('gradient-enabled').checked = true;

            document.getElementById('font-select').value = 'Domyślna';

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
