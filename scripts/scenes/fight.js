scenes.fight = () => {

    var fightaction = 0;
    var attack_animation_progress = 0;

    return {
        // Pre-render function
        preRender(ctx, delta) {
            ctx.drawImage(images.fight_bg, 0, 100, 800, 400);

            ctx.fillStyle = "rgb(114, 95, 57)";
            ctx.fillRect(0, 0, 800, 100);
            ctx.fillRect(0, 480, 800, 20);
            ctx.fillStyle = "rgb(186, 154, 89)";
            ctx.fillRect(0, 10, 800, 70);
            ctx.fillRect(0, 400, 800, 80);

            // Buttons

            if (fightaction == 0) {
                ctx.fillStyle = "rgb(47, 95, 191)";
                ctx.fillRect(35, 12, 96, 58);
                ctx.fillStyle = "rgb(191, 212, 255)";
                ctx.fillRect(40, 17, 86, 48);

                ctx.drawImage(images.actions, 40, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(0, 32, 102)";
                ctx.fillText("Battle", 80, 35);
                ctx.fillText("Actions", 80, 48);

                ctx.fillStyle = "rgb(47, 191, 71)";
                ctx.fillRect(145, 12, 96, 58);
                ctx.fillStyle = "rgb(191, 255, 202)";
                ctx.fillRect(150, 17, 86, 48);

                ctx.drawImage(images.inventory, 150, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(0, 102, 13)";
                ctx.fillText("Battle", 180, 35);
                ctx.fillText("Inventory", 180, 48);

                ctx.fillStyle = "rgb(191, 47, 167)";
                ctx.fillRect(255, 12, 96, 58);
                ctx.fillStyle = "rgb(255, 191, 244)";
                ctx.fillRect(260, 17, 86, 48);

                ctx.drawImage(images.techniques, 260, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(102, 0, 83)";
                ctx.fillText("Mastery", 280, 35);
                ctx.fillText("Techniques", 280, 48);

                ctx.fillStyle = "rgb(191, 143, 47)";
                ctx.fillRect(365, 12, 96, 58);
                ctx.fillStyle = "rgb(255, 234, 191)";
                ctx.fillRect(370, 17, 86, 48);

                ctx.drawImage(images.switch, 370, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(102, 68, 0)";
                ctx.fillText("Switch", 400, 35);
                ctx.fillText("Scrapper", 400, 48);

                ctx.fillStyle = "rgb(119, 119, 119)";
                ctx.fillRect(475, 12, 96, 58);
                ctx.fillStyle = "rgb(223, 223, 223)";
                ctx.fillRect(480, 17, 86, 48);

                ctx.drawImage(images.flee, 480, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(102, 102, 102)";
                ctx.fillText("Flee", 530, 35);
                ctx.fillText("Fight", 530, 48);
            }
            else if (fightaction == 1) {
                ctx.fillStyle = "rgb(47, 95, 191)";
                ctx.fillRect(145, 12, 96, 58);
                ctx.fillStyle = "rgb(191, 212, 255)";
                ctx.fillRect(150, 17, 86, 48);

                ctx.drawImage(images.actions, 150, 17, 48, 48);
                ctx.font = "12px NotoSans, sans-serif";
                ctx.fillStyle = "rgb(0, 32, 102)";
                ctx.fillText("Attack", 180, 35);
            }

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

            ctx.fillStyle = "rgb(50, 78, 131)";
            ctx.fillRect(0, 375, 200, 125);
            ctx.fillStyle = "rgb(145, 178, 245)";
            ctx.fillRect(10, 385, 180, 105);

            ctx.font = "10px NotoSans, sans-serif";
            ctx.fillStyle = "black";
            ctx.fillText("Battle has started!", 20, 395);
            ctx.fillText("All actions will be logged here!", 20, 405);

            ctx.fillStyle = "rgb(131, 50, 78)";
            ctx.fillRect(600, 375, 200, 125);
            ctx.fillStyle = "rgb(245, 145, 178)";
            ctx.fillRect(610, 385, 180, 105);

            ctx.font = "12px NotoSans, sans-serif";
            ctx.fillStyle = "black";
            if (x == 0) {
                ctx.fillText("4 " + gete(1).name + "s!", 620, 405);
                ctx.fillText("Evil Helter Skelter", 620, 425);
            }
            else {
                ctx.fillText(gete(x).name + " #" + x, 620, 405);
                ctx.fillText("HP " + gete(x).HP + "/" + gete(x).maxHP, 620, 425);
            }

            ctx.fillStyle = "yellow";
            ctx.fillRect(225, 375, 75, 75);
            ctx.drawImage(portraits[char1], 230, 380, 65, 65);
            ctx.font = "20px NotoSans, sans-serif";
            ctx.fillText("Level " + characters[char1].level, 230, 480);
            ctx.fillStyle = "blue";
            ctx.fillText(characters[char1].name, 240, 465);

            ctx.fillStyle = "rgb(0, 145, 40)";
            ctx.fillRect(310, 410, 80, 20);
            ctx.fillStyle = "rgb(145, 0, 105)";
            ctx.fillRect(310, 430, 80, 20);

            ctx.fillStyle = "black";
            ctx.fillText(characters[char1].HP + "/" + characters[char1].maxHP, 310, 425);
            ctx.fillText(characters[char1].EP + "/" + characters[char1].EP, 310, 445);

            ctx.fillStyle = "yellow";
            ctx.fillRect(395, 375, 75, 75);
            ctx.drawImage(portraits[char2], 400, 380, 65, 65);
            ctx.font = "20px NotoSans, sans-serif";
            ctx.fillText("Level " + characters[char1].level, 400, 480);
            ctx.fillStyle = "blue";
            ctx.fillText(characters[char2].name, 400, 465);

            ctx.fillStyle = "rgb(0, 145, 40)";
            ctx.fillRect(480, 410, 60, 20);
            ctx.fillStyle = "rgb(145, 0, 105)";
            ctx.fillRect(480, 430, 60, 20);

            ctx.fillStyle = "black";
            ctx.fillText(characters[char2].HP + "/" + characters[char2].maxHP, 480, 425);
            ctx.fillText(characters[char2].EP + "/" + characters[char2].EP, 480, 445);

            if (attack_animation_progress == 0) {
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
            // things
        ],
    }
};