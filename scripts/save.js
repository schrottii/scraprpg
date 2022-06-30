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
            acc: 70,
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
            acc: 50,
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
//            inventory: {}
        }
    }
}

let settings = {
    grid: true
}