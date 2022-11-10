var commontiles = {
    empty: {
        sprite: "water1",
        },

    "000": {
        sprite: "grass1",
        },
    "001": {
        sprite: "sand1",
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
    "009": {
        sprite: "tend_high_left",
            dialogue: 1,
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
        sprite:  "water_s._leg_2",
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
    
 
      },
    "SVP": {
        sprite: "checkpoint",
            occupied: false,
                action: () => {
                    saveGame();
                    addAnimator(function (t) {
                        autoSaveText.alpha = t / 10;
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
