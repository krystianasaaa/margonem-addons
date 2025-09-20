// monitor.js
const fs = require('fs');
const path = require('path');

// Funkcja do pobierania z użyciem fetch (Node.js 18+)
async function fetchData(url) {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Konfiguracja
const CONFIG = {
    worldName: process.env.WORLD_NAME || 'dream',
    playerThreshold: parseInt(process.env.PLAYER_THRESHOLD) || 7,
    discordWebhookUrl: 'https://discord.com/api/webhooks/1419060465803198494/jnxvyyAIXm3yJAQhScQQMrR_0AQHS4QTAyChV8ZNNTiM2V1DwB56tkT6e0l9OQgS5UI1',
    // Lista zescrapowanych graczy z klanów
    targetPlayers: {
        "conceited": "Ordinary Friends",
        "eirien": "Ordinary Friends",
        "xaventus": "Ordinary Friends",
        "sentyment": "Ordinary Friends",
        "unexpected": "Ordinary Friends",
        "prejudiced": "Ordinary Friends",
        "lord raval": "Ordinary Friends",
        "raval": "Ordinary Friends",
        // Dodaj tutaj więcej graczy których chcesz monitorować
        // "nazwaGracza": "NazwaKlanu"
    }
};

// Lista tytanów (skopiowana z oryginalnego skryptu)
const titanList = [
    {level: 64, name: "Orla/Kic"}, {level: 65, name: "Kic"}, {level: 83, name: "Kic"}, {level: 88, name: "Rene"},
    {level: 114, name: "Rene"}, {level: 120, name: "Arcy"}, {level: 144, name: "Arcy"}, {level: 164, name: "Zoons/Łowka"}, 
    {level: 167, name: "Zoons/Łowka"}, {level: 180, name: "Łowka"}, {level: 190, name: "Łowka"}, {level: 191, name: "Przyzy"}, 
    {level: 210, name: "Przyzy"}, {level: 217, name: "Przyzy"}, {level: 218, name: "Magua"}, {level: 244, name: "Magua"}, 
    {level: 245, name: "Teza"}, {level: 271, name: "Teza"}, {level: 272, name: "Barba/Tan"}, {level: 300, name: "Barba/Tan"}
];

// Emoji dla tytanów
const emojiMap = {
    'Orla/Kic': '🦅/🐰', 'Kic': '🐰', 'Rene': '⛓️', 'Arcy': '🔥', 'Zoons/Łowka': '🗡️/🏹',
    'Łowka': '🏹', 'Przyzy': '👹', 'Magua': '🐟', 'Teza': '⚡', 'Barba/Tan': '👑'
};

// Funkcje pomocnicze
function getTitanName(level) {
    for (let i = titanList.length - 1; i >= 0; i--) {
        if (level >= titanList[i].level) return titanList[i].name;
    }
    return '-';
}

function getTitanEmoji(name) {
    return emojiMap[name] || '';
}

function ensureDataDir() {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    return dataDir;
}

function getLastNotificationData() {
    const dataDir = ensureDataDir();
    const filePath = path.join(dataDir, 'last-notifications.json');
    
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (error) {
        console.error('Błąd odczytu danych powiadomień:', error);
    }
    
    return {};
}

function setLastNotificationData(data) {
    const dataDir = ensureDataDir();
    const filePath = path.join(dataDir, 'last-notifications.json');
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Błąd zapisu danych powiadomień:', error);
    }
}

// Funkcja wysyłania na Discord
async function sendDiscordNotification(titanName, targetPlayers) {
    if (!CONFIG.discordWebhookUrl) {
        console.error('Brak Discord Webhook URL');
        return false;
    }

    const titanEmoji = getTitanEmoji(titanName);
    const timestamp = new Date().toLocaleString('pl-PL');

    // Sortuj graczy według poziomu malejąco
    const sortedPlayers = targetPlayers.sort((a, b) => b.l - a.l);

    const playersList = sortedPlayers.map(p => {
        const clanName = CONFIG.targetPlayers[p.n.toLowerCase()] || 'Unknown';
        return `🗡️ **${p.n}** [${clanName}] - LvL ${p.l}`;
    }).join('\n');

    const embed = {
        title: `🚨 ALARM! ${titanEmoji} ${titanName} - ${targetPlayers.length} graczy z listy online!`,
        description: `Na przedziale **${titanName}** jest aktualnie **${targetPlayers.length} graczy** z listy targetowej (próg: ${CONFIG.playerThreshold})\n\n${playersList}`,
        color: 0xff6b35,
        footer: {
            text: `Margonem Target Players Monitor - ${CONFIG.worldName} • ${timestamp}`
        }
    };

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(CONFIG.discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Błąd wysyłania na Discord:', error);
        return false;
    }
}

// Główna funkcja sprawdzania graczy
async function checkPlayers() {
    console.log(`[${new Date().toISOString()}] Sprawdzanie graczy online...`);
    
    if (Object.keys(CONFIG.targetPlayers).length === 0) {
        console.error('Brak konfiguracji listy targetowych graczy');
        return;
    }

    try {
        const apiUrl = `https://public-api.margonem.pl/info/online/${CONFIG.worldName}.json`;
        console.log(`Pobieranie danych z: ${apiUrl}`);
        
        const players = await fetchData(apiUrl);
        
        if (!players || !Array.isArray(players)) {
            console.error('Nieprawidłowe dane z API');
            return;
        }

        console.log(`Znaleziono ${players.length} graczy online`);

        // Filtruj tylko zescrapowanych graczy z listy targetPlayers
        const targetPlayersOnline = players.filter(player => {
            return CONFIG.targetPlayers.hasOwnProperty(player.n.toLowerCase());
        });

        console.log(`Graczy z listy targetowych online: ${targetPlayersOnline.length}`);
        
        if (targetPlayersOnline.length > 0) {
            console.log('Znalezieni gracze:', targetPlayersOnline.map(p => {
                const clanName = CONFIG.targetPlayers[p.n.toLowerCase()];
                return `${p.n} [${clanName}] (${p.l})`;
            }).join(', '));
        }

        // Grupuj graczy według tytanów
        const titanGroups = {};
        targetPlayersOnline.forEach(player => {
            const titanName = getTitanName(player.l);
            if (titanName !== '-') {
                if (!titanGroups[titanName]) {
                    titanGroups[titanName] = [];
                }
                titanGroups[titanName].push(player);
            }
        });

        const lastNotificationData = getLastNotificationData();
        let hasNewNotifications = false;

        // Sprawdź każdy tytan
        for (const [titanName, titanPlayers] of Object.entries(titanGroups)) {
            const currentCount = titanPlayers.length;
            
            console.log(`${titanName}: ${currentCount} graczy z listy targetowej`);

            if (currentCount >= CONFIG.playerThreshold) {
                const now = Date.now();
                const lastNotification = lastNotificationData[titanName];

                // Wyślij powiadomienie jeśli nie wysłaliśmy w ciągu ostatnich 10 minut
                if (!lastNotification || (now - lastNotification.time) > 10 * 60 * 1000) {
                    console.log(`Wysyłanie powiadomienia dla ${titanName} (${currentCount} graczy z listy)`);
                    
                    const success = await sendDiscordNotification(titanName, titanPlayers);

                    if (success) {
                        lastNotificationData[titanName] = {
                            time: now,
                            count: currentCount
                        };
                        hasNewNotifications = true;
                        console.log(`✅ Powiadomienie dla ${titanName} wysłane pomyślnie`);
                    } else {
                        console.error(`❌ Błąd wysyłania powiadomienia dla ${titanName}`);
                    }
                } else {
                    const timeLeft = Math.ceil((10 * 60 * 1000 - (now - lastNotification.time)) / 60000);
                    console.log(`⏳ Ostatnie powiadomienie dla ${titanName} było za niedawno (${timeLeft} min do kolejnego)`);
                }
            }
        }

        // Zapisz dane powiadomień jeśli były zmiany
        if (hasNewNotifications) {
            setLastNotificationData(lastNotificationData);
        }

        console.log('✅ Sprawdzanie zakończone pomyślnie');

    } catch (error) {
        console.error('❌ Błąd podczas sprawdzania graczy:', error);
    }
}

// Uruchom główną funkcję
checkPlayers().then(() => {
    console.log('Monitoring zakończony');
    process.exit(0);
}).catch((error) => {
    console.error('Krytyczny błąd:', error);
    process.exit(1);
});
