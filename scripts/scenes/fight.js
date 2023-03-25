var battleNumbers = [];
var fightStats = [];
const amountStats = 14;
var positions;
var defeatType = "default"; // default or nogameover

// Colors of the range indicator
const rangeColors = ["red", "pink", "blue"];

function battleNumber(pos, amount, type, offset = [0, 0], crit = false) {
    // Type 0 is HP, 1 is EP
    let bn;
    if (battleNumbers[0].alpha == 0) bn = 0;
    else if (battleNumbers[1].alpha == 0) bn = 1;
    else bn = 2;

    let fontToUse = "DePixelKlein";
    let fontSizeToUse = 24;
    let n = amount;
    if (n < 0) n = amount * (-1);
    
    if (n > 50 && n < 200) fontToUse = "DePixelBreit";
    if (n > 199) fontToUse = "DePixelHalbfett";

    if (n > 50 && n < 200) fontSizeToUse = 26;
    if (n > 199) fontSizeToUse = 28;

    battleNumbers[bn].font = fontToUse;
    battleNumbers[bn].fontSize = fontSizeToUse;
    battleNumbers[bn].anchor[0] = pos[0];
    battleNumbers[bn].anchor[1] = pos[1];
    battleNumbers[bn].offset[0] = offset[0];
    battleNumbers[bn].offset[1] = offset[1];
    if (crit) battleNumbers[bn].text = amount + "!".repeat(amount.toString().length - 1);
    else battleNumbers[bn].text = amount;
    battleNumbers[bn].alpha = 1;

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
        let Leftend = 0.1960 * (Math.max(getPlayer(1 + whichChar).HP, 0) / getStat(1 + whichChar, "maxHP"));
        let Length = (0.1960 * (HealthBefore / getStat(1 + whichChar, "maxHP"))) - Leftend;

        if (Length == 0) return false;
        fightStats[which].alpha = 1;
        fightStats[which - 1].alpha = 1;
        if (Length > 0) {
            if (getPlayer(1 + whichChar).HP > 0) fightStats[which - 1].sizeAnchor[0] = 0.1960 * (getPlayer(1 + whichChar).HP / getStat(1 + whichChar, "maxHP"));
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
            Leftend = 0.1960 * (HealthBefore / getStat(1 + whichChar, "maxHP"));
            Length = (0.1960 * (getPlayer(1 + whichChar).HP / HealthBefore)) - Leftend;
            fightStats[which].anchor[0] = 0.242 + Leftend + (0.35 * (row-1));;
            fightStats[which].sizeAnchor[0] = 0.00001;

            fightStats[which - 1].alpha = 1;
            addAnimator(function (t) {
                fightStats[which].sizeAnchor[0] = Length * Math.max(0.01, ((Math.min(t * 0.01, 0.5))));
                
                if (t > 1400) {
                    fightStats[which].anchor[0] = 0.242 + Leftend;
                    if (getPlayer(1 + whichChar).HP > 0) fightStats[which - 1].sizeAnchor[0] = 0.1960 * (getPlayer(1 + whichChar).HP / getStat(1 + whichChar, "maxHP"));
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
    var alliesFled = 0;

    var fightButtons = [];
    var actionButtons = [];
    var fightActions = [];

    var fightLogComponents = [];
    var enemyListComponents = [];
    var enemyAmounts = ["", "", "", "", "", "", "", "", ""];
    var fightOverview = [];
    var winScreen = [];
    var winScreen2 = [];
    var winStats = [];
    var gameOverScreen = [];
    var gameOverScreen2 = [];
    var fleeWrenches = [];
    var actionDisplay = [];
    var actionText = [];

    var positionControls = [];
    var epositionControls = [];
    var positionGrid = [];
    var positionGrid2 = [];
    var highlightGrid = [];
    var highlightChange = 0;
    var highlightAlpha = 1;
    var attackAnimationObjects = [];

    var selectedAlly = [0, 0];

    var win = false;
    var lost = false;
    var busy = false;
    var started = false;

    var selectedItem;

    var gainedItems = [];

    var cutsceneElements = [];

    let globalFightAnimationTime = 0;

    const ACTIONDELAY = 670;

    var fightlog = [
        "",
        "Battle has started!",
        "All actions will",
        "be logged here!",
    ];


    function checkAllDead(checkonly = false) {
        if (lost) return false;
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

            
            setTimeout(() => { stopMusic(); playSound("victory"); }, 250);

            setTimeout(() => { victoryScreen() }, 3000);

            for (i = 0; i < game.chars.length; i++) {
                // Get rid of some effects
                if (getPlayer(i + 1).effect[0] == "acid" ||
                    getPlayer(i + 1).effect[0] == "burn" ||
                    getPlayer(i + 1).effect[0] == "enraged" ||
                    getPlayer(i + 1).effect[0] == "paralysis" ||
                    getPlayer(i + 1).effect[0] == "condemned") {
                    causeEffect(i, "none", 0);
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

                if (exc.length == 0) continue;

                if (game.characters[positions[exc[0]][exc[1]].occupied].HP > 0) { // Dead? No animation! We will let you bleed out there hahaha
                    // Is not dead - do the animation
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
                        console.log(controlled);

                        if (amount > 1) {
                            addAnimator(function (t) {
                                controlled.aniTime = ((t - controlled.aniTime2) / 306);
                                if (controlled.aniTime >= controlled.amount) {
                                    controlled.aniTime = 0;
                                    controlled.aniTime2 = t;
                                }

                                controlled.snip[0] = controlled.defsnip + (32 * Math.max(0, Math.floor(controlled.aniTime)));
                                if (controlled.aniTime2 > 2999) {
                                    delete controlled.aniTime;
                                    delete controlled.aniTime2;
                                    delete controlled.defsnip;
                                    console.log(controlled.source);
                                    return true;
                                }
                                return false;
                            })
                        }
                    }
                }
            }
            
        }

        // Check how many allies are still alive
        let aliveallies = 0;
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positions[i][j].isOccupied == true) {
                    aliveallies += 1;
                }
            }
        }
        // All allies are dead and nobody has fled -> GAME OVER
        if (aliveallies == 0 && alliesFled == 0) {
            lost = true;
            if (defeatType == "default") {
                // GAME OVER script
                deathScreen();
            }
            if (defeatType == "nogameover") {
                // Same as beginning of deathScreen
                stopMusic();

                addAnimator(function (t) {
                    gameOverScreen[0].alpha = 0 + Math.min(1, (t / 2000));
                    if (t > 3999) {
                        for (i in game.characters) {
                            game.characters[i].HP = 1;
                        }
                        endFight();
                        gameOverScreen[0].alpha = 0;
                        return true;
                    }
                    return false;
                });
            }
        }
        else if (aliveallies == 0) {
            // No allies are left, some of them dead, but some fled so no GAME OVER
            lost = true;
            endFight();
        } 
    }

    function victoryScreen() {
        // Victory Screen
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positionControls[i + (j * 3)].source != "gear") {
                    positionControls[i + (j * 3)].defanchor = positionControls[i].anchor[0];
                    changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "unassigned");
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
            for (i = 0; i < fightStats.length; i++) {
                fightStats[i].offset[1] = t / 4;
            }
            turnDisplay.offset[1] = 0 - (t / 4);
            for (i = 0; i < actionDisplay.length; i++) {
                actionDisplay[i].offset[1] = 0 - (t / 4);
            }

            for (i = 0; i < fightLogComponents.length; i++) {
                fightLogComponents[i].offset[1] = (t / 4) + fightLogComponents[i].baseoffset[1];
            }
            for (i = 0; i < enemyListComponents.length; i++) {
                enemyListComponents[i].offset[1] = (t / 4) + enemyListComponents[i].baseoffset[1];
            }

            runTime += ((t - runLaps) / 250);
            if (runTime >= 2) {
                runTime = 0;
                runLaps = t;
            }
            if (t > 2000) {
                let EXPforAll = 2;
                let wrenchGain = 100;
                let wrenchLUK = 1;
                let brickGain = 10;
                let brickLUK = 1;

                for (i in gainedItems) {
                    addItem(gainedItems[i], 1);
                }

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
                for (i in game.characters) {
                    wrenchLUK += Math.pow(1.2, getStat(game.characters[i].name.toLowerCase(), "luk"));
                    brickLUK += getStat(game.characters[i].name.toLowerCase(), "luk");
                }
                wrenchGain = wrenchGain * Math.ceil(wrenchLUK);
                brickGain = brickGain * Math.ceil(brickLUK);

                EXPforAll = Math.ceil(EXPforAll);
                wrenchGain = Math.ceil(wrenchGain);

                addWrenches(wrenchGain);
                addBricks(brickGain);

                winScreen[3].text = "You got " + EXPforAll + " XP!";
                winScreen[6].text = "+" + formatNumber(wrenchGain);
                winScreen[8].text = "+" + formatNumber(brickGain);

                if (gainedItems.length == 0) winScreen[2].text = "Next";

                for (i = 0; i < game.chars.length; i++) {
                    getPlayer(1 + i).preEXP = getPlayer(1 + i).EXP;
                    if (getPlayer(1 + i).HP > 0) getPlayer(1 + i).EXP += EXPforAll;
                }

                let a = 7;

                for (i = 0; i < game.chars.length; i++) {
                    // This Player exists
                    if (getPlayer(1 + i).HP > 0) {
                        // and is alive
                        winStats[0 + (i * a)].fill = "#c4c404";
                        winStats[1 + (i * a)].fill = "#707001";
                        winStats[5 + (i * a)].source = getPlayer(i + 1).name.toLowerCase();
                        winStats[4 + (i * a)].text = "Lvl. " + getPlayer(i + 1).level;
                    }
                    else {
                        // and is dead
                        winStats[0 + (i * a)].fill = "#aeaeae";
                        winStats[1 + (i * a)].fill = "#636363";
                        winStats[5 + (i * a)].source = getPlayer(i + 1).name.toLowerCase() + "_dead";
                    }
                    winStats[6 + (i * a)].text = getPlayer(i + 1).preEXP + "/25";
                }

                addAnimator(function (t) {
                    let am = (6 - Math.min((t - 3000) / 100, 5));

                    for (i = 0; i < game.chars.length; i++) {
                        winStats[2 + (i * 7/* a */)].sizeAnchor[0] = 0.01 + (Math.min(0.588, 0.592 * (getPlayer(1 + i).EXP / 25)) / am/*getStat(i + 1, "maxHP")*/);
                        winStats[6 + (i * 7)].text = Math.floor(Math.max(getPlayer(i + 1).preEXP, (getPlayer(i + 1).EXP / am))) + "/25";
                    }
                    if (t > 3599) {
                        winScreen[2].alpha = 1;
                        return true;
                    }
                    return false;
                });

                for (i = 1; i < winScreen.length; i++) {
                    winScreen[i].offset[1] = -1000;
                    if(i != 2) winScreen[i].alpha = 1;
                }
                for (i = 0; i < winStats.length; i++) {
                    if (Math.floor(i / a) < game.chars.length) { // Don't show not existing dudes
                        winStats[i].offset[0] = -2000;
                        if (i % a != 3 && winStats[i].source != "gear") winStats[i].alpha = 1;
                    }
                }

                winScreen[0].alpha = 0;
                winStats[0].offset[0] = 0;
                addAnimator(function (t) {
                    winScreen[0].alpha = Math.min(0 + (t / 1000), 0.8);
                    for (i = 1; i < winScreen.length; i++) {
                        winScreen[i].offset[1] = Math.min(-1000 + t, 0);
                    }
                    for (i = 0; i < winStats.length; i++) {
                        winStats[i].offset[0] = Math.min(-2000 + (t * 2), 0);
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

    function deathScreen() {
        // GAME OVER
        stopMusic();

        addAnimator(function (t) {
            gameOverScreen[0].alpha = 0 + (t / 2000);
            if (t > 1999) {
                gameOverScreen[0].alpha = 1;
                return true;
            }
            return false;
        });

        setTimeout(() => {
            gameOverScreen[1].alpha = 1;

            addAnimator(function (t) {
                gameOverScreen[1].offset[1] = -1000 + t;
                if (t > 999) {
                    gameOverScreen[1].offset[1] = 0;
                    return true;
                }
                return false;
            });
        }, 4000);

        setTimeout(() => {
            playSound("gameover");

            // Arbitrary variables
            let bounceHeight = 0.8;
            let timeOffset = 0

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
                        gameOverScreen[1].anchor[1] = 0.2 - ofs;
                        break;
                    }
                } else {
                    gameOverScreen[1].anchor[1] = 0.2;
                    return true;
                }
            });
        }, 5000);

        setTimeout(() => {
            gameOverScreen[2].alpha = 1;

            addAnimator(function (t) {
                gameOverScreen[2].offset[1] = 1000 - t;
                if (t > 999) {
                    gameOverScreen[2].offset[1] = 0;
                    return true;
                }
                return false;
            });
        }, 6500);

        // Second part

        setTimeout(() => {
            addAnimator(function (t) {
                gameOverScreen2[0].alpha = 0 + (t / 2000);
                if (t > 1999) {
                    gameOverScreen2[0].alpha = 1;
                    return true;
                }
                return false;
            });
        }, 8000);

        setTimeout(() => {
            addAnimator(function (t) {
                gameOverScreen2[1].alpha = 0 + (t / 1000);
                gameOverScreen2[2].alpha = 0 + (t / 1000);
                if (t > 999) {
                    gameOverScreen2[1].alpha = 1;
                    gameOverScreen2[2].alpha = 1;
                    return true;
                }
                return false;
            });
        }, 9750);

        setTimeout(() => {
            addAnimator(function (t) {
                gameOverScreen2[3].alpha = 0 + (t / 1000);
                gameOverScreen2[4].alpha = 0 + (t / 1000);
                if (t > 999) {
                    gameOverScreen2[3].alpha = 1;
                    gameOverScreen2[4].alpha = 1;
                    return true;
                }
                return false;
            });
        }, 10500);
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

    function getDistance(type, pos) {
        // Used to get how many enemies are between the player and this enemy / the distance (output: 0, 1 or 2)

        if (type == "enemy") { // Player attacks enemy
            // Keep in mind epos are swapped - 2 is left and not right

            if (pos[0] == 2 && length > 0) return 0;

            let inFrontOfMe = 0;
            for (d = 2; d > pos[0]; d--) {
                if (epositions[d][pos[1]].isOccupied == true) inFrontOfMe += 1;
            }

            // Return 0, 1 or 2 depending on how many other enemies are between player and this enemy
            return inFrontOfMe;
        }
    }

    function canReach(length, type, pos) {
        // Used to determine whether the enemy is in range or not.

        // Length = 1, 2 or 3
        // pos is pos of enemy

        if (length > getDistance(type, pos)) return true;
        return false;
    }

    function changeEmo(who, to) {
        // Change battle sprite emotion thing
        positionControls[who].emo = to;
    }

    function calculateDamage(type, pos1, pos2, enpos1, enpos2) {
        let isCritical = false;
        let critBonus = 1;
        if (type == 1 || type == 3) {
            if (getStat(positions[pos1][pos2].occupied, "luk") > Math.random() * 100) {
                // Critical hit!
                isCritical = true;
                critBonus = CRITBOOST;
            }
        }
        if (type == 1) { // Allies attack evil
            if (positions[pos1][pos2].atk == undefined) positions[pos1][pos2].atk = 1;

            return [isCritical, Math.round(getStat(positions[pos1][pos2].occupied, "strength")
                * (1 - ROWBOOST + (ROWBOOST * pos1))
                * (1 + ROWBOOST + (ROWBOOST * enpos1))
                * positions[pos1][pos2].atk
                * getElementDamage(getStat(positions[pos1][pos2].occupied, "element"), epositions[enpos1][enpos2].element))
                * critBonus];
        }

        if (type == 2) { // Evil men attack allies
            if (positions[enpos1][enpos2].shield == undefined) positions[enpos1][enpos2].shield = 1;
            if (epositions[pos1][pos2].luk > Math.random() * 100) {
                // Critical hit!
                isCritical = true;
                critBonus = CRITBOOST;
            }

            return [isCritical, Math.round(epositions[pos1][pos2].strength
                * (1 + ROWBOOST - (ROWBOOST * pos1))
                * (1 - ROWBOOST + (ROWBOOST * enpos1))
                / (positions[enpos1][enpos2].shield != undefined ? positions[enpos1][enpos2].shield : 1)
                * getElementDamage(epositions[pos1][pos2].element, getStat(positions[enpos1][enpos2].occupied, "element").element))
                * critBonus];
        }

        if (type == 3) { // My own men attack themselves ohe noe
            return [isCritical, Math.round(getStat(positions[pos1][pos2].occupied, "strength")
                * (1 + ROWBOOST - (ROWBOOST * pos1))
                * (1 - ROWBOOST + (ROWBOOST * enpos1))
                * positions[enpos1][enpos2].atk
                * getElementDamage(positions[pos1][pos2].element, getStat(positions[enpos1][enpos2].occupied, "element").element))
                * critBonus];
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
        let maxLength = 16;
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
        if (positions == undefined || busy) return;
            let highestAGI = 0;
            let whoAGI;
            let pos = [];
            // Look for the fastest man alive
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    if (positions[i][j].action != false) { 
                            if (getStat(positions[i][j].occupied, "agi") > highestAGI) {
                                highestAGI = getStat(positions[i][j].occupied, "agi");
                                whoAGI = positions[i][j];
                                pos = [i, j];
                            }
                    }
                }
            }

        // Stop if there is nobody (when is that?)
        if (highestAGI == 0) {
            fightaction = "enemiesturn";
            for (i in positionControls) {
                if (positionControls[i].source != "gear") {
                    changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "unassigned");
                }
            }

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
        busy = true;

        // Ok, ok, now we know who (whoAGI) is first (highestAGI), so now do something
        switch (whoAGI.action[0]) {
            case "attack":
                if (positions[pos[0]][pos[1]].action[3] == undefined) positions[pos[0]][pos[1]].action[3] = Math.round(2 * Math.random());
                if (positions[pos[0]][pos[1]].action[4] == undefined) positions[pos[0]][pos[1]].action[4] = Math.round(2 * Math.random());

                let pos1 = positions[pos[0]][pos[1]].action[3];
                let pos2 = positions[pos[0]][pos[1]].action[4];

                selectedAlly = [positions[pos[0]][pos[1]].action[1], positions[pos[0]][pos[1]].action[2]];

                fightaction = "attack4"; // To avoid being able to click over and over again to get duplicate damage / EXP

                ret = findNewEnemy(selectedAlly[0], selectedAlly[1], pos1, pos2);
                if (ret == false) {
                    break;
                }
                else {
                    pos1 = ret[0];
                    pos2 = ret[1];
                }

                // Attack the enemy:
                attackEnemy(selectedAlly[0], selectedAlly[1], pos1, pos2, () => {
                    endOfExecute(pos);
                });
                break;
            case "sattack":
                selectedAlly = [whoAGI.action[1], whoAGI.action[2]];

                let HealthBefore = game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP;
                let Damage = calculateDamage(3, whoAGI.action[1], whoAGI.action[2], whoAGI.action[3], whoAGI.action[4])[1];
                let isCritical = calculateDamage(3, whoAGI.action[1], whoAGI.action[2], whoAGI.action[3], whoAGI.action[4])[0];

                game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP -= Damage;

                battleNumber(positionControls[whoAGI.action[3] + (whoAGI.action[4] * 3)].anchor, Damage * (-1), 0, positionControls[whoAGI.action[3] + (whoAGI.action[4] * 3)].offset, isCritical);

                if (isCritical) playSound("critdamage");
                else playSound("damage");

                postLog(positions[whoAGI.action[1]][whoAGI.action[2]].name + " attacks " + game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].name + " and deals " + Damage + " damage!");

                // Bar animation! (Cowboy moment)
                updateBar(positions[whoAGI.action[3]][whoAGI.action[4]].occupied, HealthBefore);
                if (game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP < 1) {
                    game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP = 0;
                    postLog(positions[whoAGI.action[1]][whoAGI.action[2]].name + " killed " + game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].name + "!");
                    positions[whoAGI.action[3]][whoAGI.action[4]].isOccupied = false;
                    checkAllDead();
                }

                endOfExecute(pos);
                break;
            case "heal":
                selectedAlly = [whoAGI.action[1], whoAGI.action[2]];

                game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP += getStat(positions[selectedAlly[0]][selectedAlly[1]].occupied, "strength");

                positions[pos[0]][pos[1]].action = false;
                setTimeout(() => executeActions(), ACTIONDELAY);
                break;
            case "defend":
                positions[pos[0]][pos[1]].shield = 1.5;

                endOfExecute(pos);
                break;
            case "item":
                items[whoAGI.action[1]]({
                    user: game.characters[positions[whoAGI.action[2]][whoAGI.action[3]].occupied], player: game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied],
                    anchor: positionControls[whoAGI.action[2] + (whoAGI.action[3] * 3)].anchor, offset: positionControls[pos[0] + (pos[1] * 3)].offset,
                    targetAnchor: positionControls[whoAGI.action[4] + (whoAGI.action[5] * 3)].anchor, targetOffset: positionControls[whoAGI.action[4] + (whoAGI.action[5] * 3)].offset
                }).effect();

                if (game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied].HP < 1) {
                    game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied].HP = 0;
                    postLog(positions[whoAGI.action[2]][whoAGI.action[3]].name + " killed " + game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied].name + "!");
                    positions[whoAGI.action[4]][whoAGI.action[5]].isOccupied = false;
                    checkAllDead();
                }

                endOfExecute(pos);
                break;
            case "magic":
                magic[whoAGI.action[1]]({
                    user: game.characters[positions[whoAGI.action[2]][whoAGI.action[3]].occupied], player: game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied], enemy: epositions[whoAGI.action[4]][whoAGI.action[5]],
                    anchor: positionControls[whoAGI.action[2] + (whoAGI.action[3] * 3)].anchor, offset: positionControls[pos[0] + (pos[1] * 3)].offset,
                    targetAnchor: positionControls[whoAGI.action[4] + (whoAGI.action[5] * 3)].anchor, targetOffset: positionControls[whoAGI.action[4] + (whoAGI.action[5] * 3)].offset,
                    enemyAnchor: epositionControls[whoAGI.action[4] + (whoAGI.action[5] * 3)].anchor, enemyOffset: epositionControls[whoAGI.action[4] + (whoAGI.action[5] * 3)].offset
                }).effect();

                if (magic[whoAGI.action[1]]().damage != undefined) {
                    epositions[whoAGI.action[4]][whoAGI.action[5]].HP -= magic[whoAGI.action[1]]().damage;
                    checkEnemyDead(whoAGI.action[4], whoAGI.action[5], whoAGI.action[2], whoAGI.action[3]);
                }
                else {
                    if (game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied].HP < 1) {
                        game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied].HP = 0;
                        postLog(positions[whoAGI.action[2]][whoAGI.action[3]].name + " killed " + game.characters[positions[whoAGI.action[4]][whoAGI.action[5]].occupied].name + "!");
                        positions[whoAGI.action[4]][whoAGI.action[5]].isOccupied = false;
                        checkAllDead();
                    }
                }

                endOfExecute(pos);
                break;
            case "flee":
                fleeAnimation(whoAGI.action[1], whoAGI.action[2]);
                endOfExecute(pos);
                break;
            case "rally":
                positions[pos[0]][pos[1]].atk = 0.25;
                for (j = 0; j < 3; j++) {
                    for (i = 0; i < 3; i++) {
                        let dude = epositions[i][j];
                        if (dude.occupied == false) continue;
                        attackEnemy(selectedAlly[0], selectedAlly[1], i, j, () => {
                            positions[pos[0]][pos[1]].atk = 1;
                        });
                        endOfExecute(pos);
                    }
                }
                break;
            case "scan":
                let enemy = epositions[whoAGI.action[3]][whoAGI.action[4]];
                let enm = enemyTypes[enemy.occupied];

                ret = findNewEnemy(selectedAlly[0], selectedAlly[1], whoAGI.action[3], whoAGI.action[4]);
                if (ret == false) {
                    break;
                }
                else {
                    whoAGI.action[3] = ret[0];
                    whoAGI.action[4] = ret[1];
                    enemy = epositions[whoAGI.action[3]][whoAGI.action[4]];
                    enm = enemyTypes[enemy.occupied];
                }

                postLog("Scanning " + enm.name + "...");
                postLog("HP: " + enemy.HP);
                postLog("Strength: " + enemy.strength);
                postLog("Element: " + enemy.element);

                endOfExecute(pos);
                break;
            case "pray":
                let dude = game.characters[whoAGI.occupied];
                let name = whoAGI.occupied;
                let before = dude.HP;

                dude.HP = Math.min(getStat(name, "maxHP"), dude.HP + 50);
                updateBar(name, before);

                dude.EP = Math.min(getStat(name, "maxEP"), dude.EP + 50);

                endOfExecute(pos);
                break;
            case "counterattack":
                positions[pos[0]][pos[1]].counter = true;

                endOfExecute(pos);
                break;
            case "nothing":
                endOfExecute(pos);
                break;

            // Uhhh... we shouldn't be here.
        }
    }

    function endOfExecute(pos) {
        positionGrid[pos[0] + (pos[1] * 3)].source = "grid";
        positionGrid2[pos[0] + (pos[1] * 3)].source = "grid";

        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "unassigned");
        positions[pos[0]][pos[1]].action = false;
        busy = false;
        setTimeout(() => executeActions(), ACTIONDELAY);
    }

    function enemiesTurn() {
        // Script handling enemies attacking protagonists / allies
        // Looking for a barrel to attack and attacking it
        if (lost) return false;
        let highestAGI = 0;
        let whoAGI;
        let pos = [];
        // Look for the fastest man alive
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                // Must not have an action and either be a small enemy or the parent enemy
                if (epositions[i][j].action != false && (epositions[i][j].parent == undefined || epositions[i][j].parent != false)) {
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
            started = false;
            endOfTurnEvents();

            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    positions[i][j].shield = 1;
                }
            }
            return;
        }

        // Select a random ally (protagonist)
        // The 75/75 is temporary. 75 = not selected yet, basically
        selectedAlly = [75, 75];
        while (selectedAlly[0] == 75) {
            let randyTheIdiot = Math.floor(Math.random() * 2.98);
            if (positions[randyTheIdiot][0].isOccupied == true ||
                positions[randyTheIdiot][1].isOccupied == true ||
                positions[randyTheIdiot][2].isOccupied == true) {
                selectedAlly[0] = randyTheIdiot;
            }
        }
        // We have found a row(?) with an ally (reminder: we are the enemy looking for an ally to attack)
        // Now look which column of that row has the ally
        while (selectedAlly[1] == 75) {
            let randyTheIdiot = Math.floor(Math.random() * 2.98);
            if (positions[selectedAlly[0]][randyTheIdiot].isOccupied == true) {
                selectedAlly[1] = randyTheIdiot;
            }
        }

        console.log(selectedAlly);
        console.log(positions[selectedAlly[0]][selectedAlly[1]]);
        console.log(positions[selectedAlly[0]][selectedAlly[1]].occupied);

        // Now attack the protagonist
        // whoAGI = the enemy attacking
        prepareAttackAnimation(selectedAlly[0], selectedAlly[1], pos[0], pos[1], (fpos1, fpos2, pos) => {
            if (epositions[pos[0]][pos[1]].acc - getStat(positions[fpos1][fpos2].occupied, "eva") > (Math.random() * 100)) {
                let Damage = calculateDamage(2, pos[0], pos[1], selectedAlly[0], selectedAlly[1])[1];
                let isCritical = calculateDamage(2, pos[0], pos[1], selectedAlly[0], selectedAlly[1])[0];
                if (positions[fpos1][fpos2].isOccupied != false) {
                    let HealthBefore = game.characters[positions[fpos1][fpos2].occupied].HP;
                    game.characters[positions[fpos1][fpos2].occupied].HP -= Damage;
                    changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "hurt");

                    epositions[pos[0]][pos[1]].action = false;
                    battleNumber(positionControls[fpos1 + (fpos2 * 3)].anchor, Damage * (-1), 0, positionControls[fpos1 + (fpos2 * 3)].offset, isCritical);

                    if (!isCritical) playSound("damage");
                    else playSound("critdamage");

                    postLog(epositions[pos[0]][pos[1]].name + " attacks " + game.characters[positions[fpos1][fpos2].occupied].name + " and deals " + Damage + " damage!");
                    if (getElementDamage(epositions[pos[0]][pos[1]].element, getStat(positions[fpos1][fpos2].occupied, "element")) != 1) {
                        postLog("Element boost: x" + getElementDamage(epositions[pos[0]][pos[1]].element, getStat(positions[fpos1][fpos2].occupied)) + "!");
                    }

                    // Bar animation! (Cowboy moment)
                    updateBar(positions[fpos1][fpos2].occupied, HealthBefore);
                    if (game.characters[positions[fpos1][fpos2].occupied].HP < 1) {
                        game.characters[positions[fpos1][fpos2].occupied].HP = 0;
                        postLog(epositions[pos[0]][pos[1]].name + " killed " + game.characters[positions[fpos1][fpos2].occupied].name + "!");
                        positions[fpos1][fpos2].isOccupied = false;
                        checkAllDead();
                    }
                    else if (positions[fpos1][fpos2].counter) { // Counter attack ! ! !
                        positions[fpos1][fpos2].counter = false;

                        attackEnemy(fpos1, fpos2, pos[0], pos[1], () => { if (epositions[pos[0]][pos[1]].isOccupied) attackEnemy(fpos1, fpos2, pos[0], pos[1]) }); // Attack T W I C E
                    }
                }
            }
            else {
                epositions[pos[0]][pos[1]].action = false;
                battleNumber(positionControls[fpos1 + (fpos2 * 3)].anchor, "Miss...", 0, positionControls[fpos1 + (fpos2 * 3)].offset);
                playSound("miss");
                postLog(epositions[pos[0]][pos[1]].name + " missed!");
            }
            if (!lost) setTimeout(() => enemiesTurn(), ACTIONDELAY);
        }, true); // very important true, bob
    }

    function endOfTurnEvents() {
        for (i = 0; i < game.chars.length; i++) {
            changeEmo(getPlayer(i + 1).pos[0] + getPlayer(i + 1).pos[1] * 3, "unassigned");

            if (getPlayer(i + 1).effect[0] == "acid") {
                getPlayer(i + 1).HP -= Math.ceil(getStat(i + 1, "maxHP") / 15);
                postLog(getPlayer(i + 1).name + " took " + Math.ceil(getStat(i + 1, "maxHP") / 15) + " damage from acid!");

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    postLog(getPlayer(i + 1).name + "'s acid is over!");
                }
            }

            if (getPlayer(i + 1).effect[0] == "poison") {
                getPlayer(i + 1).HP -= Math.ceil(getStat(i + 1, "maxHP") / 15);
                postLog(getPlayer(i + 1).name + " took " + Math.ceil(getStat(i + 1, "maxHP") / 15) + " damage from poison!");

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    postLog(getPlayer(i + 1).name + "'s poison is over!");
                }
            }

            if (getPlayer(i + 1).effect[0] == "burn") {
                getPlayer(i + 1).HP -= Math.ceil(getStat(i + 1, "maxHP") / 10);
                postLog(getPlayer(i + 1).name + " burns and took " + Math.ceil(getStat(i + 1, "maxHP") / 10) + " damage!");

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    postLog(getPlayer(i + 1).name + "'s burn is over!");
                }
            }

            if (getPlayer(i + 1).effect[0] == "condemned") {
                postLog(getPlayer(i + 1).name + " is condemned!");
                if (getPlayer(i + 1).effect[1] == 1) postLog(getPlayer(i + 1).name + " is going to die!");

                getPlayer(i + 1).effect[1] -= 1;
                if (getPlayer(i + 1).effect[1] < 1) {
                    getPlayer(i + 1).effect[0] = "none";
                    getPlayer(i + 1).HP = 0;
                }
            }

            if (getPlayer(i + 1).HP < 1 && positions[getPlayer(i + 1).pos[0]][getPlayer(i + 1).pos[1]].isOccupied == true) {
                //fightStats[5 + amountStats * i].alpha = 0;
                postLog(getPlayer(i + 1).name + " died!");
                positions[getPlayer(i + 1).pos[0]][getPlayer(i + 1).pos[1]].isOccupied = false;
                checkAllDead();
            }
        }


    }

    function prepareAttackAnimation(fpos1, fpos2, pos1, pos2, onFinish, enemy) {
        let goalX = epositionControls[pos1 + (pos2 * 3)].anchor[0];
        let ownX = positionControls[fpos1 + (fpos2 * 3)].anchor[0];
        let goalX2 = epositionControls[pos1 + (pos2 * 3)].offset[0] + epositionControls[pos1 + (pos2 * 3)].bigoff;
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
            positionControls[fpos1 + (fpos2 * 3)].offset[1] = own[3] + positionControls[fpos1 + (fpos2 * 3)].fly;

            goal[1] -= 232;

            attackAnimationObjects[fpos1 + (fpos2 * 3)].anchor = positionControls[fpos1 + (fpos2 * 3)].anchor;
            attackAnimationObjects[fpos1 + (fpos2 * 3)].offset = [positionControls[fpos1 + (fpos2 * 3)].offset[0] + 56, positionControls[fpos1 + (fpos2 * 3)].offset[1]];
            attackAnimationObjects[fpos1 + (fpos2 * 3)].alpha = 1;
            attackAnimationObjects[fpos1 + (fpos2 * 3)].source = "attackani0";

            let runTime = 0;

            addAnimator(function (t) {
                positionControls[fpos1 + (fpos2 * 3)].anchor[0] = own[0] + ((goal[0] / al) * Math.min(al, t));

                attackAnimationObjects[fpos1 + (fpos2 * 3)].anchor = positionControls[fpos1 + (fpos2 * 3)].anchor;
                attackAnimationObjects[fpos1 + (fpos2 * 3)].offset = [positionControls[fpos1 + (fpos2 * 3)].offset[0] + 56, positionControls[fpos1 + (fpos2 * 3)].offset[1]];

                // Super good animated feeeeeeet
                positionControls[fpos1 + (fpos2 * 3)].snip[0] = Math.floor(runTime) * 32;
                runTime += ((t % 500) / 250);
                if (runTime >= 2) {
                    runTime = 0;
                }

                if (t > 200 && t < 399) {
                    positionControls[fpos1 + (fpos2 * 3)].offset[1] = own[3] * (1 - ((t - 200)) / 200) + positionControls[fpos1 + (fpos2 * 3)].fly;
                    positionControls[fpos1 + (fpos2 * 3)].offset[0] = own[1] * (1 - ((t - 200)) / 200);
                    changeEmo(fpos1 + (fpos2 * 3), "attacking0");
                }
                if (t > 400 && t < 599) {
                    positionControls[fpos1 + (fpos2 * 3)].offset[1] = goal[3] * (0 + ((t - 400)) / 200) + positionControls[fpos1 + (fpos2 * 3)].fly;
                    positionControls[fpos1 + (fpos2 * 3)].offset[0] = goal[1] * (0 + ((t - 400)) / 200);
                    changeEmo(fpos1 + (fpos2 * 3), "attacking1");
                }
                if (t > 1000 && t < 1049 || t > 1100 && t < 1149) {
                    changeEmo(fpos1 + (fpos2 * 3), "attacking2");
                }
                if (t > 1050 && t < 1099 || t > 1150 && t < 1199) {
                    changeEmo(fpos1 + (fpos2 * 3), "attacking3");
                }
                if (t > 1200) {
                    positionControls[fpos1 + (fpos2 * 3)].anchor[0] = own[0];
                    positionControls[fpos1 + (fpos2 * 3)].offset[0] = own[1];
                    positionControls[fpos1 + (fpos2 * 3)].offset[1] = own[3] + positionControls[fpos1 + (fpos2 * 3)].fly;
                    attackAnimationObjects[fpos1 + (fpos2 * 3)].alpha = 0;
                    onFinish(fpos1, fpos2, pos1, pos2); // no [] here for some reason
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
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].offset = [epositionControls[pos1 + (pos2 * 3)].offset[0] - 72 + epositionControls[pos1 + (pos2 * 3)].bigoff, epositionControls[pos1 + (pos2 * 3)].offset[1]];
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].alpha = 1;
            attackAnimationObjects[9 + pos1 + (pos2 * 3)].source = "eattackani0";

            let runTime = 0;

            addAnimator(function (t) {
                epositionControls[pos1 + (pos2 * 3)].anchor[0] = own[0] + Math.max(0, ((goal[0] / al) * (al - Math.min(al, t))));

                attackAnimationObjects[9 + pos1 + (pos2 * 3)].anchor[0] = epositionControls[pos1 + (pos2 * 3)].anchor[0] + 0;
                attackAnimationObjects[9 + pos1 + (pos2 * 3)].anchor[1] = epositionControls[pos1 + (pos2 * 3)].anchor[1] + 0;
                attackAnimationObjects[9 + pos1 + (pos2 * 3)].offset = [epositionControls[pos1 + (pos2 * 3)].offset[0] - 72 + epositionControls[pos1 + (pos2 * 3)].bigoff, epositionControls[pos1 + (pos2 * 3)].offset[1]];

                // Super good animated feeeeeeet
                epositionControls[pos1 + (pos2 * 3)].snip[0] = Math.floor(runTime) * 32;
                runTime += ((t % 500) / 250);
                if (runTime >= 2) {
                    runTime = 0;
                }

                attackAnimationObjects[9 + pos1 + (pos2 * 3)].alpha = 1;
                if (t > 200 && t < 399) {
                    epositionControls[pos1 + (pos2 * 3)].offset[1] = goal[3] * (1 - ((t - 200)) / 200);
                    epositionControls[pos1 + (pos2 * 3)].offset[0] = goal[1] * (1 - ((t - 200)) / 200);
                }
                if (t > 400 && t < 599) {
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
                    epositionControls[pos1 + (pos2 * 3)].offset[0] = goal[1] - epositionControls[pos1 + (pos2 * 3)].bigoff;
                    epositionControls[pos1 + (pos2 * 3)].offset[1] = goal[3];
                    attackAnimationObjects[9 + pos1 + (pos2 * 3)].alpha = 0;
                    onFinish(fpos1, fpos2, [pos1, pos2]);
                    return true;
                }

                return false;
            });
        }
    }


    function showActionButtons() {
        addAnimator(function (t) {
            for (i = 0; i < actionButtons.length; i++) {
                actionButtons[i].offset[1] = -500 + t;
            }
            if (t > 499) {
                for (i = 0; i < actionButtons.length; i++) {
                    actionButtons[i].offset[1] = 0;
                }
                return true;
            }
        })
    }

    function hideActionButtons(thisButton) {
        if (actionButtons[0].offset[1] != 0 && thisButton != 99) return false;
        addAnimator(function (t) {
            for (i = 0; i < actionButtons.length; i++) {
                if (thisButton != 0 || i < 18) actionButtons[i].offset[1] = -t;
            }
            if (t > 499) {
                for (i = 0; i < actionButtons.length; i++) {
                    if (thisButton != 0 || i < 18) actionButtons[i].offset[1] = -500;
                }
                return true;
            }
        })
    }

    function showFightButtons() {
        addAnimator(function (t) {
            for (i = 0; i < fightButtons.length; i++) {
                fightButtons[i].offset[1] = -300 + t;
            }
            if (t > 299) {
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
                    fightButtons[i].offset[1] = -t;
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

    function showMagic() {
        let itemOffset = itemPage * 12
        let inventory = game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].magic;
        for (i = 0; i < ((fightActions.length / 4) - 9); i++) {
            fightActions[(i * 4) + 3].alpha = 0;
            fightActions[(i * 4)].type = "magic";
            if (Object.keys(inventory)[i + itemOffset] == undefined) {
                fightActions[(i * 4) + 2].text = "---";
                fightActions[(i * 4) + 2].fill = "white";
                continue;
            }
            let mag = magic[inventory[i + itemOffset]];
            // We are in a battle, so it does not matter whether it's battleonly or not ;)
            fightActions[(i * 4)].item = mag;
            if (game.inventory[mag().name] > 1) fightActions[(i * 4) + 2].text = mag().name + " x" + inventory[mag];
            else fightActions[(i * 4) + 2].text = mag().name;
            if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EP >= mag().cost) fightActions[(i * 4) + 2].fill = "green";
            else fightActions[(i * 4) + 2].fill = "gray";
            fightActions[(i * 4) + 3].source = mag().source;
            fightActions[(i * 4) + 3].alpha = 1;

        }
    }

    function showItems() {
        let itemOffset = itemPage * 12
        let inventory = Object.keys(game.inventory);
        for (i = 0; i < ((fightActions.length / 4) - 9); i++) {
            fightActions[(i * 4) + 3].alpha = 0;
            fightActions[(i * 4)].type = "item";
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
                fightActions[(i * 4) + 3].alpha = 1;
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
                if (elementLogic(myElements[i], theirElements[j]) == "weak") damageBoost -= ELEMENTBOOST;
                if (elementLogic(myElements[i], theirElements[j]) == "strong") damageBoost += ELEMENTBOOST;
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
                anchor: [0.00, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 1,
                onClick(args) {
                    if (this.alpha == 1 && fightaction == "active") {
                        showActionButtons();
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 1) { // Item Inventory
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 1,
                onClick(args) {
                    if (this.alpha == 1 && fightaction == "active") {
                        showFightActions();
                        showItems();
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 2) { // Magic
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 1,
                onClick(args) {
                    if (this.alpha == 1 && fightaction == "active") {
                        showFightActions();
                        showMagic();
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 3) { // Mastery Techniques
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 1,
                onClick(args) {
                    if (this.alpha == 1) {
                        postLog(prompt("Put what?"));
                    }
                }
            }))
        }
        if (i == 4) { // Macro
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 1,
                onClick(args) {
                    if (this.alpha == 1 && fightaction == "active") {
                        fightaction = "none";
                        let c = game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied];
                        positions[selectedAlly[0]][selectedAlly[1]].action = [c.macro, selectedAlly[0], selectedAlly[1], 2, 1];
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "attack");
                        hideFightButtons();
                    }
                }
            }))
        }
        if (i == 5) { // Flee
            fightButtons.push(controls.rect({
                anchor: [0.00, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
                fill: "rgb(191, 137, 69)",
                alpha: 1,
                onClick(args) {
                    if (this.alpha == 1 && fightaction == "active") {
                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "flee");
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["flee", selectedAlly[0], selectedAlly[1], getStat(positions[selectedAlly[0]][selectedAlly[1]].occupied, "AGI")];
                        fightaction = "none";
                        hideFightButtons();
                    }
                }
            }))
        }

    }
    for (i = 0; i < 6; i++) {
        topRowButton(i);
        fightButtons.push(controls.rect({
            anchor: [0.0025, 0.0025 + (i * 0.055)], sizeAnchor: [0.145, 0.05], offset: [0, -500],
            fill: "rgb(221, 155, 79)",
            alpha: 1,
        }))
        fightButtons.push(controls.label({
            anchor: [0.145, 0.025 + (i * 0.055)], offset: [0, -500],
            text: ["Normal Actions", "Item Inventory", "Magic", "Mastery Techniques", "Macro", "Flee"][i],
            fontSize: 20, fill: "black", align: "right", 
            alpha: 1,
        }))
        
    }

    function normalActionsButton(i) {
        //if (i == 0) { // Normal Actions
        actionButtons.push(controls.rect({
            anchor: [0.3, (i * 0.055)], sizeAnchor: [0.15, 0.055], offset: [0, -500],
            fill: "rgb(191, 137, 69)",
            alpha: 1,
            i: i,
            onClick(args) {
                if (this.alpha == 1 && (fightaction == "active" || (fightaction == "attack2" && this.i == 6))) {
                    switch (this.i) {
                        case 1:
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["defend"];
                            fightaction = "none";

                            changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "defend");

                            positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                            break;
                        case 2:
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["rally"];
                            fightaction = "none";
                            positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                            break;
                        case 3:
                            fightaction = "scan";
                            break;
                        case 4:
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["pray"];
                            fightaction = "none";
                            positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                            break;
                        case 5:
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["counterattack"];
                            fightaction = "none";
                            positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                            break;
                        case 6:
                            positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "grid";
                            if (fightaction == "attack2" && this.i == 6) {
                                hideActionButtons(99);
                                fightaction = "none";
                                return true;
                            }
                            fightaction = "none";
                            break;
                        default:
                            fightaction = "attack2";
                            break;
                    }
                    hideFightButtons();
                    hideActionButtons(this.i);
                }
            }
        }))
        //}
    }

    for (i = 0; i < 7; i++) {
        normalActionsButton(i);
        actionButtons.push(controls.rect({
            anchor: [0.3025, 0.0025 + (i * 0.055)], sizeAnchor: [0.145, 0.05], offset: [0, -500],
            fill: "rgb(221, 155, 79)",
            alpha: 1,
        }))
        actionButtons.push(controls.label({
            anchor: [0.445, 0.025 + (i * 0.055)], offset: [0, -500],
            text: ["Attack", "Defend", "Rally", "Scan", "Pray", "Counterattack", "Back"][i],
            fontSize: 20, fill: "black", align: "right",
            alpha: 1,
        }))

    }

    for (i = 0; i < 50; i++) {
        fleeWrenches.push(controls.image({
            anchor: [0.5, 0.5], offset: [10, 10], sizeOffset: [32, 32],
            source: "wrench",
            alpha: 0,
        }));
    }

    for (i = 0; i < 4; i++) {
        actionDisplay.push(controls.label({
            anchor: [0.175, 0.07 + (0.03 * i)],
            fontSize: 24, fill: "rgb(125, 255, 0)", align: "left", outline: "darkgreen", outlineSize: 8,
            text: actionText[Math.max(0, actionText.length - 3 + i)],
            alpha: 1,
        }));
    }

    function fleeAnimation(x, y) {
        let p = x + (y * 3);
        positions[x][y].action[0] = "flee2";
        if ((getStat(positions[x][y].occupied, "agi") / 200) < Math.random()) {
            battleNumber(positionControls[p].anchor, "Failed!", 0, positionControls[p].offset);
            positions[x][y].action = false;
            // fleeing was not successful
            return false;
        }

        // fleeing was successful

        // Set action, isOccupied and occupied to false
        positions[x][y].action = false;
        positions[x][y].isOccupied = false;
        positions[x][y].occupied = false;
        alliesFled += 1; // used later in the GAME OVER script

        let peopleLeft = 0;
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if(positions[i][j].isOccupied == true) peopleLeft += 1;
            }
        }
        peopleLeft -= 1; // you

        //if (peopleLeft == 0) {
            // Not a single protagonist exists anymore ! ! !
            let loss = Math.round(50 + (game.wrenches / 100)) * (-1);
            addWrenches(loss);
            fleeLoss.text = loss + "!";
            fleeLoss.alpha = 1;
            fleeIcon.alpha = 1;
        //}

        hideFightButtons();
        hideFightActions();

        let runTime = 0;
        let runLaps = 0;
        let wrenchTime = 0;
        let wrenchi = 0;
        if (positionControls[p].source != "gear") positionControls[p].defoffset[0] = positionControls[p].offset[0];
        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "flee");

        // Wrenches animation
        addAnimator(function (t) {
           if (positionControls[p].source != "gear") {
               positionControls[p].offset[0] = positionControls[p].defoffset - (t / 4);
               positionControls[p].anchor[0] = Math.min((2000 - t) / 80000, 0.025);
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
                    fleeWrenches[wrenchi].anchor[0] = positionControls[p].anchor[0] + 0;
                    fleeWrenches[wrenchi].anchor[1] = positionControls[p].anchor[1] + (Math.random() / 10);
                    fleeWrenches[wrenchi].offset[0] = positionControls[p].offset[0] * 2;
                    fleeWrenches[wrenchi].offset[1] = positionControls[p].offset[1] + 0;
                    fleeWrenches[wrenchi].alpha = 1;
                }
            }

            for (i = 0; i < fleeWrenches.length; i++) {
                fleeWrenches[i].offset[0] += 8;
                fleeWrenches[i].offset[1] += 1;
                if (fleeWrenches[i].offset[0] > 400) fleeWrenches[i].alpha = 0;
            }

            if (t > 2000) {
                // Fleeing done - I do not exist anymore (bye bye)
                if (positionControls[p].source != "gear") positionControls[p].offset[0] = -500;
                if (positionControls[p].source != "gear") positionControls[p].anchor[0] = 0;
                delete runTime;
                delete runLaps;

                for (i = 0; i < fleeWrenches.length; i++) {
                    fleeWrenches[i].alpha = 0;
                }

                fleeLoss.alpha = 0;
                fleeIcon.alpha = 0;
                if (peopleLeft == 0) {
                    endFight();
                }

                return true;
            }
            return false;
        });
    }

    function endFight() {
        stopMusic();
        fadeOut(1000, true, () => setScene(scenes.game()));
    }

    // finally a non array
    turnDisplay = controls.label({
        anchor: [0.95, 0.07],
        fontSize: 36, fill: "blue", align: "right", outline: "black", outlineSize: 8,
        text: "Turn 1",
        alpha: 1,
    });

    for (i = 0; i < 3; i++) {
        battleNumbers.push(controls.label({
            anchor: [5, 5], offset: [0, 0],
            font: "DePixelKlein", fontSize: 24, fill: "white", align: "center", outline: "black", outlineSize: 3,
            text: "",
            alpha: 0,
        }));
    }

    

    for (j = 0; j < 2; j++) {
        for (i = 0; i < 6; i++) {
            fightActions.push(controls.rect({
                anchor: [0.33 + (j * 0.17), 0 + (i * 0.055)], sizeAnchor: [0.17, 0.055], offset: [0, -500],
                fill: "rgb(38, 52, 38)",
                alpha: 1,
                item: "", type: "item",
                onClick(args) {
                    if (this.alpha == 1) {
                        if (this.type == "item") {
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
                                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "items/" + selectedItem().source;
                                        hideFightButtons();
                                        hideFightActions();
                                    }
                                }
                            }
                        }
                        if (this.type == "magic") {
                            if (positions[selectedAlly[0]][selectedAlly[1]].action == false && game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EP >= this.item().cost) {
                                fightaction = "magic";
                                selectedItem = this.item;
                                hideFightButtons();
                                hideFightActions();
                            }
                        }
                    }
                }
            }))
            fightActions.push(controls.rect({
                anchor: [0.3325 + (j * 0.17), 0.0025 + (i * 0.055)], sizeAnchor: [0.165, 0.05], offset: [0, -500],
                fill: "rgb(42, 87, 44)",
                alpha: 1,
            }))
            fightActions.push(controls.label({
                anchor: [0.48 + (j * 0.17), 0.025 + (i * 0.055)], offset: [-24, -500],
                text: "---",
                fontSize: 20, fill: "white", align: "right",
                alpha: 1,
            }))
            fightActions.push(controls.image({
                anchor: [0.48 + (j * 0.17), 0.025 + (i * 0.055)], sizeOffset: [32, 32], offset: [0, -520],
                source: "gear",
                alpha: 0,
            }))

        }
    }
    fightActions.push(controls.rect({
        anchor: [0.67, 0.33], sizeAnchor: [0.17, 0.055], offset: [0, -500],
        fill: "rgb(38, 52, 38)",
        alpha: 1,
        item: "",
        onClick(args) {
            if (this.alpha == 1) {
                hideFightActions();
                showFightButtons();
            }
        }
    }));
    fightActions.push(controls.rect({
        anchor: [0.6725, 0.3325], sizeAnchor: [0.165, 0.05], offset: [0, -500],
        fill: "rgb(42, 87, 44)",
        alpha: 1,
    }))
    fightActions.push(controls.label({
        anchor: [0.755, 0.355], offset: [-24, -500],
        text: "Back",
        fontSize: 20, fill: "white", align: "center",
        alpha: 1,
    }))


    fightActions.push(controls.rect({
        anchor: [0.67, 0.0], sizeAnchor: [0.17, 0.055], offset: [0, -500],
        fill: "rgb(38, 52, 38)",
        alpha: 1,
        item: "",
        onClick(args) {
            if (this.alpha == 1 && itemPage > 0) {
                itemPage -= 1;
                showItems();
            }
        }
    }));
    fightActions.push(controls.rect({
        anchor: [0.6725, 0.0025], sizeAnchor: [0.165, 0.05], offset: [0, -500],
        fill: "rgb(42, 87, 44)",
        alpha: 1,
    }))
    fightActions.push(controls.label({
        anchor: [0.755, 0.025], offset: [-24, -500],
        text: "Previous",
        fontSize: 20, fill: "white", align: "center",
        alpha: 1,
    }))


    fightActions.push(controls.rect({
        anchor: [0.67, 0.055], sizeAnchor: [0.17, 0.055], offset: [0, -500],
        fill: "rgb(38, 52, 38)",
        alpha: 1,
        item: "",
        onClick(args) {
            if (this.alpha == 1) {
                itemPage += 1;
                showItems();
            }
        }
    }));
    fightActions.push(controls.rect({
        anchor: [0.6725, 0.0575], sizeAnchor: [0.165, 0.05], offset: [0, -500],
        fill: "rgb(42, 87, 44)",
        alpha: 1,
    }))
    fightActions.push(controls.label({
        anchor: [0.755, 0.075], offset: [-24, -500],
        text: "Next",
        fontSize: 20, fill: "white", align: "center",
        alpha: 1,
    }))

    function findNewEnemy(fpos1, fpos2, pos1, pos2) {
        if (epositions[pos1][pos2].isOccupied == false) { // folso! Oh no
            let exists = 0;
            for (nj = 0; nj < 3; nj++) {
                for (ni = 0; ni < 3; ni++) {
                    if (epositions[ni][nj].isOccupied == true && exists == 0 && canReach(getStat(positions[fpos1][fpos2].occupied, "length"), "enemy", [pos1, pos2])) {
                        exists = 1;
                        pos1 = ni;
                        pos2 = nj;
                        break;
                    }
                }
            }
            if (exists == 0) {
                endOfExecute([fpos1, fpos2]);
                return false;
            }

        }
        return [pos1, pos2];
    }

    function attackEnemy(fpos1, fpos2, pos1, pos2, onFinish = () => { }) {
        if (win == false && game.characters[positions[fpos1][fpos2].occupied].HP > 0) {
            prepareAttackAnimation(fpos1, fpos2, pos1, pos2, (fpos1, fpos2, pos1, pos2) => {
                
                if (getStat(positions[fpos1][fpos2].occupied, "acc") - epositions[pos1][pos2].eva > (Math.random() * 100)) {
                    let Damage = calculateDamage(1, fpos1, fpos2, pos1, pos2)[1];
                    let isCritical = calculateDamage(1, fpos1, fpos2, pos1, pos2)[0];

                    epositions[pos1][pos2].HP -= Damage; // Deal damage
                    battleNumber(epositionControls[pos1 + (pos2 * 3)].anchor, Damage * (-1), 0, epositionControls[pos1 + (pos2 * 3)].offset, isCritical);

                    if (isCritical) playSound("critdamage");
                    else playSound("damage");

                    postLog(game.characters[positions[fpos1][fpos2].occupied].name + " attacks " + epositions[pos1][pos2].name + " and deals " + Damage + " damage!");
                    if (getElementDamage(getStat(positions[fpos1][fpos2].occupied, "element"), epositions[pos1][pos2].element) != 1) {
                        postLog("Element boost: x" + getElementDamage(getStat(positions[fpos1][fpos2].occupied, "element"), epositions[pos1][pos2].element) + "!");
                    }

                    checkEnemyDead(pos1, pos2, fpos1, fpos2);
                }
                else {
                    battleNumber(epositionControls[pos1 + (pos2 * 3)].anchor, "Miss...", 0, epositionControls[pos1 + (pos2 * 3)].offset);
                    playSound("miss");
                    postLog(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " missed!");
                }
                onFinish();
            }, false);
        }
    }

    function checkEnemyDead(pos1, pos2, fpos1, fpos2) {
        if (epositions[pos1][pos2].HP < 1) { // Is dead?
            // Enemy is dead
            epositions[pos1][pos2].isOccupied = false;
            epositions[pos1][pos2].occupied = false;
            epositions[pos1][pos2].action = false;
            enemyAmounts[pos1 + (pos2 * 3)] = "";

            // Random item
            if (epositions[pos1][pos2].items != "none") {
                for (i in epositions[pos1][pos2].items) {
                    if (Math.random() > 0.2) { // 80% chance
                        gainedItems.push(epositions[pos1][pos2].items[i]);
                    }
                }
            }

            let Experience = epositions[pos1][pos2].strength;
            game.characters[positions[fpos1][fpos2].occupied].EXP += Experience;

            postLog(game.characters[positions[fpos1][fpos2].occupied].name + " killed " + epositions[pos1][pos2].name + " and earned " + Experience + " EXP!");
            checkLevelUps();
            checkAllDead();
        }
    }

    // This line below. Oh my god. God is nothing compared to this. (This line fixes/prevents the gray bar bug)
    fightStats = [];

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
                alpha: 1
            }))
            fightStats.push(controls.rect({ // The bg behind the bar
                anchor: [0.242 + (j * 0.35), 0.782 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(5, 51, 5)",
                alpha: 1
            }))
            fightStats.push(controls.rect({
                anchor: [0.242 + (j * 0.35), 0.782 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(128, 128, 128)",
                alpha: 1
            }))
            fightStats.push(controls.rect({ // Loss
                anchor: [0.242 + (j * 0.35), 0.782 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(200, 204, 200)",
                alpha: 0
            }))


            fightStats.push(controls.rect({
                anchor: [0.24 + (j * 0.35), 0.81 + (i * 0.075)], sizeAnchor: [0.2, 0.025],
                fill: "rgb(30, 109, 30)",
                alpha: 1
            }))
            fightStats.push(controls.rect({ // The bg behind the bar
                anchor: [0.242 + (j * 0.35), 0.812 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(51, 0, 51)",
                alpha: 1
            }))
            fightStats.push(controls.rect({
                anchor: [0.242 + (j * 0.35), 0.812 + (i * 0.075)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(85, 85, 85)",
                alpha: 1
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
    /*winScreen.push(controls.rect({ // Bg border
        anchor: [0.2, 0.3], sizeAnchor: [0.6, 0.4], offset: [0, -1000],
        fill: "rgb(181, 133, 66)",
        alpha: 0,
    }));
    winScreen.push(controls.rect({ // Bg (light)
        anchor: [0.21, 0.31], sizeAnchor: [0.58, 0.38], offset: [0, -1000],
        fill: "rgb(212, 159, 82)",
        alpha: 0,
    }));*/
    winScreen.push(controls.rect({ // Lovely bg thing
        anchor: [0, 0], sizeAnchor: [1, 1], offset: [0, -1000],
        fill: "rgb(45, 45, 45)",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.825, 0.1], offset: [0, -1000],
        text: "Victory!",
        fontSize: 48, fill: "yellow", align: "center", outline: "orange", outlineSize: 12,
        alpha: 0,
    }));
    winScreen.push(controls.button({ // "Next" button
        anchor: [0.725, 0.85], sizeAnchor: [0.2, 0.1], offset: [0, -1000],
        text: "Next",
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (checkAllDead(true)) {
                    fightaction = "victoryitems";
                    if (gainedItems.length > 0) {
                        let gain = {};

                        // Do this earlier maybe?
                        for (i in gainedItems) {
                            if (gain[gainedItems[i]] == undefined) gain[gainedItems[i]] = 0;
                            gain[gainedItems[i]] += 1;
                        }

                        for (i = 0; i < Object.keys(gain).length; i++) {
                            let it = Object.keys(gain)[i];

                            if (winScreen2[2 + (i * 2)] != undefined) {
                                winScreen2[2 + (i * 2)].source = "items/" + items[it]().source;
                                winScreen2[3 + (i * 2)].text = items[it]().name + " x" + gain[it];
                            }
                        }


                        for (i in winScreen) {
                            winScreen[i].alpha = 0;
                        }
                        winScreen[0].alpha = 0.8;
                        for (i in winStats) {
                            winStats[i].alpha = 0;
                        }
                        for (i in winScreen2) {
                            if (winScreen2[i].source != "gear" && winScreen2[i].text != "nothing") winScreen2[i].alpha = 1;
                        }
                    }
                    else {
                        endFight();
                    }

                }
            }
        },
        alpha: 0,
    }));

    winScreen.push(controls.label({
        anchor: [0.825, 0.2], offset: [0, -1000],
        text: "You got!",
        fontSize: 24, fill: "white", align: "center",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.825, 0.225], offset: [0, -1000],
        text: "(Divided for characters!)",
        fontSize: 24, fill: "white", align: "center",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.825, 0.3], offset: [0, -1000],
        text: "Gained",
        fontSize: 24, fill: "white", align: "center",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.86, 0.4], offset: [0, -1000],
        text: "0",
        fontSize: 36, fill: "yellow", align: "right", outline: "orange", outlineSize: 12,
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.825, 0.45], offset: [0, -1000],
        text: "and",
        fontSize: 24, fill: "white", align: "center",
        alpha: 0,
    }));
    winScreen.push(controls.label({
        anchor: [0.86, 0.5], offset: [0, -1000],
        text: "0",
        fontSize: 36, fill: "yellow", align: "right", outline: "orange", outlineSize: 12,
        alpha: 0,
    }));
    winScreen.push(controls.image({
        anchor: [0.86, 0.375], offset: [32, -1000], sizeOffset: [64, 64],
        source: "wrench",
        alpha: 0,
    }));
    winScreen.push(controls.image({
        anchor: [0.86, 0.475], offset: [32, -1000], sizeOffset: [64, 64],
        source: "brick",
        alpha: 0,
    }));
    winScreen.push(controls.image({
        anchor: [0.65, 0.6], offset: [32, -1000], sizeAnchor: [0.3, 0.25],
        source: "nosfegtdsrh",
        alpha: 0,
    }));
    
    // Left side of the victory screen
    for (i = 0; i < 6; i++) { // BARZ
        winStats.push(controls.rect({
            anchor: [0.05, 0.1 + (i * 0.15)], sizeAnchor: [0.592, 0.025], offset: [-2000, 0],
            fill: "#aeaeae",
            alpha: 0
        }))
        winStats.push(controls.rect({ // The bg behind the bar
            anchor: [0.052, 0.102 + (i * 0.15)], sizeAnchor: [0.588, 0.0210], offset: [-2000, 0],
            fill: "#636363",
            alpha: 0
        }))
        winStats.push(controls.rect({
            anchor: [0.052, 0.102 + (i * 0.15)], sizeAnchor: [0.001, 0.0210], offset: [-2000, 0],
            fill: "#ffff18",
            alpha: 0
        }))
        winStats.push(controls.rect({ // Loss
            anchor: [0.052, 0.102 + (i * 0.15)], sizeAnchor: [0.588, 0.0210], offset: [-2000, 0],
            fill: "#e5e5e5",
            alpha: 0
        }))

        winStats.push(controls.label({
            anchor: [0.16, 0.1 + (i * 0.15)], offset: [-2000, -16],
            text: "Lvl. 1",
            fontSize: 32, fill: "rgb(0, 255, 0)", align: "left", outline: "black", outlineSize: 6,
            alpha: 0
        }))
        winStats.push(controls.image({
            anchor: [0.1, 0.1 + (i * 0.15)], sizeOffset: [64, 64], snip: [0, 0, 32, 32], offset: [-2000, -48],
            source: "gear", // stays gear if no char. = invis
            alpha: 0
        }))

        winStats.push(controls.label({
            anchor: [0.64, 0.1 + (i * 0.15)], offset: [-2000, 0],
            text: "0/25",
            fontSize: 32, fill: "white", align: "right",
            alpha: 0,
        }));
    }

    // Items gained

    winScreen2.push(controls.button({ // "Next" button
        anchor: [0.4, 0.85], sizeAnchor: [0.2, 0.1], offset: [0, 0],
        text: "Next",
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (checkAllDead(true)) {
                    if (fightaction == "victoryitems") {
                        endFight();
                    }
                }
            }
        },
        alpha: 0,
    }));

    winScreen2.push(controls.label({
        anchor: [0.1, 0.1],
        text: "And you got...",
        fontSize: 48, fill: "white", align: "left",
        alpha: 0,
    }));

    for (i = 0; i < 12; i++) {
        winScreen2.push(controls.image({
            anchor: [0.1, 0.15 + (i * 0.075)], sizeOffset: [64, 64],
            source: "gear",
            alpha: 0,
        }));
        winScreen2.push(controls.label({
            anchor: [0.2, 0.15 + (i * 0.075)], offset: [0, 32],
            text: "nothing",
            fontSize: 24, fill: "white", align: "left",
            alpha: 0,
        }));
    }

    // Game Over Screen
    gameOverScreen.push(controls.rect({
        anchor: [0.0, 0.0], sizeAnchor: [1, 1], offset: [0, 0],
        fill: "rgb(0, 0, 0)",
        alpha: 0,
    }));
    gameOverScreen.push(controls.image({
        anchor: [0.3, 0.2], sizeAnchor: [0.4, 0.15], offset: [0, -1000],
        source: "gameover",
        alpha: 0,
    }));
    gameOverScreen.push(controls.label({
        anchor: [0.5, 0.45], sizeAnchor: [0.4, 0.15], offset: [0, 1000],
        text: "Try again, mate.",
        fontSize: 60, fill: "red", align: "center",
        outline: "white", outlineSize: 20,
        alpha: 0,
    }));

    gameOverScreen2.push(controls.rect({
        anchor: [0.0, 0.0], sizeAnchor: [1, 1],
        fill: "rgb(0, 0, 0)",
        alpha: 0,
    }));
    gameOverScreen2.push(controls.label({
        anchor: [0.5, 0.3],
        text: "Load the last save point?",
        fontSize: 32, fill: "white", align: "center",
        alpha: 0,
    }));
    gameOverScreen2.push(controls.label({
        anchor: [0.5, 0.3], offset: [0, 40],
        text: "(Everything will be set back to that point.)",
        fontSize: 32, fill: "white", align: "center",
        alpha: 0,
    }));

    gameOverScreen2.push(controls.button({
        anchor: [0.1, 0.6], sizeAnchor: [0.25, 0.1],
        text: "Load Save", fontSize: 48,
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                loadGame();
                endFight();
            }
        }
    }));

    gameOverScreen2.push(controls.button({
        anchor: [0.65, 0.6], sizeAnchor: [0.25, 0.1],
        text: "Title Screen", fontSize: 48,
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                setScene(scenes.title());
                fightStats = [];
            }
        }
    }));
    
    // Battle Log (Bottom Left)

    fightLogComponents.push(controls.rect({
        anchor: [0, 0.775], sizeAnchor: [0.15, 0.225], baseoffset: [0, 0],
        fill: "rgb(191, 137, 69)",
        alpha: 1,
    }));

    fightLogComponents.push(controls.rect({
        anchor: [0.005, 0.78], sizeAnchor: [0.14, 0.215], baseoffset: [0, 0],
        fill: "rgb(221, 155, 79)",
        alpha: 1,
    }));

    for (i = 0; i < 12; i++) {
        fightLogComponents.push(controls.label({
            anchor: [0.01, 0.79], offset: [2, (16 * i)], baseoffset: [2, (16 * i)],
            fontSize: 16, fill: "rgb(0, 0, 0)", align: "left",
            text: fightlog[Math.max(0, fightlog.length - 12 + i)],
            alpha: 1,
        }));
    }

    // Fight Overview (bottom right)

    enemyListComponents.push(controls.rect({
        anchor: [0.85, 0.775], sizeAnchor: [0.15, 0.225], baseoffset: [0, 0],
        fill: "rgb(191, 137, 69)",
        alpha: 1,
    }));

    enemyListComponents.push(controls.rect({
        anchor: [0.855, 0.78], sizeAnchor: [0.14, 0.215], baseoffset: [0, 0],
        fill: "rgb(221, 155, 79)",
        alpha: 1,
    }));
    
    for (i = 0; i < 9; i++) {
        enemyListComponents.push(controls.label({
            anchor: [0.86, 0.79], offset: [2, (16 * i)], baseoffset: [2, (16 * i)],
            fontSize: 16, fill: "rgb(0, 0, 0)", align: "left",
            text: "ERROR" + i,
            alpha: 1,
        }));
    }

    function getHPFill(char) {
        if (getPlayer(char + 1).HP < 1) return "red";
        else if (getPlayer(char + 1).HP > (getStat(char + 1, "maxHP") / 4)) return "white";
        else if (getPlayer(char + 1).HP > (getStat(char + 1, "maxHP") / 8)) return "yellow";
        return "orange";
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
                    pos: "middle left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "bottom left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "top middle",
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
                    pos: "bottom middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "top right",
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
                {
                    pos: "bottom right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
        ];

    for (p in positions) positions[p].shield = 1;
    for (p in positions) positions[p].atk = 1;

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
                    pos: "middle left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
                {
                    pos: "bottom left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "top middle",
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
                    pos: "bottom middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                    action: false,
                },
            ],
            [
                {
                    pos: "top right",
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
            if (currentEnemies[i][0] == "child") continue;
            for (tiet in enemyTypes[currentEnemies[i][0]]) {
                epositions[currentEnemies[i][1]][currentEnemies[i][2]][tiet] = enemyTypes[currentEnemies[i][0]][tiet];
            }

            epositions[currentEnemies[i][1]][currentEnemies[i][2]].isOccupied = true;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].occupied = currentEnemies[i][0];
            if (currentEnemies[i][3] == "2x2") {
                epositions[currentEnemies[i][1]][currentEnemies[i][2]].size = currentEnemies[i][3];

                epositions[currentEnemies[i][1] + 1][currentEnemies[i][2]].parent = [currentEnemies[i][1], currentEnemies[i][2]];
                epositions[currentEnemies[i][1]][currentEnemies[i][2] + 1].parent = [currentEnemies[i][1], currentEnemies[i][2]];
                epositions[currentEnemies[i][1] + 1][currentEnemies[i][2] + 1].parent = [currentEnemies[i][1], currentEnemies[i][2]];
            }
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
                anchor: [0.0 /* 0.025 */, 0.4], offset: [-256, 72 * j], sizeOffset: [64, 64],
                defoffset: 72 * i, fly: 0, flydir: 1,
                source: "gear",
                alpha: 1,
                snip: [0, 64, 32, 32],
                pos1: i,
                pos2: j,
                emo: "unassigned",
                glow: 8,
                onClick(args) {
                    let name = positions[this.pos1][this.pos2].occupied;
                    if (name == false) return;

                    positions[this.pos1][this.pos2].counter = false;

                    if (game.characters[name].effect[0] == "paralysis" && positions[this.pos1][this.pos2].action == false) {
                        positions[this.pos1][this.pos2].action = ["nothing", this.pos1, this.pos2];
                        postLog(game.characters[name].name + " is paralysed!")
                        game.characters[name].effect[1] -= 1;
                        if (game.characters[name].effect[1] < 1) {
                            game.characters[name].effect[0] = "none";
                            postLog(game.characters[name].name + "'s paralysis is over!")
                        }
                    }
                    if (fightaction == "none" && game.characters[name].effect[0] == "enraged") {
                        fightaction = "attack2";
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";

                        postLog(game.characters[name].name + " is very angry!")

                        game.characters[name].effect[1] -= 1;
                        if (game.characters[name].effect[1] < 1) {
                            game.characters[name].effect[0] = "none";
                            postLog(game.characters[name].name + "'s rage is over!")
                        }
                    }
                    // Attack teammate
                    else if (fightaction == "attack2" && positions[selectedAlly[0]][selectedAlly[1]].action == false) {
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "attack");
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["sattack", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];

                        fightaction = "none";
                        hideFightButtons();
                        hideFightActions();

                    }


                    // Select character
                    if (fightaction == "none" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true) {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "active";
                        showFightButtons();
                    }


                    if (fightaction == "item") {
                        let dude = positions[selectedAlly[0]][selectedAlly[1]].occupied;

                        positions[selectedAlly[0]][selectedAlly[1]].action = ["item", selectedItem.name, selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        removeItem(selectedItem.name, 1);
                        fightaction = "none";

                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "item");
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "items/" + selectedItem().source;
                    }

                    if (fightaction == "magic") {
                        let dude = positions[selectedAlly[0]][selectedAlly[1]].occupied;

                        positions[selectedAlly[0]][selectedAlly[1]].action = ["magic", selectedItem.name, selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EP -= selectedItem().cost;
                        fightaction = "none";

                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "magic");
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = selectedItem().source;
                    }

                    if (fightaction == "heal1" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "heal2";
                    }
                    else if (fightaction == "heal2" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["heal", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
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
                anchor: [1.975, 0.4], offset: [500, 72 * j], sizeOffset: [64, 64], bigoff: 0,
                defoffset: -(72 + (72 * i)),
                source: "gear",
                alpha: 1,
                snip: [0, 32, 32, 32],
                pos1: i,
                pos2: j,
                glow: 8,
                onClick(args) {
                    //epositions[this.pos1][this.pos2].occupied = "selected";
                    // uhhh... no?F
                    // but add fighting here at some point
                    // THAT POINT IS NOW! Idiot
                    let dude = positions[selectedAlly[0]][selectedAlly[1]].occupied;
                    if (fightaction == "attack2" && positions[selectedAlly[0]][selectedAlly[1]].action == false && canReach(getStat(dude, "length"), "enemy", [this.pos1, this.pos2])) {
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "hasaction";
                        fightActions[6].offset[1] = -500;
                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "attack");
                        if (epositions[this.pos1][this.pos2].parent == undefined) positions[selectedAlly[0]][selectedAlly[1]].action = ["attack", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        else {
                            let parent = epositions[this.pos1][this.pos2].parent;
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["attack", selectedAlly[0], selectedAlly[1], parent[0], parent[1]];
                        }
                        fightaction = "none";
                        hideFightButtons();
                        hideFightActions();
                        //attackEnemy(selectedAlly[0], selectedAlly[1], this.pos1, this.pos2); // direct attack, testing thing
                    }
                    if (fightaction == "magic" && positions[selectedAlly[0]][selectedAlly[1]].action == false && canReach(getStat(dude, "length"), "enemy", [this.pos1, this.pos2])) {
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = selectedItem().source;
                        changeEmo(selectedAlly[0] + (selectedAlly[1] * 3), "magic");
                        if (epositions[this.pos1][this.pos2].parent == undefined) positions[selectedAlly[0]][selectedAlly[1]].action = ["magic", selectedItem.name, selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        else {
                            let parent = epositions[this.pos1][this.pos2].parent;
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["magic", selectedItem.name, selectedAlly[0], selectedAlly[1], parent[0], parent[1]];
                        }
                        game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EP -= selectedItem().cost;
                        fightaction = "none";
                        hideFightButtons();
                        hideFightActions();
                    }
                    if (fightaction == "scan" && positions[selectedAlly[0]][selectedAlly[1]].action == false && canReach(getStat(dude, "length"), "enemy", [this.pos1, this.pos2])) {
                        positionGrid2[selectedAlly[0] + (selectedAlly[1] * 3)].source = "scan";

                        if (epositions[this.pos1][this.pos2].parent == undefined) positions[selectedAlly[0]][selectedAlly[1]].action = ["scan", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        else {
                            let parent = epositions[this.pos1][this.pos2].parent;
                            positions[selectedAlly[0]][selectedAlly[1]].action = ["scan", selectedAlly[0], selectedAlly[1], parent[0], parent[1]];
                        }

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
                anchor: [0.025, 0.4], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "grid",
                blend: "mul",
                alpha: 1,
            }));
            positionGrid2.push(controls.image({
                anchor: [0.025, 0.4], offset: [(72 * i) + 32, (72 * j) + 32], sizeOffset: [32, 32],
                source: "grid",
                alpha: 1,
            }));
            highlightGrid.push(controls.rect({
                anchor: [0.025, 0.4], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                fill: "white",
                alpha: 0,
            }));
        }
    }

    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.975, 0.4], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
                source: "grid",
                blend: "mul",
                alpha: 1,
            }));
            positionGrid2.push(controls.image({
                anchor: [0.975, 0.4], offset: [-(72 + (72 * i)), (72 * j) + 32], sizeOffset: [32, 32],
                source: "grid",
                alpha: 1,
            }));
            highlightGrid.push(controls.rect({
                anchor: [0.975, 0.4], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
                fill: "white",
                alpha: 0,
            }));
        }
    }

    if (settings.grid == true) {
        for (i in positionGrid) {
            positionGrid[i].alpha = 0.5;
        }
    }
    else {
        for (i in positionGrid) {
            positionGrid[i].alpha = 0;
        }
    }

    function updatePositions() {
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positions[i]) {
                    if (positions[i][j].isOccupied == true) {
                        if (positionControls[i + j * 3].emo == "hurt" && Math.random() > 0.9) {
                            changeEmo(i + j * 3, "hurt2");
                        }
                        else if (positionControls[i + j * 3].emo == "hurt2" && Math.random() > 0.9) {
                            changeEmo(i + j * 3, "unassigned");
                        }
                    }
                }
        

                        
                // enemies! enemies!
                if (epositions[i]) {
                    if (epositions[i][j].parent != undefined) {
                        epositionControls[i + (j * 3)].alpha = 0;
                    }
                    if (epositions[i][j].isOccupied == true) {
                        epositionControls[i + (j * 3)].source = epositions[i][j].occupied;
                        epositionControls[i + (j * 3)].alpha = 1;

                        if (epositions[i][j].size == "2x2") {
                            epositionControls[i + (j * 3)].sizeOffset = [128, 128];
                            if (epositionControls[i + (j * 3)].bigoff == 0) {
                                epositionControls[i + (j * 3)].bigoff = -72;
                                epositionControls[i + (j * 3)].defoffset = -(72 + (72 * i)) - 72;
                                epositionControls[i + (j * 3)].offset = [-(72 + (72 * i)) -72, 72 * j];
                            }
                        }
                        else {
                            epositionControls[i + (j * 3)].sizeOffset = [64, 64];
                            if (epositionControls[i + (j * 3)].bigoff == -72) {
                                epositionControls[i + (j * 3)].bigoff = 0;
                                epositionControls[i + (j * 3)].defoffset = -(72 + (72 * i));
                                epositionControls[i + (j * 3)].offset = [-(72 + (72 * i)), 72 * j];
                            }
                        }

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


        actionText = [];

        if (fightaction == "none") postAction("Select a character before assigning a command.");

        if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied] != undefined &&
            fightaction == "active") postAction("What will you assign for " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + "?");

        if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied] != undefined &&
            fightaction == "attack1") postAction("What <category> will " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " use?");

        if (fightaction == "attack2") postAction("Choose a target.");

        if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied] != undefined &&
            fightaction == "macro") postAction("What predetermined set ot actions will " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " use?");

        while (actionText.length < 4) {
            actionText.push("");
        }

        turnDisplay.text = "Turn " + turn;
            
    }

    // When the fight starts. How many chars do we have? Who exists? Show/Hide/Gray out stats
    for (i = 0; i < game.chars.length; i++) {
        fightStats[amountStats * i].alpha = 1;
        fightStats[1 + amountStats * i].alpha = 1;
        fightStats[4 + amountStats * i].fill = "rgb(20, 204, 20)";
        if (getPlayer(1 + i).HP > 0) fightStats[4 + amountStats * i].sizeAnchor[0] = 0.1960 * (getPlayer(1 + i).HP / getStat(i + 1, "maxHP"));
        fightStats[8 + amountStats * i].fill = "rgb(205, 0, 205)";
        fightStats[10 + amountStats * i].alpha = 1;
        fightStats[11 + amountStats * i].alpha = 1;
        fightStats[12 + amountStats * i].alpha = 1;
        if (getStat(characters[i], "element") != undefined) fightStats[12 + amountStats * i].source = getStat(characters[i], "element");
    }

    for (i in game.characters) {
        if (game.chars.includes(game.characters[i].name.toLowerCase())) { //only if he is in the party
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

    cutsceneElements.push(controls.rect({
        anchor: [0, -1], sizeAnchor: [1, 0.15],
        fill: "black",
        alpha: 1,
        clickthrough: true,
    }));
    cutsceneElements.push(controls.rect({
        anchor: [0, 1.85], sizeAnchor: [1, 0.15],
        fill: "black",
        alpha: 1,
        clickthrough: true,
    }));

    function startCutscene() {
        canMove = false;
        cutsceneMode = true;
        fightaction = "eajifjea";

        addAnimator(function (t) {
            cutsceneElements[0].anchor[1] = -1 + (t / 1000);
            cutsceneElements[1].anchor[1] = 1.85 - (t / 1000);

            if (t > 999) {
                cutsceneElements[0].anchor[1] = 0;
                cutsceneElements[1].anchor[1] = 0.85;

                return true;
            }
            return false;
        });
    }

    function endCutscene() {
        canMove = true;
        cutsceneMode = false;
        fightaction = "none";

        addAnimator(function (t) {
            cutsceneElements[0].anchor[1] = 0 - (t / 1000);
            cutsceneElements[1].anchor[1] = 0.85 + (t / 1000);

            if (t > 999) {
                cutsceneElements[0].anchor[1] = -1;
                cutsceneElements[1].anchor[1] = 1.85;

                return true;
            }
            return false;
        });
    }


    fadeIn(1000 / 3, true);

    let scal = 10;

    for (cp in fightStats) {
        fightStats[cp].offset = [0, 1000];
    }
    for (cp in fightLogComponents) {
        fightLogComponents[cp].bigoff = fightLogComponents[cp].offset[1];
        fightLogComponents[cp].offset = [0, 1000 + fightLogComponents[cp].bigoff];
    }
    for (cp in enemyListComponents) {
        enemyListComponents[cp].bigoff = enemyListComponents[cp].offset[1];
        enemyListComponents[cp].offset = [0, 1000 + enemyListComponents[cp].bigoff];
    }
    for (cp in actionDisplay) {
        actionDisplay[cp].offset = [0, -500];
    }
    turnDisplay.offset = [0, -500];

    addAnimator(function (t) {
        for (cp in fightStats) {
            fightStats[cp].offset[1] = 1000 - t;
        }
        for (cp in fightLogComponents) {
            fightLogComponents[cp].offset[1] = (fightLogComponents.bigoff + 1000) - t;
        }
        for (cp in enemyListComponents) {
            enemyListComponents[cp].offset[1] = (enemyListComponents.bigoff + 1000) - t;
        }
        for (cp in actionDisplay) {
            actionDisplay[cp].offset[1] = -500 + (t / 2);
        }
        turnDisplay.offset[1] = -500 + (t / 2);

        scal = Math.max(1, 10 - (t / 75));

        if (t > 999) {
            for (cp in fightStats) fightStats[cp].offset[1] = 0;
            for (cp in fightLogComponents) fightLogComponents[cp].offset[1] = fightLogComponents[cp].bigoff;
            for (cp in enemyListComponents) enemyListComponents[cp].offset[1] = enemyListComponents[cp].bigoff;
            for (cp in actionDisplay) actionDisplay[cp].offset[1] = 0;
            turnDisplay.offset[1] = 0;

            let runTime = 0;
            let runLaps = 0;
            addAnimator(function (t) {
                for (i = 0; i < positionControls.length; i++) {
                    positionControls[i].offset[0] = positionControls[i].defoffset - (1000 - t);
                    positionControls[i].anchor[0] = Math.min(t / 40000, 0.025);
                    if (positionControls[i].source != "gear") positionControls[i].snip[0] = Math.floor(runTime) * 32;
                }
                for (i = 0; i < epositionControls.length; i++) {
                    epositionControls[i].offset[0] = epositionControls[i].defoffset + (1000 - t);
                    epositionControls[i].anchor[0] = Math.max(t / 40000, 0.975);
                    if (epositionControls[i].source != "gear") epositionControls[i].snip[0] = Math.floor(runTime) * 32;
                }

                runTime += ((t - runLaps) / 250);
                if (runTime >= 2) {
                    runTime = 0;
                    runLaps = t;
                }
                if (t > 1000) {
                    for (i = 0; i < positionControls.length; i++) {
                        positionControls[i].offset[0] = positionControls[i].defoffset;
                        positionControls[i].anchor[0] = 0.025;
                    }
                    for (i = 0; i < epositionControls.length; i++) {
                        epositionControls[i].offset[0] = epositionControls[i].defoffset;
                        epositionControls[i].anchor[0] = 0.975;
                    }
                    delete runTime;
                    delete runLaps;
                    return true;
                }
                return false;
            });

            return true;
        }
        return false;
    });

    let kokitoziParticles = Particles({
        anchor: [0.5, 0.5], sizeOffset: [2, 2], spreadOffset: [64, 8],
        type: "rect", fill: "#00cf09",
        direction: 0, speedAnchor: 0.01,
        direction2: 1, speedOffset2: 3, moveRandom2: 6,
        movable: true, movable2: true, lifespan: 0.3, amount: 25, spawnTime: 0.01, repeatMode: false,
        dead: true, alpha: 0
    })

    return {
        // Pre-render function
        preRender(ctx, delta) {
            globalFightAnimationTime = Math.min(1.999, globalFightAnimationTime + (2.9325 / delta));
            if (globalFightAnimationTime == 1.999) globalFightAnimationTime = 0;

            ctx.scale(scal, scal);

            ctx.drawImage(images.fight_bg, 0, 0, width * scale, height);

            for (pcc in positionControls) {
                let occ = positions[positionControls[pcc].pos1][positionControls[pcc].pos2].occupied;
                if (occ != false && !win) {
                    if (game.characters[occ].HP > 0) {
                        // temporary everyone-looks-like-bleu
                        positionControls[pcc].source = "bleu" + "_battle";
                        positionControls[pcc].snip = battleAnimation(occ, positionControls[pcc].emo, Math.floor(globalFightAnimationTime));
                    }
                    else {
                        positionControls[pcc].source = occ + "_dead";
                        positionControls[pcc].snip = [0, 0, 32, 32];
                    }
                }
            }

            if (game.characters.kokitozi.HP > 0) {
                for (j = 0; j < 3; j++) {
                    for (i = 0; i < 3; i++) {
                        if (positions[i][j].occupied == "kokitozi") {
                            kokitoziParticles.alpha = 1;
                            kokitoziParticles.dead = false;
                            kokitoziParticles.anchor = positionControls[i + (j * 3)].anchor;
                            kokitoziParticles.offset[0] = positionControls[i + (j * 3)].offset[0];
                            kokitoziParticles.offset[1] = positionControls[i + (j * 3)].offset[1] + 64;

                            let kokiboi = positionControls[i + (j * 3)];

                            if (kokiboi.flydir == 1) kokiboi.fly += (4 + Math.max(0, kokiboi.fly / 8) - (Math.max(0, 18 + kokiboi.fly) * 1.4)) / delta;
                            if (kokiboi.fly >= -16) kokiboi.flydir = 0;

                            if (kokiboi.flydir == 0) kokiboi.fly -= (4 + Math.max(0, (-16 - kokiboi.fly) / 8) - (Math.max(0, -28 + (kokiboi.fly * -1)) * 1.4)) / delta;
                            if (kokiboi.fly <= -32) kokiboi.flydir = 1;

                            kokiboi.offset[1] = (72 * kokiboi.pos2) + kokiboi.fly;
                        }
                    }
                }
            }
            else {
                kokitoziParticles.alpha = 0;
                kokitoziParticles.dead = true;
            }

            // Update the stats stuff at the bottom
            for (i = 0; i < game.chars.length; i++) {
                fightStats[amountStats * i].text = "Lvl. " + getPlayer(i + 1).level;
                if (getPlayer(i + 1).HP > 0) {
                    fightStats[1 + amountStats * i].source = getPlayer(i + 1).name.toLowerCase();
                }
                else {
                    fightStats[1 + amountStats * i].source = getPlayer(i + 1).name.toLowerCase() + "_dead";
                }
                if (getPlayer(i + 1).EP > 0) fightStats[8 + amountStats * i].sizeAnchor[0] = 0.1960 * (getPlayer(i + 1).EP / getStat(getPlayer(i + 1).name.toLowerCase(), "maxEP"));
                fightStats[10 + amountStats * i].text = getPlayer(i + 1).HP + "/" + getStat(i + 1, "maxHP");
                fightStats[10 + amountStats * i].fill = getHPFill(i);
                fightStats[11 + amountStats * i].text = getPlayer(i + 1).EP + "/" + getStat(getPlayer(i + 1).name.toLowerCase(), "maxEP");

                if (getPlayer(i + 1).effect[0] != "none") fightStats[13 + amountStats * i].alpha = 1;
                if (getPlayer(i + 1).effect[0] != "none") fightStats[13 + amountStats * i].source = getPlayer(i + 1).effect[0];
                if (getPlayer(i + 1).effect[0] == "none") fightStats[13 + amountStats * i].alpha = 0;
            }

            // Update fightlog
            for (i = 0; i < 12; i++) {
                fightLogComponents[2 + i].text = fightlog[Math.max(0, fightlog.length - 12 + i)];
            }
            for (i = 0; i < 4; i++) {
                actionDisplay[i].text = actionText[i];
            }

            // Grid thing
            for (i in positionGrid2) {
                if (positionGrid2[i].source != "grid") {
                    positionGrid2[i].alpha = 1;
                }
                else {
                    positionGrid2[i].alpha = 0;
                }
            }

            // Highlight thing
            if (highlightChange == 1) highlightAlpha = Math.min(0.5, highlightAlpha + 0.2 / delta);
            else highlightAlpha = Math.max(0, highlightAlpha - 0.2 / delta);
            if (highlightAlpha == 0.5) highlightChange = 0;
            if (highlightAlpha == 0) highlightChange = 1;

            /*if (fightaction == "none") {
                for (i = 0; i < 9; i++) {
                    if (positionControls[i].source != "gear") highlightGrid[i].alpha = highlightAlpha;
                }
                if (highlightGrid[9].alpha != 0) {
                    for (i = 0; i < 9; i++) {
                        highlightGrid[i + 9].alpha = 0;
                    }
                }
            }
            else */if (fightaction == "attack2" || fightaction == "magic" || fightaction == "item") {
                for (i = 0; i < 9; i++) {
                    if (positionControls[i].source != "gear") highlightGrid[i].alpha = highlightAlpha;
                    if (epositionControls[i].source != "gear" || epositions[i % 3][Math.floor(i / 3)].parent != undefined) highlightGrid[i + 9].alpha = highlightAlpha;
                    else highlightGrid[i + 9].alpha = 0;
                    if (epositionControls[i].source != "gear" || epositions[i % 3][Math.floor(i / 3)].parent != undefined) highlightGrid[i + 9].fill = rangeColors[getDistance("enemy", [i % 3, Math.floor(i / 3)])];
                }
            }
            else {
                if (highlightGrid[0].alpha != 0) {
                    for (i = 0; i < 9; i++) {
                        highlightGrid[i].alpha = 0;
                    }
                }
                if (highlightGrid[9].alpha != 0) {
                    for (i = 0; i < 9; i++) {
                        highlightGrid[i + 9].alpha = 0;
                    }
                }
            }

            put += delta;
            if (put > 99) {
                put = 0;
                updatePositions();
                if (checkAllAction() && !started) {
                    started = true;
                    executeActions();
                }

            }
        },

        // Controls
        controls: [
            // Load all the nice stuff
            ...positionGrid, ...fightButtons, ...fightActions, ...actionButtons, turnDisplay, fleeLoss, fleeIcon,
            ...fightLogComponents, ...enemyListComponents,
            ...fightOverview,
            ...fightStats, ...actionDisplay, ...gameOverScreen,
            ...positionControls, ...epositionControls, ...positionGrid2, ...highlightGrid, ...attackAnimationObjects, kokitoziParticles, ...battleNumbers, ...winScreen, ...winScreen2, ...winStats, ...fleeWrenches, ...gameOverScreen2,
            ...cutsceneElements,
        ],
        name: "fight"
    }
};
