(function() {
    'use strict';
const SCALE = 0.7;

const widgetContainers = document.querySelectorAll('.main-buttons-container');
for(const container of widgetContainers) {
    const positionClass = Array.from(container.classList).find(c => c.includes('bottom-') || c.includes('top-'));
    container.style.transform = `scale(${SCALE})`;
    container.style.transformOrigin = positionClass.replace('-', ' ');
}
})();
