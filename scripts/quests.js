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
    if (game.quests[name] == undefined) {
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

function questProgress(goalType, goalItem) {
    for (let q in game.quests) {
        if (quests[q].goal[0] == goalType && quests[q].goal[1] == goalItem) game.quests[q][0]++;
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
        description: "Talk to three people in Bricky Town",
        goal: ["talk", "brickyTown", 3],
        repeatable: false, instaclaim: true,
        items: { "potion": 1 }
    },
    "aliens": {
        name: "Aliens?",
        description: "Jan Kin claims aliens are real. Can you find one?",
        goal: ["talk", "alien", 1],
        items: { "potion": 1 }
    },
    "rabbitPlague": {
        name: "Rabbit Plague",
        description: "Defeat 20 Evil Peters",
        goal: ["enemy", "evil_peter", 1],
        repeatable: true, instaclaim: false,
        items: { "spellbookearths": 1 }
    },
};