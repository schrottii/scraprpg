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

// All the enemies
let enemyTypes = {
    "weakhelter": {
        name: "Helter Skelter",
        HP: 5,
        strength: 2,
        eva: 0,
        acc: 80,
        agi: 30,
        luk: 3,
        element: "physical",
        items: ["potion", "brickyleaf", "peppytincture", "superswamp"],
    },

    "stronghelter": {
        name: "Helter Skelter+",
        HP: 9,
        strength: 2,
        eva: 0,
        acc: 80,
        agi: 25,
        luk: 3,
        element: "physical",
        items: "none",
    },

    "itsalive": {
        name: "It's Alive",
        HP: 20,
        strength: 3,
        eva: 20,
        acc: 80,
        agi: 10,
        luk: 3,
        element: "wind",
        items: ["potion"],
    },

    "livingbarrel": {
        name: "Living Barrel",
        HP: 20,
        strength: 8,
        eva: 5,
        acc: 90,
        agi: 23,
        luk: 30,
        element: "dark",
        items: "none",
        size: "2x2",
    },

    "nottoofresh": {
        name: "Not Too Fresh",
        HP: 40,
        strength: 11,
        eva: 20,
        acc: 60,
        agi: 80,
        luk: 20,
        element: "wind",
        items: "none",
    },
}

let currentEnemies = [];