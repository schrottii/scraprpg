let items = {
    default(args) {
        return {
            source: "",
            name: "none",
            shopcost: 200,
            max: 99,
            effect: () => {
                addWrenches(0);
            },

            ...args || {},
        }
    },
    brickyleaf(args) {
        return {
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
}