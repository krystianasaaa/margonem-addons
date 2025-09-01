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
        /* CSS dla Manager Dodatków - ciemny styl inspirowany obrazkiem */
        .addon-manager {
            position: fixed;
            z-index: 10000;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .addon-toggle-btn {
            background: linear-gradient(135deg, #1e2124 0%, #2f3136 100%);
            border: 1px solid #40444b;
            color: #dcddde;
            padding: 8px;
            border-radius: 6px;
            cursor: move;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            user-select: none;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-width: 40px;
            width: 40px;
            height: 40px;
        }

        .addon-toggle-btn::before {
            content: '';
            width: 24px;
            height: 24px;
            background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            flex-shrink: 0;
            filter: brightness(1.2);
        }

        .addon-toggle-btn:hover {
            background: linear-gradient(135deg, #36393f 0%, #42464d 100%);
            border-color: #5865f2;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.5);
        }

        .addon-toggle-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .addon-toggle-btn.dragging {
            transform: none !important;
            transition: none !important;
        }

        .addon-menu {
            position: absolute;
            top: 55px;
            left: 0;
            background: linear-gradient(180deg, #1e2124 0%, #2f3136 100%);
            border: 1px solid #40444b;
            border-radius: 8px;
            padding: 0;
            min-width: 400px;
            max-width: 500px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.6);
            display: none;
            backdrop-filter: blur(10px);
            overflow: hidden;
        }

        .addon-menu.active {
            display: block;
            animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .addon-menu-header {
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            margin: 0;
            padding: 16px 20px;
            background: linear-gradient(90deg, #5865f2 0%, #7289da 100%);
            border-bottom: 1px solid #40444b;
            cursor: move;
            user-select: none;
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .addon-menu-header::before {
            content: '';
            width: 20px;
            height: 20px;
            background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            flex-shrink: 0;
            filter: brightness(1.5);
        }

        .addon-menu.dragging {
            transition: none !important;
        }

        .addon-close-btn {
            position: absolute;
            top: 12px;
            right: 16px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            line-height: 1;
            backdrop-filter: blur(10px);
        }

        .addon-close-btn:hover {
            background: #ed4245;
            border-color: #ed4245;
            color: white;
            transform: scale(1.1);
        }

        .addon-content {
            padding: 16px 20px;
            max-height: 400px;
            overflow-y: auto;
        }

        .addon-content::-webkit-scrollbar {
            width: 6px;
        }

        .addon-content::-webkit-scrollbar-track {
            background: #2f3136;
        }

        .addon-content::-webkit-scrollbar-thumb {
            background: #5865f2;
            border-radius: 3px;
        }

        .addon-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            transition: all 0.3s ease;
            margin: 0 -12px;
            padding: 14px 12px;
            border-radius: 6px;
        }

        .addon-item:last-child {
            border-bottom: none;
        }

        .addon-item:hover {
            background: linear-gradient(90deg, rgba(88, 101, 242, 0.1) 0%, rgba(114, 137, 218, 0.1) 100%);
            border-color: rgba(88, 101, 242, 0.3);
            transform: translateX(2px);
        }

        .addon-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .addon-name {
            color: #ffffff;
            font-size: 15px;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .addon-status {
            font-size: 12px;
            font-weight: 500;
            padding: 2px 8px;
            border-radius: 12px;
            display: inline-block;
            width: fit-content;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .addon-status.enabled {
            background: linear-gradient(90deg, #3ba55d 0%, #57f287 100%);
            color: #ffffff;
            box-shadow: 0 2px 6px rgba(59, 165, 93, 0.3);
        }

        .addon-status.disabled {
            background: linear-gradient(90deg, #ed4245 0%, #f38ba8 100%);
            color: #ffffff;
            box-shadow: 0 2px 6px rgba(237, 66, 69, 0.3);
        }

        .addon-switch {
            position: relative;
            width: 52px;
            height: 28px;
            background: linear-gradient(135deg, #4f545c 0%, #36393f 100%);
            border-radius: 14px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: 2px solid transparent;
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
        }

        .addon-switch.active {
            background: linear-gradient(135deg, #3ba55d 0%, #57f287 100%);
            border-color: #57f287;
            box-shadow: 0 4px 12px rgba(59, 165, 93, 0.4);
        }

        .addon-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .addon-switch.active::after {
            left: 26px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .addon-switch:hover {
            transform: scale(1.05);
        }

        .addon-controls {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            gap: 12px;
        }

        .control-btn {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid transparent;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }

        .control-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
        }

        .control-btn:hover::before {
            left: 100%;
        }

        .enable-all-btn {
            background: linear-gradient(135deg, #3ba55d 0%, #57f287 100%);
            border-color: #57f287;
            box-shadow: 0 4px 12px rgba(59, 165, 93, 0.3);
        }

        .disable-all-btn {
            background: linear-gradient(135deg, #ed4245 0%, #f38ba8 100%);
            border-color: #f38ba8;
            box-shadow: 0 4px 12px rgba(237, 66, 69, 0.3);
        }

        .enable-all-btn:hover {
            background: linear-gradient(135deg, #2d7d32 0%, #3ba55d 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 165, 93, 0.4);
        }

        .disable-all-btn:hover {
            background: linear-gradient(135deg, #c62828 0%, #ed4245 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(237, 66, 69, 0.4);
        }

        .control-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .addon-menu::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #5865f2, transparent);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .addon-item.loading {
            animation: pulse 1.5s ease-in-out infinite;
        }

        @media (max-width: 480px) {
            .addon-menu {
                min-width: 320px;
                max-width: 90vw;
            }
            
            .addon-controls {
                flex-direction: column;
            }
            
            .control-btn {
                font-size: 12px;
                padding: 10px 12px;
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
