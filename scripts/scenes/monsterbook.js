scenes.monsterbook = () => {
    var background = [];
    var theTop = [];

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
        text: "Monster Book",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    // top stuff
    theTop.push(controls.label({
        anchor: [0.505, 0.06],
        text: "",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));
    theTop.push(controls.label({
        anchor: [0.705, 0.06],
        text: "",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            theTop[0].text = "Found: " + 0 + "/" + Object.keys(enemyTypes).length;
            theTop[1].text = "Boost: " + 0 + "% more Wrenches";
        },
        // Controls
        controls: [
            ...background, ...theTop
        ],
        name: "monsterbook"
    }
}