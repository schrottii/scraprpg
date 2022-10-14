scenes.savemanager = () => {
    let background = [];
    let saveButtons = [];
    let saveTexts = [];
    let buttons = [];

    var mode = 0;

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
    background.push(controls.button({
        anchor: [0.89, 0.01], sizeAnchor: [0.1, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(500, true, () => setScene(scenes.inventory()));
        },
        text: ">",
        fill: "white"
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));

    // Generate our lovely buttons
    for (let a = 0; a < 3; a++) {
        saveButtons.push(controls.button({
            anchor: [0.1, 0.125 + (a * 0.25)], sizeAnchor: [0.8, 0.225],
            text: "",
            onClick(args) {
                playSound("buttonClickSound");
                if (mode == "save") {
                    saveNR = a;
                    saveGame();
                }
                if (mode == "load") {
                    saveNR = a;
                    loadGame(a);
                }
                if (mode == "delete") {
                    saveNR = a;
                    localStorage["SRPG" + saveNR] = "null";
                    mode = 0;
                }
            }
        }))

        saveTexts.push(controls.label({
            anchor: [0.12, 0.15 + (a * 0.25)],
            align: "left", fontSize: 48, fill: "black",
            text: "Save " + (a + 1),
            alpha: 1,
        }));
        saveTexts.push(controls.label({
            anchor: [0.25, 0.15 + (a * 0.25)],
            align: "left", fontSize: 32, fill: "black",
            text: "Chapter I: The Beginning",
            alpha: 1,
        }));

        for (i = 0; i < 2; i++) {
            saveTexts.push(controls.label({
                anchor: [0.12 + (0.225 * i), 0.225 + (a * 0.25)],
                align: "left", fontSize: 32, fill: "black",
                text: " ",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [0.12 + (0.225 * i), 0.3 + (a * 0.25)],
                align: "left", fontSize: 32, fill: "black",
                text: " ",
                alpha: 1,
            }));

            saveTexts.push(controls.label({
                anchor: [0.25 + (0.225 * i), 0.225 + (a * 0.25)],
                align: "left", fontSize: 32, fill: "black",
                text: " ",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [0.25 + (0.225 * i), 0.3 + (a * 0.25)],
                align: "left", fontSize: 32, fill: "black",
                text: " ",
                alpha: 1,
            }));
        }
        saveTexts.push(controls.label({
            anchor: [0.875, 0.15 + (a * 0.25)],
            align: "right", fontSize: 32, fill: "black",
            text: "24:31:02",
            alpha: 1,
        }));

        saveTexts.push(controls.image({
            anchor: [0.55, 0.225 + (a * 0.25)], sizeOffset: [32, 32], offset: [0, -16],
            source: "wrench",
            alpha: 1,
        }));
        saveTexts.push(controls.image({
            anchor: [0.55, 0.3 + (a * 0.25)], sizeOffset: [32, 32], offset: [0, -16],
            source: "brick",
            alpha: 1,
        }));

        saveTexts.push(controls.label({
            anchor: [0.55, 0.225 + (a * 0.25)], offset: [40, 0],
            align: "left", fontSize: 32, fill: "black",
            text: "0",
            alpha: 1,
        }));
        saveTexts.push(controls.label({
            anchor: [0.55, 0.3 + (a * 0.25)], offset: [40, 0],
            align: "left", fontSize: 32, fill: "black",
            text: "0",
            alpha: 1,
        }));
    }

    // Buttons
    buttons.push(controls.label({
        anchor: [0.95, 0.8975],
        align: "right", fontSize: 32, fill: "black",
        text: "Mode: None",
        alpha: 1,
    }));

    buttons.push(controls.button({ // Save
        anchor: [0.1, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            mode = "save";
        }
    }));
    buttons.push(controls.button({ // Load
        anchor: [0.3, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            mode = "load";
        }
    }));
    buttons.push(controls.button({ // Delete
        anchor: [0.5, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            mode = "delete";
        }
    }));
    buttons.push(controls.button({ // Auto
        anchor: [0.7, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            saveNR = 3; // Auto save
            loadGame(3);
        }
    }));

    buttons.push(controls.image({ // Save
        anchor: [0.15, 0.86], sizeOffset: [64, 64], offset: [-32, 0],
        source: "save",
        alpha: 1,
    }));
    buttons.push(controls.image({ // Load
        anchor: [0.35, 0.86], sizeOffset: [64, 64], offset: [-32, 0],
        source: "load",
        alpha: 1,
    }));
    buttons.push(controls.image({ // Delete
        anchor: [0.55, 0.86], sizeOffset: [64, 64], offset: [-32, 0],
        source: "delete",
        alpha: 1,
    }));
    buttons.push(controls.image({ // Auto
        anchor: [0.75, 0.86], sizeOffset: [64, 64], offset: [-32, 0],
        source: "autosave",
        alpha: 1,
    }));

    fadeIn(500, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            // Update buttons
            for (let a = 0; a < 3; a++) {
                var tempsaveNR = a;
                if (localStorage.getItem("SRPG" + tempsaveNR) != undefined && localStorage.getItem("SRPG" + tempsaveNR) != "null") { // It exists
                    try {
                        var thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                    }
                    catch (e) {
                        saveGame();
                        var thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                    }
                    let amount = 15;
                    saveTexts[2 + (a * amount)].text = getPlayer(1, thisSave).name;
                    if (thisSave.chars.length > 1) saveTexts[3 + (a * amount)].text = getPlayer(2, thisSave).name;
                    saveTexts[4 + (a * amount)].text = "Lvl. " + getPlayer(1, thisSave).level;
                    if (thisSave.chars.length > 1) saveTexts[5 + (a * amount)].text = "Lvl. " + getPlayer(2, thisSave).level;
                    if (thisSave.chars.length > 2) saveTexts[6 + (a * amount)].text = getPlayer(3, thisSave).name;
                    if (thisSave.chars.length > 3) saveTexts[7 + (a * amount)].text = getPlayer(4, thisSave).name;
                    if (thisSave.chars.length > 2) saveTexts[8 + (a * amount)].text = "Lvl. " + getPlayer(3, thisSave).level;
                    if (thisSave.chars.length > 3) saveTexts[9 + (a * amount)].text = "Lvl. " + getPlayer(4, thisSave).level;

                    saveTexts[10 + (a * amount)].text = getTime(thisSave.playTime, 60, 3600);

                    saveTexts[13 + (a * amount)].text = formatNumber(thisSave.wrenches);
                    saveTexts[14 + (a * amount)].text = formatNumber(thisSave.bricks);

                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 1;
                    }
                }
                else { // Save does not exist :(
                    saveButtons[a].text = "Empty";
                    let amount = 15;
                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 0;
                    }
                }
            }
            if (mode == "save") buttons[0].text = "Mode: Save";
            if (mode == "load") buttons[0].text = "Mode: Load";
            if (mode == "delete") buttons[0].text = "Mode: Delete";
        },
        // Controls
        controls: [
            ...background, ...saveButtons, ...saveTexts, ...buttons,
        ],
        name: "saves"
    }
}