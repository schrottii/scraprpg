scenes.shop = () => {

    let bottomRects = [];
    let navigationButtons = [];
    let shopText = [];

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
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(500, true, () => setScene(scenes.inventory()));
        },
        text: "Buy",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.625], sizeAnchor: [0.32, 0.075],
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(500, true, () => setScene(scenes.inventory()));
        },
        text: "Sell",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.725], sizeAnchor: [0.32, 0.075],
        alpha: 1,
        onClick(args) {
            playSound("buttonClickSound");
            fadeOut(500, true, () => setScene(scenes.inventory()));
        },
        text: "Talk",
    }));
    navigationButtons.push(controls.button({
        anchor: [0.66, 0.825], sizeAnchor: [0.32, 0.075],
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
        shopText.push(controls.label({
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

            shopText[0].text = "This is a placeholder text!";
            shopText[1].text = "Soooo... what do you want to buy?";
            shopText[2].text = "Or maybe sell me some good super swamp?";

            shopPicTime += delta;
            if (shopPicTime > 499) {
                shopPicTime = 0;
                shopPic.source = (shopPic.source == "shopbg1") ? "shopbg2" : "shopbg1";
            }
        },
        // Controls
        controls: [
            ...bottomRects, ...navigationButtons, shopPic, wrenchDisplay, ...shopText
        ],
        name: "shop"
    }
}