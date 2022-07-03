// Non Player Characters (not to be confused with Non Fungible Tokens)

// Movement type:
// 0: Do not move (like a stone)
// 1: Move randomly (like a stupid guy)
// 2: Move in a set pattern (booooring)

let npcs = {
    default(args) {
        return {
            position: [8, 8],
            map: "test",
            alpha: 255,
            head: 0,
            skin: "evil",
            kofs: [0, 0, 0],
            dialogues: {
                1: [["Hello this is a test dialogue", "happy"],
                ["Second text", "neutral"],
                ["Don't forget to subscribe to my channel", "angry"]]
            },
            movement: 0,

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
            ...npcs.default(),
            position: [10, 8],
            map: "test",
            skin: "itsalive",
            dialogues: {
                1: [["Hello welcome is a test dialogue", "happy"],
                    ["Second welcome", "neutral"],
                    ["Don't forget to welcome to my channel", "angry"]]
            },
            movement: 0,
            ...args || {},

        }
    }
};