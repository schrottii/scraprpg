scenes.settings = () => {
    var background = [];
    var menuSettings = [];
    var settingsCategory = "gameplay";
    var menuSettingsGameplay = [];
    var menuSettingsGraphics = [];
    var menuSettingsAudio = [];

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
            setScene(scenes.inventory());
        },
        text: ">",
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

    menuSettings.push(controls.label({
        anchor: [0.225, 0.1], offset: [0, -24],
        align: "center", fontSize: 48, fill: "black",
        text: "Settings", alpha: 0,
    }));

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
        text: "Audio", alpha: 0,
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
                setScene(scenes.inventory());
            }
        }
    }));
    
    menuSettings.push(controls.button({
        anchor: [0.675, 0.9], sizeAnchor: [0.1, 0.075],
        text: "Save Changes", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                saveSettings();
                addAnimator(function (t) {
                    playSound("buttonClickSound");
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
    
    // Gameplay

    menuSettingsGameplay.push(controls.button({
        anchor: [0.55, 0.25], sizeAnchor: [0.2, 0.1],
        text: "Autosave: ON", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.autosave == true) {
                    settings.autosave = false;
                }
                else {
                    settings.autosave = true;
                }
                showMenuSettings();
            }
        }
    }));

    // Graphics

    menuSettingsGraphics.push(controls.button({
        anchor: [0.55, 0.25], sizeAnchor: [0.2, 0.1],
        text: "Grid: ON", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.grid == true) {
                    settings.grid = false;
                }
                else {
                    settings.grid = true;
                }
                showMenuSettings();
            }
        }
    }));
    menuSettingsGraphics.push(controls.button({
        anchor: [0.55, 0.4], sizeAnchor: [0.2, 0.1],
        text: "Joystick", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.joystick == true) {
                    settings.joystick = false;
                }
                else {
                    settings.joystick = true;
                }
                showMenuSettings();
            }
        }
    }));

    // Audio

    menuSettingsAudio.push(controls.button({
        anchor: [0.55, 0.25], sizeAnchor: [0.2, 0.1],
        text: "Music Volume: 50%", alpha: 0,
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.5, 0.25], sizeAnchor: [0.04, 0.1],
        text: "-", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.musicVolume > 0.01) {
                    settings.musicVolume = settings.musicVolume - 0.05;
                    if (settings.musicVolume < 0) settings.musicVolume = 0;
                    musicPlayer.volume = settings.musicVolume;
                    showMenuSettings(); //Update
                }
            }
        }
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.76, 0.25], sizeAnchor: [0.04, 0.1],
        text: "+", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.musicVolume < 0.99) {
                    settings.musicVolume = settings.musicVolume + 0.05;
                    if (settings.musicVolume > 1) settings.musicVolume = 1;
                    musicPlayer.volume = settings.musicVolume;
                    showMenuSettings(); //Update
                }
            }
        }
    }));

    menuSettingsAudio.push(controls.button({
        anchor: [0.55, 0.375], sizeAnchor: [0.2, 0.1],
        text: "Sound Volume: 50%", alpha: 0,
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.5, 0.375], sizeAnchor: [0.04, 0.1],
        text: "-", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.soundVolume > 0.01) {
                    settings.soundVolume = settings.soundVolume - 0.05;
                    if (settings.soundVolume < 0) settings.soundVolume = 0;
                    changeSoundVolume(settings.soundVolume);
                    showMenuSettings(); //Update
                }
            }
        }
    }));
    menuSettingsAudio.push(controls.button({
        anchor: [0.76, 0.375], sizeAnchor: [0.04, 0.1],
        text: "+", alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                if (settings.soundVolume < 0.99) {
                    settings.soundVolume = settings.soundVolume + 0.05;
                    if (settings.soundVolume > 1) settings.soundVolume = 1;
                    changeSoundVolume(settings.soundVolume);
                    showMenuSettings(); //Update
                }
            }
        }
    }));



    function showMenuSettings() {
        menuSettingsAudio[0].text = "Music Volume: " + Math.round(settings.musicVolume * 100) + "%";
        menuSettingsAudio[3].text = "Sound Volume: " + Math.round(settings.soundVolume * 100) + "%";

        for (i = 0; i < menuSettings.length; i++) {
            menuSettings[i].alpha = 1;
        }
        if (settingsCategory == "gameplay") {
            if (settings.autosave == true) {
                menuSettingsGameplay[0].text = "Autosave: ON";
            }
            else {
                menuSettingsGameplay[0].text = "Autosave: OFF";
            }
            for (i = 0; i < menuSettingsGameplay.length; i++) {
                menuSettingsGameplay[i].alpha = 1;
            }
        }
        else {
            for (i = 0; i < menuSettingsGameplay.length; i++) {
                menuSettingsGameplay[i].alpha = 0;
            }
        }
        if (settingsCategory == "graphics") {
            if (settings.grid == true) {
                menuSettingsGraphics[0].text = "Grid: ON";
            }
            else {
                menuSettingsGraphics[0].text = "Grid: OFF";
            }
            if (settings.joystick == true) {
                menuSettingsGraphics[1].text = "Joystick";
            }
            else {
                menuSettingsGraphics[1].text = "WalkPad";
            }
            for (i = 0; i < menuSettingsGraphics.length; i++) {
                menuSettingsGraphics[i].alpha = 1;
            }
        }
        else {
            for (i = 0; i < menuSettingsGraphics.length; i++) {
                menuSettingsGraphics[i].alpha = 0;
            }
        }
        if (settingsCategory == "audio") {
            for (i = 0; i < menuSettingsAudio.length; i++) {
                menuSettingsAudio[i].alpha = 1;
            }
        }
        else {
            for (i = 0; i < menuSettingsAudio.length; i++) {
                menuSettingsAudio[i].alpha = 0;
            }
        }
    }
    showMenuSettings();


    // Default black fade transition
    let blackFadeTransition = controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1], // (fullscreen)
        fill: "black",
        alpha: 1
    })
    addAnimator(function (t) {
        blackFadeTransition.alpha = 1 - (t / 200);
        if (t > 499) {
            blackFadeTransition.alpha = 0;
            return true;
        }
        return false;
    })
    // black fade transition end

    return {
        // Pre-render function
        preRender(ctx, delta) {

        },
        // Controls
        controls: [
            ...background,
            ...menuSettings, ...menuSettingsGameplay, ...menuSettingsGraphics, ...menuSettingsAudio, 
            settingsSaveText,
            blackFadeTransition
        ],
    }
}