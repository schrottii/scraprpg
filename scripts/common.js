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
        },
        "R20": {
            "set": "castle",
            "snip": [
                0,
                2
            ],
            "occupied": false
        },
        "R21": {
            "set": "castle",
            "snip": [
                1,
                2
            ],
            "occupied": false
        },
        "R2X": {
            "set": "castle",
            "snip": [
                0,
                2
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R22": {
            "set": "castle",
            "snip": [
                2,
                2
            ],
            "occupied": false
        },
        "R23": {
            "set": "castle",
            "snip": [
                3,
                2
            ],
            "occupied": false
        },
        "R24": {
            "set": "castle",
            "snip": [
                4,
                2
            ],
            "occupied": false
        },
        "R25": {
            "set": "castle",
            "snip": [
                5,
                2
            ],
            "occupied": false
        },
        "R26": {
            "set": "castle",
            "snip": [
                6,
                2
            ],
            "occupied": false
        },
        "R27": {
            "set": "castle",
            "snip": [
                7,
                2
            ],
            "occupied": false
        },
        "R36": {
            "set": "castle",
            "snip": [
                6,
                3
            ],
            "occupied": false
        },
        "R37": {
            "set": "castle",
            "snip": [
                7,
                3
            ],
            "occupied": false
        },
        "R28": {
            "set": "castle",
            "snip": [
                8,
                2
            ],
            "occupied": false
        },
        "R29": {
            "set": "castle",
            "snip": [
                9,
                2
            ],
            "occupied": false
        },
        "R38": {
            "set": "castle",
            "snip": [
                8,
                3
            ],
            "occupied": false
        },
        "R39": {
            "set": "castle",
            "snip": [
                9,
                3
            ],
            "occupied": false
        },
        "R30": {
            "set": "castle",
            "snip": [
                0,
                3
            ],
            "occupied": false
        },
        "R31": {
            "set": "castle",
            "snip": [
                1,
                3
            ],
            "occupied": false
        },
        "R32": {
            "set": "castle",
            "snip": [
                2,
                3
            ],
            "occupied": false
        },
        "R33": {
            "set": "castle",
            "snip": [
                3,
                3
            ],
            "occupied": false
        },
        "R40": {
            "set": "castle",
            "snip": [
                0,
                4
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R50": {
            "set": "castle",
            "snip": [
                0,
                5
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R42": {
            "set": "castle",
            "snip": [
                2,
                4
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R52": {
            "set": "castle",
            "snip": [
                2,
                5
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R44": {
            "set": "castle",
            "snip": [
                4,
                4
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R54": {
            "set": "castle",
            "snip": [
                4,
                5
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R46": {
            "set": "castle",
            "snip": [
                6,
                4
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R56": {
            "set": "castle",
            "snip": [
                6,
                5
            ],
            "occupied": false,
            "ani": [
                2,
                1
            ]
        },
        "R60": {
            "set": "castle",
            "snip": [
                0,
                6
            ],
            "occupied": false
        },
        "R61": {
            "set": "castle",
            "snip": [
                1,
                6
            ],
            "occupied": false
        },
        "R62": {
            "set": "castle",
            "snip": [
                2,
                6
            ],
            "occupied": false
        },
        "R63": {
            "set": "castle",
            "snip": [
                3,
                6
            ],
            "occupied": false
        },
        "R64": {
            "set": "castle",
            "snip": [
                4,
                6
            ],
            "occupied": false
        }
    }

};