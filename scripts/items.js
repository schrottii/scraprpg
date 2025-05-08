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
    // GENERIC ELEMENT ARMOR + SWORD (4 x 9)
    // dark: unlucky and risky
    headdark(args) {
        return {
            ...items.default(),
            source: "head_dark", name: "Dark Head", element: "dark",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 2, "crt": 12, "luk": -3 }, ...args || {},
        }
    },
    bodydark(args) {
        return {
            ...items.default(),
            source: "body_dark", name: "Dark Body", element: "dark",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 3, "agi": 12, "luk": -3 }, ...args || {},
        }
    },
    sworddark(args) {
        return {
            ...items.default(),
            source: "sword_dark", name: "Dark Sword", element: "dark",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 10, "luk": -3 }, ...args || {},
        }
    },
    shielddark(args) {
        return {
            ...items.default(),
            source: "shield_dark", name: "Dark Shield", element: "dark",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "eva": 10, "strength": 2, "luk": -2 }, ...args || {},
        }
    },
    
    // earth: strong but slow
    headearth(args) {
        return {
            ...items.default(),
            source: "head_earth", name: "Earth Head", element: "earth",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 6, "agi": -5 }, ...args || {},
        }
    },
    bodyearth(args) {
        return {
            ...items.default(),
            source: "body_earth", name: "Earth Body", element: "earth",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 5 }, ...args || {},
        }
    },
    swordearth(args) {
        return {
            ...items.default(),
            source: "sword_earth", name: "Earth Sword", element: "earth",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 10, "agi": -5 }, ...args || {},
        }
    },
    shieldearth(args) {
        return {
            ...items.default(),
            source: "shield_earth", name: "Earth Shield", element: "earth",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "eva": 10 }, ...args || {},
        }
    },
    
    // ectoplasm: soft but hard to hit
    headectoplasm(args) {
        return {
            ...items.default(),
            source: "head_ectoplasm", name: "Ectoplasm Head", element: "ectoplasm",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": -6, "crt": 18 }, ...args || {},
        }
    },
    bodyectoplasm(args) {
        return {
            ...items.default(),
            source: "body_ectoplasm", name: "Ectoplasm Body", element: "ectoplasm",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 1, "agi": 15 }, ...args || {},
        }
    },
    swordectoplasm(args) {
        return {
            ...items.default(),
            source: "sword_ectoplasm", name: "Ectoplasm Sword", element: "ectoplasm",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 8, "crt": 5 }, ...args || {},
        }
    },
    shieldectoplasm(args) {
        return {
            ...items.default(),
            source: "shield_ectoplasm", name: "Ectoplasm Shield", element: "ectoplasm",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "eva": 20, "def": -6 }, ...args || {},
        }
    },

    // fire: normal
    headfire(args) {
        return {
            ...items.default(),
            source: "head_fire", name: "Fire Head", element: "fire",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 3, "crt": 5 }, ...args || {},
        }
    },
    bodyfire(args) {
        return {
            ...items.default(),
            source: "body_fire", name: "Fire Body", element: "fire",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 3, "agi": 10 }, ...args || {},
        }
    },
    swordfire(args) {
        return {
            ...items.default(),
            source: "sword_fire", name: "Fire Sword", element: "fire",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 8 }, ...args || {},
        }
    },
    shieldfire(args) {
        return {
            ...items.default(),
            source: "shield_fire", name: "Fire Shield", element: "fire",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "eva": 10 }, ...args || {},
        }
    },
    
    // light: blessed speed
    headlight(args) {
        return {
            ...items.default(),
            source: "head_light", name: "Light Head", element: "light",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "eva": 3, "crt": 5 }, ...args || {},
        }
    },
    bodylight(args) {
        return {
            ...items.default(),
            source: "body_light", name: "Light Body", element: "light",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "eva": 3, "agi": 10 }, ...args || {},
        }
    },
    swordlight(args) {
        return {
            ...items.default(),
            source: "sword_light", name: "Light Sword", element: "light",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 6, "agi": 2 }, ...args || {},
        }
    },
    shieldlight(args) {
        return {
            ...items.default(),
            source: "shield_light", name: "Light Shield", element: "light",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "agi": 10 }, ...args || {},
        }
    },
    
    // lightning: normal
    headlightning(args) {
        return {
            ...items.default(),
            source: "head_lightning", name: "Lightning Head", element: "lightning",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 3, "crt": 5 }, ...args || {},
        }
    },
    bodylightning(args) {
        return {
            ...items.default(),
            source: "body_lightning", name: " Body", element: "lightning",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 3, "agi": 10 }, ...args || {},
        }
    },
    swordlightning(args) {
        return {
            ...items.default(),
            source: "sword_lightning", name: "Lightning Sword", element: "lightning",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 8 }, ...args || {},
        }
    },
    shieldlightning(args) {
        return {
            ...items.default(),
            source: "shield_lightning", name: "Lightning Shield", element: "lightning",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "eva": 10 }, ...args || {},
        }
    },
    
    // physical: damage
    headphysical(args) {
        return {
            ...items.default(),
            source: "head_physical", name: "Physical Head", element: "physical",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 3, "strength": 5 }, ...args || {},
        }
    },
    bodyphysical(args) {
        return {
            ...items.default(),
            source: "body_physical", name: "Physical Body", element: "physical",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 3, "strength": 5 }, ...args || {},
        }
    },
    swordphysical(args) {
        return {
            ...items.default(),
            source: "sword_physical", name: "Physical Sword", element: "physical",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 10 }, ...args || {},
        }
    },
    shieldphysical(args) {
        return {
            ...items.default(),
            source: "shield_physical", name: "Physical Shield", element: "physical",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "strength": 5 }, ...args || {},
        }
    },
    
    // water: normal
    headwater(args) {
        return {
            ...items.default(),
            source: "head_water", name: "Water Head", element: "water",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 3, "crt": 5 }, ...args || {},
        }
    },
    bodywater(args) {
        return {
            ...items.default(),
            source: "body_water", name: "Water Body", element: "water",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 3, "agi": 10 }, ...args || {},
        }
    },
    swordwater(args) {
        return {
            ...items.default(),
            source: "sword_water", name: "Water Sword", element: "water",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 8 }, ...args || {},
        }
    },
    shieldwater(args) {
        return {
            ...items.default(),
            source: "shield_water", name: "Water Shield", element: "water",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "eva": 10 }, ...args || {},
        }
    },
    
    // wind: agility
    headwind(args) {
        return {
            ...items.default(),
            source: "head_wind", name: "Wind Head", element: "wind",
            shopcost: 1000, type: "armor", piece: "head",
            stats: { "def": 2, "agi": 8 }, ...args || {},
        }
    },
    bodywind(args) {
        return {
            ...items.default(),
            source: "body_wind", name: "Wind Body", element: "wind",
            shopcost: 1000, type: "armor", piece: "body",
            stats: { "def": 2, "agi": 12 }, ...args || {},
        }
    },
    swordwind(args) {
        return {
            ...items.default(),
            source: "sword_wind", name: "Wind Sword", element: "wind",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 4, "agi": 8 }, ...args || {},
        }
    },
    shieldwind(args) {
        return {
            ...items.default(),
            source: "shield_wind", name: "Wind Shield", element: "wind",
            shopcost: 1000, type: "armor", piece: "lhand",
            stats: { "agi": 16 }, ...args || {},
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    // OP SETS
    headinferno(args) {
        return {
            ...items.default(),
            source: "head_inferno", name: "INFERNO HEAD", element: "fire",
            shopcost: 99999, type: "armor", piece: "head",
            stats: { "def": 40, "strength": 40, "immune": "burn" }, ...args || {},
        }
    },
    bodyinferno(args) {
        return {
            ...items.default(),
            source: "body_inferno", name: "INFERNO BODY", element: "fire",
            shopcost: 99999, type: "armor", piece: "body",
            stats: { "def": 40, "strength": 40, "immune": "burn" }, ...args || {},
        }
    },
    swordinferno(args) {
        return {
            ...items.default(),
            source: "sword_inferno", name: "INFERNO SWORD", element: "fire",
            shopcost: 99999, type: "armor", piece: "rhand",
            stats: { "strength": 60, "crt": 60 }, ...args || {},
        }
    },
    shieldinferno(args) {
        return {
            ...items.default(),
            source: "shield_inferno", name: "INFERNO SHIELD", element: "fire",
            shopcost: 99999, type: "armor", piece: "lhand",
            stats: { "crt": 20, "strength": 40, "immune": "burn" }, ...args || {},
        }
    },
    
    headneptune(args) {
        return {
            ...items.default(),
            source: "head_neptune", name: "NEPTUNE HEAD", element: "water",
            shopcost: 99999, type: "armor", piece: "head",
            stats: { "def": 30, "agi": 20, "immune": "enraged" }, ...args || {},
        }
    },
    bodyneptune(args) {
        return {
            ...items.default(),
            source: "body_neptune", name: "NEPTUNE BODY", element: "water",
            shopcost: 99999, type: "armor", piece: "body",
            stats: { "def": 30, "agi": 20, "immune": "enraged" }, ...args || {},
        }
    },
    swordneptune(args) {
        return {
            ...items.default(),
            source: "sword_neptune", name: "NEPTUNE SWORD", element: "water",
            shopcost: 99999, type: "armor", piece: "rhand",
            stats: { "strength": 50, "agi": 30 }, ...args || {},
        }
    },
    shieldneptune(args) {
        return {
            ...items.default(),
            source: "shield_neptune", name: "NEPTUNE SHIELD", element: "water",
            shopcost: 99999, type: "armor", piece: "lhand",
            stats: { "def": 20, "agi": 30, "immune": "enraged" }, ...args || {},
        }
    },
    
    headholy(args) {
        return {
            ...items.default(),
            source: "head_holy", name: "HOLY HEAD", element: "light",
            shopcost: 99999, type: "armor", piece: "head",
            stats: { "def": 30, "eva": 20, "immune": "condemned" }, ...args || {},
        }
    },
    bodyholy(args) {
        return {
            ...items.default(),
            source: "body_holy", name: "HOLY BODY", element: "light",
            shopcost: 99999, type: "armor", piece: "body",
            stats: { "def": 30, "eva": 20, "immune": "condemned" }, ...args || {},
        }
    },
    swordholy(args) {
        return {
            ...items.default(),
            source: "sword_holy", name: "HOLY SWORD", element: "light",
            shopcost: 99999, type: "armor", piece: "rhand",
            stats: { "strength": 50, "eva": 20 }, ...args || {},
        }
    },
    shieldholy(args) {
        return {
            ...items.default(),
            source: "shield_holy", name: "HOLY SHIELD", element: "light",
            shopcost: 99999, type: "armor", piece: "lhand",
            stats: { "def": 30, "eva": 30, "immune": "condemned" }, ...args || {},
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    // REGULAR SETS
    // wood: weakest armor
    headwood(args) {
        return {
            ...items.default(),
            source: "head_wood", name: "Wood Head", element: "earth",
            shopcost: 600, type: "armor", piece: "head",
            stats: { "def": 2 }, ...args || {},
        }
    },
    bodywood(args) {
        return {
            ...items.default(),
            source: "body_wood", name: "Wood Body", element: "earth",
            shopcost: 600, type: "armor", piece: "body",
            stats: { "def": 2 }, ...args || {},
        }
    },
    swordwood(args) {
        return {
            ...items.default(),
            source: "sword_wood", name: "Wood Sword", element: "earth",
            shopcost: 600, type: "armor", piece: "rhand",
            stats: { "strength": 4 }, ...args || {},
        }
    },
    shieldwood(args) {
        return {
            ...items.default(),
            source: "shield_wood", name: "Wood Shield", element: "earth",
            shopcost: 600, type: "armor", piece: "lhand",
            stats: { "eva": 4 }, ...args || {},
        }
    },
    
    // chemical: good defense, acid immunity
    headchemical(args) {
        return {
            ...items.default(),
            source: "head_chemical", name: "Ch3mical H3ad", element: "ectoplasm",
            shopcost: 6000, type: "armor", piece: "head",
            stats: { "def": 10, "eva": 10, "immune": "acid" }, ...args || {},
        }
    },
    bodychemical(args) {
        return {
            ...items.default(),
            source: "body_chemical", name: "Ch3mical Body", element: "ectoplasm",
            shopcost: 6000, type: "armor", piece: "body",
            stats: { "def": 10, "eva": 10, "immune": "acid" }, ...args || {},
        }
    },
    swordchemical(args) {
        return {
            ...items.default(),
            source: "sword_chemical", name: "Ch3mical Sword", element: "ectoplasm",
            shopcost: 8000, type: "armor", piece: "rhand",
            stats: { "strength": 20, "crt": 30 }, ...args || {},
        }
    },
    shieldchemical(args) {
        return {
            ...items.default(),
            source: "shield_chemical", name: "Ch3mical Shi3ld", element: "ectoplasm",
            shopcost: 6000, type: "armor", piece: "lhand",
            stats: { "def": 15, "luk": -10, "immune": "acid" }, ...args || {},
        }
    },
    
    // literal glass cannon build
    headglass(args) {
        return {
            ...items.default(),
            source: "head_glass", name: "Glass Head", element: "physical",
            shopcost: 3500, type: "armor", piece: "head",
            stats: { "def": -10, "eva": 15 }, ...args || {},
        }
    },
    bodyglass(args) {
        return {
            ...items.default(),
            source: "body_glass", name: "Glass Body", element: "physical",
            shopcost: 3500, type: "armor", piece: "body",
            stats: { "def": -10, "eva": 15 }, ...args || {},
        }
    },
    swordglass(args) {
        return {
            ...items.default(),
            source: "sword_glass", name: "Glass Cannon", element: "physical",
            shopcost: 5000, type: "armor", piece: "rhand",
            stats: { "strength": 30, "def": -20 }, ...args || {},
        }
    },
    shieldglass(args) {
        return {
            ...items.default(),
            source: "shield_glass", name: "Glass Shield", element: "physical",
            shopcost: 4000, type: "armor", piece: "lhand",
            stats: { "def": -10, "eva": 15 }, ...args || {},
        }
    },

    // pearl: some def and some luck
    headpearl(args) {
        return {
            ...items.default(),
            source: "head_pearl", name: "Pearl Head", element: "water",
            shopcost: 2000, type: "armor", piece: "head",
            stats: { "def": 4, "luk": 5 }, ...args || {},
        }
    },
    bodypearl(args) {
        return {
            ...items.default(),
            source: "body_pearl", name: "Pearl Body", element: "water",
            shopcost: 2000, type: "armor", piece: "body",
            stats: { "def": 4, "luk": 5 }, ...args || {},
        }
    },
    swordpearl(args) {
        return {
            ...items.default(),
            source: "sword_pearl", name: "Pearl Sword", element: "water",
            shopcost: 2000, type: "armor", piece: "rhand",
            stats: { "strength": 8, "luk": 5 }, ...args || {},
        }
    },
    shieldpearl(args) {
        return {
            ...items.default(),
            source: "shield_pearl", name: "Pearl Shield", element: "water",
            shopcost: 2000, type: "armor", piece: "lhand",
            stats: { "eva": 10, "luk": 10 }, ...args || {},
        }
    },
    
    // princess: makes you weaker, but ppl dont wanna hit u
    headprincess(args) {
        return {
            ...items.default(),
            source: "head_princess", name: "Princess Head", element: "light",
            shopcost: 9000, type: "armor", piece: "head",
            stats: { "def": 20, "strength": -10, "luk": 10, "eva": 10 }, ...args || {},
        }
    },
    bodyprincess(args) {
        return {
            ...items.default(),
            source: "body_princess", name: "Princess Body", element: "light",
            shopcost: 9000, type: "armor", piece: "body",
            stats: { "def": 10, "strength": -10, "luk": 15, "eva": 10 }, ...args || {},
        }
    },
    swordprincess(args) {
        return {
            ...items.default(),
            source: "sword_princess", name: "Princess Sword", element: "light",
            shopcost: 9000, type: "armor", piece: "rhand",
            stats: { "strength": 6, "luk": 10, "eva": 10 }, ...args || {},
        }
    },
    shieldprincess(args) {
        return {
            ...items.default(),
            source: "shield_princess", name: "Princess Shield", element: "light",
            shopcost: 9000, type: "armor", piece: "lhand",
            stats: { "def": 15, "strength": -10, "luk": 10, "eva": 20 }, ...args || {},
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    // SINGLE SWORDS / ARMOR
    /*
    sword(args) {
        return {
            ...items.default(),
            source: "sword_", name: " Sword", element: "",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 4 }, ...args || {},
        }
    },
    */
    smalldagger(args) {
        return {
            ...items.default(),
            source: "small_dagger", name: "Small Dagger", element: "physical",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 6, "agi": 6 }, ...args || {},
        }
    },
    throwable_daggers(args) {
        return {
            ...items.default(),
            source: "throwable_daggers", name: "Throwable Daggers", element: "physical",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 4, "agi": 12 }, ...args || {},
        }
    },
    sworddouble(args) {
        return {
            ...items.default(),
            source: "sword_double", name: "Double Sword", element: "physical",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 16, "agi": -20 }, ...args || {},
        }
    },
    swordhourglass(args) {
        return {
            ...items.default(),
            source: "sword_hourglass", name: "Hourglass Sword", element: "dark",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 10, "def": 10, "agi": -10, "luk": -10 }, ...args || {},
        }
    },
    swordsnake(args) {
        return {
            ...items.default(),
            source: "sword_snake", name: "Snake Sword", element: "ectoplasm",
            shopcost: 1000, type: "armor", piece: "rhand",
            stats: { "strength": 10, "luk": 10, "eva": 5 }, ...args || {},
        }
    },
    swordbee(args) {
        return {
            ...items.default(),
            source: "sword_bee", name: "Bee Sword", element: "earth",
            shopcost: 3000, type: "armor", piece: "rhand",
            stats: { "strength": 16, "agi": 50 }, ...args || {},
        }
    },
    swordburger(args) {
        return {
            ...items.default(),
            source: "sword_burger", name: "Holy Burger Sword", element: "light",
            shopcost: 6000, type: "armor", piece: "rhand",
            stats: { "strength": 30, "agi": -100, "eva": -20 }, ...args || {},
        }
    },
    swordbanana(args) {
        return {
            ...items.default(),
            source: "sword_banana", name: "Banana Sword", element: "ectoplasm",
            shopcost: 200, type: "armor", piece: "rhand",
            stats: { "strength": 8, "crt": -10 }, ...args || {},
        }
    },
    tophat(args) {
        return {
            ...items.default(),
            source: "tophat", name: "Top Hat", element: "dark",
            shopcost: 5000, type: "armor", piece: "head",
            stats: { "luk": 40, "eva": 30 }, ...args || {},
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    // RANDOM ITEMS / CONSUMABLES
    energydrink(args) {
        return {
            ...items.default(), source: "energy_drink", name: "Energy Drink",
            type: "potion", max: 12, shopcost: 150,
            effect: () => {
                healPlayer(args.player, 10, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    energydrink_white(args) {
        return {
            ...items.default(), source: "energy_drink_white", name: "Energy Drink",
            type: "potion", max: 12, shopcost: 300,
            effect: () => {
                healPlayer(args.player, 20, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    energydrink_green(args) {
        return {
            ...items.default(), source: "energy_drink_green", name: "Energy Drink",
            type: "potion", max: 12, shopcost: 600,
            effect: () => {
                healPlayer(args.player, 40, args.anchor, args.offset);
            },
            ...args || {},
        }
    },
    energydrink_pink(args) {
        return {
            ...items.default(), source: "energy_drink_pink", name: "Energy Drink",
            type: "potion", max: 12, shopcost: 1200,
            effect: () => {
                healPlayer(args.player, 80, args.anchor, args.offset);
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