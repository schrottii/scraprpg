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

    plainTownShop: new Shop("plainTownShop", "Plain Town Shop",
        ["Welcome to Plain Town...", "My shop currently has a lack of supplies.", "I can't sell you much, but uh", "You can buy the things we have"],
        [{ item: "potionverysmall", amount: 10 }, { item: "potion", amount: 10 }, { item: "energydrink" }, { item: "potionverysmall", amount: 10, clv: 2 }, { item: "potion", amount: 10, clv: 2 }],
        "potion", false
    ),
};