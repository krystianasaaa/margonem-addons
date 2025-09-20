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
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    clanNames: process.env.CLAN_NAMES ? process.env.CLAN_NAMES.split(',').map(name => name.trim()) : []
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
async function sendDiscordNotification(titanName, clanPlayers) {
    if (!CONFIG.discordWebhookUrl) {
        console.error('Brak Discord Webhook URL');
        return false;
    }

    const titanEmoji = getTitanEmoji(titanName);
    const timestamp = new Date().toLocaleString('pl-PL');

    // Sortuj graczy według poziomu malejąco
    const sortedPlayers = clanPlayers.sort((a, b) => b.l - a.l);

    const playersList = sortedPlayers.map(p => {
        const clanTag = p.guild_tag ? `[${p.guild_tag}]` : '';
        return `🗡️ **${p.n}** ${clanTag} - LvL ${p.l}`;
    }).join('\n');

    const embed = {
        title: `🚨 ALARM! ${titanEmoji} ${titanName} - ${clanPlayers.length} graczy z klanów online!`,
        description: `Na przedziale **${titanName}** jest aktualnie **${clanPlayers.length} graczy** z monitorowanych klanów (próg: ${CONFIG.playerThreshold})\n\n${playersList}`,
        color: 0xff6b35,
        footer: {
            text: `Margonem Clan Monitor - ${CONFIG.worldName} • ${timestamp}`
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
    
    if (CONFIG.clanNames.length === 0) {
        console.error('Brak konfiguracji nazw klanów (CLAN_NAMES)');
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

        // Filtruj graczy z określonych klanów
        const clanPlayers = players.filter(player => {
            if (!player.guild_tag) return false;
            return CONFIG.clanNames.some(clanName => 
                player.guild_tag.toLowerCase().includes(clanName.toLowerCase()) ||
                clanName.toLowerCase().includes(player.guild_tag.toLowerCase())
            );
        });

        console.log(`Graczy z monitorowanych klanów: ${clanPlayers.length}`);

        // Grupuj graczy według tytanów
        const titanGroups = {};
        clanPlayers.forEach(player => {
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
            
            console.log(`${titanName}: ${currentCount} graczy z klanów`);

            if (currentCount >= CONFIG.playerThreshold) {
                const now = Date.now();
                const lastNotification = lastNotificationData[titanName];

                // Wyślij powiadomienie jeśli nie wysłaliśmy w ciągu ostatnich 10 minut
                if (!lastNotification || (now - lastNotification.time) > 10 * 60 * 1000) {
                    console.log(`Wys// monitor.js
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
    discordWebhookUrl: process.
