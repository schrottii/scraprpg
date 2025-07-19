// This is for the enemies in-fight. For the map enemies, see map_enemies.js

// Function used to create enemies
function clearCurrentEnemies() {
    currentEnemies = [];
}

function createEnemy(type) {
    if (currentEnemies.length < 9) {
        let pox = Math.floor(Math.random() * 3);
        let poy = Math.floor(Math.random() * 3);
        if (enemyTypes[type].size != undefined) {
            let dup;
            if (enemyTypes[type].size == "2x2") {
                let ret = tryCreateAgain(pox, poy, true);
                dup = ret[2];
                pox = ret[0];
                poy = ret[1];
            }
            else {
                console.log("huhh????")
            }
            if (dup == 0) {
                currentEnemies.push([type, pox, poy, "2x2"]);
                currentEnemies.push(["child", pox + 1, poy]);
                currentEnemies.push(["child", pox, poy + 1]);
                currentEnemies.push(["child", pox + 1, poy + 1]);
            }
        }
        else {
            let dup;
            let ret = tryCreateAgain(pox, poy);

            dup = ret[2];
            pox = ret[0];
            poy = ret[1];

            if (dup == 0) {
                currentEnemies.push([type, pox, poy]);
            }
        }
    }
}

function tryCreateAgain(pox, poy, big = false) {
    for (i = 0; i < 25; i++) {
        dup = 0;
        for (e in currentEnemies) {
            if ((currentEnemies[e][1] == pox || (big && currentEnemies[e][1] == pox + 1)) && // goofy || aah
                (currentEnemies[e][2] == poy || (big && currentEnemies[e][2] == poy + 1))) {
                dup += 1;
            }
        }
        if (big && (pox == 2 || poy == 2)) dup += 1;
        if (dup > 0) {
            pox = Math.floor(Math.random() * 3);
            poy = Math.floor(Math.random() * 3);
        }
        else {
            return [pox, poy, dup];
        }
    }
    return [0, 0, 9999];
}

function exampleFight() {
    createEnemy("cocnutnut");
    createEnemy("ectoplasm_shadow");
    createEnemy("eldritch");
    createEnemy("water_shadow");
}

// All the enemies
let enemyTypes = {
    // DEFAULT
    "weakhelter": {
        name: "Helter Skelter", source: "weakhelter", element: "physical",
        HP: 5, strength: 2,
        eva: 0, acc: 80, agi: 30, luk: 3,
        items: { "potion": 25 },
    },

    // Forest / starter enemies
    "ent_weak": {
        name: "Weak Ent", source: "ent", element: "earth",
        HP: 4, strength: 4,
        eva: 10, acc: 60, agi: 20, luk: 0,
        items: { "headwood": 15, "bodywood": 15, "swordwood": 15, "shieldwood": 15 },
    },
    "evil_peter": {
        name: "Evil Peter", source: "evilpeter", element: "physical",
        HP: 6, strength: 2,
        eva: 20, acc: 50, agi: 66, luk: 20,
        items: "none",
    },
    "home_runner": {
        name: "Home Runner", source: "homerunner", element: "physical",
        HP: 12, strength: 3,
        eva: 0, acc: 70, agi: 50, luk: 10,
        items: { "baseballbat": 20, "shieldearth": 20 },
    },
    "slime_green": {
        name: "Green Slime", source: "slimegreen", element: "physical",
        HP: 8, strength: 4,
        eva: 0, acc: 80, agi: 24, luk: 0,
        items: { "headphysical": 5, "bodyphysical": 5, "swordphysical": 5, "shielphysical": 5 },
    },
    "postbox": {
        name: "Postbox", source: "postbox", element: "physical",
        HP: 15, strength: 2,
        eva: 0, acc: 80, agi: 26, luk: 0,
        items: { "spellbookearths": 1 },
    },
    "boss_slime_king": {
        size: "2x2",
        name: "Slime King", source: "slimegreen", element: "physical",
        HP: 100, strength: 5,
        eva: 0, acc: 70, agi: 16, luk: 0,
        items: { "spellbookphysicals": 100, "crystalluck": 100, "energydrink": 50, "smalldagger": 20, "throwable_daggers": 20 },
    },

    // Mountain (chapter 1)
    "futhark": {
        name: "Futhark", source: "futhark", element: "earth",
        HP: 16, strength: 6,
        eva: 0, acc: 80, agi: 10, luk: 10,
        items: { "potion": 25 },
    },
    "cloudon": {
        name: "Cloudon", source: "cloudon", element: "wind",
        HP: 8, strength: 2,
        eva: 20, acc: 80, agi: 50, luk: 10,
        items: { "angelwing": 5, "shieldwind": 10 },
    },
    "slime_wind": {
        name: "Wind Slime", source: "slimewind", element: "wind",
        HP: 16, strength: 5,
        eva: 10, acc: 80, agi: 32, luk: 0,
        items: { "headwind": 5, "bodywind": 5, "swordwind": 5, "shieldwind": 5 },
    },
    "lurid_layered": {
        name: "Lurid Layered", source: "luridlayered", element: "wind",
        HP: 12, strength: 3,
        eva: 20, acc: 80, agi: 19, luk: 0,
        items: { "spellbookwinds": 1 },
    },
    "itsalive": {
        name: "It's Alive", source: "itsalive", element: "wind",
        HP: 20, strength: 3,
        eva: 0, acc: 80, agi: 10, luk: 0,
        items: { "potion": 25 },
    },
    "zero_point": {
        name: "Zero Point", source: "zeropoint", element: "lightning",
        HP: 11, strength: 11,
        eva: 0, acc: 20, agi: 24, luk: 50,
        items: { "energydrink": 25, "headlightning": 5, "bodylightning": 5, "swordlightning": 5, "shieldlightning": 5 },
    },
    "boss_ooo_point": {
        size: "2x2",
        name: "OoO Point", source: "zeropoint", element: "lightning",
        HP: 100, strength: 100,
        eva: 0, acc: 10, agi: 18, luk: 30,
        items: { "spellbookwinds": 100, "crystalluck": 100, "mirrorevasion": 50, "energydrink_white": 10 },
    },

    // Another forest / town (chapter 2)
    "ent_medium": {
        name: "Medium Ent", source: "ent", element: "earth",
        HP: 20, strength: 6,
        eva: 10, acc: 70, agi: 20, luk: 0,
        items: { "headearth": 15, "bodyearth": 15, "swordearth": 15, "shieldearth": 15 },
    },
    "nottoofresh": {
        name: "Not Too Fresh", source: "nottoofresh", element: "wind",
        HP: 40, strength: 6,
        eva: 20, acc: 70, agi: 10, luk: 0,
        items: { "swordbanana": 3 },
    },
    "housoo": {
        name: "Housoo", source: "housoo", element: "physical",
        HP: 24, strength: 8,
        eva: 0, acc: 85, agi: 14, luk: 0,
        items: "none",
    },
    "stronghelter": {
        name: "Helter Skelter+", source: "weakhelter", element: "physical",
        HP: 20, strength: 6,
        eva: 0, acc: 80, agi: 30, luk: 12,
        items: { "potion": 25 },
    },
    "livingbarrel": { // night only
        name: "Living Barrel", source: "livingbarrel", element: "dark",
        HP: 120, strength: 20,
        eva: 50, acc: 100, agi: 60, luk: 50,
        items: "none",
    },

    // Cave (chapter 2)
    "slime_earth": {
        name: "Earth Slime", source: "slimeearth", element: "earth",
        HP: 24, strength: 5,
        eva: 0, acc: 80, agi: 24, luk: 0,
        items: { "headearth": 5, "bodyearth": 5, "swordearth": 5, "shieldearth": 5 },
    },
    "coal": {
        name: "Coal", source: "coal", element: "dark",
        HP: 40, strength: 3,
        eva: 20, acc: 70, agi: 10, luk: 0,
        items: { "headdark": 5, "bodydark": 5, "sworddark": 5, "shielddark": 5 },
    },
    "sloper": {
        name: "Sloper", source: "sloper", element: "earth",
        HP: 10, strength: 6,
        eva: 60, acc: 80, agi: 24, luk: 0,
        items: { "spellbookearths": 5 },
    },

    // Islands / water ruins (chapter 3)
    "slime_water": {
        name: "Water Slime", source: "slimewater", element: "water",
        HP: 40, strength: 7,
        eva: 0, acc: 80, agi: 24, luk: 0,
        items: { "headwater": 5, "bodywater": 5, "swordwater": 5, "shieldwater": 5 },
    },
    "cocnutnut": {
        name: "Cocnutnut", source: "cocnutnut", element: "water",
        HP: 20, strength: 4,
        eva: 0, acc: 80, agi: 18, luk: 10,
        items: { "tropicalmilkshake": 100 },
    },
    "rhapsody": {
        name: "Rhapsody", source: "rhapsody", element: "water",
        HP: 44, strength: 8,
        eva: 0, acc: 80, agi: 18, luk: 10,
        items: { "potionmedium": 25 },
    },
    "adose": {
        name: "A-Dose", source: "adose", element: "ectoplasm",
        HP: 42, strength: 12,
        eva: 10, acc: 70, agi: 21, luk: 30,
        items: { "headectoplasm": 5, "bodyectoplasm": 5, "swordectoplasm": 5, "shieldectoplasm": 5 },
    },

    // water ruins (chapter 3)
    "eldritch": {
        name: "Eldritch", source: "eldritch", element: "water",
        HP: 32, strength: 8,
        eva: 0, acc: 90, agi: 26, luk: 40,
        items: { "spellbookwaters": 5 },
    },
    "water_shadow": {
        name: "Water Shadow", source: "water_shadow", element: "water",
        HP: 26, strength: 7,
        eva: 30, acc: 80, agi: 40, luk: 20,
        items: { "swordwater": 10 },
    },
    "ectoplasm_shadow": {
        name: "Ectoplasm Shadow", source: "ectoplasm_shadow", element: "ectoplasm",
        HP: 36, strength: 20,
        eva: 30, acc: 60, agi: 38, luk: 16,
        items: { "swordectoplasm": 10, "spellbookectoplasms": 5, "headchemical": 5, "bodychemical": 5, "swordchemical": 5, "shieldchemical": 5 },
    },
    "shapeward": {
        name: "Shapeward", source: "shapeward", element: "water",
        HP: 33, strength: 10,
        eva: 20, acc: 80, agi: 30, luk: 0,
        items: { "potionmedium": 10 },
    },
    "boss_ectoxoxo": {
        size: "2x2",
        name: "Ectoxoxo", source: "ectoplasm_shadow", element: "ectoplasm",
        HP: 200, strength: 30,
        eva: 0, acc: 50, agi: 28, luk: 50,
        items: { "spellectoplasms": 100, "crystalcrit": 100, "swampbuddy": 50, "energydrink_white": 25 },
    },
}

let currentEnemies = [];