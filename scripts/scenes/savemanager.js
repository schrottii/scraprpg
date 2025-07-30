function blinkButton(who, condition) {
    addAnimator(function (t) {
        who.fillTop = t % 600 > 300 ? "red" : colors.buttontop;
        who.fillBottom = t % 600 > 300 ? "darkred" : colors.buttonbottom;

        if (condition()) {
            who.fillTop = colors.buttontop;
            who.fillBottom = colors.buttonbottom;
            return true;
        }
    });
}

let toImportTo = -1;

function loadSaveFromFile() {
    if (toImportTo == -1) return false;

    let file = document.getElementById("myFile2").files[0];

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        let result = e.target.result;

        // unwrap the file
        result = result.replace("svmgnaer", "=");
        result = atob(result);
        result = JSON.parse(result);

        // save it onto that slot
        let prevnr = saveNR;
        saveNR = toImportTo;
        saveGame();
        saveNR = prevnr;
    }
    hideSelect2();
}


function hideSelect2() {
    let dif = document.querySelector("div.loadiv2");
    dif.style.display = "none";

    let canvas = document.querySelector("canvas");
    canvas.style.display = "block";
}

scenes.savemanager = () => {
    let background = [];
    let saveButtons = [];
    let saveTexts = [];
    let buttons = [];

    var mode = "none";

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
            fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
        },
        text: "X"
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Save Manager",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));
    background.push(controls.label({ // 5
        anchor: [0.305, 0.06],
        text: "",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    background.push(controls.button({
        anchor: [0.5, 0.01], sizeAnchor: [0.1, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            mode = "export";
            blinkButton(background[6], () => mode != "export");
        },
        text: "Export"
    }));
    background.push(controls.button({
        anchor: [0.61, 0.01], sizeAnchor: [0.1, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            mode = "import";
            blinkButton(background[7], () => mode != "import");
        },
        text: "Import"
    }));

    // Generate our lovely buttons
    for (let a = 0; a < 3; a++) {
        saveButtons.push(controls.button({
            anchor: [0.1, 0.125 + (a * 0.25)], sizeAnchor: [0.8, 0.225],
            text: "",
            onClick(args) {
                // main save button function
                playSound("buttonClickSound");
                if (mode == "save") {
                    let prevnr = saveNR;
                    saveNR = a;
                    saveGame();
                    saveNR = prevnr;
                }
                if (mode == "load") {
                    if (localStorage["SRPG" + a] == "null") return false; // don't load if it's empty xd

                    saveNR = a; // loads the save
                    loadGame(a);

                    fadeOut(1000 / 3, true, (id = this.id) => {
                        setScene(scenes.game());
                    });
                }
                if (mode == "delete") {
                    localStorage["SRPG" + a] = "null";
                    mode = "none";
                }
                if (mode == "export") {
                    if (localStorage["SRPG" + a] == "null") return false; // don't export if it's empty xd

                    let exporter = localStorage["SRPG" + a];

                    if (confirm("Do you want to export this save with " + getTime(exporter.stats.playTime, 60, 3600, true) + " play time?")) {
                        exporter = JSON.stringify(exporter);
                        exporter = btoa(exporter);
                        exporter = exporter.replace("=", "svmgnaer");

                        var temporaryFile = document.createElement('a');
                        temporaryFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exporter));
                        temporaryFile.setAttribute('download', "SRPG" + (a + 1) + ".txt");

                        temporaryFile.style.display = 'none';
                        document.body.appendChild(temporaryFile);

                        temporaryFile.click();

                        document.body.removeChild(temporaryFile);
                    }
                }
                if (mode == "import") {
                    // done via loadiv2 in index.html and the functions at the top
                    toImportTo = a;

                    let dif = document.querySelector("div.loadiv2");
                    dif.style.display = "block";

                    let canvas = document.querySelector("canvas");
                    canvas.style.display = "none";
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
                anchor: [0.225 + (0.225 * i), 0.225 + (a * 0.25)],
                align: "left", fontSize: 32, fill: "black",
                text: " ",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [0.225 + (0.225 * i), 0.3 + (a * 0.25)],
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

        saveTexts.push(controls.image({
            anchor: [0.05, 0.225 + (a * 0.25)],
            sizeOffset: [64, 64],
            source: "gear", alpha: 0, a: a,
            onClick(args) { // Change the image when clicked
                if (saveNR == this.a) {
                    if (game.pfp == 5) { // To avoid changing to a pic that does not exist
                        game.pfp = 1;
                    }
                    else {
                        game.pfp += 1;
                    }
                    saveGame();
                }
            }
        }));
    }

    // Buttons
    buttons.push(controls.label({
        anchor: [0.975, 0.8975],
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
            blinkButton(buttons[1], () => mode != "save");
        }
    }));
    buttons.push(controls.label({
        anchor: [0.15, 0.95],
        align: "center", fontSize: 20, fill: "black",
        text: "Save",
        alpha: 1,
    }));
    buttons.push(controls.button({ // Load
        anchor: [0.3, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            mode = "load";
            blinkButton(buttons[3], () => mode != "load");
        }
    }));
    buttons.push(controls.label({
        anchor: [0.35, 0.95],
        align: "center", fontSize: 20, fill: "black",
        text: "Load",
        alpha: 1,
    }));
    buttons.push(controls.button({ // Delete
        anchor: [0.5, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            mode = "delete";
            blinkButton(buttons[5], () => mode != "delete");
        }
    }));
    buttons.push(controls.label({
        anchor: [0.55, 0.95],
        align: "center", fontSize: 20, fill: "black",
        text: "Delete",
        alpha: 1,
    }));
    /*
    buttons.push(controls.button({ // Auto
        anchor: [0.7, 0.86], sizeAnchor: [0.1, 0.075],
        alpha: 1,
        fill: "black",
        text: " ",
        onClick(args) {
            saveNR = 3; // load auto save immediately
            loadGame(3);
        }
    }));
    buttons.push(controls.label({
        anchor: [0.75, 0.95],
        align: "center", fontSize: 20, fill: "black",
        text: "Load auto save",
        alpha: 1,
    }));
    */
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
    /*
    buttons.push(controls.image({ // Auto
        anchor: [0.75, 0.86], sizeOffset: [64, 64], offset: [-32, 0],
        source: "autosave",
        alpha: 1,
    }));
    */

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            background[5].text = "Current save: " + ["1", "2", "3", "Auto"][saveNR];

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

                    let amount = 16;

                    saveButtons[a].text = "";
                    saveTexts[2 + (a * amount)].text = getPlayer(1, thisSave).name;
                    if (thisSave.chars.length > 1) saveTexts[3 + (a * amount)].text = getPlayer(2, thisSave).name;
                    saveTexts[4 + (a * amount)].text = "Lvl. " + getPlayer(1, thisSave).level;
                    if (thisSave.chars.length > 1) saveTexts[5 + (a * amount)].text = "Lvl. " + getPlayer(2, thisSave).level;
                    if (thisSave.chars.length > 2) saveTexts[6 + (a * amount)].text = getPlayer(3, thisSave).name;
                    if (thisSave.chars.length > 3) saveTexts[7 + (a * amount)].text = getPlayer(4, thisSave).name;
                    if (thisSave.chars.length > 2) saveTexts[8 + (a * amount)].text = "Lvl. " + getPlayer(3, thisSave).level;
                    if (thisSave.chars.length > 3) saveTexts[9 + (a * amount)].text = "Lvl. " + getPlayer(4, thisSave).level;

                    saveTexts[10 + (a * amount)].text = getTime(thisSave.stats.playTime, 60, 3600);

                    saveTexts[13 + (a * amount)].text = formatNumber(thisSave.wrenches);
                    saveTexts[14 + (a * amount)].text = formatNumber(thisSave.bricks);

                    saveTexts[15 + (a * amount)].source = "saveimage" + thisSave.pfp;

                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 1;
                    }
                }
                else { // Save does not exist :(
                    saveButtons[a].text = "Empty";

                    let amount = 16;
                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 0;
                    }
                }
            }

            // current mode text
            if (mode == "none") buttons[0].text = "No mode";
            if (mode == "save") buttons[0].text = "Mode: Save";
            if (mode == "load") buttons[0].text = "Mode: Load";
            if (mode == "delete") buttons[0].text = "Mode: Delete";
            if (mode == "export") buttons[0].text = "Mode: Export";
            if (mode == "import") buttons[0].text = "Mode: Import";
        },
        // Controls
        controls: [
            ...background, ...saveButtons, ...saveTexts, ...buttons,
        ],
        name: "saves"
    }
}