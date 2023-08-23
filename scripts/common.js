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
            occupied: false,
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

tiles_forest_old = {
    "F01":
        { "set": "forest_old", "snip": [0, 0], "ani": [2, 1], "occupied": false },
    "F02": { "set": "forest_old", "snip": [0, 1], "ani": [2, 1], "occupied": true },
    "F03": { "set": "forest_old", "snip": [0, 2], "occupied": true },
    "F04": { "set": "forest_old", "snip": [1, 2], "occupied": ["down"] },
    "F05": { "set": "forest_old", "snip": [2, 2], "occupied": true },
    "F06": { "set": "forest_old", "snip": [4, 0] }, "F07": { "set": "forest_old", "snip": [5, 0] }, "F08": { "set": "forest_old", "snip": [7, 0] }, "F09": { "set": "forest_old", "snip": [7, 1] }, "F10": { "set": "forest_old", "snip": [4, 2], "occupied": true }, "F11": { "set": "forest_old", "snip": [4, 3], "occupied": true }, "F12": { "set": "forest_old", "snip": [5, 3] }, "F13": { "set": "forest_old", "snip": [6, 3] }, "F14": { "set": "forest_old", "snip": [5, 2] }, "F15": { "set": "forest_old", "snip": [6, 2] }, "F16": { "set": "forest_old", "snip": [7, 2], "occupied": true }, "F17": { "set": "forest_old", "snip": [7, 3], "occupied": true }, "F18": { "set": "forest_old", "snip": [8, 2], "occupied": ["no"] },
    "F19": { "set": "forest_old", "snip": [8, 3], "occupied": true },
    "FGR": { "set": "forest_old", "snip": [0, 5] },
    "FGC": { "set": "forest_old", "snip": [1, 5] },
    "F20": { "set": "forest_old", "snip": [9, 2], "occupied": true }
}

tiles_forest = {
    "f01": { "set": "forest", "snip": [0, 1], "occupied": true, "ani": [2, 1] },
    "f02": { "set": "forest", "snip": [0, 0], "occupied": false, "ani": [2, 1] },

    "f03": { "set": "forest", "snip": [2, 3], "occupied": true },
    "f04": { "set": "forest", "snip": [3, 3], "occupied": true },
    "f05": { "set": "forest", "snip": [2, 2], "occupied": false },
    "f06": { "set": "forest", "snip": [3, 2], "occupied": false },
    "f07": { "set": "forest", "snip": [2, 1], "occupied": false },
    "f08": { "set": "forest", "snip": [3, 1], "occupied": false },
    "f09": { "set": "forest", "snip": [2, 0], "occupied": false },
    "f10": { "set": "forest", "snip": [3, 0], "occupied": false },

    "f11": { "set": "forest", "snip": [6, 3], "occupied": true },
    "f12": { "set": "forest", "snip": [7, 3], "occupied": true },
    "f13": { "set": "forest", "snip": [6, 2], "occupied": false },
    "f14": { "set": "forest", "snip": [7, 2], "occupied": false },
    "f15": { "set": "forest", "snip": [6, 1], "occupied": false },
    "f16": { "set": "forest", "snip": [7, 1], "occupied": false },
    "f17": { "set": "forest", "snip": [6, 0], "occupied": false },
    "f18": { "set": "forest", "snip": [7, 0], "occupied": false },

    "f19": { "set": "forest", "snip": [10, 0], "occupied": true },
    "f20": { "set": "forest", "snip": [11, 0], "occupied": true },
    "f21": { "set": "forest", "snip": [12, 0], "occupied": true },
    "f22": { "set": "forest", "snip": [13, 0], "occupied": true },
    "f23": { "set": "forest", "snip": [14, 0], "occupied": true },

    "f24": { "set": "forest", "snip": [10, 1], "occupied": false },
    "f25": { "set": "forest", "snip": [11, 1], "occupied": false },
    "f26": { "set": "forest", "snip": [12, 1], "occupied": false },
    "f27": { "set": "forest", "snip": [13, 1], "occupied": false },
    "f28": { "set": "forest", "snip": [14, 1], "occupied": false },

    "f29": { "set": "forest", "snip": [10, 2], "occupied": false },
    "f30": { "set": "forest", "snip": [11, 2], "occupied": false },
    "f31": { "set": "forest", "snip": [12, 2], "occupied": false },
    "f32": { "set": "forest", "snip": [13, 2], "occupied": false },
    "f33": { "set": "forest", "snip": [14, 2], "occupied": false },

    "f34": { "set": "forest", "snip": [10, 3], "occupied": true },
    "f35": { "set": "forest", "snip": [11, 3], "occupied": true },
    "f36": { "set": "forest", "snip": [12, 3], "occupied": true },

    "f37": { "set": "forest", "snip": [8, 4], "occupied": false },
    "f38": { "set": "forest", "snip": [9, 4], "occupied": false },
    "f39": { "set": "forest", "snip": [10, 4], "occupied": true },
    "f40": { "set": "forest", "snip": [11, 4], "occupied": true },
    "f41": { "set": "forest", "snip": [8, 5], "occupied": false },
    "f42": { "set": "forest", "snip": [9, 5], "occupied": false },
    "f43": { "set": "forest", "snip": [10, 5], "occupied": false },
    "f44": { "set": "forest", "snip": [11, 5], "occupied": false },

    "f45": { "set": "forest", "snip": [8, 6], "occupied": false },
    "f46": { "set": "forest", "snip": [9, 6], "occupied": false },
    "f47": { "set": "forest", "snip": [10, 6], "occupied": false },
    "f48": { "set": "forest", "snip": [8, 7], "occupied": false },
    "f49": { "set": "forest", "snip": [9, 7], "occupied": false },
    "f50": { "set": "forest", "snip": [10, 7], "occupied": false },
    "f51": { "set": "forest", "snip": [8, 8], "occupied": false },
    "f52": { "set": "forest", "snip": [9, 8], "occupied": false },
    "f53": { "set": "forest", "snip": [10, 8], "occupied": false },

    "f54": { "set": "forest", "snip": [11, 6], "occupied": false },
    "f55": { "set": "forest", "snip": [12, 6], "occupied": false },
    "f56": { "set": "forest", "snip": [13, 6], "occupied": false },
    "f57": { "set": "forest", "snip": [11, 7], "occupied": false },
    "f58": { "set": "forest", "snip": [12, 7], "occupied": false },
    "f59": { "set": "forest", "snip": [13, 7], "occupied": false },
    "f60": { "set": "forest", "snip": [11, 8], "occupied": false },
    "f61": { "set": "forest", "snip": [12, 8], "occupied": false },
    "f62": { "set": "forest", "snip": [13, 8], "occupied": false },

    "f63": { "set": "forest", "snip": [14, 8], "occupied": false },
    "f64": { "set": "forest", "snip": [15, 8], "occupied": false },

    "f65": { "set": "forest", "snip": [8, 9], "occupied": false },
    "f66": { "set": "forest", "snip": [9, 9], "occupied": false },
    "f67": { "set": "forest", "snip": [10, 9], "occupied": false },
    "f68": { "set": "forest", "snip": [8, 10], "occupied": false },
    "f69": { "set": "forest", "snip": [9, 10], "occupied": false },
    "f70": { "set": "forest", "snip": [10, 10], "occupied": false },

    "f70": { "set": "forest", "snip": [13, 9], "occupied": true },
    "f71": { "set": "forest", "snip": [14, 9], "occupied": true },
    "f72": { "set": "forest", "snip": [15, 9], "occupied": true },
    "f73": { "set": "forest", "snip": [12, 10], "occupied": true },
    "f74": { "set": "forest", "snip": [13, 10], "occupied": true },
    "f75": { "set": "forest", "snip": [14, 10], "occupied": true },
    "f76": { "set": "forest", "snip": [15, 10], "occupied": true },

    "f77": { "set": "forest", "snip": [12, 11], "occupied": true },
    "f78": { "set": "forest", "snip": [13, 11], "occupied": true },
    "f79": { "set": "forest", "snip": [14, 11], "occupied": true },
    "f80": { "set": "forest", "snip": [12, 12], "occupied": true },
    "f81": { "set": "forest", "snip": [13, 12], "occupied": true },
    "f82": { "set": "forest", "snip": [14, 12], "occupied": true },

    "f83": { "set": "forest", "snip": [15, 11], "occupied": true },
    "f84": { "set": "forest", "snip": [15, 12], "occupied": true },

    "f0a": { "set": "forest", "snip": [0, 4], "occupied": true },
    "f0b": { "set": "forest", "snip": [1, 4], "occupied": true },
    "f0c": { "set": "forest", "snip": [2, 4], "occupied": true },
    "f0d": { "set": "forest", "snip": [3, 4], "occupied": true },
    "f0e": { "set": "forest", "snip": [0, 5], "occupied": true },
    "f0f": { "set": "forest", "snip": [1, 5], "occupied": true },
    "f0g": { "set": "forest", "snip": [2, 5], "occupied": true },
    "f0h": { "set": "forest", "snip": [3, 5], "occupied": true },
    "f0i": { "set": "forest", "snip": [0, 6], "occupied": true },
    "f0j": { "set": "forest", "snip": [1, 6], "occupied": true },
    "f0k": { "set": "forest", "snip": [2, 6], "occupied": true },
    "f0l": { "set": "forest", "snip": [3, 6], "occupied": true },
    "f0m": { "set": "forest", "snip": [0, 7], "occupied": true },
    "f0n": { "set": "forest", "snip": [1, 7], "occupied": true },
    "f0o": { "set": "forest", "snip": [2, 7], "occupied": true },
    "f0p": { "set": "forest", "snip": [3, 7], "occupied": true },
    "f0q": { "set": "forest", "snip": [0, 8], "occupied": true },
    "f0r": { "set": "forest", "snip": [1, 8], "occupied": true },
    "f0s": { "set": "forest", "snip": [2, 8], "occupied": true },
    "f0t": { "set": "forest", "snip": [3, 8], "occupied": true },
}