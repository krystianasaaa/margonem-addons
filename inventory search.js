(function() {
    'use strict';

    if (window.inventorySearchRunning) {
        return;
    }
    window.inventorySearchRunning = true;

    // Configuration
    let config = {
        contextMenuEnabled: localStorage.getItem('invContextMenuEnabled') !== 'false'
    };

    function saveConfig() {
        localStorage.setItem('invContextMenuEnabled', config.contextMenuEnabled.toString());
    }

    let searchWindow = null;
    let lastSearchTerm = '';
    let resultWindow = null;

    const styles = `
        .inv-search-window {
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
        }

        .inv-search-header {
            background: linear-gradient(135deg, #333333, #555555);
            color: white;
            padding: 12px 15px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid #444444;
        }

        .inv-search-header h3 {
            margin: 0;
            color: white;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
        }

        .inv-search-content {
            padding: 15px;
            background: rgba(0,0,0,0.2);
        }

        .inv-search-input {
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

        .inv-search-input:focus {
            outline: none;
            border-color: #777777;
            box-shadow: 0 0 10px rgba(119,119,119,0.3);
        }

        .inv-search-input::placeholder {
            color: rgba(255,255,255,0.6);
        }

        .inv-button-container {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .inv-btn {
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

        .inv-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            background: linear-gradient(135deg, #555555, #777777);
        }

        .inv-btn-clear {
            background: linear-gradient(135deg, #f44336, #d32f2f);
        }

        .inv-btn-clear:hover {
            background: linear-gradient(135deg, #d32f2f, #b71c1c);
        }

        .inv-result-window {
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

        .inv-window-header {
            background: linear-gradient(135deg, #333333, #555555);
            color: white;
            padding: 8px 12px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid #444444;
            flex-shrink: 0;
        }

        .inv-window-header h3 {
            margin: 0;
            color: white;
            font-size: 14px;
            text-align: center;
            font-weight: bold;
        }

        .inv-window-content {
            padding: 12px;
            overflow-y: auto;
            flex-grow: 1;
            background: rgba(0,0,0,0.2);
        }

        .inv-window-content::-webkit-scrollbar {
            width: 8px;
        }

        .inv-window-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.5);
            border-radius: 4px;
        }

        .inv-window-content::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #333333, #555555);
            border-radius: 4px;
        }

        .inv-window-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #555555, #333333);
        }

        #inv-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            border: 2px solid #444;
            border-radius: 12px;
            padding: 0;
            z-index: 10000;
            display: none;
            min-width: 380px;
            max-height: 80vh;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
        }

        #inv-settings-header {
            background: linear-gradient(135deg, #333333, #555555);
            color: #fff;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
            padding: 14px 15px;
            border-bottom: 2px solid #444;
            cursor: move;
            user-select: none;
            border-radius: 10px 10px 0 0;
        }

        .inv-settings-content {
            padding: 20px;
            max-height: calc(80vh - 60px);
            overflow-y: auto;
            background: rgba(0,0,0,0.2);
        }

        .inv-settings-content::-webkit-scrollbar {
            width: 8px;
        }

        .inv-settings-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
        }

        .inv-settings-content::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #333333, #555555);
            border-radius: 4px;
        }

        .inv-settings-group {
            margin-bottom: 20px;
        }

        .inv-settings-label {
            color: #e0e0e0;
            font-size: 13px;
            font-weight: 600;
            display: block;
            margin-bottom: 12px;
        }

        .inv-checkbox-label {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #b8b8b8;
            font-size: 13px;
            cursor: pointer;
            padding: 12px;
            background: rgba(68,68,68,0.2);
            border-radius: 8px;
            transition: all 0.2s;
            border: 1px solid transparent;
        }

        .inv-checkbox-label:hover {
            background: rgba(68,68,68,0.4);
            border-color: #555;
        }

        .inv-checkbox-label input[type="checkbox"] {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #555;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            background: rgba(0,0,0,0.3);
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .inv-checkbox-label input[type="checkbox"]:hover {
            border-color: #777;
        }

        .inv-checkbox-label input[type="checkbox"]:checked {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border-color: #4CAF50;
        }

        .inv-checkbox-label input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .inv-settings-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            border-top: 2px solid #444;
            padding-top: 15px;
        }

        .inv-settings-buttons button {
            flex: 1;
            padding: 10px 16px;
            background: linear-gradient(135deg, #444, #555);
            color: #ccc;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .inv-settings-buttons button:hover {
            background: linear-gradient(135deg, #555, #666);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .inv-settings-buttons button.primary {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
        }

        .inv-settings-buttons button.primary:hover {
            background: linear-gradient(135deg, #45a049, #3d8b40);
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

        .inv-item-name {
            transition: color 0.2s ease;
            border-radius: 3px;
            padding: 1px 2px;
        }

        .inv-item-name:hover {
            color: #ff6666 !important;
            background: rgba(255, 102, 102, 0.1);
            text-shadow: 0 0 8px rgba(255, 102, 102, 0.6);
            cursor: pointer;
        }

        .inv-info-box {
            margin-top: 15px;
            padding: 12px;
            background: rgba(68,68,68,0.2);
            border-radius: 8px;
            border-left: 3px solid #555;
        }

        .inv-info-box-title {
            color: #e0e0e0;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .inv-info-box-content {
            color: #999;
            font-size: 11px;
            line-height: 1.6;
        }

        .inv-info-box-content strong {
            color: #bbb;
        }
    `;

    function createSearchWindow() {
        if (searchWindow) {
            document.body.removeChild(searchWindow);
        }

        searchWindow = document.createElement('div');
        searchWindow.className = 'inv-search-window';

        const header = document.createElement('div');
        header.className = 'inv-search-header';

        const title = document.createElement('h3');
        title.textContent = 'Wyszukaj przedmioty';

        const content = document.createElement('div');
        content.className = 'inv-search-content';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'inv-search-input';
        searchInput.placeholder = 'Wpisz nazwę przedmiotu...';
        searchInput.value = lastSearchTerm;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'inv-button-container';

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Szukaj';
        searchButton.className = 'inv-btn';

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Wyczyść';
        clearButton.className = 'inv-btn inv-btn-clear';

        buttonContainer.appendChild(searchButton);
        buttonContainer.appendChild(clearButton);

        header.appendChild(title);
        content.appendChild(searchInput);
        content.appendChild(buttonContainer);
        searchWindow.appendChild(header);
        searchWindow.appendChild(content);
        document.body.appendChild(searchWindow);

        let dragStartX, dragStartY, startLeft, startTop;
        let isDraggingSearch = false;

        header.addEventListener('mousedown', (e) => {
            isDraggingSearch = true;
            const rect = searchWindow.getBoundingClientRect();
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingSearch) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            searchWindow.style.left = (startLeft + dx) + 'px';
            searchWindow.style.top = (startTop + dy) + 'px';
            searchWindow.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDraggingSearch = false;
        });

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

    function closeSearchWindow() {
        if (searchWindow) {
            document.body.removeChild(searchWindow);
            searchWindow = null;
        }
    }

    function performSearch(searchTerm) {
        const allItems = document.querySelectorAll('.item[data-name]');
        const foundItems = [];
        const processedItems = new Set();

        allItems.forEach(item => {
            item.style.boxShadow = 'none';
            item.style.opacity = '1';
            item.style.filter = 'none';
        });

        allItems.forEach(item => {
            const itemName = item.getAttribute('data-name');
            if (!itemName) return;

            const rect = item.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;

            const isHidden = item.style.display === 'none' ||
                            item.style.visibility === 'hidden' ||
                            item.closest('[style*="display: none"]') ||
                            item.closest('[style*="visibility: hidden"]');

            if (!isVisible || isHidden) return;

            const isInTooltip = item.closest('.tooltip, .popup, .hint, .preview, .overlay, [class*="tooltip"], [class*="popup"], [class*="hint"]');
            if (isInTooltip) return;

            const itemId = `${itemName}-${Math.round(rect.left)}-${Math.round(rect.top)}`;
            if (processedItems.has(itemId)) return;

            processedItems.add(itemId);

            const itemNameLower = itemName.toLowerCase();
            const isMatch = searchTerm === '' || itemNameLower.includes(searchTerm.toLowerCase());

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

        showSearchResults(searchTerm, foundItems);
    }

    function clearSearch() {
        const allItems = document.querySelectorAll('.item[data-name]');
        allItems.forEach(item => {
            item.style.boxShadow = 'none';
            item.style.opacity = '1';
            item.style.filter = 'none';
        });

        if (resultWindow) {
            document.body.removeChild(resultWindow);
            resultWindow = null;
        }
    }

    function countItems(itemsArray) {
        const itemCounts = {};
        itemsArray.forEach(item => {
            const name = item.getAttribute('data-name');
            itemCounts[name] = (itemCounts[name] || 0) + 1;
        });
        return itemCounts;
    }

    function formatItemsWithCount(items) {
        const itemCounts = countItems(items);
        return Object.entries(itemCounts).map(([itemName, count]) => {
            const displayName = count > 1 ? `${itemName} (${count})` : itemName;
            return `<span class="inv-item-name">${displayName}</span>`;
        });
    }

    function showSearchResults(searchTerm, foundItems) {
        if (resultWindow) {
            document.body.removeChild(resultWindow);
            resultWindow = null;
        }

        resultWindow = document.createElement('div');
        resultWindow.className = 'inv-result-window';

        const resultHeader = document.createElement('div');
        resultHeader.className = 'inv-window-header';

        const resultTitle = document.createElement('h3');
        resultTitle.textContent = 'Wyniki wyszukiwania';

        const resultContent = document.createElement('div');
        resultContent.className = 'inv-window-content';

        let messageContent = `
            <div style="margin-bottom: 12px; text-align: center;">
                <span style="color: #cccccc; font-weight: bold;">Znaleziono: ${foundItems.length} przedmiot(ów)</span><br>
                <span style="color: #ffffff; font-size: 11px;">Szukano: "${searchTerm || 'wszystkie przedmioty'}"</span>
            </div>
        `;

        if (foundItems.length > 0) {
            const formattedItems = formatItemsWithCount(foundItems);
            messageContent += `
                <div style="border-top: 1px solid #444; padding-top: 10px;">
                    <div style="margin: 6px 0; padding: 8px; background: rgba(68,68,68,0.3); border-radius: 6px; border-left: 3px solid #777777;">
                        ${formattedItems.map(item => `<span style="color: #ffffff; font-size: 11px;">• ${item}</span>`).join('<br>')}
                    </div>
                </div>
            `;
        } else {
            messageContent += `
                <div style="text-align: center; color: #a8dadc; font-style: italic; padding: 20px;">
                    ${searchTerm ? `Nie znaleziono przedmiotów zawierających "${searchTerm}".` : 'Nie znaleziono żadnych przedmiotów.'}
                </div>
            `;
        }

        messageContent += `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #444; text-align: center;">
                <button id="clearSearchFromMessage" class="inv-btn">Wyczyść wyszukiwanie</button>
            </div>
        `;

        resultHeader.appendChild(resultTitle);
        resultContent.innerHTML = messageContent;
        resultWindow.appendChild(resultHeader);
        resultWindow.appendChild(resultContent);
        document.body.appendChild(resultWindow);

        let dragStartX, dragStartY, startLeft, startTop;
        let isDraggingResult = false;

        resultHeader.addEventListener('mousedown', (e) => {
            isDraggingResult = true;
            const rect = resultWindow.getBoundingClientRect();
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingResult) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            resultWindow.style.left = (startLeft + dx) + 'px';
            resultWindow.style.top = (startTop + dy) + 'px';
            resultWindow.style.transform = 'none';
            resultWindow.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDraggingResult = false;
        });

        const clearBtn = document.getElementById('clearSearchFromMessage');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearSearch();
            });
        }
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'inv-settings-panel';

        panel.innerHTML = `
            <div id="inv-settings-header">
                Inventory Search - Ustawienia
            </div>

            <div class="inv-settings-content">
                <div class="inv-settings-group">
                    <span class="inv-settings-label">Funkcje:</span>

                    <label class="inv-checkbox-label">
                        <input type="checkbox" id="inv-context-menu-enabled" ${config.contextMenuEnabled ? 'checked' : ''}>
                        <span>Włącz menu kontekstowe (Shift + PPM)</span>
                    </label>
                </div>

                <div class="inv-info-box">
                    <div class="inv-info-box-title">Skróty klawiszowe:</div>
                    <div class="inv-info-box-content">
                        • <strong>Ctrl + F</strong> - Otwórz okno wyszukiwania<br>
                        • <strong>Shift + PPM</strong> - Wyszukaj podobne przedmioty<br>
                        • <strong>Escape</strong> - Zamknij okno wyszukiwania
                    </div>
                </div>

                <div class="inv-settings-buttons">
                    <button id="inv-settings-close">Zamknij</button>
                    <button id="inv-settings-save" class="primary">Zapisz</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        let isDraggingSettings = false;
        let settingsDragStartX, settingsDragStartY, settingsStartLeft, settingsStartTop;

        const header = panel.querySelector('#inv-settings-header');
        header.addEventListener('mousedown', (e) => {
            isDraggingSettings = true;
            const rect = panel.getBoundingClientRect();
            settingsDragStartX = e.clientX;
            settingsDragStartY = e.clientY;
            settingsStartLeft = rect.left;
            settingsStartTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingSettings) return;
            const dx = e.clientX - settingsDragStartX;
            const dy = e.clientY - settingsDragStartY;
            panel.style.left = (settingsStartLeft + dx) + 'px';
            panel.style.top = (settingsStartTop + dy) + 'px';
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDraggingSettings = false;
        });

        panel.querySelector('#inv-settings-close').addEventListener('click', (e) => {
            e.preventDefault();
            toggleSettingsPanel();
        });

        panel.querySelector('#inv-settings-save').addEventListener('click', (e) => {
            e.preventDefault();
            config.contextMenuEnabled = panel.querySelector('#inv-context-menu-enabled').checked;
            saveConfig();
            toggleSettingsPanel();
        });
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('inv-settings-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    function addContextMenuSearch() {
        document.addEventListener('mousedown', function(e) {
            if (!config.contextMenuEnabled) return;

            if (e.button !== 2 || !e.shiftKey) return;

            const item = e.target.closest('.item[data-name]');
            if (item) {
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
                    border: 2px solid #444;
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
                searchOption.textContent = 'Wyszukaj podobne przedmioty';
                searchOption.style.cssText = `
                    padding: 8px 12px;
                    color: #e8f4fd;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                `;

                searchOption.addEventListener('mouseenter', () => {
                    searchOption.style.background = 'rgba(85,85,85,0.3)';
                    searchOption.style.transform = 'translateX(2px)';
                });
                searchOption.addEventListener('mouseleave', () => {
                    searchOption.style.background = 'transparent';
                    searchOption.style.transform = 'translateX(0)';
                });

                contextMenu.appendChild(searchOption);
                document.body.appendChild(contextMenu);

                searchOption.addEventListener('click', () => {
                    const itemName = item.getAttribute('data-name');
                    lastSearchTerm = itemName;
                    performSearch(itemName.toLowerCase());
                    document.body.removeChild(contextMenu);
                });

                setTimeout(() => {
                    document.addEventListener('click', function removeMenu() {
                        if (contextMenu.parentNode) {
                            contextMenu.remove();
                        }
                        document.removeEventListener('click', removeMenu);
                    });
                }, 100);
            }
        }, true);

        document.addEventListener('contextmenu', function(e) {
            if (e.shiftKey && e.target.closest('.item[data-name]')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }, true);
    }

    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-inventory_search');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#inv-search-settings-btn')) {
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

    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'inv-search-settings-btn';
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

        createSettingsPanel();

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    function init() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        addContextMenuSearch();

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                const items = document.querySelectorAll('.item[data-name]');
                if (items.length > 0) {
                    e.preventDefault();
                    createSearchWindow();
                }
            }
        });

        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
