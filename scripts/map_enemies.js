// var zoom = 1;

// Enemies
let mapenemies = {
    default(args) {
        return {
            position: [6, 6],
            map: "",
            alpha: 1,
            head: 0,
            skin: "evil",
            kofs: [0, 0, 0],
            time: "both",
            enemies: {
                "weakhelter": 60,
                "stronghelter": 10,
                "livingbarrel": 2
            },

            movementTime: 0,
            walkingSpeed: 0.5,

            render(ctx) {
                let tileX = this.position[0];
                let tileY = this.position[1];

                let xAdjust = game.position[0] - width / 2 + 0.5;
                if (game.map == this.map) {
                    this.kofs[2] = Math.max(this.kofs[2] - delta / 166, 0);
                    ctx.drawImage(images[this.skin],
                        32 * Math.floor(walkTime), 32 * this.head, 32, 32,
                        ((zoom * scale) * (tileX + kofs[0] * kofs[2] - this.kofs[0] * this.kofs[2] - xAdjust)) - ((zoom - 1) * scale * (width / 2)),
                        (zoom * scale) * (tileY + kofs[1] * kofs[2] - this.kofs[1] * this.kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                        zoom * scale, zoom * scale)
                }
            },

            ...args || {},
        }
    },
    itsalivemap(args) {
        return {
            ...mapenemies.default(),
            skin: "itsalive",
            alpha: 0.3,
            enemies: {
                "weakhelter": 20,
                "itsalive": 60
            },
            walkingSpeed: 2,
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
            walkingSpeed: 0.12,
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
            walkingSpeed: 0.24,
            ...args || {},

        }
    },
};