scenes.fight = () => {

    var fightaction = "none";
    var attack_animation_progress = 0;
    var put = 0; //positions update time

    var fightBgRects = [];
    var fightButtons = [];
    var attackButtons = [];

    var fightLogComponents = [];
    var fightOverview = [];
    var fightPortraits = [];
    var fightStats1 = [];
    var fightStats2 = [];
    var fightStats3 = [];

    var positionControls = [];
    var epositionControls = [];
    var positionGrid = [];

    var switchThose = [[0, 0], [0, 0]];
    var selectedAlly = [0, 0];

    var win = false;

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
                    if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].acc - epositions[pos1][pos2].eva > (Math.random() * 100)) {
                        let Damage = game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].strength;
                        epositions[pos1][pos2].HP -= Damage; // Deal damage

                        fightlog.push(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " attacks " + epositions[pos1][pos2].name);
                        fightlog.push("and deals " + Damage + " damage!");
                        if (epositions[pos1][pos2].HP < 1) { // Is dead?
                            epositions[pos1][pos2].isOccupied = false;
                            epositions[pos1][pos2].occupied = false;
                            epositions[pos1][pos2].action = false;

                            let Experience = epositions[pos1][pos2].strength;
                            game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EXP += Experience;

                            fightlog.push(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " killed " + epositions[pos1][pos2].name);
                            fightlog.push("and earned " + Experience + " EXP!");
                            checkLevelUps();
                            checkAllDead();
                        }
                    }
                    else {
                        fightlog.push(game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + " missed!");
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
            let Damage = epositions[pos[0]][pos[1]].strength;
            if (positions[selectedAlly[0]][selectedAlly[1]].isOccupied != false) {
                game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].HP -= Damage;
                fightlog.push(epositions[pos[0]][pos[1]].name + " attacks " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name);
                fightlog.push("and deals " + Damage + " damage!");
                epositions[pos[0]][pos[1]].action = false;

                if (game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].HP < 1) {
                    fightlog.push(epositions[pos[0]][pos[1]].name + " killed " + game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].name + "!");
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

        // Fightlog
        fightlog.push("Swapped [" + (switchThose[0][0] + 1) + "/" + (switchThose[0][1] + 1) + "]");
        fightlog.push("with [" + (switchThose[1][0] + 1) + "/" + (switchThose[1][1] + 1) + "]!");

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

    // Bottom rects

    fightBgRects.push(controls.rect({
        anchor: [0.0, 0.0], offset: [0, 0], sizeAnchor: [1, 0.2],
        fill: "rgb(114, 95, 57)",
        alpha: 255,
    }));
    fightBgRects.push(controls.rect({
        anchor: [0.0, 0.025], offset: [0, 0], sizeAnchor: [1, 0.15],
        fill: "rgb(186, 154, 89)",
        alpha: 255,
    }));

    // Top row buttons

    fightButtons.push(controls.rect({
        anchor: [0.05, 0.03], offset: [0, 0], sizeAnchor: [0.05, 0],  sizeOffset: [40, 58],
        fill: "rgb(47, 95, 191)", text: "",
        alpha: 255,
        onClick(args) {
            if (this.alpha == 255) {
                fightaction = "attack";
            }
        }
    }));
    fightButtons.push(controls.rect({
        anchor: [0.05, 0.03], offset: [5, 5], sizeAnchor: [0.05, 0],  sizeOffset: [30, 48],
        fill: "rgb(191, 212, 255)",
        alpha: 255,
    }));
    fightButtons.push(controls.image({
        anchor: [0.05, 0.03], offset: [5, 5], sizeOffset: [48, 48],
        source: "actions",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.1, 0.03], offset: [30, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(0, 32, 102)", align: "right",
        text: "Battle",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.1, 0.03], offset: [30, 35], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(0, 32, 102)", align: "right",
        text: "Actions",
        alpha: 255,
    }));


    fightButtons.push(controls.rect({
        anchor: [0.1, 0.03], offset: [50, 0], sizeAnchor: [0.05, 0], sizeOffset: [40, 58],
        fill: "rgb(47, 191, 71)", text: "",
        alpha: 255,
        onClick(args) {
            if (this.alpha == 255) {

            }
        }
    }));
    fightButtons.push(controls.rect({
        anchor: [0.1, 0.03], offset: [55, 5], sizeAnchor: [0.05, 0], sizeOffset: [30, 48],
        fill: "rgb(191, 255, 202)",
        alpha: 255,
    }));
    fightButtons.push(controls.image({
        anchor: [0.1, 0.03], offset: [55, 5], sizeOffset: [48, 48],
        source: "inventory",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.15, 0.03], offset: [80, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(0, 102, 13)", align: "right",
        text: "Battle",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.15, 0.03], offset: [80, 35], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(0, 102, 13)", align: "right",
        text: "Inventory",
        alpha: 255,
    }));


    fightButtons.push(controls.rect({
        anchor: [0.15, 0.03], offset: [100, 0], sizeAnchor: [0.05, 0],  sizeOffset: [40, 58],
        fill: "rgb(191, 47, 167)", text: "",
        alpha: 255,
        onClick(args) {
            if (this.alpha == 255) {
                fightlog.push(prompt("Put what?"));
            }
        }
    }));
    fightButtons.push(controls.rect({
        anchor: [0.15, 0.03], offset: [105, 5], sizeAnchor: [0.05, 0],  sizeOffset: [30, 48],
        fill: "rgb(255, 191, 244)",
        alpha: 255,
    }));
    fightButtons.push(controls.image({
        anchor: [0.15, 0.03], offset: [105, 5], sizeOffset: [48, 48],
        source: "techniques",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.2, 0.03], offset: [130, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(102, 0, 83)", align: "right",
        text: "Mastery",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.2, 0.03], offset: [130, 35], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(102, 0, 83)", align: "right",
        text: "Techs",
        alpha: 255,
    }));


    fightButtons.push(controls.rect({
        anchor: [0.2, 0.03], offset: [150, 0], sizeAnchor: [0.05, 0],  sizeOffset: [40, 58],
        fill: "rgb(191, 143, 47)", text: "",
        alpha: 255,
        onClick(args) {
            // Switch Scrapper
            if (this.alpha == 255) {
                fightaction = "switch";
            }
        }
    }));
    fightButtons.push(controls.rect({
        anchor: [0.2, 0.03], offset: [155, 5], sizeAnchor: [0.05, 0],  sizeOffset: [30, 48],
        fill: "rgb(255, 234, 191)",
        alpha: 255,
    }));
    fightButtons.push(controls.image({
        anchor: [0.2, 0.03], offset: [155, 5], sizeOffset: [48, 48],
        source: "switch",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.25, 0.03], offset: [180, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(102, 68, 0)", align: "right",
        text: "Switch",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.25, 0.03], offset: [180, 35], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(102, 68, 0)", align: "right",
        text: "Scrapper",
        alpha: 255,
    }));


    fightButtons.push(controls.rect({
        anchor: [0.25, 0.03], offset: [200, 0], sizeAnchor: [0.05, 0],  sizeOffset: [40, 58],
        fill: "rgb(119, 119, 119)", text: "",
        alpha: 255,
        onClick(args) {
            if (this.alpha == 255) {
                setScene(scenes.game());
            }
        }
    }));
    fightButtons.push(controls.rect({
        anchor: [0.25, 0.03], offset: [205, 5], sizeAnchor: [0.05, 0],  sizeOffset: [30, 48],
        fill: "rgb(223, 223, 223)",
        alpha: 255,
    }));
    fightButtons.push(controls.image({
        anchor: [0.25, 0.03], offset: [205, 5], sizeOffset: [48, 48],
        source: "flee",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.3, 0.03], offset: [230, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(102, 68, 0)", align: "right",
        text: "Flee",
        alpha: 255,
    }));
    fightButtons.push(controls.label({
        anchor: [0.3, 0.03], offset: [230, 35], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(102, 68, 0)", align: "right",
        text: "Fight",
        alpha: 255,
    }));

    // Bottom rects

    fightBgRects.push(controls.rect({
        anchor: [0.0, 0.7], offset: [0, 0], sizeAnchor: [1, 0.3],
        fill: "rgb(186, 154, 89)",
        alpha: 255,
    }));
    fightBgRects.push(controls.rect({
        anchor: [0.0, 0.95], offset: [0, 0], sizeAnchor: [1, 0.05],
        fill: "rgb(114, 95, 57)",
        alpha: 255,
    }));


    // Battle Log (Bottom Left)

    fightLogComponents.push(controls.rect({
        anchor: [0, 0.65], offset: [0, 0], sizeAnchor: [0.20, 0.35], sizeOffset: [40, 0],
        fill: "rgb(50, 78, 131)",
        alpha: 255,
    }));

    fightLogComponents.push(controls.rect({
        anchor: [0.01, 0.67], offset: [0, 0], sizeAnchor: [0.18, 0.31], sizeOffset: [40, 0],
        fill: "rgb(145, 178, 245)",
        alpha: 255,
    }));

    for (i = 0; i < 12; i++) {
        fightLogComponents.push(controls.label({
            anchor: [0.01, 0.7 + (i*0.02)], offset: [2, 0],
            fontSize: 12, fill: "rgb(0, 0, 0)", align: "left",
            text: fightlog[Math.max(0, fightlog.length - 12 + i)],
            alpha: 255,
        }));
    }

    // Fight Overview (bottom right)

    fightOverview.push(controls.rect({
        anchor: [0.8, 0.65], offset: [-40, 0], sizeAnchor: [0.20, 0.35], sizeOffset: [40, 0],
        fill: "rgb(131, 50, 78)",
        alpha: 255,
    }));

    fightOverview.push(controls.rect({
        anchor: [0.81, 0.67], offset: [-40, 0], sizeAnchor: [0.18, 0.31], sizeOffset: [40, 0],
        fill: "rgb(245, 145, 178)",
        alpha: 255,
    }));

    // Portraits (is that how you spell it?)

    fightPortraits.push(controls.rect({
        anchor: [0.2, 0.625], offset: [40, 0], sizeOffset: [68, 68],
        fill: "yellow",
        alpha: 255,
    }));
    
    fightPortraits.push(controls.image({
        anchor: [0.2, 0.625], offset: [42, 2], sizeOffset: [64, 64],
        source: "p_bleu",
        alpha: 255,
    }));

    fightPortraits.push(controls.rect({
        anchor: [0.42, 0.625], offset: [40, 0], sizeOffset: [68, 68],
        fill: "yellow",
        alpha: 255,
    }));

    fightPortraits.push(controls.image({
        anchor: [0.42, 0.625], offset: [42, 2], sizeOffset: [64, 64],
        source: "p_corelle",
        alpha: 255,
    }));

    // Fight stats 1 - always below portraits

    fightStats1.push(controls.label({
        anchor: [0.2, 0.7], offset: [74, 38],
        fontSize: 20, fill: "blue", align: "center",
        text: getPlayer().name,
        alpha: 255,
    }));

    fightStats1.push(controls.label({
        anchor: [0.2, 0.7], offset: [74, 58],
        fontSize: 20, fill: "yellow", align: "center",
        text: "Level: " + getPlayer().level,
        alpha: 255,
    }));

    fightStats1.push(controls.label({
        anchor: [0.42, 0.7], offset: [74, 38],
        fontSize: 20, fill: "blue", align: "center",
        text: getPlayer(2).name,
        alpha: 255,
    }));

    fightStats1.push(controls.label({
        anchor: [0.42, 0.7], offset: [74, 58],
        fontSize: 20, fill: "yellow", align: "center",
        text: "Level: " + getPlayer(2).level,
        alpha: 255,
    }));

    // Fight stats 2 (MOBILE)

    fightStats2.push(controls.rect({
        anchor: [0.2, 0.7], offset: [42, 78], sizeAnchor: [0.12, 0.04],
        fill: "rgb(0, 145, 40)",
        alpha: 255,
    }));

    fightStats2.push(controls.rect({
        anchor: [0.2, 0.706], offset: [42, 98], sizeAnchor: [0.12, 0.04],
        fill: "rgb(145, 0, 105)",
        alpha: 255,
    }));

    fightStats2.push(controls.label({
        anchor: [0.26, 0.72], offset: [42, 78],
        fontSize: 14, fill: "black", align: "center",
        text: getPlayer().HP + "/" + getPlayer().maxHP,
        alpha: 255,
    }));

    fightStats2.push(controls.label({
        anchor: [0.26, 0.728], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: getPlayer().EP + "/" + getPlayer().EP,
        alpha: 255,
    }));



    fightStats2.push(controls.rect({
        anchor: [0.42, 0.7], offset: [42, 78], sizeAnchor: [0.12, 0.04],
        fill: "rgb(0, 145, 40)",
        alpha: 255,
    }));

    fightStats2.push(controls.rect({
        anchor: [0.42, 0.706], offset: [42, 98], sizeAnchor: [0.12, 0.04],
        fill: "rgb(145, 0, 105)",
        alpha: 255,
    }));

    fightStats2.push(controls.label({
        anchor: [0.48, 0.72], offset: [42, 78],
        fontSize: 14, fill: "black", align: "center",
        text: getPlayer(2).HP + "/" + getPlayer(2).maxHP,
        alpha: 255,
    }));

    fightStats2.push(controls.label({
        anchor: [0.48, 0.728], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: getPlayer(2).EP + "/" + getPlayer(2).EP,
        alpha: 255,
    }));

    // Fight stats 3 (PC)

    fightStats3.push(controls.rect({
        anchor: [0.28, 0.6], offset: [42, 78], sizeAnchor: [0.12, 0.04],
        fill: "rgb(0, 145, 40)",
        alpha: 0,
    }));

    fightStats3.push(controls.rect({
        anchor: [0.28, 0.606], offset: [42, 98], sizeAnchor: [0.12, 0.04],
        fill: "rgb(145, 0, 105)",
        alpha: 0,
    }));

    fightStats3.push(controls.label({
        anchor: [0.32, 0.62], offset: [42, 78],
        fontSize: 14, fill: "black", align: "center",
        text: "HP: " + getPlayer().HP + "/" + getPlayer().maxHP,
        alpha: 0,
    }));

    fightStats3.push(controls.label({
        anchor: [0.32, 0.628], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: "EP: " + getPlayer().EP + "/" + getPlayer().maxEP,
        alpha: 0,
    }));



    fightStats3.push(controls.rect({
        anchor: [0.5, 0.6], offset: [42, 78], sizeAnchor: [0.12, 0.04],
        fill: "rgb(0, 145, 40)",
        alpha: 0,
    }));

    fightStats3.push(controls.rect({
        anchor: [0.5, 0.606], offset: [42, 98], sizeAnchor: [0.12, 0.04],
        fill: "rgb(145, 0, 105)",
        alpha: 0,
    }));

    fightStats3.push(controls.label({
        anchor: [0.54, 0.62], offset: [42, 78],
        fontSize: 14, fill: "black", align: "center",
        text: "HP: " + getPlayer(2).HP + "/" + getPlayer(2).maxHP,
        alpha: 0,
    }));

    fightStats3.push(controls.label({
        anchor: [0.54, 0.628], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: "EP: " + getPlayer(2).EP + "/" + getPlayer(2).maxEP,
        alpha: 0,
    }));


    // Attack Buttons
    // Visible after pressing Battle Actions

    attackButtons.push(controls.rect({
        anchor: [0.05, 0.03], offset: [0, 0], sizeAnchor: [0.05, 0], sizeOffset: [40, 58],
        fill: "rgb(47, 95, 191)", text: "",
        alpha: 255,
        onClick(args) {
            if (this.alpha == 255) {
                fightaction = "attack2";
            }
        }
    }));
    attackButtons.push(controls.rect({
        anchor: [0.05, 0.03], offset: [5, 5], sizeAnchor: [0.05, 0], sizeOffset: [30, 48],
        fill: "rgb(191, 212, 255)",
        alpha: 255,
    }));
    attackButtons.push(controls.image({
        anchor: [0.05, 0.03], offset: [5, 5], sizeOffset: [48, 48],
        source: "actions",
        alpha: 255,
    }));
    attackButtons.push(controls.label({
        anchor: [0.1, 0.03], offset: [30, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(0, 32, 102)", align: "right",
        text: "Attack",
        alpha: 255,
    }));



    attackButtons.push(controls.rect({
        anchor: [0.15, 0.03], offset: [0, 0], sizeAnchor: [0.05, 0], sizeOffset: [40, 58],
        fill: "rgb(47, 95, 191)", text: "",
        alpha: 255,
        onClick(args) {
            if (this.alpha == 255) {
                fightaction = "heal1";
            }
        }
    }));
    attackButtons.push(controls.rect({
        anchor: [0.15, 0.03], offset: [5, 5], sizeAnchor: [0.05, 0], sizeOffset: [30, 48],
        fill: "rgb(191, 212, 255)",
        alpha: 255,
    }));
    attackButtons.push(controls.image({
        anchor: [0.15, 0.03], offset: [5, 5], sizeOffset: [48, 48],
        source: "actions",
        alpha: 255,
    }));
    attackButtons.push(controls.label({
        anchor: [0.2, 0.03], offset: [30, 20], sizeOffset: [48, 48],
        fontSize: 14, fill: "rgb(0, 32, 102)", align: "right",
        text: "Heal",
        alpha: 255,
    }));




    actionDisplay = controls.label({
        anchor: [0.4, 0.185],
        fontSize: 16, fill: "rgb(125, 255, 0)", align: "left",
        text: "...",
        alpha: 255,
    });

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
        }
    }

    // Friendly pos (left)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionControls.push(controls.image({
                anchor: [0.025, 0.375], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "gear",
                alpha: 255,
                snip: [0, 64, 32, 32],
                pos1: i,
                pos2: j,
                onClick(args) {
                    if (fightaction == "switch") {
                        if (positions[this.pos1][this.pos2].isOccupied == true && positions[this.pos1][this.pos2].action == false && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                            switchThose[0] = [this.pos1, this.pos2];
                            positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "selected";
                            fightaction = "switch2"; //switch two: electric boogaloo
                        }
                    }
                    else if (fightaction == "switch2") {
                        if (switchThose[0][0] != [this.pos1] || switchThose[0][1] != [this.pos2]) {
                            switchThose[1] = [this.pos1, this.pos2];
                            positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "grid";
                            positions[switchThose[0][0]][switchThose[0][1]].action = ["switch", switchThose[0][0], switchThose[0][1], switchThose[1][0], switchThose[1][1]];
                            fightaction = "none";
                        }
                    }
                    if (fightaction == "attack2" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "attack3";
                    }
                    if (fightaction == "heal1" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "heal2";
                    }
                    else if (fightaction == "heal2" && positions[this.pos1][this.pos2].action == false && positions[this.pos1][this.pos2].isOccupied == true && game.characters[positions[this.pos1][this.pos2].occupied].HP > 0) {
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["heal", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "grid";
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
                anchor: [0.975, 0.375], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
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

                    if (fightaction == "attack3" && positions[selectedAlly[0]][selectedAlly[1]].action == false) {
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "grid";
                        positions[selectedAlly[0]][selectedAlly[1]].action = ["attack", selectedAlly[0], selectedAlly[1], this.pos1, this.pos2];

                        fightaction = "none";
                        
                    }
                }
            }));
        }
    }

    // Pos grid
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.025, 0.375], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "grid",
                alpha: 255,
            }));
        }
    }
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.975, 0.375], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
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
                    }
                    else {
                        epositionControls[i + (j * 3)].source = "gear";
                        epositionControls[i + (j * 3)].alpha = 0;
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

        actionDisplay.text =
            {
            "none" : "Choose what to do!",
            "switch": "Select who to switch!",
            "switch2": "Select where to switch to!",
            "attack": "Select attack type",
            "attack2": "Select who should attack!",
            "attack3": "Select who should be attacked!",
            "attack4": "So much damage! Wow!",
            "enemiesturn": "It's the enemies' turn...",
            "heal1": "Select the wizard who will heal",
            "heal2": "heal who?"
            }[fightaction];
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
            ctx.drawImage(images.fight_bg, 0, 100, width * scale, height);



            // Buttons

            if (fightaction == "none") {
                for (i = 0; i < fightButtons.length; i++) {
                    fightButtons[i].alpha = 255;
                }
            }
            else {
                for (i = 0; i < fightButtons.length; i++) {
                    fightButtons[i].alpha = 0;
                }
            }

            if (isMobile()) {
                for (i = 0; i < fightButtons.length; i += 5) {
                    fightButtons[i + 3].alpha = 0;
                    fightButtons[i + 4].alpha = 0;
                }

                for (i = 0; i < fightStats2.length; i++) {
                    fightStats2[i].alpha = 255;
                }
                for (i = 0; i < fightStats3.length; i++) {
                    fightStats3[i].alpha = 0;
                }
            }
            else {

                for (i = 0; i < fightStats2.length; i++) {
                    fightStats2[i].alpha = 0;
                }
                for (i = 0; i < fightStats3.length; i++) {
                    fightStats3[i].alpha = 255;
                }
            }
            
            if (fightaction == "attack") {
                for (i = 0; i < attackButtons.length; i++) {
                    attackButtons[i].alpha = 255;
                }
            }
            else {
                for (i = 0; i < attackButtons.length; i++) {
                    attackButtons[i].alpha = 0;
                }
            }

            fightStats2[2].text = getPlayer(1).HP + "/" + getPlayer(1).maxHP;
            fightStats2[6].text = getPlayer(2).HP + "/" + getPlayer(2).maxHP;
            fightStats3[2].text = getPlayer(1).HP + "/" + getPlayer(1).maxHP;
            fightStats3[6].text = getPlayer(2).HP + "/" + getPlayer(2).maxHP;

            // Update fightlog
            for (i = 0; i < 12; i++) {
                fightLogComponents[2 + i].text = fightlog[Math.max(0, fightlog.length - 12 + i)];
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
            ...fightBgRects,
            ...fightButtons, ...attackButtons,
            ...fightLogComponents,
            ...fightOverview,
            ...fightPortraits,
            ...fightStats1, ...fightStats2, ...fightStats3, actionDisplay,
            ...positionControls, ...epositionControls, ...positionGrid,
        ],
    }
};