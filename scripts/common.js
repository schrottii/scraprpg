var commontiles = {
    empty: {
        sprite: "water1",
        },

    "000": {
        sprite: "grass1",
        },
    "00A": {
         sprite: "GrassV2"
        },
    "01A": {
        sprite: "AshTile"
    },
    "001": {
        sprite: "sand1",
        },
    "00B": {
         sprite: "Test"
        },
    "01B": {
        sprite: "StoneTile"
    },
    "00C": {
         sprite: "BricksV2"
        },
    "01C": {
        sprite: "GrayBrickTile"
        },
    "01D": {
        sprite: "dirtcliff",
            occupied: true,
        },
    "002": {
        sprite: "water1",
            occupied: true,
        },
    "003": {
        sprite: "relief1",
        },
    "004": {
        sprite: "relief2",
            occupied: true,
        },
    "005": {
        sprite: "relief2",
            occupied: ["down", "right"],
        },
    "006": {
        sprite: "bridge-left",
        },
    "007": {
        sprite: "bridge-center",
        },
    "008": {
        sprite: "bridge-right",
        },
    "999": {
        sprite: "placeholder",
            occupied: true,
        },
    "018": {
        sprite: "cliff_1",
            occupied: true,
        },
    "019": {
        sprite: "cliff_external",
        },
    "020": {
        sprite: "cliff_central",
        },
    "021": {
        sprite: "cliff_border",
        },
    "022": {
        sprite: "sand_hole",
            occupied: true,
        },
    "023": {
        sprite: "sand_hole_scrapy",
            occupied: true,
        },
    "024": {
        sprite: "sand_hole_with_barrels"
    },
    "025": {
        sprite: "uv_roof_right",
            occupied: true,
        },
    "026": {
        sprite: "uv_roof_left",
            occupied: true,
        },
    "027": {
        sprite: "uv_house_door",
        },
    "028": {
        sprite: "uv_house_1",
            occupied: true,
        },
    "029": {
        sprite: "uv_house_left",
            occupied: true,
                action: () => {
                    startDialogue(maps["test"].dialogues[2]);
                }
    },
    "030": {
        sprite: "fence_no_pole",
            occupied: true,
        },
    "031": {
        sprite: "fence_right",
            occupied: true,
        },
    "032": {
        sprite: "fence_left",
            occupied: true,
        },
    "033": {
        sprite: "table_right",
            occupied: true,
        },
    "034": {
        sprite: "table_left",
            occupied: true,
        },
    "035": {
        sprite: "fence_single",
            occupied: true,
        },
    "036": {
        sprite: "hay_right",
            occupied: true,
                action: () => {
                    zoom = 2.5;
                }
    },
    "037": {
        sprite: "hay_central",
            occupied: true,
        },
    "038": {
        sprite: "hay_left",
        occupied: true,
        action: () => {
            zoom = 1;
        }
    },
    "039": {
        sprite: "bush_1",
        occupied: true,
    },
    "040": {
        sprite: "town_pav",
    },
    "041": {
        sprite: "water_s._leg",
        occupied: true,
    },
    "042": {
        sprite:  "water_s.leg_2",
        occupied: true,
    },
    "043": {
        sprite: "water_s._leg_middle",
        occupied: true,
    },
    "044": {
        sprite: "water_s._leg_middle_2",
        occupied: true,
    },
    "045": {
        sprite: "water_structure",
    },
    "046": {
        sprite: "water_structure_2",
    },
    "TO0": {
        set: "torch",
        snip: [0, 0],
        ani: [2, 1],
    },
    "C01": {
        set: "castle",
        snip: [1, 2],
        occupied: true,
    },
    "C02": {
        set: "castle",
        snip: [2, 2],
        occupied: true,
    },
    "Cd1": {
        set: "castle",
        snip: [1, 0],
    },
    "Cd2": {
        set: "castle",
        snip: [2, 0],
    },
    "Cd3": {
        set: "castle",
        snip: [1, 1],
    },
    "Cd4": {
        set: "castle",
        snip: [2, 1],
    },
    "SVP": {
        sprite: "checkpoint",
            occupied: false,
                action: () => {
                    saveGame();
                    addAnimator(function (t) {
                        autoSaveText.alpha = 1 - (1 / 2500) * t;
                        if (t > 2500) {
                            autoSaveText.alpha = 0;
                            return true;
                        }
                        return false;
                    })
                }
    },
    // Do not remove this } here. Make sure there's a } right above this too
}

tiles_forest = {
    "F01":
        { "set": "forest", "snip": [0, 0], "ani": [2, 1], "occupied": false },
    "F02": { "set": "forest", "snip": [0, 1], "ani": [2, 1], "occupied": true },
    "F03": { "set": "forest", "snip": [0, 2], "occupied": true },
    "F04": { "set": "forest", "snip": [1, 2], "occupied": ["down"] },
    "F05": { "set": "forest", "snip": [2, 2], "occupied": true },
    "F06": { "set": "forest", "snip": [4, 0] }, "F07": { "set": "forest", "snip": [5, 0] }, "F08": { "set": "forest", "snip": [7, 0] }, "F09": { "set": "forest", "snip": [7, 1] }, "F10": { "set": "forest", "snip": [4, 2], "occupied": true }, "F11": { "set": "forest", "snip": [4, 3], "occupied": true }, "F12": { "set": "forest", "snip": [5, 3] }, "F13": { "set": "forest", "snip": [6, 3] }, "F14": { "set": "forest", "snip": [5, 2] }, "F15": { "set": "forest", "snip": [6, 2] }, "F16": { "set": "forest", "snip": [7, 2], "occupied": true }, "F17": { "set": "forest", "snip": [7, 3], "occupied": true }, "F18": { "set": "forest", "snip": [8, 2], "occupied": ["no"] },
    "F19": { "set": "forest", "snip": [8, 3], "occupied": true },
    "FGR": { "set": "forest", "snip": [0, 5] },
    "FGC": { "set": "forest", "snip": [1, 5] },
    "F20": { "set": "forest", "snip": [9, 2], "occupied": true }
}