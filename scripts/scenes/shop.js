var shopDialogueProgress = 0;
var currentShopText = [];
var currentShop;

scenes.shop = () => {

    let bottomRects = [];
    let navigationButtons = [];
    let shopTextControls = [];
    let shopText = [];

    let itemsBackground = [];
    let itemsButtons = [];
    let itemsImages = [];
    let itemsOwnAmount = [];

    function postShop(text) {
        let maxLength = 48;
        let tempText = "";
        let superTempText = "";

        for (i = 0; i < text.length; i++) {
            superTempText = superTempText + text[i];
            if (text[i] == " ") {
                tempText = tempText + superTempText;
                superTempText = "";
            }
            if (superTempText.length + tempText.length > maxLength) {
                if (tempText == "") {
                    tempText = tempText + superTempText;
                    superTempText = "";
                }
                else {
                    shopText.push(tempText);
                    tempText = "";
                }
            }
        }
        shopText.push(tempText + superTempText);
    }

    bottomRects.push(controls.rect({
        anchor: [0.0, 0.48], sizeAnchor: [1, 0.52],
        fill: colors.buttontop, alpha: 1,
    }));
    bottomRects.push(controls.rect({
        anchor: [0.02, 0.5], sizeAnchor: [0.96, 0.48],
        fill: colors.buttonbottom, alpha: 1,
    }));
    bottomRects.push(controls.rect({
        anchor: [0.63, 0.48], sizeAnchor: [0.03, 0.52],
        fill: colors.buttontop, alpha: 1,
    }));

    let shopPic = controls.image({
        anchor: [0, 0], sizeAnchor: [1, 0.48],
        source: "shopbg1", alpha: 1,
    });
    let shopPicTime = 0;

    navigationButtons.push(controls.button({
        anchor: [0.66, 0.525], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            showItems();
        },
        text: "Buy",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.625], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            hideItems();
        },
        text: "Sell",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.725], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            if (currentShopText.length == 0) return false;
            if (currentShopText[shopDialogueProgress] == undefined) shopDialogueProgress = 0;
            postShop(currentShopText[shopDialogueProgress]);
            shopDialogueProgress += 1;
        },
        text: "Talk",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.825], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(500, true, () => setScene(scenes.game()));
        },
        text: "Exit",
    }));

    let wrenchDisplay = controls.label({
        anchor: [0.82, 0.925],
        align: "center", fontSize: 32, fill: "black",
        text: "0", alpha: 1,
    });

    for (i = 0; i < 10; i++) {
        shopTextControls.push(controls.label({
            anchor: [0.05, 0.55], offset: [0, i * 40],
            align: "left", fontSize: 32, fill: "black",
            text: "", alpha: 1,
        }));
    }

    let clvText = controls.label({
        anchor: [0.5, 0.45],
        align: "center", fontSize: 32, fill: "white",
        text: "0", alpha: 1,
    });

    function showItems() {
        for (bg in itemsBackground) {
            itemsBackground[bg].alpha = 1;
        }
        for (i in itemsButtons) {
            if (itemsButtons[i].offer != "") {
                itemsImages[i].source = "items/" + items[itemsButtons[i].offer]().source;
                itemsOwnAmount[i].text = game.inventory[itemsButtons[i].offer];

                itemsButtons[i].fillTop = colors.buttontop;
                itemsButtons[i].fillBottom = colors.buttonbottom;
                itemsButtons[i].pressedTop = colors.buttontoppressed;
                itemsButtons[i].pressedBottom = colors.buttonbottompressed;

                itemsButtons[i].alpha = 1;
                itemsImages[i].alpha = 1;
                itemsOwnAmount[i].alpha = 1;
            }
        }
    }

    function hideItems() {
        for (bg in itemsBackground) {
            itemsBackground[bg].alpha = 0;
        }
        for (i in itemsButtons) {
            itemsButtons[i].alpha = 0;
            itemsImages[i].alpha = 0;
            itemsOwnAmount[i].alpha = 0;

            itemsButtons[i].fillTop = "lightgray";
            itemsButtons[i].fillBottom = "darkgray";
        }
    }

    itemsBackground.push(controls.rect({
        anchor: [0.05, 0.13], sizeAnchor: [0.3, 0.52],
        fill: colors.buttontop, alpha: 0,
    }));
    itemsBackground.push(controls.rect({
        anchor: [0.07, 0.15], sizeAnchor: [0.26, 0.48],
        fill: colors.buttonbottom, alpha: 0,
    }));

    for (j = 0; j < 8; j++) {
        itemsImages.push(controls.image({
            anchor: [0.09, 0.205 + (0.1 * j)], sizeOffset: [64, 64], offset: [0, -32],
            source: "gear",
            alpha: 0
        }));

        itemsOwnAmount.push(controls.label({
            anchor: [0.07, 0.205 + (0.1 * j)],
            align: "right", fontSize: 24, fill: "black",
            text: "0", alpha: 0,
        }));

        itemsButtons.push(controls.button({
            anchor: [0.155, 0.165 + (0.1 * j)], sizeAnchor: [0.15, 0.08],
            text: " ",
            idx: j,
            offer: "",
            fillTop: "lightgray", fillBottom: "gray",
            pressedTop: "darkgray", pressedBottom: "gray",
            alpha: 0,
            onClick(args) {
                if (this.fillTop == "lightgray") {
                    playSound("no");
                }
                else {
                    let item = items[this.offer]();

                    if (game.wrenches > item.shopcost) {
                        game.wrenches -= item.shopcost;
                        addItem(this.offer, 1);
                    }
                    showItems();
                }
            }
        }));
    }

    for (i in currentShop.offers) {
        if (itemsButtons[i] != undefined) {
            itemsButtons[i].text = items[currentShop.offers[i][0]]().name;
            itemsButtons[i].offer = currentShop.offers[i][0];
        }
    }

    fadeIn(500, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            wrenchDisplay.text = formatNumber(game.wrenches) + "W";

            for (st in shopTextControls) {
                shopTextControls[9 - st].text = shopText[shopText.length - 1 - st] != undefined ? shopText[shopText.length - 1 - st] : "";
            }

            shopPicTime += delta;
            if (shopPicTime > 499) {
                shopPicTime = 0;
                shopPic.source = (shopPic.source == "shopbg1") ? "shopbg2" : "shopbg1";
            }

            clvText.text = "Customer Level: " + currentShop.clv;
        },
        // Controls
        controls: [
            ...bottomRects, ...navigationButtons, shopPic, wrenchDisplay, ...shopTextControls, clvText,
            ...itemsBackground, ...itemsButtons, ...itemsImages, ...itemsOwnAmount
        ],
        name: "shop"
    }
}