maps["original"] = {
    tiles: {
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
        "010": {
            sprite: "tend_mid_high",
        },
        "011": {
            sprite: "tend_high_right",
        },
        "012": {
            sprite: "tend_mid_left",
        },
        "013": {
            sprite: "tend_central",
        },
        "014": {
            sprite: "tend_mid_right",
        },
        "015": {
            sprite: "tend_low_left",
        },
        "016": {
            sprite: "tend_mid_low",
        },
        "017": {
            sprite: "tend_low_right",
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
        },
        "D01": {
            sprite: "uv_house_door",
            teleport: ["test", 4, 4],
        },
        "D02": {
            sprite: "uv_house_door",
            teleport: ["map2", 2, 1],
        },
        "D03": {
            sprite: "tend_central",
            teleport: ["test", 4, 38],
        },
        "D04": {
            sprite: "tend_central",
            teleport: ["test", 10, 37],
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
        },
        "037": {
            sprite: "hay_central",
            occupied: true,
        },
        "038": {
            sprite: "hay_left",
            occupied: true,
        },
        "D05": {
            sprite: "teleport",
            teleport: ["original", 4, 4],
        },
        "D06": {
            sprite: "teleport",
            teleport: ["test", 4, 5],
        },
        "039": {
            sprite: "bush_1",
            occupied: true,
        },
        "040": {
             sprite: "well_1",
             occupied: true,
        },
        "041": {
              sprite: "well_2",
              occupied: true,
        },
        "042": {
            sprite: "well_3",
            occupied: true,
        }, 
        "043": {
            sprite: "well_4",
            occupied: true,
        },
        "044": {
             sprite: "well_5",
        },
        "045": {
              sprite: "well_6"
        },
        "D07": {
              sprite: "hole_1"
              teleport: ["cave1", 10, 1],
        },
        "D08": {
              sprite: "hole_2"
              teleport: ["cave1", 10, 1],
        },
        "D09": {
              sprite: "hole_3"
              teleport: ["cave1", 10, 1],
        },
        "D10": {
              sprite: "hole_4"
              teleport: ["cave1", 10, 1],
             
        

        },

        // Do not remove this } here. Make sure there's a } right above this too
    },
    spawns: {
        "default": 10,
        "itsalivemap": 2
    },
    maxEnemies: 8,
    map: [
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 D06 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 025 026 000 000 D07 D08 000 000",
        "000 000 000 000 000 028 028 000 000 027 028 000 000 D09 D10 000 000",
        "000 000 027 028 000 027 028 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 025 026 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 027 028 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000",
        "000 000 001 001 001 001 001 000 001 001 001 001 001 001 000 000 000",
        "001 001 001 001 001 001 001 001 001 025 026 001 001 001 001 001 001",
        "001 001 001 001 001 001 001 001 001 027 028 001 001 001 001 001 011",
        "002 002 002 002 002 002 002 002 002 002 002 002 002 002 002 002 002",
    ],
    mapbg2: [
        "---",
        "---",
        "---",
        "---",
        "---",
        "---",
        "---",
        "---",
        "---",
        "---",
        "--- --- --- --- --- 043 042",
        "--- --- --- --- --- 041 040",
    ],
    mapfg: [
        "--- --- --- --- --- --- 039",
        "--- --- --- 039",
        "--- ---",
        "--- --- --- --- --- --- 039",
        "--- --- --- --- --- --- --- --- --- 025 026",
        "--- --- --- --- --- 025 026",
        "--- ---",
        "--- --- 025 026",
        "--- ---",
        "--- --- --- --- --- 045 044",
    ]
}
