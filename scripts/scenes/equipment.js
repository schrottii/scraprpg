scenes.equipment = () => {
    var background = [];
    var itemsButtons = [];
    var itemsText = [];
    var equipmentDisplay = [];
    var equipmentChangeDisplay = [];
    var finalStatsDisplay = [];
    var immunityDisplay = [];
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

    for (i = 0; i < 2; i++) {
        for (j = 0; j < 6; j++) {
            itemsText.push(controls.label({
                anchor: [0.65 + (0.2 * i), 0.15 + (0.1 * j)],
                fill: "black",
                align: "center", fontSize: 20, fill: "black",
                alpha: 1
            }));
        }
    }
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 6; j++) {
            itemsButtons.push(controls.rect({
                anchor: [0.55 + (0.2 * i), 0.1 + (0.1 * j)], sizeAnchor: [0.2, 0.1],
                fill: "black",
                idx: j + (i * 6),
                alpha: 0,
                onClick(args) {
                    let itemOffset = itemPage * 12;
                    let inventory = Object.keys(game.inventory);
                    if (items[inventory[this.idx + itemOffset]] != undefined) {
                        let type = items[inventory[this.idx + itemOffset]]().type;
                        if (inventory[this.idx + itemOffset] == game.characters[characterSelected].equipment[items[inventory[this.idx + itemOffset]]().type]) { // Equipped
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
        }
    }

    equipmentDisplay.push(controls.label({
        anchor: [0.26, 0.15],
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
        anchor: [0.11, 0.15], sizeAnchor: [0.05, 0.05], offset: [0, -24],
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
        anchor: [0.36, 0.15], sizeAnchor: [0.05, 0.05], offset: [0, -24],
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


    function showItems() {
        let itemOffset = itemPage * 12
        let inventory = Object.keys(game.inventory);
        for (i = 0; i < itemsButtons.length; i++) {
            itemsText[i].alpha = 0;
            if (inventory[i + itemOffset] == undefined) {
                itemsText[i].text = "---";
                itemsText[i].fill = "white";
                continue;
            }
            if (game.inventory[items[inventory[i + itemOffset]].name] > 0) {
                itemsText[i].item = items[inventory[i + itemOffset]];
                if (game.inventory[items[inventory[i + itemOffset]].name] > 1) itemsText[i].text = items[inventory[i + itemOffset]]().name + " x" + game.inventory[items[inventory[i + itemOffset]].name];
                else itemsText[i].text = items[inventory[i + itemOffset]]().name;

                if (inventory[i + itemOffset] == game.characters[characterSelected].equipment[items[inventory[i + itemOffset]]().type]) itemsText[i].fill = "lightgreen"; // Equipped
                else if (items[inventory[i + itemOffset]]().type != false) itemsText[i].fill = "black";
                else itemsText[i].fill = "darkgray";
                itemsText[i].source = "items/" + items[inventory[i + itemOffset]]().source;
                itemsText[i].alpha = 1;
            }
            else {
                itemsText[i].text = "---";
                itemsText[i].fill = "white";
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
        for (r = 1; r < 7; r++ ) {
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
            ...background, ...itemsButtons, ...itemsText, ...equipmentDisplay, ...equipmentChangeDisplay, ...finalStatsDisplay, ...immunityDisplay,
        ],
        name: "equipment"
    }
}