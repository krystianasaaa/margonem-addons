// ==UserScript==
// @name         Kaczor Addons Manager - Dream
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  zestaw dodatkow 
// @author       kaczka
// @match        https://dream.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png
// @run-at       document-body
// @updateURL    https://krystianasaaa.github.io/margonem-addons/loader.user.js
// @downloadURL  https://krystianasaaa.github.io/margonem-addons/loader.user.js
// ==/UserScript==

"use strict";

(function() {
    const date = new Date();
    const version = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
    const build = `https://krystianasaaa.github.io/margonem-addons/addons.js?v=${version}`;
    const script = document.createElement("script");
    
    script.src = `${build}?v=${version}`;
    document.body.appendChild(script);
})();
