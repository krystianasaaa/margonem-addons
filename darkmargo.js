(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        body, .background-logged-wrapper, .wrapper, .site-top, .main-column {
            background-color: #000000 !important;
            background-image: none !important;
        }

        *, ::before, ::after {
            box-shadow: none !important;
            text-shadow: none !important;
        }

        .heading, .select-char, .charc, .char-description, .charimg-container, .charFitWrapper {
            border: none !important;
            background: none !important;
            background-color: transparent !important;
        }

        .c-char__left {
            background-color: #000000 !important;
        }

        .tabs__content, .text-divider {
            background-color: #000000 !important;
            background-image: none !important;
        }

        .text-divider span {
            color: #ffffff !important;
            background-color: #1a1a1a !important;
            padding: 4px 12px !important;
        }

        .tabs__nav-item.is-active::after,
        li.tabs__nav-item.is-active::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 29"><path fill="%23333333" d="M10.5 0L21 29H0z"/></svg>') !important;
            background-color: transparent !important;
            filter: none !important;
        }

        .light-brown-box, .brown-box, .ranking-container, .short-news, .dark-news,
        .modal-content, .container, .content, .left-column {
            background-color: #0a0a0a !important;
            background-image: none !important;
            border: 1px solid #222222 !important;
        }

        .right-column, .char-container, .char-background,
        .char-description-first-row, .char-description-second-row,
        .char-headers, .char-data, .current-character {
            background-color: #000000 !important;
            background-image: none !important;
            border: none !important;
        }

        .profile-header-data, .profile-header-capitalized {
            background-color: #000000 !important;
            background-image: none !important;
            border: none !important;
        }

        .heading--left, .heading {
            background-color: transparent !important;
            background-image: none !important;
            color: #ffffff !important;
            border: none !important;
        }

        .label, .mb-10, .value {
            color: #ffffff !important;
            background-color: transparent !important;
        }

        .eq-item, .item-container-1, .item-container-2, .item-container-3,
        .item-container-4, .item-container-5, .item-container-6,
        .item-container-7, .item-container-8, .item-container-10 {
            border: none !important;
        }

        .eq-item img {
            filter: none !important;
            opacity: 1 !important;
        }

        .char-header, .char-data-column, .char-data-world, .char-data-lvl,
        .char-data-prof, .char-data-clan, .char-data-gender {
            background-color: transparent !important;
            color: #ffffff !important;
        }

        .ranking-tab, .ranking-type-pvp, .ranking-type-level, .ranking-type-honor,
        .c-btn.enter-game, .wejdź-do-gry, .btn-primary, a.btn, .ranking-tab, .form-select,
        .tagButton, button[class*="tag"], button[data-tag],
        .tabs__nav-item, li[data-tab], .change-input, label.btn,
        .close-popup, .close-popup i, button.btn, button[id*="save"] {
            background-color: #1a1a1a !important;
            background-image: none !important;
            color: #ffffff !important;
            border: 1px solid #333333 !important;
        }

        .ranking-tab.active, .c-btn.enter-game:hover, .form-select:focus,
        .tagButton:hover, button[data-tag]:hover,
        .tabs__nav-item:hover, .change-input:hover, .close-popup:hover,
        button.btn:hover, button[id*="save"]:hover {
            background-color: #252525 !important;
            color: #00aaff !important;
        }

        .menu-container, .menu, .menu ul {
            background-color: #000000 !important;
            background-image: none !important;
            border: none !important;
        }

        .menu li a, .menu ul li a, .js-account-logout {
            background: #000000 !important;
            color: #ffffff !important;
            border: none !important;
        }

        .menu li a:hover, .menu ul li a:hover {
            background-color: #1a1a1a !important;
            color: #00aaff !important;
        }

        .light-brown-box *, .brown-box *, .charc *, .short-news *, .select-char *,
        .ranking-container *, .modal-content *, .profile-container *, .heading *,
        .char-description *, .news-content, .js-account-logout, .character-list h3, .label-control,
        .right-column *, .char-container *, .current-character {
            color: #ffffff !important;
        }

        a, a * { color: #00aaff !important; }

        .menu a, .menu a *, .js-account-logout { color: #ffffff !important; }

        img[src*="logo-small.svg"], img[src*="logo-mini"], .logo-mini, .burger-icon {
            display: none !important;
        }

        td.logo, td.logo * {
            display: none !important;
        }

        /* Custom top-left main page link */
        #custom-top-logo {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff !important;
            text-decoration: none !important;
            background-color: #1a1a1a !important;
            padding: 8px 15px !important;
            border: 1px solid #333333 !important;
            border-radius: 4px !important;
            transition: all 0.3s !important;
        }

        #custom-top-logo:hover {
            background-color: #252525 !important;
            border-color: #00aaff !important;
            color: #00aaff !important;
        }

        #ajaxWait, #alert, #msgbox, #side-left, #omlu, #ornlu,
        #ornld, #ornru, #ornrd {
            display: none !important;
        }

        img[src*="img/mn2.jpg"], img[src*="img/es-flores.png"],
        img[src*="img/es-flores2.png"] {
            display: none !important;
        }

        body > img {
            display: none !important;
        }

        th, thead tr { background-color: #000000 !important; }
        td { background-color: #0a0a0a !important; border-color: #222222 !important; }

        .white-line, .black-line, .header-underline {
            background-color: #333333 !important;
            height: 1px !important;
            border: none !important;
        }

        .character-list, .character-list ul {
            background: transparent !important;
            border: none !important;
        }

        .char-row {
            background-color: #0d0d0d !important;
            border: 1px solid #1a1a1a !important;
            margin-bottom: 4px !important;
            transition: background 0.2s !important;
        }

        .char-row:hover {
            background-color: #151515 !important;
            border-color: #00aaff !important;
        }

        .character-name {
            color: #ffffff !important;
            font-weight: bold !important;
        }

        .clvl, .character-prof, .world {
            color: #bbbbbb !important;
        }

        .sort-character-select {
            background-color: #111 !important;
            color: white !important;
            border-radius: 4px !important;
            padding: 5px !important;
        }

        .catbar, .catbar th {
            background-color: #000000 !important;
            background-image: none !important;
            color: #ffffff !important;
            border: 1px solid #222222 !important;
        }

        .forum-container, .forum-table, .forum-row, .forum-post,
        tr.catbar, tr[class*="cat"], th, td {
            background-color: #0a0a0a !important;
            background-image: none !important;
            color: #ffffff !important;
        }

        tr.catbar th {
            background: #000000 !important;
            border: 1px solid #222222 !important;
        }

        tr[style*="background"] {
            background: #000000 !important;
            background-image: none !important;
        }

        tr[style*="background"] th {
            background: #000000 !important;
            background-image: none !important;
            color: #ffffff !important;
        }

        .c-char__center, .c-char__right, .c-char__icon,
        #copy-ref, .eye-icon-button, #profile-save-btn,
        .btn-center {
            background-color: #000000 !important;
            background-image: none !important;
            color: #ffffff !important;
            border: 1px solid #222222 !important;
        }

        img[src*="new-character.png"] {
            filter: brightness(0) invert(1) !important;
        }

        .fback-list, .fback, .fback-tooltip, .fback-list > div {
            background-color: #000000 !important;
            background-image: none !important;
            border-color: #222222 !important;
        }

        .fback.available {
            border-color: #00aaff !important;
        }

        .fback img {
            border: 1px solid #222222 !important;
        }

        .requirement-met, .requirement-not-met {
            background-color: transparent !important;
        }

        .mt-3, .mt-md-4 {
            background-color: #000000 !important;
        }

        .sceditor-toolbar, .sceditor-group {
            background-color: #000000 !important;
            background-image: none !important;
            border-color: #222222 !important;
        }

        .sceditor-button {
            background-color: #1a1a1a !important;
            background-image: none !important;
            border-color: #333333 !important;
        }

        .sceditor-button:hover {
            background-color: #252525 !important;
        }

        .sceditor-button svg, .sceditor-button svg * {
            fill: #ffffff !important;
            color: #ffffff !important;
        }

        /* Garmory support page styling */
        .wrapper, .container, .navbar, .navbar-default, .navbar-header,
        #mainWrapper, #main, .contentWrapper, .content-left {
            background-color: #000000 !important;
            background-image: none !important;
        }

        .navbar-brand, .navbar-text, .navbar-text span, .navbar-text a,
        .nav a, .dropdown-menu, .dropdown-menu li a {
            background-color: transparent !important;
            color: #ffffff !important;
        }

        .navbar-brand.logo .orangebig {
            color: #ff6600 !important;
        }

        .dropdown-menu {
            background-color: #0a0a0a !important;
            border: 1px solid #222222 !important;
        }

        .dropdown-menu li a:hover {
            background-color: #1a1a1a !important;
            color: #00aaff !important;
        }

        .line {
            background-color: #ffffff !important;
        }

        .list-group, .list-group-item {
            background-color: #0a0a0a !important;
            background-image: none !important;
            border: 1px solid #222222 !important;
            color: #ffffff !important;
        }

        .list-group-item:hover {
            background-color: #1a1a1a !important;
            color: #00aaff !important;
        }

        #questions, .search_box, #results, .topic_list {
            background-color: #0a0a0a !important;
            color: #ffffff !important;
        }

        .form-control, input[type="email"], input[type="text"] {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
            border: 1px solid #333333 !important;
        }

        .form-control:focus {
            background-color: #252525 !important;
            border-color: #00aaff !important;
        }

        .modal-content, .modal-header, .modal-body, .modal-footer {
            background-color: #0a0a0a !important;
            color: #ffffff !important;
            border-color: #222222 !important;
        }

        .modal-title, .modal-body p, .modal-body label {
            color: #ffffff !important;
        }

        .btn-primary {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
            border: 1px solid #333333 !important;
        }

        .btn-primary:hover {
            background-color: #252525 !important;
            color: #00aaff !important;
        }

        .glyphicon {
            color: #ffffff !important;
        }

        .close {
            color: #ffffff !important;
            opacity: 1 !important;
        }

        .close:hover {
            color: #ff0000 !important;
        }

        /* Panel styling for support page */
        .panel, .panel-default, .panel-group, .panel-heading, .panel-body {
            background-color: #0a0a0a !important;
            background-image: none !important;
            border: 1px solid #222222 !important;
            color: #ffffff !important;
        }

        .panel-default > .panel-heading {
            background-color: #000000 !important;
            border-color: #222222 !important;
        }

        .panel a {
            color: #00aaff !important;
        }

        .panel a:hover {
            color: #0088cc !important;
        }

        /* Alert styling */
        .alert, .alert-info, .alert-container {
            background-color: #0a0a0a !important;
            background-image: none !important;
            border: 1px solid #222222 !important;
            color: #ffffff !important;
        }

        .alert p {
            color: #ffffff !important;
        }

        /* Blockquote styling */
        blockquote, .blockquote, [class*="blockquote"] {
            background-color: #0a0a0a !important;
            background-image: none !important;
            border-left: 3px solid #333333 !important;
            border-right: none !important;
            border-top: none !important;
            border-bottom: none !important;
            color: #ffffff !important;
            margin: 5px 0 !important;
            padding: 5px 10px !important;
        }

        blockquote *, .blockquote *, [class*="blockquote"] * {
            background-color: transparent !important;
            color: #cccccc !important;
        }

        /* User post cell styling */
        td.puser, td.puser * {
            background-color: #000000 !important;
            background-image: none !important;
        }

        td.puser center, td.puser div {
            background-color: transparent !important;
            background-image: none !important;
        }

        .nickwood, .nickwood * {
            background-color: transparent !important;
            background-image: none !important;
            color: #ffffff !important;
        }

        .pavatar_new {
            background-color: transparent !important;
            background-image: none !important;
        }

        .repbar, .repbar * {
            background-color: transparent !important;
            color: #ffffff !important;
        }

        /* Level, posts, reputation styling */
        td.puser .clvl, td.puser span[style*="color"],
        td.puser td[style*="color"], .repbar td {
            color: #ffffff !important;
        }

        /* Add labels for user stats */
        .repbar tr:first-child td:first-child::before {
            content: "lvl: ";
            color: #ffffff !important;
        }

        .repbar tr:first-child td:last-child::before {
            content: "rep: ";
            color: #ffffff !important;
        }

        .repbar tr:last-child td:last-child::before {
            content: "postów: ";
            color: #ffffff !important;
        }

        .repbar td {
            padding-right: 0 !important;
        }

        .repbar tr:last-child td:last-child span {
            padding-right: 0 !important;
        }

        .repbar tr:last-child td:last-child {
            text-align: center !important;
        }

        /* Custom logo link styling */
        #custom-logo-link {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            transition: opacity 0.3s;
        }

        #custom-logo-link:hover {
            opacity: 0.8;
        }

        #custom-logo-link img {
            display: block !important;
            width: 50px;
            height: auto;
            border: 2px solid #333333;
            border-radius: 4px;
        }
    `;

    document.head.appendChild(style);


    const replaceRankImages = () => {

        const mgImages = document.querySelectorAll('img[src*="forum-mg"]');
        mgImages.forEach(img => {
            if (img.dataset.rankReplaced) return;
            img.dataset.rankReplaced = 'true';

            const rankSpan = document.createElement('span');
            rankSpan.textContent = 'MG';
            rankSpan.style.cssText = `
                color: #ff0000 !important;
                background-color: transparent !important;
                font-weight: bold !important;
                font-size: 12px !important;
                display: inline-block !important;
            `;
            img.parentNode.replaceChild(rankSpan, img);
        });


        const zspImages = document.querySelectorAll('img[src*="forum-zsp"]');
        zspImages.forEach(img => {
            if (img.dataset.rankReplaced) return;
            img.dataset.rankReplaced = 'true';

            const rankSpan = document.createElement('span');
            rankSpan.textContent = 'ZŚP';
            rankSpan.style.cssText = `
                color: #ff0000 !important;
                background-color: transparent !important;
                font-weight: bold !important;
                font-size: 12px !important;
                display: inline-block !important;
            `;
            img.parentNode.replaceChild(rankSpan, img);
        });


        const modImages = document.querySelectorAll('img[src*="forum-mod"]');
        modImages.forEach(img => {
            if (img.dataset.rankReplaced) return;
            img.dataset.rankReplaced = 'true';

            const rankSpan = document.createElement('span');
            rankSpan.textContent = 'MODERATOR';
            rankSpan.style.cssText = `
                color: #ff0000 !important;
                background-color: transparent !important;
                font-weight: bold !important;
                font-size: 12px !important;
                display: inline-block !important;
            `;
            img.parentNode.replaceChild(rankSpan, img);
        });
    };

    function addCustomLogo() {

        if (document.getElementById('custom-top-logo')) {
            return;
        }


        const topLink = document.createElement('a');
        topLink.id = 'custom-top-logo';
        topLink.href = 'https://www.margonem.pl';
        topLink.textContent = 'GŁÓWNA';
        document.body.appendChild(topLink);


        const link = document.createElement('a');
        link.id = 'custom-logo-link';
        link.href = '/';

        const img = document.createElement('img');
        img.src = 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/videos/ikonka2.png';
        img.alt = 'Logo';

        link.appendChild(img);
        document.body.appendChild(link);
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addCustomLogo();
            replaceRankImages();
        });
    } else {
        addCustomLogo();
        replaceRankImages();
    }


    const observer = new MutationObserver((mutations) => {
        replaceRankImages();
    });


    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src']
            });
        } else {
            setTimeout(startObserver, 100);
        }
    };

    startObserver();


    setInterval(replaceRankImages, 1000);
})();
