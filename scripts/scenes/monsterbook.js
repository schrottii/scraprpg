function calcMonsterbookBoost() {
    // in %
    return Object.keys(game.monsterbook).length * 2;
}

scenes.monsterbook = () => {
    var background = [];
    var theTop = [];
    var disgustingMonsters = [];

    var totalKills = 0;

    var snipAnim = 0;

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
        anchor: [0.305, 0.06],
        text: "",
        align: "center", fontSize: 20, fill: "black",
        alpha: 1,
    }));
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

    // calculate total kills
    for (let enm in game.monsterbook) {
        totalKills += game.monsterbook[enm];
    }

    // there is a monster in my bed
    let possibleEnm;
    let killedEnm;
    for (let ver = 0; ver < 5; ver++) {
        for (let hor = 0; hor < 10; hor++) {
            possibleEnm = Object.keys(enemyTypes)[hor + (ver * 10)] != undefined ? Object.keys(enemyTypes)[hor + (ver * 10)] : false;
            //console.log(hor + (ver * 10), possibleEnm);

            if (possibleEnm == false) continue; // enemy DOES NOT EXIST, do not render it all
            killedEnm = game.monsterbook[possibleEnm] != undefined ? game.monsterbook[possibleEnm] : -1; // visible once you killed at least 1 or used scan

            disgustingMonsters.push(controls.rect({
                anchor: [0.033 + 0.1 * hor, 0.2 + 0.15 * ver], sizeOffset: [128, 128], offset: [-32, -32],
                alpha: 1,
                fill: colors.bottomcolor
            }));
            disgustingMonsters.push(controls.rect({
                anchor: [0.033 + 0.1 * hor, 0.2 + 0.15 * ver], sizeOffset: [112, 112], offset: [-24, -24],
                alpha: 1,
                fill: killedEnm != -1 ? colors.buttontoppressed : colors.buttonbottompressed
            }));
            disgustingMonsters.push(controls.image({
                anchor: [0.033 + 0.1 * hor, 0.2 + 0.15 * ver], sizeOffset: [64, 64], enm: possibleEnm,
                snip: [0, 0, 32, 32],
                alpha: 1,//killedEnm != 0 ? 1 : 0,
                source: killedEnm != -1 ? "enemies/" + enemyTypes[possibleEnm].source : "enemies/black"
            }));

            disgustingMonsters.push(controls.label({
                anchor: [0.033 + 0.1 * hor, 0.175 + 0.15 * ver], offset: [32, 0],
                text: killedEnm != -1 ? enemyTypes[possibleEnm].name : "???",
                align: "center", fontSize: 12, fill: "black",
                alpha: 1, font: "DePixelHalbfett"
            }));
            disgustingMonsters.push(controls.label({
                anchor: [0.033 + 0.1 * hor, 0.225 + 0.15 * ver], offset: [32, 64],
                text: killedEnm != -1 ? killedEnm : "-",
                align: "center", fontSize: 16, fill: "black",
                alpha: 1
            }));
        }
    }

    fadeIn(1000 / 3, true);

    return {
        // Pre-render function
        preRender(ctx, delta) {
            theTop[0].text = "Found: " + Object.keys(game.monsterbook).length + "/" + Object.keys(enemyTypes).length;
            theTop[1].text = "Total Kills: " + totalKills;
            theTop[2].text = "Boost: " + calcMonsterbookBoost() + "% more Wrenches";

            // snip animations
            snipAnim += delta;
            for (let i = 2; i < disgustingMonsters.length; i += 5) {
                if (disgustingMonsters[i].snip != undefined) disgustingMonsters[i].snip[0] = 32 * (Math.floor(snipAnim / 1000) % 2);
            }
        },
        // Controls
        controls: [
            ...background, ...theTop, ...disgustingMonsters
        ],
        name: "monsterbook"
    }
}