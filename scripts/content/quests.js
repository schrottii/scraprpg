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
        addNotification("quest");
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

function isQuestActive(name) {
    if (game.quests[name] == undefined) return false;
    if (isQuestComplete(name)) return false;
    if (isQuestClaimed(name)) return false;
    return true;
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

            // you need to claim from the menu, not here
            if (isQuestComplete(q) && !isQuestClaimed(q) && quests[q].instaclaim != undefined && quests[q].instaclaim == true) {
                addNotification("quest");
            }
        }
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
findItem "potion"
talk "talkID"
walk ""
level "corelle"
*/