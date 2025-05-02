let game = {
    // meta
    pfp: 1,
    time: 0,
    playTime: 0,

    // map stuff
    map: "test",
    position: [4, 4],

    // currencies
    wrenches: 0,
    bricks: 0,

    // your peoples
    chars: ["bleu", "corelle", "gau", "skro", "kokitozi"], // MAX 6!!!
    leader: "bleu",

    characters: {
        bleu: {
            name: "Bleu",
            level: 1,
            EXP: 0,
            EP: 3,
            HP: 22,
            effect: ["none", 0],
            pos: [0, 0],
            macro: "attack",
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            },
            magic: [],
        },
        corelle: {
            name: "Corelle",
            level: 1,
            EXP: 0,
            EP: 5,
            HP: 15,
            effect: ["none", 0],
            pos: [0, 1],
            macro: "attack",
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            },
            magic: [],
        },
        gau: {
            name: "Gau",
            level: 1,
            EXP: 0,
            EP: 2,
            HP: 8,
            effect: ["none", 0],
            pos: [2, 2],
            macro: "attack",
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            },
            magic: [],
        },
        skro: {
            name: "Skro",
            level: 1,
            EXP: 0,
            EP: 8,
            HP: 18,
            effect: ["none", 0],
            pos: [0, 1],
            macro: "attack",
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            },
            magic: [],
        },
        kokitozi: {
            name: "Kokitozi",
            level: 1,
            EXP: 0,
            EP: 20,
            HP: 8,
            effect: ["none", 0],
            pos: [2, 1],
            macro: "attack",
            equipment: {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
            },
            magic: [],
        }
    },


    inventory: {},

    shops: {},

    monsterbook: {}
}

let settings = {
    autosave: false,
    grid: true,
    particles: true,
    blend: true,
    glow: true,
    joystick: false,
    walkPadSize: 1,
    musicVolume: 0.5,
    soundVolume: 0.5
}

for (c in game.characters) {
    game.characters[c].HP = getStat(game.characters[c].name, "maxHP");
}