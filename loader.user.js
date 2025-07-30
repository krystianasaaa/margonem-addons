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
                
                // Poczekaj na załadowanie gry
                waitForGame().then(() => {
                    console.log('Gra załadowana - wykonuję kod dodatków');
                    
                    // Dodaj nowy kod
                    const script = document.createElement('script');
                    script.id = 'margonem-addons';
                    script.textContent = addonsCode;
                    document.head.appendChild(script);
                    
                    addonsLoaded = true;
                    console.log('Dodatki załadowane pomyślnie!');
                });
            })
            .catch(error => {
                console.error('Błąd ładowania dodatków:', error);
            });
    }
    
    // Czekaj na załadowanie gry
    function waitForGame() {
        return new Promise((resolve) => {
            console.log('Czekam na załadowanie gry...');
            
            function checkGame() {
                // Sprawdź różne wskaźniki że gra się załadowała
                if (window.g && window.g.nick) {
                    console.log('Gra załadowana - gracz:', window.g.nick);
                    resolve();
                } else if (window.Engine && window.Engine.hero && window.Engine.hero.d) {
                    console.log('Gra załadowana - Engine hero');
                    resolve();
                } else if (document.querySelector('#game')) {
                    console.log('Gra załadowana - element #game');
                    resolve();
                } else {
                    console.log('Gra jeszcze się ładuje... czekam');
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
