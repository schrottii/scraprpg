let items = {
    default(args) {
        return {
            // general
            source: "",
            name: "none",
            type: "electronic",
            max: 99, // how many you can have at most

            // shop
            shopcost: 200,
            clpi: 10, // customer level point increase

            // optional bools
            story: false, // key/story items
            self: false,
            
            // Equipment:
            // head, body, lhand, rhand, acc1, acc2
            piece: "none",
            stats: "none",
            effect: () => {
                //addWrenches(0); <-- example
            },

            ...args || {},
        }
    },
    brickyleaf(args) {
        return {
            ...items.default(),
            source: "brickyleaf",
            name: "Bricky Leaf",
            type: "flower",
            max: 99,
            shopcost: 500,
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
            type: "potion",
            max: 99,
            shopcost: 250,
            effect: () => {
                healPlayer(args.player, 50, args.anchor, args.offset);
            },

            ...args || {},
        }
    },
    peppytincture(args) {
        return {
            ...items.default(),
            source: "peppytincture",
            name: "Peppy Tincture",
            type: "potion",
            max: 99,
            shopcost: 2000,
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
            type: "book",
            max: 1,
            shopcost: 999999,
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
            type: "flower",
            max: 99,
            shopcost: 1000,
            clpi: 60,
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
            type: "potion",
            max: 99,
            shopcost: 2500,
            effect: () => {
                let HealthBefore = args.player.HP
                let amount = Math.ceil(getStat(args.player.name, "maxHP") / 4);
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
            type: "armor",
            max: 1,
            shopcost: 200,
            piece: "body",
            stats: {
                "strength": 7,
                "maxHP": 4,
                "immune": ["poison", "acid", "burn"],
            },

            ...args || {},
        }
    },
}