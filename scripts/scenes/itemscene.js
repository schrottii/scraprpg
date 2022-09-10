scenes.itemscene = () => {
    var background = [];
    var itemsText = [];
    var itemsImages = [];
    var itemsButtons = [];
    var theTop = [];
    var storyonly = false;

    var itemPage = 0;
    var characterSelected = "bleu";

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
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({
        anchor: [0.05, 0.05], sizeAnchor: [0.9, 0.9],
        alpha: 1,
        fill: colors.topcolor
    }));
    background.push(controls.button({
        anchor: [0.9, 0.05], sizeAnchor: [0.05, 0.05],
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            setScene(scenes.inventory());
        },
        text: ">",
        fill: "white"
    }));
    background.push(controls.rect({ // horizontal 1
        anchor: [0.05, 0.1], sizeAnchor: [0.9, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vertical 1
        anchor: [0.2, 0.05], sizeAnchor: [0.005, 0.05],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vertical 2
        anchor: [0.4, 0.05], sizeAnchor: [0.005, 0.05],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vertical 3
        anchor: [0.6, 0.05], sizeAnchor: [0.005, 0.05],
        alpha: 1,
        fill: colors.bottomcolor
    }));

    // The top
    theTop.push(controls.rect({
        anchor: [0.05, 0.05], sizeAnchor: [0.15, 0.05],
        alpha: 0,
        onClick(args) {
            playSound("no");
            alert("Not available yet!");
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.125, 0.075],
        text: "Start Cooking",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.rect({
        anchor: [0.25, 0.05], sizeAnchor: [0.15, 0.05],
        alpha: 0,
        onClick(args) {
            playSound("no");
            alert("Not available yet!");
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.325, 0.075],
        text: "Drop",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.rect({
        anchor: [0.45, 0.05], sizeAnchor: [0.15, 0.05],
        alpha: 0,
        onClick(args) {
            playSound("buttonClickSound");
            if (storyonly == false) {
                storyonly = true;
                theTop[5].text = "Key Items";
            }
            else if (storyonly == true) {
                storyonly = false;
                theTop[5].text = "Story Items";
            }
            showItems();
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.525, 0.075],
        text: "Normal Items",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.rect({
        anchor: [0.65, 0.05], sizeAnchor: [0.15, 0.05],
        alpha: 0,
        onClick(args) {
            playSound("buttonClickSound");
            let i = game.chars.indexOf(characterSelected);

            if (game.chars[i + 1] != undefined) characterSelected = game.chars[i + 1];
            else characterSelected = game.chars[0];

            theTop[7].text = game.characters[characterSelected].name;
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.725, 0.075],
        text: "Bleu",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    // Items n stuff
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 8; j++) {
            itemsImages.push(controls.image({
                anchor: [0.06 + (0.2 * i), 0.165 + (0.1 * j)], sizeOffset: [64, 64], offset: [0, -32],
                source: "gear",
                alpha: 0
            }));

            itemsButtons.push(controls.button({
                anchor: [0.125 + (0.21 * i), 0.125 + (0.1 * j)], sizeAnchor: [0.15, 0.08],
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

                        if (items[item] != undefined) {
                            if (items[item]().story != true) {
                                if (game.inventory[item] > 0) {
                                    items[item]({ player: game.characters[characterSelected] }).effect();
                                    removeItem(item, 1);
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
        let inventory = Object.keys(game.inventory);

        let j = 0;

        for (i = 0; i < itemsButtons.length; i++) {
            itemsButtons[i].alpha = 1;
            if (inventory[i + itemOffset] == undefined) {
                itemsButtons[i + j].text = "---";
                itemsButtons[i + j].fillTop = "lightgray";
                itemsButtons[i + j].fillBottom = "gray";
                itemsImages[i + j].alpha = 0;
                continue;
            }
            let item = items[inventory[i + itemOffset]];
            if (game.inventory[items[inventory[i + itemOffset]].name] > 0 && ((item().story == false && storyonly == false) || (item().story == true && storyonly == true)) ) {
                itemsButtons[i + j].item = inventory[i + itemOffset];
                if (game.inventory[item.name] > 1) itemsButtons[i + j].text = item().name + " x" + game.inventory[item.name];
                else itemsButtons[i + j].text = item().name;

                itemsButtons[i + j].fillTop = colors.buttontop;
                itemsButtons[i + j].fillBottom = colors.buttonbottom;
                itemsButtons[i + j].pressedTop = colors.buttontoppressed;
                itemsButtons[i + j].pressedBottom = colors.buttonbottompressed;
                itemsButtons[i + j].alpha = 1;

                itemsImages[i + j].alpha = 1;
                itemsImages[i + j].source = "items/" + item().source;
            }
            else {
                itemsButtons[i + j].text = "---";
                itemsButtons[i + j].fillTop = "lightgray";
                itemsButtons[i + j].fillBottom = "gray";
                itemsImages[i + j].alpha = 0;
                if (item().story != storyonly) j -= 1;
            }
        }
    }
    showItems();

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
            ...background, ...itemsButtons, ...itemsImages, ...theTop,
            blackFadeTransition
        ],
    }
}