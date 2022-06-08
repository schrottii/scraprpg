// This is for the enemies in-fight. For the map enemies, see map_enemies.js

let enemyTypes = {
    "weakhelter": {
        name: "Helter Skelter",
        HP: 5,
        strength: 2,
        eva: 0,
        agi: 30
        //position: 1,
    },

    "stronghelter": {
        name: "Helter Skelter+",
        HP: 9,
        strength: 2,
        eva: 0,
        agi: 25
        //position: 1,
    },

    "itsalive": {
        name: "It's Alive",
        HP: 30,
        strength: 2,
        eva: 30,
        agi: 10
        //position: 1,
    },

    "livingbarrel": {
        name: "Living Barrel",
        HP: 10,
        strength: 6,
        eva: 10,
        agi: 23
        //position: 1,
    },
}

let currentEnemies = [];