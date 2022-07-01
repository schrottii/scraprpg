scenes.fight = () => {

    var fightaction = "none";
    var turn = 1;
    var put = 0; //positions update time

    var fightButtons = [];
    var fightActions = [];

    var fightStats = [];

    var fightLogComponents = [];
    var enemyListComponents = [];
    var enemyAmounts = ["", "", "", "", "", "", "", "", ""];
    var fightOverview = [];
    var fightStats1 = [];
    var fightStats2 = [];
    var fightStats3 = [];
    var actionDisplay = [];
    var actionText = [];

    var positionControls = [];
    var epositionControls = [];
    var positionGrid = [];

    var switchThose = [[0, 0], [0, 0]];
    var selectedAlly = [0, 0];

    var win = false;

    const amountStats = 13;

    var fightlog = [
        "",
        "Battle has started!",
        "All actions will",
        "be logged here!",
    ];

    function checkAllDead() {
        let alive = 0;
        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (epositions[i][j].isOccupied == true) {
                    alive += 1;
                }
            }
        }
        if (alive == 0) { // All dead :)
            win = true;
            getPlayer(1).EXP += 5;
            getPlayer(2).EXP += 5;
            getPlayer(3).EXP += 5;
                checkLevelUps();
                setTimeout(() => {
                    setScene(scenes.game());
                }, 2000);
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
            setScene(scenes.title());
        }
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
                attackAnimation(pos1, pos2, () => {
                    if (epositions[pos1][pos2].isOccupied == false) return false;
                    if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].acc - epositions[pos1][pos2].eva > (Math.random() * 100)) {
                        let Damage = calculateDamage(1, selectedAlly[0], selectedAlly[1], pos1, pos2);
                        epositions[pos1][pos2].HP -= Damage; // Deal damage

                        playSound("damage");
                        postLog(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " attacks " + epositions[pos1][pos2].name + " and deals " + Damage + " damage!");
                        if (getElementDamage(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].element, epositions[pos1][pos2].element) != 1){
                            postLog("Element boost: x" + getElementDamage(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].element, epositions[pos1][pos2].element) + "!");
                        }

                        if (epositions[pos1][pos2].HP < 1) { // Is dead?
                            epositions[pos1][pos2].isOccupied = false;
                            epositions[pos1][pos2].occupied = false;
                            epositions[pos1][pos2].action = false;
                            enemyAmounts[pos1 + (pos2 * 3)] = "";

                            let Experience = epositions[pos1][pos2].strength;
                            game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EXP += Experience;

                            postLog(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " killed " + epositions[pos1][pos2].name + " and earned " + Experience + " EXP!");
                            checkLevelUps();
                            checkAllDead();
                        }
                    }
                    else {
                        postLog(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " missed!");
                    }
                    executeActions();
                });
                positions[pos[0]][pos[1]].action = false;
                break;
            case "heal":
                selectedAlly = [whoAGI.action[1], whoAGI.action[2]];

                game.characters[positions[whoAGI.action[3]][whoAGI.action[4]].occupied].HP += game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].strength;
                
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
        attackAnimation(pos[0], pos[1], () => {
            let Damage = calculateDamage(2, pos[0], pos[1], selectedAlly[0], selectedAlly[1]);
            if (positions[selectedAlly[0]][selectedAlly[1]].isOccupied != false) {
                let HealthBefore = game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].HP;
                game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].HP -= Damage;
                epositions[pos[0]][pos[1]].action = false;

                playSound("damage");
                postLog(epositions[pos[0]][pos[1]].name + " attacks " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " and deals " + Damage + " damage!");
                if (getElementDamage(epositions[pos[0]][pos[1]].element, game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].element) != 1) {
                    postLog("Element boost: x" + getElementDamage(epositions[pos[0]][pos[1]].element, game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].element) + "!");
                }

                // Bar animation! (Cowboy moment)
                let skip = 0; //No idea what else to call this

                if (positions[selectedAlly[0]][selectedAlly[1]].occupied == game.chars[1].toLowerCase()) {
                    skip = 1;
                }
                let which = 5 + (skip * amountStats);
                fightStats[which].alpha = 255;
                let HealthAfter = HealthBefore - Damage;
                let Leftend = 0.1960 * 1 - ((getPlayer(1 + skip).maxHP - HealthAfter) / 100);
                let Length = 0.1960 * 0 + ((HealthBefore - HealthAfter) / 100);
                fightStats[which].anchor[0] = 0.242 + Leftend;
                fightStats[which].sizeAnchor[0] = Length;
                addAnimator(function (t) {
                    if (t > 400) {
                        fightStats[which].sizeAnchor[0] = Length * Math.max(0.01, (1 - (Math.min((t - 399) * 0.01, 1))));
                    }

                    if (t > 1400) {
                        fightStats[which].alpha = 0;
                        return true;
                    }
                });


                if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].HP < 1) {
                    postLog(epositions[pos[0]][pos[1]].name + " killed " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + "!");
                    positions[selectedAlly[0]][selectedAlly[1]].isOccupied = false;
                    checkAllDead();
                }
            }
            enemiesTurn();
        }, true); // very important true,bob
    }


    function switchPositions() {
        // important variable here: switchThose
        // [0] is pos of which one to switch, [1] of where to switch to

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

    function attackAnimation(pos1, pos2, onFinish, enemy = false) {
        if (enemy == false) {
            addAnimator(function (t) {
                positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].anchor[0] = 0.025 + (0.0005 * t);

                if (positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].anchor[0] + (positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].offset[0] / 1000) >
                    epositionControls[pos1 + (pos2 * 3)].anchor[0] + (epositionControls[pos1 + (pos2 * 3)].offset[0] / 1000)) {

                    positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].anchor[0] = 0.025;

                    onFinish();
                    return true;
                }
                return false;
            });
        }
        else {
            addAnimator(function (t) {
                epositionControls[pos1 + (pos2 * 3)].anchor[0] = 0.975 - (0.0005 * t);

                if (epositionControls[pos1 + (pos2 * 3)].anchor[0] + (epositionControls[pos1 + (pos2 * 3)].offset[0] / 1000) <
                    positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].anchor[0] + (positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].offset[0] / 1000)) {

                    epositionControls[pos1 + (pos2 * 3)].anchor[0] = 0.975;

                    onFinish();
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
                        setScene(scenes.game());
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

    for (j = 0; j < 2; j++) {
        for (i = 0; i < 6; i++) {
            fightActions.push(controls.rect({
                anchor: [0.33 + (j * 0.17), 0 + (i * 0.0375)], sizeAnchor: [0.17, 0.0375],
                fill: "rgb(38, 52, 38)",
                alpha: 255,
                onClick(args) {
                    if (this.alpha == 255) {
                    }
                }
            }))
            fightActions.push(controls.rect({
                anchor: [0.3325 + (j * 0.17), 0.0025 + (i * 0.0375)], sizeAnchor: [0.165, 0.0325],
                fill: "rgb(42, 87, 44)",
                alpha: 255,
            }))
            fightActions.push(controls.label({
                anchor: [0.49 + (j * 0.17), 0.025 + (i * 0.0375)],
                text: "Coming soon...",
                fontSize: 16, fill: "white", align: "right",
                alpha: 255,
            }))

        }
    }


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
        }
    }

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
    var positions =
        [
            [
                {
                    pos: "top left",
                    isOccupied: true, // bool
                    occupied: "bleu", // who?
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
                    isOccupied: true, // bool
                    occupied: "corelle", // who?
                    action: false,
                },
                {
                    pos: "bottom middle",
                    isOccupied: true, // bool
                    occupied: "gau", // who?
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

    // Friendly pos (left)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionControls.push(controls.image({
                anchor: [0.025, 0.45], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
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



                    if (fightaction == "switch") {
                        if (switchThose[0][0] != [this.pos1] || switchThose[0][1] != [this.pos2]) {
                            switchThose[0] = selectedAlly;
                            switchThose[1] = [this.pos1, this.pos2];
                            positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "hasaction";
                            positions[switchThose[0][0]][switchThose[0][1]].action = ["switch", switchThose[0][0], switchThose[0][1], switchThose[1][0], switchThose[1][1]];
                            fightaction = "none";
                            hideFightButtons();
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
                            positionControls[i + (j * 3)].source = positions[i][j].occupied + "_win";
                            positionControls[i + (j * 3)].snip = [0, 0, 32, 32];
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

        // When the fight starts. How many chars do we have? Who exists? Show/Hide/Gray out stats
        for (i = 0; i < game.chars.length; i++) {
            fightStats[amountStats * i].alpha = 255;
            fightStats[1 + amountStats * i].alpha = 255;
            fightStats[4 + amountStats * i].fill = "rgb(20, 204, 20)";
            fightStats[8 + amountStats * i].fill = "rgb(205, 0, 205)";
            fightStats[10 + amountStats * i].alpha = 255;
            fightStats[11 + amountStats * i].alpha = 255;
            fightStats[12 + amountStats * i].alpha = 255;
            if (game.characters[characters[i]].element != undefined) fightStats[12 + amountStats * i].source = game.characters[characters[i]].element;
        }

        // Mobile resizing
        if (isMobile()) {
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    positionControls[i + (j * 3)].sizeOffset = [48, 48];
                    positionControls[i + (j * 3)].offset = [56 * i, 72 * j];
                    epositionControls[i + (j * 3)].sizeOffset = [48, 48];
                    epositionControls[i + (j * 3)].offset = [-(48 + (56 * i)), 72 * j];
                    positionGrid[i + (j * 3)].sizeOffset = [48, 48];
                    positionGrid[i + (j * 3)].offset = [56 * i, 72 * j];
                    positionGrid[9 + i + (j * 3)].sizeOffset = [48, 48];
                    positionGrid[9 + i + (j * 3)].offset = [-(48 + (56 * i)), 72 * j];

                    
                }
            }
        }
        else {
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 3; i++) {
                    positionControls[i + (j * 3)].sizeOffset = [64, 64];
                    positionControls[i + (j * 3)].offset = [72 * i, 72 * j];
                    epositionControls[i + (j * 3)].sizeOffset = [64, 64];
                    epositionControls[i + (j * 3)].offset = [-(72 + (72 * i)), 72 * j]
                    positionGrid[i + (j * 3)].sizeOffset = [64, 64];
                    positionGrid[i + (j * 3)].offset = [72 * i, 72 * j];
                    positionGrid[9 + i + (j * 3)].sizeOffset = [64, 64];
                    positionGrid[9 + i + (j * 3)].offset = [-(72 + (72 * i)), 72 * j];
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

    return {
        // Pre-render function
        preRender(ctx, delta) {
            ctx.drawImage(images.fight_bg, 0, 0, width * scale, height);

            // Update the stats stuff at the bottom
            for (i = 0; i < 6; i++) {
                fightStats[amountStats * i].text = "Lvl. " + getPlayer(i + 1).level;
                fightStats[1 + amountStats * i].source = getPlayer(i + 1).name.toLowerCase();
                fightStats[4 + amountStats * i].sizeAnchor[0] = 0.1960 * 1 - ((getPlayer(i + 1).maxHP - getPlayer(i + 1).HP)/100);
                fightStats[8 + amountStats * i].sizeAnchor[0] = 0.1960 * 1 - ((getPlayer(i + 1).maxEP - getPlayer(i + 1).EP)/100);
                fightStats[10 + amountStats * i].text = getPlayer(i + 1).HP + "/" + getPlayer(i + 1).maxHP;
                fightStats[11 + amountStats * i].text = getPlayer(i + 1).EP + "/" + getPlayer(i + 1).maxEP;
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
            //...fightBgRects,
            ...fightButtons, ...fightActions, turnDisplay,
            ...fightLogComponents, ...enemyListComponents,
            ...fightOverview,
            ...fightStats, ...actionDisplay,
            ...positionControls, ...epositionControls, ...positionGrid,
        ],
    }
};