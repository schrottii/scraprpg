let game = {
    pfp: 1,
    map: "test",
    position: [4, 4],
    chars: ["bleu", "corelle", "gau"], // MAX 6!!!

    characters: {
        bleu: {
            name: "Bleu",
//            unlocked: true,
            level: 1,
            EXP: 0,
            EP: 3,
            maxEP: 3,
            maxHP: 20,
            HP: 20,
            strength: 4,
            agi: 15,
            acc: 90,
            element: "water",
            effect: ["none", 0],
            pos: [0, 0],
//            inventory: {}
        },
        corelle: {
            name: "Corelle",
//            unlocked: true,
            level: 1,
            EXP: 0,
            EP: 5,
            maxEP: 5,
            maxHP: 16,
            HP: 16,
            strength: 3,
            agi: 20,
            acc: 80,
            element: "fire",
            effect: ["none", 0],
            pos: [0, 1],
//            inventory: {}
        },
        gau: {
            name: "Gau",
//            unlocked: true,
            level: 1,
            EXP: 0,
            EP: 2,
            maxEP: 2,
            maxHP: 8,
            HP: 8,
            strength: 6,
            agi: 12,
            acc: 80,
            element: "physical",
            effect: ["none", 0],
            pos: [2, 2],
//            inventory: {}
        }
    }
}

let settings = {
    grid: true,
    musicVolume: 0.5,
    soundVolume: 0.5
}