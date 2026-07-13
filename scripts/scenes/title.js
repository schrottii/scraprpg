let mode = 0;
let state = "intro";
let hiddn = false;
let titleSceneParticles = [];

scenes["title"] = new Scene(
    () => {
        // Init
        createSquare("BG", 0, 0, 1, 1, "#000000");

        // particles
        createRenderLayer("particleLayer", (tick) => {
            let w = wggj.canvas.w;
            let h = wggj.canvas.h;
            let delta = tick * 1000;
            //console.log(tick, delta)

            for (let a = 0; a < titleSceneParticles.length; a++) {
                let par = titleSceneParticles[a];
                let scale = 2 / ((20000 - par[2]) / 2000); // size

                par[2] += delta; // age
                if (par[2] > 20000) { // lifetime
                    titleSceneParticles.splice(a, 1);
                    a--;
                } else {
                    wggjCTX.fillStyle = "#ffffff" + Math.min(Math.floor(par[2] / 20), 255).toString(16).padStart(2, "0");
                    wggjCTX.beginPath();
                    wggjCTX.arc(par[0] * scale * 20 + w / 2, par[1] * scale * 20 + h / 2, 5 * scale, 0, Math.PI * 2);
                }
                wggjCTX.fill();
            }
            for (let a = 0; a < delta; a += 2) { // last number is for how often one spawns
                titleSceneParticles.push(
                    // x, y, age
                    [Math.random() * w * 2 - w, Math.random() * h * 2 - h, delta - a],
                );
            }
        });

        // generic elements
        createImage("gameIcon", 0.5, 0.15, 0.3, 0.3, "gameicon", { centered: true }); // add glow
        createText("contLabel", 0.5, 0.65, "Click anywhere to continue...", { alpha: 0, size: 32, color: "white", offset: [0, 75] }); // add red outline
        createText("infoLabel", 0.02, 0.98, "©2021-2026 Schrottii / Balnoom / Toast Technology Team / ScrapRPG team / Schrott Games", { align: "left", size: "20", color: "#7f7f7f", alpha: 0, offset: [5, -12] });
        createClickable("creditHitbox", 0, 0.9, 0.2, 0.1, () => { setScene(scenes.credits()); });
        createText("verLabel", 0.98, 0.98, GAMEVERSION, { align: "right", size: 24, color: "#7f7f7f", alpha: 0, offset: [-5, -12] });

        // local functions
        function loadSave(id) {
            // clicked on a save, transition thingy
            objects["fadeOverlay"].power = false;

            //groups["saveTexts" + id].set("defoff", saveTexts[st].offset[1] - saveButtons[Math.floor(st / 15)].offset[1]);

            createAnimation("loadSaveAni", "fadeOverlay", (t, d, a) => {
                for (let x = 0; x < 3; x++) {
                    if (x == id) {
                        objects["saveButtons" + x].offset[1] = (-160 + 130 * x) * Math.max(1 - a.dur / 0.6, 0) ** 2 - 60;
                        objects["saveImage" + x].offset[1] = (-160 + 130 * x) * Math.max(1 - a.dur / 0.6, 0) ** 2 - 60;
                    } else {
                        objects["saveButtons" + x].offset[1] = (-60 + 130 * (x - id)) + (-160 + 130 * id) * (Math.max(1 - a.dur / 0.6, 0) ** 2);
                        objects["saveButtons" + x].y = 0.3 + (x > id ? 1 : -1) * ((1 - Math.max(1 - a.dur / 0.6, 0)) ** 2);
                        objects["saveImage" + x].offset[1] = (-60 + 130 * (x - id)) + (-160 + 130 * id) * (Math.max(1 - a.dur / 0.6, 0) ** 2);
                        objects["saveImage" + x].y = 0.3 + (x > id ? 1 : -1) * ((1 - Math.max(1 - a.dur / 0.6, 0)) ** 2);
                    }

                    groups["saveTextGroup" + x].set("y", objects["saveButtons" + x].y);
                    groups["saveTextGroup" + x].set("offset", objects["saveButtons" + x].offset);
                    //objects["saveTexts" + st].offset[1] = saveTexts[st].defoff + saveButtons[x].offset[1];
                }

                t.power = true;
                t.alpha = 1 - (1 - a.dur / 4) ** 2;

                objects["deleteButton"].offset[1] = objects["optionButton"].offset[1] = (70 + 130 * (2 - id)) + (-160 + 130 * id) * (Math.max(1 - a.dur / 0.6, 0) ** 2);
                objects["deleteButton"].y = objects["optionButton"].y = 0.5 + ((1 - Math.max(1 - a.dur / 0.6, 0)) ** 2);

                if (a.dur >= 4) {
                    loadScene("overworld");
                    a.kill();
                }
            }, 4.2, true);
        }

        function loadOptions() {
            fadeOverlay.clickthrough = true;
            addAnimator(function (t) {
                for (let a = 0; a < 3; a++) {
                    id = a;
                    objects["saveButtons" + a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                    objects["saveImages" + a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);

                    // Bricks and Wrenches
                    objects["saveTexts" + a + "wrenches"].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                    objects["saveTexts" + a + "bricks"].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                }

                if (t > 599) {
                    fadeOut(500, true, () => loadScene("settings"));
                    return true;
                }
                return false;
            });
        };

        function hideOptions() {
            fadeOverlay.clickthrough = true;
            addAnimator(function (t) {
                for (let a = 0; a < 3; a++) {
                    objects["saveButtons" + a].offset[1] = -60 + (-160 + 130 * a) * (Math.max(t / 600, 0) ** 2);
                    objects["saveImages" + a].offset[1] = -60 + (-160 + 130 * a) * (Math.max(t / 600, 0) ** 2);

                    // Bricks and Wrenches
                    objects["saveTexts" + a + "wrenches"].offset[1] = (-164 + 130 * a) * (Math.max(t / 600, 0) ** 2);
                    objects["saveTexts" + a + "wrenches"].offset[1] = (-132 + 130 * a) * (Math.max(t / 600, 0) ** 2);
                }
                if (t > 599) {
                    return true;
                }
                return false;
            });
            addAnimator(function (t) {
                objects["settingsSaveText"].alpha = t / 10;
                if (t > 2500) {
                    objects["settingsSaveText"].alpha = 0;
                    return true;
                }
                return false;
            })
        };

        // save buttons
        for (let a = 0; a < 3; a++) {
            createButton("saveButtons" + a, 1.2, 0.4, 0.6, 0, "button", () => {
                if (mode == 0) {
                    saveNR = a;

                    playSound("titletransition");
                    stopMusic();

                    loadGame(a);
                    loadSave(a);
                    game.stats.opened++;
                    mode = 69;
                }
                else if (mode == 1) {
                    saveNR = a;
                    localStorage["SRPG" + saveNR] = "null";
                    mode = 0;
                }
            }, { offset: [0, -220 + 130 * a], sizeOffset: [0, 120], aText: { alpha: 0, size: 40, text: "" } });

            createText("saveTexts" + a + "nr", 1.2, 0.4, "Save " + (a + 1), { align: "left", size: 40, color: "black", offset: [72, -164 + 130 * a] });
            objects["saveTexts" + a + "nr"].defanch = 0.2;
            createText("saveTexts" + a + "chapter", 1.2, 0.4, "Chapter I: The Beginning", { align: "right", size: 24, color: "black", offset: [120, -188 + 130 * a] });
            objects["saveTexts" + a + "chapter"].defanch = 0.7;

            //for (i = 0; i < 2; i++) {
            createText("saveTexts" + a + "prot1name", 1.2, 0.41, "", { align: "left", size: 20, color: "black", offset: [0, -146 + 130 * a] });
            createText("saveTexts" + a + "prot1lvl", 1.15, 0.41, "", { align: "right", size: 16, color: "black", offset: [0, -146 + 130 * a] });
            objects["saveTexts" + a + "prot1name"].defanch = 0.205;
            objects["saveTexts" + a + "prot1lvl"].defanch = 0.28;

            createText("saveTexts" + a + "prot2name", 1.2, 0.41, "", { align: "left", size: 20, color: "black", offset: [0, -120 + 130 * a] });
            createText("saveTexts" + a + "prot2lvl", 1.15, 0.41, "", { align: "right", size: 16, color: "black", offset: [0, -120 + 130 * a] });
            objects["saveTexts" + a + "prot2name"].defanch = 0.205;
            objects["saveTexts" + a + "prot2lvl"].defanch = 0.28;
            //}

            createText("saveTexts" + a + "playtime", 1.2, 0.41, "24:31:02", { align: "right", size: 32, color: "black", offset: [120, -120 + 130 * a] });
            objects["saveTexts" + a + "playtime"].defanch = 0.7;

            createImage("wrench", -10, 0, 0, 0, "wrench");
            createImage("brick", -10, 0, 0, 0, "brick");

            createSmartText("saveTexts" + a + "wrenches", 1.2, 0.41, "0", { align: "left", size: 32, color: "black", offset: [40, -150 + 130 * a], images: { currency: "wrench" } });
            createSmartText("saveTexts" + a + "bricks", 1.2, 0.41, "0", { align: "left", size: 32, color: "black", offset: [40, -116 + 130 * a], images: { currency: "brick" } });
            objects["saveTexts" + a + "wrenches"].defanch = 0.55;
            objects["saveTexts" + a + "bricks"].defanch = 0.55;

            createButton("saveImage" + a, 1.2, 0.4, 0, 0, "saveimage" + Math.ceil(Math.random() * 5), (c) => {
                // change image when clicked
                saveNR = a;
                stopMusic();
                loadGame(saveNR);

                game.pfp = (game.pfp + 1) % 5;
                objects[c].image = "saveimage" + game.pfp;

                saveGame();
            }, { clickthrough: false, quadratic: true, alpha: 0, offset: [0, -220 + 130 * a], sizeOffset: [64, 64] });
            objects["saveImage" + a].defanch = 0.2;

            //    "saveButtons" + a
            createGroup("saveTextGroup" + a, [
                "saveTexts" + a + "nr", "saveTexts" + a + "chapter",
                "saveTexts" + a + "prot1name", "saveTexts" + a + "prot1lvl", "saveTexts" + a + "prot2name", "saveTexts" + a + "prot2lvl",
                "saveTexts" + a + "playtime", "saveTexts" + a + "wrenches", "saveTexts" + a + "bricks",
                "saveImage" + a
            ]);
        }

        //groups["saveTextGroup1"].add("y", 0.2);
        //groups["saveTextGroup2"].add("y", 0.4);



        // misc buttons
        createButton("deleteButton", -0.8, 0.6, 0.0, 0.0, "button", () => {
            playSound("buttonClickSound");
            if (mode == 1) {
                mode = 0;
                for (i = 0; i < 3; i++) {
                    objects["saveButtons" + i].fillTop = colors.buttontop;
                    objects["saveButtons" + i].fillBottom = colors.buttonbottom;
                }
            }
            else if (mode == 0) {
                mode = 1;
                addAnimator(function (t) {
                    if (mode != 1) {
                        for (i = 0; i < 3; i++) {
                            objects["saveButtons" + i].fillTop = colors.buttontop;
                            objects["saveButtons" + i].fillBottom = colors.buttonbottom;
                        }
                        return true;
                    }
                    for (i = 0; i < 3; i++) {
                        objects["saveButtons" + i].fillTop = t % 800 > 400 ? "red" : colors.buttontop;
                        objects["saveButtons" + i].fillBottom = t % 800 > 400 ? "darkred" : colors.buttonbottom;
                    }
                    return false;
                });
            }
        }, { offset: [0, 170], sizeOffset: [260, 100], aText: { text: "Delete", size: 24 } })

        createButton("optionButton", -0.4, 0.6, 0.0, 0.0, "button", () => {
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
        }, { offset: [120, 170], sizeOffset: [260, 100], aText: { text: "Settings", size: 24 } });

        createSquare("fadeOverlay", 0, 0, 1, 1, "#000000", { alpha: 0 });
        objects["fadeOverlay"].alpha = 0;

        addAnimator(function (t) {
            objects["gameIcon"].alpha = Math.min(Math.max(t / 300, 0), 1);
            objects["contLabel"].alpha = Math.min(Math.max((t - 100) / 300, 0), 1) * (Math.cos(time / 1000) + 3) / 4;
            objects["infoLabel"].alpha = objects["verLabel"].alpha = Math.min(Math.max((t - 200) / 300, 0), 1);

            if (t > 500) {
                state = "title";
                return true;
            }
            return false;
        })

        // clickable to continue, so logo disappears, and the save buttons fly in
        createClickable("con", 0, 0, 1, 0.8, () => {
            // when you click and get to the second part of the title screen
            if (state == "menu") return false;
            state = "menu";
            //console.log("click!");

            loadSettings();
            changeSoundVolume(settings.soundVolume);
            playSound("titletransition");
            playMusic("bgm/title");

            createAnimation("title2_gameIcon", "gameIcon", (t, d, a) => {
                t.y = 0.15 - 1 * Math.min(a.dur * 1000 / 800, 1) ** 4;
                //t.offset[1] = -200 - 100 * Math.min(a.dur * 1000 / 800, 1) ** 4;
            }, 3000, true);

            createAnimation("title2_contLabel", "contLabel", (t, d, a) => {
                t.y = 0.65 + 1 * Math.min(a.dur * 1000 / 800, 1) ** 4;
                t.alpha = (Math.cos(a.dur * 1000 / 20) + 1) / 2;
            }, 3000, true);

            createAnimation("title2_infoLabel", "infoLabel", (t, d, a) => {
                t.offset[1] = objects["contLabel"].offset[1] = -12 + 120 * (a.dur * 1000 / 800) ** 4;
            }, 3000, true);

            for (let index = 0; index <= 2; index++) {
                createAnimation("title2_saveButtons" + index, "saveButtons" + index, (t, d, a) => {
                    t.x = 1.2 - (1 - (1 - Math.max(Math.min((a.dur * 1000 - 800) / 800, 1), 0)) ** 4);
                    //groups["saveTextGroup" + index].sub("x", d / a.maxDur);
                    //console.log(a.dur, a.maxDur, a.pct);

                    for (let child of groups["saveTextGroup" + index].children) {
                        //groups["saveTextGroup" + index].add("x", saveTexts[index].defanch - 0.2);
                        objects[child].x = objects["saveButtons" + index].x + objects[child].defanch - 0.2;
                    }

                    objects["deleteButton"].x = -0.8 + (1 - (1 - Math.max(Math.min(((a.dur * 1000) - 900) / 800, 1), 0)) ** 4);
                    objects["optionButton"].x = -0.4 + (1 - (1 - Math.max(Math.min(((a.dur * 1000) - 900) / 800, 1), 0)) ** 4);
                }, 3, true);
            }
        });

        // update texts
        let tempsaveNR;
        let thisSave;
        for (let a = 0; a < 3; a++) {
            tempsaveNR = a;
            if (/*a != 2 && */localStorage.getItem("SRPG" + tempsaveNR) != undefined && localStorage.getItem("SRPG" + tempsaveNR) != "null") { // It exists
                try {
                    thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                }
                catch (e) {
                    saveGame();
                    thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                }
                //console.log(thisSave);

                objects["saveTexts" + a + "wrenches"].text = "i{currency} " + formatNumber(thisSave.wrenches);
                objects["saveTexts" + a + "bricks"].text = "i{currency} " + formatNumber(thisSave.bricks);
                objects["saveTexts" + a + "playtime"].text = getTime(thisSave.stats.playTime, 60, 3600);

                objects["saveImage" + a].image = "saveimage" + thisSave.pfp;
                objects["saveImage" + a].alpha = 1;

                // Current party with levels texts, e. g. Skro Lvl. 4
                objects["saveTexts" + a + "prot1name"].text = getPlayer(1, thisSave).name;
                objects["saveTexts" + a + "prot1lvl"].text = "Lvl. " + getPlayer(1, thisSave).level;

                if (thisSave.chars.length > 1) objects["saveTexts" + a + "prot2name"].text = getPlayer(2, thisSave).name;
                if (thisSave.chars.length > 1) objects["saveTexts" + a + "prot2lvl"].text = "Lvl. " + getPlayer(2, thisSave).level;
                /*
                if (thisSave.chars.length > 2) saveTexts[6 + (a * amount)].text = getPlayer(3, thisSave).name;
                if (thisSave.chars.length > 2) saveTexts[8 + (a * amount)].text = "Lvl. " + getPlayer(3, thisSave).level;
                if (thisSave.chars.length > 3) saveTexts[7 + (a * amount)].text = getPlayer(4, thisSave).name;
                if (thisSave.chars.length > 3) saveTexts[9 + (a * amount)].text = "Lvl. " + getPlayer(4, thisSave).level;
                */
            }
            else { // Save does not exist :(
                console.log("save doesn't exist: nr " + a);
                objects["saveButtons" + a + ":text"].alpha = 1;
                objects["saveButtons" + a + ":text"].text = "New Game";
                objects["saveImage" + a].alpha = 1;
                groups["saveTextGroup" + a].set("alpha", 0);
            }
        }
    },
    (tick) => {
        // Loop
        // fancy animation
        if (objects["contLabel"].time == undefined) objects["contLabel"].time = 0;
        objects["contLabel"].time += tick;
        let time = objects["contLabel"].time;

        objects["contLabel"].alpha = (Math.cos(time) + 3) / 4;
        objects["gameIcon"].x = 0.5 + 0.025 * Math.cos(time / 6.6);
        objects["gameIcon"].glow = 24 * Math.cos(time);

        // update texts
        if (mode == 0) {
            objects["deleteButton"].text = "Delete";
            objects["optionButton"].text = "Settings";
        }
        if (mode == 1) {
            objects["deleteButton"].text = "SELECT . . ."
            objects["optionButton"].text = "Settings";
        }

        if (previousScene == "settings" && hiddn == false) {
            hideOptions();
            hiddn = true;
        }
    }
);

/*
scenes.title = () => {

    /
    let BG = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        fill: "rgb(0, 0, 0)"
    });
    *

    let gameIcon = controls.image({
        anchor: [0.5, 0.35], offset: [-277.5, -200], sizeOffset: [555, 300],
        alpha: 0, glowColor: "yellow",
        source: "gameicon",
    });
    let contLabel = controls.label({
        anchor: [0.5, 0.65], offset: [0, 75],
        fontSize: 32, alpha: 0,
        text: "Click anywhere to continue...",
        outline: "red", outlineAnchor: 0.002,
    });
    let infoLabel = controls.label({
        anchor: [0.02, 0.98], offset: [5, -12],
        align: "left", baseline: "alphabetic", fontSize: 24, fill: "#7f7f7f", alpha: 0,
        text: "©2021-2026 Schrottii / Balnoom / Toast Technology Team / ScrapRPG team / Schrott Games",
    });
    let creditHitbox = controls.rect({
        anchor: [0, 0.9], sizeAnchor: [0.2, 0.1], alpha: 0,
        onClick(args) {
            setScene(scenes.credits());
        }
    })
    let verLabel = controls.label({
        anchor: [0.98, 0.98], offset: [-5, -12],
        align: "right", baseline: "alphabetic", fontSize: 24, fill: "#7f7f7f", alpha: 0,
        text: GAMEVERSION,
    });

    let settingsSaveText = controls.label({
        anchor: [0.04, 0.98], offset: [12, -12],
        fontSize: 20, text: "Settings saved!", alpha: 0,
    });

    function loadSave(id) {
        fadeOverlay.clickthrough = false;
        for (st = 0; st < saveTexts.length; st++) {
            saveTexts[st].defoff = saveTexts[st].offset[1] - saveButtons[Math.floor(st / 15)].offset[1];
        }

        addAnimator(function (t) {
            // clicked on a save, transition thingy
            for (let a = 0; a < 3; a++) {
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
            for (let a = 0; a < 3; a++) {
                id = a;
                saveButtons[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                //saveButtons[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                //saveImages[a].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);

                // Bricks and Wrenches
                saveTexts[11 + a * 15].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                //saveTexts[11 + a * 15].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                saveTexts[12 + a * 15].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                //saveTexts[12 + a * 15].anchor[1] = .3 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
            }

            if (t > 599) {
                fadeOut(500, true, () => setScene(scenes.settings()));
                return true;
            }
            return false;
        });
    };

    function hideOptions() {
        fadeOverlay.clickthrough = true;
        addAnimator(function (t) {
            for (let a = 0; a < 3; a++) {
                saveButtons[a].offset[1] = -60 + (-160 + 130 * a) * (Math.max(t / 600, 0) ** 2);
                saveImages[a].offset[1] = -60 + (-160 + 130 * a) * (Math.max(t / 600, 0) ** 2);

                // Bricks and Wrenches
                saveTexts[11 + a * 15].offset[1] = (-164 + 130 * a) * (Math.max(t / 600, 0) ** 2);
                saveTexts[12 + a * 15].offset[1] = (-132 + 130 * a) * (Math.max(t / 600, 0) ** 2);
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

    for (let a = 0; a < 3; a++) {
        saveButtons.push(controls.button({
            anchor: [1.2, 0.4], offset: [0, -220 + 130 * a], sizeAnchor: [.5, 0], sizeOffset: [120, 120], clickthrough: false,
            text: " ",
            onClick(args) {
                if (mode == 0) {
                    saveNR = a;

                    playSound("titletransition");
                    stopMusic();

                    loadGame(a);
                    loadSave(a);
                    game.stats.opened++;
                }
                else if (mode == 1) {
                    saveNR = a;
                    localStorage["SRPG" + saveNR] = "null";
                    mode = 0;
                }
            }
        }))
        saveTexts.push(controls.label({
            anchor: [1.2, 0.4], offset: [72, -188 + 130 * a], defanch: 0.2,
            align: "left", fontSize: 48, fill: "black",
            text: "Save " + (a + 1),
            alpha: 1,
        }));
        saveTexts.push(controls.label({
            anchor: [1.2, 0.4], offset: [120, -188 + 130 * a], defanch: 0.7,
            align: "right", fontSize: 24, fill: "black",
            text: "Chapter I: The Beginning",
            alpha: 1,
        }));

        for (i = 0; i < 2; i++) {
            saveTexts.push(controls.label({
                anchor: [1.2 + (0.225 * i), 0.405], offset: [0, -146 + 130 * a], defanch: 0.205 + (0.125 * i),
                align: "left", fontSize: 20, fill: "black",
                text: "",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [1.15 + (0.225 * i), 0.405], offset: [0, -146 + 130 * a], defanch: 0.28 + (0.125 * i),
                align: "right", fontSize: 16, fill: "black",
                text: "",
                alpha: 1,
            }));

            saveTexts.push(controls.label({
                anchor: [1.2 + (0.225 * i), 0.405], offset: [0, -120 + 130 * a], defanch: 0.205 + (0.125 * i),
                align: "left", fontSize: 20, fill: "black",
                text: "",
                alpha: 1,
            }));
            saveTexts.push(controls.label({
                anchor: [1.15 + (0.225 * i), 0.405], offset: [0, -120 + 130 * a], defanch: 0.28 + (0.125 * i),
                align: "right", fontSize: 16, fill: "black",
                text: "",
                alpha: 1,
            }));
        }

        saveTexts.push(controls.label({
            anchor: [1.2, 0.4], offset: [120, -120 + 130 * a], defanch: 0.7,
            align: "right", fontSize: 32, fill: "black",
            text: "24:31:02",
            alpha: 1,
        }));

        saveTexts.push(controls.image({
            anchor: [1.2, 0.4], sizeOffset: [32, 32], offset: [0, -164 + 130 * a], defanch: 0.55,
            source: "wrench",
            alpha: 1,
        }));
        saveTexts.push(controls.image({
            anchor: [1.2, 0.4], sizeOffset: [32, 32], offset: [0, -132 + 130 * a], defanch: 0.55,
            source: "brick",
            alpha: 1,
        }));

        saveTexts.push(controls.label({
            anchor: [1.2, 0.4], offset: [40, -150 + 130 * a], defanch: 0.55,
            align: "left", fontSize: 32, fill: "black",
            text: "0",
            alpha: 1,
        }));
        saveTexts.push(controls.label({
            anchor: [1.2, 0.4], offset: [40, -116 + 130 * a], defanch: 0.55,
            align: "left", fontSize: 32, fill: "black",
            text: "0",
            alpha: 1,
        }));

        saveImages.push(controls.image({
            anchor: [1.2, 0.4], offset: [0, -220 + 130 * a], sizeAnchor: [0, 0], sizeOffset: [60, 60],
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

    // auto save
    //saveButtons[3].fillTop = "#54d4ff";
    //saveButtons[3].fillBottom = "#4fa1bc";

    let deleteButton = controls.button({
        anchor: [-0.8, 0.6], offset: [0, 170], sizeOffset: [250, 100],
        fontSize: 32, text: "Delete",
        onClick(args) {
            playSound("buttonClickSound");
            if (mode == 1) {
                mode = 0;
                for (i = 0; i < 3; i++) {
                    saveButtons[i].fillTop = colors.buttontop;
                    saveButtons[i].fillBottom = colors.buttonbottom;
                }
                //saveButtons[3].fillTop = "#54d4ff";
                //saveButtons[3].fillBottom = "#4fa1bc";
            }
            else if (mode == 0) {
                mode = 1;
                addAnimator(function (t) {
                    if (mode != 1) {
                        for (i = 0; i < 3; i++) {
                            saveButtons[i].fillTop = colors.buttontop;
                            saveButtons[i].fillBottom = colors.buttonbottom;
                        }
                        //saveButtons[3].fillTop = "#54d4ff";
                        //saveButtons[3].fillBottom = "#4fa1bc";
                        return true;
                    }
                    for (i = 0; i < 3; i++) {
                        saveButtons[i].fillTop = t % 800 > 400 ? "red" : colors.buttontop;
                        saveButtons[i].fillBottom = t % 800 > 400 ? "darkred" : colors.buttonbottom;
                    }
                    //saveButtons[3].fillTop = t % 800 > 400 ? "purple" : "#54d4ff";
                    //saveButtons[3].fillBottom = t % 800 > 400 ? "rebeccapurple" : "#4fa1bc";
                    return false;
                });
            }
        }
    });
    let optionButton = controls.button({
        anchor: [-0.2, 0.6], offset: [-130, 170], sizeOffset: [250, 100],
        fontSize: 32, text: "Settings",
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
            // bg needs to be done here cuz particles
            wggjCTX.fillStyle = "black";
            wggjCTX.fillRect(0, 0, 1, 1);

            let w = wggjCTX.canvas.width;
            let h = wggjCTX.canvas.height;
            for (let a = 0; a < particles.length; a++) {
                let par = particles[a];
                let scale = 2 / ((20000 - par[2]) / 2000); // size

                par[2] += delta; // age
                if (par[2] > 20000) { // lifetime
                    particles.splice(a, 1);
                    a--;
                } else {
                    wggjCTX.fillStyle = "#ffffff" + Math.min(Math.floor(par[2] / 20), 255).toString(16).padStart(2, "0");
                    wggjCTX.beginPath();
                    wggjCTX.arc(par[0] * scale * 20 + w / 2, par[1] * scale * 20 + h / 2, 5 * scale, 0, Math.PI * 2);
                }
                wggjCTX.fill();
            }
            for (let a = 0; a < delta; a += 2) { // last number is for how often one spawns
                particles.push(
                    [Math.random() * w * 2 - w, Math.random() * h * 2 - h, delta - a],
                );
            }

            //if (state == "title") {
                contLabel.alpha = (Math.cos(time / 1000) + 3) / 4;
                gameIcon.anchor[0] = 0.5 + 0.025 * Math.cos(time / 6666);
                gameIcon.glow = 24 * Math.cos(time / 1000);
                //gameIcon.sizeOffset[0] = 555 * (1 + 0.5 * (Math.cos(time / 1000) + 3) / 4);
                //gameIcon.sizeOffset[1] = 300 * (1 + 0.5 * (Math.cos(time / 1000) + 3) / 4);
            //}

            for (let a = 0; a < 3; a++) {
                var tempsaveNR = a;
                if (localStorage.getItem("SRPG" + tempsaveNR) != undefined && localStorage.getItem("SRPG" + tempsaveNR) != "null") { // It exists
                    var thisSave;
                    try {
                        thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                    }
                    catch (e) {
                        saveGame();
                        thisSave = JSON.parse(localStorage.getItem("SRPG" + tempsaveNR));
                    }
                    //if (a == 3) saveButtons[a].text = "Auto " + "\n Lvl: " + thisSave.characters.bleu.level;
                    //else saveButtons[a].text = "Save " + (tempsaveNR + 1) + "\n Lvl: " + thisSave.characters.bleu.level;

                    if (thisSave.pfp != undefined) {
                        saveImages[a].source = thisSave.pfp;
                    }

                    saveButtons[a].text = " ";

                    // save texts
                    let amount = 15;

                    // Current party with levels texts, e. g. Skro Lvl. 4
                    for (let aa = 2; aa < 10; aa += 2) {
                        if (thisSave.chars.length > (aa / 2) - 1) {
                            saveTexts[aa + (a * amount)].text = getPlayer((aa / 2), thisSave).name;
                            saveTexts[aa + 1 + (a * amount)].text = "Lvl. " + getPlayer((aa / 2), thisSave).level;
                        }
                    }

                    // play time, currencies
                    if (thisSave.stats != undefined) saveTexts[10 + (a * amount)].text = getTime(thisSave.stats.playTime, 60, 3600);

                    saveTexts[13 + (a * amount)].text = formatNumber(thisSave.wrenches);
                    saveTexts[14 + (a * amount)].text = formatNumber(thisSave.bricks);

                    for (i = 0; i < amount; i++) {
                        saveTexts[i + (a * amount)].alpha = 1;
                    }

                    // pfp
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
                optionButton.text = "Settings";
            }
            if (mode == 1) {
                deleteButton.text = "SELECT . . ."
                optionButton.text = "Settings";
            }
            if (mode == 2) {
                //deleteButton.text = "Reset All";
                //optionButton.text = "Go Back";
            }

            if (previousScene == "settings" && hiddn == false) {
                hideOptions();
                hiddn = true;
            }
        },

        // Controls
        controls: [
            //BG,
            gameIcon, contLabel, infoLabel, creditHitbox, verLabel,
            controls.base({
                anchor: [0, 0], sizeAnchor: [1, 1],
                onClick() {
                    // when you click and get to the second part of the title screen
                    loadSettings();
                    changeSoundVolume(settings.soundVolume);
                    playSound("titletransition");

                    playMusic("bgm/title");

                    state = "menu";
                    this.clickthrough = true;
                    addAnimator(function (t) {
                        gameIcon.anchor[1] = 0.35 - .5 * Math.min(t / 800, 1) ** 4;
                        gameIcon.offset[1] = -200 - 100 * Math.min(t / 800, 1) ** 4;
                        contLabel.anchor[1] = 0.65 + .5 * Math.min(t / 800, 1) ** 4;
                        contLabel.alpha = (Math.cos(t / 20) + 1) / 2;
                        infoLabel.offset[1] = verLabel.offset[1] = -12 + 120 * (t / 800) ** 4;

                        saveButtons[0].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);
                        saveButtons[1].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 850) / 800, 1), 0)) ** 4);
                        saveButtons[2].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);
                        //if (localStorage.getItem("SRPG3") != undefined) saveButtons[3].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

                        for (i in saveTexts) {
                            saveTexts[i].anchor[0] = saveButtons[Math.floor(i / 15)].anchor[0] + saveTexts[i].defanch - 0.2;
                        }

                        saveImages[0].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 800) / 800, 1), 0)) ** 4);
                        saveImages[1].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 850) / 800, 1), 0)) ** 4);
                        saveImages[2].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);
                        //if (localStorage.getItem("SRPG3") != undefined) saveImages[3].anchor[0] = 1.2 - (1 - (1 - Math.max(Math.min((t - 900) / 800, 1), 0)) ** 4);

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
*/