function getQuestProgress(name) {
    // 0 to 1
    if (game.quests[name] == undefined) return 0;
    return Math.min(1, game.quests[name][0] / quests[name].goal[2]);
}

function calcQuestDuration(name) {
    if (game.quests[name] == undefined) return 0;
    return game.quests[name][2] - game.quests[name][1];
}

// quest lifecycle: start -> complete -> claim
function addQuest(name) {
    if (game.quests[name] == undefined && quests[name] != undefined) {
        game.quests[name] = [0, game.stats.playTime, 0];
        return true;
    }
    else return false;
}

function isQuestComplete(name) {
    if (game.quests[name] == undefined) return false;
    return getQuestProgress(name) == 1;
}

function isQuestClaimed(name) {
    // whether you claimed a quest is handled by its time
    if (game.quests[name] == undefined) return false;
    return game.quests[name][2] != 0;
}

function claimQuest(name) {
    // you finished the goal -> claim it -> get reward
    if (game.quests[name] == undefined) return false;
    if (isQuestClaimed(name)) return false; // already claimed
    if (!isQuestComplete(name)) return false; // already claimed

    // set the finish time, this shows that the quest is done
    game.quests[name][2] = game.stats.playTime;

    // give reward
    if (quests[name].items != undefined) {
        for (let i in quests[name].items) {
            addItem(i, quests[name].items[i]);
        }
    }

    // repeat ?
    if (quests[name].repeatable != undefined && quests[name].repeatable == true) {
        game.quests[name] = [0, game.stats.playTime, 0];
    }

    return true;
}

function questProgress(goalType, goalItem, set = false) {
    for (let q in game.quests) {
        if (quests[q].goal[0] == goalType && (quests[q].goal[1] == goalItem || quests[q].goal[1] == "")) {
            if (set == false) game.quests[q][0]++;
            else game.quests[q][0] = set;
        }
        // you need to claim from the menu, not here
        /*
        if (game.quests[q].instaclaim != undefined && game.quests[q].instaclaim == true) {
            claimQuest(q);
        }
        */
    }
}

function isQuestRepeatable(name) {
    if (quests[name].repeat == undefined) return false;
    return quests[name].repeat;
}

/*
quest reqs:
enemy "evil_peter"
wrenches ""
bricks ""
useItem "potion"
talk "talkID"
walk ""
level "corelle"
*/

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
};