(function() {
    'use strict';

    const STORAGE_KEY = 'margonem_timer_size';

    function saveTimerSize(width, height) {
        const data = { width, height };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadTimerSize() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    function findTimerWindow() {
        const allDivs = document.querySelectorAll('div[name="Minutnik"]');
        for (let div of allDivs) {
            const parent = div.closest('.border-window');
            if (parent) return parent;
        }
        return null;
    }

    function fixTimerRows(scrollWrapper) {
        const rows = scrollWrapper.querySelectorAll('[class*="row"]');

        rows.forEach(row => {
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.gap = '5px';
            row.style.paddingRight = '10px';

            const children = Array.from(row.children);

            if (children.length >= 2) {
                children[0].style.overflow = 'hidden';
                children[0].style.textOverflow = 'ellipsis';
                children[0].style.whiteSpace = 'nowrap';
                children[0].style.flex = '1';
                children[0].style.minWidth = '0';

                children[children.length - 1].style.flexShrink = '0';
                children[children.length - 1].style.minWidth = '60px';
                children[children.length - 1].style.textAlign = 'right';
            }
        });
    }

    function makeResizable(timer) {
        if (!timer || timer.dataset.timerResizable) return;

        timer.dataset.timerResizable = 'true';

        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 15px;
            height: 15px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 100%);
            z-index: 1000;
        `;

        timer.style.position = 'relative';
        timer.appendChild(resizeHandle);

        const scrollWrapper = timer.querySelector('.scroll-wrapper, .layer');
        if (!scrollWrapper) return;

        // NIE zmieniaj overflow - zostaw oryginalny mechanizm scrollowania gry
        // scrollWrapper.style.overflowY = 'auto';
        // scrollWrapper.style.overflowX = 'hidden';

        // Wczytaj zapisany rozmiar
        const savedSize = loadTimerSize();
        if (savedSize) {
            timer.style.width = savedSize.width + 'px';
            scrollWrapper.style.height = savedSize.height + 'px';
            scrollWrapper.style.maxHeight = savedSize.height + 'px';
        }

        fixTimerRows(scrollWrapper);

        const rowObserver = new MutationObserver(() => {
            fixTimerRows(scrollWrapper);
        });

        rowObserver.observe(scrollWrapper, {
            childList: true,
            subtree: true
        });

        let isResizing = false;
        let startX = 0;
        let startY = 0;
        let startWidth = 0;
        let startHeight = 0;
        let currentWidth = 0;
        let currentHeight = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = timer.offsetWidth;
            startHeight = scrollWrapper.offsetHeight;

            document.body.style.cursor = 'nwse-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const newWidth = startWidth + deltaX;
            const newHeight = startHeight + deltaY;

            if (newWidth >= 150 && newWidth <= 500) {
                timer.style.width = newWidth + 'px';
                currentWidth = newWidth;
            } else if (newWidth < 150) {
                timer.style.width = '150px';
                currentWidth = 150;
            } else if (newWidth > 500) {
                timer.style.width = '500px';
                currentWidth = 500;
            }

            if (newHeight >= 100 && newHeight <= 800) {
                scrollWrapper.style.height = newHeight + 'px';
                scrollWrapper.style.maxHeight = newHeight + 'px';
                currentHeight = newHeight;
            } else if (newHeight < 100) {
                scrollWrapper.style.height = '100px';
                scrollWrapper.style.maxHeight = '100px';
                currentHeight = 100;
            } else if (newHeight > 800) {
                scrollWrapper.style.height = '800px';
                scrollWrapper.style.maxHeight = '800px';
                currentHeight = 800;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                // Zapisz dokładne wartości z currentWidth/currentHeight
                if (currentWidth > 0 && currentHeight > 0) {
                    saveTimerSize(Math.round(currentWidth), Math.round(currentHeight));
                }
            }
        });
    }

    const timerObserver = new MutationObserver(() => {
        const timer = findTimerWindow();
        if (timer && !timer.dataset.timerResizable) {
            makeResizable(timer);
        }
    });

    function init() {
        const timer = findTimerWindow();
        if (timer) {
            makeResizable(timer);
        }

        timerObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
