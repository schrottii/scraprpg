let game = {
    pfp: 1,
    map: "test",
    position: [4, 4],
    chars: ["bleu", "corelle", "gau", "skro", "kokitozi"], // MAX 6!!!
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
            HP: 20,
            agi: 15,
            acc: 90,
            effect: ["none", 0],
            pos: [0, 0],
            equipment: {
                "head" : "none",
                "body" : "none",
                "lhand" : "none",
                "rhand" : "none",
                "acc1" : "none",
                "acc2" : "none",
            }
        },
        corelle: {
            name: "Corelle",
            level: 1,
            EXP: 0,
            EP: 5,
            maxEP: 5,
            HP: 16,
            agi: 20,
            acc: 80,
            effect: ["none", 0],
            pos: [0, 1],
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            }
        },
        gau: {
            name: "Gau",
            level: 1,
            EXP: 0,
            EP: 2,
            maxEP: 2,
            HP: 8,
            agi: 12,
            acc: 80,
            effect: ["none", 0],
            pos: [2, 2],
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            }
        },
        skro: {
            name: "Skro",
            level: 1,
            EXP: 0,
            EP: 8,
            maxEP: 8,
            HP: 16,
            agi: 5,
            acc: 60,
            effect: ["none", 0],
            pos: [0, 1],
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            }
        },
        kokitozi: {
            name: "Kokitozi",
            level: 1,
            EXP: 0,
            EP: 20,
            maxEP: 20,
            HP: 8,
            agi: 36,
            acc: 90,
            effect: ["none", 0],
            pos: [2, 1],
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            }
        }
    }
}

let settings = {
    autosave: false,
    grid: true,
    musicVolume: 0.5,
    soundVolume: 0.5
}