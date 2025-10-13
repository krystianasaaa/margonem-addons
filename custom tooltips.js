(function() {
    'use strict';
    
    if (window.customTooltipsRunning) {
        return;
    }
    window.customTooltipsRunning = true;

    // Domyślna konfiguracja
    let config = {
        enabled: localStorage.getItem('customTooltipsEnabled') !== 'false',
        borderColor: localStorage.getItem('customTooltipsBorderColor') || '#00ff2a',
        glowColor: localStorage.getItem('customTooltipsGlowColor') || '#38ff60',
        textColor: localStorage.getItem('customTooltipsTextColor') || '#00ff2a',
        damageColor: localStorage.getItem('customTooltipsDamageColor') || '#00cd1a',
        gradientColors: JSON.parse(localStorage.getItem('customTooltipsGradientColors') || 
            '["#29ff68", "#3fff89", "#1dff6b", "#20b753", "#13bb47", "#4dff94", "#25ff6e", "#21bb6d", "#00c567", "#2fc75e"]')
    };

    function saveConfig() {
        localStorage.setItem('customTooltipsEnabled', config.enabled.toString());
        localStorage.setItem('customTooltipsBorderColor', config.borderColor);
        localStorage.setItem('customTooltipsGlowColor', config.glowColor);
        localStorage.setItem('customTooltipsTextColor', config.textColor);
        localStorage.setItem('customTooltipsDamageColor', config.damageColor);
        localStorage.setItem('customTooltipsGradientColors', JSON.stringify(config.gradientColors));
    }

    const styles = `
        .custom-tooltips-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .custom-tooltips-dialog {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #7b2cbf;
            border-radius: 12px;
            padding: 0;
            width: 650px;
            max-width: 90vw;
            max-height: 85vh;
            color: #e8f4fd;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .custom-tooltips-header {
            background: #7b2cbf;
            padding: 15px 20px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px 10px 0 0;
        }

        .custom-tooltips-header h3 {
            margin: 0;
            color: #fff;
            font-size: 18px;
        }

        .custom-tooltips-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }

        .custom-tooltips-close:hover {
            background: rgba(255,255,255,0.2);
        }

        .custom-tooltips-content {
            overflow-y: auto;
            flex: 1;
            padding: 20px;
            scrollbar-width: thin;
            scrollbar-color: #7b2cbf rgba(0,0,0,0.2);
        }

        .custom-tooltips-content::-webkit-scrollbar {
            width: 12px;
        }

        .custom-tooltips-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 6px;
        }

        .custom-tooltips-content::-webkit-scrollbar-thumb {
            background: #7b2cbf;
            border-radius: 6px;
            border: 2px solid rgba(0,0,0,0.2);
        }

        .custom-tooltips-content::-webkit-scrollbar-thumb:hover {
            background: #9d4edd;
        }

        .tooltip-setting-group {
            margin-bottom: 20px;
            background: rgba(157,78,221,0.1);
            border: 1px solid #7b2cbf;
            border-radius: 8px;
            padding: 15px;
        }

        .tooltip-setting-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #a8dadc;
            font-size: 14px;
        }

        .tooltip-color-input-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .tooltip-color-input {
            flex: 1;
            padding: 8px;
            background: rgba(157,78,221,0.2);
            border: 1px solid #7b2cbf;
            border-radius: 6px;
            color: #e8f4fd;
            font-size: 14px;
        }

        .tooltip-color-picker {
            width: 50px;
            height: 40px;
            border: 2px solid #7b2cbf;
            border-radius: 6px;
            cursor: pointer;
            background: transparent;
        }

        .tooltip-setting-description {
            font-size: 12px;
            color: #a8dadc;
            margin-top: 5px;
            line-height: 1.4;
        }

        .tooltip-gradient-inputs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
        }

        .tooltip-gradient-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tooltip-gradient-item input[type="text"] {
            flex: 1;
            padding: 6px;
            background: rgba(0,0,0,0.3);
            border: 1px solid #7b2cbf;
            border-radius: 4px;
            color: #e8f4fd;
            font-size: 12px;
        }

        .tooltip-gradient-item input[type="color"] {
            width: 35px;
            height: 35px;
            border: 2px solid #7b2cbf;
            border-radius: 4px;
            cursor: pointer;
        }

        .tooltip-buttons {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            padding: 15px 20px;
            background: rgba(0,0,0,0.2);
            border-radius: 0 0 10px 10px;
        }

        .tooltip-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .tooltip-btn-primary {
            background: #9d4edd;
            color: white;
            flex: 1;
        }

        .tooltip-btn-primary:hover {
            background: #7b2cbf;
        }

        .tooltip-btn-secondary {
            background: #666;
            color: white;
        }

        .tooltip-btn-secondary:hover {
            background: #555;
        }

        .tooltip-btn-reset {
            background: #dc3545;
            color: white;
        }

        .tooltip-btn-reset:hover {
            background: #c82333;
        }

        .tooltip-preview {
            background: rgba(0,0,0,0.3);
            border: 2px solid #7b2cbf;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
        }

        .tooltip-preview-title {
            font-size: 12px;
            color: #a8dadc;
            margin-bottom: 15px;
            font-weight: bold;
        }

        .tooltip-preview-box {
            display: inline-block;
            padding: 15px;
            border-radius: 4px;
            position: relative;
        }

        .tooltip-preview-text {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .tooltip-preview-damage {
            font-size: 12px;
        }

        .tooltip-toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .tooltip-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .tooltip-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #666;
            transition: .4s;
            border-radius: 34px;
        }

        .tooltip-toggle-slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .tooltip-toggle-slider {
            background-color: #9d4edd;
        }

        input:checked + .tooltip-toggle-slider:before {
            transform: translateX(26px);
        }

        .tooltip-toggle-container {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
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
            *ANIMOWANE-TIPY*/
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

    function updatePreview() {
        const preview = document.querySelector('.tooltip-preview-box');
        if (!preview) return;

        preview.style.border = `2px solid ${config.borderColor}`;
        preview.style.boxShadow = `0 0 20px ${config.glowColor}`;
        
        const text = preview.querySelector('.tooltip-preview-text');
        if (text) text.style.color = config.textColor;
        
        const damage = preview.querySelector('.tooltip-preview-damage');
        if (damage) damage.style.color = config.damageColor;
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
                    <h3>⚙️ Custom Tooltips - Ustawienia</h3>
                    <button class="custom-tooltips-close" id="tooltip-close">×</button>
                </div>
                
                <div class="custom-tooltips-content">
                    <div class="tooltip-toggle-container">
                        <span style="color: #a8dadc; font-weight: bold;">Włącz dodatek:</span>
                        <label class="tooltip-toggle-switch">
                            <input type="checkbox" id="tooltip-enabled" ${config.enabled ? 'checked' : ''}>
                            <span class="tooltip-toggle-slider"></span>
                        </label>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">Kolor ramki</label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="border-color-text" value="${config.borderColor}">
                            <input type="color" class="tooltip-color-picker" id="border-color" value="${config.borderColor}">
                        </div>
                        <div class="tooltip-setting-description">Główny kolor obramowania tooltipów</div>
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
                        <label class="tooltip-setting-label">Kolor tekstu (legendary/unique)</label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="text-color-text" value="${config.textColor}">
                            <input type="color" class="tooltip-color-picker" id="text-color" value="${config.textColor}">
                        </div>
                        <div class="tooltip-setting-description">Kolor nazw przedmiotów legendarnych i unikalnych</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">Kolor obrażeń</label>
                        <div class="tooltip-color-input-wrapper">
                            <input type="text" class="tooltip-color-input" id="damage-color-text" value="${config.damageColor}">
                            <input type="color" class="tooltip-color-picker" id="damage-color" value="${config.damageColor}">
                        </div>
                        <div class="tooltip-setting-description">Kolor wartości obrażeń na przedmiotach</div>
                    </div>

                    <div class="tooltip-setting-group">
                        <label class="tooltip-setting-label">Kolory gradientu (animacja legendarnych przedmiotów)</label>
                        <div class="tooltip-setting-description" style="margin-bottom: 10px;">Zmień kolory animowanej ramki dla legendarnych przedmiotów</div>
                        <div class="tooltip-gradient-inputs">
                            ${config.gradientColors.map((color, index) => `
                                <div class="tooltip-gradient-item">
                                    <span style="color: #a8dadc; font-size: 11px; min-width: 30px;">${index + 1}.</span>
                                    <input type="text" class="gradient-color-text" data-index="${index}" value="${color}">
                                    <input type="color" class="gradient-color-picker" data-index="${index}" value="${color}">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="tooltip-preview">
                        <div class="tooltip-preview-title">Podgląd:</div>
                        <div class="tooltip-preview-box" style="border: 2px solid ${config.borderColor}; box-shadow: 0 0 20px ${config.glowColor};">
                            <div class="tooltip-preview-text" style="color: ${config.textColor};">Legendarny Miecz</div>
                            <div class="tooltip-preview-damage" style="color: ${config.damageColor};">Obrażenia: 100-150</div>
                        </div>
                    </div>
                </div>

                <div class="tooltip-buttons">
                    <button class="tooltip-btn tooltip-btn-reset" id="tooltip-reset">Resetuj do zielonego</button>
                    <button class="tooltip-btn tooltip-btn-secondary" id="tooltip-cancel">Anuluj</button>
                    <button class="tooltip-btn tooltip-btn-primary" id="tooltip-save">Zapisz i zastosuj</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

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
                    updatePreview();
                }
            });

            colorPicker.addEventListener('input', (e) => {
                const value = e.target.value;
                textInput.value = value;
                config[configKey] = value;
                updatePreview();
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
                    updatePreview();
                }
            });

            picker.addEventListener('input', (e) => {
                const value = e.target.value;
                input.value = value;
                config.gradientColors[index] = value;
                updatePreview();
            });
        });

        // Enable/disable toggle
        document.getElementById('tooltip-enabled').addEventListener('change', (e) => {
            config.enabled = e.target.checked;
        });

        // Zamknij
        document.getElementById('tooltip-close').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('tooltip-cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Reset do zielonego
        document.getElementById('tooltip-reset').addEventListener('click', () => {
            config.borderColor = '#00ff2a';
            config.glowColor = '#38ff60';
            config.textColor = '#00ff2a';
            config.damageColor = '#00cd1a';
            config.gradientColors = [
                "#29ff68", "#3fff89", "#1dff6b", "#20b753", "#13bb47",
                "#4dff94", "#25ff6e", "#21bb6d", "#00c567", "#2fc75e"
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

            updatePreview();
        });

        // Zapisz i zastosuj
        document.getElementById('tooltip-save').addEventListener('click', () => {
            saveConfig();
            applyTooltipStyles();
            modal.remove();
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
