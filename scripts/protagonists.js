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
        acc: 90,
        int: 10,
        wis: 10,
        luk: 15,
        element: "water",
        length: 1,
    },
    corelle: {
        name: "Corelle",
        maxEP: 5,
        maxHP: 14,
        strength: 3,
        agi: 80,
        acc: 85,
        int: 20,
        wis: 30,
        luk: 7,
        element: "fire",
        length: 1,
    },
    gau: {
        name: "Gau",
        maxEP: 2,
        maxHP: 8,
        strength: 7,
        agi: 40,
        acc: 85,
        int: 5,
        wis: 5,
        luk: 10,
        element: "physical",
        length: 1,
    },
    skro: {
        name: "Skro",
        maxEP: 8,
        maxHP: 16,
        strength: 12,
        agi: 36,
        acc: 90,
        int: 10,
        wis: 10,
        luk: 10,
        element: "physical",
        length: 3,
    },
    kokitozi: {
        name: "Kokitozi",
        maxEP: 20,
        maxHP: 7,
        strength: 4,
        agi: 36,
        acc: 90,
        int: 10,
        wis: 10,
        luk: 10,
        element: "dark",
        length: 3,
    }
}

// This function is used to get current stats of characters
// Stuff like Max HP, LUK, etc. are calculated based on base stat for the char, level, equipment etc.
// The game file itself (save.js) should only save non-static non-stats such as pos, effects, current HP, current EP
// Everything else, name, stats, here

function getStat(prot, stat) {
    if (typeof (prot) == "number") prot = characters[prot - 1]; // 1 = Bleu, etc. - like getPlayer()
    if (cStats[prot] == undefined) { // Pretty cool debug script. Error? Where! (It would normally not show where)
        console.trace();
        console.log([prot, stat]);
    }

    // Items (jfc)
    let itemBonus = 0;
    for (EQ in game.characters[prot].equipment) {
        if (game.characters[prot].equipment[EQ] != "none") if (items[game.characters[prot].equipment[EQ]]().stats[stat] != undefined) itemBonus += items[game.characters[prot].equipment[EQ]]().stats[stat];
    }

    if (stat == "strength") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.07 * game.characters[prot].level));
    if (stat == "maxHP") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.1 * game.characters[prot].level));
    if (stat == "maxEP") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.05 * game.characters[prot].level));
    if (stat == "agi") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * game.characters[prot].level));
    if (stat == "def") return 0; // Placeholder
    if (stat == "eva") return 10 + game.characters[prot].level; // Placeholder
    if (stat == "acc") return Math.min(200, Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * game.characters[prot].level)));
    if (stat == "int") return Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * game.characters[prot].level));
    if (stat == "wis") return Math.min(999, Math.round(itemBonus + cStats[prot][stat] * Math.pow(Math.log(game.characters[prot].level), 5)));
    if (stat == "luk") return Math.min(100, Math.round(itemBonus + cStats[prot][stat] * (1 + 0.005 * game.characters[prot].level)));
    return cStats[prot][stat];
}