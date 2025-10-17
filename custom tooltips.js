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
    widgetBorderColor: localStorage.getItem('customTooltipsWidgetBorderColor') || '#ffffff',
    widgetBorderEnabled: localStorage.getItem('customTooltipsWidgetBorderEnabled') !== 'false',
    widgetGlowColor: localStorage.getItem('customTooltipsWidgetGlowColor') || '#e0e0e0',
    widgetGlowEnabled: localStorage.getItem('customTooltipsWidgetGlowEnabled') !== 'false',
    characterBorderColor: localStorage.getItem('customTooltipsCharacterBorderColor') || '#ffffff',
    characterBorderEnabled: localStorage.getItem('customTooltipsCharacterBorderEnabled') !== 'false',
    characterGlowColor: localStorage.getItem('customTooltipsCharacterGlowColor') || '#e0e0e0',
    characterGlowEnabled: localStorage.getItem('customTooltipsCharacterGlowEnabled') !== 'false',
    glowColor: localStorage.getItem('customTooltipsGlowColor') || '#e0e0e0',
    glowEnabled: localStorage.getItem('customTooltipsGlowEnabled') !== 'false',
    textColor: localStorage.getItem('customTooltipsTextColor') || '#ffffff',
    textEnabled: localStorage.getItem('customTooltipsTextEnabled') !== 'false',
    damageColor: localStorage.getItem('customTooltipsDamageColor') || '#cccccc',
    damageEnabled: localStorage.getItem('customTooltipsDamageEnabled') !== 'false',
    legendaryAnimation: localStorage.getItem('customTooltipsLegendaryAnimation') || 'gradient',
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
    upgradedColor: localStorage.getItem('customTooltipsUpgradedColor') || '#ffffff',
    upgradedEnabled: localStorage.getItem('customTooltipsUpgradedEnabled') !== 'false',
    nickBorderColor: localStorage.getItem('customTooltipsNickBorderColor') || '#ffffff',
    nickBorderEnabled: localStorage.getItem('customTooltipsNickBorderEnabled') !== 'false',
    selectedFont: localStorage.getItem('customTooltipsSelectedFont') || 'Domyślna'
};

function saveConfig() {
    localStorage.setItem('customTooltipsEnabled', config.enabled.toString());
    localStorage.setItem('customTooltipsBorderColor', config.borderColor);
    localStorage.setItem('customTooltipsBorderEnabled', config.borderEnabled.toString());
    localStorage.setItem('customTooltipsWidgetBorderColor', config.widgetBorderColor);
    localStorage.setItem('customTooltipsWidgetBorderEnabled', config.widgetBorderEnabled.toString());
    localStorage.setItem('customTooltipsWidgetGlowColor', config.widgetGlowColor);
    localStorage.setItem('customTooltipsWidgetGlowEnabled', config.widgetGlowEnabled.toString());
    localStorage.setItem('customTooltipsCharacterBorderColor', config.characterBorderColor);
    localStorage.setItem('customTooltipsCharacterBorderEnabled', config.characterBorderEnabled.toString());
    localStorage.setItem('customTooltipsCharacterGlowColor', config.characterGlowColor);
    localStorage.setItem('customTooltipsCharacterGlowEnabled', config.characterGlowEnabled.toString());
    localStorage.setItem('customTooltipsGlowColor', config.glowColor);
    localStorage.setItem('customTooltipsGlowEnabled', config.glowEnabled.toString());
    localStorage.setItem('customTooltipsTextColor', config.textColor);
    localStorage.setItem('customTooltipsTextEnabled', config.textEnabled.toString());
    localStorage.setItem('customTooltipsDamageColor', config.damageColor);
    localStorage.setItem('customTooltipsDamageEnabled', config.damageEnabled.toString());
    localStorage.setItem('customTooltipsLegendaryAnimation', config.legendaryAnimation);
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
    localStorage.setItem('customTooltipsUpgradedColor', config.upgradedColor);
    localStorage.setItem('customTooltipsUpgradedEnabled', config.upgradedEnabled.toString());
    localStorage.setItem('customTooltipsNickBorderColor', config.nickBorderColor);
    localStorage.setItem('customTooltipsNickBorderEnabled', config.nickBorderEnabled.toString());
    localStorage.setItem('customTooltipsSelectedFont', config.selectedFont);
}

    // NOWE FUNKCJE - Import/Export
    function exportSettings() {
    const settingsData = {
    settings: {
        borderColor: config.borderColor,
        borderEnabled: config.borderEnabled,
        widgetBorderColor: config.widgetBorderColor,
        widgetBorderEnabled: config.widgetBorderEnabled,
        widgetGlowColor: config.widgetGlowColor,
        widgetGlowEnabled: config.widgetGlowEnabled,
        characterBorderColor: config.characterBorderColor,
        characterBorderEnabled: config.characterBorderEnabled,
        characterGlowColor: config.characterGlowColor,
        characterGlowEnabled: config.characterGlowEnabled,
        glowColor: config.glowColor,
        glowEnabled: config.glowEnabled,
        textColor: config.textColor,
        textEnabled: config.textEnabled,
        damageColor: config.damageColor,
        damageEnabled: config.damageEnabled,
        legendaryAnimation: config.legendaryAnimation,
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
        upgradedColor: config.upgradedColor,
        upgradedEnabled: config.upgradedEnabled,
        nickBorderColor: config.nickBorderColor,
        nickBorderEnabled: config.nickBorderEnabled,
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

if (data.settings.widgetBorderColor && hexRegex.test(data.settings.widgetBorderColor)) {
    config.widgetBorderColor = data.settings.widgetBorderColor;
}
if (typeof data.settings.widgetBorderEnabled === 'boolean') {
    config.widgetBorderEnabled = data.settings.widgetBorderEnabled;
}
if (data.settings.widgetGlowColor && hexRegex.test(data.settings.widgetGlowColor)) {
    config.widgetGlowColor = data.settings.widgetGlowColor;
}
if (typeof data.settings.widgetGlowEnabled === 'boolean') {
    config.widgetGlowEnabled = data.settings.widgetGlowEnabled;
}

if (data.settings.characterBorderColor && hexRegex.test(data.settings.characterBorderColor)) {
    config.characterBorderColor = data.settings.characterBorderColor;
}
if (typeof data.settings.characterBorderEnabled === 'boolean') {
    config.characterBorderEnabled = data.settings.characterBorderEnabled;
}
if (data.settings.characterGlowColor && hexRegex.test(data.settings.characterGlowColor)) {
    config.characterGlowColor = data.settings.characterGlowColor;
}
if (typeof data.settings.characterGlowEnabled === 'boolean') {
    config.characterGlowEnabled = data.settings.characterGlowEnabled;
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
const validAnimations = ['gradient', 'wave', 'pulse', 'slide', 'glow', 'spin'];
if (data.settings.legendaryAnimation && validAnimations.includes(data.settings.legendaryAnimation)) {
    config.legendaryAnimation = data.settings.legendaryAnimation;
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

if (data.settings.upgradedColor && hexRegex.test(data.settings.upgradedColor)) {
    config.upgradedColor = data.settings.upgradedColor;
}
if (typeof data.settings.upgradedEnabled === 'boolean') {
    config.upgradedEnabled = data.settings.upgradedEnabled;
}
if (data.settings.nickBorderColor && hexRegex.test(data.settings.nickBorderColor)) {
    config.nickBorderColor = data.settings.nickBorderColor;
}
if (typeof data.settings.nickBorderEnabled === 'boolean') {
    config.nickBorderEnabled = data.settings.nickBorderEnabled;
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

    /* Dialog */
    .custom-tooltips-dialog {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 0;
        width: 400px;
        max-width: 90vw;
        max-height: 90vh;
        color: #ccc;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        pointer-events: all;
    }

    /* Nagłówek */
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
        flex-shrink: 0;
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

    /* Style dla zakładek */
    .tooltip-tab {
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

    .tooltip-tab:hover {
        background: #252525;
        color: #ccc;
    }

    .tooltip-tab.active {
        background: #2a2a2a;
        color: #5865F2;
        border-bottom-color: #5865F2;
    }

    .tooltip-tab-content {
        display: none;
        padding: 15px;
    }

    .tooltip-tab-content.active {
        display: block;
    }

.custom-tooltips-content {
    flex: 1;
    min-height: 0; /* WAŻNE! */
    display: flex;
    flex-direction: column;
}

.tooltip-tab-content {
    display: none;
    padding: 15px;
    height: 100%;
    overflow-y: auto; /* Scroll TUTAJ zamiast w .custom-tooltips-content */
}

.tooltip-tab-content.active {
    display: block;
}

/* Scrollbary dla zakładek */
.tooltip-tab-content::-webkit-scrollbar {
    width: 8px;
}

.tooltip-tab-content::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 4px;
}

.tooltip-tab-content::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
}

.tooltip-tab-content::-webkit-scrollbar-thumb:hover {
    background: #666;
}

.tooltip-tab-content {
    scrollbar-width: thin;
    scrollbar-color: #555 #2a2a2a;
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

    /* Siatka gradientów */
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
        flex-shrink: 0;
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
    const borderColor = config.borderEnabled ? config.borderColor : '#ffffff';
    const glowColor = config.glowEnabled ? config.glowColor : '#e0e0e0';
    const widgetBorderColor = config.widgetBorderEnabled ? config.widgetBorderColor : '#ffffff';
    const widgetGlowColor = config.widgetGlowEnabled ? config.widgetGlowColor : '#e0e0e0';
    const characterBorderColor = config.characterBorderEnabled ? config.characterBorderColor : '#ffffff';
    const characterGlowColor = config.characterGlowEnabled ? config.characterGlowColor : '#e0e0e0';
    const textColor = config.textEnabled ? config.textColor : '#ffffff';
    const damageColor = config.damageEnabled ? config.damageColor : '#cccccc';
    const legendaryNameColor = config.legendaryNameEnabled ? config.legendaryNameColor : '#ff6b35';
    const legendaryLabelColor = config.legendaryLabelEnabled ? config.legendaryLabelColor : '#ffffff';
    const legbonColor = config.legbonEnabled ? config.legbonColor : '#00ff88';
    const upgradeBonusColor = config.upgradeBonusEnabled ? config.upgradeBonusColor : '#4CAF50';
    const itemDescColor = config.itemDescEnabled ? config.itemDescColor : '#cccccc';
    const upgradedColor = config.upgradedEnabled ? config.upgradedColor : '#ffffff';
    const fontFamily = fontPresets[config.selectedFont] || '';
    const fontFamilyCSS = fontFamily ? `font-family: ${fontFamily} !important;` : '';
    const nickBorderColor = config.nickBorderEnabled ? config.nickBorderColor : '#ffffff';

    // ANIMACJE LEGENDARNE
    let legendaryAnimationCSS = '';

        if (config.gradientEnabled) {
        switch(config.legendaryAnimation) {
            case 'gradient':
                // Oryginalny obracający się gradient
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        --a: 0deg;
                        background: linear-gradient(var(--a), #000, #272727) !important;
                        box-shadow: inset 100px 100px 100px 184px #0000007a !important;
                    }
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before,
                    .tip-wrapper[data-item-type=legendary]:after, .tip-wrapper[data-item-type=t-leg]:after {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        background: linear-gradient(var(--a), ${gradientColorsStr}) !important;
                        background-size: 400% !important;
                        width: calc(100% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        z-index: -1 !important;
                        animation: legGradientRotate 7s linear infinite !important;
                    }
                    @property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
                    @keyframes legGradientRotate {
                        from { --a: 0deg; }
                        to { --a: 360deg; }
                    }
                `;
                break;

            case 'wave':
                // Fala przechodząca z góry na dół
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        background: linear-gradient(0deg, #000, #272727) !important;
                        box-shadow: inset 100px 100px 100px 184px #0000007a !important;
                        overflow: hidden !important;
                    }
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(100% + 4px) !important;
                        height: calc(300% + 4px) !important;
                        background: linear-gradient(180deg, ${gradientColorsStr}, ${gradientColorsStr}, ${gradientColorsStr}) !important;
                        z-index: -1 !important;
                        animation: legWave 6s linear infinite !important;
                    }
                    @keyframes legWave {
                        0% { transform: translateY(-66.666%); }
                        100% { transform: translateY(0%); }
                    }
                `;
                break;

            case 'pulse':
                // Pulsowanie kolorów
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        --pulse-index: 0;
                        background: #000 !important;
                        box-shadow: inset 100px 100px 100px 184px #0000007a !important;
                    }
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(100% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        z-index: -1 !important;
                        animation: legPulse 10s linear infinite !important;
                    }
                    @keyframes legPulse {
                        0% { background: ${config.gradientColors[0]}; }
                        10% { background: ${config.gradientColors[1]}; }
                        20% { background: ${config.gradientColors[2]}; }
                        30% { background: ${config.gradientColors[3]}; }
                        40% { background: ${config.gradientColors[4]}; }
                        50% { background: ${config.gradientColors[5]}; }
                        60% { background: ${config.gradientColors[6]}; }
                        70% { background: ${config.gradientColors[7]}; }
                        80% { background: ${config.gradientColors[8]}; }
                        90% { background: ${config.gradientColors[9]}; }
                        100% { background: ${config.gradientColors[0]}; }
                    }
                `;
                break;

            case 'slide':
                // Przesuwanie gradientu poziomo
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        background: #000 !important;
                        box-shadow: inset 100px 100px 100px 184px #0000007a !important;
                        overflow: hidden !important;
                    }
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(200% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        background: linear-gradient(90deg, ${gradientColorsStr}, ${gradientColorsStr}) !important;
                        z-index: -1 !important;
                        animation: legSlide 8s linear infinite !important;
                    }
                    @keyframes legSlide {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                `;
                break;

            case 'glow':
                // Pulsujące świecenie - POPRAWIONE
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        background: #000 !important;
                        animation: legGlowShadow 2s ease-in-out infinite alternate !important;
                    }
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(100% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        background: linear-gradient(135deg, ${gradientColorsStr}) !important;
                        z-index: -1 !important;
                        animation: legGlowOpacity 2s ease-in-out infinite alternate !important;
                    }
                    @keyframes legGlowShadow {
                        0% {
                            box-shadow: 0 0 10px ${config.gradientColors[0]},
                                        0 0 20px ${config.gradientColors[2]},
                                        inset 100px 100px 100px 184px #0000007a;
                        }
                        100% {
                            box-shadow: 0 0 25px ${config.gradientColors[5]},
                                        0 0 45px ${config.gradientColors[7]},
                                        inset 100px 100px 100px 184px #0000007a;
                        }
                    }
                    @keyframes legGlowOpacity {
                        0% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                `;
                break;

            case 'electric':
                // Animacja burzy elektrycznej - błyskawice krążące po ramce
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        --electric-angle: 0deg;
                        background: linear-gradient(var(--electric-angle), #000, #272727) !important;
                        box-shadow: inset 100px 100px 100px 184px #0000007a !important;
                    }

                    /* Warstwa 1 - główne błyskawice */
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(100% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        background: conic-gradient(
                            from var(--electric-angle),
                            transparent 0%,
                            ${config.gradientColors[0]} 3%,
                            transparent 6%,
                            transparent 10%,
                            ${config.gradientColors[2]} 14%,
                            ${config.gradientColors[3]} 16%,
                            transparent 19%,
                            transparent 25%,
                            ${config.gradientColors[4]} 29%,
                            transparent 32%,
                            transparent 38%,
                            ${config.gradientColors[5]} 42%,
                            ${config.gradientColors[6]} 45%,
                            transparent 48%,
                            transparent 55%,
                            ${config.gradientColors[7]} 59%,
                            transparent 62%,
                            transparent 70%,
                            ${config.gradientColors[8]} 74%,
                            ${config.gradientColors[9]} 77%,
                            transparent 80%,
                            transparent 88%,
                            ${config.gradientColors[1]} 92%,
                            transparent 95%,
                            transparent 100%
                        ) !important;
                        z-index: -1 !important;
                        animation: electricRotate 4s linear infinite, electricPulse 0.2s ease-in-out infinite !important;
                        filter: brightness(2.5) blur(0.5px) drop-shadow(0 0 8px ${config.gradientColors[3]}) drop-shadow(0 0 15px ${config.gradientColors[5]}) !important;
                    }

                    /* Warstwa 2 - dodatkowe błyskawice (opóźnione) */
                    .tip-wrapper[data-item-type=legendary]:after, .tip-wrapper[data-item-type=t-leg]:after {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(100% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        background: conic-gradient(
                            from calc(var(--electric-angle) + 180deg),
                            transparent 0%,
                            ${config.gradientColors[1]} 4%,
                            transparent 7%,
                            transparent 15%,
                            ${config.gradientColors[3]} 19%,
                            transparent 22%,
                            transparent 32%,
                            ${config.gradientColors[5]} 37%,
                            ${config.gradientColors[6]} 40%,
                            transparent 43%,
                            transparent 52%,
                            ${config.gradientColors[7]} 57%,
                            transparent 60%,
                            transparent 72%,
                            ${config.gradientColors[9]} 77%,
                            transparent 80%,
                            transparent 90%,
                            ${config.gradientColors[2]} 94%,
                            transparent 97%,
                            transparent 100%
                        ) !important;
                        z-index: -1 !important;
                        animation: electricRotate 4s linear infinite 2s, electricPulse 0.15s ease-in-out infinite 0.1s !important;
                        filter: brightness(2.2) blur(0.5px) drop-shadow(0 0 10px ${config.gradientColors[7]}) drop-shadow(0 0 18px ${config.gradientColors[9]}) !important;
                    }

                    @property --electric-angle {
                        syntax: '<angle>';
                        inherits: false;
                        initial-value: 0deg;
                    }

                    /* Obrót błyskawic */
                    @keyframes electricRotate {
                        from {
                            --electric-angle: 0deg;
                        }
                        to {
                            --electric-angle: 360deg;
                        }
                    }

                    /* Szybkie migotanie jak elektryczność */
                    @keyframes electricPulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }
                `;
                break;
                case 'rainbow':
    // Tęczowa ramka przelatująca po obwodzie
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            --rainbow-pos: 0%;
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background: conic-gradient(
                from 0deg,
                transparent 0%,
                transparent calc(var(--rainbow-pos) - 5%),
                #ff0000 var(--rainbow-pos),
                #ff7700 calc(var(--rainbow-pos) + 2%),
                #ffff00 calc(var(--rainbow-pos) + 4%),
                #00ff00 calc(var(--rainbow-pos) + 6%),
                #0099ff calc(var(--rainbow-pos) + 8%),
                #9933ff calc(var(--rainbow-pos) + 10%),
                transparent calc(var(--rainbow-pos) + 15%),
                transparent 100%
            ) !important;
            z-index: -1 !important;
            animation: rainbowRotate 3s linear infinite !important;
            filter: blur(1px) drop-shadow(0 0 10px currentColor) !important;
        }
        @property --rainbow-pos {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
        }
        @keyframes rainbowRotate {
            from { --rainbow-pos: 0%; }
            to { --rainbow-pos: 100%; }
        }
    `;
    break;

case 'neon':
    // Neonowe migające krawędzie
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background: linear-gradient(90deg,
                ${config.gradientColors[0]} 0%,
                ${config.gradientColors[2]} 25%,
                ${config.gradientColors[4]} 50%,
                ${config.gradientColors[6]} 75%,
                ${config.gradientColors[0]} 100%
            ) !important;
            z-index: -1 !important;
            animation: neonFlicker 0.5s ease-in-out infinite alternate, neonGlow 2s ease-in-out infinite !important;
            filter: drop-shadow(0 0 15px ${config.gradientColors[3]}) drop-shadow(0 0 25px ${config.gradientColors[5]}) !important;
        }
        @keyframes neonFlicker {
            0%, 100% { opacity: 1; }
            25% { opacity: 0.8; }
            50% { opacity: 0.95; }
            75% { opacity: 0.85; }
        }
        @keyframes neonGlow {
            0%, 100% { filter: brightness(1.5) drop-shadow(0 0 15px ${config.gradientColors[3]}); }
            50% { filter: brightness(2.5) drop-shadow(0 0 30px ${config.gradientColors[5]}); }
        }
    `;
    break;

case 'plasma':
    // Efekt plazmy - wirujące plamy kolorów
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            --plasma-angle: 0deg;
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background:
                radial-gradient(ellipse at 20% 30%, ${config.gradientColors[0]} 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, ${config.gradientColors[3]} 0%, transparent 50%),
                radial-gradient(ellipse at 40% 80%, ${config.gradientColors[5]} 0%, transparent 50%),
                radial-gradient(ellipse at 70% 20%, ${config.gradientColors[7]} 0%, transparent 50%),
                linear-gradient(var(--plasma-angle), ${config.gradientColors[2]}, ${config.gradientColors[9]}) !important;
            z-index: -1 !important;
            animation: plasmaRotate 6s linear infinite, plasmaPulse 2s ease-in-out infinite alternate !important;
            filter: blur(2px) brightness(1.5) !important;
        }
        @property --plasma-angle {
            syntax: '<angle>';
            inherits: false;
            initial-value: 0deg;
        }
        @keyframes plasmaRotate {
            from { --plasma-angle: 0deg; }
            to { --plasma-angle: 360deg; }
        }
        @keyframes plasmaPulse {
            0% { opacity: 0.8; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.02); }
        }
    `;
    break;

case 'fire':
    // Realistyczne płomienie z wieloma warstwami
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }

        /* Warstwa 1 - główne płomienie (czerwono-pomarańczowe) */
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            bottom: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background:
                radial-gradient(ellipse at 10% 100%, #ff0000 0%, #ff4500 20%, transparent 40%),
                radial-gradient(ellipse at 30% 100%, #ff2200 0%, #ff6600 25%, transparent 45%),
                radial-gradient(ellipse at 50% 100%, #ff1100 0%, #ff5500 22%, transparent 42%),
                radial-gradient(ellipse at 70% 100%, #ff3300 0%, #ff7700 23%, transparent 43%),
                radial-gradient(ellipse at 90% 100%, #ff0a00 0%, #ff4400 21%, transparent 41%),
                linear-gradient(0deg, #ff0000 0%, #ff4500 15%, #ff8800 35%, transparent 60%) !important;
            z-index: -1 !important;
            animation:
                fireFlicker1 0.15s ease-in-out infinite,
                fireDance1 2s ease-in-out infinite,
                fireIntensity1 1.5s ease-in-out infinite alternate !important;
            filter: blur(2px) !important;
        }

        /* Warstwa 2 - środkowe płomienie (pomarańczowo-żółte) */
        .tip-wrapper[data-item-type=legendary]:after, .tip-wrapper[data-item-type=t-leg]:after {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            bottom: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background:
                radial-gradient(ellipse at 15% 100%, #ff6600 0%, #ffaa00 25%, transparent 50%),
                radial-gradient(ellipse at 40% 100%, #ff7700 0%, #ffbb00 28%, transparent 52%),
                radial-gradient(ellipse at 60% 100%, #ff6600 0%, #ffaa00 26%, transparent 51%),
                radial-gradient(ellipse at 85% 100%, #ff7700 0%, #ffbb00 27%, transparent 50%),
                linear-gradient(0deg, #ff6600 0%, #ffaa00 20%, #ffdd00 40%, transparent 65%) !important;
            z-index: -1 !important;
            animation:
                fireFlicker2 0.12s ease-in-out infinite 0.05s,
                fireDance2 1.8s ease-in-out infinite 0.3s,
                fireIntensity2 1.3s ease-in-out infinite alternate 0.2s !important;
            filter: blur(1.5px) !important;
            mix-blend-mode: screen !important;
        }

        /* Animacje migotania - szybkie, losowe zmiany */
        @keyframes fireFlicker1 {
            0% { opacity: 0.85; }
            25% { opacity: 0.95; }
            50% { opacity: 0.9; }
            75% { opacity: 0.92; }
            100% { opacity: 0.88; }
        }

        @keyframes fireFlicker2 {
            0% { opacity: 0.75; }
            20% { opacity: 0.85; }
            40% { opacity: 0.8; }
            60% { opacity: 0.82; }
            80% { opacity: 0.78; }
            100% { opacity: 0.8; }
        }

        /* Taniec płomieni - ruchy w bok */
        @keyframes fireDance1 {
            0%, 100% {
                transform: translateX(0px) scaleY(1) scaleX(1);
            }
            25% {
                transform: translateX(1px) scaleY(1.02) scaleX(0.98);
            }
            50% {
                transform: translateX(-1px) scaleY(0.98) scaleX(1.02);
            }
            75% {
                transform: translateX(1px) scaleY(1.01) scaleX(0.99);
            }
        }

        @keyframes fireDance2 {
            0%, 100% {
                transform: translateX(0px) scaleY(1) scaleX(1);
            }
            30% {
                transform: translateX(-1px) scaleY(1.03) scaleX(0.97);
            }
            60% {
                transform: translateX(1px) scaleY(0.97) scaleX(1.03);
            }
            80% {
                transform: translateX(-0.5px) scaleY(1.01) scaleX(0.99);
            }
        }

        /* Zmiana intensywności płomieni */
        @keyframes fireIntensity1 {
            0% {
                filter: blur(2px) brightness(1.2);
            }
            100% {
                filter: blur(2.5px) brightness(1.5);
            }
        }

        @keyframes fireIntensity2 {
            0% {
                filter: blur(1.5px) brightness(1.3);
            }
            100% {
                filter: blur(2px) brightness(1.6);
            }
        }
    `;
    break;

case 'matrix':
    // Efekt Matrixa - spadające linie kodu
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -100% !important;
            width: calc(100% + 4px) !important;
            height: 200% !important;
            background: repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 2px,
                ${config.gradientColors[2]} 2px,
                ${config.gradientColors[2]} 4px,
                transparent 4px,
                transparent 10px
            ), linear-gradient(180deg,
                transparent 0%,
                ${config.gradientColors[0]} 30%,
                ${config.gradientColors[4]} 70%,
                transparent 100%
            ) !important;
            z-index: -1 !important;
            animation: matrixFall 3s linear infinite !important;
            opacity: 0.9 !important;
            filter: drop-shadow(0 0 10px ${config.gradientColors[2]}) !important;
        }
        @keyframes matrixFall {
            0% { transform: translateY(0%); }
            100% { transform: translateY(50%); }
        }
    `;
    break;
    case 'lightning':
    // Błyskawice uderzające w ramkę
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background: linear-gradient(135deg,
                ${config.gradientColors[0]} 0%,
                ${config.gradientColors[3]} 50%,
                ${config.gradientColors[0]} 100%
            ) !important;
            z-index: -1 !important;
            animation: lightningStrike 0.8s ease-in-out infinite !important;
            filter: brightness(1.5) drop-shadow(0 0 15px ${config.gradientColors[5]}) !important;
        }
        @keyframes lightningStrike {
            0%, 100% { opacity: 0.3; }
            10% { opacity: 1; }
            15% { opacity: 0.5; }
            20% { opacity: 1; }
            25% { opacity: 0.3; }
        }
    `;
    break;

case 'waterfall':
    // Spadająca kaskada wody
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -100% !important;
            width: calc(100% + 4px) !important;
            height: 300% !important;
            background:
                linear-gradient(180deg,
                    transparent 0%,
                    ${config.gradientColors[0]}33 10%,
                    ${config.gradientColors[2]}66 20%,
                    ${config.gradientColors[4]}99 30%,
                    ${config.gradientColors[4]}66 40%,
                    ${config.gradientColors[2]}33 50%,
                    transparent 60%
                ),
                repeating-linear-gradient(
                    180deg,
                    transparent 0px,
                    ${config.gradientColors[0]}22 5px,
                    transparent 10px
                ) !important;
            z-index: -1 !important;
            animation: waterfallFlow 3s linear infinite !important;
            filter: blur(1px) !important;
        }
        @keyframes waterfallFlow {
            from { transform: translateY(0%); }
            to { transform: translateY(33.333%); }
        }
    `;
    break;

case 'frost':
    // Zamarzanie - lodowe kryształy
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background:
                radial-gradient(circle at 20% 30%, ${config.gradientColors[0]} 0%, transparent 3%),
                radial-gradient(circle at 80% 20%, ${config.gradientColors[2]} 0%, transparent 2%),
                radial-gradient(circle at 40% 70%, ${config.gradientColors[4]} 0%, transparent 4%),
                radial-gradient(circle at 60% 50%, ${config.gradientColors[6]} 0%, transparent 3%),
                radial-gradient(circle at 90% 80%, ${config.gradientColors[8]} 0%, transparent 2%),
                radial-gradient(circle at 10% 90%, ${config.gradientColors[9]} 0%, transparent 3%),
                linear-gradient(135deg, ${config.gradientColors[0]}44, ${config.gradientColors[5]}66) !important;
            z-index: -1 !important;
            animation: frostGrow 2s ease-in-out infinite alternate !important;
            filter: blur(0.5px) brightness(1.8) !important;
        }
        @keyframes frostGrow {
            0% {
                opacity: 0.6;
                transform: scale(1);
            }
            100% {
                opacity: 1;
                transform: scale(1.05);
            }
        }
    `;
    break;

case 'cosmic':
    // Kosmiczne gwiazdy i mgławice
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background:
                radial-gradient(circle at 15% 25%, ${config.gradientColors[0]} 0%, transparent 15%),
                radial-gradient(circle at 85% 30%, ${config.gradientColors[3]} 0%, transparent 18%),
                radial-gradient(circle at 30% 75%, ${config.gradientColors[6]} 0%, transparent 20%),
                radial-gradient(circle at 70% 80%, ${config.gradientColors[9]} 0%, transparent 16%),
                linear-gradient(135deg, ${config.gradientColors[1]}22, ${config.gradientColors[7]}44) !important;
            z-index: -1 !important;
            animation: cosmicTwinkle 3s ease-in-out infinite !important;
            filter: blur(2px) brightness(1.5) !important;
        }
        .tip-wrapper[data-item-type=legendary]:after, .tip-wrapper[data-item-type=t-leg]:after {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background:
                radial-gradient(circle at 50% 20%, ${config.gradientColors[2]}88 0%, transparent 1%),
                radial-gradient(circle at 25% 60%, ${config.gradientColors[5]}88 0%, transparent 1%),
                radial-gradient(circle at 75% 50%, ${config.gradientColors[8]}88 0%, transparent 1%) !important;
            z-index: -1 !important;
            animation: cosmicShine 2s ease-in-out infinite alternate !important;
        }
        @keyframes cosmicTwinkle {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        @keyframes cosmicShine {
            0% { opacity: 0.6; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.5); }
        }
    `;
    break;

case 'shadow':
    // Mroczne cienie pełzające po ramce
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -50% !important;
            top: -2px !important;
            width: 200% !important;
            height: calc(100% + 4px) !important;
            background: linear-gradient(90deg,
                transparent 0%,
                ${config.gradientColors[0]}88 20%,
                ${config.gradientColors[3]}cc 25%,
                ${config.gradientColors[6]}88 30%,
                transparent 40%,
                transparent 60%,
                ${config.gradientColors[8]}88 70%,
                ${config.gradientColors[9]}cc 75%,
                ${config.gradientColors[2]}88 80%,
                transparent 100%
            ) !important;
            z-index: -1 !important;
            animation: shadowCrawl 4s linear infinite !important;
            filter: blur(3px) !important;
        }
        @keyframes shadowCrawl {
            from { transform: translateX(0%); }
            to { transform: translateX(50%); }
        }
    `;
    break;

case 'zigzag':
    // Zygzakowaty piorun biegnący po obwodzie
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            --zigzag-offset: 0%;
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -2px !important;
            width: calc(100% + 4px) !important;
            height: calc(100% + 4px) !important;
            background: repeating-conic-gradient(
                from 0deg,
                transparent 0%,
                transparent calc(var(--zigzag-offset) - 2%),
                ${config.gradientColors[0]} calc(var(--zigzag-offset) - 1%),
                ${config.gradientColors[3]} var(--zigzag-offset),
                ${config.gradientColors[6]} calc(var(--zigzag-offset) + 1%),
                transparent calc(var(--zigzag-offset) + 2%),
                transparent calc(var(--zigzag-offset) + 8%)
            ) !important;
            z-index: -1 !important;
            animation: zigzagMove 2s linear infinite !important;
            filter: brightness(2) drop-shadow(0 0 8px ${config.gradientColors[5]}) !important;
        }
        @property --zigzag-offset {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
        }
        @keyframes zigzagMove {
            from { --zigzag-offset: 0%; }
            to { --zigzag-offset: 100%; }
        }
    `;
    break;

case 'bubble':
    // Pływające bąbelki
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            bottom: -100% !important;
            width: calc(100% + 4px) !important;
            height: 300% !important;
            background:
                radial-gradient(circle at 20% 90%, ${config.gradientColors[0]}aa 0%, transparent 4%),
                radial-gradient(circle at 40% 70%, ${config.gradientColors[2]}aa 0%, transparent 5%),
                radial-gradient(circle at 60% 85%, ${config.gradientColors[4]}aa 0%, transparent 3%),
                radial-gradient(circle at 80% 75%, ${config.gradientColors[6]}aa 0%, transparent 6%),
                radial-gradient(circle at 30% 50%, ${config.gradientColors[8]}aa 0%, transparent 4%),
                radial-gradient(circle at 70% 60%, ${config.gradientColors[9]}aa 0%, transparent 5%),
                linear-gradient(180deg, transparent 0%, ${config.gradientColors[5]}33 100%) !important;
            z-index: -1 !important;
            animation: bubbleRise 6s linear infinite !important;
        }
        @keyframes bubbleRise {
            from { transform: translateY(0%); }
            to { transform: translateY(-66.666%); }
        }
    `;
    break;

case 'scanner':
    // Skanujący promień (jak w filmach sci-fi)
    legendaryAnimationCSS = `
        .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
            background: #000 !important;
            box-shadow: inset 100px 100px 100px 184px #0000007a !important;
            overflow: hidden !important;
        }
        .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
            content: '' !important;
            position: absolute !important;
            left: -2px !important;
            top: -100% !important;
            width: calc(100% + 4px) !important;
            height: 300% !important;
            background: linear-gradient(180deg,
                transparent 0%,
                transparent 45%,
                ${config.gradientColors[0]}00 46%,
                ${config.gradientColors[0]}44 47%,
                ${config.gradientColors[3]}cc 49%,
                ${config.gradientColors[6]}ff 50%,
                ${config.gradientColors[3]}cc 51%,
                ${config.gradientColors[0]}44 53%,
                ${config.gradientColors[0]}00 54%,
                transparent 55%,
                transparent 100%
            ) !important;
            z-index: -1 !important;
            animation: scannerMove 3s linear infinite !important;
            filter: drop-shadow(0 0 10px ${config.gradientColors[5]}) !important;
        }
        @keyframes scannerMove {
            from { transform: translateY(0%); }
            to { transform: translateY(33.333%); }
        }
    `;
    break;
            case 'spin':
                // Statyczny gradient pionowy (bez animacji) - ZMIENIONE
                legendaryAnimationCSS = `
                    .tip-wrapper[data-item-type=legendary], .tip-wrapper[data-item-type=t-leg] {
                        background: #000 !important;
                        box-shadow: inset 100px 100px 100px 184px #0000007a !important;
                    }
                    .tip-wrapper[data-item-type=legendary]:before, .tip-wrapper[data-item-type=t-leg]:before {
                        content: '' !important;
                        position: absolute !important;
                        left: -2px !important;
                        top: -2px !important;
                        width: calc(100% + 4px) !important;
                        height: calc(100% + 4px) !important;
                        background: linear-gradient(180deg, ${gradientColorsStr}) !important;
                        z-index: -1 !important;
                    }
                `;
                break;
        }
    }

    const tooltipStyles = `
        <style id="custom-tooltips-style">
        /*ANIMOWANE-TIPY - WSZYSTKO Z !important*/
        .item-type{text-align:left !important;}
        .tip-wrapper.normal-tip {box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${widgetBorderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${widgetGlowColor} 0px 1px 24px -4px !important;}
        .tip-wrapper{box-shadow: 0 0 0 0 #000000, 0 0 0 1px ${borderColor}, 0 0 0 2px #000000, 0 0 0 3px #2b272700, 0 0 0 4px rgb(15 15 15 / 0%), 0 0 0 5px rgb(15 15 15 / 0%), 0 0 0 6px #5a585b00, 0 0 0 7px #2c262500 !important;}
        .tip-wrapper .content {padding: 5px !important; background: rgba(15, 15, 15,.85) !important; word-break: break-word !important; ${fontFamilyCSS}}
        .tip-wrapper[data-type=t_item] .item-head {border:1px solid #1e1e1e66 !important; border-radius: 2px !important; background: hsl(0deg 0% 4.87% / 10%) !important;}
        .tip-wrapper[data-type=t_item] .item-head .cl-icon {border: 1px solid rgba(15, 15, 15,.3) !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section {border-bottom: 1px solid rgba(15, 15, 15,.5) !important;}
        .tip-wrapper .content .info-wrapper .nick {color: #79e1c5 !important; font-family: Cinzel !important; font-size: 11px !important; text-shadow: 0 0 4px black !important; border: 1px solid ${nickBorderColor} !important; border-radius: 2px !important; background: ${nickBorderColor}20 !important;}
        .tip-wrapper[data-type=t_other] {box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${characterBorderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${characterGlowColor} 0px 1px 24px -4px !important;}
        .tip-wrapper[data-type=t_other] .line {border-bottom:1px solid ${widgetBorderColor} !important; background: none !important;}
        .tip-wrapper[data-item-type=t-leg]{box-shadow: rgb(43, 40, 42) 0px 0px 0px 0px, ${borderColor} 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(43 39 39 / 0%) 0px 0px 0px 3px, rgb(90 89 89 / 0%) 0px 0px 0px 4px, rgb(70 163 29 / 0%) 0px 0px 0px 5px, rgb(90 88 91 / 0%) 0px 0px 0px 6px, rgb(44 38 37 / 0%) 0px 0px 0px 7px, ${glowColor} 0px 1px 24px -4px !important;}
        .tip-wrapper[data-item-type=legendary] .item-head .legendary, .tip-wrapper[data-item-type=t-leg] .item-head .legendary {color: ${legendaryLabelColor} !important; text-align: center !important; font-size: 13px !important; font-weight: 700 !important; text-shadow: 1px 1px ${legendaryLabelColor}42 !important;}
        .tip-wrapper[data-item-type=legendary] .item-tip-section .legendary, .tip-wrapper[data-item-type=t-leg] .item-tip-section .legendary {color: ${legendaryNameColor} !important; text-align: center !important; font-size: 13px !important; font-weight: 700 !important; text-shadow: 1px 1px ${legendaryNameColor}42 !important;}
        .tip-wrapper[data-type=t_item] .tip-item-stat-legbon {color: ${legbonColor} !important; font-weight: 600 !important;}
        .tip-wrapper[data-type=t_item] .tip-item-stat-bonus {color: ${upgradeBonusColor} !important; font-weight: 600 !important;}
        .tip-wrapper[data-type=t_item] .tip-item-stat-opis {color: ${itemDescColor} !important;}
        .tip-wrapper[data-type=t_item] .item-head .item-type{padding-left: 48px !important; margin-left: 0px !important;}
        .tip-wrapper.normal-tip .damage, .tip-wrapper.sticky-tip .damage {color: ${damageColor} !important; font-weight: 999 !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section.s-7{color: white !important; font-weight: 700 !important;}
        .tip-wrapper[data-type=t_item] i.looter{color: ${textColor} !important; text-align: center !important;}
        .tip-wrapper[data-type=t_item] .item-tip-section.s-5{color: ${textColor} !important; text-align: center !important; font-weight: 600 !important;}
        .tip-wrapper[data-item-type=t-upgraded], .tip-wrapper[data-item-type=upgraded]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px ${borderColor}, 0 0 0 2px #111911, 0 0 0 3px #2b2727, 0 0 0 4px #59595a, 0 0 0 5px ${upgradedColor}, 0 0 0 6px #5a585b, 0 0 0 7px #2c2625 !important;}
        .tip-wrapper[data-type=t_item] .item-head .upgraded, .tip-wrapper[data-type=t_item] .item-tip-section .upgraded{color: ${upgradedColor} !important;}
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

        /*lega tip - ANIMACJE*/
        ${legendaryAnimationCSS}
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
        <div class="custom-tooltips-dialog" style="width: 500px; height: 600px; max-height: 90vh; display: flex; flex-direction: column;">
            <div class="custom-tooltips-header" id="tooltip-header">
                <h3>Tooltips Styler - Settings</h3>
                <button class="custom-tooltips-close" id="tooltip-close">×</button>
            </div>

            <!-- ZAKŁADKI -->
            <div style="display: flex; background: #1a1a1a; border-bottom: 1px solid #444; flex-shrink: 0;">
                <button class="tooltip-tab active" data-tab="items">Itemy</button>
                <button class="tooltip-tab" data-tab="widgets">Widgety i NPC</button>
                <button class="tooltip-tab" data-tab="character">Postać</button>
            </div>

            <div class="custom-tooltips-content" id="tooltip-scroll-content" style="flex: 1; overflow-y: auto;">
                <!-- ZAKŁADKA: ITEMY -->
                <div class="tooltip-tab-content active" data-tab="items">
                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="border-enabled" ${config.borderEnabled ? 'checked' : ''}>
                            Kolor ramki
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="border-color-text" value="${config.borderColor}" ${!config.borderEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="border-color" value="${config.borderColor}" ${!config.borderEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor obramowania tooltipów przedmiotów</div>
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
                        <div class="tooltip-setting-description">Kolor nazwy przedmiotu legendarnego (działa tylko na legach!)</div>
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
                        <div class="tooltip-setting-description">Kolor napisu "Legendarny" (działa tylko na legach!)</div>
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
                        <div class="tooltip-setting-description">Kolor wzmocnienia przedmiotu (działa tylko na przedmiotach ulepszonych na +5!)</div>
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
                        <div class="tooltip-setting-description">Kolor opisów przedmiotów (w tym eventy itp itd)</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="upgraded-enabled" ${config.upgradedEnabled ? 'checked' : ''}>
                            Kolor ulepszonych przedmiotów
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="upgraded-color-text" value="${config.upgradedColor}" ${!config.upgradedEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="upgraded-color" value="${config.upgradedColor}" ${!config.upgradedEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor nazw ulepszonych przedmiotów</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            Wybierz animację legendarnych przedmiotów
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="gradient" ${config.legendaryAnimation === 'gradient' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Obracający się gradient</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="wave" ${config.legendaryAnimation === 'wave' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Fala z góry na dół</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="pulse" ${config.legendaryAnimation === 'pulse' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Pulsowanie kolorami</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="slide" ${config.legendaryAnimation === 'slide' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Przesuwanie poziome</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="glow" ${config.legendaryAnimation === 'glow' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Pulsujące świecenie</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="electric" ${config.legendaryAnimation === 'electric' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Disco (EPILEPSJA)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="rainbow" ${config.legendaryAnimation === 'rainbow' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Tęcza</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="neon" ${config.legendaryAnimation === 'neon' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Neon (EPILEPSJA)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="plasma" ${config.legendaryAnimation === 'plasma' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Plazma</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="fire" ${config.legendaryAnimation === 'fire' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Płomienie</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="matrix" ${config.legendaryAnimation === 'matrix' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Matrix</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="lightning" ${config.legendaryAnimation === 'lightning' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Błyskawice (EPILEPSJA)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="waterfall" ${config.legendaryAnimation === 'waterfall' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Wodospad</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="frost" ${config.legendaryAnimation === 'frost' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Notificator</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="cosmic" ${config.legendaryAnimation === 'cosmic' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Mgła</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="shadow" ${config.legendaryAnimation === 'shadow' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Pełzające cienie</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="zigzag" ${config.legendaryAnimation === 'zigzag' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">70's Party (EPILEPSJA)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="bubble" ${config.legendaryAnimation === 'bubble' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Bąbelki</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="scanner" ${config.legendaryAnimation === 'scanner' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Scanner</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="legendary-animation" value="spin" ${config.legendaryAnimation === 'spin' ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: #ccc; font-size: 12px;">Gradient bez animacji</span>
                            </label>
                        </div>
                        <div class="tooltip-setting-description" style="margin-top: 8px;">
                            Wybierz typ animacji dla obramowania legendarnych przedmiotów
                        </div>
                    </div>

<div class="tooltip-setting-group">
    <label class="tooltip-setting-label">
        <input type="checkbox" class="tooltip-checkbox" id="gradient-enabled" ${config.gradientEnabled ? 'checked' : ''}>
        Kolory gradientu (animacja legendarnych przedmiotów)
    </label>
    <div class="tooltip-setting-description" style="margin-bottom: 10px;">Zmień kolory animowanej ramki dla legendarnych przedmiotów</div>

    <!-- WYBÓR LICZBY KOLORÓW -->
    <div style="margin: 10px 0; padding: 10px; background: #2a2a2a; border-radius: 3px;">
        <label style="color: #ccc; font-size: 12px; display: block; margin-bottom: 8px;">
            Liczba kolorów w animacji:
        </label>
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="number" id="gradient-color-count" min="1" max="20" value="${config.gradientColors.length}"
                   style="width: 80px; padding: 8px; background: #555; border: 1px solid #666; border-radius: 3px; color: #fff; font-size: 12px; text-align: center;">
            <button class="tooltip-btn tooltip-btn-secondary" id="apply-color-count" style="flex: 1;">Zastosuj</button>
        </div>
        <div class="tooltip-setting-description" style="margin-top: 5px;">
            Wpisz liczbę od 1 do 20 i kliknij "Zastosuj"
        </div>
    </div>

    <div class="tooltip-gradient-inputs" id="gradient-colors-container">
        ${config.gradientColors.map((color, index) => `
            <div class="tooltip-gradient-item" data-color-index="${index}">
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

                <!-- ZAKŁADKA: WIDGETY -->
                <div class="tooltip-tab-content" data-tab="widgets">
                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="widget-border-enabled" ${config.widgetBorderEnabled ? 'checked' : ''}>
                            Kolor ramki widgetów i NPC
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="widget-border-color-text" value="${config.widgetBorderColor}" ${!config.widgetBorderEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="widget-border-color" value="${config.widgetBorderColor}" ${!config.widgetBorderEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor ramki dla tooltipów widgetów i NPC</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="widget-glow-enabled" ${config.widgetGlowEnabled ? 'checked' : ''}>
                            Kolor świecenia widgetów i NPC
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="widget-glow-color-text" value="${config.widgetGlowColor}" ${!config.widgetGlowEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="widget-glow-color" value="${config.widgetGlowColor}" ${!config.widgetGlowEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor efektu świecenia dla tooltipów widgetów i NPC</div>
                    </div>
                </div>

                <!-- ZAKŁADKA: POSTAĆ -->
                <div class="tooltip-tab-content" data-tab="character">
                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="character-border-enabled" ${config.characterBorderEnabled ? 'checked' : ''}>
                            Kolor ramki postaci
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="character-border-color-text" value="${config.characterBorderColor}" ${!config.characterBorderEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="character-border-color" value="${config.characterBorderColor}" ${!config.characterBorderEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor ramki dla tooltipów postaci</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="character-glow-enabled" ${config.characterGlowEnabled ? 'checked' : ''}>
                            Kolor świecenia postaci
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="character-glow-color-text" value="${config.characterGlowColor}" ${!config.characterGlowEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="character-glow-color" value="${config.characterGlowColor}" ${!config.characterGlowEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor efektu świecenia dla tooltipów postaci</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">
                            <input type="checkbox" class="tooltip-checkbox" id="nick-border-enabled" ${config.nickBorderEnabled ? 'checked' : ''}>
                            Kolor ramki nicku w tooltipie
                        </label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="nick-border-color-text" value="${config.nickBorderColor}" ${!config.nickBorderEnabled ? 'disabled' : ''}>
                            <input type="color" class="tooltip-color-picker" id="nick-border-color" value="${config.nickBorderColor}" ${!config.nickBorderEnabled ? 'disabled' : ''}>
                        </div>
                        <div class="tooltip-setting-description">Kolor ramki wokół nicku w tooltipie</div>
                    </div>
                </div>
            </div>

            <div class="tooltip-buttons" style="flex-shrink: 0;">
                <button class="tooltip-btn tooltip-btn-success" id="tooltip-export">Eksportuj</button>
                <button class="tooltip-btn tooltip-btn-info" id="tooltip-import">Importuj</button>
                <button class="tooltip-btn tooltip-btn-reset" id="tooltip-reset">Reset</button>
                <button class="tooltip-btn tooltip-btn-primary" id="tooltip-save">Zapisz</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

function refreshGradientInputs() {
    const container = document.getElementById('gradient-colors-container');
    container.innerHTML = config.gradientColors.map((color, index) => `
        <div class="tooltip-gradient-item" data-color-index="${index}">
            <span class="tooltip-gradient-number">${index + 1}.</span>
            <input type="text" class="gradient-color-text" data-index="${index}" value="${color}">
            <input type="color" class="gradient-color-picker" data-index="${index}" value="${color}">
        </div>
    `).join('');

    // Aktualizuj pole z liczbą kolorów
    const countInput = document.getElementById('gradient-color-count');
    if (countInput) {
        countInput.value = config.gradientColors.length;
    }

    // Ponownie podepnij eventy
    container.querySelectorAll('.gradient-color-text').forEach(input => {
        const index = parseInt(input.getAttribute('data-index'));
        const picker = container.querySelector(`.gradient-color-picker[data-index="${index}"]`);

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
}
// Obsługa radio buttonów wyboru ilości kolorów
let selectedColorCount = config.gradientColors.length;

function updateVisibleColors(count) {
    const allItems = document.querySelectorAll('.tooltip-gradient-item');
    allItems.forEach((item, index) => {
        item.style.display = index < count ? 'flex' : 'none';
    });
    selectedColorCount = count;
}

document.querySelectorAll('input[name="gradient-count"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === '1') {
            updateVisibleColors(1);
        } else if (e.target.value === '2') {
            updateVisibleColors(2);
        } else {
            updateVisibleColors(config.gradientColors.length);
        }
    });
});
// Przycisk "Zastosuj" - zmienia liczbę kolorów
document.getElementById('apply-color-count').addEventListener('click', () => {
    const countInput = document.getElementById('gradient-color-count');
    let newCount = parseInt(countInput.value);

    // Walidacja
    if (isNaN(newCount) || newCount < 1) {
        newCount = 1;
        countInput.value = 1;
    }
    if (newCount > 20) {
        newCount = 20;
        countInput.value = 20;
    }

    const currentCount = config.gradientColors.length;

    if (newCount > currentCount) {
        // Dodaj brakujące kolory
        for (let i = currentCount; i < newCount; i++) {
            config.gradientColors.push('#ffffff');
        }
    } else if (newCount < currentCount) {
        // Usuń nadmiarowe kolory
        config.gradientColors = config.gradientColors.slice(0, newCount);
    }

    refreshGradientInputs();
    showNotification(`Liczba kolorów zmieniona na ${newCount}`, 'success');
});

// Enter w polu liczby = też zastosuj
document.getElementById('gradient-color-count').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('apply-color-count').click();
    }
});

    // ===== OBSŁUGA ZAKŁADEK =====
    const tabs = modal.querySelectorAll('.tooltip-tab');
    const tabContents = modal.querySelectorAll('.tooltip-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Usuń active ze wszystkich
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Dodaj active do klikniętej
            tab.classList.add('active');
            const targetContent = modal.querySelector(`.tooltip-tab-content[data-tab="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

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
    setupCheckboxToggle('widget-border-enabled', 'widget-border-color-text', 'widget-border-color', 'widgetBorderEnabled');
    setupCheckboxToggle('widget-glow-enabled', 'widget-glow-color-text', 'widget-glow-color', 'widgetGlowEnabled');
    setupCheckboxToggle('character-border-enabled', 'character-border-color-text', 'character-border-color', 'characterBorderEnabled');
    setupCheckboxToggle('character-glow-enabled', 'character-glow-color-text', 'character-glow-color', 'characterGlowEnabled');
    setupCheckboxToggle('glow-enabled', 'glow-color-text', 'glow-color', 'glowEnabled');
    setupCheckboxToggle('text-enabled', 'text-color-text', 'text-color', 'textEnabled');
    setupCheckboxToggle('damage-enabled', 'damage-color-text', 'damage-color', 'damageEnabled');
    setupCheckboxToggle('legendary-label-enabled', 'legendary-label-color-text', 'legendary-label-color', 'legendaryLabelEnabled');
    setupCheckboxToggle('legendary-name-enabled', 'legendary-name-color-text', 'legendary-name-color', 'legendaryNameEnabled');
    setupCheckboxToggle('legbon-enabled', 'legbon-color-text', 'legbon-color', 'legbonEnabled');
    setupCheckboxToggle('upgrade-bonus-enabled', 'upgrade-bonus-color-text', 'upgrade-bonus-color', 'upgradeBonusEnabled');
    setupCheckboxToggle('item-desc-enabled', 'item-desc-color-text', 'item-desc-color', 'itemDescEnabled');
    setupCheckboxToggle('upgraded-enabled', 'upgraded-color-text', 'upgraded-color', 'upgradedEnabled');
    setupCheckboxToggle('nick-border-enabled', 'nick-border-color-text', 'nick-border-color', 'nickBorderEnabled');

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
    setupColorSync('widget-border-color-text', 'widget-border-color', 'widgetBorderColor');
    setupColorSync('widget-glow-color-text', 'widget-glow-color', 'widgetGlowColor');
    setupColorSync('character-border-color-text', 'character-border-color', 'characterBorderColor');
    setupColorSync('character-glow-color-text', 'character-glow-color', 'characterGlowColor');
    setupColorSync('glow-color-text', 'glow-color', 'glowColor');
    setupColorSync('text-color-text', 'text-color', 'textColor');
    setupColorSync('damage-color-text', 'damage-color', 'damageColor');
    setupColorSync('legendary-label-color-text', 'legendary-label-color', 'legendaryLabelColor');
    setupColorSync('legendary-name-color-text', 'legendary-name-color', 'legendaryNameColor');
    setupColorSync('legbon-color-text', 'legbon-color', 'legbonColor');
    setupColorSync('upgrade-bonus-color-text', 'upgrade-bonus-color', 'upgradeBonusColor');
    setupColorSync('item-desc-color-text', 'item-desc-color', 'itemDescColor');
    setupColorSync('upgraded-color-text', 'upgraded-color', 'upgradedColor');
    setupColorSync('nick-border-color-text', 'nick-border-color', 'nickBorderColor');

    // Gradient colors - inicjalizacja
    refreshGradientInputs();

    // Font select
    const fontSelect = document.getElementById('font-select');
    fontSelect.addEventListener('change', (e) => {
        config.selectedFont = e.target.value;
    });

    // Animacje
    document.querySelectorAll('input[name="legendary-animation"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            config.legendaryAnimation = e.target.value;
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
        config.widgetBorderColor = '#ffffff';
        config.widgetBorderEnabled = true;
        config.widgetGlowColor = '#e0e0e0';
        config.widgetGlowEnabled = true;
        config.characterBorderColor = '#ffffff';
        config.characterBorderEnabled = true;
        config.characterGlowColor = '#e0e0e0';
        config.characterGlowEnabled = true;
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
        config.upgradedColor = '#ffffff';
        config.upgradedEnabled = true;
        config.selectedFont = 'Domyślna';
        config.legendaryAnimation = 'gradient';
        config.nickBorderColor = '#ffffff';
        config.nickBorderEnabled = true;

        // Odśwież interfejs
        document.getElementById('border-color-text').value = config.borderColor;
        document.getElementById('border-color').value = config.borderColor;
        document.getElementById('border-enabled').checked = true;
        document.getElementById('border-color-text').disabled = false;
        document.getElementById('border-color').disabled = false;

        document.getElementById('widget-border-color-text').value = config.widgetBorderColor;
        document.getElementById('widget-border-color').value = config.widgetBorderColor;
        document.getElementById('widget-border-enabled').checked = true;
        document.getElementById('widget-border-color-text').disabled = false;
        document.getElementById('widget-border-color').disabled = false;

        document.getElementById('widget-glow-color-text').value = config.widgetGlowColor;
        document.getElementById('widget-glow-color').value = config.widgetGlowColor;
        document.getElementById('widget-glow-enabled').checked = true;
        document.getElementById('widget-glow-color-text').disabled = false;
        document.getElementById('widget-glow-color').disabled = false;

        document.getElementById('character-border-color-text').value = config.characterBorderColor;
        document.getElementById('character-border-color').value = config.characterBorderColor;
        document.getElementById('character-border-enabled').checked = true;
        document.getElementById('character-border-color-text').disabled = false;
        document.getElementById('character-border-color').disabled = false;

        document.getElementById('character-glow-color-text').value = config.characterGlowColor;
        document.getElementById('character-glow-color').value = config.characterGlowColor;
        document.getElementById('character-glow-enabled').checked = true;
        document.getElementById('character-glow-color-text').disabled = false;
        document.getElementById('character-glow-color').disabled = false;

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

        refreshGradientInputs();

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

        document.querySelector('input[name="legendary-animation"][value="gradient"]').checked = true;

        document.getElementById('nick-border-color-text').value = config.nickBorderColor;
        document.getElementById('nick-border-color').value = config.nickBorderColor;
        document.getElementById('nick-border-enabled').checked = true;

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
