let items = {
    default(args) {
        return {
            source: "",
            name: "none",
            shopcost: 200,
            type: "electronic",
            clpi: 10,
            max: 99,
            story: false,
            self: false,
            type: false, // Equipment:
            // head, body, lhand, rhand, acc1, acc2
            stats: "none",
            effect: () => {
                addWrenches(0);
            },

            ...args || {},
        }
    },
    brickyleaf(args) {
        return {
            ...items.default(),
            source: "brickyleaf",
            name: "Bricky Leaf",
            shopcost: 500,
            type: "flower",
            max: 99,
            effect: () => {
                if (args.player.effect[0] == "poison") causeEffect(i, "none", 0);
                playSound("heal");
            },

            ...args || {},
        }
    },
    potion(args) {
        return {
            ...items.default(),
            source: "potion",
            name: "Small Potion",
            shopcost: 250,
            type: "potion",
            max: 99,
            effect: () => {
                let HealthBefore = args.player.HP;
                if (args.player.HP > 0) args.player.HP += 50;
                if (args.player.HP > getStat(args.player.name.toLowerCase(), "maxHP")) args.player.HP = getStat(args.player.name.toLowerCase(), "maxHP");
                playSound("heal");
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, 50, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }
            },

            ...args || {},
        }
    },
    peppytincture(args) {
        return {
            ...items.default(),
            source: "peppytincture",
            name: "Peppy Tincture",
            shopcost: 2000,
            type: "potion",
            max: 99,
            effect: () => {
                causeEffect(game.chars.indexOf(args.player.name.toLowerCase()), "none", 0);
                playSound("heal");
            },

            ...args || {},
        }
    },
    scroll(args) {
        return {
            ...items.default(),
            source: "scroll",
            name: "Scroll of Truth",
            shopcost: 999999,
            type: "book",
            max: 1,
            story: true,
            effect: () => {
                alert("This... should not happen.");
            },

            ...args || {},
        }
    },
    superswamp(args) {
        return {
            ...items.default(),
            source: "superswamp",
            name: "Super Swamp",
            shopcost: 1000,
            type: "flower",
            clpi: 60,
            max: 99,
            effect: () => {
                /*
                let HealthBefore = args.player.HP;
                args.player.HP -= 999;
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, 999, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }
                */
                causeEffect(game.chars.indexOf(args.player.name.toLowerCase()), "condemned", 2);
            },

            ...args || {},
        }
    },
    revive(args) {
        return {
            ...items.default(),
            source: "revive",
            name: "Revive Item",
            shopcost: 2500,
            type: "potion",
            max: 99,
            effect: () => {
                let HealthBefore = args.player.HP
                let amount = Math.ceil(getStat(args.player.name.toLowerCase(), "maxHP") / 4);
                if (args.player.HP < 1) args.player.HP = amount;
                playSound("heal");
                if (args.player != undefined && positions != undefined) {
                    positions[args.player.pos[0]][args.player.pos[1]].isOccupied = true;
                }
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, amount, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }

                addParticle("revive", { anchor: args.targetAnchor, offset: [args.targetOffset[0], args.targetOffset[1] + 64] })
            },

            ...args || {},
        }
    },
    chicagopants(args) {
        return {
            ...items.default(),
            source: "scroll",
            name: "Chicago Pants",
            shopcost: 200,
            type: "armor",
            max: 1,
            type: "body",
            stats: {
                "strength": 7,
                "maxHP": 4,
                "immune": ["poison", "acid", "burn"],
            },

            ...args || {},
        }
    },
}