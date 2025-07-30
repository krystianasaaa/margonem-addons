// ==UserScript==
// @name         Kaczor Addons Manager - Dream
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  loader
// @author       kaczka
// @match        https://dream.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @updateURL    https://krystianasaaa.github.io/margonem-addons/loader.user.js
// @downloadURL  https://krystianasaaa.github.io/margonem-addons/loader.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CONFIG = {
        SERVER_URL: 'https://krystianasaaa.github.io/margonem-addons',
        CHECK_INTERVAL: 30000,
        VERSION_KEY: 'margonem_addons_version'
    }
    
    // Sprawdź czy gra jest już załadowana
    function isGameLoaded() {
        return !!(
            (window.g && window.g.nick) ||
            (window.Engine && window.Engine.hero && window.Engine.hero.d && window.Engine.hero.d.nick) ||
            (window.hero && window.hero.nick) ||
            (document.querySelector('#game') && document.querySelector('.stats'))
        );
    }
    
    // Wykonaj kod dodatków
    function executeAddons(addonsCode) {
        const script = document.createElement('script');
        script.id = 'margonem-addons';
        script.textContent = addonsCode;
        document.head.appendChild(script);
        
        addonsLoaded = true;
        console.log('Dodatki załadowane pomyślnie!');
    };
    
    let addonsLoaded = false;
    let currentVersion = GM_getValue(CONFIG.VERSION_KEY, '0');
    
    // Sprawdź czy jesteśmy na Dream Margonem
    if (!window.location.href.includes('dream.margonem')) {
        console.log('Nie jesteśmy na dream.margonem');
        return;
    }
    
    console.log('Kaczor Addons Manager uruchomiony!');
    
    // Funkcja do pobierania pliku z serwera
    function fetchFromServer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('Request timeout'));
                }
            });
        });
    }
    
    // Sprawdź wersję na serwerze
    function checkVersion() {
        console.log('Sprawdzam wersję dodatków...');
        
        fetchFromServer(`${CONFIG.SERVER_URL}/version.json?t=${Date.now()}`)
            .then(versionData => {
                console.log('Otrzymane dane wersji:', versionData);
                const serverVersion = JSON.parse(versionData);
                
                console.log('Wersja serwera:', serverVersion.version, 'Lokalna:', currentVersion);
                
                if (serverVersion.version !== currentVersion) {
                    console.log('Nowa wersja dostępna! Ładuję dodatki...');
                    return loadAddons().then(() => {
                        GM_setValue(CONFIG.VERSION_KEY, serverVersion.version);
                        currentVersion = serverVersion.version;
                        console.log('Wersja zaktualizowana do:', currentVersion);
                    });
                } else {
                    console.log('Dodatki są aktualne');
                    if (!addonsLoaded) {
                        console.log('Pierwsze uruchomienie - ładuję dodatki...');
                        return loadAddons();
                    }
                }
            })
            .catch(error => {
                console.error('Błąd sprawdzania wersji:', error);
            });
    }
    
    // Załaduj dodatki z serwera
    function loadAddons() {
        console.log('Pobieram dodatki z serwera...');
        
        return fetchFromServer(`${CONFIG.SERVER_URL}/addons.js?t=${Date.now()}`)
            .then(addonsCode => {
                console.log('Otrzymany kod dodatków (długość):', addonsCode.length);
                
                // Usuń stare dodatki jeśli istnieją
                const oldScript = document.getElementById('margonem-addons');
                if (oldScript) {
                    console.log('Usuwam stary skrypt dodatków');
                    oldScript.remove();
                }
                
                // Sprawdź czy gra już jest załadowana
                if (isGameLoaded()) {
                    console.log('Gra już załadowana - wykonuję kod dodatków natychmiast');
                    executeAddons(addonsCode);
                } else {
                    console.log('Gra nie jest jeszcze załadowana - czekam...');
                    waitForGame().then(() => {
                        console.log('Gra załadowana - wykonuję kod dodatków');
                        executeAddons(addonsCode);
                    });
                }
            })
            .catch(error => {
                console.error('Błąd ładowania dodatków:', error);
            });
    }
    
    // Czekaj na załadowanie gry
    function waitForGame() {
        return new Promise((resolve) => {
            console.log('Czekam na załadowanie gry...');
            
            let attempts = 0;
            const maxAttempts = 30; // maksymalnie 30 sekund
            
            function checkGame() {
                attempts++;
                console.log(`Próba ${attempts}/${maxAttempts} - sprawdzam czy gra załadowana`);
                
                // Debug - sprawdź co jest dostępne
                console.log('window.g:', !!window.g);
                console.log('window.Engine:', !!window.Engine);
                console.log('window.hero:', !!window.hero);
                console.log('#game element:', !!document.querySelector('#game'));
                
                // Sprawdź różne wskaźniki że gra się załadowała
                if (window.g && window.g.nick) {
                    console.log('✅ Gra załadowana - window.g.nick:', window.g.nick);
                    resolve();
                } else if (window.Engine && window.Engine.hero && window.Engine.hero.d && window.Engine.hero.d.nick) {
                    console.log('✅ Gra załadowana - Engine.hero.d.nick:', window.Engine.hero.d.nick);
                    resolve();
                } else if (window.hero && window.hero.nick) {
                    console.log('✅ Gra załadowana - window.hero.nick:', window.hero.nick);
                    resolve();
                } else if (document.querySelector('#game') && document.querySelector('.stats')) {
                    console.log('✅ Gra załadowana - elementy UI dostępne');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.log('⚠️ Timeout - uruchamiam dodatki mimo braku pełnej detekcji gry');
                    resolve();
                } else {
                    console.log('❌ Gra jeszcze się ładuje... czekam');
                    setTimeout(checkGame, 1000);
                }
            }
            
            checkGame();
        });
    }
    
    // Inicjalizacja z opóźnieniem
    function init() {
        console.log('Inicjalizacja Kaczor Addons Manager...');
        
        // Poczekaj chwilę na załadowanie strony
        setTimeout(() => {
            checkVersion();
            
            // Sprawdzaj aktualizacje regularnie
            setInterval(checkVersion, CONFIG.CHECK_INTERVAL);
        }, 2000); // 2 sekundy opóźnienia
    }
    
    // Uruchom po załadowaniu DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
