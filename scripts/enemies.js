// This is for the enemies in-fight. For the map enemies, see map_enemies.js

let enemyTypes = {
    "weakhelter": {
        name: "Helter Skelter",
        HP: 5,
        strength: 2,
        eva: 0,
        acc: 80,
        agi: 30,
        luk: 3,
        element: "physical",
        items: ["potion", "brickyleaf", "peppytincture", "superswamp"],
    },

    "stronghelter": {
        name: "Helter Skelter+",
        HP: 9,
        strength: 2,
        eva: 0,
        acc: 80,
        agi: 25,
        luk: 3,
        element: "physical",
        items: "none",
    },

    "itsalive": {
        name: "It's Alive",
        HP: 20,
        strength: 3,
        eva: 20,
        acc: 80,
        agi: 10,
        luk: 3,
        element: "wind",
        items: ["potion"],
    },

    "livingbarrel": {
        name: "Living Barrel",
        HP: 20,
        strength: 8,
        eva: 5,
        acc: 90,
        agi: 23,
        luk: 30,
        element: "dark",
        items: "none",
        size: "2x2",
    },

    "nottoofresh": {
        name: "Not Too Fresh",
        HP: 40,
        strength: 11,
        eva: 20,
        acc: 60,
        agi: 80,
        luk: 20,
        element: "wind",
        items: "none",
    },
}

let currentEnemies = [];