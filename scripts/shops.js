var shops = {
    default: {
        name: "Name",
        dialogue: [],

        offers: [],
        limitedBuy: false,
        pawnShop: false,
    },
    placeholder : {
        name: "Yeeeaaaahhhh",
        dialogue: ["Welcome to my shop!", "This is actually just a placeholder text...", "But it works pretty well, doesn't it?", "Aw man, I appreciate you so much.", "I'm not a real merchant. I don't know how to sell stuff.", ["I'm actually a critic.", "Yes you are", { clp: 5, text: "Yeah man" }, "No lol", { clp: -5, text: "I hate you" }], "There is still a lot to do, huh? Not really. Some minor things. But there is already so much!"],

        offers: [{ item: "brickyleaf" }, { item: "superswamp", amount: 1, price: 1 }, { item: "potion", amount: 10, clv: 2 }],
        limitedBuy: "flower",
        pawnShop: true,
    },
};

for (s in shops) {
    shops[s].clv = 1;
    shops[s].clp = 0;
}