let items = {
    default(args) {
        return {
            source: "",
            name: "none",
            shopcost: 200,
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
            max: 99,
            effect: () => {
                let HealthBefore = args.player.HP;
                if (args.player.HP > 0)  args.player.HP += 50;
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
            max: 99,
            effect: () => {
                causeEffect(args.player, "none", 0);
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
            max: 99,
            effect: () => {
                let HealthBefore = args.player.HP;
                args.player.HP -= 999;
                if (args.player.HP > getStat(args.player.name.toLowerCase(), "maxHP")) args.player.HP = getStat(args.player.name.toLowerCase(), "maxHP");
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, 999, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }
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
            max: 99,
            effect: () => {
                let HealthBefore = args.player.HP
                let amount = Math.ceil(getStat(args.player.name.toLowerCase(), "maxHP") / 4);
                if (args.player.HP < 1) args.player.HP = amount;
                playSound("heal");
                if (args.player != undefined) {
                    positions[args.player.pos[0]][args.player.pos[1]].isOccupied = true;
                }
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, amount, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }
            },

            ...args || {},
        }
    },
    chicagopants(args) {
        return {
            ...items.default(),
            source: "scroll",
            name: "Chicago Pants",
            shopcost: 999999,
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