scenes.inventory = () => {
    let background = [];
    let buttons = [];

    let characters = [];
    let characterNames = [];
    let characterImages = [];

    // Background
    background.push(controls.rect({
        anchor: [0, 0], sizeAnchor: [1, 1],
        alpha: 1,
        fill: "brown"
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

    // Buttons on the right
    for (i = 0; i < 7; i++) {
        buttons.push(controls.button({
            anchor: [0.7, 0.075 + (i * 0.125)], sizeAnchor: [0.2, 0.085],
            alpha: 1,
            text: ["Items", "Magic", "Equipment", "Formation", "Save Manager", "Settings", "Exit Menu"][i],
            onClick(args) {
                setScene(scenes.game());
            }
        }));
    }

    // Characters
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 3; j++) {
            characterNames.push(controls.label({
                anchor: [0.06 + (0.3 * i), 0.08 + (0.3 * j)],
                align: "left", baseline: "alphabetic", fontSize: 32, fill: "black",
                text: "Bleu",
                alpha: 1,
            }));
            characterImages.push(controls.image({
                anchor: [0.05 + (0.3 * i), 0.275 + (0.3 * j)], sizeOffset: [64, 64], snip: [0, 0, 32, 32], offset: [0, -64],
                source: "bleu",
                alpha: 1,
            }));
            characters.push(controls.rect({
                anchor: [0.05 + (0.3 * i), 0.3 + (0.3 * j)], sizeOffset: [0, 5], sizeAnchor: [0.28, 0],
                fill: "black",
                alpha: 1,
            }));
        }
    }

    return {
        // Pre-render function
        preRender(ctx, delta) {
            for (i = 0; i < 6; i++) {
                characterNames[i].text = getPlayer(i + 1).name;
                characterImages[i].source = getPlayer(i + 1).name.toLowerCase();
            }
        },
        // Controls
        controls: [
            ...background, ...buttons, ...characters, ...characterNames, ...characterImages,
        ],
    }
}