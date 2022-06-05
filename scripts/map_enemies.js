// var zoom = 1;

// Enemies
let mapenemies = {
    default(args) {
        return {
            position: [6, 6],
            map: "",
            alpha: 255,
            head: 0,
            skin: "evil",
            enemies: {
                "weakhelter": 60,
                "stronghelter": 10,
                "itsalive": 2
            },

            render(ctx) {
                let tileX = this.position[0];
                let tileY = this.position[1];

                let xAdjust = game.position[0] - width / 2 + 0.5;
                if (game.map == this.map) {
                    ctx.drawImage(images[this.skin],
                        32 * Math.floor(walkTime), 32 * this.head, 32, 32,
                        ((zoom * scale) * (tileX + kofs[0] * kofs[2] - xAdjust)) - ((zoom - 1) * scale * (width / 2)),
                        (zoom * scale) * (tileY + kofs[1] * kofs[2] - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
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
            enemies: {
                "weakhelter": 20,
                "itsalive": 60
            },
            ...args || {},

        }
    }
};