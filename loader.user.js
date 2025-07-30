// ==UserScript==
// @name         Margonem Addons Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ładuje dodatki do Margonem z serwera
// @author       TwojeImie
// @match        https://margonem.pl/*
// @match        https://www.margonem.pl/*
// @match        https://margonem.com/*
// @match        https://www.margonem.com/*
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
    async function checkVersion() {
        try {
            const versionData = await fetchFromServer(`${CONFIG.SERVER_URL}/version.json?t=${Date.now()}`);
            const serverVersion = JSON.parse(versionData);
            
            if (serverVersion.version !== currentVersion) {
                console.log('Nowa wersja dodatków dostępna:', serverVersion.version);
                await loadAddons();
                GM_setValue(CONFIG.VERSION_KEY, serverVersion.version);
                currentVersion = serverVersion.version;
            }
        } catch (error) {
            console.error('Błąd sprawdzania wersji:', error);
        }
    }
    
    // Załaduj dodatki z serwera
    async function loadAddons() {
        try {
            const addonsCode = await fetchFromServer(`${CONFIG.SERVER_URL}/addons.js?t=${Date.now()}`);
            
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
            
        } catch (error) {
            console.error('Błąd ładowania dodatków:', error);
        }
    }
    
    // Inicjalizacja
    async function init() {
        console.log('Uruchamianie Margonem Addons Loader...');
        
        // Załaduj dodatki przy pierwszym uruchomieniu
        await checkVersion();
        
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
