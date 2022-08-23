scenes.equipment = () => {
    var background = [];
    var itemsButtons = [];
    var itemsText = [];
    var equipmentDisplay = [];
    var equipmentChangeDisplay = [];
    var itemPage = 0;

    // Background
    background.push(controls.image({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 1,
        source: "blurry"
        //fill: "brown"
    }));
    background.push(controls.rect({
        anchor: [0.04, 0.04], sizeAnchor: [0.92, 0.92],
        alpha: 1,
        fill: "black"
    }));
    background.push(controls.rect({
        anchor: [0.05, 0.05], sizeAnchor: [0.9, 0.9],
        alpha: 1,
        fill: "lightsalmon"
    }));
    background.push(controls.button({
        anchor: [0.9, 0.05], sizeAnchor: [0.05, 0.05],
        alpha: 1,
        onClick(args) {
            setScene(scenes.inventory());
        },
        text: ">",
        fill: "white"
    }));
    background.push(controls.rect({ // horizontal 1
        anchor: [0.05, 0.1], sizeAnchor: [0.9, 0.01],
        alpha: 1,
        fill: "black"
    }));
    background.push(controls.rect({ // vert middle
        anchor: [0.55, 0.1], sizeAnchor: [0.005, 0.86],
        fill: "black",
        alpha: 1
    }));
    background.push(controls.rect({ // horizontal 2
        anchor: [0.05, 0.7], sizeAnchor: [0.9, 0.01],
        alpha: 1,
        fill: "black"
    }));
    background.push(controls.rect({ // vert items
        anchor: [0.75, 0.1], sizeAnchor: [0.005, 0.6],
        fill: "black",
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
                        if (type != false) game.characters["bleu"].equipment[type] = items[inventory[this.idx + itemOffset]].name;
                    }
                }
            }));
        }
    }

    equipmentDisplay.push(controls.label({
        anchor: [0.3, 0.15],
        text: "Blez",
        align: "center", fontSize: 32, fill: "black",
        alpha: 1
    }));
    for (i = 0; i < 6; i++) {
        equipmentDisplay.push(controls.label({
            anchor: [0.06, 0.2 + (0.04 * i)],
            text: ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i] + ": None",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }
    for (i = 0; i < 6; i++) {
        equipmentChangeDisplay.push(controls.label({
            anchor: [0.06, 0.44 + (0.04 * i)],
            text: "Total " + ["STR", "DEF", "AGI", "EVA", "CRT", "LUK"][i] + " changed: None",
            align: "left", fontSize: 20, fill: "black",
            alpha: 1
        }));
    }


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
                if (items[inventory[i + itemOffset]]().type != false) itemsText[i].fill = "black";
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

    showItems();

    return {
        // Pre-render function
        preRender(ctx, delta) {
            for (i in equipmentDisplay) {
                if (i == 0) equipmentDisplay[0].text = "Blez";
                else {
                    let part = ["head", "body", "lhand", "rhand", "acc1", "acc2"][i - 1];
                    if (game.characters["bleu"].equipment[part] != "none") equipmentDisplay[i].text = ["Head", "Body", "L. Hand", "R. Hand", "Acc. 1", "Acc. 2"][i - 1] + ": " + items[game.characters["bleu"].equipment[part]]().name;
                }
            }
            for (i in equipmentChangeDisplay) {
                let part = ["STR", "DEF", "AGI", "EVA", "CRT", "LUK"][i];
                let partb = ["strength", "def", "agi", "eva", "crt", "luk"][i];
                let itemBonus = 0;
                for (EQ in game.characters["bleu"].equipment) {
                    if (game.characters["bleu"].equipment[EQ] != "none") if (items[game.characters["bleu"].equipment[EQ]]().stats[partb] != undefined) itemBonus += items[game.characters["bleu"].equipment[EQ]]().stats[partb];
                }
                equipmentChangeDisplay[i].text = "Total" + part + " changed: " + itemBonus;
            }
        },
        // Controls
        controls: [
            ...background, ...itemsButtons, ...itemsText, ...equipmentDisplay, ...equipmentChangeDisplay,
        ],
    }
}