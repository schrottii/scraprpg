scenes.equipment = () => {
    var background = [];
    var itemsButtons = [];
    var itemsImages = [];
    var pageButtons = [];

    var equipmentDisplay = [];
    var equipmentChangeDisplay = [];
    var finalStatsDisplay = [];
    var immunityDisplay = [];

    var characterPreview = [];
    var itemPage = 0;

    var characterSelected = "bleu";

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
        text: ">",
        fill: "white"
    }));
    background.push(controls.rect({
        anchor: [0.55, 0.1], sizeAnchor: [0.44, 0.6],
        fill: colors.buttontoppressed,
        alpha: 1
    }));
    background.push(controls.rect({ // horizontal 1
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vert middle
        anchor: [0.55, 0.1], sizeAnchor: [0.005, 0.9],
        fill: colors.bottomcolor,
        alpha: 1
    }));
    background.push(controls.rect({ // horizontal 2
        anchor: [0.01, 0.7], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vert items
        anchor: [0.75, 0.1], sizeAnchor: [0.005, 0.6],
        fill: colors.bottomcolor,
        alpha: 1
    }));
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Equipment",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 6; j++) {
            itemsButtons.push(controls.button({
                anchor: [0.4 + (0.2 * i), 0.1 + (0.1 * j)], sizeAnchor: [0.2, 0.1],
                fill: "black",
                idx: j + (i * 6),
                fillTop: "lightgray", fillBottom: "gray",
                pressedTop: "darkgray", pressedBottom: "gray",
                alpha: 1,
                onClick(args) {
                    let itemOffset = itemPage * 18;
                    let inventory = Object.keys(game.inventory);
                    if (items[inventory[this.idx + itemOffset]] != undefined) {
                        let type = items[inventory[this.idx + itemOffset]]().piece;
                        if (inventory[this.idx + itemOffset] == game.characters[characterSelected].equipment[items[inventory[this.idx + itemOffset]]().piece]) { // Equipped
                            game.characters[characterSelected].equipment[type] = "none";
                        }
                        else {
                            if (type != false) game.characters[characterSelected].equipment[type] = items[inventory[this.idx + itemOffset]].name;
                        }
                        showItems();
                        updateImmunities();
                    }
                }
            }));
            itemsImages.push(controls.image({
                anchor: [0.4 + (0.2 * i), 0.1 + (0.1 * j)], sizeOffset: [32, 32], offset: [0, 32],
                source: "gear",
                alpha: 0
            }));
        }
    }

    // Page Buttons
    pageButtons.push(controls.button({
        anchor: [0, 0.9], sizeAnchor: [0.05, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            if (itemPage > 0) {
                itemPage--;
                showItems();
            }
        },
        text: "<-",
        fill: "white"
    }));
    pageButtons.push(controls.button({
        anchor: [0.95, 0.9], sizeAnchor: [0.05, 0.1], fontSize: 60,
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            if (itemPage < Object.keys(game.inventory).length / 24) {
                itemPage++;
                showItems();
            }
        },
        text: "->",
        fill: "white"
    }));



    equipmentDisplay.push(controls.label({
        anchor: [0.2, 0.15],
        text: "Blez",
        align: "center", fontSize: 32, fill: "black",
        alpha: 1
    }));
    for (i = 0; i < 6; i++) {
        equipmentDisplay.push(controls.label({
            anchor: [0.02, 0.2 + (0.04 * i)],
            text: ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i] + ": None",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }
    for (i = 0; i < 6; i++) {
        equipmentChangeDisplay.push(controls.label({
            anchor: [0.02, 0.44 + (0.04 * i)],
            text: "Total " + ["STR", "DEF", "AGI", "EVA", "CRT", "LUK"][i] + " changed: None",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }

    finalStatsDisplay.push(controls.label({
        anchor: [0.56, 0.725],
        text: "Blez Final Stat Overview:",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));
    for (i = 0; i < 6; i++) {
        finalStatsDisplay.push(controls.label({
            anchor: [0.56, 0.755 + (0.03 * i)],
            text: ["STR", "DEF", "AGI", "EVA", "CRT", "LUK"][i] + " - ",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }
    immunityDisplay.push(controls.label({
        anchor: [0.76, 0.725],
        text: "Immune to:",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1
    }));
    for (i = 0; i < 6; i++) {
        immunityDisplay.push(controls.label({
            anchor: [0.76, 0.755 + (0.03 * i)],
            text: "...",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }

    background.push(controls.button({
        anchor: [0.05, 0.15], sizeAnchor: [0.05, 0.05], offset: [0, -24],
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            let i = game.chars.indexOf(characterSelected);
            if (game.chars[i - 1] != undefined) characterSelected = game.chars[i - 1];
            else characterSelected = game.chars[game.chars.length - 1];
            showItems();
            updateImmunities();
        },
        text: "<",
        fill: "white"
    }));
    background.push(controls.button({
        anchor: [0.3, 0.15], sizeAnchor: [0.05, 0.05], offset: [0, -24],
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            let i = game.chars.indexOf(characterSelected);
            if (game.chars[i + 1] != undefined) characterSelected = game.chars[i + 1];
            else characterSelected = "bleu";
            showItems();
            updateImmunities();
        },
        text: ">",
        fill: "white"
    }));

    // Character preview
    // character, body, head, left hand, right hand
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [128, 128], offset: [-64, -64],
        source: "bleu", snip: [0, 0, 32, 32],
        alpha: 1
    }));
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [128, 128], offset: [-64, -64],
        source: "items/body_chemical",
        alpha: 1
    }));
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [128, 128], offset: [-64, -64],
        source: "items/head_chemical",
        alpha: 1
    }));
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [64, 64], offset: [-80, 0],
        source: "items/shield_chemical",
        alpha: 1
    }));
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [64, 64], offset: [16, 0],
        source: "items/sword_chemical",
        alpha: 1
    }));
    // acc 1. 2
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [64, 64], offset: [-80, -128],
        source: "items/crystal_strength",
        alpha: 1
    }));
    characterPreview.push(controls.image({
        anchor: [0.3, 0.5], sizeOffset: [64, 64], offset: [16, -128],
        source: "items/crystal_strength",
        alpha: 1
    }));



    function showItems() {
        let itemOffset = itemPage * 18
        let inventory = Object.keys(game.inventory);

        for (i = 0; i < itemsButtons.length; i++) {
            itemsButtons[i].alpha = 0;
            itemsImages[i].alpha = 0;

            if (inventory[i + itemOffset] == undefined) {
                itemsButtons[i].text = "---";
                itemsButtons[i].fill = "white";
                continue;
            }
            if (game.inventory[items[inventory[i + itemOffset]].name] > 0) {
                itemsButtons[i].item = items[inventory[i + itemOffset]];
                if (game.inventory[items[inventory[i + itemOffset]].name] > 1) itemsButtons[i].text = items[inventory[i + itemOffset]]().name + " x" + game.inventory[items[inventory[i + itemOffset]].name];
                else itemsButtons[i].text = items[inventory[i + itemOffset]]().name;

                if (inventory[i + itemOffset] == game.characters[characterSelected].equipment[items[inventory[i + itemOffset]]().piece]) {
                    // Equipped
                    itemsButtons[i].fillTop = "lime";
                    itemsButtons[i].fillBottom = "green";
                }
                else if (items[inventory[i + itemOffset]]().piece != "none") {
                    // Can be equipped
                    itemsButtons[i].fillTop = colors.buttontop;
                    itemsButtons[i].fillBottom = colors.buttonbottom;
                    itemsButtons[i].pressedTop = colors.buttontoppressed;
                    itemsButtons[i].pressedBottom = colors.buttonbottompressed;
                }
                else {
                    itemsButtons[i].fillTop = "lightgray";
                    itemsButtons[i].fillBottom = "gray";
                }

                itemsImages[i].source = "items/" + items[inventory[i + itemOffset]]().source;
                itemsButtons[i].alpha = 1;
                itemsImages[i].alpha = 1;
            }
            else {
                itemsButtons[i].fillTop = "lightgray";
                itemsButtons[i].fillBottom = "gray";
            }
        }

        updateCharacterPreview();
    }

    function updateCharacterPreview(){
        let equips = ["body", "head", "lhand", "rhand", "acc1", "acc2"]
        characterPreview[0].source = characterSelected;

        for (let x = 1; x <= 6; x++){
            if (game.characters[characterSelected].equipment[equips[x - 1]] != "none") {
                characterPreview[x].alpha = 1;
                characterPreview[x].source = "items/" + items[game.characters[characterSelected].equipment[equips[x - 1]]]().source;
            }
            else {
                characterPreview[x].alpha = 0;
            }
        }
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

    showItems();
    updateImmunities();

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            for (i in equipmentDisplay) {
                if (i == 0) equipmentDisplay[0].text = game.characters[characterSelected].name;
                else {
                    let part = ["head", "body", "lhand", "rhand", "acc1", "acc2"][i - 1];
                    if (game.characters[characterSelected].equipment[part] != "none") equipmentDisplay[i].text = ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i - 1] + ": " + items[game.characters[characterSelected].equipment[part]]().name;
                    else equipmentDisplay[i].text = ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i - 1] + ": None";
                }
            }
            for (i in equipmentChangeDisplay) {
                let part = ["STR", "DEF", "AGI", "EVA", "CRT", "LUK"][i];
                let partb = ["strength", "def", "agi", "eva", "crt", "luk"][i];
                let itemBonus = 0;
                for (EQ in game.characters[characterSelected].equipment) {
                    if (game.characters[characterSelected].equipment[EQ] != "none") if (items[game.characters[characterSelected].equipment[EQ]]().stats[partb] != undefined) itemBonus += items[game.characters[characterSelected].equipment[EQ]]().stats[partb];
                }
                equipmentChangeDisplay[i].text = "Total " + part + " changed: " + itemBonus;
            }
            for (i in finalStatsDisplay) {
                let part = ["STR", "DEF", "AGI", "EVA", "CRT", "LUK"][i - 1];
                let partb = ["strength", "def", "agi", "eva", "crt", "luk"][i - 1];
                finalStatsDisplay[i].text = part + " - " + getStat(characterSelected, partb);
                if (i == 0) finalStatsDisplay[0].text = game.characters[characterSelected].name + " Final Stat Overview:";
            }
        },
        // Controls
        controls: [
            ...background, ...pageButtons,
            ...itemsButtons, ...itemsImages, ...characterPreview,
            ...equipmentDisplay, ...equipmentChangeDisplay, ...finalStatsDisplay, ...immunityDisplay,
        ],
        name: "equipment"
    }
}