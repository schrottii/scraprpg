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
                getPlayer(1).EXP += 5;
                getPlayer(2).EXP += 5;
                checkLevelUps();
                setScene(scenes.game());
            }
    }

    function switchPositions() {
        // important variable here: switchThose
        // [0] is pos of which one to switch, [1] of where to switch to

        // Switch them and adjust isOccupied
        let cache123 = positions[switchThose[1][0]][switchThose[1][1]].occupied;
        positions[switchThose[1][0]][switchThose[1][1]].occupied = positions[switchThose[0][0]][switchThose[0][1]].occupied;
        positions[switchThose[0][0]][switchThose[0][1]].occupied = cache123;

        positions[switchThose[0][0]][switchThose[0][1]].isOccupied = positions[switchThose[1][0]][switchThose[1][1]].isOccupied;
        positions[switchThose[1][0]][switchThose[1][1]].isOccupied = true;

        // Fightlog
        fightlog.push("Swapped [" + (switchThose[0][0] + 1) + "/" + (switchThose[0][1] + 1) + "]");
        fightlog.push("with [" + (switchThose[1][0] + 1) + "/" + (switchThose[1][1] + 1) + "]!");

        // Clear this stuff
        switchThose = [[0, 0], [0, 0]];
        fightaction = "none";
    }

    function attackAnimation(pos1, pos2, onFinish) {
        addAnimator(function (t) {
            positionControls[selectedAlly[0] + (selectedAlly[1]*3)].anchor[0] = 0.025 + ( 0.0005 * t);

            if (positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].anchor[0] + (positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].offset[0] / 1000) >
                epositionControls[pos1 + (pos2 * 3)].anchor[0] + (epositionControls[pos1 + (pos2 * 3)].offset[0] / 1000)) {

                positionControls[selectedAlly[0] + (selectedAlly[1] * 3)].anchor[0] = 0.025;

                onFinish();
                return true;
            }
            return false;
        })
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
        anchor: [0.02, 0.67], offset: [0, 0], sizeAnchor: [0.16, 0.31], sizeOffset: [40, 0],
        fill: "rgb(145, 178, 245)",
        alpha: 255,
    }));

    for (i = 0; i < 12; i++) {
        fightLogComponents.push(controls.label({
            anchor: [0.1, 0.7 + (i*0.02)], offset: [20, 0],
            fontSize: 12, fill: "rgb(0, 0, 0)", align: "center",
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
        anchor: [0.82, 0.67], offset: [-40, 0], sizeAnchor: [0.16, 0.31], sizeOffset: [40, 0],
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
                },
                {
                    pos: "top middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "top right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
            ],
            [
                {
                    pos: "middle left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "middle middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "middle right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
            ],
            [
                {
                    pos: "bottom left",
                    isOccupied: true, // bool
                    occupied: "corelle", // who?
                },
                {
                    pos: "bottom middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "bottom right",
                    isOccupied: false, // bool
                    occupied: false, // who?
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
                },
                {
                    pos: "top middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "top right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
            ],
            [
                {
                    pos: "middle left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "middle middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "middle right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
            ],
            [
                {
                    pos: "bottom left",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "bottom middle",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
                {
                    pos: "bottom right",
                    isOccupied: false, // bool
                    occupied: false, // who?
                },
            ],
        ];

    if (currentEnemies.length > 0) {
        for (i = 0; i < currentEnemies.length; i++) {
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].isOccupied = true;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].occupied = currentEnemies[i][0];
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].maxHP = enemyTypes[currentEnemies[i][0]].HP;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].HP = enemyTypes[currentEnemies[i][0]].HP;
            epositions[currentEnemies[i][1]][currentEnemies[i][2]].strength = enemyTypes[currentEnemies[i][0]].strength;
        }
    }

    // Friendly pos (left)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionControls.push(controls.image({
                anchor: [0.025, 0.25], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "gear",
                alpha: 255,
                snip: [0, 64, 32, 32],
                pos1: i,
                pos2: j,
                onClick(args) {
                    if (fightaction == "switch") {
                        if (positions[this.pos1][this.pos2].isOccupied == true) {
                            switchThose[0] = [this.pos1, this.pos2];
                            positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "selected";
                            fightaction = "switch2"; //switch two: electric boogaloo
                        }
                    }
                    else if (fightaction == "switch2") {
                        if (switchThose[0][0] != [this.pos1] || switchThose[0][1] != [this.pos2]) {
                            switchThose[1] = [this.pos1, this.pos2];
                            positionGrid[switchThose[0][0] + (switchThose[0][1] * 3)].source = "grid";
                            switchPositions();
                        }
                    }
                    if (fightaction == "attack2") {
                        selectedAlly = [this.pos1, this.pos2];
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "selected";
                        fightaction = "attack3";
                    }
                }
            }));
        }
    }

    // Enemies pos (right)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            epositionControls.push(controls.image({
                anchor: [0.975, 0.25], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
                source: "gear",
                alpha: 255,
                snip: [0, 32, 32, 32],
                pos1: i,
                pos2: j,
                onClick(args) {
                    //epositions[this.pos1][this.pos2].occupied = "selected";
                    // uhhh... no?
                    // but add fighting here at some point
                    // THAT POINT IS NOW! Idiot

                    if (fightaction == "attack3") {
                        positionGrid[selectedAlly[0] + (selectedAlly[1] * 3)].source = "grid";
                        fightaction = "attack4"; // To avoid being able to click over and over again to get duplicate damage / EXP
                        attackAnimation(this.pos1, this.pos2, () => {
                            epositions[this.pos1][this.pos2].HP -= game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].strength; // Deal damage
                            if (epositions[this.pos1][this.pos2].HP < 1) { // Is dead?
                                epositions[this.pos1][this.pos2].isOccupied = false;
                                epositions[this.pos1][this.pos2].occupied = false;
                                game.characters[positions[selectedAlly[0]][selectedAlly[1]].occupied].EXP += epositions[this.pos1][this.pos2].strength;
                                checkLevelUps();
                                checkAllDead();
                            }
                            fightaction = "none";
                        });
                    }
                }
            }));
        }
    }

    // Pos grid
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.025, 0.25], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "grid",
                alpha: 255,
            }));
        }
    }
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.975, 0.25], offset: [-(72 + (72 * i)), 72 * j], sizeOffset: [64, 64],
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
                        positionControls[i + (j * 3)].source = positions[i][j].occupied;
                        positionControls[i + (j * 3)].alpha = 255;
                    }
                    else {
                        positionControls[i + (j * 3)].source = "gear";
                        positionControls[i + (j * 3)].alpha = 0;
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

            // Update fightlog
            for (i = 0; i < 12; i++) {
                fightLogComponents[2 + i].text = fightlog[Math.max(0, fightlog.length - 12 + i)];
            }
            


            /*ctx.font = "12px NotoSans, sans-serif";
            ctx.fillStyle = "black";
            if (x == 0) {
                ctx.fillText("4 " + gete(1).name + "s!", 620, 405);
                ctx.fillText("Evil Helter Skelter", 620, 425);
            }
            else {
                ctx.fillText(gete(x).name + " #" + x, 620, 405);
                ctx.fillText("HP " + gete(x).HP + "/" + gete(x).maxHP, 620, 425);
            }*/



            /*if (attack_animation_progress == 0) {
                ctx.drawImage(sprites.bleu, 0, 64, 64, 64, 100, 200, 32, 32);
            }
            else {
                ctx.drawImage(images.attack_bleu, (Math.min(3, (Math.ceil(attack_animation_progress / 8)) - 1) * 64), 0, 64, 64, 100 + (attack_animation_progress * 15), 200, 32, 32);
            }

            ctx.drawImage(sprites.bleu, 0, 64, 64, 64, 140, 240, 32, 32);

            if (gete(1).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 600, 200, 32, 32) };
            if (fightselect == 1) { ctx.drawImage(images.selected32, 600, 200, 32, 32) };

            if (gete(2).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 550, 250, 32, 32) };
            if (fightselect == 2) { ctx.drawImage(images.selected32, 550, 250, 32, 32) };

            if (gete(3).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 650, 200, 32, 32) };
            if (fightselect == 3) { ctx.drawImage(images.selected32, 650, 200, 32, 32) };

            if (gete(4).HP > 0) { ctx.drawImage(sprites.bleu, 0, 192, 64, 64, 600, 250, 32, 32) };
            if (fightselect == 4) { ctx.drawImage(images.selected32, 600, 250, 32, 32) };

            if (attack_animation_progress > 0) {
                attack_animation_progress += 1;
                if (attack_animation_progress == 31) {
                    attack_animation_progress = 0;
                }
                setTimeout(scene_fight, 30);
            }*/

            put += delta;
            if (put > 99) {
                put = 0;
                updatePositions();
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
            ...fightStats1, ...fightStats2, ...fightStats3,
            ...positionControls, ...epositionControls, ...positionGrid,
        ],
    }
};