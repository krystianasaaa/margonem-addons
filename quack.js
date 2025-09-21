(function() {
    'use strict';

    // CSS Styles
    const css = `
        .kwak-duck {
            position: fixed;
            width: 50px;
            height: 50px;
            z-index: 999999;
            cursor: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/videos/ikonka2.png'), auto;
            border-radius: 50%;
            user-select: none;
            transition: transform 0.2s ease;
        }

        .kwak-duck:hover {
            transform: scale(1.1);
            cursor: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/videos/ikonka2.png'), auto;
        }

        .kwak-duck.kwak-dragging {
            cursor: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/videos/ikonka2.png'), grabbing;
        }

        .kwak-duck-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            pointer-events: none;
        }

        .kwak-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .kwak-video {
            width: 100vw;
            height: 100vh;
            object-fit: contain;
        }

        .kwak-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.7);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 99999999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .kwak-close:hover {
            background: rgba(255,0,0,0.8);
        }

        .kwak-settings-panel {
            position: fixed;
            background: #36393f;
            border: 1px solid #4f545c;
            border-radius: 6px;
            padding: 15px;
            z-index: 1000000;
            color: #dcddde;
            font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
            width: 240px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            cursor: move;
        }

        .kwak-settings-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            color: #ffffff;
            cursor: move;
            padding-bottom: 8px;
            border-bottom: 1px solid #4f545c;
        }

        .kwak-volume-control, .kwak-autoplay-control {
            margin-bottom: 12px;
            background: #2f3136;
            padding: 10px;
            border-radius: 6px;
        }

        .kwak-volume-label, .kwak-autoplay-label {
            display: block;
            margin-bottom: 8px;
            font-size: 11px;
            font-weight: 600;
            color: #b9bbbe;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }

        .kwak-autoplay-checkbox-container {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .kwak-autoplay-checkbox-container:hover {
            background-color: rgba(79, 84, 92, 0.3);
        }

        .kwak-autoplay-checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #72767d;
            border-radius: 4px;
            background: #2f3136;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
            transition: all 0.2s ease;
            appearance: none;
            -webkit-appearance: none;
            outline: none;
        }

        .kwak-autoplay-checkbox:hover {
            border-color: #5865f2;
            transform: scale(1.05);
        }

        .kwak-autoplay-checkbox:checked {
            background: linear-gradient(135deg, #5865f2, #4752c4);
            border-color: #5865f2;
            transform: scale(1.05);
        }

        .kwak-autoplay-checkbox:checked::after {
            content: "";
            position: absolute;
            top: 2px;
            left: 5px;
            width: 4px;
            height: 8px;
            border: solid #ffffff;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            animation: checkmark-appear 0.2s ease-in-out;
        }

        @keyframes checkmark-appear {
            0% {
                opacity: 0;
                transform: rotate(45deg) scale(0.5);
            }
            100% {
                opacity: 1;
                transform: rotate(45deg) scale(1);
            }
        }

        .kwak-autoplay-checkbox:focus {
            box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.3);
        }

        .kwak-autoplay-text {
            font-size: 12px;
            color: #dcddde;
            cursor: pointer;
            user-select: none;
            font-weight: 500;
            transition: color 0.2s;
        }

        .kwak-autoplay-checkbox-container:hover .kwak-autoplay-text {
            color: #ffffff;
        }

        .kwak-volume-slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #4f545c;
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
            margin-bottom: 6px;
        }

        .kwak-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #5865f2;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
            transition: background-color 0.1s;
        }

        .kwak-volume-slider::-webkit-slider-thumb:hover {
            background: #4752c4;
        }

        .kwak-volume-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #5865f2;
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        .kwak-volume-slider::-moz-range-track {
            background: #4f545c;
            height: 6px;
            border-radius: 3px;
        }

        .kwak-volume-value {
            text-align: center;
            font-size: 12px;
            color: #5865f2;
            font-weight: 600;
            margin-top: 4px;
        }

        .kwak-settings-buttons {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-top: 12px;
        }

        .kwak-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background-color 0.2s, transform 0.1s;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }

        .kwak-btn:hover {
            transform: translateY(-1px);
        }

        .kwak-btn-save {
            background: #43a047;
            color: #ffffff;
        }

        .kwak-btn-save:hover {
            background: #4caf50;
        }

        .kwak-btn-cancel {
            background: #5865f2;
            color: #ffffff;
        }

        .kwak-btn-cancel:hover {
            background: #4752c4;
        }
    `;

    // Dodaj CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Zmienne globalne
    let duck = null;
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    let clickCount = 0;
    let clickAudio = null;
    let videoVolume = 0.7; // Domyślna głośność video
    let autoPlayEnabled = true; // Czy włączyć filmik po 10 kliknięciach

    // Zmienne dla przeciągania panelu ustawień
    let settingsPanel = null;
    let isPanelDragging = false;
    let panelStartX = 0;
    let panelStartY = 0;
    let panelInitialX = 0;
    let panelInitialY = 0;

    // Klucze do zapisywania w localStorage
    const STORAGE_KEY_POSITION = 'kwak-duck-position';
    const STORAGE_KEY_CLICKS = 'kwak-duck-clicks';
    const STORAGE_KEY_VOLUME = 'kwak-duck-volume';
    const STORAGE_KEY_AUTOPLAY = 'kwak-duck-autoplay';

    // Funkcje do zapisywania/wczytywania pozycji
    function savePosition(x, y) {
        try {
            const position = { x: x, y: y };
            localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position));
        } catch (e) {
            console.warn('Nie można zapisać pozycji kaczki:', e);
        }
    }

    function loadPosition() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_POSITION);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Nie można wczytać pozycji kaczki:', e);
        }
        // Domyślna pozycja (prawy górny róg)
        return { x: window.innerWidth - 70, y: 20 };
    }

    // Funkcje do zapisywania/wczytywania licznika kliknięć
    function saveClickCount(count) {
        try {
            localStorage.setItem(STORAGE_KEY_CLICKS, count.toString());
        } catch (e) {
            console.warn('Nie można zapisać licznika kliknięć:', e);
        }
    }

    function loadClickCount() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_CLICKS);
            if (saved) {
                return parseInt(saved, 10);
            }
        } catch (e) {
            console.warn('Nie można wczytać licznika kliknięć:', e);
        }
        return 0;
    }

    // Funkcje do zapisywania/wczytywania głośności
    function saveVolume(volume) {
        try {
            localStorage.setItem(STORAGE_KEY_VOLUME, volume.toString());
        } catch (e) {
            console.warn('Nie można zapisać głośności:', e);
        }
    }

    function loadVolume() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_VOLUME);
            if (saved) {
                return parseFloat(saved);
            }
        } catch (e) {
            console.warn('Nie można wczytać głośności:', e);
        }
        return 0.7; // Domyślna głośność
    }

    // Funkcje do zapisywania/wczytywania autoplay
    function saveAutoPlay(enabled) {
        try {
            localStorage.setItem(STORAGE_KEY_AUTOPLAY, enabled.toString());
        } catch (e) {
            console.warn('Nie można zapisać ustawienia autoplay:', e);
        }
    }

    function loadAutoPlay() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_AUTOPLAY);
            if (saved) {
                return saved === 'true';
            }
        } catch (e) {
            console.warn('Nie można wczytać ustawienia autoplay:', e);
        }
        return true; // Domyślnie włączone
    }

    // Sprawdź czy pozycja jest w granicach ekranu
    function validatePosition(pos) {
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;

        return {
            x: Math.max(0, Math.min(maxX, pos.x)),
            y: Math.max(0, Math.min(maxY, pos.y))
        };
    }

    // Stwórz audio element
    function createAudio() {
        clickAudio = new Audio('https://github.com/krystianasaaa/margonem-addons/raw/refs/heads/main/sounds/quackclick.mp3');
        clickAudio.volume = 0.5;
        clickAudio.preload = 'auto';
    }

    // Odtwórz dźwięk kliknięcia
    function playClickSound() {
        if (clickAudio) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(e => {
                console.warn('Nie można odtworzyć dźwięku:', e);
            });
        }
    }

    // Pokaż panel ustawień
    function showSettingsPanel() {
        // Usuń istniejący panel jeśli istnieje
        const existingPanel = document.querySelector('.kwak-settings-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        settingsPanel = document.createElement('div');
        settingsPanel.className = 'kwak-settings-panel';

        // Pozycjonuj panel względem kaczki
        const duckRect = duck.getBoundingClientRect();
        let panelX = duckRect.right + 10;
        let panelY = duckRect.top;

        // Sprawdź czy panel zmieści się na ekranie
        if (panelX + 240 > window.innerWidth) {
            panelX = duckRect.left - 250;
        }
        if (panelY + 190 > window.innerHeight) {
            panelY = window.innerHeight - 190;
        }

        settingsPanel.style.left = panelX + 'px';
        settingsPanel.style.top = panelY + 'px';

        settingsPanel.innerHTML = `
            <div class="kwak-settings-title">🦆 Settings</div>
            <div class="kwak-volume-control">
                <label class="kwak-volume-label">Głośność filmiku:</label>
                <input type="range" class="kwak-volume-slider" min="0" max="1" step="0.05" value="${videoVolume}">
                <div class="kwak-volume-value">${Math.round(videoVolume * 100)}%</div>
            </div>
            <div class="kwak-autoplay-control">
                <label class="kwak-autoplay-label">Automatyczne odtwarzanie:</label>
                <div class="kwak-autoplay-checkbox-container">
                    <input type="checkbox" class="kwak-autoplay-checkbox" ${autoPlayEnabled ? 'checked' : ''}>
                    <span class="kwak-autoplay-text">Włącz filmik po 10 kliknięciach</span>
                </div>
            </div>
            <div class="kwak-settings-buttons">
                <button class="kwak-btn kwak-btn-save">Zapisz</button>
                <button class="kwak-btn kwak-btn-cancel">Anuluj</button>
            </div>
        `;

        document.body.appendChild(settingsPanel);

        // Event listeners dla panelu
        const volumeSlider = settingsPanel.querySelector('.kwak-volume-slider');
        const volumeValue = settingsPanel.querySelector('.kwak-volume-value');
        const autoPlayCheckbox = settingsPanel.querySelector('.kwak-autoplay-checkbox');
        const autoPlayText = settingsPanel.querySelector('.kwak-autoplay-text');
        const saveBtn = settingsPanel.querySelector('.kwak-btn-save');
        const cancelBtn = settingsPanel.querySelector('.kwak-btn-cancel');
        const titleBar = settingsPanel.querySelector('.kwak-settings-title');

        // Aktualizuj wartość głośności w czasie rzeczywistym
        volumeSlider.addEventListener('input', function() {
            const volume = parseFloat(this.value);
            volumeValue.textContent = Math.round(volume * 100) + '%';
        });

        // Kliknięcie w tekst też zmienia checkbox
        autoPlayText.addEventListener('click', function() {
            autoPlayCheckbox.checked = !autoPlayCheckbox.checked;
        });

        // Zapisz ustawienia
        saveBtn.addEventListener('click', function() {
            videoVolume = parseFloat(volumeSlider.value);
            autoPlayEnabled = autoPlayCheckbox.checked;
            saveVolume(videoVolume);
            saveAutoPlay(autoPlayEnabled);
            settingsPanel.remove();
            settingsPanel = null;
        });

        // Anuluj zmiany
        cancelBtn.addEventListener('click', function() {
            settingsPanel.remove();
            settingsPanel = null;
        });

        // Przeciąganie panelu
        titleBar.addEventListener('mousedown', startPanelDrag);
        settingsPanel.addEventListener('mousedown', startPanelDrag);
    }

    // Funkcje przeciągania panelu ustawień
    function startPanelDrag(e) {
        if (e.target.classList.contains('kwak-volume-slider') ||
            e.target.classList.contains('kwak-btn') ||
            e.target.tagName === 'BUTTON') {
            return; // Nie przeciągaj gdy klikamy na kontrolki
        }

        e.preventDefault();
        e.stopPropagation();

        isPanelDragging = true;

        panelStartX = e.clientX;
        panelStartY = e.clientY;

        const rect = settingsPanel.getBoundingClientRect();
        panelInitialX = rect.left;
        panelInitialY = rect.top;

        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', stopPanelDrag);
    }

    function dragPanel(e) {
        if (!isPanelDragging || !settingsPanel) return;

        e.preventDefault();

        const moveX = e.clientX - panelStartX;
        const moveY = e.clientY - panelStartY;

        let newX = panelInitialX + moveX;
        let newY = panelInitialY + moveY;

        // Ograniczenia ekranu dla panelu
        newX = Math.max(0, Math.min(window.innerWidth - 240, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 190, newY));

        settingsPanel.style.left = newX + 'px';
        settingsPanel.style.top = newY + 'px';
    }

    function stopPanelDrag() {
        isPanelDragging = false;
        document.removeEventListener('mousemove', dragPanel);
        document.removeEventListener('mouseup', stopPanelDrag);
    }

    // Stwórz kaczkę
    function createDuck() {
        if (duck) return;

        duck = document.createElement('div');
        duck.className = 'kwak-duck';

        // Wczytaj zapisane ustawienia
        const savedPosition = loadPosition();
        const validPosition = validatePosition(savedPosition);
        clickCount = loadClickCount();
        videoVolume = loadVolume();
        autoPlayEnabled = loadAutoPlay();

        // Ustaw pozycję kaczki
        duck.style.left = validPosition.x + 'px';
        duck.style.top = validPosition.y + 'px';

        const img = document.createElement('img');
        img.className = 'kwak-duck-img';
        img.src = 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/videos/ikonka2.png';
        img.alt = 'Kaczka';

        duck.appendChild(img);
        document.body.appendChild(duck);

        // Event listeners
        duck.addEventListener('mousedown', startDrag);
        duck.addEventListener('click', handleClick);
        duck.addEventListener('contextmenu', handleRightClick);

        // Stwórz audio
        createAudio();
    }

    // Start przeciągania
    function startDrag(e) {
        // Tylko lewy przycisk myszy dla przeciągania
        if (e.button !== 0) return;

        e.preventDefault();

        isDragging = true;
        hasDragged = false;
        duck.classList.add('kwak-dragging');

        // Pozycja myszy
        startX = e.clientX;
        startY = e.clientY;

        // Pozycja kaczki
        const rect = duck.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        // Dodaj event listeners
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    // Przeciąganie
    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();

        // Sprawdź czy mysz się poruszyła znacząco
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        if (deltaX > 5 || deltaY > 5) {
            hasDragged = true;
        }

        // Oblicz nową pozycję
        const moveX = e.clientX - startX;
        const moveY = e.clientY - startY;

        let newX = initialX + moveX;
        let newY = initialY + moveY;

        // Ograniczenia ekranu
        newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 50, newY));

        // Ustaw nową pozycję
        duck.style.left = newX + 'px';
        duck.style.top = newY + 'px';
    }

    // Stop przeciągania
    function stopDrag(e) {
        if (!isDragging) return;

        isDragging = false;
        duck.classList.remove('kwak-dragging');

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);

        // Zapisz pozycję tylko jeśli faktycznie przeciągnęliśmy
        if (hasDragged) {
            const rect = duck.getBoundingClientRect();
            savePosition(rect.left, rect.top);
        }
    }

    // Kliknięcie lewym przyciskiem - kwakanie + licznik
    function handleClick(e) {
        e.preventDefault();

        if (!hasDragged && e.button === 0) { // Lewy przycisk myszy
            // Odtwórz dźwięk
            playClickSound();

            // Zwiększ licznik
            clickCount++;
            saveClickCount(clickCount);

            // Sprawdź czy osiągnięto 10 kliknięć i czy autoplay jest włączony
            if (clickCount >= 10 && autoPlayEnabled) {
                playVideo();
                // Resetuj licznik
                clickCount = 0;
                saveClickCount(clickCount);
            }
        }
        hasDragged = false;
    }

    // Obsługa prawego przycisku myszy - ustawienia
    function handleRightClick(e) {
        e.preventDefault();

        if (!hasDragged) {
            showSettingsPanel();
        }
        hasDragged = false;
    }

    // Odtwórz video
    function playVideo() {
        // Sprawdź czy video już jest otwarte
        if (document.querySelector('.kwak-fullscreen')) return;

        // Stwórz fullscreen container
        const fullscreen = document.createElement('div');
        fullscreen.className = 'kwak-fullscreen';

        // Przycisk zamknięcia
        const closeBtn = document.createElement('button');
        closeBtn.className = 'kwak-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = closeVideo;

        // Video element
        const video = document.createElement('video');
        video.className = 'kwak-video';
        video.src = 'https://github.com/krystianasaaa/margonem-addons/raw/refs/heads/main/videos/Duck%20Quack%20remix.mp4';
        video.autoplay = true;
        video.volume = videoVolume; // Użyj zapisanej głośności

        // Auto-zamknięcie po skończeniu
        video.onended = closeVideo;

        // ESC = zamknij
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeVideo();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Dodaj elementy
        fullscreen.appendChild(closeBtn);
        fullscreen.appendChild(video);
        document.body.appendChild(fullscreen);

        function closeVideo() {
            const fs = document.querySelector('.kwak-fullscreen');
            if (fs) {
                fs.remove();
            }
            document.removeEventListener('keydown', escHandler);
        }
    }

    // Aktualizuj pozycję po zmianie rozmiaru okna
    function handleResize() {
        if (!duck) return;

        const rect = duck.getBoundingClientRect();
        const validPosition = validatePosition({ x: rect.left, y: rect.top });

        if (rect.left !== validPosition.x || rect.top !== validPosition.y) {
            duck.style.left = validPosition.x + 'px';
            duck.style.top = validPosition.y + 'px';
            savePosition(validPosition.x, validPosition.y);
        }

        // Zamknij panel ustawień jeśli jest otwarty
        if (settingsPanel) {
            settingsPanel.remove();
            settingsPanel = null;
        }
    }

    // Inicjalizacja
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createDuck);
        } else {
            createDuck();
        }

        // Backup timer
        setTimeout(createDuck, 1000);

        // Obsługa zmiany rozmiaru okna
        window.addEventListener('resize', handleResize);
    }

    // Start
    init();

})();
