(function() {
    'use strict';
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    const allowedUsers = ['6053920', '5090092', '7712777', '6122094', '6210905', '9110806', '3543472', '4965363', '6793254', '4633387', '1661718', '7164363', '5109521', '8370413', '8228619', '7172886', '8357394', '6936569', '874973', '8144729', '1521186', '594120', '8839561', '5906841', '8824864', '2885972', '8776354', '7520102', '9269588', '7316243', '8432475', '5295667', '4664363', '9392055', '530596', '6244754', '8200643']; // <-- Tutaj wklej swoje ID

    const userId = getCookie('user_id');
    if (!allowedUsers.includes(userId)) {
        console.log('🚫 Brak uprawnień dla użytkownika:', userId);
        console.log('✅ Dozwoleni użytkownicy:', allowedUsers);
        return;
    }

     // Konfiguracja dodatków
   const addonConfig = {
    addon1: {
        name: 'Players Online',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/players%20online.js'
    },
    addon2: {
        name: 'Players Online - Alarm',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/players%20online%20alarm.js'
    },
    addon3: {
        name: 'Titans on Discord',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/titans%20on%20discord.js'
    },
    addon4: {
        name: 'Heroes on Discord',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/heroes%20on%20discord.js'
    },
    
    addon5: {
        name: 'Inventory Search',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/inventory%20search.js'
    },
    addon6: {
        name: 'Shop Hotkey',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/better%20sellings.js'
    },

    addon7: {
        name: 'Better UI',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/betterui.js'
    }
};

    // Obiekt do przechowywania załadowanych dodatków
    const loadedAddons = {};

    // Funkcja do ładowania kodu dodatku z GitHub
    async function loadAddonCode(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            return code;
        } catch (error) {
            console.error('Błąd podczas ładowania dodatku:', error);
            throw error;
        }
    }

    // Funkcja do tworzenia dodatku
    async function createAddon(addonId, config) {
        try {
            console.log(`Ładowanie dodatku: ${config.name}...`);
            
            // Załaduj kod z GitHub
            const addonCode = await loadAddonCode(config.url);
            
            // Stwórz obiekt dodatku
            const addon = {
                name: config.name,
                enabled: false,
                code: addonCode,
                addonFunction: null,
init: function() {
    console.log(`${config.name} włączony`);
    try {
        // Dodaj polyfill dla funkcji GM_
        window.GM_getValue = window.GM_getValue || function(key, defaultValue) {
            const stored = localStorage.getItem('gm_' + key);
            return stored !== null ? JSON.parse(stored) : defaultValue;
        };

        window.GM_setValue = window.GM_setValue || function(key, value) {
            localStorage.setItem('gm_' + key, JSON.stringify(value));
        };

        window.GM_deleteValue = window.GM_deleteValue || function(key) {
            localStorage.removeItem('gm_' + key);
        };

        // Wykonaj kod dodatku w bezpiecznym kontekście
        this.addonFunction = new Function(
            'addonId', 
            'console', 
            'document', 
            'window',
            'cleanupAddon',
            this.code
        );
                        
                        // Uruchom dodatek
                        this.addonFunction(addonId, console, document, window, cleanupAddon);
                    } catch (error) {
                        console.error(`Błąd podczas inicjalizacji ${config.name}:`, error);
                        throw error;
                    }
                },
                destroy: function() {
                    cleanupAddon(addonId);
                }
            };
            
            return addon;
        } catch (error) {
            console.error(`Błąd podczas tworzenia dodatku ${config.name}:`, error);
            return null;
        }
    }

    // Funkcja do ładowania wszystkich dodatków
    async function loadAllAddons() {
        for (const [addonId, config] of Object.entries(addonConfig)) {
            const addon = await createAddon(addonId, config);
            if (addon) {
                loadedAddons[addonId] = addon;
                console.log(`✅ Załadowano: ${config.name}`);
                
                // Sprawdź zapisany stan i włącz dodatek jeśli był włączony
                const wasEnabled = loadAddonState(addonId);
                if (wasEnabled) {
                    try {
                        await addon.init();
                        addon.enabled = true;
                        console.log(`🔄 Przywrócono stan: ${config.name} - włączony`);
                    } catch (error) {
                        console.error(`Błąd podczas przywracania ${config.name}:`, error);
                        addon.enabled = false;
                        saveAddonState(addonId, false);
                    }
                }
            } else {
                console.log(`❌ Nie udało się załadować: ${config.name}`);
            }
        }
    }

    // Funkcja do włączania dodatku
    async function enableAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (addon.enabled) {
            console.log(`Dodatek ${addon.name} jest już włączony`);
            return true;
        }
        
        try {
            await addon.init();
            addon.enabled = true;
            saveAddonState(addonId, true); // Zapisz stan
            console.log(`✅ Włączono: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`Błąd podczas włączania ${addon.name}:`, error);
            return false;
        }
    }

    // Funkcja do wyłączania dodatku
    function disableAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (!addon.enabled) {
            console.log(`Dodatek ${addon.name} jest już wyłączony`);
            return true;
        }
        
        try {
            addon.destroy();
            addon.enabled = false;
            saveAddonState(addonId, false); // Zapisz stan
            console.log(`✅ Wyłączono: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`Błąd podczas wyłączania ${addon.name}:`, error);
            return false;
        }
    }

    // Funkcja do przełączania stanu dodatku
    async function toggleAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (addon.enabled) {
            return disableAddon(addonId);
        } else {
            return await enableAddon(addonId);
        }
    }

    // Funkcja do pobierania listy dodatków
    function getAddonsList() {
        return Object.entries(loadedAddons).map(([id, addon]) => ({
            id,
            name: addon.name,
            enabled: addon.enabled
        }));
    }

    // Funkcja cleanup (musisz ją dostosować do swoich potrzeb)
    function cleanupAddon(addonId) {
        console.log(`Czyszczenie dodatku: ${addonId}`);
        // Tutaj umieść kod do czyszczenia zasobów dodatku
        // np. usuwanie event listenerów, elementów DOM, itp.
    }

    const styles = `
.addon-manager {
    position: fixed;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 12px;
}

.addon-toggle-btn {
    background: linear-gradient(to bottom, #4a4a4a 0%, #2d2d2d 100%);
    border: 1px solid #1a1a1a;
    color: #ffffff;
    padding: 8px;
    border-radius: 3px;
    cursor: move;
    font-size: 11px;
    font-weight: normal;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.5);
    transition: all 0.2s ease;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    width: 40px;
    height: 40px;
}

.addon-toggle-btn::before {
    content: '';
    width: 20px;
    height: 20px;
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex-shrink: 0;
}

.addon-toggle-btn:hover {
    background: linear-gradient(to bottom, #5a5a5a 0%, #3d3d3d 100%);
    border-color: #333;
}

.addon-toggle-btn:active {
    background: linear-gradient(to bottom, #2d2d2d 0%, #1a1a1a 100%);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.addon-menu {
    position: absolute;
    top: 50px;
    left: 0;
    background: linear-gradient(to bottom, #3a3a3a 0%, #2a2a2a 100%);
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    padding: 0;
    min-width: 600px;
    max-width: 700px;
    width: 650px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
    display: none;
    overflow: hidden;
}

.addon-menu.active {
    display: block;
}

.addon-menu-header {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    padding: 12px 16px;
    background: linear-gradient(to bottom, #4a4a4a 0%, #3a3a3a 100%);
    border-bottom: 1px solid #1a1a1a;
    cursor: move;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.addon-menu-header::before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex-shrink: 0;
}

.addon-close-btn {
    position: absolute;
    top: 8px;
    right: 12px;
    background: linear-gradient(to bottom, #666 0%, #444 100%);
    border: 1px solid #222;
    color: #ffffff;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    line-height: 1;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
}

.addon-close-btn:hover {
    background: linear-gradient(to bottom, #cc4444 0%, #aa2222 100%);
    border-color: #992222;
}

.addon-content {
    padding: 12px 16px;
    max-height: 500px;
    overflow-y: auto;
    background: #2a2a2a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
}

.addon-content::-webkit-scrollbar {
    width: 12px;
}

.addon-content::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 6px;
}

.addon-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #555 0%, #333 100%);
    border-radius: 6px;
    border: 1px solid #222;
}

.addon-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #666 0%, #444 100%);
}

.addon-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: all 0.2s ease;
    margin: 0 4px;
    border-radius: 2px;
    min-height: 50px;
    width: calc(100% - 8px);
}

.addon-item:last-child {
    border-bottom: none;
}

.addon-item:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.1);
}

.addon-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.addon-name {
    color: #ffffff;
    font-size: 13px;
    font-weight: normal;
    text-shadow: 0 1px 1px rgba(0,0,0,0.5);
}

.addon-status {
    font-size: 10px;
    font-weight: normal;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.addon-status.enabled {
    color: #4CAF50;
}

.addon-status.disabled {
    color: #888;
}

/* Przełącznik w stylu Margonem */
.addon-switch {
    position: relative;
    width: 50px;
    height: 24px;
    background: linear-gradient(to bottom, #333 0%, #1a1a1a 100%);
    border: 1px solid #111;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}

.addon-switch.active {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%);
    border-color: #2E7D32;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(76, 175, 80, 0.3);
}

.addon-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: linear-gradient(to bottom, #f0f0f0 0%, #d0d0d0 100%);
    border: 1px solid #999;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.addon-switch.active::after {
    left: 28px;
    background: linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%);
    border-color: #ccc;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.addon-switch:hover {
    transform: none;
}

.addon-switch:hover::after {
    box-shadow: 0 2px 4px rgba(0,0,0,0.6);
}

.addon-controls {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    gap: 8px;
    background: #252525;
    margin: 0 -16px;
    padding: 12px 16px 12px 16px;
}

.control-btn {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #333;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    font-weight: normal;
    transition: all 0.2s ease;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    position: relative;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.3);
    text-shadow: 0 1px 1px rgba(0,0,0,0.8);
}

.enable-all-btn {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%);
    border-color: #2E7D32;
}

.disable-all-btn {
    background: linear-gradient(to bottom, #f44336 0%, #d32f2f 100%);
    border-color: #c62828;
}

.enable-all-btn:hover {
    background: linear-gradient(to bottom, #5CBF60 0%, #48A148 100%);
    border-color: #358E38;
}

.disable-all-btn:hover {
    background: linear-gradient(to bottom, #f55346 0%, #e33f3f 100%);
    border-color: #d63838;
}

.control-btn:active {
    background: linear-gradient(to bottom, #333 0%, #1a1a1a 100%);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}

/* Usunięcie animacji i efektów, które nie pasują do stylu Margonem */
.addon-menu::before {
    display: none;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.addon-menu.active {
    animation: slideIn 0.2s ease;
}

.addon-item.loading {
    opacity: 0.6;
}

@media (max-width: 480px) {
    .addon-menu {
        min-width: 300px;
        max-width: 90vw;
        width: 90vw;
    }
    
    .addon-content {
        grid-template-columns: 1fr;
    }
    
    .addon-controls {
        flex-direction: column;
        gap: 6px;
    }
    
    .control-btn {
        font-size: 10px;
        padding: 6px 8px;
    }
}
    `;

    // Dodaj style do strony
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // System zapisywania stanu w cookies (alternatywa dla localStorage)
    function setCookie(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getAddonCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    // Funkcja do zapisywania stanu dodatku
    function saveAddonState(addonId, enabled) {
        setCookie(`addon_${addonId}_enabled`, enabled.toString());
    }

    // Funkcja do wczytywania stanu dodatku
    function loadAddonState(addonId) {
        const saved = getAddonCookie(`addon_${addonId}_enabled`);
        return saved === 'true';
    }

    // Funkcja do zapisywania pozycji
    function savePosition(x, y) {
        setCookie('addon_manager_x', x.toString());
        setCookie('addon_manager_y', y.toString());
    }

    // Funkcja do wczytywania pozycji
    function loadPosition() {
        const x = getAddonCookie('addon_manager_x');
        const y = getAddonCookie('addon_manager_y');
        return {
            x: x ? parseInt(x) : null,
            y: y ? parseInt(y) : null
        };
    }
    // Make element draggable
    function makeDraggable(element, handle) {
        let isDragging = false;
        let hasDragged = false;
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasDragged = false;

            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            element.style.position = 'fixed';
            element.style.left = initialX + 'px';
            element.style.top = initialY + 'px';
            element.style.right = 'auto';

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            e.preventDefault();
        });

        function handleMouseMove(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasDragged = true;
                element.classList.add('dragging');
                handle.classList.add('dragging');
            }

            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            newX = Math.max(0, Math.min(newX, viewportWidth - rect.width));
            newY = Math.max(0, Math.min(newY, viewportHeight - rect.height));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        }

        function handleMouseUp() {
            if (!isDragging) return;

            isDragging = false;

            // Zapisz pozycję po zakończeniu przeciągnięcia
            const rect = element.getBoundingClientRect();
            savePosition(rect.left, rect.top);

            setTimeout(() => {
                element.classList.remove('dragging');
                handle.classList.remove('dragging');
                hasDragged = false;
            }, 100);

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => hasDragged;
    }

    // Create GUI
    function createGUI() {
        const container = document.createElement('div');
        container.className = 'addon-manager';

        // Wczytaj zapisaną pozycję
        const savedPosition = loadPosition();
        if (savedPosition.x !== null && savedPosition.y !== null) {
            container.style.left = savedPosition.x + 'px';
            container.style.top = savedPosition.y + 'px';
        } else {
            // Domyślna pozycja
            container.style.top = '10px';
            container.style.right = '10px';
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'addon-toggle-btn';

        const wasDragged = makeDraggable(container, toggleBtn);

        const menu = document.createElement('div');
        menu.className = 'addon-menu';

        const header = document.createElement('div');
        header.className = 'addon-menu-header';
        header.textContent = 'Manager Dodatków';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'addon-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.remove('active');
        });

        header.appendChild(closeBtn);
        makeDraggable(menu, header);
        menu.appendChild(header);

        // Create addon items
        Object.entries(loadedAddons).forEach(([addonId, addon]) => {
            const item = document.createElement('div');
            item.className = 'addon-item';

            const info = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'addon-name';
            name.textContent = addon.name;

            const status = document.createElement('div');
            status.className = 'addon-status';
            status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';

            info.appendChild(name);
            info.appendChild(status);

            const switchElement = document.createElement('div');
            switchElement.className = `addon-switch ${addon.enabled ? 'active' : ''}`;

            switchElement.addEventListener('click', async () => {
                const success = await toggleAddon(addonId);
                if (success) {
                    switchElement.classList.toggle('active', addon.enabled);
                    status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
                }
            });

            item.appendChild(info);
            item.appendChild(switchElement);
            menu.appendChild(item);
        });

        // Control buttons
        const controls = document.createElement('div');
        controls.className = 'addon-controls';

        const enableAllBtn = document.createElement('button');
        enableAllBtn.className = 'control-btn enable-all-btn';
        enableAllBtn.textContent = 'Włącz wszystkie';
        enableAllBtn.addEventListener('click', async () => {
            for (const addonId of Object.keys(loadedAddons)) {
                if (!loadedAddons[addonId].enabled) {
                    await enableAddon(addonId);
                }
            }
            updateGUI();
        });

        const disableAllBtn = document.createElement('button');
        disableAllBtn.className = 'control-btn disable-all-btn';
        disableAllBtn.textContent = 'Wyłącz wszystkie';
        disableAllBtn.addEventListener('click', () => {
            Object.keys(loadedAddons).forEach(addonId => {
                if (loadedAddons[addonId].enabled) {
                    disableAddon(addonId);
                }
            });
            updateGUI();
        });

        controls.appendChild(enableAllBtn);
        controls.appendChild(disableAllBtn);
        menu.appendChild(controls);


        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setTimeout(() => {
                if (!toggleBtn.classList.contains('dragging') && !wasDragged()) {
                    menu.classList.toggle('active');
                }
            }, 10);
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        container.appendChild(toggleBtn);
        container.appendChild(menu);
        document.body.appendChild(container);
    }

    // Update GUI
    function updateGUI() {
        const switches = document.querySelectorAll('.addon-switch');
        const statuses = document.querySelectorAll('.addon-status');

        Object.entries(loadedAddons).forEach(([addonId, addon], index) => {
            if (switches[index]) {
                switches[index].classList.toggle('active', addon.enabled);
            }
            if (statuses[index]) {
                statuses[index].textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
            }
        });
    }


    // Inicjalizacja - załaduj wszystkie dodatki przy starcie
    loadAllAddons().then(() => {
        console.log('🚀 Manager dodatków gotowy!');
        console.log('Dostępne dodatki:', getAddonsList());
        
        // Stwórz GUI
        createGUI();
        
        // Globalne API do zarządzania dodatkami
        window.AddonManager = {
            enable: enableAddon,
            disable: disableAddon,
            toggle: toggleAddon,
            list: getAddonsList,
            isEnabled: (addonId) => {
                const addon = loadedAddons[addonId];
                return addon ? addon.enabled : false;
            },
            getAddon: (addonId) => loadedAddons[addonId],
            refresh: updateGUI,
        };
        
        console.log('🎮 Dostępne komendy w konsoli:');
        console.log('• AddonManager.enable("addon1") - włącz dodatek');
        console.log('• AddonManager.disable("addon1") - wyłącz dodatek');
        console.log('• AddonManager.toggle("addon1") - przełącz dodatek');
        console.log('• AddonManager.list() - lista wszystkich dodatków');
    }).catch(error => {
        console.error('❌ Błąd podczas inicjalizacji managera dodatków:', error);
    });

    // Obsługa błędów
    window.addEventListener('error', (e) => {
        if (e.filename && e.filename.includes('addon')) {
            console.error('Błąd w dodatku:', e.error);
        }
    });

    // Cleanup przy odświeżeniu strony
    window.addEventListener('beforeunload', () => {
        Object.keys(loadedAddons).forEach(addonId => {
            if (loadedAddons[addonId].enabled) {
                cleanupAddon(addonId);
            }
        });
    });

})();
