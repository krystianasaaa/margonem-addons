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


    function replaceText(text) {
        if (!text || typeof text !== 'string') return text;

        let result = text;
        for (const [original, replacement] of Object.entries(bonusNames)) {
            if (result.includes(original)) {
                result = result.replace(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
            }
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
                    if (Object.keys(bonusNames).some(bonus => value.includes(bonus))) {
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
            if (typeof data === 'string' && Object.keys(bonusNames).some(bonus => data.includes(bonus))) {
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
                    console.log('Margonem Bonus Renamer: Found game object:', gameObj);


                    const possibleTooltipFunctions = ['showTip', 'createTip', 'tooltip', 'itemTip', 'getTip'];

                    for (const funcName of possibleTooltipFunctions) {
                        if (typeof gameObj[funcName] === 'function') {
                            console.log(`Found tooltip function: ${funcName}`);


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
                                    console.log(`Found nested tooltip function: ${key}`);

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
