scenes.magicscene = () => {
    var background = [];
    var itemsText = [];
    var itemsImages = [];
    var itemsButtons = [];
    var theTop = [];
    var pageButtons = [];
    var storyonly = false;

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
    background.push(controls.rect({ // horizontal 1
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vertical 3
        anchor: [0.6, 0.01], sizeAnchor: [0.005, 0.1],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Magic",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    // The top
    theTop.push(controls.label({
        anchor: [0.405, 0.06],
        text: "EP: ",
        align: "left", fontSize: 32, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.label({
        anchor: [0.505, 0.06],
        text: "0",
        align: "right", fontSize: 32, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.rect({
        anchor: [0.6, 0.05], sizeAnchor: [0.3, 0.05],
        alpha: 0,
        onClick(args) {
            playSound("buttonClickSound");
            let i = game.chars.indexOf(characterSelected);

            if (game.chars[i + 1] != undefined) characterSelected = game.chars[i + 1];
            else characterSelected = game.chars[0];

            theTop[3].text = game.characters[characterSelected].name;
            showItems();
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.705, 0.06],
        text: "Bleu",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

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
            if (itemPage < Object.keys(game.characters[characterSelected].magic).length / 32) {
                itemPage++;
                showItems();
            }
        },
        text: "->",
        fill: "white"
    }));

    // Coming from status
    if (globalSelectedCharacter != "") {
        characterSelected = globalSelectedCharacter;
        theTop[3].text = game.characters[globalSelectedCharacter].name;
        globalSelectedCharacter = "";
    }

    // Items n stuff
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 8; j++) {
            itemsImages.push(controls.image({
                anchor: [0.075 + (0.21 * i), 0.205 + (0.1 * j)], sizeOffset: [64, 64], offset: [-32, -32],
                source: "gear",
                alpha: 0
            }));

            itemsButtons.push(controls.button({
                anchor: [0.105 + (0.21 * i), 0.165 + (0.1 * j)], sizeAnchor: [0.15, 0.08],
                text: " ",
                idx: j + (i * 6),
                fillTop: "lightgray", fillBottom: "gray",
                pressedTop: "darkgray", pressedBottom: "gray",
                alpha: 1,
                onClick(args) {
                    if (this.fillTop == "lightgray") {
                        playSound("no");
                    }
                    else {
                        let itemOffset = itemPage * 12;
                        let item = this.item;

                        if (magic[item] != undefined) {
                            if (magic[item]().story != true) {
                                if (game.characters[characterSelected].EP >= magic[item]().cost) {
                                    magic[item]({ player: game.characters[characterSelected] }).effect();
                                    game.characters[characterSelected].EP -= magic[item]().cost;
                                }
                            }
                        }
                        showItems();
                    }
                }
            }));
        }
    }

    function showItems() {
        let itemOffset = itemPage * 32;

        let inventory = game.characters[characterSelected].magic;

        for (i = 0; i < 32; i++) {
            itemsButtons[i].alpha = 1;
            if (inventory[i + itemOffset] == undefined) {
                itemsButtons[i].text = "---";
                itemsButtons[i].fillTop = "lightgray";
                itemsButtons[i].fillBottom = "gray";
                itemsImages[i].alpha = 0;
                continue;
            }

            let mag = magic[inventory[i + itemOffset]];
            itemsButtons[i].text = mag().name + " (" + mag().cost + " EP)";
            
            itemsImages[i].alpha = 1;
            itemsImages[i].source = mag().source;

            if (mag().battleonly != true) {
                itemsButtons[i].item = inventory[i + itemOffset];

                if (game.characters[characterSelected].EP >= mag().cost) itemsButtons[i].fill = "green";
                else itemsButtons[i].fill = "gray";

                itemsButtons[i].fillTop = colors.buttontop;
                itemsButtons[i].fillBottom = colors.buttonbottom;
                itemsButtons[i].pressedTop = colors.buttontoppressed;
                itemsButtons[i].pressedBottom = colors.buttonbottompressed;
                itemsButtons[i].alpha = 1;
            }
            else {
                itemsButtons[i].fillTop = "orange";
                itemsButtons[i].fillBottom = "red";
                //if (mag().story != storyonly) j -= 1;
            }
        }
    }
    showItems();

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            theTop[1].text = game.characters[characterSelected].EP + "/" + getStat(characterSelected, "maxEP");
        },
        // Controls
        controls: [
            ...background, ...itemsButtons, ...itemsImages, ...theTop, ...pageButtons
        ],
        name: "magic"
    }
}