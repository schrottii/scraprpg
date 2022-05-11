scenes.fight = () => {

    var fightaction = 0;
    var attack_animation_progress = 0;
    var put = 0; //positions update time

    var fightBgRects = [];
    var fightButtons = [];
    var fightLogComponents = [];
    var fightOverview = [];
    var fightPortraits = [];
    var fightStats1 = [];
    var fightStats2 = [];
    var fightStats3 = [];

    var positionControls = [];
    var epositionControls = [];

    var fightlog = [
        "",
        "Battle has started!",
        "All actions will",
        "be logged here!",
    ];

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
            fightlog.push(prompt("Put what?"));
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
            setScene(scenes.game());
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
        text: game.characters.bleu.name,
        alpha: 255,
    }));

    fightStats1.push(controls.label({
        anchor: [0.2, 0.7], offset: [74, 58],
        fontSize: 20, fill: "yellow", align: "center",
        text: "Level: " + game.characters.bleu.level,
        alpha: 255,
    }));

    fightStats1.push(controls.label({
        anchor: [0.42, 0.7], offset: [74, 38],
        fontSize: 20, fill: "blue", align: "center",
        text: game.characters.corelle.name,
        alpha: 255,
    }));

    fightStats1.push(controls.label({
        anchor: [0.42, 0.7], offset: [74, 58],
        fontSize: 20, fill: "yellow", align: "center",
        text: "Level: " + game.characters.corelle.level,
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
        text: game.characters["bleu"].HP + "/" + game.characters["bleu"].maxHP,
        alpha: 255,
    }));

    fightStats2.push(controls.label({
        anchor: [0.26, 0.728], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: game.characters["bleu"].EP + "/" + game.characters["bleu"].EP,
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
        text: game.characters["bleu"].HP + "/" + game.characters["bleu"].maxHP,
        alpha: 255,
    }));

    fightStats2.push(controls.label({
        anchor: [0.48, 0.728], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: game.characters["bleu"].EP + "/" + game.characters["bleu"].EP,
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
        text: "HP: " + game.characters["bleu"].HP + "/" + game.characters["bleu"].maxHP,
        alpha: 0,
    }));

    fightStats3.push(controls.label({
        anchor: [0.32, 0.628], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: "EP: " + game.characters["bleu"].EP + "/" + game.characters["bleu"].EP,
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
        text: "HP: " + game.characters["bleu"].HP + "/" + game.characters["bleu"].maxHP,
        alpha: 0,
    }));

    fightStats3.push(controls.label({
        anchor: [0.54, 0.628], offset: [42, 98],
        fontSize: 14, fill: "black", align: "center",
        text: "EP: " + game.characters["bleu"].EP + "/" + game.characters["bleu"].EP,
        alpha: 0,
    }));




    // Positions

    // This huge var stores the 3x3 positions and everything about their current state
    // usage example: positions[1][1].occupied (that's the middle middle tile)
    var positions =
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

    // Friendly pos (left)
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionControls.push(controls.image({
                anchor: [0.025, 0.25], offset: [72 * i, 72 * j], sizeOffset: [64, 64],
                source: "gear",
                alpha: 255,
                pos1: i,
                pos2: j,
                onClick(args) {
                    positions[this.pos1][this.pos2].occupied = "selected";
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
                pos1: i,
                pos2: j,
                onClick(args) {
                    epositions[this.pos1][this.pos2].occupied = "selected";
                }
            }));
        }
    }

    function updatePositions() {

        for (j = 0; j < 3; j++) {
            for (i = 0; i < 3; i++) {
                if (positions[i]) {
                    if (positions[i][j].occupied != false) {
                        positionControls[i + (j * 3)].source = positions[i][j].occupied;
                    }
                }
                else {
                    positionControls[i + (j * 3)].source = "gear";
                }

                // enemies! enemies!
                if (epositions[i]) {
                    if (epositions[i][j].occupied != false) {
                        epositionControls[i + (j * 3)].source = epositions[i][j].occupied;
                    }
                }
                else {
                    epositionControls[i + (j * 3)].source = "gear";
                }
            }
        }
    }

    return {
        // Pre-render function
        preRender(ctx, delta) {
            ctx.drawImage(images.fight_bg, 0, 100, width * scale, height);



            // Buttons

            if (fightaction == 0) {
                for (i = 0; i < fightButtons.length; i++) {
                    fightButtons[i].alpha = 255;
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
            
            /*else if (fightaction == 1) {
                ctx.fillStyle = "rgb(47, 95, 191)";
                ctx.fillRect(145, 12, 96, 58);
                ctx.fillStyle = "rgb(191, 212, 255)";
                ctx.fillRect(150, 17, 86, 48);

                ctx.drawImage(images.actions, 150, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(0, 32, 102)";
                ctx.fillText("Attack", 180, 35);
            }*/


            /*
            ctx.fillStyle = "black";
            ctx.font = "16px NotoSans, sans-serif";
            ctx.fillStyle = "lightblue";
        
            ctx.fillText(characters[char1].name, 612, 30);
            ctx.fillText(characters[char2].name, 612, 58);
        
            ctx.font = "12px NotoSans, sans-serif";
            ctx.fillStyle = "green";
        
            ctx.fillText("HP: " + characters[char1].HP + "/" + characters[char1].maxHP, 612, 44);
            ctx.fillText("HP: " + characters[char2].HP + "/" + characters[char2].maxHP, 612, 72);
            */

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

            // <- <- <- <- <- CONVERTED UP TO HERE [][][][]

            

            


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
            
            /*controls.base({
                anchor: [0, 0], sizeAnchor: [1, 1],
                onClick() {
                    state = "menu";
                    this.clickthrough = true;
                    addAnimator(function (t) {

                        gameIcon.anchor[1] = .4 - .5 * Math.min(t / 800, 1) ** 4;
                        gameIcon.offset[1] = -200 - 100 * Math.min(t / 800, 1) ** 4;
                        contLabel.anchor[1] = .6 + .5 * Math.min(t / 800, 1) ** 4;
                        contLabel.alpha = (Math.cos(t / 20) + 1) / 2;
                        infoLabel.offset[1] = verLabel.offset[1] = -12 + 120 * (t / 800) ** 4;

                        saveButtons[0].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);
                        saveButtons[1].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 850) / 800, 1), 0)) ** 4);
                        saveButtons[2].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

                        saveImages[0].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);
                        saveImages[1].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 850) / 800, 1), 0)) ** 4);
                        saveImages[2].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

                        deleteButton.anchor[0] = -.8 + (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);
                        optionButton.anchor[0] = -.2 + (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);

                        if (t > 3000) {
                            return true;
                        }
                        return false;
                    })
                }
            }),*/

            ...fightBgRects,
            ...fightButtons,
            ...fightLogComponents,
            ...fightOverview,
            ...fightPortraits,
            ...fightStats1, ...fightStats2, ...fightStats3,
            ...positionControls, ...epositionControls
        ],
    }
};