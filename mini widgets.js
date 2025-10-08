(function() {
    'use strict';
    const SCALE = 0.7;
    const ORIGINAL_SIZE = 44;
    const NEW_SIZE = ORIGINAL_SIZE * SCALE;
    const processedElements = new WeakSet();

    function isRightContainer(element) {
        const container = element.closest('.main-buttons-container');
        if (!container) return false;
        return container.classList.contains('top-right') ||
               container.classList.contains('bottom-right');
    }

    function scaleWidget(element) {
        if (processedElements.has(element)) return;

        element.style.transform = `scale(${SCALE})`;
        element.style.transformOrigin = 'center center';

        const inRightContainer = isRightContainer(element);

        if (inRightContainer) {

            const currentRight = parseFloat(element.style.right);
            const currentLeft = parseFloat(element.style.left);


            if (!isNaN(currentLeft)) {
                const slotIndex = Math.round(currentLeft / ORIGINAL_SIZE);
                const newRight = slotIndex * NEW_SIZE;
                element.style.left = '';
                element.style.right = `${newRight}px`;
            }

            else if (!isNaN(currentRight)) {
                const slotIndex = Math.round(currentRight / ORIGINAL_SIZE);
                const newRight = slotIndex * NEW_SIZE;
                element.style.right = `${newRight}px`;
            }
        } else {

            const currentLeft = parseFloat(element.style.left);
            if (!isNaN(currentLeft)) {
                const slotIndex = Math.round(currentLeft / ORIGINAL_SIZE);
                const newLeft = slotIndex * NEW_SIZE;
                element.style.left = `${newLeft}px`;
            }
        }

        processedElements.add(element);
    }

    function scaleContainer(container) {
        if (processedElements.has(container)) return;

        const currentWidth = parseFloat(container.style.width);
        if (currentWidth === 308) {
            const newWidth = 7 * NEW_SIZE;
            container.style.width = `${newWidth}px`;
        }

        processedElements.add(container);
    }

    function processAll() {
        document.querySelectorAll('.main-buttons-container').forEach(scaleContainer);
        document.querySelectorAll('.widget-button, .empty-slot-widget').forEach(scaleWidget);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAll);
    } else {
        processAll();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList?.contains('widget-button') ||
                        node.classList?.contains('empty-slot-widget')) {
                        scaleWidget(node);
                    }
                    if (node.classList?.contains('main-buttons-container')) {
                        scaleContainer(node);
                    }
                    // Sprawdź dzieci
                    node.querySelectorAll?.('.widget-button, .empty-slot-widget').forEach(scaleWidget);
                    node.querySelectorAll?.('.main-buttons-container').forEach(scaleContainer);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
