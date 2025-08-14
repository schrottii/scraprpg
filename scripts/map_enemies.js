// Map Enemies (-> see enemies.js for in-fight)
// hmkgjfvmgmf

// All the map enemies
let mapenemies = {
    // DEFAULT
    default(args) {
        return {
            // movement stuff, not really relevant
            position: [-64, -64],
            map: "",
            kofs: [0, 0, 0],
            head: 0,
            spawntime: 0, // ticks

            // use these to adjust your sprite/skin and opacity (0-1)
            source: "enemies/evil",
            alpha: 1,

            // set time when it spawns
            time: "all", // day, dawn, noon, dusk, night
            // min. and max. amount of enemies (1-9)
            minSize: 1,
            maxSize: 9,

            // contained enemies (chances 0-100)
            enemies: {
                "weakhelter": 60,
                "stronghelter": 10,
                "livingbarrel": 2
            },

            // movement stuff
            movementTime: 0, // offset, usually irrelevant
            walkingInterval: 0.5, // time between walks
            walkingSpeed: 1, // how long it takes to walk from one tile to another (in seconds)

            render(ctx) {
                let ofsX = Math.max(CAMERA_LOCK_X, game.position[0] - kofs[0] * kofs[2] - width / 2 + 0.5) + this.kofs[0] * (this.kofs[2] / this.walkingSpeed);
                let ofsY = Math.max(CAMERA_LOCK_Y, game.position[1] - kofs[1] * kofs[2] - 7.5) + this.kofs[1] * (this.kofs[2] / this.walkingSpeed);

                let posX = ((zoom * scale) * (this.position[0] - ofsX)) - ((zoom - 1) * scale * (width / 2));
                let posY = (zoom * scale) * (this.position[1] - ofsY) - ((zoom - 1) * scale * 7);

                this.kofs[2] = Math.max(this.kofs[2] - delta / 166, 0);

                if (this.spawntime > 599) {
                    if (game.map == this.map) {
                        if (settings.circles == "all" || settings.circles == "enemies") {
                            ctx.drawImage(images.enemyCircle,
                                posX - (zswm / 4), posY - (zswm / 4),
                                zswm * 1.5, zswm * 1.5);
                        }
                        ctx.drawImage(images[this.source],
                            32 * Math.floor(walkTime), 32 * this.head, 32, 32,
                            posX, posY,
                            zswm, zswm)
                    }
                }
                ctx.globalAlpha = 1;
                if (this.spawntime < 900 && this.alpha != 0) {
                    this.spawntime += delta;
                    if (this.spawntime > 599) {
                        ctx.drawImage(images.spawn, 64, 0, 32, 32, posX, posY, zswm, zswm);
                    }
                    else if (this.spawntime > 299) {
                        ctx.drawImage(images.spawn, 32, 0, 32, 32, posX, posY, zswm, zswm);
                    }
                    else ctx.drawImage(images.spawn, 0, 0, 32, 32, posX, posY, zswm, zswm);
                }
            },

            ...args || {},
        }
    },

    /*
    bro(args) {
        return {
            ...mapenemies.default(), source: "enemies/bro", alpha: 0.5,
            time: "night", walkingInterval: 0.12, walkingSpeed: 5,
            enemies: {
                "livingbarrel": 70,
                "itsalive": 30
            },
            ...args || {},
        }
    },
    */



    // Forest / starter enemies
    forest1(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 2, maxSize: 4,
            walkingInterval: 0.66, walkingSpeed: 0.66,
            enemies: {
                "weakhelter": 20,
                "ent_weak": 5,
                "evil_peter": 30,
                "home_runner": 1,
                "slime_green": 10,
                "postbox": 30
            },
            ...args || {},
        }
    },
    forestsmall(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 1, maxSize: 3,
            walkingInterval: 0.66, walkingSpeed: 1,
            enemies: {
                "weakhelter": 20,
                "evil_peter": 20
            },
            ...args || {},
        }
    },
    livinghay(args) {
        return {
            ...mapenemies.default(), source: "enemies/livinghay",
            time: "all", minSize: 1, maxSize: 2,
            walkingInterval: 4, walkingSpeed: 0.2,
            enemies: {
                "living_hay": 60,
                "evil_peter": 10
            },
            ...args || {},
        }
    },
    boss_slime_king(args) {
        return {
            ...mapenemies.default(), source: "enemies/slimegreen",
            time: "all", minSize: 3, maxSize: 6,
            walkingInterval: 2, walkingSpeed: 3,
            enemies: {
                "boss_slime_king": 100,
                "slime_green": 50,
                "evil_peter": 20,
            },
            ...args || {},
        }
    },

    // Mountain (chapter 1)
    mountain1(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 2, maxSize: 6,
            walkingInterval: 0.5, walkingSpeed: 1,
            enemies: {
                "weakhelter": 10,
                "postbox": 10,
                "futhark": 3,
                "cloudon": 20,
                "slime_wind": 10,
                "lurid_layered": 40,
                "itsalive": 40,
                "zero_point": 3
            },
            ...args || {},
        }
    },
    boss_ooo_point(args) {
        return {
            ...mapenemies.default(), source: "enemies/zeropoint",
            time: "all", minSize: 3, maxSize: 6,
            walkingInterval: 1, walkingSpeed: 3,
            enemies: {
                "boss_ooo_point": 100,
                "slime_wind": 50,
                "cloudon": 20,
            },
            ...args || {},
        }
    },

    // Chapter 2
    forest2(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 4, maxSize: 7,
            walkingInterval: 0.5, walkingSpeed: 0.66,
            enemies: {
                "stronghelter": 20,
                "ent_medium": 10,
                "evil_peter": 30,
                "nottoofresh": 1,
                "housoo": 20
            },
            ...args || {},
        }
    },
    cave1(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 2, maxSize: 4,
            walkingInterval: 0.7, walkingSpeed: 1,
            enemies: {
                "slime_earth": 20,
                "coal": 10,
                "sloper": 10,
                "futhark": 10,
                "nottoofresh": 5,
            },
            ...args || {},
        }
    },

    // Chapter 3
    beach1(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 2, maxSize: 4,
            walkingInterval: 0.3, walkingSpeed: 1,
            enemies: {
                "stronghelter": 10,
                "slime_water": 20,
                "cocnutnut": 50,
                "rhapsody": 10,
                "adose": 1
            },
            ...args || {},
        }
    },
    underwater1(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 2, maxSize: 3,
            walkingInterval: 0.66, walkingSpeed: 2,
            enemies: {
                "slime_water": 10,
                "rhapsody": 10,
                "adose": 10,
                "eldritch": 20,
                "water_shadow": 1,
                "ectoplasm_shadow": 1
            },
            ...args || {},
        }
    },
    underwater2(args) {
        return {
            ...mapenemies.default(), source: "gen",
            time: "all", minSize: 2, maxSize: 5,
            walkingInterval: 0.66, walkingSpeed: 2,
            enemies: {
                "slime_water": 10,
                "adose": 20,
                "eldritch": 10,
                "water_shadow": 3,
                "ectoplasm_shadow": 1,
                "shapeward": 10
            },
            ...args || {},
        }
    },
    boss_ectoxoxo(args) {
        return {
            ...mapenemies.default(), source: "enemies/ectoplasm_shadow",
            time: "all", minSize: 3, maxSize: 6,
            walkingInterval: 1, walkingSpeed: 3,
            enemies: {
                "boss_ectoxoxo": 100,
                "water_shadow": 50,
                "adose": 20,
            },
            ...args || {},
        }
    },

    // OLDIES
    itsalivemap(args) {
        return {
            ...mapenemies.default(), source: "enemies/itsalive", alpha: 0.6,
            walkingInterval: 0.5,
            enemies: {
                "weakhelter": 20,
                "itsalive": 60
            },
            ...args || {},
        }
    },
    livingbarrelmap(args) {
        return {
            ...mapenemies.default(), source: "enemies/livingbarrel",
            time: "night",
            walkingInterval: 0.12, walkingSpeed: 5,
            enemies: {
                "livingbarrel": 70,
                "itsalive": 30
            },
            ...args || {},
        }
    },
    ntf(args) {
        return {
            ...mapenemies.default(), source: "enemies/nottoofresh",
            walkingInterval: 0.24, walkingSpeed: 0.75,
            enemies: {
                "nottoofresh": 90,
                "itsalive": 40
            },
            ...args || {},
        }
    },
};