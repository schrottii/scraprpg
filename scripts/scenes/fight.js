scenes.fight = () => {

    var fightaction = 0;
    var attack_animation_progress = 0;

    var fightButtons = [];



    // Bottom rects

    fightButtons.push(controls.rect({
        anchor: [0.0, 0.0], offset: [0, 0], sizeAnchor: [1, 0.2],
        fill: "rgb(114, 95, 57)",
        alpha: 255,
    }));
    fightButtons.push(controls.rect({
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

    fightButtons.push(controls.rect({
        anchor: [0.0, 0.7], offset: [0, 0], sizeAnchor: [1, 0.3],
        fill: "rgb(186, 154, 89)",
        alpha: 255,
    }));
    fightButtons.push(controls.rect({
        anchor: [0.0, 0.9], offset: [0, 0], sizeAnchor: [1, 0.1],
        fill: "rgb(114, 95, 57)",
        alpha: 255,
    }));


    // Battle Log (Bottom Left)

    fightButtons.push(controls.rect({
        anchor: [0, 0], offset: [0, 400], sizeOffset: [200, 125],
        fill: "rgb(50, 78, 131)",
        alpha: 255,
    }));


    /*
    ctx.fillStyle = "rgb(50, 78, 131)";
    ctx.fillRect(0, 375, 200, 125);
    ctx.fillStyle = "rgb(145, 178, 245)";
    ctx.fillRect(10, 385, 180, 105);

    ctx.font = "10px NotoSans, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("Battle has started!", 20, 395);
    ctx.fillText("All actions will be logged here!", 20, 405);
    */

    return {
        // Pre-render function
        preRender(ctx, delta) {
            ctx.drawImage(images.fight_bg, 0, 100, width * scale, height);



            // Buttons

            if (fightaction == 0) {
                for (i = 0; i > fightButtons.length; i++) {
                    fightButtons[i].alpha = 255;
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

            // <- <- <- <- <- CONVERTED UP TO HERE [][][][]


            ctx.fillStyle = "rgb(131, 50, 78)";
            ctx.fillRect(600, 375, 200, 125);
            ctx.fillStyle = "rgb(245, 145, 178)";
            ctx.fillRect(610, 385, 180, 105);

            ctx.font = "12px NotoSans, sans-serif";
            ctx.fillStyle = "black";
            /*if (x == 0) {
                ctx.fillText("4 " + gete(1).name + "s!", 620, 405);
                ctx.fillText("Evil Helter Skelter", 620, 425);
            }
            else {
                ctx.fillText(gete(x).name + " #" + x, 620, 405);
                ctx.fillText("HP " + gete(x).HP + "/" + gete(x).maxHP, 620, 425);
            }*/

            ctx.fillStyle = "yellow";
            ctx.fillRect(225, 375, 75, 75);
            //ctx.drawImage(portraits[char1], 230, 380, 65, 65);
            ctx.font = "20px NotoSans, sans-serif";
            //ctx.fillText("Level " + characters[char1].level, 230, 480);
            ctx.fillStyle = "blue";
            //ctx.fillText(characters[char1].name, 240, 465);

            ctx.fillStyle = "rgb(0, 145, 40)";
            ctx.fillRect(310, 410, 80, 20);
            ctx.fillStyle = "rgb(145, 0, 105)";
            ctx.fillRect(310, 430, 80, 20);

            ctx.fillStyle = "black";
            //ctx.fillText(characters[char1].HP + "/" + characters[char1].maxHP, 310, 425);
            //ctx.fillText(characters[char1].EP + "/" + characters[char1].EP, 310, 445);

            ctx.fillStyle = "yellow";
            ctx.fillRect(395, 375, 75, 75);
            //ctx.drawImage(portraits[char2], 400, 380, 65, 65);
            ctx.font = "20px NotoSans, sans-serif";
            //ctx.fillText("Level " + characters[char1].level, 400, 480);
            ctx.fillStyle = "blue";
            //ctx.fillText(characters[char2].name, 400, 465);

            ctx.fillStyle = "rgb(0, 145, 40)";
            ctx.fillRect(480, 410, 60, 20);
            ctx.fillStyle = "rgb(145, 0, 105)";
            ctx.fillRect(480, 430, 60, 20);

            ctx.fillStyle = "black";
            //ctx.fillText(characters[char2].HP + "/" + characters[char2].maxHP, 480, 425);
            //ctx.fillText(characters[char2].EP + "/" + characters[char2].EP, 480, 445);

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

            ...fightButtons

        ],
    }
};