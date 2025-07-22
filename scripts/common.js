var commontiles = {
    empty: {
        sprite: "empty",
    },
    "C00": { "set": "common", "snip": [0, 0] },
    // Do not remove this } here. Make sure there's a } right above this too
}

/*
 saveGame();
            addAnimator(function (t) {
                autoSaveText.alpha = 1 - (1 / 2500) * t;
                if (t > 2500) {
                    autoSaveText.alpha = 0;
                    return true;
                }
                return false;
            })
            */

// Map packs (tilesets)
function loadPacks(map = 0) {
    //console.log("load start");
    let packTiles = {};
    if (map == 0) {
        for (i in game.map.packs) {
            packTiles = Object.assign({}, packs[game.map.packs[i]]);
        }
    }
    else {
        for (i in map.packs) {
            packTiles = Object.assign({}, packs[map.packs[i]]);
        }
    }
    //console.log("load finish");
    return packTiles;
}

var packs = {

    castle:
    {
        "R00": {
            "set": "castle",
            "snip": [
                0,
                0
            ],
            "occupied": true
        },
        "R01": {
            "set": "castle",
            "snip": [
                1,
                0
            ],
            "occupied": true
        },
        "R02": {
            "set": "castle",
            "snip": [
                2,
                0
            ],
            "occupied": true
        },
        "R03": {
            "set": "castle",
            "snip": [
                3,
                0
            ],
            "occupied": true
        },
        "R06": {
            "set": "castle",
            "snip": [
                6,
                0
            ],
            "occupied": true
        },
        "R07": {
            "set": "castle",
            "snip": [
                7,
                0
            ],
            "occupied": true
        },
        "R08": {
            "set": "castle",
            "snip": [
                8,
                0
            ],
            "occupied": true
        },
        "R09": {
            "set": "castle",
            "snip": [
                9,
                0
            ],
            "occupied": true
        },
        "R10": {
            "set": "castle",
            "snip": [
                0,
                1
            ],
            "occupied": false
        },
        "R11": {
            "set": "castle",
            "snip": [
                1,
                1
            ],
            "occupied": false
        },
        "R13": {
            "set": "castle",
            "snip": [
                3,
                1
            ],
            "occupied": false
        },
        "R14": {
            "set": "castle",
            "snip": [
                4,
                1
            ],
            "occupied": false
        },
        "R15": {
            "set": "castle",
            "snip": [
                5,
                1
            ],
            "occupied": false
        },
        "R16": {
            "set": "castle",
            "snip": [
                6,
                1
            ],
            "occupied": false
        },
        "R17": {
            "set": "castle",
            "snip": [
                7,
                1
            ],
            "occupied": false
        },
        "R18": {
            "set": "castle",
            "snip": [
                8,
                1
            ],
            "occupied": false
        },
        "R19": {
            "set": "castle",
            "snip": [
                9,
                1
            ],
            "occupied": false
        }
    }

};