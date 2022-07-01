// This is for the enemies in-fight. For the map enemies, see map_enemies.js

let enemyTypes = {
    "weakhelter": {
        name: "Helter Skelter",
        HP: 5,
        strength: 2,
        eva: 0,
        agi: 30,
        element: "light",
    },

    "stronghelter": {
        name: "Helter Skelter+",
        HP: 9,
        strength: 2,
        eva: 0,
        agi: 25,
        element: "physical",
    },

    "itsalive": {
        name: "It's Alive",
        HP: 30,
        strength: 2,
        eva: 30,
        agi: 10,
        element: "air",
    },

    "livingbarrel": {
        name: "Living Barrel",
        HP: 10,
        strength: 6,
        eva: 10,
        agi: 23,
        element: "dark",
    },
}

let currentEnemies = [];