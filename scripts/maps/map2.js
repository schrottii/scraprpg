maps["map2"] = {
    tiles: {
        empty: {
            sprite: "grass1",
        },
        "D01": {
            sprite: "uv_house_door",
            teleport: ["test", 4, 4],
        },
        "033": {
            sprite: "house_floor",
        },
        "034": {
            sprite: "uv_house_up",
            occupied: true,
        },
        "035": {
            sprite: "uv_house_left_in",
            occupied: true,
        },
        "036": {
            sprite: "uv_house_right",
            occupied: true,
        },
        "037": {
            sprite: "uv_house_down",
            occupied: true,
        },
        "038": {
            sprite: "uv_house_angle_left_up",
            occupied: true,
        },
        "039": {
            sprite: "uv_house_angle_left_down",
            occupied: true,
        },
        "040": {
            sprite: "uv_house_angle_right_up",
            occupied: true,
        },
        "041": {
            sprite: "uv_house_angle_right_down",
            occupied: true,
        },
        "042": {
            sprite: "uv_house_up_window",
            occupied: true,
        },
    
    // Do not remove this } here. Make sure there's a } right above this too
    },
    spawns: {
        "itsalivemap": 25
    },
    maxEnemies: 2,
    map: [
        "038 034 034 034 034 034 034 034 034 D01 034 034 034 034 034 034 034 040",
        "035 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 036",
        "035 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 036",
        "035 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 036",
        "035 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 036",
        "035 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 033 036",
        "039 037 037 037 037 037 037 037 037 037 037 037 037 037 037 037 037 041",
                                            
    ],

    mapbg2: [
        "---",
        "---",
        "---",
        "---",

    ],
    mapfg: [
        "---",
    ]
}
