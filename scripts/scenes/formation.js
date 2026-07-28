scenes["formation"] = new Scene(
    () => {
        // Init
        const macros = ["attack", "defend", "scan", "rally", "pray", "counterattack"];
        const macroTexts = ["Attack", "Defend", "Scan", "Rally", "Pray", "Counter Attack"];
        const macroUsers = ["all", "all", "all", "gau", "kokitozi", "grun"]; // special attacks
        var selectedPos = [8, 8];

        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "Formation", 
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            playSound("buttonClickSound");
            fadeOut(1000 / 3, true, () => loadScene("inventory"));
        }, { aText: { text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);

        // right side - macro manager

        createSquare("bg_rect1", 0.48, 0.15, 0.5, 0.75, colors.bottomcolor);
        createSquare("bg_rect2", 0.5, 0.17, 0.46, 0.71, colors.topcolor);

        createText("macro_header_text", 0.51, 0.21, "Macro Configuration", 
            { size: 32, color: "black", align: "left" });
        createSmartText("macro_info_text", 0.51, 0.69,
            `Macro configurations are saved in the character, meaning
that if you remove and return a character back to the party,
their Macro configuration won't be reset. If an option is
unavailable, it will redirect to Defend.`,
            { size: 20, color: "black", align: "left" });

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 3; i++) {
                createButton("macro_btn" + (i + (j * 3)), 0.515 + (j * 0.225), 0.225 + (0.15 * i), 0.2, 0.1, "button", (c) => {
                    let obj = objects[c];
                    if (obj.alpha == 1 && obj.text != "NO CHARACTER") {
                        playSound("buttonClickSound");
                        let dude = game.characters[game.chars[obj.i + (obj.j * 3)]];
                        let current = macros.indexOf(dude.macro);

                        do {
                            dude.macro = macros[current + 1] != undefined ? macros[current + 1] : macros[0];
                            objects[c + ":text"].text = macroTexts[current + 1] != undefined ? macroTexts[current + 1] : macroTexts[0];
                            current = macros.indexOf(dude.macro);
                        }
                        while (dude.name.toLowerCase() != macroUsers[current] && macroUsers[current] != "all"); // keep going while you are not allowed to use it
                    }
                }, { aText: { text: "Attack", size: 24, color: "black" } });
                objects["macro_btn" + (i + (j * 3))].i = i;
                objects["macro_btn" + (i + (j * 3))].j = j;
            }
        }

        // left side - formation manager

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
                createImage("posgrid" + j + "." + i, 0.075, 0.15, 0, 0, "grid", {
                    offset: [144 * i, 144 * j], sizeOffset: [128, 128]
                });
                createButton("poschar" + j + "." + i, 0.075, 0.15, 0, 0, "gear", (c) => {
                    let obj = objects[c];
                    if (selectedPos[0] == 8 && obj.image != "gear") {
                        // start switching
                        selectedPos = [obj.pos1, obj.pos2];
                        objects["switchText"].text = "Which character should " + game.characters[obj.image].name + " switch with?";
                        objects["switchText"].alpha = 1;
                    }
                    else if (selectedPos[0] != 8 && (selectedPos[0] != obj.pos1 || selectedPos[1] != obj.pos2)) {
                        // switch to here
                        let pre = obj.image;

                        console.log(selectedPos);
                        if (objects["poschar" + selectedPos[0] + "." + selectedPos[1]].image == "gear") return;
                        game.characters[objects["poschar" + selectedPos[0] + "." + selectedPos[1]].image].pos = [obj.pos1, obj.pos2];

                        obj.image = objects["poschar" + selectedPos[0] + "." + selectedPos[1]].image
                        obj.alpha = 1;

                        objects["switchText"].alpha = 0;

                        if (pre != "gear") {
                            objects["poschar" + selectedPos[0] + "." + selectedPos[1]].image = pre;
                            objects["poschar" + selectedPos[0] + "." + selectedPos[1]].alpha = 1;
                            game.characters[positions[obj.pos1 + 3 * obj.pos2].image].pos = [selectedPos[0], selectedPos[1]];

                        }
                        else {
                            objects["poschar" + selectedPos[0] + "." + selectedPos[1]].image = "gear";
                            objects["poschar" + selectedPos[0] + "." + selectedPos[1]].alpha = 0;
                        }

                        selectedPos = [8, 8];
                    }
                }, {
                    offset: [144 * i, 144 * j], sizeOffset: [128, 128],
                    alpha: 0, snip: [0, 0, 32, 32]
                });
                objects["poschar" + j + "." + i].pos1 = i;
                objects["poschar" + j + "." + i].pos2 = j;
            }
        }

        createText("switchText", 0.075, 0.9, "Which character should x switch with?", {
            size: 20, color: "black", align: "center",
            offset: [144 + 72, 0], alpha: 0
        });

        for (i = 0; i < 3; i++) {
            createText("posinfo" + i, 0.075, 0.125, ["Back", "Mid", "Front"][i], {
                size: 32, align: "center", color: ["blue", "pink", "red"][i],
                offset: [72 + 144 * i, 144 * 3.25]
            });

            createText("posinfob" + i, 0.075, 0.175, ["Back: " + (1 - ROWBOOST).toFixed(2) + "x STR, " + (1 + ROWBOOST).toFixed(2) + "x DEF", "Mid: 1x STR, 1x DEF", "Front: " + (1 + ROWBOOST).toFixed(2) + "x STR, " + (1 - ROWBOOST).toFixed(2) + "x DEF"][i], {
                size: 32, align: "left", color: ["blue", "pink", "red"][i],
                offset: [0, 144 * (3.5 + (i / 3))]
            });
        }

        // one-time preparations
        // apply correct macro texts
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 3; i++) {
                objects["macro_btn" + (i + (j * 3))].text = macroTexts[macros.indexOf(getPlayer((j * 3 + i) + 1).macro)];
            }
        }

        // detect two people on one tile
        for (let ch in game.chars) {
            let i = game.chars[ch];
            let thisPos = "poschar" + game.characters[i].pos[0] + "." + game.characters[i].pos[1];

            // Already occupied - 2 on the same pos?!
            if (objects[thisPos].alpha == 1) {
                let newPos = [0, 0];
                while (objects["poschar" + newPos[0] + "." + newPos[1]].alpha == 1) {
                    if (newPos[0] < 2) newPos[0] += 1;
                    else {
                        newPos[0] = 0;
                        newPos[1] += 1;
                    }
                }
                thisPos = newPos[0] + 3 * newPos[1];
            }

            // Not occupied - put me there
            objects[thisPos].image = i;
            objects[thisPos].alpha = 1;
        }

        fadeIn(1000 / 3, true);
    },
    (tick) => {
        // Loop
        for (let i = 0; i < 6; i++) {
            if (game.characters[game.chars[i]] != undefined) {
                objects["macro_btn" + i].alpha = 1;
                objects["macro_btn" + i].text = game.characters[game.chars[i]].name;
            }
            else {
                objects["macro_btn" + i].alpha = 0;
                objects["macro_btn" + i + ":text"].text = "NO CHARACTER";
            }
        }
    }
);

/*
scenes.formation = () => {
    var background = [];
    var positionGrid = [];
    var positions = [];
    var posInfos = [];
    var macroControls = [];
    var selectedPos = [8, 8];

    const macros = ["attack", "defend", "scan", "rally", "pray", "counterattack"];
    const macroTexts = ["Attack", "Defend", "Scan", "Rally", "Pray", "Counter Attack"];
    const macroUsers = ["all", "all", "all", "gau", "kokitozi", "grun"]; // special attacks

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
        text: "X",
        fill: "white"
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({
        anchor: [0.48, 0.15], sizeAnchor: [0.5, 0.75],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({
        anchor: [0.5, 0.17], sizeAnchor: [0.46, 0.71],
        alpha: 1,
        fill: colors.topcolor
    }));
    background.push(controls.label({
        anchor: [0.5, 0.19],
        fontSize: 32, fill: "black", align: "left",
        text: "Macro Configuration",
        alpha: 1,
    }));
    for (i = 0; i < 4; i++) {
        background.push(controls.label({
            anchor: [0.73, 0.69], offset: [0, 24 * i],
            fontSize: 20, fill: "black", align: "center",
            text: ["Macro configurations are saved in the character, meaning",
                "that if you remove and return a character back to the party,",
                "their Macro configuration won't be reset. If an option is",
                "unavailable, it will redirect to Defend."][i],
            alpha: 1,
        }));
    }
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Formation",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    for (j = 0; j < 2; j++) {
        for (i = 0; i < 3; i++) {
            macroControls.push(controls.button({
                anchor: [0.515 + (j * 0.225), 0.225 + (0.15 * i)], sizeAnchor: [0.2, 0.1],
                fontSize: 32, fill: "black", align: "center",
                text: "Attack",
                j: j, i: i,
                onClick(args) {
                    if (this.alpha == 1 && this.text != "NO CHARACTER") {
                        playSound("buttonClickSound");
                        let dude = game.characters[game.chars[this.i + (this.j * 3)]];
                        let current = macros.indexOf(dude.macro);

                        do {
                            dude.macro = macros[current + 1] != undefined ? macros[current + 1] : macros[0];
                            this.text = macroTexts[current + 1] != undefined ? macroTexts[current + 1] : macroTexts[0];
                            current = macros.indexOf(dude.macro);
                        }
                        while (dude.name.toLowerCase() != macroUsers[current] && macroUsers[current] != "all"); // keep going while you are not allowed to use it
                    }
                },
                alpha: 1,
            }));
            macroControls.push(controls.label({
                anchor: [0.615 + (j * 0.225), 0.2235 + (0.15 * i)],
                fontSize: 24, fill: "black", align: "center",
                text: "",
                alpha: 1,
            }));
        }
    }

    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.075, 0.15], offset: [144 * i, 144 * j], sizeOffset: [128, 128],
                source: "grid",
                alpha: 1,
            }));
            positions.push(controls.image({
                anchor: [0.075, 0.15], offset: [144 * i, 144 * j], sizeOffset: [128, 128],
                snip: [0, 0, 32, 32],
                source: "gear",
                alpha: 0,
                pos1: i,
                pos2: j,
                onClick(args) {
                    if (selectedPos[0] == 8 && this.source != "gear") {
                        selectedPos = [this.pos1, this.pos2];
                        switchText.text = "Which character should " + game.characters[this.source].name + " switch with?";
                        switchText.alpha = 1;
                    }
                    else if (selectedPos[0] != 8 && (selectedPos[0] != this.pos1 || selectedPos[1] != this.pos2)) {
                        let pre = this.source;

                        game.characters[positions[selectedPos[0] + 3 * selectedPos[1]].source].pos = [this.pos1, this.pos2];

                        this.source = positions[selectedPos[0] + 3 * selectedPos[1]].source
                        this.alpha = 1;

                        switchText.alpha = 0;

                        if (pre != "gear") {
                            positions[selectedPos[0] + 3 * selectedPos[1]].source = pre;
                            positions[selectedPos[0] + 3 * selectedPos[1]].alpha = 1;
                            game.characters[positions[this.pos1 + 3 * this.pos2].source].pos = [selectedPos[0], selectedPos[1]];

                        }
                        else {
                            positions[selectedPos[0] + 3 * selectedPos[1]].source = "gear";
                            positions[selectedPos[0] + 3 * selectedPos[1]].alpha = 0;
                        }

                        selectedPos = [8, 8];
                    }
                },
                alpha: 0,
            }));
        }
    }

    for (let ch in game.chars) {
        i = game.chars[ch];
        let thisPos = game.characters[i].pos[0] + 3 * game.characters[i].pos[1];

        // Already occupied - 2 on the same pos?!
        if (positions[thisPos].alpha == 1) {
            let newPos = [0, 0];
            while (positions[newPos[0] + 3 * newPos[1]].alpha == 1) {
                if (newPos[0] < 2) newPos[0] += 1;
                else {
                    newPos[0] = 0;
                    newPos[1] += 1;
                }
            }
            thisPos = newPos[0] + 3 * newPos[1];
        }

        // Not occupied - put me there
        positions[thisPos].source = i;
        positions[thisPos].alpha = 1;
    }

    for (i = 0; i < 3; i++) {
        posInfos.push(controls.label({
            anchor: [0.075, 0.125], offset: [72 + 144 * i, 144 * 3.25],
            fontSize: 32, fill: ["blue", "pink", "red"][i], align: "center",
            text: ["Back", "Mid", "Front"][i],
            alpha: 1,
        }));
    }

    for (i = 0; i < 3; i++) {
        posInfos.push(controls.label({
            anchor: [0.075, 0.175], offset: [0, 144 * (3.5 + (i / 3))],
            fontSize: 32, fill: ["blue", "pink", "red"][i], align: "left",
            text: ["Back: " + (1 - ROWBOOST).toFixed(2) + "x STR, " + (1 + ROWBOOST).toFixed(2) + "x DEF", "Mid: 1x STR, 1x DEF", "Front: " + (1 + ROWBOOST).toFixed(2) + "x STR, " + (1 - ROWBOOST).toFixed(2) + "x DEF"][i],
            alpha: 1,
        }));
    }

    let switchText = controls.label({
        anchor: [0.075, 0.9], offset: [144 + 72, 0],
        fontSize: 20, fill: "black", align: "center",
        text: "Which character should x switch with?",
        alpha: 0,
    });

    for (let m in macroControls) {
        macroControls[m].text = macroTexts[macros.indexOf(getPlayer(m + 1).macro)];
    }

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            for (i = 0; i < 6; i++) {
                if (game.characters[game.chars[i]] != undefined) {
                    macroControls[1 + i * 2].alpha = 1;
                    macroControls[1 + i * 2].text = game.characters[game.chars[i]].name;
                }
                else {
                    macroControls[1 + i * 2].alpha = 0;
                    macroControls[i * 2].text = "NO CHARACTER";
                }
            }
        },
        // Controls
        controls: [
            ...background,
            ...positionGrid, ...positions, ...posInfos, ...macroControls, switchText,

        ],
        name: "formation"
    }
}
*/