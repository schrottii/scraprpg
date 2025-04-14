// This is ALL protagonists in the game. Not only the ones you have equipped right now.
const characters = ["bleu", "corelle", "gau", "skro", "kokitozi"];




// This is for constant stats - their base HP, element, etc.
const cStats = {
    bleu: {
        name: "Bleu",
        maxEP: 3,
        maxHP: 20,
        strength: 4,
        agi: 60,
        acc: 80,
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
        strength: 2,
        agi: 70,
        acc: 80,
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
        strength: 7,
        agi: 40,
        acc: 90,
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
        strength: 12,
        agi: 15,
        acc: 70,
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
        strength: 4,
        agi: 42,
        acc: 80,
        int: 60,
        wis: 60,
        luk: 40,
        element: "dark",
        length: 3,
    }
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

    // include boosts from items
    let itemBonus = 0;
    for (EQ in game.characters[prot].equipment) {
        if (game.characters[prot].equipment[EQ] != "none") if (items[game.characters[prot].equipment[EQ]]().stats[stat] != undefined) itemBonus += items[game.characters[prot].equipment[EQ]]().stats[stat];
    }

    let lvl = game.characters[prot].level - 1;

    if (stat == "strength") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.07 * lvl));
    if (stat == "maxHP") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.1 * lvl));
    if (stat == "maxEP") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.05 * lvl));

    if (stat == "agi") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl));
    if (stat == "acc") return Math.min(100, Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl)));
    if (stat == "int") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl));
    if (stat == "wis") return Math.min(100, Math.round(itemBonus + cStats[prot][stat] * Math.pow(Math.log(lvl + Math.E), 3)));
    if (stat == "luk") return Math.min(100, Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * lvl)));

    if (stat == "def") return 0 + lvl; // Placeholder
    if (stat == "eva") return Math.round(10 + lvl / 5); // Placeholder
    if (stat == "crt") return Math.round(10 + lvl / 5); // Placeholder

    return cStats[prot][stat];
}