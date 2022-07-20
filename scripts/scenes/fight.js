var battleNumbers = [];
var fightStats = [];
const amountStats = 14;
var positions;

function battleNumber(pos, amount, type, offset = [0, 0]) {
    // Type 0 is HP, 1 is EP
    let bn;
    if (battleNumbers[0].alpha == 0) bn = 0;
    else if (battleNumbers[1].alpha == 0) bn = 1;
    else bn = 2;
    battleNumbers[bn].alpha = 255;
    battleNumbers[bn].anchor[0] = pos[0];
    battleNumbers[bn].anchor[1] = pos[1];
    battleNumbers[bn].offset[0] = offset[0];
    battleNumbers[bn].offset[1] = offset[1];
    battleNumbers[bn].text = amount;

    // Arbitrary variables
    let bounceHeight = 0.4;
    let timeOffset = 0;

    if (type == 0 && amount < 0) battleNumbers[bn].fill = "white";
    if (type == 0 && amount > 0) battleNumbers[bn].fill = "green";
    if (type == 1 && amount < 0) battleNumbers[bn].fill = "yellow";
    if (type == 1 && amount > 0) battleNumbers[bn].fill = "pink";

    addAnimator(function (t) {
        if (bounceHeight > 0.001) {
            while (bounceHeight > 0.00001) {
                let rt = t / 1000 - timeOffset;
                let ofs = (rt * bounceHeight - rt * rt) * 1;
                if (ofs < 0) {
                    timeOffset += bounceHeight;
                    bounceHeight = bounceHeight / 2;
                    continue;
                }
                battleNumbers[bn].anchor[1] = pos[1] - ofs;
                break;
            }
        } else {
            battleNumbers[bn].anchor[1] = pos[1];
            let rt = t / 1000 - timeOffset;
            battleNumbers[bn].alpha = (1 - Math.pow(rt / .25, 2));
            return battleNumbers[bn].alpha < 0;
        }
    })
}

function updateBar(charName, HealthBefore) {
    let whichChar = characters.indexOf(charName);
    let which = 5 + (whichChar * amountStats);
    let row = Math.ceil((whichChar + 1) / 3); // 1 or 2

    if (game.characters[charName].HP > 0) {
        let Leftend = 0.1960 * (Math.max(getPlayer(1 + whichChar).HP, 0) / getPlayer(1 + whichChar).maxHP);
        let Length = (0.1960 * (HealthBefore / getPlayer(1 + whichChar).maxHP)) - Leftend;

        if (Length == 0) return false;
        fightStats[which].alpha = 255;
        if (Length > 0) {
            if (getPlayer(1 + whichChar).HP > 0) fightStats[which - 1].sizeAnchor[0] = 0.1960 * (getPlayer(1 + whichChar).HP / getPlayer(1 + whichChar).maxHP);
            fightStats[which].anchor[0] = 0.242 + Leftend + (0.35 * (row-1));
            fightStats[which].sizeAnchor[0] = Length;
            addAnimator(function (t) {
                if (t > 400) {
                    fightStats[which].sizeAnchor[0] = Length * Math.max(0.01, (1 - (Math.min((t - 399) * 0.01, 1))));
                }

                if (t > 1400) {
                    fightStats[which].alpha = 0;
                    if (charName.HP < 1) {
                        fightStats[which - 1].alpha = 0;
                        fightStats[which].alpha = 0;
                    }
                    return true;
                }
            });
        }
        else {
            Leftend = 0.1960 * (HealthBefore / getPlayer(1 + whichChar).maxHP);
            Length = (0.1960 * (getPlayer(1 + whichChar).HP / HealthBefore)) - Leftend;
            fightStats[which].anchor[0] = 0.242 + Leftend;
            fightStats[which].sizeAnchor[0] = 0.00001;
            addAnimator(function (t) {
                fightStats[which].sizeAnchor[0] = Length * Math.max(0.01, ((Math.min(t * 0.01, 0.5))));
                
                if (t > 1400) {
                    fightStats[which].anchor[0] = 0.242 + Leftend;
                    if (getPlayer(1 + whichChar).HP > 0) fightStats[which - 1].sizeAnchor[0] = 0.1960 * (getPlayer(1 + whichChar).HP / getPlayer(1 + whichChar).maxHP);
                    fightStats[which].alpha = 0;
                    return true;
                }
            });
        }
    }
}


scenes.fight = () => {

    var fightaction = "none";
    var turn = 1;
    var put = 0; //positions update time
    var itemPage = 0;

    var fightButtons = [];
    var fightActions = [];


    var fightLogComponents = [];
    var enemyListComponents = [];
    var enemyAmounts = ["", "", "", "", "", "", "", "", ""];
    var fightOverview = [];
    var winScreen = [];
    var fleeWrenches = [];
    var actionDisplay = [];
    var actionText = [];

    var positionControls = [];
    var epositionControls = [];
    var positionGrid = [];
    var attackAnimationObjects = [];

    var switchThose = [[0, 0], [0, 0]];
    var selectedAlly = [0, 0];

    var win = false;

    var selectedItem;


    var fightlog = [
        "",
        "Battle has started!",
        "All actions will",
        "be logged here!",
    ];

    function checkAllDead(checkonly=false) {
        let alive = 0;
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (epositions[i][j].isOccupied == true) {
                    alive += 1;
                }
            }
        }
        if (alive == 0) { // All dead :)
            if (checkonly == true) return true;
            win = true;

            stopMusic();
            playSound("victory");

            setTimeout(victoryScreen(), 3000);
            for (i = 0; i < game.chars.length; i++) {
                // Get rid of acid effect
                if (getPlayer(i + 1).effect[0] == "acid") {
                    getPlayer(i + 1).effect = ["none", 0];
                }

                // Victory Animation
                let chr = 0;
                let exc = [];
                for (j = 0; j < 3; j++) {
                    for (k = 0; k < 3; k++) {
                        if (positions[k][j].occupied == game.chars[i]) {
                            chr = k + (j * 3);
                            exc = [k, j];
                        }
                    }
                }

                if (game.characters[positions[exc[0]][exc[1]].occupied].HP > 0) { // Dead? No animation! We will let you bleed out there hahaha
                    let ret = emotionAnimation(game.chars[i], "victory");
                    if (ret != false) {
                        let file = ret[0];
                        let snip = ret[1];
                        let amount = ret[2];
                        let controlled = positionControls[chr];
                        controlled.source = file;
                        controlled.snip = snip;
                        controlled.defsnip = snip[0];
                        controlled.amount = amount;
                        controlled.aniTime = 0;
                        controlled.aniTime2 = 0;

                        if (amount > 1) {
                            addAnimator(function (t) {
                                controlled.aniTime = ((t - controlled.aniTime2) / 500);
                                if (controlled.aniTime >= controlled.amount) {
                                    controlled.aniTime = 0;
                                    controlled.aniTime2 = t;
                                }

                                controlled.snip[0] = controlled.defsnip + (32 * Math.max(0, Math.floor(controlled.aniTime)));
                                if (controlled.aniTime2 > 2999) {
                                    delete controlled.aniTime;
                                    delete controlled.aniTime2;
                                    delete controlled.defsnip;
                                    return true;
                                }
                                return false;
                            })
                        }
                    }
                }
            }
            
        }

        let aliveallies = 0;
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positions[i][j].isOccupied == true) {
                    aliveallies += 1;
                }
            }
        }
        if (aliveallies == 0) { // All dead :)
            alert("DEAD");
            alert("Remind me to add a proper death screen");
            setScene(scenes.title());
        }
    }

    function victoryScreen() {
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positionControls[i + (j * 3)].source != "gear") {
                    positionControls[i + (j * 3)].defanchor = positionControls[i].anchor[0];
                    positionControls[i + (j * 3)].source = positions[i][j].occupied;
                    positionControls[i + (j * 3)].snip = [0, 64, 32, 32];
                }
            }
        }
        let runTime = 0;
        let runLaps = 0;
        addAnimator(function (t) {
            for (i = 0; i < positionControls.length; i++) {
                if (positionControls[i].source != "gear") {
                    if (game.characters[positions[positionControls[i].pos1][positionControls[i].pos2].occupied].HP > 0) {
                        positionControls[i].anchor[0] = positionControls[i].defanchor + (t / 2000);
                        positionControls[i].snip[0] = Math.floor(runTime) * 32;
                    }
                }
            }

            runTime += ((t - runLaps) / 250);
            if (runTime >= 2) {
                runTime = 0;
                runLaps = t;
            }
            if (t > 2000) {
                let EXPforAll = 2;
                let wrenchGain = 100;
                let brickGain = 0;
                for (j = 0; j < 3; j++) {
                    for (i = 0; i < 3; i++) {
                        if (epositions[i][j].strength != undefined) EXPforAll += epositions[i][j].strength / 3;
                        if (epositions[i][j].maxHP != undefined) EXPforAll += epositions[i][j].maxHP / 14;
                    }
                }
                for (j = 0; j < 3; j++) {
                    for (i = 0; i < 3; i++) {
                        if (epositions[i][j].strength != undefined) wrenchGain += epositions[i][j].strength * 16;
                        if (epositions[i][j].maxHP != undefined) wrenchGain += epositions[i][j].maxHP / 3;
                    }
                }
                EXPforAll = Math.ceil(EXPforAll);
                wrenchGain = Math.ceil(wrenchGain);

                addWrenches(wrenchGain);
                winScreen[3].text = "+" + wrenchGain + " wrenches!";
                winScreen[4].text = "+" + brickGain + " bricks!";

                for (i = 0; i < game.chars.length; i++) {
                    getPlayer(1 + i).EXP += EXPforAll;
                }

                for (i = 0; i < game.chars.length; i++) {
                    winScreen[5 + i].text = getPlayer(i + 1).name + "  + " + EXPforAll + "XP!     " + getPlayer(i + 1).EXP + "/25";
                }
                for (i = 0; i < winScreen.length; i++) {
                    winScreen[i].offset[1] = -1000;
                    winScreen[i].alpha = 255;
                }
                addAnimator(function (t) {
                    for (i = 0; i < winScreen.length; i++) {
                        winScreen[i].offset[1] = Math.min(-1000 + t, 0);
                    }
                    if (t > 1000) {
                        for (i = 0; i < winScreen.length; i++) {
                            winScreen[i].offset[1] = 0;
                        }
                        return true;
                    }
                    return false;
                })
                checkLevelUps();
                return true;
            }
            return false;
        })
    }

    function checkAllAction() {
        let active = 0;
        let needed = 0;

        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positions[i][j].isOccupied != false) {
                    needed += 1;
                }
                if (positions[i][j].action != false) {
                    active += 1;
                }
            }
        }
        if (active == needed) return true;
        return false;
    }

    function calculateDamage(type, pos1, pos2, enpos1, enpos2) {
        if (type == 1) { // Allies
            return Math.round(game.characters[positions[pos1][pos2].occupied].strength
                * (0.67 + (0.33 * pos1))
                * (1.33 - (0.33 * enpos1))
                * getElementDamage(game.characters[positions[pos1][pos2].occupied].element, epositions[enpos1][enpos2].element));
        }
            
        if (type == 2) { // Evil men
            return Math.round(epositions[pos1][pos2].strength
                * (1.33 - (0.33 * pos1))
                * (0.67 + (0.33 * enpos1))
                * getElementDamage(epositions[pos1][pos2].element, game.characters[positions[enpos1][enpos2].occupied].element));
        }
    }

    function postLog(text) {
        let maxLength = 24;
        let tempText = "";
        let superTempText = "";

        for (i = 0; i < text.length; i++) {
            superTempText = superTempText + text[i];
            if (text[i] == " ") {
                tempText = tempText + superTempText;
                superTempText = "";
            }
            if (superTempText.length + tempText.length > maxLength) {
                if (tempText == "") {
                    tempText = tempText + superTempText;
                    superTempText = "";
                }
                else {
                    fightlog.push(tempText);
                    tempText = "";
                }
            }
        }
        fightlog.push(tempText + superTempText);
    }

    function postAction(text) {
        let maxLength = 24;
        let tempText = "";
        let superTempText = "";

        for (i = 0; i < text.length; i++) {
            superTempText = superTempText + text[i];
            if (text[i] == " ") {
                tempText = tempText + superTempText;
                superTempText = "";
            }
            if (superTempText.length + tempText.length > maxLength) {
                if (tempText == "") {
                    tempText = tempText + superTempText;
                    superTempText = "";
                }
                else {
                    actionText.push(tempText);
                    tempText = "";
                }
            }
        }
        actionText.push(tempText + superTempText);
    }

    function executeActions() {
            let highestAGI = 0;
            let whoAGI;
            let pos = [];
            // Look for the fastest man alive
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    if (positions[i][j].action != false) { 
                            if (game.characters[positions[i][j].occupied].agi > highestAGI) {
                                highestAGI = game.characters[positions[i][j].occupied].agi;
                                whoAGI = positions[i][j];
                                pos = [i, j];
                            }
                    }
                }
            }

            // Stop if there is nobody (when is that?)
        if (highestAGI == 0) {
            fightaction = "enemiesturn";

            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    if (epositions[i][j].isOccupied != false) {
                        epositions[i][j].action = true
                    }
                }
            }
            enemiesTurn(); // Is everyone done? Can we continue?
            return;
        }

            // Ok, ok, now we know who (whoAGI) is first (highestAGI), so now do something
        switch (whoAGI.action[0]) {
            case "switch":
                switchThose = [[whoAGI.action[1], whoAGI.action[2]], [whoAGI.action[3], whoAGI.action[4]]];
                switchPositions();
                positions[pos[0]][pos[1]].action = false;
                executeActions();
                break;
            case "attack":
                let pos1 = positions[pos[0]][pos[1]].action[3];
                let pos2 = positions[pos[0]][pos[1]].action[4];
                selectedAlly = [positions[pos[0]][pos[1]].action[1], positions[pos[0]][pos[1]].action[2]];
                fightaction = "attack4"; // To avoid being able to click over and over again to get duplicate damage / EXP
                prepareAttackAnimation(selectedAlly[0], selectedAlly[1], pos1, pos2, (fpos1, fpos2, pos1, pos2) => {
                    if (epositions[pos1][pos2].isOccupied == false) {
                        let exists = 0;
                        for (j = 0; j < 3; j++) {
                            for (i = 0; i < 3; i++) {
                                if (epositions[i][j].isOccupied == true && exists == 0) {
                                    exists = 1
                                    pos1 = i;
                                    pos2 = j;
                                    break;
                                }
                            }
                        }
                        if (exists == 0) {
                            positions[pos[0]][pos[1]].action = false;
                            executeActions();
                            return false;
                        }
                        
                    }
                    if (game.characters[positions[fpos1][fpos2].occupied].acc - epositions[pos1][pos2].eva > (Math.random() * 100)) {
                        let Damage = calculateDamage(1, fpos1, fpos2, pos1, pos2);
                        if (positions[fpos1][fpos2].occupied == "skro") {
                            Damage = 690;
                        }
                        epositions[pos1][pos2].HP -= Damage; // Deal damage
                        battleNumber(epositionControls[pos1 + (pos2 * 3)].anchor, Damage *(-1), 0, epositionControls[pos1 + (pos2 * 3)].offset);

                        playSound("damage");
                        postLog(game.characters[positions[fpos1][fpos2].occupied].name + " attacks " + epositions[pos1][pos2].name + " and deals " + Damage + " damage!");
                        if (getElementDamage(game.characters[positions[fpos1][fpos2].occupied].element, epositions[pos1][pos2].element) != 1){
                            postLog("Element boost: x" + getElementDamage(game.characters[positions[fpos1][fpos2].occupied].element, epositions[pos1][pos2].element) + "!");
                        }

                        if (epositions[pos1][pos2].HP < 1) { // Is dead?
                            epositions[pos1][pos2].isOccupied = false;
                            epositions[pos1][pos2].occupied = false;
                            epositions[pos1][pos2].action = false;
                            enemyAmounts[pos1 + (pos2 * 3)] = "";

                            let Experience = epositions[pos1][pos2].strength;
                            game.characters[positions[fpos1][fpos2].occupied].EXP += Experience;

                            postLog(game.characters[positions[fpos1][fpos2].occupied].name + " killed " + epositions[pos1][pos2].name + " and earned " + Experience + " EXP!");
                            checkLevelUps();
                            checkAllDead();
                        }
                    }
                    else {
                        battleNumber(epositionControls[pos1 + (pos2 * 3)].anchor, "Miss...", 0, epositionControls[pos1 + (pos2 * 3)].offset);
                        playSound("miss");
                        postLog(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " missed!");
                    }
                    executeActions();
                }, false);
                positions[pos[0]][pos[1]].action = false;
                break;
            case "heal":
                selectedAlly = [whoAGI.action[1], whoAGI.action[2]];

                game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP += game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].strength;
                
                positions[pos[0]][pos[1]].action = false;
                executeActions();
                break;
            case "item":
                items[whoAGI.action[1]]({ user: game.characters[positions[whoAGI.action[2]][whoAGI.action[3]].occupied], player: game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied], anchor: positionControls[whoAGI.action[2] + (whoAGI.action[3] * 3)].anchor, offset: positionControls[pos[0] + (pos[1] * 3)].offset }).effect();
                positions[pos[0]][pos[1]].action = false;
                executeActions();
                break;
            
        }
    }


    function enemiesTurn() {
        let highestAGI = 0;
        let whoAGI;
        let pos = [];
        // Look for the fastest man alive
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (epositions[i][j].action != false) {
                    if (epositions[i][j].agi > highestAGI) {
                        highestAGI = epositions[i][j].agi;
                        whoAGI = epositions[i][j];
                        pos = [i, j];
                    }
                }
            }
        }

        // Stop if there is nobody (when is that?)
        if (highestAGI == 0) {
            fightaction = "none";
            turn += 1;
            endOfTurnEvents();

            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    positionGrid[i + (j * 3)].source = "grid";
                }
            }
            return;
        }

        selectedAlly = [75, 75];
        while (selectedAlly[0] == 75) {
            let randyTheIdiot = Math.random() * 2.98;
            if (positions[Math.floor(randyTheIdiot)][0].isOccupied == true ||
                positions[Math.floor(randyTheIdiot)][1].isOccupied == true ||
                positions[Math.floor(randyTheIdiot)][2].isOccupied == true) {
                selectedAlly[0] = Math.floor(randyTheIdiot);
            }
        }
        while (selectedAlly[1] == 75) {
            let randyTheIdiot = Math.random() * 2.98;
            if (positions[selectedAlly[0]][Math.floor(randyTheIdiot)].isOccupied == true) {
                selectedAlly[1] = Math.floor(randyTheIdiot);
            }
        }

        // Ok, ok, now we know who (whoAGI) is first (highestAGI), so now do something
        prepareAttackAnimation(selectedAlly[0], selectedAlly[1], pos[0], pos[1], (fpos1, fpos2, pos) => {
            let Damage = calculateDamage(2, pos[0], pos[1], selectedAlly[0], selectedAlly[1]);
            if (positions[fpos1][fpos2].isOccupied != false) {
                let HealthBefore = game.characters[positions[fpos1][fpos2].occupied].HP;
                game.characters[positions[fpos1][fpos2].occupied].HP -= Damage;
                epositions[pos[0]][pos[1]].action = false;
                battleNumber(positionControls[fpos1 + (fpos2 * 3)].anchor, Damage * (-1), 0, positionControls[fpos1 + (fpos2 * 3)].offset);

                playSound("damage");
                postLog(epositions[pos[0]][pos[1]].name + " attacks " + game.characters[positions[fpos1][fpos2].occupied].name + " and deals " + Damage + " damage!");
                if (getElementDamage(epositions[pos[0]][pos[1]].element, game.characters[positions[fpos1][fpos2].occupied].element) != 1) {
                    postLog("Element boost: x" + getElementDamage(epositions[pos[0]][pos[1]].element, game.characters[positions[fpos1][fpos2].occupied].element) + "!");
                }

                // Bar animation! (Cowboy moment)
                updateBar(positions[fpos1][fpos2].occupied, HealthBefore);
                if (game.characters[positions[fpos1][fpos2].occupied].HP < 1) {
                    game.characters[positions[fpos1][fpos2].occupied].HP = 0;
                    postLog(epositions[pos[0]][pos[1]].name + " killed " + game.characters[positions[fpos1][fpos2].occupied].name + "!");
                    positions[fpos1][fpos2].isOccupied = false;
                    checkAllDead();
                }
            }
            enemiesTurn();
        }, true); // very important true,bob
    }

    function endOfTurnEvents() {
        for (i = 0; i < game.chars.length; i++) {

            if (getPlayer(i + 1).effect[0] == "acid") {
                getPlayer(i + 1).HP -= Math.ceil(getPlayer(i + 1).maxHP / 15);
                postLog(getPlayer(i + 1).name + " took " + Math.ceil(getPlayer(i + 1).maxHP / 20) + " damage from acid!")

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    postLog(getPlayer(i + 1).name + "'s acid is over!")
                }
            }

            if (getPlayer(i + 1).effect[0] == "poison") {
                getPlayer(i + 1).HP -= Math.ceil(getPlayer(i + 1).maxHP / 15);
                postLog(getPlayer(i + 1).name + " took " + Math.ceil(getPlayer(i + 1).maxHP / 20) + " damage from poison!")

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    postLog(getPlayer(i + 1).name + "'s poison is over!")
                }
            }

            if (getPlayer(i + 1).effect[0] == "burn") {
                getPlayer(i + 1).HP -= Math.ceil(getPlayer(i + 1).maxHP / 10);
                postLog(getPlayer(i + 1).name + " burns and took " + Math.ceil(getPlayer(i + 1).maxHP / 10) + " damage!")

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    postLog(getPlayer(i + 1).name + "'s burn is over!")
                }
            }

            if (getPlayer(i + 1).HP < 1) {
                fightStats[5 + (i * amountStats)].alpha = 0;
                postLog(getPlayer(i + 1).name + " died!");
                positions[getPlayer(i + 1).pos[0]][getPlayer(i + 1).pos[1]].isOccupied = false;
                checkAllDead();
            }
        }


    }

    function switchPositions() {
        // important variable here: switchThose
        // [0] is pos of which one to switch, [1] of where to switch to
        game.characters[positions[switchThose[0][0]][switchThose[0][1]].occupied].pos = [switchThose[1][1], switchThose[1][0]];

        // Switch them and adjust isOccupied
        let cache123 = positions[switchThose[1][0]][switchThose[1][1]].occupied;
        positions[switchThose[1][0]][switchThose[1][1]].occupied = positions[switchThose[0][0]][switchThose[0][1]].occupied;
        positions[switchThose[0][0]][switchThose[0][1]].occupied = cache123;

        let cache1234 = positions[switchThose[1][0]][switchThose[1][1]].isOccupied;
        positions[switchThose[1][0]][switchThose[1][1]].isOccupied = positions[switchThose[0][0]][switchThose[0][1]].isOccupied;
        positions[switchThose[0][0]][switchThose[0][1]].isOccupied = cache1234;

        positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "grid";
        positionGrid[switchThose[1][0] + (switchThose[1][1] * 3)].source = "hasaction";


        // Fightlog
        postLog("Swapped [" + (switchThose[0][0] + 1) + "/" + (switchThose[0][1] + 1) + "] with [" + (switchThose[1][0] + 1) + "/" + (switchThose[1][1] + 1) + "]!");

        // Clear this stuff
        switchThose = [[0, 0], [0, 0]];
    }

    function prepareAttackAnimation(fpos1, fpos2, pos1, pos2, onFinish, enemy) {
        let goalX = epositionControls[pos1 + (pos2 * 3)].anchor[0];
        let ownX = positionControls[fpos1 + (fpos2 * 3)].anchor[0];
        let goalX2 = epositionControls[pos1 + (pos2 * 3)].offset[0];
        let ownX2 = positionControls[fpos1 + (fpos2 * 3)].defoffset;

        let goalY = epositionControls[pos1 + (pos2 * 3)].anchor[1];
        let ownY = positionControls[fpos1 + (fpos2 * 3)].anchor[1];
        let goalY2 = epositionControls[pos1 + (pos2 * 3)].offset[1];
        let ownY2 = positionControls[fpos1 + (fpos2 * 3)].offset[1];

        attackAnimation(fpos1, fpos2, pos1, pos2, [ownX, ownX2, ownY, ownY2], [goalX, goalX2, goalY, goalY2], onFinish, enemy)
    }

    function attackAnimation(fpos1, fpos2, pos1, pos2, own, goal, onFinish, enemy) {
        let al = 800;
        if (enemy == false) {
            positionControls[fpos1 + (fpos2 * 3)].offset[0] = own[1];
            positionControls[fpos1 + (fpos2 * 3)].offset[1] = own[3];

            goal[1] -= 232;

            attackAnimationObjects[fpos1 + (fpos2 * 3)].anchor = positionControls[fpos1 + (fpos2 * 3)].anchor;
            attackAnimationObjects[fpos1 + (fpos2 * 3)].offset = [positionControls[fpos1 + (fpos2 * 3)].offset[0] + 56, positionControls[fpos1 + (fpos2 * 3)].offset[1]];
            attackAnimationObjects[fpos1 + (fpos2 * 3)].alpha = 255;
            attackAnimationObjects[fpos1 + (fpos2 * 3)].source = "attackani0";

            addAnimator(function (t) {
                positionControls[fpos1 + (fpos2 * 3)].anchor[0] = own[0] + ((goal[0] / al) * Math.min(al, t));

                attackAnimationObjects[fpos1 + (fpos2 * 3)].anchor = positionControls[fpos1 + (fpos2 * 3)].anchor;
                attackAnimationObjects[fpos1 + (fpos2 * 3)].offset = [positionControls[fpos1 + (fpos2 * 3)].offset[0] + 56, positionControls[fpos1 + (fpos2 * 3)].offset[1]];

                if (t > 200 && t < 399 && own[3] != 0) {
                    positionControls[fpos1 + (fpos2 * 3)].offset[1] = own[3] * (1 - ((t - 200)) / 200);
                    positionControls[fpos1 + (fpos2 * 3)].offset[0] = own[1] * (1 - ((t - 200)) / 200);
                }
                if (t > 400 && t < 599 && goal[3] != 0) {
                    positionControls[fpos1 + (fpos2 * 3)].offset[1] = goal[3] * (0 + ((t - 400)) / 200);
                    positionControls[fpos1 + (fpos2 * 3)].offset[0] = goal[1] * (0 + ((t - 400)) / 200);
                }
                if (t > 1000 && t < 1049 || t > 1100 && t < 1149) {
                    attackAnimationObjects[fpos1 + (fpos2 * 3)].source = "attackani1";
                }
                if (t > 1050 && t < 1099 || t > 1150 && t < 1199) {
                    attackAnimationObjects[fpos1 + (fpos2 * 3)].source = "attackani2";
                }
                if (t > 1200) {
                    positionControls[fpos1 + (fpos2 * 3)].anchor[0] = own[0];
                    positionControls[fpos1 + (fpos2 * 3)].offset[0] = own[1];
                    positionControls[fpos1 + (fpos2 * 3)].offset[1] = own[3];
                    attackAnimationObjects[fpos1 + (fpos2 * 3)].alpha = 0;
                    onFinish(fpos1, fpos2, pos1, pos2);
                    return true;
                }

                return false;
            });
        }
        else {
            epositionControls[pos1 + (pos2 * 3)].offset[0] = goal[1];
            epositionControls[pos1 + (pos2 * 3)].offset[1] = goal[3];
            own[1] += 160;

            attackAnimationObjects[9 + pos1 + (pos2 * 3)].anchor[0] = epositionControls[pos1 + (pos2 * 3)].anchor[0] + 0;
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].anchor[1] = epositionControls[pos1 + (pos2 * 3)].anchor[1] + 0;
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].offset = [epositionControls[pos1 + (pos2 * 3)].offset[0] - 72, epositionControls[pos1 + (pos2 * 3)].offset[1]];
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].alpha = 255;
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].source = "eattackani0";

            addAnimator(function (t) {
                epositionControls[pos1 + (pos2 * 3)].anchor[0] = own[0] + Math.max(0, ((goal[0] / al) * (al - Math.min(al, t))));

                attackAnimationObjects[9 + pos1 + (pos2 * 3)].anchor[0] = epositionControls[pos1 + (pos2 * 3)].anchor[0] + 0;
                attackAnimationObjects[9 + pos1 + (pos2 * 3)].anchor[1] = epositionControls[pos1 + (pos2 * 3)].anchor[1] + 0;
                attackAnimationObjects[9 + pos1 + (pos2 * 3)].offset = [epositionControls[pos1 + (pos2 * 3)].offset[0] - 72, epositionControls[pos1 + (pos2 * 3)].offset[1]];

                attackAnimationObjects[9 + pos1 + (pos2 * 3)].alpha = 255;
                if (t > 200 && t < 399 && goal[3] != 0) {
                    epositionControls[pos1 + (pos2 * 3)].offset[1] = goal[3] * (1 - ((t - 200)) / 200);
                    epositionControls[pos1 + (pos2 * 3)].offset[0] = goal[1] * (1 - ((t - 200)) / 200);
                }
                if (t > 400 && t < 599 && own[3] != 0) {
                    epositionControls[pos1 + (pos2 * 3)].offset[1] = own[3] * (0 + ((t - 400)) / 200);
                    epositionControls[pos1 + (pos2 * 3)].offset[0] = own[1] * (0 + ((t - 400)) / 200);
                }
                if (t > 1000 && t < 1049 || t > 1100 && t < 1149) {
                    attackAnimationObjects[9 + pos1 + (pos2 * 3)].source = "eattackani1";
                }
                if (t > 1050 && t < 1099 || t > 1150 && t < 1199) {
                    attackAnimationObjects[9 + pos1 + (pos2 * 3)].source = "eattackani2";
                }
                if (t > 1200) {
                    epositionControls[pos1 + (pos2 * 3)].anchor[0] = goal[0];
                    epositionControls[pos1 + (pos2 * 3)].offset[0] = goal[1];
                    epositionControls[pos1 + (pos2 * 3)].offset[1] = goal[3];
                    attackAnimationObjects[9 + pos1 + (pos2 * 3)].alpha = 0;
                    onFinish(fpos1, fpos2, [pos1, pos2]);
                    return true;
                }

                return false;
            });
        }
    }


    function showFightButtons() {
        addAnimator(function (t) {
            for (i = 0; i < fightButtons.length; i++) {
                fightButtons[i].offset[1] = -500 + t;
            }
            if (t > 499) {
                for (i = 0; i < fightButtons.length; i++) {
                    fightButtons[i].offset[1] = 0;
                }
                return true;
            }
        })
    }

    function hideFightButtons() {
        if (fightButtons[0].offset[1] != 0) return false;
        addAnimator(function (t) {
            for (i = 0; i < fightButtons.length; i++) {
                fightButtons[i].offset[1] = -t;
            }
            if (t > 499) {
                for (i = 0; i < fightButtons.length; i++) {
                    fightButtons[i].offset[1] = -500;
                }
                return true;
            }
        })
    }


    function showFightActions() {
        addAnimator(function (t) {
            for (i = 0; i < fightActions.length; i++) {
                fightActions[i].offset[1] = -500 + t;
                if (fightActions[i].source != undefined) fightActions[i].offset[1] = -520 + t;
            }
            if (t > 499) {
                for (i = 0; i < fightActions.length; i++) {
                    fightActions[i].offset[1] = 0;
                    if (fightActions[i].source != undefined) fightActions[i].offset[1] = -20;
                }
                return true;
            }
        })
    }

    function hideFightActions() {
        if (fightActions[0].offset[1] != 0) return false;
        addAnimator(function (t) {
            for (i = 0; i < fightActions.length; i++) {
                fightActions[i].offset[1] = -t;
            }
            if (t > 499) {
                for (i = 0; i < fightActions.length; i++) {
                    fightActions[i].offset[1] = -500;
                }
                return true;
            }
        })
    }

    function showItems() {
    let itemOffset = itemPage * 12
        let inventory = Object.keys(game.inventory);
        for (i = 0; i < ((fightActions.length / 4) - 9); i++) {
            fightActions[(i * 4) + 3].alpha = 0;
            if (inventory[i + itemOffset] == undefined) {
                fightActions[(i * 4) + 2].text = "---";
                fightActions[(i * 4) + 2].fill = "white";
                continue;
            }
            if (game.inventory[items[inventory[i + itemOffset]].name] > 0) {
                fightActions[(i * 4)].item = items[inventory[i + itemOffset]];
                if (game.inventory[items[inventory[i + itemOffset]].name] > 1) fightActions[(i * 4) + 2].text = items[inventory[i + itemOffset]]().name + " x" + game.inventory[items[inventory[i + itemOffset]].name];
                else fightActions[(i * 4) + 2].text = items[inventory[i + itemOffset]]().name;
                if (items[inventory[i + itemOffset]]().story) fightActions[(i * 4) + 2].fill = "darkgray";
                else fightActions[(i * 4) + 2].fill = "white";
                fightActions[(i * 4) + 3].source = "items/" + items[inventory[i + itemOffset]]().source;
                fightActions[(i * 4) + 3].alpha = 255;
            }
            else {
                fightActions[(i * 4) + 2].text = "---";
                fightActions[(i * 4) + 2].fill = "white";
            }
        }

    }


    // Elements! Yay (ft. some rapper you have never heard of)
    function elementLogic(myElement, theirElement) {
        switch (myElement) {
            case "fire":
                if (theirElement == "dark") return "weak";
                if (theirElement == "earth") return "strong";
                return "none";
            case "earth":
                if (theirElement == "fire") return "weak";
                if (theirElement == "wind") return "strong";
                return "none";
            case "wind":
                if (theirElement == "earth") return "weak";
                if (theirElement == "lightning") return "strong";
                return "none";
            case "lightning":
                if (theirElement == "wind") return "weak";
                if (theirElement == "water") return "strong";
                return "none";
            case "water":
                if (theirElement == "lightning") return "weak";
                if (theirElement == "light") return "strong";
                return "none";
            case "light":
                if (theirElement == "water") return "weak";
                if (theirElement == "dark") return "strong";
                return "none";
            case "dark":
                if (theirElement == "light") return "weak";
                if (theirElement == "fire") return "strong";
                return "none";

            case "physical":
                if (theirElement == "ectoplasm") return "weak";
                return "none";
            case "ectoplasm":
                if (theirElement == "physical") return "strong";
                return "none";
        }
    }

    function getElementDamage(myElements, theirElements) {
        if (typeof (myElements) == "string") myElements = [myElements];
        if (typeof (theirElements) == "string") theirElements = [theirElements];

        let damageBoost = 1; // 1 = 100%

        for (i in myElements) {
            for (j in theirElements) {
                //console.log("i: " + i, "   j:" + j);
                if (elementLogic(myElements[i], theirElements[j]) == "weak") damageBoost -= 0.33;
                if (elementLogic(myElements[i], theirElements[j]) == "strong") damageBoost += 0.33;
            }
        }
        return Math.round(damageBoost*100)/100;
    }




    let fleeLoss = controls.label({
        anchor: [0.5, 0.5],
        text: ":(",
        fontSize: 32, fill: "white", align: "center", outline: "gray", outlineSize: 12,
        alpha: 0,
    })

    let fleeIcon = controls.image({
        anchor: [0.55, 0.5], offset: [-32, -32], sizeOffset: [64, 64],
        source: "wrench",
        alpha: 0,
    })

    // Top row buttons
    function topRowButton() {
        if (i == 0) { // Normal Actions
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.035)], sizeAnchor: [0.15, 0.035], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255 && fightaction == "active") {
                        fightaction = "attack2";
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 1) { // Item Inventory
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.035)], sizeAnchor: [0.15, 0.035], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255 && fightaction == "active") {
                        showFightActions();
                        showItems();
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 2) { // Magic
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.035)], sizeAnchor: [0.15, 0.035], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255 && fightaction == "active") {
                        if (Math.random() < 0.5) {
                            getPlayer(i + 1).effect = ["acid", 3];
                        }
                        else if (Math.random() < 0.5) {
                            getPlayer(i + 1).effect = ["poison", 4];
                        }
                        else {
                            getPlayer(i + 1).effect = ["burn", 4];
                        }
                    }
                }
            }))
        }
        if (i == 3) { // Mastery Techniques
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.035)], sizeAnchor: [0.15, 0.035], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255) {
                        postLog(prompt("Put what?"));
                    }
                }
            }))
        }
        if (i == 4) { // Macro
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.035)], sizeAnchor: [0.15, 0.035], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255 && fightaction == "active") {
                        fightaction = "switch";
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 5) { // Flee
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.035)], sizeAnchor: [0.15, 0.035], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255 && fightaction == "active") {
                        let loss = Math.round(50 + (game.wrenches / 100)) * (-1);
                        addWrenches(loss);
                        fleeLoss.text = loss + "!";
                        fleeLoss.alpha = 255;
                        fleeIcon.alpha = 255;
                        hideFightButtons();
                        hideFightActions();

                        let runTime = 0;
                        let runLaps = 0;
                        let wrenchTime = 0;
                        let wrenchi = 0;
                        for (i = 0; i < positionControls.length; i++) {
                            if (positionControls[i].source != "gear") positionControls[i].defoffset[0] = positionControls[i].offset[0];
                            if (positionControls[i].source != "gear") positionControls[i].snip[1] = 32;
                        }

                        addAnimator(function (t) {
                            for (i = 0; i < positionControls.length; i++) {
                                if (positionControls[i].source != "gear" && game.characters[positions[positionControls[i].pos1][positionControls[i].pos2].occupied].HP > 0) {
                                    positionControls[i].offset[0] = positionControls[i].defoffset - (t / 4);
                                    positionControls[i].anchor[0] = Math.min((2000 - t) / 80000, 0.025);
                                    positionControls[i].snip[0] = Math.floor(runTime) * 32;
                                }
                            }

                            runTime += ((t - runLaps) / 250);
                            if (runTime >= 2) {
                                runTime = 0;
                                runLaps = t;
                            }

                            wrenchTime += t - runLaps;
                            if (wrenchTime > 49) {
                                wrenchTime = 0;
                                wrenchi += 1;
                                if (wrenchi < 50) {
                                    let where = 0;
                                    while (where == 0) {
                                        for (i = 0; i < positionControls.length; i++) {
                                            if (positionControls[i].source != "gear") if (Math.random() > 0.7) where = i;
                                        }
                                    }
                                    fleeWrenches[wrenchi].anchor[0] = positionControls[where].anchor[0] + 0;
                                    fleeWrenches[wrenchi].anchor[1] = positionControls[where].anchor[1] + (Math.random()/10);
                                    fleeWrenches[wrenchi].offset[0] = positionControls[where].offset[0] * 2;
                                    fleeWrenches[wrenchi].offset[1] = positionControls[where].offset[1] + 0;
                                    fleeWrenches[wrenchi].alpha = 255;
                                }
                            }

                            for (i = 0; i < fleeWrenches.length; i++) {
                                fleeWrenches[i].offset[0] += 8;
                                fleeWrenches[i].offset[1] += 1;
                                if (fleeWrenches[i].offset[0] > 400) fleeWrenches[i].alpha = 0;
                            }

                            if (t > 2000) {
                                for (i = 0; i < positionControls.length; i++) {
                                    if (positionControls[i].source != "gear") positionControls[i].offset[0] = -500;
                                    if (positionControls[i].source != "gear") positionControls[i].anchor[0] = 0;
                                }
                                fleeLoss.alpha = 0;
                                fleeIcon.alpha = 0;
                                setScene(scenes.game());

                                delete runTime;
                                delete runLaps;

                                setTimeout(() => {
                                    positions = [];
                                    fightStats = [];
                                }, 500);
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }))
        }

    }
    for (i = 0; i < 6; i++) {
        topRowButton(i);
        fightButtons.push(controls.rect({
            anchor: [0.0025, 0.0025 + (i * 0.035)], sizeAnchor: [0.145, 0.03], offset: [0, -500],
            fill: "rgb(221, 155, 79)",
            alpha: 255,
        }))
        fightButtons.push(controls.label({
            anchor: [0.145, 0.02 + (i * 0.035)], offset: [0, -500],
            text: ["Normal Actions", "Item Inventory", "Magic", "Mastery Techniques", "Macro", "Flee"][i],
            fontSize: 16, fill: "black", align: "right", 
            alpha: 255,
        }))
        
    }

    for (i = 0; i < 50; i++) {
        fleeWrenches.push(controls.image({
            anchor: [0.5, 0.5], offset: [10, 10], sizeOffset: [32, 32],
            source: "wrench",
            alpha: 0,
        }));
    }

    for (i = 0; i < 3; i++) {
        actionDisplay.push(controls.label({
            anchor: [0.175, 0.07 + (0.03 * i)],
            fontSize: 24, fill: "rgb(125, 255, 0)", align: "left", outline: "darkgreen", outlineSize: 8,
            text: actionText[Math.max(0, actionText.length - 3 + i)],
            alpha: 255,
        }));
    }

    // finally a non array
    turnDisplay = controls.label({
        anchor: [0.95, 0.07],
        fontSize: 36, fill: "blue", align: "right", outline: "black", outlineSize: 8,
        text: "Turn 1",
        alpha: 255,
    });

    for (i = 0; i < 3; i++) {
        battleNumbers.push(controls.label({
            anchor: [5, 5], offset: [0, 0],
            fontSize: 24, fill: "white", align: "center", outline: "black", outlineSize: 3,
            text: "",
            alpha: 0,
        }));
    }

    

    for (j = 0; j < 2; j++) {
        for (i = 0; i < 6; i++) {
            fightActions.push(controls.rect({
                anchor: [0.33 + (j * 0.17), 0 + (i * 0.0375)], sizeAnchor: [0.17, 0.0375], offset: [0, -500],
                fill: "rgb(38, 52, 38)",
                alpha: 255,
                item: "",
                onClick(args) {
                    if (this.alpha == 255) {
                        if (positions[selectedAlly[0]][selectedAlly[1]].action == false && game.inventory[this.item.name] > 0) {
                            if (this.item().story != true) {
                                if (this.item().self != true) {
                                    fightaction = "item";
                                    selectedItem = this.item;
                                    hideFightButtons();
                                    hideFightActions();
                                }
                                else {
                                    selectedItem = this.item;
                                    positions[selectedAlly[0]][selectedAlly[1]].action = ["item", selectedItem.name, selectedAlly[0], selectedAlly[1], selectedAlly[0], selectedAlly[1]];
                                    removeItem(selectedItem.name, 1);
                                    fightaction = "none";
                                    positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "items/" + selectedItem().source;
                                    hideFightButtons();
                                    hideFightActions();
                                }
                            }
                        }
                    }
                }
            }))
            fightActions.push(controls.rect({
                anchor: [0.3325 + (j * 0.17), 0.0025 + (i * 0.0375)], sizeAnchor: [0.165, 0.0325], offset: [0, -500],
                fill: "rgb(42, 87, 44)",
                alpha: 255,
            }))
            fightActions.push(controls.label({
                anchor: [0.48 + (j * 0.17), 0.025 + (i * 0.0375)], offset: [-24, -500],
                text: "---",
                fontSize: 16, fill: "white", align: "right",
                alpha: 255,
            }))
            fightActions.push(controls.image({
                anchor: [0.48 + (j * 0.17), 0.025 + (i * 0.0375)], sizeOffset: [32, 32], offset: [0, -520],
                source: "gear",
                alpha: 0,
            }))

        }
    }
    fightActions.push(controls.rect({
        anchor: [0.67, 0.1875], sizeAnchor: [0.17, 0.0375], offset: [0, -500],
        fill: "rgb(38, 52, 38)",
        alpha: 255,
        item: "",
        onClick(args) {
            if (this.alpha == 255) {
                hideFightActions();
                showFightButtons();
            }
        }
    }));
    fightActions.push(controls.rect({
        anchor: [0.6725, 0.19], sizeAnchor: [0.165, 0.0325], offset: [0, -500],
        fill: "rgb(42, 87, 44)",
        alpha: 255,
    }))
    fightActions.push(controls.label({
        anchor: [0.755, 0.2075], offset: [-24, -500],
        text: "Back",
        fontSize: 16, fill: "white", align: "center",
        alpha: 255,
    }))


    fightActions.push(controls.rect({
        anchor: [0.67, 0.0], sizeAnchor: [0.17, 0.0375], offset: [0, -500],
        fill: "rgb(38, 52, 38)",
        alpha: 255,
        item: "",
        onClick(args) {
            if (this.alpha == 255 && itemPage > 0) {
                itemPage -= 1;
                showItems();
            }
        }
    }));
    fightActions.push(controls.rect({
        anchor: [0.6725, 0.0025], sizeAnchor: [0.165, 0.0325], offset: [0, -500],
        fill: "rgb(42, 87, 44)",
        alpha: 255,
    }))
    fightActions.push(controls.label({
        anchor: [0.755, 0.025], offset: [-24, -500],
        text: "Previous",
        fontSize: 16, fill: "white", align: "center",
        alpha: 255,
    }))


    fightActions.push(controls.rect({
        anchor: [0.67, 0.0375], sizeAnchor: [0.17, 0.0375], offset: [0, -500],
        fill: "rgb(38, 52, 38)",
        alpha: 255,
        item: "",
        onClick(args) {
            if (this.alpha == 255) {
                itemPage += 1;
                showItems();
            }
        }
    }));
    fightActions.push(controls.rect({
        anchor: [0.6725, 0.04], sizeAnchor: [0.165, 0.0325], offset: [0, -500],
        fill: "rgb(42, 87, 44)",
        alpha: 255,
    }))
    fightActions.push(controls.label({
        anchor: [0.755, 0.0625], offset: [-24, -500],
        text: "Next",
        fontSize: 16, fill: "white", align: "center",
        alpha: 255,
    }))


    for (j = 0; j < 2; j++) {
        for (i = 0; i < 3; i++) {
            fightStats.push(controls.label({
                anchor: [0.155 + (j * 0.35), 0.8 + (i * 0.075)], offset: [0, 0],
                text: "Lvl. 1",
                fontSize: 16, fill: "rgb(0, 255, 0)", align: "left", outline: "black", outlineSize: 6,
                alpha: 0
            }))
            fightStats.push(controls.image({
                anchor: [0.19 + (j * 0.35), 0.775 + (i * 0.075)], sizeOffset: [64, 64], snip: [0, 0, 32, 32],
                source: "bleu",
                alpha: 0
            }))


            fightStats.push(controls.rect({
                anchor: [0.24 + (j * 0.35), 0.78 + (i * 0.075)], sizeAnchor: [0.2, 0.025],
                fill: "rgb(63, 127, 63)",
                alpha: 255
            }))
            fightStats.push(controls.rect({ // The bg behind the bar
                anchor: [0.242 + (j * 0.35), 0.782 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(5, 51, 5)",
                alpha: 255
            }))
            fightStats.push(controls.rect({
                anchor: [0.242 + (j * 0.35), 0.782 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(128, 128, 128)",
                alpha: 255
            }))
            fightStats.push(controls.rect({ // Loss
                anchor: [0.242 + (j * 0.35), 0.782 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(200, 204, 200)",
                alpha: 0
            }))


            fightStats.push(controls.rect({
                anchor: [0.24 + (j * 0.35), 0.81 + (i * 0.075)], sizeAnchor: [0.2, 0.025],
                fill: "rgb(30, 109, 30)",
                alpha: 255
            }))
            fightStats.push(controls.rect({ // The bg behind the bar
                anchor: [0.242 + (j * 0.35), 0.812 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(51, 0, 51)",
                alpha: 255
            }))
            fightStats.push(controls.rect({
                anchor: [0.242 + (j * 0.35), 0.812 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(85, 85, 85)",
                alpha: 255
            }))
            fightStats.push(controls.rect({ // Loss
                anchor: [0.242 + (j * 0.35), 0.812 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(255, 255, 255)",
                alpha: 0
            }))


            fightStats.push(controls.label({
                anchor: [0.438 + (j * 0.35), 0.792 + (i * 0.075)],
                fill: "white", align: "right", fontSize: 20,
                text: "0",
                alpha: 0
            }))
            fightStats.push(controls.label({
                anchor: [0.438 + (j * 0.35), 0.822 + (i * 0.075)],
                fill: "white", align: "right", fontSize: 20,
                text: "5/5",
                alpha: 0
            }))

            fightStats.push(controls.image({
                anchor: [0.16 + (j * 0.35), 0.81 + (i * 0.075)], sizeOffset: [32, 32],
                source: "physical",
                alpha: 0
            }))

            fightStats.push(controls.image({
                anchor: [0.22 + (j * 0.35), 0.81 + (i * 0.075)], sizeOffset: [32, 32],
                source: "gear",
                alpha: 0
            }))
        }
    }


    // Win Screen
    winScreen.push(controls.rect({
        anchor: [0.2, 0.3], sizeAnchor: [0.6, 0.4], offset: [0, -1000],
        fill: "rgb(181, 133, 66)",
        alpha: 0,
    }));
    winScreen.push(controls.rect({
        anchor: [0.21, 0.31], sizeAnchor: [0.58, 0.38], offset: [0, -1000],
        fill: "rgb(212, 159, 82)",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.5, 0.33], offset: [0, -1000],
        text: "Victory!",
        fontSize: 36, fill: "black", align: "center",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.62, 0.4], offset: [0, -1000],
        text: "wrenches",
        fontSize: 24, fill: "black", align: "left",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.62, 0.43], offset: [0, -1000],
        text: "bricks",
        fontSize: 24, fill: "black", align: "left",
        alpha: 0,
    }));
    for (i = 0; i < game.chars.length; i++) {
        winScreen.push(controls.label({
            anchor: [0.22, 0.4 + (0.03 * i)], offset: [0, -1000],
            text: "Nobody +0 XP",
            fontSize: 24, fill: "black", align: "left",
            alpha: 0,
        }));
    }
    winScreen.push(controls.button({
        anchor: [0.7, 0.6], sizeAnchor: [0.075, 0.05], offset: [0, -1000],
        text: "Continue",
        onClick(args) {
            if (checkAllDead(true)) {
                setScene(scenes.game());

                positions = [];
                fightStats = [];
            }
        },
        alpha: 0,
    }));

    // Battle Log (Bottom Left)

    fightLogComponents.push(controls.rect({
        anchor: [0, 0.775], sizeAnchor: [0.15, 0.225],
        fill: "rgb(191, 137, 69)",
        alpha: 255,
    }));

    fightLogComponents.push(controls.rect({
        anchor: [0.005, 0.78], sizeAnchor: [0.14, 0.215],
        fill: "rgb(221, 155, 79)",
        alpha: 255,
    }));

    for (i = 0; i < 12; i++) {
        fightLogComponents.push(controls.label({
            anchor: [0.01, 0.8 + (i*0.016)], offset: [2, 0],
            fontSize: 16, fill: "rgb(0, 0, 0)", align: "left",
            text: fightlog[Math.max(0, fightlog.length - 12 + i)],
            alpha: 255,
        }));
    }

    // Fight Overview (bottom right)

    enemyListComponents.push(controls.rect({
        anchor: [0.85, 0.775], sizeAnchor: [0.15, 0.225],
        fill: "rgb(191, 137, 69)",
        alpha: 255,
    }));

    enemyListComponents.push(controls.rect({
        anchor: [0.855, 0.78], sizeAnchor: [0.14, 0.215],
        fill: "rgb(221, 155, 79)",
        alpha: 255,
    }));
    
    for (i = 0; i < 9; i++) {
        enemyListComponents.push(controls.label({
            anchor: [0.86, 0.816 + (i * 0.016)], offset: [2, 0],
            fontSize: 16, fill: "rgb(0, 0, 0)", align: "left",
            text: "ERROR" + i,
            alpha: 255,
        }));
    }

    // POSITIONS
    // Positions

    // This huge var stores the 3x3 positions and everything about their current state
    // usage example: positions[1][1].occupied (that's the middle middle tile)
    positions =
        [
            [
                {
                    pos: "top left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "top middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "top right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "middle left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "middle middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "middle right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "bottom left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "bottom middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "bottom right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
        ];

    // Positions but for enemies. same usage same stuff
    var epositions =
        [
            [
                {
                    pos: "top left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "top middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "top right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "middle left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "middle middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "middle right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "bottom left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "bottom middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "bottom right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
        ];

    if (currentEnemies.length > 0) {
        for (i = 0; i < currentEnemies.length; i++) {
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].isOccupied = true;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].occupied = currentEnemies[i][0];
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].name = enemyTypes[currentEnemies[i][0]].name;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].maxHP = enemyTypes[currentEnemies[i][0]].HP;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].HP = enemyTypes[currentEnemies[i][0]].HP;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].strength = enemyTypes[currentEnemies[i][0]].strength;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].eva = enemyTypes[currentEnemies[i][0]].eva;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].agi = enemyTypes[currentEnemies[i][0]].agi;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].element = enemyTypes[currentEnemies[i][0]].element;
        }
    }
    for (i = 0; i < 18; i++) {
        attackAnimationObjects.push(controls.image({
            anchor: [0, 0], offset: [0, 0], sizeOffset: [48, 48],
            source: "attackani0",
            alpha: 0,
        }))
    }
    
    // Friendly pos (left)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionControls.push(controls.image({
                anchor: [0.0 /* 0.025 */, 0.45], offset: [-256, 72 * j], sizeOffset: [64, 64],
                defoffset: 72 * i,
                source: "gear",
                alpha: 255,
                snip: [0, 64, 32, 32],
                pos1: i,
                pos2: j,
                onClick(args) {
                    // Select character
                    if (fightaction == "none" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true) {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "active";
                        showFightButtons();
                    }

                    if (fightaction == "item") {
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["item", selectedItem.name, selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        removeItem(selectedItem.name, 1);
                        fightaction = "none";
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "items/" + selectedItem().source;
                    }

                    if (fightaction == "switch") {
                        if (switchThose[0][0] != [this.pos1] || switchThose[0][1] != [this.pos2]) {
                            switchThose[0] = selectedAlly;
                            switchThose[1] = [this.pos1, this.pos2];
                            positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "hasaction";
                            positions[switchThose[0][0]][switchThose[0][1]].action = ["switch", switchThose[0][0], switchThose[0][1], switchThose[1][0], switchThose[1][1]];
                            fightaction = "none";
                            hideFightButtons();
                            hideFightActions();
                        }
                    }
                    if (fightaction == "heal1" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "heal2";
                    }
                    else if (fightaction == "heal2" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["heal", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                        fightaction = "none";
                    }
                }
            }));
        }
    }

    // Enemies pos (right)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            epositionControls.push(controls.image({
                anchor: [0.975, 0.45], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
                source: "gear",
                alpha: 255,
                snip: [0, 32, 32, 32],
                pos1: i,
                pos2: j,
                onClick(args) {
                    //epositions[this.pos1][this.pos2].occupied = "selected";
                    // uhhh... no?F
                    // but add fighting here at some point
                    // THAT POINT IS NOW! Idiot

                    if (fightaction == "attack2" && positions[selectedAlly[0]][selectedAlly[1]].action == false) {
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["attack", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];

                        fightaction = "none";
                        hideFightButtons();
                        hideFightActions();
                        
                    }
                }
            }));
        }
    }

    // Pos grid
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.025, 0.45], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "grid",
                alpha: 255,
            }));
        }
    }
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.975, 0.45], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
                source: "grid",
                alpha: 255,
            }));
        }
    }

    function updatePositions() {
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positions[i]) {
                    if (positions[i][j].isOccupied == true) {
                        if (win == true) {
                        }
                        else {
                            positionControls[i + (j * 3)].source = positions[i][j].occupied;
                        }
                        positionControls[i + (j * 3)].alpha = 255;
                    }
                    else {
                        if (positions[i][j].occupied != undefined && positions[i][j].occupied != false) {
                            if (game.characters[positions[i][j].occupied].HP < 1 || positions[i][j].isOccupied == false) {
                                positionControls[i + (j * 3)].source = positions[i][j].occupied + "_dead";
                                positionControls[i + (j * 3)].snip = [0, 0, 32, 32];
                                fightStats[4 + (game.chars.indexOf(positions[i][j].occupied)) * amountStats].alpha = 0;
                            }
                            else {
                                positionControls[i + (j * 3)].source = "gear";
                                positionControls[i + (j * 3)].alpha = 0;
                            }
                        }
                        else {
                                positionControls[i + (j * 3)].source = "gear";
                                positionControls[i + (j * 3)].alpha = 0;
                        }
                
                    }
                }
                else {
                    positionControls[i + (j * 3)].source = "gear";
                }

                // enemies! enemies!
                if (epositions[i]) {
                    if (epositions[i][j].isOccupied == true) {
                        epositionControls[i + (j * 3)].source = epositions[i][j].occupied;
                        epositionControls[i + (j * 3)].alpha = 255;

                        // I hate this code here
                        let doWeHaveThisOneDoWe = 0;
                        let amount = 0;
                        let which = 0;
                        for (k = 0; k < 3; k++) {
                            for (l = 0; l < 3; l++) {
                                if (enemyAmounts[k + (l * 3)] != undefined) if (enemyAmounts[k + (l * 3)] == enemyTypes[epositions[i][j].occupied].name) {
                                    if(which == 0) which = k + (l * 3);
                                    doWeHaveThisOneDoWe += 1;
                                }
                                if (enemyTypes[epositions[k][l].occupied] != undefined )if (enemyTypes[epositions[k][l].occupied].name == enemyTypes[epositions[i][j].occupied].name) amount += 1;
                            }
                        }
                        if (doWeHaveThisOneDoWe == 0) {
                            enemyListComponents[(i + (j * 3)) + 2].text = enemyTypes[epositions[i][j].occupied].name + " x" + amount;
                            enemyAmounts[i + (j * 3)] = enemyTypes[epositions[i][j].occupied].name;
                        }
                        else if (doWeHaveThisOneDoWe == 1 && which == i + (j * 3)) {
                            enemyListComponents[(i + (j * 3)) + 2].text = enemyTypes[epositions[i][j].occupied].name + " x" + amount;
                        }
                        else {
                            enemyListComponents[(i + (j * 3)) + 2].text = "";
                        }

                    }
                    else {
                        epositionControls[i + (j * 3)].source = "gear";
                        epositionControls[i + (j * 3)].alpha = 0;
                        enemyListComponents[(i + (j * 3)) + 2].text = "";
                    }
                }
                else {
                    epositionControls[i + (j * 3)].source = "gear";
                }
            }
        }

        // Mobile resizing
        if (isMobile()) {
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    positionControls[i + (j * 3)].sizeOffset = [48, 48];
                    //positionControls[i + (j * 3)].offset = [56 * i, 72 * j];
                    epositionControls[i + (j * 3)].sizeOffset = [48, 48];
                    //epositionControls[i + (j * 3)].offset = [-(48 + (56 * i)), 72 * j];
                    if (positionGrid[i + (j * 3)].source == "grid" || positionGrid[i + (j * 3)].source == "hasaction" || positionGrid[i + (j * 3)].source == "selected") {
                        positionGrid[i + (j * 3)].sizeOffset = [48, 48];
                        positionGrid[i + (j * 3)].offset = [56 * i, 72 * j];
                    }
                    else {
                        positionGrid[i + (j * 3)].sizeOffset = [24, 24];
                        positionGrid[i + (j * 3)].offset = [(56 * i) + 24, (72 * j) + 24];
                    }
                    if (positionGrid[9 + i + (j * 3)].source == "grid" || positionGrid[9 + i + (j * 3)].source == "hasaction" || positionGrid[9 + i + (j * 3)].source == "selected") {
                        positionGrid[9 + i + (j * 3)].sizeOffset = [48, 48];
                        positionGrid[9 + i + (j * 3)].offset = [-(48 + (56 * i)), 72 * j];
                    }
                    else {
                        positionGrid[9 + i + (j * 3)].sizeOffset = [24, 24];
                        positionGrid[9 + i + (j * 3)].offset = [(56 * i) + 24, (72 * j) + 24];
                    }

                    
                }
            }
        }
        else {
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    positionControls[i + (j * 3)].sizeOffset = [64, 64];
                    //positionControls[i + (j * 3)].offset = [72 * i, 72 * j];
                    epositionControls[i + (j * 3)].sizeOffset = [64, 64];
                    //epositionControls[i + (j * 3)].offset = [-(72 + (72 * i)), 72 * j]
                    if (positionGrid[i + (j * 3)].source == "grid" || positionGrid[i + (j * 3)].source == "hasaction" || positionGrid[i + (j * 3)].source == "selected") {
                        positionGrid[i + (j * 3)].sizeOffset = [64, 64];
                        positionGrid[i + (j * 3)].offset = [72 * i, 72 * j];
                    }
                    else {
                        positionGrid[i + (j * 3)].sizeOffset = [32, 32];
                        positionGrid[i + (j * 3)].offset = [(72 * i) + 32, (72 * j) + 32];
                    }
                    if (positionGrid[9 + i + (j * 3)].source == "grid" || positionGrid[9 + i + (j * 3)].source == "hasaction" || positionGrid[9 + i + (j * 3)].source == "selected") {
                        positionGrid[9 + i + (j * 3)].sizeOffset = [64, 64];
                        positionGrid[9 + i + (j * 3)].offset = [-(72 + (72 * i)), 72 * j];
                    }
                    else {
                        positionGrid[9 + i + (j * 3)].sizeOffset = [32, 32];
                        positionGrid[9 + i + (j * 3)].offset = [(72 * i) + 32, (72 * j) + 32];
                    }
                }
            }
        }


        actionText = [];
        if (fightaction == "none") postAction("Select a character before assigning a command.");
        if (fightaction == "active") postAction("What will you assign for <character>?");
        if (fightaction == "attack1") postAction("What <category> will <character> use?");
        if (fightaction == "attack2") postAction("Choose a target.");
        if (fightaction == "macro") postAction("What predetermined set ot actions will <character> use?");
        while (actionText.length < 3) {
            actionText.push("");
        }

        turnDisplay.text = "Turn " + turn;
            
    }

    // When the fight starts. How many chars do we have? Who exists? Show/Hide/Gray out stats
    for (i = 0; i < game.chars.length; i++) {
        fightStats[amountStats * i].alpha = 255;
        fightStats[1 + amountStats * i].alpha = 255;
        fightStats[4 + amountStats * i].fill = "rgb(20, 204, 20)";
        if (getPlayer(1 + i).HP > 0) fightStats[4 + amountStats * i].sizeAnchor[0] = 0.1960 * (getPlayer(1 + i).HP / getPlayer(1 + i).maxHP);
        fightStats[8 + amountStats * i].fill = "rgb(205, 0, 205)";
        fightStats[10 + amountStats * i].alpha = 255;
        fightStats[11 + amountStats * i].alpha = 255;
        fightStats[12 + amountStats * i].alpha = 255;
        if (game.characters[characters[i]].element != undefined) fightStats[12 + amountStats * i].source = game.characters[characters[i]].element;
    }

    for (i in game.characters) {
        if (game.chars.includes(game.characters[i].name.toLowerCase())) {
            if (game.characters[i].pos != undefined) {
                let duplicate = false;
                for (j in game.characters) {
                    if (game.characters[i].pos[0] == game.characters[j].pos[0] && game.characters[i].pos[1] == game.characters[j].pos[1] && i != j) duplicate = true;
                }
                while (duplicate == true) {
                    game.characters[i].pos = [Math.floor(3 * Math.random()), Math.floor(3 * Math.random())];
                    duplicate = false;
                    for (j in game.characters) {
                        if (game.characters[i].pos[0] == game.characters[j].pos[0] && game.characters[i].pos[1] == game.characters[j].pos[1] && i != j) duplicate = true;
                    }
                }
                positions[game.characters[i].pos[0]][game.characters[i].pos[1]].occupied = game.characters[i].name.toLowerCase();
                positions[game.characters[i].pos[0]][game.characters[i].pos[1]].isOccupied = true;
            }
        }
    }

    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            if (positions[i][j].occupied != undefined) {
                if (positions[i][j].occupied != false) {
                    if (game.characters[positions[i][j].occupied].HP < 1) {
                        positions[i][j].isOccupied = false;
                        positions[i][j].action = false;
                    }
                }
            }
        }
    }


    let runTime = 0;
    let runLaps = 0;
    addAnimator(function (t) {
        for (i = 0; i < positionControls.length; i++) {
            if (positionControls[i].source != "gear") positionControls[i].offset[0] = positionControls[i].defoffset - (1000 - t);
            if (positionControls[i].source != "gear") positionControls[i].anchor[0] = Math.min(t / 40000, 0.025);
            if (positionControls[i].source != "gear") positionControls[i].snip[0] = Math.floor(runTime) * 32;
        }

        runTime += ((t - runLaps) / 250);
        if (runTime >= 2) {
            runTime = 0;
            runLaps = t;
        }
        if (t > 1000) {
            for (i = 0; i < positionControls.length; i++) {
                if (positionControls[i].source != "gear") positionControls[i].offset[0] = positionControls[i].defoffset;
                if (positionControls[i].source != "gear") positionControls[i].anchor[0] = 0.025;
            }
            return true;
        }
        return false;
    });
    delete runTime;
    delete runLaps;

    return {
        // Pre-render function
        preRender(ctx, delta) {
            ctx.drawImage(images.fight_bg, 0, 0, width * scale, height);

            // Update the stats stuff at the bottom
            for (i = 0; i < game.chars.length; i++) {
                fightStats[amountStats * i].text = "Lvl. " + getPlayer(i + 1).level;
                fightStats[1 + amountStats * i].source = getPlayer(i + 1).name.toLowerCase();
                if (getPlayer(i + 1).EP > 0) fightStats[8 + amountStats * i].sizeAnchor[0] = 0.1960 * (getPlayer(i + 1).EP / getPlayer(i + 1).maxEP);
                fightStats[10 + amountStats * i].text = getPlayer(i + 1).HP + "/" + getPlayer(i + 1).maxHP;
                fightStats[11 + amountStats * i].text = getPlayer(i + 1).EP + "/" + getPlayer(i + 1).maxEP;

                if (getPlayer(i + 1).effect[0] != "none") fightStats[13 + amountStats * i].alpha = 255;
                if (getPlayer(i + 1).effect[0] != "none") fightStats[13 + amountStats * i].source = getPlayer(i + 1).effect[0];
                if (getPlayer(i + 1).effect[0] == "none") fightStats[13 + amountStats * i].alpha = 0;
            }

            // Update fightlog
            for (i = 0; i < 12; i++) {
                fightLogComponents[2 + i].text = fightlog[Math.max(0, fightlog.length - 12 + i)];
            }
            for (i = 0; i < 3; i++) {
                actionDisplay[i].text = actionText[i];
            }

            // Grid thing
            if (settings.grid == true) {
                for (i in positionGrid) {
                    positionGrid[i].alpha = 255;
                }
            }
            else {
                for (i in positionGrid) {
                    if (positionGrid[i].source != "grid") {
                        positionGrid[i].alpha = 255;
                    }
                    else {
                        positionGrid[i].alpha = 0;
                    }
                }
            }
            
            put += delta;
            if (put > 99) {
                put = 0;
                updatePositions();
                if (checkAllAction()) {
                    executeActions();
                }

            }
        },

        // Controls
        controls: [
            // Load all the nice stuff
            ...fightButtons, ...fightActions, turnDisplay, fleeLoss, fleeIcon,
            ...fightLogComponents, ...enemyListComponents,
            ...fightOverview,
            ...fightStats, ...actionDisplay, ...winScreen,
            ...positionControls, ...epositionControls, ...positionGrid, ...attackAnimationObjects, ...battleNumbers, ...fleeWrenches,
        ],
    }
};
