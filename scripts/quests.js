function getQuestProgress(name) {
    // 0 to 1
    if (game.quests[name] == undefined) return 0;
    return Math.min(1, game.quests[name][0] / quests[name].goal[2]);
}

function addQuest(name) {
    if (game.quests[name] == undefined) {
        game.quests[name] = [0, game.stats.playTime, 0];
        return true;
    }
    else return false;
}

function calcQuestDuration(name) {
    if (game.quests[name] == undefined) return 0;
    return game.stats.playTime - game.quests[name][1];
}

function isQuestComplete(name) {
    if (game.quests[name] == undefined) return false;
    return getQuestProgress(name) == 1;
}

function questProgress(goalType, goalItem) {
    for (let q in game.quests) {
        if (quests[q].goal[0] == goalType && quests[q].goal[1] == goalItem) game.quests[q][0]++;
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
*/

var quests = {
    "test": {
        name: "Test Quest",
        description: "Kill the 3 Peters of the land.",
        goal: ["enemy", "evil_peter", 3],
    }
};