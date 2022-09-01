scenes.formation = () => {

    var background = [];
    var positionGrid = [];
    var positions = [];
    var posInfos = [];
    var selectedPos = [8, 8];

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
        fill: "black"
    }));
    background.push(controls.rect({
        anchor: [0.05, 0.05], sizeAnchor: [0.9, 0.9],
        alpha: 1,
        fill: colors.buttontop
    }));
    background.push(controls.button({
        anchor: [0.9, 0.05], sizeAnchor: [0.05, 0.05],
        alpha: 1,
        onClick(args) {
            setScene(scenes.inventory());
        },
        text: ">",
        fill: "white"
    }));
    background.push(controls.rect({
        anchor: [0.05, 0.1], sizeAnchor: [0.9, 0.01],
        alpha: 1,
        fill: "black"
    }));
    background.push(controls.rect({
        anchor: [0.5, 0.15], sizeAnchor: [0.4, 0.75],
        alpha: 1,
        fill: "black"
    }));
    background.push(controls.rect({
        anchor: [0.52, 0.17], sizeAnchor: [0.36, 0.71],
        alpha: 1,
        fill: colors.buttontop
    }));

    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++) {
            positionGrid.push(controls.image({
                anchor: [0.075, 0.15], offset: [144 * i, 144 * j], sizeOffset: [128, 128],
                source: "grid",
                alpha: 1,
            }));
            positions.push(controls.image({
                anchor: [0.075, 0.15], offset: [144 * i, 144 * j], sizeOffset: [128, 128],
                snip: [0, 0, 32, 32],
                source: "gear",
                alpha: 0,
                pos1: i,
                pos2: j,
                onClick(args) {
                    if (selectedPos[0] == 8 && this.source != "gear") {
                        console.log(this.source);
                        selectedPos = [this.pos1, this.pos2];
                    }
                    else if (selectedPos[0] != 8 && (selectedPos[0] != this.pos1 || selectedPos[1] != this.pos2)) {
                        game.characters[positions[selectedPos[0] + 3 * selectedPos[1]].source].pos = [this.pos1, this.pos2];

                        this.source = positions[selectedPos[0] + 3 * selectedPos[1]].source
                        this.alpha = 1;

                        positions[selectedPos[0] + 3 * selectedPos[1]].source = "gear";
                        positions[selectedPos[0] + 3 * selectedPos[1]].alpha = 0;

                        selectedPos = [8, 8];
                    }
                },
                alpha: 0,
            }));
        }
    }

    for (i in game.characters) {
        console.log(i, game.characters[i].pos);
        positions[game.characters[i].pos[0] + 3 * game.characters[i].pos[1]].source = i;
        positions[game.characters[i].pos[0] + 3 * game.characters[i].pos[1]].alpha = 1;
    }

    for (i = 0; i < 3; i++) {
        posInfos.push(controls.label({
            anchor: [0.075, 0.15], offset: [72 + 144 * i, 144 * 3.25],
            fontSize: 32, fill: ["blue", "pink", "red"][i], align: "center",
            text: ["Back", "Mid", "Front"][i],
            alpha: 1,
        }));
    }

    for (i = 0; i < 3; i++) {
        posInfos.push(controls.label({
            anchor: [0.075, 0.15], offset: [0, 144 * (3.5 + (i / 4))],
            fontSize: 32, fill: ["blue", "pink", "red"][i], align: "left",
            text: ["Back: 0.67x STR, 1.33x DEF", "Mid: 1x STR, 1x DEF", "Front: 1.33x STR, 0.67x DEF"][i],
            alpha: 1,
        }));
    }

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
            ...background,
            ...positionGrid, ...positions, ...posInfos,
            blackFadeTransition
        ],
    }
}