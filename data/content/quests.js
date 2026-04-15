var quests = {
    /*
    "test": {
        name: "Test Quest",
        description: "Kill the 3 Peters of the land.",
        goal: ["enemy", "evil_peter", 3],
        repeatable: false, instaclaim: true,
        items: { "potion": 1, "swordwood": 1 }
    },
    */

    // Chapter 1
    "firstQuest": {
        name: "Your first quest",
        description: "Talk to three people in Bricky Town (Reward: 1 Potion)",
        goal: ["talk", "brickyTown", 3],
        repeatable: false, instaclaim: true,
        items: { "potion": 1 }
    },
    "aliens": {
        name: "Aliens?", source: "items/book_ectoplasm",
        description: "Jan Kin claims aliens are real. Can you find one? (Reward: 1 Spell Book)",
        goal: ["talk", "alien", 1],
        items: { "spellbookectoplasms": 1 }
    },
    "rabbitPlague": {
        name: "Rabbit Plague", source: "enemies/evilpeter", snip: [0, 32, 32, 32],
        description: "Defeat 20 Evil Peters (Reward: 1 Spell Book)",
        goal: ["enemy", "evil_peter", 20],
        repeatable: true, instaclaim: false,
        items: { "spellbookearths": 1 }
    },
    "evilBarrels": {
        name: "Evil Barrels", source: "enemies/weakhelter", snip: [0, 32, 32, 32],
        description: "Prove to Edward that you are capable of survival (Reward: 1 Energy Drink)",
        goal: ["enemy", "", 10],
        instaclaim: true,
        items: { "energydrink": 1 }
    },
    "unhealthyDiet": {
        name: "Unhealthy Diet", source: "items/energy_drink",
        description: "Drink 12 Energy Drinks and check in on Myllermit (Reward: Special Energy Drink)",
        goal: ["useItem", "energydrink", 12],
        items: { "specialenergydrink": 1 }
    },
    "forestHiking": {
        name: "Forest Hiking", source: "items/boots",
        description: "Walk a lot to exercise your legs (Reward: Hiking Boots)",
        goal: ["walk", "", 1000],
        items: { "hikingboots": 1 }
    },
    "oxbowHealer": {
        name: "Oxbow Healer", source: "items/potion",
        description: "Defeat 10 enemies (Reward: 1 Potion)",
        goal: ["enemy", "", 10],
        repeatable: true, instaclaim: false,
        items: { "potion": 1 }
    },
    "woodChopin": {
        name: "Wood Chopin", source: "enemies/ent", snip: [0, 32, 32, 32],
        description: "Defeat 6 walking trees aahh (Reward: 1 Heavy Log)",
        goal: ["enemy", "ent_weak", 6],
        instaclaim: true,
        items: { "heavylog": 1 }
    },
    "plainsDefender": {
        name: "Plains Defender", source: "items/sword_wood",
        description: "Get Corelle to level 5 (Reward: 1 Angel Wing)",
        goal: ["level", "corelle", 5],
        instaclaim: true,
        items: { "angelwing": 1 }
    },
    "plainTown": {
        name: "Plain Town",
        description: "Take a break from the wandering and check out the nearby town (Reward: 1 Potion)",
        goal: ["talk", "plainTown", 1],
        repeatable: false, instaclaim: true,
        items: { "potion": 1 }
    },
    "brfr6": {
        name: "Lost Cards",
        description: "Find 7 cards in this part of Bricky Forest (Reward: 1 Ace Card)",
        goal: ["findItem", "pokercards", 7],
        repeatable: false, instaclaim: false,
        items: { "acecard": 1 }
    },
    "lostCow": {
        name: "Lost Cow",
        description: "Boblaw's cow is gone... please find the cow for him (Reward: 1 Book)",
        goal: ["talk", "lostCow", 1],
        repeatable: false, instaclaim: false,
        items: { "spellbookheals": 1 }
    },
};