scenes.status = (characterSelected="Bleu") => {
    var background = [];
    var characterName = [];
    var characterStats = [];
    var characterBars = [];
    var buttons = [];

    var equipmentDisplay = [];
    var elementDisplay = [];
    var immunityDisplay = [];

    var tinder = [];

    characterSelectedName = game.characters[characterSelected].name;
    nr = game.chars.indexOf(characterSelected) + 1;

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

    // Name stuff
    characterName.push(controls.label({
        anchor: [0.05, 0.2],
        align: "left", fontSize: 32, fill: "black",
        text: characterSelectedName,
        alpha: 1,
    }));

    characterName.push(controls.label({
        anchor: [0.05, 0.2], offset: [0, 48],
        align: "left", fontSize: 24, fill: "black",
        text: "Level 55 Aladdin",
        alpha: 1,
    }));

    let characterImage = controls.image({
        anchor: [0.3, 0.2], sizeOffset: [128, 128], snip: getEmotion("neutral"),
        source: "Portraits_" + characterSelectedName,
        alpha: 1,
    });

    for (j = 0; j < 2; j++) {
        for (i = 0; i < 4; i++) {
            characterStats.push(controls.label({
                anchor: [0.05 + (0.1 * j), 0.3], offset: [0, 30 * i],
                align: "left", fontSize: 24, fill: "black",
                text: "STR - 0",
                alpha: 1,
            }));
        }
    }


    characterBars.push(controls.rect({
        anchor: [0.05, 0.495], sizeAnchor: [0.4, 0.025],
        fill: "rgb(63, 127, 63)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({ // The bg behind the bar
        anchor: [0.052, 0.497], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(5, 51, 5)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({
        anchor: [0.052, 0.497], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(128, 128, 128)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({ // Loss
        anchor: [0.052, 0.497], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(200, 204, 200)",
        alpha: 0
    }))

    characterBars.push(controls.rect({
        anchor: [0.05, 0.535], sizeAnchor: [0.4, 0.025],
        fill: "rgb(30, 109, 30)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({ // The bg behind the bar
        anchor: [0.052, 0.537], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(51, 0, 51)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({
        anchor: [0.052, 0.537], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(85, 85, 85)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({ // Loss
        anchor: [0.052, 0.537], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(255, 255, 255)",
        alpha: 0
    }))

    characterBars.push(controls.rect({
        anchor: [0.05, 0.575], sizeAnchor: [0.4, 0.025],
        fill: "rgb(154, 154, 12)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({ // The bg behind the bar
        anchor: [0.052, 0.577], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(51, 0, 51)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({
        anchor: [0.052, 0.577], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(85, 85, 85)",
        alpha: 1 // 1
    }))
    characterBars.push(controls.rect({ // Loss
        anchor: [0.052, 0.577], sizeAnchor: [0.3960, 0.0210],
        fill: "rgb(255, 255, 255)",
        alpha: 0
    }))

    characterBars.push(controls.label({
        anchor: [0.45, 0.509],
        fill: "white", align: "right", fontSize: 20,
        text: "0",
        alpha: 1
    }))
    characterBars.push(controls.label({
        anchor: [0.45, 0.549],
        fill: "white", align: "right", fontSize: 20,
        text: "5/5",
        alpha: 1
    }))
    characterBars.push(controls.label({
        anchor: [0.45, 0.589],
        fill: "white", align: "right", fontSize: 20,
        text: "5/5",
        alpha: 1
    }))


    // Buttons
    buttons.push(controls.button({
        anchor: [0.05, 0.625], sizeAnchor: [0.4, 0.1],
        text: "Evolution Tree (0 Skill Points)",
        alpha: 1,
    }));
    buttons.push(controls.button({
        anchor: [0.05, 0.75], sizeAnchor: [0.4, 0.1],
        text: "View Magic",
        alpha: 1,
    }));
    buttons.push(controls.button({
        anchor: [0.05, 0.875], sizeAnchor: [0.4, 0.1],
        text: "View Mastery Techniques",
        alpha: 1,
    }));

    // Equipment
    for (i = 0; i < 6; i++) {
        equipmentDisplay.push(controls.label({
            anchor: [0.5, 0.5 + (0.04 * i)],
            text: ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i] + ": None",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }

    // Element
    elementDisplay.push(controls.label({
        anchor: [0.5, 0.75],
        text: "Element:",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));
    elementDisplay.push(controls.label({
        anchor: [0.5, 0.79],
        text: getStat(characterSelected, "element"),
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));

    // Immune
    immunityDisplay.push(controls.label({
        anchor: [0.8, 0.5],
        text: "Immune to:",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));
    for (i = 0; i < 6; i++) {
        immunityDisplay.push(controls.label({
            anchor: [0.8, 0.54 + (0.04 * i)],
            text: "...",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }

    function updateImmunities() {
        let immunes = [];
        for (i in game.characters[characterSelected].equipment) {
            if (game.characters[characterSelected].equipment[i] != "none") {
                if (items[game.characters[characterSelected].equipment[i]]().stats.immune != undefined) {
                    for (e in items[game.characters[characterSelected].equipment[i]]().stats.immune) {
                        immunes.push(items[game.characters[characterSelected].equipment[i]]().stats.immune[e]);
                    }
                }
            }
        }
        for (r = 1; r < 7; r++) {
            if (immunes[r - 1] != undefined) immunityDisplay[r].text = immunes[r - 1];
            else immunityDisplay[r].text = "...";
        }
    }
    updateImmunities();

    tinder.push(controls.label({
        anchor: [0.5, 0.85],
        text: "Compatible Duo Mastery Technique Partners:",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));
    tinder.push(controls.label({
        anchor: [0.5, 0.89],
        text: "Corelle, Aspen, Go, Skrau",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));

    fadeIn(500, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            // Barz
            characterBars[2].fill = "rgb(20, 204, 20)";
            if (getPlayer(nr).HP > 0) characterBars[2].sizeAnchor[0] = 0.3960 * (getPlayer(nr).HP / getStat(getPlayer(nr).name.toLowerCase(), "maxHP"));
            else characterBars[2].sizeAnchor[0] = 0.00001;
            characterBars[6].fill = "rgb(205, 0, 205)";
            characterBars[10].fill = "rgb(205, 205, 0)";

            if (getPlayer(nr).HP > 0) characterBars[6].sizeAnchor[0] = 0.3960 * ((0.00001 + getPlayer(nr).EP) / getStat(getPlayer(nr).name.toLowerCase(), "maxEP"));
            else characterBars[6].sizeAnchor[0] = 0.00001


            if (getPlayer(nr).EXP > 0) characterBars[10].sizeAnchor[0] = 0.3960 * ((0.00001 + getPlayer(nr).EXP) / 25);
            else characterBars[10].sizeAnchor[0] = 0.00001;

            characterBars[12].text = getPlayer(nr).HP + "/" + getStat(getPlayer(1).name.toLowerCase(), "maxHP");
            characterBars[13].text = getPlayer(nr).EP + "/" + getStat(getPlayer(1).name.toLowerCase(), "maxEP");
            characterBars[14].text = getPlayer(nr).EXP + "/" + 25;

            // characterStats
            for (i in characterStats) {
                let part = ["STR", "DEF", "AGI", "EVA", "INT", "WIS", "LUK", "ACC"][i];
                let partb = ["strength", "def", "agi", "eva", "int", "wis", "luk", "acc"][i];
                characterStats[i].text = part + " - " + getStat(characterSelected, partb);
            }

            // Equipment
            for (i in equipmentDisplay) {
                if (i == 0) equipmentDisplay[0].text = "Equipping";
                else {
                    let part = ["head", "body", "lhand", "rhand", "acc1", "acc2"][i - 1];
                    if (game.characters[characterSelected].equipment[part] != "none") equipmentDisplay[i].text = ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i - 1] + ": " + items[game.characters[characterSelected].equipment[part]]().name;
                    else equipmentDisplay[i].text = ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i - 1] + ": None";
                }
            }
        },
        // Controls
        controls: [
            ...background,
            ...characterName, characterImage, ...characterStats,
            ...characterBars, ...buttons, ...equipmentDisplay, ...elementDisplay, ...immunityDisplay, ...tinder
        ],
        name: "status"
    }
}