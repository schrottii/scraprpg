let magic = {
    default(args) {
        return {
            source: "",
            name: "none",
            shopcost: 200,
            cost: 1, //EP
            battleonly: false,
            effect: () => {
                addWrenches(0);
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
                let HealthBefore = args.player.HP;
                if (args.player.HP > 0) args.player.HP += 20;
                if (args.player.HP > getStat(args.player.name.toLowerCase(), "maxHP")) args.player.HP = getStat(args.player.name.toLowerCase(), "maxHP");
                playSound("heal");
                if (args.anchor != undefined) {
                    battleNumber(args.anchor, 20, 0, args.offset);
                    updateBar(args.player.name.toLowerCase(), HealthBefore);
                }
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
                for (i in game.chars) {
                    let p = game.characters[game.chars[i]];
                    let HealthBefore = p.HP;
                    if (p.HP > 0) p.HP += 20;
                    if (p.HP > getStat(p.name.toLowerCase(), "maxHP")) p.HP = getStat(p.name.toLowerCase(), "maxHP");
                    playSound("heal");
                    if (args.anchor != undefined) {
                        battleNumber(args.anchor, 20, 0, args.offset);
                        updateBar(p.name.toLowerCase(), HealthBefore);
                    }
                }
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
            effect: () => {
                let HealthBefore = args.enemy.HP;
                args.enemy.HP -= 20;
                if (args.anchor != undefined) {
                    battleNumber(args.enemyAnchor, 20, 0, args.enemyOffset);
                    //updateBar(args.player.name.toLowerCase(), HealthBefore);
                }

                addParticle("fire", { anchor: args.enemyAnchor, offset: [args.enemyOffset[0], args.enemyOffset[1] + 56] })
            },

            ...args || {},
        }
    },
}