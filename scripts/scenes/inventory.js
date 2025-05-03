scenes.inventory = () => {
    let background = [];
    let buttons = [];
    let buttonPics = [];

    let characters = [];
    let characterNames = [];
    let characterImages = [];
    let characterBars = [];
    let emptyChars = [];
    let coolDisplays = [];
    let cl = [];

    // Background
    background.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.01], sizeAnchor: [0.98, 0.98],
        alpha: 1,
        fill: colors.topcolor
    }));

    // Buttons on the right
    for (i = 0; i < 8; i++) {
        buttons.push(controls.button({
            anchor: [0.7, 0.0325 + (i * 0.12)], sizeAnchor: [0.2, 0.085], id: i,
            alpha: 1,
            text: ["Items", "Magic", "Equipment", "Formation", "Monster Book", "Save Manager", "Settings", "Exit Menu"][i],
            onClick(args) {
                playSound("buttonClickSound");
                fadeOut(1000 / 3, true, (id = this.id) => {
                    if (id == 0) setScene(scenes.itemscene());
                    if (id == 1) setScene(scenes.magicscene());
                    if (id == 2) setScene(scenes.equipment());
                    if (id == 3) setScene(scenes.formation());
                    if (id == 4) setScene(scenes.monsterbook());
                    if (id == 5) setScene(scenes.savemanager());
                    if (id == 6) setScene(scenes.settings());
                    if (id == 7) setScene(scenes.game());
                });
            }
        }));

        buttonPics.push(controls.image({
            anchor: [0.7, 0.0325 + (0.085 / 8) + (i * 0.12)], sizeOffset: [64, 64], id: i,
            alpha: 1,
            source: ["items/potion", "fire", "inventory", "grid", "proud", "save", "gear", "flee"][i],
        }));
    }

    // Characters
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 3; j++) {
            emptyChars.push(controls.label({
                anchor: [0.16 + (0.3 * i), 0.15 + (0.3 * j)],
                align: "center", baseline: "alphabetic", fontSize: 32, fill: "black",
                text: "No Party Member",
                alpha: 0,
            }));
            cl.push(controls.rect({
                anchor: [0.01 + (0.3 * i), 0.01 + (0.3 * j)], sizeAnchor: [0.3, 0.3],
                fill: "white",
                alpha: 0,
                i: j + (i * 3),
                onClick(args) {
                    if (emptyChars[this.i].alpha == 0) fadeOut(1000 / 3, true, () => setScene(scenes.status(characterImages[this.i * 2].source)));
                }
            }));

            characterNames.push(controls.label({
                anchor: [0.06 + (0.3 * i), 0.08 + (0.3 * j)],
                align: "left", baseline: "alphabetic", fontSize: 32, fill: "black",
                text: "Bleu",
                alpha: 0,
            }));
            characterNames.push(controls.label({
                anchor: [0.075 + (0.3 * i), 0.08 + (0.3 * j)], anchorbase: 0.075 + (0.3 * i),
                align: "left", baseline: "alphabetic", fontSize: 20, fill: "black",
                text: "Lvl. 1",
                alpha: 0,
            }));
            characterImages.push(controls.image({
                anchor: [0.05 + (0.3 * i), 0.275 + (0.3 * j)], sizeOffset: [64, 64], snip: [0, 0, 32, 32], offset: [0, -64],
                source: "bleu",
                alpha: 0,
            }));
            characterImages.push(controls.image({ // effect, not element. heh
                anchor: [0.15 + (0.3 * i), 0.275 + (0.3 * j)], sizeOffset: [64, 64], offset: [0, -64],
                source: "poison",
                alpha: 0,
            }))

            characters.push(controls.rect({
                anchor: [0.01 + (0.3 * i), 0.3 + (0.3 * j)], sizeOffset: [0, 5], sizeAnchor: [0.3, 0],
                fill: colors.bottomcolor,
                alpha: 1,
            }));

            // Health
            characterBars.push(controls.rect({
                anchor: [0.06 + (i * 0.3), 0.095 + (0.3 * j)], sizeAnchor: [0.2, 0.025],
                fill: "rgb(63, 127, 63)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({ // The bg behind the bar
                anchor: [0.062 + (i * 0.3), 0.097 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(5, 51, 5)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({
                anchor: [0.062 + (i * 0.3), 0.097 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(20, 204, 20)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({ // Loss
                anchor: [0.062 + (i * 0.3), 0.097 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(200, 204, 200)",
                alpha: 0
            }))

            // Mana
            characterBars.push(controls.rect({
                anchor: [0.06 + (i * 0.3), 0.135 + (0.3 * j)], sizeAnchor: [0.2, 0.025],
                fill: "rgb(30, 109, 30)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({ // The bg behind the bar
                anchor: [0.062 + (i * 0.3), 0.137 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(51, 0, 51)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({
                anchor: [0.062 + (i * 0.3), 0.137 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(205, 0, 205)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({ // Loss
                anchor: [0.062 + (i * 0.3), 0.137 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(255, 255, 255)",
                alpha: 0
            }))

            // EXP
            characterBars.push(controls.rect({
                anchor: [0.06 + (i * 0.3), 0.175 + (0.3 * j)], sizeAnchor: [0.2, 0.025],
                fill: "rgb(154, 154, 12)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({ // The bg behind the bar
                anchor: [0.062 + (i * 0.3), 0.177 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(51, 0, 51)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({
                anchor: [0.062 + (i * 0.3), 0.177 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(205, 205, 0)",
                alpha: 0 // 1
            }))
            characterBars.push(controls.rect({ // Loss
                anchor: [0.062 + (i * 0.3), 0.177 + (0.3 * j)], sizeAnchor: [0.1960, 0.0210],
                fill: "rgb(255, 255, 255)",
                alpha: 0
            }))

            // bar... um... text
            characterBars.push(controls.label({
                anchor: [0.26 + (i * 0.3), 0.109 + (0.3 * j)],
                fill: "white", align: "right", fontSize: 20,
                text: "0",
                alpha: 0
            }))
            characterBars.push(controls.label({
                anchor: [0.26 + (i * 0.3), 0.149 + (0.3 * j)],
                fill: "white", align: "right", fontSize: 20,
                text: "5/5",
                alpha: 0
            }))
            characterBars.push(controls.label({
                anchor: [0.26 + (i * 0.3), 0.189 + (0.3 * j)],
                fill: "white", align: "right", fontSize: 20,
                text: "0/25",
                alpha: 0
            }))
        }
    }

    coolDisplays.push(controls.label({
        anchor: [0.6, 0.95],
        fill: "black", align: "right", fontSize: 20,
        text: "0",
        alpha: 1
    }))

    coolDisplays.push(controls.rect({
        anchor: [0.61, 0.01], sizeAnchor: [0.005, 0.98],
        fill: colors.bottomcolor,
        alpha: 1
    }))

    coolDisplays.push(controls.label({
        anchor: [0.02, 0.95],
        fill: "black", align: "left", fontSize: 20,
        text: "Total time spent: 0",
        alpha: 1
    }))

    coolDisplays.push(controls.rect({
        anchor: [0.305, 0.01], sizeAnchor: [0.005, 0.98],
        fill: colors.bottomcolor,
        alpha: 1
    }))

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            for (i = 0; i < game.chars.length; i++) {
                emptyChars[i].alpha = 0;

                characterNames[i * 2].text = getPlayer(i + 1).name;
                characterNames[1 + i * 2].text = "Lvl. " + getPlayer(i + 1).level;
                characterNames[1 + i * 2].anchor[0] = characterNames[1 + i * 2].anchorbase + (getPlayer(i + 1).name.length * 0.01);
                characterNames[i * 2].alpha = 1;
                characterNames[1 + i * 2].alpha = 1;

                if (getPlayer(i + 1).HP > 0) {
                    characterImages[i * 2].source = getPlayer(i + 1).name.toLowerCase();
                    characterImages[i * 2].snip = [0, 0, 32, 32];
                }
                else {
                    characterImages[i * 2].source = getPlayer(i + 1).name.toLowerCase() + "_battle";
                    characterImages[i * 2].snip = battleAnimation(getPlayer(i + 1).name.toLowerCase(), "dead");
                }
                characterImages[i * 2].alpha = 1;
                if (getPlayer(i + 1).effect[0] != "none") {
                    characterImages[1 + i * 2].source = getPlayer(i + 1).effect[0];
                    characterImages[1 + i * 2].alpha = 1;
                }

                // Barz
                if (getPlayer(1 + i).HP > 0) characterBars[2 + (i * 15)].sizeAnchor[0] = 0.1960 * (getPlayer(1 + i).HP / getStat(getPlayer(1 + i).name, "maxHP"));
                else characterBars[2 + (i * 15)].sizeAnchor[0] = 0.00001;

                if (getPlayer(1 + i).EP > 0) characterBars[6 + (i * 15)].sizeAnchor[0] = 0.1960 * ((0.00001 + getPlayer(1 + i).EP) / getStat(getPlayer(1 + i).name, "maxEP"));
                else characterBars[6 + (i * 15)].sizeAnchor[0] = 0.00001;

                if (getPlayer(1 + i).EXP > 0) characterBars[10 + (i * 15)].sizeAnchor[0] = 0.1960 * ((0.00001 + getPlayer(1 + i).EXP) / calcEXP(getPlayer(1 + i).name));
                else characterBars[10 + (i * 15)].sizeAnchor[0] = 0.00001;

                characterBars[12 + (i * 15)].text = getPlayer(1 + i).HP + "/" + getStat(getPlayer(1 + i).name, "maxHP");
                characterBars[13 + (i * 15)].text = getPlayer(1 + i).EP + "/" + getStat(getPlayer(1 + i).name, "maxEP");
                characterBars[14 + (i * 15)].text = getPlayer(1 + i).EXP + "/" + calcEXP(getPlayer(1 + i).name);


                for (j = 0; j < 15; j++) {
                    // all except loss
                    if (j != 3 && j != 7 && j != 11) characterBars[(i * 15) + j].alpha = 1;
                }

            }
            for (i = 0 + game.chars.length; i < 6; i++) {
                emptyChars[i].alpha = 1;
            }

            coolDisplays[0].text = "Current time: " + getTime();
            coolDisplays[2].text = "Total time spent: " + getTime(game.playTime, 60, 3600, true);
        },
        // Controls
        controls: [
            ...background, ...buttons, ...buttonPics, ...characters, ...characterNames, ...characterImages, ...characterBars, ...emptyChars, ...coolDisplays, ...cl,
        ],
        name: "inventory"
    }
}