(function() {
    'use strict';

    // Konfiguracja - co ma być włączon
    let config = {
        bonusyLegendarne: true,
        statystykiPrzedmiotow: true,
        interfejs: true
    };
let bonusNames = {};

function saveConfig() {
    try {
        window.localStorage.setItem('betterUI_config', JSON.stringify(config));
        console.log('Better UI: Konfiguracja zapisana');
    } catch (e) {
        console.log('Better UI: Błąd podczas zapisywania:', e);
    }
}
function loadConfig() {
    try {
        const saved = window.localStorage.getItem('betterUI_config');
        if (saved) {
            const savedConfig = JSON.parse(saved);
            config = { ...config, ...savedConfig };
            console.log('Better UI: Konfiguracja wczytana');
        }
    } catch (e) {
    }
}
function updateBonusNames() {
    bonusNames = {};

    // Bonusy legendarne
    if (config.bonusyLegendarne) {
        Object.assign(bonusNames, {
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
        });
    }

    // Statystyki przedmiotów
    if (config.statystykiPrzedmiotow) {
        Object.assign(bonusNames, {
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
        });
    }

    // Interfejs
    if (config.interfejs) {
        Object.assign(bonusNames, {
            'Punkty Honoru': 'PH',
            'Teleportuje gracza na mapę': 'Tepa na',
            'Wewnętrzny spokój': 'umka dla cweli',
            'Smocze Runy': 'SR',
            'Turkanie energii': 'Przywro energii',
            'Przywracanie energii': 'Przywro energii'
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
        padding: 15px;
        z-index: 10000;
        display: none;
        min-width: 280px;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;

    panel.innerHTML = `
        <div style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding-bottom: 8px; border-bottom: 1px solid #444;">
            Better UI - Settings
        </div>

        <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 4px 0;">
                <span style="color: #ccc; font-size: 12px;">Bonusy Legendarne</span>
                <label class="kwak-toggle-switch">
                    <input type="checkbox" id="bonusy-legendarne" ${config.bonusyLegendarne ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 4px 0;">
                <span style="color: #ccc; font-size: 12px;">Statystyki Przedmiotów</span>
                <label class="kwak-toggle-switch">
                    <input type="checkbox" id="statystyki-przedmiotow" ${config.statystykiPrzedmiotow ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 4px 0;">
                <span style="color: #ccc; font-size: 12px;">Interfejs(w trakcie naprawy)</span>
                <label class="kwak-toggle-switch">
                    <input type="checkbox" id="interfejs" ${config.interfejs ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
            <button id="close-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                Zamknij
            </button>
            <button id="reload-game" style="flex: 1; padding: 8px 12px; background: #ff9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                Odśwież grę
            </button>
        </div>
    `;

    // Dodaj style przełączników jak w managerze
    if (!document.getElementById('kwak-better-ui-toggle-styles')) {
        const style = document.createElement('style');
        style.id = 'kwak-better-ui-toggle-styles';
        style.textContent = `
            .kwak-toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }

            .kwak-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .kwak-toggle-switch .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #555;
                transition: 0.3s;
                border-radius: 24px;
                border: 1px solid #666;
            }

            .kwak-toggle-switch .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }

            .kwak-toggle-switch input:checked + .slider {
                background-color: #4CAF50;
                border-color: #4CAF50;
            }

            .kwak-toggle-switch input:checked + .slider:before {
                transform: translateX(20px);
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(panel);

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

panel.querySelector('#close-settings').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSettingsPanel();
});
panel.querySelector('#reload-game').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    location.reload();
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
