let game = {
    pfp: 1,
    map: "test",
    position: [4, 4],
    chars: ["bleu", "corelle", "gau", "skro"], // MAX 6!!!
    leader: "bleu",
    time: 0,
    wrenches: 0,
    bricks: 0,
    inventory: {},

    characters: {
        bleu: {
            name: "Bleu",
            level: 1,
            EXP: 0,
            EP: 3,
            maxEP: 3,
            maxHP: 20,
            HP: 20,
            strength: 4,
            agi: 15,
            acc: 90,
            effect: ["none", 0],
            pos: [0, 0],
        },
        corelle: {
            name: "Corelle",
            level: 1,
            EXP: 0,
            EP: 5,
            maxEP: 5,
            maxHP: 16,
            HP: 16,
            strength: 3,
            agi: 20,
            acc: 80,
            effect: ["none", 0],
            pos: [0, 1],
        },
        gau: {
            name: "Gau",
            level: 1,
            EXP: 0,
            EP: 2,
            maxEP: 2,
            maxHP: 8,
            HP: 8,
            strength: 6,
            agi: 12,
            acc: 80,
            effect: ["none", 0],
            pos: [2, 2],
        },
        skro: {
            name: "Skro",
            level: 1,
            EXP: 0,
            EP: 8,
            maxEP: 8,
            maxHP: 16,
            HP: 16,
            strength: 690,
            agi: 5,
            acc: 60,
            effect: ["none", 0],
            pos: [0, 1],
        }
    }
}

let settings = {
    autosave: false,
    grid: true,
    musicVolume: 0.5,
    soundVolume: 0.5
}