function settingsCreateBasic(category, name, uText = () => { return ""; }, description, onclick = () => { }) {
    let y = 0.15 + 0.1 * groups["settings_" + category].COUNT;

    // main button and auto update its text
    createButton("SETTINGS_" + category + "_" + name, 0.33, y, 0.2, 0.08,
        "button", onclick, {
        power: false,
        aText: { textBaseline: "alphabetic", text: "", size: 24, color: "black" }
    });
    objects["SETTINGS_" + category + "_" + name + ":text"].uText = (c) => { objects[c].text = uText(); };

    // description text
    createText("SETDESC_" + category + "_" + name, 0.55, y + (0.08 / 2), description,
        {
            text: "", size: 20, color: "black", align: "left",
            maxW: 0.4, power: false
        });

    // do not duplicate myself
    if (!groups["settings_" + category].children.includes("SETTINGS_" + category + "_" + name)) {
        groups["settings_" + category].addChild("SETTINGS_" + category + "_" + name);
        groups["settings_" + category].addChild("SETDESC_" + category + "_" + name);
        groups["settings_" + category].COUNT++;
    }
}

function settingsCreatePlusMinus(category, name, uText = () => { return ""; }, description, onminus = () => { }, onplus = () => { }) {
    let y = 0.15 + 0.1 * groups["settings_" + category].COUNT;
    settingsCreateBasic(category, name, uText, description, () => { });

    createButton("SETTINGS_" + category + "_" + name + "_minus", 0.3, y, 0.028, 0.08,
        "button", onminus, {
        power: false,
        aText: { textBaseline: "alphabetic", text: "-", size: 32, color: "red" }
    });

    createButton("SETTINGS_" + category + "_" + name + "_plus", 0.532, y, 0.028, 0.08,
        "button", onplus, {
        power: false,
        aText: { textBaseline: "alphabetic", text: "+", size: 32, color: "green" }
    });

    groups["settings_" + category].addChild("SETTINGS_" + category + "_" + name + "_minus");
    groups["settings_" + category].addChild("SETTINGS_" + category + "_" + name + "_plus");
}

scenes["settings"] = new Scene(
    () => {
        // Init

        function settingsLeave() {
            playSound("buttonClickSound");
            if (wggj.canvas.previousScene == "inventory") fadeOut(1000 / 3, true, () => loadScene("inventory"));
            if (wggj.canvas.previousScene == "title") fadeOut(500, false, () => loadScene("title"));
            if (wggj.canvas.previousScene == "mapmaker") loadScene("mapmaker");
        }

        function showMenuSettings(category, blink = true) {
            let categories = ["gameplay", "graphics", "controls", "audio", "mapmaker"];
            for (let c = 0; c < 5; c++) {
                if (categories[c] != category) {
                    // hide all the settings
                    groups["settings_" + categories[c]].set("power", false);
                    // shrinkflation
                    if (objects["categorybtn_" + categories[c]].w > 0.2) {
                        createAnimation("categorybtn_" + categories[c] + "_smaller", "categorybtn_" + categories[c],
                            (t, d, a) => { t.w = Math.max(0.15, 0.28 - (0.2 * a.pct)); t.x = 0.15 - t.w / 2 + Math.min(0.005, a.pct / 100); }, 0.4, true);
                    }
                }
            }
            groups["settings_" + category].set("power", true);

            /*
            let categoryEntries = "";
            if (settingsCategory == "gameplay") categoryEntries = menuSettingsGameplay;
            if (settingsCategory == "graphics") categoryEntries = menuSettingsGraphics;
            if (settingsCategory == "controls") categoryEntries = menuSettingsControls;
            if (settingsCategory == "audio") categoryEntries = menuSettingsAudio;

            let c = 0;
            for (i = 0; i < categoryEntries.length; i++) {
                if (categoryEntries[i].anchor[0] == 0.55) {
                    c = 0;
                    for (j = 0; j < i; j++) {
                        if (categoryEntries[i].anchor[0] == categoryEntries[j].anchor[0] && (categoryEntries[j].anchor[1] - baseY) / cY >= c) c = 1 + ((categoryEntries[j].anchor[1] - baseY) / cY);
                    }
                }
                categoryEntries[i].anchor[1] = baseY + (c * cY);

                categoryEntries[i].alpha = 1;
                if (categoryEntries[i].tick != undefined) categoryEntries[i].tick();
            }

            if (blink && settingsSaveText.alpha == 0) blinkButton(saveChanges, () => settingsSaveText.alpha > 0);
            */
        }

        // Background
        createSquare("bg", 0, 0, 1, 1, colors.bottomcolor);
        createSquare("bg2", 0.01, 0.01, 0.98, 0.98, colors.topcolor);

        createText("top_text", 0.1, 0.065, "Settings",
            { size: 32, color: "black", align: "center" });
        createButton("top_leave_btn", 0.89, 0.01, 0.1, 0.1, "button", () => {
            settingsLeave();
        }, { aText: { textBaseline: "alphabetic", text: "X", size: 48, color: "black" } });
        createSquare("top_rect", 0.01, 0.1, 0.98, 0.01, colors.bottomcolor);

        // the separator
        createSquare("the_separator", 0.3, 0.15, 0.005, 0.8, colors.bottomcolor);



        // bottom buttons
        createButton("specialbtn_back", 0.025, 0.9, 0.1, 0.075, "button", () => {
            playSound("buttonClickSound");
            settingsLeave();
        }, { aText: { textBaseline: "alphabetic", text: "Back", size: 24, color: "black" } });

        createButton("specialbtn_credits", 0.175, 0.9, 0.1, 0.075, "button", () => {
            playSound("buttonClickSound");
            fadeOut(750, true, () => loadScene("credits"));
        }, { aText: { textBaseline: "alphabetic", text: "Credits", size: 24, color: "black" } });

        createButton("specialbtn_savechanges", 0.85, 0.9, 0.1, 0.075, "button", () => {
            playSound("buttonClickSound");
            saveSettings();
        }, { aText: { textBaseline: "alphabetic", text: "Save Changes", size: 24, color: "black" } });



        // category buttons
        let categories = ["gameplay", "graphics", "controls", "audio", "mapmaker"];
        for (let c = 0; c < 5; c++) {
            createButton("categorybtn_" + categories[c], 0.05, 0.2 + 0.125 * c, 0.2, 0.1, "button", (co) => {
                // change category
                playSound("buttonClickSound");
                settingsCategory = categories[objects[co].iCat];
                showMenuSettings(categories[objects[co].iCat]);

                // go animate yourself
                createAnimation("categorybtn_" + categories[c] + "_bigger", "categorybtn_" + categories[c],
                    //(t, d, a) => { t.w = 0.2 + (0.1 * a.pct); t.x = 0.15 - t.w / 2; }, 0.2, true);
                    (t, d, a) => { t.w = Math.min(0.28, 0.2 + (0.2 * a.pct)); t.x = 0.15 - t.w / 2 + Math.min(0.005, a.pct / 100); }, 0.4, true);
            }, { aText: { text: categories[c].substr(0, 1).toUpperCase() + categories[c].substr(1), textBaseline: "alphabetic", size: 32, color: "black" } })
            objects["categorybtn_" + categories[c]].iCat = c;

            // create 5 groups as well
            if (groups["settings_" + categories[c]] != undefined) groups["settings_" + categories[c]].children = [];
            else createGroup("settings_" + categories[c], []);
            groups["settings_" + categories[c]].COUNT = 0;
        }



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Gameplay
        settingsCreateBasic("gameplay", "fps", () => "FPS: " + (settings.FPS == 999 ? "Unlimited" : settings.FPS),
            "Screen updates per second. Affects battery", () => {
                playSound("buttonClickSound");
                let fpsSteps = [6, 15, 30, 60, 120, 999];
                if (settings.FPS == undefined) settings.FPS = 60;
                else settings.FPS = fpsSteps[(fpsSteps.indexOf(settings.FPS) + 1) % fpsSteps.length];
            });

        settingsCreateBasic("gameplay", "autosave", () => settings.autosave == true ? "Autosave: ON" : "Autosave: OFF",
            "Saves the game every 15s on the map", () => {
                playSound("buttonClickSound");
                if (settings.autosave == undefined) settings.autosave = false;
                else settings.autosave = !settings.autosave;
            });

        settingsCreateBasic("gameplay", "difficulty", () => "Difficulty: " + ["Easy", "Normal", "Hard"][settings.difficulty],
            "Adjusts enemy power. Normal is the default and recommended", () => {
                playSound("buttonClickSound");
                settings.difficulty = (settings.difficulty + 1) % 3;
            });

        settingsCreateBasic("gameplay", "circles", () => "Circles: " + settings.circles.substr(0, 1).toUpperCase() + settings.circles.substr(1),
            "Shows circles underneath NPCs/enemies (to tell them apart)", () => {
                playSound("buttonClickSound");
                switch (settings.circles) {
                    case "none":
                        settings.circles = "npcs";
                        break;
                    case "npcs":
                        settings.circles = "enemies";
                        break;
                    case "enemies":
                        settings.circles = "all";
                        break;
                    case "all":
                        settings.circles = "none";
                        break;
                    default:
                        settings.circles = "none";
                        break;
                }
            });



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Graphics
        settingsCreateBasic("graphics", "fightgrid", () => "Fight Grid: " + (settings.grid ? "ON" : "OFF"),
            "Shows squares on possible positions", () => {
                playSound("buttonClickSound");
                settings.grid = !settings.grid;
            });

        settingsCreateBasic("graphics", "particles", () => "Particles: " + (settings.particles ? "ON" : "OFF"),
            "Toggles particles. Disable for better performance", () => {
                playSound("buttonClickSound");
                settings.particles = !settings.particles;
            });

        settingsCreateBasic("graphics", "blendeffects", () => "Blend Effects: " + (settings.blend ? "ON" : "OFF"),
            "Toggles blend techniques. Disable for better performance", () => {
                playSound("buttonClickSound");
                settings.blend = !settings.blend;
            });

        settingsCreateBasic("graphics", "gloweffects", () => "Glow Effects: " + (settings.glow ? "ON" : "OFF"),
            "Toggles glow effects. Disable for better performance", () => {
                playSound("buttonClickSound");
                settings.glow = !settings.glow;
            });



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Controls
        settingsCreateBasic("controls", "joystick", () => settings.joystick ? "Joystick" : "WalkPad",
            "Gives you a joystick to move on the map", () => {
                playSound("buttonClickSound");
                settings.joystick = !settings.joystick;
            });

        settingsCreatePlusMinus("controls", "walkpadsize", () => "WalkPad Size: " + Math.max(50, settings.walkPadSize * 100) + "%",
            "Adjust size of the walk pad", () => {
                playSound("buttonClickSound");
                settings.walkPadSize -= 1;
                if (settings.walkPadSize < 0) settings.walkPadSize = 2;
            }, () => {
                playSound("buttonClickSound");
                settings.walkPadSize += 1;
                if (settings.walkPadSize > 2) settings.walkPadSize = 0;
            });



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Audio
        settingsCreatePlusMinus("audio", "musicvolume", () => "Music Volume: " + Math.round(settings.musicVolume * 100) + "%",
            "Adjust music volume", () => {
                if (settings.musicVolume > 0) {
                    settings.musicVolume = settings.musicVolume - 0.05;
                    if (settings.musicVolume < 0) settings.musicVolume = 0;
                    musicPlayer.volume = settings.musicVolume;
                }
            }, () => {
                if (settings.musicVolume < 0.99) {
                    settings.musicVolume = settings.musicVolume + 0.05;
                    if (settings.musicVolume > 1) settings.musicVolume = 1;
                    musicPlayer.volume = settings.musicVolume;
                }
        });

        settingsCreatePlusMinus("audio", "soundvolume", () => "Sound Volume: " + Math.round(settings.soundVolume * 100) + "%",
            "Adjust sound effect volume", () => {
                if (settings.soundVolume > 0) {
                    settings.soundVolume = settings.soundVolume - 0.05;
                    if (settings.soundVolume < 0) settings.soundVolume = 0;
                    wggjAudio.volume = settings.soundVolume;
                }
            }, () => {
                if (settings.soundVolume < 0.99) {
                    settings.soundVolume = settings.soundVolume + 0.05;
                    if (settings.soundVolume > 1) settings.soundVolume = 1;
                    soundPlayer.volume = settings.soundVolume;
                }
            });



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Map Maker
        settingsCreateBasic("mapmaker", "animations", () => "Animations: " + (mapmaker.settings.enableAnimations ? "ON" : "OFF"),
            "Renders animations live in the Map Maker, decreases performance", () => {
                if (mapmaker.settings.enableAnimations == undefined) mapmaker.settings.enableAnimations = true;
                else mapmaker.settings.enableAnimations = !mapmaker.settings.enableAnimations;
        });

        settingsCreateBasic("mapmaker", "npcpaths", () => "NPC Paths: " + (mapmaker.settings.npcPaths ? "ON" : "OFF"),
            "Renders NPC's paths live in the Map Maker (if they have that movement type)", () => {
                if (mapmaker.settings.npcPaths == undefined) mapmaker.settings.npcPaths = true;
                else mapmaker.settings.npcPaths = !mapmaker.settings.npcPaths;
        });

        settingsCreateBasic("mapmaker", "showentities", () => "Show Entities: " + (mapmaker.settings.showEntities ? "ON" : "OFF"),
            "Renders NPCs, Items, Items in Chests", () => {
                if (mapmaker.settings.showEntities == undefined) mapmaker.settings.showEntities = true;
                else mapmaker.settings.showEntities = !mapmaker.settings.showEntities;
        });

        settingsCreateBasic("mapmaker", "cinematicfilter", () => "Cinematic Filter: " + mapmaker.settings.cinematicFilter,
            "Renders NPCs, Items, Items in Chests", () => {
                let avfilters = Object.keys(filters);
                avfilters.push("none");

                if (mapmaker.settings.cinematicFilter == undefined) mapmaker.settings.cinematicFilter = "none";
                else if (mapmaker.settings.cinematicFilter == "none") mapmaker.settings.cinematicFilter = avfilters[0];
                else {
                    mapmaker.settings.cinematicFilter = avfilters[(avfilters.indexOf(mapmaker.settings.cinematicFilter) + 1) % avfilters.length];
                }

                clearFilter();
                if (mapmaker.settings.cinematicFilter == "blur") setFilter(mapmaker.settings.cinematicFilter, 4);
                else if (mapmaker.settings.cinematicFilter != "none") setFilter(mapmaker.settings.cinematicFilter, 100);

        });



        // start up
        if (wggj.canvas.previousScene == "mapmaker") {
            fadeIn(20, true);
            showMenuSettings("mapmaker");
            objects["categorybtn_mapmaker"].w = 0.28;
            objects["categorybtn_mapmaker"].x = 0.015;
        }
        else {
            fadeIn(1000 / 3, true);
        }
    },
    (tick) => {
        // Loop
        let categories = ["gameplay", "graphics", "controls", "audio", "mapmaker"];
        for (let c = 0; c < 5; c++) {
            for (let child of groups["settings_" + categories[c]].children) {
                if (objects[child + ":text"] != undefined && objects[child + ":text"].uText != undefined) {
                    objects[child + ":text"].uText(child + ":text");
                }
            }
        }
    }
);



/*
scenes.settings = () => {
    var background = [];
    var menuSettings = [];
    var settingsCategory = "gameplay";
    var menuSettingsGameplay = [];
    var menuSettingsGraphics = [];
    var menuSettingsAudio = [];

    var baseY = 0.25;
    var cY = 0.15;

    // Background
    let settingsSaveText = controls.label({
        anchor: [.04, .98], offset: [12, -12],
        fontSize: 16, text: "Settings saved!", alpha: 0,
    });

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
            if (previousScene == "inventory") fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
            if (previousScene == "title") fadeOut(500, false, () => setScene(scenes.title()));
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
        anchor: [0.45, 0.01], sizeAnchor: [0.01, 0.98],
        fill: colors.bottomcolor, alpha: 1,
    }));
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Settings",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));
    background.push(controls.label({
        anchor: [0.505, 0.06],
        text: "Click a setting to get more info!",
        align: "left", fontSize: 16, fill: "black",
        alpha: 1,
    }));

    function settingDesc(text){
        background[background.length - 1].text = text;
    }

    menuSettings.push(controls.button({
        anchor: [0.1, 0.25], sizeAnchor: [0.25, 0.1],
        text: "Gameplay", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                settingsCategory = "gameplay";
                showMenuSettings(false);
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.1, 0.375], sizeAnchor: [0.25, 0.1],
        text: "Graphics", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                settingsCategory = "graphics";
                showMenuSettings(false);
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.1, 0.5], sizeAnchor: [0.25, 0.1],
        text: "Controls", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                settingsCategory = "controls";
                showMenuSettings(false);
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.1, 0.625], sizeAnchor: [0.25, 0.1],
        text: "Audio", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                settingsCategory = "audio";
                showMenuSettings(false);
            }
        }
    }));



    menuSettings.push(controls.button({
        anchor: [0.175, 0.8], sizeAnchor: [0.1, 0.075],
        text: "Credits", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                fadeOut(750, true, () => setScene(scenes.credits()));
            }
        }
    }));

    menuSettings.push(controls.button({
        anchor: [0.175, 0.9], sizeAnchor: [0.1, 0.075],
        text: "Back", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (previousScene == "inventory") fadeOut(1000 / 3, true, () => setScene(scenes.inventory()));
                if (previousScene == "title") fadeOut(500, false, () => setScene(scenes.title()));
            }
        }
    }));

    let saveChanges = controls.button({
        anchor: [0.675, 0.9], sizeAnchor: [0.1, 0.075],
        text: "Save Changes", alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                saveSettings();
                playSound("buttonClickSound");
                addAnimator(function (t) {
                    settingsSaveText.alpha = t / 10;
                    if (t > 2500) {
                        settingsSaveText.alpha = 0;
                        return true;
                    }
                    return false;
                })
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Gameplay

    menuSettingsGameplay = [
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "FPS", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Screen updates per second. Affects battery");

                    switch (settings.FPS) {
                        case 999:
                            settings.FPS = 6;
                            break;
                        case 6:
                            settings.FPS = 15;
                            break;
                        case 15:
                            settings.FPS = 30;
                            break;
                        case 30:
                            settings.FPS = 60;
                            break;
                        case 60:
                            settings.FPS = 120;
                            break;
                        case 120:
                            settings.FPS = 999;
                            break;
                        default:
                            settings.FPS = 999;
                            break;
                    }

                    showMenuSettings();
                }
            },
            tick() {
                this.text = "FPS: " + (settings.FPS == 999 ? "Unlimited" : settings.FPS);
            }
        }),

        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Autosave: ON", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Saves the game every 15s on the map");

                    if (settings.autosave == true) {
                        settings.autosave = false;
                    }
                    else {
                        settings.autosave = true;
                    }
                    showMenuSettings();
                }
            },
            tick() {
                if (settings.autosave == true) {
                    this.text = "Autosave: ON";
                }
                else {
                    this.text = "Autosave: OFF";
                }
            }
        }),
        
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Difficulty", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Adjusts enemy power. Normal is the default and recommended");

                    settings.difficulty = (settings.difficulty + 1) % 3;
                    showMenuSettings();
                }
            },
            tick() {
                this.text = "Difficulty: " + ["Easy", "Normal", "Hard"][settings.difficulty];
            }
        }),

        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Circles", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Shows circles underneath NPCs/enemies (to tell them apart)");

                    switch (settings.circles) {
                        case "none":
                            settings.circles = "npcs";
                            break;
                        case "npcs":
                            settings.circles = "enemies";
                            break;
                        case "enemies":
                            settings.circles = "all";
                            break;
                        case "all":
                            settings.circles = "none";
                            break;
                        default:
                            settings.circles = "none";
                            break;
                    }

                    showMenuSettings();
                }
            },
            tick() {
                this.text = "Circles: " + settings.circles.substr(0, 1).toUpperCase() + settings.circles.substr(1);
            }
        }),
    ]

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Graphics

    menuSettingsGraphics = [
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Fight Grid: ON", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Shows squares on possible positions");

                    settings.grid = !settings.grid;
                    showMenuSettings();
                }
            },
            tick() {
                if (settings.grid == true) {
                    this.text = "Fight Grid: ON";
                }
                else {
                    this.text = "Fight Grid: OFF";
                }
            }
        }),
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Particles: ON", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Toggles particles. Disable for better performance");

                    settings.particles = !settings.particles;
                    showMenuSettings();
                }
            },
            tick() {
                if (settings.particles == true) {
                    this.text = "Particles: ON";
                }
                else {
                    this.text = "Particles: OFF";
                }
            }
        }),
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Blend Effects: ON", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Toggles blend techniques. Disable for better performance");

                    settings.blend = !settings.blend;
                    showMenuSettings();
                }
            },
            tick() {
                if (settings.blend == true) {
                    this.text = "Blend Effects: ON";
                }
                else {
                    this.text = "Blend Effects: OFF";
                }
            }
        }),
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Glow: ON", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Toggles glow effects. Disable for better performance");

                    settings.glow = !settings.glow;
                    showMenuSettings();
                }
            },
            tick() {
                if (settings.glow == true) {
                    this.text = "Glow: ON";
                }
                else {
                    this.text = "Glow: OFF";
                }
            }
        }),
    ]

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Controls
    menuSettingsControls = [
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Joystick", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Gives you a joystick to move on the map");

                    if (settings.joystick == true) {
                        settings.joystick = false;
                    }
                    else {
                        settings.joystick = true;
                    }
                    showMenuSettings();
                }
            },
            tick() {
                if (settings.joystick == true) {
                    this.text = "Joystick";
                }
                else {
                    this.text = "WalkPad";
                }
            }
        }),
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "WalkPad Size: 32", alpha: 0,
            tick() {
                this.text = "WalkPad Size: " + Math.max(50, settings.walkPadSize * 100) + "%";
            }
        }),
        controls.button({
            anchor: [0.5, 0], sizeAnchor: [0.04, 0.1],
            text: "-", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Adjust size of the walk pad");

                    settings.walkPadSize -= 1;
                    if (settings.walkPadSize < 0) settings.walkPadSize = 2;
                    showMenuSettings();
                }
            }
        }),
        controls.button({
            anchor: [0.76, 0], sizeAnchor: [0.04, 0.1],
            text: "+", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Adjust size of the walk pad");

                    settings.walkPadSize += 1;
                    if (settings.walkPadSize > 2) settings.walkPadSize = 0;
                    showMenuSettings();
                }
            }
        })
    ]

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Audio

    menuSettingsAudio = [
        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Music Volume: 50%", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Adjust music volume");
                }
            },
            tick() {
                this.text = "Music Volume: " + Math.round(settings.musicVolume * 100) + "%";
            }
        }),
        controls.button({
            anchor: [0.5, 0], sizeAnchor: [0.04, 0.1],
            text: "-", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    settingDesc("Adjust music volume");

                    if (settings.musicVolume > 0) {
                        settings.musicVolume = settings.musicVolume - 0.05;
                        if (settings.musicVolume < 0) settings.musicVolume = 0;
                        musicPlayer.volume = settings.musicVolume;
                        showMenuSettings();
                    }
                }
            }
        }),
        controls.button({
            anchor: [0.76, 0], sizeAnchor: [0.04, 0.1],
            text: "+", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    settingDesc("Adjust music volume");

                    if (settings.musicVolume < 0.99) {
                        settings.musicVolume = settings.musicVolume + 0.05;
                        if (settings.musicVolume > 1) settings.musicVolume = 1;
                        musicPlayer.volume = settings.musicVolume;
                        showMenuSettings();
                    }
                }
            }
        }),

        controls.button({
            anchor: [0.55, 0], sizeAnchor: [0.2, 0.1],
            text: "Sound Volume: 50%", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    playSound("buttonClickSound");
                    settingDesc("Adjust sound effect volume");
                }
            },
            tick() {
                this.text = "Sound Volume: " + Math.round(settings.soundVolume * 100) + "%";
            }
        }),
        controls.button({
            anchor: [0.5, 0], sizeAnchor: [0.04, 0.1],
            text: "-", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    settingDesc("Adjust sound effect volume");

                    if (settings.soundVolume > 0) {
                        settings.soundVolume = settings.soundVolume - 0.05;
                        if (settings.soundVolume < 0) settings.soundVolume = 0;
                        changeSoundVolume(settings.soundVolume);
                        showMenuSettings();
                    }
                }
            }
        }),
        controls.button({
            anchor: [0.76, 0], sizeAnchor: [0.04, 0.1],
            text: "+", alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    settingDesc("Adjust sound effect volume");
                    
                    if (settings.soundVolume < 0.99) {
                        settings.soundVolume = settings.soundVolume + 0.05;
                        if (settings.soundVolume > 1) settings.soundVolume = 1;
                        changeSoundVolume(settings.soundVolume);
                        showMenuSettings();
                    }
                }
            }
        }),
    ]

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for (i = 0; i < menuSettings.length; i++) {
        menuSettings[i].alpha = 1;
    }

    function showMenuSettings(blink = true) {
        for (i = 0; i < menuSettingsGameplay.length; i++) {
            menuSettingsGameplay[i].alpha = 0;
        }
        for (i = 0; i < menuSettingsGraphics.length; i++) {
            menuSettingsGraphics[i].alpha = 0;
        }
        for (i = 0; i < menuSettingsControls.length; i++) {
            menuSettingsControls[i].alpha = 0;
        }
        for (i = 0; i < menuSettingsAudio.length; i++) {
            menuSettingsAudio[i].alpha = 0;
        }

        let categoryEntries = "";
        if (settingsCategory == "gameplay") categoryEntries = menuSettingsGameplay;
        if (settingsCategory == "graphics") categoryEntries = menuSettingsGraphics;
        if (settingsCategory == "controls") categoryEntries = menuSettingsControls;
        if (settingsCategory == "audio") categoryEntries = menuSettingsAudio;

        let c = 0;
        for (i = 0; i < categoryEntries.length; i++) {
            if (categoryEntries[i].anchor[0] == 0.55) {
                c = 0;
                for (j = 0; j < i; j++) {
                    if (categoryEntries[i].anchor[0] == categoryEntries[j].anchor[0] && (categoryEntries[j].anchor[1] - baseY) / cY >= c) c = 1 + ((categoryEntries[j].anchor[1] - baseY) / cY);
                }
            }
            categoryEntries[i].anchor[1] = baseY + (c * cY);

            categoryEntries[i].alpha = 1;
            if (categoryEntries[i].tick != undefined) categoryEntries[i].tick();
        }

        if (blink && settingsSaveText.alpha == 0) blinkButton(saveChanges, () => settingsSaveText.alpha > 0);
    }

    showMenuSettings(false);
    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            
        },
        // Controls
        controls: [
            ...background,
            ...menuSettings, ...menuSettingsGameplay, ...menuSettingsGraphics, ...menuSettingsControls, ...menuSettingsAudio,
            settingsSaveText, saveChanges
        ],
        name: "settings"
    }
}
*/