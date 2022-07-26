// This is ALL protagonists in the game. Not only the ones you have equipped right now.
const characters = ["bleu", "corelle", "gau", "skro"];




// This is for constant stats - their base HP, element, etc.
const cStats = {
    bleu: {
        name: "Bleu",
        maxEP: 3,
        maxHP: 20,
        strength: 4,
        agi: 15,
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
        agi: 20,
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
        agi: 12,
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
        agi: 5,
        acc: 90,
        int: 10,
        wis: 10,
        luk: 10,
        element: "physical",
        length: 3,
    }
}

function getStat(prot, stat) {
    if (typeof (prot) == "number") prot = characters[prot - 1]; // 1 = Bleu, etc. - like getPlayer()
    if (cStats[prot] == undefined) { // Pretty cool debug script. Error? Where! (It would normally not show where)
        console.trace();
        console.log([prot, stat]);
    }
    if (stat == "strength") return Math.round(cStats[prot][stat] * (1.07 * game.characters[prot].level));
    if (stat == "maxHP") return Math.round(cStats[prot][stat] * (1.1 * game.characters[prot].level));
    // to do: EP
    // to do: agi
    // to do: acc
    // to do: int
    // to do: wis
    // to do: luk
    return cStats[prot][stat];
}