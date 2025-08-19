(function() {
    'use strict';
    
    // === ZMIENIONE IDENTYFIKATORY (żeby nie było konfliktów) ===
    const worldName = "dream";
    const boxId = 'dream-summary-box'; // ZMIENIONE
    const summaryBoxId = 'dream-summary-detached'; // ZMIENIONE
    
    // === UPROSZCZONE ZMIENNE ===
    let lastRefreshTime = null;
    let isMainBoxHidden = localStorage.getItem('dreamSummaryHidden') === 'true'; // ZMIENIONY KLUCZ
    let isSummaryDetached = localStorage.getItem('dreamSummaryDetached') === 'true'; // ZMIENIONY KLUCZ
    let currentPlayersData = null;
    
    // Lista tytanów - ZOSTAJE BEZ ZMIAN
    const titanList = [
        {level: 64, name: "Orla/Kic"}, {level: 65, name: "Kic"}, {level: 83, name: "Kic"}, {level: 88, name: "Rene"},
        {level: 114, name: "Rene"}, {level: 120, name: "Arcy"}, {level: 144, name: "Arcy"}, {level: 164, name: "Zoons/Łowka"}, {level: 167, name: "Zoons/Łowka"},
        {level: 180, name: "Łowka"}, {level: 190, name: "Łowka"}, {level: 191, name: "Przyzy"}, {level: 210, name: "Przyzy"},
        {level: 217, name: "Przyzy"}, {level: 218, name: "Magua"}, {level: 244, name: "Magua"}, {level: 245, name: "Teza"},
        {level: 271, name: "Teza"}, {level: 272, name: "Barba/Tan"}, {level: 300, name: "Barba/Tan"}
    ];

    // === PODSTAWOWE STYLE ===
    if (!document.querySelector('#dream-summary-styles')) {
        const styles = document.createElement('style');
        styles.id = 'dream-summary-styles';
        styles.textContent = `
            #dream-summary-box {
                position: fixed;
                background: linear-gradient(135deg, #0f3460, #0f4c75);
                border: 2px solid #3282b8;
                border-radius: 12px;
                color: #e8f4fd;
                font-family: Arial, sans-serif;
                font-size: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
                z-index: 10000;
                min-width: 250px;
                backdrop-filter: blur(10px);
            }
            
            #dream-summary-box.hidden { display: none !important; }
            
            .dream-summary-header {
                background: linear-gradient(135deg, #3282b8, #0f4c75);
                padding: 8px 12px;
                border-radius: 10px 10px 0 0;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }
            
            .dream-summary-content {
                padding: 10px;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 11px;
            }
            
            .summary-counts {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .titan-count {
                background: rgba(50,130,184,0.3);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
            }
            
            .titan-count.highlight {
                background: rgba(255,193,7,0.4);
                font-weight: bold;
                border: 1px solid #ffc107;
            }
            
            .last-refresh {
                color: #a8dadc;
                font-size: 9px;
            }
            
            .dream-summary-button {
                background: #3282b8;
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                margin-left: 5px;
            }
            
            .dream-summary-button:hover {
                background: #2968a3;
            }
            
            .show-dream-btn {
                position: fixed;
                background: linear-gradient(135deg, #3282b8, #0f4c75);
                border: 2px solid #3282b8;
                color: white;
                width: 45px;
                height: 35px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                top: 100px;
                right: 20px;
            }
            
            .show-dream-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }
            
            .resizer {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 15px;
                height: 15px;
                cursor: nw-resize;
                background: linear-gradient(-45deg, transparent 40%, #3282b8 40%, #3282b8 60%, transparent 60%);
            }
        `;
        document.head.appendChild(styles);
    }

    // === FUNKCJE POMOCNICZE ===
    function constrainToViewport(x, y, width, height) {
        return {
            x: Math.max(0, Math.min(x, window.innerWidth - width)),
            y: Math.max(0, Math.min(y, window.innerHeight - height))
        };
    }

    function getTitanName(level) {
        // Znajdź największy level nie większy od podanego
        let result = '-';
        for (let titan of titanList) {
            if (level >= titan.level) {
                result = titan.name;
            } else {
                break;
            }
        }
        return result;
    }

    function getTitanEmoji(titanName) {
        const emojiMap = {
            'Orla/Kic': '🦅',
            'Kic': '🦅', 
            'Rene': '🐺',
            'Arcy': '⚔️',
            'Zoons/Łowka': '🏹',
            'Łowka': '🏹',
            'Przyzy': '🛡️',
            'Magua': '🔥',
            'Teza': '⚡',
            'Barba/Tan': '👹',
            '-': '❌'
        };
        return emojiMap[titanName] || '❓';
    }

    // === FUNKCJA POKAZYWANIA GŁÓWNEGO OKNA ===
    function showMainBox() {
        const mainBox = document.getElementById(boxId);
        const showBtn = document.querySelector('.show-dream-btn');
        if (mainBox) {
            mainBox.classList.remove('hidden');
            isMainBoxHidden = false;
            localStorage.setItem('dreamSummaryHidden', 'false');
        }
        if (showBtn) {
            showBtn.remove();
        }
    }

    // === FUNKCJA UKRYWANIA GŁÓWNEGO OKNA ===
    function hideMainBox() {
        const mainBox = document.getElementById(boxId);
        if (mainBox) {
            mainBox.classList.add('hidden');
            isMainBoxHidden = true;
            localStorage.setItem('dreamSummaryHidden', 'true');

            // Stwórz przycisk pokazywania
            const showBtn = document.createElement('button');
            showBtn.className = 'show-dream-btn';
            showBtn.innerHTML = '🌅';
            showBtn.title = 'Pokaż Dream Summary';

            // Przywróć pozycję z localStorage
            const savedPos = JSON.parse(localStorage.getItem('dreamSummaryShowButtonPosition') || '{}');
            if (savedPos.x !== undefined && savedPos.y !== undefined) {
                const constrained = constrainToViewport(savedPos.x, savedPos.y, 45, 35);
                showBtn.style.left = `${constrained.x}px`;
                showBtn.style.top = `${constrained.y}px`;
                showBtn.style.right = 'auto';
            }

            showBtn.onclick = showMainBox;
            document.body.appendChild(showBtn);
            makeDraggableButton(showBtn);
        }
    }

    // === FUNKCJA PRZECIĄGANIA PRZYCISKU ===
    function makeDraggableButton(element) {
        let isDragging = false, offsetX = 0, offsetY = 0, hasMoved = false;

        element.addEventListener('click', e => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        element.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            hasMoved = true;
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.right = 'auto';
            localStorage.setItem('dreamSummaryShowButtonPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => { hasMoved = false; }, 150);
            }
        });
    }

    // === FUNKCJA PRZECIĄGANIA OKNA ===
    function makeDraggable(element) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        const header = element.querySelector('.dream-summary-header');

        header.addEventListener('mousedown', e => {
            if (e.button !== 0 || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            localStorage.setItem('dreamSummaryPosition', JSON.stringify({x, y, w: element.offsetWidth, h: element.offsetHeight}));
        });

        document.addEventListener('mouseup', () => isDragging = false);
    }

    // === FUNKCJA ZMIANY ROZMIARU ===
    function makeResizable(element) {
        const resizer = element.querySelector('.resizer');
        let isResizing = false, startX, startY, startWidth, startHeight;

        resizer.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
        });

        document.addEventListener('mousemove', e => {
            if (!isResizing) return;
            const newWidth = Math.max(250, startWidth + e.clientX - startX);
            const newHeight = Math.max(120, startHeight + e.clientY - startY);
            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                localStorage.setItem('dreamSummaryPosition', JSON.stringify({
                    x: parseInt(element.style.left), 
                    y: parseInt(element.style.top), 
                    w: element.offsetWidth, 
                    h: element.offsetHeight
                }));
            }
        });
    }

    // === FUNKCJA POBIERANIA DANYCH ===
    async function fetchPlayers() {
        try {
            const res = await fetch(`https://public-api.margonem.pl/info/online/${worldName}.json`);
            lastRefreshTime = new Date();
            const data = res.ok ? await res.json() : null;
            currentPlayersData = data;
            renderBox(data);
        } catch (err) {
            lastRefreshTime = new Date();
            currentPlayersData = null;
            renderBox(null);
        }
    }

    // === FUNKCJA GENEROWANIA PODSUMOWANIA ===
    function generateSummaryHTML(players) {
        if (!players || !Array.isArray(players)) {
            return `
                <div class="summary-row">
                    <div class="summary-counts">❌ Brak danych</div>
                    <div class="last-refresh">${lastRefreshTime ? `🕐 ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
                </div>
            `;
        }

        // Policz graczy na każdym tytanie
        const titanSummary = {};
        players.forEach(p => {
            const titan = getTitanName(p.l);
            titanSummary[titan] = (titanSummary[titan] || 0) + 1;
        });

        // Stwórz HTML dla liczników
        const summaryCountsHtml = [...new Set(titanList.map(t => t.name))]
            .filter(name => titanSummary[name])
            .map(name => {
                const count = titanSummary[name];
                const emoji = getTitanEmoji(name);
                return `<span class="titan-count ${count >= 3 ? 'highlight' : ''}">${emoji} ${name}: ${count}</span>`;
            });

        if (titanSummary['-']) {
            summaryCountsHtml.push(`<span class="titan-count">❌ -: ${titanSummary['-']}</span>`);
        }

        return `
            <div class="summary-row">
                <div style="font-weight: bold; color: #ffc107;">👥 Gracze online: ${players.length}</div>
                <div class="last-refresh">${lastRefreshTime ? `🕐 ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
            </div>
            <div class="summary-row">
                <div class="summary-counts">${summaryCountsHtml.join('')}</div>
            </div>
        `;
    }

    // === GŁÓWNA FUNKCJA RENDEROWANIA ===
    function renderBox(players) {
        let box = document.getElementById(boxId);
        
        if (!box) {
            box = document.createElement('div');
            box.id = boxId;
            
            // Przywróć pozycję z localStorage
            const savedPos = JSON.parse(localStorage.getItem('dreamSummaryPosition') || '{}');
            const width = savedPos.w || 300;
            const height = savedPos.h || 150;
            const constrained = constrainToViewport(savedPos.x || 50, savedPos.y || 50, width, height);

            box.style.left = `${constrained.x}px`;
            box.style.top = `${constrained.y}px`;
            box.style.width = `${width}px`;
            box.style.height = `${height}px`;

            // Sprawdź czy okno ma być ukryte
            if (isMainBoxHidden) {
                box.classList.add('hidden');
                const showBtn = document.createElement('button');
                showBtn.className = 'show-dream-btn';
                showBtn.innerHTML = '🌅';
                showBtn.title = 'Pokaż Dream Summary';

                const savedBtnPos = JSON.parse(localStorage.getItem('dreamSummaryShowButtonPosition') || '{}');
                if (savedBtnPos.x !== undefined && savedBtnPos.y !== undefined) {
                    const constrained = constrainToViewport(savedBtnPos.x, savedBtnPos.y, 45, 35);
                    showBtn.style.left = `${constrained.x}px`;
                    showBtn.style.top = `${constrained.y}px`;
                    showBtn.style.right = 'auto';
                }

                showBtn.onclick = showMainBox;
                document.body.appendChild(showBtn);
                makeDraggableButton(showBtn);
            }

            // HTML struktury okna
            box.innerHTML = `
                <div class="dream-summary-header">
                    <div>🌅 Dream Summary</div>
                    <div>
                        <button class="dream-summary-button" id="refresh-btn">↻</button>
                        <button class="dream-summary-button" id="hide-btn">👁️</button>
                    </div>
                </div>
                <div class="dream-summary-content" id="summary-content"></div>
                <div class="resizer"></div>
            `;

            document.body.appendChild(box);

            // Event listenery
            box.querySelector('#refresh-btn').onclick = fetchPlayers;
            box.querySelector('#hide-btn').onclick = hideMainBox;

            makeDraggable(box);
            makeResizable(box);
        }

        // Aktualizuj zawartość podsumowania
        const summaryContent = box.querySelector('#summary-content');
        if (summaryContent) {
            summaryContent.innerHTML = generateSummaryHTML(players);
        }
    }

    // === INICJALIZACJA ===
    console.log('🌅 Dream Summary - Inicjalizacja...');
    fetchPlayers();
    setInterval(fetchPlayers, 60000); // Odświeżaj co minutę

})();
