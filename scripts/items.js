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
                console.log("hey!!!");
                if (getPlayer(1).effect[0] == "poison") getPlayer(1).effect = ["none", 0];
            },

            ...args || {},
        }
    },
}