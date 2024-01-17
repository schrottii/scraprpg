// var zoom = 1;

// Enemies
let mapenemies = {
    default(args) {
        return {
            position: [6, 6],
            map: "",
            alpha: 0,
            opacity: 1,
            head: 0,
            skin: "evil",
            kofs: [0, 0, 0],
            time: "both",
            spawntime: 0,
            enemies: {
                "weakhelter": 60,
                "stronghelter": 10,
                "livingbarrel": 2
            },

            movementTime: 0,
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
                        ctx.drawImage(images[this.skin],
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
    itsalivemap(args) {
        return {
            ...mapenemies.default(),
            skin: "itsalive",
            opacity: 0.6,
            enemies: {
                "weakhelter": 20,
                "itsalive": 60
            },
            walkingInterval: 2,
            ...args || {},

        }
    },
    livingbarrelmap(args) {
        return {
            ...mapenemies.default(),
            skin: "livingbarrel",
            enemies: {
                "livingbarrel": 70,
                "itsalive": 30
            },
            walkingInterval: 0.12,
            walkingSpeed: 5,
            time: "night",
            ...args || {},

        }
    },
    ntf(args) {
        return {
            ...mapenemies.default(),
            skin: "nottoofresh",
            enemies: {
                "nottoofresh": 90,
                "itsalive": 40
            },
            walkingInterval: 0.24,
            walkingSpeed: 0.75,
            ...args || {},

        }
    },
};