let magic = {
    default(args) {
        return {
            cost: 1, //EP

            source: "items/potion",
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
    /*
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
    */



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // FIRE (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // fire is one of the strongest, dealing good damage and having fair prices
    fisina(args) {
        return {
            ...magic.default(), name: "Fisina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 2, shopcost: 100, damage: 10,
            ...args || {},
        }
    },
    fisinar(args) {
        return magic.fisina({ args, name: "Fisinar", cost: 6, shopcost: 200, damage: 20 });
    },
    fisinago(args) {
        return magic.fisina({ args, name: "Fisinago", cost: 15, shopcost: 500, damage: 50 });
    },

    fihala(args) {
        return magic.fisina({ args, name: "Fihala", target: "enemies", cost: 6, shopcost: 300, damage: 8 });
    },
    fihalar(args) {
        return magic.fisina({ args, name: "Fihalar", target: "enemies", cost: 16, shopcost: 500, damage: 16 });
    },
    fihalago(args) {
        return magic.fisina({ args, name: "Fihalago", target: "enemies", cost: 40, shopcost: 1000, damage: 40 });
    },

    figola(args) {
        return magic.fisina({ args, name: "Figola", target: "global", cost: 8, shopcost: 300, damage: 10 });
    },
    figolar(args) {
        return magic.fisina({ args, name: "Figolar", target: "global", cost: 16, shopcost: 500, damage: 16 });
    },
    figolago(args) {
        return magic.fisina({ args, name: "Figolago", target: "global", cost: 30, shopcost: 1000, damage: 40 });
    },

    fidicea(args) {
        return magic.fisina({ args, name: "Fidicea", target: "random" });
    },
    fidicear(args) {
        return magic.fisina({ args, name: "Fidicear", target: "random", cost: 6, shopcost: 200, damage: 20 });
    },
    fidiceago(args) {
        return magic.fisina({ args, name: "Fidiceago", target: "random", cost: 15, shopcost: 500, damage: 50 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // DARK (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // dark is generally expensive, but it excels in the global category (self-harm yay!!!)
    dasina(args) {
        return {
            ...magic.default(), name: "Dasina", source: "dark", element: "dark",
            battleonly: true, target: "enemy",
            cost: 4, shopcost: 100, damage: 10,
            ...args || {},
        }
    },
    dasinar(args) {
        return magic.dasina({ args, name: "Dasinar", cost: 8, shopcost: 200, damage: 20 });
    },
    dasinago(args) {
        return magic.dasina({ args, name: "Dasinago", cost: 20, shopcost: 500, damage: 50 });
    },

    dahala(args) {
        return magic.dasina({ args, name: "Dahala", target: "enemies", cost: 12, shopcost: 300, damage: 8 });
    },
    dahalar(args) {
        return magic.dasina({ args, name: "Dahalar", target: "enemies", cost: 25, shopcost: 500, damage: 16 });
    },
    dahalago(args) {
        return magic.dasina({ args, name: "Dahalago", target: "enemies", cost: 50, shopcost: 1000, damage: 40 });
    },

    dagola(args) {
        return magic.dasina({ args, name: "Dagola", target: "global", cost: 2, shopcost: 300, damage: 10 });
    },
    dagolar(args) {
        return magic.dasina({ args, name: "Dagolar", target: "global", cost: 4, shopcost: 500, damage: 20 });
    },
    dagolago(args) {
        return magic.dasina({ args, name: "Dagolago", target: "global", cost: 10, shopcost: 1000, damage: 70 });
    },

    dadicea(args) {
        return magic.dasina({ args, name: "Dadicea", target: "random" });
    },
    dadicear(args) {
        return magic.dasina({ args, name: "Dadicear", target: "random", cost: 8, shopcost: 200, damage: 20 });
    },
    dadiceago(args) {
        return magic.dasina({ args, name: "Dadiceago", target: "random", cost: 20, shopcost: 500, damage: 50 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // LIGHT (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // it's light... lite... cheap but weak. multiple enemies is pretty good, global exceptionally bad
    lisina(args) {
        return {
            ...magic.default(), name: "Lisina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 1, shopcost: 100, damage: 2,
            ...args || {},
        }
    },
    lisinar(args) {
        return magic.lisina({ args, name: "Lisinar", cost: 2, shopcost: 200, damage: 6 });
    },
    lisinago(args) {
        return magic.lisina({ args, name: "Lisinago", cost: 3, shopcost: 500, damage: 20 });
    },

    lihala(args) {
        return magic.lisina({ args, name: "Lihala", target: "enemies", cost: 2, shopcost: 300, damage: 2 });
    },
    lihalar(args) {
        return magic.lisina({ args, name: "Lihalar", target: "enemies", cost: 4, shopcost: 500, damage: 4 });
    },
    lihalago(args) {
        return magic.lisina({ args, name: "Lihalago", target: "enemies", cost: 3, shopcost: 1000, damage: 10 });
    },

    ligola(args) {
        return magic.lisina({ args, name: "Ligola", target: "global", cost: 4, shopcost: 300, damage: 2 });
    },
    ligolar(args) {
        return magic.lisina({ args, name: "Ligolar", target: "global", cost: 4, shopcost: 500, damage: 3 });
    },
    ligolago(args) {
        return magic.lisina({ args, name: "Ligolago", target: "global", cost: 3, shopcost: 1000, damage: 8 });
    },

    lidicea(args) {
        return magic.lisina({ args, name: "Lidicea", target: "random" });
    },
    lidicear(args) {
        return magic.lisina({ args, name: "Lidicear", target: "random", cost: 2, shopcost: 200, damage: 6 });
    },
    lidiceago(args) {
        return magic.lisina({ args, name: "Lidiceago", target: "random", cost: 3, shopcost: 500, damage: 20 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // WATER (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // weak, but multiple targets stuff is cheap
    wasina(args) {
        return {
            ...magic.default(), name: "Wasina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 2, shopcost: 100, damage: 4,
            ...args || {},
        }
    },
    wasinar(args) {
        return magic.wasina({ args, name: "Wasinar", cost: 6, shopcost: 200, damage: 8 });
    },
    wasinago(args) {
        return magic.wasina({ args, name: "Wasinago", cost: 15, shopcost: 500, damage: 15 });
    },

    wahala(args) {
        return magic.wasina({ args, name: "Wahala", target: "enemies", cost: 2, shopcost: 300, damage: 8 });
    },
    wahalar(args) {
        return magic.wasina({ args, name: "Wahalar", target: "enemies", cost: 7, shopcost: 500, damage: 16 });
    },
    wahalago(args) {
        return magic.wasina({ args, name: "Wahalago", target: "enemies", cost: 16, shopcost: 1000, damage: 30 });
    },

    wagola(args) {
        return magic.wasina({ args, name: "Wagola", target: "global", cost: 3, shopcost: 300, damage: 10 });
    },
    wagolar(args) {
        return magic.wasina({ args, name: "Wagolar", target: "global", cost: 8, shopcost: 500, damage: 20 });
    },
    wagolago(args) {
        return magic.wasina({ args, name: "Wagolago", target: "global", cost: 20, shopcost: 1000, damage: 60 });
    },

    wadicea(args) {
        return magic.wasina({ args, name: "Wadicea", target: "random" });
    },
    wadicear(args) {
        return magic.wasina({ args, name: "Wadicear", target: "random", cost: 6, shopcost: 200, damage: 8 });
    },
    wadiceago(args) {
        return magic.wasina({ args, name: "Wadiceago", target: "random", cost: 15, shopcost: 500, damage: 15 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // ELECTRIC (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // normal values
    elsina(args) {
        return {
            ...magic.default(), name: "Elsina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 3, shopcost: 100, damage: 6,
            ...args || {},
        }
    },
    elsinar(args) {
        return magic.elsina({ args, name: "Elsinar", cost: 8, shopcost: 200, damage: 16 });
    },
    elsinago(args) {
        return magic.elsina({ args, name: "Elsinago", cost: 20, shopcost: 500, damage: 40 });
    },

    elhala(args) {
        return magic.elsina({ args, name: "Elhala", target: "enemies", cost: 9, shopcost: 300, damage: 8 });
    },
    elhalar(args) {
        return magic.elsina({ args, name: "Elhalar", target: "enemies", cost: 24, shopcost: 500, damage: 16 });
    },
    elhalago(args) {
        return magic.elsina({ args, name: "Elhalago", target: "enemies", cost: 50, shopcost: 1000, damage: 40 });
    },

    elgola(args) {
        return magic.elsina({ args, name: "Elgola", target: "global", cost: 8, shopcost: 300, damage: 8 });
    },
    elgolar(args) {
        return magic.elsina({ args, name: "Elgolar", target: "global", cost: 20, shopcost: 500, damage: 16 });
    },
    elgolago(args) {
        return magic.elsina({ args, name: "Elgolago", target: "global", cost: 40, shopcost: 1000, damage: 40 });
    },

    eldicea(args) {
        return magic.elsina({ args, name: "Eldicea", target: "random" });
    },
    eldicear(args) {
        return magic.elsina({ args, name: "Eldicear", target: "random", cost: 8, shopcost: 200, damage: 16 });
    },
    eldiceago(args) {
        return magic.elsina({ args, name: "Eldiceago", target: "random", cost: 20, shopcost: 500, damage: 40 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // WIND (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // normal values
    wisina(args) {
        return {
            ...magic.default(), name: "Wisina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 3, shopcost: 100, damage: 6,
            ...args || {},
        }
    },
    wisinar(args) {
        return magic.wisina({ args, name: "Wisinar", cost: 8, shopcost: 200, damage: 16 });
    },
    wisinago(args) {
        return magic.wisina({ args, name: "Wisinago", cost: 20, shopcost: 500, damage: 40 });
    },

    wihala(args) {
        return magic.wisina({ args, name: "Wihala", target: "enemies", cost: 9, shopcost: 300, damage: 8 });
    },
    wihalar(args) {
        return magic.wisina({ args, name: "Wihalar", target: "enemies", cost: 24, shopcost: 500, damage: 16 });
    },
    wihalago(args) {
        return magic.wisina({ args, name: "Wihalago", target: "enemies", cost: 50, shopcost: 1000, damage: 40 });
    },

    wigola(args) {
        return magic.wisina({ args, name: "Wigola", target: "global", cost: 8, shopcost: 300, damage: 8 });
    },
    wigolar(args) {
        return magic.wisina({ args, name: "Wigolar", target: "global", cost: 20, shopcost: 500, damage: 16 });
    },
    wigolago(args) {
        return magic.wisina({ args, name: "Wigolago", target: "global", cost: 40, shopcost: 1000, damage: 40 });
    },

    widicea(args) {
        return magic.wisina({ args, name: "Widicea", target: "random" });
    },
    widicear(args) {
        return magic.wisina({ args, name: "Widicear", target: "random", cost: 8, shopcost: 200, damage: 16 });
    },
    widiceago(args) {
        return magic.wisina({ args, name: "Widiceago", target: "random", cost: 20, shopcost: 500, damage: 40 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // EARTH (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // normal values
    rosina(args) {
        return {
            ...magic.default(), name: "Rosina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 3, shopcost: 100, damage: 6,
            ...args || {},
        }
    },
    rosinar(args) {
        return magic.rosina({ args, name: "Rosinar", cost: 8, shopcost: 200, damage: 16 });
    },
    rosinago(args) {
        return magic.rosina({ args, name: "Rosinago", cost: 20, shopcost: 500, damage: 40 });
    },

    rohala(args) {
        return magic.rosina({ args, name: "Rohala", target: "enemies", cost: 9, shopcost: 300, damage: 8 });
    },
    rohalar(args) {
        return magic.rosina({ args, name: "Rohalar", target: "enemies", cost: 24, shopcost: 500, damage: 16 });
    },
    rohalago(args) {
        return magic.rosina({ args, name: "Rohalago", target: "enemies", cost: 50, shopcost: 1000, damage: 40 });
    },

    rogola(args) {
        return magic.rosina({ args, name: "Rogola", target: "global", cost: 8, shopcost: 300, damage: 8 });
    },
    rogolar(args) {
        return magic.rosina({ args, name: "Rogolar", target: "global", cost: 20, shopcost: 500, damage: 16 });
    },
    rogolago(args) {
        return magic.rosina({ args, name: "Rogolago", target: "global", cost: 40, shopcost: 1000, damage: 40 });
    },

    rodicea(args) {
        return magic.rosina({ args, name: "Rodicea", target: "random" });
    },
    rodicear(args) {
        return magic.rosina({ args, name: "Rodicear", target: "random", cost: 8, shopcost: 200, damage: 16 });
    },
    rodiceago(args) {
        return magic.rosina({ args, name: "Rodiceago", target: "random", cost: 20, shopcost: 500, damage: 40 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // PHYSICAL (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // normal values
    pisina(args) {
        return {
            ...magic.default(), name: "Pisina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 3, shopcost: 100, damage: 6,
            ...args || {},
        }
    },
    pisinar(args) {
        return magic.pisina({ args, name: "Pisinar", cost: 8, shopcost: 200, damage: 16 });
    },
    pisinago(args) {
        return magic.pisina({ args, name: "Pisinago", cost: 20, shopcost: 500, damage: 40 });
    },

    pihala(args) {
        return magic.pisina({ args, name: "Pihala", target: "enemies", cost: 9, shopcost: 300, damage: 8 });
    },
    pihalar(args) {
        return magic.pisina({ args, name: "Pihalar", target: "enemies", cost: 24, shopcost: 500, damage: 16 });
    },
    pihalago(args) {
        return magic.pisina({ args, name: "Pihalago", target: "enemies", cost: 50, shopcost: 1000, damage: 40 });
    },

    pigola(args) {
        return magic.pisina({ args, name: "Pigola", target: "global", cost: 8, shopcost: 300, damage: 8 });
    },
    pigolar(args) {
        return magic.pisina({ args, name: "Pigolar", target: "global", cost: 20, shopcost: 500, damage: 16 });
    },
    pigolago(args) {
        return magic.pisina({ args, name: "Pigolago", target: "global", cost: 40, shopcost: 1000, damage: 40 });
    },

    pidicea(args) {
        return magic.pisina({ args, name: "Pidicea", target: "random" });
    },
    pidicear(args) {
        return magic.pisina({ args, name: "Pidicear", target: "random", cost: 8, shopcost: 200, damage: 16 });
    },
    pidiceago(args) {
        return magic.pisina({ args, name: "Pidiceago", target: "random", cost: 20, shopcost: 500, damage: 40 });
    },



    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // ECTOPLASM (4 x 3 = 12)
    // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    // higher cost
    ecsina(args) {
        return {
            ...magic.default(), name: "Ecsina", source: "fire", element: "fire",
            battleonly: true, target: "enemy",
            cost: 5, shopcost: 100, damage: 6,
            ...args || {},
        }
    },
    ecsinar(args) {
        return magic.ecsina({ args, name: "Ecsinar", cost: 8, shopcost: 200, damage: 20 });
    },
    ecsinago(args) {
        return magic.ecsina({ args, name: "Ecsinago", cost: 20, shopcost: 500, damage: 60 });
    },

    echala(args) {
        return magic.ecsina({ args, name: "Echala", target: "enemies", cost: 9, shopcost: 300, damage: 20 });
    },
    echalar(args) {
        return magic.ecsina({ args, name: "Echalar", target: "enemies", cost: 24, shopcost: 500, damage: 50 });
    },
    echalago(args) {
        return magic.ecsina({ args, name: "Echalago", target: "enemies", cost: 50, shopcost: 1000, damage: 90 });
    },

    ecgola(args) {
        return magic.ecsina({ args, name: "Ecgola", target: "global", cost: 8, shopcost: 300, damage: 16 });
    },
    ecgolar(args) {
        return magic.ecsina({ args, name: "Ecgolar", target: "global", cost: 20, shopcost: 500, damage: 40 });
    },
    ecgolago(args) {
        return magic.ecsina({ args, name: "Ecgolago", target: "global", cost: 40, shopcost: 1000, damage: 80 });
    },

    ecdicea(args) {
        return magic.ecsina({ args, name: "Ecdicea", target: "random" });
    },
    ecdicear(args) {
        return magic.ecsina({ args, name: "Ecdicear", target: "random", cost: 8, shopcost: 200, damage: 20 });
    },
    ecdiceago(args) {
        return magic.ecsina({ args, name: "Ecdiceago", target: "random", cost: 20, shopcost: 500, damage: 60 });
    },
}