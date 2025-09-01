(function() {
    'use strict';

    const bonusNames = {
        // Bonusy standardowe
        'Cios krytyczny': 'Krytyk',
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
        '17% szansy na zwiększenie mocy ciosu krytycznego o 75%.': '17% szansy na zwiększenie mocy ciosu krytycznego o 75%, 50% szans na rozjebanie oponenta jednym strzałem   (Wymagana profesja: Wojownik lub Mag)',
        'Przywracanie Energii': 'Przywro Energi',
        'Absorbuje': 'Absa',
        'obrażeń fizycznych': 'DMG FIZ',
        'obrażeń magicznych': 'DMG MAG',
        'Zmniejsza o': 'Slow o',
        'szybkość ataku celu': 'SA',
        'Niszczenie odporności magicznych o': 'Niszczara odpów o',
        'podczas ciosu': 'przy hicie',
        'Wewnętrzny spokój': 'umka dla cweli',
        'Smocze Runy': 'SR',
        'Punkty Honoru': 'PH',

        // Bonusy legendarne
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

        // Szukanie rzadkości na podstawie data-item-type
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

        // Fallback - szukanie rzadkości w tekście (jeśli nie ma data-item-type)
        if (itemInfo.rarity === 'zwykły') {
            const rarityPatterns = [
                /(Zwykłe|Zwykły)/i,
                /(Unikatowe|Unikatowy)/i,
                /(Heroiczne|Heroiczny)/i,
                /(Ulepszonych|Ulepszony)/i,
                /(Legendarne|Legendarny)/i
            ];

            for (const pattern of rarityPatterns) {
                const rarityMatch = tooltipContent.match(pattern);
                if (rarityMatch) {
                    itemInfo.rarity = rarityMatch[1].toLowerCase();
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
    }

    init();

})();
