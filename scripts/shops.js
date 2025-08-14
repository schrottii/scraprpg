// Shops and pawn shops

// Shop (and pawn shop) object
class Shop {
    constructor(id, displayName, dialogue, offers, limitedBuy, pawnShop) {
        // id - id used for saving. should be short
        this.id = id;

        // displayName - the name the player sees ingame
        this.displayName = displayName;

        // dialogue - Dialogue. Example:
        // ["Welcome to my shop!", "This is actually just a placeholder text...", "But it works pretty well, doesn't it?", "Aw man, I appreciate you so much.", "I'm not a real merchant. I don't know how to sell stuff.",
        // ["I'm actually a critic.", "Yes you are", { clp: 5, text: "Yeah man" }, "No lol", { clp: -5, text: "I hate you" }], "There is still a lot to do, huh? Not really. Some minor things. But there is already so much!"]
        this.dialogue = dialogue;

        // offers - what the shop sells.
        // example: [{ item: "brickyleaf" }, { item: "superswamp", amount: 1, price: 1 }, { item: "potion", amount: 10, clv: 2 }]
        // amount, how many it sells of that. clv, which level of the shop is needed
        this.offers = offers;

        // limitedBuy - if set to false, the shop does NOT buy YOUR shit. Set it to a type so it only buys that:
        // flower, potion, armor, electronic
        this.limitedBuy = limitedBuy;

        // pawnShop - if set to true, the shop is a pawnshop
        // PAWN SHOPS:
        // Normal shops only buy your shit if the shop also sells it - pawn shops buy your shit no matter what.
        // Selling an item refunds 50% as usual
        // Pawnshops do not sell shit
        this.pawnShop = pawnShop;

        // Customer level (basically the shop's level)
        this.clv = 1;

        // Customer points (XP for level ups)
        this.clp = 0;
    }


    // Function used to get the price to buy something
    getPrice(i) {
        if (this.offers[i].price != undefined) return this.offers[i].price;
        return items[this.offers[i].item]().shopcost;
    }

    // Function used to figure out how much I can sell this shit for
    getSellPrice(i) {
        return Math.ceil(items[i]().shopcost / 2);
    }

    // Increase this shop's clp after buying or selling an item
    increaseCLP(item) {
        // clpi - the increase from the item
        let clpi = items[item]().clpi;

        this.clp += Math.floor(Math.random() * clpi);
        this.clvUp();
    }

    // Increase clv if en ough clp
    clvUp() {
        if (this.clp >= this.clv * 100) {
            this.clp -= this.clv * 100;
            this.clv += 1;
        }
    }

    // Save shop to savefile
    saveShop() {
        game.shops[this.id] = [this.clv, this.clp];
    }

    // Load shop from savefile
    loadShop() {
        if (game.shops[this.id] != undefined) {
            this.clv = game.shops[this.id][0];
            this.clp = game.shops[this.id][1];
        }
    }
}


var shops = {
    placeholder: new Shop("test1", "Yeeeaaaahhhh",
        ["Welcome to my shop!", "This is actually just a placeholder text...", "But it works pretty well, doesn't it?", "Aw man, I appreciate you so much.", "I'm not a real merchant. I don't know how to sell stuff.", ["I'm actually a critic.", "Yes you are", { clp: 5, text: "Yeah man" }, "No lol", { clp: -5, text: "I hate you" }], "There is still a lot to do, huh? Not really. Some minor things. But there is already so much!"],
        [{ item: "brickyleaf" }, { item: "superswamp", amount: 1, price: 1 }, { item: "potion", amount: 10, clv: 2 }],
        "flower", false
    ),

    brickyTownShop: new Shop("brickyTownShop", "Bricky Town Shop",
        ["Welcome to my shop!", "Here you can spend your Wrenches from fights"],
        [{ item: "potionverysmall" }, { item: "potion", clv: 2 }, { item: "energydrink" }],
        "potion", false
    ),
};