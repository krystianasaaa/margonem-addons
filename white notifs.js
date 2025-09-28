function() {
    'use strict';

    // CSS style do dodania
    const customCSS = `
        /* Stylowanie powiadomień - różne możliwe selektory */
        .notification,
        .alert,
        .message,
        .system-message,
        .chat-message,
        .game-message,
        .info-message,
        [class*="notification"],
        [class*="alert"],
        [class*="message"] {
            color: white !important;
            font-size: 11px !important;
        }

        /* Specyficzne selektory dla Margonem jeśli używają konkretnych klas */
        .mmp-chatbox-content .message,
        .mmp-window .notification,
        #chat .message,
        .tip,
        .tooltip {
            color: white !important;
            font-size: 11px !important;
        }

        /* Dla elementów z ID zawierającym "message" lub "notification" */
        [id*="message"],
        [id*="notification"],
        [id*="alert"] {
            color: white !important;
            font-size: 11px !important;
        }
    `;

    // Funkcja dodająca CSS
    function addCustomCSS() {
        if (!document.getElementById('margonem-custom-notifications')) {
            const style = document.createElement('style');
            style.id = 'margonem-custom-notifications';
            style.textContent = customCSS;
            document.head.appendChild(style);
        }
    }

    // Funkcja sprawdzająca i stylizująca elementy bezpośrednio
    function styleNotifications() {
        // Lista możliwych selektorów dla powiadomień
        const selectors = [
            '.notification',
            '.alert',
            '.message',
            '.system-message',
            '.chat-message',
            '.game-message',
            '.info-message',
            '.tip',
            '.tooltip',
            '[class*="notification"]',
            '[class*="alert"]',
            '[class*="message"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.color = 'white';
                element.style.fontSize = '11px';
            });
        });
    }

    // Observer do monitorowania zmian w DOM
    const observer = new MutationObserver((mutations) => {
        let shouldStyle = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Sprawdź czy dodane zostały nowe elementy
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Sprawdź czy nowy element to powiadomienie
                        const isNotification = node.classList && (
                            node.classList.contains('notification') ||
                            node.classList.contains('alert') ||
                            node.classList.contains('message') ||
                            node.classList.toString().includes('notification') ||
                            node.classList.toString().includes('alert') ||
                            node.classList.toString().includes('message')
                        );

                        if (isNotification) {
                            shouldStyle = true;
                        }
                    }
                });
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                shouldStyle = true;
            }
        });

        if (shouldStyle) {
            styleNotifications();
        }
    });

    // Funkcja inicjalizująca
    function init() {
        // Dodaj CSS
        addCustomCSS();

        // Wystylizuj istniejące powiadomienia
        styleNotifications();

        // Rozpocznij obserwowanie zmian
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Uruchom gdy DOM będzie gotowy
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Dodatkowa funkcja uruchamiana co kilka sekund jako backup
    setInterval(styleNotifications, 3000);

})();
