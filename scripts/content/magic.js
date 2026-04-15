function getRandomSpell(charName, element, size) {
    // get a random spell of an element (or "any") and size (0 - 2), size meaning EP cost area
    // charName to check if you already have it, insert "any" to ignore it
    let possibleSpells = [];
    let minCost, maxCost;

    if (size == 0) {
        minCost = 0;
        maxCost = 8;
    }
    if (size == 1) {
        minCost = 9;
        maxCost = 19;
    }
    if (size == 2) {
        minCost = 20;
        maxCost = 99;
    }

    for (let m in magic) {
        if ((magic[m]().element == element || element == "any")
            && magic[m]().cost >= minCost && magic[m]().cost <= maxCost
            && (charName == "any" || !game.characters[charName].magic.includes(m))) {
            possibleSpells.push(m);
        }
    }

    //console.log(possibleSpells);
    return possibleSpells[Math.floor(possibleSpells.length * Math.random())];
}

function awardRandomSpell(charName, element, size) {
    let randomSpell = getRandomSpell(charName, element, size);

    if (randomSpell == undefined) return false;
    game.characters[charName].magic.push(randomSpell);
    addNotification("magic");
    return true;
}

function everySpell(who) {
    if (isDevMode()) {
        for (let spell in magic) {
            game.characters[who].magic.push(spell);
        }
    }
}