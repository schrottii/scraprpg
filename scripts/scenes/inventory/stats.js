scenes.stats = () => {
    let background = [];
    let stats = [];

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
        text: "X"
    }));
    background.push(controls.rect({
        anchor: [0.01, 0.1], sizeAnchor: [0.98, 0.01],
        alpha: 1,
        fill: colors.bottomcolor
    }));
    background.push(controls.label({
        anchor: [0.105, 0.06],
        text: "Stats",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));
    background.push(controls.label({ // 5
        anchor: [0.305, 0.06],
        text: "",
        align: "center", fontSize: 36, fill: "black",
        alpha: 1,
    }));

    let ss = 0;
    for (let s in game.stats) {
        stats.push(controls.label({
            anchor: [0.1 + 0.3 * Math.floor(ss * 0.05 + 0.2), 0.175 + ((ss * 0.05) % 0.8)],
            text: ["Play time", "Wrenches", "Bricks", "Tiles walked", "Times teleported", "Total fights", "Fights fled", "Fights lost", "Fights won", "Saves", "Auto saves", "Game opened", "Inventory opened", "NPCs talked to", "Items used", "Items dropped", "Items bought", "Items sold"][ss] + ": " + (ss == 0 ? getTime(game.stats[s]) : game.stats[s]),
            align: "left", fontSize: 24, fill: "black",
            alpha: 1,
        }));
        ss++;
    }

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {

        },
        // Controls
        controls: [
            ...background, ...stats
        ],
        name: "stats"
    }
}