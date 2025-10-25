(function() {
    'use strict';

    if (window.kamykiEnhancedRunning) {
        return;
    }
    window.kamykiEnhancedRunning = true;

// ===== KONFIGURACJA =====
const defaultTytani = {
    "189": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/dziewicza_orlica.gif" },
    "1746": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/zabojczy_krolik.gif" },
    "6949": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/renegat_baulus.gif" },
    "7060": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif" },
    "7477": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/titangoblin.gif" },
    "6477": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/lowcz-wspo-driady.gif" },
    "6476": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/przyz_demon_sekta.gif" },
    "7848": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/maddok_magua-1b.gif" },
    "5709": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif" },
    "3312": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/hebrehoth_smokoludzie.gif" },
    "2355": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/ice_king.gif" }
};

const defaultKolosy = {
    "3361": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/mamlambo_final2.gif" },
    "3883": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif" },
    "202": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif" },
    "2149": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif" },
    "2310": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif" },
    "4046": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/soploreki.gif" },
    "1387": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/soploreki.gif" },
    "4066": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif" },
    "3535": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif" },
    "1876": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wazka.gif" },
    "6052": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolkrucz.gif" },
    "4206": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif" },
    "1131": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif" },
    "4266": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif" },
    "3596": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif" },
    "4268": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif" },
    "3037": { enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif" }
};

const defaultE2List = [
    { id: "580", name: "Mushita", lvl: 23, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/st-puma.gif" },
    { id: "632", name: "Kotołak Tropiciel", lvl: 27, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e1/kotolak_lowca.gif" },
    { id: "5738", name: "Shae Phu", lvl: 30, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif" },
    { id: "2532", name: "Zorg Jednooki Baron", lvl: 33, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-e2-zorg.gif" },
    { id: "727", name: "Władca rzek", lvl: 37, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif" },
    { id: "3149", name: "Gobbos", lvl: 40, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif" },
    { id: "4157", name: "Tyrtajos", lvl: 42, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dzik.gif" },
    { id: "5293", name: "Tollok Shimger", lvl: 47, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_shimger.gif" },
    { id: "2308", name: "Szczęt alias Gładki", lvl: 47, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-szczet.gif" },
    { id: "177", name: "Agar", lvl: 51, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif" },
    { id: "125", name: "Razuglag Oklash", lvl: 51, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/razuglag.gif" },
    { id: "2729", name: "Foverk Turrim", lvl: 57, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kobold07.gif" },
    { id: "5395", name: "Owadzia Matka", lvl: 58, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zadlak-e2-owadzia-matka.gif" },
    { id: "333", name: "Vari Kruger", lvl: 65, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll11.gif" },
    { id: "3437", name: "Furruk Kozug", lvl: 66, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll12.gif" },
    { id: "6537", name: "Jotun", lvl: 70, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kam_olbrzym-b.gif" },
    { id: "6633", name: "Tollok Utumutu", lvl: 73, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_utumatu.gif" },
    { id: "6632", name: "Tollok Atamatu", lvl: 73, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_atamatu.gif" },
    { id: "6625", name: "Lisz", lvl: 75, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lisz_demilisze.gif" },
    { id: "6623", name: "Grabarz świątynny", lvl: 80, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nieu_mnich_grabarz.gif" },
    { id: "3530", name: "Wielka Stopa", lvl: 82, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wlochacze_wielka_stopa.gif" },
    { id: "6615", name: "Podły zbrojmistrz", lvl: 82, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/magaz_zbrojmistrz.gif" },
    { id: "6634", name: "Choukker", lvl: 84, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif" },
    { id: "6772", name: "Nadzorczyni krasnoludów", lvl: 88, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nadzorczyni_krasnoludow.gif" },
    { id: "6773", name: "Morthen", lvl: 89, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krasnolud_boss.gif" },
    { id: "1325", name: "Leśne Widmo", lvl: 92, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif" },
    { id: "3466", name: "Żelazoręki Ohydziarz", lvl: 92, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ugrape2.gif" },
    { id: "1151", name: "Goplana", lvl: 93, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goplana.gif" },
    { id: "6781", name: "Gnom Figlid", lvl: 96, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnom_figlid.gif" },
    { id: "3765", name: "Centaur Zyfryd", lvl: 99, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cent-zyfryd.gif" },
    { id: "4998", name: "Kambion", lvl: 101, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kambion.gif" },
    { id: "6938", name: "Jertek Moxos", lvl: 105, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/moloch-jertek.gif" },
    { id: "6944", name: "Miłośnik rycerzy", lvl: 108, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_rycerzy.gif" },
    { id: "6946", name: "Miłośnik magii", lvl: 108, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_magii.gif" },
    { id: "6945", name: "Miłośnik łowców", lvl: 108, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_lowcow.gif" },
    { id: "7066", name: "Łowca czaszek", lvl: 112, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/alghul-czaszka-1a.gif" },
    { id: "7069", name: "Ozirus Władca Hieroglifów", lvl: 115, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mumia-ozirus.gif" },
    { id: "7357", name: "Morski potwór", lvl: 118, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/osmiornica-1b.gif" },
    { id: "7370", name: "Krab pustelnik", lvl: 124, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif" },
    { id: "7368", name: "Borgoros Garamir III", lvl: 124, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ingotia_minotaur-7a.gif" },
    { id: "7375", name: "Stworzyciel", lvl: 125, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/stworzyciel.gif" },
    { id: "7057", name: "Ifryt", lvl: 128, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/magradit_ifryt.gif" },
    { id: "3409", name: "Młody Jack Truciciel", lvl: 131, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat01.gif" },
    { id: "1527", name: "Helga Opiekunka Rumu", lvl: 131, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat-2b.gif" },
    { id: "1526", name: "Henry Kaprawe Oko", lvl: 131, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e1/pirat5b.gif" },
    { id: "7352", name: "Eol", lvl: 135, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/piaskowy_potwor-6a.gif" },
    { id: "6956", name: "Grubber Ochlaj", lvl: 136, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif" },
    { id: "7466", name: "Mistrz Worundriel", lvl: 139, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/worundriel02.gif" },
    { id: "7340", name: "Wójt Fistuła", lvl: 144, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-wojt-fistula.gif" },
    { id: "7338", name: "Teściowa Rumcajsa", lvl: 145, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-tesciowa-rumcajsa.gif" },
    { id: "7454", name: "Berserker Amuno", lvl: 148, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/amuno.gif" },
    { id: "7441", name: "Fodug Zolash", lvl: 150, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/fodug_zolash.gif" },
    { id: "7474", name: "Goons Asterus", lvl: 154, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goons_asterus-1a.gif" },
    { id: "1322", name: "Adariel", lvl: 155, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri_adariel.gif" },
    { id: "5856", name: "Burkog Lorulk", lvl: 160, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif" },
    { id: "5851", name: "Sheba Orcza Szamanka", lvl: 160, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/r_orc_sheba.gif" },
    { id: "5872", name: "Duch Władcy Klanów", lvl: 165, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/duch_wladcy_kl.gif" },
    { id: "5861", name: "Bragarth Myśliwy Dusz", lvl: 170, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_low_elita.gif" },
    { id: "5862", name: "Lusgrathera Królowa Pramatka", lvl: 175, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/prakrolowa.gif" },
    { id: "7345", name: "Królowa Śniegu", lvl: 175, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolowa-sniegu.gif" },
    { id: "6055", name: "Wrzosera", lvl: 177, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia-1a.gif" },
    { id: "7693", name: "Ogr Stalowy Pazur", lvl: 183, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_stalowy_pazur-1a.gif" },
    { id: "6053", name: "Torunia Ankelwald", lvl: 186, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/thuz-patr1.gif" },
    { id: "4185", name: "Pięknotka Mięsożerna", lvl: 189, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zmutowana-roslinka.gif" },
    { id: "2063", name: "Breheret Żelazny Łeb", lvl: 192, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/draki-breheret-1b.gif" },
    { id: "7689", name: "Cerasus", lvl: 193, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cerasus-1a.gif" },
    { id: "7701", name: "Mysiur Myświórowy Król", lvl: 197, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mysiur_myswiorowy_krol-1a.gif" },
    { id: "5940", name: "Sadolia Nadzorczyni Hurys", lvl: 200, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sadolia.gif" },
    { id: "7694", name: "Sataniel Skrytobójca", lvl: 204, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sataniel.gif" },
    { id: "5945", name: "Bergermona Krwawa Hrabina", lvl: 204, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-bergermona.gif" },
    { id: "5941", name: "Annaniel Wysysacz Marzeń", lvl: 204, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-gothardus.gif" },
    { id: "5943", name: "Zufulus Smakosz Serc", lvl: 205, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-zufulus.gif" },
    { id: "1912", name: "Czempion Furboli", lvl: 210, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/forbol03.gif" },
    { id: "1159", name: "Arachniregina Colosseus", lvl: 214, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/regina-e2.gif" },
    { id: "7859", name: "Al'diphrin Ilythirahel", lvl: 218, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/drow-aldiphrin-wladca.gif" },
    { id: "7864", name: "Marlloth Malignitas", lvl: 220, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/drider-marlloth.gif" },
    { id: "7827", name: "Arytodam olbrzymi", lvl: 226, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/arytodam_olbrzymi-1b.gif" },
    { id: "7843", name: "Mocny Maddoks", lvl: 231, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mocny_maddoks-1b.gif" },
    { id: "3627", name: "Silvanasus", lvl: 235, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/silvanasus.gif" },
    { id: "3610", name: "Dendroculus", lvl: 240, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dendroculus.gif" },
    { id: "5657", name: "Tolypeutes", lvl: 245, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bolita.gif" },
    { id: "1901", name: "Cuaitl Citlalin", lvl: 250, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/maho-cuaitl.gif" },
    { id: "4057", name: "Pogardliwa Sybilla", lvl: 255, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri2_witch_e2.gif" },
    { id: "5694", name: "Yaotl", lvl: 258, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif" },
    { id: "5685", name: "Quetzalcoatl", lvl: 260, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/quetzalcoatl.gif" },
    { id: "3035", name: "Chopesz", lvl: 267, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chopesh2.gif" },
    { id: "3039", name: "Neferkar Set", lvl: 274, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/szkiel_set.gif" },
    { id: "3327", name: "Terrozaur", lvl: 280, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/terrorzaur_pus.gif" },
    { id: "3340", name: "Vaenra Charkhaam", lvl: 280, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smoczyca.gif" },
    { id: "3341", name: "Chaegd Agnrakh", lvl: 280, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smokoszef.gif" },
    { id: "6065", name: "Nymphemonia", lvl: 287, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif" },
    { id: "2353", name: "Artenius", lvl: 300, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu03.gif" },
    { id: "2356", name: "Furion", lvl: 300, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu02.gif" },
    { id: "2354", name: "Zorin", lvl: 300, enabled: true, url: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu01.gif" }
];

// Konwersja listy do obiektu dla kompatybilności
const defaultE2 = Object.fromEntries(
    defaultE2List.map(boss => [boss.id, { enabled: boss.enabled, url: boss.url }])
);

function loadConfig() {
    const savedTytani = localStorage.getItem('kamykiTytani');
    const savedKolosy = localStorage.getItem('kamykiKolosy');
    const savedE2 = localStorage.getItem('kamykiE2');



    // Merguj zapisane dane z defaultami (aby dodać nowe bossów bez resetowania starych ustawień)
    function mergeWithDefaults(saved, defaults) {
        if (!saved) return { ...defaults };

        const parsed = JSON.parse(saved);
        const merged = { ...defaults };

        // Nadpisz wartościami z localStorage (zachowaj ustawienia użytkownika)
        Object.keys(parsed).forEach(id => {
            if (merged[id]) {
                merged[id] = { ...merged[id], ...parsed[id] };
            }
        });

        // Dodaj nowe wpisy z defaults, które nie były w localStorage
        Object.keys(defaults).forEach(id => {
            if (!parsed[id]) {
                merged[id] = { ...defaults[id] };
            }
        });

        return merged;
    }

    const loadedConfig = {
        enabled: localStorage.getItem('kamykiEnabled') !== 'false',

        tytaniEnabled: localStorage.getItem('kamykiTytaniEnabled') !== 'false',
        tytani: mergeWithDefaults(savedTytani, defaultTytani),

        kolosyEnabled: localStorage.getItem('kamykiKolosyEnabled') !== 'false',
        kolosy: mergeWithDefaults(savedKolosy, defaultKolosy),

        e2Enabled: localStorage.getItem('kamykiE2Enabled') !== 'false',
        e2: mergeWithDefaults(savedE2, defaultE2)
    };



    return loadedConfig;
}

let config = loadConfig();

function saveConfig() {


    try {
        localStorage.setItem('kamykiEnabled', config.enabled.toString());
        localStorage.setItem('kamykiTytaniEnabled', config.tytaniEnabled.toString());
        localStorage.setItem('kamykiKolosyEnabled', config.kolosyEnabled.toString());
        localStorage.setItem('kamykiE2Enabled', config.e2Enabled.toString());
        localStorage.setItem('kamykiTytani', JSON.stringify(config.tytani));
        localStorage.setItem('kamykiKolosy', JSON.stringify(config.kolosy));
        localStorage.setItem('kamykiE2', JSON.stringify(config.e2));


    } catch (error) {
        console.error('❌ Błąd zapisu do localStorage:', error);
    }
}

    // ===== STYLE CSS =====
    const styles = `
        .kamyki-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            pointer-events: none;
        }

        .kamyki-dialog {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 0;
            width: 600px;
            max-width: 90vw;
            max-height: 90vh;
            color: #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            pointer-events: all;
        }

        .kamyki-header {
            background: #333;
            padding: 15px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #444;
            flex-shrink: 0;
        }

        .kamyki-header h3 {
            margin: 0;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            flex: 1;
        }

        .kamyki-close {
            background: none;
            border: none;
            color: #888;
            font-size: 20px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            padding: 0;
        }

        .kamyki-close:hover {
            color: #fff;
        }

        .kamyki-tabs {
            display: flex;
            background: #1a1a1a;
            border-bottom: 1px solid #444;
            flex-shrink: 0;
        }

        .kamyki-tab {
            flex: 1;
            padding: 12px;
            background: #1a1a1a;
            border: none;
            border-bottom: 2px solid transparent;
            color: #888;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .kamyki-tab:hover {
            background: #252525;
            color: #ccc;
        }

        .kamyki-tab.active {
            background: #2a2a2a;
            color: #5865F2;
            border-bottom-color: #5865F2;
        }

        .kamyki-content {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .kamyki-tab-content {
            display: none;
            padding: 15px;
            height: 100%;
            overflow-y: auto;
        }

        .kamyki-tab-content.active {
            display: block;
        }

        .kamyki-tab-content::-webkit-scrollbar {
            width: 8px;
        }

        .kamyki-tab-content::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .kamyki-tab-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        .kamyki-tab-content::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .kamyki-section {
            margin-bottom: 15px;
        }

        .kamyki-section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            padding: 8px;
            background: #333;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
        }

        .kamyki-section-header:hover {
            background: #3a3a3a;
        }

        .kamyki-section-toggle {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #555;
            border-radius: 3px;
            background: #2a2a2a;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
        }

        .kamyki-section-toggle:hover {
            border-color: #4CAF50;
        }

        .kamyki-section-toggle:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .kamyki-section-toggle:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .kamyki-section-title {
            color: #fff;
            font-weight: bold;
            font-size: 13px;
        }

        .kamyki-items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px;
            padding-left: 26px;
        }

        .kamyki-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 3px;
            transition: background 0.2s;
        }

        .kamyki-item:hover {
            background: #3a3a3a;
        }

        .kamyki-item-checkbox {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border: 2px solid #555;
            border-radius: 3px;
            background: #2a2a2a;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .kamyki-item-checkbox:hover {
            border-color: #4CAF50;
        }

        .kamyki-item-checkbox:checked {
            background: #4CAF50;
            border-color: #4CAF50;
        }

        .kamyki-item-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }

        .kamyki-item-label {
            color: #ccc;
            font-size: 12px;
            flex: 1;
        }

        .kamyki-buttons {
            display: flex;
            gap: 8px;
            padding: 12px 15px;
            background: #2a2a2a;
            border-radius: 0 0 4px 4px;
            border-top: 1px solid #444;
            flex-shrink: 0;
        }

        .kamyki-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: background 0.2s;
            flex: 1;
        }

        .kamyki-btn-primary {
            background: #5865F2;
            color: white;
        }

        .kamyki-btn-primary:hover {
            background: #4752C4;
        }

        .kamyki-btn-secondary {
            background: #4e4e4e;
            color: white;
        }

        .kamyki-btn-secondary:hover {
            background: #5a5a5a;
        }

        .kamyki-btn-success {
            background: #3BA55D;
            color: white;
        }

        .kamyki-btn-success:hover {
            background: #2D7D46;
        }

        .kamyki-btn-reset {
            background: #ED4245;
            color: white;
        }

        .kamyki-btn-reset:hover {
            background: #C03537;
        }

        .kamyki-description {
            font-size: 11px;
            color: #888;
            padding: 10px;
            background: #1a1a1a;
            border-radius: 3px;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .priw8-item-small-icon img:not(.priw8-item-overlay) {
            width: 20px;
            height: 20px;
            top: 12px;
            z-index: 1;
        }

        .priw8-item-small-icon canvas.canvas-icon {
            width: 20px;
            height: 20px;
            top: 12px;
            z-index: 1;
        }

        .priw8-item-small-icon .amount, .priw8-item-small-icon .cooldown {
            z-index: 2;
        }

        .priw8-item-overlay {
            display: block;
        }
    `;

    // ===== DANE BOSS ÓW =====
    const bossData = {
        tytani: {
            "189": "Dziewicza Orlica",
            "1746": "Zabójczy królik",
            "6949": "Renegat Baulus",
            "7060": "Piekielny Arcymag",
            "7477": "Versus Zoons",
            "6477": "Łowczyni Wspomnień",
            "6476": "Przyzywacz Demonów",
            "7848": "Maddok Magua",
            "5709": "Tezcatlipoca",
            "3312": "Barbatos Smoczy Strażnik",
            "2355": "Tanroth"
        },
        kolosy: {
            "3361": "Mamlambo (36lvl)",
            "3883": "Regulus Mętnooki (63lvl)",
            "202": "Regulus Mętnooki (63lvl) ALT",
            "2149": "Umibozu (114lvl)",
            "2310": "Umibozu (114lvl) ALT",
            "4046": "Amaimon Soploręki (83lvl)",
            "1387": "Amaimon Soploręki (83lvl) ALT",
            "4066": "Hydrokora Chimeryczna (167lvl)",
            "3535": "Hydrokora Chimeryczna (167lvl) ALT",
            "1876": "Vashkar (144lvl)",
            "6052": "Lulukav (190lvl)",
            "4206": "Arachin Podstępny (213lvl)",
            "1131": "Arachin Podstępny (213lvl) ALT",
            "4266": "Reuzen (252lvl)",
            "3596": "Reuzen (252lvl) ALT",
            "4268": "Wernoradzki Drakolisz (279lvl)",
            "3037": "Wernoradzki Drakolisz (279lvl) ALT"
        },
e2: Object.fromEntries(
            defaultE2List.map(boss => [boss.id, `${boss.name} (${boss.lvl}lvl)`])
        )
    };

    // ===== FUNKCJE POWIADOMIEŃ =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== LOGIKA OVERLAY =====
    const NI = typeof window.Engine != "undefined";

    function loadItemImage(url) {
        const $newImg = document.createElement("img");
        $newImg.src = url;
        $newImg.classList.add("priw8-item-overlay");
        return new Promise(resolve => {
            $newImg.addEventListener("load", () => {
                let w = $newImg.width, h = $newImg.height;
                if (h > 32) {
                    w = w * (32 / h);
                    h = 32;
                }
                if (w > 32) {
                    h = h * (32 / w);
                    w = 32;
                }
                const offset = (32 - w) / 2;
                $newImg.width = w;
                $newImg.height = h;
                $newImg.style.left = `${offset}px`;
                $newImg.style.display = "block";
                resolve($newImg);
            });
        });
    }

async function appendItemOverlay(id, url) {
    if (NI) {
        const $it = document.querySelector(`.item-id-${id}`);
        if ($it) {
            $it.classList.add("priw8-item-small-icon");
            const $newImg = await loadItemImage(url);
            $newImg.style.position = "absolute";
            $newImg.style.zIndex = "1";
            const $canv = $it.querySelector("canvas");
            if ($canv && $canv.parentElement) {
                $canv.parentElement.appendChild($newImg);
            }
        }
    } else {
        g.loadQueue.push({
            fun: async () => {
                const $it = document.querySelector(`#item${id}`);
                if ($it) {
                    $it.classList.add("priw8-item-small-icon");
                    const $newImg = await loadItemImage(url);
                    const $img = $it.querySelector("img");
                    if ($img) {
                        $img.parentElement.appendChild($newImg);
                    }
                }
            }
        });
    }
}
function onItem(items) {
    for (const id in items) {
        const it = items[id];
        const tp = getItemTp(it);
        const tpMap = getTpMap(tp);

        let entry = null;

        // Sprawdź tytani
        if (config.tytaniEnabled) {
            if (config.tytani[tp] && config.tytani[tp].enabled) {
                entry = config.tytani[tp].url;
            }
            if (!entry && config.tytani[tpMap] && config.tytani[tpMap].enabled) {
                entry = config.tytani[tpMap].url;
            }
        }

        // Sprawdź kolosy
        if (!entry && config.kolosyEnabled) {
            if (config.kolosy[tp] && config.kolosy[tp].enabled) {
                entry = config.kolosy[tp].url;
            }
            if (!entry && config.kolosy[tpMap] && config.kolosy[tpMap].enabled) {
                entry = config.kolosy[tpMap].url;
            }
        }

        // Sprawdź e2
        if (!entry && config.e2Enabled) {
            if (config.e2[tp] && config.e2[tp].enabled) {
                entry = config.e2[tp].url;
            }
            if (!entry && config.e2[tpMap] && config.e2[tpMap].enabled) {
                entry = config.e2[tpMap].url;
            }
        }

        if (entry) {
            appendItemOverlay(id, entry);
        }
    }
}

    function parseStats(stats) {
        if (!stats) return {};
        const spl = stats.split(";");
        const res = {};
        for (const entry of spl) {
            const pair = entry.split("=");
            res[pair[0]] = pair[1] ?? "true";
        }
        return res;
    }

    function getItemStats(it) {
        return it._cachedStats ?? parseStats(it.stat);
    }

    function getItemTp(it) {
        const stats = getItemStats(it);
        if (stats.teleport || stats.custom_teleport && stats.custom_teleport != "true") {
            return stats.teleport ?? stats.custom_teleport;
        }
        return "";
    }

    function getTpMap(tp) {
        return tp.split(",")[0];
    }

    // ===== OKNO USTAWIEŃ =====
    function showSettingsDialog() {
        const existingModal = document.querySelector('.kamyki-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'kamyki-modal';

        modal.innerHTML = `
            <div class="kamyki-dialog">
                <div class="kamyki-header" id="kamyki-header">
                    <h3>Kamyki - Ustawienia</h3>
                    <button class="kamyki-close" id="kamyki-close">×</button>
                </div>

                <div class="kamyki-tabs">
                    <button class="kamyki-tab active" data-tab="tytani">Tytani</button>
                    <button class="kamyki-tab" data-tab="kolosy">Kolosy</button>
                    <button class="kamyki-tab" data-tab="e2">E2</button>
                </div>

                <div class="kamyki-content">
                    <!-- TYTANI -->
                    <div class="kamyki-tab-content active" data-tab="tytani">
                        <div class="kamyki-description">
                            Włącz lub wyłącz grafiki dla kamieni teleportacji do Tytanów
                        </div>
                        <div class="kamyki-section">
                            <div class="kamyki-section-header" id="tytani-header">
                                <input type="checkbox" class="kamyki-section-toggle" id="tytani-toggle" ${config.tytaniEnabled ? 'checked' : ''}>
                                <span class="kamyki-section-title">Wszystkie Tytani</span>
                            </div>
                            <div class="kamyki-items-grid" id="tytani-items">
                                ${Object.entries(bossData.tytani).map(([id, name]) => `
                                    <div class="kamyki-item">
                                        <input type="checkbox" class="kamyki-item-checkbox" data-category="tytani" data-id="${id}" ${config.tytani[id]?.enabled ? 'checked' : ''}>
                                        <span class="kamyki-item-label">${name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- KOLOSY -->
                    <div class="kamyki-tab-content" data-tab="kolosy">
                        <div class="kamyki-description">
                            Włącz lub wyłącz grafiki dla kamieni teleportacji do Kolosów
                        </div>
                        <div class="kamyki-section">
                            <div class="kamyki-section-header" id="kolosy-header">
                                <input type="checkbox" class="kamyki-section-toggle" id="kolosy-toggle" ${config.kolosyEnabled ? 'checked' : ''}>
                                <span class="kamyki-section-title">Wszystkie Kolosy</span>
                            </div>
                            <div class="kamyki-items-grid" id="kolosy-items">
                                ${Object.entries(bossData.kolosy).map(([id, name]) => `
                                    <div class="kamyki-item">
                                        <input type="checkbox" class="kamyki-item-checkbox" data-category="kolosy" data-id="${id}" ${config.kolosy[id]?.enabled ? 'checked' : ''}>
                                        <span class="kamyki-item-label">${name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- E2 -->
                    <div class="kamyki-tab-content" data-tab="e2">
                        <div class="kamyki-description">
                            Włącz lub wyłącz grafiki dla kamieni teleportacji do bossów E2
                        </div>
                        <div class="kamyki-section">
                            <div class="kamyki-section-header" id="e2-header">
                                <input type="checkbox" class="kamyki-section-toggle" id="e2-toggle" ${config.e2Enabled ? 'checked' : ''}>
                                <span class="kamyki-section-title">Wszystkie E2</span>
                            </div>
<div class="kamyki-items-grid" id="e2-items">
    ${defaultE2List.map(boss => `
        <div class="kamyki-item">
            <input type="checkbox" class="kamyki-item-checkbox" data-category="e2" data-id="${boss.id}" ${config.e2[boss.id]?.enabled ? 'checked' : ''}>
            <span class="kamyki-item-label">${boss.name} (${boss.lvl}lvl)</span>
        </div>
    `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="kamyki-buttons">
                    <button class="kamyki-btn kamyki-btn-success" id="kamyki-enable-all">Włącz wszystkie</button>
                    <button class="kamyki-btn kamyki-btn-secondary" id="kamyki-disable-all">Wyłącz wszystkie</button>
                    <button class="kamyki-btn kamyki-btn-reset" id="kamyki-reset">Reset</button>
                    <button class="kamyki-btn kamyki-btn-primary" id="kamyki-save">Zapisz</button>
                </div>
            </div>
        `;

document.body.appendChild(modal);

        // Zapobiegaj przewijaniu tła podczas przewijania w dialogu
        const tabContents = modal.querySelectorAll('.kamyki-tab-content');
        tabContents.forEach(content => {
            content.addEventListener("wheel", e => e.stopPropagation());
        });


        // ===== PRZECIĄGANIE OKNA =====
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const dialog = modal.querySelector('.kamyki-dialog');
        const header = modal.querySelector('#kamyki-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - dialog.getBoundingClientRect().left;
            dragOffsetY = e.clientY - dialog.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - dialog.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - dialog.offsetHeight);
            dialog.style.position = 'fixed';
            dialog.style.left = `${x}px`;
            dialog.style.top = `${y}px`;
            dialog.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // ===== OBSŁUGA ZAKŁADEK =====
        const tabs = modal.querySelectorAll('.kamyki-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                const targetContent = modal.querySelector(`.kamyki-tab-content[data-tab="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
            saveConfig();
        });

        // ===== OBSŁUGA CHECKBOXÓW KATEGORII =====
        ['tytani', 'kolosy', 'e2'].forEach(category => {
            const toggle = document.getElementById(`${category}-toggle`);
            const items = document.querySelectorAll(`.kamyki-item-checkbox[data-category="${category}"]`);

            toggle.addEventListener('change', (e) => {
                const isEnabled = e.target.checked;
                config[`${category}Enabled`] = isEnabled;
                items.forEach(item => {
                    item.checked = isEnabled;
                    const id = item.getAttribute('data-id');
                    config[category][id].enabled = isEnabled;
                });
                saveConfig();
            });

            // Obsługa pojedynczych itemów
            items.forEach(item => {
                item.addEventListener('change', (e) => {
                    const id = item.getAttribute('data-id');
                    config[category][id].enabled = e.target.checked;

                    // Sprawdź czy wszystkie są zaznaczone/odznaczone
                    const allChecked = Array.from(items).every(i => i.checked);
                    const noneChecked = Array.from(items).every(i => !i.checked);

                    if (allChecked) {
                        toggle.checked = true;
                        config[`${category}Enabled`] = true;
                    } else if (noneChecked) {
                        toggle.checked = false;
                        config[`${category}Enabled`] = false;
                    }
                });
            });
        });

        // ===== PRZYCISKI =====
        document.getElementById('kamyki-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

document.getElementById('kamyki-enable-all').addEventListener('click', () => {
    // Najpierw wypełnij brakujące wpisy z defaultów
    Object.keys(defaultTytani).forEach(id => {
        if (!config.tytani[id]) {
            config.tytani[id] = { ...defaultTytani[id] };
        }
    });
    Object.keys(defaultKolosy).forEach(id => {
        if (!config.kolosy[id]) {
            config.kolosy[id] = { ...defaultKolosy[id] };
        }
    });
    Object.keys(defaultE2).forEach(id => {
        if (!config.e2[id]) {
            config.e2[id] = { ...defaultE2[id] };
        }
    });

    // Teraz włącz wszystkie
    ['tytani', 'kolosy', 'e2'].forEach(category => {
        config[`${category}Enabled`] = true;
        Object.keys(config[category]).forEach(id => {
            config[category][id].enabled = true;
        });
    });

    // Odśwież UI
    modal.querySelectorAll('.kamyki-section-toggle, .kamyki-item-checkbox').forEach(cb => {
        cb.checked = true;
    });

    saveConfig();
    showNotification('Wszystkie grafiki włączone', 'success');
});

document.getElementById('kamyki-disable-all').addEventListener('click', () => {
    // Najpierw wypełnij brakujące wpisy z defaultów
    Object.keys(defaultTytani).forEach(id => {
        if (!config.tytani[id]) {
            config.tytani[id] = { ...defaultTytani[id] };
        }
    });
    Object.keys(defaultKolosy).forEach(id => {
        if (!config.kolosy[id]) {
            config.kolosy[id] = { ...defaultKolosy[id] };
        }
    });
    Object.keys(defaultE2).forEach(id => {
        if (!config.e2[id]) {
            config.e2[id] = { ...defaultE2[id] };
        }
    });

    // Teraz wyłącz wszystkie
    ['tytani', 'kolosy', 'e2'].forEach(category => {
        config[`${category}Enabled`] = false;
        Object.keys(config[category]).forEach(id => {
            config[category][id].enabled = false;
        });
    });

    // Odśwież UI
    modal.querySelectorAll('.kamyki-section-toggle, .kamyki-item-checkbox').forEach(cb => {
        cb.checked = false;
    });

    saveConfig();
    showNotification('Wszystkie grafiki wyłączone', 'info');
});

document.getElementById('kamyki-reset').addEventListener('click', () => {
            if (!confirm('Czy na pewno chcesz przywrócić domyślne ustawienia?')) {
                return;
            }

            config.enabled = true;
            config.tytaniEnabled = true;
            config.kolosyEnabled = true;
            config.e2Enabled = true;

            ['tytani', 'kolosy', 'e2'].forEach(category => {
                Object.keys(config[category]).forEach(id => {
                    config[category][id].enabled = true;
                });
            });

            saveConfig();
            modal.remove();
            showSettingsDialog();
            showNotification('Ustawienia zresetowane', 'success');
        });

document.getElementById('kamyki-save').addEventListener('click', () => {
    saveConfig();
    showNotification('Ustawienia zapisane!', 'success');
    setTimeout(() => {
        location.reload();
    }, 500);
});
    }
    // ===== INTEGRACJA Z MANAGEREM =====
    function addManagerSettingsButton(container) {
        const helpIcon = container.querySelector('.kwak-addon-help-icon');
        if (!helpIcon) return;

        const settingsBtn = document.createElement('span');
        settingsBtn.id = 'kamyki-settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.style.cssText = `
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            margin-left: 2px;
            opacity: 0.7;
            transition: opacity 0.2s;
            display: inline-block;
        `;

        settingsBtn.onmouseover = () => settingsBtn.style.opacity = '1';
        settingsBtn.onmouseout = () => settingsBtn.style.opacity = '0.7';

        helpIcon.insertAdjacentElement('afterend', settingsBtn);

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettingsDialog();
        });
    }

    function integrateWithAddonManager() {
        const checkForManager = setInterval(() => {
            const addonContainer = document.getElementById('addon-custom_redstone');
            if (!addonContainer) return;

            if (addonContainer.querySelector('#kamyki-settings-btn')) {
                clearInterval(checkForManager);
                return;
            }

            let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
            if (addonNameContainer) {
                addManagerSettingsButton(addonNameContainer);
                clearInterval(checkForManager);
            }
        }, 500);

        setTimeout(() => clearInterval(checkForManager), 20000);
    }

    // ===== INICJALIZACJA =====
function init() {
    // Dodaj style CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles + `
        .priw8-item-overlay {
            display: block;
            position: absolute;
        }
    `;
    document.head.appendChild(styleSheet);

        // Hook do parseJSON/parseInput
        const org = NI ? window.Engine.communication.parseJSON : window.parseInput;
        const override = function(data) {
            const res = org.apply(this, arguments);
            if (data.item) {
                onItem(data.item);
            }
            return res;
        }

        if (NI)
            window.Engine.communication.parseJSON = override;
        else
            window.parseInput = override;

        // Integracja z managerem
        try {
            integrateWithAddonManager();
        } catch (error) {
            console.warn('Addon manager integration failed:', error);
        }
    }

    // Uruchom
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Helper dla listowania kamieni (console)
    window.listStones = function() {
        const NI = typeof window.Engine != "undefined";
        const getLocationItems = (loc) => {
            return NI ? Engine.items.fetchLocationItems(loc).map(it => it) : Object.values(g.item).filter(it => it.loc == loc);
        };

        getLocationItems("g").forEach(it => {
            const stats = getItemStats(it);
            const tp = getItemTp(it);
            if (tp != "") {
                const tpMap = getTpMap(tp);
            }
        });
    }

    // Animacja slideIn
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(animationStyle);

})();
