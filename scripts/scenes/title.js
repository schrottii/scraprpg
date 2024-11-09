scenes.title = () => {
    let state = "intro";

    let particles = [];
    let saveTexts = [];
    let hiddn = false;

    let gameIcon = controls.image({
        anchor: [.5, .4], offset: [-277.5, -200], sizeOffset: [555, 300],
        alpha: 0,
        source: "gameicon",
    });
    let contLabel = controls.label({
        anchor: [.5, .6], offset: [0, 75],
        fontSize: 16, alpha: 0,
        text: "Click anywhere to continue...",
        outline: "red", outlineAnchor: 0.001,
    });
    let infoLabel = controls.label({
        anchor: [.02, .98], offset: [5, -12],
        align: "left", baseline: "alphabetic", fontSize: 16, fill: "#7f7f7f", alpha: 0,
        text: "©2024 Toast Technology Team / Schrottii",
    });
    let verLabel = controls.label({
        anchor: [.98, .98], offset: [-5, -12],
        align: "right", baseline: "alphabetic", fontSize: 16, fill: "#7f7f7f", alpha: 0,
        text: "Phase 2",
    });

    let settingsSaveText = controls.label({
        anchor: [.04, .98], offset: [12, -12],
        fontSize: 16, text: "Settings saved!", alpha: 0,
    });

    function loadSave(id) {
        fadeOverlay.clickthrough = false;
        for (st = 0; st < saveTexts.length; st++) {
            saveTexts[st].defoff = saveTexts[st].offset[1] - (130 * (Math.floor(st / 15))) + 240;
        }

        addAnimator(function (t) {
            for (let a = 0; a < 4; a++) {
                if (a == id) {
                    saveButtons[a].offset[1] = (-160 + 130 * a) * Math.max(1 - t / 600, 0) ** 2 - 60;
                    saveImages[a].offset[1] = (-160 + 130 * a) * Math.max(1 - t / 600, 0) ** 2 - 60;
                } else {
                    saveButtons[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                    saveButtons[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                    saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                    saveImages[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                }
                for (st = 0 + (15 * a); st < 15 + (15 * a); st++) {
                    saveTexts[st].anchor[1] = saveButtons[a].anchor[1];
                    saveTexts[st].offset[1] = saveTexts[st].defoff + saveButtons[a].offset[1];
                }
            }
            //musicPlayer.volume = 0.5 * Math.max(1 - t / 4000, 0) ** 2;
            fadeOverlay.alpha = 1 - (1 - t / 4000) ** 2;
            deleteButton.offset[1] = optionButton.offset[1] =
                (70 + 130 * (2 - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
            deleteButton.anchor[1] = optionButton.anchor[1] =
                .5 + ((1 - Math.max(1 - t / 600, 0)) ** 2);
            if (t > 4000) {
                setScene(scenes.game());
                return true;
            }
            return false;
        })
    }

    function loadOptions() {
        fadeOverlay.clickthrough = true;
        addAnimator(function (t) {
            for (let a = 0; a < 4; a++) {
                id = a;
                saveButtons[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                saveButtons[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                saveImages[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);

                // Bricks and Wrenches
                saveTexts[11 + a * 15].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                saveTexts[11 + a * 15].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                saveTexts[12 + a * 15].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                saveTexts[12 + a * 15].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
            }

            if (t > 599) {
                fadeOut(400, true, () => setScene(scenes.settings()));
                return true;
            }
            return false;
        });
    };

    function hideOptions() {
        fadeOverlay.clickthrough = true;
        addAnimator(function (t) {
            for (let a = 0; a < 4; a++) {
                id = a;
                saveButtons[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(t / 600, 0) ** 2);
                saveButtons[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(t / 600, 0)) ** 2);
                saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(t / 600, 0) ** 2);
                saveImages[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(t / 600, 0)) ** 2);
            }
            if (t > 599) {
                return true;
            }
            return false;
        });
        addAnimator(function (t) {
            settingsSaveText.alpha = t / 10;
            if (t > 2500) {
                settingsSaveText.alpha = 0;
                return true;
            }
            return false;
        })
    };


    let saveButtons = [];
    let saveImages = [];
    let mode = 0;

    for (let a = 0; a < 4; a++) {
        saveButtons.push(controls.button({
            anchor: [1.2, .3], offset: [0, -220 + 130 * a], sizeAnchor: [.5, 0], sizeOffset: [120, 120], clickthrough: false,
            text: " ",
            onClick(args) {
                if (mode == 0) {
                    saveNR = a;
                    playSound("titletransition");
                    stopMusic();
                    loadGame(a);
                    loadSave(a);
                }
                else if (mode == 1) {
                    saveNR = a;
                    localStorage["SRPG" + saveNR] = "null";
                    mode = 0;
                }
            }
        }))
        saveTexts.push(controls.label({
            anchor: [1.2, 0.3], offset: [72, -188 + 130 * a], defanch: 0.2,
            align: "left", fontSize: 48, fill: "black",
            text: "Save " + (a + 1),
            alpha: 1,
        }));
        saveTexts.push(controls.label({
            anchor: [1.2, 0.3], offset: [120, -188 + 130 * a], defanch: 0.7,
            align: "right", fontSize: 24, fill: "black",
            text: "Chapter I: The Beginning",
            alpha: 1,
        }));

        for (i = 0; i < 2; i++) {
            // Names 1 2
            saveTexts.push(controls.label({
                anchor: [1.2 + (0.225 * i), 0.305], offset: [0, -146 + 130 * a], defanch: 0.205 + (0.125 * i),
                align: "left", fontSize: 20, fill: "black",
                text: "",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [1.2 + (0.225 * i), 0.305], offset: [0, -120 + 130 * a], defanch: 0.205 + (0.125 * i),
                align: "left", fontSize: 20, fill: "black",
                text: "",
                alpha: 1,
            }));
            // Levels 1 2
            saveTexts.push(controls.label({
                anchor: [1.2 + (0.225 * i), 0.305], offset: [0, -146 + 130 * a], defanch: 0.33 + (0.125 * i),
                align: "right", fontSize: 16, fill: "black",
                text: "",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [1.2 + (0.225 * i), 0.305], offset: [0, -120 + 130 * a], defanch: 0.33 + (0.125 * i),
                align: "right", fontSize: 16, fill: "black",
                text: "",
                alpha: 1,
            }));
        }
        saveTexts.push(controls.label({
            anchor: [1.2, 0.3], offset: [120, -120 + 130 * a], defanch: 0.7,
            align: "right", fontSize: 32, fill: "black",
            text: "24:31:02",
            alpha: 1,
        }));

        saveTexts.push(controls.image({
            anchor: [1.2, 0.3], sizeOffset: [32, 32], offset: [0, -164 + 130 * a], defanch: 0.55,
            source: "wrench",
            alpha: 1,
        }));
        saveTexts.push(controls.image({
            anchor: [1.2, 0.3], sizeOffset: [32, 32], offset: [0, -132 + 130 * a], defanch: 0.55,
            source: "brick",
            alpha: 1,
        }));

        saveTexts.push(controls.label({
            anchor: [1.2, 0.3], offset: [40, -150 + 130 * a], defanch: 0.55,
            align: "left", fontSize: 32, fill: "black",
            text: "0",
            alpha: 1,
        }));
        saveTexts.push(controls.label({
            anchor: [1.2, 0.3], offset: [40, -116 + 130 * a], defanch: 0.55,
            align: "left", fontSize: 32, fill: "black",
            text: "0",
            alpha: 1,
        }));

        saveImages.push(controls.image({
            anchor: [1.2, .3], offset: [0, -220 + 130 * a], sizeAnchor: [0, 0], sizeOffset: [60, 60],
            source: "saveimage" + Math.ceil(Math.random() * 5), alpha: 0,
            isPressed: false,
            onDown(args) {
                saveButtons[a].clickthrough = true; // To avoid savegame loading when changing image (God tier code)
            },
            onClick(args) { // Change the image when clicked
                saveNR = a;
                stopMusic();
                loadGame(saveNR);
                if (game.pfp == 5) { // To avoid changing to a pic that does not exist
                    game.pfp = 1;
                }
                else {
                    game.pfp += 1;
                }
                saveGame();
            }
        }))
    }

    saveButtons[3].fillTop = "#54d4ff";
    saveButtons[3].fillBottom = "#4fa1bc";

    let deleteButton = controls.button({
        anchor: [-.8, .5], offset: [0, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Delete",
        onClick(args) {
            playSound("buttonClickSound");
            if (mode == 1) {
                mode = 0;
                for (i = 0; i < 3; i++) {
                    saveButtons[i].fillTop = colors.buttontop;
                    saveButtons[i].fillBottom = colors.buttonbottom;
                }
                saveButtons[3].fillTop = "#54d4ff";
                saveButtons[3].fillBottom = "#4fa1bc";
            }
            else if (mode == 0) {
                mode = 1;
                addAnimator(function (t) {
                    if (mode != 1) {
                        for (i = 0; i < 3; i++) {
                            saveButtons[i].fillTop = colors.buttontop;
                            saveButtons[i].fillBottom = colors.buttonbottom;
                        }
                        saveButtons[3].fillTop = "#54d4ff";
                        saveButtons[3].fillBottom = "#4fa1bc";
                        return true;
                    }
                    for (i = 0; i < 3; i++) {
                        saveButtons[i].fillTop = t % 800 > 400 ? "red" : colors.buttontop;
                        saveButtons[i].fillBottom = t % 800 > 400 ? "darkred" : colors.buttonbottom;
                    }
                    saveButtons[3].fillTop = t % 800 > 400 ? "purple" : "#54d4ff";
                    saveButtons[3].fillBottom = t % 800 > 400 ? "rebeccapurple" : "#4fa1bc";
                    return false;
                });
            }
        }
    });
    let optionButton = controls.button({
        anchor: [-.2, .5], offset: [-30, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Options",
        onClick(args) {
            playSound("buttonClickSound");
            if (mode == 2) {
                mode = 0;
                saveSettings();
                hideOptions();
            }
            else {
                mode = 2;
                loadOptions();
            }
        }
    });

    let fadeOverlay = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        clickthrough: true,
        fill: "#000000", alpha: 0,
        onClick(args) {
            //console.log("click");
            // ^ not needed anymore??
            return true;
        }
    });

    addAnimator(function (t) {
        gameIcon.alpha = Math.min(Math.max(t / 300, 0), 1);
        contLabel.alpha = Math.min(Math.max((t - 100) / 300, 0), 1) * (Math.cos(time / 1000) + 3) / 4;
        infoLabel.alpha = verLabel.alpha = Math.min(Math.max((t - 200) / 300, 0), 1);

        if (t > 500) {
            state = "title";
            return true;
        }
        return false;
    })

    return {
        // Pre-render function
        preRender(ctx, delta) {
            let w = ctx.canvas.width;
            let h = ctx.canvas.height;
            for (let a = 0; a < particles.length; a++) {
                let par = particles[a];
                let scale = 1 / ((20000 - par[2]) / 500);
                par[2] += delta;
                if (par[2] > 20000) {
                    particles.splice(a, 1);
                    a--;
                } else {
                    ctx.fillStyle = "#ffffff" + Math.min(Math.floor(par[2] / 20), 255).toString(16).padStart(2, "0");
                    ctx.beginPath();
                    ctx.arc(par[0] * scale * 20 + w / 2, par[1] * scale * 20 + h / 2, 5 * scale, 0, Math.PI * 2);
                }
                ctx.fill();
            }
            for (let a = 0; a < delta; a += 200) {
                particles.push(
                    [Math.random() * w * 2 - w, Math.random() * h * 2 - h, delta - a],
                );
            }

            if (state == "title") {
                contLabel.alpha = (Math.cos(time / 1000) + 3) / 4;
            }


            for (let a = 0; a < 4; a++) {
                var tempsaveNR = a;
                if (localStorage.getItem("SRPG" + tempsaveNR) != undefined && localStorage.getItem("SRPG" + tempsaveNR) != "null") { // It exists
                    try {
                        var thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                    }
                    catch (e) {
                        saveGame();
                        var thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                    }
                    //if (a == 3) saveButtons[a].text = "Auto " + "\n Lvl: " + thisSave.characters.bleu.level;
                    //else saveButtons[a].text = "Save " + (tempsaveNR + 1) + "\n Lvl: " + thisSave.characters.bleu.level;

                    if (thisSave.pfp != undefined) {
                        saveImages[a].source = thisSave.pfp;
                    }

                    saveButtons[a].text = " ";

                    let amount = 15;
                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 1;
                    }
                    // Current party with levels texts, e. g. Skro Lvl. 4
                    saveTexts[2 + (a * amount)].text = getPlayer(1, thisSave).name;
                    saveTexts[4 + (a * amount)].text = "Lvl. " + getPlayer(1, thisSave).level;
                    if (thisSave.chars.length > 1) saveTexts[3 + (a * amount)].text = getPlayer(2, thisSave).name;
                    if (thisSave.chars.length > 1) saveTexts[5 + (a * amount)].text = "Lvl. " + getPlayer(2, thisSave).level;
                    if (thisSave.chars.length > 2) saveTexts[6 + (a * amount)].text = getPlayer(3, thisSave).name;
                    if (thisSave.chars.length > 2) saveTexts[8 + (a * amount)].text = "Lvl. " + getPlayer(3, thisSave).level;
                    if (thisSave.chars.length > 3) saveTexts[7 + (a * amount)].text = getPlayer(4, thisSave).name;
                    if (thisSave.chars.length > 3) saveTexts[9 + (a * amount)].text = "Lvl. " + getPlayer(4, thisSave).level;

                    saveTexts[10 + (a * amount)].text = getTime(thisSave.playTime, 60, 3600);

                    saveTexts[13 + (a * amount)].text = formatNumber(thisSave.wrenches);
                    saveTexts[14 + (a * amount)].text = formatNumber(thisSave.bricks);

                    saveImages[a].source = "saveimage" + thisSave.pfp;
                    saveImages[a].alpha = 1;
                }
                else { // Save does not exist :(
                    saveButtons[a].text = "New Game";
                    saveImages[a].alpha = 0;
                    let amount = 15;
                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 0;
                    }
                }
            }

            if (mode == 0) {
                deleteButton.text = "Delete";
                optionButton.text = "Options";
            }
            if (mode == 1) {
                deleteButton.text = "SELECT . . ."
                optionButton.text = "Options";
            }
            if (mode == 2) {
                deleteButton.text = "Reset All";
                optionButton.text = "Go Back";
            }

            if (previousScene == "settings" && hiddn == false) {
                hideOptions();
                hiddn = true;
            }
        },

        // Controls
        controls: [
            gameIcon, contLabel, infoLabel, verLabel,
            controls.base({
                anchor: [0, 0], sizeAnchor: [1, 1],
                onClick() {
                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    musicPlayer.volume = settings.musicVolume;
                    playMusic("bgm/title");
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
                        if (localStorage.getItem("SRPG3") != undefined) saveButtons[3].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

                        for (i in saveTexts) {
                            saveTexts[i].anchor[0] = saveButtons[Math.floor(i / 15)].anchor[0] + saveTexts[i].defanch - 0.2;
                        }

                        saveImages[0].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);
                        saveImages[1].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 850) / 800, 1), 0)) ** 4);
                        saveImages[2].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);
                        if (localStorage.getItem("SRPG3") != undefined) saveImages[3].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

                        deleteButton.anchor[0] = -.8 + (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);
                        optionButton.anchor[0] = -.3 + (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);

                        if (t > 3000) {
                            return true;
                        }
                        return false;
                    })
                }
            }),
            ...saveButtons, ...saveImages, ...saveTexts, settingsSaveText,
            deleteButton, optionButton,
            fadeOverlay
        ],
        name: "title"
    }
};
