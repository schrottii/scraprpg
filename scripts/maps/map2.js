maps["map2"] = {
    tiles: {
        empty: {
            sprite: "grass1",
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
            sprite: "house_floor",
        },

    // Do not remove this } here. Make sure there's a } right above this too
    },
    spawns: {
        "itsalivemap": 25
    },
    maxEnemies: 2,
    map: [
        "033 033 033 033 033 033 033 033 033 D01 033 033 033 033 033 033 033 033",
        "033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033",
        "033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033",
        "033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033",
        
    ],

    mapfg: [
        "---",
        "---",
        "---",
        "---",

    ]
}
