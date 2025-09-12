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

    // Klucze do zapisywania w localStorage
    const STORAGE_KEY_POSITION = 'kwak-duck-position';
    const STORAGE_KEY_CLICKS = 'kwak-duck-clicks';

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

    // Stwórz kaczkę
    function createDuck() {
        if (duck) return;

        duck = document.createElement('div');
        duck.className = 'kwak-duck';

        // Wczytaj zapisaną pozycję i licznik
        const savedPosition = loadPosition();
        const validPosition = validatePosition(savedPosition);
        clickCount = loadClickCount();

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

        // Stwórz audio
        createAudio();
    }

    // Start przeciągania
    function startDrag(e) {
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

    // Kliknięcie - odtwarza dźwięk i liczy kliknięcia
    function handleClick(e) {
        if (!hasDragged) {
            // Odtwórz dźwięk
            playClickSound();

            // Zwiększ licznik
            clickCount++;
            saveClickCount(clickCount);

            // Sprawdź czy osiągnięto 10 kliknięć
            if (clickCount >= 10) {
                playVideo();
                // Resetuj licznik
                clickCount = 0;
                saveClickCount(clickCount);
            }
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
        video.volume = 0.7;

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
