// This is for the enemies in-fight. For the map enemies, see map_enemies.js

let enemyTypes = {
    "weakhelter": {
        name: "Helter Skelter",
        HP: 5,
        strength: 2,
        eva: 0,
        agi: 30,
        luk: 3,
        element: "light",
    },

    "stronghelter": {
        name: "Helter Skelter+",
        HP: 9,
        strength: 2,
        eva: 0,
        agi: 25,
        luk: 3,
        element: "physical",
    },

    "itsalive": {
        name: "It's Alive",
        HP: 20,
        strength: 2,
        eva: 30,
        agi: 10,
        luk: 3,
        element: "wind",
    },

    "livingbarrel": {
        name: "Living Barrel",
        HP: 20,
        strength: 6,
        eva: 10,
        agi: 23,
        luk: 30,
        element: "dark",
    },

    "nottoofresh": {
        name: "Not Too Fresh",
        HP: 40,
        strength: 11,
        eva: 30,
        agi: 80,
        luk: 20,
        element: "wind",
    },
}

let currentEnemies = [];