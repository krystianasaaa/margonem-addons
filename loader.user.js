// ==UserScript==
// @name         Kaczor Addons Manager - Dream
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  loader
// @author       kaczka
// @match        https://dream.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @updateURL    https://krystianasaaa.github.io/margonem-addons/loader.user.js
// @downloadURL  https://krystianasaaa.github.io/margonem-addons/loader.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CONFIG = {
        SERVER_URL: 'https://krystianasaaa.github.io/margonem-addons',
        CHECK_INTERVAL: 30000,
        VERSION_KEY: 'margonem_addons_version'
    };
    
    let addonsLoaded = false;
    let currentVersion = GM_getValue(CONFIG.VERSION_KEY, '0');
    
    // Sprawdź czy jesteśmy na Dream Margonem
    if (!window.location.href.includes('dream.margonem')) {
        return;
    }
    
    console.log('🚀 Kaczor Addons Manager - NATYCHMIASTOWE ŁADOWANIE!');
    
    // Funkcja do pobierania pliku z serwera
    function fetchFromServer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 5000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Timeout'))
            });
        });
    }
    
    // NATYCHMIASTOWE ładowanie dodatków
    function loadAddonsNow() {
        console.log('⚡ Ładuję dodatki NATYCHMIAST...');
        
        fetchFromServer(`${CONFIG.SERVER_URL}/addons.js?t=${Date.now()}`)
            .then(addonsCode => {
                console.log('✅ Kod dodatków pobrany!');
                
                // Usuń stary skrypt
                const oldScript = document.getElementById('margonem-addons');
                if (oldScript) oldScript.remove();
                
                // NATYCHMIAST wykonaj kod
                const script = document.createElement('script');
                script.id = 'margonem-addons';
                script.textContent = addonsCode;
                (document.head || document.documentElement).appendChild(script);
                
                addonsLoaded = true;
                console.log('🎉 DODATKI ZAŁADOWANE NATYCHMIAST!');
                
                // Sprawdź wersję w tle
                checkVersionInBackground();
            })
            .catch(error => {
                console.error('❌ Błąd ładowania:', error);
                // Spróbuj ponownie za 2 sekundy
                setTimeout(loadAddonsNow, 2000);
            });
    }
    
    // Sprawdź wersję w tle (nie blokuje ładowania)
    function checkVersionInBackground() {
        fetchFromServer(`${CONFIG.SERVER_URL}/version.json?t=${Date.now()}`)
            .then(versionData => {
                const serverVersion = JSON.parse(versionData);
                
                if (serverVersion.version !== currentVersion) {
                    console.log('🔄 Nowa wersja dostępna:', serverVersion.version);
                    GM_setValue(CONFIG.VERSION_KEY, serverVersion.version);
                    currentVersion = serverVersion.version;
                    
                    // Przeładuj dodatki z nową wersją
                    loadAddonsNow();
                }
            })
            .catch(error => {
                console.log('ℹ️ Nie można sprawdzić wersji:', error.message);
            });
    }
    
    // URUCHOM NATYCHMIAST!
    loadAddonsNow();
    
    // Sprawdzaj aktualizacje co 30 sekund
    setInterval(checkVersionInBackground, CONFIG.CHECK_INTERVAL);
    
})();
