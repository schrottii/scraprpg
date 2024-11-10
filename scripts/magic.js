let magic = {
    default(args) {
        return {
            source: "",
            name: "none",
            shopcost: 200,
            cost: 1, //EP
            battleonly: false,
            effect: () => {
                
            },

            ...args || {},
        }
    },
    cuyua(args) {
        return {
            ...magic.default(),
            source: "items/potion",
            name: "Cuyua",
            shopcost: 500,
            effect: () => {
                healPlayer(args.player, 20, args.anchor, args.offset);
            },

            ...args || {},
        }
    },
    cutema(args) {
        return {
            ...magic.default(),
            source: "items/potion",
            name: "Cutema",
            shopcost: 500,
            cost: 4,
            effect: () => {
                healAllPlayers(20, args.anchor, args.offset);
            },

            ...args || {},
        }
    },
    fisina(args) {
        return {
            ...magic.default(),
            source: "fire",
            name: "Fisina",
            shopcost: 500,
            battleonly: true,
            cost: 3,
            damage: 20,
            effect: () => {
                if (args.enemyAnchor != undefined) {
                    battleNumber(args.enemyAnchor, 20, 0, args.enemyOffset);
                    //updateBar(args.player.name.toLowerCase(), HealthBefore);
                }

                addParticle("fire", { anchor: args.enemyAnchor, offset: [args.enemyOffset[0], args.enemyOffset[1] + 56] })
            },

            ...args || {},
        }
    },
}