(function() {
    'use strict';

    // Konfiguracja - co ma być włączon
    let config = {
        bonusyLegendarne: true,
        statystykiPrzedmiotow: true,
        interfejs: true,
        kalkulatorUlepszen: true
    };
let bonusNames = {};


let editableBonuses = {
    legendarne: {},
    statystyki: {},
    interfejs: {}
};


let calculatorRarities = {
    zwykly: true,
    unikatowy: true,
    heroiczny: true,
    ulepszony: true,
    legendarny: true
};

function saveConfig() {
    try {
        window.localStorage.setItem('betterUI_config', JSON.stringify(config));
        window.localStorage.setItem('betterUI_editableBonuses', JSON.stringify(editableBonuses));
        window.localStorage.setItem('betterUI_calculatorRarities', JSON.stringify(calculatorRarities));
    } catch (e) {
    }
}

function loadConfig() {
    try {
        const saved = window.localStorage.getItem('betterUI_config');
        if (saved) {
            const savedConfig = JSON.parse(saved);
            config = { ...config, ...savedConfig };
        }

        const savedBonuses = window.localStorage.getItem('betterUI_editableBonuses');
        if (savedBonuses) {
            editableBonuses = JSON.parse(savedBonuses);
        }

        const savedRarities = window.localStorage.getItem('betterUI_calculatorRarities');
        if (savedRarities) {
            calculatorRarities = JSON.parse(savedRarities);
        }
    } catch (e) {
    }
}
function updateBonusNames() {
    bonusNames = {};

    // Bonusy legendarne
    if (config.bonusyLegendarne) {
        const defaultLegendary = {
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
        };

        // Scalamy domyślne z custom (custom ma priorytet)
        const merged = { ...defaultLegendary, ...editableBonuses.legendarne };

        // Filtruj wyłączone bonusy
        const disabledList = editableBonuses.legendarne_disabled || {};
        Object.entries(merged).forEach(([key, value]) => {
            if (!disabledList[key]) {
                bonusNames[key] = value;
            }
        });
    }

    // Statystyki przedmiotów
    if (config.statystykiPrzedmiotow) {
        const defaultStats = {
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
            'Trucizna': 'Truta',
            'Niszczenie pancerza': 'Niszczara panca',
            'Obniżanie szybkości ataku': 'Obniżka SA',
            'Obniżanie uniku': 'Obniżka uniku',
            'Podczas ataku unik przeciwnika jest mniejszy o': 'Obniżka uniku o',
            'Obniża szybkość ataku przeciwnika o': 'Obniżka SA o',
            'Pancerz': 'Panc',
            'pancerza': 'panca',
            'punktów życia podczas walki': 'pkt hp podczas walki',
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
            '17% szansy na zwiększenie mocy ciosu krytycznego o 75%.': '17% szansy na zwiększenie mocy ciosu krytycznego o 75% DODATKOWO: 50% szans na rozjebanie oponenta jednym strzałem   (Wymagana profesja: Wojownik lub Mag)',
            'Absorbuje': 'Absa',
            'obrażeń fizycznych': 'DMG FIZ',
            'obrażeń magicznych': 'DMG MAG',
            'Zmniejsza o': 'Slow o',
            'szybkość ataku celu': 'SA',
            'Niszczenie odporności magicznych o': 'Niszczara odpów o',
            'podczas ciosu': 'przy hicie',
            'szans na kontratak po ciosie krytycznym': 'na kontre'
        };

        const merged = { ...defaultStats, ...editableBonuses.statystyki };

        // Filtruj wyłączone bonusy
        const disabledList = editableBonuses.statystyki_disabled || {};
        Object.entries(merged).forEach(([key, value]) => {
            if (!disabledList[key]) {
                bonusNames[key] = value;
            }
        });
    }

    // Interfejs
    if (config.interfejs) {
        const defaultInterface = {
            'Teleportuje gracza na mapę': 'Tepa na',
            'Wewnętrzny spokój': 'umka dla cweli',
            'Ogłuszający cios': 'UGA BUGA MACZUGA',
        };

        const merged = { ...defaultInterface, ...editableBonuses.interfejs };

        // Filtruj wyłączone bonusy
        const disabledList = editableBonuses.interfejs_disabled || {};
        Object.entries(merged).forEach(([key, value]) => {
            if (!disabledList[key]) {
                bonusNames[key] = value;
            }
        });
    }
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
    /Soulbound/i,
    /Wiąże po założeniu/i
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

function addUpgradeInfo(tooltipContent) {
    if (!config.kalkulatorUlepszen) {
        return tooltipContent;
    }

    // Sprawdź czy kalkulator już został dodany
    if (tooltipContent.includes('Koszt ulepszeń:')) {
        return tooltipContent;
    }

    const itemInfo = parseItemInfo(tooltipContent);

    // NOWE: Sprawdź czy kalkulator jest włączony dla tej rangi
    const rarityKey = itemInfo.rarity.toLowerCase().replace('e', '').replace('y', 'y'); // normalizuj
    const rarityMap = {
        'zwykły': 'zwykly',
        'zwykłe': 'zwykly',
        'unikatowy': 'unikatowy',
        'unikatowe': 'unikatowy',
        'heroiczny': 'heroiczny',
        'heroiczne': 'heroiczny',
        'ulepszony': 'ulepszony',
        'ulepszonych': 'ulepszony',
        'legendarny': 'legendarny',
        'legendarne': 'legendarny'
    };

    const normalizedRarity = rarityMap[itemInfo.rarity.toLowerCase()] || 'zwykly';

    if (!calculatorRarities[normalizedRarity]) {
        return tooltipContent; // Kalkulator wyłączony dla tej rangi
    }

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

    // DODATKOWA BLOKADA: Nie modyfikuj tekstów zawierających charakterystyczne frazy z panelu
    const settingsPanelPhrases = [
        'Better UI',
        'Edytuj bonusy',
        'Dodaj now',
        'kwak-',
        'better-ui-',
        'bonus-edit-row',
        'Włącz bonusy',
        'Włącz statystyki',
        'Włącz zmiany interfejsu',
        'Włącz kalkulator'
    ];

    for (const phrase of settingsPanelPhrases) {
        if (text.includes(phrase)) {
            return text;
        }
    }

    let result = text;

    // NOWA LOGIKA: Zamieniaj tylko POZA nazwą przedmiotu
    // Nazwa przedmiotu to wszystko przed pierwszym "item-tip-section"
    const sectionSplit = result.split(/(<div[^>]*class="item-tip-section[^>]*>)/i);

    if (sectionSplit.length > 1) {
        // Tooltip ma sekcje
        // [0] = nazwa przedmiotu (NIE ZAMIENIAJ)
        // [1+] = sekcje i zawartość (ZAMIENIAJ)

        for (let i = 1; i < sectionSplit.length; i++) {
            for (const [original, replacement] of Object.entries(bonusNames)) {
                if (sectionSplit[i].includes(original)) {
                    sectionSplit[i] = sectionSplit[i].replace(
                        new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        replacement
                    );
                }
            }
        }
        result = sectionSplit.join('');
    } else {
        // Nie ma sekcji - zamień wszędzie (stary tooltip lub nie-przedmiot)
        for (const [original, replacement] of Object.entries(bonusNames)) {
            if (result.includes(original)) {
                result = result.replace(
                    new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    replacement
                );
            }
        }
    }

    // Następnie dodaj informacje o ulepszeniu dla wszystkich przedmiotów (tylko jeśli włączone)
    if (config.kalkulatorUlepszen && ((result.includes('item-tip') || result.includes('Poziom:')) && isUpgradeableItem(result))) {
        result = addUpgradeInfo(result);
    }

    return result;
}

function setupEngineHooks() {
    const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
    Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(value) {
            // BLOKADA: Sprawdź czy element należy do panelu ustawień
            if (this.id === 'kwak-better-ui-settings-panel' ||
                this.closest('#kwak-better-ui-settings-panel') ||
                this.id?.includes('addon-') ||
                this.className?.includes('kwak-addon') ||
                this.className?.includes('better-ui-') ||
                this.className?.includes('bonus-edit-row')) {
                return originalInnerHTMLSetter.call(this, value);
            }

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
            // BLOKADA: Sprawdź czy węzeł należy do panelu ustawień
            if (this.nodeType === Node.ELEMENT_NODE) {
                if (this.id === 'kwak-better-ui-settings-panel' ||
                    this.closest('#kwak-better-ui-settings-panel') ||
                    this.id?.includes('addon-') ||
                    this.className?.includes('kwak-addon') ||
                    this.className?.includes('better-ui-') ||
                    this.className?.includes('bonus-edit-row')) {
                    return originalTextContentSetter.call(this, value);
                }
            }

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
function integrateWithAddonManager() {
    const checkForManager = setInterval(() => {
        const addonContainer = document.getElementById('addon-better_ui');
        if (!addonContainer) return;


        if (addonContainer.querySelector('#kwak-better-ui-settings-btn')) {
            clearInterval(checkForManager);
            return;
        }

        let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
        addSettingsButton(addonNameContainer);
        clearInterval(checkForManager);
    }, 500);

    setTimeout(() => {
        clearInterval(checkForManager);
    }, 20000);
}


function addSettingsButton(container) {
    // Znajdź znak zapytania
    const helpIcon = container.querySelector('.kwak-addon-help-icon');
    if (!helpIcon) return;

    // Dodaj przycisk dokładnie obok
    const settingsBtn = document.createElement('span');
    settingsBtn.id = 'kwak-better-ui-settings-btn';
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

    // Wstaw dokładnie po znaku zapytania
    helpIcon.insertAdjacentElement('afterend', settingsBtn);

    // Stwórz panel od razu
    createSettingsPanel();

settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSettingsPanel();
});
}
function exportSettings() {
    const settingsData = {
        config: config,
        editableBonuses: editableBonuses,
        calculatorRarities: calculatorRarities
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
    importModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    importModal.innerHTML = `
        <div style="background: #2a2a2a; border: 1px solid #444; border-radius: 4px; padding: 20px; width: 500px; max-width: 90vw;">
            <h3 style="color: #fff; margin: 0 0 15px 0; text-align: center;">Importuj ustawienia</h3>
            <div style="margin-bottom: 10px; color: #ccc; font-size: 12px;">
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
            " placeholder='{"config":{...}}'></textarea>
            <div style="display: flex; gap: 8px; margin-top: 15px;">
                <button id="import-cancel" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                    Anuluj
                </button>
                <button id="import-confirm" style="flex: 1; padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                    Importuj
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(importModal);

    const textarea = importModal.querySelector('#import-textarea');
    textarea.focus();

    importModal.querySelector('#import-cancel').addEventListener('click', () => {
        importModal.remove();
    });

    importModal.querySelector('#import-confirm').addEventListener('click', () => {
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

        if (!data.config) {
            throw new Error('Nieprawidłowy format - brak sekcji "config"');
        }

        // Importuj config
        config = { ...config, ...data.config };

        // Importuj editable bonuses
        if (data.editableBonuses) {
            editableBonuses = data.editableBonuses;
        }

        // Importuj calculator rarities
        if (data.calculatorRarities) {
            calculatorRarities = data.calculatorRarities;
        }

        saveConfig();
        updateBonusNames();
        showNotification('Ustawienia zaimportowane pomyślnie!', 'success');

        // Odśwież okno ustawień jeśli jest otwarte
        const panel = document.getElementById('kwak-better-ui-settings-panel');
        if (panel && panel.style.display !== 'none') {
            panel.remove();
            createSettingsPanel();
            toggleSettingsPanel();
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
        z-index: 10002;
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
function createSettingsPanel() {
    const panel = document.createElement('div');
    panel.id = 'kwak-better-ui-settings-panel';
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
        width: 600px;
        height: 650px;
        max-height: 90vh;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        flex-direction: column;
    `;

    panel.innerHTML = `
<div id="better-ui-panel-header" style="position: relative; color: #fff; font-size: 14px; text-align: center; font-weight: bold; padding: 15px 40px 8px 15px; border-bottom: 1px solid #444; cursor: move; user-select: none; background: #333; border-radius: 4px 4px 0 0;">
    Better UI - Settings
    <button id="better-ui-close-header" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #444; border: none; color: #fff; font-size: 18px; cursor: pointer; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border-radius: 3px; line-height: 1; padding: 0;">×</button>
</div>

        <!-- ZAKŁADKI -->

        <div style="display: flex; background: #1a1a1a; border-bottom: 1px solid #444; flex-shrink: 0;">
            <button class="better-ui-tab active" data-tab="legendarne">Legendarne</button>
            <button class="better-ui-tab" data-tab="statystyki">Statystyki</button>
            <button class="better-ui-tab" data-tab="interfejs">Interfejs</button>
            <button class="better-ui-tab" data-tab="kalkulator">Kalkulator</button>
        </div>

        <div id="better-ui-tabs-content" style="flex: 1; min-height: 0; overflow: hidden;">
            <!-- ZAKŁADKA: LEGENDARNE -->
            <div class="better-ui-tab-content active" data-tab="legendarne">
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-weight: normal; color: #ccc; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="bonusy-legendarne" ${config.bonusyLegendarne ? 'checked' : ''}>
                        Włącz bonusy legendarne
                    </label>
                    <div style="font-size: 10px; color: #888; margin-top: 5px; line-height: 1.4;">
                        Skróty dla bonusów legendarnych
                    </div>
                </div>

                <!-- EDYCJA BONUSÓW LEGENDARNYCH -->
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <div style="color: #ccc; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Edytuj bonusy legendarne:</div>
                    <div id="legendary-bonuses-list" style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- Dynamicznie generowane -->
                    </div>
                    <button id="add-legendary-bonus" style="margin-top: 10px; padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; width: 100%;">
                        + Dodaj nowy bonus
                    </button>
                </div>
            </div>

            <!-- ZAKŁADKA: STATYSTYKI -->
            <div class="better-ui-tab-content" data-tab="statystyki">
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-weight: normal; color: #ccc; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="statystyki-przedmiotow" ${config.statystykiPrzedmiotow ? 'checked' : ''}>
                        Włącz statystyki przedmiotów
                    </label>
                    <div style="font-size: 10px; color: #888; margin-top: 5px; line-height: 1.4;">
                        Skróty dla statystyk przedmiotów
                    </div>
                </div>

                <!-- EDYCJA STATYSTYK -->
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <div style="color: #ccc; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Edytuj statystyki:</div>
                    <div id="stats-bonuses-list" style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- Dynamicznie generowane -->
                    </div>
                    <button id="add-stat-bonus" style="margin-top: 10px; padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; width: 100%;">
                        + Dodaj nową statystykę
                    </button>
                </div>
            </div>

            <!-- ZAKŁADKA: INTERFEJS -->
            <div class="better-ui-tab-content" data-tab="interfejs">
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-weight: normal; color: #ccc; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="interfejs" ${config.interfejs ? 'checked' : ''}>
                        Włącz zmiany interfejsu
                    </label>
                    <div style="font-size: 10px; color: #888; margin-top: 5px; line-height: 1.4;">
                        Skróty dla elementów interfejsu
                    </div>
                </div>

                <!-- EDYCJA INTERFEJSU -->
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <div style="color: #ccc; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Edytuj elementy interfejsu:</div>
                    <div id="interface-bonuses-list" style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- Dynamicznie generowane -->
                    </div>
                    <button id="add-interface-bonus" style="margin-top: 10px; padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; width: 100%;">
                        + Dodaj nowy element
                    </button>
                </div>
            </div>

            <!-- ZAKŁADKA: KALKULATOR -->
            <div class="better-ui-tab-content" data-tab="kalkulator">
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-weight: normal; color: #ccc; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="kalkulator-ulepszen" ${config.kalkulatorUlepszen ? 'checked' : ''}>
                        Włącz kalkulator ulepszeń
                    </label>
                    <div style="font-size: 10px; color: #888; margin-top: 5px; line-height: 1.4;">
                        Pokazuje koszty ulepszenia w tooltipie
                    </div>
                </div>

                <!-- WYBÓR RANG -->
                <div style="margin-bottom: 15px; background: #333; border: 1px solid #444; border-radius: 3px; padding: 12px;">
                    <div style="color: #ccc; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Wyświetlaj kalkulator dla rang:</div>

                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: normal; color: #ccc; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="calc-rarity-zwykly" ${calculatorRarities.zwykly ? 'checked' : ''}>
                        Popspolite
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: normal; color: #0099ff; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="calc-rarity-unikatowy" ${calculatorRarities.unikatowy ? 'checked' : ''}>
                        Unikatowe
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: normal; color: #9900ff; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="calc-rarity-heroiczny" ${calculatorRarities.heroiczny ? 'checked' : ''}>
                        Heroiczne
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: normal; color: #00ff00; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="calc-rarity-ulepszony" ${calculatorRarities.ulepszony ? 'checked' : ''}>
                        Ulepszone
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; color: #ff6600; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" class="better-ui-checkbox" id="calc-rarity-legendarny" ${calculatorRarities.legendarny ? 'checked' : ''}>
                        Legendarne
                    </label>

                    <div style="font-size: 10px; color: #888; margin-top: 10px; line-height: 1.4;">
                        Kalkulator będzie pokazywany tylko dla zaznaczonych rang
                    </div>
                </div>
            </div>
        </div>
<div style="display: flex; gap: 8px; padding: 12px 15px; background: #2a2a2a; border-radius: 0 0 4px 4px; border-top: 1px solid #444; flex-shrink: 0;">
    <button id="export-settings" style="flex: 1; padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
        Eksportuj
    </button>
    <button id="import-settings" style="flex: 1; padding: 8px 12px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
        Importuj
    </button>
</div>
    `;

    // Dodaj style
    if (!document.getElementById('kwak-better-ui-styles')) {
        const style = document.createElement('style');
        style.id = 'kwak-better-ui-styles';
        style.textContent = `
            .better-ui-checkbox {
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

            .better-ui-checkbox:hover {
                border-color: #4CAF50;
            }

            .better-ui-checkbox:checked {
                background: #4CAF50;
                border-color: #4CAF50;
            }

            .better-ui-checkbox:checked::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 14px;
                font-weight: bold;
            }

            .better-ui-tab {
                flex: 1;
                padding: 12px;
                background: #1a1a1a;
                border: none;
                border-bottom: 2px solid transparent;
                color: #888;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                transition: all 0.2s;
            }

            .better-ui-tab:hover {
                background: #252525;
                color: #ccc;
            }

            .better-ui-tab.active {
                background: #2a2a2a;
                color: #4CAF50;
                border-bottom-color: #4CAF50;
            }

.better-ui-tab-content {
    display: none;
    height: 450px;
    overflow-y: auto;
    padding: 15px;
}

.better-ui-tab-content.active {
    display: block;
}

/* Scrollbary dla zakładek */
.better-ui-tab-content::-webkit-scrollbar {
    width: 8px;
}

.better-ui-tab-content::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 4px;
}

.better-ui-tab-content::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
}

.better-ui-tab-content::-webkit-scrollbar-thumb:hover {
    background: #666;
}

.better-ui-tab-content {
    scrollbar-width: thin;
    scrollbar-color: #555 #2a2a2a;
}
#better-ui-close-header:hover {
    background: #f44336;
    color: #fff;
}

.bonus-edit-row {
    display: flex;
    gap: 4px;
    align-items: center;
    background: #2a2a2a;
    padding: 6px;
    border-radius: 3px;
}

.bonus-edit-row .bonus-enable-checkbox {
    flex-shrink: 0;
    margin-right: 4px;
}

.bonus-edit-row input[type="text"] {
    flex: 1;
    padding: 4px 8px;
    background: #1a1a1a;
    border: 1px solid #555;
    border-radius: 3px;
    color: #ccc;
    font-size: 11px;
}

.bonus-edit-row input:focus {
    outline: none;
    border-color: #4CAF50;
}

.bonus-edit-row button {
    padding: 4px 8px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    flex-shrink: 0;
}

.bonus-edit-row button:hover {
    background: #d32f2f;
}
`;
        document.head.appendChild(style);
    }

document.body.appendChild(panel);

// BLOKADA SCROLLA
const tabContents = panel.querySelectorAll('.better-ui-tab-content');
tabContents.forEach(content => {
    content.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });
});

function renderBonusList(type, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Domyślne wartości
    const defaults = {
        'legendarne': {
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
        },
        'statystyki': {
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
            'Trucizna': 'Truta',
            'Niszczenie pancerza': 'Niszczara panca',
            'Obniżanie szybkości ataku': 'Obniżka SA',
            'Obniżanie uniku': 'Obniżka uniku',
            'Podczas ataku unik przeciwnika jest mniejszy o': 'Obniżka uniku o',
            'Obniża szybkość ataku przeciwnika o': 'Obniżka SA o',
            'Pancerz': 'Panc',
            'pancerza': 'panca',
            'punktów życia podczas walki': 'pkt hp podczas walki',
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
            '17% szansy na zwiększenie mocy ciosu krytycznego o 75%.': '17% szansy na zwiększenie mocy ciosu krytycznego o 75% DODATKOWO: 50% szans na rozjebanie oponenta jednym strzałem   (Wymagana profesja: Wojownik lub Mag)',
            'Absorbuje': 'Absa',
            'obrażeń fizycznych': 'DMG FIZ',
            'obrażeń magicznych': 'DMG MAG',
            'Zmniejsza o': 'Slow o',
            'szybkość ataku celu': 'SA',
            'Niszczenie odporności magicznych o': 'Niszczara odpów o',
            'podczas ciosu': 'przy hicie',
            'szans na kontratak po ciosie krytycznym': 'na kontre'
        },
        'interfejs': {
            'Teleportuje gracza na mapę': 'Tepa na',
            'Wewnętrzny spokój': 'umka dla cweli',
            'Ogłuszający cios': 'UGA BUGA MACZUGA',
        }
    };

    // Inicjalizuj disabled bonuses jeśli nie istnieją
    if (!editableBonuses[type + '_disabled']) {
        editableBonuses[type + '_disabled'] = {};
    }

    // Scal domyślne z custom
    const allBonuses = { ...defaults[type], ...editableBonuses[type] };

    Object.entries(allBonuses).forEach(([original, replacement]) => {
        const row = document.createElement('div');
        row.className = 'bonus-edit-row';

        // Sprawdź czy to custom czy domyślny
        const isCustom = editableBonuses[type].hasOwnProperty(original) && !defaults[type].hasOwnProperty(original);
        const isDisabled = editableBonuses[type + '_disabled'][original] === true;

        row.innerHTML = `
            <input type="checkbox" class="better-ui-checkbox bonus-enable-checkbox" ${!isDisabled ? 'checked' : ''} title="Włącz/wyłącz ten bonus">
            <input type="text" class="bonus-original" value="${original}" placeholder="Oryginalna nazwa" ${!isCustom ? 'readonly' : ''} style="${!isCustom ? 'background: #1a1a1a; color: #888;' : ''}${isDisabled ? ' opacity: 0.5;' : ''}">
            <span style="color: #888;">→</span>
            <input type="text" class="bonus-replacement" value="${replacement}" placeholder="Skrót" style="${isDisabled ? 'opacity: 0.5;' : ''}">
            <button class="bonus-delete" ${!isCustom ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}>🗑️</button>
        `;

        const enableCheckbox = row.querySelector('.bonus-enable-checkbox');
        const originalInput = row.querySelector('.bonus-original');
        const replacementInput = row.querySelector('.bonus-replacement');
        const deleteBtn = row.querySelector('.bonus-delete');

        const oldOriginal = original;

        // Checkbox włącz/wyłącz
        enableCheckbox.addEventListener('change', () => {
            if (enableCheckbox.checked) {
                delete editableBonuses[type + '_disabled'][originalInput.value];
            } else {
                editableBonuses[type + '_disabled'][originalInput.value] = true;
            }
            saveConfig();
            updateBonusNames();
            renderBonusList(type, containerId);
        });

        // Tylko dla custom można zmieniać nazwę oryginalną
        if (isCustom) {
            originalInput.addEventListener('change', () => {
                if (originalInput.value && originalInput.value !== oldOriginal) {
                    delete editableBonuses[type][oldOriginal];
                    editableBonuses[type][originalInput.value] = replacementInput.value;

                    // Przenieś status disabled
                    if (editableBonuses[type + '_disabled'][oldOriginal]) {
                        delete editableBonuses[type + '_disabled'][oldOriginal];
                        editableBonuses[type + '_disabled'][originalInput.value] = true;
                    }

                    saveConfig();
                    updateBonusNames();
                }
            });
        }

        // Zmiana skrótu - zawsze dozwolona
        replacementInput.addEventListener('change', () => {
            if (defaults[type].hasOwnProperty(original)) {
                // To jest domyślny bonus - nadpisz tylko jeśli się zmienił
                if (replacementInput.value !== defaults[type][original]) {
                    editableBonuses[type][original] = replacementInput.value;
                } else {
                    // Przywrócono domyślną wartość - usuń z custom
                    delete editableBonuses[type][original];
                }
            } else {
                // To jest custom bonus
                editableBonuses[type][originalInput.value] = replacementInput.value;
            }
            saveConfig();
            updateBonusNames();
        });

        // Usuwanie - tylko custom
        if (isCustom) {
            deleteBtn.addEventListener('click', () => {
                delete editableBonuses[type][originalInput.value];
                delete editableBonuses[type + '_disabled'][originalInput.value];
                saveConfig();
                updateBonusNames();
                renderBonusList(type, containerId);
            });
        }

        container.appendChild(row);
    });
}

    // Renderuj listy
    renderBonusList('legendarne', 'legendary-bonuses-list');
    renderBonusList('statystyki', 'stats-bonuses-list');
    renderBonusList('interfejs', 'interface-bonuses-list');

    // Przyciski dodawania
    document.getElementById('add-legendary-bonus').addEventListener('click', () => {
        editableBonuses.legendarne['Nowa nazwa'] = 'Skrót';
        saveConfig();
        renderBonusList('legendarne', 'legendary-bonuses-list');
    });

    document.getElementById('add-stat-bonus').addEventListener('click', () => {
        editableBonuses.statystyki['Nowa statystyka'] = 'Skrót';
        saveConfig();
        renderBonusList('statystyki', 'stats-bonuses-list');
    });

    document.getElementById('add-interface-bonus').addEventListener('click', () => {
        editableBonuses.interfejs['Nowy element'] = 'Skrót';
        saveConfig();
        renderBonusList('interfejs', 'interface-bonuses-list');
    });

    // ===== OBSŁUGA ZAKŁADEK =====
    const tabs = panel.querySelectorAll('.better-ui-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            const targetContent = panel.querySelector(`.better-ui-tab-content[data-tab="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                 }
                tabContents.forEach(tc => {
                if (tc.getAttribute('data-tab') !== targetTab) {
                    tc.style.display = 'none';
                }
            });
        });
    });
        const savedPosition = JSON.parse(localStorage.getItem('betterUISettingsPanelPosition') || 'null');
    if (savedPosition) {
        panel.style.left = `${savedPosition.x}px`;
        panel.style.top = `${savedPosition.y}px`;
        panel.style.transform = 'none';
    }





    // *** PRZECIĄGANIE OKNA ***
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const header = panel.querySelector('#better-ui-panel-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.id === 'better-ui-close-header') return;

        isDragging = true;
        const rect = panel.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        e.preventDefault();

        header.style.background = '#444';
        panel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - panel.offsetWidth);
        const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - panel.offsetHeight);

        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
        panel.style.transform = 'none';

        localStorage.setItem('betterUISettingsPanelPosition', JSON.stringify({x, y}));
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            header.style.background = '#333';
            panel.style.cursor = 'default';
        }
    });


    // ===== EVENT LISTENERY =====

    // Checkboxy główne
    panel.querySelector('#bonusy-legendarne').addEventListener('change', (e) => {
        e.stopPropagation();
        config.bonusyLegendarne = e.target.checked;
        updateBonusNames();
        saveConfig();
    });

    panel.querySelector('#statystyki-przedmiotow').addEventListener('change', (e) => {
        e.stopPropagation();
        config.statystykiPrzedmiotow = e.target.checked;
        updateBonusNames();
        saveConfig();
    });

    panel.querySelector('#interfejs').addEventListener('change', (e) => {
        e.stopPropagation();
        config.interfejs = e.target.checked;
        updateBonusNames();
        saveConfig();
    });

    panel.querySelector('#kalkulator-ulepszen').addEventListener('change', (e) => {
        e.stopPropagation();
        config.kalkulatorUlepszen = e.target.checked;
        saveConfig();
    });

    // Checkboxy rang kalkulatora
    panel.querySelector('#calc-rarity-zwykly').addEventListener('change', (e) => {
        calculatorRarities.zwykly = e.target.checked;
        saveConfig();
    });

    panel.querySelector('#calc-rarity-unikatowy').addEventListener('change', (e) => {
        calculatorRarities.unikatowy = e.target.checked;
        saveConfig();
    });

    panel.querySelector('#calc-rarity-heroiczny').addEventListener('change', (e) => {
        calculatorRarities.heroiczny = e.target.checked;
        saveConfig();
    });

    panel.querySelector('#calc-rarity-ulepszony').addEventListener('change', (e) => {
        calculatorRarities.ulepszony = e.target.checked;
        saveConfig();
    });

    panel.querySelector('#calc-rarity-legendarny').addEventListener('change', (e) => {
        calculatorRarities.legendarny = e.target.checked;
        saveConfig();
    });

    // Przyciski
panel.querySelector('#export-settings').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    exportSettings();
});

    panel.querySelector('#better-ui-close-header').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSettingsPanel();
    });

panel.querySelector('#import-settings').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showImportDialog();
});
}
function toggleSettingsPanel() {
    const panel = document.getElementById('kwak-better-ui-settings-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

const initInterval = setInterval(() => {
    if (typeof Engine !== 'undefined' && Engine?.allInit) {
        clearInterval(initInterval);
        init();
    }
}, 250);
function init() {
    loadConfig();
    updateBonusNames();
    setupEngineHooks();
    hookMargonemFunctions();
    integrateWithAddonManager();
    setupBackupObserver();
}
    init();

})();
