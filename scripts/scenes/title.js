scenes.title = () => {
    musicPlayer.src = audio["bgm/vaporlim"].src;
    musicPlayer.volume = .5;
    musicPlayer.play();

    let state = "intro";

    let particles = [];


    let gameIcon = controls.image({
        anchor: [.5, .4], offset: [-277.5, -200], sizeOffset: [555, 300],
        alpha: 0,
        source: "gameicon",
    });
    let contLabel = controls.label({
        anchor: [.5, .6], offset: [0, 75],
        alpha: 0,
        text: "Click anywhere to continue...",
    });
    let infoLabel = controls.label({
        anchor: [.02, .98], offset: [5, -12],
        align: "left", baseline: "alphabetic", fontSize: 16, fill: "#7f7f7f", alpha: 0,
        text: "©2022 Toast Technology",
    });
    let verLabel = controls.label({
        anchor: [.98, .98], offset: [-5, -12],
        align: "right", baseline: "alphabetic", fontSize: 16, fill: "#7f7f7f", alpha: 0,
        text: "v0.2",
    });

    function loadSave(id) {
        fadeOverlay.clickthrough = false;
        addAnimator(function (t) {
            for (let a = 0; a < 3; a++) {
                if (a == id) {
                    saveButtons[a].offset[1] = (-160 + 130 * a) * Math.max(1 - t / 600, 0) ** 2 - 60;
                    saveImages[a].offset[1] = (-160 + 130 * a) * Math.max(1 - t / 600, 0) ** 2 - 60;
                } else {
                    saveButtons[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                    saveButtons[a].anchor[1] = .5 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                    saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                    saveImages[a].anchor[1] = .5 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                }
            }
            musicPlayer.volume = 0.5 * Math.max(1 - t / 4000, 0) ** 2;
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
                saveButtons[a].anchor[1] = .5 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
                saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - t / 600, 0) ** 2);
                saveImages[a].anchor[1] = .5 + (a > id ? 1 : -1) * ((1 - Math.max(1 - t / 600, 0)) ** 2);
            }

            option.anchor[0] = -.8 + (1 - (1 - Math.max(Math.min(t / 800, 1), 0)) ** 4);
            if (t > 1000) {
                return true;
            }
            return false;
        });
    };

    function hideOptions() {
        fadeOverlay.clickthrough = true;
        addAnimator(function (t) {
            for (let a = 0; a < 3; a++) {
                id = a;
                saveButtons[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - (1000-t) / 600, 0) ** 2);
                saveButtons[a].anchor[1] = .5 + (a > id ? 1 : -1) * ((1 - Math.max(1 - (1000 - t) / 600, 0)) ** 2);
                saveImages[a].offset[1] = (-60 + 130 * (a - id)) + (-160 + 130 * id) * (Math.max(1 - (1000 - t) / 600, 0) ** 2);
                saveImages[a].anchor[1] = .5 + (a > id ? 1 : -1) * ((1 - Math.max(1 - (1000 - t) / 600, 0)) ** 2);
            }

            option.anchor[0] = -.8 + (1 - (1 - Math.max(Math.min((1000-t) / 800, 1), 0)) ** 4);
            if (t > 1000) {
                return true;
            }
            return false;
        });
    };


    let saveButtons = [];
    let saveImages = [];
    let mode = 0;

    for (let a = 0; a < 3; a++) {
        saveButtons.push(controls.button({
            anchor: [1.2, .5], offset: [-30, -220 + 130 * a], sizeAnchor: [.5, 0], sizeOffset: [120, 120], clickthrough: false,
            text: "Undefined",
            onClick(args) {
                if (mode == 0) {
                    saveNR = a;
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

        saveImages.push(controls.image({
            anchor: [1.2, .5], offset: [-30, -220 + 130 * a], sizeAnchor: [0, 0], sizeOffset: [60, 60],
            source: "saveimage" + Math.ceil(Math.random() * 5),
            onClick(args) { //Change the image when clicked
                saveNR = a;
                saveButtons[a].clickthrough = true; //To avoid savegame loading when changing image (God tier code)
                loadGame(saveNR);
                if (game.pfp == 5) { //To avoid changing to a pic that does not exist
                    game.pfp = 1;
                }
                else {
                    game.pfp += 1;
                }
                setTimeout(() => { saveButtons[a].clickthrough = false }, 500);
                saveGame();
            }
        }))    
    }


    let deleteButton = controls.button({
        anchor: [-.8, .5], offset: [0, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Delete",
        onClick(args) {
            if (mode == 1) {
                mode = 0;
            }
            else if (mode == 0) {
                mode = 1;
            }
            else if (mode == 2) {
                settings.grid = true;
            }
        }
    });
    let optionButton = controls.button({
        anchor: [-.2, .5], offset: [-150, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Options",
        onClick(args) {
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

    // Options

    let option = controls.button({
        anchor: [-.8, .1], offset: [0, 170], sizeOffset: [150, 50],
        fontSize: 16, text: "Grid: ON",
        onClick(args) {
            if (settings.grid == true) {
                settings.grid = false;
            }
            else {
                settings.grid = true;
            }
        }
    });

    let fadeOverlay = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        clickthrough: true,
        fill: "#000000", alpha: 0,
        onClick(args) {
            console.log("click");
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
                    saveButtons[a].text = "Save " + tempsaveNR + "\n P: " + thisSave.position;

                    if (thisSave.pfp != undefined) {
                        saveImages[a].source = thisSave.pfp;
                    }
                    
                    saveImages[a].source = "saveimage" + thisSave.pfp;
                }
                else { // Save does not exist :(
                    saveButtons[a].text = "New Game";
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

            if (settings.grid == true) {
                option.text = "Grid: ON";
            }
            else {
                option.text = "Grid: OFF";
            }

        },

        // Controls
        controls: [
            gameIcon, contLabel, infoLabel, verLabel,
            controls.base({
                anchor: [0, 0], sizeAnchor: [1, 1],
                onClick() {
                    state = "menu";
                    this.clickthrough = true;
                    loadSettings();
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
            }),
            ...saveButtons, ...saveImages,
            deleteButton, optionButton, option,
            fadeOverlay
        ],
    }
};