function createBar(basename, x, y, w, h, colors) {
    createSquare(basename + ":bg", x, y, w, h,
        colors[0] ? colors[0] : "black", { alpha: 0 });
    createSquare(basename + ":empty", x + w * 0.01, y + h * 0.1, w * 0.98, h * 0.8,
        colors[1] ? colors[1] : "gray", { alpha: 0 });
    createSquare(basename + ":fill", x + w * 0.01, y + h * 0.1, w * 0.98, h * 0.8,
        colors[2] ? colors[2] : "white", { alpha: 0 });
    createSquare(basename + ":loss", x + w * 0.01, y + h * 0.1, w * 0.98, h * 0.8,
        colors[3] ? colors[3] : "red", { alpha: 0 });
    createText(basename + ":text", x + w * 0.99, y + h, "",
        { color: "white", align: "right", size: 20 });
}

function updateBar(basename, fillpct, text, visible) {
    // updates general state, animated loss is missing methinks
    objects[basename + ":fill"].w = objects[basename + ":bg"].w * 0.98 * fillpct;
    objects[basename + ":text"].text = text;

    objects[basename + ":bg"].alpha = objects[basename + ":empty"].alpha = objects[basename + ":fill"].alpha = objects[basename + ":text"].alpha = visible ? 1 : 0;
}

function createBarHP(basename, x, y, w, h) {
    createBar(basename, x, y, w, h,
        ["rgb(63, 127, 63)", "rgb(5, 51, 5)",
            "rgb(20, 204, 20)", "rgb(200, 204, 200)"]);
}

function createBarMANA(basename, x, y, w, h) {
    createBar(basename, x, y, w, h,
        ["rgb(30, 109, 30)", "rgb(51, 0, 51)",
            "rgb(205, 0, 205)", "rgb(255, 255, 255)"]);
}

function createBarEXP(basename, x, y, w, h) {
    createBar(basename, x, y, w, h,
        ["rgb(154, 154, 12)", "rgb(51, 0, 51)",
            "rgb(205, 205, 0)", "rgb(255, 255, 255)"]);
}

/*
function updateBar(charName, type, before, amount, max) {
    // used to update the fightStats (bottom), those HP and EP bars, you know
    // type 0 HP 1 EP
    // now automated --> updatePositions()

    // preparations
    if (amount < 0) amount = 0;
    if (fightStats.length < 1) return false; // we are not in a fight - do not render!

    let whichChar = characters.indexOf(charName);
    let which = (type == 0 ? 5 : 9) + (whichChar * amountFightStats);
    let row = Math.ceil((whichChar + 1) / 3); // 1 or 2

    let Leftend = 0.1960 * (Math.max(amount, 0) / max);
    let Length = (0.1960 * (before / max)) - Leftend;

    fightStats[which].alpha = 1;
    fightStats[which - 1].alpha = 1;
    if (amount > 0) fightStats[which - 1].sizeAnchor[0] = 0.1960 * (amount / max);
    fightStats[which].anchor[0] = 0.242 + Leftend + (0.35 * (row - 1));
    fightStats[which].sizeAnchor[0] = Length;
    addAnimator(function (t) {
        if (t > 200) {
            fightStats[which].sizeAnchor[0] = Length * Math.max(0.01, (1 - (Math.min((t - 199) * 1 / 600, 1))));
        }

        if (t > 800) {
            fightStats[which].alpha = 0;
            if (amount < 1) {
                fightStats[which - 1].alpha = 0;
                fightStats[which].alpha = 0;
            }
            return true;
        }
    });
}
*/