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
                //console.log("huhh????")
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

function getMapLevelRange(mmap = map) {
    if (mmap == undefined) mmap = maps[game.map];

    // if it's not defined, set range to 1 - 1
    if (mmap.levelRange == undefined || mmap.levelRange.length < 2) {
        mmap.levelRange = [1, 1];
    }

    mmap.levelRange[0] = parseInt(mmap.levelRange[0]);
    mmap.levelRange[1] = parseInt(mmap.levelRange[1]);

    return mmap.levelRange;
}

function getEnemyLevel(enemy) {
    if (enemyTypes[enemy] != undefined && enemyTypes[enemy].level != undefined) return enemyTypes[enemy].level; // you can have a fixed level
    // random level based on map's range
    return Math.min(50, Math.max(1, Math.ceil(Math.random() * (getMapLevelRange()[1] - getMapLevelRange()[0])) + getMapLevelRange()[0]));
    // also see: applyEnemyLevels comment
}

function exampleFight() {
    createEnemy("ent_weak");
    createEnemy("ent_weak");
    createEnemy("ent_weak");
}

let currentEnemies = [];