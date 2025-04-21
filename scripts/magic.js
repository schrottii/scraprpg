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
            ...magic.default(), cost: 4,
            source: "items/potion", name: "Cuyua", shopcost: 100,
            effect: () => {
                healPlayer(args.player, 20, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    cutema(args) {
        return {
            ...magic.default(), cost: 4,
            source: "items/potion", name: "Cutema", shopcost: 500,
            effect: () => {
                healAllPlayers(20, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    fisina(args) {
        return {
            ...magic.default(), cost: 3,
            source: "fire", name: "Fisina", shopcost: 100,
            battleonly: true, damage: 10, element: "fire",
            ...args || {},
        }
    },
    dasina(args) {
        return {
            ...magic.default(), cost: 3,
            source: "dark", name: "Dasina", shopcost: 100,
            battleonly: true, damage: 10, element: "dark",
            ...args || {},
        }
    },
}