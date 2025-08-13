// This is ALL protagonists in the game. Not only the ones you have equipped right now.
const characters = ["bleu", "corelle", "gau", "skro", "kokitozi", "docaspen"];

function getPlayer(character = 1, src = game) {
    if (character > characters.length || !isValid(src.characters[game.chars[character - 1]])) character = 1;
    return src.characters[game.chars[character - 1]];
}



// This is for constant stats - their base HP, element, etc.
const cStats = {
    bleu: {
        name: "Bleu",
        maxEP: 3,
        maxHP: 20,
        strength: 2,
        agi: 60,
        acc: 90,
        int: 40,
        wis: 30,
        luk: 30,
        element: "water",
        length: 1,
    },
    corelle: {
        name: "Corelle",
        maxEP: 6,
        maxHP: 16,
        strength: 1,
        agi: 70,
        acc: 90,
        int: 50,
        wis: 30,
        luk: 40,
        element: "fire",
        length: 1,
    },
    gau: {
        name: "Gau",
        maxEP: 2,
        maxHP: 16,
        strength: 4,
        agi: 40,
        acc: 100,
        int: 20,
        wis: 20,
        luk: 30,
        element: "physical",
        length: 1,
    },
    skro: {
        name: "Skro",
        maxEP: 8,
        maxHP: 10,
        strength: 6,
        agi: 15,
        acc: 75,
        int: 100,
        wis: 40,
        luk: 30,
        element: "physical",
        length: 2,
    },
    kokitozi: {
        name: "Kokitozi",
        maxEP: 20,
        maxHP: 8,
        strength: 2,
        agi: 42,
        acc: 85,
        int: 60,
        wis: 60,
        luk: 40,
        element: "dark",
        length: 3,
    },
    docaspen: {
        name: "DocAspen",
        maxEP: 16,
        maxHP: 20,
        strength: 2,
        agi: 20,
        acc: 90,
        int: 70,
        wis: 30,
        luk: 50,
        element: "light",
        length: 2,
    }
}

function addWrenches(amount = 0) {
    if (game.wrenches != undefined) {
        game.wrenches = Math.min(game.wrenches + amount, 999999999);
        game.stats.wrenches += amount;
        questProgress("wrenches", "");
    }
}

function addBricks(amount = 0) {
    // only from boss fights and enemies from the "Scorched Planet"(Scrap Planet after Platinschrott Volcano eruption)
    if (game.bricks != undefined) {
        game.bricks = Math.min(game.bricks + amount, 999999);
        game.stats.bricks += amount;
        questProgress("bricks", "");
    }
}

// EXP stuff
function calcEXP(prot, level = false){
    // affected by wisdom (WIS) and current lvl
    // leave level at false for current
    // you start at level 1, this is used to calc exp needed for next level (2 means 2 -> 3)
    // a lvl up resets your EXP
    prot = prot.toLowerCase();

    let protWIS = getStat(prot, "wis");
    let protLVL = level != false ? level : game.characters[prot].level;
    if (protLVL == undefined) protLVL = 1;

    return Math.floor((50 * Math.floor(Math.pow(protLVL, 1.0563))) / (1 + protWIS / 50));
}

function logAllEXP(prot){
    // debug only
    let cum = 0;

    for (let e = 1; e < 50; e++){
        cum += calcEXP(prot, e);
        console.log("LVL " + e + " -> " + (e + 1) + ": " + calcEXP(prot, e) + " (cum: " + cum + ")");
    }
}

function checkLevelUps() {
    for (i in game.chars) {
        let I = game.chars[i];
        while (game.characters[I].EXP >= calcEXP(I) && game.characters[I].level < 50) {
            game.characters[I].EXP -= calcEXP(I);
            game.characters[I].level += 1;

            game.characters[I].HP = getStat(I, "maxHP");
        }
    }
}

function causeEffect(i, effect, rounds) {
    // Immune?
    for (j in getPlayer(i + 1).equipment) {
        if (getPlayer(i + 1).equipment[j] != "none") {
            if (items[getPlayer(i + 1).equipment[j]]().stats.immune != undefined) {
                for (e in items[getPlayer(i + 1).equipment[j]]().stats.immune) {
                    if (items[getPlayer(i + 1).equipment[j]]().stats.immune[e] == effect) {
                        return false;
                    }
                }
            }
        }
    }

    // Not immune!
    getPlayer(i + 1).effect = [effect, rounds];
}

function checkOverMax() {
    for (i in game.characters) {
        game.characters[i].HP = Math.min(game.characters[i].HP, getStat(game.characters[i].name, "maxHP"));
        game.characters[i].EP = Math.min(game.characters[i].EP, getStat(game.characters[i].name, "maxEP"));
    }
}

function tempBuffAdd(char, stat, amount, dur){
    // looks like this: ["strength", 2, 999] -> x2 strength for rest of fight
    // they are cleared *before and after* a fight (no pre-fight stack exploiting lul)
    let hasBuff = -1;
    char = char.toLowerCase();

    for (let x in game.characters[char].buffs){
        if (game.characters[char].buffs[x][0] == stat) hasBuff = x;
    }

    if (hasBuff != -1){
        // you already have this kinda buff
        // set amount to what's higher, increase duration
        game.characters[char].buffs[hasBuff][1] = Math.max(game.characters[char].buffs[hasBuff][1], amount);
        game.characters[char].buffs[hasBuff][2] += dur;
    }
    else {
        // you don't have buff, give i
        game.characters[char].buffs.push([stat, amount, dur]);
    }
}

function tempBuffTick(char){
    // ticks ALL temp buffs by 1 round
    if (game.characters[char].buffs == []) return false;
    char = char.toLowerCase();

    for (let x in game.characters[char].buffs){
        game.characters[char].buffs[x][2] -= 1;
        if (game.characters[char].buffs[x][2] <= 0) {
            // buff is over!
            tempBuffRemove(char, game.characters[char].buffs[x][0]);
        }
    }
}

function tempBuffRemove(char, stat){
    // removes one temp buff
    if (game.characters[char].buffs == []) return false;
    char = char.toLowerCase();
    let index = -1;

    for (let x in game.characters[char].buffs){
        if (game.characters[char].buffs[x][0] == stat) index = x;
    }

    if (index != -1){
        game.characters[char].buffs.splice(index, 1);
    }
}

function tempBuffRemoveAll(char){
    char = char.toLowerCase();
    game.characters[char].buffs = [];
}

// This function is used to get current stats of characters
// Stuff like Max HP, LUK, etc. are calculated based on base stat for the char, level, equipment etc.
// The game file itself (save.js) should only save non-static non-stats such as pos, effects, current HP, current EP
// Everything else, name, stats, here

function getStat(prot, stat) {
    if (typeof (prot) == "number") prot = characters[prot - 1]; // 1 -> Bleu, etc. - like getPlayer()
    else prot = prot.toString().toLowerCase(); // Bleu -> bleu

    if (cStats[prot] == undefined) { // Pretty cool debug script. Error? Where! (It would normally not show where)
        console.trace();
        console.log([prot, stat]);
    }

    // include boosts from items, and temporary buffs
    let itemBonus = 0;
    for (EQ in game.characters[prot].equipment) {
        if (game.characters[prot].equipment[EQ] != "none") if (items[game.characters[prot].equipment[EQ]]().stats[stat] != undefined) itemBonus += items[game.characters[prot].equipment[EQ]]().stats[stat];
    }

    let tempBonus = 1;
    if (game.characters[prot].buffs == undefined) game.characters[prot].buffs = [];
    for (EQ in game.characters[prot].buffs) {
        if (game.characters[prot].buffs[EQ][0] == stat) tempBonus = game.characters[prot].buffs[EQ][1];
    }

    // le return
    let lvl = game.characters[prot].level - 1;

    if (stat == "strength") return Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.07 * lvl)));
    if (stat == "maxHP") return Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.1 * lvl)));
    if (stat == "maxEP") return Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.05 * lvl)));

    if (stat == "agi") return Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl)));
    if (stat == "acc") return Math.min(100, Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl))));
    if (stat == "int") return Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl)));
    if (stat == "wis") return Math.min(100, Math.round(tempBonus * (itemBonus + cStats[prot][stat] * Math.pow(Math.log(lvl + Math.E), 3))));
    if (stat == "luk") return Math.min(100, Math.round(tempBonus * (itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl))));

    if (stat == "def") return Math.round(tempBonus * (itemBonus + (0 + 0.5 * lvl)));
    if (stat == "eva") return Math.min(100, Math.round(tempBonus * (itemBonus + (3 + 0.2 * lvl))));
    if (stat == "crt") return Math.min(100, Math.round(tempBonus * (itemBonus + (3 + 0.2 * lvl))));

    return cStats[prot][stat];
}