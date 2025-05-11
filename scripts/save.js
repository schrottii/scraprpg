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
    // gameplay
    autosave: false,
    difficulty: 1,

    // graphics
    grid: true,
    particles: true,
    blend: true,
    glow: true,

    // controls
    joystick: false,
    walkPadSize: 1,

    // audio
    musicVolume: 0.5,
    soundVolume: 0.5
}

for (c in game.characters) {
    game.characters[c].HP = getStat(game.characters[c].name, "maxHP");
}



// Functions
var saveNR = 0;

function load(x, altx) {
    return x !== undefined ? x : altx;
}

function saveGame(auto = false) {
    let saveCopy = JSON.parse(JSON.stringify(game));
    if (!auto) localStorage.setItem("SRPG" + saveNR, JSON.stringify(saveCopy));
    else localStorage.setItem("SRPG3", JSON.stringify(saveCopy));
}

function saveSettings() {
    let settingsCopy = JSON.parse(JSON.stringify(settings));
    localStorage.setItem("SRPGSETTINGS", JSON.stringify(settingsCopy));
}

function loadSettings() {
    // Load settings
    let settingsCopy;
    settingsCopy = localStorage.getItem("SRPGSETTINGS");
    if (settingsCopy !== null && settingsCopy !== "null") {
        try {
            settingsCopy = JSON.parse(settingsCopy);
        }

        catch (e) {
            alert("Error (Settings)");
            return;
        }
        for (i in settings) {
            if (settingsCopy[i] == undefined) settingsCopy[i] = settings[i];
        }
        settings = settingsCopy;
    }
}

function loadGame() {
    // Load saves
    let saveCopy;
    saveCopy = localStorage.getItem("SRPG" + saveNR);
    if (saveCopy !== null && saveCopy !== "null") {
        try {
            saveCopy = JSON.parse(saveCopy);
        }

        catch (e) {
            alert("Error");
            return;
        }

        if (saveCopy.characters == undefined) {
            saveCopy.characters = game.characters;
        }
        for (i in characters) {
            if (saveCopy.characters[characters[i]] == undefined) {
                saveCopy.characters[characters[i]] = game.characters[characters[i]];
            }
        }
        if (saveCopy.chars == undefined) saveCopy.chars = [saveCopy.char1, saveCopy.char2];
        if (saveCopy.characters.skro == undefined) saveCopy.characters.skro = game.characters.skro;
        if (saveCopy.chars.length == 2) saveCopy.chars.push("gau");
        if (saveCopy.chars.length == 3) saveCopy.chars.push("skro");
        if (saveCopy.chars.length == 4) saveCopy.chars.push("kokitozi");
        if (saveCopy.characters.bleu.pos == undefined) {
            saveCopy.characters.bleu.pos = [0, 0];
            saveCopy.characters.corelle.pos = [0, 1];
            saveCopy.characters.gau.pos = [2, 2];
            saveCopy.characters.koki.pos = [2, 1];
        }
        for (i in saveCopy.characters) {
            saveCopy.characters[i].effect = ["none", 0];
        }
        if (saveCopy.time == undefined) saveCopy.time = 0;
        if (saveCopy.playTime == undefined) saveCopy.playTime = 0;
        if (saveCopy.leader == undefined) saveCopy.leader = "bleu";
        if (saveCopy.wrenches == undefined) saveCopy.wrenches = 0;
        if (saveCopy.bricks == undefined) saveCopy.bricks = 0;
        if (saveCopy.inventory == undefined) saveCopy.inventory = { "brickyleaf": 5, "potion": 3 };
        if (saveCopy.shops == undefined) saveCopy.shops = {};

        if (saveCopy.characters.bleu.equipment == undefined) {
            for (i in saveCopy.characters) {
                saveCopy.characters[i].equipment = {
                    "head": "none",
                    "body": "none",
                    "lhand": "none",
                    "rhand": "none",
                    "acc1": "none",
                    "acc2": "none",
                }
            }
        }

        if (saveCopy.characters.bleu.macro == undefined) {
            for (i in saveCopy.characters) {
                saveCopy.characters[i].macro = "attack";
            }
        }
        if (saveCopy.characters.bleu.magic == undefined) {
            for (i in saveCopy.characters) {
                saveCopy.characters[i].magic = [];
            }
        }

        // delete items that don't exist anymore
        for (let i in saveCopy.inventory){
            if (items[i] == undefined) delete saveCopy.inventory[i];
            i -= 1;
        }

        game = saveCopy;
        checkOverMax();
    }
    else {
        saveGame();
    }
}