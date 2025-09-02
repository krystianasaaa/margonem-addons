(function() {
    'use strict';

    let searchWindow = null;
    let lastSearchTerm = '';
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;


    let resultWindow = null;
    let resultIsDragging = false;
    let resultCurrentX = 0;
    let resultCurrentY = 0;
    let resultInitialX = 0;
    let resultInitialY = 0;
    let resultXOffset = 0;
    let resultYOffset = 0;


    function createSearchWindow() {
        if (searchWindow) {
            document.body.removeChild(searchWindow);
        }

        searchWindow = document.createElement('div');
        searchWindow.id = 'bagSearchWindow';
searchWindow.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border: 2px solid #444444;
            border-radius: 12px;
            padding: 0;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            backdrop-filter: blur(10px);
            overflow: hidden;
            cursor: move;
        `;


        const header = document.createElement('div');
        header.className = 'drag-header';
header.style.cssText = `
    background: linear-gradient(135deg, #333333, #555555);
    color: white;
    padding: 12px 15px;
    border-radius: 10px 10px 0 0;
    cursor: move;
    user-select: none;
    border-bottom: 1px solid #444444;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Wyszukaj przedmioty w torbach';
        title.style.cssText = `
            margin: 0;
            color: white;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 15px;
            background: rgba(0,0,0,0.2);
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Wpisz nazwę przedmiotu...';
        searchInput.value = lastSearchTerm;
        searchInput.style.cssText = `
            width: 100%;
            padding: 8px;
            background: rgba(50,130,184,0.2);
            border: 1px solid #0f4c75;
            border-radius: 6px;
            color: #e8f4fd;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 10px;
            transition: all 0.2s;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
        `;

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Szukaj';
        searchButton.style.cssText = `
            padding: 8px 16px;
            background: linear-gradient(135deg, #333333, #555555);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(15,76,117,0.3);
        `;

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Wyczyść';
        clearButton.style.cssText = `
            padding: 8px 16px;
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(244,67,54,0.3);
        `;

        buttonContainer.appendChild(searchButton);
        buttonContainer.appendChild(clearButton);

        header.appendChild(title);
        content.appendChild(searchInput);
        content.appendChild(buttonContainer);
        searchWindow.appendChild(header);
        searchWindow.appendChild(content);
        document.body.appendChild(searchWindow);


        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);


        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            lastSearchTerm = searchTerm;
            performSearch(searchTerm);
            closeSearchWindow();
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            lastSearchTerm = '';
            clearSearch();
            closeSearchWindow();
        });


        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });


        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeSearchWindow();
                document.removeEventListener('keydown', escapeHandler);
            }
        });


        setTimeout(() => searchInput.focus(), 100);
    }


    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === searchWindow.querySelector('.drag-header') ||
            e.target.closest('.drag-header')) {
            isDragging = true;
        }
    }

    function dragMove(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            searchWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }


    function resultDragStart(e) {
        resultInitialX = e.clientX - resultXOffset;
        resultInitialY = e.clientY - resultYOffset;

        if (e.target === resultWindow.querySelector('.result-drag-header') ||
            e.target.closest('.result-drag-header')) {
            resultIsDragging = true;
        }
    }

    function resultDragMove(e) {
        if (resultIsDragging) {
            e.preventDefault();
            resultCurrentX = e.clientX - resultInitialX;
            resultCurrentY = e.clientY - resultInitialY;
            resultXOffset = resultCurrentX;
            resultYOffset = resultCurrentY;

            resultWindow.style.transform = `translate(${resultCurrentX}px, ${resultCurrentY}px)`;
        }
    }

    function resultDragEnd(e) {
        resultInitialX = resultCurrentX;
        resultInitialY = resultCurrentY;
        resultIsDragging = false;
    }

    function closeSearchWindow() {
        if (searchWindow) {
            document.body.removeChild(searchWindow);
            searchWindow = null;

            xOffset = 0;
            yOffset = 0;
            currentX = 0;
            currentY = 0;
        }
    }

function performSearch(searchTerm) {
    console.log(`Rozpoczynam wyszukiwanie: "${searchTerm}"`);


    const allItems = document.querySelectorAll('.item[data-name]');
    const foundItems = [];
    const processedItems = new Set();


    clearBagHighlights();


    allItems.forEach(item => {
        item.style.boxShadow = 'none';
        item.style.opacity = '1';
        item.style.filter = 'none';
    });

    console.log(`Znaleziono ${allItems.length} przedmiotów do przeszukania`);

    allItems.forEach(item => {
        const itemName = item.getAttribute('data-name');
        if (!itemName) return;


        const rect = item.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;


        const isHidden = item.style.display === 'none' ||
                        item.style.visibility === 'hidden' ||
                        item.closest('[style*="display: none"]') ||
                        item.closest('[style*="visibility: hidden"]');


        if (!isVisible || isHidden) {
            console.log(`Pomijam niewidoczny element: ${itemName}`);
            return;
        }


        const isInTooltip = item.closest('.tooltip, .popup, .hint, .preview, .overlay, [class*="tooltip"], [class*="popup"], [class*="hint"]');
        if (isInTooltip) {
            console.log(`Pomijam element w tooltipie: ${itemName}`);
            return;
        }


        const itemId = `${itemName}-${Math.round(rect.left)}-${Math.round(rect.top)}`;


        if (processedItems.has(itemId)) {
            console.log(`Pomijam duplikat: ${itemName} (${itemId})`);
            return;
        }

        processedItems.add(itemId);

        const itemNameLower = itemName.toLowerCase();
        const isMatch = searchTerm === '' || itemNameLower.includes(searchTerm.toLowerCase());

        console.log(`Przedmiot: ${itemName}, Pasuje: ${isMatch}, Pozycja: ${Math.round(rect.left)},${Math.round(rect.top)}`);

        if (isMatch) {

            item.style.boxShadow = '0 0 10px #4CAF50';
            item.style.opacity = '1';
            item.style.filter = 'none';
            foundItems.push(item);
        } else {

            item.style.boxShadow = 'none';
            item.style.opacity = '0.3';
            item.style.filter = 'grayscale(100%)';
        }
    });

    console.log(`Znaleziono ${foundItems.length} unikalnych pasujących przedmiotów`);


    highlightBagsWithItems(foundItems);


    showSearchResults(searchTerm, allItems, foundItems);
}

function clearSearch() {

    const bagItems = document.querySelectorAll('.item.inventory-item[data-name]:not(.bag)');

    bagItems.forEach(item => {
        item.style.boxShadow = 'none';
        item.style.opacity = '1';
        item.style.filter = 'none';
    });


    const allItems = document.querySelectorAll('.item[data-name]');
    allItems.forEach(item => {
        item.style.boxShadow = 'none';
        item.style.opacity = '1';
        item.style.filter = 'none';
    });


    clearBagHighlights();


    if (resultWindow) {
        document.body.removeChild(resultWindow);
        resultWindow = null;
        resultXOffset = 0;
        resultYOffset = 0;
        resultCurrentX = 0;
        resultCurrentY = 0;
    }
}
function getBagInfo(item) {

    let bagNumber = item.getAttribute('data-bag');
    if (bagNumber && bagNumber !== 'null' && bagNumber !== '' && bagNumber !== '0') {
        const bagNum = parseInt(bagNumber);
        if (bagNum > 0) {
            const bagName = findBagName(bagNumber);
            console.log(`Znaleziono torbę bezpośrednio: ${bagNumber} -> ${bagName}`);
            return { number: bagNumber, name: bagName };
        }
    }


    let parent = item.parentElement;
    while (parent && parent !== document.body) {
        const parentBag = parent.getAttribute('data-bag');
        if (parentBag && parentBag !== 'null' && parentBag !== '' && parentBag !== '0') {
            const bagNum = parseInt(parentBag);
            if (bagNum > 0) {
                const bagName = findBagName(parentBag);
                console.log(`Znaleziono torbę w rodzicu: ${parentBag} -> ${bagName}`);
                return { number: parentBag, name: bagName };
            }
        }


        if (parent.id) {
            const bagFromId = extractBagNumberFromString(parent.id);
            if (bagFromId) {
                const bagNum = parseInt(bagFromId);
                if (bagNum > 0) {
                    const bagName = findBagName(bagFromId);
                    console.log(`Znaleziono torbę z ID: ${bagFromId} -> ${bagName}`);
                    return { number: bagFromId, name: bagName };
                }
            }
        }

        parent = parent.parentElement;
    }



    const mainInventoryBag = item.getAttribute('data-bag');
    if (mainInventoryBag === '0' || mainInventoryBag === null || mainInventoryBag === '') {

        const rect = item.getBoundingClientRect();
        const mainInventoryContainer = document.querySelector('#inventory, .inventory, [id*="inventory"], [class*="inventory"]');

        if (mainInventoryContainer) {
            const containerRect = mainInventoryContainer.getBoundingClientRect();

            if (rect.left >= containerRect.left && rect.right <= containerRect.right &&
                rect.top >= containerRect.top && rect.bottom <= containerRect.bottom) {
                console.log(`Przedmiot w głównym ekwipunku: ${item.getAttribute('data-name')}`);
                return null;
            }
        }
    }


    console.log(`Nie można ustalić torby dla przedmiotu: ${item.getAttribute('data-name')}`);
    return null;
}

function findBagName(bagNumber) {
    console.log(`Szukam nazwy dla torby: ${bagNumber}`);


    if (bagNumber === 'main' || bagNumber === '0') {
        return null;
    }


    const bagSelectors = [
        `.item.bag[data-bag="${bagNumber}"]`,
        `.bag[data-bag="${bagNumber}"]`,
        `.item[data-bag="${bagNumber}"].bag`,
        `.inventory-item[data-bag="${bagNumber}"].bag`,
        `[data-bag="${bagNumber}"][data-name]`,
        `[data-bag="${bagNumber}"] .item.bag`,
        `#bag${bagNumber}`,
        `#bag_${bagNumber}`,
        `.bag${bagNumber}`,
        `[class*="bag"][data-bag="${bagNumber}"]`
    ];

    for (const selector of bagSelectors) {
        try {
            const bagElements = document.querySelectorAll(selector);
            console.log(`Selektor ${selector} znalazł ${bagElements.length} elementów`);

            for (const bagElement of bagElements) {
                const name = bagElement.getAttribute('data-name') ||
                           bagElement.getAttribute('title') ||
                           bagElement.getAttribute('data-title') ||
                           bagElement.querySelector('[data-name]')?.getAttribute('data-name') ||
                           bagElement.textContent?.trim();

                if (name && name !== '' && name !== 'null' && name.length > 0) {
                    console.log(`✅ Znaleziono nazwę torby: ${name}`);

                    bagNameMapping[`data-bag=${bagNumber}`] = name;
                    return name;
                }
            }
        } catch (error) {
            console.log(`Błąd w selektorze ${selector}:`, error);
        }
    }

}



function highlightBagsWithItems(foundItems) {
    const bagNumbers = new Set();
    const bagInfos = new Map();


    foundItems.forEach(item => {
        const bagInfo = getBagInfo(item);
        if (bagInfo && bagInfo.number && bagInfo.number !== 'main') {
            console.log(`Przedmiot "${item.getAttribute('data-name')}" w torbie ${bagInfo.number} (${bagInfo.name})`);
            bagNumbers.add(bagInfo.number);
            bagInfos.set(bagInfo.number, bagInfo.name);
        }
    });

    console.log('Torby do podświetlenia:', Array.from(bagNumbers));


    clearBagHighlights();


    bagNumbers.forEach(bagNum => {
        console.log(`Podświetlam torbę: ${bagNum}`);


        const bagSelectors = [
            `.item.bag[data-bag="${bagNum}"]`,
            `.bag[data-bag="${bagNum}"]`,
            `.item[data-bag="${bagNum}"].bag`,
            `.inventory-item[data-bag="${bagNum}"].bag`
        ];

        let highlightedCount = 0;

        bagSelectors.forEach(selector => {
            const bagElements = document.querySelectorAll(selector);
            console.log(`Selektor "${selector}" znalazł ${bagElements.length} elementów`);

            bagElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;

                console.log(`Element torby:`, element, `Widoczny:`, isVisible, `Rozmiar:`, rect.width, 'x', rect.height);

                if (isVisible) {
                    element.style.boxShadow = '0 0 15px #FFD700 !important';
                    element.style.animation = 'bagPulse 2s infinite';
                    element.style.border = '2px solid #FFD700 !important';
                    element.classList.add('search-highlighted-bag');
                    highlightedCount++;
                    console.log(`✅ Podświetlono element torby ${bagNum}`);
                }
            });
        });

        console.log(`Podświetlono ${highlightedCount} elementów dla torby ${bagNum}`);
    });

}


    function clearBagHighlights() {
        const highlightedBags = document.querySelectorAll('.search-highlighted-bag');
        highlightedBags.forEach(bag => {
            bag.style.boxShadow = '';
            bag.style.animation = '';
            bag.classList.remove('search-highlighted-bag');
        });
    }

function countItems(itemsArray) {
    const itemCounts = {};
    itemsArray.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
    return itemCounts;
}

function formatItemsWithCount(itemsArray) {
    const itemCounts = countItems(itemsArray);
    return Object.entries(itemCounts).map(([itemName, count]) => {
        const displayName = count > 1 ? `${itemName} (${count})` : itemName;
        return `<span class="item-name">${displayName}</span>`;
    });
}
function showSearchResults(searchTerm, bagItems, foundItems) {

    if (resultWindow) {
        document.body.removeChild(resultWindow);
        resultWindow = null;
        resultXOffset = 0;
        resultYOffset = 0;
        resultCurrentX = 0;
        resultCurrentY = 0;
    }


    const itemsByBag = {};
    const itemsInMainInventory = [];

foundItems.forEach(item => {
    const bagInfo = getBagInfo(item);
    const itemName = item.getAttribute('data-name');

    console.log('Analizuję przedmiot:', itemName, 'BagInfo:', bagInfo);

    if (bagInfo && bagInfo.number && bagInfo.number !== 'null' && bagInfo.number !== '' && bagInfo.number !== '0' && bagInfo.name && bagInfo.name !== 'undefined') {
        const bagKey = `${bagInfo.number}|${bagInfo.name}`;
        if (!itemsByBag[bagKey]) {
            itemsByBag[bagKey] = [];
        }
        itemsByBag[bagKey].push(itemName);
        console.log(`✅ Dodano ${itemName} do torby ${bagInfo.name} (${bagInfo.number})`);
    }
    else {
        itemsInMainInventory.push(itemName);
        console.log(`✅ Dodano ${itemName} do głównego ekwipunku`);
    }
});

    console.log('Przedmioty w torbach:', itemsByBag);


    resultWindow = document.createElement('div');
    resultWindow.id = 'searchResultMessage';
    resultWindow.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        color: #e8f4fd;
        border-radius: 12px;
        border: 2px solid #0f4c75;
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        min-width: 350px;
        max-width: 400px;
        max-height: 500px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        animation: fadeIn 0.3s ease-out;
    `;


    const resultHeader = document.createElement('div');
    resultHeader.className = 'result-drag-header';
    resultHeader.style.cssText = `
        background: linear-gradient(135deg, #0f4c75, #3282b8);
        color: white;
        padding: 8px 12px;
        border-radius: 10px 10px 0 0;
        cursor: move;
        user-select: none;
        border-bottom: 1px solid #0f4c75;
        flex-shrink: 0;
    `;

    const resultTitle = document.createElement('h3');
    resultTitle.textContent = '🔍 Wyniki wyszukiwania';
    resultTitle.style.cssText = `
        margin: 0;
        color: white;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
    `;


    const resultContent = document.createElement('div');
    resultContent.style.cssText = `
        padding: 12px;
        overflow-y: auto;
        flex-grow: 1;
        background: rgba(0,0,0,0.2);
    `;

    let messageContent = `
        <div style="margin-bottom: 12px; text-align: center;">
<span style="color: #cccccc; font-weight: bold;">Znaleziono: ${foundItems.length} przedmiot(ów)</span><br>
<span style="color: #ffffff; font-size: 11px;">Szukano: "${searchTerm || 'wszystkie przedmioty'}"</span>
        </div>
    `;


    if (Object.keys(itemsByBag).length > 0) {
        messageContent += '<div style="border-top: 1px solid #0f4c75; padding-top: 10px;">';
        messageContent += '<strong style="color: #cccccc;">📦 Przedmioty w torbach:</strong><br>';

Object.entries(itemsByBag).forEach(([bagKey, items]) => {
    const [bagNumber, bagName] = bagKey.split('|');
    const formattedItems = formatItemsWithCount(items);

    messageContent += `
<div style="margin: 6px 0; padding: 8px; background: rgba(68,68,68,0.3); border-radius: 6px; border-left: 3px solid #777777;">
    <span style="color: #cccccc; font-weight: bold;">${bagName}</span><br>
    ${formattedItems.map(item => `<span style="color: #ffffff; font-size: 11px;">• ${item}</span>`).join('<br>')}
        </div>
    `;
});
        messageContent += '</div>';
    }


if (itemsInMainInventory.length > 0) {
    messageContent += '<div style="border-top: 1px solid #0f4c75; padding-top: 10px; margin-top: 10px;">';
    messageContent += '<strong style="color: #cccccc;">W torbach:</strong><br>';

    const formattedMainItems = formatItemsWithCount(itemsInMainInventory);
    messageContent += `
        <div style="margin: 6px 0; padding: 8px; background: rgba(15,76,117,0.2); border-radius: 6px; border-left: 3px solid #3282b8;">
            ${formattedMainItems.map(item => `<span style="color: #e8f4fd; font-size: 11px;">• ${item}</span>`).join('<br>')}
        </div>
    `;
    messageContent += '</div>';
}


    if (foundItems.length === 0) {
        messageContent += `
            <div style="text-align: center; color: #a8dadc; font-style: italic; padding: 20px;">
                ${searchTerm ? `Nie znaleziono przedmiotów zawierających "${searchTerm}".` : 'Nie znaleziono żadnych przedmiotów.'}
            </div>
        `;
    }

    messageContent += `
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #0f4c75; text-align: center;">
            <button id="clearSearchFromMessage" style="
                background: linear-gradient(135deg, #333333, #555555);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                transition: all 0.2s;
                box-shadow: 0 2px 8px rgba(15,76,117,0.3);
            ">Wyczyść wyszukiwanie</button>
        </div>
    `;

    resultHeader.appendChild(resultTitle);
    resultContent.innerHTML = messageContent;
    resultWindow.appendChild(resultHeader);
    resultWindow.appendChild(resultContent);
    document.body.appendChild(resultWindow);


    resultHeader.addEventListener('mousedown', resultDragStart);
    document.addEventListener('mousemove', resultDragMove);
    document.addEventListener('mouseup', resultDragEnd);


    document.getElementById('clearSearchFromMessage').addEventListener('click', () => {
        clearSearch();
    });


    const clearBtn = document.getElementById('clearSearchFromMessage');
    clearBtn.addEventListener('mouseenter', () => {
        clearBtn.style.transform = 'translateY(-1px)';
        clearBtn.style.boxShadow = '0 4px 12px rgba(15,76,117,0.4)';
    });
    clearBtn.addEventListener('mouseleave', () => {
        clearBtn.style.transform = 'translateY(0)';
        clearBtn.style.boxShadow = '0 2px 8px rgba(15,76,117,0.3)';
    });


    resultContent.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });
    resultContent.addEventListener('click', (e) => {
        const itemNameElement = e.target.closest('.item-name');
        if (itemNameElement) {
            e.preventDefault();
            e.stopPropagation();

            const itemName = itemNameElement.getAttribute('data-item-name');
            if (itemName) {
                console.log('Kliknięto w przedmiot:', itemName);
                lastSearchTerm = itemName;
                performSearch(itemName.toLowerCase());

                // Zamknij okno wyników
                if (resultWindow && resultWindow.parentNode) {
                    document.body.removeChild(resultWindow);
                    resultWindow = null;
                    resultXOffset = 0;
                    resultYOffset = 0;
                    resultCurrentX = 0;
                    resultCurrentY = 0;
                }
            }
        }
    });
}


function addSearchOption() {
    document.addEventListener('mousedown', function(e) {
        // Sprawdź czy to prawy przycisk myszy (button 2) i czy wciśnięty jest SHIFT
        if (e.button !== 2 || !e.shiftKey) {
            return;
        }
        const item = e.target.closest('.item.inventory-item[data-name]:not(.bag)');
        if (item) {
            // Blokuj propagację i domyślne zachowanie
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const contextMenu = document.createElement('div');
            contextMenu.id = 'customContextMenu';
            contextMenu.style.cssText = `
                position: absolute;
                left: ${e.pageX}px;
                top: ${e.pageY}px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #0f4c75;
                border-radius: 8px;
                padding: 5px 0;
                z-index: 10000;
                min-width: 200px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                backdrop-filter: blur(10px);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                user-select: none;
            `;
            const searchOption = document.createElement('div');
            searchOption.textContent = '🔍 Wyszukaj podobne przedmioty';
            searchOption.style.cssText = `
                padding: 8px 12px;
                color: #e8f4fd;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            `;
            // Efekty hover
            searchOption.addEventListener('mouseenter', () => {
                searchOption.style.background = 'rgba(50,130,184,0.2)';
                searchOption.style.transform = 'translateX(2px)';
            });
            searchOption.addEventListener('mouseleave', () => {
                searchOption.style.background = 'transparent';
                searchOption.style.transform = 'translateX(0)';
            });
            contextMenu.appendChild(searchOption);
            document.body.appendChild(contextMenu);
            // Obsługa kliknięcia w menu
            searchOption.addEventListener('click', () => {
                const itemName = item.getAttribute('data-name');
                lastSearchTerm = itemName;
                performSearch(itemName.toLowerCase());
                document.body.removeChild(contextMenu);
            });
            // Zamknij menu po kliknięciu gdzieś indziej
            setTimeout(() => {
                document.addEventListener('click', function removeMenu() {
                    if (contextMenu.parentNode) {
                        contextMenu.remove();
                    }
                    document.removeEventListener('click', removeMenu);
                });
            }, 100);
        }
    }, true); // Dodaj capture: true aby złapać event przed grą
    // Dodatkowo blokuj contextmenu gdy SHIFT jest wciśnięty
    document.addEventListener('contextmenu', function(e) {
        if (e.shiftKey && e.target.closest('.item.inventory-item[data-name]:not(.bag)')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);
}
    function init() {
        addSearchOption();


        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {

                const bagItems = document.querySelectorAll('.item.inventory-item[data-name]:not(.bag)');
                if (bagItems.length > 0) {
                    e.preventDefault();
                    createSearchWindow();
                }
            }
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

const style = document.createElement('style');
style.textContent = `
    #bagSearchWindow {
        position: fixed;
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        border: 2px solid #444444;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.8);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        backdrop-filter: blur(10px);
        min-width: 300px;
        overflow: hidden;
    }

    #bagSearchWindow .drag-header {
        background: linear-gradient(135deg, #333333, #555555);
        color: white;
        padding: 12px 15px;
        border-radius: 10px 10px 0 0;
        cursor: move;
        user-select: none;
        border-bottom: 1px solid #444444;
    }

    #bagSearchWindow h3 {
        margin: 0;
        color: white;
        font-size: 16px;
        text-align: center;
        font-weight: bold;
    }

    #bagSearchWindow div:not(.drag-header) {
        padding: 15px;
        background: rgba(0,0,0,0.4);
    }

    #bagSearchWindow input {
        width: 100%;
        padding: 8px;
        background: rgba(68,68,68,0.3);
        border: 1px solid #555555;
        border-radius: 6px;
        color: #ffffff;
        font-size: 14px;
        box-sizing: border-box;
        margin-bottom: 10px;
        transition: all 0.2s;
    }

    #bagSearchWindow input:focus {
        outline: none;
        border-color: #777777;
        box-shadow: 0 0 10px rgba(119,119,119,0.3);
    }

    #bagSearchWindow input::placeholder {
        color: rgba(255,255,255,0.6);
    }

    #bagSearchWindow button {
        padding: 8px 16px;
        background: linear-gradient(135deg, #333333, #555555);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }

    #bagSearchWindow button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        background: linear-gradient(135deg, #555555, #777777);
    }

    #bagSearchWindow .drag-header:hover {
        background: linear-gradient(135deg, #555555, #333333);
    }

    #searchResultMessage {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        color: #ffffff;
        border-radius: 12px;
        border: 2px solid #444444;
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        min-width: 350px;
        max-width: 400px;
        max-height: 500px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        animation: fadeIn 0.3s ease-out;
    }

    #searchResultMessage .result-drag-header {
        background: linear-gradient(135deg, #333333, #555555);
        color: white;
        padding: 8px 12px;
        border-radius: 10px 10px 0 0;
        cursor: move;
        user-select: none;
        border-bottom: 1px solid #444444;
        flex-shrink: 0;
    }

    #searchResultMessage .result-drag-header:hover {
        background: linear-gradient(135deg, #555555, #333333);
    }

    #customContextMenu {
        user-select: none;
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        border: 2px solid #444444;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    #customContextMenu div {
        color: #ffffff;
        border-bottom: 1px solid rgba(68,68,68,0.3);
        transition: all 0.2s;
        font-size: 12px;
        padding: 8px 12px;
    }

    #customContextMenu div:hover {
        background: rgba(85,85,85,0.3);
        transform: translateX(2px);
    }

    @keyframes bagPulse {
        0% {
            box-shadow: 0 0 15px #777777;
        }
        50% {
            box-shadow: 0 0 25px #777777, 0 0 35px rgba(119,119,119,0.5);
        }
        100% {
            box-shadow: 0 0 15px #777777;
        }
    }

    .search-highlighted-bag {
        position: relative;
        animation: bagPulse 2s infinite !important;
        border: 2px solid #FFD700 !important;
        box-shadow: 0 0 15px #FFD700 !important;
    }

    .search-highlighted-bag::after {
        content: '🔍';
        position: absolute;
        top: -5px;
        right: -5px;
        background: #555555;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        box-shadow: 0 2px 8px rgba(85,85,85,0.4);
    }

    /* Scrollbar styling */
    #searchResultMessage div::-webkit-scrollbar {
        width: 8px;
    }

    #searchResultMessage div::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.5);
        border-radius: 4px;
    }

    #searchResultMessage div::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #333333, #555555);
        border-radius: 4px;
    }

    #searchResultMessage div::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #555555, #333333);
    }

    #searchResultMessage .item-name {
        transition: color 0.2s ease;
        border-radius: 3px;
        padding: 1px 2px;
    }

    #searchResultMessage .item-name:hover {
        color: #ff6666 !important;
        background: rgba(255, 102, 102, 0.1);
        text-shadow: 0 0 8px rgba(255, 102, 102, 0.6);
        cursor: pointer;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #bagSearchWindow, #searchResultMessage {
        animation: fadeIn 0.3s ease-out;
    }

    /* Dodatkowe style dla lepszej integracji z ciemnym motywem */
    #searchResultMessage div[style*="background: rgba(15,76,117,0.2)"] {
        background: rgba(68,68,68,0.3) !important;
        border-left: 3px solid #777777 !important;
    }

    #searchResultMessage span[style*="color: #3282b8"] {
        color: #cccccc !important;
    }

    #searchResultMessage button {
        background: linear-gradient(135deg, #333333, #555555) !important;
        color: white !important;
        border: none !important;
        padding: 6px 12px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 11px !important;
        font-weight: bold !important;
        transition: all 0.2s !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
    }

    #searchResultMessage button:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6) !important;
        background: linear-gradient(135deg, #555555, #777777) !important;
    }
`;
document.head.appendChild(style);

})();
