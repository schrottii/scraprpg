// Non Player Characters (not to be confused with Non Fungible Tokens)

// Movement type:
// 0: Do not move (like a stone)
// 1: Move randomly (like a stupid guy)
// 2: Move in a set pattern (booooring)

function dline(args) {
    return {
        text: "ah",
        portrait: "Portraits_Bleu",
        emotion: "neutral",
        name: "Bleu",
        voice: false,
        script: false,
        ...args || {}
    }
}

// dline({ text: "", portrait: "Portraits_Bleu", emotion: "", name: "Bleu"})

let npcs = {
    default(args) {
        return {
            position: [8, 8],
            map: "test",
            alpha: 1,
            head: 0,
            skin: "evil",
            kofs: [0, 0, 0],
            dialogues: {
                1: {
                    "type": "normal",
                    "lines": [
                        dline({ text: "Hello this is a test dialogue", portrait: "Portraits_Bleu", emotion: "happy", name: "Bleu" }),
                        dline({ text: "Second text", portrait: "Portraits_Bleu", emotion: "neutral", name: "Bleu" }),
                        dline({ text: "Don't forget to subscribe to my channel", portrait: "Portraits_Bleu", emotion: "angry", name: "Bleu" }),
                    ],
                }
            },
            movement: 0,
            talk: false,
            path: false, // 0 down 1 left 2 right 3 up
            pathProgress: 0,

            movementTime: 0,
            walkingInterval: 0.5, // time between walks
            walkingSpeed: 1, // how long it takes to walk from one tile to another (in seconds)

            render(ctx) {
                let tileX = this.position[0];
                let tileY = this.position[1];

                let xAdjust = game.position[0] - width / 2 + 0.5;
                if (game.map == this.map) {
                    this.kofs[2] = Math.max(this.kofs[2] - delta / 166, 0);
                    ctx.drawImage(images[this.skin],
                        32 * Math.floor(walkTime), 32 * this.head, 32, 32,
                        ((zoom * scale) * (tileX + kofs[0] * kofs[2] - this.kofs[0] * (this.kofs[2] / this.walkingSpeed) - xAdjust)) - ((zoom - 1) * scale * (width / 2)),
                        (zoom * scale) * (tileY + kofs[1] * kofs[2] - this.kofs[1] * (this.kofs[2] / this.walkingSpeed) - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                        zswm, zswm)
                }
                if (this.talk == true) {
                    ctx.drawImage(images.talk,
                        ((zoom * scale) * (tileX + 1 + kofs[0] * kofs[2] - this.kofs[0] * (this.kofs[2] / this.walkingSpeed) - xAdjust)) - ((zoom - 1) * scale * (width / 2)),
                        (zoom * scale) * (tileY - 1 + kofs[1] * kofs[2] - this.kofs[1] * (this.kofs[2] / this.walkingSpeed) - (game.position[1] - 7.5)) - ((zoom - 1) * scale * 7),
                        zswm, zswm)
                }
            },

            ...args || {},
        }
    },
    blue(args) {
        return {
            ...npcs.default(),
            position: [5, 1],
            map: "map2",
            skin: "bleu",
            dialogues: {
                1: {
                    "type": "normal",
                    "lines": [
                        dline({ text: "Hii I'm Blue", portrait: "Portraits_Bleu", emotion: "happy", name: "Blue" }),
                        dline({ text: "No I'm not Bleu! I'm not you! I'm Blue!", portrait: "Portraits_Bleu", emotion: "angry", name: "Blue" }),
                        dline({ text: "Hey man, I think you're me.", portrait: "Portraits_Bleu", emotion: "neutral", name: "Bleu" }),
                        dline({ text: "I'm a greek emo. I hate you!!!", portrait: "Portraits_Bleu", emotion: "sad", name: "Blue" }),
                        dline({ text: "Why are you blue like me that can't be you're a clone", portrait: "Portraits_Bleu", emotion: "sad", name: "Blue" }),
                        dline({ text: "Idiots.", portrait: "Portraits_Corelle", emotion: "neutral", name: "The girl", script: () => { openShop("placeholder"); } }),
                    ],
                }
            },
            movement: 1,
            ...args || {},

        }
    },
    evilskro(args) {
        return {
            ...npcs.default(),
            position: [17, 1],
            map: "test",
            skin: "skro",
            dialogues: {
                1: {
                    "type": "normal",
                    "lines": [
                        dline({ text: "I am friendly Skro.", portrait: "Portraits_Skro", emotion: "sad", name: "Skro", voice: "female_young" }),
                        dline({ text: "NO! I am evil Skro!!!", portrait: "Portraits_Skro", emotion: "angry", name: "Skro" }),
                        dline({ text: "Guys, I think he is evil!", portrait: "Portraits_Gau", emotion: "happy", name: "Gau" }),
                        dline({ text: "Spam is not allowed!", portrait: "Portraits_Gau", emotion: "angry", name: "Gau" }),
                        dline({ text: "Skro? More like oh no", portrait: "Portraits_Corelle", emotion: "neutral", name: "Corelle" }),
                        dline({ text: "Good Night.", portrait: "Portraits_Skro", emotion: "love", name: "oh no" }),
                        dline({
                            text: "Good Night.", portrait: "Portraits_Skro", emotion: "love", name: "oh no", script: () => {
                                startFight("nogameover", [["itsalive", 2, 0], ["itsalive", 2, 1], ["itsalive", 2, 2], ["nottoofresh", 0, 1]]);
                            } }),
                    ],
                }
            },
            movement: 1,
            ...args || {},

        }
    },
    cowboy(args) {
        return {
            ...npcs.default(),
            position: [15, 1],
            map: "test",
            skin: "skro",
            dialogues: {
                1: {
                    "type": "normal",
                    "lines": [
                        dline({ text: "Yeehaw! I'm a cowboy", portrait: "Portraits_Skro", emotion: "happy", name: "Skro" }),
                        dline({ text: "What? We are not in the Wild West?!", portrait: "Portraits_Skro", emotion: "disappointed", name: "Skro" }),
                        dline({ text: "Time to change that", portrait: "Portraits_Skro", emotion: "love", name: "Skro", script: () => { filterSepia(50); } }),
                        dline({ text: "BBQ, horses, tumbleweeds... the usual cowboy stuff.", portrait: "Portraits_Skro", emotion: "happy", name: "Skro" }),
                        dline({ text: "You're a robot.", portrait: "Portraits_Kokitozi", emotion: "angry", name: "Koki", script: () => { filterGray(50); } }),
                        dline({ text: "Beep boop.", portrait: "Portraits_Skro", emotion: "neutral", name: "Skro" }),
                        dline({ text: "I am the S-K-R-O-B-O-T-3 0 0 0 . . .", portrait: "Portraits_Skro", emotion: "love", name: "Skro" }),
                        dline({ text: "Sigh.", portrait: "Portraits_Kokitozi", emotion: "disappointed", name: "Koki", script: () => { clearFilter(); } }),
                    ],
                }
            },
            movement: 0,
            ...args || {},

        }
    },
    placeholder3(args) {
        return {
            ...npcs.default(),
            position: [3, 22],
            map: "test",
            skin: "bleu",
            dialogues: {
                1: ["normal", ["Ey", "Portraits_Bleu", "happy", "Bleu"],
                    ["Ayo (+1 Potion!)", "Portraits_Bleu", "angry", "Bleu", () => {
                        addItem("potion", 1);
                    }]]
            },
            movement: 2,
            walkingInterval: 0.2,
            path: [2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            ...args || {},

        }
    }
};