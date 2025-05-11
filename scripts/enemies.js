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
    createEnemy("weakhelter");
    createEnemy("ent_weak");
    createEnemy("evil_peter");
    createEnemy("home_runner");
    createEnemy("slime_green");
    createEnemy("postbox");
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
        eva: 10, acc: 50, agi: 66, luk: 20,
        items: "none",
    },

    "home_runner": {
        name: "Home Runner", source: "homerunner", element: "physical",
        HP: 12, strength: 3,
        eva: 0, acc: 70, agi: 50, luk: 10,
        items: { "baseballbat": 20 },
    },
    
    "slime_green": {
        name: "Green Slime", source: "slimegreen", element: "earth",
        HP: 8, strength: 4,
        eva: 0, acc: 80, agi: 24, luk: 0,
        items: { "headearth": 5, "bodyearth": 5, "swordearth": 5, "shieldearth": 5 },
    },

    "postbox": {
        name: "Postbox", source: "postbox", element: "physical",
        HP: 15, strength: 2,
        eva: 0, acc: 80, agi: 26, luk: 0,
        items: "none",
    },

    // OLDIES
    "stronghelter": {
        name: "Helter Skelter+", source: "weakhelter", element: "physical",
        HP: 9, strength: 2,
        eva: 0, acc: 80, agi: 25, luk: 3,
        items: "none",
    },

    "itsalive": {
        name: "It's Alive", source: "itsalive", element: "wind",
        HP: 20, strength: 3,
        eva: 20, acc: 80, agi: 10, luk: 3,
        items: { "potion": 25},
    },

    "livingbarrel": {
        name: "Living Barrel", source: "livingbarrel", element: "dark",
        HP: 20, strength: 8,
        eva: 5, acc: 90, agi: 23, luk: 30,
        items: "none",
        size: "2x2",
    },

    "nottoofresh": {
        name: "Not Too Fresh", source: "nottoofresh", element: "wind",
        HP: 40, strength: 11,
        eva: 20, acc: 60, agi: 80, luk: 20,
        items: "none",
    },
}

let currentEnemies = [];