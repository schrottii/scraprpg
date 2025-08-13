let game = {
    // meta
    pfp: 1,
    time: 0,

    // map stuff
    map: "castleL2",
    position: [48, 14],

    // currencies
    wrenches: 0,
    bricks: 0,

    // stats
    stats: {
        playTime: 0,
        wrenches: 0,
        bricks: 0,
        walk: 0,
        tp: 0,
        fights: 0,
        fightsFled: 0,
        fightsLost: 0,
        fightsWon: 0,
        saves: 0,
        autoSaves: 0,
        opened: 0,
    },

    // your peoples
    chars: ["bleu"], // MAX 6!!!
    leader: "bleu",

    characters: {
        bleu: {
            name: "Bleu",
            level: 1,
            EXP: 0,
            EP: 3,
            HP: 22,
            effect: ["none", 0],
            pos: [1, 1],
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
            EP: 6,
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
        },
        kokitozi: {
            name: "Kokitozi",
            level: 1,
            EXP: 0,
            EP: 20,
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
        docaspen: {
            name: "DocAspen",
            level: 1,
            EXP: 0,
            EP: 16,
            HP: 20,
            effect: ["none", 0],
            pos: [0, 2],
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

    mItems: [],

    monsterbook: {},

    quests: {}, // "test": [3, 15846, 16312] <-- progress, start time, finish time
}

let settings = {
    // gameplay
    FPS: 60,
    autosave: true,
    difficulty: 1,
    circles: "npcs",

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
    game.characters[c].EP = getStat(game.characters[c].name, "maxEP");
}



// Functions
var saveNR = 0;

function isDevMode() {
    return false;
}

function load(x, altx) {
    return x !== undefined ? x : altx;
}

function saveGame(auto = false) {
    if (!auto) game.stats.saves++; 
    if (auto) game.stats.autoSaves++; 

    let saveCopy = JSON.parse(JSON.stringify(game));
    localStorage.setItem("SRPG" + saveNR, JSON.stringify(saveCopy));
}

function saveSettings() {
    let settingsCopy = JSON.parse(JSON.stringify(settings));
    localStorage.setItem("SRPGSETTINGS", JSON.stringify(settingsCopy));
    FPS = settings.FPS;
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

    FPS = settings.FPS;
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
            alert("Error while trying to load the save");
            return;
        }

        // check for some stuff that might be missing
        if (saveCopy.characters == undefined) {
            saveCopy.characters = game.characters;
        }
        for (i in characters) {
            if (saveCopy.characters[characters[i]] == undefined) {
                saveCopy.characters[characters[i]] = game.characters[characters[i]];
            }
        }

        if (saveCopy.stats == undefined) saveCopy.stats = game.stats;

        if (saveCopy.characters.bleu.pos == undefined) {
            saveCopy.characters.bleu.pos = [1, 1];
            saveCopy.characters.corelle.pos = [0, 1];
            saveCopy.characters.gau.pos = [2, 2];
            saveCopy.characters.koki.pos = [2, 1];
        }
        for (i in saveCopy.characters) {
            saveCopy.characters[i].effect = ["none", 0];
        }

        if (saveCopy.shops == undefined) saveCopy.shops = {};
        if (saveCopy.monsterbook == undefined) saveCopy.monsterbook = [];

        for (i in saveCopy.characters) {
            if (saveCopy.characters[i].equipment == undefined) saveCopy.characters[i].equipment = {
                "head": "none",
                "body": "none",
                "lhand": "none",
                "rhand": "none",
                "acc1": "none",
                "acc2": "none",
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

        if (saveCopy.mItems == undefined) saveCopy.mItems = [];
        if (saveCopy.quests == undefined) saveCopy.quests = {};

        // delete items that don't exist anymore
        for (let i in saveCopy.inventory){
            if (items[i] == undefined) delete saveCopy.inventory[i];
            i -= 1;
        }

        game = saveCopy;
        checkOverMax();
        FPS = settings.FPS;
    }
    else {
        saveGame();
    }
}