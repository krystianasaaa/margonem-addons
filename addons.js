(function() {
    'use strict';
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }


    const allowedUsers = ['6122094', '6210905', '9110806', '3543472', '4965363', '6793254', '4633387', '1661718', '7164363', '5109521', '8370413', '8228619', '7172886', '8357394', '6936569', '874973', '8144729', '1521186', '594120', '8839561', '5906841', '8824864', '2885972', '8776354', '7520102', '9269588', '7316243', '8432475', '5295667', '4664363', '9392055', '530596', '6244754', '8200643']; // <-- Tutaj wklej swoje ID

    const userId = getCookie('user_id');
    if (!allowedUsers.includes(userId)) {
        console.log('🚫 Brak uprawnień dla użytkownika:', userId);
        console.log('✅ Dozwoleni użytkownicy:', allowedUsers);
        return; 
    }

    console.log('✅ Użytkownik autoryzowany:', userId);
console.log('✅ Użytkownik autoryzowany:', userId);
     let customText = "PRZERWA TECHNICZNA -KACZOR ADDONS";

    // Funkcja do tworzenia powiadomienia
    function createNotification() {
        // Sprawdź czy powiadomienie już istnieje
        if (document.getElementById('custom-notification')) {
            return;
        }

        const notification = document.createElement('div');
        notification.id = 'custom-notification';

        // Style - pozycja nieco poniżej środka ekranu
        notification.style.cssText = `
            position: fixed;
            top: 80%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(42, 42, 42, 0.7);
            border: 2px solid rgba(74, 74, 74, 0.8);
            border-radius: 5px;
            padding: 15px 15px;
            color: #ffff00;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            box-shadow: 0 4px 8px rgba(0,0,0,0.6);
            z-index: 99999;
            min-width: 200px;
            text-align: center;
            opacity: 1;
            transition: opacity 0.5s ease-out;
            backdrop-filter: blur(5px);
        `;

        notification.textContent = customText;
        document.body.appendChild(notification);

        // Automatyczne znikanie po 5 sekundach
        setTimeout(function() {
            if (document.getElementById('custom-notification')) {
                const notif = document.getElementById('custom-notification');
                notif.style.opacity = '0';
                setTimeout(function() {
                    if (notif && notif.parentNode) {
                        notif.parentNode.removeChild(notif);
                    }
                }, 500);
            }
        }, 5000);
    }

    // Uruchom po załadowaniu strony
    setTimeout(createNotification, 2000);

    // Dodatkowa próba
    window.addEventListener('load', function() {
        setTimeout(createNotification, 1000);
    });

})();
