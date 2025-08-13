scenes.itemscene = () => {
    var background = [];
    var itemsText = [];
    var itemsImages = [];
    var itemsButtons = [];
    var theTop = [];
    var pageButtons = [];
    var storyonly = false;

    var selectedItem = "";
    var selItem = [];
    var itemPage = 0;
    var characterSelected = "bleu";
    var useMode = "use";

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
        text: "X",
        fill: "white"
    }));
    background.push(controls.rect({ // horizontal 1
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vertical 1
        anchor: [0.2, 0.01], sizeAnchor: [0.005, 0.1],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.rect({ // vertical 2
        anchor: [0.4, 0.01], sizeAnchor: [0.005, 0.1],
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
        text: "Items",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    // The top
    /*
    R.I.P. cooking 2022-2025
    theTop.push(controls.rect({
        anchor: [0.05, 0.01], sizeAnchor: [0.15, 0.1],
        alpha: 0,
        onClick(args) {
            playSound("no");
            alert("Not available yet!");
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Start Cooking",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));
    */

    theTop.push(controls.rect({
        anchor: [0.25, 0.01], sizeAnchor: [0.15, 0.1],
        alpha: 0,
        onClick(args) {
            if (useMode == "use") useMode = "drop";
            else if (useMode == "drop") useMode = "dropall";
            else if (useMode == "dropall") useMode = "use";
            theTop[1].text = "Mode: " + useMode;
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.305, 0.06],
        text: "Mode: use",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.rect({
        anchor: [0.45, 0.01], sizeAnchor: [0.15, 0.1],
        alpha: 0,
        onClick(args) {
            playSound("buttonClickSound");
            if (storyonly == false) {
                storyonly = true;
                theTop[3].text = "Story Items";
            }
            else if (storyonly == true) {
                storyonly = false;
                theTop[3].text = "Normal Items";
            }
            showItems();
        },
        fill: "black"
    }));
    theTop.push(controls.label({
        anchor: [0.505, 0.06],
        text: "Normal Items",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    theTop.push(controls.rect({
        anchor: [0.65, 0.01], sizeAnchor: [0.15, 0.1],
        alpha: 0,
        onClick(args) {
            playSound("buttonClickSound");
            let i = game.chars.indexOf(characterSelected);

            if (game.chars[i + 1] != undefined) characterSelected = game.chars[i + 1];
            else characterSelected = game.chars[0];

            theTop[5].text = game.characters[characterSelected].name;
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
            if (itemPage + 1 < Object.keys(game.inventory).length / 32) {
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
        theTop[5].text = game.characters[globalSelectedCharacter].name;
        globalSelectedCharacter = "";
    }

    selItem.push(controls.label({
        anchor: [0.15, 0.15], offset: [0, -12],
        text: "",
        align: "left", fontSize: 24, fill: "black",
        alpha: 1,
    }));
    selItem.push(controls.label({
        anchor: [0.35, 0.15], offset: [0, -12],
        text: "",
        align: "left", fontSize: 20, fill: "black",
        alpha: 1,
    }));
    selItem.push(controls.button({
        anchor: [0.02, 0.11], sizeAnchor: [0.1, 0.06],
        text: "Use",
        alpha: 0,
        onClick(args) {
            if (this.alpha == 1) {
                if (selectedItem == "") {
                }
                else {
                    // already selected
                    useItem(selectedItem);
                    if (game.inventory[selectedItem] < 1 || game.inventory[selectedItem] == undefined){
                        selItem[0].alpha = 0;
                        selItem[1].alpha = 0;
                        this.alpha = 0;
                    }
                }
            }
        }
    }));

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
                        return false;
                    }

                    let item = this.item;

                    if (selectedItem == "" || selectedItem != item) {
                        // consent
                        selectedItem = item;
                        
                        selItem[0].text = items[item]().name;
                        selItem[1].text = items[item]().desc;
                        selItem[2].alpha = 1;
                    }
                    else {
                        // already selected
                        useItem(item);
                    }
                }
            }));
        }
    }

    function useItem(item){
        if (useMode == "drop") {
            // Drop 1
            map.items.push([game.position[0], game.position[1], item, 1, true]);
            removeItem(item, 1);
        }
        else if (useMode == "dropall") {
            // Drop All
            map.items.push([game.position[0], game.position[1], item, game.inventory[item], true]);
            removeItem(item, 9999);
        }
        else {
            // Use
            let itemOffset = itemPage * 12;

            if (items[item] != undefined) {
                if (items[item]().story != true && items[item]().type != "armor" && items[item]().battleonly != true) {
                    if (game.inventory[item] > 0) {
                        // use item
                        items[item]({ player: game.characters[characterSelected] }).effect();

                        questProgress("useItem", item);
                        removeItem(item, 1);
                    }
                }
            }
        }

        showItems();
    }

    function showItems() {
        // this basically generates the items
        let itemOffset = itemPage * 32;
        let inventory = Object.keys(game.inventory);

        for (i = 0; i < itemsButtons.length; i++) {
            itemsButtons[i].alpha = 1;
            if (inventory[i + itemOffset] == undefined) {
                itemsButtons[i].text = "---";
                itemsButtons[i].fillTop = "lightgray";
                itemsButtons[i].fillBottom = "gray";
                itemsImages[i].alpha = 0;
                continue;
            }
            let item = items[inventory[i + itemOffset]];

            if (game.inventory[item.name] > 0
                && ((item().story == false && storyonly == false) || (item().story == true && storyonly == true))) {
                // item exists, show it
                itemsButtons[i].item = inventory[i + itemOffset];
                if (game.inventory[item.name] > 1) itemsButtons[i].text = item().name + " x" + game.inventory[item.name];
                else itemsButtons[i].text = item().name;

                if (item().type != "armor" && item().battleonly != true){
                itemsButtons[i].fillTop = colors.buttontop;
                itemsButtons[i].fillBottom = colors.buttonbottom;
                itemsButtons[i].pressedTop = colors.buttontoppressed;
                itemsButtons[i].pressedBottom = colors.buttonbottompressed;
                }
                else {
                    itemsButtons[i].fillTop = "lightgray";
                    itemsButtons[i].fillBottom = "gray";
                }

                itemsButtons[i].alpha = 1;
                itemsImages[i].alpha = 1;
                itemsImages[i].source = "items/" + item().source;
            }
            else {
                itemsButtons[i].text = "---";
                itemsButtons[i].fillTop = "lightgray";
                itemsButtons[i].fillBottom = "gray";
                itemsImages[i].alpha = 0;
                //if (item().story != storyonly) j -= 1;
            }
        }
    }
    showItems();

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            background[7].text = "Items (" + Object.keys(game.inventory).length + "/" + (Object.keys(items).length - 1) + ")";
        },
        // Controls
        controls: [
            ...background, ...itemsButtons, ...itemsImages, ...theTop, ...pageButtons, ...selItem
        ],
        name: "itemscene"
    }
}