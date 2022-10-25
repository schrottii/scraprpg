var shopDialogueProgress = 0;
var currentShopText = [];

scenes.shop = () => {

    let bottomRects = [];
    let navigationButtons = [];
    let shopTextControls = [];
    let shopText = [];

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
            fadeOut(500, true, () => setScene(scenes.inventory()));
        },
        text: "Buy",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.625], sizeAnchor: [0.32, 0.075],
        fillTop: "#ffc069",
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(500, true, () => setScene(scenes.inventory()));
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
        },
        // Controls
        controls: [
            ...bottomRects, ...navigationButtons, shopPic, wrenchDisplay, ...shopTextControls
        ],
        name: "shop"
    }
}