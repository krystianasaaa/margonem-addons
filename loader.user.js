// ==UserScript==
// @name         Kaczor Addons Manager - Dream
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  loader
// @author       kaczka
// @match        https://dream.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @updateURL    https://krystianasaaa.github.io/margonem-addons/loader.user.js
// @downloadURL  https://krystianasaaa.github.io/margonem-addons/loader.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CONFIG = {
        SERVER_URL: 'https://krystianasaaa.github.io/margonem-addons',
        CHECK_INTERVAL: 30000, // sprawdzaj co 30 sekund
        VERSION_KEY: 'margonem_addons_version'
    };
    
    let addonsLoaded = false;
    let currentVersion = GM_getValue(CONFIG.VERSION_KEY, '0');
    
    // Sprawdź czy jesteśmy na Dream Margonem
    if (!window.location.href.includes('dream.margonem')) {
        return;
    }
    
    console.log('Uruchamianie Margonem Addons Loader...');
    
    // Funkcja do pobierania pliku z serwera
    function fetchFromServer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }
    
    // Sprawdź wersję na serwerze
    function checkVersion() {
        fetchFromServer(`${CONFIG.SERVER_URL}/version.json?t=${Date.now()}`)
            .then(versionData => {
                const serverVersion = JSON.parse(versionData);
                
                if (serverVersion.version !== currentVersion) {
                    console.log('Nowa wersja dodatków dostępna:', serverVersion.version);
                    return loadAddons().then(() => {
                        GM_setValue(CONFIG.VERSION_KEY, serverVersion.version);
                        currentVersion = serverVersion.version;
                    });
                }
            })
            .catch(error => {
                console.error('Błąd sprawdzania wersji:', error);
            });
    }
    
    // Załaduj dodatki z serwera
    function loadAddons() {
        return fetchFromServer(`${CONFIG.SERVER_URL}/addons.js?t=${Date.now()}`)
            .then(addonsCode => {
                // Usuń stare dodatki jeśli istnieją
                const oldScript = document.getElementById('margonem-addons');
                if (oldScript) {
                    oldScript.remove();
                }
                
                // Dodaj nowy kod
                const script = document.createElement('script');
                script.id = 'margonem-addons';
                script.textContent = addonsCode;
                document.head.appendChild(script);
                
                addonsLoaded = true;
                console.log('Dodatki załadowane pomyślnie');
            })
            .catch(error => {
                console.error('Błąd ładowania dodatków:', error);
            });
    }
    
    // Inicjalizacja
    function init() {
        // Załaduj dodatki przy pierwszym uruchomieniu
        checkVersion();
        
        // Sprawdzaj aktualizacje regularnie
        setInterval(checkVersion, CONFIG.CHECK_INTERVAL);
    }
    
    // Czekaj na załadowanie strony
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
