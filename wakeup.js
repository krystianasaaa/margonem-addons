(function() {
    'use strict';

    let lastStasisValue = null;
    const soundUrl = 'https://github.com/krystianasaaa/margonem-addons/raw/refs/heads/main/sounds/iPhone%206%20Plus%20Original%20Ringtone.mp3';

    function waitForEngine() {
        if (typeof Engine === 'undefined' ||
            !Engine.hero ||
            !Engine.hero.d ||
            typeof Engine.hero.d.stasis_incoming_seconds === 'undefined') {
            setTimeout(waitForEngine, 500);
            return;
        }
        startStasisCheck();
    }

    function startStasisCheck() {
        setInterval(function() {
            try {
                const stasisValue = Engine.hero.d.stasis_incoming_seconds;


                if (stasisValue !== lastStasisValue) {

                    if (stasisValue > 0 && (lastStasisValue === null || lastStasisValue === 0)) {
                        playSound();
                    }

                    lastStasisValue = stasisValue;
                }
            } catch (e) {
                console.error('Błąd sprawdzania stasis:', e);
            }
        }, 200);
    }

    function playSound() {
        try {
            const audio = new Audio(soundUrl);
            audio.volume = 1.0;
            audio.play().catch(err => {
                console.error('Nie można odtworzyć dźwięku:', err);
            });
        } catch (e) {
            console.error('Błąd odtwarzania dźwięku:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForEngine);
    } else {
        waitForEngine();
    }
})();
