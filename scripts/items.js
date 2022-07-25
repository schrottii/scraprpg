let items = {
    default(args) {
        return {
            source: "",
            name: "none",
            shopcost: 200,
            max: 99,
            story: false,
            self: false,
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
                if (args.player.effect[0] == "poison") args.player.effect = ["none", 0];
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
                let HealthBefore = args.player.HP
                if (args.player.HP > 0)  args.player.HP += 50;
                if (args.player.HP > args.player.maxHP) args.player.HP = args.player.maxHP;
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
                args.player.effect = ["none", 0];
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
                let HealthBefore = args.player.HP
                args.player.HP -= 999;
                if (args.player.HP > args.player.maxHP) args.player.HP = args.player.maxHP;
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, 999, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }
            },

            ...args || {},
        }
    },
}