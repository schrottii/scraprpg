function addItem(name, amount = 1) {
    if (game.inventory[name] == undefined) {
        game.inventory[name] = 0;
    }
    if (game.inventory[name] >= items[name]().max) {
        return false;
    }
    if (game.inventory[name] + amount < items[name]().max) {
        game.inventory[name] += amount;
        return true;
    }
    else {
        game.inventory[name] = items[name]().max;
        return true;
    }
}

function removeItem(name, amount = 1) {
    game.inventory[name] -= amount;
    if (game.inventory[name] < 1 || game.inventory[name] == undefined) {
        delete game.inventory[name];
    }
}

function everyItem(){
    for (let item in items){
        game.inventory[item] = items[item]().max;
    }
}



//////////////////////////////////////////////////////////////////////////////////
// items
let items = {
    // DEFAULT AKA EXAMPLE
    default(args) {
        return {
            // general
            source: "book_empty",
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



    //////////////////////////////////////////////////////////////////////////////////
    // EQUIPMENT
    //////////////////////////////////////////////////////////////////////////////////
    // CRYSTALS
    crystalstrength(args) {
        return {
            ...items.default(),
            source: "crystal_strength", name: "Strength Crystal",
            shopcost: 1000, clpi: 33,
            type: "armor", piece: "acc2",
            stats: { "strength": 6 },
            ...args || {},
        }
    },
    
    crystaldefense(args) {
        return {
            ...items.default(),
            source: "crystal_defense", name: "Defense Crystal",
            shopcost: 1000, clpi: 33,
            type: "armor", piece: "acc2",
            stats: { "def": 6 },
            ...args || {},
        }
    },
    
    crystalagility(args) {
        return {
            ...items.default(),
            source: "crystal_agility", name: "Agility Crystal",
            shopcost: 1000, clpi: 33,
            type: "armor", piece: "acc2",
            stats: { "agi": 6 },
            ...args || {},
        }
    },
    
    crystalevasion(args) {
        return {
            ...items.default(),
            source: "crystal_evasion", name: "Evasion Crystal",
            shopcost: 1000, clpi: 33,
            type: "armor", piece: "acc2",
            stats: { "eva": 6 },
            ...args || {},
        }
    },
    
    crystalcrit(args) {
        return {
            ...items.default(),
            source: "crystal_crit", name: "Crit Crystal",
            shopcost: 1000, clpi: 33,
            type: "armor", piece: "acc2",
            stats: { "crt": 6 },
            ...args || {},
        }
    },
    
    crystalluck(args) {
        return {
            ...items.default(),
            source: "crystal_luck", name: "Luck Crystal",
            shopcost: 1000, clpi: 33,
            type: "armor", piece: "acc2",
            stats: { "luk": 6 },
            ...args || {},
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    // ALL THE MANY SPELL BOOKS
    // any are worth most clpi (cuz random), M is best ratio. dark and ecto more expensive
    spellbookanys(args) {
        return {
            ...items.default(),
            source: "book_any", name: "Global Spell Book (S)", type: "book",
            shopcost: 500, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "any", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookanym(args) {
        return {
            ...items.default(),
            source: "book_any", name: "Global Spell Book (M)", type: "book",
            shopcost: 1000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "any", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookanyl(args) {
        return {
            ...items.default(),
            source: "book_any", name: "Global Spell Book (L)", type: "book",
            shopcost: 3000, clpi: 100, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "any", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookdarks(args) {
        return {
            ...items.default(),
            source: "book_dark", name: "Dark Spell Book (S)", type: "book",
            shopcost: 1500, clpi: 25, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "dark", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookdarkm(args) {
        return {
            ...items.default(),
            source: "book_dark", name: "Dark Spell Book (M)", type: "book",
            shopcost: 3000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "dark", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookdarkl(args) {
        return {
            ...items.default(),
            source: "book_dark", name: "Dark Spell Book (L)", type: "book",
            shopcost: 7500, clpi: 75, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "dark", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookearths(args) {
        return {
            ...items.default(),
            source: "book_earth", name: "Earth Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "earth", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },
    
    spellbookearthm(args) {
        return {
            ...items.default(),
            source: "book_earth", name: "Earth Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 30, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "earth", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookearthl(args) {
        return {
            ...items.default(),
            source: "book_earth", name: "Earth Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "earth", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookectoplasms(args) {
        return {
            ...items.default(),
            source: "book_ectoplasm", name: "Ectoplasm Spell Book (S)", type: "book",
            shopcost: 1500, clpi: 25, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "ectoplasm", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookectoplasmm(args) {
        return {
            ...items.default(),
            source: "book_ectoplasm", name: "Ectoplasm Spell Book (M)", type: "book",
            shopcost: 3000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "ectoplasm", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookectoplasml(args) {
        return {
            ...items.default(),
            source: "book_ectoplasm", name: "Ectoplasm Spell Book (L)", type: "book",
            shopcost: 7500, clpi: 75, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "ectoplasm", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookfires(args) {
        return {
            ...items.default(),
            source: "book_fire", name: "Fire Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "fire", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookfirem(args) {
        return {
            ...items.default(),
            source: "book_fire", name: "Fire Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 30, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "fire", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookfirel(args) {
        return {
            ...items.default(),
            source: "book_fire", name: "Fire Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "fire", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookheals(args) {
        return {
            ...items.default(),
            source: "book_heal", name: "Heal Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 25, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "heal", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookhealm(args) {
        return {
            ...items.default(),
            source: "book_heal", name: "Heal Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "heal", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookheall(args) {
        return {
            ...items.default(),
            source: "book_heal", name: "Heal Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 75, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "heal", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbooklights(args) {
        return {
            ...items.default(),
            source: "book_light", name: "Light Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "light", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbooklightm(args) {
        return {
            ...items.default(),
            source: "book_light", name: "Light Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 30, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "light", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbooklightl(args) {
        return {
            ...items.default(),
            source: "book_light", name: "Light Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "light", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbooklightnings(args) {
        return {
            ...items.default(),
            source: "book_lightning", name: "Lightning Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "lightning", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbooklightningm(args) {
        return {
            ...items.default(),
            source: "book_lightning", name: "Lightning Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 30, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "lightning", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbooklightningl(args) {
        return {
            ...items.default(),
            source: "book_lightning", name: "Lightning Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "lightning", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookphysicals(args) {
        return {
            ...items.default(),
            source: "book_physical", name: "Physical Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 15, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "physical", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookphysicalm(args) {
        return {
            ...items.default(),
            source: "book_physical", name: "Physical Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 25, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "physical", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookphysicall(args) {
        return {
            ...items.default(),
            source: "book_physical", name: "Physical Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 40, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "physical", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookwaters(args) {
        return {
            ...items.default(),
            source: "book_water", name: "Water Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "water", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookwaterm(args) {
        return {
            ...items.default(),
            source: "book_water", name: "Water Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 30, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "water", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookwaterl(args) {
        return {
            ...items.default(),
            source: "book_water", name: "Water Spell Book (M)", type: "book",
            shopcost: 5000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "water", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookwinds(args) {
        return {
            ...items.default(),
            source: "book_wind", name: "Wind Spell Book (S)", type: "book",
            shopcost: 1000, clpi: 20, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "wind", 0);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookwindm(args) {
        return {
            ...items.default(),
            source: "book_wind", name: "Wind Spell Book (M)", type: "book",
            shopcost: 2000, clpi: 30, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "wind", 1);
                playSound("heal");
            },
            ...args || {},
        }
    },

    spellbookwindl(args) {
        return {
            ...items.default(),
            source: "book_wind", name: "Wind Spell Book (L)", type: "book",
            shopcost: 5000, clpi: 50, self: true,
            effect: () => {
                awardRandomSpell(args.player.name.toLowerCase(), "wind", 2);
                playSound("heal");
            },
            ...args || {},
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    // OLDIES
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