let magic = {
    default(args) {
        return {
            cost: 1, //EP

            source: "",
            name: "none",
            shopcost: 200,

            battleonly: false,
            // damage
            // element

            effect: () => {
                
            },
            ...args || {},
        }
    },
    cuyua(args) {
        return {
            ...magic.default(), cost: 4, target: "char",
            source: "items/potion", name: "Cuyua", shopcost: 100,
            effect: () => {
                healPlayer(args.player, 20, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    cutema(args) {
        return {
            ...magic.default(), cost: 4, target: "char",
            source: "items/potion", name: "Cutema", shopcost: 500,
            effect: () => {
                healAllPlayers(20, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    fisina(args) {
        return {
            ...magic.default(), cost: 3, target: "enemy",
            source: "fire", name: "Fisina", shopcost: 100,
            battleonly: true, damage: 10, element: "fire",
            ...args || {},
        }
    },
    fisinar(args) {
        return magic.fisina({ args, name: "Fisinar", cost: 6, shopcost: 200, damage: 20 });
    },
    fisinago(args) {
        return magic.fisina({ args, name: "Fisinago", cost: 10, shopcost: 500, damage: 50 });
    },
    dasina(args) {
        return { target: "enemy",
            ...magic.default(), cost: 3, target: "enemy",
            source: "dark", name: "Dasina", shopcost: 100,
            battleonly: true, damage: 10, element: "dark",
            ...args || {},
        }
    },
    dasinar(args) {
        return magic.fisina({ args, name: "Dasinar", cost: 6, shopcost: 200, damage: 20 });
    },
    dasinago(args) {
        return magic.fisina({ args, name: "Dasinago", cost: 10, shopcost: 500, damage: 50 });
    },
    lisina(args) {
        return {
            ...magic.default(), cost: 3, target: "enemy",
            source: "light", name: "Lisina", shopcost: 100,
            battleonly: true, damage: 10, element: "light",
            ...args || {},
        }
    },
}