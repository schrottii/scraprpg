// This is for the enemies in-fight. For the map enemies, see map_enemies.js

let enemyTypes = {
    "weakhelter": {
        name: "Helter Skelter",
        HP: 5,
        strength: 2,
        //position: 1,
    },

    "stronghelter": {
        name: "Helter Skelter+",
        HP: 9,
        strength: 2,
        //position: 1,
    },

    "itsalive": {
        name: "It's Alive (aka the overpowered barrel in ScrapTD)",
        HP: 30,
        strength: 2,
        //position: 1,
    },
}

let currentEnemies = [];