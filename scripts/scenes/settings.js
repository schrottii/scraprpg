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
            if (previousScene == "inventory") fadeOut(500, true, () => setScene(scenes.inventory()));
            if (previousScene == "title") fadeOut(750, false, () => setScene(scenes.title()));
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
                showMenuSettings();
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
                showMenuSettings();
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
                showMenuSettings();
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
                showMenuSettings();
            }
        }
    }));
    menuSettings.push(controls.button({
        anchor: [0.175, 0.9], sizeAnchor: [0.1, 0.075],
        text: "Back", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (previousScene == "inventory") fadeOut(500, true, () => setScene(scenes.inventory()));
                if (previousScene == "title") fadeOut(750, false, () => setScene(scenes.title()));
            }
        }
    }));

    menuSettings.push(controls.button({
        anchor: [0.675, 0.9], sizeAnchor: [0.1, 0.075],
        text: "Save Changes", alpha: 0,
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
    }));

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Gameplay

    menuSettingsGameplay = [
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

                    if (settings.musicVolume > 0.01) {
                        settings.musicVolume = settings.musicVolume - 0.05;
                        if (settings.musicVolume < 0) settings.musicVolume = 0;
                        musicPlayer.volume = settings.musicVolume;
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

                    if (settings.soundVolume > 0.01) {
                        settings.soundVolume = settings.soundVolume - 0.05;
                        if (settings.soundVolume < 0) settings.soundVolume = 0;
                        changeSoundVolume(settings.soundVolume);
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
                    }
                }
            }
        }),
    ]

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for (i = 0; i < menuSettingsAudio.length; i++) {
        menuSettings[i].alpha = 1;
    }

    function showMenuSettings() {
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
    }

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            showMenuSettings();
        },
        // Controls
        controls: [
            ...background,
            ...menuSettings, ...menuSettingsGameplay, ...menuSettingsGraphics, ...menuSettingsControls, ...menuSettingsAudio,
            settingsSaveText,
        ],
        name: "settings"
    }
}