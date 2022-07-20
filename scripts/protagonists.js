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
        element: "water",
    },
    corelle: {
        name: "Corelle",
        maxEP: 5,
        maxHP: 14,
        strength: 3,
        agi: 20,
        acc: 85,
        element: "fire",
    },
    gau: {
        name: "Gau",
        maxEP: 2,
        maxHP: 8,
        strength: 7,
        agi: 12,
        acc: 85,
        element: "physical",
    },
    skro: {
        name: "Skro",
        maxEP: 8,
        maxHP: 16,
        strength: 690,
        agi: 5,
        acc: 90,
        element: "physical",
    }
}

function getStat(prot, stat) {
    return cStats[prot][stat];
}