(function() {
    'use strict';

    // Konfiguracja - co ma być włączone
    let config = {
        bonusyLegendarne: true,
        statystykiPrzedmiotow: true,
        interfejs: true
    };

   function saveConfig() {
        try {
            // Tworzymy unikalny klucz dla tej domeny
            const storageKey = 'betterUI_config_' + window.location.hostname;

            // Używamy prostego sposobu zapisywania w pamięci przeglądarki
            const script = document.createElement('script');
            script.id = 'better-ui-storage';
            script.type = 'application/json';
            script.textContent = JSON.stringify(config);

            // Usuń poprzedni skrypt jeśli istnieje
            const oldScript = document.getElementById('better-ui-storage');
            if (oldScript) {
                oldScript.remove();
            }

            // Dodaj nowy skrypt do head (będzie trwały podczas sesji)
            document.head.appendChild(script);

            // Dodatkowo spróbuj zapisać w sessionStorage jeśli dostępne
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(storageKey, JSON.stringify(config));
            }
        } catch (e) {
            console.log('Better UI: Nie można zapisać konfiguracji');
        }
    }

    // Próba odczytu konfiguracji z pamięci (jeśli istnieje)
    function loadConfig() {
        try {
            const storageKey = 'betterUI_config_' + window.location.hostname;
            let savedConfig = {};

            // Najpierw sprawdź sessionStorage
            if (typeof sessionStorage !== 'undefined') {
                const sessionData = sessionStorage.getItem(storageKey);
                if (sessionData) {
                    savedConfig = JSON.parse(sessionData);
                }
            }

            // Jeśli nie ma w sessionStorage, sprawdź skrypt w DOM
            if (Object.keys(savedConfig).length === 0) {
                const storageScript = document.getElementById('better-ui-storage');
                if (storageScript && storageScript.textContent) {
                    savedConfig = JSON.parse(storageScript.textContent);
                }
            }

            // Zastosuj zapisaną konfigurację
            if (Object.keys(savedConfig).length > 0) {
                config = { ...config, ...savedConfig };
            }
        } catch (e) {
            console.log('Better UI: Nie można wczytać konfiguracji, używam domyślnej');
        }
    }

    // Wywołaj wczytywanie konfiguracji na początku
    loadConfig();
    const bonusNames = {
        // Bonusy legendarne
        ...(config.bonusyLegendarne ? {
       'Cios bardzo krytyczny': '💀 POTĘŻNE PIERDOLNIĘCIE 💀',
        'Dotyk anioła': 'Dotyczek',
        'Klątwa': 'Klątewka',
        'Oślepienie': 'Oślepa',
        'Ostatni ratunek': 'OR',
        'Krytyczna osłona': 'KO',
        'Fasada opieki': 'Fasada',
        'Płomienne oczyszczenie': 'Płomienne',
        'Krwawa udręka': 'Krwawa',
        'Przeszywająca skuteczność': 'Przeszywajka'
        } : {}),

        // Statystyki przedmiotów
        ...(config.statystykiPrzedmiotow ? {
        'Cios krytyczny': 'Kryt',
        'Przebicie': 'Przebitka',
        'Głęboka rana': 'GR',
        'Unik': 'Unik',
        'Blok': 'Blok',
        'Blok przebicia': 'Blok Przebicia',
        'Kontra': 'Kontra',
        'Ogłuszenie': 'Stun',
        'Szybkość ataku': 'SA',
        'Zręczność': 'Zręka',
        'Energia': 'Ena',
        'Życie': 'HP',
        'Wszystkie cechy': 'Cechy',
        'Przywracanie życia': 'Turka',
        'Trucizna': 'Truta',
        'Niszczenie pancerza': 'Niszczara panca',
        'Obniżanie szybkości ataku': 'Obniżka SA',
        'Obniżanie uniku': 'Obniżka uniku',
        'Podczas ataku unik przeciwnika jest mniejszy o': 'Obniżka uniku o',
        'Obniża szybkość ataku przeciwnika o': 'Obniżka SA o',
        'Pancerz': 'Panc',
        'Przywraca': 'Turka',
        'punktów życia podczas walki': '',
        'Odporność': 'Odpy',
        'Moc ciosu krytycznego fizycznego': 'SKF',
        'Moc ciosu krytycznego magicznego': 'SKM',
        'Podczas obrony szansa na cios krytyczny przeciwnika jest mniejsza o ': 'Obniżka Kryta o ',
        'punktów procentowych': '',
        'Obrażenia': 'DMG',
        'fizyczne dystansowe': 'FIZ',
        'trucizny': 'truty',
        'Spowalnia cel o': 'Slow o',
        'punktów pancerza podczas ciosu': 'panca',
        'Ogłuszający cios': 'UGA BUGA MACZUGA',
        '17% szansy na zwiększenie mocy ciosu krytycznego o 75%.': '17% szansy na zwiększenie mocy ciosu krytycznego o 75% DODATKOWO: 50% szans na rozjebanie oponenta jednym strzałem   (Wymagana profesja: Wojownik lub Mag)',
        'Absorbuje': 'Absa',
        'obrażeń fizycznych': 'DMG FIZ',
        'obrażeń magicznych': 'DMG MAG',
        'Zmniejsza o': 'Slow o',
        'szybkość ataku celu': 'SA',
        'Niszczenie odporności magicznych o': 'Niszczara odpów o',
        'podczas ciosu': 'przy hicie',
        'szans na kontratak po ciosie krytycznym': 'na kontre'
        } : {}),

        // Interfejs
        ...(config.interfejs ? {
            'Punkty Honoru': 'PH',
        'Teleportuje gracza na mapę': 'Tepa na',
        'Wewnętrzny spokój': 'umka dla cweli',
        'Smocze Runy': 'SR',
        'Turkanie energii': 'Przywro energii',
        'Przywracanie energii': 'Przywro energii',
        } : {})
    };

// Znajdź tę funkcję w swoim kodzie i zastąp ją:

function createGUI() {
    const gui = document.createElement('div');
    gui.id = 'better-ui-gui';
    gui.style.cssText = `
        position: fixed;
       bottom: 585px;
        right: 430px;
        width: 28px;
        height: 28px;
        background: rgba(40, 40, 40, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 500;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease;
    `;

    gui.addEventListener('mouseenter', () => {
        gui.style.background = 'rgba(50, 50, 50, 0.95)';
    });

    gui.addEventListener('mouseleave', () => {
        gui.style.background = 'rgba(40, 40, 40, 0.95)';
    });

    gui.textContent = 'UI';

    const panel = document.createElement('div');
    panel.id = 'better-ui-panel';
    panel.style.cssText = `
        position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
        width: 280px;
        background: rgba(30, 30, 30, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 20px;
        z-index: 9999;
        display: none;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    `;

    panel.innerHTML = `
        <div style="color: #fff; font-weight: 500; margin-bottom: 20px; text-align: left; font-size: 16px; display: flex; align-items: center;">
            <span style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; margin-right: 10px;"></span>
            Better UI Settings
        </div>

        <div style="space-y: 15px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <span style="color: #e0e0e0; font-weight: 400; font-size: 13px;">
                    Bonusy Legendarne
                    <span id="bonusy-refresh" class="refresh-notice" style="display: none; color: #ff9800; font-size: 11px;"> (Wymagane odświeżenie gry)</span>
                </span>
                <label class="toggle-switch">
                    <input type="checkbox" id="bonusy-legendarne" ${config.bonusyLegendarne ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <span style="color: #e0e0e0; font-weight: 400; font-size: 13px;">
                    Statystyki Przedmiotów
                    <span id="statystyki-refresh" class="refresh-notice" style="display: none; color: #ff9800; font-size: 11px;"> (Wymagane odświeżenie gry)</span>
                </span>
                <label class="toggle-switch">
                    <input type="checkbox" id="statystyki-przedmiotow" ${config.statystykiPrzedmiotow ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <span style="color: #e0e0e0; font-weight: 400; font-size: 13px;">
                    Interfejs
                    <span id="interfejs-refresh" class="refresh-notice" style="display: none; color: #ff9800; font-size: 11px;"> (Wymagane odświeżenie gry)</span>
                </span>
                <label class="toggle-switch">
                    <input type="checkbox" id="interfejs" ${config.interfejs ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button id="apply-ui" class="action-btn apply-btn" style="flex: 1;">
                Zamknij
            </button>
            <button id="reload-ui" class="action-btn reload-btn" style="flex: 1;">
                Odśwież grę
            </button>
        </div>
    `;

    // Dodaj style CSS
    const style = document.createElement('style');
    style.textContent = `
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-switch .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.2);
            transition: 0.3s;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .toggle-switch .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background: #fff;
            transition: 0.3s;
            border-radius: 50%;
        }

        .toggle-switch input:checked + .slider {
            background: #2196F3;
            border-color: #2196F3;
        }

        .toggle-switch input:checked + .slider:before {
            transform: translateX(20px);
        }

        .action-btn {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .apply-btn {
            background: #f44336;
            color: white;
        }

        .apply-btn:hover {
            background: #da190b;
        }

        .reload-btn {
            background: #ff9800;
            color: white;
        }

        .reload-btn:hover {
            background: #f57c00;
        }

        .refresh-notice {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(gui);
    document.body.appendChild(panel);

    // Obsługa kliknięcia w ikonkę
    gui.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // Funkcja do pokazywania notyfikacji o odświeżeniu
    function showRefreshNotice(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'inline';
        }
    }

    // Obsługa checkboxów
    panel.querySelector('#bonusy-legendarne').addEventListener('change', (e) => {
        const previousValue = config.bonusyLegendarne;
        config.bonusyLegendarne = e.target.checked;
        saveConfig();

        // Pokaż notyfikację jeśli wartość się zmieniła
        if (previousValue !== e.target.checked) {
            showRefreshNotice('bonusy-refresh');
        }
    });

    panel.querySelector('#statystyki-przedmiotow').addEventListener('change', (e) => {
        const previousValue = config.statystykiPrzedmiotow;
        config.statystykiPrzedmiotow = e.target.checked;
        saveConfig();

        // Pokaż notyfikację jeśli wartość się zmieniła
        if (previousValue !== e.target.checked) {
            showRefreshNotice('statystyki-refresh');
        }
    });

    panel.querySelector('#interfejs').addEventListener('change', (e) => {
        const previousValue = config.interfejs;
        config.interfejs = e.target.checked;
        saveConfig();

        // Pokaż notyfikację jeśli wartość się zmieniła
        if (previousValue !== e.target.checked) {
            showRefreshNotice('interfejs-refresh');
        }
    });

    // Obsługa przycisków
    panel.querySelector('#apply-ui').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    panel.querySelector('#reload-ui').addEventListener('click', () => {
        location.reload();
    });

    // Zamykanie panelu po kliknięciu poza nim
    document.addEventListener('click', (e) => {
        if (!gui.contains(e.target) && !panel.contains(e.target)) {
            panel.style.display = 'none';
        }
    });
}
    // Lista wszystkich typów przedmiotów, które mogą być ulepszone
    const itemTypes = [
        'Pierścienie', 'Naszyjniki', 'Hełmy', 'Rękawice', 'Zbroje',
        'Dystansowe', 'Strzały', 'Buty', 'Jednoręczne', 'Półtoraręczne',
        'Dwuręczne', 'Orby magiczne', 'Tarcze', 'Pomocnicze'
    ];

    // Funkcja do sprawdzania czy tooltip zawiera przedmiot, który można ulepszyć
    function isUpgradeableItem(tooltipContent) {
        // Sprawdź czy tooltip zawiera typ przedmiotu, który można ulepszyć
        const typeMatch = tooltipContent.match(/Typ:\s*([^<\n]+)/i);
        if (typeMatch) {
            const itemType = typeMatch[1].trim();
            return itemTypes.some(type => itemType.includes(type));
        }
        return false;
    }

    // Funkcja do obliczania kosztów ulepszenia
    function calculateUpgradeCosts(itemLevel, currentUpgrade = 0, itemCount = 1, rarity = 'zwykły') {
        const lvl = itemLevel;
        const upgradeCosts = {};
        let totalUpgradeCost = 0;
        let totalGoldCost = 0;
        let totalEssenceCost = 0;

        // Multipliers dla każdego poziomu
        const multipliers = {
            1: 1.0,   // 100%
            2: 1.1,   // 110%
            3: 1.3,   // 130%
            4: 1.6,   // 160%
            5: 2.0    // 200%
        };

        // Mnożniki dla rzadkości (do złota)
        const rarityMultipliers = {
            'zwykły': 1,
            'zwykłe': 1,
            'unikatowy': 10,
            'unikatowe': 10,
            'heroiczny': 30,
            'heroiczne': 30,
            'ulepszony': 40,
            'ulepszonych': 40,
            'legendarny': 60,
            'legendarne': 60
        };

        // Mnożniki dla rzadkości (do punktów ulepszenia - współczynnik 'e')
        const upgradeMultipliers = {
            'zwykły': 1,
            'zwykłe': 1,
            'unikatowy': 10,
            'unikatowe': 10,
            'heroiczny': 100,
            'heroiczne': 100,
            'ulepszony': 1, // Ulepszonych używa innego wzoru!
            'ulepszonych': 1,
            'legendarny': 1000,
            'legendarne': 1000
        };

        const n = rarityMultipliers[rarity.toLowerCase()] || 1;
        const e = upgradeMultipliers[rarity.toLowerCase()] || 1;

        // Oblicz koszty od aktualnego poziomu do +5
        for (let level = currentUpgrade + 1; level <= 5; level++) {
            const multiplier = multipliers[level];

            let upgradeCost;
            // Przedmioty ulepszonych używają innego wzoru: (150*lvl+27000)
            if (rarity.toLowerCase() === 'ulepszony' || rarity.toLowerCase() === 'ulepszonych') {
                upgradeCost = Math.round((150 * lvl + 27000) * multiplier);
            } else {
                // Standardowy wzór: (180 + lvl) * multiplier * e
                upgradeCost = Math.round((180 + lvl) * multiplier * e);
            }
            totalUpgradeCost += upgradeCost;

            let goldCost = 0;
            let essenceCost = 0;

            // Dla +5 dodatkowe koszty
            if (level === 5) {
                goldCost = Math.round((10 * lvl + 1300) * lvl * n);
                essenceCost = Math.round((lvl / 10 + 10) * 3);
                totalGoldCost += goldCost;
                totalEssenceCost += essenceCost;
            }

            upgradeCosts[level] = {
                upgrade: upgradeCost,
                gold: goldCost,
                essence: essenceCost
            };
        }

        return {
            costs: upgradeCosts,
            totals: {
                upgrade: totalUpgradeCost,
                gold: totalGoldCost,
                essence: totalEssenceCost
            }
        };
    }

    // Funkcja do parsowania poziomu przedmiotu z tooltipa
    function parseItemInfo(tooltipContent) {
        const itemInfo = {
            level: null,
            currentUpgrade: 0,
            count: 1,
            rarity: 'zwykły'
        };

        // Szukanie poziomu przedmiotu - różne formaty
        const levelPatterns = [
            /Wymagany poziom:\s*(\d+)/i,
            /Poziom:\s*(\d+)/i,
            /poziom:\s*(\d+)/i,
            /lvl:\s*(\d+)/i,
            /level:\s*(\d+)/i,
            /req\.\s*level:\s*(\d+)/i,
            /required level:\s*(\d+)/i,
            /wymagany\s*poziom:\s*(\d+)/i
        ];

        for (const pattern of levelPatterns) {
            const levelMatch = tooltipContent.match(pattern);
            if (levelMatch) {
                itemInfo.level = parseInt(levelMatch[1]);
                break;
            }
        }

        // ROZSZERZONE WYKRYWANIE RZADKOŚCI

        // 1. Najpierw sprawdź data-item-type (jeśli istnieje)
        const itemTypePatterns = [
            { pattern: /data-item-type="t-leg"/i, rarity: 'legendarny' },
            { pattern: /data-item-type="t-her"/i, rarity: 'heroiczny' },
            { pattern: /data-item-type="t-uniupg"/i, rarity: 'unikatowy' },
            { pattern: /data-item-type="t-upgraded"/i, rarity: 'ulepszony' },
            { pattern: /data-item-type="t-norm"/i, rarity: 'zwykły' }
        ];

        for (const item of itemTypePatterns) {
            if (item.pattern.test(tooltipContent)) {
                itemInfo.rarity = item.rarity;
                break;
            }
        }

        // 2. Sprawdź CSS klasy
        if (itemInfo.rarity === 'zwykły') {
            const cssClassPatterns = [
                { pattern: /class="[^"]*legendary[^"]*"/i, rarity: 'legendarny' },
                { pattern: /class="[^"]*heroic[^"]*"/i, rarity: 'heroiczny' },
                { pattern: /class="[^"]*unique[^"]*"/i, rarity: 'unikatowy' },
                { pattern: /class="[^"]*upgraded[^"]*"/i, rarity: 'ulepszony' },
                { pattern: /class="[^"]*normal[^"]*"/i, rarity: 'zwykły' }
            ];

            for (const item of cssClassPatterns) {
                if (item.pattern.test(tooltipContent)) {
                    itemInfo.rarity = item.rarity;
                    break;
                }
            }
        }

        // 3. Sprawdź kolorowanie tekstu (style="color:")
        if (itemInfo.rarity === 'zwykły') {
            const colorPatterns = [
                { pattern: /style="[^"]*color:\s*#?ff6600[^"]*"/i, rarity: 'legendarny' }, // pomarańczowy
                { pattern: /style="[^"]*color:\s*#?9900ff[^"]*"/i, rarity: 'heroiczny' }, // fioletowy
                { pattern: /style="[^"]*color:\s*#?0099ff[^"]*"/i, rarity: 'unikatowy' }, // niebieski
                { pattern: /style="[^"]*color:\s*#?00ff00[^"]*"/i, rarity: 'ulepszony' }, // zielony
            ];

            for (const item of colorPatterns) {
                if (item.pattern.test(tooltipContent)) {
                    itemInfo.rarity = item.rarity;
                    break;
                }
            }
        }

        // 4. Sprawdź tekst rzadkości w tooltip (jako ostateczny fallback)
        if (itemInfo.rarity === 'zwykły') {
            const textRarityPatterns = [
                { pattern: /\bLegendarny\b/i, rarity: 'legendarny' },
                { pattern: /\bLegendarne\b/i, rarity: 'legendarny' },
                { pattern: /\bHeroiczny\b/i, rarity: 'heroiczny' },
                { pattern: /\bHeroiczne\b/i, rarity: 'heroiczny' },
                { pattern: /\bUnikatowy\b/i, rarity: 'unikatowy' },
                { pattern: /\bUnikatowe\b/i, rarity: 'unikatowy' },
                { pattern: /\bUlepszony\b/i, rarity: 'ulepszony' },
                { pattern: /\bUlepszonych\b/i, rarity: 'ulepszony' },
                { pattern: /\bZwykły\b/i, rarity: 'zwykły' },
                { pattern: /\bZwykłe\b/i, rarity: 'zwykły' }
            ];

            for (const item of textRarityPatterns) {
                if (item.pattern.test(tooltipContent)) {
                    itemInfo.rarity = item.rarity;
                    break;
                }
            }
        }

        // Szukanie aktualnego ulepszenia - sprawdź czy w nazwie przedmiotu jest "+X"
        // Nazwa przedmiotu jest na początku tooltipa, przed "Typ:"
        const nameSection = tooltipContent.split('Typ:')[0] || tooltipContent.split('Type:')[0] || tooltipContent;

        // Szukaj + tylko w nazwie przedmiotu, nie w statystykach
        const upgradeInName = nameSection.match(/\+([1-5])(?=\s|$|<)/);
        if (upgradeInName) {
            itemInfo.currentUpgrade = parseInt(upgradeInName[1]);
        } else {
            // Jeśli nie ma + w nazwie, to przedmiot nie jest ulepszony
            itemInfo.currentUpgrade = 0;
        }

        // Szukanie ilości
        const countPatterns = [
            /Ilość:\s*(\d+)/i,
            /ilość:\s*(\d+)/i,
            /quantity:\s*(\d+)/i,
            /count:\s*(\d+)/i,
            /amount:\s*(\d+)/i
        ];

        for (const pattern of countPatterns) {
            const countMatch = tooltipContent.match(pattern);
            if (countMatch) {
                itemInfo.count = parseInt(countMatch[1]);
                break;
            }
        }

        return itemInfo;
    }

    // Funkcja do znajdowania najlepszego miejsca do wstawienia kalkulatora
    function findInsertionPoint(tooltipContent) {
        // 1. Szukaj statusu związania - wstaw przed nim
        const boundPatterns = [
            /Związany z właścicielem/i,
            /Związane z właścicielem/i,
            /Bound to owner/i,
            /Soulbound/i
        ];

        for (const pattern of boundPatterns) {
            const boundMatch = tooltipContent.match(pattern);
            if (boundMatch) {
                return {
                    position: boundMatch.index,
                    found: 'before_bound'
                };
            }
        }

        // 2. Szukaj wzorców profesji - wstaw przed nimi
        const professionPatterns = [
            /Wymagana profesja:/i,
            /Wymagany poziom:/i,
            /Required profession:/i,
            /Required level:/i
        ];

        for (const pattern of professionPatterns) {
            const profMatch = tooltipContent.match(pattern);
            if (profMatch) {
                return {
                    position: profMatch.index,
                    found: 'before_profession'
                };
            }
        }

        // 3. Sprawdź czy jest podpis "W dniu..." - wstaw po nim
        const signaturePattern = /W dniu[\s\S]*?(?=<\/div>|$)/i;
        const signatureMatch = tooltipContent.match(signaturePattern);

        if (signatureMatch) {
            return {
                position: signatureMatch.index + signatureMatch[0].length,
                found: 'after_signature'
            };
        }

        // 4. Ostateczny fallback - dodaj na koniec
        return {
            position: tooltipContent.length,
            found: 'end'
        };
    }

    // Funkcja do dodawania informacji o ulepszeniu do tooltipa
    function addUpgradeInfo(tooltipContent) {
        // Sprawdź czy kalkulator już został dodany
        if (tooltipContent.includes('Koszt ulepszeń:')) {
            return tooltipContent;
        }

        const itemInfo = parseItemInfo(tooltipContent);

        // Sprawdź czy tooltip zawiera informacje o przedmiocie
        const isItemTooltip = tooltipContent.includes('item-tip') ||
                             tooltipContent.includes('Poziom:') ||
                             tooltipContent.includes('poziom:') ||
                             tooltipContent.includes('Wymagany') ||
                             tooltipContent.includes('wymagany') ||
                             tooltipContent.includes('Typ:') ||
                             tooltipContent.includes('typ:') ||
                             /\+\d+/.test(tooltipContent);

        if (!isItemTooltip || !itemInfo.level || itemInfo.currentUpgrade >= 5) {
            return tooltipContent;
        }

        const result = calculateUpgradeCosts(itemInfo.level, itemInfo.currentUpgrade, itemInfo.count, itemInfo.rarity);
        const costs = result.costs;
        const totals = result.totals;

        // Znajdź najlepsze miejsce do wstawienia
        const insertionPoint = findInsertionPoint(tooltipContent);

        let upgradeInfo = '<div style="border-top: 1px solid #666; margin-top: 10px; padding-top: 5px;">';
        upgradeInfo += '<div style="color: #FFD700; font-weight: bold; margin-bottom: 5px; text-align: center;">Koszt ulepszeń:</div>';

        // DODAJ INFORMACJĘ O RZADKOŚCI DLA DEBUGOWANIA (tymczasowo)
        upgradeInfo += `<div style="color: #888; font-size: 10px; text-align: center; margin-bottom: 3px;">Rzadkość: ${itemInfo.rarity}</div>`;

        // Dodaj koszty dla każdego poziomu
        for (let level in costs) {
            const cost = costs[level];
            upgradeInfo += `<div style="color: #CCCCCC; font-size: 11px; margin-bottom: 3px;">`;
            upgradeInfo += `+${level}: <span style="color: #87CEEB;">${cost.upgrade.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> pkt. ulepszenia`;

            if (cost.gold > 0) {
                upgradeInfo += `, <span style="color: #FFD700;">${cost.gold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> złota`;
            }

            if (cost.essence > 0) {
                upgradeInfo += `, <span style="color: #FF69B4;">${cost.essence}</span> esencji`;
            }

            upgradeInfo += '</div>';
        }

        // Dodaj podsumowanie (tylko jeśli jest więcej niż jeden poziom do ulepszenia)
        if (Object.keys(costs).length > 1) {
            upgradeInfo += '<div style="border-top: 1px solid #444; margin-top: 5px; padding-top: 5px;">';
            upgradeInfo += '<div style="color: #FFD700; font-size: 11px; font-weight: bold; text-align: center;">SUMA OD +0 DO +5:</div>';
            upgradeInfo += '<div style="color: #CCCCCC; font-size: 11px; text-align: center;">';
            upgradeInfo += `<span style="color: #87CEEB;">${totals.upgrade.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> pkt. ulepszenia`;

            if (totals.gold > 0) {
                upgradeInfo += `, <span style="color: #FFD700;">${totals.gold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> złota`;
            }

            if (totals.essence > 0) {
                upgradeInfo += `, <span style="color: #FF69B4;">${totals.essence}</span> esencji`;
            }

            upgradeInfo += '</div>';
            upgradeInfo += '</div>';
        }

        upgradeInfo += '</div>';

        // Wstaw kalkulator w odpowiednim miejscu
        return tooltipContent.slice(0, insertionPoint.position) + upgradeInfo + tooltipContent.slice(insertionPoint.position);
    }

    function replaceText(text) {
        if (!text || typeof text !== 'string') return text;

        let result = text;

        // Najpierw zastąp nazwy bonusów
        for (const [original, replacement] of Object.entries(bonusNames)) {
            if (result.includes(original)) {
               result = result.replace(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
            }
        }

        // Następnie dodaj informacje o ulepszeniu dla wszystkich przedmiotów
        if ((result.includes('item-tip') || result.includes('Poziom:')) && isUpgradeableItem(result)) {
            result = addUpgradeInfo(result);
        }

        return result;
    }

    function setupEngineHooks() {
        const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string' && value.length > 0) {
                    // Sprawdź czy to tooltip przedmiotu
                    if (value.includes('item-tip') ||
                        value.includes('Poziom:') ||
                        Object.keys(bonusNames).some(bonus => value.includes(bonus))) {
                        value = replaceText(value);
                    }
                }
                return originalInnerHTMLSetter.call(this, value);
            },
            get: Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').get,
            configurable: true
        });

        const originalTextContentSetter = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
        Object.defineProperty(Node.prototype, 'textContent', {
            set: function(value) {
                if (typeof value === 'string' && value.length > 0) {
                    if (Object.keys(bonusNames).some(bonus => value.includes(bonus)) ||
                        value.includes('Poziom:')) {
                        value = replaceText(value);
                    }
                }
                return originalTextContentSetter.call(this, value);
            },
            get: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').get,
            configurable: true
        });

        const originalCreateTextNode = Document.prototype.createTextNode;
        Document.prototype.createTextNode = function(data) {
            if (typeof data === 'string' && (
                Object.keys(bonusNames).some(bonus => data.includes(bonus)) ||
                data.includes('Poziom:'))) {
                data = replaceText(data);
            }
            return originalCreateTextNode.call(this, data);
        };
    }

    function hookMargonemFunctions() {
        const checkInterval = setInterval(() => {
            const gameObjects = [window.g, window.game, window.Engine, window.margo];

            for (const gameObj of gameObjects) {
                if (gameObj && typeof gameObj === 'object') {

                    const possibleTooltipFunctions = ['showTip', 'createTip', 'tooltip', 'itemTip', 'getTip'];

                    for (const funcName of possibleTooltipFunctions) {
                        if (typeof gameObj[funcName] === 'function') {

                            const originalFunc = gameObj[funcName];
                            gameObj[funcName] = function(...args) {
                                const processedArgs = args.map(arg =>
                                    typeof arg === 'string' ? replaceText(arg) : arg
                                );

                                const result = originalFunc.apply(this, processedArgs);

                                if (typeof result === 'string') {
                                    return replaceText(result);
                                }

                                return result;
                            };
                        }
                    }

                    if (gameObj.tip || gameObj.tooltip || gameObj.ui) {
                        const tipObj = gameObj.tip || gameObj.tooltip || gameObj.ui;
                        if (typeof tipObj === 'object') {
                            for (const key in tipObj) {
                                if (typeof tipObj[key] === 'function' &&
                                    (key.includes('tip') || key.includes('tooltip') || key.includes('show'))) {

                                    const originalNestedFunc = tipObj[key];
                                    tipObj[key] = function(...args) {
                                        const processedArgs = args.map(arg =>
                                            typeof arg === 'string' ? replaceText(arg) : arg
                                        );
                                        const result = originalNestedFunc.apply(this, processedArgs);
                                        return typeof result === 'string' ? replaceText(result) : result;
                                    };
                                }
                            }
                        }
                    }

                    clearInterval(checkInterval);
                    break;
                }
            }
        }, 100);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    function setupBackupObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const className = node.className || '';

                        // Tylko tooltipsy przedmiotów
                        if (className.includes('item-tip') || className.includes('tooltip')) {
                            // Przetwórz natychmiast podczas dodawania do DOM
                            const walker = document.createTreeWalker(
                                node,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );

                            const textNodes = [];
                            let textNode;
                            while (textNode = walker.nextNode()) {
                                textNodes.push(textNode);
                            }

                            textNodes.forEach(tn => {
                                const newText = replaceText(tn.textContent);
                                if (newText !== tn.textContent) {
                                    tn.textContent = newText;
                                }
                            });

                            // Dodatkowo sprawdź innerHTML całego elementu
                            if (node.innerHTML) {
                                const newHTML = replaceText(node.innerHTML);
                                if (newHTML !== node.innerHTML) {
                                    node.innerHTML = newHTML;
                                }
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        setupEngineHooks();
        hookMargonemFunctions();
        setTimeout(setupBackupObserver, 1000);

        // Stwórz GUI po załadowaniu strony
        setTimeout(createGUI, 2000);
    }
loadConfig();
    init();

})();
