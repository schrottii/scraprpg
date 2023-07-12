var shopDialogueProgress = 0;
var shop;

function openShop(whichone) {
    shopDialogueProgress = 0;
    shop = shops[whichone];
    shop.loadShop();
    setScene(scenes.shop());
}

scenes.shop = () => {

    let bottomRects = [];
    let navigationButtons = [];
    let shopTextControls = [];
    let shopText = [];

    let itemsBackground = [];
    let itemsButtons = [];
    let itemsImages = [];
    let itemsOwnAmount = [];
    let itemsCosts = [];

    let mode = "buy";

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
    let shopPics = [
        // BACKGROUND
        controls.image({
            anchor: [0, 0], sizeAnchor: [1, 0.48],
            source: "shopbg", alpha: 1
        }),
        // CHARACTER
        controls.image({
            anchor: [0.5, 0.25], sizeOffset: [128, 128], offset: [-64, 0],
            source: "bleu", alpha: 1, snip: [0, 0, 32, 32]
        }),
        // TABLE
        controls.image({
            anchor: [0, 0], sizeAnchor: [1, 0.48],
            source: "shoptable", alpha: 1
        })
    ]
    let shopPicTime = 0;

    navigationButtons.push(controls.button({
        anchor: [0.66, 0.525], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                mode = "buy";
                hideItems();
                showItems();
            }
        },
        text: "Buy",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.625], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                mode = "sell";
                hideItems();
                showItems();
            }
        },
        text: "Sell",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.725], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                continueTalking();
            }
        },
        text: "Talk",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.825], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            if (this.alpha == 1) {
                playSound("buttonClickSound");
                shop.saveShop();
                saveGame();
                fadeOut(1000 / 3, true, () => setScene(scenes.game()));
            }
        },
        text: "Exit",
    }));

    function continueTalking() {
        if (shop.dialogue.length == 0) return false;
        if (shopDialogueProgress >= shop.dialogue.length) {
            shopDialogueProgress = 0;
        }
        let txt = shop.dialogue[shopDialogueProgress];
        if (typeof (txt) == "object") txt = txt[0];
        postShop(txt);
        shopDialogueProgress += 1;
    }

    let wrenchDisplay = controls.label({
        anchor: [0.82, 0.925],
        align: "center", fontSize: 32, fill: "black",
        text: "0", alpha: 1,
    });

    for (i = 0; i < 8; i++) {
        shopTextControls.push(controls.label({
            anchor: [0.05, 0.55], offset: [0, i * 40],
            align: "left", fontSize: 32, fill: "black",
            text: "", alpha: 1,
        }));
    }

    let shopTextButton1 = controls.button({
        anchor: [0.1, 0.55], sizeAnchor: [0.15, 0.075], offset: [0, 300],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            if (this.alpha == 1) shopTextButton(this.t, this.a);
        },
        text: "...",
    });
    let shopTextButton2 = controls.button({
        anchor: [0.35, 0.55], sizeAnchor: [0.15, 0.075], offset: [0, 300],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            if (this.alpha == 1) shopTextButton(this.t, this.a);
        },
        text: "...",
    });

    let clvText = controls.label({
        anchor: [0.5, 0.45],
        align: "center", fontSize: 32, fill: "white",
        text: "0", alpha: 1,
    });

    let typeText = controls.label({
        anchor: [0.82, 0.5],
        align: "center", fontSize: 32, fill: "white",
        text: "", alpha: 1,
    });

    let pawnIcon = controls.image({
        anchor: [0.645, 0.48], offset: [-16, 16],
        source: "pawn", alpha: 0,
    });

    function shopTextButton(t, a) {
        playSound("buttonClickSound");
        shop.clp += a;
        if (shop.clp < 0) shop.clp = 0;
        shop.clvUp();
        postShop(t);
        continueTalking();
    }

    function showItems() {
        let iback = 0;
        for (bg in itemsBackground) {
            itemsBackground[bg].alpha = 1;
        }
        if (mode == "buy") {
            for (i in itemsButtons) {
                if (itemsButtons[i].offer != "") {
                    itemsImages[i].source = "items/" + items[itemsButtons[i].offer]().source;
                    // v how many of it YOU have, not the shop
                    itemsOwnAmount[i].text = game.inventory[itemsButtons[i].offer] != undefined ? game.inventory[itemsButtons[i].offer] : "0";
                    itemsCosts[i].text = shop.getPrice(i) + "W";

                    if (itemsButtons[i].amount < 1000) itemsButtons[i].text = items[shop.offers[i].item]().name + " x" + itemsButtons[i].amount;
                    else itemsButtons[i].text = items[shop.offers[i].item]().name;

                    showButtons(i);
                }
            }
        }
        if (mode == "sell") {
            let item, am;
            for (ibt = 0; ibt < itemsButtons.length; ibt++) {
                item = Object.keys(game.inventory)[ibt + iback];
                am = game.inventory[item];

                if (item != undefined) {
                    if (items[item]().story) {
                        iback += 1;
                        ibt -= 1;
                        continue;
                    }
                    itemsImages[ibt].source = "items/" + items[item]().source;
                    itemsOwnAmount[ibt].text = am;
                    itemsCosts[ibt].text = shop.getSellPrice(item) + "W";

                    itemsButtons[ibt].text = items[item]().name + " x" + am;
                    itemsButtons[ibt].si = ibt + iback;

                    showButtons(ibt);
                }
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
            itemsCosts[i].alpha = 0;

            itemsButtons[i].fillTop = "lightgray";
            itemsButtons[i].fillBottom = "darkgray";
        }
    }

    function showButtons(i) {
        itemsButtons[i].fillTop = colors.buttontop;
        itemsButtons[i].fillBottom = colors.buttonbottom;
        itemsButtons[i].pressedTop = colors.buttontoppressed;
        itemsButtons[i].pressedBottom = colors.buttonbottompressed;

        itemsButtons[i].alpha = 1;
        itemsImages[i].alpha = 1;
        itemsOwnAmount[i].alpha = 1;
        itemsCosts[i].alpha = 1;
    }

    itemsBackground.push(controls.rect({
        anchor: [0.03, 0.13], sizeAnchor: [0.4, 0.75],
        fill: colors.buttontop, alpha: 0,
    }));
    itemsBackground.push(controls.rect({
        anchor: [0.07, 0.15], sizeAnchor: [0.34, 0.71],
        fill: colors.buttonbottom, alpha: 0,
    }));
    itemsBackground.push(controls.button({
        anchor: [0.03, 0.13], sizeAnchor: [0.04, 0.04],
        text: "X", fontSize: 20,
        alpha: 0,
        onClick(args) {
            hideItems();
        }
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

        itemsCosts.push(controls.label({
            anchor: [0.32, 0.205 + (0.1 * j)],
            align: "left", fontSize: 24, fill: "yellow",
            text: "0", alpha: 0,
        }));

        itemsButtons.push(controls.button({
            anchor: [0.155, 0.165 + (0.1 * j)], sizeAnchor: [0.15, 0.08],
            text: " ",
            idx: j,
            offer: "",
            amount: 999999999,
            fillTop: "lightgray", fillBottom: "gray",
            pressedTop: "darkgray", pressedBottom: "gray",
            alpha: 0,
            onClick(args) {
                if (this.alpha == 1) {
                    if (mode == "buy") {
                        if (this.fillTop == "lightgray" || this.offer == "") {
                            playSound("no");
                        }
                        else {
                            let item = items[this.offer]();

                            if (game.wrenches > shop.getPrice(this.idx) && this.amount > 0) {
                                addWrenches(shop.getPrice(this.idx) * -1);
                                addItem(this.offer, 1);
                                shop.increaseCLP(this.offer);
                                this.amount -= 1;
                                shop.offers[this.idx].amount -= 1;
                                if (this.amount < 1) {
                                    shop.offers[this.idx].oos = true; // out of stock
                                    this.offer = "";
                                }
                            }
                            //setButtons();
                            hideItems();
                            showItems();
                        }
                    }
                    if (mode == "sell") {
                        let item = Object.keys(game.inventory)[this.si];
                        if (shop.limitedBuy != false && items[item]().type != shop.limitedBuy && shop.pawnShop != true) {
                            playSound("no");
                            return false;
                        }
                        addWrenches(shop.getSellPrice(item));
                        shop.increaseCLP(item);
                        removeItem(item, 1);
                        setButtons();

                        // we're evil :)
                        let de = -1;

                        for (i in shop.offers) {
                            if (shop.offers[i].item == item) de = i;
                        }
                        if (de != -1) {
                            shop.offers[de].amount += 1;
                            shop.offers[de].clv = Math.max(shop.offers[de].clv, shop.clv);
                        }
                        else {
                            // does not exist yet
                            shop.offers.push({ item: item, amount: 1, clv: shop.clv });
                        }
                        setButtons();

                        //if (game.inventory[item] < 1) {
                        hideItems();
                        showItems();

                    }
                }
            }
        }));
    }

    function setButtons() {
        for (i in shop.offers) {
            let clvreq = shop.offers[i].clv == undefined ? true : shop.clv >= shop.offers[i].clv;
            if (itemsButtons[i] != undefined && !shop.offers[i].oos && clvreq) {
                itemsButtons[i].offer = shop.offers[i].item;
                if (shop.offers[i].amount != undefined) itemsButtons[i].amount = shop.offers[i].amount;
            }
        }
    }
    setButtons();

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            wrenchDisplay.text = formatNumber(game.wrenches) + "W";

            // Render talk texts
            for (st in shopTextControls) {
                shopTextControls[7 - st].text = shopText[shopText.length - st] != undefined ? shopText[shopText.length - st] : "";
            }

            if (shop.limitedBuy != false && typeText.text == "") {
                typeText.text = {
                    flower: "Flowers",
                    potion: "Potions",
                    armor: "Clothes",
                    electronic: "5 Watt devices"
                }[shop.limitedBuy]
            }

            if (shop.pawnShop == true) {
                pawnIcon.alpha = 1;
                navigationButtons[0].alpha = 0;
            }

            // Buttons
            let bc = shop.dialogue[shopDialogueProgress - 1];
            if (typeof (bc) == "object") {
                shopTextButton1.alpha = 1;
                shopTextButton1.text = bc[1];
                shopTextButton1.a = bc[2].clp;
                shopTextButton1.t = bc[2].text;
                if (shopText[shopDialogueProgress][3] != undefined) {
                    shopTextButton2.alpha = 1;
                    shopTextButton2.text = bc[3];
                    shopTextButton2.a = bc[4].clp;
                    shopTextButton2.t = bc[4].text;
                }
                else {
                    shopTextButton2.alpha = 0;
                }
                navigationButtons[2].alpha = 0;
            }
            else {
                shopTextButton1.alpha = 0;
                shopTextButton2.alpha = 0;
                navigationButtons[2].alpha = 1;
            }

            shopPicTime += delta;
            shopPics[1].snip[0] = 32 * (Math.floor(shopPicTime / 500) % 2);

            clvText.text = "Customer Level: " + shop.clv + " (" + shop.clp + "/" + (shop.clv * 100) + ")";
        },
        // Controls
        controls: [
            ...bottomRects, ...navigationButtons, ...shopPics, wrenchDisplay, ...shopTextControls, clvText, typeText, pawnIcon,
            ...itemsBackground, ...itemsButtons, ...itemsImages, ...itemsOwnAmount, ...itemsCosts,
            shopTextButton1, shopTextButton2
        ],
        name: "shop"
    }
}