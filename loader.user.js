// ==UserScript==
// @name         Test Margonem Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Test
// @author       You
// @match        https://dream.margonem.pl/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    
    // Sprawdź czy jesteśmy na Dream Margonem
    if (!window.location.href.includes('dream.margonem')) {
        console.log('NIE JESTEŚMY NA DREAM MARGONEM, URL:', window.location.href);
        return;
    }
    
    console.log('JESTEŚMY NA DREAM MARGONEM!', window.location.href);
    
    // Test 1: Sprawdź czy GM_xmlhttpRequest działa
    console.log('Testuje GM_xmlhttpRequest...');
    
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://krystianasaaa.github.io/margonem-addons/version.json',
        onload: function(response) {
            console.log('SUKCES! Odpowiedź serwera:', response.responseText);
            
            // Test 2: Załaduj addons.js
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://krystianasaaa.github.io/margonem-addons/addons.js',
                onload: function(response2) {
                    console.log('ADDONS.JS ZAŁADOWANY!');
                    
                    // Test 3: Wykonaj kod
                    try {
                        eval(response2.responseText);
                        console.log('KOD WYKONANY POMYŚLNIE!');
                    } catch (error) {
                        console.error('BŁĄD WYKONANIA KODU:', error);
                    }
                },
                onerror: function(error) {
                    console.error('BŁĄD ŁADOWANIA ADDONS.JS:', error);
                }
            });
        },
        onerror: function(error) {
            console.error('BŁĄD ŁADOWANIA VERSION.JSON:', error);
        }
    });
    
})();
