function addItem(name, amount = 1) {
    if (game.inventory[name] == undefined) {
        addNotification("item");
        game.inventory[name] = 0;
    }
    if (game.inventory[name] >= items[name]().max) {
        return false;
    }
    if (game.inventory[name] + amount < items[name]().max) {
        game.inventory[name] += amount;
        return true;
    }
    else {
        game.inventory[name] = items[name]().max;
        return true;
    }
}

function removeItem(name, amount = 1, equip = false) {
    game.inventory[name] -= amount;
    if (!equip && (game.inventory[name] < 1 || game.inventory[name] == undefined)) {
        delete game.inventory[name];
    }
}

function hasItem(name) {
    if (game.inventory[name] != undefined) return true;
    return false;
}

function everyItem() {
    if (isDevMode()) {
        for (let item in items) {
            game.inventory[item] = items[item]().max;
        }
    }
}